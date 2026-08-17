import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../../store/dashboardStore';
import { NAVIGATION_CONFIG } from '../../config/navigation';

export const QuickSearch: React.FC = () => {
  const { quickSearchOpen, setQuickSearchOpen } = useDashboardStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickSearchOpen(!quickSearchOpen);
      }
      if (e.key === 'Escape' && quickSearchOpen) {
        setQuickSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickSearchOpen, setQuickSearchOpen]);

  if (!quickSearchOpen) return null;

  const allItems = NAVIGATION_CONFIG.flatMap((sec) => sec.items);
  const filtered = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.tooltip && item.tooltip.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search features, predictions, models, or metrics... (Press ESC to close)"
            className="w-full bg-transparent px-3 py-4 text-white text-sm focus:outline-none placeholder-neutral-500"
            autoFocus
          />
          <button
            onClick={() => setQuickSearchOpen(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm">No matching navigation targets found.</div>
          ) : (
            filtered.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setQuickSearchOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-800/80 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neutral-800 group-hover:bg-spotify-green/20 group-hover:text-spotify-green transition-colors text-neutral-400">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-spotify-green transition-colors">
                        {item.title}
                      </p>
                      {item.tooltip && <p className="text-xs text-neutral-400">{item.tooltip}</p>}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-spotify-green group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
