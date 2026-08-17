import React from 'react';
import { Lightbulb } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';

export const RecentRecommendations: React.FC = () => {
  const recs = [
    { title: '30-Day Extension Offer', target: 'User #42', impact: 'High (+85%)', status: 'Delivered', time: '4m ago' },
    { title: 'Duo Plan Upgrade Pass', target: 'User #256', impact: 'Medium (+60%)', status: 'Accepted', time: '15m ago' },
    { title: 'Family Premium Migration', target: 'User #512', impact: 'High (+90%)', status: 'Pending', time: '22m ago' }
  ];

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white tracking-tight">Prescriptive Intervention Log</h3>
        </div>
        <span className="text-xs font-mono text-neutral-400">Next Best Action</span>
      </div>

      <div className="space-y-2.5">
        {recs.map((r, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">{r.title}</p>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{r.target} • {r.time}</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-spotify-green/10 text-spotify-green">
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
