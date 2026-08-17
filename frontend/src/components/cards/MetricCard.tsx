import React from 'react';
import { MetricCardData } from '../../types/dashboard';
import { GlassCard } from './GlassCard';

interface MetricCardProps {
  data?: MetricCardData;
  title?: string;
  value?: string | number;
  metric?: string | number;
  subtitle?: string;
  trend?: any;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  lineColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  data,
  title,
  value,
  metric,
  subtitle,
  trend,
  icon
}) => {
  const displayTitle = title || data?.title || '';
  const displayMetric = value || metric || data?.metric || '';
  const displaySubtitle = subtitle || data?.subtitle || '';
  const displayTrend = trend || data?.trend;

  return (
    <GlassCard>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-neutral-400 font-medium">{displayTitle}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-xl font-bold text-white font-mono">{displayMetric}</h4>
            {displayTrend && (
              <span className="text-xs font-mono font-semibold text-spotify-green">
                {typeof displayTrend === 'object' ? displayTrend.value : displayTrend}
              </span>
            )}
          </div>
        </div>
        {icon && <div className="p-2.5 rounded-xl bg-neutral-800/80 text-spotify-green">{icon}</div>}
      </div>
      {displaySubtitle && <p className="text-xs text-neutral-500 mt-2">{displaySubtitle}</p>}
    </GlassCard>
  );
};
