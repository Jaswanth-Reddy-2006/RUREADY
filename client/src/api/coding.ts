import apiClient from './client';

export interface TestCaseResult {
  testCaseIndex: number;
  passed: boolean;
  input: any;
  expected: any;
  actual?: any;
  executionTimeMs?: number;
  error?: string;
  isCustom?: boolean;
  description?: string;
}

export interface InterviewerResponse {
  message: string;
  tone: 'praising' | 'encouraging' | 'guiding' | 'probing';
  avatarEmotion: 'pleased' | 'thinking' | 'speaking' | 'neutral';
  followUpQuestion?: string;
}

export interface CodeEvaluationResponse {
  success: boolean;
  passedCount: number;
  totalCount: number;
  testResults?: TestCaseResult[];
  stdout?: string;
  errorDetails?: string;
  runtimeMs?: number;
  language: string;
  interviewerResponse?: InterviewerResponse;
}

export interface IdealSolutionResponse {
  problemId: string;
  title: string;
  difficulty: string;
  pattern: string;
  optimalSolution: string;
  optimalTime: string;
  optimalSpace: string;
  editorial: {
    intuition: string;
    bruteForce: string;
    optimalApproach: string;
    complexityAnalysis: string;
    edgeCases: string[];
  };
  code: string;
  language: string;
  idealSolutions?: Record<string, string>;
}

export interface ProgressiveHintResponse {
  problemId: string;
  hintLevel: number;
  hintText: string;
  spokenPrompt: string;
  allHints: string[];
}

export interface SocraticDialogueResponse {
  reply: string;
  emotion: 'speaking' | 'thinking' | 'pleased';
  problemTitle: string;
  pattern: string;
}

export const codingApi = {
  async createSession(targetRole: string, difficulty = 'MEDIUM', selectedLanguage = 'javascript', problemId?: string) {
    const response = await apiClient.post('/interview/coding/session', {
      targetRole,
      difficulty,
      selectedLanguage,
      problemId,
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

  async runTestCases(
    sessionId: string,
    code: string,
    language: string,
    problemId?: string,
    customTestCase?: any
  ): Promise<CodeEvaluationResponse> {
    try {
      const response = await apiClient.post<CodeEvaluationResponse>(`/interview/coding/session/${sessionId}/run`, {
        code,
        language,
        problemId,
        customTestCase,
      });
      return response.data;
    } catch {
      // Fallback via proxy route
      const response = await apiClient.post<CodeEvaluationResponse>(`/interview/session/${sessionId}/run`, {
        code,
        language,
        problemId,
        customTestCase,
      });
      return response.data;
    }
  },

  async getIdealSolution(sessionId: string, problemId: string, language: string = 'javascript'): Promise<IdealSolutionResponse> {
    try {
      const response = await apiClient.get<IdealSolutionResponse>(`/interview/coding/session/${sessionId}/ideal/${problemId}`, {
        params: { language },
      });
      return response.data;
    } catch {
      const response = await apiClient.get<IdealSolutionResponse>(`/interview/session/${sessionId}/ideal`, {
        params: { problemId, language },
      });
      return response.data;
    }
  },

  async getHint(sessionId: string, problemId: string, hintLevel: number, code?: string): Promise<ProgressiveHintResponse> {
    try {
      const response = await apiClient.post<ProgressiveHintResponse>(`/interview/coding/session/${sessionId}/hint`, {
        problemId,
        hintLevel,
        code,
      });
      return response.data;
    } catch {
      const response = await apiClient.post<ProgressiveHintResponse>(`/interview/session/${sessionId}/hint`, {
        problemId,
        hintLevel,
        code,
      });
      return response.data;
    }
  },

  async sendDialogue(sessionId: string, problemId: string, message: string, code?: string): Promise<SocraticDialogueResponse> {
    try {
      const response = await apiClient.post<SocraticDialogueResponse>(`/interview/coding/session/${sessionId}/dialogue`, {
        problemId,
        message,
        code,
      });
      return response.data;
    } catch {
      const response = await apiClient.post<SocraticDialogueResponse>(`/interview/session/${sessionId}/dialogue`, {
        problemId,
        message,
        code,
      });
      return response.data;
    }
  },

  async getSession(sessionId: string) {
    try {
      const response = await apiClient.get(`/interview/coding/session/${sessionId}`);
      return response.data;
    } catch {
      const response = await apiClient.get(`/interview/session/${sessionId}`);
      return response.data;
    }
  },
};
