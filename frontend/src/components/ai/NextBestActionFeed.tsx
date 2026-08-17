import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { RecommendationResponse } from '@/api/ai';
import { Zap, CheckCircle, Sparkles } from 'lucide-react';

interface NextBestActionFeedProps {
  recommendationData?: RecommendationResponse;
  isLoading?: boolean;
}

export const NextBestActionFeed: React.FC<NextBestActionFeedProps> = ({ recommendationData, isLoading }) => {
  const primary = recommendationData?.primary_recommendation ?? {
    action_code: 'ACT_REC_PLAYLIST',
    action_category: 'Retention',
    title: 'Deliver Personalized Release Radar Mix',
    description: 'Push a custom curated playlist based on top listened genres to reduce skip friction.',
    expected_impact_percentage: 28.4,
    confidence_score: 0.92
  };

  return (
    <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Prescriptive Next Best Action (NBA) Engine
          </span>
          <span className="text-xs font-normal text-yellow-400 bg-yellow-950/60 border border-yellow-800/50 px-2.5 py-1 rounded-full">
            Confidence: {(primary.confidence_score * 100).toFixed(0)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-32 bg-zinc-900/40 animate-pulse rounded-lg" />
        ) : (
          <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-950/30 via-zinc-900/60 to-zinc-900/60 border border-yellow-800/40 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-yellow-950/80 border border-yellow-700/50 text-yellow-400 flex-shrink-0 mt-1">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <h4 className="text-base font-bold text-zinc-100">{primary.title}</h4>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 w-fit">
                  +{primary.expected_impact_percentage}% Expected Retention Lift
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">{primary.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-semibold text-xs transition-colors">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Execute Prescriptive Action
                </button>
                <span className="text-[10px] text-zinc-500 font-mono">Code: {primary.action_code}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
