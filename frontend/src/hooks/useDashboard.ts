import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../services/api/dashboard.service';
import { REFRESH_INTERVALS } from '../lib/refreshIntervals';

export const DASHBOARD_QUERY_KEYS = {
  KPIS: ['dashboard', 'kpis'],
  OVERVIEW: ['dashboard', 'overview']
} as const;

export function useExecutiveKPIs() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.KPIS,
    queryFn: () => DashboardService.getExecutiveKPIs(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.EXECUTIVE_KPIS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}

export function useExecutiveOverview() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.OVERVIEW,
    queryFn: () => DashboardService.getExecutiveOverview(),
    enabled: true,
    refetchInterval: REFRESH_INTERVALS.EXECUTIVE_KPIS,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    networkMode: 'online'
  });
}
