import React from 'react';
import { motion } from 'framer-motion';
import { StatusBadge, HealthStatusType } from './StatusBadge';

export interface ServiceStatusCardProps {
  name: string;
  status: HealthStatusType;
  uptime?: string;
  latency?: string;
  icon: React.ReactNode;
  accentColor?: string;
}

export const ServiceStatusCard: React.FC<ServiceStatusCardProps> = React.memo(({
  name,
  status,
  uptime = '99.99%',
  latency,
  icon,
  accentColor = '#1DB954'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="p-4 rounded-xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-lg hover:border-spotify-green/30 transition-all flex items-center justify-between gap-3 group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="p-2.5 rounded-lg bg-neutral-800/90 border border-neutral-700/50 group-hover:scale-105 transition-transform shrink-0"
          style={{ color: accentColor }}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <h4 className="text-sm font-bold text-white truncate tracking-tight">{name}</h4>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-neutral-400">
            <span>Uptime: <strong className="text-white font-bold">{uptime}</strong></span>
            {latency && (
              <>
                <span>•</span>
                <span>Latency: <strong className="text-spotify-green font-bold">{latency}</strong></span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <StatusBadge status={status} size="sm" />
      </div>
    </motion.div>
  );
});

ServiceStatusCard.displayName = 'ServiceStatusCard';
