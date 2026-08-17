import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import { AIHealthSummary, OperationsEvent, AlertRecord } from '../../types/dashboard';

export class MonitoringService {
  public static async getSystemHealth(): Promise<AIHealthSummary> {
    return apiClient.get<any, AIHealthSummary>(ENDPOINTS.HEALTH.SYSTEM_HEALTH);
  }

  public static async getDriftMetrics(): Promise<any[]> {
    return apiClient.get<any, any[]>(ENDPOINTS.HEALTH.DRIFT);
  }

  public static async getTimelineEvents(): Promise<OperationsEvent[]> {
    return apiClient.get<any, OperationsEvent[]>(ENDPOINTS.MONITORING.TIMELINE);
  }

  public static async getActiveAlerts(): Promise<AlertRecord[]> {
    return apiClient.get<any, AlertRecord[]>(ENDPOINTS.MONITORING.ALERTS);
  }
}
