import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        success: 'border-transparent bg-[rgba(30,215,96,0.15)] text-[#1ed760]',
        warning: 'border-transparent bg-[rgba(244,180,0,0.15)] text-[#f4b400]',
        critical: 'border-transparent bg-[rgba(233,20,41,0.15)] text-[#e91429]',
        info: 'border-transparent bg-[rgba(45,70,185,0.15)] text-[#2d46b9]',
        neutral: 'border-border bg-secondary text-secondary-foreground',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
