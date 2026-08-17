import React from 'react';
import { Database } from 'lucide-react';

interface DemoBadgeProps {
  className?: string;
  label?: string;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({
  className = '',
  label = 'Demonstration Environment · Sample Analytics'
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm ${className}`}>
      <Database className="w-3.5 h-3.5 text-amber-400" />
      <span>{label}</span>
    </div>
  );
};
