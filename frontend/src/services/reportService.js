import api from './api';

export const reportService = {
  getDashboardOverview: async () => {
    const response = await api.get('/reports/dashboard/');
    return response.data;
  }
};
