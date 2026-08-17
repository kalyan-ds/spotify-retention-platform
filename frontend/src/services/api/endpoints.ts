/**
 * Centralized API Endpoint Constants
 * Spotify Premium Retention Intelligence Platform - Phase 7F.2.8.1
 */

export const ENDPOINTS = {
  DASHBOARD: {
    KPIS: '/dashboard/kpis',
    EXECUTIVE_OVERVIEW: '/dashboard/executive-overview'
  },
  HEALTH: {
    SYSTEM_HEALTH: '/health/system',
    MICROSERVICES: '/health/services',
    DRIFT: '/health/drift'
  },
  PREDICTIONS: {
    SUMMARY: '/predictions/summary',
    TRENDS: '/predictions/trends',
    DISTRIBUTION: '/predictions/distribution',
    LOG: '/predictions/recent'
  },
  RECOMMENDATIONS: {
    SUMMARY: '/recommendations/summary',
    PRIORITY: '/recommendations/priority',
    CATEGORIES: '/recommendations/categories',
    IMPACT_MATRIX: '/recommendations/matrix',
    QUEUE: '/recommendations/top'
  },
  MONITORING: {
    SUMMARY: '/monitoring/summary',
    TIMELINE: '/monitoring/timeline',
    ALERTS: '/monitoring/alerts'
  },
  MODELS: {
    REGISTRY: '/models/registry',
    PERFORMANCE: '/models/performance',
    PIPELINE: '/models/pipeline'
  }
} as const;
