import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const typographyVariants = cva('text-foreground', {
  variants: {
    variant: {
      pageTitle: 'text-3xl font-bold tracking-tight',
      sectionTitle: 'text-xl font-semibold tracking-tight',
      cardTitle: 'text-base font-medium text-foreground',
      metricValue: 'text-4xl font-bold tracking-tight',
      metricLabel: 'text-xs font-semibold uppercase tracking-wider text-muted-foreground',
      body: 'text-sm font-normal text-muted-foreground',
      caption: 'text-xs font-normal text-muted-foreground',
      smallText: 'text-[10px] font-medium text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, ...props }, ref) => {
    const Comp = as || 'p'; // default to p, can be overridden with as="h1" etc.
    return (
      <Comp
        ref={ref as any}
        className={cn(typographyVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Typography.displayName = 'Typography';

export { Typography, typographyVariants };
