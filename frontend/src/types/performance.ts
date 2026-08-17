/**
 * Enterprise Performance Telemetry Schemas
 * Spotify Premium Retention Intelligence Platform - Version 2.0 Phase 1.8B
 */

export interface MetricRating {
  value: number;
  unit: string;
  rating: 'GOOD' | 'NEEDS_IMPROVEMENT' | 'POOR';
  thresholdGood: number;
}

export interface CoreWebVitals {
  lcp: MetricRating; // Largest Contentful Paint (<2.5s)
  cls: MetricRating; // Cumulative Layout Shift (<0.1)
  inp: MetricRating; // Interaction to Next Paint (<200ms)
  fcp: MetricRating; // First Contentful Paint (<1.8s)
  ttfb: MetricRating; // Time to First Byte (<800ms)
}

export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export interface BundleMetric {
  chunkName: string;
  sizeKb: number;
  gzipSizeKb: number;
  isLazy: boolean;
}

export interface PerformanceTelemetryReport {
  buildTimeMs: number;
  totalBundleSizeKb: number;
  totalGzipSizeKb: number;
  webVitals: CoreWebVitals;
  lighthouse: LighthouseScores;
  chunks: BundleMetric[];
  memoryUsageMb: number;
  activeListenersCount: number;
  timestamp: string;
}
