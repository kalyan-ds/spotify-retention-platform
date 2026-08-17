import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface SHAPAttribution {
  feature_name: string;
  shap_value: number;
  feature_value: any;
  business_explanation: string;
}

export interface ChurnPredictionResponse {
  user_id: number;
  churn_probability: number;
  risk_tier: 'Low' | 'Medium' | 'High' | 'Critical';
  predicted_churn_days: number;
  shap_attributions: SHAPAttribution[];
  model_version: string;
  computed_at: string;
}

export interface EngagementScoreResponse {
  user_id: number;
  engagement_score: number;
  predicted_persona: string;
  activity_subscore: number;
  volume_subscore: number;
  feature_subscore: number;
  model_version: string;
  computed_at: string;
}

export interface NextBestActionItem {
  action_code: string;
  action_category: string;
  title: string;
  description: string;
  expected_impact_percentage: number;
  confidence_score: number;
}

export interface RecommendationResponse {
  user_id: number;
  primary_recommendation: NextBestActionItem;
  alternative_recommendations: NextBestActionItem[];
  generated_at: string;
}

export interface ModelMetadata {
  model_id: string;
  model_name: string;
  model_type: string;
  version: string;
  stage: string;
  auc_roc?: number;
  rmse?: number;
  last_trained_at: string;
}

export interface ModelCatalogResponse {
  active_models: ModelMetadata[];
}

export interface DriftMetricsResponse {
  psi_score: number;
  drift_detected: boolean;
  monitored_features: number;
  status: string;
  last_evaluated_at: string;
}

export const fetchChurnPrediction = async (userId: number = 1): Promise<ChurnPredictionResponse> => {
  const res = await axios.post(`${API_BASE_URL}/ai/predict/churn`, {
    user_id: userId,
    include_explanations: true,
    include_recommendations: true
  });
  return res.data;
};

export const fetchEngagementPrediction = async (userId: number = 1): Promise<EngagementScoreResponse> => {
  const res = await axios.post(`${API_BASE_URL}/ai/predict/engagement`, {
    user_id: userId
  });
  return res.data;
};

export const fetchRecommendations = async (userId: number = 1): Promise<RecommendationResponse> => {
  const res = await axios.post(`${API_BASE_URL}/ai/recommendations`, {
    user_id: userId
  });
  return res.data;
};

export const fetchModelCatalog = async (): Promise<ModelCatalogResponse> => {
  const res = await axios.get(`${API_BASE_URL}/ai/models`);
  return res.data;
};

export const fetchDriftMetrics = async (): Promise<DriftMetricsResponse> => {
  const res = await axios.get(`${API_BASE_URL}/ai/drift`);
  return res.data;
};
