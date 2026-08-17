import React from 'react';
import { Activity } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';

export const UsageStatistics: React.FC = () => {
  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white tracking-tight">Platform Telemetry & Infrastructure Usage</h3>
        </div>
        <span className="text-xs font-mono text-neutral-400">Continuous Monitoring</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">PROCESS RSS MEMORY</p>
          <p className="text-xl font-extrabold text-white font-mono mt-1">14.50 MB</p>
          <p className="text-[10px] text-neutral-500 mt-1">Ultra-lean footprint</p>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">FEATURE STORE LOOKUP</p>
          <p className="text-xl font-extrabold text-spotify-green font-mono mt-1">0.90 ms</p>
          <p className="text-[10px] text-neutral-500 mt-1">25 Feature Vectors</p>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">QUERY CACHE EFFICIENCY</p>
          <p className="text-xl font-extrabold text-purple-400 font-mono mt-1">92.4% Hit</p>
          <p className="text-[10px] text-neutral-500 mt-1">TanStack Client Cache</p>
        </div>
      </div>
    </GlassCard>
  );
};
