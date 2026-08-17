/**
 * Enterprise Session Lifecycle Manager & Multi-Tab Synchronization
 * Spotify Premium Retention Intelligence Platform - Version 2.0 Phase 1.5
 */

import { logger } from './logger';
import { TokenStorage } from './tokenStorage';

export type SessionStatus = 'Healthy' | 'Warning' | 'Refreshing' | 'Expired' | 'Offline';

export interface SessionMetadata {
  loginTime: Date;
  lastActivityTime: Date;
  deviceBrowser: string;
  sessionDurationSeconds: number;
  idleTimeSeconds: number;
  status: SessionStatus;
}

export type SessionEventType = 'WARNING_STARTED' | 'WARNING_CANCELLED' | 'SESSION_EXPIRED' | 'SESSION_REFRESHED' | 'LOGOUT';

type EventCallback = (data?: any) => void;

const BROADCAST_CHANNEL_NAME = 'spotify_enterprise_session_channel';

// Default thresholds: 15 minutes idle limit, 2 minutes warning countdown
const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const WARNING_WINDOW_MS = 2 * 60 * 1000;
const HEARTBEAT_INTERVAL_MS = 60 * 1000;

export class SessionManager {
  private static instance: SessionManager | null = null;

  private loginTime: Date = new Date();
  private lastActivityTime: Date = new Date();
  private idleTimer: any = null;
  private warningTimer: any = null;
  private heartbeatTimer: any = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Map<SessionEventType, Set<EventCallback>> = new Map();
  private isWarningActive: boolean = false;
  private isOffline: boolean = typeof navigator !== 'undefined' ? !navigator.onLine : false;
  private activityHandler: (() => void) | null = null;

  private constructor() {
    this.setupBroadcastChannel();
    this.setupActivityListeners();
    this.setupOnlineListeners();
    this.startHeartbeat();
    this.resetIdleTimer();
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Multi-Tab Synchronization Channel Setup
   */
  private setupBroadcastChannel(): void {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.broadcastChannel.onmessage = (event) => {
          const { type, payload } = event.data || {};
          logger.info(`Multi-tab session event received [${type}]`, payload);
          switch (type) {
            case 'LOGOUT':
              this.emit('SESSION_EXPIRED');
              break;
            case 'STAY_SIGNED_IN':
              this.handleRemoteStaySignedIn();
              break;
            case 'REFRESH_TOKEN':
              this.emit('SESSION_REFRESHED');
              break;
          }
        };
      } catch (err) {
        logger.warn('BroadcastChannel initialization fallback.', { err });
      }
    }
  }

  private broadcast(type: string, payload?: any): void {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type, payload });
      } catch (err) {
        logger.warn('Broadcast message failed', { err });
      }
    }
  }

  /**
   * User Activity Event Detection
   */
  private setupActivityListeners(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    this.activityHandler = () => {
      // Ignore background mouse movement when warning modal is actively prompting user
      if (this.isWarningActive) return;
      this.lastActivityTime = new Date();
      this.resetIdleTimer();
    };

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(evt => window.addEventListener(evt, this.activityHandler!, { passive: true }));

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.lastActivityTime = new Date();
        this.resetIdleTimer();
      }
    });
  }

  private setupOnlineListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOffline = false;
      logger.info('Network connection restored. Resuming session heartbeat.');
      this.resetIdleTimer();
    });

    window.addEventListener('offline', () => {
      this.isOffline = true;
      logger.warn('Network offline detected. Preserving cached session state.');
    });
  }

  /**
   * Idle Timer Countdown Management
   */
  private resetIdleTimer(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.warningTimer) clearTimeout(this.warningTimer);

    if (this.isWarningActive) {
      this.isWarningActive = false;
      this.emit('WARNING_CANCELLED');
    }

    const warningDelay = IDLE_TIMEOUT_MS - WARNING_WINDOW_MS;

    this.warningTimer = setTimeout(() => {
      this.triggerWarning();
    }, warningDelay);

    this.idleTimer = setTimeout(() => {
      this.triggerExpiration();
    }, IDLE_TIMEOUT_MS);
  }

  private triggerWarning(): void {
    this.isWarningActive = true;
    const remainingSeconds = Math.floor(WARNING_WINDOW_MS / 1000);
    logger.warn(`User idle limit approaching. Session expires in ${remainingSeconds}s.`);
    this.emit('WARNING_STARTED', { remainingSeconds });
  }

  private triggerExpiration(): void {
    logger.warn('Session idle limit reached. Executing automated session cleanup.');
    this.emit('SESSION_EXPIRED');
    this.broadcast('LOGOUT');
  }

  /**
   * Action Handlers
   */
  public staySignedIn(): void {
    this.lastActivityTime = new Date();
    this.isWarningActive = false;
    this.resetIdleTimer();
    this.emit('WARNING_CANCELLED');
    this.emit('SESSION_REFRESHED');
    this.broadcast('STAY_SIGNED_IN');
  }

  private handleRemoteStaySignedIn(): void {
    this.lastActivityTime = new Date();
    this.isWarningActive = false;
    this.resetIdleTimer();
    this.emit('WARNING_CANCELLED');
  }

  public notifyLogout(): void {
    this.clearTimers();
    this.broadcast('LOGOUT');
  }

  public notifyTokenRefresh(): void {
    this.broadcast('REFRESH_TOKEN');
  }

  /**
   * Session Heartbeat Check
   */
  private startHeartbeat(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      if (this.isOffline) return;

      const token = TokenStorage.getAccessToken();
      if (!token || TokenStorage.isTokenExpired(token)) {
        logger.warn('Heartbeat check: Token expired or missing.');
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  /**
   * Metadata & State Querying
   */
  public getMetadata(): SessionMetadata {
    const now = new Date();
    const sessionDurationSeconds = Math.floor((now.getTime() - this.loginTime.getTime()) / 1000);
    const idleTimeSeconds = Math.floor((now.getTime() - this.lastActivityTime.getTime()) / 1000);

    let status: SessionStatus = 'Healthy';
    if (this.isOffline) {
      status = 'Offline';
    } else if (this.isWarningActive) {
      status = 'Warning';
    }

    return {
      loginTime: this.loginTime,
      lastActivityTime: this.lastActivityTime,
      deviceBrowser: this.getDeviceBrowserString(),
      sessionDurationSeconds,
      idleTimeSeconds,
      status
    };
  }

  private getDeviceBrowserString(): string {
    if (typeof navigator === 'undefined') return 'Unknown Device';
    const ua = navigator.userAgent || '';
    let browser = 'Chrome';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';

    const os = ua.includes('Windows') ? 'Windows' : ua.includes('Mac') ? 'macOS' : 'Linux';
    return `${browser} on ${os}`;
  }

  /**
   * Event Emitter Pattern
   */
  public on(event: SessionEventType, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: SessionEventType, data?: any): void {
    this.listeners.get(event)?.forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        logger.error(`Error in session event listener [${event}]`, err);
      }
    });
  }

  private clearTimers(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.warningTimer) clearTimeout(this.warningTimer);
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.idleTimer = null;
    this.warningTimer = null;
    this.heartbeatTimer = null;
  }

  public clear(): void {
    this.clearTimers();
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.close();
      } catch {}
      this.broadcastChannel = null;
    }
    if (this.activityHandler && typeof window !== 'undefined') {
      const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
      events.forEach(evt => window.removeEventListener(evt, this.activityHandler!));
    }
    SessionManager.instance = null;
  }
}

export const sessionManager = {
  getInstance: () => SessionManager.getInstance(),
  on: (event: SessionEventType, callback: EventCallback) => SessionManager.getInstance().on(event, callback),
  staySignedIn: () => SessionManager.getInstance().staySignedIn(),
  notifyLogout: () => SessionManager.getInstance().notifyLogout(),
  notifyTokenRefresh: () => SessionManager.getInstance().notifyTokenRefresh(),
  getMetadata: () => SessionManager.getInstance().getMetadata(),
  clear: () => SessionManager.getInstance().clear()
};
