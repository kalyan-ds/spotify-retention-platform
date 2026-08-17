# Spotify Premium Retention Intelligence Platform - Developer Guide

**Document Version**: 1.0.0

---

## 1. Local Setup Instructions

```bash
# Install dependencies
npm install

# Run Vite dev server with Hot Module Replacement (HMR)
npm run dev

# Run oxlint for linting
npm run lint

# Build static bundle for validation
npm run build
```

---

## 2. Coding Standards & Conventions

1. **Pure Presentation Components**: All cards, grids, tables, and chart wrappers MUST be wrapped with `React.memo()`.
2. **Custom Hooks**: Query logic must remain encapsulated inside domain hooks (`useDashboard.ts`, `usePredictions.ts`, `useRecommendations.ts`, `useMonitoring.ts`, `useModels.ts`).
3. **No Direct State Mutation**: Never mutate global state directly; use React Query cache or local component hooks.
4. **Clickable Links**: All file and symbol references in artifacts and docs must follow markdown standard `file:///` scheme links.
