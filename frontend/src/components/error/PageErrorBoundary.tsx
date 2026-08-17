import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../shared/ErrorFallback';
import { logger } from '../../utils/logger';

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  pageName?: string;
}

export const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({ children, pageName = 'Page' }) => {
  const handleError = (error: any, info: React.ErrorInfo) => {
    logger.error(`Page Level Exception caught on [${pageName}]`, error, {
      componentStack: info.componentStack
    });
  };

  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorFallback
          error={error instanceof Error ? error : new Error(String(error))}
          resetErrorBoundary={resetErrorBoundary}
          title={`${pageName} Rendering Exception`}
          subtitle="Failed to render page components. Please retry or navigate to main dashboard."
        />
      )}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};
