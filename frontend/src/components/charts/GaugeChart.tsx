import React from 'react';

interface GaugeChartProps {
  value: number; // 0 - 100
  title: string;
  label?: string;
  color?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  title,
  label = 'Normalized Score',
  color = '#1DB954'
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = 251.2 - (251.2 * normalizedValue) / 100;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={color}
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-white font-mono">{normalizedValue}%</span>
          <span className="text-[10px] text-neutral-400 font-mono mt-0.5">{label}</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-neutral-300 mt-2">{title}</p>
    </div>
  );
};
