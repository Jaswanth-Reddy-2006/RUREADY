import axios from 'axios';
import apiClient from './client';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshResponse,
} from '@ru-ready/shared';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  checkEmail: async (email: string): Promise<{ exists: boolean }> => {
    const response = await apiClient.post<{ exists: boolean }>('/auth/check-email', { email });
    return response.data;
  },

  refresh: async (): Promise<RefreshResponse> => {
    const response = await axios.post<RefreshResponse>(
      `${API_BASE}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
