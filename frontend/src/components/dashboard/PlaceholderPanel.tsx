import React from 'react';
import {
  BarChart3,
  ShieldCheck,
  BrainCircuit,
  Lightbulb,
  Cpu,
  LineChart,
  AlertTriangle,
  Activity,
  Sparkles
} from 'lucide-react';

export type PlaceholderModuleType =
  | 'kpis'
  | 'health'
  | 'predictions'
  | 'recommendations'
  | 'models'
  | 'monitoring'
  | 'alerts'
  | 'activity';

interface PlaceholderPanelProps {
  moduleType: PlaceholderModuleType;
  title: string;
  phase: string;
  description: string;
}

export const PlaceholderPanel: React.FC<PlaceholderPanelProps> = ({
  moduleType,
  title,
  phase,
  description
}) => {
  const getIcon = () => {
    switch (moduleType) {
      case 'kpis':
        return <BarChart3 className="w-8 h-8 text-spotify-green" />;
      case 'health':
        return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
      case 'predictions':
        return <BrainCircuit className="w-8 h-8 text-purple-400" />;
      case 'recommendations':
        return <Lightbulb className="w-8 h-8 text-amber-400" />;
      case 'models':
        return <Cpu className="w-8 h-8 text-blue-400" />;
      case 'monitoring':
        return <LineChart className="w-8 h-8 text-cyan-400" />;
      case 'alerts':
        return <AlertTriangle className="w-8 h-8 text-rose-400" />;
      case 'activity':
        return <Activity className="w-8 h-8 text-teal-400" />;
      default:
        return <Sparkles className="w-8 h-8 text-spotify-green" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[220px] rounded-xl bg-neutral-950/40 border border-neutral-800/80 border-dashed">
      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 mb-3 shadow-inner">
        {getIcon()}
      </div>
      <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
      <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-spotify-green/10 text-spotify-green border border-spotify-green/20">
        <Sparkles className="w-3 h-3" />
        {phase}
      </span>
      <p className="text-xs text-neutral-400 mt-2 max-w-md leading-relaxed">{description}</p>
    </div>
  );
};
