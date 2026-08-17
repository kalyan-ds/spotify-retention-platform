import { apiClient } from './client';

export const recommendationApi = {
  getRecommendations: (userId: number): Promise<any> => {
    return apiClient.post('/ai/recommendations', { user_id: userId });
  },

  getNextBestAction: (userId: number): Promise<any> => {
    return apiClient.post('/ai/next-best-action', { user_id: userId });
  }
};
