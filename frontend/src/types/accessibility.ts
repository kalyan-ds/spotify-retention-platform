/**
 * Enterprise Accessibility (WCAG 2.2 AA) Audit Schemas
 * Spotify Premium Retention Intelligence Platform - Version 2.0 Phase 1.8C
 */

export type WCAGPrinciple = 'Perceivable' | 'Operable' | 'Understandable' | 'Robust';

export interface WCAGCriterion {
  id: string;
  name: string;
  level: 'A' | 'AA' | 'AAA';
  principle: WCAGPrinciple;
  status: 'PASS' | 'WARN' | 'FAIL';
  details: string;
}

export interface AccessibilitySubsystem {
  id: string;
  name: string;
  score: number;
  status: 'PASS' | 'WARN' | 'FAIL';
  details: string;
}

export interface AccessibilityAuditReport {
  overallScore: number;
  rating: 'WCAG 2.2 AA VERIFIED' | 'NEEDS_REVISION';
  principlesScore: Record<WCAGPrinciple, number>;
  subsystems: AccessibilitySubsystem[];
  criteria: WCAGCriterion[];
  timestamp: string;
}
