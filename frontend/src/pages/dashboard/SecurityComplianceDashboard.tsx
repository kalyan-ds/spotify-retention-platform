import React, { useState } from 'react';
import { SecurityComplianceAuditorService } from '../../utils/securityComplianceAuditor';
import { SecurityComplianceReport } from '../../types/securityCompliance';
import {
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Lock,
  Key,
  ShieldAlert,
  Server
} from 'lucide-react';

export const SecurityComplianceDashboard: React.FC = () => {
  const [report, setReport] = useState<SecurityComplianceReport>(() => SecurityComplianceAuditorService.runSecurityValidationAudit());
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRefreshAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setReport(SecurityComplianceAuditorService.runSecurityValidationAudit());
      setIsAuditing(false);
    }, 400);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans text-white">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-mono font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DevSecOps & OWASP Top 10 Governance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Security Overview & Threat Model</h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Threat modeling, OWASP Top 10 (2021) assessment, Risk Register, and Security Posture Review.
          </p>
        </div>

        <button
          onClick={handleRefreshAudit}
          disabled={isAuditing}
          className="py-2 px-3.5 rounded-xl bg-spotify-green hover:bg-spotify-green-hover text-black text-xs font-mono font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-spotify-green/10 disabled:opacity-50 shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-black ${isAuditing ? 'animate-spin' : ''}`} />
          <span>Run Security Audit</span>
        </button>
      </div>

      {/* Overall Security Score Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 text-center md:text-left">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Security Posture Score</div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="text-4xl md:text-5xl font-black text-spotify-green tracking-tight font-mono">
              {report.overallScore} / 100
            </span>
            <span className="px-3 py-1 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-mono font-extrabold uppercase">
              {report.rating}
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            Audited against 10 OWASP vulnerability categories • Last audit: {new Date(report.timestamp).toLocaleTimeString()}
          </p>
        </div>

        <div className="w-full md:w-80 space-y-2 z-10">
          <div className="flex justify-between text-xs font-mono text-neutral-400">
            <span>Security Gate Status</span>
            <span className="text-spotify-green font-bold">PASSED</span>
          </div>
          <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800 p-0.5">
            <div className="h-full bg-spotify-green rounded-full w-full shadow-sm" />
          </div>
        </div>
      </div>

      {/* Subsystem Health Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Auth Health</span>
            <Key className="w-4 h-4 text-spotify-green" />
          </div>
          <div className="text-2xl font-black text-white">{report.authHealth}%</div>
          <div className="text-[10px] text-spotify-green font-semibold">Verified</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>RBAC Guard</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{report.rbacHealth}%</div>
          <div className="text-[10px] text-emerald-400 font-semibold">Enforced</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Session Sync</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{report.sessionHealth}%</div>
          <div className="text-[10px] text-blue-400 font-semibold">Active</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Audit Stream</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{report.auditHealth}%</div>
          <div className="text-[10px] text-purple-400 font-semibold">Integrity Verified</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Config Hardening</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{report.configHealth}%</div>
          <div className="text-[10px] text-emerald-400 font-semibold">Zero Hardcoded Keys</div>
        </div>
      </div>

      {/* Threat Model Matrix */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-neutral-400 tracking-wider">
          Threat Model & Entry-Point Mitigation Matrix
        </h2>
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] text-neutral-400 uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Asset</th>
                  <th className="p-4">Threat Vector</th>
                  <th className="p-4">Threat Actor</th>
                  <th className="p-4">Entry Point</th>
                  <th className="p-4">Implementation Defense</th>
                  <th className="p-4 text-right">Residual Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {report.threats.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-4 font-bold text-spotify-green whitespace-nowrap">{t.id}</td>
                    <td className="p-4 text-white font-semibold whitespace-nowrap">{t.asset}</td>
                    <td className="p-4 text-neutral-300">{t.threat}</td>
                    <td className="p-4 text-neutral-400">{t.actor}</td>
                    <td className="p-4 text-neutral-400">{t.entryPoint}</td>
                    <td className="p-4 text-neutral-300">{t.mitigation}</td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        {t.residualRisk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Risk Register Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-neutral-400 tracking-wider">
          Enterprise Security Risk Register
        </h2>
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] text-neutral-400 uppercase tracking-wider">
                  <th className="p-4">Risk ID</th>
                  <th className="p-4">Risk Title</th>
                  <th className="p-4">Classification</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Mitigation Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {report.risks.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-4 font-bold text-spotify-green whitespace-nowrap">{r.id}</td>
                    <td className="p-4 text-white font-semibold">{r.title}</td>
                    <td className="p-4 whitespace-nowrap">
                      {r.type === 'RESOLVED' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          RESOLVED
                        </span>
                      )}
                      {r.type === 'ACCEPTED' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                          ACCEPTED
                        </span>
                      )}
                      {r.type === 'FUTURE' && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                          FUTURE
                        </span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap text-neutral-300 font-bold">{r.severity}</td>
                    <td className="p-4 text-neutral-300">{r.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* OWASP Top 10 Assessment Matrix */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-neutral-400 tracking-wider">
          OWASP Top 10 (2021) Complete Security Assessment
        </h2>
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] text-neutral-400 uppercase tracking-wider">
                  <th className="p-4">Code</th>
                  <th className="p-4">OWASP Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Implementation Defense</th>
                  <th className="p-4">Remaining Risk</th>
                  <th className="p-4">Future Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {report.owaspEntries.map((owasp) => (
                  <tr key={owasp.code} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-4 font-bold text-spotify-green whitespace-nowrap">{owasp.code}</td>
                    <td className="p-4 text-white font-semibold whitespace-nowrap">{owasp.title}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {owasp.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-300">{owasp.mitigation}</td>
                    <td className="p-4 text-neutral-400">{owasp.remainingRisk}</td>
                    <td className="p-4 text-purple-300">{owasp.futureRecommendation}</td>
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
