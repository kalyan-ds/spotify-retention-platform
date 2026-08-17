import { useLocation } from 'react-router-dom';

const routeTitleMap: Record<string, string> = {
  '/': 'Overview',
  '/overview': 'Overview',
  '/users': 'Users',
  '/revenue': 'Revenue',
  '/retention': 'Retention',
  '/engagement': 'Engagement',
  '/ai-models': 'AI Models',
  '/predictions': 'Predictions',
  '/segments': 'Segments',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/components': 'Components Playground',
};

export function usePageTitle(): string {
  const location = useLocation();
  return routeTitleMap[location.pathname] || 'Dashboard';
}
