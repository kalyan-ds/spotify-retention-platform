/**
 * Base Enterprise API Types & Standard Response Contracts
 * Spotify Premium Retention Intelligence Platform - Phase 7F.2.8.1
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PredictionResponse {
  predictionId: string;
  userId: number | string;
  churnProbability: number;
  riskTier: string;
  topFeatures?: Array<{ feature: string; shapValue: number }>;
  timestamp: string;
}

export interface ModelMetadata {
  modelId: string;
  name: string;
  version: string;
  algorithm: string;
  auc: number;
  status: string;
  trainedAt: string;
}

export interface HealthStatusResponse {
  status: string;
  score: number;
  services: Record<string, any>;
  timestamp: string;
}

export interface DriftResponse {
  featureName: string;
  psi: number;
  status: string;
  evaluatedAt: string;
}
