import { useLocation } from 'react-router-dom';
import { useDashboardStore } from '../store/dashboardStore';
import { BreadcrumbItem } from '../types/navigation';
import { ROUTES } from '../config/routes';

export const useNavigation = () => {
  const location = useLocation();
  const { sidebarCollapsed, mobileSidebarOpen, toggleSidebar, setMobileSidebarOpen } = useDashboardStore();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Platform', path: ROUTES.DASHBOARD }];

    switch (path) {
      case ROUTES.DASHBOARD:
        breadcrumbs.push({ label: 'Retention Overview', isCurrent: true });
        break;
      case ROUTES.EXECUTIVE:
        breadcrumbs.push({ label: 'Executive Summary', isCurrent: true });
        break;
      case ROUTES.PREDICTIONS:
        breadcrumbs.push({ label: 'AI Intelligence', path: ROUTES.PREDICTIONS });
        breadcrumbs.push({ label: 'Predictions Hub', isCurrent: true });
        break;
      case ROUTES.EXPLAINABILITY:
        breadcrumbs.push({ label: 'AI Intelligence', path: ROUTES.PREDICTIONS });
        breadcrumbs.push({ label: 'Explainability (XAI)', isCurrent: true });
        break;
      case ROUTES.RECOMMENDATIONS:
        breadcrumbs.push({ label: 'AI Intelligence', path: ROUTES.PREDICTIONS });
        breadcrumbs.push({ label: 'Next Best Actions', isCurrent: true });
        break;
      case ROUTES.MODELS:
        breadcrumbs.push({ label: 'MLOps', path: ROUTES.MODELS });
        breadcrumbs.push({ label: 'Model Registry', isCurrent: true });
        break;
      case ROUTES.MODEL_HEALTH:
        breadcrumbs.push({ label: 'MLOps', path: ROUTES.MODELS });
        breadcrumbs.push({ label: 'Model Health', isCurrent: true });
        break;
      case ROUTES.DRIFT:
        breadcrumbs.push({ label: 'MLOps', path: ROUTES.MODELS });
        breadcrumbs.push({ label: 'Drift Analytics', isCurrent: true });
        break;
      case ROUTES.MONITORING:
        breadcrumbs.push({ label: 'MLOps', path: ROUTES.MODELS });
        breadcrumbs.push({ label: 'Telemetry & Latency', isCurrent: true });
        break;
      case ROUTES.FEATURE_STORE:
        breadcrumbs.push({ label: 'Data & Platform', path: ROUTES.FEATURE_STORE });
        breadcrumbs.push({ label: 'Feature Store', isCurrent: true });
        break;
      case ROUTES.EXPERIMENTS:
        breadcrumbs.push({ label: 'Data & Platform', path: ROUTES.FEATURE_STORE });
        breadcrumbs.push({ label: 'ML Experiments', isCurrent: true });
        break;
      case ROUTES.INSIGHTS:
        breadcrumbs.push({ label: 'Data & Platform', path: ROUTES.FEATURE_STORE });
        breadcrumbs.push({ label: 'AI Insights', isCurrent: true });
        break;
      case ROUTES.SETTINGS:
        breadcrumbs.push({ label: 'Settings', isCurrent: true });
        break;
      default:
        breadcrumbs.push({ label: 'Dashboard', isCurrent: true });
    }

    return breadcrumbs;
  };

  return {
    currentPath: location.pathname,
    breadcrumbs: getBreadcrumbs(),
    sidebarCollapsed,
    mobileSidebarOpen,
    toggleSidebar,
    setMobileSidebarOpen
  };
};
