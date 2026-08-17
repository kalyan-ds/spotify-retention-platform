import { motion } from 'framer-motion';
import { BaseKPI } from '@/analytics/types';
import { Typography } from '@/components/typography/Typography';
import { cn } from '@/utils/cn';
import { ScaleIn, AnimatedCounter, CursorLight, Reflection, TRANSITIONS } from '@/components/motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Sparkline } from './Sparkline';
import { useMemo } from 'react';

export interface KPICardProps extends Omit<BaseKPI, 'id'> {
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  sparklineData?: number[];
  loading?: boolean;
  className?: string;
  delay?: number;
}

const parseValue = (val: string | number) => {
  if (typeof val === 'number') return { number: val, prefix: '', suffix: '', decimals: val % 1 !== 0 ? 2 : 0, valid: true };
  const match = val.match(/^([^\d-]*)(-?[\d,.]+)([^\d]*)$/);
  if (!match || isNaN(parseFloat(match[2].replace(/,/g, '')))) return { number: 0, prefix: '', suffix: '', decimals: 0, valid: false };

  const prefix = match[1];
  const numStr = match[2].replace(/,/g, '');
  const suffix = match[3];

  const number = parseFloat(numStr);
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;

  return { prefix, number, suffix, decimals, valid: true };
};

export function KPICard({
  title,
  value,
  trend,
  icon,
  badge,
  sparklineData,
  loading,
  className,
  delay = 0
}: KPICardProps) {

  const isPositive = trend.direction === 'up';
  const isNegative = trend.direction === 'down';

  const trendConfig = {
    up: {
      color: 'text-[#1ed760]',
      bg: 'bg-[#1ed760]/10 border-[#1ed760]/20',
      icon: <ArrowUpRight className="w-3 h-3" />
    },
    down: {
      color: 'text-destructive',
      bg: 'bg-destructive/10 border-destructive/20',
      icon: <ArrowDownRight className="w-3 h-3" />
    },
    neutral: {
      color: 'text-muted-foreground',
      bg: 'bg-secondary/50 border-border/50',
      icon: <Minus className="w-3 h-3" />
    }
  };

  const currentTrend = trendConfig[trend.direction as keyof typeof trendConfig] || trendConfig.neutral;

  const parsed = useMemo(() => parseValue(value), [value]);

  const memoizedSparkline = useMemo(() => {
    if (sparklineData) return sparklineData;
    let current = 50;
    return Array.from({ length: 12 }).map(() => {
      const change = (Math.random() - (isNegative ? 0.7 : isPositive ? 0.3 : 0.5)) * 10;
      current = Math.max(0, Math.min(100, current + change));
      return current;
    });
  }, [sparklineData, isPositive, isNegative]);

  if (loading) {
    return (
      <div className={cn("p-6 rounded-xl bg-card border border-border/50 shadow-sm animate-pulse flex flex-col min-h-[160px]", className)}>
        <div className="h-4 bg-secondary w-1/3 rounded mb-4"></div>
        <div className="h-8 bg-secondary w-1/2 rounded mb-2"></div>
        <div className="h-3 bg-secondary w-1/4 rounded mt-auto"></div>
      </div>
    );
  }

  return (
    <ScaleIn delay={delay}>
      <motion.div
        whileHover="hover"
        initial="initial"
        animate="animate"
        className={cn(
          "relative overflow-hidden p-5 sm:p-6 rounded-xl bg-card border border-border/50 shadow-sm group flex flex-col h-full min-h-[160px]",
          className
        )}
        variants={{
          initial: { y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" },
          animate: { y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" },
          hover: {
            y: -4,
            boxShadow: "0 20px 25px -5px rgba(30, 215, 96, 0.05), 0 10px 10px -5px rgba(30, 215, 96, 0.02), inset 0 0 12px rgba(30, 215, 96, 0.1)",
            borderColor: "rgba(30, 215, 96, 0.3)"
          }
        }}
        transition={TRANSITIONS.hover}
      >
        <CursorLight />
        <Reflection duration={1.5} />

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#1ed760]/5 to-transparent opacity-0 pointer-events-none rounded-xl"
          variants={{
            initial: { opacity: 0 },
            hover: { opacity: 1 }
          }}
        />

        <div className="flex justify-between items-start mb-2 relative z-10">
          <Typography variant="caption" className="text-muted-foreground uppercase tracking-wider font-semibold">
            {title}
          </Typography>
          {icon && (
            <motion.div
              variants={{
                initial: { opacity: 0.8, scale: 1, rotate: 0, filter: "drop-shadow(0 0 0 rgba(30, 215, 96, 0))" },
                hover: { opacity: 1, scale: 1.1, rotate: 5, filter: "drop-shadow(0 0 8px rgba(30, 215, 96, 0.5))" }
              }}
              transition={TRANSITIONS.hover}
              className="text-[#1ed760]"
            >
              {icon}
            </motion.div>
          )}
        </div>

        <div className="flex items-baseline space-x-2 relative z-10 mb-4">
          <Typography variant="metricValue" as="h2" className="font-bold tracking-tight">
            {!parsed.valid ? value : (
              <AnimatedCounter
                value={parsed.number}
                prefix={parsed.prefix}
                suffix={parsed.suffix}
                decimals={parsed.decimals}
                duration={1.5}
                delay={delay + 0.3}
              />
            )}
          </Typography>
          {badge && badge}
        </div>

        <div className="flex items-end justify-between mt-auto relative z-10">
          <div className="flex flex-col space-y-1.5">
            <div className={cn("inline-flex items-center space-x-1 px-2 py-0.5 rounded-full border text-xs font-semibold", currentTrend.bg, currentTrend.color)}>
              {currentTrend.icon}
              <span>{trend.value}</span>
            </div>
            {trend.label && (
              <Typography variant="smallText" className="text-muted-foreground/70">
                {trend.label}
              </Typography>
            )}
          </div>

          <motion.div
            className="w-16 h-8 flex-shrink-0"
            variants={{
              initial: { filter: "brightness(0.9)" },
              hover: { filter: "brightness(1.2)" }
            }}
          >
            <Sparkline
              data={memoizedSparkline}
              color={isPositive ? '#1ed760' : isNegative ? '#e91429' : '#8b949e'}
            />
          </motion.div>
        </div>
      </motion.div>
    </ScaleIn>
  );
}
