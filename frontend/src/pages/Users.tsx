import { useEffect, useState } from 'react';
import { FilterToolbar } from '@/components/navigation/FilterToolbar';
import { KPICard, InsightCard } from '@/components/analytics';
import { DonutChart, BarChart } from '@/components/charts';
import { DashboardService } from '@/services/DashboardService';
import { usersData } from '@/analytics/users';
import { Typography } from '@/components/typography/Typography';
import { Users as UsersIcon, Clock, Headphones, Zap, Star, Activity } from 'lucide-react';
import { FadeIn, StaggerContainer } from '@/components/motion';

export function Users() {
  const [data, setData] = useState<typeof usersData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DashboardService.getUsers().then((res: any) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full pb-12">
      <FilterToolbar />

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        <KPICard
          title="ACTIVE USERS"
          value={data?.kpis.activeUsers.value || '0'}
          trend={data?.kpis.activeUsers.trend || { value: '0%', direction: 'neutral' }}
          icon={<UsersIcon className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="AVG SESSION DURATION"
          value={data?.kpis.avgSession.value || '0'}
          trend={data?.kpis.avgSession.trend || { value: '0%', direction: 'neutral' }}
          icon={<Clock className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="LISTENING HOURS"
          value={data?.kpis.listeningHrs.value || '0'}
          trend={data?.kpis.listeningHrs.trend || { value: '0%', direction: 'neutral' }}
          icon={<Headphones className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="ADDICTION SCORE"
          value={data?.kpis.addictionScore.value || '0'}
          trend={data?.kpis.addictionScore.trend || { value: '0%', direction: 'neutral' }}
          icon={<Zap className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="USER VALUE SCORE"
          value={data?.kpis.userValueScore.value || '0'}
          trend={data?.kpis.userValueScore.trend || { value: '0%', direction: 'neutral' }}
          icon={<Star className="w-5 h-5" />}
          loading={loading}
        />
        <KPICard
          title="ENGAGEMENT SCORE"
          value={data?.kpis.engagementScore.value || '0'}
          trend={data?.kpis.engagementScore.trend || { value: '0%', direction: 'neutral' }}
          icon={<Activity className="w-5 h-5" />}
          loading={loading}
        />
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <FadeIn delay={0.2} className="border border-border/50 rounded-xl bg-card p-6 flex flex-col min-h-[350px]">
          <Typography variant="cardTitle" className="mb-6">Age Distribution</Typography>
          {!loading && data ? (
            <BarChart
              data={data.ageDistribution.map(d => ({ name: d.age, value: d.count }))}
              height={300}
              layout="vertical"
            />
          ) : <div className="animate-pulse bg-secondary/50 flex-1 rounded-lg" />}
        </FadeIn>

        <FadeIn delay={0.3} className="border border-border/50 rounded-xl bg-card p-6 flex flex-col min-h-[350px]">
          <Typography variant="cardTitle" className="mb-6">Gender Distribution</Typography>
          {!loading && data ? (
            <DonutChart
              data={data.genderDistribution.map(d => ({ name: d.gender, value: d.percentage, percentage: d.percentage, color: d.color }))}
              height={300}
            />
          ) : <div className="animate-pulse bg-secondary/50 flex-1 rounded-lg" />}
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
           <FadeIn delay={0.4} className="border border-border/50 rounded-xl bg-card p-6 flex flex-col min-h-[350px]">
             <Typography variant="cardTitle" className="mb-6">User Demographics Summary</Typography>
             <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-secondary/20 rounded-lg border border-border/30">
                 <Typography variant="smallText" className="text-muted-foreground uppercase tracking-wider mb-1">Dominant Age Group</Typography>
                 <Typography variant="sectionTitle" as="h3">25-34 Years</Typography>
               </div>
               <div className="p-4 bg-secondary/20 rounded-lg border border-border/30">
                 <Typography variant="smallText" className="text-muted-foreground uppercase tracking-wider mb-1">Fastest Growing</Typography>
                 <Typography variant="sectionTitle" as="h3" className="text-[#1ed760]">18-24 Years</Typography>
               </div>
             </div>
           </FadeIn>
        </div>
        <div className="flex flex-col space-y-4">
          <Typography variant="cardTitle" className="mb-2">AI Insights</Typography>
          <InsightCard
            type="summary"
            title="AI User Insights"
            description="The 25-34 Age Group represents your highest value segment, showing 21% more engagement on weekends compared to other cohorts."
            delay={0.5}
          />
        </div>
      </div>
    </div>
  );
}

export default Users;
