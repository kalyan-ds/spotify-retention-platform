# Enterprise Project Structure Report - Version 2.0.0

**Project**: Spotify Premium Retention Intelligence Platform
**Status**: **`ENTERPRISE ARCHITECTURE CERTIFIED`**

---

```
.github/                             # GitHub Actions workflows, CODEOWNERS, PR template
assets/                              # Production image assets (banner, logo, screenshots)
backend/                             # FastAPI REST endpoints & SQLAlchemy ORM
docs/                                # Comprehensive technical documentation
├── adr/                             # Architecture Decision Records (ADR-001 to ADR-006)
├── api/                             # REST API specification
├── architecture/                    # System architecture & Mermaid flowcharts
├── certification/                   # Enterprise release certification reports
├── deployment/                      # Docker, Kubernetes & hosting guides
├── developer/                       # Developer guide & local setup
├── internal/                        # Archived analysis dumps & legacy code
├── operations/                      # Maintenance runbooks
├── quality/                         # Enterprise quality & hygiene audit reports
└── user/                            # User guide & FAQ
frontend/                            # React 19 + TypeScript SPA
├── src/app/                         # Enterprise layouts
├── src/components/                  # UI components, navigation, auth guards
├── src/pages/                       # Dashboard modules & governance dashboards
├── src/providers/                   # Context providers (Auth, Query, App)
├── src/types/                       # TypeScript schemas
└── src/utils/                       # Hardening, session, performance, audit services
```
