import React from 'react';
import { RotateCcw } from 'lucide-react';

interface RefreshButtonProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const RefreshButton: React.FC<RefreshButtonProps> = React.memo(({
  onRefresh,
  isRefreshing = false,
  className = '',
  size = 'sm'
}) => {
  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-1 text-[11px]'
    : 'px-3.5 py-1.5 text-xs';

  return (
    <button
      onClick={onRefresh}
      disabled={isRefreshing}
      type="button"
      aria-label="Refresh dashboard data"
      aria-busy={isRefreshing}
      className={`inline-flex items-center gap-1.5 rounded-xl font-mono font-bold bg-neutral-800/90 hover:bg-neutral-700/90 text-neutral-300 hover:text-white border border-neutral-700/60 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-spotify-green/40 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${className}`}
    >
      <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-spotify-green' : ''}`} />
      <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
    </button>
  );
});

RefreshButton.displayName = 'RefreshButton';
