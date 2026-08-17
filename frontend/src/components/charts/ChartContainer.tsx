import React from 'react';
import { GlassCard } from '../cards/GlassCard';
import { SkeletonChart } from '../common/SkeletonChart';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
  height?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  actions,
  loading = false,
  children,
  height = 'h-72'
}) => {
  if (loading) {
    return <SkeletonChart height={height} />;
  }

  return (
    <GlassCard className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <div className={`w-full ${height} relative`}>{children}</div>
    </GlassCard>
  );
};
