import React from 'react';
import { ChartContainer } from '../charts/ChartContainer';
import { DonutChartWrapper } from '../charts/DonutChartWrapper';

export const ConfidenceDistributionChart: React.FC = React.memo(() => {
  const data = [
    { label: 'High Confidence (>90%)', value: 74 },
    { label: 'Medium Confidence (75-90%)', value: 20 },
    { label: 'Low Confidence (<75%)', value: 6 }
  ];

  const colors = ['#1DB954', '#3B82F6', '#F59E0B'];

  return (
    <ChartContainer
      title="Confidence Distribution"
      subtitle="Model prediction probability margin distribution"
      height="h-72"
    >
      <div className="flex flex-col justify-between h-full">
        <div className="h-48">
          <DonutChartWrapper data={data} colors={colors} />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800/80 text-center text-xs">
          <div>
            <p className="text-spotify-green font-bold font-mono">74%</p>
            <p className="text-[10px] text-neutral-400">High (&gt;90%)</p>
          </div>
          <div>
            <p className="text-blue-400 font-bold font-mono">20%</p>
            <p className="text-[10px] text-neutral-400">Medium (75-90%)</p>
          </div>
          <div>
            <p className="text-amber-400 font-bold font-mono">6%</p>
            <p className="text-[10px] text-neutral-400">Low (&lt;75%)</p>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
});

ConfidenceDistributionChart.displayName = 'ConfidenceDistributionChart';
