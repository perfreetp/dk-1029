import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Capability } from '@/types';
import { mockCapabilities } from '@/mock/data';

interface CapabilityState {
  capabilities: Capability[];
  currentCapability: Capability | null;
  loading: boolean;
  fetchCapabilities: () => Promise<void>;
  setCurrentCapability: (capability: Capability | null) => void;
  renewCapability: (id: string, period: number) => void;
  suspendCapability: (id: string) => void;
}

export const useCapabilityStore = create<CapabilityState>()(
  persist(
    (set, get) => ({
      capabilities: mockCapabilities,
      currentCapability: null,
      loading: false,
      fetchCapabilities: async () => {
        set({ loading: true });
        try {
          const response = await fetch('/api/capabilities');
          const data = await response.json();
          set({ capabilities: data, loading: false });
        } catch {
          set({ capabilities: mockCapabilities, loading: false });
        }
      },
      setCurrentCapability: (capability) => set({ currentCapability: capability }),
      renewCapability: (id, period) => {
        set({
          capabilities: get().capabilities.map(cap => 
            cap.id === id 
              ? { ...cap, quota: cap.quota + cap.quota * period, status: 'active' as const }
              : cap
          )
        });
      },
      suspendCapability: (id) => {
        set({
          capabilities: get().capabilities.map(cap => 
            cap.id === id ? { ...cap, status: 'suspended' as const } : cap
          )
        });
      }
    }),
    {
      name: 'capability-storage'
    }
  )
);