import apiClient from './client';
import { CreateSessionRequest, InterviewSession, Question } from '@ru-ready/shared';

export const oralApi = {
  async createSession(data: CreateSessionRequest): Promise<InterviewSession> {
    const response = await apiClient.post<InterviewSession>('/interview/oral/session', data);
    return response.data;
  },

  async startSession(sessionId: string): Promise<{ session: InterviewSession; currentQuestion: Question }> {
    const response = await apiClient.post<{ session: InterviewSession; currentQuestion: Question }>(
      `/interview/oral/session/${sessionId}/start`
    );
    return response.data;
  },

  async submitAnswer(sessionId: string, questionId: string, answerText: string, timeTaken: number): Promise<Question> {
    const response = await apiClient.post<Question>(`/interview/oral/session/${sessionId}/answer`, {
      questionId,
      answerText,
      timeTaken,
    });
    return response.data;
  },

  async getSession(sessionId: string): Promise<InterviewSession> {
    const response = await apiClient.get<InterviewSession>(`/interview/oral/session/${sessionId}`);
    return response.data;
  },

  async listSessions(): Promise<InterviewSession[]> {
    const response = await apiClient.get<InterviewSession[]>('/interview/oral/sessions');
    return response.data;
  },

  async completeSession(sessionId: string): Promise<InterviewSession> {
    const response = await apiClient.post<InterviewSession>(`/interview/oral/session/${sessionId}/complete`);
    return response.data;
  },
};
