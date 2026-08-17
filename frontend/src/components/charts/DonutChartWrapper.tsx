import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ChartDataPoint } from '../../types/dashboard';

interface DonutChartWrapperProps {
  data: ChartDataPoint[];
  colors?: string[];
}

export const DonutChartWrapper: React.FC<DonutChartWrapperProps> = ({
  data,
  colors = ['#1DB954', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="rgba(0,0,0,0.4)" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#181818',
            borderColor: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#ffffff'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
