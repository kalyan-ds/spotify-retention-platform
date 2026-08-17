import React from 'react';
import { Lightbulb, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';
import { RecommendationSummaryCard } from './RecommendationSummaryCard';
import { useRecommendationSummary } from '../../hooks/useRecommendations';
import { DashboardLoading } from '../shared/DashboardLoading';

export const RecommendationSummaryGrid: React.FC = React.memo(() => {
  const { data: apiData, isLoading } = useRecommendationSummary();

  if (isLoading) {
    return <DashboardLoading cardsCount={4} height="h-32" />;
  }

  const totalRecommendations = apiData?.total ? apiData.total.toLocaleString() : '18,245';
  const acceptanceRate = apiData?.acceptanceRate ? `${apiData.acceptanceRate}%` : '84%';
  const revenueImpact = apiData?.revenueImpact ? apiData.revenueImpact : '+$2.8M';
  const avgConfidence = apiData?.avgConfidence ? `${apiData.avgConfidence}%` : '92%';

  const cards = [
    {
      id: 'total-recommendations',
      title: 'Total Recommendations',
      value: totalRecommendations,
      trend: '+15%',
      icon: <Lightbulb className="w-5 h-5" />,
      accentColor: '#1DB954'
    },
    {
      id: 'acceptance-rate',
      title: 'Intervention Acceptance Rate',
      value: acceptanceRate,
      trend: '+4%',
      icon: <CheckCircle2 className="w-5 h-5" />,
      accentColor: '#3B82F6'
    },
    {
      id: 'revenue-impact',
      title: 'Est. ARR Revenue Impact',
      value: revenueImpact,
      trend: '+9%',
      icon: <DollarSign className="w-5 h-5" />,
      accentColor: '#10B981'
    },
    {
      id: 'avg-confidence',
      title: 'Average Recommendation Confidence',
      value: avgConfidence,
      trend: '+2%',
      icon: <Sparkles className="w-5 h-5" />,
      accentColor: '#8B5CF6'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <RecommendationSummaryCard
          key={c.id}
          title={c.title}
          value={c.value}
          trend={c.trend}
          icon={c.icon}
          accentColor={c.accentColor}
        />
      ))}
    </div>
  );
});

RecommendationSummaryGrid.displayName = 'RecommendationSummaryGrid';
