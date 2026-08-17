import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/navigation/Sidebar';
import { TopNavbar } from '../../components/navigation/TopNavbar';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { useDashboardStore } from '../../store/dashboardStore';
import { cn } from '../../utils/cn';

export const EnterpriseLayout: React.FC = () => {
  const { sidebarCollapsed } = useDashboardStore();

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col antialiased selection:bg-spotify-green selection:text-black">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container Area */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        {/* Top Navbar */}
        <TopNavbar />

        {/* Dynamic Route Content */}
        <main className="flex-1 w-full relative">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>

        {/* Enterprise Footer */}
        <footer className="py-6 px-6 border-t border-neutral-800/60 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-spotify-green" />
            <span>Spotify Premium Retention Intelligence Platform v2.0.0</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Compliance Audit</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">API Docs</a>
          </div>
        </footer>
      </div>
    </div>
  );
};
