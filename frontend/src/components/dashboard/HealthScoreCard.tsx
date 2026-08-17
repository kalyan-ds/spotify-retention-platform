import React from 'react';
import { motion } from 'framer-motion';
import { HealthGauge } from './HealthGauge';
import { StatusBadge } from './StatusBadge';
import { Clock, Server, ShieldCheck } from 'lucide-react';

interface HealthScoreCardProps {
  score?: number;
  lastCheck?: string;
  environment?: string;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = React.memo(({
  score = 99.8,
  lastCheck = '2 minutes ago',
  environment = 'Production'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-6 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
    >
      {/* Left side info */}
      <div className="space-y-4 max-w-md text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <StatusBadge status="Healthy" size="md" />
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Server className="w-3.5 h-3.5" />
            {environment}
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck className="w-6 h-6 text-spotify-green" />
            Enterprise AI Health Score
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Continuous real-time verification of model inference pipelines, feature store lookup latencies, and service topology.
          </p>
        </div>

        <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-neutral-400">
          <Clock className="w-3.5 h-3.5 text-spotify-green" />
          <span>Last Health Check:</span>
          <span className="text-white font-bold">{lastCheck}</span>
        </div>
      </div>

      {/* Right side circular gauge */}
      <div className="shrink-0 flex items-center justify-center">
        <HealthGauge value={score} label="Overall AI Health" size={190} />
      </div>
    </motion.div>
  );
});

HealthScoreCard.displayName = 'HealthScoreCard';
