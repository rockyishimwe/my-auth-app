const path = require('path');
const express = require('express');
const colors = require('colors');
require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

const port = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve Swagger UI (static files if you have them)
app.use('/api-docs', express.static(path.join(__dirname, 'swagger-ui')));

// Routes
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handler (must be after routes)
app.use(errorHandler);

// Connect to database and start server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`.yellow.bold);
    });
  })
  .catch((err) => {
    console.error(`Failed to connect to DB: ${err.message}`);
    process.exit(1);
  });
