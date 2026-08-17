import { motion } from 'framer-motion';
import { pageVariant } from './variants';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function PageMotion({ children, className = '' }: Props) {
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
