import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';
import { StatusBadge } from '../common/StatusBadge';

export const RecentPredictions: React.FC = () => {
  const mockPredictions = [
    { userId: 42, prob: '78.4%', risk: 'Critical', days: 12, time: '2m ago' },
    { userId: 108, prob: '14.2%', risk: 'Low', days: 88, time: '5m ago' },
    { userId: 256, prob: '54.1%', risk: 'High', days: 28, time: '8m ago' },
    { userId: 512, prob: '32.6%', risk: 'Medium', days: 45, time: '12m ago' }
  ];

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold text-white tracking-tight">Recent Live Inferences</h3>
        </div>
        <span className="text-xs font-mono text-neutral-400">Sub-2ms SLA</span>
      </div>

      <div className="space-y-2.5">
        {mockPredictions.map((p, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between hover:bg-neutral-800/50 transition-colors">
            <div>
              <p className="text-xs font-bold text-white font-mono">User ID #{p.userId}</p>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Est. Churn in {p.days} days • {p.time}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-white">{p.prob}</span>
              <StatusBadge status={p.risk} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
