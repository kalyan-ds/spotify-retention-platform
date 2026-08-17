import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchChurnPrediction, fetchRecommendations } from '@/api/ai';
import { AIRiskPredictionCard } from '@/components/ai/AIRiskPredictionCard';
import { SHAPDriverDrawer } from '@/components/ai/SHAPDriverDrawer';
import { NextBestActionFeed } from '@/components/ai/NextBestActionFeed';
import { DemoBadge } from '@/components/common/DemoBadge';
import { Target, RefreshCw, UserCheck } from 'lucide-react';

export default function PredictionsDashboard() {
  const [selectedUserId, setSelectedUserId] = useState<number>(1);

  const { data: predictionData, isLoading: isLoadingPrediction, refetch } = useQuery({
    queryKey: ['aiChurnPrediction', selectedUserId],
    queryFn: () => fetchChurnPrediction(selectedUserId),
  });

  const { data: recData, isLoading: isLoadingRec } = useQuery({
    queryKey: ['aiRecommendations', selectedUserId],
    queryFn: () => fetchRecommendations(selectedUserId),
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <Target className="w-7 h-7 text-emerald-400" />
            <span>Real-Time Predictive Analytics & Recommendations</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time churn forecasting, SHAP tree feature attribution explanations, and Next Best Action interventions.
          </p>
          <DemoBadge className="mt-2" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-zinc-400">User ID:</span>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="bg-transparent text-xs font-semibold text-zinc-100 focus:outline-none"
            >
              <option value={1}>User #1 (Standard Premium)</option>
              <option value={42}>User #42 (High Activity)</option>
              <option value={108}>User #108 (At-Risk)</option>
            </select>
          </div>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-score
          </button>
        </div>
      </div>

      {/* 1. Real-Time Churn Forecast */}
      <AIRiskPredictionCard prediction={predictionData} isLoading={isLoadingPrediction} />

      {/* 2. SHAP Explainability & Next Best Action Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SHAPDriverDrawer attributions={predictionData?.shap_attributions} isLoading={isLoadingPrediction} />
        <NextBestActionFeed recommendationData={recData} isLoading={isLoadingRec} />
      </div>
    </div>
  );
}
