import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, GitBranch, AlertTriangle } from 'lucide-react';

interface DriftItem {
  name: string;
  psi: number; // e.g. 0.042
  risk: 'Low' | 'Medium' | 'High';
  threshold: string;
}

export const DriftMonitoringCard: React.FC = React.memo(() => {
  const driftItems: DriftItem[] = [
    { name: 'Feature Drift (PSI)', psi: 0.042, risk: 'Low', threshold: '<0.10 Nominal' },
    { name: 'Data Schema Drift', psi: 0.068, risk: 'Low', threshold: '<0.10 Nominal' },
    { name: 'Prediction Target Drift', psi: 0.120, risk: 'Medium', threshold: '0.10-0.25 Alert' },
    { name: 'Concept Drift', psi: 0.031, risk: 'Low', threshold: '<0.10 Nominal' }
  ];

  const getRiskBadge = (risk: DriftItem['risk']) => {
    switch (risk) {
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-spotify-green/10 text-spotify-green border border-spotify-green/20">
            <ShieldCheck className="w-3 h-3" />
            Low (Nominal)
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            Medium (Warning)
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" />
            High (Action Required)
          </span>
        );
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Population Stability Index (PSI) Drift</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Statistical feature & data drift evaluation metrics</p>
          </div>
        </div>
        <span className="text-xs font-mono text-spotify-green">Feature Drift Monitor</span>
      </div>

      <div className="space-y-4">
        {driftItems.map((item, idx) => {
          const progressPercent = Math.min(100, (item.psi / 0.25) * 100);
          const barColor = item.risk === 'Low' ? '#1DB954' : item.risk === 'Medium' ? '#F59E0B' : '#EF4444';

          return (
            <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-neutral-950/50 border border-neutral-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{item.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-neutral-400 text-[11px]">{item.threshold}</span>
                  <span className="font-mono font-bold text-white">PSI: {item.psi}</span>
                  {getRiskBadge(item.risk)}
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

DriftMonitoringCard.displayName = 'DriftMonitoringCard';
