import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Ticket } from '@/types';
import { mockTickets } from '@/mock/data';
import { mockCapabilities } from '@/mock/data';

const defaultAssignee = {
  id: 'staff-default',
  name: '待分配',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  phone: '待分配'
};

interface TicketState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  loading: boolean;
  submittedTicketId: string | null;
  fetchTickets: () => Promise<void>;
  setCurrentTicket: (ticket: Ticket | null) => void;
  createTicket: (data: Partial<Ticket>) => Promise<Ticket>;
  updateTicket: (id: string, data: Partial<Ticket>) => Promise<Ticket>;
  setSubmittedTicketId: (id: string | null) => void;
}

export const useTicketStore = create<TicketState>()(
  persist(
    (set, get) => ({
      tickets: mockTickets,
      currentTicket: null,
      loading: false,
      submittedTicketId: null,
      fetchCapabilities: () => {},
      capabilities: mockCapabilities,
  fetchTickets: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/tickets');
      const data = await response.json();
      set({ tickets: data, loading: false });
    } catch {
      set({ tickets: mockTickets, loading: false });
    }
  },
  setCurrentTicket: (ticket) => set({ currentTicket: ticket }),
  createTicket: async (data) => {
    const now = new Date().toISOString();
    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      enterpriseId: 'ent-001',
      capabilityId: data.capabilityId || '',
      capabilityName: data.capabilityName || mockCapabilities.find(c => c.id === data.capabilityId)?.name || '未知能力',
      type: data.type || 'access',
      status: 'submitted',
      description: data.description || '',
      attachments: [],
      assignee: {
        id: 'staff-default',
        name: '待分配',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
        phone: '等待平台分配'
      },
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          status: 'submitted',
          operator: '张明',
          comment: '工单已提交，等待平台分配对接人',
          timestamp: now
        },
        {
          id: `tl-${Date.now()}-2`,
          status: 'pending_assign',
          operator: '系统',
          comment: '工单已排队，等待分配对接人',
          timestamp: now
        }
      ],
      createdAt: now,
      updatedAt: now
    };
    
    set({ tickets: [...get().tickets, newTicket] });
    return newTicket;
  },
  updateTicket: async (id, data) => {
    const existingTicket = get().tickets.find(t => t.id === id);
    const now = new Date().toISOString();
    
    let updatedTicket: Ticket;
    
    if (data.status === 'assigned' && !existingTicket?.assignee) {
      updatedTicket = {
        ...existingTicket,
        ...data,
        assignee: {
          id: 'staff-001',
          name: '李对接',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liduijie',
          phone: '13900139000'
        },
        updatedAt: now
      } as Ticket;
    } else {
      updatedTicket = {
        ...existingTicket,
        ...data,
        updatedAt: now
      } as Ticket;
    }
    
    set({
      tickets: get().tickets.map(t => t.id === id ? updatedTicket : t),
      currentTicket: get().currentTicket?.id === id ? updatedTicket : get().currentTicket
    });
    return updatedTicket;
  },
  setSubmittedTicketId: (id) => set({ submittedTicketId: id })
}),
{
  name: 'ticket-storage',
  partialize: (state) => ({
    tickets: state.tickets,
    submittedTicketId: state.submittedTicketId
  })
}
));