import React from 'react';
import { Activity, Server, Database, Key, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../cards/GlassCard';
import { StatusBadge } from '../common/StatusBadge';

export const SystemStatus: React.FC = () => {
  const services = [
    { name: 'FastAPI Backend Gateway', status: 'Healthy', latency: '1.99 ms', icon: <Server className="w-4 h-4 text-spotify-green" /> },
    { name: 'MySQL Relational Database', status: 'Healthy', latency: '0.85 ms', icon: <Database className="w-4 h-4 text-blue-400" /> },
    { name: 'In-Memory Cache Layer', status: 'Healthy', latency: '0.12 ms', icon: <Activity className="w-4 h-4 text-purple-400" /> },
    { name: 'AI Inference Engine', status: 'Healthy', latency: '1.45 ms', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { name: 'Feature Extraction Pipeline', status: 'Healthy', latency: '0.90 ms', icon: <Database className="w-4 h-4 text-cyan-400" /> },
    { name: 'Model Registry Storage', status: 'Healthy', latency: '1.10 ms', icon: <Server className="w-4 h-4 text-teal-400" /> },
    { name: 'JWT Authentication & RBAC', status: 'Healthy', latency: '0.45 ms', icon: <Key className="w-4 h-4 text-amber-400" /> }
  ];

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-spotify-green" />
          <h3 className="text-base font-bold text-white tracking-tight">System & Microservice Topology</h3>
        </div>
        <StatusBadge status="Healthy" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((s, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-neutral-800">{s.icon}</div>
              <div>
                <p className="text-xs font-bold text-white truncate">{s.name}</p>
                <p className="text-[10px] font-mono text-neutral-400">Latency: {s.latency}</p>
              </div>
            </div>
            <StatusBadge status={s.status} size="sm" />
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
