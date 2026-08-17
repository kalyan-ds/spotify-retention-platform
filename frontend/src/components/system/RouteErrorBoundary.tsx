import { Typography } from '@/components/typography/Typography';
import { Button } from '@/components/buttons/Button';
import { AlertTriangle } from 'lucide-react';

export function RouteErrorBoundary() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6 text-center">
      <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <div>
        <Typography variant="sectionTitle" className="mb-2">Module Error</Typography>
        <Typography variant="body" className="text-muted-foreground max-w-md mx-auto">
          We encountered an unexpected issue while loading this module. Please try again.
        </Typography>
      </div>
      <Button
        variant="primary"
        onClick={() => window.location.reload()}
      >
        Reload Page
      </Button>
    </div>
  );
}
