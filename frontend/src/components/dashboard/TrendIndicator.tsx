import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  value: string;
  invertColor?: boolean; // If true, negative trend is good (e.g. reduced latency)
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ value, invertColor = false }) => {
  const isZero = value === '0' || value === '0%' || value === '0.0%';
  const isNegative = value.startsWith('-');

  let isGood = !isZero && (invertColor ? isNegative : !isNegative);

  let textColor = 'text-spotify-green';
  let bgColor = 'bg-spotify-green/10 border-spotify-green/20';

  if (isZero) {
    textColor = 'text-neutral-400';
    bgColor = 'bg-neutral-800 border-neutral-700';
  } else if (!isGood) {
    textColor = 'text-rose-400';
    bgColor = 'bg-rose-500/10 border-rose-500/20';
  }

  return (
    <span
      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${bgColor} ${textColor}`}
    >
      {isZero ? (
        <Minus className="w-3 h-3" />
      ) : isNegative ? (
        <ArrowDownRight className="w-3.5 h-3.5" />
      ) : (
        <ArrowUpRight className="w-3.5 h-3.5" />
      )}
      <span>{value}</span>
    </span>
  );
};
