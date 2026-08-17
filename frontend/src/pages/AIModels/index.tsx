import { BrainCircuit } from 'lucide-react';
import { EnterprisePlaceholder } from '@/components/system/EnterprisePlaceholder';

export default function AIModels() {
  return (
    <EnterprisePlaceholder
      title="AI Models"
      description="Manage machine learning pipelines, SHAP explainability configurations, and model versions."
      icon={<BrainCircuit className="w-12 h-12" />}
      iteration="Iteration 5"
      progress={0}
    />
  );
}
