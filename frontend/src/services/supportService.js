import api from './api';

export const supportService = {
  getTickets: async () => {
    const response = await api.get('/support/');
    return response.data;
  },

  createTicket: async (data) => {
    const response = await api.post('/support/', data);
    return response.data;
  },

  replyTicket: async (id, message) => {
    const response = await api.post(`/support/${id}/reply/`, { message });
    return response.data;
  }
};
