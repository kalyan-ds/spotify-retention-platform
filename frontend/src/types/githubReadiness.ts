/**
 * Enterprise GitHub Readiness & Community Standard Schemas
 * Spotify Premium Retention Intelligence Platform - Version 2.0 Phase 1.8G
 */

export interface CommunityStandardItem {
  filename: string;
  category: string;
  status: 'CERTIFIED';
  details: string;
}

export interface GitHubReadinessReport {
  readinessScore: number;
  rating: 'OPEN SOURCE READY';
  license: string;
  ciStatus: 'ACTIVE & PASSING';
  standards: CommunityStandardItem[];
  timestamp: string;
}
