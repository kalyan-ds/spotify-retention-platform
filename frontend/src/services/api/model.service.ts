import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import { ModelRecord } from '../../types/dashboard';

export class ModelService {
  public static async getModelRegistry(): Promise<ModelRecord[]> {
    return apiClient.get<any, ModelRecord[]>(ENDPOINTS.MODELS.REGISTRY);
  }

  public static async getModelPerformance(): Promise<Array<{ label: string; value: number }>> {
    return apiClient.get<any, Array<{ label: string; value: number }>>(ENDPOINTS.MODELS.PERFORMANCE);
  }

  public static async getDeploymentPipeline(): Promise<any[]> {
    return apiClient.get<any, any[]>(ENDPOINTS.MODELS.PIPELINE);
  }
}
