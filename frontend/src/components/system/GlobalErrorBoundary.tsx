import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Typography } from '@/components/typography/Typography';
import { Button } from '@/components/buttons/Button';
import { ROUTES } from '@/utils/routes';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-8 text-center">
          <div className="h-24 w-24 bg-destructive/10 rounded-full flex items-center justify-center mb-8">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <Typography variant="pageTitle" className="mb-4 text-foreground">Critical System Error</Typography>
          <Typography variant="body" className="text-muted-foreground max-w-lg mb-8">
            The application encountered a critical error and cannot recover automatically.
            Please return to the dashboard or refresh the application.
          </Typography>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Refresh Application
            </Button>
            <Button
              variant="primary"
              onClick={() => window.location.assign(ROUTES.home)}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
