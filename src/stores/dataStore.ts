import { create } from 'zustand';
import type { Bill, Feedback } from '@/types';
import { mockBills, mockFeedbacks, mockQuotaData } from '@/mock/data';

interface BillState {
  bills: Bill[];
  quotaData: Array<{ capabilityId: string; name: string; quota: number; used: number }>;
  loading: boolean;
  fetchBills: () => Promise<void>;
  payBill: (id: string) => Promise<void>;
}

export const useBillStore = create<BillState>((set, get) => ({
  bills: mockBills,
  quotaData: mockQuotaData,
  loading: false,
  fetchBills: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/bills');
      const data = await response.json();
      set({ bills: data, loading: false });
    } catch {
      set({ bills: mockBills, loading: false });
    }
  },
  payBill: async (id) => {
    try {
      await fetch(`/api/bills/${id}/pay`, { method: 'POST' });
      const bills = get().bills.map(b => 
        b.id === id ? { ...b, status: 'paid', paidAt: new Date().toISOString() } : b
      );
      set({ bills });
    } catch {
      const bills = get().bills.map(b => 
        b.id === id ? { ...b, status: 'paid', paidAt: new Date().toISOString() } : b
      );
      set({ bills });
    }
  }
}));

interface FeedbackState {
  feedbacks: Feedback[];
  currentFeedback: Feedback | null;
  loading: boolean;
  fetchFeedbacks: () => Promise<void>;
  createFeedback: (data: Partial<Feedback>) => Promise<Feedback>;
  setCurrentFeedback: (feedback: Feedback | null) => void;
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  feedbacks: mockFeedbacks,
  currentFeedback: null,
  loading: false,
  fetchFeedbacks: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/feedbacks');
      const data = await response.json();
      set({ feedbacks: data, loading: false });
    } catch {
      set({ feedbacks: mockFeedbacks, loading: false });
    }
  },
  createFeedback: async (data) => {
    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const newFeedback = await response.json();
      set({ feedbacks: [...get().feedbacks, newFeedback] });
      return newFeedback;
    } catch {
      const newFeedback = {
        id: `fb-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Feedback;
      set({ feedbacks: [...get().feedbacks, newFeedback] });
      return newFeedback;
    }
  },
  setCurrentFeedback: (feedback) => set({ currentFeedback: feedback })
}));