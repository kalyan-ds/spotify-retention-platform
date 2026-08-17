import { useNavigate } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { Typography } from '@/components/typography/Typography';
import { Button } from '@/components/buttons/Button';
import { ROUTES } from '@/utils/routes';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="p-8 rounded-full bg-muted/20 text-muted-foreground border border-border/10">
        <SearchX className="h-16 w-16" />
      </div>

      <div className="space-y-4">
        <Typography variant="pageTitle" className="text-6xl text-primary font-bold">404</Typography>
        <Typography variant="sectionTitle">Page Not Found</Typography>
        <Typography variant="body" className="text-muted-foreground max-w-md mx-auto">
          The requested module or resource could not be found. It may have been moved, deleted, or you might not have the required permissions.
        </Typography>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.home)}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
