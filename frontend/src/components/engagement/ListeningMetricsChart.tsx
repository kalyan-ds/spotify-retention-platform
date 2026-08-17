import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { ListeningIntelligenceResponse } from '@/api/engagement';
import { SkipForward, RotateCcw, CheckCircle2 } from 'lucide-react';

interface ListeningMetricsChartProps {
  listeningData?: ListeningIntelligenceResponse;
  isLoading?: boolean;
}

export const ListeningMetricsChart: React.FC<ListeningMetricsChartProps> = ({ listeningData, isLoading }) => {
  const completionRate = listeningData?.completion_rate ?? 78.4;
  const skipRate = listeningData?.skip_rate ?? 14.2;
  const replayRate = listeningData?.replay_rate ?? 7.4;

  return (
    <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
          <span>Listening Intelligence & Track Consumption</span>
          <span className="text-xs font-normal text-purple-400 bg-purple-950/60 border border-purple-800/50 px-2.5 py-1 rounded-full">
            Total Hours: {listeningData?.total_listening_hours.toLocaleString() ?? '14,520'} hrs
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-48 bg-zinc-900/40 animate-pulse rounded-lg" />
        ) : (
          <div className="space-y-6">
            {/* Progress Stack Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
                <span>Consumption Distribution</span>
                <span>100% Total Plays</span>
              </div>
              <div className="h-4 w-full bg-zinc-900 rounded-full overflow-hidden flex">
                <div style={{ width: `${completionRate}%` }} className="bg-emerald-500 h-full" title={`Completion: ${completionRate}%`} />
                <div style={{ width: `${skipRate}%` }} className="bg-red-500 h-full" title={`Skips: ${skipRate}%`} />
                <div style={{ width: `${replayRate}%` }} className="bg-purple-500 h-full" title={`Replays: ${replayRate}%`} />
              </div>
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800/50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs text-zinc-400 font-medium block">Completion Rate</span>
                  <span className="text-lg font-bold text-zinc-100">{completionRate}%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-950/80 border border-red-800/50">
                  <SkipForward className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <span className="text-xs text-zinc-400 font-medium block">Skip Rate (&lt;30s)</span>
                  <span className="text-lg font-bold text-zinc-100">{skipRate}%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-800/50">
                  <RotateCcw className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <span className="text-xs text-zinc-400 font-medium block">Replay Rate</span>
                  <span className="text-lg font-bold text-zinc-100">{replayRate}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
