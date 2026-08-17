import React from 'react';
import { Sparkles, ShieldCheck, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardHero: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-spotify-green/20 via-neutral-900/90 to-neutral-950 border border-spotify-green/30 backdrop-blur-xl shadow-2xl"
    >
      {/* Animated subtle border highlight */}
      <div className="absolute inset-0 bg-gradient-to-r from-spotify-green/10 via-emerald-400/5 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-spotify-green/10 text-spotify-green border border-spotify-green/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              SYSTEM OPERATIONAL
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-neutral-400 bg-neutral-800/80 border border-neutral-700/60">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              {currentDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Spotify Premium Retention Intelligence Platform
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Real-time AI intelligence for customer retention, engagement and business insights.
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 shrink-0 self-start lg:self-center">
          <div className="p-3 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-mono">WELCOME BACK</p>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              AI Platform Administrator <Sparkles className="w-3.5 h-3.5 text-spotify-green" />
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
