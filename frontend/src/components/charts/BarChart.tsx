
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { chartTheme } from './theme';
import { Typography } from '@/components/typography/Typography';
import { cn } from '@/utils/cn';

interface DataItem {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

interface BarChartProps {
  data: DataItem[];
  height?: number;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#09090b]/90 border border-border/50 rounded-lg p-3 shadow-xl backdrop-blur-md">
        <Typography variant="smallText" className="font-semibold text-white">
          {data.name}
        </Typography>
        <Typography variant="smallText" className="text-muted-foreground mt-1 block">
          {data.value.toLocaleString()}
        </Typography>
      </div>
    );
  }
  return null;
};

export function BarChart({ data, height = 300, className, layout = 'horizontal' }: BarChartProps) {
  const isVertical = layout === 'vertical';

  return (
    <div className={cn("w-full", className)} style={{ minHeight: height }}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{ top: 10, right: 10, left: isVertical ? 30 : -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.colors.grid} vertical={false} />
          <XAxis
            dataKey={isVertical ? "value" : "name"}
            type={isVertical ? "number" : "category"}
            axisLine={false}
            tickLine={false}
            tick={{ fill: chartTheme.typography.fill, fontSize: chartTheme.typography.fontSize }}
          />
          <YAxis
            dataKey={isVertical ? "name" : "value"}
            type={isVertical ? "category" : "number"}
            axisLine={false}
            tickLine={false}
            tick={{ fill: chartTheme.typography.fill, fontSize: chartTheme.typography.fontSize }}
            width={isVertical ? 80 : 40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
          <Bar dataKey="value" radius={4}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || chartTheme.colors.primary} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
