import api from './api';

export const epinService = {
  getEpins: async (params = {}) => {
    const response = await api.get('/epins/', { params });
    return response.data;
  },

  generateEpins: async (plan_id, quantity, target_member_id = '') => {
    const payload = { plan_id, quantity };
    if (target_member_id) payload.target_member_id = target_member_id;
    const response = await api.post('/epins/generate/', payload);
    return response.data;
  },

  getMyEpins: async (params = {}) => {
    const response = await api.get('/epins/my_epins/', { params });
    return response.data;
  },

  purchaseWithWallet: async (plan_id, quantity) => {
    const response = await api.post('/epins/purchase_with_wallet/', { plan_id, quantity });
    return response.data;
  },

  transferEpin: async (id, target_member_id) => {
    const response = await api.post(`/epins/${id}/transfer/`, { target_member_id });
    return response.data;
  },

  assignBulk: async (epin_ids, target_member_id) => {
    const response = await api.post('/epins/assign_bulk/', { epin_ids, target_member_id });
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
