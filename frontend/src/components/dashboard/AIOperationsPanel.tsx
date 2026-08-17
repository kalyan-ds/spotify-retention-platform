import React from 'react';
import { ModelRegistryGrid } from './ModelRegistryGrid';
import { ModelPerformanceChart } from './ModelPerformanceChart';
import { ModelHealthTimeline } from './ModelHealthTimeline';
import { DriftMonitoringCard } from './DriftMonitoringCard';
import { DeploymentPipelineCard } from './DeploymentPipelineCard';
import { ModelVersionTable } from './ModelVersionTable';

export const AIOperationsPanel: React.FC = React.memo(() => {
  return (
    <div className="space-y-6">
      {/* Top Row: Model Registry Grid (4 Cards) */}
      <ModelRegistryGrid />

      {/* Middle Row: Model Performance Chart + Model Health Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModelPerformanceChart />
        <ModelHealthTimeline />
      </div>

      {/* Lower Row: Drift Monitoring + Deployment Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DriftMonitoringCard />
        <DeploymentPipelineCard />
      </div>

      {/* Bottom Row: Model Version Catalog Table */}
      <ModelVersionTable />
    </div>
  );
});

AIOperationsPanel.displayName = 'AIOperationsPanel';
