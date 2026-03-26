const morgan = require('morgan');

/**
 * Create morgan middleware based on environment
 */
const createLogger = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production: combined format (no sensitive data)
    return morgan('combined');
  } else {
    // Development: dev format (verbose with colors)
    return morgan('dev');
  }
};

/**
 * Log error function
 */
const logError = (err, req = null) => {
  if (process.env.NODE_ENV === 'production') {
    console.error('Error:', {
      message: err.message,
      statusCode: err.statusCode,
      timestamp: new Date().toISOString(),
      ...(req && { 
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      })
    });
  } else {
    // Development: include stack trace
    console.error('Error:', {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
      timestamp: new Date().toISOString(),
      ...(req && { 
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      })
    });
  }
};

module.exports = {
  createLogger,
  logError
};
