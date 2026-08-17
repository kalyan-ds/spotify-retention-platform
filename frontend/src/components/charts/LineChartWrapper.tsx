import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ChartDataPoint } from '../../types/dashboard';

interface LineChartWrapperProps {
  data: ChartDataPoint[];
  color?: string;
  dataKey?: string;
}

export const LineChartWrapper: React.FC<LineChartWrapperProps> = ({
  data,
  color = '#1DB954',
  dataKey = 'value'
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={3}
          dot={{ fill: color, r: 4 }}
          activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
