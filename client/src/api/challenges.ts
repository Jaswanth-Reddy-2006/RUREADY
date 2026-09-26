// ═══════════════════════════════════════════════════════════════
// RU Ready? — Challenges API Client
// ═══════════════════════════════════════════════════════════════

import apiClient from './client';

export interface ChallengeUserStats {
  userId: string;
  rating: number;
  wins: number;
  losses: number;
  matchesPlayed: number;
  winRate: number;
  rankTier: string;
}

export interface ChallengeRoom {
  id: string;
  roomCode: string;
  title: string;
  type: 'BATTLE_1V1' | 'CONTEST' | 'QUIZ';
  visibility: 'PUBLIC' | 'PRIVATE';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED';
  topic: string;
  language: string;
  maxParticipants: number;
  durationMinutes: number;
  status: 'WAITING' | 'COUNTDOWN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  hostName?: string;
  createdAt: number;
  participants: Array<{
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    isHost: boolean;
    isReady: boolean;
  }>;
  problem?: any;
  activeMatchId?: string;
}

export interface MatchParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  ratingBefore: number;
  ratingAfter: number;
  score: number;
  passedTests: number;
  totalTests: number;
  timeTakenSec: number;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'WON' | 'LOST' | 'TIED' | 'DISCONNECTED';
  xpAwarded: number;
  code?: string;
  language?: string;
}

export interface MatchSession {
  id: string;
  roomId?: string;
  matchType: 'RANKED_1V1' | 'CASUAL_1V1' | 'CONTEST';
  difficulty: string;
  topic: string;
  problem: {
    id: string;
    title: string;
    difficulty: string;
    topicTags: string[];
    description: string;
    constraints: string[];
    examples: Array<{ input: string; output: string; explanation?: string }>;
    starterCodes: Record<string, string>;
    testCases: Array<{ input: any; expected: any; description?: string }>;
  };
  status: 'COUNTDOWN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt: number;
  endsAt: number;
  winnerId?: string;
  participants: Record<string, MatchParticipant>;
  submissions: Array<{
    id: string;
    userId: string;
    userName: string;
    language: string;
    passed: number;
    total: number;
    execTimeMs: number;
    isAllPassed: boolean;
    submittedAt: number;
  }>;
}

export interface QuizSession {
  id: string;
  sessionCode: string;
  title: string;
  category: string;
  difficulty: string;
  status: 'LOBBY' | 'QUESTION_ACTIVE' | 'ANSWER_REVEAL' | 'COMPLETED';
  currentQuestionIndex: number;
  totalQuestions: number;
  timePerQuestionSec: number;
  questionStartedAt?: number;
  questions: Array<{
    id: string;
    category: string;
    topic: string;
    difficulty: string;
    question: string;
    options: string[];
    correctIndex?: number;
    explanation?: string;
  }>;
  participants: Record<string, {
    userId: string;
    userName: string;
    userAvatar?: string;
    score: number;
    correctAnswers: number;
    streak: number;
  }>;
  createdBy: string;
  createdAt: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  rating: number;
  wins: number;
  losses: number;
  matchesPlayed: number;
  winRate: number;
  rankTier: string;
}

export const challengesApi = {
  async getHubOverview(userId?: string) {
    const res = await apiClient.get('/challenges/hub', {
      params: { userId },
    });
    return res.data;
  },

  async createRoom(data: {
    hostId: string;
    hostName: string;
    hostAvatar?: string;
    title: string;
    type?: 'BATTLE_1V1' | 'CONTEST' | 'QUIZ';
    visibility?: 'PUBLIC' | 'PRIVATE';
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED';
    topic?: string;
    language?: string;
    maxParticipants?: number;
    durationMinutes?: number;
  }) {
    const res = await apiClient.post('/challenges/rooms', data);
    return res.data;
  },

  async getRoom(roomIdOrCode: string) {
    const res = await apiClient.get(`/challenges/rooms/${roomIdOrCode}`);
    return res.data;
  },

  async listRooms() {
    const res = await apiClient.get('/challenges/rooms');
    return res.data;
  },

  async joinRoom(roomCodeOrId: string, data: { userId: string; userName: string; userAvatar?: string }) {
    const res = await apiClient.post(`/challenges/rooms/${roomCodeOrId}/join`, data);
    return res.data;
  },

  async getMatch(matchId: string) {
    const res = await apiClient.get(`/challenges/matches/${matchId}`);
    return res.data;
  },

  async runSampleTests(data: { problemId: string; code: string; language: string }) {
    const res = await apiClient.post('/challenges/matches/run-tests', data);
    return res.data;
  },

  async submitSolution(matchId: string, data: { userId: string; userName: string; code: string; language: string }) {
    const res = await apiClient.post(`/challenges/matches/${matchId}/submit`, data);
    return res.data;
  },

  async createQuiz(data: {
    hostId: string;
    hostName: string;
    hostAvatar?: string;
    category?: string;
    questionCount?: number;
    timePerQuestionSec?: number;
  }) {
    const res = await apiClient.post('/challenges/quizzes', data);
    return res.data;
  },

  async getQuizSession(sessionIdOrCode: string) {
    const res = await apiClient.get(`/challenges/quizzes/${sessionIdOrCode}`);
    return res.data;
  },

  async submitQuizAnswer(sessionId: string, data: { userId: string; questionIndex: number; selectedIndex: number }) {
    const res = await apiClient.post(`/challenges/quizzes/${sessionId}/answer`, data);
    return res.data;
  },

  async getLeaderboard(limit = 20) {
    const res = await apiClient.get('/challenges/leaderboard', {
      params: { limit },
    });
    return res.data;
  },

  async getUserRating(userId: string) {
    const res = await apiClient.get(`/challenges/ratings/${userId}`);
    return res.data;
  },

  async getUserHistory(userId: string) {
    const res = await apiClient.get(`/challenges/history/${userId}`);
    return res.data;
  },
};
