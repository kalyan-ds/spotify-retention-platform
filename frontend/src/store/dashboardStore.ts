import { create } from 'zustand';
import { FilterState } from '../types/dashboard';

interface DashboardState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  quickSearchOpen: boolean;
  notificationsOpen: boolean;
  filters: FilterState;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setQuickSearchOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setFilters: (filters: Partial<FilterState>) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  quickSearchOpen: false,
  notificationsOpen: false,
  filters: {
    timeframe: '30d',
    riskTier: 'All'
  },
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  setQuickSearchOpen: (open) => set({ quickSearchOpen: open }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }))
}));
