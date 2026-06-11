import { create } from 'zustand';
import type { User, Enterprise } from '@/types';
import { mockUser, mockEnterprise } from '@/mock/data';

interface UserState {
  user: User;
  enterprise: Enterprise | null;
  token: string;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setEnterprise: (enterprise: Enterprise) => void;
  login: (token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: mockUser,
  enterprise: mockEnterprise,
  token: 'mock-token-123',
  isAuthenticated: true,
  setUser: (user) => set({ user }),
  setEnterprise: (enterprise) => set({ enterprise }),
  login: (token) => set({ token, isAuthenticated: true }),
  logout: () => set({ token: '', isAuthenticated: false, user: null as unknown as User, enterprise: null })
}));