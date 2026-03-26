const path = require('path');

/**
 * Get port from environment or default to 8000
 */
const getPort = () => {
  return process.env.PORT || 8000;
};

/**
 * Get MongoDB URI from environment
 */
const getMongoURI = () => {
  return process.env.MONGO_URI || 'mongodb://localhost:27017/goalos';
};

/**
 * Get client URL from environment
 */
const getClientURL = () => {
  return process.env.CLIENT_URL || 'http://localhost:3000';
};

/**
 * Get JWT expiration from environment
 */
const getJWTExpiration = () => {
  return process.env.JWT_EXPIRES_IN || '30d';
};

/**
 * Check if running in production
 */
const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Static files configuration for production
 */
const getStaticConfig = () => {
  if (isProduction()) {
    return {
      root: path.join(__dirname, '../client/dist'),
      maxAge: '1y', // Cache static files for 1 year
      setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
    };
  }
  
  return {};
};

/**
 * Catch-all handler for SPA routing in production
 */
const getSPAHandler = () => {
  if (isProduction()) {
    return (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      }
    };
  }
  
  return null;
};

module.exports = {
  getPort,
  getMongoURI,
  getClientURL,
  getJWTExpiration,
  isProduction,
  getStaticConfig,
  getSPAHandler
};
