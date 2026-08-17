import React from 'react';
import { BrainCircuit, TrendingUp, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';

interface PredictionWidgetProps {
  totalPredictions?: number;
  highRiskCount?: number;
  avgChurnProbability?: number;
}

export const PredictionWidget: React.FC<PredictionWidgetProps> = ({
  totalPredictions = 142850,
  highRiskCount = 8420,
  avgChurnProbability = 18.4
}) => {
  return (
    <GlassCard className="flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Prediction Engine</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
          REAL-TIME
        </span>
      </div>

      <div className="my-4">
        <p className="text-xs text-neutral-400">Total Inferences (24h)</p>
        <h2 className="text-3xl font-extrabold text-white font-mono mt-0.5 tracking-tight">
          {totalPredictions.toLocaleString()}
        </h2>
        <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-spotify-green">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+12.4% vs previous 24h</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-800/80">
        <div className="p-2.5 rounded-xl bg-neutral-900/60">
          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-mono">
            <AlertTriangle className="w-3 h-3" />
            <span>HIGH RISK USERS</span>
          </div>
          <p className="text-lg font-bold text-white font-mono mt-1">{highRiskCount.toLocaleString()}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-900/60">
          <p className="text-[10px] text-neutral-400 font-mono">AVG CHURN PROB</p>
          <p className="text-lg font-bold text-white font-mono mt-1">{avgChurnProbability}%</p>
        </div>
      </div>
    </GlassCard>
  );
};
