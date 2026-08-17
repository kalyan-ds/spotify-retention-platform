import React from 'react';
import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  status: 'Critical' | 'High' | 'Medium' | 'Low' | 'Healthy' | 'Degraded' | 'Production' | 'Staging' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getVariantClasses = () => {
    switch (status.toLowerCase()) {
      case 'critical':
      case 'unhealthy':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'high':
      case 'degraded':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'medium':
        return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
      case 'low':
      case 'healthy':
      case 'production':
        return 'bg-spotify-green/15 text-spotify-green border-spotify-green/30';
      case 'staging':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-semibold rounded-full border',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        getVariantClasses()
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {status}
    </span>
  );
};
