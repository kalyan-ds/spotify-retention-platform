import { motion } from 'framer-motion';

export function PageChoreography({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0
          }
        }
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
