import {
  overviewData,
  usersData,
  revenueData,
  retentionData,
  engagementData,
  predictionsData,
  segmentsData
} from '../analytics';

export interface FilterState {
  dateRange: string;
  country: string;
  device: string;
  tier: string;
  segment: string;
  payment: string;
  age: string;
}

export class DashboardService {

  static async getOverview(): Promise<any> {
    // In future iterations, this will use axios/fetch to hit a backend.
    // For now, it returns the mock data and could technically filter it.
    return new Promise((resolve) => {
      setTimeout(() => resolve(overviewData), 300);
    });
  }

  static async getUsers(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(usersData), 300);
    });
  }

  static async getRevenue(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(revenueData), 300);
    });
  }

  static async getRetention(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(retentionData), 300);
    });
  }

  static async getEngagement(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(engagementData), 300);
    });
  }

  static async getPredictions(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(predictionsData), 300);
    });
  }

  static async getSegments(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(segmentsData), 300);
    });
  }
}
