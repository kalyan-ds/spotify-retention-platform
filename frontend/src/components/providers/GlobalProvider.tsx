import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './ThemeProvider';

// Centralized Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface GlobalProviderProps {
  children: React.ReactNode;
}

/**
 * GlobalProvider
 * Wraps the application in all necessary global providers:
 * - ThemeProvider
 * - QueryClientProvider (TanStack Query)
 * - MotionConfig (Framer Motion)
 */
export function GlobalProvider({ children }: GlobalProviderProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <MotionConfig
          transition={{
            type: 'tween',
            ease: [0.4, 0, 0.2, 1], // default easing from our tokens
            duration: 0.3,          // default duration
          }}
        >
          {children}
        </MotionConfig>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
