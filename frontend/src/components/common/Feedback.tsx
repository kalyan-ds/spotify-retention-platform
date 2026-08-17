import React from 'react';
import { Loader2, AlertCircle, FileX2, Hammer } from 'lucide-react';
import { Typography } from '../typography/Typography';
import { cn } from '@/utils/cn';

export function LoadingScreen({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px] text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <Typography variant="body">{text}</Typography>
    </div>
  );
}

export function SkeletonLoader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-secondary', className)}
      {...props}
    />
  );
}

export function EmptyState({ title, description, icon, className }: { title: string; description: string; icon?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-xl border-border bg-card/50 min-h-[250px]", className)}>
      <div className="mb-4 text-muted-foreground bg-secondary p-4 rounded-full">
        {icon || <FileX2 className="h-8 w-8" />}
      </div>
      <Typography variant="cardTitle" className="mb-2">{title}</Typography>
      <Typography variant="body" className="max-w-sm">{description}</Typography>
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description, onRetry, className }: { title?: string; description?: string; onRetry?: () => void; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border border-semantic-critical/20 rounded-xl bg-[rgba(233,20,41,0.05)] min-h-[250px]", className)}>
      <AlertCircle className="h-10 w-10 text-semantic-critical mb-4" />
      <Typography variant="cardTitle" className="mb-2 text-semantic-critical">{title}</Typography>
      {description && <Typography variant="body" className="max-w-sm mb-6">{description}</Typography>}
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 bg-semantic-critical text-white rounded-md hover:brightness-110 transition-all font-medium text-sm">
          Try Again
        </button>
      )}
    </div>
  );
}

export function ComingSoon({ featureName }: { featureName: string }) {
  return (
    <EmptyState
      title="Coming Soon"
      description={`${featureName} is currently under development. Check back in a future update!`}
      icon={<Hammer className="h-8 w-8" />}
    />
  );
}
