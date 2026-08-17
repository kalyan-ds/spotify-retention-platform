import React from 'react';
import { MetricCard } from '../cards/MetricCard';
import { Users, Heart, Clock, PlayCircle, Sparkles, ShieldCheck, Repeat } from 'lucide-react';
import { ActiveUsersOverview } from '@/api/engagement';

interface ExecutiveKPIGridProps {
  overviewData?: ActiveUsersOverview;
  isLoading?: boolean;
}

export const ExecutiveKPIGrid: React.FC<ExecutiveKPIGridProps> = ({ overviewData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-32 bg-zinc-900/50 animate-pulse rounded-xl border border-zinc-800/60" />
        ))}
      </div>
    );
  }

  const dau = overviewData?.dau ?? 15420;
  const wau = overviewData?.wau ?? 38550;
  const mau = overviewData?.mau ?? 50000;
  const stickiness = overviewData?.stickiness_ratio ?? 30.84;

  const metrics = [
    { title: 'Daily Active Users (DAU)', value: dau.toLocaleString(), subtitle: 'Unique users active in last 24h', trend: '+4.2%', trendDirection: 'up' as const, icon: <Users className="w-5 h-5 text-emerald-400" />, lineColor: 'green' as const },
    { title: 'Weekly Active Users (WAU)', value: wau.toLocaleString(), subtitle: 'Unique active users in trailing 7 days', trend: '+6.1%', trendDirection: 'up' as const, icon: <Users className="w-5 h-5 text-emerald-400" />, lineColor: 'green' as const },
    { title: 'Monthly Active Users (MAU)', value: mau.toLocaleString(), subtitle: 'Unique active users in trailing 30 days', trend: '+8.5%', trendDirection: 'up' as const, icon: <Users className="w-5 h-5 text-emerald-400" />, lineColor: 'green' as const },
    { title: 'DAU / MAU Stickiness Ratio', value: `${stickiness}%`, subtitle: 'Daily engagement ratio index', trend: '+1.8%', trendDirection: 'up' as const, icon: <Heart className="w-5 h-5 text-purple-400" />, lineColor: 'purple' as const },
    { title: 'Avg Session Duration', value: '24.5 min', subtitle: 'Average continuous listening session', trend: '+2.4%', trendDirection: 'up' as const, icon: <Clock className="w-5 h-5 text-blue-400" />, lineColor: 'blue' as const },
    { title: 'Sessions Per User', value: '3.4 / week', subtitle: 'Average weekly sessions per listener', trend: '+0.4', trendDirection: 'up' as const, icon: <Repeat className="w-5 h-5 text-emerald-400" />, lineColor: 'green' as const },
    { title: 'Total Listening Hours', value: '14,520 hrs', subtitle: 'Cumulative track play duration', trend: '+12.5%', trendDirection: 'up' as const, icon: <PlayCircle className="w-5 h-5 text-emerald-400" />, lineColor: 'green' as const },
    { title: 'Feature Adoption Rate', value: '58.3%', subtitle: 'Users engaging with premium features', trend: '+5.0%', trendDirection: 'up' as const, icon: <Sparkles className="w-5 h-5 text-yellow-400" />, lineColor: 'yellow' as const },
    { title: 'Composite Engagement Score', value: '78.2 / 100', subtitle: 'Category: Excellent Engagement', trend: '+2.8', trendDirection: 'up' as const, icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, lineColor: 'green' as const },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((m, index) => (
        <MetricCard
          key={index}
          title={m.title}
          value={m.value}
          subtitle={m.subtitle}
          trend={m.trend}
          trendDirection={m.trendDirection}
          icon={m.icon}
          lineColor={m.lineColor}
        />
      ))}
    </div>
  );
};
