import api from './api';

export const walletService = {
  getMyWallet: async () => {
    const response = await api.get('/wallet/my_wallet/');
    return response.data;
  },

  getTransactions: async (params = {}) => {
    const response = await api.get('/wallet/transactions/', { params });
    return response.data;
  }
};
