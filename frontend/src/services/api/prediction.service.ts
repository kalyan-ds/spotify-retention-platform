import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import { PredictionSummary, PredictionRecord } from '../../types/dashboard';

export class PredictionService {
  public static async getPredictionSummary(): Promise<PredictionSummary> {
    return apiClient.get<any, PredictionSummary>(ENDPOINTS.PREDICTIONS.SUMMARY);
  }

  public static async getPredictionTrends(): Promise<Array<{ label: string; value: number }>> {
    return apiClient.get<any, Array<{ label: string; value: number }>>(ENDPOINTS.PREDICTIONS.TRENDS);
  }

  public static async getConfidenceDistribution(): Promise<Array<{ label: string; value: number }>> {
    return apiClient.get<any, Array<{ label: string; value: number }>>(ENDPOINTS.PREDICTIONS.DISTRIBUTION);
  }

  public static async getRecentPredictions(): Promise<PredictionRecord[]> {
    return apiClient.get<any, PredictionRecord[]>(ENDPOINTS.PREDICTIONS.LOG);
  }
}
