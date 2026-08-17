import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { ExecutiveInsight } from '@/api/retention';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface ExecutiveInsightFeedProps {
  insights?: ExecutiveInsight[];
  isLoading?: boolean;
}

export const ExecutiveInsightFeed: React.FC<ExecutiveInsightFeedProps> = ({ insights, isLoading }) => {
  const sampleInsights: ExecutiveInsight[] = insights && insights.length > 0 ? insights : [
    {
      title: 'Net Revenue Retention Expansion',
      category: 'Positive',
      impact: 'High',
      description: 'NRR reached 108.2% driven by a 14% increase in Premium Family plan upgrades in North America.'
    },
    {
      title: 'Mobile App Churn Anomaly',
      category: 'Negative',
      impact: 'Medium',
      description: 'Android users exhibit a 3.2% higher churn rate following application version 4.2 update.'
    },
    {
      title: 'Dormant User Re-engagement Opportunity',
      category: 'Actionable',
      impact: 'High',
      description: '1,420 dormant users reactivated following targeted personalized playlist notifications. Scale campaign to EU region.'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Positive': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'Negative': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Lightbulb className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>Executive Intelligence & Automated Takeaways</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-40 bg-zinc-900/40 animate-pulse rounded-lg" />
        ) : (
          <div className="space-y-3">
            {sampleInsights.map((insight, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-start gap-3 hover:border-zinc-700/80 transition-colors">
                <div className="mt-0.5 p-1.5 rounded-lg bg-zinc-800/80">
                  {getCategoryIcon(insight.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-zinc-100">{insight.title}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      {insight.impact} Impact
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
