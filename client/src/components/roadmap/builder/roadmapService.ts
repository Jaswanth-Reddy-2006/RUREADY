import { BuilderRoadmapState, BuilderTask, ValidationResult } from './types';
import { Roadmap, RoadmapNode } from '../../../store/useRoadmapStore';

const DRAFT_KEY = 'ru_manual_roadmap_draft';

export function getInitialRoadmapState(): BuilderRoadmapState {
  const timestamp = Date.now();
  return {
    id: `manual-roadmap-${timestamp}`,
    title: '',
    description: '',
    targetRole: '',
    category: 'Software Development',
    difficulty: 'Intermediate',
    estimatedDuration: '3 months',
    status: 'draft',
    updatedAt: new Date().toISOString(),
    phases: [
      {
        id: `phase-1-${timestamp}`,
        title: 'Phase 1 — Foundations & Core Principles',
        description: 'Master essential concepts and fundamental mental models.',
        objective: 'Establish a rock-solid foundation before building complex systems.',
        estimatedDuration: '4 weeks',
        milestones: [
          {
            id: `milestone-1-${timestamp}`,
            title: 'Milestone 1 — Language Fundamentals & Syntax',
            objective: 'Understand execution mechanics, data structures, and core syntax.',
            skills: ['Core Syntax', 'Data Structures', 'Functions', 'OOP'],
            completionCriteria: [
              'Complete required learning concepts',
              'Implement fundamental exercises from scratch',
              'Pass knowledge assessment',
            ],
            sprints: [
              {
                id: `sprint-1-${timestamp}`,
                title: 'Sprint 1 — Core Syntax & Data Structures',
                description: 'First 7-day sprint covering core syntax and array operations.',
                goal: 'Master basic data types, loops, and function composition.',
                durationDays: 7,
                tasks: [
                  {
                    id: `task-1-${timestamp}`,
                    title: 'Learn Core Execution & Scope Mechanics',
                    description: 'Study variable lexical scoping, closure models, and call stack execution.',
                    type: 'learning',
                    estimatedMinutes: 45,
                    required: true,
                    skills: ['Core Syntax', 'Scope'],
                    resources: [
                      {
                        id: `res-1-${timestamp}`,
                        title: 'Official Language Specification & Scope Mechanics',
                        url: 'https://docs.rennetus.com',
                        type: 'Documentation',
                      },
                    ],
                  },
                  {
                    id: `task-2-${timestamp}`,
                    title: 'Practice Array & String Manipulation Drills',
                    description: 'Solve 10 fundamental string parsing and array reduction problems.',
                    type: 'practice',
                    estimatedMinutes: 60,
                    required: true,
                    skills: ['Data Structures'],
                    resources: [],
                    practiceInstructions: 'Implement solution functions in the interactive sandbox.',
                    practiceProblemCount: 10,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

export function createDefaultRoadmapState(): BuilderRoadmapState {
  return getInitialRoadmapState();
}

export function saveDraftToLocalStorage(state: BuilderRoadmapState): void {
  try {
    const updated = { ...state, updatedAt: new Date().toISOString() };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
  } catch {
    // Storage unavailable fallback
  }
}

export function loadDraftFromLocalStorage(): BuilderRoadmapState | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Parsing error
  }
  return null;
}

export function clearDraftFromLocalStorage(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Storage fallback
  }
}

export function validateRoadmapState(state: BuilderRoadmapState): ValidationResult {
  const errors: any[] = [];
  const warnings: any[] = [];

  // Basic roadmap validation
  if (!state.title.trim()) {
    errors.push({
      message: 'Roadmap name is required.',
      type: 'roadmap',
    });
  }
  if (!state.targetRole.trim()) {
    errors.push({
      message: 'Target role/goal is required.',
      type: 'roadmap',
    });
  }

  if (state.phases.length === 0) {
    errors.push({
      message: 'Roadmap must contain at least one Phase.',
      type: 'roadmap',
    });
  }

  // Phase validation
  state.phases.forEach((phase, pIdx) => {
    if (!phase.title.trim()) {
      errors.push({
        message: `Phase ${pIdx + 1} has no title.`,
        type: 'phase',
        phaseId: phase.id,
      });
    }

    if (phase.milestones.length === 0) {
      warnings.push({
        message: `"${phase.title || `Phase ${pIdx + 1}`}" has no milestones.`,
        type: 'phase',
        phaseId: phase.id,
      });
    }

    // Milestone validation
    phase.milestones.forEach((ms, mIdx) => {
      if (!ms.title.trim()) {
        errors.push({
          message: `Milestone ${mIdx + 1} in Phase ${pIdx + 1} has no title.`,
          type: 'milestone',
          phaseId: phase.id,
          milestoneId: ms.id,
        });
      }
      if (!ms.objective.trim()) {
        warnings.push({
          message: `"${ms.title || `Milestone ${mIdx + 1}`}" has no objective specified.`,
          type: 'milestone',
          phaseId: phase.id,
          milestoneId: ms.id,
        });
      }
      if (ms.sprints.length === 0) {
        warnings.push({
          message: `"${ms.title || `Milestone ${mIdx + 1}`}" has no sprints.`,
          type: 'milestone',
          phaseId: phase.id,
          milestoneId: ms.id,
        });
      }

      // Sprint validation
      ms.sprints.forEach((sp, sIdx) => {
        if (!sp.title.trim()) {
          errors.push({
            message: `Sprint ${sIdx + 1} in "${ms.title}" has no title.`,
            type: 'sprint',
            phaseId: phase.id,
            milestoneId: ms.id,
            sprintId: sp.id,
          });
        }
        if (sp.tasks.length === 0) {
          warnings.push({
            message: `"${sp.title || `Sprint ${sIdx + 1}`}" has no tasks.`,
            type: 'sprint',
            phaseId: phase.id,
            milestoneId: ms.id,
            sprintId: sp.id,
          });
        }

        // Task validation
        sp.tasks.forEach((tk, tIdx) => {
          if (!tk.title.trim()) {
            errors.push({
              message: `Task ${tIdx + 1} in "${sp.title}" has no name.`,
              type: 'task',
              phaseId: phase.id,
              milestoneId: ms.id,
              sprintId: sp.id,
              taskId: tk.id,
            });
          }
        });
      });
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function convertToRoadmapModel(state: BuilderRoadmapState): Roadmap {
  const allNodes: RoadmapNode[] = [];
  let orderIndex = 1;

  state.phases.forEach((phase) => {
    phase.milestones.forEach((milestone) => {
      milestone.sprints.forEach((sprint) => {
        const primaryTask: BuilderTask | undefined = sprint.tasks[0];
        const starterCode = primaryTask?.type === 'project' ? primaryTask.projectData?.description : primaryTask?.practiceInstructions || `// ${sprint.title} Drill\nfunction executeDrill() {\n  return true;\n}`;

        allNodes.push({
          id: `node-${milestone.id}-${sprint.id}`,
          title: sprint.title,
          subHeader: `${phase.title} • ${milestone.title}`,
          category: phase.title,
          orderIndex: orderIndex++,
          status: orderIndex === 2 ? 'IN_PROGRESS' : 'LOCKED',
          score: 0,
          estimatedHours: Math.round(sprint.tasks.reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0) / 60) || 12,
          whatShouldIDo: {
            summary: sprint.goal || milestone.objective || phase.description || 'Master core milestone concepts.',
            actionSteps: sprint.tasks.map((t) => t.title),
            mentalModels: milestone.completionCriteria.length > 0 ? milestone.completionCriteria : ['Focus on execution, not memorization.'],
          },
          whatIsTheSource: sprint.tasks.flatMap((t) =>
            t.resources.map((r) => ({
              id: r.id,
              title: r.title,
              url: r.url,
              type: (r.type.toUpperCase() as any) || 'DOCS',
            }))
          ),
          whatIsTheExactThing: {
            title: primaryTask?.title || `${sprint.title} Completion Drill`,
            description: primaryTask?.description || sprint.goal || 'Complete all sprint tasks and submit deliverables.',
            deliverable: primaryTask?.type === 'project' ? primaryTask.projectData?.title || 'Completed Project' : 'Verified Task Execution',
            starterCode,
            verificationChecklist: milestone.completionCriteria.length > 0 ? milestone.completionCriteria : ['Tasks executed', 'Tests passed'],
          },
          microQuestions: [
            {
              id: `mq-${sprint.id}`,
              questionText: `Explain the key takeaways from ${sprint.title}.`,
              focus: 'Core Principles',
              suggestedAnswer: 'Articulate the fundamental mental models and trade-offs learned during execution.',
            },
          ],
        });
      });
    });
  });

  return {
    id: state.id,
    title: state.title || 'Custom Career Roadmap',
    rolePath: state.targetRole || 'Software Engineer',
    category: (state.category.toUpperCase().replace(/\s+/g, '_') as any) || 'FULLSTACK',
    targetCompanyTier: 'FAANG',
    difficulty: state.difficulty,
    description: state.description || `Custom sequential learning path for ${state.targetRole}.`,
    estimatedWeeks: parseInt(state.estimatedDuration) * 4 || 12,
    isOfficial: false,
    isPublic: true,
    isAiGenerated: false,
    creatorId: 'user-current',
    creatorName: 'You (Custom Author)',
    creatorUsername: 'you_author',
    creatorRole: 'Roadmap Architect',
    overallReadiness: 0,
    enrolledCount: 1,
    upvotes: 0,
    tags: [state.targetRole, state.category, state.difficulty],
    nodesData: allNodes,
    createdAt: new Date().toISOString(),
    updatedAt: state.updatedAt,
  };
}

export function publishRoadmapService(state: BuilderRoadmapState): Roadmap {
  const roadmapModel = convertToRoadmapModel(state);
  try {
    const existingRaw = localStorage.getItem('ru_user_roadmaps') || '[]';
    const existing = JSON.parse(existingRaw);
    existing.unshift(roadmapModel);
    localStorage.setItem('ru_user_roadmaps', JSON.stringify(existing));
  } catch {
    // Local storage fallback
  }
  return roadmapModel;
}
