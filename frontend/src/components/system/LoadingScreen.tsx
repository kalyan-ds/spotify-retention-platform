import { Loader2 } from 'lucide-react';
import { Typography } from '@/components/typography/Typography';

export function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <Typography variant="body" className="text-muted-foreground animate-pulse">
        Loading module...
      </Typography>
    </div>
  );
}
