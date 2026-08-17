import React from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { PageHeader } from '../../components/common/PageHeader';
import { DemoBadge } from '../../components/common/DemoBadge';
import { ExecutiveKPIGrid } from '../../components/dashboard/ExecutiveKPIGrid';
import { BusinessInsights } from '../../components/dashboard/BusinessInsights';
import { RecommendationOverview } from '../../components/dashboard/RecommendationOverview';
import { TrendOverview } from '../../components/dashboard/TrendOverview';
import { AlertCenter } from '../../components/dashboard/AlertCenter';

export const ExecutiveDashboard: React.FC = () => {
  return (
    <PageContainer className="space-y-8">
      <div>
        <PageHeader
          title="Executive Retention Overview"
          subtitle="Strategic Summary of Churn Risk, ARR Protection Analysis, and Retention Trends"
          badge="Executive View"
        />
        <DemoBadge className="-mt-6 mb-2" />
      </div>

      <ExecutiveKPIGrid />

      <BusinessInsights />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecommendationOverview />
        </div>
        <div>
          <AlertCenter />
        </div>
      </div>

      <TrendOverview />
    </PageContainer>
  );
};
