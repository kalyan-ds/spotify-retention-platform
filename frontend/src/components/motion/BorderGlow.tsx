import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { DURATIONS } from './durations';

export function BorderGlow({
  color = 'rgba(30,215,96,0.3)',
  className
}: {
  color?: string,
  className?: string
}) {
  const glowColor = color.replace(/0\.\d+\)/, '0.1)'); // reduce opacity for shadow
  return (
    <motion.div
      className={cn("absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATIONS.ambient }}
    >
      <motion.div
        className="absolute inset-[-1px] rounded-[inherit] animate-ambient-breathe"
        style={{
          border: `1px solid ${color}`,
          boxShadow: `inset 0 0 12px ${glowColor}, 0 0 12px ${glowColor}`
        }}
      />
    </motion.div>
  );
}
