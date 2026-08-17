import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Cpu, GitBranch, LineChart, Database, Beaker, Settings } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';
import { ROUTES } from '../../config/routes';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { title: 'Run Churn Prediction', icon: BrainCircuit, path: ROUTES.PREDICTIONS, color: 'text-purple-400' },
    { title: 'Model Registry Catalog', icon: Cpu, path: ROUTES.MODELS, color: 'text-blue-400' },
    { title: 'Evaluate PSI Drift', icon: GitBranch, path: ROUTES.DRIFT, color: 'text-emerald-400' },
    { title: 'Telemetry & Latency', icon: LineChart, path: ROUTES.MONITORING, color: 'text-amber-400' },
    { title: 'Feature Store Catalog', icon: Database, path: ROUTES.FEATURE_STORE, color: 'text-cyan-400' },
    { title: 'ML Experimentation', icon: Beaker, path: ROUTES.EXPERIMENTS, color: 'text-pink-400' },
    { title: 'Platform Settings', icon: Settings, path: ROUTES.SETTINGS, color: 'text-neutral-400' }
  ];

  return (
    <GlassCard className="space-y-4">
      <h3 className="text-base font-bold text-white tracking-tight border-b border-neutral-800/80 pb-3">
        Quick Action Triggers
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {actions.map((act, idx) => {
          const IconComponent = act.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(act.path)}
              className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-spotify-green/40 hover:bg-neutral-800 transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className={`p-2.5 rounded-lg bg-neutral-800 group-hover:scale-110 transition-transform ${act.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-neutral-300 group-hover:text-white mt-2 line-clamp-2">
                {act.title}
              </span>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
};
