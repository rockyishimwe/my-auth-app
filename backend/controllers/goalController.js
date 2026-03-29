const Goal = require('../models/goalModel');
const Activity = require('../models/activityModel');
const { successResponse, paginatedResponse } = require('../utils/response');
const { createGoalSchema, updateGoalSchema, updateProgressSchema, updateStatusSchema, addMilestoneSchema, addNoteSchema } = require('../validations/goalValidations');
const { recalculateProgressFromMilestones } = require('../utils/goalLogic');

/**
 * @route   GET /api/goals
 * @access  Private
 * @desc    Get all goals with filtering and pagination
 */
const getGoals = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, context, status, priority, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = { user: req.user._id };
    if (context) filter.context = context;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Search in title, description, and tags
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await Goal.countDocuments(filter);
    const goals = await Goal.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json(
      paginatedResponse(goals, {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/goals/:id
 * @access  Private
 */
const getGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    return res.status(200).json(successResponse(goal));
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/goals
 * @access  Private
 */
const createGoal = async (req, res, next) => {
  try {
    const { error, value } = createGoalSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        errors: [error.details[0].message]
      });
    }

    const goal = await Goal.create({
      ...value,
      user: req.user._id
    });

    // Log activity
    await Activity.create({
      user: req.user._id,
      type: 'goal_created',
      goalId: goal._id,
      meta: {}
    });

    return res.status(201).json(
      successResponse(goal, 'Goal created successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/goals/:id
 * @access  Private
 */
const updateGoal = async (req, res, next) => {
  try {
    const { error, value } = updateGoalSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        errors: [error.details[0].message]
      });
    }

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Track changes
    const oldValues = {};
    Object.keys(value).forEach(key => {
      if (goal[key] !== value[key]) {
        oldValues[key] = goal[key];
      }
    });

    // Update fields
    Object.assign(goal, value);
    await goal.save();

    // Log activity
    if (Object.keys(oldValues).length > 0) {
      await Activity.create({
        user: req.user._id,
        type: 'goal_updated',
        goalId: goal._id,
        meta: { changes: oldValues }
      });
    }

    return res.status(200).json(
      successResponse(goal, 'Goal updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    await Goal.findByIdAndDelete(req.params.id);

    // Delete all related activities
    await Activity.deleteMany({ goalId: req.params.id });

    // Log activity
    await Activity.create({
      user: req.user._id,
      type: 'goal_deleted',
      goalId: req.params.id,
      meta: { title: goal.title }
    });

    return res.status(200).json(
      successResponse({ id: req.params.id }, 'Goal deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/goals/:id/progress
 * @access  Private
 */
const updateProgress = async (req, res, next) => {
  try {
    const { error, value } = updateProgressSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        errors: [error.details[0].message]
      });
    }

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const oldProgress = goal.progress;
    goal.progress = value.progress;
    await goal.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      type: 'progress_updated',
      goalId: goal._id,
      meta: { oldProgress, newProgress: value.progress }
    });

    return res.status(200).json(
      successResponse(goal, 'Progress updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/goals/:id/status
 * @access  Private
 */
const updateStatus = async (req, res, next) => {
  try {
    const { error, value } = updateStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        errors: [error.details[0].message]
      });
    }

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const oldStatus = goal.status;
    goal.status = value.status;
    await goal.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      type: 'status_changed',
      goalId: goal._id,
      meta: { oldStatus, newStatus: value.status }
    });

    // If completed, log a goal_completed activity too
    if (value.status === 'completed' && oldStatus !== 'completed') {
      await Activity.create({
        user: req.user._id,
        type: 'goal_completed',
        goalId: goal._id,
        meta: {}
      });
    }

    return res.status(200).json(
      successResponse(goal, 'Status updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/goals/:id/milestones
 * @access  Private
 */
const addMilestone = async (req, res, next) => {
  try {
    const { error, value } = addMilestoneSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        errors: [error.details[0].message]
      });
    }

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    if (!goal.milestones) goal.milestones = [];
    if (goal.milestones.length >= 20) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 20 milestones allowed',
        errors: ['Too many milestones']
      });
    }

    goal.milestones.push({
      text: value.text.trim(),
      completed: false
    });

    await goal.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      type: 'milestone_completed',
      goalId: goal._id,
      meta: { milestoneText: value.text }
    });

    return res.status(201).json(
      successResponse(goal, 'Milestone added successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/goals/:id/milestones/:milestoneId
 * @access  Private
 */
const toggleMilestone = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const milestone = goal.milestones?.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    milestone.completed = !milestone.completed;
    if (milestone.completed) {
      milestone.completedAt = new Date();
    } else {
      milestone.completedAt = undefined;
    }

    // Recalculate progress
    goal.progress = recalculateProgressFromMilestones(goal);
    await goal.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      type: 'milestone_completed',
      goalId: goal._id,
      meta: { milestoneText: milestone.text, completed: milestone.completed }
    });

    return res.status(200).json(
      successResponse(goal, 'Milestone toggled successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/goals/:id/milestones/:milestoneId
 * @access  Private
 */
const deleteMilestone = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const milestone = goal.milestones?.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    goal.milestones.id(req.params.milestoneId).deleteOne();
    
    // Recalculate progress
    goal.progress = recalculateProgressFromMilestones(goal);
    await goal.save();

    return res.status(200).json(
      successResponse(goal, 'Milestone deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/goals/:id/notes
 * @access  Private
 */
const addNote = async (req, res, next) => {
  try {
    const { error, value } = addNoteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        errors: [error.details[0].message]
      });
    }

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    if (!goal.notes) goal.notes = [];

    goal.notes.push({
      text: value.text.trim(),
      createdAt: new Date()
    });

    await goal.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      type: 'note_added',
      goalId: goal._id,
      meta: { noteText: value.text }
    });

    return res.status(201).json(
      successResponse(goal, 'Note added successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/goals/:id/notes/:noteId
 * @access  Private
 */
const deleteNote = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const note = goal.notes?.id(req.params.noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    goal.notes.id(req.params.noteId).deleteOne();
    await goal.save();

    return res.status(200).json(
      successResponse(goal, 'Note deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/goals/stats
 * @access  Private
 */
const getStats = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id });

    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const activeGoals = goals.filter(g => g.status === 'active').length;
    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // By context
    const byContext = {};
    ['work', 'health', 'finance', 'education', 'personal', 'relationships', 'creativity', 'travel'].forEach(ctx => {
      byContext[ctx] = goals.filter(g => g.context === ctx).length;
    });

    // By priority
    const byPriority = {
      low: goals.filter(g => g.priority === 'low').length,
      medium: goals.filter(g => g.priority === 'medium').length,
      high: goals.filter(g => g.priority === 'high').length,
      critical: goals.filter(g => g.priority === 'critical').length
    };

    // By status
    const byStatus = {
      active: goals.filter(g => g.status === 'active').length,
      'in-progress': goals.filter(g => g.status === 'in-progress').length,
      completed: goals.filter(g => g.status === 'completed').length,
      archived: goals.filter(g => g.status === 'archived').length
    };

    // Due this week
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dueThisWeek = goals.filter(g => 
      g.dueDate && 
      new Date(g.dueDate) >= now && 
      new Date(g.dueDate) <= weekFromNow &&
      !['completed', 'archived'].includes(g.status)
    ).length;

    // Streak calculation
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(1000);

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const dayActivities = activities.filter(a => {
        const actDate = new Date(a.createdAt);
        actDate.setHours(0, 0, 0, 0);
        return actDate.getTime() === currentDate.getTime();
      });

      if (dayActivities.length === 0) break;
      streak++;
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    }

    const stats = {
      totalGoals,
      activeGoals,
      completedGoals,
      completionRate,
      byContext,
      byPriority,
      byStatus,
      dueThisWeek,
      streak
    };

    return res.status(200).json(successResponse(stats));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  updateProgress,
  updateStatus,
  addMilestone,
  toggleMilestone,
  deleteMilestone,
  addNote,
  deleteNote,
  getStats
};
