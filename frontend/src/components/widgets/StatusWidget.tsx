import React from 'react';
import { Activity } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { GlassCard } from '../cards/GlassCard';

interface StatusWidgetProps {
  name: string;
  status: 'Healthy' | 'Degraded' | 'Critical';
  latency?: string;
  uptime?: string;
}

export const StatusWidget: React.FC<StatusWidgetProps> = ({
  name,
  status,
  latency = '< 2ms',
  uptime = '99.99%'
}) => {
  return (
    <GlassCard className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-neutral-800 text-spotify-green">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">{name}</h4>
          <p className="text-[10px] font-mono text-neutral-400 mt-0.5">Uptime: {uptime} • Latency: {latency}</p>
        </div>
      </div>
      <StatusBadge status={status} size="sm" />
    </GlassCard>
  );
};
