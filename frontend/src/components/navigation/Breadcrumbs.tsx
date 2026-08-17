import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';

export const Breadcrumbs: React.FC = () => {
  const { breadcrumbs } = useNavigation();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-neutral-400">
      <Link
        to="/"
        className="hover:text-spotify-green transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-spotify-green rounded"
      >
        <Home className="w-4 h-4" />
      </Link>
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0" />
          {item.isCurrent || !item.path ? (
            <span className="text-white font-medium truncate max-w-[200px]" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="hover:text-spotify-green transition-colors truncate max-w-[200px] focus:outline-none focus:ring-2 focus:ring-spotify-green rounded"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
