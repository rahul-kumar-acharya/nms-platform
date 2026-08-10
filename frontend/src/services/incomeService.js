import api from './api';

export const incomeService = {
  getIncomes: async (params = {}) => {
    const response = await api.get('/income/', { params });
    return response.data;
  },

  runBinaryEngine: async () => {
    const response = await api.post('/income/run_binary_engine/');
    return response.data;
  }
};
