import React from 'react';
import { motion } from 'framer-motion';
import { ModelStatusBadge, ModelStatusType } from './ModelStatusBadge';
import { useModelRegistry } from '../../hooks/useModels';
import { DashboardLoading } from '../shared/DashboardLoading';

interface ModelRow {
  name: string;
  version: string;
  status: ModelStatusType;
  accuracy: string;
  latency: string;
  deployed: string;
  environment: string;
}

const DEMO_MODELS: ModelRow[] = [
  { name: 'Premium Churn Predictor', version: 'v1.4.2', status: 'Production', accuracy: '0.948', latency: '1.45ms', deployed: '2026-07-20', environment: 'Active' },
  { name: 'Engagement Score Model', version: 'v2.1.0', status: 'Production', accuracy: '0.925', latency: '0.90ms', deployed: '2026-07-18', environment: 'Active' },
  { name: 'Upgrade Propensity Model', version: 'v1.1.0', status: 'Production', accuracy: '0.912', latency: '1.10ms', deployed: '2026-07-15', environment: 'Active' },
  { name: 'Customer Persona Model', version: 'v1.0.4', status: 'Production', accuracy: '0.895', latency: '1.99ms', deployed: '2026-07-10', environment: 'Active' },
  { name: 'Win-back Churn Predictor', version: 'v1.5.0', status: 'Training', accuracy: '0.952', latency: '1.30ms', deployed: '2026-07-27', environment: 'Validation' },
  { name: 'Podcast Retention Model', version: 'v2.0.0', status: 'Ready', accuracy: '0.918', latency: '2.10ms', deployed: '2026-07-25', environment: 'Validation' },
  { name: 'Feature Drift Monitor', version: 'v1.0.0', status: 'Monitoring', accuracy: 'N/A (PSI)', latency: '0.45ms', deployed: '2026-07-01', environment: 'Active' },
  { name: 'Baseline Churn Benchmark', version: 'v0.9.1', status: 'Archived', accuracy: '0.842', latency: '8.50ms', deployed: '2026-01-15', environment: 'Archived' }
];

export const ModelVersionTable: React.FC = React.memo(() => {
  const { data: apiData, isLoading } = useModelRegistry();

  if (isLoading) {
    return <DashboardLoading cardsCount={1} height="h-64" />;
  }

  const models: ModelRow[] = Array.isArray(apiData) && apiData.length > 0 ? (apiData as ModelRow[]) : DEMO_MODELS;

  return (
    <div className="p-6 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Active Model Registry Catalog</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Model registry repository & deployment stage catalog</p>
        </div>
        <span className="text-xs font-mono text-neutral-400">{models.length} Models Registered</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
              <th className="py-3 px-3">MODEL NAME</th>
              <th className="py-3 px-3">VERSION</th>
              <th className="py-3 px-3">STATUS</th>
              <th className="py-3 px-3">ROC-AUC / METRIC</th>
              <th className="py-3 px-3">LATENCY</th>
              <th className="py-3 px-3">DEPLOYED</th>
              <th className="py-3 px-3 text-right">ENVIRONMENT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {models.map((m, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.03 }}
                className="hover:bg-neutral-800/40 transition-colors"
              >
                <td className="py-3 px-3 font-semibold text-white">{m.name}</td>
                <td className="py-3 px-3 font-mono text-neutral-300">{m.version}</td>
                <td className="py-3 px-3">
                  <ModelStatusBadge status={m.status} />
                </td>
                <td className="py-3 px-3 font-mono font-bold text-spotify-green">{m.accuracy}</td>
                <td className="py-3 px-3 font-mono text-neutral-300">{m.latency}</td>
                <td className="py-3 px-3 font-mono text-neutral-400">{m.deployed}</td>
                <td className="py-3 px-3 text-right font-mono text-neutral-300">{m.environment}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

ModelVersionTable.displayName = 'ModelVersionTable';
