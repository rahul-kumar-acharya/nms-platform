import api from './api';

export const epinService = {
  getEpins: async (params = {}) => {
    const response = await api.get('/epins/', { params });
    return response.data;
  },

  generateEpins: async (plan_id, quantity) => {
    const response = await api.post('/epins/generate/', { plan_id, quantity });
    return response.data;
  },

  validateEpin: async (code) => {
    const response = await api.post('/epins/validate_epin/', { code });
    return response.data;
  },

  deleteEpin: async (id) => {
    const response = await api.delete(`/epins/${id}/`);
    return response.data;
  }
};
