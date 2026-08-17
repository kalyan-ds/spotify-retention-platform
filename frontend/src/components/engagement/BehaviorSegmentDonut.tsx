import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { BehaviorSegmentationResponse } from '@/api/engagement';

interface BehaviorSegmentDonutProps {
  segmentData?: BehaviorSegmentationResponse;
  isLoading?: boolean;
}

const SEGMENT_COLORS = ['#1DB954', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

export const BehaviorSegmentDonut: React.FC<BehaviorSegmentDonutProps> = ({ segmentData, isLoading }) => {
  const segments = segmentData?.segments ?? [
    { segment_name: 'Power Listener', user_count: 4500, percentage: 9 },
    { segment_name: 'Heavy Listener', user_count: 12500, percentage: 25 },
    { segment_name: 'Regular Listener', user_count: 18000, percentage: 36 },
    { segment_name: 'Casual Listener', user_count: 10000, percentage: 20 },
    { segment_name: 'Music Explorer', user_count: 5000, percentage: 10 },
  ];

  return (
    <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
          <span>Behavioral User Persona Segments</span>
          <span className="text-xs font-normal text-zinc-400">
            Total Classified: {segmentData?.total_users_classified.toLocaleString() ?? '50,000'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-56 bg-zinc-900/40 animate-pulse rounded-lg" />
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments}
                  dataKey="user_count"
                  nameKey="segment_name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {segments.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
