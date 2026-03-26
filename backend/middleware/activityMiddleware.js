const Activity = require('../models/activityModel');

/**
 * Middleware to track user activities
 */
const trackActivity = (type, goalId = null, meta = {}) => {
  return async (req, res, next) => {
    try {
      // Only track activities for authenticated users
      if (req.user) {
        await Activity.create({
          user: req.user.id,
          type,
          goalId,
          meta
        });
      }
      
      next();
    } catch (error) {
      console.error('Activity tracking error:', error);
      next();
    }
  };
};

module.exports = { trackActivity };
