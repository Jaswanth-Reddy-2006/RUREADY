import apiClient from './client';
import { Analysis } from '@ru-ready/shared';

export const analyticsApi = {
  async getAnalysis(sessionId: string): Promise<Analysis> {
    const response = await apiClient.get<Analysis>(`/analysis/session/${sessionId}`);
    return response.data;
  },

  async submitTelemetry(sessionId: string, items: any[]): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(`/analysis/session/${sessionId}/telemetry`, items);
    return response.data;
  },

  async getDashboardMetrics(): Promise<{ totalCompletedSessions: number; averageScore: number; readinessDistribution: Record<string, number> }> {
    const response = await apiClient.get('/analysis/dashboard');
    return response.data;
  },
};
