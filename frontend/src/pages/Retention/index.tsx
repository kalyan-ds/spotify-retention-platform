import { RefreshCcw } from 'lucide-react';
import { EnterprisePlaceholder } from '@/components/system/EnterprisePlaceholder';

export default function Retention() {
  return (
    <EnterprisePlaceholder
      title="Retention Cohorts"
      description="Deep dive cohort analysis, retention curves, and historical churn comparisons."
      icon={<RefreshCcw className="w-12 h-12" />}
      iteration="Iteration 2"
      progress={45}
    />
  );
}
