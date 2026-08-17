# Enterprise Production Deployment Guide

**Project**: Spotify Premium Retention Intelligence Platform
**Phase**: Version 2.0 Module 1 Phase 1.8F — Production Build & Deployment Readiness
**Target Environment**: AWS / GCP / Kubernetes Production Cluster

---

## 1. Production Build Pipeline

```bash
# 1. Checkout main branch
git checkout main
git pull origin main

# 2. Install dependencies
npm ci

# 3. Execute production build
npm run build
```

---

## 2. Docker & Kubernetes Container Deployment

```dockerfile
# Multi-stage Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 3. Post-Deployment Verification

- Call `/health` probe to verify 200 OK.
- Execute synthetic login test via `AuthService`.
- Verify audit log stream at `/audit`.
