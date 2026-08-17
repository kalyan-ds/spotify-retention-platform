/**
 * Enterprise Audit Event & Activity Monitoring Schemas
 * Spotify Premium Retention Intelligence Platform - Version 2.0 Phase 1.6
 */

import { UserRole } from '../auth';

export type AuditCategory =
  | 'AUTHENTICATION'
  | 'AUTHORIZATION'
  | 'AI_ENGINE'
  | 'DASHBOARD'
  | 'SECURITY'
  | 'SYSTEM';

export type AuditSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'SECURITY' | 'CRITICAL';

export type AuditResult = 'SUCCESS' | 'FAILURE' | 'DENIED' | 'PENDING';

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  category: AuditCategory;
  action: string;
  resource: string;
  result: AuditResult;
  severity: AuditSeverity;
  correlationId: string;
  sessionId: string;
  eventSource: string;
  tags: string[];
  metadata: Record<string, any>;
}

export interface AuditFilterOptions {
  searchQuery?: string;
  category?: AuditCategory | 'ALL';
  severity?: AuditSeverity | 'ALL';
  user?: string;
  dateRange?: 'TODAY' | '7D' | '30D' | 'ALL';
}

export interface AuditAnalyticsSummary {
  totalLogsCount: number;
  securityEventsCount: number;
  accessDeniedCount: number;
  criticalSeverityCount: number;
}
