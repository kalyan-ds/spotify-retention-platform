import React from 'react';
import { ChartContainer } from '../charts/ChartContainer';
import { DonutChartWrapper } from '../charts/DonutChartWrapper';

export const RecommendationCategoryChart: React.FC = React.memo(() => {
  const data = [
    { label: 'Retention Offer', value: 35 },
    { label: 'Premium Upgrade', value: 25 },
    { label: 'Discount Campaign', value: 20 },
    { label: 'Personalized Playlist', value: 12 },
    { label: 'Win-back Campaign', value: 8 }
  ];

  const colors = ['#1DB954', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <ChartContainer
      title="Recommendation Category Breakdown"
      subtitle="Operational intervention action types distribution"
      height="h-72"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 h-full">
        <div className="h-48">
          <DonutChartWrapper data={data} colors={colors} />
        </div>
        <div className="space-y-2 text-xs">
          {data.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }} />
                <span className="text-white font-medium">{cat.label}</span>
              </div>
              <span className="font-mono font-bold text-white">{cat.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </ChartContainer>
  );
});

RecommendationCategoryChart.displayName = 'RecommendationCategoryChart';
