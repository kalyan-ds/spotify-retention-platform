import React, { useState } from 'react';
import { ProductionDeploymentAuditorService } from '../../utils/productionDeploymentAuditor';
import { ProductionDeploymentReport } from '../../types/deployment';
import {
  Rocket,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const ReleaseDashboard: React.FC = () => {
  const [report, setReport] = useState<ProductionDeploymentReport>(() => ProductionDeploymentAuditorService.getDeploymentReport());
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRefreshAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setReport(ProductionDeploymentAuditorService.getDeploymentReport());
      setIsAuditing(false);
    }, 400);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans text-white">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-mono font-semibold mb-2">
            <Rocket className="w-3.5 h-3.5" />
            <span>DevOps & Enterprise Deployment Readiness</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Release Readiness & Deployment Matrix</h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Real-time deployment audit, environment matrix, health check probes, and release gate verification.
          </p>
        </div>

        <button
          onClick={handleRefreshAudit}
          disabled={isAuditing}
          className="py-2 px-3.5 rounded-xl bg-spotify-green hover:bg-spotify-green-hover text-black text-xs font-mono font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-spotify-green/10 disabled:opacity-50 shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-black ${isAuditing ? 'animate-spin' : ''}`} />
          <span>Run Deployment Audit</span>
        </button>
      </div>

      {/* Production Readiness Score Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 text-center md:text-left">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Release Readiness Score</div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="text-4xl md:text-5xl font-black text-spotify-green tracking-tight font-mono">
              {report.readinessScore}%
            </span>
            <span className="px-3 py-1 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-mono font-extrabold uppercase">
              {report.status}
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            Audited against 6 release gate verification categories • Build duration: {report.buildDurationMs}ms
          </p>
        </div>

        <div className="w-full md:w-80 space-y-2 z-10">
          <div className="flex justify-between text-xs font-mono text-neutral-400">
            <span>Deployment Release Gate</span>
            <span className="text-spotify-green font-bold">RELEASE READY</span>
          </div>
          <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800 p-0.5">
            <div className="h-full bg-spotify-green rounded-full w-full shadow-sm" />
          </div>
        </div>
      </div>

      {/* 6 Release Gate Verification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {report.gates.map((g) => (
          <div key={g.category} className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>{g.category}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                {g.status}
              </span>
            </div>
            <div className="text-xl font-black text-white">{g.score}</div>
            <div className="text-[10px] text-neutral-400">{g.metric}</div>
          </div>
        ))}
      </div>

      {/* Health Probes Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-neutral-400 tracking-wider">
          Production Health Probes Specification
        </h2>
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] text-neutral-400 uppercase tracking-wider">
                  <th className="p-4">Endpoint</th>
                  <th className="p-4">Probe Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Expected Production JSON Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {report.probes.map((p) => (
                  <tr key={p.endpoint} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-4 font-bold text-spotify-green whitespace-nowrap">{p.endpoint}</td>
                    <td className="p-4 text-white whitespace-nowrap">{p.type}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-300 font-mono text-[11px]">{p.expectedResponse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Environment Variable Matrix */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-neutral-400 tracking-wider">
          Production Environment Variable Matrix
        </h2>
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] text-neutral-400 uppercase tracking-wider">
                  <th className="p-4">Variable Name</th>
                  <th className="p-4">Scope</th>
                  <th className="p-4">Audit Status</th>
                  <th className="p-4">Configured Value Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {report.envVars.map((env) => (
                  <tr key={env.name} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-4 font-bold text-spotify-green whitespace-nowrap">{env.name}</td>
                    <td className="p-4 text-white whitespace-nowrap">{env.scope}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        {env.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-300 font-mono">{env.valuePreview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
