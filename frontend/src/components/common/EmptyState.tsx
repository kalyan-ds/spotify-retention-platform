import React from 'react';
import { Database, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Available',
  description = 'There are currently no records to display for the selected view.',
  actionText,
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800 my-4">
      <div className="p-4 rounded-2xl bg-neutral-800/80 text-spotify-green mb-4">
        {icon || <Database className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-neutral-400 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-spotify-green text-neutral-950 font-bold rounded-full text-xs hover:bg-spotify-green-hover transition-all focus:outline-none focus:ring-2 focus:ring-spotify-green"
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};
