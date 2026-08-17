import React from 'react';
import { Activity, BrainCircuit, Lightbulb, Cpu, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';

export const LiveActivityFeed: React.FC = () => {
  const events = [
    { title: 'Real-time Churn Prediction Executed', detail: 'User ID #42 churn probability calculated (78.4%)', time: '1m ago', icon: <BrainCircuit className="w-4 h-4 text-purple-400" /> },
    { title: 'Next Best Action Generated', detail: 'Prescriptive action #101 dispatched to retention pipeline', time: '3m ago', icon: <Lightbulb className="w-4 h-4 text-amber-400" /> },
    { title: 'Champion Model Health Verification', detail: 'All 4 models evaluated healthy with sub-2ms latency', time: '8m ago', icon: <ShieldCheck className="w-4 h-4 text-spotify-green" /> },
    { title: 'PSI Feature Drift Batch Computed', detail: '25 feature distributions verified against baseline', time: '14m ago', icon: <Cpu className="w-4 h-4 text-blue-400" /> }
  ];

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-spotify-green animate-pulse" />
          <h3 className="text-base font-bold text-white tracking-tight">Live Activity Timeline</h3>
        </div>
        <span className="text-xs font-mono text-spotify-green">Live Feed</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
        {events.map((e, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-neutral-900 border-2 border-spotify-green group-hover:scale-125 transition-transform" />
            <div>
              <p className="text-xs font-bold text-white group-hover:text-spotify-green transition-colors">{e.title}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{e.detail}</p>
              <span className="text-[10px] font-mono text-neutral-500 mt-1 block">{e.time}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
