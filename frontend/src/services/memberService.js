import api from './api';

export const memberService = {
  getMembers: async (params = {}) => {
    const response = await api.get('/members/', { params });
    return response.data;
  },

  getMemberById: async (id) => {
    const response = await api.get(`/members/${id}/`);
    return response.data;
  },

  getMemberMe: async () => {
    const response = await api.get('/members/me/');
    return response.data;
  }
};
