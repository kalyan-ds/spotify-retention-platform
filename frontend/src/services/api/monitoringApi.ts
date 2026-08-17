import { apiClient } from './client';
import { HealthStatusResponse, DriftResponse } from '../../types/api';

export const monitoringApi = {
  getHealthStatus: (): Promise<HealthStatusResponse> => {
    return apiClient.get('/ai/health');
  },

  getMetricsSummary: (): Promise<any> => {
    return apiClient.get('/ai/metrics');
  },

  getLatencyReport: (): Promise<any> => {
    return apiClient.get('/ai/latency');
  },

  getCacheStats: (): Promise<any> => {
    return apiClient.get('/ai/cache');
  },

  getDriftOverview: (): Promise<DriftResponse> => {
    return apiClient.get('/ai/drift');
  },

  getFeatureDrift: (): Promise<any> => {
    return apiClient.get('/ai/drift/features');
  }
};
