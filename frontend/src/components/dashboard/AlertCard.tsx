import React from 'react';
import { motion } from 'framer-motion';
import { AlertSeverityBadge, AlertSeverityLevel } from './AlertSeverityBadge';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

export type AlertStatusType = 'Open' | 'Acknowledged' | 'Investigating' | 'Resolved';

export interface AlertCardProps {
  id: string;
  title: string;
  severity: AlertSeverityLevel;
  status: AlertStatusType;
  service: string;
  created: string;
  team: string;
}

export const AlertCard: React.FC<AlertCardProps> = React.memo(({
  id,
  title,
  severity,
  status,
  service,
  created,
  team
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-3 h-3" />
            Open
          </span>
        );
      case 'Acknowledged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Acknowledged
          </span>
        );
      case 'Investigating':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <AlertTriangle className="w-3 h-3 animate-spin" />
            Investigating
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-spotify-green/15 text-spotify-green border border-spotify-green/30">
            <CheckCircle2 className="w-3 h-3" />
            Resolved
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-3.5 rounded-xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-md hover:border-spotify-green/30 transition-all space-y-2 group"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-neutral-400">{id}</span>
          <AlertSeverityBadge severity={severity} />
        </div>
        {getStatusBadge()}
      </div>

      <h4 className="text-xs font-bold text-white leading-tight group-hover:text-spotify-green transition-colors">{title}</h4>

      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-neutral-800/60">
        <span>Service: <strong className="text-neutral-300">{service}</strong></span>
        <span>Team: <strong className="text-neutral-300">{team}</strong></span>
        <span className="text-neutral-500">{created}</span>
      </div>
    </motion.div>
  );
});

AlertCard.displayName = 'AlertCard';
