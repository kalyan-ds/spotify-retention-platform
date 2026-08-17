import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { Loader2, Check } from 'lucide-react';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { TRANSITIONS } from '@/components/motion/transitions';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1ed760]/50 disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-border bg-transparent hover:bg-secondary hover:text-foreground',
        ghost: 'hover:bg-secondary hover:text-foreground',
        icon: 'hover:bg-secondary hover:text-foreground p-2',
        success: 'bg-[#1ed760] text-black hover:brightness-110 shadow-[0_0_0_rgba(30,215,96,0)] hover:shadow-[0_4px_12px_rgba(30,215,96,0.3)]',
        warning: 'bg-semantic-warning text-black hover:brightness-110',
        danger: 'bg-[#e91429] text-white hover:brightness-110 shadow-[0_0_0_rgba(233,20,41,0)] hover:shadow-[0_4px_12px_rgba(233,20,41,0.3)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "size">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  success?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, success = false, children, disabled, onMouseDown, ...props }, ref) => {
    const [ripple, setRipple] = useState<{ x: number, y: number, id: number } | null>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setRipple({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        id: Date.now()
      });
      if (onMouseDown) onMouseDown(e);
    };

    const isDisabled = disabled || loading || success;

    return (
      <motion.button
        whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
        whileTap={!isDisabled ? { scale: 0.97 } : {}}
        transition={TRANSITIONS.springSnappy}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        onMouseDown={handleMouseDown}
        {...props}
      >
        <AnimatePresence mode="popLayout">
          {ripple && (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.3 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onAnimationComplete={() => setRipple(null)}
              className="absolute bg-white/20 rounded-full pointer-events-none"
              style={{
                left: ripple.x - 20,
                top: ripple.y - 20,
                width: 40,
                height: 40,
              }}
            />
          )}
        </AnimatePresence>

        <span className="relative flex items-center justify-center gap-2 w-full h-full">
          <AnimatePresence mode="popLayout" initial={false}>
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
              </motion.div>
            ) : success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check className="h-5 w-5 text-black" />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center w-full gap-2"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
