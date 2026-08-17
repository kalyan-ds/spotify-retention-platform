import React from 'react';

export const SkeletonCard: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-neutral-800 rounded-md" />
            <div className="h-8 w-8 bg-neutral-800 rounded-xl" />
          </div>
          <div className="h-8 w-20 bg-neutral-800 rounded-md" />
          <div className="h-3 w-36 bg-neutral-800/60 rounded-md" />
        </div>
      ))}
    </>
  );
};
