import React, { useState } from 'react';
import { auditLogger } from '../../utils/auditLogger';
import { AuditEvent, AuditCategory, AuditSeverity } from '../../types/audit';
import {
  FileText,
  ShieldAlert,
  UserX,
  AlertTriangle,
  Search,
  Download,
  Filter,
  Code,
  CheckCircle2,
  XCircle,
  Clock,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuditDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AuditCategory | 'ALL'>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<AuditSeverity | 'ALL'>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  // Retrieve audit logs and analytics summary
  const summary = auditLogger.getAnalyticsSummary();
  const allEvents = auditLogger.getEvents({
    searchQuery,
    category: selectedCategory,
    severity: selectedSeverity
  });

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold">CRITICAL</span>;
      case 'SECURITY':
        return <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold">SECURITY</span>;
      case 'ERROR':
        return <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold">ERROR</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">WARNING</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">INFO</span>;
    }
  };

  const getResultBadge = (result: string) => {
    if (result === 'SUCCESS') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>SUCCESS</span>
        </span>
      );
    }
    if (result === 'DENIED') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 font-semibold">
          <XCircle className="w-3.5 h-3.5" />
          <span>DENIED</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-400 font-semibold">
        <XCircle className="w-3.5 h-3.5" />
        <span>FAILURE</span>
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans text-white">
      {/* Header Title & Export Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-mono font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Enterprise Audit & Compliance Suite</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Audit Logging & Telemetry</h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Real-time immutable security logs, access decisions, AI operations, and compliance event trails.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => auditLogger.exportToCSV(allEvents)}
            className="py-2 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-mono font-bold transition-all flex items-center gap-2 text-neutral-200"
          >
            <Download className="w-3.5 h-3.5 text-spotify-green" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => auditLogger.exportToJSON(allEvents)}
            className="py-2 px-3.5 rounded-xl bg-spotify-green hover:bg-spotify-green-hover text-black text-xs font-mono font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-spotify-green/10"
          >
            <Code className="w-3.5 h-3.5 text-black" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Audit Analytics KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>Total Captured Events</span>
            <FileText className="w-4 h-4 text-spotify-green" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{summary.totalLogsCount}</div>
          <div className="text-[11px] text-neutral-500 font-mono">Active buffer capacity: 500</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>Security Alerts</span>
            <ShieldAlert className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 font-mono">{summary.securityEventsCount}</div>
          <div className="text-[11px] text-purple-400/80 font-mono">Drift & anomaly detection</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>Denied Access (403)</span>
            <UserX className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{summary.accessDeniedCount}</div>
          <div className="text-[11px] text-amber-400/80 font-mono">RBAC permission violations</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>Critical Severity</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">{summary.criticalSeverityCount}</div>
          <div className="text-[11px] text-rose-400/80 font-mono">Requires DevSecOps review</div>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search action, user, correlation ID..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-spotify-green/40 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 shrink-0 pr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as any)}
            className="bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-spotify-green/40 shrink-0"
          >
            <option value="ALL">All Categories</option>
            <option value="AUTHENTICATION">Authentication</option>
            <option value="AUTHORIZATION">Authorization</option>
            <option value="AI_ENGINE">AI Engine</option>
            <option value="DASHBOARD">Dashboard</option>
            <option value="SECURITY">Security</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 shrink-0 pl-2 pr-1">
            <span>Severity:</span>
          </div>
          <select
            value={selectedSeverity}
            onChange={e => setSelectedSeverity(e.target.value as any)}
            className="bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-spotify-green/40 shrink-0"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
            <option value="SECURITY">SECURITY</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Audit Log Events Feed Table */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                <th className="p-4">Timestamp</th>
                <th className="p-4">User & Role</th>
                <th className="p-4">Category & Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">Result</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Correlation ID</th>
                <th className="p-4 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono text-xs">
              {allEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-500">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                allEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-4 text-neutral-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="text-neutral-200 font-semibold">{evt.user}</div>
                      <div className="text-[10px] text-spotify-green">{evt.role}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-bold tracking-tight">{evt.action}</div>
                      <div className="text-[10px] text-neutral-500">{evt.category}</div>
                    </td>
                    <td className="p-4 text-neutral-300 truncate max-w-[160px]">{evt.resource}</td>
                    <td className="p-4 whitespace-nowrap">{getResultBadge(evt.result)}</td>
                    <td className="p-4 whitespace-nowrap">{getSeverityBadge(evt.severity)}</td>
                    <td className="p-4 text-[10px] text-neutral-400 font-mono whitespace-nowrap">
                      <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                        {evt.correlationId}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                        title="Inspect Event Metadata"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Metadata JSON Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2 font-mono">
                  <Tag className="w-4 h-4 text-spotify-green" />
                  <span className="text-sm font-bold text-white">Event Payload: {selectedEvent.id}</span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-neutral-400 hover:text-white text-xs font-mono"
                >
                  Close [ESC]
                </button>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 overflow-x-auto max-h-96 text-xs font-mono text-emerald-400">
                <pre>{JSON.stringify(selectedEvent, null, 2)}</pre>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
