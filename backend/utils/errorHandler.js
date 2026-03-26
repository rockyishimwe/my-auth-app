/**
 * Custom Error class for operational errors
 */
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

/**
 * Centralized error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.statusCode = error.statusCode || 500;

  // Log error for debugging
  console.error(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      statusCode: 400,
      message,
      isOperational: true
    };
  }

  // Mongoose duplicate key error
  if (err.code && err.code === 11000) {
    const message = 'Duplicate field value';
    error = {
      statusCode: 400,
      message,
      isOperational: true
    };
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    const message = 'Invalid data format';
    error = {
      statusCode: 400,
      message,
      isOperational: true
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    let message = 'Invalid token';
    if (err.message === 'jwt expired') {
      message = 'Token expired';
    }
    error = {
      statusCode: 401,
      message,
      isOperational: true
    };
  }

  // Default to 500 server error
  if (!error.isOperational) {
    error.statusCode = 500;
    error.message = process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message || 'Internal Server Error';
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  AppError,
  errorHandler
};
