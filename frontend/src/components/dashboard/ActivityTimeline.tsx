import React from 'react';
import {
  Brain,
  Cpu,
  Lightbulb,
  ShieldCheck,
  Layers,
  Activity,
  GitBranch,
  Database,
  UserCheck,
  CheckCircle2,
  Gauge
} from 'lucide-react';
import { TimelineEventCard, TimelineEventProps } from './TimelineEventCard';
import { useTimelineEvents } from '../../hooks/useMonitoring';
import { DashboardLoading } from '../shared/DashboardLoading';

const DEMO_EVENTS: TimelineEventProps[] = [
  { id: 'ev-1', time: '2m ago', title: 'Batch Prediction Completed', description: 'Cohort churn inference finished for subscriber dataset.', severity: 'Notice', source: 'Inference Engine', icon: <Brain className="w-4 h-4" />, accentColor: '#1DB954' },
  { id: 'ev-2', time: '8m ago', title: 'XGBoost Model Trained', description: 'Classification model trained on subscriber engagement dataset.', severity: 'Notice', source: 'ML Pipeline', icon: <Cpu className="w-4 h-4" />, accentColor: '#8B5CF6' },
  { id: 'ev-3', time: '12m ago', title: 'Prescriptive NBA Generated', description: 'Personalized retention intervention generated for user cohort.', severity: 'Notice', source: 'NBA Engine', icon: <Lightbulb className="w-4 h-4" />, accentColor: '#F59E0B' },
  { id: 'ev-4', time: '18m ago', title: 'Release Build Validated', description: 'Automated type checking and build verification passed.', severity: 'Information', source: 'Build Service', icon: <ShieldCheck className="w-4 h-4" />, accentColor: '#3B82F6' },
  { id: 'ev-5', time: '25m ago', title: 'Routes Initialized', description: 'Client single-page application routes initialized cleanly.', severity: 'Notice', source: 'React Router', icon: <Layers className="w-4 h-4" />, accentColor: '#06B6D4' },
  { id: 'ev-6', time: '32m ago', title: 'CI Workflow Triggered', description: 'GitHub Actions automated build and lint pipeline executed.', severity: 'Information', source: 'GitHub Actions', icon: <Activity className="w-4 h-4" />, accentColor: '#6366F1' },
  { id: 'ev-7', time: '45m ago', title: 'Prediction Drift Check', description: 'Population Stability Index (PSI) calculated for model features.', severity: 'Warning', source: 'PSI Auditor', icon: <GitBranch className="w-4 h-4" />, accentColor: '#F59E0B' },
  { id: 'ev-8', time: '1h ago', title: 'Data Cache Synced', description: 'Client server-state query cache deduplicated and updated.', severity: 'Notice', source: 'TanStack Query', icon: <Database className="w-4 h-4" />, accentColor: '#EC4899' },
  { id: 'ev-9', time: '1.2h ago', title: 'Session Login Event', description: 'AI Platform Administrator logged in from authenticated IP.', severity: 'Information', source: 'OAuth Portal', icon: <UserCheck className="w-4 h-4" />, accentColor: '#10B981' },
  { id: 'ev-10', time: '1.5h ago', title: 'API Gateway Health Check', description: 'FastAPI backend service health probes responding with HTTP 200 OK.', severity: 'Notice', source: 'FastAPI Gateway', icon: <CheckCircle2 className="w-4 h-4" />, accentColor: '#1DB954' },
  { id: 'ev-11', time: '2h ago', title: 'Database Schema Validated', description: 'SQLAlchemy ORM models verified against database schema.', severity: 'Notice', source: 'MySQL Database', icon: <CheckCircle2 className="w-4 h-4" />, accentColor: '#3B82F6' },
  { id: 'ev-12', time: '2.2h ago', title: 'Build Verification Passed', description: 'Production bundle code-splitting and asset allocation verified.', severity: 'Information', source: 'Vite Bundler', icon: <Gauge className="w-4 h-4" />, accentColor: '#06B6D4' }
];

const getEventIcon = (id: string) => {
  switch (id) {
    case 'ev-1': return <Brain className="w-4 h-4" />;
    case 'ev-2': return <Cpu className="w-4 h-4" />;
    case 'ev-3': return <Lightbulb className="w-4 h-4" />;
    case 'ev-4': return <ShieldCheck className="w-4 h-4" />;
    case 'ev-5': return <Layers className="w-4 h-4" />;
    case 'ev-6': return <Activity className="w-4 h-4" />;
    case 'ev-7': return <GitBranch className="w-4 h-4" />;
    case 'ev-8': return <Database className="w-4 h-4" />;
    case 'ev-9': return <UserCheck className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

export const ActivityTimeline: React.FC = React.memo(() => {
  const { data: apiData, isLoading } = useTimelineEvents();

  if (isLoading) {
    return <DashboardLoading cardsCount={1} height="h-64" />;
  }

  const events: TimelineEventProps[] = Array.isArray(apiData) && apiData.length > 0
    ? apiData.map(e => ({
        ...e,
        icon: getEventIcon(e.id)
      }))
    : DEMO_EVENTS;

  return (
    <div className="p-6 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-spotify-green" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Live Activity Event Stream</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Chronological system events, inference logs & audit trail</p>
          </div>
        </div>
        <span className="text-xs font-mono text-neutral-400">{events.length} Events</span>
      </div>

      <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
        {events.map((ev) => (
          <TimelineEventCard
            key={ev.id}
            id={ev.id}
            time={ev.time}
            title={ev.title}
            description={ev.description}
            severity={ev.severity}
            source={ev.source}
            icon={ev.icon}
            accentColor={ev.accentColor}
          />
        ))}
      </div>
    </div>
  );
});

ActivityTimeline.displayName = 'ActivityTimeline';
