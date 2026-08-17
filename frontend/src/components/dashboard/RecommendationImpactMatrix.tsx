import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartContainer } from '../charts/ChartContainer';

interface MatrixPoint {
  id: string;
  name: string;
  quadrant: 'Quick Wins' | 'Strategic Bets' | 'Low Priority' | 'Major Projects';
  x: number; // 0 - 100 (Business Impact)
  y: number; // 0 - 100 (Implementation Effort: 0 is Low Effort / top, 100 is High Effort / bottom)
  impact: string;
  effort: string;
  color: string;
}

export const RecommendationImpactMatrix: React.FC = React.memo(() => {
  const [activePoint, setActivePoint] = useState<MatrixPoint | null>(null);

  const points: MatrixPoint[] = [
    { id: '1', name: '30-Day Premium Extension', quadrant: 'Quick Wins', x: 85, y: 25, impact: 'High (+$420K)', effort: 'Low (1-day setup)', color: '#1DB954' },
    { id: '2', name: 'Duo Plan Upgrade Pass', quadrant: 'Quick Wins', x: 75, y: 30, impact: 'High (+$320K)', effort: 'Low (2-day setup)', color: '#1DB954' },
    { id: '3', name: 'Personalized Daily Mix Refresh', quadrant: 'Quick Wins', x: 65, y: 15, impact: 'Medium (+$150K)', effort: 'Low (0-day setup)', color: '#1DB954' },
    { id: '4', name: 'Family Plan Migration Campaign', quadrant: 'Strategic Bets', x: 90, y: 80, impact: 'Very High (+$680K)', effort: 'High (2-week sprint)', color: '#3B82F6' },
    { id: '5', name: 'Annual Subscriber Loyalty Bonus', quadrant: 'Strategic Bets', x: 80, y: 70, impact: 'High (+$510K)', effort: 'High (1-week sprint)', color: '#3B82F6' },
    { id: '6', name: 'Student Pass Extension Voucher', quadrant: 'Low Priority', x: 25, y: 20, impact: 'Low (+$45K)', effort: 'Low (0-day setup)', color: '#9CA3AF' },
    { id: '7', name: 'Push Notification A/B Test', quadrant: 'Low Priority', x: 35, y: 35, impact: 'Low (+$60K)', effort: 'Low (1-day setup)', color: '#9CA3AF' },
    { id: '8', name: 'Legacy Tariff Grandfathering', quadrant: 'Major Projects', x: 30, y: 85, impact: 'Low (+$80K)', effort: 'Very High (3-week sprint)', color: '#F59E0B' },
    { id: '9', name: 'Custom UI Theme Unlocking', quadrant: 'Major Projects', x: 40, y: 75, impact: 'Medium (+$110K)', effort: 'High (2-week sprint)', color: '#F59E0B' },
    { id: '10', name: 'Audiobook Trial Bundle', quadrant: 'Strategic Bets', x: 70, y: 65, impact: 'High (+$290K)', effort: 'Medium (1-week sprint)', color: '#3B82F6' }
  ];

  return (
    <ChartContainer
      title="Business Impact vs. Implementation Effort Matrix"
      subtitle="2x2 Prioritization framework forNext Best Action interventions"
      height="h-[380px]"
    >
      <div className="relative w-full h-full p-4 flex flex-col justify-between">
        {/* Background 2x2 Quadrant Grid */}
        <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 gap-2 border border-neutral-800 rounded-xl overflow-hidden pointer-events-none">
          {/* Top Left: Quick Wins */}
          <div className="bg-spotify-green/5 p-3 flex flex-col justify-between border-r border-b border-neutral-800/80">
            <span className="text-xs font-mono font-bold text-spotify-green tracking-wider uppercase">
              🚀 Quick Wins (High Impact, Low Effort)
            </span>
          </div>

          {/* Top Right: Strategic Bets */}
          <div className="bg-blue-500/5 p-3 flex flex-col justify-between border-b border-neutral-800/80">
            <span className="text-xs font-mono font-bold text-blue-400 tracking-wider uppercase">
              🎯 Strategic Bets (High Impact, High Effort)
            </span>
          </div>

          {/* Bottom Left: Low Priority */}
          <div className="bg-neutral-800/20 p-3 flex flex-col justify-between border-r border-neutral-800/80">
            <span className="text-xs font-mono font-bold text-neutral-400 tracking-wider uppercase">
              ⚙️ Low Priority (Low Impact, Low Effort)
            </span>
          </div>

          {/* Bottom Right: Major Projects */}
          <div className="bg-amber-500/5 p-3 flex flex-col justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase">
              🧱 Major Projects (Low Impact, High Effort)
            </span>
          </div>
        </div>

        {/* Interactive Points Layer */}
        <div className="relative w-full h-full z-10">
          {points.map((pt) => (
            <motion.div
              key={pt.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: parseInt(pt.id) * 0.04 }}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              onMouseEnter={() => setActivePoint(pt)}
              onMouseLeave={() => setActivePoint(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-lg group-hover:scale-150 transition-transform relative"
                style={{ backgroundColor: pt.color }}
              >
                <div className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ backgroundColor: pt.color }} />
              </div>
            </motion.div>
          ))}

          {/* Hover Tooltip */}
          {activePoint && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-20 p-3 rounded-xl bg-neutral-950 border border-neutral-700 shadow-2xl text-xs space-y-1 max-w-xs pointer-events-none"
              style={{
                left: `${Math.min(80, Math.max(20, activePoint.x))}%`,
                top: `${Math.min(80, Math.max(20, activePoint.y - 12))}%`
              }}
            >
              <p className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activePoint.color }} />
                {activePoint.name}
              </p>
              <p className="text-[10px] font-mono text-neutral-400">
                Quadrant: <span className="text-white font-bold">{activePoint.quadrant}</span>
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] font-mono border-t border-neutral-800">
                <span className="text-spotify-green">Impact: {activePoint.impact}</span>
                <span className="text-neutral-300">Effort: {activePoint.effort}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Matrix Axes Labels */}
        <div className="absolute left-2 bottom-2 text-[10px] font-mono text-neutral-400 uppercase tracking-widest z-0">
          ← Low Business Impact
        </div>
        <div className="absolute right-2 bottom-2 text-[10px] font-mono text-neutral-400 uppercase tracking-widest z-0">
          High Business Impact →
        </div>
      </div>
    </ChartContainer>
  );
});

RecommendationImpactMatrix.displayName = 'RecommendationImpactMatrix';
