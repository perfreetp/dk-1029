import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bill, Feedback } from '@/types';
import { mockBills, mockFeedbacks, mockQuotaData } from '@/mock/data';

interface BillState {
  bills: Bill[];
  quotaData: Array<{ capabilityId: string; name: string; quota: number; used: number }>;
  loading: boolean;
  fetchBills: () => Promise<void>;
  payBill: (id: string) => Promise<void>;
  renewQuota: (capabilityId: string, name: string, additionalQuota: number) => void;
  addRenewRecord: (capabilityId: string, capabilityName: string, period: number, amount: number) => void;
  renewHistory: Array<{ capabilityId: string; capabilityName: string; period: number; amount: number; renewedAt: string }>;
}

export const useBillStore = create<BillState>()(
  persist(
    (set, get) => ({
      bills: mockBills,
      quotaData: mockQuotaData,
      loading: false,
      renewHistory: [],
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
            b.id === id ? { ...b, status: 'paid' as const, paidAt: new Date().toISOString() } : b
          );
          set({ bills });
        } catch {
          const bills = get().bills.map(b => 
            b.id === id ? { ...b, status: 'paid' as const, paidAt: new Date().toISOString() } : b
          );
          set({ bills });
        }
      },
      renewQuota: (capabilityId, name, additionalQuota) => {
        const existingQuota = get().quotaData.find(q => q.capabilityId === capabilityId);
        if (existingQuota) {
          set({
            quotaData: get().quotaData.map(q => 
              q.capabilityId === capabilityId 
                ? { ...q, quota: q.quota + additionalQuota }
                : q
            )
          });
        } else {
          set({
            quotaData: [...get().quotaData, { capabilityId, name, quota: additionalQuota, used: 0 }]
          });
        }
      },
      addRenewRecord: (capabilityId, capabilityName, period, amount) => {
        set({
          renewHistory: [...get().renewHistory, { 
            capabilityId, 
            capabilityName, 
            period, 
            amount, 
            renewedAt: new Date().toISOString() 
          }]
        });
      }
    }),
    {
      name: 'bill-storage'
    }
  )
);

interface RatingData {
  rating: number;
  comment: string;
  createdAt: string;
}

interface FeedbackState {
  feedbacks: Feedback[];
  currentFeedback: Feedback | null;
  ratings: Record<string, RatingData>;
  loading: boolean;
  fetchFeedbacks: () => Promise<void>;
  createFeedback: (data: Partial<Feedback>) => Promise<Feedback>;
  setCurrentFeedback: (feedback: Feedback | null) => void;
  addRating: (feedbackId: string, rating: number, comment: string) => void;
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      feedbacks: mockFeedbacks,
      currentFeedback: null,
      ratings: {},
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
      setCurrentFeedback: (feedback) => set({ currentFeedback: feedback }),
      addRating: (feedbackId, rating, comment) => {
        set({
          ratings: {
            ...get().ratings,
            [feedbackId]: {
              rating,
              comment,
              createdAt: new Date().toISOString()
            }
          }
        });
      }
    }),
    {
      name: 'feedback-storage',
      partialize: (state) => ({
        ratings: state.ratings
      })
    }
  )
);