import React, { useId } from 'react';
import { motion } from 'framer-motion';

interface HealthGaugeProps {
  value?: number; // e.g. 99.8
  label?: string;
  size?: number;
}

export const HealthGauge: React.FC<HealthGaugeProps> = React.memo(({
  value = 99.8,
  label = 'Enterprise AI Health',
  size = 180
}) => {
  const gradientId = useId();
  const filterId = useId();

  const radius = 70;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~439.8
  const normalizedValue = Math.min(100, Math.max(0, value));
  // Display as 270 degree arc (3/4 circle)
  const strokeDasharray = `${circumference * 0.75} ${circumference * 0.25}`;
  const strokeDashoffset = circumference * 0.75 * (1 - normalizedValue / 100);

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="w-full h-full transform -rotate-225"
          viewBox="0 0 180 180"
          aria-label={`${label}: ${normalizedValue}%`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1DB954" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={strokeDasharray}
          />

          {/* Animated Value Arc */}
          <motion.circle
            cx="90"
            cy="90"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference * 0.75 }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            filter={`url(#${filterId})`}
          />
        </svg>

        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-white font-mono tracking-tight drop-shadow-md">
            {normalizedValue}%
          </span>
          <span className="text-[11px] font-semibold text-neutral-400 mt-0.5 tracking-wide max-w-[110px] leading-tight">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
});

HealthGauge.displayName = 'HealthGauge';
