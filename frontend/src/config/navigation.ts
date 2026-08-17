import {
  LayoutDashboard,
  TrendingUp,
  BrainCircuit,
  HelpCircle,
  Lightbulb,
  Cpu,
  Activity,
  GitBranch,
  LineChart,
  Database,
  Beaker,
  Sparkles,
  Settings
} from 'lucide-react';
import { NavSection } from '../types/navigation';
import { ROUTES } from './routes';

export const NAVIGATION_CONFIG: NavSection[] = [
  {
    title: 'Core Dashboards',
    items: [
      {
        id: 'dashboard',
        title: 'Retention Overview',
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        tooltip: 'Operational Retention Overview & KPIs'
      },
      {
        id: 'executive',
        title: 'Executive Summary',
        path: ROUTES.EXECUTIVE,
        icon: TrendingUp,
        tooltip: 'High-level C-Suite Metrics'
      }
    ]
  },
  {
    title: 'AI Intelligence Engine',
    items: [
      {
        id: 'predictions',
        title: 'Predictions Hub',
        path: ROUTES.PREDICTIONS,
        icon: BrainCircuit,
        badge: 'Live',
        badgeVariant: 'success',
        tooltip: 'Real-time & Batch Churn Predictions'
      },
      {
        id: 'explainability',
        title: 'Explainability (XAI)',
        path: ROUTES.EXPLAINABILITY,
        icon: HelpCircle,
        tooltip: 'TreeSHAP Feature Attributions'
      },
      {
        id: 'recommendations',
        title: 'Next Best Actions',
        path: ROUTES.RECOMMENDATIONS,
        icon: Lightbulb,
        badge: 'AI',
        badgeVariant: 'warning',
        tooltip: 'Prescriptive Action Recommendations'
      }
    ]
  },
  {
    title: 'MLOps & Governance',
    items: [
      {
        id: 'models',
        title: 'Model Registry',
        path: ROUTES.MODELS,
        icon: Cpu,
        tooltip: 'Catalog & Version Management'
      },
      {
        id: 'model-health',
        title: 'Model Health',
        path: ROUTES.MODEL_HEALTH,
        icon: Activity,
        tooltip: 'Uptime & Operational Metrics'
      },
      {
        id: 'drift',
        title: 'Drift Analytics',
        path: ROUTES.DRIFT,
        icon: GitBranch,
        tooltip: 'PSI Data & Concept Drift'
      },
      {
        id: 'monitoring',
        title: 'Telemetry & Latency',
        path: ROUTES.MONITORING,
        icon: LineChart,
        tooltip: 'Real-time Performance Metrics'
      }
    ]
  },
  {
    title: 'Data & Platform',
    items: [
      {
        id: 'feature-store',
        title: 'Feature Store',
        path: ROUTES.FEATURE_STORE,
        icon: Database,
        tooltip: '25+ Managed Feature Catalog'
      },
      {
        id: 'experiments',
        title: 'ML Experiments',
        path: ROUTES.EXPERIMENTS,
        icon: Beaker,
        tooltip: 'Training Runs & Parameters'
      },
      {
        id: 'insights',
        title: 'AI Insights',
        path: ROUTES.INSIGHTS,
        icon: Sparkles,
        tooltip: 'Automated Insight Discovery'
      },
      {
        id: 'settings',
        title: 'Settings',
        path: ROUTES.SETTINGS,
        icon: Settings,
        tooltip: 'Platform & API Configurations'
      }
    ]
  }
];
