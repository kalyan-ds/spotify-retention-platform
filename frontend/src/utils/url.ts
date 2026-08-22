/**
 * Canonical URL Normalizer for API Base URLs.
 * Spotify Premium Retention Intelligence Platform
 *
 * Ensures the API base URL always includes `/api/v1` without trailing slashes or duplicate segments.
 *
 * Examples:
 *   normalizeApiBaseUrl("https://spotify-retention-api.onrender.com")
 *     -> "https://spotify-retention-api.onrender.com/api/v1"
 *   normalizeApiBaseUrl("https://spotify-retention-api.onrender.com/")
 *     -> "https://spotify-retention-api.onrender.com/api/v1"
 *   normalizeApiBaseUrl("https://spotify-retention-api.onrender.com/api/v1")
 *     -> "https://spotify-retention-api.onrender.com/api/v1"
 *   normalizeApiBaseUrl("https://spotify-retention-api.onrender.com/api/v1/")
 *     -> "https://spotify-retention-api.onrender.com/api/v1"
 *   normalizeApiBaseUrl("/api/v1")
 *     -> "/api/v1"
 *   normalizeApiBaseUrl("")
 *     -> "/api/v1"
 *   normalizeApiBaseUrl(undefined)
 *     -> "/api/v1"
 */
export function normalizeApiBaseUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return '/api/v1';
  }
  const clean = rawUrl.trim().replace(/\/+$/, '');
  if (!clean || clean === '/') {
    return '/api/v1';
  }
  if (clean.endsWith('/api/v1')) {
    return clean;
  }
  return `${clean}/api/v1`;
}
