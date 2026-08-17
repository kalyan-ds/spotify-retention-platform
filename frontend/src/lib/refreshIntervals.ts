/**
 * Centralized Enterprise Real-Time Refresh Intervals (in milliseconds)
 * Spotify Premium Retention Intelligence Platform - Phase 7F.2.8.3
 */

export const REFRESH_INTERVALS = {
  EXECUTIVE_KPIS: 60 * 1000,      // 60 seconds
  AI_HEALTH: 15 * 1000,           // 15 seconds
  PREDICTIONS: 30 * 1000,         // 30 seconds
  RECOMMENDATIONS: 60 * 1000,     // 60 seconds
  AI_OPERATIONS: 15 * 1000,       // 15 seconds
  OPERATIONS_CENTER: 10 * 1000    // 10 seconds
} as const;

export type RefreshDomain = keyof typeof REFRESH_INTERVALS;
