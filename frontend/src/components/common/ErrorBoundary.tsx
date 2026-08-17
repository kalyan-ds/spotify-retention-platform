import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-neutral-900/40 rounded-2xl border border-rose-500/20 my-8">
          <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 mb-4 border border-rose-500/20">
            <AlertOctagon className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
            {this.state.error?.message || 'An unexpected application exception occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-spotify-green hover:bg-spotify-green-hover text-neutral-950 font-bold rounded-full text-sm transition-all focus:outline-none focus:ring-2 focus:ring-spotify-green"
          >
            <RotateCcw className="w-4 h-4" />
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
