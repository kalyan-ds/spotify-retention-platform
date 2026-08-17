import React from 'react';
import {
  Cpu,
  Database,
  Layers,
  BrainCircuit,
  Lightbulb,
  Activity,
  Server,
  Key
} from 'lucide-react';
import { ServiceStatusCard } from './ServiceStatusCard';
import { HealthStatusType } from './StatusBadge';
import { MicroserviceHealth } from '../../types/dashboard';

interface ServiceStatusGridProps {
  servicesData?: MicroserviceHealth[];
}

const DEFAULT_SERVICES: Array<{
  id: string;
  name: string;
  status: HealthStatusType;
  uptime: string;
  latency: string;
  icon: React.ReactNode;
  accentColor: string;
}> = [
  {
    id: 'inference-engine',
    name: 'Inference Engine',
    status: 'Healthy',
    uptime: '99.99%',
    latency: '1.45ms',
    icon: <Cpu className="w-5 h-5" />,
    accentColor: '#1DB954'
  },
  {
    id: 'feature-store',
    name: 'Feature Store',
    status: 'Healthy',
    uptime: '99.99%',
    latency: '0.90ms',
    icon: <Database className="w-5 h-5" />,
    accentColor: '#06B6D4'
  },
  {
    id: 'model-registry',
    name: 'Model Registry',
    status: 'Healthy',
    uptime: '99.99%',
    latency: '1.10ms',
    icon: <Layers className="w-5 h-5" />,
    accentColor: '#3B82F6'
  },
  {
    id: 'prediction-api',
    name: 'Prediction API',
    status: 'Healthy',
    uptime: '99.99%',
    latency: '1.99ms',
    icon: <BrainCircuit className="w-5 h-5" />,
    accentColor: '#8B5CF6'
  },
  {
    id: 'recommendation-engine',
    name: 'Recommendation Engine',
    status: 'Healthy',
    uptime: '99.99%',
    latency: '2.15ms',
    icon: <Lightbulb className="w-5 h-5" />,
    accentColor: '#F59E0B'
  },
  {
    id: 'cache-layer',
    name: 'Cache Layer',
    status: 'Healthy',
    uptime: '99.99%',
    latency: '0.12ms',
    icon: <Activity className="w-5 h-5" />,
    accentColor: '#EC4899'
  },
  {
    id: 'database',
    name: 'MySQL Database',
    status: 'Healthy',
    uptime: '99.99%',
    latency: '0.85ms',
    icon: <Server className="w-5 h-5" />,
    accentColor: '#10B981'
  },
  {
    id: 'authentication',
    name: 'Authentication',
    status: 'Healthy',
    uptime: '99.99%',
    latency: '0.45ms',
    icon: <Key className="w-5 h-5" />,
    accentColor: '#6366F1'
  }
];

const getServiceIcon = (id: string) => {
  switch (id) {
    case 'inference-engine':
      return <Cpu className="w-5 h-5" />;
    case 'feature-store':
      return <Database className="w-5 h-5" />;
    case 'model-registry':
      return <Layers className="w-5 h-5" />;
    case 'prediction-api':
      return <BrainCircuit className="w-5 h-5" />;
    case 'recommendation-engine':
      return <Lightbulb className="w-5 h-5" />;
    case 'cache-layer':
      return <Activity className="w-5 h-5" />;
    case 'database':
      return <Server className="w-5 h-5" />;
    case 'authentication':
      return <Key className="w-5 h-5" />;
    default:
      return <Activity className="w-5 h-5" />;
  }
};

export const ServiceStatusGrid: React.FC<ServiceStatusGridProps> = React.memo(({ servicesData }) => {
  const displayServices = Array.isArray(servicesData) && servicesData.length > 0
    ? servicesData.map((s) => ({
        ...s,
        icon: getServiceIcon(s.id)
      }))
    : DEFAULT_SERVICES;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayServices.map((svc) => (
        <ServiceStatusCard
          key={svc.id}
          name={svc.name}
          status={svc.status}
          uptime={svc.uptime}
          latency={svc.latency}
          icon={svc.icon}
          accentColor={svc.accentColor || '#1DB954'}
        />
      ))}
    </div>
  );
});

ServiceStatusGrid.displayName = 'ServiceStatusGrid';
