/**
 * Standardized API response format
 */

// Success response
const successResponse = (data, message = null) => {
  return {
    success: true,
    data,
    message
  };
};

// Error response
const errorResponse = (message, errors = []) => {
  return {
    success: false,
    message,
    errors
  };
};

// Paginated response
const paginatedResponse = (data, pagination) => {
  return {
    success: true,
    data,
    pagination: {
      total: pagination.total,
      page: pagination.page,
      pages: pagination.pages,
      limit: pagination.limit
    }
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
