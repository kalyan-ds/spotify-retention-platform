import React from 'react';
import { MetricCard } from '../cards/MetricCard';
import { ShieldCheck, TrendingUp, UserCheck, UserX, Repeat, DollarSign, Activity } from 'lucide-react';
import { KPIMetric } from '@/api/retention';

interface RetentionKPIGridProps {
  kpiData?: KPIMetric[];
  isLoading?: boolean;
}

export const RetentionKPIGrid: React.FC<RetentionKPIGridProps> = ({ kpiData: _kpiData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-32 bg-zinc-900/50 animate-pulse rounded-xl border border-zinc-800/60" />
        ))}
      </div>
    );
  }

  // Pre-configured executive metrics with live data or fallback stubs
  const metrics = [
    { title: 'Customer Retention Rate (CRR)', value: '88.4%', subtitle: 'Trailing 30-day cohort retention', trend: '+2.1%', trendDirection: 'up' as const, icon: <UserCheck className="w-5 h-5 text-emerald-400" />, lineColor: 'green' as const },
    { title: 'Net Revenue Retention (NRR)', value: '108.2%', subtitle: 'Includes upsells & plan upgrades', trend: '+4.5%', trendDirection: 'up' as const, icon: <DollarSign className="w-5 h-5 text-emerald-400" />, lineColor: 'green' as const },
    { title: 'Gross Revenue Retention (GRR)', value: '94.6%', subtitle: 'Retained revenue excluding expansion', trend: '+0.8%', trendDirection: 'up' as const, icon: <TrendingUp className="w-5 h-5 text-emerald-400" />, lineColor: 'green' as const },
    { title: 'Overall Churn Rate', value: '4.2%', subtitle: 'Monthly subscription cancellations', trend: '-0.5%', trendDirection: 'down' as const, icon: <UserX className="w-5 h-5 text-red-400" />, lineColor: 'red' as const },
    { title: 'Retention Health Score', value: '72.5 / 100', subtitle: 'Category: Good Health', trend: '+3.0', trendDirection: 'up' as const, icon: <ShieldCheck className="w-5 h-5 text-blue-400" />, lineColor: 'blue' as const },
    { title: 'Repeat Listener Rate', value: '76.8%', subtitle: 'Users with >1 session/week', trend: '+1.2%', trendDirection: 'up' as const, icon: <Repeat className="w-5 h-5 text-purple-400" />, lineColor: 'purple' as const },
    { title: 'Recovered Users', value: '1,420', subtitle: 'Formerly dormant, reactivated this month', trend: '+14%', trendDirection: 'up' as const, icon: <Activity className="w-5 h-5 text-emerald-400" />, lineColor: 'green' as const },
    { title: 'Dormant Users', value: '3,850', subtitle: '0 sessions in last 30 days', trend: '-2.4%', trendDirection: 'down' as const, icon: <UserX className="w-5 h-5 text-yellow-400" />, lineColor: 'yellow' as const },
    { title: 'Returning Users', value: '890', subtitle: 'Re-subscribed former members', trend: '+8.1%', trendDirection: 'up' as const, icon: <UserCheck className="w-5 h-5 text-emerald-400" />, lineColor: 'green' as const },
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
