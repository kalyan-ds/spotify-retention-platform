import { motion } from 'framer-motion';
import { scaleVariant } from './variants';

export function ScaleIn({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      variants={scaleVariant}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ delay, type: "spring", stiffness: 300, damping: 24 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
