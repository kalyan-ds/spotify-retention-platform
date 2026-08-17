/**
 * Enterprise Token Storage & JWT Lifecycle Utility
 * Spotify Premium Retention Intelligence Platform - Version 2.0 Phase 1.1
 */

import { JWTPayload, AuthTokenPair } from '../types/auth';

const ACCESS_TOKEN_KEY = 'spotify_auth_access_token';
const REFRESH_TOKEN_KEY = 'spotify_auth_refresh_token';
const USER_DATA_KEY = 'spotify_auth_user_data';

export class TokenStorage {
  public static getAccessToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  public static getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  public static setTokens(tokens: AuthTokenPair): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    } catch (error) {
      console.error('Failed to store authentication tokens in localStorage:', error);
    }
  }

  public static clearTokens(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Failed to clear authentication tokens:', error);
    }
  }

  public static decodeToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as JWTPayload;
    } catch {
      return null;
    }
  }

  public static isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    // Buffer by 30 seconds for clock skew tolerance
    return payload.exp < nowInSeconds + 30;
  }
}
