const asyncHandler = require('express-async-handler');
const Goal = require('../model/goalModel');

// @desc    Get all goals
// @route   GET /api/goals
// @access  Private
const getGoals = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not authorized");
  }
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json(goals);
});

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
const setGoals = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Please add a text field');
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  });

  res.status(201).json(goal);
});

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoals = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not authorized");
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User not authorized to update this goal");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedGoal);
});

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoals = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not authorized");
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('User not authorized to delete this goal');
  }

  await Goal.findByIdAndDelete(req.params.id);

  res.status(200).json({ id: req.params.id, message: 'Goal deleted successfully' });
});

module.exports = {
  getGoals,
  setGoals,
  updateGoals,
  deleteGoals,
};
