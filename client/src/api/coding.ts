import apiClient from './client';

export interface CodeEvaluationResponse {
  success: boolean;
  passedCount: number;
  totalCount: number;
  stdout?: string;
  errorDetails?: string;
  runtimeMs?: number;
  language: string;
}

export const codingApi = {
  async createSession(targetRole: string, difficulty = 'MEDIUM', selectedLanguage = 'javascript') {
    const response = await apiClient.post('/interview/coding/session', {
      targetRole,
      difficulty,
      selectedLanguage,
    });
    return response.data;
  },

  async getProblems() {
    const response = await apiClient.get('/interview/coding/problems');
    return response.data;
  },

  async getProblemById(id: string) {
    const response = await apiClient.get(`/interview/coding/problems/${id}`);
    return response.data;
  },

  async runTestCases(sessionId: string, code: string, language: string): Promise<CodeEvaluationResponse> {
    const response = await apiClient.post<CodeEvaluationResponse>(`/interview/coding/session/${sessionId}/run`, {
      code,
      language,
    });
    return response.data;
  },

  async getSession(sessionId: string) {
    const response = await apiClient.get(`/interview/coding/session/${sessionId}`);
    return response.data;
  },
};
