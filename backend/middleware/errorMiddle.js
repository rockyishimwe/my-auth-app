// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.details?.map(d => d.message) || [err.message]
    })
  }

  // Mongoose bad ObjectId (Fixed: check err.name, not err.message)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Email already registered'
    })
  }

  // Default error
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}

module.exports = {
  errorHandler
}
