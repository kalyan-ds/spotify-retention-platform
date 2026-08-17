import { useQuery } from '@tanstack/react-query';
import { useRetentionFilters } from '@/store/useRetentionFilterStore';
import {
  fetchChurnKPIs,
  fetchRetentionHealth,
  fetchCohortMatrix,
  fetchChurnDistribution,
  fetchRetentionTrends,
  fetchExecutiveInsights,
} from '@/api/retention';
import { RetentionKPIGrid } from '@/components/retention/RetentionKPIGrid';
import { RetentionTrendChart } from '@/components/retention/RetentionTrendChart';
import { CohortHeatmapGrid } from '@/components/retention/CohortHeatmapGrid';
import { RetentionHealthPanel } from '@/components/retention/RetentionHealthPanel';
import { ChurnIntelligencePanel } from '@/components/retention/ChurnIntelligencePanel';
import { ExecutiveInsightFeed } from '@/components/retention/ExecutiveInsightFeed';
import { fetchChurnPrediction, fetchRecommendations } from '@/api/ai';
import { AIRiskPredictionCard } from '@/components/ai/AIRiskPredictionCard';
import { SHAPDriverDrawer } from '@/components/ai/SHAPDriverDrawer';
import { NextBestActionFeed } from '@/components/ai/NextBestActionFeed';
import { DemoBadge } from '@/components/common/DemoBadge';
import { Download, RefreshCw, Filter } from 'lucide-react';

export default function RetentionDashboard() {
  const { filters, updateFilter } = useRetentionFilters();

  const { data: churnKpiData, isLoading: isLoadingKpis, refetch: refetchKpis } = useQuery({
    queryKey: ['retentionChurnKPIs', filters],
    queryFn: () => fetchChurnKPIs(filters),
  });

  const { data: healthData, isLoading: isLoadingHealth } = useQuery({
    queryKey: ['retentionHealth', filters],
    queryFn: () => fetchRetentionHealth(filters),
  });

  const { data: cohortData, isLoading: isLoadingCohorts } = useQuery({
    queryKey: ['retentionCohorts', filters],
    queryFn: () => fetchCohortMatrix('monthly', filters),
  });

  const { data: churnDistData, isLoading: isLoadingChurnDist } = useQuery({
    queryKey: ['retentionChurnDist', filters],
    queryFn: () => fetchChurnDistribution(filters),
  });

  const { data: trendData, isLoading: isLoadingTrends } = useQuery({
    queryKey: ['retentionTrends', filters],
    queryFn: () => fetchRetentionTrends(filters),
  });

  const { data: insightData, isLoading: isLoadingInsights } = useQuery({
    queryKey: ['retentionInsights', filters],
    queryFn: () => fetchExecutiveInsights(filters),
  });

  const { data: aiChurnData, isLoading: isLoadingAIChurn } = useQuery({
    queryKey: ['aiChurnPrediction', filters],
    queryFn: () => fetchChurnPrediction(1),
  });

  const { data: aiRecData, isLoading: isLoadingAIRec } = useQuery({
    queryKey: ['aiRecommendations', filters],
    queryFn: () => fetchRecommendations(1),
  });

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Metric,Value\nCustomer Retention Rate,88.4%\nNet Revenue Retention,108.2%\nOverall Churn Rate,4.2%\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'retention_analytics_report.csv');
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
            <span>Retention Intelligence Dashboard</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              Retention Analytics
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Executive subscriber retention metrics, cohort heatmaps, and churn risk distributions.
          </p>
          <DemoBadge className="mt-2" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetchKpis()}
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
      </div>

      {/* 3. Executive KPI Cards */}
      <RetentionKPIGrid kpiData={churnKpiData?.data?.metrics} isLoading={isLoadingKpis} />

      {/* 3.1 PHASE 7: AI Predictive Churn Forecast & Next Best Action */}
      <AIRiskPredictionCard prediction={aiChurnData} isLoading={isLoadingAIChurn} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SHAPDriverDrawer attributions={aiChurnData?.shap_attributions} isLoading={isLoadingAIChurn} />
        <NextBestActionFeed recommendationData={aiRecData} isLoading={isLoadingAIRec} />
      </div>

      {/* 4. Retention Trend Section */}
      <RetentionTrendChart trendData={trendData?.data?.data_points} isLoading={isLoadingTrends} />

      {/* 5. Cohort Heatmap Grid */}
      <CohortHeatmapGrid cohortData={cohortData?.data?.rows} isLoading={isLoadingCohorts} />

      {/* 6. Health & Persona Analysis */}
      <RetentionHealthPanel healthData={healthData?.data} isLoading={isLoadingHealth} />

      {/* 7. Churn Intelligence & Risk Breakdown */}
      <ChurnIntelligencePanel churnData={churnDistData?.data} isLoading={isLoadingChurnDist} />

      {/* 8. Executive Insights Feed */}
      <ExecutiveInsightFeed insights={insightData?.data} isLoading={isLoadingInsights} />
    </div>
  );
}
