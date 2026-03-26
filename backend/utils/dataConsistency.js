/**
 * Data consistency utilities
 */

/**
 * Trim all string fields before saving
 */
const trimStringFields = (data, fields) => {
  const trimmedData = {};
  
  fields.forEach(field => {
    if (data[field] && typeof data[field] === 'string') {
      trimmedData[field] = data[field].trim();
    } else {
      trimmedData[field] = data[field];
    }
  });
  
  return trimmedData;
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
 * Ensure all dates are stored and compared in UTC
 */
const normalizeDate = (date) => {
  if (!date) return null;
  
  const normalizedDate = new Date(date);
  // Ensure date is valid
  if (isNaN(normalizedDate.getTime())) {
    return null;
  }
  
  return normalizedDate;
};

/**
 * Check if goal is overdue
 */
const isOverdue = (goal) => {
  if (!goal.dueDate) return false;
  return new Date(goal.dueDate) < new Date() && !['completed', 'archived'].includes(goal.status);
};

/**
 * Validate required fields
 */
const validateRequiredFields = (data, requiredFields) => {
  const missing = requiredFields.filter(field => !data[field]);
  return missing.length === 0 ? null : missing;
};

/**
 * Clean user data before saving
 */
const cleanUserData = (data) => {
  return {
    name: data.name ? data.name.trim() : undefined,
    email: data.email ? data.email.toLowerCase().trim() : undefined
  };
};

module.exports = {
  trimStringFields,
  processTags,
  normalizeDate,
  isOverdue,
  validateRequiredFields,
  cleanUserData
};
