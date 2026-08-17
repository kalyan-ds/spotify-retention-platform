import React from 'react';
import {
  Brain,
  Target,
  Database,
  Sparkles,
  HeartPulse,
  Activity,
  Gauge,
  Zap
} from 'lucide-react';
import { ExecutiveKPICard, KPIStatusType } from './ExecutiveKPICard';
import { useExecutiveKPIs } from '../../hooks/useDashboard';
import { DashboardLoading } from '../shared/DashboardLoading';
import { DashboardError } from '../shared/DashboardError';
import { DashboardEmpty } from '../shared/DashboardEmpty';
import { ExecutiveKPI } from '../../types/dashboard';

const DEMO_KPI_DATA: ExecutiveKPI[] = [
  {
    id: 'total-predictions',
    title: 'Total Predictions',
    value: '128,450',
    trend: '+12.4%',
    status: 'Excellent',
    sparklineData: [92000, 98000, 105000, 112000, 118000, 124000, 128450],
    accentColor: '#1DB954'
  },
  {
    id: 'prediction-accuracy',
    title: 'Prediction Accuracy',
    value: '96.8%',
    trend: '+1.2%',
    status: 'Healthy',
    sparklineData: [94.2, 94.8, 95.1, 95.5, 96.0, 96.4, 96.8],
    accentColor: '#3B82F6'
  },
  {
    id: 'active-ai-models',
    title: 'Active AI Models',
    value: '8',
    trend: '0',
    status: 'Stable',
    sparklineData: [8, 8, 8, 8, 8, 8, 8],
    accentColor: '#8B5CF6'
  },
  {
    id: 'recommendation-acceptance',
    title: 'Recommendation Acceptance',
    value: '84%',
    trend: '+6.1%',
    status: 'Excellent',
    sparklineData: [72, 75, 78, 80, 81, 83, 84],
    accentColor: '#F59E0B'
  },
  {
    id: 'platform-health',
    title: 'Platform Health',
    value: '99.97%',
    trend: '+0.02%',
    status: 'Healthy',
    sparklineData: [99.90, 99.92, 99.93, 99.95, 99.96, 99.96, 99.97],
    accentColor: '#10B981'
  },
  {
    id: 'api-requests-today',
    title: 'API Requests Today',
    value: '2.4M',
    trend: '+18%',
    status: 'Busy',
    sparklineData: [1.6, 1.8, 1.9, 2.0, 2.1, 2.3, 2.4],
    accentColor: '#06B6D4'
  },
  {
    id: 'average-latency',
    title: 'Average Latency',
    value: '28ms',
    trend: '-9%',
    status: 'Optimized',
    sparklineData: [38, 35, 34, 32, 30, 29, 28],
    accentColor: '#EC4899',
    invertTrendColor: true
  },
  {
    id: 'cache-hit-rate',
    title: 'Cache Hit Rate',
    value: '96.1%',
    trend: '+2.7%',
    status: 'Excellent',
    sparklineData: [91.5, 92.0, 93.4, 94.2, 95.0, 95.8, 96.1],
    accentColor: '#6366F1'
  }
];

const getKpiIcon = (id: string) => {
  switch (id) {
    case 'total-predictions':
      return <Brain className="w-5 h-5" />;
    case 'prediction-accuracy':
      return <Target className="w-5 h-5" />;
    case 'active-ai-models':
      return <Database className="w-5 h-5" />;
    case 'recommendation-acceptance':
      return <Sparkles className="w-5 h-5" />;
    case 'platform-health':
      return <HeartPulse className="w-5 h-5" />;
    case 'api-requests-today':
      return <Activity className="w-5 h-5" />;
    case 'average-latency':
      return <Gauge className="w-5 h-5" />;
    case 'cache-hit-rate':
      return <Zap className="w-5 h-5" />;
    default:
      return <Activity className="w-5 h-5" />;
  }
};

export const ExecutiveKPIGrid: React.FC = React.memo(() => {
  const { data: apiData, isLoading, isError, refetch } = useExecutiveKPIs();

  // If live data comes from API, use it; otherwise fallback gracefully to static DEMO data
  const displayData = Array.isArray(apiData) && apiData.length > 0 ? apiData : DEMO_KPI_DATA;

  if (isLoading) {
    return <DashboardLoading cardsCount={8} height="h-40" />;
  }

  if (isError && !displayData) {
    return <DashboardError title="Executive KPI Fetch Failed" onRetry={() => refetch()} />;
  }

  if (!displayData || displayData.length === 0) {
    return <DashboardEmpty title="No Executive KPIs Available" onRefresh={() => refetch()} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayData.map((kpi) => (
        <ExecutiveKPICard
          key={kpi.id}
          title={kpi.title}
          value={kpi.value}
          trend={kpi.trend}
          status={kpi.status as KPIStatusType}
          icon={getKpiIcon(kpi.id)}
          sparklineData={kpi.sparklineData || [50, 60, 70, 80, 90]}
          accentColor={kpi.accentColor || '#1DB954'}
          invertTrendColor={kpi.invertTrendColor}
        />
      ))}
    </div>
  );
});

ExecutiveKPIGrid.displayName = 'ExecutiveKPIGrid';
