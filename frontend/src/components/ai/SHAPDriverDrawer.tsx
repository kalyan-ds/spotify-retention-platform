import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { SHAPAttribution } from '@/api/ai';
import { HelpCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface SHAPDriverDrawerProps {
  attributions?: SHAPAttribution[];
  isLoading?: boolean;
}

export const SHAPDriverDrawer: React.FC<SHAPDriverDrawerProps> = ({ attributions, isLoading }) => {
  const drivers: SHAPAttribution[] = attributions && attributions.length > 0 ? attributions : [
    {
      feature_name: 'skip_rate_30d',
      shap_value: 0.42,
      feature_value: '14.2%',
      business_explanation: 'Track skip rate remains low at 14.2%, preserving retention probability.'
    },
    {
      feature_name: 'dau_mau_ratio_7d',
      shap_value: -0.22,
      feature_value: '30.8%',
      business_explanation: 'Consistent 30.8% DAU/MAU stickiness provides strong base engagement.'
    },
    {
      feature_name: 'payment_failure_count_90d',
      shap_value: -0.10,
      feature_value: '0 Failures',
      business_explanation: 'Clean 90-day subscription renewal history with 0 payment declines.'
    }
  ];

  return (
    <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            Explainable AI (XAI) SHAP Feature Drivers
          </span>
          <span className="text-xs font-normal text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2.5 py-1 rounded-full">
            TreeSHAP Attribution Engine
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-40 bg-zinc-900/40 animate-pulse rounded-lg" />
        ) : (
          <div className="space-y-3">
            {drivers.map((d, i) => {
              const isPositiveRisk = d.shap_value > 0;
              return (
                <div key={i} className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg ${isPositiveRisk ? 'bg-red-950/80 text-red-400' : 'bg-emerald-950/80 text-emerald-400'}`}>
                    {isPositiveRisk ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-300 font-semibold">{d.feature_name} ({d.feature_value})</span>
                      <span className={`text-xs font-bold ${isPositiveRisk ? 'text-red-400' : 'text-emerald-400'}`}>
                        SHAP: {d.shap_value > 0 ? `+${d.shap_value}` : d.shap_value}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{d.business_explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
