import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = React.memo(() => {
  const status = useOnlineStatus();

  if (status === 'Online') {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full bg-rose-950/90 border-b border-rose-500/30 backdrop-blur-xl px-4 py-2 text-rose-200 text-xs font-mono flex items-center justify-between shadow-lg z-50 animate-slide-down"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          {status === 'Offline' ? (
            <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
          )}
          <span>
            {status === 'Offline'
              ? 'Network Connection Lost. Viewing cached dashboard data. Auto-sync will resume when reconnected.'
              : 'Reconnecting to Spotify Platform backend services...'}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 shrink-0">
          {status}
        </span>
      </div>
    </div>
  );
});

OfflineBanner.displayName = 'OfflineBanner';
