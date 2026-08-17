# Spotify Premium Retention Intelligence Platform - Production Deployment Guide

**Document Version**: 1.0.0
**Target Environment**: AWS EKS / Kubernetes Containerized Environment

---

## 1. Production Build Procedure

Execute static production bundle compilation:

```bash
cd frontend
npm run build
```

This compiles static production assets into `frontend/dist/`.

---

## 2. Docker Containerization Setup

### `Dockerfile`
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Serving via NGINX
FROM nginx:1.25-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 3. NGINX Configuration (`nginx.conf`)

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Single Page Application Routing Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy Pass
    location /api/v1/ {
        proxy_pass http://backend-service.prod.svc.cluster.local:8000/api/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static Asset Caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 4. Production Environment Checklist

| Variable | Recommended Value | Description |
|----------|-------------------|-------------|
| `VITE_API_BASE_URL` | `/api/v1` | Reverse proxy path for REST API gateway |
| `VITE_APP_ENV` | `production` | Enables production log suppression |
| `VITE_ENABLE_TELEMETRY` | `true` | Enables performance and error tracking |
| `VITE_LOG_LEVEL` | `info` | Suppresses verbose debug logs |
| `VITE_DEFAULT_TIMEOUT` | `10000` | HTTP request timeout in milliseconds |
