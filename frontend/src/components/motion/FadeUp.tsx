import { motion } from 'framer-motion';
import { fadeUpVariant } from './variants';

export function FadeUp({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div variants={fadeUpVariant} initial="initial" animate="animate" exit="exit" className={className}>
      {children}
    </motion.div>
  );
}
