import { useQuery } from '@tanstack/react-query';
import { ModelService } from '../services/api/model.service';
import { REFRESH_INTERVALS } from '../lib/refreshIntervals';

export const MODEL_QUERY_KEYS = {
  REGISTRY: ['models', 'registry'],
  PERFORMANCE: ['models', 'performance'],
  PIPELINE: ['models', 'pipeline']
} as const;

export function useModelRegistry() {
  return useQuery({
    queryKey: MODEL_QUERY_KEYS.REGISTRY,
    queryFn: () => ModelService.getModelRegistry(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.AI_OPERATIONS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}

export function useModelPerformance() {
  return useQuery({
    queryKey: MODEL_QUERY_KEYS.PERFORMANCE,
    queryFn: () => ModelService.getModelPerformance(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.AI_OPERATIONS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}

export function useDeploymentPipeline() {
  return useQuery({
    queryKey: MODEL_QUERY_KEYS.PIPELINE,
    queryFn: () => ModelService.getDeploymentPipeline(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.AI_OPERATIONS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}
