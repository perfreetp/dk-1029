import { create } from 'zustand';
import type { Ticket } from '@/types';
import { mockTickets } from '@/mock/data';

interface TicketState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  loading: boolean;
  fetchTickets: () => Promise<void>;
  setCurrentTicket: (ticket: Ticket | null) => void;
  createTicket: (data: Partial<Ticket>) => Promise<Ticket>;
  updateTicket: (id: string, data: Partial<Ticket>) => Promise<Ticket>;
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: mockTickets,
  currentTicket: null,
  loading: false,
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
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const newTicket = await response.json();
      set({ tickets: [...get().tickets, newTicket] });
      return newTicket;
    } catch {
      const newTicket = {
        id: `ticket-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Ticket;
      set({ tickets: [...get().tickets, newTicket] });
      return newTicket;
    }
  },
  updateTicket: async (id, data) => {
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedTicket = await response.json();
      set({
        tickets: get().tickets.map(t => t.id === id ? updatedTicket : t),
        currentTicket: get().currentTicket?.id === id ? updatedTicket : get().currentTicket
      });
      return updatedTicket;
    } catch {
      const updatedTicket = {
        ...get().tickets.find(t => t.id === id),
        ...data,
        updatedAt: new Date().toISOString()
      } as Ticket;
      set({
        tickets: get().tickets.map(t => t.id === id ? updatedTicket : t),
        currentTicket: get().currentTicket?.id === id ? updatedTicket : get().currentTicket
      });
      return updatedTicket;
    }
  }
}));