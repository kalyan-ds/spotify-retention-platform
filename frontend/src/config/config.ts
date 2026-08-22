/**
 * Centralized Enterprise Application & Environment Configuration
 * Spotify Premium Retention Intelligence Platform - Phase 7F.2.8.4
 */

import { normalizeApiBaseUrl } from '../utils/url';

export interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
  enableTelemetry: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  defaultTimeoutMs: number;
  maxRetries: number;
}

export const config: AppConfig = {
  apiBaseUrl: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  environment: (import.meta.env.VITE_APP_ENV as AppConfig['environment']) || 'production',
  enableTelemetry: import.meta.env.VITE_ENABLE_TELEMETRY !== 'false',
  logLevel: (import.meta.env.VITE_LOG_LEVEL as AppConfig['logLevel']) || 'info',
  defaultTimeoutMs: parseInt(import.meta.env.VITE_DEFAULT_TIMEOUT || '10000', 10),
  maxRetries: 2
};
