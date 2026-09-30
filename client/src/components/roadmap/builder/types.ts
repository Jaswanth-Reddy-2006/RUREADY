export type TaskType = 'learning' | 'practice' | 'project' | 'assessment' | 'revision' | 'interview';

export type ResourceType = 'Video' | 'Article' | 'Documentation' | 'Course' | 'Book' | 'Other';

export interface TaskResource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
}

export interface TaskProjectData {
  title: string;
  description: string;
  skillsDemonstrated: string[];
  completionCriteria: string[]; // checklist items
}
export type ProjectData = TaskProjectData;

export interface TaskAssessmentData {
  title: string;
  passingScore: number;
  questionSource: 'rennetus_bank' | 'custom';
  customQuestionsCount?: number;
}
export type AssessmentData = TaskAssessmentData;

export interface TaskRevisionData {
  topics: string[];
  topicsToRevise?: string[];
  recommendedMinutes: number;
  resources?: TaskResource[];
}
export type RevisionData = TaskRevisionData;

export interface TaskInterviewData {
  topic: string;
  questionCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}
export type InterviewData = TaskInterviewData;

export interface BuilderTask {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  estimatedMinutes: number;
  required: boolean;
  skills: string[];
  resources: TaskResource[];
  practiceInstructions?: string;
  practiceResourceUrl?: string;
  problemCount?: number;
  practiceProblemCount?: number;
  projectData?: TaskProjectData | null;
  assessmentData?: TaskAssessmentData | null;
  revisionData?: TaskRevisionData | null;
  interviewData?: TaskInterviewData | null;
}

export interface BuilderSprint {
  id: string;
  title: string;
  description?: string;
  goal: string;
  durationDays: number; // 3, 5, 7, 10, 14, or custom
  tasks: BuilderTask[];
}

export interface BuilderMilestone {
  id: string;
  title: string;
  objective: string;
  estimatedDuration?: string;
  skills: string[];
  completionCriteria: string[];
  sprints: BuilderSprint[];
}

export interface BuilderPhase {
  id: string;
  title: string;
  description?: string;
  objective?: string;
  estimatedDuration?: string;
  milestones: BuilderMilestone[];
}

export interface BuilderRoadmapState {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: string;
  status: 'draft' | 'published';
  updatedAt: string;
  phases: BuilderPhase[];
}

export type SelectedTreeNodeType = 'roadmap' | 'phase' | 'milestone' | 'sprint' | 'task';

export interface SelectedTreeNode {
  type: SelectedTreeNodeType;
  phaseId?: string;
  milestoneId?: string;
  sprintId?: string;
  taskId?: string;
}

export type SelectedItemRef = SelectedTreeNode;

export interface ValidationIssueItem {
  message: string;
  type: 'phase' | 'milestone' | 'sprint' | 'task';
  phaseId?: string;
  milestoneId?: string;
  sprintId?: string;
  taskId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssueItem[];
  warnings: ValidationIssueItem[];
}
