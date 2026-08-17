import React, { useState } from 'react';
import { ShieldAlert, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { config } from '../../config/config';

interface ErrorFallbackProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
  title?: string;
  subtitle?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  title = 'Unexpected Application Error',
  subtitle = 'An isolated exception occurred while rendering this component.'
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="p-8 rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-rose-500/20 shadow-2xl text-center space-y-4 max-w-xl mx-auto my-8">
      <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-neutral-400 leading-relaxed">{subtitle}</p>
      </div>

      {resetErrorBoundary && (
        <button
          onClick={resetErrorBoundary}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-spotify-green hover:bg-spotify-green-hover text-black font-bold text-xs transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-spotify-green/50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reload Component</span>
        </button>
      )}

      {config.environment === 'development' && error && (
        <div className="pt-4 border-t border-neutral-800 text-left">
          <button
            onClick={() => setShowDetails(prev => !prev)}
            type="button"
            className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            <span>{showDetails ? 'Hide' : 'View'} Stack Trace</span>
          </button>
          {showDetails && (
            <pre className="mt-2 p-3 rounded-xl bg-neutral-950 text-[10px] font-mono text-rose-300 overflow-x-auto max-h-48 border border-neutral-800">
              {error.stack || error.message}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
