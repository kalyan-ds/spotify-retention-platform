import { Button } from '@/components/buttons/Button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/dropdowns/Dropdown';
import { Typography } from '@/components/typography/Typography';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDashboardFilters } from '@/contexts/DashboardFilterContext';

const DEFAULT_FILTERS = [
  { id: 'dateRange', label: 'Date', options: ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year'] },
  { id: 'country', label: 'Country', options: ['All', 'US', 'UK', 'Brazil', 'India', 'Germany'] },
  { id: 'device', label: 'Device', options: ['All', 'iOS', 'Android', 'Web', 'Smart TV'] },
  { id: 'tier', label: 'Tier', options: ['All', 'Premium', 'Free', 'Student', 'Family'] },
  { id: 'segment', label: 'Segment', options: ['All', 'New', 'Active', 'At-Risk', 'Churned'] },
  { id: 'payment', label: 'Payment', options: ['All', 'Credit Card', 'PayPal', 'Carrier Billing'] },
  { id: 'age', label: 'Age', options: ['All', '18-24', '25-34', '35-44', '45+'] },
] as const;

export function FilterToolbar({ className }: { className?: string }) {
  const { filters, setFilter, resetFilters } = useDashboardFilters();

  return (
    <div className={cn('flex items-center space-x-4 py-4 w-full overflow-x-auto no-scrollbar', className)}>
      <Typography variant="metricLabel" className="text-muted-foreground mr-2 shrink-0">
        FILTERS
      </Typography>

      {DEFAULT_FILTERS.map((filter) => (
        <DropdownMenu key={filter.id}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0 h-8 rounded-full border-border bg-transparent hover:bg-secondary cursor-pointer">
              <span className="text-muted-foreground mr-1">{filter.label}:</span> {filters[filter.id as keyof typeof filters]}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {filter.options.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => setFilter(filter.id as keyof typeof filters, option)}
                className={cn("cursor-pointer", filters[filter.id as keyof typeof filters] === option ? 'bg-secondary/50' : '')}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}

      <Button onClick={resetFilters} variant="ghost" size="sm" className="shrink-0 h-8 text-muted-foreground hover:text-foreground cursor-pointer">
        Reset
      </Button>
    </div>
  );
}
