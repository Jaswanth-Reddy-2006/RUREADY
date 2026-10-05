// ═══════════════════════════════════════════════════════════════
// Sprint Telemetry Service — Stage 5.5
// Unified Skill Performance, Metric Aggregation & Telemetry Engine
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import {
  UnifiedSprintTelemetryDTO,
  SkillPerformanceMetricDTO,
} from '@ru-ready/shared';
import { NotFoundError, ForbiddenError } from '../lib/errors.js';

export const sprintTelemetryService = {
  /**
   * Computes a deterministic, server-authoritative unified sprint performance telemetry
   * aggregating tasks, MCQ assessment attempts, practical coding drill evidence, and skill mastery.
   */
  async calculateSprintTelemetry(
    userId: string,
    sprintOrId: string | any
  ): Promise<UnifiedSprintTelemetryDTO> {
    let sprint = typeof sprintOrId === 'object' && sprintOrId !== null ? sprintOrId : null;

    if (!sprint) {
      sprint = await prisma.roadmapSprint.findUnique({
        where: { id: sprintOrId as string },
        include: {
          userRoadmap: {
            include: {
              skillEvidence: {
                include: { skill: true },
              },
            },
          },
          tasks: {
            orderBy: { orderIndex: 'asc' },
            include: {
              roadmapNode: {
                include: {
                  skills: {
                    include: { skill: true },
                  },
                },
              },
            },
          },
        },
      });
    }

    if (!sprint) {
      throw new NotFoundError('Sprint not found');
    }

    const sprintUserId = sprint.userRoadmap?.userId || sprint.userId;
    if (sprintUserId && sprintUserId !== userId) {
      throw new ForbiddenError('You are not authorized to access telemetry for this sprint');
    }

    const tasks: any[] = sprint.tasks || [];
    const taskIds: string[] = tasks.map((t: any) => t.id);

    // 1. Fetch MicroAssessmentAttempts for this sprint / tasks
    const assessmentAttempts = await prisma.microAssessmentAttempt.findMany({
      where: {
        userId,
        OR: [
          { sprintId: sprint.id },
          { sprintTaskId: { in: taskIds } },
        ],
      },
      include: {
        skill: true,
      },
    });

    // 2. Fetch SkillEvidence for the userRoadmap
    const allEvidence: any[] = sprint.userRoadmap?.skillEvidence || [];

    // Map unique skills linked to sprint tasks
    const relevantSkills = new Map<string, { id: string; name: string; category?: string }>();
    for (const task of tasks) {
      if (task.roadmapNode?.skills) {
        for (const ns of task.roadmapNode.skills) {
          if (ns.skill) {
            relevantSkills.set(ns.skill.id, {
              id: ns.skill.id,
              name: ns.skill.name,
              category: ns.skill.category,
            });
          }
        }
      }
    }

    // 3. Task Completion Metrics
    const totalTasks = tasks.length;
    const skippedTasks = tasks.filter((t: any) => t.status === 'SKIPPED').length;
    const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length;
    const relevantTasksCount = totalTasks - skippedTasks;
    const taskCompletionRate = relevantTasksCount <= 0 ? 100 : Math.round((completedTasks / relevantTasksCount) * 100);

    // 4. Assessment Performance Metrics (NOT_APPLICABLE if no attempts exist)
    let assessmentScore: number | null = null;
    let assessmentPassed: boolean | null = null;
    if (assessmentAttempts.length > 0) {
      assessmentScore = Math.round(
        assessmentAttempts.reduce((sum: number, a: any) => sum + a.score, 0) / assessmentAttempts.length
      );
      assessmentPassed = assessmentScore >= 70;
    }

    const requiredAssessmentTasks = tasks.filter((t: any) => (t.requiresAssessment || t.requiredAssessment) && t.status !== 'SKIPPED');
    const requiredAssessmentsTotal = requiredAssessmentTasks.length;
    const requiredAssessmentsPassed = requiredAssessmentTasks.filter((t: any) => {
      if (t.status === 'COMPLETED') return true;
      const taskAttempts = assessmentAttempts.filter((a: any) => a.sprintTaskId === t.id);
      return taskAttempts.some((a: any) => a.passed);
    }).length;

    // 5. Practical Performance Metrics (NOT_APPLICABLE if no practical evidence exists)
    const practicalEvidences = allEvidence.filter(
      (ev: any) => ev.source === 'PROJECT' || (ev.metadata && typeof ev.metadata === 'object' && (ev.metadata as any).practicalDrill)
    );
    let practicalScore: number | null = null;
    let practicalPassed: boolean | null = null;
    if (practicalEvidences.length > 0) {
      practicalScore = Math.round(
        practicalEvidences.reduce((sum: number, ev: any) => sum + (ev.demonstratedScore ?? 100), 0) / practicalEvidences.length
      );
      practicalPassed = practicalScore >= 70;
    }

    const requiredPracticalTasks = tasks.filter((t: any) => (t.requiresEvidence || t.requiredPractical) && t.status !== 'SKIPPED');
    const requiredPracticalsTotal = requiredPracticalTasks.length;
    const requiredPracticalsPassed = requiredPracticalTasks.filter((t: any) => {
      if (t.status === 'COMPLETED') return true;
      const taskEvidence = allEvidence.filter((ev: any) => {
        const meta = ev.metadata as any;
        return meta?.sprintTaskId === t.id;
      });
      return taskEvidence.length > 0;
    }).length;

    // 6. Skill-Level Performance Aggregation
    const skillBreakdown: SkillPerformanceMetricDTO[] = [];
    const skillsDemonstratedSet = new Set<string>();

    for (const [skillId, skillInfo] of relevantSkills.entries()) {
      // MCQ score for this skill
      const skillAttempts = assessmentAttempts.filter(
        (a: any) => a.skillId === skillId || (a.skill && a.skill.name.toLowerCase() === skillInfo.name.toLowerCase())
      );
      const skillMcqScore = skillAttempts.length > 0
        ? Math.round(skillAttempts.reduce((s: number, a: any) => s + a.score, 0) / skillAttempts.length)
        : null;

      // Practical score for this skill
      const skillPracticals = practicalEvidences.filter((e: any) => e.skillId === skillId);
      const skillPracticalScore = skillPracticals.length > 0
        ? Math.round(skillPracticals.reduce((s: number, e: any) => s + (e.demonstratedScore ?? 100), 0) / skillPracticals.length)
        : null;

      // Total evidence count for this skill
      const skillTotalEvidence = allEvidence.filter((e: any) => e.skillId === skillId);
      const evidenceCount = skillTotalEvidence.length;

      const demonstrated =
        evidenceCount > 0 ||
        (skillMcqScore !== null && skillMcqScore >= 70) ||
        (skillPracticalScore !== null && skillPracticalScore >= 70);

      if (demonstrated) {
        skillsDemonstratedSet.add(skillInfo.name);
      }

      skillBreakdown.push({
        skillId,
        skillName: skillInfo.name,
        category: skillInfo.category,
        mcqScore: skillMcqScore,
        practicalScore: skillPracticalScore,
        evidenceCount,
        demonstrated,
      });
    }

    // Include other skills present in assessment attempts
    for (const att of assessmentAttempts) {
      const skill = att.skill;
      if (skill && !relevantSkills.has(skill.id)) {
        relevantSkills.set(skill.id, { id: skill.id, name: skill.name, category: skill.category });
        const demonstrated = att.passed || att.score >= 70;
        if (demonstrated) skillsDemonstratedSet.add(skill.name);
        skillBreakdown.push({
          skillId: skill.id,
          skillName: skill.name,
          category: skill.category,
          mcqScore: att.score,
          practicalScore: null,
          evidenceCount: allEvidence.filter((e: any) => e.skillId === skill.id).length,
          demonstrated,
        });
      }
    }

    return {
      sprintId: sprint.id,
      userRoadmapId: sprint.userRoadmapId,
      sprintNumber: sprint.sprintNumber,
      taskCompletionRate,
      totalTasks,
      completedTasks,
      skippedTasks,
      assessmentScore,
      assessmentPassed,
      requiredAssessmentsTotal,
      requiredAssessmentsPassed,
      practicalScore,
      practicalPassed,
      requiredPracticalsTotal,
      requiredPracticalsPassed,
      evidenceCount: allEvidence.length,
      skillsDemonstrated: Array.from(skillsDemonstratedSet),
      skillBreakdown,
      calculatedAt: new Date().toISOString(),
    };
  },
};
