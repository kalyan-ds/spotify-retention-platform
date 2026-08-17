import { useQuery } from '@tanstack/react-query';
import { MonitoringService } from '../services/api/monitoring.service';
import { REFRESH_INTERVALS } from '../lib/refreshIntervals';

export const MONITORING_QUERY_KEYS = {
  HEALTH: ['monitoring', 'health'],
  DRIFT: ['monitoring', 'drift'],
  TIMELINE: ['monitoring', 'timeline'],
  ALERTS: ['monitoring', 'alerts']
} as const;

export function useSystemHealth() {
  return useQuery({
    queryKey: MONITORING_QUERY_KEYS.HEALTH,
    queryFn: () => MonitoringService.getSystemHealth(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.AI_HEALTH,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}

export function useDriftMetrics() {
  return useQuery({
    queryKey: MONITORING_QUERY_KEYS.DRIFT,
    queryFn: () => MonitoringService.getDriftMetrics(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.AI_OPERATIONS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}

export function useTimelineEvents() {
  return useQuery({
    queryKey: MONITORING_QUERY_KEYS.TIMELINE,
    queryFn: () => MonitoringService.getTimelineEvents(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.OPERATIONS_CENTER,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}

export function useActiveAlerts() {
  return useQuery({
    queryKey: MONITORING_QUERY_KEYS.ALERTS,
    queryFn: () => MonitoringService.getActiveAlerts(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.OPERATIONS_CENTER,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}
