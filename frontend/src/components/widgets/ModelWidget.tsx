import React from 'react';
import { Cpu, Award } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';

interface ModelWidgetProps {
  modelName?: string;
  version?: string;
  accuracy?: number;
  algorithm?: string;
}

export const ModelWidget: React.FC<ModelWidgetProps> = ({
  modelName = 'Premium Churn Prediction',
  version = 'v1.4.2',
  accuracy = 94.8,
  algorithm = 'XGBoost v2.0'
}) => {
  return (
    <GlassCard className="flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Champion ML Model</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold flex items-center gap-1">
          <Award className="w-3 h-3" />
          CHAMPION
        </span>
      </div>

      <div className="my-3">
        <h4 className="text-base font-bold text-white tracking-tight truncate">{modelName}</h4>
        <p className="text-xs font-mono text-neutral-400 mt-0.5">{algorithm} • {version}</p>
      </div>

      <div className="space-y-2 pt-2 border-t border-neutral-800/80">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400">ROC-AUC Score</span>
          <span className="font-mono font-bold text-spotify-green">{accuracy}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          <div className="h-full bg-spotify-green rounded-full" style={{ width: `${accuracy}%` }} />
        </div>
      </div>
    </GlassCard>
  );
};
