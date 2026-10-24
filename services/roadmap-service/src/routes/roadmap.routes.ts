import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { RoadmapService } from '../services/roadmap.service.js';
import { RoadmapAICopilot } from '../services/roadmap-ai-copilot.js';
import { RoadmapAssessmentService } from '../services/roadmap-assessment.service.js';
import { RoadmapDeliverableService } from '../services/roadmap-deliverable.service.js';
import { RoadmapAdaptiveService } from '../services/roadmap-adaptive.service.js';
import { RoadmapCompanionService } from '../services/roadmap-companion.service.js';
import { RoadmapCircleService } from '../services/roadmap-circle.service.js';

const router: Router = Router();

const userId = (req: Request) => String(req.headers['x-user-id'] || req.body?.userId || req.query?.userId || 'anonymous');
const userName = (req: Request) => String(req.headers['x-user-name'] || req.body?.userName || 'Candidate');

const handle = (fn: (req: Request, res: Response) => Promise<unknown>) => (req: Request, res: Response, next: NextFunction) => fn(req, res).catch(next);

const owned = async (roadmapId: string, req: Request) =>
  prisma.roadmap.findFirst({
    where: {
      id: roadmapId,
      OR: [
        { ownerId: userId(req) },
        { collaborators: { some: { userId: userId(req), status: 'ACCEPTED' } } },
      ],
    },
  });

const nodeInputBase = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).optional(),
  type: z.string().optional(),
  position: z.number().int().min(0).optional(),
  order: z.number().int().min(0).optional(),
  parentId: z.string().optional(),
  metadata: z.any().optional(),
  interview: z.object({ topic: z.string().min(1).max(200), description: z.string().max(2000).optional() }).optional(),
  children: z.array(z.unknown()).optional(),
});

// ─────────────────────────────────────────────────────────────
// 1. Community Discovery & Public Profiles
// ─────────────────────────────────────────────────────────────

router.get('/explore', handle(async (req, res) => {
  const { category, difficulty, search, tag, filter, sortBy, limit } = req.query as any;
  const roadmaps = await RoadmapService.exploreCommunityRoadmaps({
    category: category ? String(category) : undefined,
    difficulty: difficulty ? String(difficulty) : undefined,
    search: search ? String(search) : undefined,
    tag: tag ? String(tag) : undefined,
    filter: filter ? (String(filter) as any) : undefined,
    sortBy: sortBy ? (String(sortBy) as any) : undefined,
    limit: limit ? Number(limit) : 50,
  });
  res.json({ data: roadmaps });
}));

// ─────────────────────────────────────────────────────────────
// 2. Personal Learning Plans & Workspace ("My Roadmaps")
// ─────────────────────────────────────────────────────────────

router.get('/workspace', handle(async (req, res) => {
  const currentUserId = userId(req);
  const workspace = await RoadmapService.getUserWorkspace(currentUserId);
  res.json({ data: workspace });
}));

router.get('/my-instances', handle(async (req, res) => {
  const currentUserId = userId(req);
  const instances = await prisma.roadmapInstance.findMany({
    where: { userId: currentUserId },
    include: {
      roadmap: {
        include: { nodes: { orderBy: { position: 'asc' } } },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
  res.json({ data: instances });
}));

// Add to My Roadmaps (creates personal learning instance)
router.post('/:roadmapId/instances', handle(async (req, res) => {
  const currentUserId = userId(req);
  const pace = req.body.targetPaceHoursPerWeek ? Number(req.body.targetPaceHoursPerWeek) : 6;
  const instance = await RoadmapService.createLearningInstance(String(req.params.roadmapId), currentUserId, pace);
  res.status(201).json({ data: instance });
}));

// Follow / Unfollow Toggle
router.post('/:roadmapId/follow', handle(async (req, res) => {
  const currentUserId = userId(req);
  const result = await RoadmapService.toggleFollow(String(req.params.roadmapId), currentUserId);
  res.json({ data: result });
}));

// Fork a roadmap with attribution
router.post('/:roadmapId/fork', handle(async (req, res) => {
  const currentUserId = userId(req);
  const customTitle = req.body.title ? String(req.body.title).trim() : undefined;
  const forked = await RoadmapService.forkRoadmap(String(req.params.roadmapId), currentUserId, customTitle);
  res.status(201).json({ data: forked });
}));

// Reviews & Ratings
router.get('/:roadmapId/reviews', handle(async (req, res) => {
  const reviews = await prisma.roadmapReview.findMany({
    where: { roadmapId: String(req.params.roadmapId) },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: reviews });
}));

router.post('/:roadmapId/reviews', handle(async (req, res) => {
  const currentUserId = userId(req);
  const currentUserName = userName(req);
  const input = z.object({
    rating: z.number().int().min(1).max(5),
    reviewText: z.string().trim().min(3).max(2000),
    userAvatar: z.string().optional(),
  }).parse(req.body);

  const review = await RoadmapService.addReview(String(req.params.roadmapId), {
    userId: currentUserId,
    userName: currentUserName,
    userAvatar: input.userAvatar,
    rating: input.rating,
    reviewText: input.reviewText,
  });

  res.status(201).json({ data: review });
}));

// Discussions & Module Q&A
router.get('/:roadmapId/discussions', handle(async (req, res) => {
  const { nodeId } = req.query;
  const discussions = await prisma.roadmapDiscussion.findMany({
    where: {
      roadmapId: String(req.params.roadmapId),
      ...(nodeId ? { nodeId: String(nodeId) } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ data: discussions });
}));

router.post('/:roadmapId/discussions', handle(async (req, res) => {
  const currentUserId = userId(req);
  const currentUserName = userName(req);
  const input = z.object({
    nodeId: z.string().optional(),
    title: z.string().trim().min(1).max(200).optional(),
    content: z.string().trim().min(3).max(5000),
    userAvatar: z.string().optional(),
  }).parse(req.body);

  const discussion = await prisma.roadmapDiscussion.create({
    data: {
      roadmapId: String(req.params.roadmapId),
      nodeId: input.nodeId,
      userId: currentUserId,
      userName: currentUserName,
      userAvatar: input.userAvatar,
      title: input.title,
      content: input.content,
    },
  });

  res.status(201).json({ data: discussion });
}));

// ─────────────────────────────────────────────────────────────
// 3. AI Learning Verification & Competency Assessment Engine
// ─────────────────────────────────────────────────────────────

router.get('/:roadmapId/nodes/:nodeId/assessment-questions', handle(async (req, res) => {
  const node = await prisma.roadmapNode.findFirst({
    where: { id: String(req.params.nodeId), roadmapId: String(req.params.roadmapId) },
  });
  if (!node) return res.status(404).json({ code: 'NOT_FOUND', message: 'Node not found' });

  const questions = RoadmapAssessmentService.generateQuestionsForModule(node.title, node.metadata);
  res.json({ data: { nodeId: node.id, nodeTitle: node.title, questions } });
}));

router.post('/:roadmapId/nodes/:nodeId/assess', handle(async (req, res) => {
  const currentUserId = userId(req);
  const input = z.object({
    answers: z.array(z.object({
      questionId: z.string(),
      answerText: z.string(),
    })).min(1),
  }).parse(req.body);

  const result = await RoadmapAssessmentService.evaluateAssessment({
    userId: currentUserId,
    roadmapId: String(req.params.roadmapId),
    nodeId: String(req.params.nodeId),
    answers: input.answers,
  });

  res.status(200).json({ data: result });
}));

router.get('/:roadmapId/nodes/:nodeId/assessments', handle(async (req, res) => {
  const currentUserId = userId(req);
  const history = await RoadmapAssessmentService.getAssessmentHistory(currentUserId, String(req.params.nodeId));
  res.json({ data: history });
}));

// ─────────────────────────────────────────────────────────────
// 3.1 Tangible Deliverables & Evidence Submission Engine
// ─────────────────────────────────────────────────────────────

router.post('/:roadmapId/nodes/:nodeId/submissions', handle(async (req, res) => {
  const currentUserId = userId(req);
  const currentUserName = userName(req);
  const input = z.object({
    deliverableType: z.enum(['REPOSITORY', 'DEPLOYMENT', 'CODE', 'DIAGRAM', 'TEXT']),
    deliverableUrl: z.string().optional().or(z.literal('')),
    deliverableText: z.string().optional(),
    codeLanguage: z.string().optional(),
    executionResult: z.any().optional(),
  }).parse(req.body);

  const result = await RoadmapDeliverableService.submitAndEvaluateDeliverable({
    roadmapId: String(req.params.roadmapId),
    nodeId: String(req.params.nodeId),
    userId: currentUserId,
    userName: currentUserName,
    deliverableType: input.deliverableType as any,
    deliverableUrl: input.deliverableUrl || undefined,
    deliverableText: input.deliverableText,
    codeLanguage: input.codeLanguage,
    executionResult: input.executionResult,
  });

  res.status(201).json({ data: result });
}));

router.get('/:roadmapId/nodes/:nodeId/submissions', handle(async (req, res) => {
  const currentUserId = userId(req);
  const submissions = await RoadmapDeliverableService.getSubmissionsForNode(
    String(req.params.nodeId),
    currentUserId
  );
  res.json({ data: submissions });
}));

router.get('/:roadmapId/submissions', handle(async (req, res) => {
  const currentUserId = userId(req);
  const submissions = await RoadmapDeliverableService.getSubmissionsForRoadmap(
    String(req.params.roadmapId),
    currentUserId
  );
  res.json({ data: submissions });
}));

// ─────────────────────────────────────────────────────────────
// 3.2 Adaptive Diagnostic Assessment
// ─────────────────────────────────────────────────────────────

router.get('/:roadmapId/diagnostic', handle(async (req, res) => {
  const diagnostic = await RoadmapAdaptiveService.generateDiagnostic(String(req.params.roadmapId));
  res.json({ data: diagnostic });
}));

router.post('/:roadmapId/diagnostic/evaluate', handle(async (req, res) => {
  const currentUserId = userId(req);
  const input = z.object({
    answers: z.record(z.number()),
  }).parse(req.body);

  const result = await RoadmapAdaptiveService.evaluateDiagnostic({
    roadmapId: String(req.params.roadmapId),
    userId: currentUserId,
    answers: input.answers,
  });

  res.json({ data: result });
}));

// ─────────────────────────────────────────────────────────────
// 3.3 Interactive AI Learning Companion
// ─────────────────────────────────────────────────────────────

router.post('/:roadmapId/nodes/:nodeId/companion/chat', handle(async (req, res) => {
  const currentUserId = userId(req);
  const input = z.object({
    message: z.string().trim().min(1).max(2000),
    mode: z.enum(['EXPLAIN', 'SOCRATIC_HINT', 'DEBUG', 'NEXT_STEP']).optional(),
  }).parse(req.body);

  const result = await RoadmapCompanionService.chat({
    roadmapId: String(req.params.roadmapId),
    nodeId: String(req.params.nodeId),
    userId: currentUserId,
    message: input.message,
    mode: input.mode,
  });

  res.json({ data: result });
}));

// ─────────────────────────────────────────────────────────────
// 3.4 Learning Circles & Peer Accountability Cohorts
// ─────────────────────────────────────────────────────────────

router.get('/:roadmapId/circles', handle(async (req, res) => {
  const circles = await RoadmapCircleService.getCirclesForRoadmap(String(req.params.roadmapId));
  res.json({ data: circles });
}));

router.post('/:roadmapId/circles', handle(async (req, res) => {
  const currentUserId = userId(req);
  const currentUserName = userName(req);
  const input = z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().max(500).optional(),
    targetDate: z.string().optional(),
    weeklyGoalHours: z.number().int().min(1).max(80).optional(),
    isPrivate: z.boolean().optional(),
  }).parse(req.body);

  const circle = await RoadmapCircleService.createCircle({
    roadmapId: String(req.params.roadmapId),
    name: input.name,
    description: input.description,
    creatorId: currentUserId,
    creatorName: currentUserName,
    targetDate: input.targetDate,
    weeklyGoalHours: input.weeklyGoalHours,
    isPrivate: input.isPrivate,
  });

  res.status(201).json({ data: circle });
}));

router.post('/:roadmapId/circles/join', handle(async (req, res) => {
  const currentUserId = userId(req);
  const currentUserName = userName(req);
  const input = z.object({
    circleId: z.string().optional(),
    joinCode: z.string().optional(),
  }).parse(req.body);

  const member = await RoadmapCircleService.joinCircle({
    circleId: input.circleId,
    joinCode: input.joinCode,
    userId: currentUserId,
    userName: currentUserName,
  });

  res.json({ data: member });
}));

router.get('/:roadmapId/circles/:circleId', handle(async (req, res) => {
  const circle = await RoadmapCircleService.getCircleDetails(String(req.params.circleId));
  res.json({ data: circle });
}));

router.get('/circles/:circleId', handle(async (req, res) => {
  const circle = await RoadmapCircleService.getCircleDetails(String(req.params.circleId));
  res.json({ data: circle });
}));

// ─────────────────────────────────────────────────────────────
// 3.5 Dynamic "Your Next Action" Engine
// ─────────────────────────────────────────────────────────────

router.get('/:roadmapId/next-action', handle(async (req, res) => {
  const currentUserId = userId(req);
  const nextAction = await RoadmapService.calculateNextAction(String(req.params.roadmapId), currentUserId);
  res.json({ data: nextAction });
}));

// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// 4. Roadmap Studio Creation (Modes A, B, C)
// ─────────────────────────────────────────────────────────────

// Step B: AI Clarification Engine
router.post('/ai/clarify', handle(async (req, res) => {
  const input = z.object({
    goal: z.string().trim().min(2),
    experience: z.string().optional(),
    targetOutcome: z.string().optional(),
    weeklyHours: z.number().int().min(1).max(100).optional(),
    timelineWeeks: z.number().int().min(1).max(52).optional(),
    preferredStyle: z.string().optional(),
    previousAnswers: z.record(z.string()).optional(),
  }).parse(req.body);

  const clarification = RoadmapAICopilot.clarifyGoal(input);
  res.json({ data: clarification });
}));

// Mode C: Fast Goal-Driven AI Generation
router.post('/ai/generate', handle(async (req, res) => {
  const prompt = z.object({
    prompt: z.string().optional(),
    goal: z.string().optional(),
    title: z.string().optional(),
    role: z.string().optional(),
    level: z.string().optional(),
    weeks: z.number().int().min(1).max(52).optional(),
    clarificationAnswers: z.record(z.string()).optional(),
  }).parse(req.body);

  const goal = (prompt.goal || prompt.prompt || '').trim();
  if (!goal) return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'A roadmap goal is required' });

  const generated = RoadmapAICopilot.generateFromGoal({
    goal,
    role: prompt.role,
    level: prompt.level,
    weeks: prompt.weeks,
    title: prompt.title,
    clarificationAnswers: prompt.clarificationAnswers,
  });

  const created = await RoadmapService.createRoadmap({
    ownerId: userId(req),
    creatorName: userName(req),
    title: generated.title,
    description: generated.description,
    goal: generated.goal,
    category: generated.category,
    difficulty: generated.difficulty,
    estimatedWeeks: generated.estimatedWeeks,
    tags: generated.tags,
    license: generated.license,
    nodes: generated.nodes,
  });

  res.status(201).json({ data: created });
}));

// Route alias for backwards compatibility
router.post('/generate', handle(async (req, res) => {
  const prompt = z.object({
    prompt: z.string().optional(),
    goal: z.string().optional(),
    title: z.string().optional(),
    role: z.string().optional(),
    level: z.string().optional(),
    weeks: z.number().int().min(1).max(52).optional(),
    clarificationAnswers: z.record(z.string()).optional(),
  }).parse(req.body);

  const goal = (prompt.goal || prompt.prompt || '').trim();
  if (!goal) return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'A roadmap goal is required' });

  const generated = RoadmapAICopilot.generateFromGoal({
    goal,
    role: prompt.role,
    level: prompt.level,
    weeks: prompt.weeks,
    title: prompt.title,
    clarificationAnswers: prompt.clarificationAnswers,
  });

  const created = await RoadmapService.createRoadmap({
    ownerId: userId(req),
    creatorName: userName(req),
    title: generated.title,
    description: generated.description,
    goal: generated.goal,
    category: generated.category,
    difficulty: generated.difficulty,
    estimatedWeeks: generated.estimatedWeeks,
    tags: generated.tags,
    license: generated.license,
    nodes: generated.nodes,
  });

  res.status(201).json({ data: created });
}));

// Mode B: Truly Interactive Targeted AI Patching
router.post('/:roadmapId/ai/patch', handle(async (req, res) => {
  const currentUserId = userId(req);
  const roadmap = await owned(String(req.params.roadmapId), req);
  if (!roadmap || roadmap.ownerId !== currentUserId) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found or unauthorized' });
  }

  const { instruction, currentNodes } = z.object({
    instruction: z.string().trim().min(2),
    currentNodes: z.array(z.any()).optional(),
  }).parse(req.body);

  const fullRoadmap = await prisma.roadmap.findUnique({
    where: { id: roadmap.id },
    include: { nodes: { orderBy: { position: 'asc' } } },
  });
  if (!fullRoadmap) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  }

  // Preserve unsaved in-memory manual edits by patching against client's current nodes
  const baseRoadmap = currentNodes && Array.isArray(currentNodes) && currentNodes.length > 0
    ? { ...fullRoadmap, nodes: currentNodes }
    : fullRoadmap;

  const patchResult = RoadmapAICopilot.applyTargetedPatch({
    existingRoadmap: baseRoadmap,
    userInstruction: instruction,
  });

  // Save patched nodes back to database
  const saveRes = await RoadmapService.saveDraft({
    roadmapId: roadmap.id,
    userId: currentUserId,
    nodes: patchResult.updatedRoadmap.nodes,
    changelog: patchResult.summary,
    createSnapshot: true,
  });

  res.json({
    data: {
      roadmap: saveRes.roadmap,
      summary: patchResult.summary,
      affectedNodeIds: patchResult.affectedNodeIds,
      mutatedNodeTitles: patchResult.mutatedNodeTitles,
      diff: patchResult.diff,
      cycleDetected: patchResult.cycleDetected,
      cycleNodes: patchResult.cycleNodes,
    },
  });
}));

// Chat alias pointing to patch
router.post('/:roadmapId/ai/chat', handle(async (req, res) => {
  const currentUserId = userId(req);
  const roadmap = await owned(String(req.params.roadmapId), req);
  if (!roadmap || roadmap.ownerId !== currentUserId) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found or unauthorized' });
  }

  const { message } = z.object({ message: z.string().trim().min(2) }).parse(req.body);

  const fullRoadmap = await prisma.roadmap.findUnique({
    where: { id: roadmap.id },
    include: { nodes: { orderBy: { position: 'asc' } } },
  });

  const patchResult = RoadmapAICopilot.applyTargetedPatch({
    existingRoadmap: fullRoadmap,
    userInstruction: message,
  });

  const saveRes = await RoadmapService.saveDraft({
    roadmapId: roadmap.id,
    userId: currentUserId,
    nodes: patchResult.updatedRoadmap.nodes,
    changelog: patchResult.summary,
    createSnapshot: true,
  });

  res.json({
    data: {
      roadmap: saveRes.roadmap,
      explanation: patchResult.summary,
      summary: patchResult.summary,
      mutatedNodeTitles: patchResult.mutatedNodeTitles,
      diff: patchResult.diff,
      cycleDetected: patchResult.cycleDetected,
    },
  });
}));

// Safe Draft Autosave with Optimistic Concurrency Control
router.put('/:roadmapId/draft', handle(async (req, res) => {
  const currentUserId = userId(req);
  const input = z.object({
    baseVersion: z.number().int().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    goal: z.string().optional(),
    category: z.string().optional(),
    difficulty: z.string().optional(),
    estimatedWeeks: z.number().int().optional(),
    tags: z.array(z.string()).optional(),
    graphLayout: z.any().optional(),
    nodes: z.array(z.any()).optional(),
    changelog: z.string().optional(),
    createSnapshot: z.boolean().optional(),
  }).parse(req.body);

  try {
    const result = await RoadmapService.saveDraft({
      roadmapId: String(req.params.roadmapId),
      userId: currentUserId,
      ...input,
    });

    res.json({ data: result });
  } catch (err: any) {
    if (err.code === 'REVISION_CONFLICT' || err.message?.includes('REVISION_CONFLICT')) {
      return res.status(409).json({
        code: 'REVISION_CONFLICT',
        message: err.message,
        serverVersion: err.serverVersion,
      });
    }
    if (err.code === 'INVALID_GRAPH_CYCLE' || err.message?.includes('INVALID_GRAPH_CYCLE')) {
      return res.status(400).json({
        code: 'INVALID_GRAPH_CYCLE',
        message: err.message,
      });
    }
    throw err;
  }
}));

// Version History & Restoration
router.get('/:roadmapId/versions', handle(async (req, res) => {
  const versions = await RoadmapService.getVersionHistory(String(req.params.roadmapId));
  res.json({ data: versions });
}));

router.post('/:roadmapId/versions/:version/restore', handle(async (req, res) => {
  const currentUserId = userId(req);
  const versionNum = parseInt(String(req.params.version), 10);
  const restored = await RoadmapService.restoreVersion(String(req.params.roadmapId), versionNum, currentUserId);
  res.json({ data: restored });
}));

// Mode A: Manual Creation & Publishing
router.get('/', handle(async (req, res) => {
  const roadmaps = await prisma.roadmap.findMany({
    where: {
      OR: [
        { ownerId: userId(req) },
        { collaborators: { some: { userId: userId(req), status: 'ACCEPTED' } } },
      ],
    },
    include: { nodes: { orderBy: { position: 'asc' } }, share: true },
    orderBy: { updatedAt: 'desc' },
  });
  res.json({ data: roadmaps });
}));

router.get('/:roadmapId', handle(async (req, res) => {
  const roadmap = await RoadmapService.getRoadmapById(String(req.params.roadmapId), userId(req));
  if (!roadmap) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  res.json({ data: roadmap });
}));

router.post('/', handle(async (req, res) => {
  const input = z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().max(5000).optional(),
    goal: z.string().max(5000).optional(),
    category: z.string().max(80).optional(),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    estimatedWeeks: z.number().int().min(1).max(520).optional(),
    tags: z.array(z.string().trim().min(1).max(40)).max(12).optional(),
    license: z.string().optional(),
    creatorRole: z.string().optional(),
    creatorCompany: z.string().optional(),
    nodes: z.array(nodeInputBase).optional(),
  }).parse(req.body);

  const created = await RoadmapService.createRoadmap({
    ownerId: userId(req),
    creatorName: userName(req),
    creatorRole: input.creatorRole,
    creatorCompany: input.creatorCompany,
    title: input.title,
    description: input.description,
    goal: input.goal,
    category: input.category,
    difficulty: input.difficulty,
    estimatedWeeks: input.estimatedWeeks,
    tags: input.tags,
    license: input.license,
    nodes: (input.nodes as any) || [],
  });

  res.status(201).json({ data: created });
}));

router.patch('/:roadmapId', handle(async (req, res) => {
  const roadmap = await owned(String(req.params.roadmapId), req);
  if (!roadmap || roadmap.ownerId !== userId(req)) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  const updated = await prisma.roadmap.update({
    where: { id: roadmap.id },
    data: req.body,
  });
  res.json({ data: updated });
}));

router.delete('/:roadmapId', handle(async (req, res) => {
  const roadmap = await prisma.roadmap.findFirst({ where: { id: String(req.params.roadmapId), ownerId: userId(req) } });
  if (!roadmap) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  await prisma.roadmap.delete({ where: { id: roadmap.id } });
  res.status(204).send();
}));

router.post('/:roadmapId/publish', handle(async (req, res) => {
  const license = req.body.license ? String(req.body.license) : 'CC-BY-4.0';
  const published = await RoadmapService.publishRoadmap(String(req.params.roadmapId), userId(req), license);
  res.json({ data: published });
}));

router.post('/:roadmapId/clone', handle(async (req, res) => {
  const currentUserId = userId(req);
  const input = z.object({ title: z.string().trim().min(1).max(200).optional() }).parse(req.body);
  const forked = await RoadmapService.forkRoadmap(String(req.params.roadmapId), currentUserId, input.title);
  res.status(201).json({ data: forked });
}));

router.post('/:roadmapId/nodes', handle(async (req, res) => {
  const roadmap = await owned(String(req.params.roadmapId), req);
  if (!roadmap || roadmap.ownerId !== userId(req)) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  const { children, interview, order, parentId, metadata, ...fields } = nodeInputBase.parse(req.body);
  const node = await prisma.roadmapNode.create({
    data: {
      roadmapId: roadmap.id,
      ...fields,
      parentId,
      position: fields.position ?? order ?? 0,
      metadata: metadata || (interview ? { interview } : undefined),
    },
  });
  res.status(201).json({ data: node });
}));

router.patch('/:roadmapId/nodes/:nodeId', handle(async (req, res) => {
  const roadmap = await owned(String(req.params.roadmapId), req);
  if (!roadmap) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  const node = await prisma.roadmapNode.update({
    where: { id: String(req.params.nodeId), roadmapId: roadmap.id },
    data: req.body,
  });
  res.json({ data: node });
}));

router.delete('/:roadmapId/nodes/:nodeId', handle(async (req, res) => {
  const roadmap = await owned(String(req.params.roadmapId), req);
  if (!roadmap || roadmap.ownerId !== userId(req)) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  await prisma.roadmapNode.delete({ where: { id: String(req.params.nodeId), roadmapId: roadmap.id } });
  res.status(204).send();
}));

router.put('/:roadmapId/progress/:nodeId', handle(async (req, res) => {
  const input = z.object({
    status: z.string(),
    percent: z.number().int().min(0).max(100),
    notes: z.string().optional(),
    masteryStatus: z.string().optional(),
  }).parse(req.body);

  const progress = await prisma.roadmapProgress.upsert({
    where: { nodeId_userId: { nodeId: String(req.params.nodeId), userId: userId(req) } },
    create: {
      roadmapId: String(req.params.roadmapId),
      nodeId: String(req.params.nodeId),
      userId: userId(req),
      ...input,
      completedAt: input.percent === 100 ? new Date() : null,
    },
    update: {
      ...input,
      completedAt: input.percent === 100 ? new Date() : null,
    },
  });
  res.json({ data: progress });
}));

router.get('/:roadmapId/progress', handle(async (req, res) => {
  const progressList = await prisma.roadmapProgress.findMany({
    where: {
      roadmapId: String(req.params.roadmapId),
      ...(req.query.userId ? { userId: String(req.query.userId) } : { userId: userId(req) }),
    },
  });
  res.json({ data: progressList });
}));

router.get('/:roadmapId/analytics', handle(async (req, res) => {
  const r = (await owned(String(req.params.roadmapId), req)) || (await prisma.roadmap.findFirst({ where: { id: String(req.params.roadmapId), isPublished: true } }));
  if (!r) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  const [total, completed, collaborators, learners] = await Promise.all([
    prisma.roadmapProgress.count({ where: { roadmapId: r.id } }),
    prisma.roadmapProgress.count({ where: { roadmapId: r.id, percent: 100 } }),
    prisma.roadmapCollaborator.count({ where: { roadmapId: r.id, status: 'ACCEPTED' } }),
    prisma.roadmapInstance.count({ where: { roadmapId: r.id } }),
  ]);
  res.json({
    data: {
      roadmapId: r.id,
      totalProgressRecords: total,
      completedProgressRecords: completed,
      completionRate: total ? completed / total : 0,
      collaborators,
      activeLearners: learners,
    },
  });
}));

router.get('/templates', handle(async (req, res) => {
  res.json({
    data: await prisma.roadmapTemplate.findMany({
      where: { isPublic: true, ...(req.query.category ? { category: String(req.query.category) } : {}) },
      orderBy: { createdAt: 'desc' },
    }),
  });
}));

export default router;
