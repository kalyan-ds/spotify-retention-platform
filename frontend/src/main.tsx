import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AppProvider } from './providers/AppProvider';
import { GlobalErrorBoundary } from './components/system/GlobalErrorBoundary';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </GlobalErrorBoundary>
  </StrictMode>,
);
