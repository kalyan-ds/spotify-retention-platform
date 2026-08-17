import React, { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { sessionManager, SessionMetadata } from '../../utils/sessionManager';
import { ShieldCheck, Monitor, Clock, Activity, HardDrive } from 'lucide-react';

export const SessionInfoPanel: React.FC = () => {
  const { user } = useAuth();
  const [meta, setMeta] = useState<SessionMetadata>(() => sessionManager.getMetadata());

  useEffect(() => {
    const timer = setInterval(() => {
      setMeta(sessionManager.getMetadata());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${s}s`;
    return `${mins}m ${s}s`;
  };

  const getStatusBadge = () => {
    switch (meta.status) {
      case 'Healthy':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">Healthy</span>;
      case 'Warning':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold animate-pulse">Idle Warning</span>;
      case 'Offline':
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono font-bold">Offline</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-[10px] font-mono">Active</span>;
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-spotify-green" />
          <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
            Active Session Security Telemetry
          </h3>
        </div>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
          <div className="text-[10px] text-neutral-500 flex items-center gap-1">
            <Monitor className="w-3 h-3 text-neutral-400" />
            <span>Device / Environment</span>
          </div>
          <div className="text-neutral-200 font-semibold truncate">{meta.deviceBrowser}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
          <div className="text-[10px] text-neutral-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-400" />
            <span>Active Session Duration</span>
          </div>
          <div className="text-spotify-green font-semibold">{formatDuration(meta.sessionDurationSeconds)}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
          <div className="text-[10px] text-neutral-500 flex items-center gap-1">
            <Activity className="w-3 h-3 text-neutral-400" />
            <span>Last Activity</span>
          </div>
          <div className="text-neutral-200 font-semibold">{meta.idleTimeSeconds}s ago</div>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-1">
          <div className="text-[10px] text-neutral-500 flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-neutral-400" />
            <span>Identity Role</span>
          </div>
          <div className="text-neutral-200 font-semibold">{user?.role || 'Admin'}</div>
        </div>
      </div>
    </div>
  );
};
