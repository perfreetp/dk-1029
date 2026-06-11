import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Enterprise, Contact, CallbackUrl } from '@/types';

interface ApplyFormData {
  enterpriseName: string;
  creditCode: string;
  enterpriseType: string;
  industry: string;
  technicalContact: Contact;
  businessContact: Contact;
  emergencyContact: Contact;
  callbackUrls: CallbackUrl[];
}

interface ReviewState {
  enterprise: Enterprise | null;
  applyData: ApplyFormData | null;
  reviewStatus: 'pending' | 'in_review' | 'approved' | 'rejected';
  reviewTimeline: Array<{
    id: string;
    status: string;
    operator: string;
    comment?: string;
    timestamp: string;
  }>;
  setApplyData: (data: ApplyFormData) => void;
  submitApply: () => void;
  approve: () => void;
  reject: (reason: string) => void;
  reset: () => void;
}

export const useApplyStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      enterprise: null,
      applyData: null,
      reviewStatus: 'pending',
      reviewTimeline: [],
      
      setApplyData: (data) => set({ applyData: data }),
      
      submitApply: () => {
        const { applyData } = get();
        if (!applyData) return;
        
        set({
          reviewStatus: 'in_review',
          enterprise: {
            id: `ent-${Date.now()}`,
            name: applyData.enterpriseName,
            creditCode: applyData.creditCode,
            type: applyData.enterpriseType as Enterprise['type'],
            industry: applyData.industry,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          reviewTimeline: [
            {
              id: `tl-${Date.now()}`,
              status: 'submitted',
              operator: '张明',
              timestamp: new Date().toISOString()
            }
          ]
        });
      },
      
      approve: () => {
        const { enterprise } = get();
        if (!enterprise) return;
        
        set({
          enterprise: { ...enterprise, status: 'approved', updatedAt: new Date().toISOString() },
          reviewStatus: 'approved',
          reviewTimeline: [
            ...get().reviewTimeline,
            {
              id: `tl-${Date.now()}`,
              status: 'approved',
              operator: '审核员',
              comment: '审核通过',
              timestamp: new Date().toISOString()
            }
          ]
        });
      },
      
      reject: (reason) => {
        const { enterprise } = get();
        if (!enterprise) return;
        
        set({
          enterprise: { ...enterprise, status: 'rejected', updatedAt: new Date().toISOString() },
          reviewStatus: 'rejected',
          reviewTimeline: [
            ...get().reviewTimeline,
            {
              id: `tl-${Date.now()}`,
              status: 'rejected',
              operator: '审核员',
              comment: reason,
              timestamp: new Date().toISOString()
            }
          ]
        });
      },
      
      reset: () => set({
        enterprise: null,
        applyData: null,
        reviewStatus: 'pending',
        reviewTimeline: []
      })
    }),
    {
      name: 'apply-storage'
    }
  )
);