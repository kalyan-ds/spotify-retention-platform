import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface RefreshIndicatorProps {
  intervalSeconds?: number;
  isAutoRefreshActive?: boolean;
  className?: string;
}

export const RefreshIndicator: React.FC<RefreshIndicatorProps> = React.memo(({
  intervalSeconds = 30,
  isAutoRefreshActive = true,
  className = ''
}) => {
  const networkStatus = useOnlineStatus();

  const getNetworkBadge = () => {
    switch (networkStatus) {
      case 'Online':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Wifi className="w-3 h-3" />
            <span>Online</span>
          </span>
        );
      case 'Reconnecting':
        return (
          <span className="inline-flex items-center gap-1 text-amber-400 font-mono text-[10px]">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Reconnecting...</span>
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center gap-1 text-rose-400 font-mono text-[10px]">
            <WifiOff className="w-3 h-3" />
            <span>Offline</span>
          </span>
        );
    }
  };

  return (
    <div className={`flex items-center gap-2.5 px-2.5 py-1 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs font-mono ${className}`}>
      {getNetworkBadge()}
      <span className="text-neutral-600">|</span>
      <span className="text-neutral-400 text-[10px]">
        {isAutoRefreshActive ? `Auto-Sync ${intervalSeconds}s` : 'Auto-Sync Paused'}
      </span>
    </div>
  );
});

RefreshIndicator.displayName = 'RefreshIndicator';
