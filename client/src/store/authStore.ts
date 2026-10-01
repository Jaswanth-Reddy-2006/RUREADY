import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@ru-ready/shared';
import { useProfileStore } from './useProfileStore';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setToken: (accessToken: string) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: (user, accessToken) => {
        try {
          useProfileStore.getState().syncWithAuthUser(user);
        } catch {}
        set({
          user,
          accessToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        try {
          useProfileStore.getState().syncWithAuthUser(null);
        } catch {}
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      setToken: (accessToken) =>
        set({ accessToken, isAuthenticated: Boolean(accessToken) }),

      setUser: (user) => {
        try {
          useProfileStore.getState().syncWithAuthUser(user);
        } catch {}
        set({ user, isAuthenticated: Boolean(user) });
      },
    }),
    {
      name: 'rennetus-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
