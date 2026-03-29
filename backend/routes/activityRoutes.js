const express = require('express');
const router = express.Router();
const { getActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Get user activity
router.get('/', getActivity);

module.exports = router;
