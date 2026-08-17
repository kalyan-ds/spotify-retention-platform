import React from 'react';
import { CheckCircle2, AlertTriangle, CircleOff, ShieldAlert } from 'lucide-react';

export type HealthStatusType = 'Healthy' | 'Warning' | 'Offline' | 'Critical';

interface StatusBadgeProps {
  status: HealthStatusType;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = React.memo(({ status, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Healthy':
        return {
          colorClass: 'bg-spotify-green/15 text-spotify-green border-spotify-green/30',
          dotColor: 'bg-spotify-green',
          icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        };
      case 'Warning':
        return {
          colorClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          dotColor: 'bg-amber-400',
          icon: <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        };
      case 'Offline':
        return {
          colorClass: 'bg-neutral-800 text-neutral-400 border-neutral-700',
          dotColor: 'bg-neutral-500',
          icon: <CircleOff className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        };
      case 'Critical':
        return {
          colorClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          dotColor: 'bg-rose-400',
          icon: <ShieldAlert className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        };
      default:
        return {
          colorClass: 'bg-neutral-800 text-neutral-400 border-neutral-700',
          dotColor: 'bg-neutral-500',
          icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold rounded-full border ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${style.colorClass}`}
    >
      {style.icon}
      <span>{status}</span>
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';
