import React from 'react';
import { Cpu, Award, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';

export const ModelOverview: React.FC = () => {
  const models = [
    { name: 'Premium Churn Predictor', algo: 'XGBoost v2.0', version: 'v1.4.2', auc: '0.948', status: 'Champion' },
    { name: 'Engagement Score Model', algo: 'LightGBM Regressor', version: 'v2.1.0', auc: '0.925', status: 'Champion' },
    { name: 'Upgrade Propensity Model', algo: 'CatBoost Classifier', version: 'v1.1.0', auc: '0.912', status: 'Champion' },
    { name: 'Customer Persona Model', algo: 'Random Forest Multi-Class', version: 'v1.0.4', auc: '0.895', status: 'Champion' }
  ];

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white tracking-tight">Active Model Registry Catalog</h3>
        </div>
        <span className="text-xs font-mono text-neutral-400">4 Registered Champions</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
              <th className="py-2.5 px-3">MODEL NAME</th>
              <th className="py-2.5 px-3">ALGORITHM</th>
              <th className="py-2.5 px-3">VERSION</th>
              <th className="py-2.5 px-3">ROC-AUC / METRIC</th>
              <th className="py-2.5 px-3 text-right">STAGE STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {models.map((m, idx) => (
              <tr key={idx} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-spotify-green" />
                  {m.name}
                </td>
                <td className="py-3 px-3 text-neutral-300 font-mono">{m.algo}</td>
                <td className="py-3 px-3 text-neutral-400 font-mono">{m.version}</td>
                <td className="py-3 px-3 font-mono font-bold text-spotify-green">{m.auc}</td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Award className="w-3 h-3" />
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
