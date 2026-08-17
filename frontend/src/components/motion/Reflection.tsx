import { motion, useReducedMotion } from 'framer-motion';
import { TRANSITIONS } from './transitions';

export function Reflection({ duration = 1.5 }: { duration?: number }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 rounded-[inherit]">
      <motion.div
        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform-gpu"
        initial={{ x: '-200%', opacity: 0 }}
        whileHover={{ x: '300%', opacity: 1 }}
        transition={{ duration, ease: TRANSITIONS.hover.ease }}
      />
    </div>
  );
}
