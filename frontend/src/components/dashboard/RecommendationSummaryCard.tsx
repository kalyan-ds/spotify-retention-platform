import React from 'react';
import { motion } from 'framer-motion';
import { TrendIndicator } from './TrendIndicator';
import { AnimatedCounter } from './AnimatedCounter';

interface RecommendationSummaryCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
  accentColor?: string;
}

export const RecommendationSummaryCard: React.FC<RecommendationSummaryCardProps> = React.memo(({
  title,
  value,
  trend,
  icon,
  accentColor = '#1DB954'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="p-5 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-200 hover:border-spotify-green/30 hover:shadow-2xl flex flex-col justify-between group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-neutral-400 truncate tracking-wide">{title}</span>
        <div
          className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/50 group-hover:scale-105 transition-transform"
          style={{ color: accentColor }}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-2">
        <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          <AnimatedCounter value={value} />
        </h3>
        <TrendIndicator value={trend} />
      </div>
    </motion.div>
  );
});

RecommendationSummaryCard.displayName = 'RecommendationSummaryCard';
