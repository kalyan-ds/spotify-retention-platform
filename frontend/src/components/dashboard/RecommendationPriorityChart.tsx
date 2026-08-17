import React from 'react';
import { motion } from 'framer-motion';
import { ChartContainer } from '../charts/ChartContainer';

export const RecommendationPriorityChart: React.FC = React.memo(() => {
  const priorities = [
    { label: 'Critical Priority', value: 2450, total: 18245, color: '#EF4444', percent: '13.4%' },
    { label: 'High Priority', value: 6800, total: 18245, color: '#F59E0B', percent: '37.3%' },
    { label: 'Medium Priority', value: 5900, total: 18245, color: '#3B82F6', percent: '32.3%' },
    { label: 'Low Priority', value: 3095, total: 18245, color: '#10B981', percent: '17.0%' }
  ];

  const maxVal = 7500;

  return (
    <ChartContainer
      title="Recommendation Priority Distribution"
      subtitle="Intervention queue breakdown by urgency level"
      height="h-72"
    >
      <div className="space-y-4 py-2 flex flex-col justify-center h-full">
        {priorities.map((p, idx) => {
          const widthPercent = (p.value / maxVal) * 100;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.label}
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-white font-bold">{p.value.toLocaleString()}</span>
                  <span className="text-neutral-400 text-[10px]">({p.percent})</span>
                </div>
              </div>

              <div className="w-full h-3 rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: p.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartContainer>
  );
});

RecommendationPriorityChart.displayName = 'RecommendationPriorityChart';
