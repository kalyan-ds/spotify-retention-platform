import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { UserRole } from '../../types/auth';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowRight, Loader2, AlertTriangle, Check, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const REMEMBERED_EMAIL_KEY = 'spotify_remembered_email';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const emailInputRef = useRef<HTMLInputElement>(null);

  // Remember me initial state
  const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY) || 'cai-architect@spotify.com';
  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem(REMEMBERED_EMAIL_KEY));
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  // Validation States
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Compute redirect target
  const redirectParam = searchParams.get('redirect');
  const fromState = (location.state as any)?.from?.pathname || (location.state as any)?.from;
  const redirectTarget = redirectParam || fromState || '/';

  // Autofocus email on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  // Password Strength Meter Calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-neutral-800' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 2, label: 'Medium', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Strong', color: 'bg-spotify-green' };
      case 4:
        return { score: 4, label: 'Excellent', color: 'bg-emerald-400' };
      default:
        return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    }
  };

  const passStrength = getPasswordStrength(password);

  // Email Validation Logic
  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const emailError = emailTouched && !email ? 'Work email is required' : emailTouched && !isEmailValid(email) ? 'Please enter a valid email address' : null;

  // Password Validation Logic
  const isPasswordValid = (val: string) => val.length >= 4;
  const passwordError = passwordTouched && !password ? 'Password is required' : passwordTouched && !isPasswordValid(password) ? 'Password must be at least 4 characters' : null;

  const isFormValid = isEmailValid(email) && isPasswordValid(password);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'Admin') {
      setEmail('cai-architect@spotify.com');
    } else if (role === 'Analyst') {
      setEmail('data-analyst@spotify.com');
    } else {
      setEmail('executive-viewer@spotify.com');
    }
    setEmailTouched(false);
    setPasswordTouched(false);
  };

  const handleKeyDownPassword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState('CapsLock'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!isFormValid) return;

    setErrorMessage(null);
    try {
      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      await login({
        email,
        password,
        role: selectedRole
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate(redirectTarget, { replace: true });
      }, 500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check credentials.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-spotify-green/15 via-neutral-950 to-neutral-950 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md space-y-6"
      >
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-spotify-green/10 text-spotify-green border border-spotify-green/20 shadow-xl shadow-spotify-green/10">
            <Shield className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Spotify Retention Platform</h1>
          <p className="text-xs text-neutral-400 font-mono">Enterprise IAM Security & SSO Authentication</p>
        </div>

        {/* Login Form Card */}
        <div className="p-8 rounded-3xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-3xl shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-spotify-green/10 rounded-full blur-3xl pointer-events-none" />

          {/* Quick Role Selection Preset Pills */}
          <div className="space-y-2 relative z-10">
            <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
              Quick Role Switcher (Demo Pre-sets)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Admin', 'Analyst', 'Viewer'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition-all border focus:outline-none focus:ring-2 focus:ring-spotify-green/40 ${
                    selectedRole === r
                      ? 'bg-spotify-green/20 text-spotify-green border-spotify-green/40 shadow-sm'
                      : 'bg-neutral-800/60 text-neutral-400 border-neutral-700/50 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Global Error Banner */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                role="alert"
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10" noValidate>
            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-mono text-neutral-300 block">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  ref={emailInputRef}
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  className={`w-full bg-neutral-950 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-2 transition-all font-mono ${
                    emailError
                      ? 'border-rose-500/60 focus:ring-rose-500/40'
                      : 'border-neutral-800 focus:ring-spotify-green/40 focus:border-spotify-green/50'
                  }`}
                  placeholder="name@spotify.com"
                />
              </div>
              {emailError && (
                <p id="email-error" className="text-[11px] font-mono text-rose-400" role="alert">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-mono text-neutral-300 block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  onKeyDown={handleKeyDownPassword}
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                  className={`w-full bg-neutral-950 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-2 transition-all font-mono ${
                    passwordError
                      ? 'border-rose-500/60 focus:ring-rose-500/40'
                      : 'border-neutral-800 focus:ring-spotify-green/40 focus:border-spotify-green/50'
                  }`}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>Password Strength</span>
                    <span className="font-semibold text-neutral-300">{passStrength.label}</span>
                  </div>
                  <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden flex gap-0.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 transition-all duration-300 ${
                          step <= passStrength.score ? passStrength.color : 'bg-neutral-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {passwordError && (
                <p id="password-error" className="text-[11px] font-mono text-rose-400" role="alert">
                  {passwordError}
                </p>
              )}
              {isCapsLockOn && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 mt-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Caps Lock is ON</span>
                </div>
              )}
            </div>

            {/* Remember Me & Redirect Notice */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setRememberMe((prev) => !prev)}
                className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors focus:outline-none"
              >
                {rememberMe ? (
                  <CheckSquare className="w-4 h-4 text-spotify-green" />
                ) : (
                  <Square className="w-4 h-4 text-neutral-600" />
                )}
                <span>Remember work email</span>
              </button>

              {redirectParam && (
                <span className="text-[10px] font-mono text-spotify-green/80 bg-spotify-green/10 px-2 py-0.5 rounded border border-spotify-green/20">
                  Target: {redirectParam}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full py-3 px-4 rounded-xl bg-spotify-green hover:bg-spotify-green-hover text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-spotify-green/15 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-spotify-green/50 disabled:opacity-40 disabled:cursor-not-allowed mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : isSuccess ? (
                <>
                  <Check className="w-4 h-4 text-black animate-bounce" />
                  <span>Authenticated! Redirecting...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {selectedRole}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <p className="text-[11px] text-center text-neutral-500 font-mono">
          Protected by Enterprise SSO & OAuth 2.0 / Bearer Token Security
        </p>
      </motion.div>
    </div>
  );
};
