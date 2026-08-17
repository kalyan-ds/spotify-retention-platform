import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/utils/cn';

export function CursorLight({ className }: { className?: string }) {
  const lightRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || isTouch) return;

    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const parent = lightRef.current?.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
      }
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${currentX - 150}px, ${currentY - 150}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion, isTouch]);

  if (shouldReduceMotion || isTouch) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
      <div
        ref={lightRef}
        className={cn(
          "absolute h-[300px] w-[300px] rounded-full opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100",
          className
        )}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
