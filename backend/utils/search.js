/**
 * Search utilities for goals
 */

/**
 * Build search filter for case-insensitive regex search
 */
const buildSearchFilter = (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return {};
  }

  const regex = new RegExp(searchTerm, 'i');
  
  return {
    $or: [
      { title: { $regex: regex } },
      { description: { $regex: regex } },
      { tags: { $in: [regex] } }
    ]
  };
};

/**
 * Build filter object from query parameters
 */
const buildFilters = (query) => {
  const filter = {};
  
  // Context filter
  if (query.context) {
    filter.context = query.context;
  }
  
  // Status filter
  if (query.status) {
    filter.status = query.status;
  }
  
  // Priority filter
  if (query.priority) {
    filter.priority = query.priority;
  }
  
  // Due date range filter
  if (query.dueFrom || query.dueTo) {
    filter.dueDate = {};
    if (query.dueFrom) {
      filter.dueDate.$gte = new Date(query.dueFrom);
    }
    if (query.dueTo) {
      filter.dueDate.$lte = new Date(query.dueTo);
    }
  }
  
  return filter;
};

/**
 * Build sort object from query parameters
 */
const buildSort = (query) => {
  const sort = {};
  
  switch (query.sort) {
    case 'created':
      sort.createdAt = -1;
      break;
    case 'dueDate':
      sort.dueDate = 1;
      break;
    case 'priority':
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      sort.priority = { $expr: { $map: priorityOrder } };
      break;
    case 'progress':
      sort.progress = -1;
      break;
    case 'title':
      sort.title = 1;
      break;
    default:
      sort.createdAt = -1;
  }
  
  return sort;
};

module.exports = {
  buildSearchFilter,
  buildFilters,
  buildSort
};
