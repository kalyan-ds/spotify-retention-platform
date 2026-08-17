import { Settings as SettingsIcon } from 'lucide-react';
import { EnterprisePlaceholder } from '@/components/system/EnterprisePlaceholder';

export default function Settings() {
  return (
    <EnterprisePlaceholder
      title="Platform Settings"
      description="Manage application configuration, team permissions, API keys, and billing."
      icon={<SettingsIcon className="w-12 h-12" />}
      iteration="Iteration 7"
      progress={0}
    />
  );
}
