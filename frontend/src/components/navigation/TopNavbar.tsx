import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { ThemeToggle } from './ThemeToggle';
import { UserProfileMenu } from './UserProfileMenu';
import { NotificationsPanel } from './NotificationsPanel';
import { QuickSearch } from './QuickSearch';
import { useDashboardStore } from '../../store/dashboardStore';
import { useAIStore } from '../../store/aiStore';

export const TopNavbar: React.FC = () => {
  const { setMobileSidebarOpen, setQuickSearchOpen, notificationsOpen, setNotificationsOpen } = useDashboardStore();
  const { healthStatus } = useAIStore();

  return (
    <header className="sticky top-0 z-30 h-16 bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800/80 px-4 md:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-3">
        {/* Global Search Trigger */}
        <button
          onClick={() => setQuickSearchOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-600 rounded-full text-xs text-neutral-400 hover:text-white transition-all w-48 lg:w-64"
        >
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <span className="truncate">Quick search...</span>
          <kbd className="ml-auto hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-neutral-700/50 text-neutral-400 rounded">
            ⌘K
          </kbd>
        </button>

        {/* API Health & Environment Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-spotify-green/10 border border-spotify-green/20 text-spotify-green text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-spotify-green animate-pulse" />
          <span className="font-semibold">AI ENGINE:</span>
          <span>{healthStatus}</span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-spotify-green"
            aria-label="Open notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-spotify-green ring-2 ring-neutral-900" />
          </button>
          <NotificationsPanel />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        <div className="h-5 w-px bg-neutral-800 hidden sm:block" />

        {/* User Menu */}
        <UserProfileMenu />
      </div>

      {/* Global Quick Search Modal */}
      <QuickSearch />
    </header>
  );
};
