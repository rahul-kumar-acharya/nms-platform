import api from './api';

export const networkService = {
  getBinaryTree: async (memberId = null, depth = 4) => {
    const params = { depth };
    if (memberId) params.member_id = memberId;
    const response = await api.get('/network/binary/', { params });
    return response.data;
  },

  getReferralTree: async (memberId = null, depth = 3) => {
    const params = { depth };
    if (memberId) params.member_id = memberId;
    const response = await api.get('/network/referrals/', { params });
    return response.data;
  }
};
