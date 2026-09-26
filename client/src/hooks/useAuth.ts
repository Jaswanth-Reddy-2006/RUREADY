import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest, RegisterRequest, ApiError } from '@ru-ready/shared';
import type { AxiosError } from 'axios';

export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout: clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      toast.success(`Welcome back, ${data.user.name}!`);
      const isUserAdmin =
        (data.user as any).role === 'ADMIN' ||
        data.user.email?.toLowerCase() === 'admin@rennetus.ai' ||
        data.user.email?.toLowerCase() === 'admin@ruready.ai' ||
        data.user.email?.toLowerCase().startsWith('admin@');
      navigate(isUserAdmin ? '/admin' : '/dashboard');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message || 'Invalid email or password. Please try again.';
      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      toast.success(`Welcome to Rennetus, ${data.user.name}!`);
      const isUserAdmin =
        (data.user as any).role === 'ADMIN' ||
        data.user.email?.toLowerCase() === 'admin@rennetus.ai' ||
        data.user.email?.toLowerCase().startsWith('admin@');
      navigate(isUserAdmin ? '/admin' : '/dashboard');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      localStorage.removeItem('rennetus-auth');
      localStorage.removeItem('ru-ready-auth');
      toast.success('Logged out successfully.');
      navigate('/login');
    },
    onError: () => {
      // Force logout even if API call fails
      clearAuth();
      localStorage.removeItem('rennetus-auth');
      localStorage.removeItem('ru-ready-auth');
      toast.success('Logged out successfully.');
      navigate('/login');
    },
  });

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
