import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export function MotionLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname} className="w-full h-full">
        {children}
      </div>
    </AnimatePresence>
  );
}
