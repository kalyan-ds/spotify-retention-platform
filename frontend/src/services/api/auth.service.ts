/**
 * Enterprise Authentication REST API Service
 * Spotify Premium Retention Intelligence Platform - Version 2.0 Phase 1.3
 */

import { apiClient } from './axios';
import { LoginCredentials, AuthResponse, User, UserRole } from '../../types/auth';
import { TokenStorage } from '../../utils/tokenStorage';
import { logger } from '../../utils/logger';

const MOCK_USERS: Record<UserRole, User> = {
  Admin: {
    id: 'user-001',
    name: 'AI Platform Administrator',
    email: 'cai-architect@spotify.com',
    role: 'Admin',
    department: 'AI Platform Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    lastLoginAt: new Date().toISOString()
  },
  Analyst: {
    id: 'user-002',
    name: 'Senior Retention Data Scientist',
    email: 'data-analyst@spotify.com',
    role: 'Analyst',
    department: 'Customer Intelligence & Analytics',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastLoginAt: new Date().toISOString()
  },
  Viewer: {
    id: 'user-003',
    name: 'Executive Leadership Viewer',
    email: 'executive-viewer@spotify.com',
    role: 'Viewer',
    department: 'Executive Leadership',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    lastLoginAt: new Date().toISOString()
  }
};

export class AuthService {
  public static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<any, AuthResponse>('/auth/login', credentials);
      if (response && response.tokens) {
        TokenStorage.setTokens(response.tokens);
        return response;
      }
    } catch (err) {
      logger.warn('Backend REST auth endpoint unavailable, employing enterprise demo mode.', { err });
    }

    // Demo Authentication Response Fallback
    const selectedRole: UserRole = credentials.role || 'Admin';
    const user = { ...MOCK_USERS[selectedRole] };
    if (credentials.email) {
      user.email = credentials.email;
    }

    const fakePayload = {
      sub: String(user.id),
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000)
    };
    const encodedPayload = btoa(JSON.stringify(fakePayload));
    const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodedPayload}.mock_signature`;

    const authResponse: AuthResponse = {
      user,
      tokens: {
        accessToken: fakeToken,
        refreshToken: `refresh_${fakeToken}`,
        expiresIn: 86400
      }
    };

    TokenStorage.setTokens(authResponse.tokens);
    return authResponse;
  }

  public static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      logger.warn('Logout API endpoint offline, clearing client storage.', { err });
    } finally {
      TokenStorage.clearTokens();
    }
  }

  public static async refreshToken(): Promise<AuthResponse> {
    const refreshToken = TokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiClient.post<any, AuthResponse>('/auth/refresh', { refreshToken });
      if (response && response.tokens) {
        TokenStorage.setTokens(response.tokens);
        return response;
      }
    } catch (err) {
      logger.warn('Refresh token REST endpoint offline.', { err });
    }

    // Demo Refresh Token Rotation
    const token = TokenStorage.getAccessToken();
    if (token) {
      const payload = TokenStorage.decodeToken(token);
      if (payload) {
        const user = MOCK_USERS[payload.role] || MOCK_USERS.Admin;
        const newPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + 86400 };
        const newAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(newPayload))}.mock_signature`;

        const authResponse: AuthResponse = {
          user,
          tokens: {
            accessToken: newAccessToken,
            refreshToken,
            expiresIn: 86400
          }
        };
        TokenStorage.setTokens(authResponse.tokens);
        return authResponse;
      }
    }

    throw new Error('Session refresh failed');
  }

  public static async getCurrentUser(): Promise<User> {
    try {
      const user = await apiClient.get<any, User>('/auth/me');
      if (user && user.email) return user;
    } catch (err) {
      // Fall back to stored token claim decoding
    }

    const token = TokenStorage.getAccessToken();
    if (!token) {
      throw new Error('No active access token');
    }

    const payload = TokenStorage.decodeToken(token);
    if (payload && payload.role) {
      const role = payload.role as UserRole;
      const u = { ...MOCK_USERS[role] };
      if (payload.email) u.email = payload.email;
      if (payload.name) u.name = payload.name;
      return u;
    }

    return MOCK_USERS.Admin;
  }
}
