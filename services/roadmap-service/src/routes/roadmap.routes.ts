import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { generateSmartRoadmap } from '../services/roadmap-generator.js';

const router: Router = Router();
const userId = (req: Request) => String(req.headers['x-user-id'] || req.body?.userId || 'anonymous');
const id = z.string().min(1);
const roadmapInput = z.object({ title: z.string().trim().min(1).max(200), description: z.string().max(5000).optional(), goal: z.string().max(5000).optional(), status: z.string().optional(), category: z.string().max(80).optional(), difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(), estimatedWeeks: z.number().int().min(1).max(520).optional(), tags: z.array(z.string().trim().min(1).max(40)).max(12).optional() });
const interviewInput = z.object({ topic: z.string().min(1).max(200), description: z.string().max(2000).optional() });
const nodeInputBase = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).optional(),
  type: z.string().optional(),
  position: z.number().int().min(0).optional(),
  order: z.number().int().min(0).optional(),
  parentId: z.string().optional(),
  interview: interviewInput.optional(),
  children: z.array(z.unknown()).optional(),
});
const nodeInput = nodeInputBase.transform(({ order, ...node }) => ({ ...node, ...(node.position === undefined && order !== undefined ? { position: order } : {}) }));
const handle = (fn: (req: Request, res: Response) => Promise<unknown>) => (req: Request, res: Response, next: NextFunction) => fn(req, res).catch(next);
const owned = async (roadmapId: string, req: Request) => prisma.roadmap.findFirst({ where: { id: roadmapId, OR: [{ ownerId: userId(req) }, { collaborators: { some: { userId: userId(req), status: 'ACCEPTED' } } }] } });

router.get('/', handle(async (req, res) => {
  const roadmaps = await prisma.roadmap.findMany({ where: { OR: [{ ownerId: userId(req) }, { collaborators: { some: { userId: userId(req), status: 'ACCEPTED' } } }] }, include: { nodes: { orderBy: { position: 'asc' } }, share: true }, orderBy: { updatedAt: 'desc' } });
  res.json({ data: roadmaps });
}));
router.get('/templates', handle(async (req, res) => { res.json({ data: await prisma.roadmapTemplate.findMany({ where: { isPublic: true, ...(req.query.category ? { category: String(req.query.category) } : {}) }, orderBy: { createdAt: 'desc' } }) }); }));
router.get('/explore', handle(async (req, res) => {

  const { category, difficulty, search } = req.query as { category?: string; difficulty?: string; search?: string };
  const where: any = { isPublished: true };

  if (category && category !== 'all') {
    where.category = String(category);
  }
  if (difficulty && difficulty !== 'all') {
    where.difficulty = String(difficulty);
  }
  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { goal: { contains: q, mode: 'insensitive' } },
    ];
  }

  const roadmaps = await prisma.roadmap.findMany({
    where,
    include: { nodes: { orderBy: { position: 'asc' } } },
    orderBy: { updatedAt: 'desc' },
    take: 50,
  });
  res.json({ data: roadmaps });
}));

router.post('/templates', handle(async (req, res) => { const input = z.object({ name: z.string().min(1), description: z.string().optional(), category: z.string().optional(), isPublic: z.boolean().optional(), definition: z.any() }).parse(req.body); res.status(201).json({ data: await prisma.roadmapTemplate.create({ data: { ...input, authorId: userId(req) } as any }) }); }));
router.get('/:roadmapId', handle(async (req, res) => {
  const roadmap = await owned(String(req.params.roadmapId), req);
  const publicRoadmap = !roadmap ? await prisma.roadmap.findFirst({ where: { id: String(req.params.roadmapId), isPublished: true } }) : null;
  if (!roadmap && !publicRoadmap) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  res.json({ data: await prisma.roadmap.findUnique({ where: { id: (roadmap || publicRoadmap)!.id }, include: { nodes: { orderBy: { position: 'asc' } }, collaborators: roadmap ? true : false, share: true } }) });
}));
router.post('/', handle(async (req, res) => {
  const input = roadmapInput.parse(req.body);
  const nodes = z.array(nodeInputBase).max(500).parse(req.body.nodes || []);
  const roadmap = await prisma.roadmap.create({ data: { ...input, ownerId: userId(req) } });
  const createNode = async (node: z.infer<typeof nodeInputBase>, parentId: string | undefined, position: number): Promise<void> => {
    const { children, interview, order, parentId: requestedParent, ...fields } = node;
    const created = await prisma.roadmapNode.create({
      data: {
        ...fields,
        roadmapId: roadmap.id,
        parentId,
        position: fields.position ?? order ?? position,
        metadata: interview ? { interview } : undefined,
      },
    });
    for (const [index, child] of (children || []).entries()) {
      await createNode(nodeInputBase.parse(child), created.id, index);
    }
  };
  for (const [index, node] of nodes.entries()) await createNode(node, undefined, index);
  const saved = await prisma.roadmap.findUnique({ where: { id: roadmap.id }, include: { nodes: { orderBy: { position: 'asc' } } } });
  res.status(201).json({ data: saved });
}));
router.patch('/:roadmapId', handle(async (req, res) => {
  const roadmap = await owned(String(req.params.roadmapId), req);
  if (!roadmap || roadmap.ownerId !== userId(req)) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  const updated = await prisma.roadmap.update({ where: { id: roadmap.id }, data: roadmapInput.partial().parse(req.body) });
  res.json({ data: updated });
}));
router.delete('/:roadmapId', handle(async (req, res) => {
  const roadmap = await prisma.roadmap.findFirst({ where: { id: String(req.params.roadmapId), ownerId: userId(req) } });
  if (!roadmap) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  await prisma.roadmap.delete({ where: { id: roadmap.id } }); res.status(204).send();
}));

const generateRoadmap = handle(async (req, res) => {
  const prompt = z.object({
    prompt: z.string().optional(),
    goal: z.string().optional(),
    title: z.string().optional(),
    role: z.string().optional(),
    level: z.string().optional(),
    weeks: z.number().int().min(1).max(52).optional(),
  }).parse(req.body);

  const goal = (prompt.goal || prompt.prompt || '').trim();
  if (!goal) return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'A roadmap goal is required' });

  const generated = generateSmartRoadmap({
    goal,
    role: prompt.role,
    level: prompt.level,
    weeks: prompt.weeks,
    title: prompt.title,
  });

  const roadmap = await prisma.roadmap.create({
    data: {
      ownerId: userId(req),
      title: generated.title,
      description: generated.description,
      goal: generated.goal,
      category: generated.category,
      difficulty: generated.difficulty,
      estimatedWeeks: generated.estimatedWeeks,
      tags: generated.tags,
      status: 'DRAFT',
      isPublished: false,
    },
  });

  for (const node of generated.nodes) {
    const createdNode = await prisma.roadmapNode.create({
      data: {
        roadmapId: roadmap.id,
        title: node.title,
        description: node.description,
        type: node.type,
        position: node.position,
        metadata: node.interview ? { interview: node.interview } : undefined,
      },
    });

    if (node.children?.length) {
      for (const [cIndex, child] of node.children.entries()) {
        await prisma.roadmapNode.create({
          data: {
            roadmapId: roadmap.id,
            parentId: createdNode.id,
            title: child.title,
            description: child.description,
            type: 'TASK',
            position: cIndex,
          },
        });
      }
    }
  }

  const saved = await prisma.roadmap.findUnique({
    where: { id: roadmap.id },
    include: { nodes: { orderBy: { position: 'asc' } } },
  });

  res.status(201).json({ data: saved });
});

router.post('/generate', generateRoadmap);
router.post('/ai/generate', generateRoadmap);
router.post('/:roadmapId/nodes', handle(async (req, res) => {
  const roadmap = await owned(String(req.params.roadmapId), req); if (!roadmap || roadmap.ownerId !== userId(req)) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  const { children, interview, order, parentId, ...fields } = nodeInputBase.parse(req.body);
  res.status(201).json({ data: await prisma.roadmapNode.create({ data: {
    roadmapId: roadmap.id,
    ...fields,
    parentId,
    position: fields.position ?? order,
    metadata: interview ? { interview } : undefined,
  } }) });
}));
router.post('/:roadmapId/clone', handle(async (req, res) => {
  const source = await prisma.roadmap.findFirst({ where: { id: String(req.params.roadmapId), isPublished: true }, include: { nodes: { orderBy: { position: 'asc' } } } });
  if (!source) return res.status(404).json({ code: 'NOT_FOUND', message: 'Published roadmap not found' });
  const input = z.object({ title: z.string().trim().min(1).max(200).optional() }).parse(req.body);
  const cloned = await prisma.roadmap.create({
    data: {
      ownerId: userId(req),
      title: input.title || `${source.title} (copy)`,
      description: source.description,
      goal: source.goal,
      category: source.category,
      difficulty: source.difficulty,
      estimatedWeeks: source.estimatedWeeks,
      tags: source.tags === null ? undefined : source.tags,
      status: 'DRAFT',
    },
  });
  const nodeIds = new Map<string, string>();
  for (const sourceNode of source.nodes) {
    const created = await prisma.roadmapNode.create({
      data: {
        roadmapId: cloned.id,
        title: sourceNode.title,
        description: sourceNode.description,
        type: sourceNode.type,
        position: sourceNode.position,
        metadata: sourceNode.metadata === null ? undefined : sourceNode.metadata,
        parentId: sourceNode.parentId ? nodeIds.get(sourceNode.parentId) : undefined,
      },
    });
    nodeIds.set(sourceNode.id, created.id);
  }
  const clonedWithNodes = await prisma.roadmap.findUnique({ where: { id: cloned.id }, include: { nodes: { orderBy: { position: 'asc' } } } });
  await prisma.roadmap.update({ where: { id: source.id }, data: { cloneCount: { increment: 1 } } });
  res.status(201).json({ data: clonedWithNodes });
}));
router.patch('/:roadmapId/nodes/:nodeId', handle(async (req, res) => {
  const roadmap = await owned(String(req.params.roadmapId), req); if (!roadmap) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  const input = nodeInputBase.partial().transform(({ order, children, interview, ...node }) => ({
    ...node,
    ...(node.position === undefined && order !== undefined ? { position: order } : {}),
    ...(interview ? { metadata: { interview } } : {}),
  })).parse(req.body);
  res.json({ data: await prisma.roadmapNode.update({ where: { id: String(req.params.nodeId), roadmapId: roadmap.id }, data: input }) });
}));
router.delete('/:roadmapId/nodes/:nodeId', handle(async (req, res) => {
  const roadmap = await owned(String(req.params.roadmapId), req); if (!roadmap || roadmap.ownerId !== userId(req)) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  await prisma.roadmapNode.delete({ where: { id: String(req.params.nodeId), roadmapId: roadmap.id } }); res.status(204).send();
}));

router.put('/:roadmapId/progress/:nodeId', handle(async (req, res) => {
  const roadmap = await owned(String(req.params.roadmapId), req); if (!roadmap) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  const input = z.object({ status: z.string(), percent: z.number().int().min(0).max(100), notes: z.string().optional() }).parse(req.body);
  const progress = await prisma.roadmapProgress.upsert({ where: { nodeId_userId: { nodeId: String(req.params.nodeId), userId: userId(req) } }, create: { roadmapId: roadmap.id, nodeId: String(req.params.nodeId), userId: userId(req), ...input, completedAt: input.percent === 100 ? new Date() : null }, update: { ...input, completedAt: input.percent === 100 ? new Date() : null } });
  res.json({ data: progress });
}));
router.get('/:roadmapId/progress', handle(async (req, res) => {
  const roadmap = await owned(String(req.params.roadmapId), req); if (!roadmap) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' });
  res.json({ data: await prisma.roadmapProgress.findMany({ where: { roadmapId: roadmap.id, ...(req.query.userId ? { userId: String(req.query.userId) } : {}) } }) });
}));

router.get('/:roadmapId/collaborators', handle(async (req, res) => { const r = await owned(String(req.params.roadmapId), req); if (!r) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' }); res.json({ data: await prisma.roadmapCollaborator.findMany({ where: { roadmapId: r.id } }) }); }));
router.post('/:roadmapId/collaborators', handle(async (req, res) => { const r = await prisma.roadmap.findFirst({ where: { id: String(req.params.roadmapId), ownerId: userId(req) } }); if (!r) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' }); const input = z.object({ email: z.string().email(), role: z.enum(['VIEWER', 'EDITOR']).default('VIEWER'), userId: z.string().optional() }).parse(req.body); res.status(201).json({ data: await prisma.roadmapCollaborator.upsert({ where: { roadmapId_email: { roadmapId: r.id, email: input.email } }, create: { roadmapId: r.id, ...input }, update: { ...input, status: 'PENDING' } }) }); }));
router.patch('/:roadmapId/collaborators/:collaboratorId', handle(async (req, res) => { const r = await prisma.roadmap.findFirst({ where: { id: String(req.params.roadmapId), ownerId: userId(req) } }); if (!r) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' }); const input = z.object({ role: z.enum(['VIEWER', 'EDITOR']), status: z.enum(['PENDING', 'ACCEPTED', 'DECLINED']).optional() }).parse(req.body); res.json({ data: await prisma.roadmapCollaborator.update({ where: { id: String(req.params.collaboratorId), roadmapId: r.id }, data: input }) }); }));

router.post('/:roadmapId/publish', handle(async (req, res) => { const r = await prisma.roadmap.findFirst({ where: { id: String(req.params.roadmapId), ownerId: userId(req) } }); if (!r) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' }); const visibility = z.enum(['PRIVATE', 'UNLISTED', 'PUBLIC']).default('PUBLIC').parse(req.body.visibility); res.json({ data: await prisma.roadmap.update({ where: { id: r.id }, data: { isPublished: visibility === 'PUBLIC', status: visibility === 'PUBLIC' ? 'PUBLISHED' : 'DRAFT', publishedAt: visibility === 'PUBLIC' ? new Date() : null } }) }); }));
router.post('/:roadmapId/share', handle(async (req, res) => { const r = await prisma.roadmap.findFirst({ where: { id: String(req.params.roadmapId), ownerId: userId(req) } }); if (!r) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' }); const share = await prisma.roadmapShare.upsert({ where: { roadmapId: r.id }, create: { roadmapId: r.id, access: String(req.body.access || 'VIEW') }, update: { access: String(req.body.access || 'VIEW'), expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null } }); res.status(201).json({ data: share, url: `/api/roadmaps/shared/${share.token}` }); }));
router.get('/shared/:token', handle(async (req, res) => { const share = await prisma.roadmapShare.findUnique({ where: { token: String(req.params.token) }, include: { roadmap: { include: { nodes: { orderBy: { position: 'asc' } } } } } }); if (!share || (share.expiresAt && share.expiresAt < new Date())) return res.status(404).json({ code: 'NOT_FOUND', message: 'Share link not found or expired' }); res.json({ data: share.roadmap }); }));

router.get('/templates', handle(async (req, res) => { res.json({ data: await prisma.roadmapTemplate.findMany({ where: { isPublic: true, ...(req.query.category ? { category: String(req.query.category) } : {}) }, orderBy: { createdAt: 'desc' } }) }); }));
router.post('/templates', handle(async (req, res) => { const input = z.object({ name: z.string().min(1), description: z.string().optional(), category: z.string().optional(), isPublic: z.boolean().optional(), definition: z.any() }).parse(req.body); res.status(201).json({ data: await prisma.roadmapTemplate.create({ data: { ...input, authorId: userId(req) } as any }) }); }));
router.get('/:roadmapId/analytics', handle(async (req, res) => { const r = await owned(String(req.params.roadmapId), req) || await prisma.roadmap.findFirst({ where: { id: String(req.params.roadmapId), isPublished: true } }); if (!r) return res.status(404).json({ code: 'NOT_FOUND', message: 'Roadmap not found' }); const [total, completed, collaborators] = await Promise.all([prisma.roadmapProgress.count({ where: { roadmapId: r.id } }), prisma.roadmapProgress.count({ where: { roadmapId: r.id, percent: 100 } }), prisma.roadmapCollaborator.count({ where: { roadmapId: r.id, status: 'ACCEPTED' } })]); res.json({ data: { roadmapId: r.id, totalProgressRecords: total, completedProgressRecords: completed, completionRate: total ? completed / total : 0, collaborators } }); }));

export default router;
