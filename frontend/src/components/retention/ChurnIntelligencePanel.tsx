import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChurnDistributionResponse } from '@/api/retention';

interface ChurnIntelligencePanelProps {
  churnData?: ChurnDistributionResponse;
  isLoading?: boolean;
}

export const ChurnIntelligencePanel: React.FC<ChurnIntelligencePanelProps> = ({ churnData, isLoading }) => {
  const segments = churnData?.segments ?? [
    { segment_name: 'Price / Cost', churn_count: 1420, churn_rate: 35.5 },
    { segment_name: 'Switch to Competitor', churn_count: 980, churn_rate: 24.5 },
    { segment_name: 'Technical / App Issue', churn_count: 720, churn_rate: 18.0 },
    { segment_name: 'Catalog Preference', churn_count: 520, churn_rate: 13.0 },
    { segment_name: 'Other / Payment Error', churn_count: 360, churn_rate: 9.0 },
  ];

  return (
    <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
          <span>Subscription Cancellation Breakdown & Risk Categories</span>
          <span className="text-xs font-normal text-red-400 bg-red-950/60 border border-red-800/50 px-2.5 py-1 rounded-full">
            Total Churned: {churnData?.total_churned ?? 4000} Users
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 bg-zinc-900/40 animate-pulse rounded-lg" />
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segments} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis type="number" stroke="#71717a" tick={{ fontSize: 12 }} />
                <YAxis dataKey="segment_name" type="category" stroke="#71717a" tick={{ fontSize: 12 }} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }} />
                <Bar dataKey="churn_count" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
