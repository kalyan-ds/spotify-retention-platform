import React from 'react';
import { motion } from 'framer-motion';
import { RecommendationConfidenceBadge } from './RecommendationConfidenceBadge';
import { CheckCircle2, Clock, PlayCircle, ShieldCheck } from 'lucide-react';
import { useTopRecommendations } from '../../hooks/useRecommendations';
import { DashboardLoading } from '../shared/DashboardLoading';

interface RecommendationRow {
  id: string;
  title: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence: number;
  impact: string;
  segment: string;
  status: 'Ready' | 'Scheduled' | 'In Progress' | 'Completed';
  created: string;
}

const DEMO_ROWS: RecommendationRow[] = [
  { id: 'REC-4029', title: 'Personalized 30-Day Premium Extension', priority: 'Critical', confidence: 95, impact: '+$420K ARR', segment: 'High Risk Cohort #104', status: 'In Progress', created: '10m ago' },
  { id: 'REC-4028', title: 'Family Plan Migration Pass (20% Off)', priority: 'Critical', confidence: 94, impact: '+$680K ARR', segment: 'Multi-Device Free Tier', status: 'Ready', created: '25m ago' },
  { id: 'REC-4027', title: 'Duo Plan Upgrade Trial Pass', priority: 'High', confidence: 92, impact: '+$320K ARR', segment: 'Shared Location Cohort', status: 'Scheduled', created: '40m ago' },
  { id: 'REC-4026', title: 'Annual Loyalty Gift Voucher', priority: 'High', confidence: 91, impact: '+$510K ARR', segment: '11-Month Subscribers', status: 'In Progress', created: '1h ago' },
  { id: 'REC-4025', title: 'Student Pass Graduate Discount', priority: 'Medium', confidence: 88, impact: '+$180K ARR', segment: 'Graduating Students', status: 'Ready', created: '1.5h ago' },
  { id: 'REC-4024', title: 'Personalized Daily Mix Refresh', priority: 'Low', confidence: 96, impact: '+$150K ARR', segment: 'Dormant Listeners', status: 'Completed', created: '2h ago' },
  { id: 'REC-4023', title: 'Audiobook 10-Hour Trial Pass', priority: 'High', confidence: 89, impact: '+$290K ARR', segment: 'Podcast Heavy Cohort', status: 'Scheduled', created: '2.5h ago' },
  { id: 'REC-4022', title: 'Win-Back Premium VIP Month', priority: 'Critical', confidence: 93, impact: '+$240K ARR', segment: 'Cancelled in Last 14 Days', status: 'In Progress', created: '3h ago' },
  { id: 'REC-4021', title: 'HiFi Streaming Audio Pass', priority: 'Medium', confidence: 85, impact: '+$110K ARR', segment: 'Audiophile Listeners', status: 'Ready', created: '3.5h ago' },
  { id: 'REC-4020', title: 'Offline Download Queue Boost', priority: 'Low', confidence: 87, impact: '+$60K ARR', segment: 'Traveler Sub-Segment', status: 'Completed', created: '4h ago' }
];

export const TopRecommendationsTable: React.FC = React.memo(() => {
  const { data: apiData, isLoading } = useTopRecommendations();

  if (isLoading) {
    return <DashboardLoading cardsCount={1} height="h-64" />;
  }

  const rows: RecommendationRow[] = Array.isArray(apiData) && apiData.length > 0 ? apiData : DEMO_ROWS;

  const getPriorityBadge = (priority: RecommendationRow['priority']) => {
    switch (priority) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">Medium</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Low</span>;
    }
  };

  const getStatusBadge = (status: RecommendationRow['status']) => {
    switch (status) {
      case 'Ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <ShieldCheck className="w-3 h-3" />
            Ready
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Clock className="w-3 h-3" />
            Scheduled
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <PlayCircle className="w-3 h-3" />
            In Progress
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-spotify-green/15 text-spotify-green border border-spotify-green/30">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Top Prescriptive Action Queue</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Automated Next Best Action (NBA) conversion candidates</p>
        </div>
        <span className="text-xs font-mono text-neutral-400">{rows.length} Top Recommendations</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
              <th className="py-3 px-3">REC ID</th>
              <th className="py-3 px-3">RECOMMENDATION ACTION</th>
              <th className="py-3 px-3">PRIORITY</th>
              <th className="py-3 px-3">CONFIDENCE</th>
              <th className="py-3 px-3">EXPECTED IMPACT</th>
              <th className="py-3 px-3">TARGET SEGMENT</th>
              <th className="py-3 px-3">STATUS</th>
              <th className="py-3 px-3 text-right">CREATED</th>
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
                <td className="py-3 px-3 font-semibold text-white">{r.title}</td>
                <td className="py-3 px-3">{getPriorityBadge(r.priority)}</td>
                <td className="py-3 px-3">
                  <RecommendationConfidenceBadge score={r.confidence} />
                </td>
                <td className="py-3 px-3 font-mono font-bold text-spotify-green">{r.impact}</td>
                <td className="py-3 px-3 text-neutral-300 font-medium">{r.segment}</td>
                <td className="py-3 px-3">{getStatusBadge(r.status)}</td>
                <td className="py-3 px-3 text-right font-mono text-neutral-400">{r.created}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

TopRecommendationsTable.displayName = 'TopRecommendationsTable';
