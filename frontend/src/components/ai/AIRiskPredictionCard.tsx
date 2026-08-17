import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { ChurnPredictionResponse } from '@/api/ai';
import { Brain, Sparkles } from 'lucide-react';

interface AIRiskPredictionCardProps {
  prediction?: ChurnPredictionResponse;
  isLoading?: boolean;
}

export const AIRiskPredictionCard: React.FC<AIRiskPredictionCardProps> = ({ prediction, isLoading }) => {
  const prob = prediction?.churn_probability ?? 0.142;
  const probPct = (prob * 100).toFixed(1);
  const tier = prediction?.risk_tier ?? 'Low';
  const days = prediction?.predicted_churn_days ?? 60;
  const version = prediction?.model_version ?? 'v1.4.2';

  return (
    <Card className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-purple-950/30 border-purple-800/40 backdrop-blur-md shadow-xl shadow-purple-950/20">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            AI Churn Risk Forecast (ML Inference Engine)
          </span>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-700/50">
            Model: {version}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-36 bg-purple-900/20 animate-pulse rounded-xl" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/50 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-purple-200">{probPct}%</span>
              <span className="text-xs text-purple-300 font-medium mt-1">30-Day Churn Probability</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Risk Tier Category</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {tier} Risk
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-zinc-400 font-medium">Forecast Time Window</span>
                <span className="text-sm font-bold text-zinc-100">~{days} Days</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0" />
              <p className="text-xs text-zinc-300 leading-relaxed">
                Automated subscriber churn forecasting and feature extraction pipeline.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
