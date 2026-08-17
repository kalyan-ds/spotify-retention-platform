import React from 'react';
import { motion } from 'framer-motion';

interface SectionContainerProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  subtitle,
  action,
  children,
  className = ''
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`p-6 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-300 hover:border-spotify-green/20 hover:shadow-2xl ${className}`}
    >
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
      <div>{children}</div>
    </motion.section>
  );
};
