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

// ─── Advanced Oral Interview Engine Types ─────────────────────────

export type EngineState =
  | 'IDLE'
  | 'ASKING'
  | 'LISTENING'
  | 'PROCESSING'
  | 'EVALUATING'
  | 'FOLLOW_UP'
  | 'REPHRASE'
  | 'REPEAT'
  | 'CLARIFICATION'
  | 'DON_T_KNOW'
  | 'THINKING'
  | 'OFF_TOPIC'
  | 'MOVE_NEXT'
  | 'COMPLETED';

export type CandidateIntent =
  | 'ANSWER'
  | 'REPEAT_QUESTION'
  | 'CLARIFICATION'
  | 'DON_T_KNOW'
  | 'THINKING'
  | 'HESITATION'
  | 'TIME_QUERY'
  | 'CONFIRMATION'
  | 'CORRECTION'
  | 'TECHNICAL_QUESTION'
  | 'NON_TECHNICAL_QUESTION'
  | 'OFF_TOPIC'
  | 'SKIP_QUESTION'
  | 'END_INTERVIEW'
  | 'INTERRUPTION';

export type EvaluationQuality =
  | 'STRONG'
  | 'PARTIAL'
  | 'MISSING_DEPTH'
  | 'INCORRECT'
  | 'DON_T_KNOW'
  | 'UNCLEAR';

export type NextAction =
  | 'NEXT_QUESTION'
  | 'PROBE_DEPTH'
  | 'REPHRASE'
  | 'REPEAT'
  | 'CLARIFY'
  | 'MOVE_ON'
  | 'HARDER_FOLLOW_UP'
  | 'SIMPLER_QUESTION'
  | 'CHANGE_TOPIC'
  | 'ANSWER_TECHNICAL_QUERY'
  | 'COMPLETE_INTERVIEW';

export interface AdaptiveDecision {
  nextAction: NextAction;
  targetTopic?: string;
  updatedDifficulty: 'EASY' | 'MEDIUM' | 'HARD';
  shouldAdvanceQuestion: boolean;
  scorePenalty: number;
  reasoning: string;
}

export interface LLMProviderConfig {
  provider: 'OLLAMA' | 'CLOUD' | 'HYBRID';
  ollamaModel?: string;
  cloudModel?: string;
  timeoutMs?: number;
}

export interface StructuredEvaluation {
  intent: CandidateIntent;
  correctness: number; // 0 to 1
  conceptCoverage: number; // 0 to 1
  depth: number; // 0 to 1
  clarity: number; // 0 to 1
  relevance: number; // 0 to 1
  confidence: number; // 0 to 1
  coveredConcepts: string[];
  missingConcepts: string[];
  misconceptions: string[];
  quality: EvaluationQuality;
  score: number; // 0 to 100
  feedback: string;
  recommendedAction: NextAction;
  spokenResponse: string;
  emotion: 'neutral' | 'curious' | 'encouraging' | 'thoughtful' | 'serious';
  gesture: 'nod' | 'tilt' | 'thinking_hand' | 'subtle_smile' | 'neutral';
}

export interface InterviewCalibrationConfig {
  goal:
    | 'GENERAL_PRACTICE'
    | 'CAMPUS_PLACEMENT'
    | 'TECHNICAL_INTERVIEW'
    | 'HR_BEHAVIORAL'
    | 'COMPANY_SPECIFIC'
    | 'ROLE_SPECIFIC'
    | 'FINAL_ROUND_SIMULATION';
  mode: 'PRACTICE' | 'REALISTIC_SIMULATION' | 'STRESS_SIMULATION';
  targetRole: string;
  experienceLevel: ExperienceLevel;
  targetCompany?: string;
  industry?: string;
  jobDescription?: string;
  resumeId?: string;
  extractedSkills: string[];
  topicWeights: Record<string, number>;
  durationMins: number;
  difficulty: Difficulty | 'ADAPTIVE';
  followupIntensity: 'LOW' | 'MEDIUM' | 'HIGH';
  interviewerStyle:
    | 'PROFESSIONAL'
    | 'FRIENDLY'
    | 'CHALLENGING'
    | 'STRICT'
    | 'FAANG_STYLE'
    | 'CAMPUS'
    | 'MANAGERIAL';
  hintAvailability: 'NEVER' | 'AFTER_STRUGGLING' | 'ALWAYS';
}

export interface QuestionRubric {
  requiredConcepts: string[];
  optionalConcepts: string[];
  commonMisconceptions: string[];
  simplerVariant?: string;
  harderVariant?: string;
  followUpQuestions?: string[];
  projectLevel?: number;
}

// ─── Advanced Coding Engine Types ─────────────────────────

export type CodingEnginePhase =
  | 'PROBLEM_READING'
  | 'APPROACH_DISCUSSION'
  | 'ACTIVE_CODING'
  | 'DEBUGGING'
  | 'COMPLEXITY_CHECK'
  | 'CHALLENGE_OPTIMIZATION'
  | 'COMPLETED';

export type CodingEventType =
  | 'PROBLEM_OPENED'
  | 'CANDIDATE_SPEECH_STARTED'
  | 'CANDIDATE_SPEECH_ENDED'
  | 'APPROACH_STARTED'
  | 'APPROACH_EXPLAINED'
  | 'CLARIFICATION_REQUESTED'
  | 'CLARIFICATION_ANSWERED'
  | 'CODE_STARTED'
  | 'CODE_CHANGED'
  | 'CODE_EDIT_PAUSED'
  | 'CODE_EXECUTED'
  | 'COMPILATION_STARTED'
  | 'COMPILATION_FAILED'
  | 'TEST_RUN_STARTED'
  | 'TEST_RUN_COMPLETED'
  | 'TEST_PASSED'
  | 'TEST_FAILED'
  | 'COMPILATION_ERROR'
  | 'CURSOR_IDLE'
  | 'HINT_REQUESTED'
  | 'HINT_DELIVERED'
  | 'COMPLEXITY_ASKED'
  | 'COMPLEXITY_EXPLAINED'
  | 'SOLUTION_SUBMITTED'
  | 'FOLLOWUP_STARTED'
  | 'FOLLOWUP_COMPLETED'
  | 'SUBMITTED'
  | 'INTERVIEW_ENDED';

export interface CodingTimelineEvent {
  timestamp: string;
  eventType: CodingEventType;
  description: string;
  codeSnapshot?: string;
  testPassedCount?: number;
  totalTests?: number;
}

export interface CodingMultidimensionalScore {
  problemUnderstanding: number; // 0 to 100
  approach: number;
  codeCorrectness: number;
  complexityAnalysis: number;
  debugging: number;
  communication: number;
  testing: number;
  hintIndependence: number;
  overallScore: number;
}

// ─── Synthetic Candidate & Persistent Event Log Types ─────────

export type SyntheticCandidateProfile =
  | 'STRONG'
  | 'WEAK'
  | 'MIXED'
  | 'DON_T_KNOW'
  | 'REPEAT'
  | 'CLARIFICATION'
  | 'HINT'
  | 'TECHNICAL_QUESTION'
  | 'CORRECTION'
  | 'TIME_QUERY';

export interface InterviewEventLog {
  id: string;
  sessionId: string;
  timestampSecs: number;
  eventType: 'QUESTION_ASKED' | 'CANDIDATE_SPOKE' | 'INTENT_DETECTED' | 'ANSWER_EVALUATED' | 'ADAPTIVE_DECISION' | 'HINT_GIVEN' | 'CODE_SUBMITTED' | 'COMPILER_RESULT';
  speaker?: 'AVA' | 'CANDIDATE';
  text?: string;
  codeSnapshot?: string;
  metadata?: Record<string, any>;
  evaluationNote?: {
    type: 'STRONG' | 'IMPROVEMENT' | 'CRITICAL' | 'HINT';
    title: string;
    details: string;
    score?: number;
    coveredConcepts?: string[];
    missingConcepts?: string[];
  };
}

// ─── Interview Replay Snapshot Model ─────────────────────────

export interface InterviewReplayEvent {
  timestampSecs: number;
  timeFormatted: string;
  eventType: 'INTERVIEWER_SPOKE' | 'CANDIDATE_SPOKE' | 'CODE_SNAPSHOT' | 'HINT_GIVEN' | 'COMPILER_TEST';
  speaker?: 'AVA' | 'CANDIDATE';
  text?: string;
  codeSnapshot?: string;
  avatarEmotion?: string;
  avatarGesture?: string;
  evaluationNote?: {
    type: 'STRONG' | 'IMPROVEMENT' | 'CRITICAL' | 'HINT';
    title: string;
    details: string;
  };
}

// ─── Placement Preparation Engine Types ─────────────────────────

export type PrepSubject =
  | 'APTITUDE'
  | 'REASONING'
  | 'VERBAL'
  | 'DATA_INTERPRETATION'
  | 'PROGRAMMING'
  | 'DSA'
  | 'CODING_PATTERNS'
  | 'COMPETITIVE'
  | 'OOP'
  | 'DBMS'
  | 'SQL'
  | 'OPERATING_SYSTEMS'
  | 'COMPUTER_NETWORKS'
  | 'COMPUTER_ARCHITECTURE'
  | 'SOFTWARE_ENGINEERING'
  | 'LLD'
  | 'HLD'
  | 'SYSTEM_DESIGN_FUNDAMENTALS'
  | 'FRONTEND'
  | 'BACKEND'
  | 'WEB_DEV'
  | 'APIS'
  | 'GIT'
  | 'LINUX'
  | 'DEVOPS'
  | 'AI_ML'
  | 'CYBER_SECURITY'
  | 'HR_BEHAVIORAL_PREP'
  | 'COMPANY_PREP';

export type PrepCategoryType =
  | 'FUNDAMENTALS'
  | 'CODING'
  | 'CORE_CS'
  | 'SYSTEM_DESIGN'
  | 'DEVELOPMENT'
  | 'SPECIALIZED'
  | 'INTERVIEW_PREP';

export interface PrepTopic {
  id: string;
  subject: PrepSubject;
  title: string;
  description: string;
  estimatedTimeMins: number;
  readinessPercentage: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'MASTERED';
  iconName?: string;
  concepts: string[];
  prerequisites?: string[];
}

export interface PrepFormulaSheet {
  title: string;
  formula: string;
  explanation: string;
  example: string;
  commonTraps: string;
}

export interface PrepCodingPattern {
  id: string;
  patternName: string;
  whenToUse: string;
  clues: string[];
  templateCode: string;
  commonMistakes: string[];
  sampleProblems: string[];
}

export interface PrepLLDProblem {
  id: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  requirements: string[];
  entities: string[];
  classes: string[];
  patternsUsed: string[];
  skeletonCode: string;
}

export interface PrepHLDCaseStudy {
  id: string;
  title: string;
  estimatedCapacity: string;
  architectureComponents: string[];
  databaseStrategy: string;
  cachingStrategy: string;
  tradeoffs: string[];
}

export interface PrepQuestion {
  id: string;
  subject: PrepSubject;
  topicId: string;
  concept: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  estimatedTimeSecs: number;
  source?: string;
}

export interface SkillNode {
  id: string;
  label: string;
  score: number;
  status: 'STRONG' | 'NEEDS_WORK' | 'CRITICAL';
  children?: SkillNode[];
}

export interface PlacementReadinessBreakdown {
  overallScore: number | null; // null if un-assessed
  technicalKnowledge: number | null;
  problemSolving: number | null;
  aptitude: number | null;
  communication: number | null;
  coding: number | null;
  coreCs: number | null;
  systemDesign: number | null;
  development: number | null;
  interviewPerformance: number | null;
  resumeScore: number | null;
  gaps: string[];
  evidenceStrength: 'NOT_ASSESSED' | 'LIMITED' | 'MODERATE' | 'STRONG';
}

// ─── Persistence & Attempt Event Models ─────────────────────────

export interface QuestionAttempt {
  questionId: string;
  topicId: string;
  concept: string;
  selectedAnswerIndex: number;
  isCorrect: boolean;
  timeSpentSecs: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timestamp: string;
}

export interface AssessmentAttempt {
  id: string;
  userId: string;
  subject: PrepSubject;
  startedAt: string;
  completedAt?: string;
  score: number;
  accuracy: number;
  totalQuestions: number;
  questionAttempts: QuestionAttempt[];
  status: 'IN_PROGRESS' | 'COMPLETED';
}

export interface PracticeSessionRecord {
  id: string;
  userId: string;
  topicId: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSecs: number;
  weakConcepts: string[];
  timestamp: string;
}

export interface LearningProgressRecord {
  topicId: string;
  completionPercentage: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'MASTERED';
  lastStudiedAt: string;
  quickCheckResults: Record<number, boolean>;
}

export interface PreparationRecommendation {
  id: string;
  type: 'LEARN' | 'PRACTICE' | 'TEST';
  title: string;
  reason: string;
  targetRoute: string;
  estimatedTime: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export type PracticeModeType = 'TOPIC' | 'WEAK_AREA' | 'MIXED' | 'DAILY';

export interface CompanyTrackSection {
  id: string;
  order: number;
  title: string;
  description: string;
  interviewType: 'TECHNICAL' | 'HR_BEHAVIORAL' | 'FULL_SIMULATION';
  durationMins: number;
  skills: string[];
  focusAreas: string[];
  prerequisites?: string[];
}

export interface CompanyInterviewTrack {
  id: string;
  companyName: string;
  companySlug: string;
  role: string;
  roleSlug: string;
  description: string;
  icon?: string;
  color?: string;
  sections: CompanyTrackSection[];
}

export interface CompanyTrackProgress {
  trackId: string;
  companySlug: string;
  roleSlug: string;
  completedSections: string[];
  sectionScores: Record<string, number>;
  overallTrackScore?: number;
  completedAt?: string;
}





