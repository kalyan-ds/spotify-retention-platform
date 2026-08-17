import React from 'react';
import { Lightbulb, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';

interface RecommendationWidgetProps {
  totalGenerated?: number;
  acceptanceRate?: number;
  retainedValue?: string;
}

export const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({
  totalGenerated = 45200,
  acceptanceRate = 78.6,
  retainedValue = '$1.42M'
}) => {
  return (
    <GlassCard className="flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Prescriptive Interventions</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
          NBA ACTIVE
        </span>
      </div>

      <div className="my-4">
        <p className="text-xs text-neutral-400">Actions Delivered</p>
        <h2 className="text-3xl font-extrabold text-white font-mono mt-0.5 tracking-tight">
          {totalGenerated.toLocaleString()}
        </h2>
        <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-spotify-green">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>+8.2% acceptance lift</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-800/80">
        <div className="p-2.5 rounded-xl bg-neutral-900/60">
          <div className="flex items-center gap-1 text-spotify-green text-[10px] font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>ACCEPTANCE RATE</span>
          </div>
          <p className="text-lg font-bold text-white font-mono mt-1">{acceptanceRate}%</p>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-900/60">
          <p className="text-[10px] text-neutral-400 font-mono">RETAINED ARR</p>
          <p className="text-lg font-bold text-spotify-green font-mono mt-1">{retainedValue}</p>
        </div>
      </div>
    </GlassCard>
  );
};
