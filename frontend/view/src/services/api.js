import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login/', data),
  register: (data) => api.post('/auth/register/', data),
  getHostels: () => api.get('/auth/hostels/')
};

export const issuesAPI = {
  getIssues: (params) => api.get('/issues/', { params }),
  getIssue: (id) => api.get(`/issues/${id}/`),
  createIssue: (issueData) => api.post('/issues/', issueData),
  updateIssue: (id, issueData) => api.patch(`/issues/${id}/`, issueData),
  deleteIssue: (id) => api.delete(`/issues/${id}/`)
};

export const commentsAPI = {
  getComments: (issueId) => api.get('/issues/comments/', { params: { issue_id: issueId } }),
  createComment: (commentData) => api.post('/issues/comments/', commentData),
};

export const announcementsAPI = {
  getAnnouncements: (params) => api.get('/announcements/', { params }),
  createAnnouncement: (data) => api.post('/announcements/', data),
};

export const lostFoundAPI = {
  getItems: (params) => api.get('/lostandfound/items/', { params }),
  createItem: (data) => api.post('/lostandfound/items/', data),
};

export default api;