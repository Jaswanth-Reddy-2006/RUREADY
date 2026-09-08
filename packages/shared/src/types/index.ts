// ═══════════════════════════════════════════════════════════════
// R U Ready? — Shared Types
// All enums, DTOs, and API types shared between client & server
// ═══════════════════════════════════════════════════════════════

// ─── Enums ───────────────────────────────────────────────────

export enum InterviewType {
  INTERNSHIP = 'INTERNSHIP',
  JOB = 'JOB',
  PROMOTION = 'PROMOTION',
  PRACTICE = 'PRACTICE',
  HR_ROUND = 'HR_ROUND',
  COMMUNICATION = 'COMMUNICATION',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
  DATA_SCIENCE = 'DATA_SCIENCE',
  PRODUCT_MANAGER = 'PRODUCT_MANAGER',
  STARTUP = 'STARTUP',
  CAREER_SWITCH = 'CAREER_SWITCH',
  LEADERSHIP = 'LEADERSHIP',
  CODING = 'CODING',
}

export enum ExperienceLevel {
  FRESHER = 'FRESHER',
  MID = 'MID',
  SENIOR = 'SENIOR',
}

export enum SessionStatus {
  SETUP = 'SETUP',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ANALYSED = 'ANALYSED',
}

export enum QuestionType {
  TECHNICAL = 'TECHNICAL',
  BEHAVIOURAL = 'BEHAVIOURAL',
  SITUATIONAL = 'SITUATIONAL',
  RESUME_BASED = 'RESUME_BASED',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum ReadinessVerdict {
  NOT_READY = 'NOT_READY',
  ALMOST_READY = 'ALMOST_READY',
  READY = 'READY',
  STRONG = 'STRONG',
}

// ─── User Types ──────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'ADMIN' | 'CANDIDATE';
  plan?: 'FREE' | 'STARTER' | 'PRO' | 'ULTIMATE';
  createdAt: string;
  updatedAt: string;
}

// ─── Auth DTOs ───────────────────────────────────────────────

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

// ─── Resume Types ────────────────────────────────────────────

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  parsedText?: string;
  skills: string[];
  experience?: Record<string, unknown>;
  uploadedAt: string;
}

// ─── Interview Session Types ─────────────────────────────────

export interface CreateSessionRequest {
  interviewType: InterviewType;
  targetRole: string;
  targetCompany?: string;
  industry: string;
  experienceLevel: ExperienceLevel;
  focusAreas: string[];
  interviewGoal?: string;
  durationMins: number;
  resumeId?: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  resumeId?: string;
  interviewType: InterviewType;
  targetRole: string;
  targetCompany?: string;
  industry: string;
  experienceLevel: ExperienceLevel;
  focusAreas: string[];
  interviewGoal?: string;
  durationMins: number;
  status: SessionStatus;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  questions?: Question[];
  analysis?: Analysis;
  mode?: 'ORAL' | 'CODING';
  hintCount?: number;
  testCasesPassed?: number;
  selectedLanguage?: string;
  telemetryLogs?: TelemetryLog[];
}

export interface TelemetryLog {
  id: string;
  sessionId: string;
  type: string;
  wordsPerMinute?: number | null;
  fillerWordsCount?: number | null;
  stressCoefficient?: number | null;
  timestamp: string;
}


// ─── Question Types ──────────────────────────────────────────

export interface Question {
  id: string;
  sessionId: string;
  orderIndex: number;
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  answerText?: string;
  answeredAt?: string;
  timeTakenSecs?: number;
  evalScore?: number;
  evalFeedback?: string;
  evalStrengths: string[];
  evalWeaknesses: string[];
  betterAnswer?: string;
}

export interface SubmitAnswerRequest {
  questionId: string;
  answerText: string;
  timeTaken: number;
}

// ─── Analysis Types ──────────────────────────────────────────

export interface ActionableTip {
  tip: string;
  reason: string;
  resource?: string;
}

export interface Analysis {
  id: string;
  sessionId: string;
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  structureScore: number;
  confidenceMeterScore?: number;
  confidenceSignals?: {
    avgWpm: number;
    avgPauseCount: number;
    avgAnswerLength: number;
  };
  eyeContactScore?: number;
  presenceScore?: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  actionableTips: ActionableTip[];
  readinessVerdict: ReadinessVerdict;
  createdAt: string;
}

// ─── API Error Response ──────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
  requestId: string;
}

// ─── Pagination ──────────────────────────────────────────────

export interface PaginatedRequest {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Industry Options ────────────────────────────────────────

export const INDUSTRIES = [
  'Tech',
  'Finance',
  'Marketing',
  'Healthcare',
  'Education',
  'Consulting',
  'Other',
] as const;

export type Industry = (typeof INDUSTRIES)[number];

// ─── Focus Area Options ──────────────────────────────────────

export const FOCUS_AREAS = [
  'DSA',
  'System Design',
  'Behavioural',
  'Communication',
  'Leadership',
  'Domain Knowledge',
  'HR Questions',
  'Case Studies',
  'Performance Optimization',
  'Security & Privacy',
  'ML & Data Science',
  'Product Sense',
  'APIs & Integrations',
] as const;

export type FocusArea = (typeof FOCUS_AREAS)[number];

// ─── Payment Types ─────────────────────────────────────────────

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'MONTHLY' | 'YEARLY' | 'ONE_TIME';
  features: string[];
}

export interface PaymentOrder {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  status: 'CREATED' | 'PAID' | 'FAILED' | 'CANCELLED';
  providerOrderId?: string;
  createdAt: string;
}

export interface PaymentVerificationRequest {
  orderId: string;
  paymentId: string;
  signature?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'FREE' | 'STARTER' | 'PRO' | 'ULTIMATE';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  currentPeriodEnd: string;
}

// ─── User Profile Types ───────────────────────────────────────

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  title?: string;
  experienceYears?: number;
  targetRoles?: string[];
  updatedAt: string;
}

