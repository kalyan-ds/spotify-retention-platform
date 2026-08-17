import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface StandardAnalyticsResponse<T> {
  data: T;
  filters_applied: Record<string, any>;
  timestamp: string;
}

export interface KPIMetric {
  name: string;
  value: number;
  delta_percentage: number;
  trend_direction: 'up' | 'down' | 'flat';
}

export interface KPICollectionResponse {
  metrics: KPIMetric[];
}

export interface CohortCell {
  period: number;
  active_users: number;
  retention_percentage: number;
}

export interface CohortRow {
  cohort_date: string;
  initial_size: number;
  cells: CohortCell[];
}

export interface CohortMatrixResponse {
  granularity: string;
  rows: CohortRow[];
}

export interface UserPersona {
  persona_name: string;
  user_count: number;
  percentage_of_base: number;
  description?: string;
}

export interface SubScoreBreakdown {
  activity_score: number;
  volume_score: number;
  session_quality_score: number;
  feature_breadth_score: number;
}

export interface RetentionHealthResponse {
  overall_health_score: number;
  health_category: 'Excellent' | 'Good' | 'Average' | 'Poor' | 'Critical';
  personas: UserPersona[];
}

export interface ChurnSegment {
  segment_name: string;
  churn_count: number;
  churn_rate: number;
}

export interface ChurnDistributionResponse {
  total_churned: number;
  overall_churn_rate: number;
  segments: ChurnSegment[];
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface TrendSeriesResponse {
  metric_name: string;
  data_points: TrendPoint[];
}

export interface ExecutiveInsight {
  title: string;
  category: 'Positive' | 'Negative' | 'Actionable';
  impact: 'High' | 'Medium' | 'Low';
  description: string;
}

// -----------------------------------------
// API Fetchers
// -----------------------------------------

export const fetchRetentionOverview = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<any>> => {
  const res = await axios.get(`${API_BASE_URL}/analytics/overview`, { params });
  return res.data;
};

export const fetchChurnKPIs = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<KPICollectionResponse>> => {
  const res = await axios.get(`${API_BASE_URL}/retention/churn/kpis`, { params });
  return res.data;
};

export const fetchRetentionHealth = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<RetentionHealthResponse>> => {
  const res = await axios.get(`${API_BASE_URL}/retention/health`, { params });
  return res.data;
};

export const fetchCohortMatrix = async (granularity = 'monthly', params?: Record<string, any>): Promise<StandardAnalyticsResponse<CohortMatrixResponse>> => {
  const res = await axios.get(`${API_BASE_URL}/retention/cohorts`, { params: { granularity, ...params } });
  return res.data;
};

export const fetchChurnDistribution = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<ChurnDistributionResponse>> => {
  const res = await axios.get(`${API_BASE_URL}/retention/churn`, { params });
  return res.data;
};

export const fetchRetentionTrends = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<TrendSeriesResponse>> => {
  const res = await axios.get(`${API_BASE_URL}/retention/trends`, { params });
  return res.data;
};

export const fetchExecutiveInsights = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<ExecutiveInsight[]>> => {
  const res = await axios.get(`${API_BASE_URL}/retention/insights`, { params });
  return res.data;
};
