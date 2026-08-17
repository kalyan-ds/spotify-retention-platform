export const APP_CONFIG = {
  theme: {
    default: 'dark',
    storageKey: 'retention-iq-theme',
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  timeouts: {
    apiDefault: 10000, // 10 seconds
    toastDefault: 5000, // 5 seconds
  },
} as const;
