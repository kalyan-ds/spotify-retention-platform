import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import { RecommendationRecord } from '../../types/dashboard';

export class RecommendationService {
  public static async getRecommendationSummary(): Promise<Record<string, any>> {
    return apiClient.get<any, Record<string, any>>(ENDPOINTS.RECOMMENDATIONS.SUMMARY);
  }

  public static async getPriorityDistribution(): Promise<Array<{ label: string; value: number; color: string }>> {
    return apiClient.get<any, Array<{ label: string; value: number; color: string }>>(ENDPOINTS.RECOMMENDATIONS.PRIORITY);
  }

  public static async getCategoryBreakdown(): Promise<Array<{ label: string; value: number }>> {
    return apiClient.get<any, Array<{ label: string; value: number }>>(ENDPOINTS.RECOMMENDATIONS.CATEGORIES);
  }

  public static async getImpactMatrix(): Promise<any[]> {
    return apiClient.get<any, any[]>(ENDPOINTS.RECOMMENDATIONS.IMPACT_MATRIX);
  }

  public static async getTopRecommendations(): Promise<RecommendationRecord[]> {
    return apiClient.get<any, RecommendationRecord[]>(ENDPOINTS.RECOMMENDATIONS.QUEUE);
  }
}
