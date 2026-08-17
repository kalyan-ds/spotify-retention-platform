import React, { useState } from 'react';
import { SecurityHardeningService } from '../../utils/securityHardening';
import { SecurityHealthReport } from '../../types/security';
import {
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Monitor,
  Cpu
} from 'lucide-react';

export const SecurityHealthDashboard: React.FC = () => {
  const [report, setReport] = useState<SecurityHealthReport>(() => SecurityHardeningService.runSecurityHealthAudit());
  const [copiedCsp, setCopiedCsp] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  const device = SecurityHardeningService.getTrustedDeviceFingerprint();
  const owaspItems = SecurityHardeningService.getOWASPChecklist();

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setReport(SecurityHardeningService.runSecurityHealthAudit());
      setIsAuditing(false);
    }, 400);
  };

  const handleCopyCsp = () => {
    const csp = SecurityHardeningService.getCSPDirectives();
    navigator.clipboard.writeText(csp);
    setCopiedCsp(true);
    setTimeout(() => setCopiedCsp(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans text-white">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-mono font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DevSecOps & Platform Security Hardening</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Security Health & Governance</h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Real-time security auditing, OWASP Top 10 compliance, CSP headers, and trusted device telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyCsp}
            className="py-2 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-mono font-bold transition-all flex items-center gap-2 text-neutral-200"
          >
            {copiedCsp ? <Check className="w-3.5 h-3.5 text-spotify-green" /> : <Copy className="w-3.5 h-3.5 text-spotify-green" />}
            <span>{copiedCsp ? 'CSP Copied!' : 'Copy CSP Directives'}</span>
          </button>
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="py-2 px-3.5 rounded-xl bg-spotify-green hover:bg-spotify-green-hover text-black text-xs font-mono font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-spotify-green/10 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-black ${isAuditing ? 'animate-spin' : ''}`} />
            <span>Run Security Audit</span>
          </button>
        </div>
      </div>

      {/* Overall Security Score Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 text-center md:text-left">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Overall Platform Security Score</div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="text-4xl md:text-5xl font-black text-spotify-green tracking-tight font-mono">
              {report.overallScore}%
            </span>
            <span className="px-3 py-1 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-mono font-extrabold uppercase">
              {report.rating}
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            Evaluated against 7 critical security subsystems • Last audit: {new Date(report.timestamp).toLocaleTimeString()}
          </p>
        </div>

        {/* Visual Score Gauge Bar */}
        <div className="w-full md:w-80 space-y-2 z-10">
          <div className="flex justify-between text-xs font-mono text-neutral-400">
            <span>Hardening Compliance</span>
            <span className="text-white font-bold">{report.overallScore} / 100</span>
          </div>
          <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800 p-0.5">
            <div
              style={{ width: `${report.overallScore}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-spotify-green rounded-full transition-all duration-500 shadow-sm"
            />
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-spotify-green/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Subsystem Health Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase text-neutral-400 tracking-wider">
          Security Subsystems Telemetry
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{item.subsystem}</div>
                  <h3 className="text-xs font-bold text-white leading-snug">{item.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold shrink-0">
                  {item.status} ({item.score}%)
                </span>
              </div>

              <p className="text-[11px] text-neutral-400 font-mono leading-relaxed">{item.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* OWASP Top 10 Compliance Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold uppercase text-neutral-400 tracking-wider">
            OWASP Top 10 (2021) Compliance Matrix
          </h2>
          <span className="text-xs font-mono text-spotify-green">100% Mitigated</span>
        </div>

        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] text-neutral-400 uppercase tracking-wider">
                  <th className="p-4">OWASP Code</th>
                  <th className="p-4">Vulnerability Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Implementation Defense</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {owaspItems.map((owasp) => (
                  <tr key={owasp.code} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-4 font-bold text-spotify-green whitespace-nowrap">{owasp.code}</td>
                    <td className="p-4 text-white font-semibold whitespace-nowrap">{owasp.title}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {owasp.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-300">{owasp.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trusted Device & Future Readiness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Telemetry Card */}
        <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-spotify-green" />
            <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              Trusted Device Fingerprint
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
              <div className="text-[10px] text-neutral-500">Device ID Hash</div>
              <div className="text-spotify-green font-bold text-sm tracking-wider">{device.deviceId}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-neutral-500 text-[10px]">Browser</div>
                <div className="text-neutral-200 font-semibold">{device.browser}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-neutral-500 text-[10px]">Operating System</div>
                <div className="text-neutral-200 font-semibold truncate">{device.os}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Future IAM Architecture Readiness */}
        <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              Future IAM Extensions (Phase 2 Ready)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {[
              { title: 'OAuth 2.0 / OIDC SSO', status: 'Architecture Ready' },
              { title: 'Multi-Factor Auth (MFA)', status: 'Foundation Ready' },
              { title: 'Biometric WebAuthn', status: 'Foundation Ready' },
              { title: 'FIDO2 Security Keys', status: 'Foundation Ready' }
            ].map((ext) => (
              <div key={ext.title} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="text-neutral-200 font-bold text-[11px]">{ext.title}</div>
                <div className="text-[10px] text-purple-400 font-semibold">{ext.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
