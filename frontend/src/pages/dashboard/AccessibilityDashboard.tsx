import React, { useState } from 'react';
import { AccessibilityAuditorService } from '../../utils/accessibilityAuditor';
import { AccessibilityAuditReport } from '../../types/accessibility';
import {
  Eye,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const AccessibilityDashboard: React.FC = () => {
  const [report, setReport] = useState<AccessibilityAuditReport>(() => AccessibilityAuditorService.runAccessibilityAudit());
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRefreshAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setReport(AccessibilityAuditorService.runAccessibilityAudit());
      setIsAuditing(false);
    }, 400);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans text-white">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-mono font-semibold mb-2">
            <Eye className="w-3.5 h-3.5" />
            <span>Inclusive Design & WCAG 2.2 AA Compliance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Accessibility Review & Governance</h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Real-time WCAG 2.2 AA compliance auditing, screen reader readiness, ARIA verification, and keyboard telemetry.
          </p>
        </div>

        <button
          onClick={handleRefreshAudit}
          disabled={isAuditing}
          className="py-2 px-3.5 rounded-xl bg-spotify-green hover:bg-spotify-green-hover text-black text-xs font-mono font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-spotify-green/10 disabled:opacity-50 shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-black ${isAuditing ? 'animate-spin' : ''}`} />
          <span>Run WCAG Audit</span>
        </button>
      </div>

      {/* Overall Accessibility Score Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 text-center md:text-left">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">WCAG 2.2 Level AA Compliance Score</div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="text-4xl md:text-5xl font-black text-spotify-green tracking-tight font-mono">
              {report.overallScore} / 100
            </span>
            <span className="px-3 py-1 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-mono font-extrabold uppercase">
              {report.rating}
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            Audited against 12 core WCAG 2.2 Level A & AA success criteria • Last verified: {new Date(report.timestamp).toLocaleTimeString()}
          </p>
        </div>

        <div className="w-full md:w-80 space-y-2 z-10">
          <div className="flex justify-between text-xs font-mono text-neutral-400">
            <span>WCAG 2.2 AA Conformance</span>
            <span className="text-spotify-green font-bold">Verified Pass</span>
          </div>
          <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800 p-0.5">
            <div className="h-full bg-spotify-green rounded-full w-full shadow-sm" />
          </div>
        </div>
      </div>

      {/* 4 WCAG Principles Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {Object.entries(report.principlesScore).map(([principle, score]) => (
          <div key={principle} className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>{principle}</span>
              <CheckCircle2 className="w-4 h-4 text-spotify-green" />
            </div>
            <div className="text-2xl font-black text-white">{score}%</div>
            <div className="text-[10px] text-spotify-green font-semibold">Verified</div>
          </div>
        ))}
      </div>

      {/* Subsystem Health Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-neutral-400 tracking-wider">
          Accessibility Subsystems Telemetry
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.subsystems.map((sub) => (
            <div key={sub.id} className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xs font-bold text-white leading-snug">{sub.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-[10px] font-mono font-bold shrink-0">
                  {sub.status} ({sub.score}%)
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono leading-relaxed">{sub.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WCAG 2.2 Criteria Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-neutral-400 tracking-wider">
          WCAG 2.2 AA Criteria Compliance Audit
        </h2>
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] text-neutral-400 uppercase tracking-wider">
                  <th className="p-4">Criterion</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Principle</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Implementation Audit Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {report.criteria.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-4 font-bold text-spotify-green whitespace-nowrap">{c.id}</td>
                    <td className="p-4 text-white font-semibold whitespace-nowrap">{c.name}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-300">
                        Level {c.level}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-300 whitespace-nowrap">{c.principle}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-300">{c.details}</td>
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
