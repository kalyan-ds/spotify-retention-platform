import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';

interface InsightWidgetProps {
  title: string;
  description: string;
  impact?: string;
  category?: string;
}

export const InsightWidget: React.FC<InsightWidgetProps> = ({
  title,
  description,
  impact = '+8.4% Impact',
  category = 'Executive AI Insight'
}) => {
  return (
    <GlassCard className="flex flex-col justify-between group">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-spotify-green/10 text-spotify-green border border-spotify-green/20">
          <Sparkles className="w-3 h-3" />
          {category}
        </span>
        <span className="text-xs font-mono font-bold text-spotify-green">{impact}</span>
      </div>

      <div className="my-3">
        <h4 className="text-sm font-bold text-white group-hover:text-spotify-green transition-colors">
          {title}
        </h4>
        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{description}</p>
      </div>

      <div className="flex items-center text-xs font-semibold text-neutral-400 group-hover:text-white transition-colors">
        <span>Explore analysis</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </GlassCard>
  );
};
