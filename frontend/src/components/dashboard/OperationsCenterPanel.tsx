import React from 'react';
import { NotificationSummary } from './NotificationSummary';
import { ActivityTimeline } from './ActivityTimeline';
import { AlertCenter } from './AlertCenter';
import { OperationsFilterBar } from './OperationsFilterBar';
import { ShieldCheck } from 'lucide-react';

export const OperationsCenterPanel: React.FC = React.memo(() => {
  return (
    <div className="space-y-6">
      {/* Top Row: Notification Summary (4 Cards) */}
      <NotificationSummary />

      {/* Middle Row: Activity Timeline (Left) & Alert Center (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityTimeline />
        <AlertCenter />
      </div>

      {/* Bottom Row: Operations Filter Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-spotify-green" />
            <h3 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono">
              Operations Center Log & Incident Explorer
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400">Filter & Audit</span>
        </div>
        <OperationsFilterBar />
      </div>
    </div>
  );
});

OperationsCenterPanel.displayName = 'OperationsCenterPanel';
