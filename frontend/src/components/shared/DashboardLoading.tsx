import React from 'react';

interface DashboardLoadingProps {
  cardsCount?: number;
  height?: string;
  className?: string;
}

export const DashboardLoading: React.FC<DashboardLoadingProps> = React.memo(({
  cardsCount = 4,
  height = 'h-32',
  className = ''
}) => {
  return (
    <div
      className={`space-y-4 ${className}`}
      role="status"
      aria-busy="true"
      aria-label="Loading dashboard metrics"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: cardsCount }).map((_, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/5 animate-pulse flex flex-col justify-between ${height}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 bg-neutral-800 rounded w-1/2" />
              <div className="w-8 h-8 rounded-xl bg-neutral-800" />
            </div>
            <div className="space-y-2">
              <div className="h-7 bg-neutral-800 rounded w-3/4" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 bg-neutral-800 rounded w-1/3" />
                <div className="h-4 bg-neutral-800 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading dashboard components...</span>
    </div>
  );
});

DashboardLoading.displayName = 'DashboardLoading';
