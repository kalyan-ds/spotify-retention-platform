import { useState, useCallback } from 'react';

export interface RetentionFilters {
  dateRange: string;
  region: string;
  subscriptionPlan: string;
  deviceType: string;
}

export const initialRetentionFilters: RetentionFilters = {
  dateRange: 'last_30_days',
  region: 'all',
  subscriptionPlan: 'all',
  deviceType: 'all',
};

export const useRetentionFilters = () => {
  const [filters, setFilters] = useState<RetentionFilters>(initialRetentionFilters);

  const updateFilter = useCallback((key: keyof RetentionFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialRetentionFilters);
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
  };
};
