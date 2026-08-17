import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { UserJourneyResponse } from '@/api/engagement';
import { ChevronRight } from 'lucide-react';

interface UserJourneyFunnelProps {
  funnelData?: UserJourneyResponse;
  isLoading?: boolean;
}

export const UserJourneyFunnel: React.FC<UserJourneyFunnelProps> = ({ funnelData, isLoading }) => {
  const steps = funnelData?.steps ?? [
    { step_number: 1, step_name: 'App Open', user_count: 10000, conversion_rate: 100.0, dropoff_rate: 0.0 },
    { step_number: 2, step_name: 'Search / Browse', user_count: 8200, conversion_rate: 82.0, dropoff_rate: 18.0 },
    { step_number: 3, step_name: 'Track Play', user_count: 7500, conversion_rate: 91.5, dropoff_rate: 8.5 },
    { step_number: 4, step_name: 'Add to Playlist / Like', user_count: 4100, conversion_rate: 54.7, dropoff_rate: 45.3 },
    { step_number: 5, step_name: 'Premium Upgrade Click', user_count: 1200, conversion_rate: 29.3, dropoff_rate: 70.7 },
  ];

  return (
    <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
          <span>{funnelData?.funnel_name ?? 'Core Onboarding & Conversion Funnel'}</span>
          <span className="text-xs font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            Overall Conversion: {funnelData?.overall_conversion_rate ?? 12.0}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-56 bg-zinc-900/40 animate-pulse rounded-lg" />
        ) : (
          <div className="space-y-3">
            {steps.map((step, index) => {
              const widthPct = Math.max(15, (step.user_count / steps[0].user_count) * 100);
              return (
                <div key={step.step_number} className="relative">
                  <div className="flex items-center justify-between text-xs text-zinc-300 mb-1 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                        {step.step_number}
                      </span>
                      {step.step_name}
                    </span>
                    <span>{step.user_count.toLocaleString()} Users ({step.conversion_rate}%)</span>
                  </div>
                  <div className="h-6 w-full bg-zinc-900/80 rounded-lg overflow-hidden relative">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg transition-all duration-500"
                    />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex items-center justify-center my-1 text-zinc-600">
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
