import React from 'react';
import { Clock } from 'lucide-react';

interface LastUpdatedProps {
  timestamp?: Date | string | null;
  className?: string;
}

export const LastUpdated: React.FC<LastUpdatedProps> = React.memo(({
  timestamp = new Date(),
  className = ''
}) => {
  const formatTime = (ts: Date | string | null) => {
    if (!ts) return 'Just now';
    const d = typeof ts === 'string' ? new Date(ts) : ts;
    if (isNaN(d.getTime())) return 'Just now';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className={`inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 ${className}`}>
      <Clock className="w-3 h-3 text-neutral-500" />
      <span>Updated at <strong className="text-neutral-300 font-semibold">{formatTime(timestamp)}</strong></span>
    </div>
  );
});

LastUpdated.displayName = 'LastUpdated';
