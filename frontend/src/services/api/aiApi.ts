import { apiClient } from './client';
import { PredictionResponse } from '../../types/api';

export const aiApi = {
  predictChurn: (userId: number, includeExplanations: boolean = true): Promise<PredictionResponse> => {
    return apiClient.post('/ai/predict/churn', {
      user_id: userId,
      include_explanations: includeExplanations,
      include_recommendations: true
    });
  },

  predictEngagement: (userId: number): Promise<any> => {
    return apiClient.post('/ai/predict/engagement', { user_id: userId });
  },

  predictUpgrade: (userId: number): Promise<any> => {
    return apiClient.post('/ai/predict/upgrade', { user_id: userId });
  },

  predictPersona: (userId: number): Promise<any> => {
    return apiClient.post('/ai/predict/persona', { user_id: userId });
  },

  predictBatch: (userIds: number[]): Promise<any> => {
    return apiClient.post('/ai/predict/batch', { user_ids: userIds });
  },

  getExplanations: (userId: number): Promise<any> => {
    return apiClient.post('/ai/explanations', { user_id: userId });
  }
};
