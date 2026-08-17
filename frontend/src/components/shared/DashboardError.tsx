import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

interface DashboardErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const DashboardError: React.FC<DashboardErrorProps> = React.memo(({
  title = 'Telemetry & API Connection Error',
  message = 'Unable to fetch real-time dashboard metrics from the microservice cluster.',
  onRetry,
  className = ''
}) => {
  return (
    <div
      className={`p-6 rounded-2xl bg-rose-950/20 backdrop-blur-xl border border-rose-500/20 text-center space-y-4 ${className}`}
      role="alert"
    >
      <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
        <p className="text-xs text-neutral-400 leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
});

DashboardError.displayName = 'DashboardError';
