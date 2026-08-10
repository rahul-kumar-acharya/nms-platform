import api from './api';

export const withdrawalService = {
  getWithdrawals: async (params = {}) => {
    const response = await api.get('/withdrawals/', { params });
    return response.data;
  },

  createWithdrawal: async (data) => {
    const response = await api.post('/withdrawals/', data);
    return response.data;
  },

  approveWithdrawal: async (id, admin_notes = '') => {
    const response = await api.post(`/withdrawals/${id}/approve/`, { admin_notes });
    return response.data;
  },

  rejectWithdrawal: async (id, admin_notes = '') => {
    const response = await api.post(`/withdrawals/${id}/reject/`, { admin_notes });
    return response.data;
  }
};
