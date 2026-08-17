import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';
import { GaugeChart } from '../charts/GaugeChart';

interface HealthWidgetProps {
  score?: number;
  healthyModels?: number;
  degradedModels?: number;
  offlineModels?: number;
  latencyMs?: number;
}

export const HealthWidget: React.FC<HealthWidgetProps> = ({
  score = 98.4,
  healthyModels = 4,
  degradedModels = 0,
  offlineModels = 0,
  latencyMs = 1.99
}) => {
  return (
    <GlassCard className="flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-spotify-green" />
          <h3 className="text-sm font-bold text-white tracking-tight">AI Engine Health</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-spotify-green/10 text-spotify-green border border-spotify-green/20 font-bold">
          OPERATIONAL
        </span>
      </div>

      <div className="my-2 flex justify-center">
        <GaugeChart value={score} title="Platform Readiness" label="Health Score" color="#1DB954" />
      </div>

      <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-neutral-800/80 text-center">
        <div className="p-1.5 rounded-xl bg-neutral-900/60">
          <p className="text-[9px] text-neutral-400 font-mono">HEALTHY</p>
          <p className="text-sm font-extrabold text-spotify-green font-mono">{healthyModels}</p>
        </div>
        <div className="p-1.5 rounded-xl bg-neutral-900/60">
          <p className="text-[9px] text-neutral-400 font-mono">DEGRADED</p>
          <p className="text-sm font-extrabold text-amber-400 font-mono">{degradedModels}</p>
        </div>
        <div className="p-1.5 rounded-xl bg-neutral-900/60">
          <p className="text-[9px] text-neutral-400 font-mono">OFFLINE</p>
          <p className="text-sm font-extrabold text-rose-400 font-mono">{offlineModels}</p>
        </div>
        <div className="p-1.5 rounded-xl bg-neutral-900/60">
          <p className="text-[9px] text-neutral-400 font-mono">LATENCY</p>
          <p className="text-sm font-extrabold text-blue-400 font-mono">{latencyMs}ms</p>
        </div>
      </div>
    </GlassCard>
  );
};
