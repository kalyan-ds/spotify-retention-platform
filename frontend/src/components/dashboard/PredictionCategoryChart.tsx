import React from 'react';
import { ChartContainer } from '../charts/ChartContainer';
import { DonutChartWrapper } from '../charts/DonutChartWrapper';

export const PredictionCategoryChart: React.FC = React.memo(() => {
  const data = [
    { label: 'Retention Target', value: 42 },
    { label: 'Upgrade Propensity', value: 28 },
    { label: 'Downgrade Risk', value: 15 },
    { label: 'High Value Subscribers', value: 10 },
    { label: 'At Risk Cohort', value: 5 }
  ];

  const colors = ['#1DB954', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'];

  return (
    <ChartContainer
      title="Prediction Category Breakdown"
      subtitle="Distribution across core operational prediction categories"
      height="h-64"
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

PredictionCategoryChart.displayName = 'PredictionCategoryChart';
