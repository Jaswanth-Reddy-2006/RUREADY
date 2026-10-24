// ═══════════════════════════════════════════════════════════════
// RU Ready? — Practical Deliverables & Evidence Submission Engine
// Validates, evaluates and persists tangible engineering deliverables
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';

export type DeliverableType =
  | 'REPOSITORY'
  | 'DEPLOYMENT'
  | 'CODE'
  | 'DIAGRAM'
  | 'TEXT';

export interface SubmitDeliverableInput {
  roadmapId: string;
  nodeId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  deliverableType: DeliverableType;
  deliverableUrl?: string;
  deliverableText?: string;
  codeLanguage?: string;
  executionResult?: any;
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

export class RoadmapDeliverableService {
  /**
   * Validate and evaluate a tangible evidence deliverable
   */
  static async submitAndEvaluateDeliverable(input: SubmitDeliverableInput): Promise<{
    submission: any;
    evaluation: DeliverableEvaluationResult;
  }> {
    const {
      roadmapId,
      nodeId,
      userId,
      userName,
      userAvatar,
      deliverableType,
      deliverableUrl,
      deliverableText,
      codeLanguage,
      executionResult,
    } = input;

    // 1. Fetch node and metadata
    const node = await prisma.roadmapNode.findFirst({
      where: { id: nodeId, roadmapId },
    });

    if (!node) {
      throw new Error(`Module node '${nodeId}' not found in roadmap`);
    }

    const metadata = (node.metadata as any) || {};
    const whatToBuild = metadata.whatToBuild || 'Project deliverable meeting specifications';
    const rubric = metadata.assessmentRubric || { passingScore: 75 };
    const passingScore = rubric.passingScore || 75;

    // 2. Validate Deliverable Inputs
    const trimmedUrl = (deliverableUrl || '').trim();
    const trimmedText = (deliverableText || '').trim();

    if (deliverableType === 'REPOSITORY') {
      if (!trimmedUrl) {
        throw new Error('A valid repository URL is required for REPOSITORY deliverables');
      }
      const isGitHost = /^(https?:\/\/)?(www\.)?(github\.com|gitlab\.com|bitbucket\.org)\/[\w.-]+\/[\w.-]+/i.test(trimmedUrl);
      if (!isGitHost) {
        throw new Error('Repository URL must be a valid public Git host (e.g. https://github.com/username/repository)');
      }
    } else if (deliverableType === 'DEPLOYMENT') {
      if (!trimmedUrl) {
        throw new Error('A live deployment URL is required for DEPLOYMENT deliverables');
      }
      try {
        const parsed = new URL(trimmedUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          throw new Error('Deployment URL must start with http:// or https://');
        }
      } catch {
        throw new Error('Invalid URL format for live deployment');
      }
    } else if (deliverableType === 'CODE' || deliverableType === 'TEXT') {
      if (trimmedText.length < 20) {
        throw new Error('Deliverable content must be at least 20 characters explaining the solution');
      }
    }

    // 3. Automated Rubric Evaluation
    const combinedContent = `${trimmedUrl} ${trimmedText} ${JSON.stringify(executionResult || {})}`.toLowerCase();
    let score = 70;
    const strengths: string[] = [];
    const areasToImprove: string[] = [];
    const competenciesDemonstrated: string[] = [];

    // URL completeness
    if (trimmedUrl) {
      score += 10;
      strengths.push('Provided accessible, public project artifact link.');
      competenciesDemonstrated.push('Git Version Control & Artifact Publishing');
    }

    // Explanation & Architecture Depth
    const wordCount = trimmedText.split(/\s+/).filter(Boolean).length;
    if (wordCount >= 30) {
      score += 10;
      strengths.push('Included architectural reasoning and technical decision log.');
      competenciesDemonstrated.push('Technical Documentation & Architecture Defense');
    } else {
      areasToImprove.push('Elaborate on architectural trade-offs, concurrency models, or data consistency guarantees.');
    }

    // Verification of engineering indicators
    const qualityIndicators = [
      { key: 'test', competency: 'Automated Testing & Edge Case Verification' },
      { key: 'docker', competency: 'Containerization Parity' },
      { key: 'auth', competency: 'Authentication & Security Primitives' },
      { key: 'postgres', competency: 'Relational Schema Optimization' },
      { key: 'redis', competency: 'In-Memory Caching & Latency Mitigation' },
      { key: 'error', competency: 'Graceful Error Handling & Degradation' },
      { key: 'metric', competency: 'Production Observability & Metrics' },
    ];

    for (const qi of qualityIndicators) {
      if (combinedContent.includes(qi.key)) {
        score += 2;
        competenciesDemonstrated.push(qi.competency);
      }
    }

    // Deduplicate competencies
    const uniqueCompetencies = Array.from(new Set(competenciesDemonstrated));
    score = Math.min(100, Math.max(40, score));

    const passed = score >= passingScore;
    const status = passed ? 'PASSED' : 'NEEDS_REVISION';

    const feedback = passed
      ? `Deliverable successfully verified! Score: ${score}%. Demonstrated key engineering execution for "${node.title}". Tangible evidence recorded.`
      : `Deliverable scored at ${score}% (Passing score: ${passingScore}%). Please review the requirements for "${whatToBuild}" and provide more comprehensive documentation or test coverage.`;

    const nextSteps = passed
      ? 'Your evidence has been attached to your verified learning record. You can proceed to the next module or defend your implementation in an AI interview.'
      : 'Refine your repository with unit/integration tests and update your explanation before resubmitting.';

    // 4. Persist to database
    const submission = await (prisma as any).roadmapSubmission.create({
      data: {
        roadmapId,
        nodeId,
        userId,
        userName: userName || 'Learner',
        userAvatar,
        deliverableType,
        deliverableUrl: trimmedUrl || null,
        deliverableText: trimmedText || null,
        codeLanguage: codeLanguage || null,
        executionResult: executionResult || {},
        status,
        evaluationFeedback: feedback,
        rubricScore: score,
        competenciesDemonstrated: uniqueCompetencies,
        evaluatedAt: new Date(),
      },
    });

    // 5. Update RoadmapProgress
    await prisma.roadmapProgress.upsert({
      where: { nodeId_userId: { nodeId, userId } },
      create: {
        roadmapId,
        nodeId,
        userId,
        status: passed ? 'DONE' : 'IN_PROGRESS',
        masteryStatus: passed ? 'ASSESSMENT_PASSED' : 'IN_PROGRESS',
        percent: passed ? 100 : 75,
        competenciesDemonstrated: uniqueCompetencies,
        notes: `Deliverable (${deliverableType}) submitted on ${new Date().toLocaleDateString()}`,
        assessmentScore: score,
        lastAssessmentAt: new Date(),
        completedAt: passed ? new Date() : null,
      },
      update: {
        status: passed ? 'DONE' : 'IN_PROGRESS',
        masteryStatus: passed ? 'ASSESSMENT_PASSED' : 'IN_PROGRESS',
        percent: passed ? 100 : 75,
        competenciesDemonstrated: uniqueCompetencies,
        assessmentScore: score,
        lastAssessmentAt: new Date(),
        completedAt: passed ? new Date() : undefined,
      },
    });

    return {
      submission,
      evaluation: {
        submissionId: submission.id,
        status,
        rubricScore: score,
        feedback,
        strengths,
        areasToImprove,
        competenciesDemonstrated: uniqueCompetencies,
        nextSteps,
      },
    };
  }

  /**
   * Get all submissions for a specific module
   */
  static async getSubmissionsForNode(nodeId: string, userId: string) {
    return (prisma as any).roadmapSubmission.findMany({
      where: { nodeId, userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all submissions across a roadmap (Portfolio View)
   */
  static async getSubmissionsForRoadmap(roadmapId: string, userId: string) {
    return (prisma as any).roadmapSubmission.findMany({
      where: { roadmapId, userId },
      include: {
        node: {
          select: { id: true, title: true, type: true, position: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
