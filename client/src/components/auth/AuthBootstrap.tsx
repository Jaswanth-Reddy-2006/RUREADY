import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { executeRefresh } from '@/api/client';

/**
 * Silently refresh access token on load when user was previously logged in.
 * Prevents false logouts after server restarts or short-lived access tokens.
 */
export default function AuthBootstrap() {
  useEffect(() => {
    const { isAuthenticated, accessToken } = useAuthStore.getState();
    if (!isAuthenticated) return;

    const refreshIfNeeded = async () => {
      try {
        if (!accessToken) {
          await executeRefresh();
          return;
        }

        const payload = JSON.parse(atob(accessToken.split('.')[1] || ''));
        const expMs = (payload.exp as number) * 1000;
        const expiresInMs = expMs - Date.now();
        if (expiresInMs < 2 * 60 * 1000) {
          await executeRefresh();
        }
      } catch {
        // Keep session; 401 interceptor will retry on next API call
      }
    };

    refreshIfNeeded();
  }, []);

  return null;
}
