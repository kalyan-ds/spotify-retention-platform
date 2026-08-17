/**
 * Enterprise Production Deployment & Readiness Schemas
 * Spotify Premium Retention Intelligence Platform - Version 2.0 Phase 1.8F
 */

export interface HealthProbe {
  endpoint: string;
  type: 'LIVENESS' | 'READINESS' | 'SYSTEM';
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  expectedResponse: string;
}

export interface EnvVariableAudit {
  name: string;
  scope: 'CLIENT' | 'SERVER';
  status: 'VALIDATED';
  valuePreview: string;
}

export interface ReleaseGateItem {
  category: string;
  metric: string;
  score: string;
  status: 'PASSED';
}

export interface ProductionDeploymentReport {
  readinessScore: number;
  status: 'PRODUCTION APPROVED';
  buildDurationMs: number;
  probes: HealthProbe[];
  envVars: EnvVariableAudit[];
  gates: ReleaseGateItem[];
  timestamp: string;
}
