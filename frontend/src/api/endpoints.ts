/**
 * Single source of truth for all API endpoints.
 */
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  dashboard: {
    metrics: '/dashboard/metrics',
    summary: '/dashboard/summary',
  },
  models: {
    predictions: '/models/predict',
    shapValues: '/models/explain',
  },
} as const;
