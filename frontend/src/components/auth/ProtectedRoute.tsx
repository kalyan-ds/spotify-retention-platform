import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { UserRole } from '../../types/auth';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { DashboardLoading } from '../shared/DashboardLoading';
import { auditLogger } from '../../utils/auditLogger';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const location = useLocation();

  const isDenied = allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles);

  useEffect(() => {
    if (isAuthenticated && user && isDenied) {
      auditLogger.logRbac('PERMISSION_DENIED_403', user.email, user.role, 'DENIED', {
        path: location.pathname,
        allowedRoles,
        userRole: user.role
      });
    }
  }, [isAuthenticated, user, isDenied, location.pathname, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <DashboardLoading cardsCount={2} height="h-28" className="max-w-xl w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectPath}`} state={{ from: location }} replace />;
  }

  if (isDenied) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-900/90 border border-rose-500/20 backdrop-blur-2xl shadow-2xl text-center space-y-6 animate-fade-in">
          <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">403 - Access Forbidden</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Your account <strong className="text-neutral-200">{user?.email}</strong> ({user?.role} Role) does not have authorization to view this module.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-400 text-left space-y-1">
            <div><span className="text-neutral-500">Required Roles:</span> <span className="text-spotify-green font-semibold">{allowedRoles.join(', ')}</span></div>
            <div><span className="text-neutral-500">Your Role:</span> <span className="text-rose-400 font-semibold">{user?.role}</span></div>
          </div>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-all focus:outline-none focus:ring-2 focus:ring-spotify-green/40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Previous Page</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
