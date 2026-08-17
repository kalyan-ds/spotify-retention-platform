import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { LogOut, ShieldCheck, Settings, FileText, Lock, Zap, Eye, ShieldAlert, Rocket, GitBranch, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

export const UserProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 p-1.5 rounded-full hover:bg-neutral-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-spotify-green"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <img
          src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover border border-neutral-700"
        />
        <div className="hidden md:block text-left pr-2">
          <p className="text-xs font-semibold text-white leading-none">{user.name}</p>
          <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{user.role}</p>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
          <div className="px-4 py-2.5 border-b border-neutral-800">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-neutral-400 truncate mt-0.5">{user.email}</p>
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-mono bg-spotify-green/10 text-spotify-green border border-spotify-green/20">
              <ShieldCheck className="w-3 h-3" />
              {user.role} Access
            </span>
          </div>

          <div className="py-1 font-mono">
            <Link
              to={ROUTES.CERTIFICATION}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs text-spotify-green hover:bg-neutral-800 font-bold transition-colors"
            >
              <Award className="w-4 h-4 text-spotify-green" />
              Enterprise Release Board
            </Link>
            <Link
              to={ROUTES.GITHUB}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <GitBranch className="w-4 h-4 text-neutral-400" />
              GitHub Open-Source
            </Link>
            <Link
              to={ROUTES.RELEASE}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <Rocket className="w-4 h-4 text-neutral-400" />
              Production Release Gate
            </Link>
            <Link
              to={ROUTES.SECURITY_COMPLIANCE}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-neutral-400" />
              Threat Model & Compliance
            </Link>
            <Link
              to={ROUTES.ACCESSIBILITY}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <Eye className="w-4 h-4 text-neutral-400" />
              WCAG 2.2 Accessibility
            </Link>
            <Link
              to={ROUTES.PERFORMANCE}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <Zap className="w-4 h-4 text-neutral-400" />
              Performance Telemetry
            </Link>
            <Link
              to={ROUTES.SECURITY}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <Lock className="w-4 h-4 text-neutral-400" />
              Security & Governance
            </Link>
            <Link
              to={ROUTES.AUDIT}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <FileText className="w-4 h-4 text-neutral-400" />
              Audit Logs & Compliance
            </Link>
            <Link
              to={ROUTES.SETTINGS}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <Settings className="w-4 h-4 text-neutral-400" />
              Platform Settings
            </Link>
          </div>

          <div className="border-t border-neutral-800 pt-1">
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-mono text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
