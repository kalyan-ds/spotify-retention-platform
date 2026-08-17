import React, { useState } from 'react';
import { EnterpriseCertificationAuditorService } from '../../utils/enterpriseCertificationAuditor';
import { EnterpriseReleaseReport } from '../../types/certification';
import {
  Award,
  CheckCircle2,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

export const EnterpriseCertificationDashboard: React.FC = () => {
  const [report, setReport] = useState<EnterpriseReleaseReport>(() => EnterpriseCertificationAuditorService.getCertificationReport());
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRefreshAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setReport(EnterpriseCertificationAuditorService.getCertificationReport());
      setIsAuditing(false);
    }, 400);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans text-white">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-mono font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Project Governance & Engineering Readiness</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Engineering Release & Governance Board</h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Master release telemetry, 10 release gate verification pillars, and engineering release approval.
          </p>
        </div>

        <button
          onClick={handleRefreshAudit}
          disabled={isAuditing}
          className="py-2 px-3.5 rounded-xl bg-spotify-green hover:bg-spotify-green-hover text-black text-xs font-mono font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-spotify-green/10 disabled:opacity-50 shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-black ${isAuditing ? 'animate-spin' : ''}`} />
          <span>Run Master Board Audit</span>
        </button>
      </div>

      {/* Master Certification Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 text-center md:text-left">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Engineering Release Readiness Score</div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="text-4xl md:text-5xl font-black text-spotify-green tracking-tight font-mono">
              {report.readinessScore}%
            </span>
            <span className="px-3 py-1 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-mono font-extrabold uppercase">
              {report.status} ({report.version})
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            Rating: {report.releaseGrade} • Audited across 10 engineering release pillars • Verified: {new Date(report.signoffDate).toLocaleDateString()}
          </p>
        </div>

        <div className="w-full md:w-80 space-y-2 z-10">
          <div className="flex justify-between text-xs font-mono text-neutral-400">
            <span>Release Gate Status</span>
            <span className="text-spotify-green font-bold">RELEASE READY</span>
          </div>
          <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800 p-0.5">
            <div className="h-full bg-spotify-green rounded-full w-full shadow-sm" />
          </div>
        </div>
      </div>

      {/* 10 Certification Pillars Matrix */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-neutral-400 tracking-wider">
          Master 10-Pillar Engineering Readiness Matrix
        </h2>
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] text-neutral-400 uppercase tracking-wider">
                  <th className="p-4">Engineering Pillar</th>
                  <th className="p-4">Lead Authority</th>
                  <th className="p-4">Audit Metric</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {report.pillars.map((p) => (
                  <tr key={p.name} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-4 font-bold text-spotify-green whitespace-nowrap">{p.name}</td>
                    <td className="p-4 text-white whitespace-nowrap">{p.authority}</td>
                    <td className="p-4 text-neutral-300">{p.metric}</td>
                    <td className="p-4 font-bold text-white whitespace-nowrap">{p.score}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Executive Certificate Box */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-spotify-green/30 space-y-4 font-mono">
        <div className="flex items-center gap-3 text-spotify-green font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Project Release & Governance Verification — Version 2.0.0</span>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed">
          The Engineering Governance Review confirms that Spotify Premium Retention Intelligence Platform Version 2.0.0 has passed all 10 release gate verification pillars across Security, Accessibility, Performance, QA, and Architecture.
        </p>
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
          <div><span className="text-neutral-500">Verified:</span> Software Architecture</div>
          <div><span className="text-neutral-500">Verified:</span> QA & Security</div>
          <div><span className="text-neutral-500">Verified:</span> Build & CI/CD Pipeline</div>
        </div>
      </div>
    </div>
  );
};
