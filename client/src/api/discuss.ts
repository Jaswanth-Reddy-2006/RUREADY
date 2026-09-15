import apiClient from './client';

export interface DiscussionComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  imageUrl?: string | null;
  upvotes: number;
  upvotedUserIds?: string[];
  isAiModerator?: boolean;
  createdAt: string;
}

export interface DiscussionPost {
  id: string;
  userId: string;
  userName: string;
  roleCategory: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  tags: string[];
  upvotes: number;
  hasUpvoted?: boolean;
  viewsCount?: string;
  aiReply?: string | null;
  commentCount?: number;
  comments?: DiscussionComment[];
  createdAt: string;
  updatedAt?: string;
}

export const FALLBACK_DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'post-1',
    userId: 'u-1',
    userName: 'R U Ready Official',
    roleCategory: 'INTERVIEW',
    title: 'Before Vibe Coding, Do You Frame the Problem First? Master AI-Assisted System Rounds',
    content: 'Still letting AI call the shots? In the AI era, your advantage isn\'t just writing code faster. It\'s knowing what to ask, what to challenge, and what to trust. A new skill for AI-assisted interviews: Don\'t just write code, frame the architectural constraints and SLA boundaries first.',
    tags: ['AI Interview', 'System Design', 'Problem Framing', 'Google'],
    upvotes: 47,
    viewsCount: '6.3K',
    commentCount: 44,
    aiReply: '⭐ AI Moderator Insight: In L5+ engineering loops, interviewers evaluate problem framing, edge-case probing, and distributed fault tolerance before a single line of code is typed.',
    createdAt: '2026-08-31T10:00:00Z',
    comments: [
      {
        id: 'comm-1',
        postId: 'post-1',
        userId: 'u-101',
        userName: 'Priya S. (Senior Backend)',
        content: 'Completely agree. In my Google round, asking clarifying questions about throughput and read-to-write ratio for 5 minutes saved me from redesigning the database schema halfway through.',
        upvotes: 12,
        createdAt: '2026-08-31T12:30:00Z',
      }
    ]
  },
  {
    id: 'post-2',
    userId: 'u-2',
    userName: 'Ananya Roy (Ex-Amazon SDE-2)',
    roleCategory: 'EXPERIENCE',
    title: 'Amazon SDE2 Interview Experience | AUG 2026 | BLR | 3.3 YOE [Selected]',
    content: 'Round 1: Low-Level Design (Parking Lot with concurrency & dynamic pricing). Round 2: DSA (Tree DP & Sliding Window). Round 3: High-Level System Design (Distributed Notification System). Round 4: Bar Raiser (Customer Obsession & Ownership STAR stories). Key advice: Prepare concrete metrics for all STAR behavioral points!',
    tags: ['Amazon', 'SDE2', 'Interview Experience', 'STAR'],
    upvotes: 89,
    viewsCount: '4.0K',
    commentCount: 27,
    aiReply: '⭐ AI Moderator Insight: Exceptional STAR structuring. Quantifying business impact and trade-offs is what consistently unlocks Strong Hire ratings.',
    createdAt: '2026-08-26T14:20:00Z',
    comments: []
  },
  {
    id: 'post-3',
    userId: 'u-3',
    userName: 'Alex Chen (Staff Lead @ Stripe)',
    roleCategory: 'SYSTEM_DESIGN',
    title: 'How do you handle Redis cache stampedes under 100K RPS in Node.js microservices?',
    content: 'We recently experienced p99 latency spikes when a top-level cached user permissions key expired under heavy traffic. What architectural patterns (e.g. probabilistic early expiration XFetch, distributed Mutex locks) do you enforce during system design interviews?',
    tags: ['System Design', 'Redis', 'Node.js', 'Stripe'],
    upvotes: 52,
    viewsCount: '17.8K',
    commentCount: 38,
    aiReply: '⭐ AI Moderator Insight: The industry-standard approach is Probabilistic Early Expiration (XFetch algorithm) combined with a Redis Distributed Lock (Redlock). When TTL < computed delta, asynchronously trigger a background re-computation.',
    createdAt: '2026-08-17T09:15:00Z',
    comments: []
  },
  {
    id: 'post-4',
    userId: 'u-4',
    userName: 'Marcus Vance (Principal Architect)',
    roleCategory: 'COMPENSATION',
    title: 'Salesforce Offer | MTS | $195K Base + $140K RSU vs Google L5 Negotiation Breakdown',
    content: 'Received competing offers from Salesforce (MTS Backend) and Google Cloud (L5 Distributed Storage). Here is the full breakdown of base, target bonus, equity vesting schedules, and how holding competing offers influenced the signing bonus.',
    tags: ['Compensation', 'Salesforce', 'Google', 'Offer Negotiation'],
    upvotes: 63,
    viewsCount: '3.5K',
    commentCount: 19,
    aiReply: '⭐ AI Moderator Insight: Always evaluate vesting cliff schedules and refresher cadence when comparing base vs equity heavy offers.',
    createdAt: '2026-08-12T16:45:00Z',
    comments: []
  },
  {
    id: 'post-5',
    userId: 'u-5',
    userName: 'Devin Thorne (Staff ML Engineer)',
    roleCategory: 'RESUME_ROAST',
    title: 'Resume Roast: 4 YOE Backend Engineer moving to AI / LLM Infrastructure',
    content: 'Roast my resume! I recently led the migration of our search pipeline to a hybrid vector retrieval (Pinecone + PostgreSQL pgvector). Are my bullet points strong enough for OpenAI, Anthropic, or Meta AI infrastructure teams?',
    tags: ['Resume Roast', 'AI/ML', 'Vector Search', 'RAG'],
    upvotes: 38,
    viewsCount: '2.9K',
    commentCount: 14,
    aiReply: '⭐ AI Moderator Insight: Transform "Implemented vector search" into "Engineered hybrid RAG retrieval pipeline with pgvector & Pinecone, decreasing semantic query p95 latency by 35% across 2M embeddings".',
    createdAt: '2026-08-05T11:10:00Z',
    comments: []
  },
  {
    id: 'post-6',
    userId: 'u-6',
    userName: 'Karthik Raja',
    roleCategory: 'JOBS',
    title: 'Amazon SDE-1 Interview is in Evening, I am nervous & what to expect in Bar Raiser?',
    content: 'My final Amazon virtual onsite is scheduled for 5 PM today. The first 3 rounds went well, but I am nervous about the Bar Raiser. Does the Bar Raiser focus more on Leadership Principles or live coding edge cases?',
    tags: ['Amazon', 'SDE1', 'Bar Raiser', 'Prep'],
    upvotes: 31,
    viewsCount: '3.5K',
    commentCount: 22,
    aiReply: '⭐ AI Moderator Insight: Amazon Bar Raisers assess culture fit and candidate growth ceiling. Focus on "Have Backbone; Disagree and Commit" and "Deliver Results" using structured STAR answers.',
    createdAt: '2026-08-01T08:30:00Z',
    comments: []
  }
];

let localStore: DiscussionPost[] = [...FALLBACK_DISCUSSIONS];

export const getDiscussionPosts = async (
  category?: string,
  search?: string,
  sort?: 'trending' | 'latest' | 'active',
  page?: number,
  limit?: number
): Promise<DiscussionPost[]> => {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  if (sort) params.append('sort', sort);
  if (page) params.append('page', String(page));
  if (limit) params.append('limit', String(limit));

  try {
    const response = await apiClient.get<DiscussionPost[]>(`/discuss?${params.toString()}`, {
      timeout: 4000,
    });
    if (Array.isArray(response.data) && response.data.length > 0) {
      localStore = response.data;
      return response.data;
    }
  } catch {
    // If backend timeout or offline, use local in-memory store smoothly
  }

  // Filter local store
  let filtered = [...localStore];
  if (category && category.toUpperCase() !== 'ALL') {
    filtered = filtered.filter((p) => p.roleCategory.toUpperCase() === category.toUpperCase());
  }
  if (search && search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (sort === 'trending') {
    filtered.sort((a, b) => b.upvotes - a.upvotes);
  } else if (sort === 'latest') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return filtered;
};

export const slugifyTitle = (title: string): string => {
  if (!title) return 'discussion-topic';
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'discussion-topic';
};

export const getDiscussionPostById = async (idOrSlug: string): Promise<DiscussionPost> => {
  const decoded = decodeURIComponent(idOrSlug).toLowerCase();

  try {
    const response = await apiClient.get<DiscussionPost>(`/discuss/${encodeURIComponent(idOrSlug)}`, { timeout: 4000 });
    if (response.data) return response.data;
  } catch {
    // Lookup in local store
  }

  const found = localStore.find(
    (p) =>
      p.id === idOrSlug ||
      slugifyTitle(p.title) === decoded ||
      p.title.toLowerCase() === decoded
  );
  if (found) return found;
  return localStore[0];
};

export const createDiscussionPost = async (data: {
  category: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  tags?: string[];
  askAiModerator?: boolean;
}): Promise<DiscussionPost> => {
  const newPost: DiscussionPost = {
    id: `post-${Date.now()}`,
    userId: 'curr-user',
    userName: 'Candidate (You)',
    roleCategory: data.category.toUpperCase(),
    title: data.title,
    content: data.content,
    imageUrl: data.imageUrl || null,
    tags: data.tags || ['Interview'],
    upvotes: 1,
    hasUpvoted: true,
    viewsCount: '1',
    commentCount: 0,
    aiReply: null,
    comments: [],
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await apiClient.post<DiscussionPost>('/discuss', data, { timeout: 4000 });
    localStore = [response.data, ...localStore];
    return response.data;
  } catch {
    localStore = [newPost, ...localStore];
    return newPost;
  }
};

export const upvoteDiscussionPost = async (idOrSlug: string): Promise<DiscussionPost> => {
  const decoded = decodeURIComponent(idOrSlug).toLowerCase();
  const post = localStore.find(
    (p) => p.id === idOrSlug || slugifyTitle(p.title) === decoded || p.title.toLowerCase() === decoded
  );
  if (post) {
    const hasUp = Boolean(post.hasUpvoted);
    post.hasUpvoted = !hasUp;
    post.upvotes = Math.max(0, post.upvotes + (hasUp ? -1 : 1));
  }

  const targetId = post?.id || idOrSlug;

  try {
    const response = await apiClient.post<DiscussionPost>(`/discuss/${encodeURIComponent(targetId)}/upvote`, {}, { timeout: 4000 });
    return response.data;
  } catch {
    return post || localStore[0];
  }
};

export const addDiscussionComment = async (
  idOrSlug: string,
  data: {
    content: string;
    imageUrl?: string | null;
    askAiModerator?: boolean;
  }
): Promise<{ success: boolean; comment: DiscussionComment; totalComments: number }> => {
  const decoded = decodeURIComponent(idOrSlug).toLowerCase();
  const post = localStore.find(
    (p) => p.id === idOrSlug || slugifyTitle(p.title) === decoded || p.title.toLowerCase() === decoded
  );
  const targetId = post?.id || idOrSlug;

  const newComment: DiscussionComment = {
    id: `comm-${Date.now()}`,
    postId: targetId,
    userId: 'curr-user',
    userName: 'Candidate (You)',
    content: data.content,
    imageUrl: data.imageUrl || null,
    upvotes: 1,
    createdAt: new Date().toISOString(),
  };

  if (post) {
    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    post.commentCount = post.comments.length;
  }

  try {
    const response = await apiClient.post<{ success: boolean; comment: DiscussionComment; totalComments: number }>(
      `/discuss/${encodeURIComponent(targetId)}/comments`,
      data,
      { timeout: 4000 }
    );
    return response.data;
  } catch {
    return {
      success: true,
      comment: newComment,
      totalComments: post?.comments?.length || 1,
    };
  }
};


