import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { DashboardError } from '../shared/DashboardError';
import { logger } from '../../utils/logger';

interface NetworkErrorBoundaryProps {
  children: React.ReactNode;
}

export const NetworkErrorBoundary: React.FC<NetworkErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: any) => {
    logger.error('Network Boundary Exception caught', error);
  };

  return (
    <ErrorBoundary
      FallbackComponent={({ resetErrorBoundary }) => (
        <DashboardError
          title="Network Connection Failed"
          message="Unable to communicate with the retention backend REST services."
          onRetry={resetErrorBoundary}
        />
      )}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};
