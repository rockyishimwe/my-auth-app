const express = require('express');
const router = express.Router();
const Activity = require('../models/activityModel');
const { successResponse, errorResponse } = require('../utils/response');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get activity feed for current user
// @route   GET /api/activity
// @access   Private
router.get('/', protect, async (req, res, next) => {
  try {
    const activities = await Activity.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('goalId', 'title');

    res.json(successResponse(activities));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
