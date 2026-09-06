import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach access token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Unified, single-flight refresh token coordination
let refreshPromise: Promise<string> | null = null;

export async function executeRefresh(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const { data } = await axios.post<{ accessToken: string }>(
        `${apiClient.defaults.baseURL || '/api'}/auth/refresh`,
        {},
        { withCredentials: true },
      );
      const newToken = data.accessToken;
      useAuthStore.getState().setToken(newToken);
      return newToken;
    } catch (err) {
      throw err;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If not 401 or already retried, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newToken = await executeRefresh();
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      const path = window.location.pathname;
      const onInterview = path.startsWith('/interview/') && path !== '/interview/setup';
      
      if (!onInterview) {
        console.warn('Refresh failed, logging out user:', refreshError);
        useAuthStore.getState().logout();
      }
      return Promise.reject(refreshError);
    }
  },
);

export default apiClient;
