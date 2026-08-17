import { motion } from 'framer-motion';
import { fadeRightVariant } from './variants';

export function FadeRight({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div variants={fadeRightVariant} initial="initial" animate="animate" exit="exit" className={className}>
      {children}
    </motion.div>
  );
}
