import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DURATIONS } from '@/components/motion';

interface SparklineProps {
  data: number[];
  color?: string;
  animated?: boolean;
  height?: number;
  width?: number;
  strokeWidth?: number;
}

export function Sparkline({
  data,
  color = '#1ed760',
  animated = true,
  height = 32,
  width = 64,
  strokeWidth = 2
}: SparklineProps) {

  const pathData = useMemo(() => {
    if (!data || data.length === 0) return { path: '', endpoint: { x: 0, y: 0 } };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const dx = width / (data.length - 1 || 1);

    let endX = 0;
    let endY = 0;

    const path = data.map((val, i) => {
      const x = i * dx;
      const y = height - ((val - min) / range) * (height - strokeWidth) - (strokeWidth / 2);
      if (i === data.length - 1) {
        endX = x;
        endY = y;
      }
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return { path, endpoint: { x: endX, y: endY } };
  }, [data, height, width, strokeWidth]);

  if (!data || data.length === 0) return null;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
      {animated ? (
        <>
          <motion.path
            d={pathData.path}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
            style={{
              filter: `drop-shadow(0 2px 4px ${color}40)`,
            }}
          />
          <motion.circle
            cx={pathData.endpoint.x}
            cy={pathData.endpoint.y}
            r={strokeWidth * 1.5}
            fill={color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              opacity: 1,
              filter: [`drop-shadow(0 0 0px ${color})`, `drop-shadow(0 0 8px ${color})`, `drop-shadow(0 0 4px ${color})`]
            }}
            transition={{
              delay: 1.6,
              duration: DURATIONS.slow,
              filter: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: DURATIONS.ambient * 2,
                ease: "easeInOut"
              }
            }}
          />
        </>
      ) : (
        <path
          d={pathData.path}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 2px 4px ${color}40)`,
          }}
        />
      )}
    </svg>
  );
}
