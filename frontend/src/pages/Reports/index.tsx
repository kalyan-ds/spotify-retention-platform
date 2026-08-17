import { FileText } from 'lucide-react';
import { EnterprisePlaceholder } from '@/components/system/EnterprisePlaceholder';

export default function Reports() {
  return (
    <EnterprisePlaceholder
      title="Custom Reports"
      description="Exportable PDF and CSV reports, automated scheduled deliveries, and dashboards."
      icon={<FileText className="w-12 h-12" />}
      iteration="Iteration 6"
      progress={0}
    />
  );
}
