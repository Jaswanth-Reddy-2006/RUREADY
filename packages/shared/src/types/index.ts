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
  category?: string;
  answerText?: string;
  answeredAt?: string;
  timeTakenSecs?: number;
  evalScore?: number;
  evalFeedback?: string;
  evalStrengths: string[];
  evalWeaknesses: string[];
  betterAnswer?: string;
  whatWentWell?: string[];
  whatCouldBeImproved?: string[];
  suggestedAnswerStructure?: string[];
  followUpQuestionText?: string;
  followUpAnswerText?: string;
  followUpScore?: number;
  isSkip?: boolean;
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

export interface StageBreakdownItem {
  stageNumber: number;
  stageName: string;
  questionCount: number;
  durationMins: number;
  score: number;
  description?: string;
}

export interface PerformanceTimelineItem {
  questionIndex: number;
  questionLabel: string;
  score: number;
  rating: 'Strong' | 'Good' | 'Needs Improvement' | 'Weak';
  category?: string;
  durationSecs?: number;
  questionText?: string;
}

export interface InterviewSummaryMeta {
  totalQuestionsAsked: number;
  questionsAnswered: number;
  questionsSkipped: number;
  averageAnswerLengthMinutes: number;
  longestAnswerMinutes: number;
  shortestAnswerMinutes: number;
  followUpQuestionsCount: number;
  topicsCovered: string[];
}

export interface PersonalizedRecommendation {
  priority: number;
  title: string;
  weakness: string;
  action: string;
  expectedOutcome: string;
  practiceResource?: string;
}

export interface PracticeResourceItem {
  title: string;
  subtitle: string;
  category: string;
  link: string;
  iconType?: string;
}

export interface Analysis {
  id: string;
  sessionId: string;
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  structureScore: number;
  problemSolvingScore?: number;
  depthScore?: number;
  relevanceScore?: number;
  industryReadinessScore?: number;
  categoryScores?: Record<string, number>;
  confidenceMeterScore?: number;
  confidenceSignals?: {
    avgWpm: number;
    avgPauseCount: number;
    avgAnswerLength: number;
    corporateBenchmark?: any;
    timeComplexity?: string;
    spaceComplexity?: string;
  };
  eyeContactScore?: number;
  presenceScore?: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  actionableTips: ActionableTip[];
  readinessVerdict: ReadinessVerdict;
  stageBreakdown?: StageBreakdownItem[];
  performanceTimeline?: PerformanceTimelineItem[];
  interviewSummary?: InterviewSummaryMeta;
  recommendations?: PersonalizedRecommendation[];
  practiceResources?: PracticeResourceItem[];
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

// ─── Career Roadmap & Dynamic Generation Engine Types ─────────

export type RoadmapTier =
  | 'FAANG'
  | 'Unicorn'
  | 'Tier-1 FinTech'
  | 'High-Growth Startup'
  | 'Enterprise';

export type RoadmapLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'STAFF';

export type NodeStatus = 'LOCKED' | 'IN_PROGRESS' | 'MASTERED';

export type SprintState =
  | 'UPCOMING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'EXTENDED'
  | 'SKIPPED'
  | 'CANCELLED';

export type TaskState = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';

export type AdaptationAction =
  | 'ACCELERATE_TASK'
  | 'INSERT_REINFORCEMENT'
  | 'EXTEND_SPRINT'
  | 'REDUCE_WORKLOAD'
  | 'INCREASE_PRACTICE';

export type SkillEvidenceType =
  | 'SELF_REPORTED'
  | 'ASSESSMENT'
  | 'CODING_INTERVIEW'
  | 'ORAL_INTERVIEW'
  | 'PROJECT'
  | 'ROADMAP_SPRINT';

export interface RoadmapResourceSource {
  id: string;
  title: string;
  url: string;
  type: 'DOCS' | 'COURSE' | 'REPO' | 'BOOK' | 'ARTICLE';
  description?: string;
}

export interface PracticalDrillTestCase {
  input: any;
  expected: any;
  description?: string;
}

export interface RoadmapPracticalDrill {
  title: string;
  description: string;
  deliverable: string;
  starterCode?: string;
  verificationChecklist: string[];
  language?: string;
  entryPoint?: string;
  testCases?: PracticalDrillTestCase[];
}

export interface RoadmapMicroQuestion {
  id: string;
  questionText: string;
  focus: string;
  suggestedAnswer?: string;
}

export interface RoadmapNodeDefinition {
  id: string;
  phaseId?: string;
  title: string;
  subHeader?: string;
  category: string;
  orderIndex: number;
  estimatedHours: number;
  estimatedMinutes?: number;
  requiresEvidence?: boolean;
  requiresAssessment?: boolean;
  targetProficiency?: number;
  status: NodeStatus;
  score: number;
  skills: Array<{
    name: string;
    category: string;
    targetProficiency?: number;
  }>;
  prerequisiteNodeIds?: string[];
  whatShouldIDo: {
    summary: string;
    actionSteps: string[];
    mentalModels: string[];
  };
  whatIsTheSource: RoadmapResourceSource[];
  whatIsTheExactThing: RoadmapPracticalDrill;
  microQuestions: RoadmapMicroQuestion[];
}

export interface RoadmapPhaseDefinition {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  nodes: RoadmapNodeDefinition[];
}

export interface CareerRoadmapDTO {
  id: string;
  userId: string;
  title: string;
  description?: string;
  rolePath: string;
  targetCompanyTier: RoadmapTier;
  difficulty: RoadmapLevel;
  overallReadiness: number;
  estimatedWeeks: number;
  isOfficial: boolean;
  isPublic: boolean;
  isAiGenerated: boolean;
  creatorId?: string;
  creatorName?: string;
  creatorUsername?: string;
  creatorAvatar?: string;
  creatorRole?: string;
  enrolledCount?: number;
  upvotes?: number;
  tags: string[];
  phases: RoadmapPhaseDefinition[];
  nodesData: RoadmapNodeDefinition[];
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapGenerationInput {
  targetRole: string;
  targetCompany?: string;
  targetCompanyTier?: RoadmapTier;
  targetOutcome?: string;
  currentLevel?: RoadmapLevel | ExperienceLevel;
  timelineWeeks?: number;
  hoursPerDay?: number;
  daysPerWeek?: number;
  sprintDurationDays?: 7 | 10;
  knownSkills?: string[];
  identifiedBlindspots?: string[];
  focusAreas?: string[];
  preferredTechnologies?: string[];
  pedagogicalPriority?: 'PLACEMENT' | 'PROJECTS' | 'PRINCIPLES';
  userEvidence?: Array<{ skillSlug?: string; skillName?: string; score: number }> | Record<string, number>;
  freeOnly?: boolean;
  budgetCents?: number;
  currency?: string;
}

export interface SkillGapAnalysisResult {
  targetRole: string;
  totalRequiredSkills: number;
  masteredSkillsCount: number;
  unmetSkillsCount: number;
  overallReadinessBaseline: number;
  skillGaps: Array<{
    skillName: string;
    category: string;
    requiredProficiency: number;
    currentProficiency: number;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    recommendedFocus: string;
  }>;
}

export interface RoadmapGenerationResult {
  roadmap: CareerRoadmapDTO;
  skillGapAnalysis: SkillGapAnalysisResult;
  generationMetadata: {
    modelUsed: string;
    totalPhases: number;
    totalMilestones: number;
    estimatedTotalHours: number;
    generatedAt: string;
  };
}

export interface SprintTaskDTO {
  id: string;
  sprintId: string;
  roadmapNodeId?: string | null;
  skillId?: string | null;
  skills?: Array<{ id: string; name: string; slug?: string }>;
  roadmapNode?: {
    id: string;
    skills?: Array<{
      nodeId: string;
      skillId: string;
      targetProficiency?: number | null;
      skill?: {
        id: string;
        name: string;
        slug: string;
        category: string;
      };
    }>;
  } | null;
  title: string;
  description?: string | null;
  orderIndex: number;
  estimatedMinutes: number;
  requiresEvidence: boolean;
  requiresAssessment?: boolean;
  status: TaskState;
  completedAt?: string | null;
}

export interface RoadmapSprintDTO {
  id: string;
  userRoadmapId: string;
  sprintNumber: number;
  startDate: string;
  endDate: string;
  objective: string;
  expectedMinutes: number;
  status: SprintState;
  decision?: 'CONTINUE' | 'ACCELERATE' | 'EXTEND' | 'REMEDIATE' | null;
  tasks: SprintTaskDTO[];
}

export interface UserRoadmapDTO {
  id: string;
  userId: string;
  sourceRoadmapId: string;
  sourceRoadmap: CareerRoadmapDTO;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
  personalization: {
    targetRole: string;
    hoursPerDay: number;
    daysPerWeek: number;
    sprintDurationDays: 7 | 10;
    preferredTechnologies?: string[];
  };
  sprints: RoadmapSprintDTO[];
  skillEvidence?: SkillEvidenceDTO[];
  overallReadiness?: number;
  calibratedReadiness?: RoadmapReadinessAnalyticsDTO;
  createdAt: string;
  updatedAt: string;
}

export interface SkillEvidenceDTO {
  id: string;
  userRoadmapId: string;
  skillId: string;
  source: 'SELF_REPORTED' | 'ASSESSMENT' | 'CODING_INTERVIEW' | 'ORAL_INTERVIEW' | 'PROJECT' | 'ROADMAP_SPRINT';
  estimatedProficiency?: number | null;
  demonstratedScore?: number | null;
  confidence: number;
  externalReference?: string | null;
  metadata?: Record<string, unknown> | null;
  assessedAt: string;
  skill?: {
    id: string;
    slug: string;
    name: string;
    category: string;
    description?: string | null;
  };
}

export interface SelfReportedEvidenceInput {
  skillId: string;
  estimatedProficiency?: number;
  notes?: string;
}

export interface SprintPerformanceInput {
  assessmentScore?: number;
  practicalScore?: number;
  codingScore?: number;
  interviewScore?: number;
  consistencyScore?: number;
  notes?: string;
}

export interface AdaptationRecommendationDTO {
  decision: 'CONTINUE' | 'ACCELERATE' | 'EXTEND' | 'REMEDIATE';
  action: 'ACCELERATE_TASK' | 'INSERT_REINFORCEMENT' | 'EXTEND_SPRINT' | 'REDUCE_WORKLOAD' | 'INCREASE_PRACTICE' | null;
  reason: string;
}

export interface SkillPerformanceMetricDTO {
  skillId: string;
  skillName: string;
  category?: string;
  mcqScore: number | null;
  practicalScore: number | null;
  evidenceCount: number;
  demonstrated: boolean;
}

export interface UnifiedSprintTelemetryDTO {
  sprintId: string;
  userRoadmapId: string;
  sprintNumber: number;
  taskCompletionRate: number;
  totalTasks: number;
  completedTasks: number;
  skippedTasks: number;
  assessmentScore: number | null;
  assessmentPassed: boolean | null;
  requiredAssessmentsTotal: number;
  requiredAssessmentsPassed: number;
  practicalScore: number | null;
  practicalPassed: boolean | null;
  requiredPracticalsTotal: number;
  requiredPracticalsPassed: number;
  evidenceCount: number;
  skillsDemonstrated: string[];
  skillBreakdown: SkillPerformanceMetricDTO[];
  calculatedAt: string;
}

export interface SprintReviewResultDTO {
  sprint: RoadmapSprintDTO & { performance?: any };
  recommendation: AdaptationRecommendationDTO;
  nextSprint: RoadmapSprintDTO | null;
  telemetry?: UnifiedSprintTelemetryDTO;
}

// ─── Calibrated Skill Graph & Roadmap Readiness (Stage 5.6) ───

export type SkillMasteryStatus = 'NO_EVIDENCE' | 'IN_PROGRESS' | 'DEMONSTRATED' | 'MASTERED';

export interface CalibratedSkillMasteryDTO {
  skillId: string;
  skillName: string;
  category?: string;
  targetProficiency: number;
  currentProficiency: number;
  status: SkillMasteryStatus;
  mcqScore: number | null;
  practicalScore: number | null;
  evidenceCount: number;
  prerequisites: string[];
  missingPrerequisites: string[];
  isGatedByPrerequisites: boolean;
}

export interface ReadinessDomainBenchmarkDTO {
  name: string;
  score: number;
  benchmark: number;
}

export interface RoadmapReadinessAnalyticsDTO {
  userRoadmapId: string;
  roadmapId: string;
  targetRole: string;
  targetCompanyTier: string;
  overallReadiness: number;
  baselineReadiness: number;
  masteredSkillsCount: number;
  totalRequiredSkills: number;
  inProgressSkillsCount: number;
  skillsWithMissingPrerequisitesCount: number;
  skills: CalibratedSkillMasteryDTO[];
  domains: ReadinessDomainBenchmarkDTO[];
  estimatedWeeksRemaining: number;
  calculatedAt: string;
}

// ─── Roadmap Micro-Assessment Types (Stage 5.1) ───────────────

export interface MicroAssessmentQuestionDTO {
  id: string;
  questionText: string;
  options: string[];
  orderIndex: number;
}

export interface MicroAssessmentDTO {
  id: string;
  title: string;
  description?: string | null;
  roadmapNodeId?: string | null;
  skillId?: string | null;
  skillName?: string | null;
  questions: MicroAssessmentQuestionDTO[];
  createdAt: string;
}

export interface SubmitAssessmentAnswerItem {
  questionId: string;
  selectedOptionIndex: number;
}

export interface SubmitAssessmentInput {
  assessmentId: string;
  userRoadmapId?: string;
  sprintId?: string;
  sprintTaskId?: string;
  skillId?: string;
  answers: SubmitAssessmentAnswerItem[];
}

export interface QuestionEvaluationResult {
  questionId: string;
  questionText: string;
  selectedOptionIndex: number;
  correctOptionIndex: number;
  isCorrect: boolean;
  explanation?: string | null;
}

export interface AssessmentAttemptResultDTO {
  id: string;
  assessmentId: string;
  userId: string;
  userRoadmapId?: string | null;
  sprintId?: string | null;
  sprintTaskId?: string | null;
  skillId?: string | null;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  questionResults: QuestionEvaluationResult[];
  evidenceRecorded: boolean;
  adaptationRecommendation?: AdaptationRecommendationDTO | null;
  completedAt: string;
}

export interface PracticalDrillTestCaseResult {
  testCaseIndex: number;
  name?: string;
  passed: boolean;
  input?: any;
  expected?: any;
  actual?: any;
  executionTimeMs: number;
  error?: string;
  description?: string;
}

export interface SubmitPracticalDrillInput {
  roadmapId?: string;
  nodeId?: string;
  userRoadmapId?: string;
  sprintTaskId?: string;
  skillId?: string;
  code: string;
  language: string;
  entryPoint?: string;
}

export interface PracticalDrillResultDTO {
  id: string;
  success: boolean;
  passed: boolean;
  score: number;
  passedCount: number;
  totalCount: number;
  testResults: PracticalDrillTestCaseResult[];
  errorDetails?: string;
  stdout?: string;
  runtimeMs: number;
  language: string;
  evidenceRecorded: boolean;
  evidenceId?: string | null;
  skillId?: string | null;
  completedAt: string;
}

// ─── Verified Career Readiness Profile Types (Stage 5.7 / Stage 7.3) ──

export interface AssessmentPerformanceSummaryDTO {
  totalAttempts: number;
  passedAttempts: number;
  averageScore: number | null;
}

export interface PracticalPerformanceSummaryDTO {
  totalDrills: number;
  passedDrills: number;
  averageScore: number | null;
}

export interface PublicSprintArchiveDTO {
  sprintNumber: number;
  objective: string;
  status: SprintState;
  completedAt?: string | null;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  skillsAddressed: string[];
  decision?: 'CONTINUE' | 'ACCELERATE' | 'EXTEND' | 'REMEDIATE' | null;
}

export interface PublicEvidenceItemDTO {
  id: string;
  skillName?: string | null;
  skillCategory?: string | null;
  source: SkillEvidenceType;
  verificationSource: 'PLATFORM_VERIFIED' | 'LEARNER_PROVIDED';
  demonstratedScore?: number | null;
  confidence: number;
  externalReference?: string | null;
  externalUrl?: string | null;
  assessedAt: string;
  isPractical: boolean;
}

export interface PublicAssessmentItemDTO {
  id: string;
  title: string;
  skillName?: string | null;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
}

export interface PublicTimelineItemDTO {
  id: string;
  type: 'SPRINT_COMPLETED' | 'TASK_COMPLETED' | 'ASSESSMENT_PASSED' | 'PRACTICAL_DRILL' | 'SKILL_EVIDENCE';
  title: string;
  date: string;
  verificationSource: 'PLATFORM_VERIFIED' | 'LEARNER_PROVIDED';
  skillName?: string | null;
  score?: number | null;
  externalReference?: string | null;
}

export interface VerifiedCareerProfileDTO {
  verificationId: string;
  userRoadmapId: string;
  roadmapId: string;
  candidateName?: string;
  targetRole: string;
  targetCompanyTier: string;
  overallReadiness: number;
  baselineReadiness: number;
  masteredSkillsCount: number;
  totalRequiredSkills: number;
  inProgressSkillsCount: number;
  skillsWithMissingPrerequisitesCount: number;
  masteredSkills: string[];
  demonstratedSkills: string[];
  skillsInProgress: string[];
  missingPrerequisites: string[];
  completedSprintCount: number;
  totalSprintCount: number;
  verifiedEvidenceCount: number;
  assessmentSummary: AssessmentPerformanceSummaryDTO;
  practicalSummary: PracticalPerformanceSummaryDTO;
  sprintArchives?: PublicSprintArchiveDTO[];
  evidence?: PublicEvidenceItemDTO[];
  assessments?: PublicAssessmentItemDTO[];
  timeline?: PublicTimelineItemDTO[];
  skills: CalibratedSkillMasteryDTO[];
  domains: ReadinessDomainBenchmarkDTO[];
  estimatedWeeksRemaining: number;
  issuedAt: string;
  verificationUrl?: string;
}

export interface PublicVerifiedProfileDTO {
  verificationId: string;
  candidateName?: string;
  targetRole: string;
  targetCompanyTier: string;
  overallReadiness: number;
  masteredSkills: string[];
  demonstratedSkills: string[];
  completedSprintCount: number;
  verifiedEvidenceCount: number;
  assessmentSummary: AssessmentPerformanceSummaryDTO;
  practicalSummary: PracticalPerformanceSummaryDTO;
  sprintArchives?: PublicSprintArchiveDTO[];
  evidence?: PublicEvidenceItemDTO[];
  assessments?: PublicAssessmentItemDTO[];
  timeline?: PublicTimelineItemDTO[];
  issuedAt: string;
  isValid: boolean;
}

// ─── Profile Integration: Verified Career Roadmap Summary (Stage 7.4) ───

export interface VerifiedSkillSummaryDTO {
  skillId?: string;
  name: string;
  category?: string | null;
  score?: number | null;
  status?: 'MASTERED' | 'DEMONSTRATED' | 'IN_PROGRESS';
  evidenceCount: number;
  lastAssessedAt?: string | null;
  verificationSource: 'PLATFORM_VERIFIED' | 'LEARNER_PROVIDED';
}

export interface SelectedProofItemDTO {
  id: string;
  type: 'PROJECT' | 'ASSESSMENT' | 'SPRINT' | 'PRACTICAL_DRILL';
  title: string;
  date: string;
  verificationSource: 'PLATFORM_VERIFIED' | 'LEARNER_PROVIDED';
  score?: number | null;
  skillName?: string | null;
  externalReference?: string | null;
  externalUrl?: string | null;
}

export interface RoadmapProfileSummaryDTO {
  userRoadmapId: string;
  roadmapId: string;
  candidateName?: string;
  targetRole: string;
  targetCompanyTier: string;
  overallReadiness: number;
  completedSprintCount: number;
  totalSprintCount: number;
  verifiedSkillCount: number;
  practicalEvidenceCount: number;
  assessmentCount: number;
  passedAssessmentCount: number;
  verifiedSkills: VerifiedSkillSummaryDTO[];
  selectedProof: SelectedProofItemDTO[];
  assessmentSummary: AssessmentPerformanceSummaryDTO;
  practicalSummary: PracticalPerformanceSummaryDTO;
  verificationId: string;
  verificationUrl: string;
  lastActiveAt?: string | null;
}

// ─── Daily Learning Plan & "Today's Focus" Engine (Stage 6.1) ─

export interface DailyTaskScheduleItemDTO {
  task: SprintTaskDTO;
  scheduledDayNumber: number;
  isScheduledForToday: boolean;
  isOverdue: boolean;
  isUpcoming: boolean;
  isCompleted: boolean;
}

export interface DailyLearningPlanDTO {
  sprintId: string;
  sprintNumber: number;
  sprintDurationDays: 7 | 10;
  currentDate: string;
  sprintStartDate: string;
  sprintEndDate: string;
  sprintDayNumber: number;
  totalSprintDays: number;
  isBeforeSprint: boolean;
  isAfterSprint: boolean;
  isLearningDay: boolean;
  learningDaysCount: number;
  hoursPerDay: number;
  dailyCapacityMinutes: number;

  todayTasks: SprintTaskDTO[];
  overdueTasks: SprintTaskDTO[];
  upcomingTasks: SprintTaskDTO[];
  completedTasks: SprintTaskDTO[];

  scheduledTasks: DailyTaskScheduleItemDTO[];

  todayEstimatedMinutes: number;
  todayCompletedMinutes: number;
  todayCompletionPercentage: number;

  sprintTasksTotal: number;
  sprintTasksCompleted: number;
  sprintCompletionPercentage: number;

  isOnPace: boolean;
  statusSummary: 'ON_TRACK' | 'BEHIND' | 'REST_DAY' | 'SPRINT_COMPLETED' | 'NOT_STARTED';
}

/**
 * Deterministically derives the daily learning plan, task schedule, and "Today's Focus"
 * for an active roadmap sprint based on learner personalization and the reference date.
 */
export function deriveDailyLearningPlan(
  sprint?: RoadmapSprintDTO | null,
  personalization?: {
    hoursPerDay?: number;
    daysPerWeek?: number;
    sprintDurationDays?: 7 | 10;
  } | null,
  referenceDate: Date | string = new Date()
): DailyLearningPlanDTO {
  const sprintId = sprint?.id || 'sprint-default';
  const sprintNumber = sprint?.sprintNumber || 1;
  const sprintDurationDays: 7 | 10 = personalization?.sprintDurationDays === 10 ? 10 : 7;
  const hoursPerDay = Math.max(0.25, Math.min(16, personalization?.hoursPerDay ?? 1.5));
  const daysPerWeek = Math.max(1, Math.min(7, personalization?.daysPerWeek ?? 5));
  const dailyCapacityMinutes = Math.round(hoursPerDay * 60);

  // Derive learning days count (e.g. 5 days for 7-day sprint at 5 days/wk; 7 days for 10-day sprint)
  const learningDaysCount = Math.max(
    1,
    Math.min(sprintDurationDays, Math.round((daysPerWeek / 7) * sprintDurationDays))
  );

  // First N days as active learning days, remaining as buffer/rest/review days
  const learningDaysSet = new Set<number>(
    Array.from({ length: learningDaysCount }, (_, i) => i + 1)
  );

  const rawStart = sprint?.startDate ? new Date(sprint.startDate) : new Date();
  const rawEnd = sprint?.endDate
    ? new Date(sprint.endDate)
    : new Date(rawStart.getTime() + (sprintDurationDays - 1) * 86400000);
  const ref = new Date(referenceDate);

  // Normalize dates to UTC midnight for consistent calendar date arithmetic
  const startUtc = Date.UTC(rawStart.getUTCFullYear(), rawStart.getUTCMonth(), rawStart.getUTCDate());
  const refUtc = Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate());
  const diffDays = Math.floor((refUtc - startUtc) / 86400000);

  const rawSprintDayNumber = diffDays + 1;
  const isBeforeSprint = rawSprintDayNumber < 1;
  const isAfterSprint = rawSprintDayNumber > sprintDurationDays;

  // Clamped sprint day number for day calculations
  const effectiveDayNumber = isBeforeSprint
    ? 1
    : isAfterSprint
    ? sprintDurationDays
    : rawSprintDayNumber;

  const isLearningDay = isBeforeSprint
    ? false
    : isAfterSprint
    ? false
    : learningDaysSet.has(effectiveDayNumber);

  // Sort tasks deterministically by orderIndex
  const allTasks: SprintTaskDTO[] = [...(sprint?.tasks || [])].sort(
    (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
  );

  // Distribute tasks across available learning days deterministically
  const scheduledTasks: DailyTaskScheduleItemDTO[] = [];
  const learningDayList = Array.from(learningDaysSet).sort((a, b) => a - b);

  let currentLearningDayIndex = 0;
  let currentDayAllocatedMinutes = 0;

  for (const task of allTasks) {
    const taskMinutes = task.estimatedMinutes && task.estimatedMinutes > 0 ? task.estimatedMinutes : 60;

    // Check if task fits in current learning day
    if (currentDayAllocatedMinutes > 0 && currentDayAllocatedMinutes + taskMinutes > dailyCapacityMinutes) {
      if (currentLearningDayIndex < learningDayList.length - 1) {
        currentLearningDayIndex++;
        currentDayAllocatedMinutes = 0;
      }
    }

    const scheduledDayNumber = learningDayList[currentLearningDayIndex] || 1;
    currentDayAllocatedMinutes += taskMinutes;

    const isCompleted = task.status === 'COMPLETED';
    let isScheduledForToday = false;
    let isOverdue = false;
    let isUpcoming = false;

    if (!isCompleted) {
      if (isBeforeSprint) {
        isUpcoming = true;
      } else if (isAfterSprint) {
        isOverdue = true;
      } else {
        if (scheduledDayNumber < effectiveDayNumber) {
          isOverdue = true;
        } else if (scheduledDayNumber === effectiveDayNumber) {
          isScheduledForToday = true;
        } else {
          isUpcoming = true;
        }
      }
    }

    scheduledTasks.push({
      task,
      scheduledDayNumber,
      isScheduledForToday,
      isOverdue,
      isUpcoming,
      isCompleted,
    });
  }

  // Categorize tasks
  const completedTasks = scheduledTasks.filter((s) => s.isCompleted).map((s) => s.task);
  const overdueTasks = scheduledTasks
    .filter((s) => s.isOverdue && s.task.status !== 'IN_PROGRESS')
    .map((s) => s.task);
  const upcomingTasks = scheduledTasks
    .filter((s) => s.isUpcoming && s.task.status !== 'IN_PROGRESS')
    .map((s) => s.task);

  // Today's focus prioritizes:
  // 1. IN_PROGRESS tasks
  // 2. Unfinished tasks scheduled for today
  const inProgressTasks = scheduledTasks
    .filter((s) => !s.isCompleted && s.task.status === 'IN_PROGRESS')
    .map((s) => s.task);
  const scheduledTodayUnfinished = scheduledTasks
    .filter((s) => s.isScheduledForToday && !s.isCompleted && s.task.status !== 'IN_PROGRESS')
    .map((s) => s.task);

  const todayTasks: SprintTaskDTO[] = [...inProgressTasks, ...scheduledTodayUnfinished];

  // If today is a rest day and there are overdue tasks, include them in today's actionable focus
  if (!isLearningDay && todayTasks.length === 0 && overdueTasks.length > 0) {
    todayTasks.push(...overdueTasks);
  }

  // Today's metrics
  const todayEstimatedMinutes = todayTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 60), 0);
  const tasksScheduledForToday = scheduledTasks.filter(
    (s) => s.scheduledDayNumber === effectiveDayNumber
  );
  const tasksScheduledForTodayCount = tasksScheduledForToday.length;
  const tasksCompletedForTodayCount = tasksScheduledForToday.filter((s) => s.isCompleted).length;

  const todayCompletionPercentage =
    tasksScheduledForTodayCount > 0
      ? Math.round((tasksCompletedForTodayCount / tasksScheduledForTodayCount) * 100)
      : completedTasks.length === allTasks.length && allTasks.length > 0
      ? 100
      : 0;

  // Sprint level metrics
  const sprintTasksTotal = allTasks.length;
  const sprintTasksCompleted = completedTasks.length;
  const sprintCompletionPercentage =
    sprintTasksTotal > 0 ? Math.round((sprintTasksCompleted / sprintTasksTotal) * 100) : 0;

  // Pace and Status Summary
  const allCompleted = sprintTasksTotal > 0 && sprintTasksCompleted === sprintTasksTotal;
  const isOnPace = !isAfterSprint && overdueTasks.length === 0;

  let statusSummary: 'ON_TRACK' | 'BEHIND' | 'REST_DAY' | 'SPRINT_COMPLETED' | 'NOT_STARTED' = 'ON_TRACK';
  if (allCompleted) {
    statusSummary = 'SPRINT_COMPLETED';
  } else if (isBeforeSprint) {
    statusSummary = 'NOT_STARTED';
  } else if (isAfterSprint || overdueTasks.length > 0) {
    statusSummary = 'BEHIND';
  } else if (!isLearningDay) {
    statusSummary = 'REST_DAY';
  } else {
    statusSummary = 'ON_TRACK';
  }

  return {
    sprintId,
    sprintNumber,
    sprintDurationDays,
    currentDate: ref.toISOString(),
    sprintStartDate: rawStart.toISOString(),
    sprintEndDate: rawEnd.toISOString(),
    sprintDayNumber: isBeforeSprint ? 0 : rawSprintDayNumber,
    totalSprintDays: sprintDurationDays,
    isBeforeSprint,
    isAfterSprint,
    isLearningDay,
    learningDaysCount,
    hoursPerDay,
    dailyCapacityMinutes,

    todayTasks,
    overdueTasks,
    upcomingTasks,
    completedTasks,

    scheduledTasks,

    todayEstimatedMinutes,
    todayCompletedMinutes:
      tasksCompletedForTodayCount > 0
        ? scheduledTasks
            .filter((s) => s.scheduledDayNumber === effectiveDayNumber && s.isCompleted)
            .reduce((sum, s) => sum + (s.task.estimatedMinutes || 60), 0)
        : 0,
    todayCompletionPercentage,

    sprintTasksTotal,
    sprintTasksCompleted,
    sprintCompletionPercentage,

    isOnPace,
    statusSummary,
  };
}

/**
 * Deterministically resolves which sprint task a learner should resume.
 * Priority:
 * 1. IN_PROGRESS task (lowest orderIndex if multiple)
 * 2. Today's first unfinished task
 * 3. First TODO task in the sprint by orderIndex
 * 4. null if all tasks are completed or no tasks exist
 */
export function resolveResumeTask(
  sprint?: RoadmapSprintDTO | null,
  personalization?: {
    hoursPerDay?: number;
    daysPerWeek?: number;
    sprintDurationDays?: 7 | 10;
  } | null,
  referenceDate: Date | string = new Date()
): SprintTaskDTO | null {
  if (!sprint || !sprint.tasks || sprint.tasks.length === 0) {
    return null;
  }

  const allTasks = [...sprint.tasks].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  // 1. IN_PROGRESS task(s) - lowest orderIndex first
  const inProgressTasks = allTasks.filter((t) => t.status === 'IN_PROGRESS');
  if (inProgressTasks.length > 0) {
    return inProgressTasks[0];
  }

  // 2. Today's first unfinished task (via daily learning plan)
  const plan = deriveDailyLearningPlan(sprint, personalization, referenceDate);
  if (plan.todayTasks && plan.todayTasks.length > 0) {
    const todayUnfinished = plan.todayTasks.find((t) => t.status !== 'COMPLETED');
    if (todayUnfinished) {
      return todayUnfinished;
    }
  }

  // 3. First TODO task in the sprint by orderIndex
  const firstTodoTask = allTasks.find((t) => t.status === 'TODO');
  if (firstTodoTask) {
    return firstTodoTask;
  }

  // 4. If all tasks are completed (or no actionable tasks exist)
  return null;
}

// ─── Stage 6.3: Task Focus Session & Timer Models ────────────────

export type TaskSessionState = 'NOT_STARTED' | 'RUNNING' | 'PAUSED' | 'COMPLETED';

export interface TaskSessionSnapshot {
  state: TaskSessionState;
  taskId: string;
  initialSeconds: number;
  remainingSeconds: number;
  elapsedSeconds: number;
}

/**
 * Computes safe session duration in seconds from task estimatedMinutes.
 * Safely handles <= 0, missing, NaN, infinity, and caps to reasonable boundaries [60s, 28800s (8h)].
 */
export function getSafeSessionDuration(
  estimatedMinutes?: number | null,
  defaultMinutes: number = 45
): number {
  if (
    typeof estimatedMinutes !== 'number' ||
    !Number.isFinite(estimatedMinutes) ||
    estimatedMinutes <= 0
  ) {
    return Math.max(1, Math.min(480, defaultMinutes)) * 60;
  }
  const safeMins = Math.max(1, Math.min(480, Math.round(estimatedMinutes)));
  return safeMins * 60;
}

/**
 * Initializes a new local task session snapshot in NOT_STARTED state.
 */
export function createInitialTaskSession(
  taskId: string,
  estimatedMinutes?: number | null,
  defaultMinutes: number = 45
): TaskSessionSnapshot {
  const initialSeconds = getSafeSessionDuration(estimatedMinutes, defaultMinutes);
  return {
    state: 'NOT_STARTED',
    taskId,
    initialSeconds,
    remainingSeconds: initialSeconds,
    elapsedSeconds: 0,
  };
}

/**
 * Starts or restarts a task focus session.
 */
export function startTaskSession(session: TaskSessionSnapshot): TaskSessionSnapshot {
  if (session.state === 'COMPLETED') {
    return {
      ...session,
      state: 'RUNNING',
      remainingSeconds: session.initialSeconds,
      elapsedSeconds: 0,
    };
  }
  return {
    ...session,
    state: 'RUNNING',
  };
}

/**
 * Pauses an active task focus session.
 */
export function pauseTaskSession(session: TaskSessionSnapshot): TaskSessionSnapshot {
  if (session.state !== 'RUNNING') {
    return session;
  }
  return {
    ...session,
    state: 'PAUSED',
  };
}

/**
 * Resumes a paused task focus session.
 */
export function resumeTaskSession(session: TaskSessionSnapshot): TaskSessionSnapshot {
  if (session.state !== 'PAUSED') {
    return session;
  }
  return {
    ...session,
    state: 'RUNNING',
  };
}

/**
 * Resets a task focus session back to NOT_STARTED.
 */
export function resetTaskSession(
  session: TaskSessionSnapshot,
  estimatedMinutes?: number | null
): TaskSessionSnapshot {
  const initialSeconds =
    estimatedMinutes !== undefined
      ? getSafeSessionDuration(estimatedMinutes)
      : session.initialSeconds;
  return {
    ...session,
    state: 'NOT_STARTED',
    initialSeconds,
    remainingSeconds: initialSeconds,
    elapsedSeconds: 0,
  };
}

/**
 * Ticks an active session down by deltaSeconds.
 * Automatically marks state as COMPLETED when remainingSeconds reaches 0.
 * Never drops remainingSeconds below 0.
 */
export function tickTaskSession(
  session: TaskSessionSnapshot,
  deltaSeconds: number = 1
): TaskSessionSnapshot {
  if (session.state !== 'RUNNING') {
    return session;
  }
  const delta = Math.max(0, deltaSeconds);
  const remainingSeconds = Math.max(0, session.remainingSeconds - delta);
  const elapsedSeconds = session.initialSeconds - remainingSeconds;
  const state: TaskSessionState = remainingSeconds === 0 ? 'COMPLETED' : 'RUNNING';

  return {
    ...session,
    state,
    remainingSeconds,
    elapsedSeconds,
  };
}

/**
 * Formats a given number of seconds into mm:ss or hh:mm:ss.
 */
export function formatTimerSeconds(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const hrs = Math.floor(safeSeconds / 3600);
  const mins = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ─── Stage 6.4: Daily Learning Activity & Streak System ──────────

export interface DailyLearningActivityDTO {
  todayActive: boolean;
  currentStreak: number;
  activeDaysLast7: number;
  activeDaysLast30: number;
  totalActiveDays: number;
  lastActiveDate: string | null;
  activeDates: string[]; // sorted ascending YYYY-MM-DD
}

/**
 * Converts a Date or ISO string to a UTC calendar date key (YYYY-MM-DD).
 */
export function toUtcDateKey(dateInput: string | Date | number): string | null {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Shifts a YYYY-MM-DD date key by a given number of days in UTC.
 */
export function shiftUtcDateKey(dateKey: string, daysShift: number): string {
  const parts = dateKey.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return dateKey;
  const [y, m, d] = parts;
  const date = new Date(Date.UTC(y, m - 1, d + daysShift));
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Deterministically derives the learner's daily activity, streak, and recent consistency
 * from persisted UserRoadmap sprint task completions and skill evidence records.
 */
export function deriveDailyLearningActivity(
  userRoadmap?: UserRoadmapDTO | null,
  referenceDate: Date | string = new Date()
): DailyLearningActivityDTO {
  const ref = typeof referenceDate === 'string' ? new Date(referenceDate) : referenceDate;
  const refTime = isNaN(ref.getTime()) ? new Date() : ref;

  const todayKey = toUtcDateKey(refTime);
  if (!todayKey) {
    return {
      todayActive: false,
      currentStreak: 0,
      activeDaysLast7: 0,
      activeDaysLast30: 0,
      totalActiveDays: 0,
      lastActiveDate: null,
      activeDates: [],
    };
  }

  const activeDateSet = new Set<string>();

  if (userRoadmap) {
    // 1. Collect completed sprint tasks with valid completedAt <= todayKey
    if (userRoadmap.sprints && Array.isArray(userRoadmap.sprints)) {
      for (const sprint of userRoadmap.sprints) {
        if (sprint.tasks && Array.isArray(sprint.tasks)) {
          for (const task of sprint.tasks) {
            if (task.status === 'COMPLETED' && task.completedAt) {
              const taskDateKey = toUtcDateKey(task.completedAt);
              if (taskDateKey && taskDateKey <= todayKey) {
                activeDateSet.add(taskDateKey);
              }
            }
          }
        }
      }
    }

    // 2. Collect skill evidence submissions with valid assessedAt <= todayKey
    if (userRoadmap.skillEvidence && Array.isArray(userRoadmap.skillEvidence)) {
      for (const evidence of userRoadmap.skillEvidence) {
        if (evidence.assessedAt) {
          const evidenceDateKey = toUtcDateKey(evidence.assessedAt);
          if (evidenceDateKey && evidenceDateKey <= todayKey) {
            activeDateSet.add(evidenceDateKey);
          }
        }
      }
    }
  }

  const activeDates = Array.from(activeDateSet).sort();
  const totalActiveDays = activeDates.length;
  const lastActiveDate = activeDates.length > 0 ? activeDates[activeDates.length - 1] : null;

  // Check today's activity
  const todayActive = activeDateSet.has(todayKey);

  // Calculate current streak
  let currentStreak = 0;
  if (todayActive) {
    currentStreak = 1;
    let checkKey = shiftUtcDateKey(todayKey, -1);
    while (activeDateSet.has(checkKey)) {
      currentStreak++;
      checkKey = shiftUtcDateKey(checkKey, -1);
    }
  } else {
    // If no activity today, check if yesterday was active (ongoing unbroken streak)
    const yesterdayKey = shiftUtcDateKey(todayKey, -1);
    if (activeDateSet.has(yesterdayKey)) {
      currentStreak = 1;
      let checkKey = shiftUtcDateKey(yesterdayKey, -1);
      while (activeDateSet.has(checkKey)) {
        currentStreak++;
        checkKey = shiftUtcDateKey(checkKey, -1);
      }
    } else {
      currentStreak = 0;
    }
  }

  // Active days in last 7 calendar days [today - 6, today]
  const sevenDaysAgoKey = shiftUtcDateKey(todayKey, -6);
  let activeDaysLast7 = 0;
  for (const dateKey of activeDates) {
    if (dateKey >= sevenDaysAgoKey && dateKey <= todayKey) {
      activeDaysLast7++;
    }
  }

  // Active days in last 30 calendar days [today - 29, today]
  const thirtyDaysAgoKey = shiftUtcDateKey(todayKey, -29);
  let activeDaysLast30 = 0;
  for (const dateKey of activeDates) {
    if (dateKey >= thirtyDaysAgoKey && dateKey <= todayKey) {
      activeDaysLast30++;
    }
  }

  return {
    todayActive,
    currentStreak,
    activeDaysLast7,
    activeDaysLast30,
    totalActiveDays,
    lastActiveDate,
    activeDates,
  };
}

// ─── Stage 7.1: Historical Sprint & Milestone Archive Engine ─────

export type MilestoneTimelineEventType =
  | 'TASK_COMPLETED'
  | 'SPRINT_COMPLETED'
  | 'SKILL_EVIDENCE'
  | 'ASSESSMENT_PASSED'
  | 'PRACTICAL_DRILL'
  | 'ROADMAP_ADAPTATION';

export interface MilestoneTimelineItemDTO {
  id: string;
  type: MilestoneTimelineEventType;
  title: string;
  description?: string | null;
  date: string;
  source: 'ROADMAP_SPRINT' | 'ASSESSMENT' | 'PROJECT' | 'SELF_REPORTED' | 'SYSTEM' | 'CODING_INTERVIEW' | 'ORAL_INTERVIEW';
  sourceId: string;
  skillName?: string | null;
  skillCategory?: string | null;
  score?: number | null;
  metadata?: Record<string, unknown> | null;
}

export interface HistoricalSprintArchiveDTO {
  sprintId: string;
  sprintNumber: number;
  objective: string;
  status: SprintState;
  startDate: string;
  endDate: string;
  completedAt?: string | null;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  decision?: 'CONTINUE' | 'ACCELERATE' | 'EXTEND' | 'REMEDIATE' | null;
  performance?: {
    id?: string;
    sprintId?: string;
    taskCompletion?: number;
    assessmentScore?: number | null;
    practicalScore?: number | null;
    codingScore?: number | null;
    interviewScore?: number | null;
    consistencyScore?: number | null;
    notes?: string | null;
    decision?: 'CONTINUE' | 'ACCELERATE' | 'EXTEND' | 'REMEDIATE' | null;
    createdAt?: string;
  } | null;
  skillsAddressed: string[];
}

export interface HistoricalAssessmentItemDTO {
  id: string;
  assessmentId: string;
  title?: string | null;
  skillId?: string | null;
  skillName?: string | null;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  sprintId?: string | null;
  sprintTaskId?: string | null;
}

export interface HistoricalEvidenceItemDTO {
  id: string;
  skillId: string;
  skillName?: string | null;
  skillCategory?: string | null;
  source: SkillEvidenceType;
  estimatedProficiency?: number | null;
  demonstratedScore?: number | null;
  confidence: number;
  externalReference?: string | null;
  metadata?: Record<string, unknown> | null;
  assessedAt: string;
}

export interface HistoricalAdaptationItemDTO {
  id: string;
  userRoadmapId: string;
  sprintId?: string | null;
  sprintNumber?: number | null;
  action: AdaptationAction;
  decision?: 'CONTINUE' | 'ACCELERATE' | 'EXTEND' | 'REMEDIATE' | null;
  reason: string;
  createdAt: string;
  evidenceSummary?: string | null;
}

export interface RoadmapLearningHistoryDTO {
  userRoadmapId: string;
  roadmapId: string;
  targetRole: string;
  targetCompanyTier: string;
  totalSprintsCount: number;
  completedSprintsCount: number;
  totalMilestonesCompleted: number;
  totalEvidenceCount: number;
  totalAssessmentsTaken: number;
  totalPracticalsCompleted: number;
  sprintArchives: HistoricalSprintArchiveDTO[];
  timeline: MilestoneTimelineItemDTO[];
  assessments: HistoricalAssessmentItemDTO[];
  evidence: HistoricalEvidenceItemDTO[];
  adaptations: HistoricalAdaptationItemDTO[];
  generatedAt: string;
}

/**
 * Deterministically derives the complete historical sprint archive, evidence log,
 * assessment history, and unified chronological milestone timeline from a learner's UserRoadmap.
 *
 * Ordering Rules:
 * - Timeline: Primary: event date descending (latest first). Secondary: event type ascending. Tertiary: item ID ascending.
 * - Sprint Archives: Sprints ordered by sprintNumber ascending.
 * - Assessments: Chronological completedAt descending.
 * - Evidence: Chronological assessedAt descending.
 * - Adaptations: Chronological createdAt descending.
 */
export function deriveRoadmapLearningHistory(
  userRoadmap?: UserRoadmapDTO | any,
  referenceDate: Date | string = new Date()
): RoadmapLearningHistoryDTO {
  const ref = typeof referenceDate === 'string' ? new Date(referenceDate) : referenceDate;
  const generatedAt = isNaN(ref.getTime()) ? new Date().toISOString() : ref.toISOString();

  if (!userRoadmap) {
    return {
      userRoadmapId: '',
      roadmapId: '',
      targetRole: 'Software Engineer',
      targetCompanyTier: 'FAANG',
      totalSprintsCount: 0,
      completedSprintsCount: 0,
      totalMilestonesCompleted: 0,
      totalEvidenceCount: 0,
      totalAssessmentsTaken: 0,
      totalPracticalsCompleted: 0,
      sprintArchives: [],
      timeline: [],
      assessments: [],
      evidence: [],
      adaptations: [],
      generatedAt,
    };
  }

  const userRoadmapId = userRoadmap.id || '';
  const roadmapId = userRoadmap.sourceRoadmapId || userRoadmap.sourceRoadmap?.id || '';
  const targetRole =
    userRoadmap.personalization?.targetRole ||
    userRoadmap.sourceRoadmap?.rolePath ||
    'Software Engineer';
  const targetCompanyTier = userRoadmap.sourceRoadmap?.targetCompanyTier || 'FAANG';

  const sprints = Array.isArray(userRoadmap.sprints) ? [...userRoadmap.sprints] : [];
  // Sort sprints chronologically by sprintNumber ascending
  sprints.sort((a, b) => {
    if (a.sprintNumber !== b.sprintNumber) return a.sprintNumber - b.sprintNumber;
    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
    if (dateA !== dateB) return dateA - dateB;
    return (a.id || '').localeCompare(b.id || '');
  });

  const sprintArchives: HistoricalSprintArchiveDTO[] = [];
  const timelineItems: MilestoneTimelineItemDTO[] = [];
  let totalMilestonesCompleted = 0;

  for (const sprint of sprints) {
    const tasks = Array.isArray(sprint.tasks) ? [...sprint.tasks] : [];
    tasks.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');
    const totalTasksCount = tasks.length;
    const completedTasksCount = completedTasks.length;
    const completionPercentage =
      totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    // Collect skills addressed in this sprint
    const skillsSet = new Set<string>();
    for (const task of tasks) {
      if (task.skillId) skillsSet.add(task.skillId);
      if (task.skill?.slug) skillsSet.add(task.skill.slug);
      if (task.skill?.name) skillsSet.add(task.skill.name);
      if (task.skills && Array.isArray(task.skills)) {
        for (const s of task.skills) {
          if (s.name) skillsSet.add(s.name);
          if (s.slug) skillsSet.add(s.slug);
          if (s.skill?.name) skillsSet.add(s.skill.name);
        }
      }
      if (task.roadmapNode?.skills && Array.isArray(task.roadmapNode.skills)) {
        for (const ns of task.roadmapNode.skills) {
          if (ns.skill?.name) skillsSet.add(ns.skill.name);
          if (ns.skill?.slug) skillsSet.add(ns.skill.slug);
        }
      }
    }
    const skillsAddressed = Array.from(skillsSet).sort();

    // Determine completion date of sprint if completed
    let sprintCompletedAt: string | null = null;
    if (sprint.status === 'COMPLETED') {
      const completedDates = completedTasks
        .map((t) => (t.completedAt ? new Date(t.completedAt).getTime() : 0))
        .filter((d) => d > 0);
      if (completedDates.length > 0) {
        sprintCompletedAt = new Date(Math.max(...completedDates)).toISOString();
      } else if (sprint.endDate) {
        sprintCompletedAt = new Date(sprint.endDate).toISOString();
      } else {
        sprintCompletedAt = new Date().toISOString();
      }
    }

    // Push sprint archive entry
    sprintArchives.push({
      sprintId: sprint.id,
      sprintNumber: sprint.sprintNumber,
      objective: sprint.objective || `Sprint ${sprint.sprintNumber}`,
      status: sprint.status,
      startDate: sprint.startDate || new Date().toISOString(),
      endDate: sprint.endDate || new Date().toISOString(),
      completedAt: sprintCompletedAt,
      totalTasks: totalTasksCount,
      completedTasks: completedTasksCount,
      completionPercentage,
      decision: sprint.decision || (sprint as any).performance?.decision || null,
      performance: (sprint as any).performance || null,
      skillsAddressed,
    });

    // Add completed sprint to timeline if status is COMPLETED
    if (sprint.status === 'COMPLETED' && sprintCompletedAt) {
      timelineItems.push({
        id: `tl-sprint-${sprint.id}`,
        type: 'SPRINT_COMPLETED',
        title: `Sprint 0${sprint.sprintNumber} Completed: ${sprint.objective || 'Sprint Milestones'}`,
        description: `Achieved ${completedTasksCount}/${totalTasksCount} milestone tasks (${completionPercentage}% completion)${
          sprint.decision ? ` • Adaptation: ${sprint.decision}` : ''
        }`,
        date: sprintCompletedAt,
        source: 'ROADMAP_SPRINT',
        sourceId: sprint.id,
        score: (sprint as any).performance?.taskCompletion ?? completionPercentage,
        metadata: {
          sprintNumber: sprint.sprintNumber,
          decision: sprint.decision || null,
        },
      });
    }

    // Add completed tasks to timeline
    for (const task of tasks) {
      if (task.status === 'COMPLETED' && task.completedAt) {
        totalMilestonesCompleted++;
        const skillName =
          (task.skills && task.skills[0]?.name) ||
          (task.roadmapNode?.skills && task.roadmapNode.skills[0]?.skill?.name) ||
          null;
        const skillCategory =
          (task.roadmapNode?.skills && task.roadmapNode.skills[0]?.skill?.category) ||
          null;

        timelineItems.push({
          id: `tl-task-${task.id}`,
          type: 'TASK_COMPLETED',
          title: task.title,
          description: task.description || null,
          date: new Date(task.completedAt).toISOString(),
          source: 'ROADMAP_SPRINT',
          sourceId: task.id,
          skillName,
          skillCategory,
          metadata: {
            sprintId: sprint.id,
            sprintNumber: sprint.sprintNumber,
            orderIndex: task.orderIndex,
            estimatedMinutes: task.estimatedMinutes,
          },
        });
      }
    }
  }

  // Process Skill Evidence
  const rawEvidence = Array.isArray(userRoadmap.skillEvidence) ? [...userRoadmap.skillEvidence] : [];
  const evidenceList: HistoricalEvidenceItemDTO[] = [];
  let totalPracticalsCompleted = 0;

  for (const ev of rawEvidence) {
    const assessedAt = ev.assessedAt ? new Date(ev.assessedAt).toISOString() : new Date().toISOString();
    const skillName = ev.skill?.name || null;
    const skillCategory = ev.skill?.category || null;

    evidenceList.push({
      id: ev.id,
      skillId: ev.skillId,
      skillName,
      skillCategory,
      source: ev.source,
      estimatedProficiency: ev.estimatedProficiency ?? null,
      demonstratedScore: ev.demonstratedScore ?? null,
      confidence: ev.confidence ?? 20,
      externalReference: ev.externalReference ?? null,
      metadata: ev.metadata ?? null,
      assessedAt,
    });

    const isPractical =
      ev.source === 'PROJECT' ||
      (ev.metadata && typeof ev.metadata === 'object' && Boolean((ev.metadata as any).practicalDrill));

    if (isPractical) {
      totalPracticalsCompleted++;
      timelineItems.push({
        id: `tl-ev-prac-${ev.id}`,
        type: 'PRACTICAL_DRILL',
        title: `Practical Coding Drill: ${skillName || 'Engineering Milestone'}`,
        description:
          ev.metadata && typeof (ev.metadata as any).notes === 'string'
            ? (ev.metadata as any).notes
            : ev.externalReference || 'Production-grade practical drill verified',
        date: assessedAt,
        source: 'PROJECT',
        sourceId: ev.id,
        skillName,
        skillCategory,
        score: ev.demonstratedScore ?? null,
        metadata: ev.metadata ?? null,
      });
    } else {
      const isOralInterview = ev.source === 'ORAL_INTERVIEW';
      const isCodingInterview = ev.source === 'CODING_INTERVIEW';
      const isAssessment = ev.source === 'ASSESSMENT';
      const isSelfReported = ev.source === 'SELF_REPORTED';

      const itemTitle = isOralInterview
        ? `Oral Interview Evidence: ${skillName || 'Technical Assessment'}`
        : isCodingInterview
        ? `Coding Interview Evidence: ${skillName || 'Technical Assessment'}`
        : `Skill Evidence Recorded: ${skillName || 'Competency Milestone'}`;

      const itemSource = isOralInterview
        ? 'ORAL_INTERVIEW'
        : isCodingInterview
        ? 'CODING_INTERVIEW'
        : isAssessment
        ? 'ASSESSMENT'
        : isSelfReported
        ? 'SELF_REPORTED'
        : 'ROADMAP_SPRINT';

      timelineItems.push({
        id: `tl-ev-${ev.id}`,
        type: 'SKILL_EVIDENCE',
        title: itemTitle,
        description:
          ev.externalReference ||
          (ev.metadata && typeof (ev.metadata as any).notes === 'string'
            ? (ev.metadata as any).notes
            : 'Verified milestone evidence recorded'),
        date: assessedAt,
        source: itemSource,
        sourceId: ev.id,
        skillName,
        skillCategory,
        score: ev.demonstratedScore ?? ev.estimatedProficiency ?? null,
        metadata: ev.metadata ?? null,
      });
    }
  }

  // Process Assessment Attempts
  const rawAssessments = Array.isArray((userRoadmap as any).assessmentAttempts)
    ? [...(userRoadmap as any).assessmentAttempts]
    : Array.isArray((userRoadmap as any).microAssessmentAttempts)
    ? [...(userRoadmap as any).microAssessmentAttempts]
    : [];
  const assessmentList: HistoricalAssessmentItemDTO[] = [];

  for (const att of rawAssessments) {
    const completedAt = att.completedAt ? new Date(att.completedAt).toISOString() : new Date().toISOString();
    const skillName = att.skill?.name || null;
    const title =
      att.assessment?.title || (skillName ? `${skillName} Micro-Assessment` : 'Micro-Assessment');

    const isPassed = Boolean(att.passed || (att.score !== undefined && att.score >= 70));

    assessmentList.push({
      id: att.id,
      assessmentId: att.assessmentId,
      title,
      skillId: att.skillId ?? null,
      skillName,
      score: att.score ?? 0,
      passed: isPassed,
      totalQuestions: att.totalQuestions ?? 0,
      correctAnswers: att.correctAnswers ?? 0,
      completedAt,
      sprintId: att.sprintId ?? null,
      sprintTaskId: att.sprintTaskId ?? null,
    });

    if (isPassed) {
      timelineItems.push({
        id: `tl-ass-${att.id}`,
        type: 'ASSESSMENT_PASSED',
        title: `Passed Assessment: ${title}`,
        description: `Scored ${att.score}% (${att.correctAnswers}/${att.totalQuestions} questions correct)`,
        date: completedAt,
        source: 'ASSESSMENT',
        sourceId: att.id,
        skillName,
        score: att.score,
        metadata: {
          assessmentId: att.assessmentId,
          sprintId: att.sprintId ?? null,
        },
      });
    }
  }

  // Process Roadmap Adaptations
  const rawAdaptations = Array.isArray((userRoadmap as any).adaptations)
    ? [...(userRoadmap as any).adaptations]
    : [];
  const adaptationList: HistoricalAdaptationItemDTO[] = [];

  for (const adapt of rawAdaptations) {
    const createdAt = adapt.createdAt ? new Date(adapt.createdAt).toISOString() : new Date().toISOString();
    const sprintObj = sprints.find((s) => s.id === adapt.sprintId);

    adaptationList.push({
      id: adapt.id,
      userRoadmapId: adapt.userRoadmapId || userRoadmapId,
      sprintId: adapt.sprintId ?? null,
      sprintNumber: sprintObj?.sprintNumber ?? null,
      action: adapt.action,
      decision: sprintObj?.decision ?? null,
      reason: adapt.reason || 'Curriculum dynamically adapted based on telemetry feedback',
      createdAt,
      evidenceSummary:
        typeof adapt.evidence === 'string' ? adapt.evidence : JSON.stringify(adapt.evidence || {}),
    });

    timelineItems.push({
      id: `tl-adapt-${adapt.id}`,
      type: 'ROADMAP_ADAPTATION',
      title: `Curriculum Adaptation: ${adapt.action}`,
      description: adapt.reason,
      date: createdAt,
      source: 'SYSTEM',
      sourceId: adapt.id,
      metadata: {
        sprintId: adapt.sprintId ?? null,
        action: adapt.action,
      },
    });
  }

  // Sort timeline deterministically:
  // 1. Primary: date descending (latest events first)
  // 2. Secondary: event type ascending
  // 3. Tertiary: stable item ID ascending
  timelineItems.sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    if (timeB !== timeA) return timeB - timeA;
    const typeCmp = a.type.localeCompare(b.type);
    if (typeCmp !== 0) return typeCmp;
    return a.id.localeCompare(b.id);
  });

  // Sort sub-lists deterministically
  evidenceList.sort((a, b) => {
    const timeA = new Date(a.assessedAt).getTime();
    const timeB = new Date(b.assessedAt).getTime();
    if (timeB !== timeA) return timeB - timeA;
    return a.id.localeCompare(b.id);
  });

  assessmentList.sort((a, b) => {
    const timeA = new Date(a.completedAt).getTime();
    const timeB = new Date(b.completedAt).getTime();
    if (timeB !== timeA) return timeB - timeA;
    return a.id.localeCompare(b.id);
  });

  adaptationList.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    if (timeB !== timeA) return timeB - timeA;
    return a.id.localeCompare(b.id);
  });

  const totalSprintsCount = sprints.length;
  const completedSprintsCount = sprints.filter((s) => s.status === 'COMPLETED').length;
  const totalEvidenceCount = evidenceList.length;
  const totalAssessmentsTaken = assessmentList.length;

  return {
    userRoadmapId,
    roadmapId,
    targetRole,
    targetCompanyTier,
    totalSprintsCount,
    completedSprintsCount,
    totalMilestonesCompleted,
    totalEvidenceCount,
    totalAssessmentsTaken,
    totalPracticalsCompleted,
    sprintArchives,
    timeline: timelineItems,
    assessments: assessmentList,
    evidence: evidenceList,
    adaptations: adaptationList,
    generatedAt,
  };
}

/**
 * Deterministic profile summary derivation engine (Stage 7.4).
 * Produces a concise, bounded verified career profile summary suitable for
 * the learner's profile page without exposing internal telemetry or full history.
 */
export function deriveRoadmapProfileSummary(
  userRoadmap?: UserRoadmapDTO | any,
  baseUrl = 'https://ruready.dev'
): RoadmapProfileSummaryDTO {
  if (!userRoadmap) {
    return {
      userRoadmapId: '',
      roadmapId: '',
      candidateName: 'Verified Candidate',
      targetRole: 'Software Engineer',
      targetCompanyTier: 'FAANG',
      overallReadiness: 0,
      completedSprintCount: 0,
      totalSprintCount: 0,
      verifiedSkillCount: 0,
      practicalEvidenceCount: 0,
      assessmentCount: 0,
      passedAssessmentCount: 0,
      verifiedSkills: [],
      selectedProof: [],
      assessmentSummary: { totalAttempts: 0, passedAttempts: 0, averageScore: null },
      practicalSummary: { totalDrills: 0, passedDrills: 0, averageScore: null },
      verificationId: '',
      verificationUrl: '',
      lastActiveAt: null,
    };
  }

  const history = deriveRoadmapLearningHistory(userRoadmap);
  const userRoadmapId = history.userRoadmapId || userRoadmap.id || '';
  const roadmapId = history.roadmapId || userRoadmap.sourceRoadmapId || '';
  const targetRole = history.targetRole;
  const targetCompanyTier = history.targetCompanyTier;
  const parsedPersonalization =
    typeof userRoadmap.personalization === 'string'
      ? (() => {
          try {
            return JSON.parse(userRoadmap.personalization);
          } catch {
            return {};
          }
        })()
      : userRoadmap.personalization || {};
  const candidateName =
    parsedPersonalization.candidateName ||
    userRoadmap.candidateName ||
    'Verified Candidate';

  // 1. Calculate overall readiness (from sourceRoadmap or calculated)
  const overallReadiness =
    typeof userRoadmap.overallReadiness === 'number'
      ? userRoadmap.overallReadiness
      : typeof userRoadmap.sourceRoadmap?.overallReadiness === 'number'
      ? userRoadmap.sourceRoadmap.overallReadiness
      : history.completedSprintsCount > 0
      ? Math.min(100, Math.round((history.completedSprintsCount / Math.max(1, history.totalSprintsCount)) * 100))
      : 0;

  // 2. Verified skills aggregation (deduplicated across evidence, sprints, assessments)
  const skillMap = new Map<string, {
    skillId?: string;
    name: string;
    category?: string | null;
    scores: number[];
    evidenceCount: number;
    lastAssessedAt?: string | null;
    hasPlatformVerified: boolean;
  }>();

  for (const ev of history.evidence) {
    const name = ev.skillName || ev.skillId;
    if (!name) continue;
    const existing = skillMap.get(name) || {
      skillId: ev.skillId,
      name,
      category: ev.skillCategory,
      scores: [],
      evidenceCount: 0,
      lastAssessedAt: null,
      hasPlatformVerified: false,
    };
    existing.evidenceCount++;
    if (ev.demonstratedScore !== null && ev.demonstratedScore !== undefined) {
      existing.scores.push(ev.demonstratedScore);
    } else if (ev.estimatedProficiency !== null && ev.estimatedProficiency !== undefined) {
      existing.scores.push(ev.estimatedProficiency);
    }
    if (ev.source !== 'SELF_REPORTED') {
      existing.hasPlatformVerified = true;
    }
    if (!existing.lastAssessedAt || new Date(ev.assessedAt) > new Date(existing.lastAssessedAt)) {
      existing.lastAssessedAt = ev.assessedAt;
    }
    skillMap.set(name, existing);
  }

  // Also include skills from passed assessments
  for (const ass of history.assessments) {
    if (ass.skillName) {
      const existing = skillMap.get(ass.skillName) || {
        skillId: ass.skillId || undefined,
        name: ass.skillName,
        category: null,
        scores: [],
        evidenceCount: 0,
        lastAssessedAt: null,
        hasPlatformVerified: true,
      };
      existing.evidenceCount++;
      if (ass.score !== undefined) existing.scores.push(ass.score);
      existing.hasPlatformVerified = true;
      if (!existing.lastAssessedAt || new Date(ass.completedAt) > new Date(existing.lastAssessedAt)) {
        existing.lastAssessedAt = ass.completedAt;
      }
      skillMap.set(ass.skillName, existing);
    }
  }

  const verifiedSkills: VerifiedSkillSummaryDTO[] = Array.from(skillMap.values()).map((item) => {
    const avgScore =
      item.scores.length > 0
        ? Math.round(item.scores.reduce((a, b) => a + b, 0) / item.scores.length)
        : null;
    let status: 'MASTERED' | 'DEMONSTRATED' | 'IN_PROGRESS' = 'IN_PROGRESS';
    if (avgScore !== null) {
      if (avgScore >= 80) status = 'MASTERED';
      else if (avgScore >= 60) status = 'DEMONSTRATED';
    }
    return {
      skillId: item.skillId,
      name: item.name,
      category: item.category,
      score: avgScore,
      status,
      evidenceCount: item.evidenceCount,
      lastAssessedAt: item.lastAssessedAt,
      verificationSource: item.hasPlatformVerified ? 'PLATFORM_VERIFIED' : 'LEARNER_PROVIDED',
    };
  });

  // Sort verified skills: MASTERED first, then highest score, then name
  verifiedSkills.sort((a, b) => {
    if ((b.score ?? 0) !== (a.score ?? 0)) return (b.score ?? 0) - (a.score ?? 0);
    return a.name.localeCompare(b.name);
  });

  // 3. Selected Proof of Work (Top 3-5 items: completed sprints, passed assessments, practical drills, projects)
  const candidateProof: SelectedProofItemDTO[] = [];

  // Completed Sprints
  for (const sprint of history.sprintArchives) {
    if (sprint.status === 'COMPLETED') {
      candidateProof.push({
        id: `sprint-${sprint.sprintNumber}`,
        type: 'SPRINT',
        title: `Completed Sprint ${sprint.sprintNumber}: ${sprint.objective || 'Sprint Objective'}`,
        date: sprint.completedAt || sprint.endDate || new Date().toISOString(),
        verificationSource: 'PLATFORM_VERIFIED',
        score: sprint.completionPercentage,
        skillName: sprint.skillsAddressed.slice(0, 3).join(', ') || null,
      });
    }
  }

  // Passed Assessments
  for (const ass of history.assessments) {
    if (ass.passed) {
      candidateProof.push({
        id: `ass-${ass.id}`,
        type: 'ASSESSMENT',
        title: ass.title || 'Micro-Assessment Passed',
        date: ass.completedAt || new Date().toISOString(),
        verificationSource: 'PLATFORM_VERIFIED',
        score: ass.score,
        skillName: ass.skillName,
      });
    }
  }

  // Practical Drills & Project Evidence
  for (const ev of history.evidence) {
    const isPractical =
      ev.source === 'PROJECT' ||
      (ev.metadata && typeof ev.metadata === 'object' && Boolean((ev.metadata as any).practicalDrill));
    const extUrl =
      (ev.metadata && typeof ev.metadata === 'object' && (ev.metadata as any).externalUrl) ||
      ev.externalReference ||
      null;

    if (isPractical) {
      candidateProof.push({
        id: `drill-${ev.id}`,
        type: 'PRACTICAL_DRILL',
        title: `Practical Coding Drill: ${ev.skillName || 'Engineering Milestone'}`,
        date: ev.assessedAt || new Date().toISOString(),
        verificationSource: ev.source === 'SELF_REPORTED' ? 'LEARNER_PROVIDED' : 'PLATFORM_VERIFIED',
        score: ev.demonstratedScore ?? null,
        skillName: ev.skillName,
        externalReference: ev.externalReference || null,
        externalUrl: extUrl,
      });
    } else if (ev.source === 'PROJECT') {
      candidateProof.push({
        id: `proj-${ev.id}`,
        type: 'PROJECT',
        title: `Project Milestone: ${ev.skillName || 'Verified Implementation'}`,
        date: ev.assessedAt || new Date().toISOString(),
        verificationSource: 'PLATFORM_VERIFIED',
        score: ev.demonstratedScore ?? null,
        skillName: ev.skillName,
        externalReference: ev.externalReference || null,
        externalUrl: extUrl,
      });
    }
  }

  // Sort candidate proof chronologically descending and take top 5
  candidateProof.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const selectedProof = candidateProof.slice(0, 5);

  // 4. Assessment Summary
  const totalAttempts = history.assessments.length;
  const passedAttempts = history.assessments.filter((a) => a.passed).length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(history.assessments.reduce((sum, a) => sum + (a.score ?? 0), 0) / totalAttempts)
      : null;

  const assessmentSummary = {
    totalAttempts,
    passedAttempts,
    averageScore: avgScore,
  };

  // 5. Practical Summary
  const practicalEvidence = history.evidence.filter(
    (e) =>
      e.source === 'PROJECT' ||
      (e.metadata && typeof e.metadata === 'object' && Boolean((e.metadata as any).practicalDrill))
  );
  const totalDrills = practicalEvidence.length;
  const passedDrills = practicalEvidence.filter((p) => (p.demonstratedScore ?? 0) >= 70).length;
  const practicalAvgScore =
    totalDrills > 0
      ? Math.round(
          practicalEvidence.reduce((sum, p) => sum + (p.demonstratedScore ?? 100), 0) / totalDrills
        )
      : null;

  const practicalSummary = {
    totalDrills,
    passedDrills,
    averageScore: practicalAvgScore,
  };

  // 6. Verification ID & URL (matches Stage 7.3 format)
  let verificationId = userRoadmap.verificationId || '';
  if (!verificationId && userRoadmapId) {
    const masteredCount = verifiedSkills.filter((s) => s.status === 'MASTERED').length;
    verificationId = `VRF-${userRoadmapId}-${Math.abs(
      userRoadmapId.length * 31 + overallReadiness * 17 + masteredCount * 13
    )
      .toString(16)
      .padStart(16, '0')
      .slice(0, 16)
      .toUpperCase()}`;
  }
  const verificationUrl = `${baseUrl}/verify/${verificationId}`;

  // 7. Last active timestamp
  let lastActiveAt: string | null = null;
  if (selectedProof.length > 0) {
    lastActiveAt = selectedProof[0].date;
  }

  return {
    userRoadmapId,
    roadmapId,
    candidateName,
    targetRole,
    targetCompanyTier,
    overallReadiness,
    completedSprintCount: history.completedSprintsCount,
    totalSprintCount: history.totalSprintsCount,
    verifiedSkillCount: verifiedSkills.length,
    practicalEvidenceCount: totalDrills,
    assessmentCount: totalAttempts,
    passedAssessmentCount: passedAttempts,
    verifiedSkills,
    selectedProof,
    assessmentSummary,
    practicalSummary,
    verificationId,
    verificationUrl,
    lastActiveAt,
  };
}

// ─── Stage 8.1 Resume-to-Roadmap Bridge DTOs ──────────────────

export interface ResumeRoadmapPrefillDTO {
  resumeId?: string;
  fileName?: string;
  candidateName?: string;
  suggestedTargetRole?: string;
  suggestedCompanyTier?: 'FAANG' | 'Unicorn' | 'Tier-1 FinTech' | 'High-Growth Startup' | 'Enterprise';
  suggestedLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'STAFF';
  knownSkills: string[];
  identifiedBlindspots: string[];
  source: 'RESUME_PROFILE' | 'ATS_ANALYSIS' | 'USER_PROFILE' | 'MANUAL';
  extractedAt?: string;
  atsMatchId?: string;
  atsMatchScore?: number;
  rawSkillCount: number;
  normalizedSkillCount: number;
  experienceYears?: number;
  summary?: string;
}

export interface ResumeRoadmapPrefillInput {
  resumeId?: string;
  atsMatchId?: string;
}

export const CANONICAL_SKILL_ALIASES: Record<string, string> = {
  'react': 'React',
  'react.js': 'React',
  'reactjs': 'React',
  'react native': 'React Native',
  'next': 'Next.js',
  'next.js': 'Next.js',
  'nextjs': 'Next.js',
  'vue': 'Vue.js',
  'vue.js': 'Vue.js',
  'vuejs': 'Vue.js',
  'node': 'Node.js',
  'node.js': 'Node.js',
  'nodejs': 'Node.js',
  'express': 'Express.js',
  'express.js': 'Express.js',
  'expressjs': 'Express.js',
  'nest': 'NestJS',
  'nest.js': 'NestJS',
  'nestjs': 'NestJS',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'py': 'Python',
  'python': 'Python',
  'python3': 'Python',
  'fastapi': 'FastAPI',
  'fast api': 'FastAPI',
  'django': 'Django',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'pg': 'PostgreSQL',
  'mysql': 'MySQL',
  'mongo': 'MongoDB',
  'mongodb': 'MongoDB',
  'redis': 'Redis',
  'kafka': 'Kafka',
  'apache kafka': 'Kafka',
  'docker': 'Docker',
  'containerization': 'Docker',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'gcp': 'GCP',
  'google cloud': 'GCP',
  'azure': 'Azure',
  'system design': 'System Design',
  'hld': 'High-Level Design (HLD)',
  'lld': 'Low-Level Design (LLD)',
  'git': 'Git',
  'github': 'Git',
  'linux': 'Linux',
  'bash': 'Bash',
  'sql': 'SQL',
  'nosql': 'NoSQL',
  'graphql': 'GraphQL',
  'rest': 'REST APIs',
  'rest api': 'REST APIs',
  'restful api': 'REST APIs',
  'ci/cd': 'CI/CD Pipelines',
  'cicd': 'CI/CD Pipelines',
  'dsa': 'Data Structures & Algorithms',
  'data structures': 'Data Structures & Algorithms',
  'algorithms': 'Data Structures & Algorithms',
  'oop': 'Object-Oriented Programming (OOP)',
};

export function normalizeSkillName(rawSkill: string): string {
  if (!rawSkill || typeof rawSkill !== 'string') return '';
  const trimmed = rawSkill.trim();
  const lower = trimmed.toLowerCase();
  if (CANONICAL_SKILL_ALIASES[lower]) {
    return CANONICAL_SKILL_ALIASES[lower];
  }
  return trimmed;
}

export function normalizeSkillList(skills: string[]): string[] {
  if (!Array.isArray(skills)) return [];
  const normalizedSet = new Set<string>();
  for (const raw of skills) {
    if (typeof raw === 'string' && raw.trim().length > 0) {
      const normalized = normalizeSkillName(raw);
      if (normalized) {
        normalizedSet.add(normalized);
      }
    }
  }
  return Array.from(normalizedSet);
}

// ─── Stage 8.2: Interview Telemetry Ingress DTOs ────────────────

export interface EvaluatedInterviewSkill {
  skillName: string;
  score?: number; // 0 - 100
  confidence?: number; // 1 - 100 (defaults to 80 for verified AI interview)
  notes?: string;
}

export interface InterviewTelemetryIngressDTO {
  interviewId: string;
  userId: string;
  userRoadmapId?: string;
  interviewType: 'ORAL_INTERVIEW' | 'CODING_INTERVIEW' | 'TECHNICAL';
  targetRole?: string;
  overallScore: number; // 0 - 100
  technicalScore?: number; // 0 - 100
  communicationScore?: number; // 0 - 100
  readinessVerdict?: string;
  evaluatedSkills: EvaluatedInterviewSkill[];
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface InterviewTelemetryIngressResultDTO {
  success: boolean;
  interviewId: string;
  userRoadmapId: string;
  evidenceCount: number;
  recordedEvidenceIds: string[];
  skippedDuplicatesCount: number;
  unmappedSkillsCount: number;
  message: string;
}

// ─── Stage 8.3: Verifiable PDF Certificate DTOs ────────────────

export interface VerifiableCertificateDTO {
  certificateId: string;
  verificationId: string;
  verificationUrl: string;
  recipientName: string;
  recipientUsername?: string;
  targetRole: string;
  targetCompanyTier: string;
  overallReadiness: number;
  completedSprintCount: number;
  verifiedEvidenceCount: number;
  masteredSkills: string[];
  demonstratedSkills: string[];
  achievementSummary: string;
  issuedAt: string;
  isEligible: boolean;
  ineligibilityReason?: string;
}

export interface CertificateVerificationResultDTO {
  isValid: boolean;
  certificateId: string;
  verificationId: string;
  recipientName: string;
  targetRole: string;
  targetCompanyTier: string;
  overallReadiness: number;
  completedSprintCount: number;
  verifiedEvidenceCount: number;
  masteredSkills: string[];
  issuedAt: string;
  verificationUrl: string;
  status: 'AUTHENTIC' | 'REVOKED' | 'INVALID';
}

// ─── Stage 8.4: Smart Sprint Notifications DTOs ────────────────

export type SmartNotificationType =
  | 'SPRINT_STARTING'
  | 'TASK_OVERDUE'
  | 'ASSESSMENT_DUE'
  | 'SPRINT_COMPLETED'
  | 'ROADMAP_ADAPTATION'
  | 'INACTIVITY_REMINDER';

export type SmartNotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface SmartNotificationDTO {
  id: string;
  type: SmartNotificationType;
  priority: SmartNotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}

export interface SmartNotificationPreferencesDTO {
  enabled: boolean;
  sprintReminders: boolean;
  overdueAlerts: boolean;
  assessmentReminders: boolean;
  adaptationAlerts: boolean;
  inactivityReminders: boolean;
  inAppNotifications: boolean;
  emailNotifications: boolean;
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
}

export interface SmartSprintNotificationFeedDTO {
  userRoadmapId: string;
  unreadCount: number;
  totalCount: number;
  notifications: SmartNotificationDTO[];
  preferences: SmartNotificationPreferencesDTO;
  generatedAt: string;
}

export const DEFAULT_SMART_NOTIFICATION_PREFERENCES: SmartNotificationPreferencesDTO = {
  enabled: true,
  sprintReminders: true,
  overdueAlerts: true,
  assessmentReminders: true,
  adaptationAlerts: true,
  inactivityReminders: true,
  inAppNotifications: true,
  emailNotifications: false,
  quietHoursStart: null,
  quietHoursEnd: null,
};

/**
 * Deterministically derives actionable, non-spam smart sprint notifications
 * based on authoritative user roadmap, sprint progress, and learner preferences.
 */
export function deriveSmartSprintNotifications(
  userRoadmap: any,
  referenceDate: Date | string = new Date()
): SmartSprintNotificationFeedDTO {
  const ref = typeof referenceDate === 'string' ? new Date(referenceDate) : referenceDate;
  const refDate = isNaN(ref.getTime()) ? new Date() : ref;
  const generatedAt = refDate.toISOString();
  const userRoadmapId = userRoadmap?.id || '';

  const rawPrefs = userRoadmap?.personalization?.notificationPreferences || {};
  const preferences: SmartNotificationPreferencesDTO = {
    ...DEFAULT_SMART_NOTIFICATION_PREFERENCES,
    ...rawPrefs,
  };

  const rawReadIds = userRoadmap?.personalization?.readNotificationIds || [];
  const readNotificationIds = Array.isArray(rawReadIds) ? rawReadIds : [];

  if (!userRoadmap || !preferences.enabled) {
    return {
      userRoadmapId,
      unreadCount: 0,
      totalCount: 0,
      notifications: [],
      preferences,
      generatedAt,
    };
  }

  const notificationsMap = new Map<string, SmartNotificationDTO>();
  const sprints = Array.isArray(userRoadmap.sprints) ? userRoadmap.sprints : [];
  const adaptations = Array.isArray(userRoadmap.adaptations) ? userRoadmap.adaptations : [];

  // 1. Process Completed Sprints
  if (preferences.sprintReminders) {
    for (const sprint of sprints) {
      if (sprint.status === 'COMPLETED') {
        const id = `ntf-sprint-comp-${sprint.id}`;
        const timestamp = sprint.completedAt
          ? new Date(sprint.completedAt).toISOString()
          : sprint.endDate
          ? new Date(sprint.endDate).toISOString()
          : generatedAt;
        const taskCompletion = sprint.performance?.taskCompletion ?? 100;

        notificationsMap.set(id, {
          id,
          type: 'SPRINT_COMPLETED',
          priority: 'MEDIUM',
          title: `Sprint 0${sprint.sprintNumber} Completed`,
          message: `Sprint 0${sprint.sprintNumber} (${sprint.objective || 'Milestone Sprint'}) completed with ${taskCompletion}% milestone completion.`,
          timestamp,
          isRead: readNotificationIds.includes(id),
          actionUrl: `/roadmap/sprints/${sprint.id}`,
          actionLabel: 'View Sprint Performance',
          metadata: {
            sprintId: sprint.id,
            sprintNumber: sprint.sprintNumber,
            taskCompletion,
          },
        });
      }
    }
  }

  // 2. Process Roadmap Adaptations
  if (preferences.adaptationAlerts) {
    for (const adaptation of adaptations) {
      const id = `ntf-adapt-${adaptation.id}`;
      const timestamp = adaptation.createdAt
        ? new Date(adaptation.createdAt).toISOString()
        : generatedAt;

      notificationsMap.set(id, {
        id,
        type: 'ROADMAP_ADAPTATION',
        priority: 'HIGH',
        title: 'Roadmap Adapted to Performance',
        message: `Curriculum adjusted (${adaptation.action}): ${adaptation.reason || 'Calibrated to your recent learning pace.'}`,
        timestamp,
        isRead: readNotificationIds.includes(id),
        actionUrl: `/roadmap`,
        actionLabel: 'View Updated Roadmap',
        metadata: {
          adaptationId: adaptation.id,
          action: adaptation.action,
        },
      });
    }
  }

  // 3. Process Active Sprints (Starting, Assessments Due, Overdue Tasks)
  let latestActivityTime = userRoadmap.createdAt ? new Date(userRoadmap.createdAt).getTime() : 0;

  for (const sprint of sprints) {
    const tasks = Array.isArray(sprint.tasks) ? sprint.tasks : [];

    for (const task of tasks) {
      if (task.completedAt) {
        const completedTime = new Date(task.completedAt).getTime();
        if (completedTime > latestActivityTime) {
          latestActivityTime = completedTime;
        }
      }
    }

    if (sprint.status === 'ACTIVE') {
      const incompleteTasks = tasks.filter((t: any) => t.status !== 'COMPLETED' && t.status !== 'SKIPPED');
      const incompleteAssessments = incompleteTasks.filter((t: any) => Boolean(t.requiresAssessment));

      // 3A. Required Assessment Due Alert
      if (preferences.assessmentReminders && incompleteAssessments.length > 0) {
        const id = `ntf-assess-${sprint.id}`;
        const timestamp = sprint.startDate ? new Date(sprint.startDate).toISOString() : generatedAt;

        notificationsMap.set(id, {
          id,
          type: 'ASSESSMENT_DUE',
          priority: 'HIGH',
          title: `Required Assessment Due in Sprint 0${sprint.sprintNumber}`,
          message: `Sprint 0${sprint.sprintNumber} has ${incompleteAssessments.length} required milestone assessment(s) waiting for completion.`,
          timestamp,
          isRead: readNotificationIds.includes(id),
          actionUrl: `/roadmap/sprints/${sprint.id}`,
          actionLabel: 'Take Assessment',
          metadata: {
            sprintId: sprint.id,
            sprintNumber: sprint.sprintNumber,
            pendingAssessmentsCount: incompleteAssessments.length,
          },
        });
      }

      // 3B. Overdue Tasks Alert
      if (preferences.overdueAlerts && sprint.endDate) {
        const endDateTime = new Date(sprint.endDate).getTime();
        if (endDateTime < refDate.getTime() && incompleteTasks.length > 0) {
          const id = `ntf-overdue-${sprint.id}`;
          const timestamp = new Date(sprint.endDate).toISOString();

          notificationsMap.set(id, {
            id,
            type: 'TASK_OVERDUE',
            priority: 'URGENT',
            title: `Sprint 0${sprint.sprintNumber} Tasks Overdue`,
            message: `Sprint 0${sprint.sprintNumber} has ${incompleteTasks.length} incomplete milestone task(s) past the target date.`,
            timestamp,
            isRead: readNotificationIds.includes(id),
            actionUrl: `/roadmap/sprints/${sprint.id}`,
            actionLabel: 'Complete Tasks',
            metadata: {
              sprintId: sprint.id,
              sprintNumber: sprint.sprintNumber,
              overdueTaskCount: incompleteTasks.length,
            },
          });
        }
      }

      // 3C. Sprint Starting Notification
      if (preferences.sprintReminders && sprint.startDate) {
        const id = `ntf-sprint-start-${sprint.id}`;
        const startTime = new Date(sprint.startDate).getTime();

        // If sprint started within the past 7 days or is current
        if (Math.abs(refDate.getTime() - startTime) <= 7 * 86400000) {
          notificationsMap.set(id, {
            id,
            type: 'SPRINT_STARTING',
            priority: 'MEDIUM',
            title: `Sprint 0${sprint.sprintNumber} Is Active`,
            message: `Sprint 0${sprint.sprintNumber} (${sprint.objective || 'Milestone Sprint'}) is active. Complete your scheduled milestones to stay on track.`,
            timestamp: new Date(sprint.startDate).toISOString(),
            isRead: readNotificationIds.includes(id),
            actionUrl: `/roadmap/sprints/${sprint.id}`,
            actionLabel: 'Open Sprint',
            metadata: {
              sprintId: sprint.id,
              sprintNumber: sprint.sprintNumber,
            },
          });
        }
      }
    }
  }

  // 4. Inactivity Reminder (No recorded activity for >= 3 days on active roadmap)
  if (preferences.inactivityReminders && userRoadmap.status === 'ACTIVE') {
    const daysSinceActivity = (refDate.getTime() - latestActivityTime) / 86400000;
    if (daysSinceActivity >= 3) {
      const id = `ntf-inactivity-${userRoadmapId || 'roadmap'}`;
      notificationsMap.set(id, {
        id,
        type: 'INACTIVITY_REMINDER',
        priority: 'MEDIUM',
        title: 'Resume Your Roadmap Journey',
        message: `It has been ${Math.floor(daysSinceActivity)} days since your last roadmap milestone. Re-engage to maintain your readiness streak!`,
        timestamp: generatedAt,
        isRead: readNotificationIds.includes(id),
        actionUrl: `/roadmap`,
        actionLabel: 'Resume Roadmap',
        metadata: {
          daysInactive: Math.floor(daysSinceActivity),
        },
      });
    }
  }

  // Convert to sorted array (chronological descending)
  const notifications = Array.from(notificationsMap.values()).sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    if (timeA !== timeB) return timeB - timeA;
    return a.id.localeCompare(b.id);
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    userRoadmapId,
    unreadCount,
    totalCount: notifications.length,
    notifications,
    preferences,
    generatedAt,
  };
}

// ─── Stage 10.1: Recruiter Talent Search & Skill Filtering ──────────────────

export interface RecruiterTalentQueryDTO {
  role?: string;
  targetCompanyTier?: 'FAANG' | 'TIER_1' | 'STARTUP' | 'ALL';
  minReadiness?: number;
  maxReadiness?: number;
  skills?: string[] | string;
  evidenceSource?: 'SELF_REPORTED' | 'ASSESSMENT' | 'CODING_INTERVIEW' | 'ORAL_INTERVIEW' | 'PROJECT' | 'ROADMAP_SPRINT';
  hasAssessmentProof?: boolean;
  search?: string;
  sortBy?: 'readiness' | 'updatedAt' | 'masteredSkillsCount' | 'evidenceCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface RecruiterCandidateCardDTO {
  candidateId: string;
  candidateName: string;
  userRoadmapId: string;
  roadmapId: string;
  targetRole: string;
  targetCompanyTier: string;
  overallReadiness: number;
  masteredSkills: string[];
  demonstratedSkills: string[];
  verifiedSkillsCount: number;
  completedSprintCount: number;
  totalSprintCount: number;
  assessmentSummary: {
    totalAttempts: number;
    passedAttempts: number;
    averageScore: number | null;
  };
  practicalSummary: {
    totalDrills: number;
    passedDrills: number;
    averageScore: number | null;
  };
  verifiedEvidenceCount: number;
  evidenceSources: string[];
  verificationId: string;
  verificationUrl: string;
  lastActiveAt?: string | null;
}

export interface RecruiterTalentSearchResponseDTO {
  candidates: RecruiterCandidateCardDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filtersApplied: {
    role?: string | null;
    targetCompanyTier?: string | null;
    minReadiness: number;
    maxReadiness: number;
    skills: string[];
    evidenceSource?: string | null;
    hasAssessmentProof: boolean;
    search?: string | null;
    sortBy: string;
    sortOrder: string;
  };
}

// ─── Stage 10.2: Job Description Matching Engine ────────────────────────────

export interface JobDescriptionMatchInputDTO {
  title: string;
  description?: string;
  targetCompanyTier?: 'FAANG' | 'TIER_1' | 'STARTUP' | 'ALL';
  requiredSkills?: string[] | string;
  preferredSkills?: string[] | string;
  minMatchScore?: number;
  limit?: number;
  page?: number;
}

export interface CandidateMatchCardDTO {
  candidateId: string;
  candidateName: string;
  userRoadmapId: string;
  roadmapId: string;
  targetRole: string;
  targetCompanyTier: string;
  overallReadiness: number;
  matchScore: number; // 0 - 100
  scoreBreakdown: {
    requiredSkillsScore: number;
    preferredSkillsScore: number;
    roleAlignmentScore: number;
    evidenceStrengthScore: number;
    readinessScore: number;
  };
  requiredSkillsMatched: string[];
  requiredSkillsMissing: string[];
  preferredSkillsMatched: string[];
  preferredSkillsMissing: string[];
  evidenceSources: string[];
  assessmentSummary: {
    totalAttempts: number;
    passedAttempts: number;
    averageScore: number | null;
  };
  practicalSummary: {
    totalDrills: number;
    passedDrills: number;
    averageScore: number | null;
  };
  verificationId: string;
  verificationUrl: string;
  explanation: string;
  lastActiveAt?: string | null;
}

export interface JobDescriptionMatchResponseDTO {
  jobProfile: {
    title: string;
    targetCompanyTier: string;
    extractedRequiredSkills: string[];
    extractedPreferredSkills: string[];
  };
  matches: CandidateMatchCardDTO[];
  totalMatches: number;
  page: number;
  limit: number;
  totalPages: number;
  generatedAt: string;
}

// ─── Stage 10.3: Recruiter Shortlist & Talent Pipeline ──────────────────────

export type RecruiterPipelineStatus = 'SHORTLISTED' | 'REVIEWING' | 'INTERVIEW' | 'SELECTED' | 'REJECTED';

export interface RecruiterShortlistMatchContextDTO {
  jobTitle?: string;
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  matchedAt?: string;
}

export interface RecruiterShortlistEntryDTO {
  id: string;
  recruiterId: string;
  candidateId: string;
  candidateName: string;
  userRoadmapId: string;
  roadmapId: string;
  targetRole: string;
  targetCompanyTier: string;
  overallReadiness: number;
  status: RecruiterPipelineStatus;
  notes?: string | null;
  matchContext?: RecruiterShortlistMatchContextDTO | null;
  verifiedSkillsCount: number;
  masteredSkills: string[];
  demonstratedSkills: string[];
  evidenceSources: string[];
  assessmentSummary: {
    totalAttempts: number;
    passedAttempts: number;
    averageScore: number | null;
  };
  practicalSummary: {
    totalDrills: number;
    passedDrills: number;
    averageScore: number | null;
  };
  verificationId: string;
  verificationUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddToShortlistInputDTO {
  candidateId: string;
  userRoadmapId?: string;
  status?: RecruiterPipelineStatus;
  notes?: string;
  matchContext?: RecruiterShortlistMatchContextDTO;
}

export interface UpdateShortlistStatusInputDTO {
  status?: RecruiterPipelineStatus;
  notes?: string;
}

export interface RecruiterShortlistQueryDTO {
  status?: RecruiterPipelineStatus | 'ALL';
  targetRole?: string;
  search?: string;
  sortBy?: 'updatedAt' | 'readiness' | 'status' | 'candidateName';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface RecruiterShortlistResponseDTO {
  entries: RecruiterShortlistEntryDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statusCounts: Record<RecruiterPipelineStatus, number>;
  filtersApplied: {
    status?: string | null;
    targetRole?: string | null;
    search?: string | null;
    sortBy: string;
    sortOrder: string;
  };
}

// ═══════════════════════════════════════════════════════════════
// Stage 10.4: Cohort & Campus Analytics DTOs
// ═══════════════════════════════════════════════════════════════

export interface CohortAnalyticsQueryDTO {
  institution?: string;
  college?: string;
  batch?: string;
  graduationYear?: number | string;
  branch?: string;
  targetRole?: string;
  targetCompanyTier?: string;
  roadmapId?: string;
  minReadiness?: number;
  maxReadiness?: number;
}

export type ReadinessBandTier =
  | 'TIER_1_ADVANCED'
  | 'TIER_2_PROFICIENT'
  | 'TIER_3_DEVELOPING'
  | 'TIER_4_BEGINNER';

export interface ReadinessBandDTO {
  band: ReadinessBandTier;
  label: string;
  minScore: number;
  maxScore: number;
  candidateCount: number;
  percentage: number;
}

export interface CohortSkillMetricDTO {
  skillId?: string;
  skillName: string;
  category: string;
  candidateCount: number;
  coveragePercentage: number;
  averageScore: number;
  masteredCount: number;
}

export interface CohortSkillGapDTO {
  skillName: string;
  category?: string;
  gapCount: number;
  gapPercentage: number;
}

export interface CohortAssessmentSummaryDTO {
  totalAttempts: number;
  passedAttempts: number;
  overallPassRate: number;
  averageScore: number;
  candidatesAssessed: number;
  assessedCoveragePercentage: number;
}

export interface CohortPracticalSummaryDTO {
  candidatesWithPracticalEvidence: number;
  practicalCoveragePercentage: number;
  totalPracticalDrills: number;
  averagePracticalScore: number;
  evidenceSourceCounts: Record<string, number>;
}

export interface CohortDistributionItemDTO {
  key: string;
  count: number;
  percentage: number;
}

export interface CohortAnalyticsResponseDTO {
  summary: {
    totalCandidates: number;
    verifiedCandidates: number;
    activeCandidates: number;
    completedCandidates: number;
    averageReadiness: number;
    medianReadiness: number;
    minReadiness: number;
    maxReadiness: number;
  };
  readinessDistribution: {
    averageReadiness: number;
    medianReadiness: number;
    bands: ReadinessBandDTO[];
  };
  skillsAnalysis: {
    topDemonstratedSkills: CohortSkillMetricDTO[];
    commonSkillGaps: CohortSkillGapDTO[];
    categoryBreakdown: CohortDistributionItemDTO[];
  };
  assessmentPerformance: CohortAssessmentSummaryDTO;
  practicalEvidence: CohortPracticalSummaryDTO;
  distributions: {
    roles: CohortDistributionItemDTO[];
    companyTiers: CohortDistributionItemDTO[];
    institutions: CohortDistributionItemDTO[];
  };
  filtersApplied: CohortAnalyticsQueryDTO;
  calculatedAt: string;
}

// ═══════════════════════════════════════════════════════════════
// Stage 10.5: Export & Verification DTOs
// ═══════════════════════════════════════════════════════════════

export type ExportFormat = 'json' | 'csv';

export interface RecruiterExportQueryDTO {
  format?: ExportFormat;
  status?: RecruiterPipelineStatus | 'ALL';
  targetRole?: string;
  search?: string;
  limit?: number;
}

export interface CohortExportQueryDTO extends CohortAnalyticsQueryDTO {
  format?: ExportFormat;
}

export interface RecruiterCandidateExportItemDTO {
  id: string;
  candidateId: string;
  candidateName: string;
  targetRole: string;
  targetCompanyTier: string;
  overallReadiness: number;
  pipelineStatus: RecruiterPipelineStatus;
  verifiedSkillsCount: number;
  masteredSkills: string[];
  demonstratedSkills: string[];
  matchScore: number | null;
  matchedSkills: string[];
  missingSkills: string[];
  recruiterNotes: string | null;
  verificationId: string;
  verificationUrl: string;
  shortlistedAt: string;
  updatedAt: string;
}

export interface ExportResultDTO {
  format: ExportFormat;
  filename: string;
  contentType: string;
  data: string;
  recordCount: number;
  exportedAt: string;
}

// ═══════════════════════════════════════════════════════════════
// Stage 11.1: Institutional Cohort & Batch Tracking DTOs
// ═══════════════════════════════════════════════════════════════

export interface InstitutionalCohortQueryDTO {
  institution?: string;
  college?: string;
  batch?: string;
  graduationYear?: number | string;
  branch?: string;
  targetRole?: string;
  targetCompanyTier?: string;
  roadmapId?: string;
  minReadiness?: number;
  maxReadiness?: number;
}

export interface BatchMilestoneVelocityDTO {
  totalSprintsEnrolled: number;
  completedSprintsCount: number;
  averageSprintsCompleted: number;
  sprintCompletionRate: number;
  activeSprintVelocity: number;
  milestonesCompleted: number;
}

export interface InstitutionalBatchSummaryDTO {
  institution: string;
  batch?: string | null;
  graduationYear?: string | number | null;
  branch?: string | null;
  summary: {
    totalCandidates: number;
    activeCandidates: number;
    completedCandidates: number;
    averageReadiness: number;
    medianReadiness: number;
    minReadiness: number;
    maxReadiness: number;
  };
  milestoneVelocity: BatchMilestoneVelocityDTO;
  readinessDistribution: {
    averageReadiness: number;
    medianReadiness: number;
    bands: ReadinessBandDTO[];
  };
  skillsAnalysis: {
    topDemonstratedSkills: CohortSkillMetricDTO[];
    commonSkillGaps: CohortSkillGapDTO[];
    categoryBreakdown: CohortDistributionItemDTO[];
  };
  assessmentPerformance: CohortAssessmentSummaryDTO;
  practicalPerformance: CohortPracticalSummaryDTO;
  distributions: {
    roles: CohortDistributionItemDTO[];
    batches: CohortDistributionItemDTO[];
    branches: CohortDistributionItemDTO[];
  };
  filtersApplied: InstitutionalCohortQueryDTO;
  generatedAt: string;
}

export interface InstitutionalBatchOverviewItemDTO {
  batch: string;
  graduationYear?: number | string | null;
  totalLearners: number;
  activeLearners: number;
  completedLearners: number;
  averageReadiness: number;
  completionRate: number;
}

export interface InstitutionalBatchListResponseDTO {
  institution: string;
  batches: InstitutionalBatchOverviewItemDTO[];
  totalBatches: number;
  totalLearners: number;
  generatedAt: string;
}

// ═══════════════════════════════════════════════════════════════
// Stage 11.2: Multi-Recruiter Collaborative Pipeline & Feedback Rubrics DTOs
// ═══════════════════════════════════════════════════════════════

export type RubricRecommendation =
  | 'STRONG_HIRE'
  | 'HIRE'
  | 'LEANING_HIRE'
  | 'LEANING_NO_HIRE'
  | 'NO_HIRE';

export interface CandidateFeedbackRubricDTO {
  technicalSkillsScore: number;       // 1 - 5
  communicationScore: number;         // 1 - 5
  problemSolvingScore: number;        // 1 - 5
  roleFitScore: number;               // 1 - 5
  practicalEvidenceScore: number;     // 1 - 5
  overallScore?: number;              // 0 - 100
  recommendation: RubricRecommendation;
  strengths?: string[];
  areasForGrowth?: string[];
}

export interface SubmitCandidateFeedbackInputDTO {
  candidateId: string;
  userRoadmapId?: string;
  rubric: CandidateFeedbackRubricDTO;
  comments?: string | null;
  stage?: RecruiterPipelineStatus;
  isSharedWithTeam?: boolean;
}

export interface UpdateCandidateFeedbackInputDTO {
  rubric?: Partial<CandidateFeedbackRubricDTO>;
  comments?: string | null;
  stage?: RecruiterPipelineStatus;
  isSharedWithTeam?: boolean;
}

export interface CandidateCollaborativeFeedbackDTO {
  id: string;
  candidateId: string;
  userRoadmapId?: string;
  organizationId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole?: string;
  rubric: CandidateFeedbackRubricDTO;
  comments?: string | null;
  stage: RecruiterPipelineStatus;
  isSharedWithTeam: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CollaborationActivityType =
  | 'STATUS_CHANGED'
  | 'FEEDBACK_SUBMITTED'
  | 'FEEDBACK_UPDATED'
  | 'CANDIDATE_SHORTLISTED';

export interface CandidateCollaborationActivityItemDTO {
  id: string;
  candidateId: string;
  organizationId: string;
  actorId: string;
  actorName: string;
  activityType: CollaborationActivityType;
  details: string;
  timestamp: string;
}

export interface CandidateCollaborationThreadDTO {
  candidateId: string;
  userRoadmapId?: string;
  organizationId: string;
  pipelineStatus: RecruiterPipelineStatus;
  totalReviews: number;
  averageRubricScore: number;
  recommendationBreakdown: Record<RubricRecommendation, number>;
  feedbackList: CandidateCollaborativeFeedbackDTO[];
  activityLog: CandidateCollaborationActivityItemDTO[];
  updatedAt: string;
}

export interface CandidateFeedbackQueryDTO {
  candidateId?: string;
  stage?: RecruiterPipelineStatus | 'ALL';
  reviewerId?: string;
  page?: number;
  limit?: number;
}

// ═══════════════════════════════════════════════════════════════
// Stage 11.3: ATS Integration & Standardized Batch Export DTOs
// ═══════════════════════════════════════════════════════════════

export type AtsAdapterType = 'GENERIC_ATS' | 'GREENHOUSE' | 'WORKDAY' | 'LEVER';

export interface AtsExportQueryDTO {
  format?: ExportFormat;
  adapter?: AtsAdapterType;
  status?: RecruiterPipelineStatus | 'ALL';
  targetRole?: string;
  targetCompanyTier?: string;
  minReadiness?: number;
  maxReadiness?: number;
  institution?: string;
  college?: string;
  batch?: string;
  graduationYear?: number | string;
  branch?: string;
  search?: string;
  limit?: number;
}

export interface AtsCollaborationSummaryDTO {
  totalReviews: number;
  averageRubricScore: number | null;
  latestRecommendation: RubricRecommendation | null;
  sharedFeedbackCount: number;
}

export interface AtsCandidateExportItemDTO {
  candidateId: string;
  candidateName: string;
  targetRole: string;
  targetCompanyTier: string;
  overallReadiness: number;
  pipelineStatus: RecruiterPipelineStatus;
  matchScore: number | null;
  demonstratedSkills: string[];
  masteredSkills: string[];
  missingSkills: string[];
  collaborationSummary: AtsCollaborationSummaryDTO;
  verificationId: string;
  verificationUrl: string;
  institution?: string | null;
  batch?: string | null;
  graduationYear?: string | number | null;
  branch?: string | null;
  exportedAt: string;
}

export interface AtsBatchExportResponseDTO {
  adapter: AtsAdapterType;
  format: ExportFormat;
  totalCandidates: number;
  organizationId?: string | null;
  institution?: string | null;
  candidates: AtsCandidateExportItemDTO[];
  exportedAt: string;
}

// ═══════════════════════════════════════════════════════════════
// Stage 11.4: Bulk Credential Attestation & Verification DTOs
// ═══════════════════════════════════════════════════════════════

export type CredentialVerificationStatus =
  | 'VERIFIED'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REVOKED'
  | 'EXPIRED'
  | 'UNAUTHORIZED'
  | 'ERROR';

export type CredentialType = 'VERIFIED_PROFILE' | 'CERTIFICATE';

export interface BulkCredentialVerificationQueryDTO {
  credentialIds: string[];
  institution?: string;
  organizationId?: string;
  allowPartial?: boolean;
}

export interface CredentialAttestationDetailsDTO {
  institution?: string | null;
  college?: string | null;
  batch?: string | null;
  graduationYear?: string | number | null;
  branch?: string | null;
}

export interface BulkCredentialVerificationItemDTO {
  credentialId: string;
  credentialType: CredentialType;
  status: CredentialVerificationStatus;
  isValid: boolean;
  candidateName?: string | null;
  targetRole?: string | null;
  targetCompanyTier?: string | null;
  overallReadiness?: number | null;
  verificationId?: string | null;
  certificateId?: string | null;
  verificationUrl?: string | null;
  issuedAt?: string | null;
  expiresAt?: string | null;
  verifiedAt: string;
  attestation?: CredentialAttestationDetailsDTO | null;
  errorReason?: string | null;
}

export interface BulkCredentialVerificationResponseDTO {
  totalRequested: number;
  totalVerified: number;
  totalInvalid: number;
  totalNotFound: number;
  totalUnauthorized: number;
  results: BulkCredentialVerificationItemDTO[];
  verifiedAt: string;
  institution?: string | null;
  organizationId?: string | null;
}






