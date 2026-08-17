import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { RetentionHealthResponse } from '@/api/retention';

interface RetentionHealthPanelProps {
  healthData?: RetentionHealthResponse;
  isLoading?: boolean;
}

const PERSONA_COLORS = ['#1DB954', '#3b82f6', '#a855f7', '#f97316', '#64748b'];

export const RetentionHealthPanel: React.FC<RetentionHealthPanelProps> = ({ healthData, isLoading }) => {
  const score = healthData?.overall_health_score ?? 72.5;
  const category = healthData?.health_category ?? 'Good';

  const personas = healthData?.personas ?? [
    { persona_name: 'Power User', user_count: 5000, percentage_of_base: 10 },
    { persona_name: 'Loyal User', user_count: 20000, percentage_of_base: 40 },
    { persona_name: 'Active User', user_count: 15000, percentage_of_base: 30 },
    { persona_name: 'At Risk', user_count: 5000, percentage_of_base: 10 },
    { persona_name: 'Dormant', user_count: 5000, percentage_of_base: 10 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Health Score Gauge Card */}
      <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
            <span>Platform Retention Health Score</span>
            <span className="text-xs font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
              Category: {category}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-48 bg-zinc-900/40 animate-pulse rounded-lg" />
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-4 border-emerald-500/30 bg-emerald-950/20 shadow-inner">
                <div className="text-center">
                  <span className="text-3xl font-extrabold text-zinc-100">{score}</span>
                  <span className="block text-xs text-zinc-400 font-medium mt-0.5">/ 100 Score</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mt-4 text-center max-w-xs">
                Weighted composite score reflecting recent session volume, subscription tenure, and active day frequency.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Persona Donut Chart */}
      <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-100">User Persona Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-48 bg-zinc-900/40 animate-pulse rounded-lg" />
          ) : (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={personas}
                    dataKey="user_count"
                    nameKey="persona_name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {personas.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PERSONA_COLORS[index % PERSONA_COLORS.length]} />
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
    </div>
  );
};
