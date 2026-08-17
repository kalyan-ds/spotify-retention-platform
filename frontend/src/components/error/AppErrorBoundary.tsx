import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../shared/ErrorFallback';
import { logger } from '../../utils/logger';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: any, info: React.ErrorInfo) => {
    logger.error('Global Unhandled Application Exception caught by AppErrorBoundary', error, {
      componentStack: info.componentStack
    });
  };

  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorFallback
          error={error instanceof Error ? error : new Error(String(error))}
          resetErrorBoundary={resetErrorBoundary}
          title="Spotify Platform Fatal Error"
          subtitle="A critical error occurred. Our engineering team has been notified via telemetry."
        />
      )}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};
