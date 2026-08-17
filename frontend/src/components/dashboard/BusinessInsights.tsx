import React from 'react';
import { InsightWidget } from '../widgets/InsightWidget';

export const BusinessInsights: React.FC = () => {
  const insights = [
    {
      title: 'Customer churn risk decreased by 8% this week',
      description: 'Automated 30-day extension interventions successfully retained high-risk subscribers in North America.',
      impact: '-8.0% Risk',
      category: 'Churn Risk Reduction'
    },
    {
      title: 'Recommendation acceptance increased by 14%',
      description: 'Prescriptive Next Best Action tuning elevated offer conversion across Family and Duo subscription tiers.',
      impact: '+14.0% Acceptance',
      category: 'Conversion Acceleration'
    },
    {
      title: 'Premium upgrades continue to trend upward',
      description: 'Propensity scoring model identifies 12,400 Free users eligible for high-converting Duo trial passes.',
      impact: '+$680K ARR',
      category: 'ARR Growth'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {insights.map((ins, idx) => (
        <InsightWidget
          key={idx}
          title={ins.title}
          description={ins.description}
          impact={ins.impact}
          category={ins.category}
        />
      ))}
    </div>
  );
};
