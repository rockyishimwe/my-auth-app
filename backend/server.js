const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

// Import configurations
const corsOptions = require('./config/cors');
const { globalLimiter, authLimiter } = require('./config/rateLimit');
const { createLogger } = require('./config/logger');
const { errorHandler } = require('./utils/errorHandler');
const { createIndexes } = require('./config/indexes');

// Import routes
const userRoutes = require('./routes/userRoutes');
const goalRoutes = require('./routes/goalRoutes');
const activityRoutes = require('./routes/activityRoutes');

// Import middleware
const { protect } = require('./middleware/authMiddleware');

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors(corsOptions));

// Rate limiting
app.use(globalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(createLogger());

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', port: process.env.PORT });
});

app.use('/api/users', authLimiter, userRoutes);
app.use('/api/goals', protect, goalRoutes);
app.use('/api/activity', protect, activityRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create database indexes
    await createIndexes();

    // Start server with error handling
    const PORT = process.env.PORT || 8000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is busy. Try: kill -9 $(lsof -ti:${PORT})`);
        console.error('Or use a different port by setting PORT environment variable');
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => server.close());
    process.on('SIGINT', () => server.close());
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();

module.exports = app;
