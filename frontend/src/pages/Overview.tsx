import { useEffect, useState } from 'react';
import { FilterToolbar } from '@/components/navigation/FilterToolbar';
import { KPICard, ProgressBarList, InsightCard, DataTable, ActivityHeatmap } from '@/components/analytics';
import { DonutChart, BarChart } from '@/components/charts';
import { DashboardService } from '@/services/DashboardService';
import { overviewData } from '@/analytics/overview';
import { DemoBadge } from '@/components/common/DemoBadge';
import { Typography } from '@/components/typography/Typography';
import { Users, Target, DollarSign, MonitorPlay, LineChart, Activity } from 'lucide-react';
import { FadeIn, StaggerContainer } from '@/components/motion';

export function Overview() {
  const [data, setData] = useState<typeof overviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DashboardService.getOverview().then((res: any) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const heatmapData = Array.from({ length: 7 * 10 }).map((_, i) => {
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const HOURS = ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm', '12am'];
    return {
      day: DAYS[i % 7],
      hour: HOURS[Math.floor(i / 7)],
      value: Math.random() * 100
    };
  });

  return (
    <div className="w-full pb-12">
      <FilterToolbar />
      <DemoBadge className="mt-4 mb-2" />

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        <KPICard
          title="TOTAL USERS"
          value="342.7M"
          trend={{ value: '+8.4%', direction: 'up', label: 'vs last month' }}
          icon={<Users className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="PREMIUM USERS"
          value="124.1M"
          trend={{ value: '+12.6%', direction: 'up', label: 'vs last month' }}
          icon={<Target className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="TOTAL REVENUE"
          value="$442M"
          trend={{ value: '+16.1%', direction: 'up', label: 'vs last year' }}
          icon={<DollarSign className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="MONTHLY REVENUE"
          value="$6.8M"
          trend={{ value: '+11.2%', direction: 'up', label: 'vs last month' }}
          icon={<DollarSign className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="AVG LIFETIME VALUE"
          value="$158"
          trend={{ value: '+4.7%', direction: 'up' }}
          icon={<MonitorPlay className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="PREMIUM CONVERSION"
          value="20.6%"
          trend={{ value: '+2.4%', direction: 'up' }}
          icon={<Target className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="RETENTION RATE"
          value="87.4%"
          trend={{ value: '+2.3%', direction: 'up' }}
          icon={<LineChart className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="CHURN RATE"
          value="12.6%"
          trend={{ value: '-1.8%', direction: 'down' }}
          icon={<Activity className="w-5 h-5" />}
          loading={loading}
        />
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        <FadeIn delay={0.2} className="border border-border/50 rounded-xl bg-card p-6 flex flex-col min-h-[350px]">
          <Typography variant="cardTitle" className="mb-6">Revenue by Country</Typography>
          {!loading && data ? (
            <BarChart
              data={data.revenueByCountry.map(d => ({ name: d.country, value: d.revenue }))}
              height={260}
            />
          ) : <div className="animate-pulse bg-secondary/50 flex-1 rounded-lg" />}
        </FadeIn>

        <FadeIn delay={0.3} className="border border-border/50 rounded-xl bg-card p-6 flex flex-col min-h-[350px]">
          <Typography variant="cardTitle" className="mb-6">Premium vs Free</Typography>
          {!loading && data ? (
            <DonutChart
              data={data.premiumVsFree.map(d => ({ name: d.tier, value: d.percentage, percentage: d.percentage, color: d.color }))}
              height={260}
            />
          ) : <div className="animate-pulse bg-secondary/50 flex-1 rounded-lg" />}
        </FadeIn>

        <FadeIn delay={0.4} className="border border-border/50 rounded-xl bg-card p-6 flex flex-col min-h-[350px]">
          <Typography variant="cardTitle" className="mb-6">Top Devices</Typography>
          {!loading && data ? (
            <ProgressBarList
              items={data.topDevices.map(d => ({ label: d.device, value: d.percentage, color: d.color }))}
            />
          ) : <div className="animate-pulse bg-secondary/50 flex-1 rounded-lg" />}
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <FadeIn delay={0.5} className="border border-border/50 rounded-xl bg-card p-6 flex flex-col min-h-[350px]">
            <Typography variant="cardTitle" className="mb-6">User Activity Heatmap</Typography>
            <ActivityHeatmap data={heatmapData} />
          </FadeIn>

          <FadeIn delay={0.6} className="border border-border/50 rounded-xl bg-card p-6 flex flex-col min-h-[350px]">
            <Typography variant="cardTitle" className="mb-6">Country Intelligence Table</Typography>
            {!loading && data ? (
              <DataTable
                data={data.countryIntelligence}
                searchKey="country"
                columns={[
                  { key: 'country', title: 'Country', sortable: true },
                  { key: 'revenue', title: 'Revenue (M)', sortable: true, render: (row) => `$${row.revenue}M` },
                  { key: 'retention', title: 'Retention', sortable: true, render: (row) => `${row.retention}%` },
                  { key: 'churn', title: 'Churn', sortable: true, render: (row) => <span className="text-destructive">{row.churn}%</span> },
                  { key: 'yoyGrowth', title: 'YoY Growth', sortable: true, render: (row) => <span className="text-[#1ed760]">+{row.yoyGrowth}%</span> },
                ]}
              />
            ) : <div className="animate-pulse bg-secondary/50 h-[300px] rounded-lg" />}
          </FadeIn>
        </div>

        <div className="flex flex-col space-y-4">
          <Typography variant="cardTitle" className="mb-2">AI Insights</Typography>
          <InsightCard
            type="recommendation"
            title="AI Recommendations"
            description="India Premium segment shows the highest retention velocity. Allocate 15% more marketing budget to this segment to accelerate ARR."
            actionText="View Segment Details"
            delay={0.5}
          />
          <InsightCard
            type="alert"
            title="Risk Alerts"
            description="Critical: 2,341 High-Churn Users identified in the Brazil Free segment. Predictive model indicates 80% likelihood of churn within 7 days."
            actionText="View Affected Users"
            delay={0.6}
          />
          <InsightCard
            type="summary"
            title="Executive AI Summary"
            description="Platform performance is exceeding Q3 targets by 14%. The recent pricing tier adjustment in EU markets has reduced churn by 1.2% without impacting acquisition rates."
            delay={0.7}
          />
        </div>
      </div>
    </div>
  );
}

export default Overview;
