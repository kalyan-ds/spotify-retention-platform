import React from 'react';
import { Cpu, ShieldCheck, CheckCircle2, Archive, Activity, AlertTriangle } from 'lucide-react';

export type ModelStatusType = 'Training' | 'Ready' | 'Production' | 'Archived' | 'Monitoring' | 'Deprecated';

interface ModelStatusBadgeProps {
  status: ModelStatusType;
}

export const ModelStatusBadge: React.FC<ModelStatusBadgeProps> = React.memo(({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Production':
        return {
          colorClass: 'bg-spotify-green/15 text-spotify-green border-spotify-green/30',
          icon: <ShieldCheck className="w-3 h-3" />
        };
      case 'Ready':
        return {
          colorClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          icon: <CheckCircle2 className="w-3 h-3" />
        };
      case 'Training':
        return {
          colorClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          icon: <Cpu className="w-3 h-3" />
        };
      case 'Monitoring':
        return {
          colorClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
          icon: <Activity className="w-3 h-3" />
        };
      case 'Archived':
        return {
          colorClass: 'bg-neutral-800 text-neutral-400 border-neutral-700',
          icon: <Archive className="w-3 h-3" />
        };
      case 'Deprecated':
        return {
          colorClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          icon: <AlertTriangle className="w-3 h-3" />
        };
      default:
        return {
          colorClass: 'bg-neutral-800 text-neutral-400 border-neutral-700',
          icon: <CheckCircle2 className="w-3 h-3" />
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${style.colorClass}`}>
      {style.icon}
      <span>{status}</span>
    </span>
  );
});

ModelStatusBadge.displayName = 'ModelStatusBadge';
