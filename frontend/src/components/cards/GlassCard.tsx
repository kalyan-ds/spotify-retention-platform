import React from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, hoverEffect = true }) => {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-300',
        hoverEffect && 'hover:bg-neutral-800/80 hover:border-spotify-green/30 hover:shadow-2xl hover:shadow-spotify-green/5',
        className
      )}
    >
      {children}
    </div>
  );
};
