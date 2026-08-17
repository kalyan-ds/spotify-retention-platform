/**
 * Enterprise Authentication & Identity Management Types
 * Spotify Premium Retention Intelligence Platform - Version 2.0 Phase 1.1
 */

export type UserRole = 'Admin' | 'Analyst' | 'Viewer';

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  lastLoginAt?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}

export interface AuthTokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokenPair;
}

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  exp: number;
  iat: number;
  iss?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
