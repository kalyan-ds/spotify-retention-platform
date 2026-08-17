import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import { TrendIndicator } from './TrendIndicator';
import { KPISparkline } from './KPISparkline';
import { Sparkles, CheckCircle2, ShieldCheck, Activity, Gauge, Zap } from 'lucide-react';

export type KPIStatusType = 'Excellent' | 'Healthy' | 'Stable' | 'Busy' | 'Optimized';

export interface ExecutiveKPICardProps {
  title: string;
  value: string | number;
  trend: string;
  status: KPIStatusType;
  icon: React.ReactNode;
  sparklineData: number[];
  accentColor?: string;
  invertTrendColor?: boolean;
}

export const ExecutiveKPICard: React.FC<ExecutiveKPICardProps> = React.memo(({
  title,
  value,
  trend,
  status,
  icon,
  sparklineData,
  accentColor = '#1DB954',
  invertTrendColor = false
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'Excellent':
        return {
          bg: 'bg-spotify-green/15 text-spotify-green border-spotify-green/30',
          icon: <Sparkles className="w-3 h-3" />
        };
      case 'Healthy':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle2 className="w-3 h-3" />
        };
      case 'Stable':
        return {
          bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          icon: <ShieldCheck className="w-3 h-3" />
        };
      case 'Busy':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: <Activity className="w-3 h-3" />
        };
      case 'Optimized':
        return {
          bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
          icon: <Gauge className="w-3 h-3" />
        };
      default:
        return {
          bg: 'bg-neutral-800 text-neutral-300 border-neutral-700',
          icon: <Zap className="w-3 h-3" />
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className="p-5 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-200 hover:border-spotify-green/30 hover:shadow-2xl hover:shadow-spotify-green/5 flex flex-col justify-between relative overflow-hidden group"
    >
      {/* Top row: Icon, Status Badge */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/50 group-hover:scale-105 transition-transform"
          style={{ color: accentColor }}
        >
          {icon}
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badge.bg}`}
        >
          {badge.icon}
          {status}
        </span>
      </div>

      {/* Title & Value */}
      <div className="space-y-1 my-1">
        <p className="text-xs font-semibold text-neutral-400 truncate tracking-wide">{title}</p>
        <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          <AnimatedCounter value={value} />
        </h3>
      </div>

      {/* Bottom row: Trend Indicator & Sparkline */}
      <div className="flex items-end justify-between gap-2 mt-4 pt-3 border-t border-neutral-800/80">
        <TrendIndicator value={trend} invertColor={invertTrendColor} />
        <div className="w-24 shrink-0">
          <KPISparkline data={sparklineData} color={accentColor} />
        </div>
      </div>
    </motion.div>
  );
});

ExecutiveKPICard.displayName = 'ExecutiveKPICard';
