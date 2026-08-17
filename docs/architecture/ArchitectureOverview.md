# Enterprise Architecture Overview - Spotify Premium Retention Platform

**Project**: Spotify Premium Retention Intelligence Platform
**Version**: 2.0.0 (Production Release)
**System Class**: Enterprise AI & Predictive MLOps Command Center

---

## 1. System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Frontend Single-Page Application (React 19 + Vite)"]
        UI[AI Command Center / Dashboards] --> AuthCtx[AuthProvider Context]
        AuthCtx --> Storage[Token Storage & Axios Interceptors]
        AuthCtx --> Session[SessionManager & BroadcastChannel Sync]
        UI --> Query[TanStack Query v5 Data Cache]
    end

    subgraph Security ["Security & Governance Layer"]
        Storage --> Guard[ProtectedRoute RBAC Guards]
        Guard --> Audit[AuditLogger Telemetry Stream]
        Guard --> SecHard[SecurityHardeningService & CSP]
    end

    subgraph Backend ["Backend Gateway (FastAPI + Python 3.11)"]
        Storage --> REST[FastAPI REST Endpoints]
        REST --> JWT[JWT Token Verification / Issue]
        REST --> DB[(PostgreSQL Database)]
        REST --> ML[Predictive Churn Engine & Next Best Action]
    end
```

---

## 2. Platform Core Subsystems

1. **Authentication & Identity Access Management (IAM)**: REST JWT authentication, token refresh rotation, and password entropy evaluation.
2. **Role-Based Access Control (RBAC)**: Fine-grained permission guards (`Admin`, `Analyst`, `Viewer`) protecting dashboard routes.
3. **Session Lifecycle Management**: 15-minute idle monitoring, 2-minute expiration warning modal, and cross-tab `BroadcastChannel` synchronization.
4. **Audit Telemetry & Logging**: Real-time event recording with unique correlation IDs, payload inspection, and CSV/JSON exports.
5. **Security Hardening & Governance**: OWASP Top 10 mitigation matrix, error message sanitization, and Content Security Policy directives.
6. **AI Command Center & Predictive Engine**: Real-time churn prediction, feature drift monitoring, and Next Best Action interventions.
