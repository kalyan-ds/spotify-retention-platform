import React from 'react';
import { ChartContainer } from '../charts/ChartContainer';
import { BarChartWrapper } from '../charts/BarChartWrapper';

export const TrendOverview: React.FC = () => {
  const trendData = [
    { label: 'Mon', value: 14200 },
    { label: 'Tue', value: 16800 },
    { label: 'Wed', value: 19400 },
    { label: 'Thu', value: 21500 },
    { label: 'Fri', value: 24800 },
    { label: 'Sat', value: 22100 },
    { label: 'Sun', value: 24050 }
  ];

  return (
    <ChartContainer
      title="7-Day Intervention Conversion Trend"
      subtitle="Total accepted prescriptive actions per day across global regions"
      height="h-64"
    >
      <BarChartWrapper data={trendData} color="#1DB954" />
    </ChartContainer>
  );
};
