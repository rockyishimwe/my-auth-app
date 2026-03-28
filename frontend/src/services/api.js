import axios from 'axios';

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor - attach JWT token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handle 401 errors
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Auth service methods
 */
export const authService = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getProfile: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.put('/users/password', passwordData)
};

/**
 * Goals service methods
 */
export const goalsService = {
  getAll: (params = {}) => api.get('/goals', { params }),
  create: (goalData) => api.post('/goals', goalData),
  getById: (id) => api.get(`/goals/${id}`),
  update: (id, goalData) => api.put(`/goals/${id}`, goalData),
  delete: (id) => api.delete(`/goals/${id}`),
  updateProgress: (id, progress) => api.put(`/goals/${id}/progress`, { progress }),
  updateStatus: (id, status) => api.put(`/goals/${id}/status`, { status }),
  addMilestone: (id, milestone) => api.post(`/goals/${id}/milestones`, { text: milestone }),
  updateMilestone: (id, milestoneId, milestone) => api.put(`/goals/${id}/milestones/${milestoneId}`, milestone),
  deleteMilestone: (id, milestoneId) => api.delete(`/goals/${id}/milestones/${milestoneId}`),
  addNote: (id, note) => api.post(`/goals/${id}/notes`, { text: note }),
  deleteNote: (id, noteId) => api.delete(`/goals/${id}/notes/${noteId}`),
  getStats: () => api.get('/goals/stats')
};

/**
 * Activity service methods
 */
export const activityService = {
  getFeed: () => api.get('/activity')
};

export default api;
