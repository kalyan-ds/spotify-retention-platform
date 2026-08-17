import React from 'react';
import { cn } from '../../utils/cn';

interface GradientCardProps {
  children: React.ReactNode;
  variant?: 'green' | 'blue' | 'purple' | 'amber';
  className?: string;
}

export const GradientCard: React.FC<GradientCardProps> = ({ children, variant = 'green', className }) => {
  const getGradient = () => {
    switch (variant) {
      case 'green':
        return 'from-spotify-green/20 via-emerald-900/10 to-neutral-900/90 border-spotify-green/30';
      case 'blue':
        return 'from-blue-500/20 via-indigo-900/10 to-neutral-900/90 border-blue-500/30';
      case 'purple':
        return 'from-purple-500/20 via-fuchsia-900/10 to-neutral-900/90 border-purple-500/30';
      case 'amber':
        return 'from-amber-500/20 via-orange-900/10 to-neutral-900/90 border-amber-500/30';
      default:
        return 'from-spotify-green/20 to-neutral-900/90 border-spotify-green/30';
    }
  };

  return (
    <div
      className={cn(
        'p-6 rounded-2xl bg-gradient-to-br backdrop-blur-xl border shadow-xl relative overflow-hidden',
        getGradient(),
        className
      )}
    >
      {children}
    </div>
  );
};
