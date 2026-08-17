/**
 * Dashboard & Domain Entity Types
 * Spotify Premium Retention Intelligence Platform - Phase 7F.2.8.1
 */

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: any;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  metric?: string;
  subtitle?: string;
  trend?: string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral' | 'increase' | 'decrease' | string;
  timeframe?: string;
  icon?: string;
  [key: string]: any;
}

export interface KpiMetric {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  target?: string | number;
  trend?: string;
  status?: string;
  change?: any;
  changeType?: 'positive' | 'negative' | 'neutral' | 'increase' | 'decrease' | string;
  timeframe?: string;
  description?: string;
  [key: string]: any;
}

export interface FilterState {
  dateRange?: string;
  timeframe?: string;
  model?: string;
  riskTier?: string;
  segment?: string;
  [key: string]: any;
}

export type KPIStatusType = 'Excellent' | 'Healthy' | 'Stable' | 'Busy' | 'Optimized';

export interface ExecutiveKPI {
  id: string;
  title: string;
  value: string | number;
  trend: string;
  status: KPIStatusType;
  sparklineData: number[];
  accentColor: string;
  invertTrendColor?: boolean;
}

export type HealthStatusType = 'Healthy' | 'Warning' | 'Offline' | 'Critical';

export interface MicroserviceHealth {
  id: string;
  name: string;
  status: HealthStatusType;
  uptime: string;
  latency: string;
  accentColor: string;
}

export interface AIHealthSummary {
  overallScore: number;
  status: HealthStatusType;
  lastCheck: string;
  environment: string;
  healthyModelsCount: number;
  degradedModelsCount: number;
  offlineModelsCount: number;
  warningsCount: number;
  services: MicroserviceHealth[];
}

export interface PredictionSummary {
  totalPredictions: number;
  highConfidenceRate: number;
  avgProcessingTimeMs: number;
  successRate: number;
}

export interface PredictionRecord {
  id: string;
  segment: string;
  type: string;
  confidence: string;
  status: 'Completed' | 'Pending' | 'Healthy';
  time: string;
}

export interface RecommendationRecord {
  id: string;
  title: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence: number;
  impact: string;
  segment: string;
  status: 'Ready' | 'Scheduled' | 'In Progress' | 'Completed';
  created: string;
}

export type ModelStatusType = 'Training' | 'Ready' | 'Production' | 'Archived' | 'Monitoring' | 'Deprecated';

export interface ModelRecord {
  id: string;
  name: string;
  version: string;
  status: ModelStatusType;
  accuracy: string;
  latency: string;
  deployed: string;
  environment: string;
}

export type AlertSeverityLevel = 'Information' | 'Notice' | 'Warning' | 'High' | 'Critical';

export interface AlertRecord {
  id: string;
  title: string;
  severity: AlertSeverityLevel;
  status: 'Open' | 'Acknowledged' | 'Investigating' | 'Resolved';
  service: string;
  created: string;
  team: string;
}

export interface OperationsEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  severity: AlertSeverityLevel;
  source: string;
}
