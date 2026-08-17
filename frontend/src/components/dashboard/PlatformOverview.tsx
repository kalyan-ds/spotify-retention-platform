import React from 'react';
import { Layers } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';

export const PlatformOverview: React.FC = () => {
  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-spotify-green" />
          <h3 className="text-base font-bold text-white tracking-tight">Enterprise Platform Architecture Overview</h3>
        </div>
        <span className="text-xs font-mono text-spotify-green">Architecture Verified</span>
      </div>
      <p className="text-xs text-neutral-300 leading-relaxed">
        The Spotify Premium Retention Intelligence Platform operates on a decoupled full-stack architecture connecting React SPA, FastAPI REST API, and ML inference models. Feature extraction and model scoring enable SHAP explanations and Next Best Action interventions.
      </p>
    </GlassCard>
  );
};
