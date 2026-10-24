// ═══════════════════════════════════════════════════════════════
// RU Ready? — Learning Circles & Peer Accountability Engine
// Small cohort study groups, collaborative pacing & milestone tracking
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';

export interface CreateCircleInput {
  roadmapId: string;
  name: string;
  description?: string;
  creatorId: string;
  creatorName?: string;
  targetDate?: string;
  weeklyGoalHours?: number;
  isPrivate?: boolean;
}

export class RoadmapCircleService {
  /**
   * Create an opt-in study group for a roadmap
   */
  static async createCircle(input: CreateCircleInput) {
    const {
      roadmapId,
      name,
      description,
      creatorId,
      creatorName = 'Learner',
      targetDate,
      weeklyGoalHours = 8,
      isPrivate = false,
    } = input;

    // Generate unique 6-character alphanumeric join code
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const circle = await (prisma as any).roadmapLearningCircle.create({
      data: {
        roadmapId,
        name: name.trim(),
        description: description?.trim() || null,
        creatorId,
        creatorName,
        isPrivate,
        joinCode,
        targetDate: targetDate ? new Date(targetDate) : null,
        weeklyGoalHours,
      },
    });

    // Add creator as circle member with CREATOR role
    const member = await (prisma as any).roadmapLearningCircleMember.create({
      data: {
        circleId: circle.id,
        userId: creatorId,
        userName: creatorName,
        role: 'CREATOR',
        progressPercent: 0,
      },
    });

    return {
      ...circle,
      members: [member],
    };
  }

  /**
   * Join a learning circle via circleId or unique joinCode
   */
  static async joinCircle(params: {
    circleId?: string;
    joinCode?: string;
    userId: string;
    userName: string;
    userAvatar?: string;
  }) {
    const { circleId, joinCode, userId, userName, userAvatar } = params;

    let targetCircleId = circleId;
    if (!targetCircleId && joinCode) {
      const found = await (prisma as any).roadmapLearningCircle.findUnique({
        where: { joinCode: joinCode.trim().toUpperCase() },
      });
      if (!found) {
        throw new Error(`Learning circle with invite code '${joinCode}' not found`);
      }
      targetCircleId = found.id;
    }

    if (!targetCircleId) {
      throw new Error('Circle ID or join code is required');
    }

    // Check if user has active instance on this roadmap to populate current progress
    const circle = await (prisma as any).roadmapLearningCircle.findUnique({
      where: { id: targetCircleId },
    });
    if (!circle) {
      throw new Error('Learning circle not found');
    }

    const instance = await prisma.roadmapInstance.findUnique({
      where: { userId_roadmapId: { userId, roadmapId: circle.roadmapId } },
    });

    const member = await (prisma as any).roadmapLearningCircleMember.upsert({
      where: { circleId_userId: { circleId: targetCircleId, userId } },
      create: {
        circleId: targetCircleId,
        userId,
        userName,
        userAvatar,
        role: 'MEMBER',
        progressPercent: instance?.progressPercent || 0,
        completedModulesCount: instance?.completedModulesCount || 0,
      },
      update: {
        userName,
        userAvatar,
        progressPercent: instance?.progressPercent || 0,
        completedModulesCount: instance?.completedModulesCount || 0,
      },
    });

    return member;
  }

  /**
   * Get learning circles for a roadmap
   */
  static async getCirclesForRoadmap(roadmapId: string) {
    return (prisma as any).roadmapLearningCircle.findMany({
      where: { roadmapId, isPrivate: false },
      include: {
        members: {
          select: { id: true, userId: true, userName: true, role: true, progressPercent: true },
        },
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get circle details with cohort member progress
   */
  static async getCircleDetails(circleId: string) {
    const circle = await (prisma as any).roadmapLearningCircle.findUnique({
      where: { id: circleId },
      include: {
        members: {
          orderBy: { progressPercent: 'desc' },
        },
        roadmap: {
          select: { id: true, title: true, category: true, estimatedWeeks: true },
        },
      },
    });

    if (!circle) {
      throw new Error('Learning circle not found');
    }

    const avgProgress = circle.members.length > 0
      ? Math.round(circle.members.reduce((acc: number, m: any) => acc + m.progressPercent, 0) / circle.members.length)
      : 0;

    return {
      ...circle,
      cohortSize: circle.members.length,
      averageProgressPercent: avgProgress,
    };
  }
}
