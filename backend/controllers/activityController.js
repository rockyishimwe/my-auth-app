const Activity = require('../models/activityModel');
const { successResponse, paginatedResponse } = require('../utils/response');

/**
 * @route   GET /api/activity
 * @access  Private
 * @desc    Get user activity (last 20)
 */
const getActivity = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalActivities = await Activity.countDocuments({ user: req.user._id });
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('goalId', 'title');

    return res.status(200).json(
      paginatedResponse(activities, {
        total: totalActivities,
        page: parseInt(page),
        pages: Math.ceil(totalActivities / parseInt(limit)),
        limit: parseInt(limit)
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivity };
