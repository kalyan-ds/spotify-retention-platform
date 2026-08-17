import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

export type AlertSeverityLevel = 'Information' | 'Notice' | 'Warning' | 'High' | 'Critical';

interface AlertSeverityBadgeProps {
  severity: AlertSeverityLevel;
}

export const AlertSeverityBadge: React.FC<AlertSeverityBadgeProps> = React.memo(({ severity }) => {
  const getStyle = () => {
    switch (severity) {
      case 'Information':
        return {
          colorClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
          icon: <Info className="w-3 h-3" />
        };
      case 'Notice':
        return {
          colorClass: 'bg-spotify-green/15 text-spotify-green border-spotify-green/30',
          icon: <CheckCircle2 className="w-3 h-3" />
        };
      case 'Warning':
        return {
          colorClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: <AlertTriangle className="w-3 h-3" />
        };
      case 'High':
        return {
          colorClass: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
          icon: <AlertCircle className="w-3 h-3" />
        };
      case 'Critical':
        return {
          colorClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          icon: <ShieldAlert className="w-3 h-3" />
        };
      default:
        return {
          colorClass: 'bg-neutral-800 text-neutral-400 border-neutral-700',
          icon: <Info className="w-3 h-3" />
        };
    }
  };

  const style = getStyle();

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${style.colorClass}`}>
      {style.icon}
      <span>{severity}</span>
    </span>
  );
});

AlertSeverityBadge.displayName = 'AlertSeverityBadge';
