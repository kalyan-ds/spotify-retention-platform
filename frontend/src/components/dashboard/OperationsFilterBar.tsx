import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

export const OperationsFilterBar: React.FC = React.memo(() => {
  return (
    <div className="p-4 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full md:w-72">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search Alert ID, Event or Service..."
          className="w-full pl-9 pr-3 py-2 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-spotify-green transition-all"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
          <Filter className="w-3.5 h-3.5 text-spotify-green" />
          <span>Filters:</span>
        </div>

        <select className="px-3 py-2 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-spotify-green">
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Warning</option>
          <option>Notice</option>
          <option>Information</option>
        </select>

        <select className="px-3 py-2 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-spotify-green">
          <option>All Statuses</option>
          <option>Open</option>
          <option>Acknowledged</option>
          <option>Investigating</option>
          <option>Resolved</option>
        </select>

        <select className="px-3 py-2 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-spotify-green">
          <option>All Services</option>
          <option>Inference Engine</option>
          <option>Feature Store</option>
          <option>Cache Layer</option>
          <option>Prediction API</option>
          <option>MySQL Database</option>
          <option>Gateway Service</option>
        </select>

        <select className="px-3 py-2 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-spotify-green">
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Year to Date</option>
        </select>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
});

OperationsFilterBar.displayName = 'OperationsFilterBar';
