import React from 'react';

export const SkeletonChart: React.FC<{ height?: string }> = ({ height = 'h-64' }) => {
  return (
    <div className={`p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 animate-pulse ${height} flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <div className="h-4 w-36 bg-neutral-800 rounded-md" />
        <div className="h-4 w-16 bg-neutral-800 rounded-md" />
      </div>
      <div className="flex items-end gap-2 h-40 pt-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-neutral-800 rounded-t-md"
            style={{ height: `${Math.floor(Math.random() * 60) + 30}%` }}
          />
        ))}
      </div>
    </div>
  );
};
