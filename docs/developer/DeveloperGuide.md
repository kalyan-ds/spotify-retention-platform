# Enterprise Developer Guide - Spotify Premium Retention Platform

**Project**: Spotify Premium Retention Intelligence Platform
**Target Audience**: Frontend Engineers, MLOps Engineers, Security Architects

---

## 1. Quick Start & Local Setup

### Prerequisites
- Node.js v20.x or higher
- npm v10.x or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/spotify/spotify-retention-platform.git
cd spotify-retention-platform/frontend

# Install dependencies
npm install

# Start local development server
npm run dev
```

---

## 2. Project Directory Structure

```
frontend/src/
├── app/
│   └── layouts/               # Enterprise Layout & Auth Layout wrappers
├── components/
│   ├── auth/                  # ProtectedRoute, SessionWarningModal
│   ├── navigation/            # Sidebar, UserProfileMenu
│   └── system/                # GlobalErrorBoundary, RouteErrorBoundary
├── config/
│   └── routes.ts              # Centralized route definitions
├── pages/
│   ├── auth/                  # Login page
│   └── dashboard/             # AI Command Center, Executive, Audit, Security, Performance, Accessibility
├── providers/
│   ├── AppProvider.tsx        # Top-level composition provider
│   ├── AuthProvider.tsx       # Auth context provider
│   └── QueryProvider.tsx      # TanStack Query client provider
├── services/
│   └── api/                   # Axios interceptor & auth REST service
├── types/                     # TypeScript schemas (auth, audit, security, performance, accessibility)
└── utils/                     # Token storage, SessionManager, AuditLogger, Hardening, Compliance
```

---

## 3. Production Build Command

```bash
npm run build
```
Generates production-optimized JavaScript chunks in `dist/` in under 2.5s.
