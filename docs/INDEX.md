# Enterprise Documentation Hub - Spotify Premium Retention Intelligence Platform

Welcome to the official enterprise technical documentation repository for the **Spotify Premium Retention Intelligence Platform** (Version 2.0).

---

## 📚 Documentation Directory

### 🏗️ Architecture (`docs/architecture/`)
- **[Architecture Overview](architecture/ArchitectureOverview.md)**: High-level platform design and system boundaries.
- **[Frontend Architecture](architecture/FrontendArchitecture.md)**: React 19, Vite, TanStack Query, and UI design tokens.
- **[Backend Architecture](architecture/BackendArchitecture.md)**: FastAPI REST endpoints, SQLAlchemy ORM, and Pydantic schemas.
- **[Authentication Flow](architecture/AuthenticationFlow.md)**: REST JWT authentication & rotation workflow.
- **[RBAC Architecture](architecture/RBACArchitecture.md)**: Admin, Analyst, and Viewer authorization guards.
- **[Session Lifecycle](architecture/SessionLifecycle.md)**: 15-min idle detection and BroadcastChannel tab sync.
- **[Audit Architecture](architecture/AuditArchitecture.md)**: Correlation-traced audit logging pipeline.
- **[Security Architecture](architecture/SecurityArchitecture.md)**: DevSecOps hardening, error sanitization, and CSP headers.
- **[AI & MLOps Architecture](architecture/AIArchitecture.md)**: Predictive churn models and Next Best Action recommendation engines.
- **[Deployment Architecture](architecture/DeploymentArchitecture.md)**: CI/CD build pipelines and local deployment.

### 📜 Architecture Decision Records (`docs/adr/`)
- **[ADR-001: JWT Authentication Strategy](adr/ADR-001-JWT-Authentication.md)**
- **[ADR-002: Role-Based Access Control Guards](adr/ADR-002-RBAC.md)**
- **[ADR-003: TanStack Query v5 Data Layer](adr/ADR-003-React-Query.md)**
- **[ADR-004: FastAPI REST Gateway Architecture](adr/ADR-004-FastAPI.md)**
- **[ADR-005: Audit Telemetry Logging Pipeline](adr/ADR-005-Audit-Logging.md)**
- **[ADR-006: Session Lifecycle & BroadcastChannel Sync](adr/ADR-006-Session-Lifecycle.md)**

### 📡 API Reference (`docs/api/`)
- **[API Documentation](api/APIDocumentation.md)**: Comprehensive REST API endpoint reference.

### 🛠️ Developer & Operations (`docs/developer/`, `docs/operations/`)
- **[Developer Guide](developer/DeveloperGuide.md)**: Local setup, environment configuration, and coding guidelines.
- **[Operations Runbook](operations/OperationsRunbook.md)**: Maintenance, monitoring, and deployment runbook.

### 👥 User Guides & Quality (`docs/user/`, `docs/qa/`, `docs/performance/`, `docs/security/`, `docs/accessibility/`)
- **[User Guide](docs/user/UserGuide.md)**: End-user feature manual and FAQ.
- **[QA Test Suite](docs/qa/FunctionalTestReport.md)**: Functional verification test report.
- **[Performance Benchmark](docs/performance/PerformanceReport.md)**: Client-side bundle and asset performance analysis.
- **[Accessibility Guidelines](docs/accessibility/AccessibilityChecklist.md)**: WCAG 2.2 Level AA design and accessibility checklist.
- **[Security Mitigation Matrix](docs/security/SecurityValidationReport.md)**: OWASP Top 10 mitigation strategy documentation.
