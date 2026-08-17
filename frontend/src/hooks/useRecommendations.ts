import { useQuery } from '@tanstack/react-query';
import { RecommendationService } from '../services/api/recommendation.service';
import { REFRESH_INTERVALS } from '../lib/refreshIntervals';

export const RECOMMENDATION_QUERY_KEYS = {
  SUMMARY: ['recommendations', 'summary'],
  PRIORITY: ['recommendations', 'priority'],
  CATEGORIES: ['recommendations', 'categories'],
  MATRIX: ['recommendations', 'matrix'],
  QUEUE: ['recommendations', 'queue']
} as const;

export function useRecommendationSummary() {
  return useQuery({
    queryKey: RECOMMENDATION_QUERY_KEYS.SUMMARY,
    queryFn: () => RecommendationService.getRecommendationSummary(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.RECOMMENDATIONS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}

export function useRecommendationPriority() {
  return useQuery({
    queryKey: RECOMMENDATION_QUERY_KEYS.PRIORITY,
    queryFn: () => RecommendationService.getPriorityDistribution(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.RECOMMENDATIONS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}

export function useRecommendationCategories() {
  return useQuery({
    queryKey: RECOMMENDATION_QUERY_KEYS.CATEGORIES,
    queryFn: () => RecommendationService.getCategoryBreakdown(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.RECOMMENDATIONS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}

export function useRecommendationImpactMatrix() {
  return useQuery({
    queryKey: RECOMMENDATION_QUERY_KEYS.MATRIX,
    queryFn: () => RecommendationService.getImpactMatrix(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.RECOMMENDATIONS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}

export function useTopRecommendations() {
  return useQuery({
    queryKey: RECOMMENDATION_QUERY_KEYS.QUEUE,
    queryFn: () => RecommendationService.getTopRecommendations(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.RECOMMENDATIONS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}
