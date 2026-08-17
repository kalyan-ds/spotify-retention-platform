import { apiClient } from './client';
import { ModelMetadata } from '../../types/api';

export const modelsApi = {
  listModels: (): Promise<ModelMetadata[]> => {
    return apiClient.get('/ai/models');
  },

  getChampionModels: (): Promise<ModelMetadata[]> => {
    return apiClient.get('/ai/models/champion');
  },

  getModelVersions: (): Promise<any[]> => {
    return apiClient.get('/ai/models/versions');
  },

  getModelById: (modelId: string): Promise<ModelMetadata> => {
    return apiClient.get(`/ai/models/${modelId}`);
  }
};
