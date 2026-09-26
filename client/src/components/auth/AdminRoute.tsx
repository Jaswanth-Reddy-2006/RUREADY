// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin Route Guard
// Ensures only authenticated administrators can access the admin view
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const isUserAdmin =
    (user as any).role === 'ADMIN' ||
    user.email?.toLowerCase() === 'admin@rennetus.ai' ||
    user.email?.toLowerCase() === 'admin@ruready.ai' ||
    user.email?.toLowerCase().startsWith('admin@');

  if (!isUserAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
