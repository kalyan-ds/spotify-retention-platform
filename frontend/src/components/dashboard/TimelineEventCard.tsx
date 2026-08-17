import React from 'react';
import { motion } from 'framer-motion';
import { AlertSeverityBadge, AlertSeverityLevel } from './AlertSeverityBadge';

export interface TimelineEventProps {
  id: string;
  time: string;
  title: string;
  description: string;
  severity: AlertSeverityLevel;
  source: string;
  icon: React.ReactNode;
  accentColor?: string;
}

export const TimelineEventCard: React.FC<TimelineEventProps> = React.memo(({
  time,
  title,
  description,
  severity,
  source,
  icon,
  accentColor = '#1DB954'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-3.5 rounded-xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-md hover:border-spotify-green/30 transition-all flex items-start gap-3 group"
    >
      <div
        className="p-2 rounded-lg bg-neutral-800/90 border border-neutral-700/50 shrink-0 mt-0.5 group-hover:scale-105 transition-transform"
        style={{ color: accentColor }}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-white truncate tracking-tight">{title}</h4>
          <span className="text-[10px] font-mono text-neutral-500 shrink-0">{time}</span>
        </div>

        <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed line-clamp-2">{description}</p>

        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-neutral-800/60 text-[10px]">
          <span className="font-mono text-neutral-500">Source: <strong className="text-neutral-300">{source}</strong></span>
          <AlertSeverityBadge severity={severity} />
        </div>
      </div>
    </motion.div>
  );
});

TimelineEventCard.displayName = 'TimelineEventCard';
