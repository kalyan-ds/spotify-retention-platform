/**
 * Enterprise Security Validation & Threat Modeling Schemas
 * Spotify Premium Retention Intelligence Platform - Version 2.0 Phase 1.8D
 */

export interface OWASPEntry {
  code: string;
  title: string;
  status: 'MITIGATED' | 'ACCEPTED' | 'NOT_APPLICABLE';
  mitigation: string;
  remainingRisk: string;
  futureRecommendation: string;
}

export interface ThreatItem {
  id: string;
  asset: string;
  threat: string;
  actor: string;
  entryPoint: string;
  mitigation: string;
  residualRisk: 'LOW' | 'VERY_LOW' | 'NONE';
}

export interface RiskItem {
  id: string;
  title: string;
  type: 'RESOLVED' | 'ACCEPTED' | 'FUTURE';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  mitigation: string;
}

export interface SecurityComplianceReport {
  overallScore: number;
  rating: 'SECURITY POSTURE VERIFIED';
  authHealth: number;
  rbacHealth: number;
  sessionHealth: number;
  auditHealth: number;
  configHealth: number;
  owaspEntries: OWASPEntry[];
  threats: ThreatItem[];
  risks: RiskItem[];
  timestamp: string;
}
