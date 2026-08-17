import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { KpiMetric } from '../../types/dashboard';

export const KpiCard: React.FC<{ metric: KpiMetric; icon?: React.ReactNode }> = ({ metric, icon }) => {
  const isPositive = metric.changeType === 'increase';
  const isNeutral = metric.changeType === 'neutral';

  return (
    <GlassCard>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{metric.title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono tracking-tight">
            {metric.value}
          </h3>
        </div>
        {icon && <div className="p-3 rounded-xl bg-neutral-800/80 text-spotify-green">{icon}</div>}
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs font-medium">
        <span
          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-mono font-bold ${
            isNeutral
              ? 'bg-neutral-800 text-neutral-400'
              : isPositive
              ? 'bg-spotify-green/15 text-spotify-green'
              : 'bg-rose-500/15 text-rose-400'
          }`}
        >
          {isNeutral ? (
            <Minus className="w-3 h-3" />
          ) : isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {Math.abs(metric.change)}%
        </span>
        <span className="text-neutral-500">{metric.timeframe}</span>
      </div>
      {metric.description && <p className="text-xs text-neutral-400 mt-2 truncate">{metric.description}</p>}
    </GlassCard>
  );
};
