import { create } from 'zustand';
import type { Capability } from '@/types';
import { mockCapabilities } from '@/mock/data';

interface CapabilityState {
  capabilities: Capability[];
  currentCapability: Capability | null;
  loading: boolean;
  fetchCapabilities: () => Promise<void>;
  setCurrentCapability: (capability: Capability | null) => void;
}

export const useCapabilityStore = create<CapabilityState>((set) => ({
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
  setCurrentCapability: (capability) => set({ currentCapability: capability })
}));