const express = require('express');
const router = express.Router();
const Goal = require('../models/goalModel');
const Activity = require('../models/activityModel');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all goals for current user
// @route   GET /api/goals
// @access   Private
router.get('/', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { user: req.user.id };
    
    // Add context filter
    if (req.query.context) {
      filter.context = req.query.context;
    }
    
    // Add status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Add priority filter
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    
    // Add due date range filter
    if (req.query.dueFrom || req.query.dueTo) {
      filter.dueDate = {};
      if (req.query.dueFrom) filter.dueDate.$gte = new Date(req.query.dueFrom);
      if (req.query.dueTo) filter.dueDate.$lte = new Date(req.query.dueTo);
    }
    
    // Add search filter
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    const total = await Goal.countDocuments(filter);
    const goals = await Goal.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    res.json(paginatedResponse(goals, { total, page, pages, limit }));
  } catch (error) {
    next(error);
  }
});

// @desc    Create new goal
// @route   POST /api/goals
// @access   Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, description, context, priority, dueDate, tags } = req.body;
    
    // Trim and process tags
    const processedTags = tags 
      ? tags.map(tag => tag.toLowerCase().trim()).filter((tag, index, arr) => arr.indexOf(tag) === index)
      : [];

    const goalData = {
      title: title.trim(),
      description: description ? description.trim() : undefined,
      context,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags: processedTags,
      user: req.user.id
    };

    const goal = await Goal.create(goalData);

    // Create activity record
    await Activity.create({
      user: req.user.id,
      type: 'goal_created',
      goalId: goal._id,
      meta: { title: goal.title }
    });

    res.status(201).json(successResponse(goal, 'Goal created successfully'));
  } catch (error) {
    next(error);
  }
});

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access   Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json(errorResponse('Goal not found'));
    }

    res.json(successResponse(goal));
  } catch (error) {
    next(error);
  }
});

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access   Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json(errorResponse('Goal not found'));
    }

    const { title, description, context, priority, dueDate, tags } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (context !== undefined) updateData.context = context;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : undefined;
    if (tags !== undefined) {
      updateData.tags = tags.map(tag => tag.toLowerCase().trim()).filter((tag, index, arr) => arr.indexOf(tag) === index);
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Create activity record
    await Activity.create({
      user: req.user.id,
      type: 'goal_updated',
      goalId: req.params.id,
      meta: { oldTitle: goal.title, newTitle: title || goal.title }
    });

    res.json(successResponse(updatedGoal, 'Goal updated successfully'));
  } catch (error) {
    next(error);
  }
});

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access   Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json(errorResponse('Goal not found'));
    }

    await Goal.findByIdAndDelete(req.params.id);

    // Delete all related activity records
    await Activity.deleteMany({ goalId: req.params.id });

    // Create activity record
    await Activity.create({
      user: req.user.id,
      type: 'goal_deleted',
      goalId: req.params.id,
      meta: { title: goal.title }
    });

    res.json(successResponse({ id: req.params.id }, 'Goal deleted successfully'));
  } catch (error) {
    next(error);
  }
});

// @desc    Update goal progress
// @route   PUT /api/goals/:id/progress
// @access   Private
router.put('/:id/progress', protect, async (req, res, next) => {
  try {
    const { progress } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json(errorResponse('Goal not found'));
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { progress },
      { new: true }
    );

    // Create activity record
    await Activity.create({
      user: req.user.id,
      type: 'progress_updated',
      goalId: req.params.id,
      meta: { oldProgress: goal.progress, newProgress: progress }
    });

    res.json(successResponse(updatedGoal, 'Progress updated successfully'));
  } catch (error) {
    next(error);
  }
});

// @desc    Update goal status
// @route   PUT /api/goals/:id/status
// @access   Private
router.put('/:id/status', protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json(errorResponse('Goal not found'));
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // Create activity record
    await Activity.create({
      user: req.user.id,
      type: 'status_changed',
      goalId: req.params.id,
      meta: { oldStatus: goal.status, newStatus: status }
    });

    res.json(successResponse(updatedGoal, 'Status updated successfully'));
  } catch (error) {
    next(error);
  }
});

// @desc    Add milestone to goal
// @route   POST /api/goals/:id/milestones
// @access   Private
router.post('/:id/milestones', protect, async (req, res, next) => {
  try {
    const { text } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json(errorResponse('Goal not found'));
    }

    if (goal.milestones.length >= 20) {
      return res.status(400).json(errorResponse('Maximum 20 milestones allowed'));
    }

    const milestone = { text: text.trim(), completed: false };
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $push: { milestones: milestone } },
      { new: true }
    );

    // Recalculate progress if goal has milestones
    if (goal.milestones.length > 0) {
      const completedCount = [...goal.milestones, milestone].filter(m => m.completed).length + 1;
      const totalCount = goal.milestones.length + 1;
      const newProgress = Math.round((completedCount / totalCount) * 100);
      
      await Goal.findByIdAndUpdate(req.params.id, { progress: newProgress });
    }

    // Create activity record
    await Activity.create({
      user: req.user.id,
      type: 'milestone_completed',
      goalId: req.params.id,
      meta: { milestoneText: text }
    });

    res.status(201).json(successResponse(milestone, 'Milestone added successfully'));
  } catch (error) {
    next(error);
  }
});

// @desc    Toggle milestone completion
// @route   PUT /api/goals/:id/milestones/:milestoneId
// @access   Private
router.put('/:id/milestones/:milestoneId', protect, async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json(errorResponse('Goal not found'));
    }

    const milestoneIndex = goal.milestones.findIndex(m => m._id.toString() === req.params.milestoneId);
    if (milestoneIndex === -1) {
      return res.status(404).json(errorResponse('Milestone not found'));
    }

    const milestonePath = `milestones.${milestoneIndex}.completed`;
    const isCompleted = goal.milestones[milestoneIndex].completed;
    
    const updateData = {
      [milestonePath]: !isCompleted,
      [`milestones.${milestoneIndex}.completedAt`]: !isCompleted ? new Date() : undefined
    };

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, updateData, { new: true });

    // Recalculate progress
    const completedCount = goal.milestones.filter(m => m.completed).length + (!isCompleted ? 1 : -1);
    const newProgress = Math.round((completedCount / goal.milestones.length) * 100);
    
    await Goal.findByIdAndUpdate(req.params.id, { progress: newProgress });

    // Create activity record
    await Activity.create({
      user: req.user.id,
      type: 'milestone_completed',
      goalId: req.params.id,
      meta: { milestoneText: goal.milestones[milestoneIndex].text }
    });

    res.json(successResponse(updatedGoal, 'Milestone updated successfully'));
  } catch (error) {
    next(error);
  }
});

// @desc    Delete milestone
// @route   DELETE /api/goals/:id/milestones/:milestoneId
// @access   Private
router.delete('/:id/milestones/:milestoneId', protect, async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json(errorResponse('Goal not found'));
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $pull: { milestones: { _id: req.params.milestoneId } } },
      { new: true }
    );

    // Recalculate progress
    const milestoneIndex = goal.milestones.findIndex(m => m._id.toString() === req.params.milestoneId);
    const wasCompleted = milestoneIndex !== -1 && goal.milestones[milestoneIndex].completed;
    if (wasCompleted) {
      const completedCount = goal.milestones.filter(m => m.completed).length - 1;
      const newProgress = goal.milestones.length > 1 ? Math.round((completedCount / goal.milestones.length) * 100) : goal.progress;
      await Goal.findByIdAndUpdate(req.params.id, { progress: newProgress });
    }

    res.json(successResponse({ id: req.params.milestoneId }, 'Milestone deleted successfully'));
  } catch (error) {
    next(error);
  }
});

// @desc    Add note to goal
// @route   POST /api/goals/:id/notes
// @access   Private
router.post('/:id/notes', protect, async (req, res, next) => {
  try {
    const { text } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json(errorResponse('Goal not found'));
    }

    const note = { text: text.trim(), createdAt: new Date() };
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $push: { notes: note } },
      { new: true }
    );

    // Create activity record
    await Activity.create({
      user: req.user.id,
      type: 'note_added',
      goalId: req.params.id,
      meta: { noteText: text }
    });

    res.status(201).json(successResponse(note, 'Note added successfully'));
  } catch (error) {
    next(error);
  }
});

// @desc    Delete note
// @route   DELETE /api/goals/:id/notes/:noteId
// @access   Private
router.delete('/:id/notes/:noteId', protect, async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json(errorResponse('Goal not found'));
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $pull: { notes: { _id: req.params.noteId } } },
      { new: true }
    );

    res.json(successResponse({ id: req.params.noteId }, 'Note deleted successfully'));
  } catch (error) {
    next(error);
  }
});

// @desc    Get goal statistics
// @route   GET /api/goals/stats
// @access   Private
router.get('/stats', protect, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [
      totalGoals,
      activeGoals,
      completedGoals,
      goalsByContext,
      goalsByPriority,
      goalsByStatus
    ] = await Promise.all([
      Goal.countDocuments({ user: userId }),
      Goal.countDocuments({ user: userId, status: 'active' }),
      Goal.countDocuments({ user: userId, status: 'completed' }),
      Goal.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$context', count: { $sum: 1 } } }
      ]),
      Goal.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Goal.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    // Calculate completion rate
    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // Goals due this week
    const goalsDueThisWeek = await Goal.countDocuments({
      user: userId,
      dueDate: { $lte: weekFromNow },
      status: { $nin: ['completed', 'archived'] }
    });

    // Calculate streak (consecutive days with activity)
    const streak = await Activity.aggregate([
      {
        $match: {
          user: userId,
          createdAt: {
            $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          hasActivity: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Calculate current streak
    let currentStreak = 0;
    const today = now.toISOString().split('T')[0];
    for (let i = streak.length - 1; i >= 0; i--) {
      if (streak[i].hasActivity > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    const stats = {
      totalGoals,
      activeGoals,
      completedGoals,
      completionRate,
      byContext: {
        work: goalsByContext.find(c => c._id === 'work')?.count || 0,
        health: goalsByContext.find(c => c._id === 'health')?.count || 0,
        finance: goalsByContext.find(c => c._id === 'finance')?.count || 0,
        education: goalsByContext.find(c => c._id === 'education')?.count || 0,
        personal: goalsByContext.find(c => c._id === 'personal')?.count || 0,
        relationships: goalsByContext.find(c => c._id === 'relationships')?.count || 0,
        creativity: goalsByContext.find(c => c._id === 'creativity')?.count || 0,
        travel: goalsByContext.find(c => c._id === 'travel')?.count || 0
      },
      byPriority: {
        low: goalsByPriority.find(p => p._id === 'low')?.count || 0,
        medium: goalsByPriority.find(p => p._id === 'medium')?.count || 0,
        high: goalsByPriority.find(p => p._id === 'high')?.count || 0,
        critical: goalsByPriority.find(p => p._id === 'critical')?.count || 0
      },
      byStatus: {
        active: goalsByStatus.find(s => s._id === 'active')?.count || 0,
        'in-progress': goalsByStatus.find(s => s._id === 'in-progress')?.count || 0,
        completed: goalsByStatus.find(s => s._id === 'completed')?.count || 0,
        archived: goalsByStatus.find(s => s._id === 'archived')?.count || 0
      },
      dueThisWeek: goalsDueThisWeek,
      streak: currentStreak
    };

    res.json(successResponse(stats));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
