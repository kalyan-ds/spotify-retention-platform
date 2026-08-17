import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../../config/config';
import { logger } from '../../utils/logger';
import { PerformanceMonitor } from '../../utils/performance';
import { TokenStorage } from '../../utils/tokenStorage';

export const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.defaultTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
apiClient.interceptors.request.use(
  (reqConfig: InternalAxiosRequestConfig) => {
    const token = TokenStorage.getAccessToken() || localStorage.getItem('auth_token');
    if (token && reqConfig.headers) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    const correlationId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    reqConfig.headers['X-Correlation-ID'] = correlationId;
    (reqConfig as any).metadata = { startTime: Date.now() };
    return reqConfig;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const startTime = (response.config as any).metadata?.startTime;
    if (startTime) {
      const duration = Date.now() - startTime;
      PerformanceMonitor.trackApiLatency(response.config.url || 'API', duration);
    }
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized for token refresh retry workflow
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = TokenStorage.getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        TokenStorage.clearTokens();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?expired=true';
        }
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post(`${config.apiBaseUrl}/auth/refresh`, {
          refreshToken
        });

        const newAccessToken = refreshResponse.data?.tokens?.accessToken || refreshResponse.data?.accessToken;
        if (newAccessToken) {
          TokenStorage.setTokens({
            accessToken: newAccessToken,
            refreshToken: refreshResponse.data?.tokens?.refreshToken || refreshToken,
            expiresIn: refreshResponse.data?.tokens?.expiresIn || 86400
          });

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          isRefreshing = false;
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;
        TokenStorage.clearTokens();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?expired=true';
        }
        return Promise.reject(refreshErr);
      }
    }

    let formattedError = {
      message: 'An unexpected platform error occurred.',
      code: 'UNKNOWN_ERROR',
      status: error.response?.status || 500
    };

    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as any;
      formattedError = {
        message: data.message || data.detail || formattedError.message,
        code: data.code || `HTTP_${error.response.status}`,
        status: error.response.status
      };
    } else if (error.code === 'ECONNABORTED') {
      formattedError = {
        message: 'Request timeout exceeded. Please try again.',
        code: 'TIMEOUT_ERROR',
        status: 408
      };
    }

    logger.error(`API Failure [${error.config?.url || 'URL'}]`, formattedError);
    return Promise.reject(formattedError);
  }
);
