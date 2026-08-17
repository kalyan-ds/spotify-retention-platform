import React from 'react';
import { Lightbulb, DollarSign } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';

export const RecommendationOverview: React.FC = () => {
  const topActions = [
    { title: 'Personalized 30-Day Premium Extension', conversion: '84.2%', arrLift: '+$420K', priority: 'P1' },
    { title: 'Family Plan Upgrade Discount (20%)', conversion: '76.8%', arrLift: '+$680K', priority: 'P1' },
    { title: 'Duo Plan Migration Offer', conversion: '69.4%', arrLift: '+$320K', priority: 'P2' }
  ];

  return (
    <GlassCard className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Prescriptive Intervention Performance</h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">Automated Next Best Action (NBA) conversion analysis</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          78.6% Acceptance Rate
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topActions.map((action, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-spotify-green/30 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-spotify-green/10 text-spotify-green">
                {action.priority} ACTION
              </span>
              <span className="text-xs font-mono font-bold text-spotify-green flex items-center gap-0.5">
                <DollarSign className="w-3 h-3" />
                {action.arrLift}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-2 group-hover:text-spotify-green transition-colors">
              {action.title}
            </h4>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-neutral-400">Conversion Rate</span>
              <span className="font-mono font-bold text-white">{action.conversion}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
