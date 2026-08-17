import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldAlert, LogOut, RefreshCw } from 'lucide-react';
import { sessionManager } from '../../utils/sessionManager';

interface SessionWarningModalProps {
  onStaySignedIn: () => void;
  onLogout: () => void;
}

export const SessionWarningModal: React.FC<SessionWarningModalProps> = ({
  onStaySignedIn,
  onLogout
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    const unsubWarningStarted = sessionManager.on('WARNING_STARTED', (data: any) => {
      setIsVisible(true);
      setCountdown(data?.remainingSeconds || 120);
    });

    const unsubWarningCancelled = sessionManager.on('WARNING_CANCELLED', () => {
      setIsVisible(false);
    });

    const unsubExpired = sessionManager.on('SESSION_EXPIRED', () => {
      setIsVisible(false);
    });

    return () => {
      unsubWarningStarted();
      unsubWarningCancelled();
      unsubExpired();
    };
  }, []);

  // Countdown timer tick
  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onLogout]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-warning-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md p-6 rounded-3xl bg-neutral-900 border border-amber-500/30 shadow-2xl space-y-6 text-center"
        >
          {/* Header Icon */}
          <div className="inline-flex p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 id="session-warning-title" className="text-xl font-bold text-white tracking-tight">
              Session Expiration Warning
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              You have been idle for a while. For cybersecurity governance, your enterprise session will automatically expire.
            </p>
          </div>

          {/* Live Countdown Display */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            <div className="text-left font-mono">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Session Expires In</div>
              <div className="text-2xl font-black text-amber-400 tracking-wider">
                {formatCountdown(countdown)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onLogout}
              type="button"
              className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-neutral-700/50"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Now</span>
            </button>

            <button
              onClick={onStaySignedIn}
              type="button"
              className="py-2.5 px-4 rounded-xl bg-spotify-green hover:bg-spotify-green-hover text-black font-extrabold text-xs transition-all shadow-lg shadow-spotify-green/10 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Stay Signed In</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
