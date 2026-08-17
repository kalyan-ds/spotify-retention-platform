import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, CheckCircle2, Bell } from 'lucide-react';
import { TrendIndicator } from './TrendIndicator';
import { AnimatedCounter } from './AnimatedCounter';

export const NotificationSummary: React.FC = React.memo(() => {
  const cards = [
    {
      id: 'todays-events',
      title: "Today's Operational Events",
      value: '248',
      trend: '+12%',
      icon: <Activity className="w-5 h-5" />,
      accentColor: '#1DB954'
    },
    {
      id: 'critical-alerts',
      title: 'Critical Active Alerts',
      value: '3',
      trend: '-1',
      icon: <ShieldAlert className="w-5 h-5" />,
      accentColor: '#EF4444',
      invertTrendColor: true
    },
    {
      id: 'resolved-incidents',
      title: 'Resolved SLA Incidents',
      value: '41',
      trend: '+8%',
      icon: <CheckCircle2 className="w-5 h-5" />,
      accentColor: '#10B981'
    },
    {
      id: 'system-notifications',
      title: 'System Notifications',
      value: '126',
      trend: '+5%',
      icon: <Bell className="w-5 h-5" />,
      accentColor: '#3B82F6'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          className="p-5 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400 truncate tracking-wide">{c.title}</span>
            <div
              className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/50 group-hover:scale-105 transition-transform"
              style={{ color: c.accentColor }}
            >
              {c.icon}
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              <AnimatedCounter value={c.value} />
            </h3>
            <TrendIndicator value={c.trend} invertColor={c.invertTrendColor} />
          </div>
        </motion.div>
      ))}
    </div>
  );
});

NotificationSummary.displayName = 'NotificationSummary';
