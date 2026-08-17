import { create } from 'zustand';

interface AIState {
  activeModelId: string;
  selectedUserId: number;
  apiConnected: boolean;
  healthStatus: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  activeChampionModel: string;
  setActiveModelId: (id: string) => void;
  setSelectedUserId: (userId: number) => void;
  setHealthStatus: (status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY', champion: string) => void;
  setApiConnected: (connected: boolean) => void;
}

export const useAIStore = create<AIState>((set) => ({
  activeModelId: 'churn_predictor',
  selectedUserId: 42,
  apiConnected: true,
  healthStatus: 'HEALTHY',
  activeChampionModel: 'Premium Churn Prediction (v1.4.2)',
  setActiveModelId: (id) => set({ activeModelId: id }),
  setSelectedUserId: (userId) => set({ selectedUserId: userId }),
  setHealthStatus: (status, champion) => set({ healthStatus: status, activeChampionModel: champion }),
  setApiConnected: (connected) => set({ apiConnected: connected })
}));
