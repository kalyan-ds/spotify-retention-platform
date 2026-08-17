/**
 * Enterprise Audit Logging Service & Telemetry Buffer
 * Spotify Premium Retention Intelligence Platform - Version 2.0 Phase 1.6
 */

import { AuditEvent, AuditResult, AuditFilterOptions, AuditAnalyticsSummary } from '../types/audit';
import { UserRole } from '../types/auth';
import { logger } from './logger';

const AUDIT_STORAGE_KEY = 'spotify_enterprise_audit_logs';

const INITIAL_SEED_EVENTS: AuditEvent[] = [
  {
    id: 'AUD-9001',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    user: 'cai-architect@spotify.com',
    role: 'Admin',
    category: 'AUTHENTICATION',
    action: 'USER_LOGIN_SUCCESS',
    resource: '/auth/login',
    result: 'SUCCESS',
    severity: 'INFO',
    correlationId: 'req-1722600000-a1b2c',
    sessionId: 'sess-84920',
    eventSource: 'OAuth 2.0 / Bearer Auth',
    tags: ['auth', 'login', 'sso'],
    metadata: { ip: '192.168.1.10', userAgent: 'Chrome on macOS' }
  },
  {
    id: 'AUD-9002',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    user: 'cai-architect@spotify.com',
    role: 'Admin',
    category: 'AI_ENGINE',
    action: 'CHURN_PREDICTION_EXECUTED',
    resource: 'InferenceEngine::BatchPredict',
    result: 'SUCCESS',
    severity: 'INFO',
    correlationId: 'req-1722599400-f3e4d',
    sessionId: 'sess-84920',
    eventSource: 'Prediction API',
    tags: ['ai', 'prediction', 'batch'],
    metadata: { batchSize: 128450, highRiskCount: 1420 }
  },
  {
    id: 'AUD-9003',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    user: 'executive-viewer@spotify.com',
    role: 'Viewer',
    category: 'AUTHORIZATION',
    action: 'PERMISSION_DENIED_ADMIN_ACTION',
    resource: '/models/deploy',
    result: 'DENIED',
    severity: 'WARNING',
    correlationId: 'req-1722598200-x9y8z',
    sessionId: 'sess-77210',
    eventSource: 'ProtectedRoute Guard',
    tags: ['rbac', 'access-denied', '403'],
    metadata: { requiredRole: 'Admin', userRole: 'Viewer' }
  },
  {
    id: 'AUD-9004',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    user: 'data-analyst@spotify.com',
    role: 'Analyst',
    category: 'AI_ENGINE',
    action: 'RECOMMENDATION_ACCEPTED',
    resource: 'NextBestActionEngine::REC-4029',
    result: 'SUCCESS',
    severity: 'INFO',
    correlationId: 'req-1722596400-p5q4r',
    sessionId: 'sess-66109',
    eventSource: 'Recommendation Dashboard',
    tags: ['ai', 'nba', 'recommendation'],
    metadata: { recommendationId: 'REC-4029', expectedImpact: '$420K ARR' }
  },
  {
    id: 'AUD-9005',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    user: 'system',
    role: 'Admin',
    category: 'SECURITY',
    action: 'FEATURE_DRIFT_THRESHOLD_EXCEEDED',
    resource: 'PSI::ListeningDiversity',
    result: 'FAILURE',
    severity: 'SECURITY',
    correlationId: 'req-1722592800-k1l2m',
    sessionId: 'system-cron',
    eventSource: 'PSI Audit Pipeline',
    tags: ['security', 'drift', 'alert'],
    metadata: { feature: 'ListeningDiversity', psiScore: 0.28, threshold: 0.20 }
  }
];

export class AuditLoggerService {
  private static instance: AuditLoggerService | null = null;
  private events: AuditEvent[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): AuditLoggerService {
    if (!AuditLoggerService.instance) {
      AuditLoggerService.instance = new AuditLoggerService();
    }
    return AuditLoggerService.instance;
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') {
      this.events = INITIAL_SEED_EVENTS;
      return;
    }

    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      } else {
        this.events = INITIAL_SEED_EVENTS;
        this.saveToStorage();
      }
    } catch {
      this.events = INITIAL_SEED_EVENTS;
    }
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.events));
    } catch (err) {
      logger.warn('Failed to save audit logs to localStorage', { err });
    }
  }

  public log(eventData: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const newEvent: AuditEvent = {
      ...eventData,
      id: `AUD-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };

    this.events.unshift(newEvent);
    // Maintain maximum buffer of 500 logs locally
    if (this.events.length > 500) {
      this.events = this.events.slice(0, 500);
    }

    this.saveToStorage();
    logger.info(`Audit Event Captured [${newEvent.category}] ${newEvent.action}`, { id: newEvent.id });
    return newEvent;
  }

  public logAuth(action: string, user: string, role: UserRole, result: AuditResult, metadata: Record<string, any> = {}): AuditEvent {
    return this.log({
      user,
      role,
      category: 'AUTHENTICATION',
      action,
      resource: '/auth',
      result,
      severity: result === 'SUCCESS' ? 'INFO' : 'WARNING',
      correlationId: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sessionId: `sess-${Date.now().toString().slice(-5)}`,
      eventSource: 'OAuth 2.0 / Bearer Auth',
      tags: ['auth', action.toLowerCase()],
      metadata
    });
  }

  public logRbac(action: string, user: string, role: UserRole, result: AuditResult, metadata: Record<string, any> = {}): AuditEvent {
    return this.log({
      user,
      role,
      category: 'AUTHORIZATION',
      action,
      resource: metadata.resource || '/protected-route',
      result,
      severity: result === 'DENIED' ? 'WARNING' : 'INFO',
      correlationId: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sessionId: `sess-${Date.now().toString().slice(-5)}`,
      eventSource: 'ProtectedRoute Guard',
      tags: ['rbac', action.toLowerCase()],
      metadata
    });
  }

  public logAi(action: string, user: string, role: UserRole, resource: string, metadata: Record<string, any> = {}): AuditEvent {
    return this.log({
      user,
      role,
      category: 'AI_ENGINE',
      action,
      resource,
      result: 'SUCCESS',
      severity: 'INFO',
      correlationId: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sessionId: `sess-${Date.now().toString().slice(-5)}`,
      eventSource: 'AI Intelligence Engine',
      tags: ['ai', action.toLowerCase()],
      metadata
    });
  }

  public logDashboard(action: string, user: string, role: UserRole, resource: string, metadata: Record<string, any> = {}): AuditEvent {
    return this.log({
      user,
      role,
      category: 'DASHBOARD',
      action,
      resource,
      result: 'SUCCESS',
      severity: 'INFO',
      correlationId: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sessionId: `sess-${Date.now().toString().slice(-5)}`,
      eventSource: 'UI Web Shell',
      tags: ['dashboard', action.toLowerCase()],
      metadata
    });
  }

  public getEvents(options: AuditFilterOptions = {}): AuditEvent[] {
    let filtered = [...this.events];

    if (options.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      filtered = filtered.filter(
        e =>
          e.action.toLowerCase().includes(q) ||
          e.user.toLowerCase().includes(q) ||
          e.resource.toLowerCase().includes(q) ||
          e.correlationId.toLowerCase().includes(q)
      );
    }

    if (options.category && options.category !== 'ALL') {
      filtered = filtered.filter(e => e.category === options.category);
    }

    if (options.severity && options.severity !== 'ALL') {
      filtered = filtered.filter(e => e.severity === options.severity);
    }

    if (options.user && options.user !== 'ALL') {
      filtered = filtered.filter(e => e.user === options.user);
    }

    return filtered;
  }

  public getAnalyticsSummary(): AuditAnalyticsSummary {
    return {
      totalLogsCount: this.events.length,
      securityEventsCount: this.events.filter(e => e.category === 'SECURITY' || e.severity === 'SECURITY').length,
      accessDeniedCount: this.events.filter(e => e.result === 'DENIED').length,
      criticalSeverityCount: this.events.filter(e => e.severity === 'CRITICAL' || e.severity === 'ERROR').length
    };
  }

  public exportToCSV(events: AuditEvent[]): void {
    if (typeof window === 'undefined') return;
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Category', 'Action', 'Resource', 'Result', 'Severity', 'Correlation ID'];
    const rows = events.map(e => [
      e.id,
      e.timestamp,
      e.user,
      e.role,
      e.category,
      e.action,
      e.resource,
      e.result,
      e.severity,
      e.correlationId
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `spotify_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public exportToJSON(events: AuditEvent[]): void {
    if (typeof window === 'undefined') return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `spotify_audit_logs_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const auditLogger = AuditLoggerService.getInstance();
