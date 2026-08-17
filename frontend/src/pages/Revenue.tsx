import { useEffect, useState } from 'react';
import { FilterToolbar } from '@/components/navigation/FilterToolbar';
import { KPICard, ProgressBarList, InsightCard } from '@/components/analytics';
import { AreaChart, BarChart } from '@/components/charts';
import { DashboardService } from '@/services/DashboardService';
import { revenueData } from '@/analytics/revenue';
import { DemoBadge } from '@/components/common/DemoBadge';
import { Typography } from '@/components/typography/Typography';
import { DollarSign, TrendingUp, CreditCard, PieChart } from 'lucide-react';
import { FadeIn, StaggerContainer } from '@/components/motion';

export function Revenue() {
  const [data, setData] = useState<typeof revenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DashboardService.getRevenue().then((res: any) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full pb-12">
      <FilterToolbar />
      <DemoBadge className="mt-4 mb-2" />

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        <KPICard
          title="TOTAL REVENUE"
          value={data?.kpis.totalRevenue.value || '$0'}
          trend={data?.kpis.totalRevenue.trend || { value: '+0%', direction: 'neutral' }}
          icon={<DollarSign className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="MRR"
          value={data?.kpis.mrr.value || '$0'}
          trend={data?.kpis.mrr.trend || { value: '+0%', direction: 'neutral' }}
          icon={<TrendingUp className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="ARR"
          value={data?.kpis.arr.value || '$0'}
          trend={data?.kpis.arr.trend || { value: '+0%', direction: 'neutral' }}
          icon={<TrendingUp className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="PREMIUM REVENUE"
          value={data?.kpis.premiumRevenue.value || '$0'}
          trend={data?.kpis.premiumRevenue.trend || { value: '+0%', direction: 'neutral' }}
          icon={<CreditCard className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="ARPU"
          value={data?.kpis.arpu.value || '$0'}
          trend={data?.kpis.arpu.trend || { value: '+0%', direction: 'neutral' }}
          icon={<PieChart className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="AVG LTV"
          value={data?.kpis.avgLtv.value || '$0'}
          trend={data?.kpis.avgLtv.trend || { value: '+0%', direction: 'neutral' }}
          icon={<TrendingUp className="w-5 h-5" />}
          loading={loading}
        />
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <FadeIn delay={0.2} className="border border-border/50 rounded-xl bg-card p-6 flex flex-col min-h-[400px]">
            <Typography variant="cardTitle" className="mb-6">Revenue Trend (MRR)</Typography>
            {!loading && data ? (
              <AreaChart
                data={data.revenueTrend.map(d => ({ name: d.month, value: d.mrr }))}
                dataKey="value"
                height={350}
              />
            ) : <div className="animate-pulse bg-secondary/50 flex-1 rounded-lg" />}
          </FadeIn>
        </div>

        <div className="flex flex-col space-y-6">
          <FadeIn delay={0.3} className="border border-border/50 rounded-xl bg-card p-6 flex flex-col min-h-[350px]">
            <Typography variant="cardTitle" className="mb-6">Revenue by Segment</Typography>
            {!loading && data ? (
              <BarChart
                data={data.revenueBySegment.map(d => ({ name: d.segment, value: d.revenue }))}
                height={260}
                layout="vertical"
              />
            ) : <div className="animate-pulse bg-secondary/50 flex-1 rounded-lg" />}
          </FadeIn>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <FadeIn delay={0.4} className="border border-border/50 rounded-xl bg-card p-6 flex flex-col min-h-[350px]">
          <Typography variant="cardTitle" className="mb-6">Revenue by Device</Typography>
          {!loading && data ? (
            <ProgressBarList
              items={data.revenueByDevice.map(d => ({ label: d.device, value: d.revenue, metric: `${d.revenue}%` }))}
            />
          ) : <div className="animate-pulse bg-secondary/50 flex-1 rounded-lg" />}
        </FadeIn>

        <div className="lg:col-span-2 flex flex-col space-y-4">
          <Typography variant="cardTitle" className="mb-2">AI Insights</Typography>
          <InsightCard
            type="recommendation"
            title="Revenue Forecast"
            description="Based on current MRR momentum and Q4 historical trends, ARR is projected to hit $100M by end of year if the 1.2% monthly churn rate is maintained."
            actionText="View Projection Details"
            delay={0.5}
          />
          <InsightCard
            type="summary"
            title="ARPU Growth"
            description="Average Revenue Per User has increased by $0.32 in the last 60 days, driven primarily by Family Plan upgrades in EU markets."
            delay={0.6}
          />
        </div>
      </div>
    </div>
  );
}

export default Revenue;
