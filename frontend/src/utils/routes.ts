/**
 * Single source of truth for all application routes.
 * Prevents hardcoding strings throughout the codebase.
 */
export const ROUTES = {
  home: '/',
  overview: '/overview',
  users: '/users',
  revenue: '/revenue',
  retention: '/retention',
  engagement: '/engagement',
  ai: '/ai',
  aiModels: '/ai-models',
  aiHealth: '/ai/model-health',
  aiDrift: '/ai/drift',
  predictions: '/predictions',
  recommendations: '/recommendations',
  segments: '/segments',
  reports: '/reports',
  settings: '/settings',
  components: '/components',

  // Error routes
  notFound: '/404',
  serverError: '/500',

  // Auth routes (future)
  login: '/login',
  callback: '/callback',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
