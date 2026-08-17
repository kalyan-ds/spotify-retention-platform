import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@/components/typography/Typography';
import { Button } from '@/components/buttons/Button';
import { Card, CardContent } from '@/components/cards/Card';
import { ROUTES } from '@/utils/routes';

interface EnterprisePlaceholderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iteration: string;
  progress: number;
}

export function EnterprisePlaceholder({
  title,
  description,
  icon,
  iteration,
  progress,
}: EnterprisePlaceholderProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex items-center justify-center p-8 animate-in fade-in duration-500">
      <Card className="w-full max-w-2xl bg-card border-border/10 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-8">
          <div className="p-6 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>

          <div className="space-y-2">
            <Typography variant="sectionTitle">{title}</Typography>
            <Typography variant="body" className="text-muted-foreground max-w-md mx-auto">
              {description}
            </Typography>
          </div>

          <div className="w-full max-w-sm space-y-4 bg-muted/30 p-6 rounded-lg border border-border/5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Target Release</span>
              <span className="text-foreground font-semibold">{iteration}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Development Progress</span>
                <span className="text-primary font-medium">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(ROUTES.overview)}
            className="mt-4"
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
