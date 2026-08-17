export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  EXECUTIVE: '/executive',
  PREDICTIONS: '/predictions',
  EXPLAINABILITY: '/explainability',
  RECOMMENDATIONS: '/recommendations',
  MODELS: '/models',
  MODEL_HEALTH: '/model-health',
  DRIFT: '/drift',
  MONITORING: '/monitoring',
  FEATURE_STORE: '/feature-store',
  EXPERIMENTS: '/experiments',
  INSIGHTS: '/insights',
  SETTINGS: '/settings',
  AUDIT: '/audit',
  SECURITY: '/security',
  SECURITY_COMPLIANCE: '/security-compliance',
  PERFORMANCE: '/performance',
  ACCESSIBILITY: '/accessibility',
  RELEASE: '/release',
  GITHUB: '/github',
  CERTIFICATION: '/certification',
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404'
} as const;

export type RouteKey = keyof typeof ROUTES;
