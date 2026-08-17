import React from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckCircle2, PlayCircle, Clock } from 'lucide-react';

interface PipelineStage {
  name: string;
  status: 'Completed' | 'Active' | 'Pending';
  time: string;
  actor: string;
}

export const DeploymentPipelineCard: React.FC = React.memo(() => {
  const stages: PipelineStage[] = [
    { name: 'Model Training', status: 'Completed', time: '12m ago', actor: 'Python ML Pipeline' },
    { name: 'Model Validation', status: 'Completed', time: '8m ago', actor: 'Evaluation Engine' },
    { name: 'Model Governance', status: 'Completed', time: '5m ago', actor: 'Model Catalog' },
    { name: 'Model Inference', status: 'Active', time: 'In Progress', actor: 'FastAPI Inference' },
    { name: 'Model Monitoring', status: 'Pending', time: 'Queued', actor: 'PSI Drift Auditor' }
  ];

  const getStageBadge = (status: PipelineStage['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-spotify-green/10 text-spotify-green border border-spotify-green/20">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <PlayCircle className="w-3 h-3 animate-spin" />
            Active
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Model Lifecycle & Deployment Overview</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Automated model artifact deployment & validation workflow</p>
          </div>
        </div>
        <span className="text-xs font-mono text-blue-400">Pipeline Active</span>
      </div>

      {/* Stage Flow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
        {stages.map((st, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.08 }}
            className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 relative ${
              st.status === 'Active'
                ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/5'
                : st.status === 'Completed'
                ? 'bg-neutral-950/60 border-neutral-800'
                : 'bg-neutral-950/30 border-neutral-800/60 opacity-60'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono text-neutral-500">STAGE {idx + 1}</span>
              <h4 className="text-xs font-bold text-white leading-tight mt-0.5">{st.name}</h4>
            </div>

            <div className="space-y-1">
              {getStageBadge(st.status)}
              <p className="text-[10px] font-mono text-neutral-400">{st.actor}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

DeploymentPipelineCard.displayName = 'DeploymentPipelineCard';
