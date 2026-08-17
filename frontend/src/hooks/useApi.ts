import { useQuery } from '@tanstack/react-query';
import { monitoringApi } from '../services/api/monitoringApi';
import { modelsApi } from '../services/api/modelsApi';
import { aiApi } from '../services/api/aiApi';

export const useAIHealth = () => {
  return useQuery({
    queryKey: ['aiHealth'],
    queryFn: () => monitoringApi.getHealthStatus(),
    refetchInterval: 15000
  });
};

export const useAIMetrics = () => {
  return useQuery({
    queryKey: ['aiMetrics'],
    queryFn: () => monitoringApi.getMetricsSummary(),
    refetchInterval: 30000
  });
};

export const useModelCatalog = () => {
  return useQuery({
    queryKey: ['modelCatalog'],
    queryFn: () => modelsApi.listModels()
  });
};

export const useUserPrediction = (userId: number) => {
  return useQuery({
    queryKey: ['userPrediction', userId],
    queryFn: () => aiApi.predictChurn(userId),
    enabled: !!userId
  });
};
