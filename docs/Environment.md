# Spotify Premium Retention Intelligence Platform - Environment Variables Reference

**Document Version**: 1.0.0

---

## 1. Overview

Vite handles environment variables prefixed with `VITE_`. These variables are embedded into static JavaScript bundles during build execution.

---

## 2. Configuration Reference

```env
# Primary Gateway Route
VITE_API_BASE_URL=/api/v1

# Deployment Environment Name
VITE_APP_ENV=production

# Observability Telemetry Switch
VITE_ENABLE_TELEMETRY=true

# Logging Level Threshold (debug | info | warn | error)
VITE_LOG_LEVEL=info

# Default Request Timeout (in milliseconds)
VITE_DEFAULT_TIMEOUT=10000
```

---

## 3. Environment Overrides Matrix

| Environment | `VITE_API_BASE_URL` | `VITE_LOG_LEVEL` | `VITE_ENABLE_TELEMETRY` |
|-------------|---------------------|------------------|-------------------------|
| **Development** | `http://localhost:8000/api/v1` | `debug` | `true` |
| **Staging** | `https://staging-api.spotify.internal/api/v1` | `info` | `true` |
| **Production** | `/api/v1` | `warn` | `true` |
