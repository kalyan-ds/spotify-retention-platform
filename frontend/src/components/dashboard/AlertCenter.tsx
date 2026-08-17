import React from 'react';
import { AlertCard, AlertCardProps } from './AlertCard';
import { AlertTriangle } from 'lucide-react';
import { useActiveAlerts } from '../../hooks/useMonitoring';
import { DashboardLoading } from '../shared/DashboardLoading';

const DEMO_ALERTS: AlertCardProps[] = [
  { id: 'ALT-101', title: 'High Churn Risk Threshold Alert (>80%)', severity: 'Critical', status: 'Open', service: 'Inference Engine', created: '10m ago', team: 'ML Team' },
  { id: 'ALT-102', title: 'PSI Target Prediction Drift Warning', severity: 'High', status: 'Investigating', service: 'Feature Store', created: '22m ago', team: 'Data Platform' },
  { id: 'ALT-103', title: 'In-Memory Cache Utilization Notice', severity: 'Warning', status: 'Acknowledged', service: 'Cache Layer', created: '45m ago', team: 'Platform SRE' },
  { id: 'ALT-104', title: 'Prediction API Latency Spike (>35ms)', severity: 'High', status: 'Investigating', service: 'Prediction API', created: '1h ago', team: 'Performance Team' },
  { id: 'ALT-105', title: 'MySQL Connection Pool Near Limit', severity: 'Notice', status: 'Resolved', service: 'MySQL Database', created: '1.5h ago', team: 'Database Team' },
  { id: 'ALT-106', title: 'Client Route Navigation Warning', severity: 'Warning', status: 'Resolved', service: 'Frontend Client', created: '2h ago', team: 'Frontend Team' },
  { id: 'ALT-107', title: 'Gateway API Latency Compliance', severity: 'Information', status: 'Resolved', service: 'Gateway Service', created: '2.5h ago', team: 'Platform SRE' },
  { id: 'ALT-108', title: 'Model Artifact Checksum Validated', severity: 'Notice', status: 'Resolved', service: 'Model Registry', created: '3h ago', team: 'ML Team' },
  { id: 'ALT-109', title: 'Feature Vector Schema Field Mismatch', severity: 'High', status: 'Resolved', service: 'Feature Store', created: '4h ago', team: 'Data Engineering' },
  { id: 'ALT-110', title: 'Authentication Service Token Delay', severity: 'Warning', status: 'Resolved', service: 'Auth Service', created: '5h ago', team: 'Security Team' },
  { id: 'ALT-111', title: 'Batch Pipeline Evaluation Delay', severity: 'Notice', status: 'Resolved', service: 'Batch Pipeline', created: '6h ago', team: 'Data Platform' },
  { id: 'ALT-112', title: 'Telemetry Heartbeat Miss Detected', severity: 'Information', status: 'Resolved', service: 'Health Probe', created: '8h ago', team: 'Platform SRE' }
];

export const AlertCenter: React.FC = React.memo(() => {
  const { data: apiData, isLoading } = useActiveAlerts();

  if (isLoading) {
    return <DashboardLoading cardsCount={1} height="h-64" />;
  }

  const alerts: AlertCardProps[] = Array.isArray(apiData) && apiData.length > 0 ? (apiData as AlertCardProps[]) : DEMO_ALERTS;
  const activeCount = alerts.filter(a => a.status !== 'Resolved').length;

  return (
    <div className="p-6 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Active Platform Alert Center</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Automated SLA compliance & threshold warning dispatch</p>
          </div>
        </div>
        <span className="text-xs font-mono text-rose-400">{activeCount} Active / {alerts.length} Total</span>
      </div>

      <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
        {alerts.map((alt) => (
          <AlertCard
            key={alt.id}
            id={alt.id}
            title={alt.title}
            severity={alt.severity}
            status={alt.status}
            service={alt.service}
            created={alt.created}
            team={alt.team}
          />
        ))}
      </div>
    </div>
  );
});

AlertCenter.displayName = 'AlertCenter';
