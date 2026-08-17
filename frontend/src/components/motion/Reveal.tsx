import { motion, useReducedMotion } from 'framer-motion';
import { useReveal } from './hooks';

export function Reveal({ children, className, blur = true, delay = 0, yOffset = 30 }: { children: React.ReactNode, className?: string, blur?: boolean, delay?: number, yOffset?: number }) {
  const { ref, isInView } = useReveal();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: yOffset, filter: blur ? 'blur(10px)' : 'none' }}
        animate={isInView ? { opacity: 1, y: [yOffset, -4, 0], filter: blur ? 'blur(0px)' : 'none' } : { opacity: 0, y: yOffset, filter: blur ? 'blur(10px)' : 'none' }}
        transition={{
          duration: 0.8,
          delay,
          times: [0, 0.7, 1],
          ease: "easeOut"
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
