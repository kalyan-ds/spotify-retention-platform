import React, { createContext, useContext, useState, useMemo } from 'react';

export interface FilterState {
  dateRange: string;
  country: string;
  device: string;
  tier: string;
  segment: string;
  payment: string;
  age: string;
}

export const defaultFilterState: FilterState = {
  dateRange: 'Last 30 Days',
  country: 'All',
  device: 'All',
  tier: 'All',
  segment: 'All',
  payment: 'All',
  age: 'All',
};

interface DashboardFilterContextProps {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
}

const DashboardFilterContext = createContext<DashboardFilterContextProps | undefined>(undefined);

export function DashboardFilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilterState);
  };

  const value = useMemo(() => ({ filters, setFilter, resetFilters }), [filters]);

  return (
    <DashboardFilterContext.Provider value={value}>
      {children}
    </DashboardFilterContext.Provider>
  );
}

export function useDashboardFilters() {
  const context = useContext(DashboardFilterContext);
  if (!context) {
    throw new Error('useDashboardFilters must be used within a DashboardFilterProvider');
  }
  return context;
}
