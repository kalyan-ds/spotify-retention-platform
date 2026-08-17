import React from 'react';
import { Bell, X, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

export const NotificationsPanel: React.FC = () => {
  const { notificationsOpen, setNotificationsOpen } = useDashboardStore();

  if (!notificationsOpen) return null;

  const mockNotifications = [
    {
      id: '1',
      title: 'Critical Churn Alert',
      message: 'User #42 churn probability crossed 75% threshold.',
      type: 'warning',
      time: '10m ago'
    },
    {
      id: '2',
      title: 'Champion Model Promoted',
      message: 'Premium Churn Prediction v1.4.2 promoted to Champion.',
      type: 'success',
      time: '1h ago'
    },
    {
      id: '3',
      title: 'Feature Drift Evaluated',
      message: 'Population Stability Index (PSI) computed for 25 features.',
      type: 'info',
      time: '3h ago'
    }
  ];

  return (
    <div className="absolute right-0 top-12 w-80 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-spotify-green" />
          <h3 className="text-sm font-semibold text-white">System Notifications</h3>
        </div>
        <button
          onClick={() => setNotificationsOpen(false)}
          className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-neutral-800/50">
        {mockNotifications.map((n) => (
          <div key={n.id} className="p-3.5 hover:bg-neutral-800/40 transition-colors flex items-start gap-3">
            {n.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : n.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-spotify-green shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-semibold text-white">{n.title}</p>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{n.message}</p>
              <span className="text-[10px] font-mono text-neutral-500 mt-1.5 block">{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
