import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SessionMetricsResponse } from '@/api/engagement';

interface SessionAnalyticsChartProps {
  sessionData?: SessionMetricsResponse;
  isLoading?: boolean;
}

export const SessionAnalyticsChart: React.FC<SessionAnalyticsChartProps> = ({ sessionData, isLoading }) => {
  const platforms = sessionData?.platform_breakdown ? Object.entries(sessionData.platform_breakdown).map(([platform, count]) => ({
    platform,
    count
  })) : [
    { platform: 'iOS Mobile', count: 5400 },
    { platform: 'Android Mobile', count: 4200 },
    { platform: 'Web Player', count: 1200 },
    { platform: 'Desktop App', count: 800 },
  ];

  return (
    <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
          <span>Session Volume & Platform Breakdown</span>
          <span className="text-xs font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            Avg Duration: {sessionData?.avg_duration_minutes ?? 24.5} min
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 bg-zinc-900/40 animate-pulse rounded-lg" />
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platforms} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="platform" stroke="#71717a" tick={{ fontSize: 12 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }} />
                <Bar dataKey="count" fill="#1DB954" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
