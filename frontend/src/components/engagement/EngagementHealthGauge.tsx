import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { EngagementHealthResponse } from '@/api/engagement';
import { Activity, Volume2, ShieldCheck, Layers } from 'lucide-react';

interface EngagementHealthGaugeProps {
  healthData?: EngagementHealthResponse;
  isLoading?: boolean;
}

export const EngagementHealthGauge: React.FC<EngagementHealthGaugeProps> = ({ healthData, isLoading }) => {
  const score = healthData?.overall_engagement_score ?? 78.2;
  const category = healthData?.health_category ?? 'Excellent';
  const subScores = healthData?.sub_scores ?? {
    activity_score: 82.0,
    volume_score: 75.5,
    session_quality_score: 88.0,
    feature_breadth_score: 64.0
  };

  return (
    <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
          <span>Composite Engagement Health Index</span>
          <span className="text-xs font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            Rating: {category}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-56 bg-zinc-900/40 animate-pulse rounded-lg" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Gauge Circle */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-4 border-emerald-500/30 bg-emerald-950/20 shadow-inner">
                <div className="text-center">
                  <span className="text-3xl font-extrabold text-zinc-100">{score}</span>
                  <span className="block text-xs text-zinc-400 font-medium mt-0.5">/ 100 Index</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mt-3 text-center">
                Multi-pillar index combining DAU/WAU frequency, play volume, and feature adoption.
              </p>
            </div>

            {/* Sub-score Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-400" /> Activity Frequency</span>
                  <span className="font-semibold">{subScores.activity_score}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div style={{ width: `${subScores.activity_score}%` }} className="h-full bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span className="flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5 text-blue-400" /> Play Volume & Completion</span>
                  <span className="font-semibold">{subScores.volume_score}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div style={{ width: `${subScores.volume_score}%` }} className="h-full bg-blue-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Session Quality</span>
                  <span className="font-semibold">{subScores.session_quality_score}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div style={{ width: `${subScores.session_quality_score}%` }} className="h-full bg-purple-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-yellow-400" /> Feature Breadth</span>
                  <span className="font-semibold">{subScores.feature_breadth_score}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div style={{ width: `${subScores.feature_breadth_score}%` }} className="h-full bg-yellow-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
