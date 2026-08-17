import { useState, useCallback } from 'react';

export interface EngagementFilters {
  dateRange: string;
  region: string;
  subscriptionPlan: string;
  deviceType: string;
  userSegment: string;
}

export const initialEngagementFilters: EngagementFilters = {
  dateRange: 'last_30_days',
  region: 'all',
  subscriptionPlan: 'all',
  deviceType: 'all',
  userSegment: 'all',
};

export const useEngagementFilters = () => {
  const [filters, setFilters] = useState<EngagementFilters>(initialEngagementFilters);

  const updateFilter = useCallback((key: keyof EngagementFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialEngagementFilters);
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
  };
};
