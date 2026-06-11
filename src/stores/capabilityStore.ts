import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Capability } from '@/types';
import { mockCapabilities } from '@/mock/data';
import { useBillStore } from './dataStore';

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
        const cap = get().capabilities.find(c => c.id === id);
        if (!cap) return;
        
        const additionalQuota = cap.quota * period;
        const pricePerMonth = cap.price || 800;
        const totalAmount = pricePerMonth * period;
        
        useBillStore.getState().renewQuota(id, cap.name, additionalQuota);
        useBillStore.getState().addRenewRecord(id, cap.name, period, totalAmount);
        
        set({
          capabilities: get().capabilities.map(c => 
            c.id === id 
              ? { ...c, quota: c.quota + additionalQuota, status: 'active' as const }
              : c
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