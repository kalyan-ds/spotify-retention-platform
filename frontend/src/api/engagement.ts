import axios from 'axios';
import { StandardAnalyticsResponse, ExecutiveInsight } from './retention';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface ActiveUsersOverview {
  dau: number;
  wau: number;
  mau: number;
  stickiness_ratio: number;
}

export interface ActivityHeatmapPoint {
  hour: number;
  day_of_week: number;
  active_users: number;
}

export interface ActivityResponse {
  time_slot_breakdown: Record<string, number>;
  heatmap_points: ActivityHeatmapPoint[];
}

export interface SessionMetricsResponse {
  total_sessions: number;
  avg_duration_minutes: number;
  longest_session_minutes: number;
  sessions_per_user: number;
  device_breakdown: Record<string, number>;
  platform_breakdown: Record<string, number>;
}

export interface ListeningIntelligenceResponse {
  total_listening_hours: number;
  avg_listening_hours_per_user: number;
  completion_rate: number;
  skip_rate: number;
  replay_rate: number;
  songs_per_session: number;
  albums_per_session: number;
  artists_per_session: number;
}

export interface FeatureAdoptionMetric {
  feature_name: string;
  category: string;
  adoption_rate: number;
  growth_rate: number;
  retention_rate: number;
}

export interface FeatureAdoptionResponse {
  features: FeatureAdoptionMetric[];
}

export interface FunnelStep {
  step_number: number;
  step_name: string;
  user_count: number;
  conversion_rate: number;
  dropoff_rate: number;
}

export interface UserJourneyResponse {
  funnel_name: string;
  total_started: number;
  total_completed: number;
  overall_conversion_rate: number;
  steps: FunnelStep[];
}

export interface BehaviorSegmentPoint {
  segment_name: string;
  user_count: number;
  percentage: number;
  description?: string;
}

export interface BehaviorSegmentationResponse {
  total_users_classified: number;
  segments: BehaviorSegmentPoint[];
}

export interface SubScoreBreakdown {
  activity_score: number;
  volume_score: number;
  session_quality_score: number;
  feature_breadth_score: number;
}

export interface EngagementHealthResponse {
  overall_engagement_score: number;
  health_category: string;
  sub_scores: SubScoreBreakdown;
}

// -----------------------------------------
// API Fetchers
// -----------------------------------------

export const fetchEngagementOverview = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<ActiveUsersOverview>> => {
  const res = await axios.get(`${API_BASE_URL}/engagement/overview`, { params });
  return res.data;
};

export const fetchActivityBreakdown = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<ActivityResponse>> => {
  const res = await axios.get(`${API_BASE_URL}/engagement/activity`, { params });
  return res.data;
};

export const fetchSessionMetrics = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<SessionMetricsResponse>> => {
  const res = await axios.get(`${API_BASE_URL}/engagement/sessions`, { params });
  return res.data;
};

export const fetchListeningMetrics = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<ListeningIntelligenceResponse>> => {
  const res = await axios.get(`${API_BASE_URL}/engagement/listening`, { params });
  return res.data;
};

export const fetchFeatureAdoption = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<FeatureAdoptionResponse>> => {
  const res = await axios.get(`${API_BASE_URL}/engagement/features`, { params });
  return res.data;
};

export const fetchFunnelAnalysis = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<UserJourneyResponse>> => {
  const res = await axios.get(`${API_BASE_URL}/engagement/funnels`, { params });
  return res.data;
};

export const fetchBehaviorSegments = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<BehaviorSegmentationResponse>> => {
  const res = await axios.get(`${API_BASE_URL}/engagement/segments`, { params });
  return res.data;
};

export const fetchEngagementHealth = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<EngagementHealthResponse>> => {
  const res = await axios.get(`${API_BASE_URL}/engagement/health`, { params });
  return res.data;
};

export const fetchEngagementInsights = async (params?: Record<string, any>): Promise<StandardAnalyticsResponse<ExecutiveInsight[]>> => {
  const res = await axios.get(`${API_BASE_URL}/engagement/insights`, { params });
  return res.data;
};
