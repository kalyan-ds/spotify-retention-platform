import { motion } from 'framer-motion';
import { fadeLeftVariant } from './variants';

export function FadeLeft({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div variants={fadeLeftVariant} initial="initial" animate="animate" exit="exit" className={className}>
      {children}
    </motion.div>
  );
}
