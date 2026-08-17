import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: string | number;
  duration?: number; // duration in ms
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState<string>('0');

  useEffect(() => {
    // Parse value string to identify numbers vs suffixes/units
    const strValue = String(value);
    // Matches patterns like "128,450", "96.8%", "2.4M", "28ms", "8", "99.97%"
    const match = strValue.match(/^([\D]*)([0-9.,]+)([\s\S]*)$/);

    if (!match) {
      setDisplayValue(strValue);
      return;
    }

    const prefix = match[1] || '';
    const rawNumberStr = match[2].replace(/,/g, '');
    const suffix = match[3] || '';
    const targetNumber = parseFloat(rawNumberStr);

    if (isNaN(targetNumber)) {
      setDisplayValue(strValue);
      return;
    }

    // Determine decimal precision from original format
    const decimalPlaces = match[2].includes('.') ? match[2].split('.')[1].length : 0;
    const hasCommas = strValue.includes(',');

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic function for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNumber = targetNumber * easeProgress;

      let formattedNumber = currentNumber.toFixed(decimalPlaces);
      if (hasCommas) {
        const parts = formattedNumber.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        formattedNumber = parts.join('.');
      }

      setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span className="font-mono">{displayValue}</span>;
};
