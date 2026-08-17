import { motion } from 'framer-motion';
import { pageVariant } from './variants';

interface MotionLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MotionLayout({ children, className }: MotionLayoutProps) {
  return (
    <motion.div
      variants={pageVariant}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
