/**
 * Optimistic update utilities
 */

/**
 * Optimistically update goals array
 */
const optimisticUpdateGoal = (goals, updatedGoal) => {
  return goals.map(goal => 
    goal._id === updatedGoal._id ? updatedGoal : goal
  );
};

/**
 * Optimistically add goal to array
 */
const optimisticAddGoal = (goals, newGoal) => {
  return [newGoal, ...goals];
};

/**
 * Optimistically remove goal from array
 */
const optimisticRemoveGoal = (goals, goalId) => {
  return goals.filter(goal => goal._id !== goalId);
};

/**
 * Create optimistic update with revert on error
 */
const createOptimisticUpdate = (updateFn, revertData) => {
  return async (...args) => {
    try {
      const result = await updateFn(...args);
      return result;
    } catch (error) {
      // Revert the optimistic update
      revertData();
      throw error;
    }
  };
};

module.exports = {
  optimisticUpdateGoal,
  optimisticAddGoal,
  optimisticRemoveGoal,
  createOptimisticUpdate
};
