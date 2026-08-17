# Production Deployment Architecture - Version 2.0 Module 1

**Project**: Spotify Premium Retention Intelligence Platform
**Phase**: Version 2.0 Module 1 Phase 1.8F — Production Build & Deployment Readiness

---

```mermaid
flowchart TD
    subgraph CDN ["Cloudflare Global Edge Network"]
        DNS[DNS & SSL Termination] --> CDN_Cache[Static Assets & CSP Headers]
    end

    subgraph Cluster ["AWS EKS Kubernetes Cluster"]
        CDN_Cache --> Ingress[Nginx Ingress Controller]
        Ingress --> FE[Frontend Pods (React 19 SPA)]
        Ingress --> BE[Backend Pods (FastAPI REST)]
    end

    subgraph Data ["Database & Cache"]
        BE --> RDS[(Amazon RDS PostgreSQL)]
        BE --> Redis[(Amazon ElastiCache Redis)]
    end
```
