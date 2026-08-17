import { useCounter } from './hooks';
import { cn } from '@/utils/cn';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  delay?: number;
}

export function AnimatedCounter({
  value,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  delay = 0
}: AnimatedCounterProps) {
  const { ref } = useCounter(value, duration, decimals, delay);

  return (
    <span className={cn('inline-block', className)}>
      {prefix}
      <span ref={ref} />
      {suffix}
    </span>
  );
}
