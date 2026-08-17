import React from 'react';
import { ChartContainer } from '../charts/ChartContainer';
import { LineChartWrapper } from '../charts/LineChartWrapper';

export const PredictionTrendChart: React.FC = React.memo(() => {
  const data = [
    { label: 'Jan', value: 84000 },
    { label: 'Feb', value: 89000 },
    { label: 'Mar', value: 94000 },
    { label: 'Apr', value: 98500 },
    { label: 'May', value: 104000 },
    { label: 'Jun', value: 110000 },
    { label: 'Jul', value: 114500 },
    { label: 'Aug', value: 119000 },
    { label: 'Sep', value: 122400 },
    { label: 'Oct', value: 125000 },
    { label: 'Nov', value: 127100 },
    { label: 'Dec', value: 128450 }
  ];

  return (
    <ChartContainer
      title="12-Month Prediction Volume Trend"
      subtitle="Total monthly inference throughput across global retention pipelines"
      height="h-72"
    >
      <LineChartWrapper data={data} color="#1DB954" dataKey="value" />
    </ChartContainer>
  );
});

PredictionTrendChart.displayName = 'PredictionTrendChart';
