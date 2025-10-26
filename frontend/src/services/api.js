import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/api/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getCurrentUser: () => api.get('/api/auth/me'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/api/users/'),
  getById: (id) => api.get(`/api/users/${id}`),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  delete: (id) => api.delete(`/api/users/${id}`),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/api/projects/'),
  getById: (id) => api.get(`/api/projects/${id}`),
  create: (data) => api.post('/api/projects/', data),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
};

// Tasks API
export const tasksAPI = {
  getAll: (params) => api.get('/api/tasks/', { params }),
  getById: (id) => api.get(`/api/tasks/${id}`),
  getMyTasks: () => api.get('/api/tasks/my-tasks'),
  create: (data) => api.post('/api/tasks/', data),
  update: (id, data) => api.put(`/api/tasks/${id}`, data),
  delete: (id) => api.delete(`/api/tasks/${id}`),
  addComment: (taskId, content) => api.post(`/api/tasks/${taskId}/comments`, { content }),
  getComments: (taskId) => api.get(`/api/tasks/${taskId}/comments`),
};

// AI API
export const aiAPI = {
  generateUserStories: (projectDescription) => 
    api.post('/api/ai/generate-user-stories', { projectDescription }),
  generateAndSave: (projectId, projectDescription) => 
    api.post(`/api/ai/generate-and-save/${projectId}`, { projectDescription }),
  getUserStories: (projectId) => api.get(`/api/ai/user-stories/${projectId}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
  getProjectStats: () => api.get('/api/dashboard/project-stats'),
  getSingleProjectStats: (projectId) => api.get(`/api/dashboard/project-stats/${projectId}`),
};

export default api;
