/**
 * Enterprise Security Hardening & Health Telemetry Types
 * Spotify Premium Retention Intelligence Platform - Version 2.0 Phase 1.7
 */

export type SecuritySubsystem =
  | 'AUTHENTICATION'
  | 'JWT_STORAGE'
  | 'RBAC'
  | 'SESSION_LIFECYCLE'
  | 'AUDIT_LOGGING'
  | 'CSP_HEADERS'
  | 'CONFIG_VALIDATION';

export interface SecurityHealthItem {
  id: string;
  subsystem: SecuritySubsystem;
  name: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  score: number;
  details: string;
  recommendation?: string;
}

export interface SecurityHealthReport {
  overallScore: number;
  rating: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL';
  timestamp: string;
  items: SecurityHealthItem[];
}

export interface TrustedDevice {
  deviceId: string;
  browser: string;
  os: string;
  lastActive: string;
  isCurrent: boolean;
  isTrusted: boolean;
}

export interface OWASPChecklistItem {
  code: string;
  title: string;
  status: 'COMPLIANT' | 'MITIGATED' | 'REVIEW';
  description: string;
}
