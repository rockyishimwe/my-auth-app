const express = require('express');
const router = express.Router();
const goalValidation = require('../validations/goalValidations');
const validate = require('../middleware/validate');

const {
  getGoals,
  setGoals,
  updateGoals,
  deleteGoals,
} = require('../controllers/goalController');

const { protect } = require('../middleware/authMiddleware');

// Routes
router.get('/', protect, getGoals);
router.post('/', protect, validate(goalValidation), setGoals);

router.put('/:id', protect, validate(goalValidation), updateGoals);
router.delete('/:id', protect, deleteGoals);

module.exports = router;
