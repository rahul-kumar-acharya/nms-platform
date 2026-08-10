import api from './api';

export const kycService = {
  getKYC: async () => {
    const response = await api.get('/kyc/');
    return response.data;
  },

  submitKYC: async (data) => {
    const response = await api.post('/kyc/', data);
    return response.data;
  },

  verifyKYC: async (id, remarks = '') => {
    const response = await api.post(`/kyc/${id}/verify/`, { remarks });
    return response.data;
  },

  rejectKYC: async (id, remarks = '') => {
    const response = await api.post(`/kyc/${id}/reject/`, { remarks });
    return response.data;
  }
};
