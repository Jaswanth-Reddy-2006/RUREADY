// ═══════════════════════════════════════════════════════════════
// RU Ready? — Roadmap Service (Authoritative Community & Learning Architecture)
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';

export interface RoadmapResource {
  title: string;
  url: string;
  type: 'DOC' | 'VIDEO' | 'REPO' | 'ARTICLE' | 'EXERCISE';
  isFree?: boolean;
}

export interface RoadmapPracticalTask {
  id: string;
  title: string;
  description: string;
  deliverable?: string;
  starterCodeUrl?: string;
}

export interface CompetencyRubricItem {
  id: string;
  name: string;
  description: string;
  weight: number; // e.g. 1 - 5
}

export interface AssessmentRubric {
  passingScore: number; // e.g. 75
  competencies: CompetencyRubricItem[];
  practicalScenario?: string;
}

export interface RoadmapNodeMetadata {
  estimatedHours?: number;
  learningObjectives?: string[];
  resources?: RoadmapResource[];
  practicalTasks?: RoadmapPracticalTask[];
  prerequisiteNodeIds?: string[];
  assessmentRubric?: AssessmentRubric;
  interview?: { topic: string; description?: string };
}

export interface CreateRoadmapInput {
  ownerId: string;
  creatorName?: string;
  creatorRole?: string;
  creatorCompany?: string;
  isVerifiedCreator?: boolean;
  isEndorsed?: boolean;
  title: string;
  description?: string;
  goal?: string;
  category?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedWeeks?: number;
  tags?: string[];
  license?: string;
  graphLayout?: any;
  nodes?: Array<{
    title: string;
    description?: string;
    type?: string;
    position?: number;
    parentId?: string;
    metadata?: RoadmapNodeMetadata;
    children?: any[];
  }>;
}

export class RoadmapService {
  /**
   * List community roadmaps with rich filtering, search, and sorting
   */
  static async exploreCommunityRoadmaps(params: {
    category?: string;
    difficulty?: string;
    search?: string;
    tag?: string;
    filter?: 'ALL' | 'VERIFIED' | 'ENDORSED' | 'TRENDING' | 'BEGINNER';
    sortBy?: 'POPULAR' | 'RATING' | 'NEWEST';
    limit?: number;
  }) {
    const { category, difficulty, search, tag, filter, sortBy = 'POPULAR', limit = 50 } = params;
    const where: any = { isPublished: true };

    if (category && category !== 'all') {
      where.category = category;
    }
    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty.toUpperCase();
    }
    if (filter === 'VERIFIED') {
      where.isVerifiedCreator = true;
    } else if (filter === 'ENDORSED') {
      where.isEndorsed = true;
    } else if (filter === 'BEGINNER') {
      where.difficulty = 'BEGINNER';
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { goal: { contains: q, mode: 'insensitive' } },
        { creatorName: { contains: q, mode: 'insensitive' } },
        { creatorCompany: { contains: q, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { followerCount: 'desc' };
    if (sortBy === 'RATING') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'NEWEST') {
      orderBy = { publishedAt: 'desc' };
    }

    const roadmaps = await prisma.roadmap.findMany({
      where,
      include: {
        nodes: { orderBy: { position: 'asc' } },
        _count: {
          select: {
            instances: true,
            follows: true,
            reviews: true,
            discussions: true,
          },
        },
      },
      orderBy,
      take: limit,
    });

    return roadmaps.map((r) => ({
      ...r,
      learnerCount: r._count.instances,
      followerCount: r.followerCount || r._count.follows,
      reviewCount: r.reviewCount || r._count.reviews,
      discussionCount: r._count.discussions,
    }));
  }

  /**
   * Get single roadmap by ID (with public or ownership authorization)
   */
  static async getRoadmapById(roadmapId: string, userId?: string) {
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: {
        nodes: { orderBy: { position: 'asc' } },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        discussions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            instances: true,
            follows: true,
            reviews: true,
            discussions: true,
          },
        },
      },
    });

    if (!roadmap) return null;

    let isFollowing = false;
    let isLearning = false;
    let userInstance: any = null;

    if (userId && userId !== 'anonymous') {
      const [follow, instance] = await Promise.all([
        prisma.roadmapFollow.findUnique({
          where: { userId_roadmapId: { userId, roadmapId } },
        }),
        prisma.roadmapInstance.findUnique({
          where: { userId_roadmapId: { userId, roadmapId } },
        }),
      ]);
      isFollowing = Boolean(follow);
      isLearning = Boolean(instance);
      userInstance = instance;
    }

    return {
      ...roadmap,
      isFollowing,
      isLearning,
      userInstance,
      learnerCount: roadmap._count.instances,
    };
  }

  /**
   * Create a new roadmap (Manual or AI-generated canonical structure)
   */
  static async createRoadmap(input: CreateRoadmapInput) {
    const roadmap = await prisma.roadmap.create({
      data: {
        ownerId: input.ownerId,
        creatorName: input.creatorName || 'Anonymous Creator',
        creatorRole: input.creatorRole,
        creatorCompany: input.creatorCompany,
        isVerifiedCreator: Boolean(input.isVerifiedCreator),
        isEndorsed: Boolean(input.isEndorsed),
        title: input.title,
        description: input.description,
        goal: input.goal,
        category: input.category || 'General Software Engineering',
        difficulty: input.difficulty || 'INTERMEDIATE',
        estimatedWeeks: input.estimatedWeeks || 8,
        tags: input.tags || [],
        license: input.license || 'CC-BY-4.0',
        graphLayout: input.graphLayout || { nodes: [], edges: [] },
        status: 'DRAFT',
        isPublished: false,
      },
    });

    if (input.nodes && input.nodes.length > 0) {
      for (const [index, node] of input.nodes.entries()) {
        const createdNode = await prisma.roadmapNode.create({
          data: {
            roadmapId: roadmap.id,
            title: node.title,
            description: node.description,
            type: node.type || 'MODULE',
            position: node.position ?? index,
            metadata: (node.metadata as any) || {},
          },
        });

        if (node.children && node.children.length > 0) {
          for (const [cIndex, child] of node.children.entries()) {
            await prisma.roadmapNode.create({
              data: {
                roadmapId: roadmap.id,
                parentId: createdNode.id,
                title: child.title,
                description: child.description,
                type: child.type || 'TASK',
                position: cIndex,
                metadata: (child.metadata as any) || {},
              },
            });
          }
        }
      }
    }

    return prisma.roadmap.findUnique({
      where: { id: roadmap.id },
      include: { nodes: { orderBy: { position: 'asc' } } },
    });
  }

  /**
   * Follow or Unfollow a roadmap
   */
  static async toggleFollow(roadmapId: string, userId: string): Promise<{ following: boolean; followerCount: number }> {
    const existing = await prisma.roadmapFollow.findUnique({
      where: { userId_roadmapId: { userId, roadmapId } },
    });

    if (existing) {
      await prisma.roadmapFollow.delete({
        where: { id: existing.id },
      });
      const updated = await prisma.roadmap.update({
        where: { id: roadmapId },
        data: { followerCount: { decrement: 1 } },
      });
      return { following: false, followerCount: Math.max(0, updated.followerCount) };
    } else {
      await prisma.roadmapFollow.create({
        data: { userId, roadmapId },
      });
      const updated = await prisma.roadmap.update({
        where: { id: roadmapId },
        data: { followerCount: { increment: 1 } },
      });
      return { following: true, followerCount: updated.followerCount };
    }
  }

  /**
   * Add to My Roadmaps (Create a personal learning instance)
   * Keeps author's published roadmap immutable while granting the learner their personal workspace
   */
  static async createLearningInstance(roadmapId: string, userId: string, targetPaceHoursPerWeek = 6) {
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: { nodes: true },
    });

    if (!roadmap) {
      throw new Error('Roadmap not found');
    }

    const totalModules = roadmap.nodes.filter((n) => !n.parentId).length || roadmap.nodes.length;
    const firstModule = roadmap.nodes.find((n) => !n.parentId) || roadmap.nodes[0];

    const instance = await prisma.roadmapInstance.upsert({
      where: { userId_roadmapId: { userId, roadmapId } },
      create: {
        userId,
        roadmapId,
        roadmapVersion: roadmap.currentVersion,
        status: 'ACTIVE',
        targetPaceHoursPerWeek,
        currentModuleId: firstModule ? firstModule.id : null,
        totalModulesCount: totalModules,
        progressPercent: 0,
      },
      update: {
        status: 'ACTIVE',
        targetPaceHoursPerWeek,
      },
    });

    const totalWeeks = roadmap.estimatedWeeks || Math.max(4, Math.ceil((totalModules * 10) / targetPaceHoursPerWeek));
    const targetCompletionDate = new Date(Date.now() + totalWeeks * 7 * 24 * 60 * 60 * 1000).toISOString();

    return {
      ...instance,
      completionPercent: instance.progressPercent,
      masteryCount: instance.completedModulesCount,
      targetCompletionDate,
    };
  }

  /**
   * Get user's learning workspace ("My Roadmaps")
   */
  static async getUserWorkspace(userId: string) {
    const [instances, followingRoadmaps, myCreations, assessmentHistory, totalMastered] = await Promise.all([
      // 1. Learning Now (Active learning instances)
      prisma.roadmapInstance.findMany({
        where: { userId },
        include: {
          roadmap: {
            include: {
              nodes: { orderBy: { position: 'asc' } },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),

      // 2. Following (Roadmaps bookmarked for updates)
      prisma.roadmapFollow.findMany({
        where: { userId },
        include: {
          roadmap: {
            include: {
              nodes: { orderBy: { position: 'asc' } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),

      // 3. My Creations & Forks
      prisma.roadmap.findMany({
        where: { ownerId: userId },
        include: {
          nodes: { orderBy: { position: 'asc' } },
        },
        orderBy: { updatedAt: 'desc' },
      }),

      // 4. Assessment History
      prisma.roadmapAssessmentAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),

      // 5. Total Mastered
      prisma.roadmapProgress.count({
        where: { userId, masteryStatus: { in: ['MASTERED', 'ASSESSMENT_PASSED'] } },
      }),
    ]);

    return {
      instances: instances.map((inst) => ({
        ...inst,
        completionPercent: inst.progressPercent,
        masteryCount: inst.completedModulesCount,
      })),
      learningNow: instances.map((inst) => ({
        instanceId: inst.id,
        roadmapId: inst.roadmapId,
        title: inst.roadmap.title,
        category: inst.roadmap.category,
        difficulty: inst.roadmap.difficulty,
        creatorName: inst.roadmap.creatorName,
        isVerifiedCreator: inst.roadmap.isVerifiedCreator,
        isEndorsed: inst.roadmap.isEndorsed,
        currentVersion: inst.roadmap.currentVersion,
        sourceVersion: inst.roadmapVersion,
        hasUpdate: inst.roadmap.currentVersion > inst.roadmapVersion,
        progressPercent: inst.progressPercent,
        completionPercent: inst.progressPercent,
        completedModules: inst.completedModulesCount,
        masteryCount: inst.completedModulesCount,
        totalModules: inst.totalModulesCount,
        targetPaceHoursPerWeek: inst.targetPaceHoursPerWeek,
        status: inst.status,
        nodes: inst.roadmap.nodes,
      })),
      following: followingRoadmaps.map((f) => f.roadmap),
      created: myCreations.filter((c) => !c.forkedFromId),
      forks: myCreations.filter((c) => c.forkedFromId),
      myCreations,
      assessmentHistory,
      summary: {
        activeLearningCount: instances.length,
        followingCount: followingRoadmaps.length,
        createdCount: myCreations.length,
        totalMasteredModules: totalMastered,
        avgCompletionRate:
          instances.length > 0
            ? Math.round(
                instances.reduce((acc, i) => acc + i.progressPercent, 0) / instances.length
              )
            : 0,
      },
    };
  }

  /**
   * Fork a roadmap with clear attribution and independent derivative ownership
   */
  static async forkRoadmap(roadmapId: string, userId: string, customTitle?: string) {
    const source = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: { nodes: { orderBy: { position: 'asc' } } },
    });

    if (!source) {
      throw new Error('Source roadmap not found');
    }

    const forked = await prisma.roadmap.create({
      data: {
        ownerId: userId,
        title: customTitle || `${source.title} (My Fork)`,
        description: source.description,
        goal: source.goal,
        category: source.category,
        difficulty: source.difficulty,
        estimatedWeeks: source.estimatedWeeks,
        tags: source.tags as any,
        license: source.license,
        status: 'DRAFT',
        isPublished: false,
        forkedFromId: source.id,
        forkedFromVersion: source.currentVersion,
        graphLayout: source.graphLayout as any,
      },
    });

    // Copy nodes preserving parent/child and prerequisite linkages
    const idMap = new Map<string, string>();
    for (const sourceNode of source.nodes) {
      const created = await prisma.roadmapNode.create({
        data: {
          roadmapId: forked.id,
          title: sourceNode.title,
          description: sourceNode.description,
          type: sourceNode.type,
          position: sourceNode.position,
          metadata: sourceNode.metadata as any,
          parentId: sourceNode.parentId ? idMap.get(sourceNode.parentId) : undefined,
        },
      });
      idMap.set(sourceNode.id, created.id);
    }

    // Increment forkCount on source
    await prisma.roadmap.update({
      where: { id: source.id },
      data: { forkCount: { increment: 1 } },
    });

    return prisma.roadmap.findUnique({
      where: { id: forked.id },
      include: { nodes: { orderBy: { position: 'asc' } } },
    });
  }

  /**
   * Publish a roadmap version (Making published snapshots immutable)
   */
  static async publishRoadmap(roadmapId: string, ownerId: string, license = 'CC-BY-4.0') {
    const roadmap = await prisma.roadmap.findFirst({
      where: { id: roadmapId, ownerId },
    });

    if (!roadmap) {
      throw new Error('Roadmap not found or unauthorized');
    }

    const nextVersion = roadmap.isPublished ? roadmap.currentVersion + 1 : 1;

    return prisma.roadmap.update({
      where: { id: roadmapId },
      data: {
        isPublished: true,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        currentVersion: nextVersion,
        license,
      },
      include: { nodes: true },
    });
  }

  /**
   * Add a review with rating and written feedback
   */
  static async addReview(roadmapId: string, input: {
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    reviewText: string;
  }) {
    const ratingClamped = Math.max(1, Math.min(5, input.rating));

    // Check if user has engaged with roadmap (active learning instance)
    const instance = await prisma.roadmapInstance.findUnique({
      where: { userId_roadmapId: { userId: input.userId, roadmapId } },
    });

    const review = await prisma.roadmapReview.upsert({
      where: { roadmapId_userId: { roadmapId, userId: input.userId } },
      create: {
        roadmapId,
        userId: input.userId,
        userName: input.userName,
        userAvatar: input.userAvatar,
        rating: ratingClamped,
        reviewText: input.reviewText,
        isVerifiedLearner: Boolean(instance),
      },
      update: {
        rating: ratingClamped,
        reviewText: input.reviewText,
        isVerifiedLearner: Boolean(instance),
      },
    });

    // Recompute average rating
    const allReviews = await prisma.roadmapReview.findMany({
      where: { roadmapId },
      select: { rating: true },
    });

    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);
    await prisma.roadmap.update({
      where: { id: roadmapId },
      data: {
        rating: parseFloat(avg.toFixed(1)),
        reviewCount: allReviews.length,
      },
    });

    return review;
  }

  /**
   * Safe Draft Autosave with Optimistic Concurrency Control & Cycle Detection
   */
  static async saveDraft(
    roadmapIdOrParams: string | {
      roadmapId: string;
      userId: string;
      baseVersion?: number;
      title?: string;
      description?: string;
      goal?: string;
      category?: string;
      difficulty?: string;
      estimatedWeeks?: number;
      tags?: string[];
      graphLayout?: any;
      nodes?: any[];
      changelog?: string;
      createSnapshot?: boolean;
    },
    maybeUserId?: string,
    maybeData?: any
  ) {
    let roadmapId: string;
    let userId: string;
    let baseVersion: number | undefined;
    let title: string | undefined;
    let description: string | undefined;
    let goal: string | undefined;
    let category: string | undefined;
    let difficulty: string | undefined;
    let estimatedWeeks: number | undefined;
    let tags: any;
    let graphLayout: any;
    let nodes: any[] | undefined;
    let changelog: string | undefined;
    let createSnapshot = false;

    if (typeof roadmapIdOrParams === 'string') {
      roadmapId = roadmapIdOrParams;
      userId = maybeUserId || '';
      const data = maybeData || {};
      baseVersion = data.baseVersion;
      title = data.title;
      description = data.description;
      goal = data.goal;
      category = data.category;
      difficulty = data.difficulty;
      estimatedWeeks = data.estimatedWeeks;
      tags = data.tags;
      graphLayout = data.graphLayout;
      nodes = data.nodes;
      changelog = data.changelog;
      createSnapshot = data.createSnapshot ?? false;
    } else {
      roadmapId = roadmapIdOrParams.roadmapId;
      userId = roadmapIdOrParams.userId;
      baseVersion = roadmapIdOrParams.baseVersion;
      title = roadmapIdOrParams.title;
      description = roadmapIdOrParams.description;
      goal = roadmapIdOrParams.goal;
      category = roadmapIdOrParams.category;
      difficulty = roadmapIdOrParams.difficulty;
      estimatedWeeks = roadmapIdOrParams.estimatedWeeks;
      tags = roadmapIdOrParams.tags;
      graphLayout = roadmapIdOrParams.graphLayout;
      nodes = roadmapIdOrParams.nodes;
      changelog = roadmapIdOrParams.changelog;
      createSnapshot = roadmapIdOrParams.createSnapshot ?? false;
    }

    const existing = await prisma.roadmap.findFirst({
      where: {
        id: roadmapId,
        OR: [
          { ownerId: userId },
          { collaborators: { some: { userId, status: 'ACCEPTED', role: 'EDITOR' } } },
        ],
      },
      include: { nodes: true },
    });

    if (!existing) {
      throw new Error('Roadmap not found or unauthorized');
    }

    // Optimistic Concurrency Control Check
    if (baseVersion !== undefined && existing.currentVersion > baseVersion) {
      const conflictMsg = `REVISION_CONFLICT: The server has revision ${existing.currentVersion}, while your client base revision was ${baseVersion}.`;
      const err: any = new Error(conflictMsg);
      err.code = 'REVISION_CONFLICT';
      err.statusCode = 409;
      err.serverVersion = existing.currentVersion;
      err.serverRoadmap = existing;
      throw err;
    }

    // Cycle Detection on Nodes
    if (nodes && nodes.length > 0) {
      const adj = new Map<string, string[]>();
      for (const n of nodes) {
        const id = n.id || n.title;
        const prereqs = n.metadata?.prerequisiteNodeIds || [];
        adj.set(id, prereqs);
      }

      const visited = new Set<string>();
      const rec = new Set<string>();
      const hasCycle = (curr: string): boolean => {
        visited.add(curr);
        rec.add(curr);
        for (const next of adj.get(curr) || []) {
          if (!visited.has(next)) {
            if (hasCycle(next)) return true;
          } else if (rec.has(next)) {
            return true;
          }
        }
        rec.delete(curr);
        return false;
      };

      for (const k of adj.keys()) {
        if (!visited.has(k)) {
          if (hasCycle(k)) {
            const cycleErr: any = new Error(`INVALID_GRAPH_CYCLE: Circular prerequisite dependency detected involving module "${k}". A module cannot require itself as a prerequisite.`);
            cycleErr.code = 'INVALID_GRAPH_CYCLE';
            cycleErr.statusCode = 400;
            throw cycleErr;
          }
        }
      }
    }

    const nextVersion = existing.currentVersion + 1;

    // Update roadmap header
    await prisma.roadmap.update({
      where: { id: roadmapId },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        goal: goal !== undefined ? goal : existing.goal,
        category: category !== undefined ? category : existing.category,
        difficulty: difficulty !== undefined ? difficulty : existing.difficulty,
        estimatedWeeks: estimatedWeeks !== undefined ? estimatedWeeks : existing.estimatedWeeks,
        tags: (tags !== undefined ? tags : (existing.tags ?? undefined)) as any,
        graphLayout: (graphLayout !== undefined ? graphLayout : (existing.graphLayout ?? undefined)) as any,
        currentVersion: nextVersion,
        status: existing.isPublished ? 'PUBLISHED' : 'DRAFT',
      },
    });

    // Update nodes
    if (nodes) {
      const existingIds = new Set(existing.nodes.map((n) => n.id));
      const incomingIds = new Set(nodes.filter((n) => n.id).map((n) => n.id));

      // Remove nodes deleted by user
      const toDelete = Array.from(existingIds).filter((id) => !incomingIds.has(id));
      if (toDelete.length > 0) {
        await prisma.roadmapNode.deleteMany({
          where: { id: { in: toDelete }, roadmapId },
        });
      }

      // Upsert nodes
      for (const [idx, node] of nodes.entries()) {
        if (node.id && existingIds.has(node.id)) {
          await prisma.roadmapNode.update({
            where: { id: node.id },
            data: {
              title: node.title,
              description: node.description,
              type: node.type || 'MODULE',
              position: idx,
              metadata: node.metadata || {},
            },
          });
        } else {
          await prisma.roadmapNode.create({
            data: {
              id: node.id || undefined,
              roadmapId,
              title: node.title,
              description: node.description,
              type: node.type || 'MODULE',
              position: idx,
              metadata: node.metadata || {},
            },
          });
        }
      }
    }

    const refreshed = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: { nodes: { orderBy: { position: 'asc' } } },
    });

    // Create snapshot if requested or on major edits
    if (createSnapshot) {
      await prisma.roadmapVersion.create({
        data: {
          roadmapId,
          version: nextVersion,
          title: refreshed?.title || existing.title,
          description: refreshed?.description,
          changelog: changelog || `Revision ${nextVersion} saved`,
          nodesSnapshot: (refreshed?.nodes as any) || [],
          graphLayout: (refreshed?.graphLayout as any) || {},
          createdBy: userId,
        },
      });
    }

    return {
      conflict: false,
      version: nextVersion,
      roadmap: refreshed,
    };
  }

  /**
   * Read Version History Snapshots
   */
  static async getVersionHistory(roadmapId: string) {
    return prisma.roadmapVersion.findMany({
      where: { roadmapId },
      orderBy: { version: 'desc' },
      select: {
        id: true,
        roadmapId: true,
        version: true,
        title: true,
        description: true,
        changelog: true,
        nodesSnapshot: true,
        graphLayout: true,
        createdAt: true,
        createdBy: true,
      },
    });
  }

  /**
   * Restore an Earlier Roadmap Revision
   */
  static async restoreVersion(roadmapId: string, versionNumber: number, userId: string) {
    const existing = await prisma.roadmap.findFirst({
      where: { id: roadmapId, ownerId: userId },
    });

    if (!existing) {
      throw new Error('Roadmap not found or unauthorized');
    }

    const snapshot = await prisma.roadmapVersion.findUnique({
      where: { roadmapId_version: { roadmapId, version: versionNumber } },
    });

    if (!snapshot) {
      throw new Error(`Version snapshot ${versionNumber} not found`);
    }

    const nodesToRestore = (snapshot.nodesSnapshot as any[]) || [];
    const nextVersion = existing.currentVersion + 1;

    // Delete current nodes
    await prisma.roadmapNode.deleteMany({
      where: { roadmapId },
    });

    // Reinsert snapshot nodes
    for (const [idx, node] of nodesToRestore.entries()) {
      await prisma.roadmapNode.create({
        data: {
          roadmapId,
          title: node.title,
          description: node.description,
          type: node.type || 'MODULE',
          position: idx,
          metadata: node.metadata || {},
        },
      });
    }

    // Update roadmap header & version
    const updated = await prisma.roadmap.update({
      where: { id: roadmapId },
      data: {
        title: snapshot.title,
        description: snapshot.description,
        graphLayout: snapshot.graphLayout as any,
        currentVersion: nextVersion,
      },
      include: { nodes: { orderBy: { position: 'asc' } } },
    });

    // Record new snapshot for this restoration
    await prisma.roadmapVersion.create({
      data: {
        roadmapId,
        version: nextVersion,
        title: snapshot.title,
        description: snapshot.description,
        changelog: `Restored from version ${versionNumber}`,
        nodesSnapshot: (updated.nodes as any) || [],
        graphLayout: (updated.graphLayout as any) || {},
        createdBy: userId,
      },
    });

    return updated;
  }

  /**
   * Determine the precise, actionable "Next Action" for a learner on a roadmap
   */
  static async calculateNextAction(roadmapId: string, userId: string) {
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: { nodes: { orderBy: { position: 'asc' } } },
    });

    if (!roadmap) {
      throw new Error('Roadmap not found');
    }

    const progressRecords = await prisma.roadmapProgress.findMany({
      where: { roadmapId, userId },
    });
    const progMap = new Map(progressRecords.map((p) => [p.nodeId, p]));

    // Find first node that isn't fully mastered
    let targetNode = roadmap.nodes[0];
    let actionType: 'START_FOUNDATIONS' | 'BUILD_MISSION' | 'SUBMIT_DELIVERABLE' | 'VERIFY_MASTERY' | 'ALL_COMPLETED' = 'START_FOUNDATIONS';

    for (const node of roadmap.nodes) {
      const prog = progMap.get(node.id);
      const isMastered = prog?.masteryStatus === 'MASTERED' || prog?.masteryStatus === 'ASSESSMENT_PASSED';
      const isComplete = (prog?.percent ?? 0) === 100;

      if (!isMastered) {
        targetNode = node;
        if (isComplete) {
          actionType = 'VERIFY_MASTERY';
        } else if (prog && prog.percent > 0) {
          actionType = 'SUBMIT_DELIVERABLE';
        } else {
          actionType = 'BUILD_MISSION';
        }
        break;
      }
    }

    // Check if all nodes are mastered
    const allMastered = roadmap.nodes.every((n) => {
      const p = progMap.get(n.id);
      return p?.masteryStatus === 'MASTERED' || p?.masteryStatus === 'ASSESSMENT_PASSED';
    });

    if (allMastered && roadmap.nodes.length > 0) {
      actionType = 'ALL_COMPLETED';
    }

    const meta = (targetNode?.metadata as any) || {};
    const whatToBuild = meta.whatToBuild || `Build and verify practical implementation for ${targetNode?.title}`;
    const whyItMatters = meta.whyLearnThis || 'Mastering this competency ensures resilience, scalability, and predictable system behavior.';
    const howToProveIt = meta.howToVerify || 'Submit your project repository or test suite and pass an adaptive AI technical defense.';

    return {
      roadmapId,
      actionType,
      nodeId: targetNode?.id,
      nodeIndex: roadmap.nodes.findIndex((n) => n.id === targetNode?.id),
      nodeTitle: targetNode?.title,
      nodeType: targetNode?.type || 'MODULE',
      estimatedHours: meta.estimatedHours || 8,
      whatToDoNow: whatToBuild,
      whyItMatters,
      howToProveIt,
      allMastered,
    };
  }
}
