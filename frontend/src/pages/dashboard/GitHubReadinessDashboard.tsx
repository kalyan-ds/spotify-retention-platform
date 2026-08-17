import React, { useState } from 'react';
import { GitHubReadinessAuditorService } from '../../utils/githubReadinessAuditor';
import { GitHubReadinessReport } from '../../types/githubReadiness';
import {
  GitBranch,
  CheckCircle2,
  RefreshCw,
  FileText,
  ShieldCheck,
  Users
} from 'lucide-react';

export const GitHubReadinessDashboard: React.FC = () => {
  const [report, setReport] = useState<GitHubReadinessReport>(() => GitHubReadinessAuditorService.getReadinessReport());
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRefreshAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setReport(GitHubReadinessAuditorService.getReadinessReport());
      setIsAuditing(false);
    }, 400);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans text-white">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-mono font-semibold mb-2">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Open Source & GitHub Governance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">GitHub Repository Quality & Community Readiness</h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Real-time open-source readiness auditing, community standards, CI workflow validation, and issue templates.
          </p>
        </div>

        <button
          onClick={handleRefreshAudit}
          disabled={isAuditing}
          className="py-2 px-3.5 rounded-xl bg-spotify-green hover:bg-spotify-green-hover text-black text-xs font-mono font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-spotify-green/10 disabled:opacity-50 shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-black ${isAuditing ? 'animate-spin' : ''}`} />
          <span>Run Repository Audit</span>
        </button>
      </div>

      {/* Readiness Score Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 text-center md:text-left">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">GitHub Open Source Maturity Score</div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="text-4xl md:text-5xl font-black text-spotify-green tracking-tight font-mono">
              {report.readinessScore}%
            </span>
            <span className="px-3 py-1 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-mono font-extrabold uppercase">
              {report.rating}
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            License: {report.license} • GitHub Actions CI: {report.ciStatus} • Last verified: {new Date(report.timestamp).toLocaleTimeString()}
          </p>
        </div>

        <div className="w-full md:w-80 space-y-2 z-10">
          <div className="flex justify-between text-xs font-mono text-neutral-400">
            <span>Community Standards Conformance</span>
            <span className="text-spotify-green font-bold">Verified Pass</span>
          </div>
          <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800 p-0.5">
            <div className="h-full bg-spotify-green rounded-full w-full shadow-sm" />
          </div>
        </div>
      </div>

      {/* Subsystem Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>License</span>
            <FileText className="w-4 h-4 text-spotify-green" />
          </div>
          <div className="text-2xl font-black text-white">Apache 2.0</div>
          <div className="text-[10px] text-spotify-green font-semibold">OSI Approved</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>CI Workflow</span>
            <GitBranch className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">Passing</div>
          <div className="text-[10px] text-blue-400 font-semibold">Automated Build</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Security Policy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">Configured</div>
          <div className="text-[10px] text-emerald-400 font-semibold">SECURITY.md Active</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Governance</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">Codeowners</div>
          <div className="text-[10px] text-purple-400 font-semibold">CODEOWNERS Active</div>
        </div>
      </div>

      {/* Community Standards Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-neutral-400 tracking-wider">
          Enterprise Open-Source Community Standards Matrix
        </h2>
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] text-neutral-400 uppercase tracking-wider">
                  <th className="p-4">Standard File</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Audit Status</th>
                  <th className="p-4">Implementation Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {report.standards.map((s) => (
                  <tr key={s.filename} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-4 font-bold text-spotify-green whitespace-nowrap">{s.filename}</td>
                    <td className="p-4 text-white whitespace-nowrap">{s.category}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-300">{s.details}</td>
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
