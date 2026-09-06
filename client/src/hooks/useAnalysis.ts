import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { InterviewSession } from '../types';

export function useAnalysis(sessionId?: string) {
  return useQuery<InterviewSession>({
    queryKey: ['analysis', sessionId],
    queryFn: async () => {
      const response = await apiClient.get(`/interview/session/${sessionId}`);
      return response.data;
    },
    enabled: !!sessionId,
    refetchInterval: (query) => {
      // If the session exists but the analysis is still compiles (or not ready), check every 3 seconds
      const session = query.state.data;
      if (session && !session.analysis) {
        return 3000;
      }
      return false;
    },
  });
}
