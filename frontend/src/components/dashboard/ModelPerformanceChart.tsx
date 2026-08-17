import React from 'react';
import { ChartContainer } from '../charts/ChartContainer';
import { LineChartWrapper } from '../charts/LineChartWrapper';

export const ModelPerformanceChart: React.FC = React.memo(() => {
  const data = [
    { label: 'Jan', value: 94.2 },
    { label: 'Feb', value: 94.8 },
    { label: 'Mar', value: 95.1 },
    { label: 'Apr', value: 95.4 },
    { label: 'May', value: 95.8 },
    { label: 'Jun', value: 96.0 },
    { label: 'Jul', value: 96.2 },
    { label: 'Aug', value: 96.4 },
    { label: 'Sep', value: 96.5 },
    { label: 'Oct', value: 96.6 },
    { label: 'Nov', value: 96.7 },
    { label: 'Dec', value: 96.8 }
  ];

  return (
    <ChartContainer
      title="12-Month Champion Accuracy Trend (ROC-AUC)"
      subtitle="Historical model validation & production evaluation score trajectory"
      height="h-72"
    >
      <LineChartWrapper data={data} color="#3B82F6" dataKey="value" />
    </ChartContainer>
  );
});

ModelPerformanceChart.displayName = 'ModelPerformanceChart';
