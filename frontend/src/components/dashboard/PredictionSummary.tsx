import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';

export const PredictionSummary: React.FC = () => {
  return (
    <GlassCard className="space-y-3">
      <div className="flex items-center gap-2">
        <BrainCircuit className="w-5 h-5 text-purple-400" />
        <h3 className="text-sm font-bold text-white">Prediction Intelligence Summary</h3>
      </div>
      <p className="text-xs text-neutral-400 leading-relaxed">
        The active XGBoost Champion model predicts 30-day Premium churn probability using 25 continuous and categorical features.
        The overall high-risk cohort represents 5.8% of total active subscribers.
      </p>
    </GlassCard>
  );
};
