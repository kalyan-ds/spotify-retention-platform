import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '../../components/common/PageContainer';
import { PageHeader } from '../../components/common/PageHeader';
import { DashboardHero } from '../../components/dashboard/DashboardHero';
import { ExecutiveKPIGrid } from '../../components/dashboard/ExecutiveKPIGrid';
import { AIHealthPanel } from '../../components/dashboard/AIHealthPanel';
import { PredictionIntelligencePanel } from '../../components/dashboard/PredictionIntelligencePanel';
import { RecommendationIntelligencePanel } from '../../components/dashboard/RecommendationIntelligencePanel';
import { AIOperationsPanel } from '../../components/dashboard/AIOperationsPanel';
import { OperationsCenterPanel } from '../../components/dashboard/OperationsCenterPanel';
import { RefreshIndicator } from '../../components/shared/RefreshIndicator';
import { RefreshButton } from '../../components/shared/RefreshButton';
import { LastUpdated } from '../../components/shared/LastUpdated';
import { DemoBadge } from '../../components/common/DemoBadge';
import { Sparkles, ShieldCheck, BrainCircuit, Lightbulb, Cpu, Activity } from 'lucide-react';

export const AICommandCenter: React.FC = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleGlobalRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.refetchQueries();
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  return (
    <PageContainer className="space-y-8">
      {/* Page Header with Real-Time Sync Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeader
            title="Enterprise AI Command Center"
            subtitle="Mission Control & Executive Intelligence for Spotify Premium Retention"
            badge="AI Operations"
          />
          <DemoBadge className="-mt-6 mb-2" />
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto shrink-0 bg-neutral-900/60 backdrop-blur-xl p-2.5 rounded-2xl border border-white/10 shadow-lg">
          <RefreshIndicator intervalSeconds={15} />
          <LastUpdated timestamp={lastUpdated} />
          <RefreshButton onRefresh={handleGlobalRefresh} isRefreshing={isRefreshing} />
        </div>
      </div>

      {/* Hero Section */}
      <DashboardHero />

      {/* Executive KPI Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-spotify-green" />
            <h2 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">
              Executive KPI Metrics
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">Sync 60s</span>
        </div>
        <ExecutiveKPIGrid />
      </section>

      {/* Enterprise AI Health Dashboard Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-spotify-green" />
            <h2 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">
              AI Engine Health & Governance
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">Sync 15s</span>
        </div>
        <AIHealthPanel />
      </section>

      {/* Prediction Intelligence Dashboard Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">
              Prediction Intelligence Engine
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">Sync 30s</span>
        </div>
        <PredictionIntelligencePanel />
      </section>

      {/* Recommendation Intelligence Dashboard Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">
              Prescriptive Interventions & Recommendations (NBA)
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">Sync 60s</span>
        </div>
        <RecommendationIntelligencePanel />
      </section>

      {/* AI Operations & Model Registry Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">
              AI Operations & Model Registry
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">Sync 15s</span>
        </div>
        <AIOperationsPanel />
      </section>

      {/* Platform Operations Center Section (Activity Timeline & Alert Center) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">
              Platform Operations & Alert Center
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">Sync 10s</span>
        </div>
        <OperationsCenterPanel />
      </section>
    </PageContainer>
  );
};
