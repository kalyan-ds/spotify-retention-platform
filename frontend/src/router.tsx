import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { EnterpriseLayout } from './app/layouts/EnterpriseLayout';
import { AuthLayout } from './app/layouts/AuthLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RouteErrorBoundary } from './components/system/RouteErrorBoundary';
import { ROUTES } from './config/routes';

// Lazy loading all pages for enterprise code-splitting and performance
const Login = React.lazy(() => import('./pages/auth/Login').then((m) => ({ default: m.Login })));
const AICommandCenter = React.lazy(() =>
  import('./pages/dashboard/AICommandCenter').then((m) => ({ default: m.AICommandCenter }))
);
const ExecutiveDashboard = React.lazy(() =>
  import('./pages/dashboard/ExecutiveDashboard').then((m) => ({ default: m.ExecutiveDashboard }))
);
const AuditDashboard = React.lazy(() =>
  import('./pages/dashboard/AuditDashboard').then((m) => ({ default: m.AuditDashboard }))
);
const SecurityHealthDashboard = React.lazy(() =>
  import('./pages/dashboard/SecurityHealthDashboard').then((m) => ({ default: m.SecurityHealthDashboard }))
);
const SecurityComplianceDashboard = React.lazy(() =>
  import('./pages/dashboard/SecurityComplianceDashboard').then((m) => ({ default: m.SecurityComplianceDashboard }))
);
const PerformanceDashboard = React.lazy(() =>
  import('./pages/dashboard/PerformanceDashboard').then((m) => ({ default: m.PerformanceDashboard }))
);
const AccessibilityDashboard = React.lazy(() =>
  import('./pages/dashboard/AccessibilityDashboard').then((m) => ({ default: m.AccessibilityDashboard }))
);
const ReleaseDashboard = React.lazy(() =>
  import('./pages/dashboard/ReleaseDashboard').then((m) => ({ default: m.ReleaseDashboard }))
);
const GitHubReadinessDashboard = React.lazy(() =>
  import('./pages/dashboard/GitHubReadinessDashboard').then((m) => ({ default: m.GitHubReadinessDashboard }))
);
const EnterpriseCertificationDashboard = React.lazy(() =>
  import('./pages/dashboard/EnterpriseCertificationDashboard').then((m) => ({ default: m.EnterpriseCertificationDashboard }))
);
const AIModels = React.lazy(() => import('./pages/AIModelsDashboard'));
const Predictions = React.lazy(() => import('./pages/PredictionsDashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Login />
      }
    ]
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <EnterpriseLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <AICommandCenter />
      },
      {
        path: ROUTES.DASHBOARD,
        element: <AICommandCenter />
      },
      {
        path: ROUTES.EXECUTIVE,
        element: <ExecutiveDashboard />
      },
      {
        path: ROUTES.PREDICTIONS,
        element: <Predictions />
      },
      {
        path: ROUTES.EXPLAINABILITY,
        element: <Predictions />
      },
      {
        path: ROUTES.RECOMMENDATIONS,
        element: <Predictions />
      },
      {
        path: ROUTES.MODELS,
        element: <AIModels />
      },
      {
        path: ROUTES.MODEL_HEALTH,
        element: <AIModels />
      },
      {
        path: ROUTES.DRIFT,
        element: <AIModels />
      },
      {
        path: ROUTES.MONITORING,
        element: <AIModels />
      },
      {
        path: ROUTES.FEATURE_STORE,
        element: <AIModels />
      },
      {
        path: ROUTES.EXPERIMENTS,
        element: <AIModels />
      },
      {
        path: ROUTES.INSIGHTS,
        element: <ExecutiveDashboard />
      },
      {
        path: ROUTES.AUDIT,
        element: <AuditDashboard />
      },
      {
        path: ROUTES.SECURITY,
        element: <SecurityHealthDashboard />
      },
      {
        path: ROUTES.SECURITY_COMPLIANCE,
        element: <SecurityComplianceDashboard />
      },
      {
        path: ROUTES.PERFORMANCE,
        element: <PerformanceDashboard />
      },
      {
        path: ROUTES.ACCESSIBILITY,
        element: <AccessibilityDashboard />
      },
      {
        path: ROUTES.RELEASE,
        element: <ReleaseDashboard />
      },
      {
        path: ROUTES.GITHUB,
        element: <GitHubReadinessDashboard />
      },
      {
        path: ROUTES.CERTIFICATION,
        element: <EnterpriseCertificationDashboard />
      },
      {
        path: ROUTES.SETTINGS,
        element: <Settings />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);
