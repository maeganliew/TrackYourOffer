import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobtracker_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // for non-login attempts, log out
    if (status === 401 && url !== '/auth/login') {
      localStorage.removeItem('jobtracker_token');
      localStorage.removeItem('jobtracker_user');
      toast.error('Session expired. Please log in again.');
      setTimeout(() => window.location.href = '/login', 300); // small delay to show toast
    }
    return Promise.reject(error);
  }
);

export default api;