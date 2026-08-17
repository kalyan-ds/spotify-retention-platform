import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ChartDataPoint } from '../../types/dashboard';

interface BarChartWrapperProps {
  data: ChartDataPoint[];
  color?: string;
  dataKey?: string;
}

export const BarChartWrapper: React.FC<BarChartWrapperProps> = ({
  data,
  color = '#1DB954',
  dataKey = 'value'
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="label" stroke="#888888" fontSize={11} tickLine={false} />
        <YAxis stroke="#888888" fontSize={11} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#181818',
            borderColor: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#ffffff'
          }}
        />
        <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
