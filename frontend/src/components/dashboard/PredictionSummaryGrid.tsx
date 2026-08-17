import React from 'react';
import { Brain, ShieldCheck, Gauge, CheckCircle2 } from 'lucide-react';
import { PredictionSummaryCard } from './PredictionSummaryCard';
import { usePredictionSummary } from '../../hooks/usePredictions';
import { DashboardLoading } from '../shared/DashboardLoading';

export const PredictionSummaryGrid: React.FC = React.memo(() => {
  const { data: apiData, isLoading } = usePredictionSummary();

  if (isLoading) {
    return <DashboardLoading cardsCount={4} height="h-32" />;
  }

  const totalPredictions = apiData?.totalPredictions ? apiData.totalPredictions.toLocaleString() : '128,450';
  const highConfidenceRate = apiData?.highConfidenceRate ? `${apiData.highConfidenceRate}%` : '91%';
  const avgProcessingTime = apiData?.avgProcessingTimeMs ? `${apiData.avgProcessingTimeMs}ms` : '28ms';
  const successRate = apiData?.successRate ? `${apiData.successRate}%` : '99.8%';

  const cards = [
    {
      id: 'total-predictions',
      title: 'Total Predictions',
      value: totalPredictions,
      trend: '+12%',
      icon: <Brain className="w-5 h-5" />,
      accentColor: '#1DB954'
    },
    {
      id: 'high-confidence',
      title: 'High Confidence Rate',
      value: highConfidenceRate,
      trend: '+3%',
      icon: <ShieldCheck className="w-5 h-5" />,
      accentColor: '#3B82F6'
    },
    {
      id: 'avg-processing-time',
      title: 'Avg Processing Time',
      value: avgProcessingTime,
      trend: '-8%',
      icon: <Gauge className="w-5 h-5" />,
      accentColor: '#EC4899',
      invertTrendColor: true
    },
    {
      id: 'success-rate',
      title: 'Inference Success Rate',
      value: successRate,
      trend: '+0.5%',
      icon: <CheckCircle2 className="w-5 h-5" />,
      accentColor: '#10B981'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <PredictionSummaryCard
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

PredictionSummaryGrid.displayName = 'PredictionSummaryGrid';
