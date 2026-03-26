/**
 * Business logic utilities for goals
 */

/**
 * Calculate completion rate
 */
const calculateCompletionRate = (completedGoals, totalGoals) => {
  return totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
};

/**
 * Recalculate goal progress when milestone is toggled
 */
const recalculateProgressFromMilestones = (goal) => {
  if (!goal.milestones || goal.milestones.length === 0) {
    return goal.progress;
  }
  
  const completedMilestones = goal.milestones.filter(m => m.completed);
  return Math.round((completedMilestones.length / goal.milestones.length) * 100);
};

/**
 * Calculate priority matrix logic
 */
const getPriorityMatrix = (goals) => {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  return goals.map(goal => {
    const isUrgent = goal.dueDate && new Date(goal.dueDate) <= threeDaysFromNow;
    const isImportant = ['high', 'critical'].includes(goal.priority);
    
    return {
      goal,
      urgent: isUrgent,
      important: isImportant,
      quadrant: isUrgent && isImportant ? 'urgent-important' :
               isUrgent && !isImportant ? 'urgent-only' :
               !isUrgent && isImportant ? 'important-only' : 'neither'
    };
  });
};

/**
 * Get goals due this week
 */
const getGoalsDueThisWeek = (goals) => {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return goals.filter(goal => 
    goal.dueDate && 
    new Date(goal.dueDate) <= weekFromNow &&
    !['completed', 'archived'].includes(goal.status)
  );
};

/**
 * Process tags - lowercase, trim, deduplicate
 */
const processTags = (tags) => {
  if (!tags || !Array.isArray(tags)) return [];
  
  return tags
    .map(tag => tag.toLowerCase().trim())
    .filter((tag, index, arr) => arr.indexOf(tag) === index)
    .slice(0, 10); // Max 10 tags
};

/**
 * Trim string fields
 */
const trimString = (str) => {
  return typeof str === 'string' ? str.trim() : str;
};

/**
 * Validate required fields
 */
const validateRequiredFields = (data, requiredFields) => {
  const missing = requiredFields.filter(field => !data[field]);
  return missing.length === 0 ? null : missing;
};

/**
 * Check if goal is overdue
 */
const isOverdue = (goal) => {
  if (!goal.dueDate) return false;
  return new Date(goal.dueDate) < new Date() && !['completed', 'archived'].includes(goal.status);
};

/**
 * Get next milestone
 */
const getNextMilestone = (goal) => {
  if (!goal.milestones || goal.milestones.length === 0) return null;
  
  return goal.milestones
    .filter(m => !m.completed)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];
};

module.exports = {
  calculateCompletionRate,
  recalculateProgressFromMilestones,
  getPriorityMatrix,
  getGoalsDueThisWeek,
  processTags,
  trimString,
  validateRequiredFields,
  isOverdue,
  getNextMilestone
};
