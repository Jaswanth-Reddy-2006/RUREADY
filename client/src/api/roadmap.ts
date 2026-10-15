import apiClient from './client';

export type RoadmapVisibility = 'PRIVATE' | 'UNLISTED' | 'PUBLIC';
export type RoadmapNodeStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface RoadmapNode {
  id?: string;
  title: string;
  description?: string;
  type?: 'MILESTONE' | 'TASK' | 'RESOURCE' | 'PROJECT';
  status?: RoadmapNodeStatus;
  order: number;
  estimatedMinutes?: number;
  resources?: Array<{ label: string; url: string }>;
  parentId?: string;
  position?: number;
  children?: RoadmapNode[];
  interview?: { topic: string; description?: string };
}

export interface Roadmap {
  id: string;
  title: string;
  description?: string;
  goal?: string;
  visibility: RoadmapVisibility;
  publishedAt?: string;
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
  completionPercent: number;
  completedNodes: number;
  totalNodes: number;
  activeDays: number;
  collaborators: number;
}

const unwrap = <T>(response: { data: T | { data: T } }): T => {
  const value = response.data;
  return typeof value === 'object' && value !== null && 'data' in value
    ? (value.data as T)
    : (value as T);
};

const normalizeRoadmap = (roadmap: Roadmap & { isPublished?: boolean; nodes?: Array<RoadmapNode & { position?: number }> }): Roadmap => {
  const flat: Array<RoadmapNode & { children: RoadmapNode[] }> = (roadmap.nodes || []).map((node, index) => ({ ...node, order: node.order ?? node.position ?? index, children: [] }));
  const byId = new Map(flat.filter((node) => node.id).map((node) => [node.id as string, node]));
  const roots: RoadmapNode[] = [];
  flat.forEach((node) => {
    const parent = node.parentId ? byId.get(node.parentId) : undefined;
    if (parent) parent.children?.push(node);
    else roots.push(node);
  });
  return { ...roadmap, visibility: roadmap.visibility || (roadmap.isPublished ? 'PUBLIC' : 'PRIVATE'), nodes: roots };
};

export const roadmapApi = {
  list: async () => unwrap<Roadmap[]>(await apiClient.get('/roadmaps')).map(normalizeRoadmap),
  get: async (id: string) => normalizeRoadmap(unwrap<Roadmap>(await apiClient.get(`/roadmaps/${id}`))),
  create: async (payload: Omit<Roadmap, 'id' | 'createdAt' | 'updatedAt'>) =>
    normalizeRoadmap(unwrap<Roadmap>(await apiClient.post('/roadmaps', payload))),
  generate: async (payload: { goal: string; role?: string; level?: string; weeks?: number }) =>
    normalizeRoadmap(unwrap<Roadmap>(await apiClient.post('/roadmaps/ai/generate', payload))),
  update: async (id: string, payload: Partial<Roadmap>) =>
    unwrap<Roadmap>(await apiClient.patch(`/roadmaps/${id}`, payload)),
  updateNode: async (id: string, nodeId: string, payload: Partial<RoadmapNode>) =>
    unwrap<Roadmap>(await apiClient.patch(`/roadmaps/${id}/nodes/${nodeId}`, payload)),
  delete: async (id: string) => {
    await apiClient.delete(`/roadmaps/${id}`);
  },
  addNode: async (id: string, node: Partial<RoadmapNode>) =>
    unwrap<RoadmapNode>(await apiClient.post(`/roadmaps/${id}/nodes`, node)),
  deleteNode: async (id: string, nodeId: string) => {
    await apiClient.delete(`/roadmaps/${id}/nodes/${nodeId}`);
  },
  explore: async (params?: { category?: string; difficulty?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.difficulty && params.difficulty !== 'all') query.set('difficulty', params.difficulty);
    if (params?.search?.trim()) query.set('search', params.search.trim());
    const qs = query.toString() ? `?${query.toString()}` : '';
    return unwrap<Roadmap[]>(await apiClient.get(`/roadmaps/explore${qs}`)).map(normalizeRoadmap);
  },
  clone: async (id: string, title?: string) => normalizeRoadmap(unwrap<Roadmap>(await apiClient.post(`/roadmaps/${id}/clone`, { title }))),
  updateProgress: async (id: string, nodeId: string, percent: number) =>
    unwrap(await apiClient.put(`/roadmaps/${id}/progress/${nodeId}`, {
      status: percent === 100 ? 'DONE' : percent > 0 ? 'IN_PROGRESS' : 'TODO',
      percent,
    })),
  getTemplates: async () => unwrap<RoadmapTemplate[]>(await apiClient.get('/roadmaps/templates')),
  getAnalytics: async (id: string) =>
    unwrap<RoadmapAnalytics>(await apiClient.get(`/roadmaps/${id}/analytics`)),
  invite: async (id: string, email: string, role: 'EDITOR' | 'VIEWER') =>
    unwrap<Roadmap>(await apiClient.post(`/roadmaps/${id}/collaborators`, { email, role })),
  publish: async (id: string, visibility: RoadmapVisibility) =>
    unwrap<Roadmap>(await apiClient.post(`/roadmaps/${id}/publish`, { visibility })),

};
