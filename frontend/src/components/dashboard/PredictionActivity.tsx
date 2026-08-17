import React from 'react';
import { ChartContainer } from '../charts/ChartContainer';
import { LineChartWrapper } from '../charts/LineChartWrapper';
import { DonutChartWrapper } from '../charts/DonutChartWrapper';

export const PredictionActivity: React.FC = () => {
  const lineData = [
    { label: '00:00', value: 3400 },
    { label: '04:00', value: 2100 },
    { label: '08:00', value: 6800 },
    { label: '12:00', value: 9400 },
    { label: '16:00', value: 11200 },
    { label: '20:00', value: 8900 },
    { label: '23:59', value: 5200 }
  ];

  const donutData = [
    { label: 'Low Risk (<25%)', value: 68 },
    { label: 'Medium Risk (25-50%)', value: 18 },
    { label: 'High Risk (50-75%)', value: 9 },
    { label: 'Critical Risk (>75%)', value: 5 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ChartContainer
          title="Prediction Volume & Inferences (24h)"
          subtitle="Real-time request volume throughput across all active microservices"
          height="h-72"
        >
          <LineChartWrapper data={lineData} color="#1DB954" />
        </ChartContainer>
      </div>

      <div>
        <ChartContainer
          title="Risk Tier Distribution"
          subtitle="Cohort segment breakdown by predicted churn probability"
          height="h-72"
        >
          <DonutChartWrapper
            data={donutData}
            colors={['#1DB954', '#FBBF24', '#FB923C', '#F87171']}
          />
        </ChartContainer>
      </div>
    </div>
  );
};
