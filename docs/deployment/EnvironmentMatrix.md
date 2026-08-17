# Production Environment Matrix - Version 2.0 Module 1

**Project**: Spotify Premium Retention Intelligence Platform
**Phase**: Version 2.0 Module 1 Phase 1.8F — Production Build & Deployment Readiness

---

| Variable Name | Scope | Development Default | Production Target | Audit Status |
| :--- | :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Client | `http://localhost:8000/api/v1` | `https://api.retention.spotify.com/api/v1` | **`VALIDATED`** |
| `VITE_ENABLE_AUDIT_LOGGING` | Client | `true` | `true` | **`VALIDATED`** |
| `VITE_SESSION_IDLE_TIMEOUT` | Client | `900000` (15 min) | `900000` (15 min) | **`VALIDATED`** |
| `NODE_ENV` | Server | `development` | `production` | **`VALIDATED`** |
| `PORT` | Server | `8000` | `8000` | **`VALIDATED`** |
