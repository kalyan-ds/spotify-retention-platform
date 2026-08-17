
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartTheme } from './theme';
import { Typography } from '@/components/typography/Typography';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface DataItem {
  name: string;
  [key: string]: any;
}

interface AreaChartProps {
  data: DataItem[];
  dataKey: string;
  height?: number;
  className?: string;
  color?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  return (
    <AnimatePresence>
      {active && payload && payload.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-[#09090b]/90 border border-border/50 rounded-xl p-3 shadow-2xl backdrop-blur-xl relative z-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <Typography variant="smallText" className="font-semibold text-white relative z-10">
            {label}
          </Typography>
          <div className="flex items-center space-x-2 mt-2 relative z-10">
            <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ backgroundColor: payload[0].color }} />
            <Typography variant="smallText" className="text-muted-foreground">
              {payload[0].name}: <span className="text-white font-medium">{payload[0].value.toLocaleString()}</span>
            </Typography>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export function AreaChart({ data, dataKey, height = 300, className, color = chartTheme.colors.primary }: AreaChartProps) {
  const gradientId = `color-${dataKey.replace(/\s+/g, '-')}`;

  return (
    <div className={cn("w-full", className)} style={{ minHeight: height }}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.colors.grid} vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: chartTheme.typography.fill, fontSize: chartTheme.typography.fontSize }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: chartTheme.typography.fill, fontSize: chartTheme.typography.fontSize }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
            isAnimationActive={true}
            animationDuration={200}
            animationEasing="ease-out"
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            activeDot={{ r: 5, fill: color, stroke: '#18181b', strokeWidth: 3, className: 'drop-shadow-[0_0_8px_currentColor] animate-pulse' }}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
