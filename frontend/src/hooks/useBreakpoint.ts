import { useState, useEffect } from 'react';
import { breakpoints } from '@/theme/breakpoints';

export function useBreakpoint() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < parseInt(breakpoints.md));
      setIsTablet(width >= parseInt(breakpoints.md) && width < parseInt(breakpoints.lg));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isTablet };
}
