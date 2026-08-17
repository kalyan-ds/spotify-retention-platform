import { useQuery } from '@tanstack/react-query';
import { useEngagementFilters } from '@/store/useEngagementFilterStore';
import {
  fetchEngagementOverview,
  fetchActivityBreakdown,
  fetchSessionMetrics,
  fetchListeningMetrics,
  fetchFeatureAdoption,
  fetchFunnelAnalysis,
  fetchBehaviorSegments,
  fetchEngagementHealth,
  fetchEngagementInsights,
} from '@/api/engagement';
import { ExecutiveKPIGrid } from '@/components/engagement/ExecutiveKPIGrid';
import { UserActivityHeatmap } from '@/components/engagement/UserActivityHeatmap';
import { SessionAnalyticsChart } from '@/components/engagement/SessionAnalyticsChart';
import { ListeningMetricsChart } from '@/components/engagement/ListeningMetricsChart';
import { FeatureAdoptionChart } from '@/components/engagement/FeatureAdoptionChart';
import { UserJourneyFunnel } from '@/components/engagement/UserJourneyFunnel';
import { BehaviorSegmentDonut } from '@/components/engagement/BehaviorSegmentDonut';
import { EngagementHealthGauge } from '@/components/engagement/EngagementHealthGauge';
import { ExecutiveInsightFeed } from '@/components/engagement/ExecutiveInsightFeed';
import { fetchRecommendations } from '@/api/ai';
import { NextBestActionFeed } from '@/components/ai/NextBestActionFeed';
import { DemoBadge } from '@/components/common/DemoBadge';
import { Download, RefreshCw, Filter } from 'lucide-react';

export default function EngagementDashboard() {
  const { filters, updateFilter } = useEngagementFilters();

  const { data: overviewData, isLoading: isLoadingOverview, refetch: refetchOverview } = useQuery({
    queryKey: ['engagementOverview', filters],
    queryFn: () => fetchEngagementOverview(filters),
  });

  const { data: activityData, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['engagementActivity', filters],
    queryFn: () => fetchActivityBreakdown(filters),
  });

  const { data: sessionData, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['engagementSessions', filters],
    queryFn: () => fetchSessionMetrics(filters),
  });

  const { data: listeningData, isLoading: isLoadingListening } = useQuery({
    queryKey: ['engagementListening', filters],
    queryFn: () => fetchListeningMetrics(filters),
  });

  const { data: featureData, isLoading: isLoadingFeatures } = useQuery({
    queryKey: ['engagementFeatures', filters],
    queryFn: () => fetchFeatureAdoption(filters),
  });

  const { data: funnelData, isLoading: isLoadingFunnels } = useQuery({
    queryKey: ['engagementFunnels', filters],
    queryFn: () => fetchFunnelAnalysis(filters),
  });

  const { data: segmentData, isLoading: isLoadingSegments } = useQuery({
    queryKey: ['engagementSegments', filters],
    queryFn: () => fetchBehaviorSegments(filters),
  });

  const { data: healthData, isLoading: isLoadingHealth } = useQuery({
    queryKey: ['engagementHealth', filters],
    queryFn: () => fetchEngagementHealth(filters),
  });

  const { data: insightData, isLoading: isLoadingInsights } = useQuery({
    queryKey: ['engagementInsights', filters],
    queryFn: () => fetchEngagementInsights(filters),
  });

  const { data: aiRecData, isLoading: isLoadingAIRec } = useQuery({
    queryKey: ['aiEngagementRecommendations', filters],
    queryFn: () => fetchRecommendations(1),
  });

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Metric,Value\nDAU,15420\nWAU,38550\nMAU,50000\nStickiness Ratio,30.84%\nAvg Session Duration,24.5 min\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'engagement_analytics_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <span>Engagement Intelligence Dashboard</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              Engagement Telemetry
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            User activity heatmaps, session durations, feature adoption growth, and behavioral segmentation.
          </p>
          <DemoBadge className="mt-2" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetchOverview()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-semibold text-xs transition-colors shadow-lg shadow-emerald-950/40"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV Report
          </button>
        </div>
      </div>

      {/* 2. Global Filter Toolbar */}
      <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-md flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-emerald-400" />
          Global Scope:
        </div>

        <select
          value={filters.dateRange}
          onChange={(e) => updateFilter('dateRange', e.target.value)}
          className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
        >
          <option value="last_7_days">Last 7 Days</option>
          <option value="last_30_days">Last 30 Days</option>
          <option value="last_90_days">Last 90 Days</option>
          <option value="year_to_date">Year to Date</option>
        </select>

        <select
          value={filters.region}
          onChange={(e) => updateFilter('region', e.target.value)}
          className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Regions</option>
          <option value="NA">North America</option>
          <option value="EU">Europe</option>
          <option value="LATAM">LATAM</option>
          <option value="APAC">APAC</option>
        </select>

        <select
          value={filters.subscriptionPlan}
          onChange={(e) => updateFilter('subscriptionPlan', e.target.value)}
          className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Subscriptions</option>
          <option value="Individual">Individual Premium</option>
          <option value="Duo">Duo Premium</option>
          <option value="Family">Family Premium</option>
          <option value="Student">Student Premium</option>
        </select>

        <select
          value={filters.userSegment}
          onChange={(e) => updateFilter('userSegment', e.target.value)}
          className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Segments</option>
          <option value="power">Power Listeners</option>
          <option value="heavy">Heavy Listeners</option>
          <option value="casual">Casual Listeners</option>
          <option value="explorer">Music Explorers</option>
        </select>
      </div>

      {/* 3. Executive KPI Cards */}
      <ExecutiveKPIGrid overviewData={overviewData?.data} isLoading={isLoadingOverview} />

      {/* 4. User Activity Heatmap */}
      <UserActivityHeatmap activityData={activityData?.data} isLoading={isLoadingActivity} />

      {/* 5. Session & Listening Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SessionAnalyticsChart sessionData={sessionData?.data} isLoading={isLoadingSessions} />
        <ListeningMetricsChart listeningData={listeningData?.data} isLoading={isLoadingListening} />
      </div>

      {/* 6. Feature Adoption & User Journey Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FeatureAdoptionChart featureData={featureData?.data} isLoading={isLoadingFeatures} />
        <UserJourneyFunnel funnelData={funnelData?.data} isLoading={isLoadingFunnels} />
      </div>

      {/* 7. Behavioral Segmentation & Health Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BehaviorSegmentDonut segmentData={segmentData?.data} isLoading={isLoadingSegments} />
        <EngagementHealthGauge healthData={healthData?.data} isLoading={isLoadingHealth} />
      </div>

      {/* 8. Executive Insight Feed & AI Prescriptive Action */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExecutiveInsightFeed insights={insightData?.data} isLoading={isLoadingInsights} />
        <NextBestActionFeed recommendationData={aiRecData} isLoading={isLoadingAIRec} />
      </div>
    </div>
  );
}
