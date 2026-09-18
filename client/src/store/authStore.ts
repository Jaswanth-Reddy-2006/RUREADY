import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@ru-ready/shared';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setToken: (accessToken: string) => void;
  setUser: (user: User) => void;
}

const DEFAULT_DEMO_USER: User = {
  id: 'usr-jaswanth-01',
  name: 'Jaswanth Reddy',
  email: 'jaswanth@ruready.academy',
  role: 'CANDIDATE',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-09-18T00:00:00.000Z',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEFAULT_DEMO_USER,
      accessToken: 'demo-access-token-ru-ready',
      isAuthenticated: true,

      login: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: DEFAULT_DEMO_USER,
          accessToken: 'demo-access-token-ru-ready',
          isAuthenticated: true,
        }),

      setToken: (accessToken) =>
        set({ accessToken }),

      setUser: (user) =>
        set({ user }),
    }),
    {
      name: 'ru-ready-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
