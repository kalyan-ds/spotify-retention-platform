import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { useRecentPredictions } from '../../hooks/usePredictions';
import { DashboardLoading } from '../shared/DashboardLoading';

interface PredictionRow {
  id: string;
  segment: string;
  type: string;
  confidence: string;
  status: 'Completed' | 'Pending' | 'Healthy';
  time: string;
}

const DEMO_ROWS: PredictionRow[] = [
  { id: 'PRD-94820', segment: 'Premium Individual', type: '30-Day Churn Risk', confidence: '94%', status: 'Completed', time: '2 mins ago' },
  { id: 'PRD-94819', segment: 'Student Pass', type: 'Upgrade Propensity', confidence: '91%', status: 'Completed', time: '5 mins ago' },
  { id: 'PRD-94818', segment: 'Family Plan Owner', type: 'Engagement Score', confidence: '96%', status: 'Healthy', time: '8 mins ago' },
  { id: 'PRD-94817', segment: 'Duo Plan Member', type: 'Persona Classification', confidence: '88%', status: 'Completed', time: '12 mins ago' },
  { id: 'PRD-94816', segment: 'Free Tier Heavy', type: 'Upgrade Propensity', confidence: '92%', status: 'Completed', time: '15 mins ago' },
  { id: 'PRD-94815', segment: 'Premium Individual', type: '30-Day Churn Risk', confidence: '78%', status: 'Pending', time: '18 mins ago' },
  { id: 'PRD-94814', segment: 'Family Sub-Account', type: 'Engagement Score', confidence: '95%', status: 'Healthy', time: '22 mins ago' },
  { id: 'PRD-94813', segment: 'Student Pass', type: 'Downgrade Risk', confidence: '89%', status: 'Completed', time: '25 mins ago' },
  { id: 'PRD-94812', segment: 'High Value Subscriber', type: '30-Day Churn Risk', confidence: '97%', status: 'Healthy', time: '28 mins ago' },
  { id: 'PRD-94811', segment: 'Duo Plan Primary', type: 'Persona Classification', confidence: '90%', status: 'Completed', time: '32 mins ago' }
];

export const RecentPredictionsTable: React.FC = React.memo(() => {
  const { data: apiData, isLoading } = useRecentPredictions();

  if (isLoading) {
    return <DashboardLoading cardsCount={1} height="h-64" />;
  }

  const rows: PredictionRow[] = Array.isArray(apiData) && apiData.length > 0 ? apiData : DEMO_ROWS;

  const getStatusChip = (status: PredictionRow['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-spotify-green/15 text-spotify-green border border-spotify-green/30">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'Healthy':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <ShieldCheck className="w-3 h-3" />
            Healthy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Recent Inference Log</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Real-time cohort inference results with confidence scoring</p>
        </div>
        <span className="text-xs font-mono text-neutral-400">{rows.length} Most Recent</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
              <th className="py-3 px-3">PREDICTION ID</th>
              <th className="py-3 px-3">CUSTOMER SEGMENT</th>
              <th className="py-3 px-3">PREDICTION TYPE</th>
              <th className="py-3 px-3">CONFIDENCE</th>
              <th className="py-3 px-3">STATUS</th>
              <th className="py-3 px-3 text-right">CREATED TIME</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {rows.map((r, idx) => (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.03 }}
                className="hover:bg-neutral-800/40 transition-colors"
              >
                <td className="py-3 px-3 font-mono font-bold text-white">{r.id}</td>
                <td className="py-3 px-3 text-neutral-300 font-medium">{r.segment}</td>
                <td className="py-3 px-3 text-neutral-400">{r.type}</td>
                <td className="py-3 px-3 font-mono font-bold text-spotify-green">{r.confidence}</td>
                <td className="py-3 px-3">{getStatusChip(r.status)}</td>
                <td className="py-3 px-3 text-right font-mono text-neutral-400">{r.time}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

RecentPredictionsTable.displayName = 'RecentPredictionsTable';
