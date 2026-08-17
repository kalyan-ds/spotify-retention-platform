
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { chartTheme } from './theme';
import { Typography } from '@/components/typography/Typography';
import { cn } from '@/utils/cn';

interface DataItem {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

interface DonutChartProps {
  data: DataItem[];
  height?: number;
  className?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#09090b]/90 border border-border/50 rounded-lg p-3 shadow-xl backdrop-blur-md">
        <Typography variant="smallText" className="font-semibold text-white">
          {data.name}
        </Typography>
        <div className="flex items-center space-x-2 mt-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color || chartTheme.colors.primary }} />
          <Typography variant="smallText" className="text-muted-foreground">
            {data.value.toLocaleString()} {data.percentage ? `(${data.percentage}%)` : ''}
          </Typography>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <ul className="flex flex-col space-y-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.value}</span>
          </div>
          <span className="font-medium text-foreground">
            {entry.payload.percentage ? `${entry.payload.percentage}%` : entry.payload.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

export function DonutChart({ data, height = 300, className }: DonutChartProps) {
  return (
    <div className={cn("w-full", className)} style={{ minHeight: height }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || chartTheme.colors.primary} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} layout="vertical" verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
