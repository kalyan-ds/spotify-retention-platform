import React from 'react';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';
import { QueryProvider } from './QueryProvider';
import { DashboardFilterProvider } from '@/contexts/DashboardFilterContext';
import { MotionProvider } from '@/components/motion';
import { AppErrorBoundary } from '../components/error/AppErrorBoundary';
import { OfflineBanner } from '../components/shared/OfflineBanner';

/**
 * AppProvider orchestrates all enterprise global providers.
 * QueryProvider wraps AuthProvider to ensure useQueryClient() is available inside Auth context.
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <ThemeProvider>
            <DashboardFilterProvider>
              <MotionProvider>
                <OfflineBanner />
                {children}
              </MotionProvider>
            </DashboardFilterProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryProvider>
    </AppErrorBoundary>
  );
}
