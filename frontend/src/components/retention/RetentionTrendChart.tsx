import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendPoint } from '@/api/retention';

interface RetentionTrendChartProps {
  trendData?: TrendPoint[];
  isLoading?: boolean;
}

export const RetentionTrendChart: React.FC<RetentionTrendChartProps> = ({ trendData, isLoading }) => {
  const sampleData = trendData && trendData.length > 0 ? trendData : [
    { date: '2026-01-01', value: 12500 },
    { date: '2026-01-05', value: 13100 },
    { date: '2026-01-10', value: 12900 },
    { date: '2026-01-15', value: 13800 },
    { date: '2026-01-20', value: 14200 },
    { date: '2026-01-25', value: 14900 },
    { date: '2026-01-30', value: 15400 },
  ];

  return (
    <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
          <span>Retention Decay & Active User Trend</span>
          <span className="text-xs font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            +18.2% 30-day Growth
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 bg-zinc-900/40 animate-pulse rounded-lg" />
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1DB954" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1DB954" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 12 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                />
                <Area type="monotone" dataKey="value" stroke="#1DB954" strokeWidth={2} fillOpacity={1} fill="url(#retentionGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
