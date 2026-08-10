import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login/', { username, password });
    if (response.data.access) {
      localStorage.setItem('nms_token', response.data.access);
      localStorage.setItem('nms_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (registrationData) => {
    const response = await api.post('/auth/register/', registrationData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('nms_token');
    localStorage.removeItem('nms_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('nms_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
