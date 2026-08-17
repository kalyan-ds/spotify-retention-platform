import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FeatureAdoptionResponse } from '@/api/engagement';

interface FeatureAdoptionChartProps {
  featureData?: FeatureAdoptionResponse;
  isLoading?: boolean;
}

export const FeatureAdoptionChart: React.FC<FeatureAdoptionChartProps> = ({ featureData, isLoading }) => {
  const features = featureData?.features ?? [
    { feature_name: 'Playlist Creation', category: 'Library', adoption_rate: 42.5, growth_rate: 5.2, retention_rate: 78.0 },
    { feature_name: 'Offline Download', category: 'Premium', adoption_rate: 65.0, growth_rate: 8.1, retention_rate: 91.2 },
    { feature_name: 'Lyrics Display', category: 'Playback', adoption_rate: 58.3, growth_rate: 12.0, retention_rate: 84.5 },
    { feature_name: 'Social Share', category: 'Social', adoption_rate: 18.2, growth_rate: 3.4, retention_rate: 62.0 },
    { feature_name: 'Search & Browse', category: 'Discovery', adoption_rate: 89.0, growth_rate: 2.1, retention_rate: 95.0 },
  ];

  return (
    <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
          <span>Product Feature Adoption & Usage Growth</span>
          <span className="text-xs font-normal text-yellow-400 bg-yellow-950/60 border border-yellow-800/50 px-2.5 py-1 rounded-full">
            Top Feature: Search & Browse (89.0%)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 bg-zinc-900/40 animate-pulse rounded-lg" />
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={features} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="feature_name" stroke="#71717a" tick={{ fontSize: 11 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }} />
                <Bar dataKey="adoption_rate" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Adoption Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
