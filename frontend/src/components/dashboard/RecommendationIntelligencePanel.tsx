import React from 'react';
import { RecommendationSummaryGrid } from './RecommendationSummaryGrid';
import { RecommendationPriorityChart } from './RecommendationPriorityChart';
import { RecommendationCategoryChart } from './RecommendationCategoryChart';
import { RecommendationImpactMatrix } from './RecommendationImpactMatrix';
import { RecommendationFilters } from './RecommendationFilters';
import { TopRecommendationsTable } from './TopRecommendationsTable';
import { Lightbulb } from 'lucide-react';

export const RecommendationIntelligencePanel: React.FC = React.memo(() => {
  return (
    <div className="space-y-6">
      {/* Top Row: Recommendation Summary Grid (4 Cards) */}
      <RecommendationSummaryGrid />

      {/* Middle Row: Recommendation Priority Chart + Recommendation Category Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecommendationPriorityChart />
        <RecommendationCategoryChart />
      </div>

      {/* Lower Row: Business Impact Matrix */}
      <RecommendationImpactMatrix />

      {/* Bottom Row: Recommendation Filters & Top Recommendations Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">
              Action Queue Explorer & Interventions
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400">Filter & Execute</span>
        </div>
        <RecommendationFilters />
        <TopRecommendationsTable />
      </div>
    </div>
  );
});

RecommendationIntelligencePanel.displayName = 'RecommendationIntelligencePanel';
