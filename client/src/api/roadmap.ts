import apiClient from './client';

export type RoadmapVisibility = 'PRIVATE' | 'UNLISTED' | 'PUBLIC';
export type RoadmapNodeStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type MasteryStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'LEARNING_COMPLETE'
  | 'ASSESSMENT_PENDING'
  | 'ASSESSMENT_PASSED'
  | 'NEEDS_IMPROVEMENT'
  | 'MASTERED';

export type RoadmapNodeType =
  | 'SECTION'
  | 'MODULE'
  | 'LESSON'
  | 'EXERCISE'
  | 'PROJECT'
  | 'ASSESSMENT'
  | 'RESOURCE';

export interface RubricCriterion {
  id: string;
  criterion: string;
  weight: number;
  description: string;
}

export interface RoadmapNodeMetadata {
  estimatedHours?: number;
  learningObjectives?: string[];
  resources?: Array<{ label: string; url: string; type?: string; duration?: string }>;
  practicalTasks?: Array<{ id: string; title: string; instructions: string }>;
  prerequisiteNodeIds?: string[];
  assessmentRubric?: {
    passingScore: number;
    criteria: RubricCriterion[];
  };
  interview?: { topic: string; description?: string };
  // 7 Human Questions
  whyLearnThis?: string;
  whatYouWillLearn?: string[];
  whatToBuild?: string;
  howToVerify?: string;
  unlockedSkills?: string[];
  completionCriteria?: string[];
  positionCoordinates?: { x: number; y: number };
  [key: string]: unknown;
}

export interface RoadmapNode {
  id?: string;
  roadmapId?: string;
  title: string;
  description?: string;
  type?: RoadmapNodeType | string;
  status?: RoadmapNodeStatus;
  position?: number;
  order?: number;
  estimatedMinutes?: number;
  parentId?: string;
  children?: RoadmapNode[];
  metadata?: RoadmapNodeMetadata;
  interview?: { topic: string; description?: string };
  // Progress when fetched in instance context
  masteryStatus?: MasteryStatus;
  assessmentScore?: number | null;
  lastAssessmentAt?: string | null;
}

export interface RoadmapVersionItem {
  id: string;
  roadmapId: string;
  version: number;
  title: string;
  description?: string;
  changelog?: string;
  createdAt: string;
  createdBy?: string;
}

export interface GoalClarificationQuestion {
  id: string;
  question: string;
  reason: string;
  options: string[];
}

export interface GoalClarificationResponse {
  isReady: boolean;
  refinedGoal: string;
  questions: GoalClarificationQuestion[];
  detectedCategory: string;
  recommendedDifficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  recommendedWeeks: number;
}

export interface PatchResult {
  roadmap: Roadmap;
  summary: string;
  affectedNodeIds: string[];
  mutatedNodeTitles: string[];
  diff: {
    added: string[];
    updated: string[];
    removed: string[];
    reordered: boolean;
  };
  cycleDetected?: boolean;
  cycleNodes?: string[];
}

export interface RoadmapReview {
  id: string;
  roadmapId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface RoadmapDiscussion {
  id: string;
  roadmapId: string;
  nodeId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title?: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface RoadmapInstance {
  id: string;
  roadmapId: string;
  userId: string;
  targetPaceHoursPerWeek: number;
  activeNodeId?: string | null;
  completionPercent: number;
  masteryCount: number;
  targetCompletionDate?: string | null;
  customNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  roadmap: Roadmap;
}

export interface Roadmap {
  id: string;
  title: string;
  description?: string;
  goal?: string;
  visibility: RoadmapVisibility;
  isPublished?: boolean;
  publishedAt?: string;
  currentVersion?: number;
  forkedFromId?: string | null;
  forkedFromVersion?: number | null;
  forkedFrom?: {
    id: string;
    title: string;
    creatorName?: string;
    creatorCompany?: string;
  } | null;
  forkCount?: number;
  followerCount?: number;
  rating?: number;
  reviewCount?: number;
  isEndorsed?: boolean;
  creatorRole?: string;
  creatorCompany?: string;
  isVerifiedCreator?: boolean;
  license?: string;
  graphLayout?: unknown;
  ownerId?: string;
  owner?: { id: string; name: string; avatarUrl?: string };
  creatorName?: string;
  nodes: RoadmapNode[];
  progress?: { completed: number; total: number; percent: number };
  collaborators?: Array<{ id: string; name: string; role: 'EDITOR' | 'VIEWER' }>;
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedWeeks?: number;
  tags?: string[];
  cloneCount?: number;
  viewCount?: number;
  isFollowing?: boolean;
  activeInstance?: RoadmapInstance | null;
}

export interface RoadmapTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  nodeCount: number;
  accent: string;
}

export interface RoadmapAnalytics {
  roadmapId?: string;
  totalProgressRecords?: number;
  completedProgressRecords?: number;
  completionRate?: number;
  completionPercent?: number;
  completedNodes?: number;
  totalNodes?: number;
  activeDays?: number;
  collaborators?: number;
  activeLearners?: number;
}

export interface RoadmapWorkspaceData {
  instances: RoadmapInstance[];
  following: Roadmap[];
  created: Roadmap[];
  forks: Roadmap[];
  summary: {
    activeLearningCount: number;
    followingCount: number;
    createdCount: number;
    totalMasteredModules: number;
    avgCompletionRate: number;
  };
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'CONCEPTUAL' | 'SCENARIO' | 'ARCHITECTURE';
  rubricCriterionId: string;
  points: number;
  evaluationCriteria: string;
}

export interface AssessmentResult {
  score: number;
  passed: boolean;
  masteryStatus: MasteryStatus;
  feedback: string;
  criterionScores: Record<string, number>;
  competenciesDemonstrated: string[];
  areasForImprovement: string[];
  nextRecommendedStep: string;
  attemptId: string;
}

export type DeliverableType =
  | 'REPOSITORY'
  | 'DEPLOYMENT'
  | 'CODE'
  | 'DIAGRAM'
  | 'TEXT';

export interface RoadmapSubmission {
  id: string;
  roadmapId: string;
  nodeId: string;
  userId: string;
  userName?: string;
  deliverableType: DeliverableType;
  deliverableUrl?: string;
  deliverableText?: string;
  codeLanguage?: string;
  rubricScore?: number;
  status: 'SUBMITTED' | 'PASSED' | 'NEEDS_REVISION';
  feedback?: string;
  strengths?: string[];
  areasToImprove?: string[];
  competenciesDemonstrated?: string[];
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
  node?: { id: string; title: string; type: string; position: number };
}

export interface DeliverableEvaluationResult {
  submissionId: string;
  status: 'PASSED' | 'NEEDS_REVISION';
  rubricScore: number;
  feedback: string;
  strengths: string[];
  areasToImprove: string[];
  competenciesDemonstrated: string[];
  nextSteps: string;
}

export interface DiagnosticQuestion {
  id: string;
  nodeId: string;
  moduleTitle: string;
  domain: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface DiagnosticRecommendation {
  nodeId: string;
  moduleTitle: string;
  action: 'START' | 'SKIP' | 'REVIEW' | 'ADVANCED';
  score: number;
  reason: string;
  suggestedAction: string;
}

export interface DiagnosticEvaluationResult {
  completedAt: string;
  overallScore: number;
  domainProficiencies: Record<string, number>;
  recommendations: DiagnosticRecommendation[];
  summary: string;
}

export type CompanionMode = 'EXPLAIN' | 'SOCRATIC_HINT' | 'DEBUG' | 'NEXT_STEP';

export interface CompanionResponse {
  mode: CompanionMode;
  reply: string;
  suggestedPrompts: string[];
  keyConceptSummary?: string;
  recommendedAction?: string;
}

export interface LearningCircleMember {
  id: string;
  circleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role: 'CREATOR' | 'MENTOR' | 'MEMBER';
  progressPercent: number;
  completedModulesCount: number;
  joinedAt: string;
}

export interface LearningCircle {
  id: string;
  roadmapId: string;
  name: string;
  description?: string;
  creatorId: string;
  creatorName: string;
  isPrivate: boolean;
  joinCode: string;
  targetDate?: string;
  weeklyGoalHours: number;
  createdAt: string;
  members?: LearningCircleMember[];
  _count?: { members: number };
  cohortSize?: number;
  averageProgressPercent?: number;
  roadmap?: { id: string; title: string; category?: string; estimatedWeeks?: number };
}

export interface NextActionPlan {
  roadmapId: string;
  actionType: 'START_FOUNDATIONS' | 'BUILD_MISSION' | 'SUBMIT_DELIVERABLE' | 'VERIFY_MASTERY' | 'ALL_COMPLETED';
  nodeId?: string;
  nodeIndex: number;
  nodeTitle?: string;
  nodeType: string;
  estimatedHours: number;
  whatToDoNow: string;
  whyItMatters: string;
  howToProveIt: string;
  allMastered: boolean;
}

const unwrap = <T>(response: { data: T | { data: T } }): T => {
  const value = response.data;
  return typeof value === 'object' && value !== null && 'data' in value
    ? (value.data as T)
    : (value as T);
};

const normalizeRoadmap = (
  roadmap: Roadmap & { isPublished?: boolean; nodes?: Array<RoadmapNode & { position?: number }> }
): Roadmap => {
  const flat: Array<RoadmapNode & { children: RoadmapNode[] }> = (roadmap.nodes || []).map(
    (node, index) => ({
      ...node,
      order: node.order ?? node.position ?? index,
      children: [],
      metadata: node.metadata || (node.interview ? { interview: node.interview } : {}),
    })
  );
  const byId = new Map(flat.filter((node) => node.id).map((node) => [node.id as string, node]));
  const roots: RoadmapNode[] = [];
  flat.forEach((node) => {
    const parent = node.parentId ? byId.get(node.parentId) : undefined;
    if (parent) parent.children?.push(node);
    else roots.push(node);
  });
  return {
    ...roadmap,
    visibility: roadmap.visibility || (roadmap.isPublished ? 'PUBLIC' : 'PRIVATE'),
    nodes: roots,
  };
};

export const roadmapApi = {
  list: async () => unwrap<Roadmap[]>(await apiClient.get('/roadmaps')).map(normalizeRoadmap),

  get: async (id: string) =>
    normalizeRoadmap(unwrap<Roadmap>(await apiClient.get(`/roadmaps/${id}`))),

  getWorkspace: async () => unwrap<RoadmapWorkspaceData>(await apiClient.get('/roadmaps/workspace')),

  getMyInstances: async () => unwrap<RoadmapInstance[]>(await apiClient.get('/roadmaps/my-instances')),

  createInstance: async (roadmapId: string, targetPaceHoursPerWeek = 6) =>
    unwrap<RoadmapInstance>(
      await apiClient.post(`/roadmaps/${roadmapId}/instances`, { targetPaceHoursPerWeek })
    ),

  toggleFollow: async (roadmapId: string) =>
    unwrap<{ following: boolean; followerCount: number }>(
      await apiClient.post(`/roadmaps/${roadmapId}/follow`)
    ),

  fork: async (roadmapId: string, title?: string) =>
    normalizeRoadmap(
      unwrap<Roadmap>(await apiClient.post(`/roadmaps/${roadmapId}/fork`, { title }))
    ),

  clone: async (id: string, title?: string) =>
    normalizeRoadmap(
      unwrap<Roadmap>(await apiClient.post(`/roadmaps/${id}/clone`, { title }))
    ),

  create: async (payload: Partial<Roadmap>) =>
    normalizeRoadmap(unwrap<Roadmap>(await apiClient.post('/roadmaps', payload))),

  clarifyGoal: async (payload: {
    goal: string;
    experience?: string;
    targetOutcome?: string;
    weeklyHours?: number;
    timelineWeeks?: number;
    preferredStyle?: string;
    previousAnswers?: Record<string, string>;
  }) => unwrap<GoalClarificationResponse>(await apiClient.post('/roadmaps/ai/clarify', payload)),

  generate: async (payload: {
    goal: string;
    role?: string;
    level?: string;
    weeks?: number;
    title?: string;
    clarificationAnswers?: Record<string, string>;
  }) =>
    normalizeRoadmap(unwrap<Roadmap>(await apiClient.post('/roadmaps/ai/generate', payload))),

  chatCopilot: async (roadmapId: string, message: string) =>
    unwrap<{
      roadmap: Roadmap;
      explanation: string;
      mutatedNodeTitles: string[];
    }>(await apiClient.post(`/roadmaps/${roadmapId}/ai/chat`, { message })),

  applyPatch: async (roadmapId: string, instruction: string, currentNodes?: RoadmapNode[]) =>
    unwrap<PatchResult>(
      await apiClient.post(`/roadmaps/${roadmapId}/ai/patch`, { instruction, currentNodes })
    ),

  saveDraft: async (
    roadmapId: string,
    payload: {
      baseVersion?: number;
      title?: string;
      description?: string;
      goal?: string;
      category?: string;
      difficulty?: string;
      estimatedWeeks?: number;
      tags?: string[];
      graphLayout?: unknown;
      nodes?: RoadmapNode[];
      changelog?: string;
      createSnapshot?: boolean;
    }
  ) =>
    unwrap<{ conflict: boolean; version: number; roadmap: Roadmap; message?: string }>(
      await apiClient.put(`/roadmaps/${roadmapId}/draft`, payload)
    ),

  getVersions: async (roadmapId: string) =>
    unwrap<RoadmapVersionItem[]>(await apiClient.get(`/roadmaps/${roadmapId}/versions`)),

  restoreVersion: async (roadmapId: string, version: number) =>
    normalizeRoadmap(
      unwrap<Roadmap>(await apiClient.post(`/roadmaps/${roadmapId}/versions/${version}/restore`))
    ),

  update: async (id: string, payload: Partial<Roadmap>) =>
    unwrap<Roadmap>(await apiClient.patch(`/roadmaps/${id}`, payload)),

  delete: async (id: string) => {
    await apiClient.delete(`/roadmaps/${id}`);
  },

  publish: async (id: string, license = 'CC-BY-4.0') =>
    unwrap<Roadmap>(await apiClient.post(`/roadmaps/${id}/publish`, { license })),

  addNode: async (id: string, node: Partial<RoadmapNode>) =>
    unwrap<RoadmapNode>(await apiClient.post(`/roadmaps/${id}/nodes`, node)),

  updateNode: async (id: string, nodeId: string, payload: Partial<RoadmapNode>) =>
    unwrap<RoadmapNode>(await apiClient.patch(`/roadmaps/${id}/nodes/${nodeId}`, payload)),

  deleteNode: async (id: string, nodeId: string) => {
    await apiClient.delete(`/roadmaps/${id}/nodes/${nodeId}`);
  },

  explore: async (params?: {
    category?: string;
    difficulty?: string;
    search?: string;
    filter?: 'all' | 'verified' | 'endorsed' | 'trending';
    tag?: string;
    sortBy?: 'trending' | 'rating' | 'followers' | 'newest';
  }) => {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.difficulty && params.difficulty !== 'ALL' && params.difficulty !== 'all')
      query.set('difficulty', params.difficulty);
    if (params?.search?.trim()) query.set('search', params.search.trim());
    if (params?.filter && params.filter !== 'all') query.set('filter', params.filter);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return unwrap<Roadmap[]>(await apiClient.get(`/roadmaps/explore${qs}`)).map(normalizeRoadmap);
  },

  updateProgress: async (
    id: string,
    nodeId: string,
    percent: number,
    notes?: string,
    masteryStatus?: MasteryStatus
  ) =>
    unwrap(
      await apiClient.put(`/roadmaps/${id}/progress/${nodeId}`, {
        status: percent === 100 ? 'DONE' : percent > 0 ? 'IN_PROGRESS' : 'TODO',
        percent,
        notes,
        masteryStatus,
      })
    ),

  getProgress: async (id: string) =>
    unwrap<Array<{ nodeId: string; percent: number; status: string; masteryStatus: MasteryStatus }>>(
      await apiClient.get(`/roadmaps/${id}/progress`)
    ),

  getTemplates: async () =>
    unwrap<RoadmapTemplate[]>(await apiClient.get('/roadmaps/templates')),

  getAnalytics: async (id: string) =>
    unwrap<RoadmapAnalytics>(await apiClient.get(`/roadmaps/${id}/analytics`)),

  invite: async (id: string, email: string, role: 'EDITOR' | 'VIEWER') =>
    unwrap<Roadmap>(await apiClient.post(`/roadmaps/${id}/collaborators`, { email, role })),

  getReviews: async (roadmapId: string) =>
    unwrap<RoadmapReview[]>(await apiClient.get(`/roadmaps/${roadmapId}/reviews`)),

  addReview: async (roadmapId: string, payload: { rating: number; reviewText: string }) =>
    unwrap<RoadmapReview>(await apiClient.post(`/roadmaps/${roadmapId}/reviews`, payload)),

  getDiscussions: async (roadmapId: string, nodeId?: string) => {
    const qs = nodeId ? `?nodeId=${encodeURIComponent(nodeId)}` : '';
    return unwrap<RoadmapDiscussion[]>(await apiClient.get(`/roadmaps/${roadmapId}/discussions${qs}`));
  },

  addDiscussion: async (
    roadmapId: string,
    payload: { nodeId?: string; title?: string; content: string }
  ) =>
    unwrap<RoadmapDiscussion>(await apiClient.post(`/roadmaps/${roadmapId}/discussions`, payload)),

  getAssessmentQuestions: async (roadmapId: string, nodeId: string) =>
    unwrap<{ nodeId: string; nodeTitle: string; questions: AssessmentQuestion[] }>(
      await apiClient.get(`/roadmaps/${roadmapId}/nodes/${nodeId}/assessment-questions`)
    ),

  submitAssessment: async (
    roadmapId: string,
    nodeId: string,
    answers: Array<{ questionId: string; answerText: string }>
  ) =>
    unwrap<AssessmentResult>(
      await apiClient.post(`/roadmaps/${roadmapId}/nodes/${nodeId}/assess`, { answers })
    ),

  getAssessmentHistory: async (roadmapId: string, nodeId: string) =>
    unwrap<any[]>(await apiClient.get(`/roadmaps/${roadmapId}/nodes/${nodeId}/assessments`)),

  // Tangible Deliverables
  submitDeliverable: async (
    roadmapId: string,
    nodeId: string,
    payload: {
      deliverableType: DeliverableType;
      deliverableUrl?: string;
      deliverableText?: string;
      codeLanguage?: string;
      executionResult?: any;
    }
  ) =>
    unwrap<{ submission: RoadmapSubmission; evaluation: DeliverableEvaluationResult }>(
      await apiClient.post(`/roadmaps/${roadmapId}/nodes/${nodeId}/submissions`, payload)
    ),

  getNodeSubmissions: async (roadmapId: string, nodeId: string) =>
    unwrap<RoadmapSubmission[]>(
      await apiClient.get(`/roadmaps/${roadmapId}/nodes/${nodeId}/submissions`)
    ),

  getRoadmapSubmissions: async (roadmapId: string) =>
    unwrap<RoadmapSubmission[]>(
      await apiClient.get(`/roadmaps/${roadmapId}/submissions`)
    ),

  // Adaptive Diagnostic Assessment
  getDiagnostic: async (roadmapId: string) =>
    unwrap<{ roadmapId: string; roadmapTitle: string; questions: DiagnosticQuestion[] }>(
      await apiClient.get(`/roadmaps/${roadmapId}/diagnostic`)
    ),

  evaluateDiagnostic: async (roadmapId: string, answers: Record<string, number>) =>
    unwrap<DiagnosticEvaluationResult>(
      await apiClient.post(`/roadmaps/${roadmapId}/diagnostic/evaluate`, { answers })
    ),

  // AI Learning Companion
  chatCompanion: async (
    roadmapId: string,
    nodeId: string,
    payload: { message: string; mode?: CompanionMode }
  ) =>
    unwrap<CompanionResponse>(
      await apiClient.post(`/roadmaps/${roadmapId}/nodes/${nodeId}/companion/chat`, payload)
    ),

  // Learning Circles
  getCircles: async (roadmapId: string) =>
    unwrap<LearningCircle[]>(
      await apiClient.get(`/roadmaps/${roadmapId}/circles`)
    ),

  createCircle: async (
    roadmapId: string,
    payload: {
      name: string;
      description?: string;
      targetDate?: string;
      weeklyGoalHours?: number;
      isPrivate?: boolean;
    }
  ) =>
    unwrap<LearningCircle>(
      await apiClient.post(`/roadmaps/${roadmapId}/circles`, payload)
    ),

  joinCircle: async (
    roadmapId: string,
    payload: { circleId?: string; joinCode?: string }
  ) =>
    unwrap<LearningCircleMember>(
      await apiClient.post(`/roadmaps/${roadmapId}/circles/join`, payload)
    ),

  getCircleDetails: async (roadmapId: string, circleId: string) =>
    unwrap<LearningCircle>(
      await apiClient.get(`/roadmaps/${roadmapId}/circles/${circleId}`)
    ),

  // Dynamic Next Action
  getNextAction: async (roadmapId: string) =>
    unwrap<NextActionPlan>(
      await apiClient.get(`/roadmaps/${roadmapId}/next-action`)
    ),
};
