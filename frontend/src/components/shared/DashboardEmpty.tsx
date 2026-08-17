import React from 'react';
import { Database, RotateCcw } from 'lucide-react';

interface DashboardEmptyProps {
  title?: string;
  message?: string;
  onRefresh?: () => void;
  className?: string;
}

export const DashboardEmpty: React.FC<DashboardEmptyProps> = React.memo(({
  title = 'No Data Available',
  message = 'There are currently no records or telemetry metrics available for this view.',
  onRefresh,
  className = ''
}) => {
  return (
    <div className={`p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 text-center space-y-3 ${className}`}>
      <div className="inline-flex p-3 rounded-2xl bg-neutral-800/80 text-neutral-400 border border-neutral-700/50">
        <Database className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
        <p className="text-xs text-neutral-400 leading-relaxed">{message}</p>
      </div>
      {onRefresh && (
        <button
          onClick={onRefresh}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      )}
    </div>
  );
});

DashboardEmpty.displayName = 'DashboardEmpty';
