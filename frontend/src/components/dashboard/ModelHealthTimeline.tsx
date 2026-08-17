import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Cpu, ShieldCheck, Activity, RotateCcw } from 'lucide-react';
import { ChartContainer } from '../charts/ChartContainer';

interface TimelineStage {
  id: string;
  stage: string;
  status: 'Passed' | 'Active' | 'Scheduled';
  time: string;
  detail: string;
  icon: React.ReactNode;
  color: string;
}

export const ModelHealthTimeline: React.FC = React.memo(() => {
  const stages: TimelineStage[] = [
    { id: '1', stage: 'Model Training', status: 'Passed', time: '04:12 UTC', detail: 'XGBoost classifier trained on subscriber engagement dataset', icon: <Cpu className="w-4 h-4" />, color: '#8B5CF6' },
    { id: '2', stage: 'Model Validation', status: 'Passed', time: '04:18 UTC', detail: 'ROC-AUC evaluation benchmark passed baseline SLA', icon: <CheckCircle2 className="w-4 h-4" />, color: '#3B82F6' },
    { id: '3', stage: 'Model Registry', status: 'Passed', time: '04:22 UTC', detail: 'Model artifact serialized and cataloged in registry', icon: <ShieldCheck className="w-4 h-4" />, color: '#1DB954' },
    { id: '4', stage: 'Live Telemetry & PSI', status: 'Active', time: 'Ongoing', detail: 'PSI drift = 0.042 (Nominal <0.10)', icon: <Activity className="w-4 h-4" />, color: '#06B6D4' },
    { id: '5', stage: 'Scheduled Evaluation', status: 'Scheduled', time: 'In 6 days', detail: 'Periodic automated model evaluation & drift benchmark', icon: <RotateCcw className="w-4 h-4" />, color: '#F59E0B' }
  ];

  return (
    <ChartContainer
      title="Model Lifecycle Health"
      subtitle="Automated model training, validation, deployment & drift pipeline"
      height="h-72"
    >
      <div className="relative pl-6 space-y-4 py-2 border-l border-neutral-800 h-full flex flex-col justify-between">
        {stages.map((st, idx) => (
          <motion.div
            key={st.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.08 }}
            className="relative flex items-center justify-between gap-4"
          >
            {/* Timeline Dot Icon */}
            <div
              className="absolute -left-[31px] p-1 rounded-full bg-neutral-950 border border-neutral-700"
              style={{ color: st.color }}
            >
              {st.icon}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white tracking-tight">{st.stage}</h4>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                    st.status === 'Passed'
                      ? 'bg-spotify-green/10 text-spotify-green border-spotify-green/20'
                      : st.status === 'Active'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {st.status}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 truncate mt-0.5">{st.detail}</p>
            </div>

            <span className="text-[10px] font-mono text-neutral-500 shrink-0">{st.time}</span>
          </motion.div>
        ))}
      </div>
    </ChartContainer>
  );
});

ModelHealthTimeline.displayName = 'ModelHealthTimeline';
