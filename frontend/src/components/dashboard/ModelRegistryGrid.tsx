import React from 'react';
import { Database, ShieldCheck, Target, Gauge } from 'lucide-react';
import { ModelRegistryCard } from './ModelRegistryCard';
import { useModelRegistry } from '../../hooks/useModels';
import { DashboardLoading } from '../shared/DashboardLoading';

export const ModelRegistryGrid: React.FC = React.memo(() => {
  const { data: apiData, isLoading } = useModelRegistry();

  if (isLoading) {
    return <DashboardLoading cardsCount={4} height="h-32" />;
  }

  const registeredCount = Array.isArray(apiData) ? apiData.length.toString() : '8';
  const prodCount = Array.isArray(apiData) ? apiData.filter(m => m.status === 'Production').length.toString() : '5';

  const cards = [
    {
      id: 'registered-models',
      title: 'Registered Models',
      value: registeredCount,
      trend: '+1',
      icon: <Database className="w-5 h-5" />,
      accentColor: '#8B5CF6'
    },
    {
      id: 'production-models',
      title: 'Active Model Versions',
      value: prodCount,
      trend: '0',
      icon: <ShieldCheck className="w-5 h-5" />,
      accentColor: '#1DB954'
    },
    {
      id: 'average-accuracy',
      title: 'Average ROC-AUC Accuracy',
      value: '96.8%',
      trend: '+0.4%',
      icon: <Target className="w-5 h-5" />,
      accentColor: '#3B82F6'
    },
    {
      id: 'average-inference-time',
      title: 'Average Inference Latency',
      value: '28ms',
      trend: '-7%',
      icon: <Gauge className="w-5 h-5" />,
      accentColor: '#EC4899',
      invertTrendColor: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <ModelRegistryCard
          key={c.id}
          title={c.title}
          value={c.value}
          trend={c.trend}
          icon={c.icon}
          accentColor={c.accentColor}
          invertTrendColor={c.invertTrendColor}
        />
      ))}
    </div>
  );
});

ModelRegistryGrid.displayName = 'ModelRegistryGrid';
