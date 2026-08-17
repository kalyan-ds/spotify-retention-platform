import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { User, UserRole, LoginCredentials, AuthState } from '../types/auth';
import { AuthService } from '../services/api/auth.service';
import { TokenStorage } from '../utils/tokenStorage';
import { logger } from '../utils/logger';
import { sessionManager } from '../utils/sessionManager';
import { auditLogger } from '../utils/auditLogger';
import { SessionWarningModal } from '../components/auth/SessionWarningModal';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(TokenStorage.getAccessToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const initAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = TokenStorage.getAccessToken();
      if (token && !TokenStorage.isTokenExpired(token)) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
        setAccessToken(token);
        auditLogger.logAuth('SESSION_RESTORED', currentUser.email, currentUser.role, 'SUCCESS');
      } else if (token && TokenStorage.isTokenExpired(token)) {
        logger.info('Access token expired, attempting refresh token rotation.');
        try {
          const authData = await AuthService.refreshToken();
          setUser(authData.user);
          setAccessToken(authData.tokens.accessToken);
          auditLogger.logAuth('TOKEN_REFRESH_SUCCESS', authData.user.email, authData.user.role, 'SUCCESS');
        } catch {
          TokenStorage.clearTokens();
          setUser(null);
          setAccessToken(null);
          auditLogger.logAuth('SESSION_EXPIRED', 'unknown', 'Viewer', 'FAILURE');
        }
      } else {
        // Default demo access profile
        const defaultUser: User = {
          id: 'user-001',
          name: 'AI Platform Administrator',
          email: 'cai-architect@spotify.com',
          role: 'Admin',
          department: 'AI Platform Engineering',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        };
        setUser(defaultUser);
      }
    } catch (err: any) {
      logger.error('Failed to initialize authentication session', err);
      setError(err.message || 'Session initialization failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Session Manager Lifecycle Event Binding
  useEffect(() => {
    const unsubExpired = sessionManager.on('SESSION_EXPIRED', () => {
      logger.warn('Automated idle session logout executed.');
      logout();
    });

    const unsubRefreshed = sessionManager.on('SESSION_REFRESHED', () => {
      refreshSession().catch(() => {});
    });

    return () => {
      unsubExpired();
      unsubRefreshed();
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const authData = await AuthService.login(credentials);
      setUser(authData.user);
      setAccessToken(authData.tokens.accessToken);
      sessionManager.notifyTokenRefresh();
      auditLogger.logAuth('USER_LOGIN_SUCCESS', authData.user.email, authData.user.role, 'SUCCESS', { provider: 'FastAPI REST Auth' });
      logger.info(`User logged in successfully as [${authData.user.role}]`, { email: authData.user.email });
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed. Please check your credentials.';
      setError(msg);
      auditLogger.logAuth('USER_LOGIN_FAILURE', credentials.email, credentials.role || 'Viewer', 'FAILURE', { reason: msg });
      logger.error('Login failure', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const prevUser = user;
    try {
      await AuthService.logout();
    } catch (err: any) {
      logger.error('Logout API call error', err);
    } finally {
      if (prevUser) {
        auditLogger.logAuth('USER_LOGOUT', prevUser.email, prevUser.role, 'SUCCESS');
      }
      setUser(null);
      setAccessToken(null);
      queryClient.clear(); // Clear React Query cache on secure logout
      sessionManager.notifyLogout();
      setIsLoading(false);
      logger.info('User session and query cache cleared successfully.');
    }
  };

  const refreshSession = async () => {
    try {
      const authData = await AuthService.refreshToken();
      setUser(authData.user);
      setAccessToken(authData.tokens.accessToken);
      sessionManager.notifyTokenRefresh();
      auditLogger.logAuth('REFRESH_TOKEN', authData.user.email, authData.user.role, 'SUCCESS');
    } catch (err) {
      if (user) {
        auditLogger.logAuth('REFRESH_TOKEN_FAILURE', user.email, user.role, 'FAILURE');
      }
      TokenStorage.clearTokens();
      setUser(null);
      setAccessToken(null);
      queryClient.clear();
      throw err;
    }
  };

  const handleStaySignedIn = () => {
    sessionManager.staySignedIn();
    refreshSession().catch(() => {});
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        hasRole,
        refreshSession
      }}
    >
      {children}
      {isAuthenticated && (
        <SessionWarningModal
          onStaySignedIn={handleStaySignedIn}
          onLogout={logout}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
