
import { Typography } from '@/components/typography/Typography';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export interface ProgressBarItem {
  label: string;
  value: number; // The percentage 0-100
  color?: string;
  metric?: string; // Optional raw metric (e.g. 142.4M)
}

interface ProgressBarListProps {
  items: ProgressBarItem[];
  className?: string;
}

export function ProgressBarList({ items, className }: ProgressBarListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex flex-col space-y-1">
          <div className="flex justify-between items-center text-sm">
            <Typography variant="smallText" className="font-medium text-foreground">
              {item.label}
            </Typography>
            <Typography variant="smallText" className="text-muted-foreground">
              {item.metric || `${item.value}%`}
            </Typography>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ duration: 1, delay: 0.1 + index * 0.1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: item.color || '#1ed760' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
