import apiClient from './client';

export interface AdminMetrics {
  totalCandidates: number;
  activeSessions: number;
  completedInterviews: number;
  systemHealth: string;
  gatewayUptimeSecs: number;
  avgLatencyMs: number;
}

export interface AdminAnalytics {
  scoreDistribution: Record<string, number>;
  interviewTypeMetrics: Record<string, number>;
  readinessVerdictRates: Record<string, string>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CANDIDATE';
  plan: 'FREE' | 'STARTER' | 'PRO' | 'ULTIMATE';
  status: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface MicroserviceHealth {
  name: string;
  displayName: string;
  port: number;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  lastChecked: string;
  category: string;
  backgroundJobs: string;
  issueCount: number;
  issues: string[];
}

export interface SystemLog {
  id: string;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export const adminApi = {
  async getMetrics(): Promise<AdminMetrics> {
    const response = await apiClient.get<AdminMetrics>('/admin/metrics');
    return response.data;
  },

  async getAnalytics(): Promise<AdminAnalytics> {
    const response = await apiClient.get<AdminAnalytics>('/admin/analytics');
    return response.data;
  },

  async getUsers(): Promise<AdminUser[]> {
    const response = await apiClient.get<AdminUser[]>('/admin/users');
    return response.data;
  },

  async getUserById(id: string): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>(`/admin/users/${id}`);
    return response.data;
  },

  async updateUserPlan(userId: string, plan: string): Promise<AdminUser> {
    const response = await apiClient.patch<AdminUser>(`/admin/users/${userId}/plan`, { plan });
    return response.data;
  },

  async getLogs(): Promise<AuditLog[]> {
    const response = await apiClient.get<AuditLog[]>('/admin/logs');
    return response.data;
  },

  async getHealthMatrix(): Promise<MicroserviceHealth[]> {
    const response = await apiClient.get<MicroserviceHealth[]>('/admin/health-matrix');
    return response.data;
  },

  async getSystemLogs(service?: string, level?: string, search?: string): Promise<SystemLog[]> {
    const params = new URLSearchParams();
    if (service && service !== 'ALL') params.append('service', service);
    if (level && level !== 'ALL') params.append('level', level);
    if (search) params.append('search', search);

    const response = await apiClient.get<SystemLog[]>(`/admin/system-logs?${params.toString()}`);
    return response.data;
  },

  async getSessionDetail(id: string) {
    const response = await apiClient.get(`/admin/sessions/${id}`);
    return response.data;
  },
};
