import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import { ExecutiveKPI } from '../../types/dashboard';

export class DashboardService {
  public static async getExecutiveKPIs(): Promise<ExecutiveKPI[]> {
    return apiClient.get<any, ExecutiveKPI[]>(ENDPOINTS.DASHBOARD.KPIS);
  }

  public static async getExecutiveOverview(): Promise<Record<string, any>> {
    return apiClient.get<any, Record<string, any>>(ENDPOINTS.DASHBOARD.EXECUTIVE_OVERVIEW);
  }
}
