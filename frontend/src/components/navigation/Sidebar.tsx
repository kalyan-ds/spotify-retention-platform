import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { NAVIGATION_CONFIG } from '../../config/navigation';
import { useDashboardStore } from '../../store/dashboardStore';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useDashboardStore();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-neutral-950/95 backdrop-blur-2xl border-r border-neutral-800/80">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800/80 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-spotify-green to-emerald-400 flex items-center justify-center text-neutral-950 font-bold shadow-lg shadow-spotify-green/20 shrink-0">
            S
          </div>
          {!sidebarCollapsed && (
            <div className="truncate">
              <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                Spotify AI <Sparkles className="w-3.5 h-3.5 text-spotify-green" />
              </h1>
              <p className="text-[10px] text-neutral-400 font-mono">Retention Intelligence</p>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {NAVIGATION_CONFIG.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!sidebarCollapsed && section.title && (
              <h2 className="px-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                {section.title}
              </h2>
            )}
            {section.items.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  title={sidebarCollapsed ? item.tooltip || item.title : undefined}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                      isActive
                        ? 'bg-spotify-green/15 text-spotify-green font-semibold border border-spotify-green/20'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                    )
                  }
                >
                  <IconComponent className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                  {!sidebarCollapsed && (
                    <span className="truncate flex-1">{item.title}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={cn(
                        'px-2 py-0.5 text-[10px] font-mono rounded-full font-bold',
                        item.badgeVariant === 'success'
                          ? 'bg-spotify-green/20 text-spotify-green border border-spotify-green/30'
                          : item.badgeVariant === 'warning'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-neutral-800 text-neutral-300'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="hidden lg:flex items-center justify-between p-3 border-t border-neutral-800/80 shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:block fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 bottom-0 left-0 w-72 z-50 transition-transform duration-300 ease-in-out',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
