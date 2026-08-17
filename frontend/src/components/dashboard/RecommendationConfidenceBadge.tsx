import React from 'react';
import { Sparkles } from 'lucide-react';

interface RecommendationConfidenceBadgeProps {
  score: number | string;
}

export const RecommendationConfidenceBadge: React.FC<RecommendationConfidenceBadgeProps> = React.memo(({ score }) => {
  const numericScore = typeof score === 'number' ? score : parseFloat(String(score).replace('%', ''));

  let colorClass = 'bg-spotify-green/15 text-spotify-green border-spotify-green/30';
  if (isNaN(numericScore) || numericScore >= 90) {
    colorClass = 'bg-spotify-green/15 text-spotify-green border-spotify-green/30';
  } else if (numericScore >= 80) {
    colorClass = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  } else {
    colorClass = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${colorClass}`}
    >
      <Sparkles className="w-3 h-3" />
      <span>{typeof score === 'number' ? `${score}%` : score}</span>
    </span>
  );
});

RecommendationConfidenceBadge.displayName = 'RecommendationConfidenceBadge';
