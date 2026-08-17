# Enterprise Operations & Runbook Guide

**Project**: Spotify Premium Retention Intelligence Platform
**Phase**: Version 2.0 Module 1 Phase 1.8E — Enterprise Documentation & Technical Writing

---

## 1. Operational Health Checks

- **Frontend Health Endpoint**: Verifiable via `/healthz` or client bundle load.
- **REST Gateway Health**: `GET /api/v1/health` returning `200 OK`.
- **Telemetry Stream**: Inspect `/audit` for real-time authentication and security events.

---

## 2. Maintenance & Incident Runbook

### Incident: 401 Unauthorized Token Refresh Loop
1. Verify backend FastAPI `/auth/refresh` service availability.
2. Check client clock synchronization.
3. User can click "Sign Out" to purge localStorage state and force fresh OAuth login.

### Incident: Audit Stream Buffer Capacity
1. Local buffer capped at 500 records.
2. Export logs via "Export CSV" or "Export JSON" on the Audit Dashboard (`/audit`).
