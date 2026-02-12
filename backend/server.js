const path = require('path')
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')

// Connect to database
connectDB()

const port = process.env.PORT || 8000
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Serve Swagger UI
app.use('/api-docs', express.static(path.join(__dirname, 'swagger-ui')))

// Routes
app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

// Error handler (must be after routes)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server started on port ${port}`.yellow.bold)
})
