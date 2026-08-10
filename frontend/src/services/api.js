import axios from 'axios';

// API Base URL connecting frontend to backend server (Local dev fallback to 8000, production to api.nms.acharyaworks.in)
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (isLocalhost ? 'http://localhost:8000/api/v1' : 'https://api.nms.acharyaworks.in/api/v1');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const hadToken = localStorage.getItem('nms_token');
      localStorage.removeItem('nms_token');
      localStorage.removeItem('nms_user');
      
      // Only redirect to login if the user had an active session token that expired while accessing protected area
      if (hadToken && window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
