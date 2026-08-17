import React from 'react';
import { motion } from 'framer-motion';

export const PageContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};
