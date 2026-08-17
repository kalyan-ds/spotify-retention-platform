import React from 'react';
import { PredictionSummaryGrid } from './PredictionSummaryGrid';
import { PredictionTrendChart } from './PredictionTrendChart';
import { ConfidenceDistributionChart } from './ConfidenceDistributionChart';
import { PredictionCategoryChart } from './PredictionCategoryChart';
import { PredictionFilters } from './PredictionFilters';
import { RecentPredictionsTable } from './RecentPredictionsTable';
import { Brain } from 'lucide-react';

export const PredictionIntelligencePanel: React.FC = React.memo(() => {
  return (
    <div className="space-y-6">
      {/* Top Row: Prediction Summary Grid (4 Cards) */}
      <PredictionSummaryGrid />

      {/* Middle Row: Prediction Trend Chart (Line) + Confidence Distribution Chart (Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PredictionTrendChart />
        </div>
        <div>
          <ConfidenceDistributionChart />
        </div>
      </div>

      {/* Lower Row: Prediction Category Breakdown */}
      <PredictionCategoryChart />

      {/* Bottom Row: Prediction Filters & Recent Predictions Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-spotify-green" />
            <h3 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">
              Live Prediction Log & Explorer
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400">Filter & Inspect</span>
        </div>
        <PredictionFilters />
        <RecentPredictionsTable />
      </div>
    </div>
  );
});

PredictionIntelligencePanel.displayName = 'PredictionIntelligencePanel';
