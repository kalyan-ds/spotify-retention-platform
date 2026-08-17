export const ENV = {
  // Application details
  APP_NAME: 'Retention IQ',
  APP_VERSION: '1.0.0',

  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,

  // API Config
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',

  // Future Authentication
  AUTH_DOMAIN: import.meta.env.VITE_AUTH_DOMAIN || '',
  AUTH_CLIENT_ID: import.meta.env.VITE_AUTH_CLIENT_ID || '',

  // Feature Flags
  ENABLE_ML_PREDICTIONS: import.meta.env.VITE_ENABLE_ML_PREDICTIONS === 'true',
  ENABLE_REALTIME_NOTIFICATIONS: import.meta.env.VITE_ENABLE_REALTIME_NOTIFICATIONS === 'true',
} as const;
