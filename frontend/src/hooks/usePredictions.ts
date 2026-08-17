import { useQuery } from '@tanstack/react-query';
import { PredictionService } from '../services/api/prediction.service';
import { REFRESH_INTERVALS } from '../lib/refreshIntervals';

export const PREDICTION_QUERY_KEYS = {
  SUMMARY: ['predictions', 'summary'],
  TRENDS: ['predictions', 'trends'],
  DISTRIBUTION: ['predictions', 'distribution'],
  RECENT: ['predictions', 'recent']
} as const;

export function usePredictionSummary() {
  return useQuery({
    queryKey: PREDICTION_QUERY_KEYS.SUMMARY,
    queryFn: () => PredictionService.getPredictionSummary(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.PREDICTIONS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}

export function usePredictionTrends() {
  return useQuery({
    queryKey: PREDICTION_QUERY_KEYS.TRENDS,
    queryFn: () => PredictionService.getPredictionTrends(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.PREDICTIONS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}

export function useConfidenceDistribution() {
  return useQuery({
    queryKey: PREDICTION_QUERY_KEYS.DISTRIBUTION,
    queryFn: () => PredictionService.getConfidenceDistribution(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.PREDICTIONS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}

export function useRecentPredictions() {
  return useQuery({
    queryKey: PREDICTION_QUERY_KEYS.RECENT,
    queryFn: () => PredictionService.getRecentPredictions(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.PREDICTIONS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}
