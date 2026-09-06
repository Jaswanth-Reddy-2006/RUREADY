// Re-export all shared types
export type {
  User,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  RefreshResponse,
  Resume,
  CreateSessionRequest,
  InterviewSession,
  Question,
  SubmitAnswerRequest,
  ActionableTip,
  Analysis,
  ApiError,
  PaginatedRequest,
  PaginatedResponse,
  Industry,
  FocusArea,
} from '@ru-ready/shared';

export {
  InterviewType,
  ExperienceLevel,
  SessionStatus,
  QuestionType,
  Difficulty,
  ReadinessVerdict,
  INDUSTRIES,
  FOCUS_AREAS,
} from '@ru-ready/shared';

// ─── Frontend-Specific Types ─────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
}

export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}
