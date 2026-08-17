import { useState, useCallback } from 'react';
import { REFRESH_INTERVALS, RefreshDomain } from '../lib/refreshIntervals';

export interface AutoRefreshOptions {
  domain: RefreshDomain;
  enabled?: boolean;
}

export function useAutoRefresh({ domain, enabled = true }: AutoRefreshOptions) {
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(enabled);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const intervalMs = REFRESH_INTERVALS[domain];

  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshEnabled(prev => !prev);
  }, []);

  const touchLastUpdated = useCallback(() => {
    setLastUpdated(new Date());
  }, []);

  return {
    isAutoRefreshEnabled,
    intervalMs,
    lastUpdated,
    toggleAutoRefresh,
    touchLastUpdated
  };
}
