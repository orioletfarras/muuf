/**
 * App configuration
 */

export const Config = {
  // API
  API_URL: __DEV__
    ? 'http://localhost:8000/api'
    : 'https://api.muuf.com/api',

  // Storage keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
  },

  // App info
  APP_NAME: 'MUUF',
  APP_VERSION: '1.0.0',

  // Timeouts
  API_TIMEOUT: 30000,
  TOKEN_REFRESH_THRESHOLD: 300000, // 5 minutes

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
} as const;
