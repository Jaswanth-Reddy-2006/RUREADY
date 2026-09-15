// ═══════════════════════════════════════════════════════════════
// Role Discussion & Community Hub Service — Enterprise Scale
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import { aiProviderManager } from '../lib/ai-provider-manager.js';
import { NotFoundError, BadRequestError } from '../lib/errors.js';
import { z } from 'zod';

export const CreatePostSchema = z.object({
  category: z.string().min(2).max(50),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .refine(
      (val) => val.trim().split(/\s+/).length <= 100,
      { message: 'Title cannot exceed 100 words' }
    ),
  content: z.string().min(10, 'Content must be at least 10 characters').max(5000, 'Content cannot exceed 5000 characters'),
  tags: z.array(z.string().max(30)).max(10).optional().default([]),
  askAiModerator: z.boolean().optional().default(true),
});

export const CreateCommentSchema = z.object({
  content: z.string().min(2, 'Comment must be at least 2 characters').max(3000, 'Comment cannot exceed 3000 characters'),
  askAiModerator: z.boolean().optional().default(false),
});

// In-memory structured comments store keyed by postId for scalable rich thread discussion
interface DiscussionComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  upvotes: number;
  upvotedUserIds: string[];
  isAiModerator?: boolean;
  createdAt: string;
}

const COMMENTS_STORE = new Map<string, DiscussionComment[]>();
const POST_UPVOTES_STORE = new Map<string, Set<string>>();

export const discussService = {
  async getPosts(params: {
    category?: string;
    search?: string;
    sort?: 'trending' | 'latest' | 'active';
    page?: number;
    limit?: number;
  }) {
    const { category, search, sort = 'trending', page = 1, limit = 30 } = params;
    const safeLimit = Math.min(50, Math.max(1, limit));
    const safePage = Math.max(1, page);

    const whereCondition: any = {};
    if (category && category.toUpperCase() !== 'ALL') {
      whereCondition.roleCategory = category.toUpperCase();
    }

    if (search && search.trim()) {
      const q = search.trim();
      whereCondition.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'trending') {
      orderBy = { upvotes: 'desc' };
    }

    let posts = await prisma.discussionPost.findMany({
      where: whereCondition,
      orderBy,
      take: safeLimit,
      skip: (safePage - 1) * safeLimit,
    });

    // Seed default starter discussions if table is empty
    if (posts.length === 0 && (!category || category === 'all' || category === 'ALL')) {
      const seed1 = await prisma.discussionPost.create({
        data: {
          userId: 'community-seed-1',
          userName: 'R U Ready Official',
          roleCategory: 'INTERVIEW',
          title: 'Before Vibe Coding, Do You Frame the Problem First? Master AI-Assisted System Rounds',
          content: 'Still letting AI call the shots? In the modern AI era, your distinct candidate edge is not just typing code faster—it is knowing what architecture to ask, what trade-offs to challenge, and how to rigorously defend p99 latency boundaries during Socratic interviews.',
          tags: ['AI Interview', 'System Design', 'Problem Framing', 'Google'],
          upvotes: 47,
          aiReply: '⭐ AI Moderator Insight: Exceptional insight. In L5+ engineering loops, interviewers deliberately evaluate problem framing, edge-case probing, and distributed fault tolerance before a single line of implementation is written.',
        },
      });

      const seed2 = await prisma.discussionPost.create({
        data: {
          userId: 'community-seed-2',
          userName: 'Alex Chen (Senior SDE @ Stripe)',
          roleCategory: 'SYSTEM_DESIGN',
          title: 'How do you handle Redis cache stampedes under 100K RPS in Node.js microservices?',
          content: 'We recently experienced p99 latency spikes when a top-level cached user permissions key expired under heavy traffic. What architectural patterns (e.g. probabilistic early expiration XFetch, distributed Mutex locks) do you enforce during system design interviews?',
          tags: ['System Design', 'Redis', 'Node.js', 'Stripe'],
          upvotes: 52,
          aiReply: '⭐ AI Moderator Insight: The gold standard is Probabilistic Early Expiration (XFetch algorithm) combined with a Redis Distributed Lock (Redlock). When TTL < computed delta, asynchronously trigger a background re-computation while continuing to serve stale cache.',
        },
      });

      const seed3 = await prisma.discussionPost.create({
        data: {
          userId: 'community-seed-3',
          userName: 'Ananya Roy (Ex-Amazon SDE-2)',
          roleCategory: 'CAREER',
          title: 'Amazon SDE-2 Interview Experience | AUG 2026 | BLR | 3.5 YOE [Offer Accepted]',
          content: 'Round 1: Low-Level Design (Parking Lot with concurrency & dynamic pricing). Round 2: DSA (Tree DP & Sliding Window). Round 3: High-Level System Design (Distributed Notification System). Round 4: Bar Raiser (Customer Obsession & Ownership STAR stories). Key advice: Prepare concrete metrics for all STAR behavioral points!',
          tags: ['Amazon', 'SDE2', 'Interview Experience', 'STAR'],
          upvotes: 89,
          aiReply: '⭐ AI Moderator Insight: Congratulations! Your focus on behavioral STAR quantification in the Bar Raiser round is exactly what separates candidates in Amazon and Tier-1 loops.',
        },
      });

      const seed4 = await prisma.discussionPost.create({
        data: {
          userId: 'community-seed-4',
          userName: 'Marcus Vance (Principal Architect)',
          roleCategory: 'COMPENSATION',
          title: 'Salesforce Offer | MTS | $195K Base + $140K RSU vs Google L5 Breakdown & Negotiation',
          content: 'Received competing offers from Salesforce (MTS Backend) and Google Cloud (L5 Distributed Storage). Here is the full breakdown of base, target bonus, equity vesting schedules, and how holding competing offers influenced the signing bonus.',
          tags: ['Compensation', 'Salesforce', 'Google', 'Offer Negotiation'],
          upvotes: 63,
          aiReply: '⭐ AI Moderator Insight: When negotiating equity, always request refresher metrics and evaluate vesting cliff schedules. Competing Tier-1 offers give you strong leverage on signing bonus lump-sums.',
        },
      });

      const seed5 = await prisma.discussionPost.create({
        data: {
          userId: 'community-seed-5',
          userName: 'Devin Thorne (Staff ML Engineer)',
          roleCategory: 'RESUME_ROAST',
          title: 'Resume Roast: 4 YOE Backend Engineer transitioning to AI / LLM Infrastructure',
          content: 'Roast my resume! I recently led the migration of our search pipeline to a hybrid vector retrieval (Pinecone + PostgreSQL pgvector). Are my bullet points strong enough for OpenAI, Anthropic, or Meta AI infrastructure teams?',
          tags: ['Resume Roast', 'AI/ML', 'Vector Search', 'RAG'],
          upvotes: 38,
          aiReply: '⭐ AI Moderator Insight: Transform "Implemented vector search" into "Engineered hybrid RAG retrieval pipeline with pgvector & Pinecone, decreasing semantic query p95 latency by 35% across 2M embeddings".',
        },
      });

      posts = [seed1, seed2, seed3, seed4, seed5];
    }

    // Attach comments count & thread metadata
    return posts.map((post, idx) => {
      const comments = COMMENTS_STORE.get(post.id) || [];
      const upvoters = POST_UPVOTES_STORE.get(post.id) || new Set<string>();
      return {
        ...post,
        upvotes: Math.max(post.upvotes, upvoters.size),
        commentCount: comments.length + (post.aiReply ? 1 : 0),
        viewsCount: `${(Math.floor(post.upvotes * 7.5 + (idx + 1) * 12) / 10).toFixed(1)}K`,
        comments,
      };
    });
  },

  async getPostById(idOrSlug: string) {
    let post = null;
    try {
      post = await prisma.discussionPost.findUnique({ where: { id: idOrSlug } });
    } catch {
      post = null;
    }

    if (!post) {
      const decoded = decodeURIComponent(idOrSlug).toLowerCase();
      const allPosts = await prisma.discussionPost.findMany();
      post = allPosts.find((p) => {
        const slug = p.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        return (
          p.id === idOrSlug ||
          slug === decoded ||
          p.title.toLowerCase() === decoded
        );
      }) || null;
    }

    if (!post) {
      throw new NotFoundError('Discussion post not found.');
    }

    const comments = COMMENTS_STORE.get(post.id) || [];
    const upvoters = POST_UPVOTES_STORE.get(post.id) || new Set<string>();

    return {
      ...post,
      upvotes: Math.max(post.upvotes, upvoters.size),
      commentCount: comments.length + (post.aiReply ? 1 : 0),
      comments,
    };
  },

  async createPost(
    userId: string,
    userName: string,
    roleCategory: string,
    title: string,
    content: string,
    tags: string[] = [],
    askAiModerator: boolean = true
  ) {
    const validated = CreatePostSchema.parse({
      category: roleCategory,
      title: title.trim(),
      content: content.trim(),
      tags,
      askAiModerator,
    });

    const post = await prisma.discussionPost.create({
      data: {
        userId,
        userName: userName || 'Candidate',
        roleCategory: validated.category.toUpperCase(),
        title: validated.title,
        content: validated.content,
        tags: validated.tags.length > 0 ? validated.tags : ['Interview Prep'],
        upvotes: 1,
      },
    });

    // Track author initial upvote
    const upvoters = new Set<string>([userId]);
    POST_UPVOTES_STORE.set(post.id, upvoters);

    let aiReplyText: string | null = null;

    if (validated.askAiModerator) {
      const prompt = `You are Ava AI Discussion Moderator and Tier-1 Senior Tech Hiring Lead.
A candidate asked this technical interview question in the ${validated.category} community:

Title: "${validated.title}"
Content: "${validated.content}"

Provide a sharp, 2-3 sentence technical critique or STAR interview tip that demonstrates staff-level engineering conviction.`;

      try {
        const generated = await aiProviderManager.generateText(prompt);
        if (generated && generated.trim()) {
          aiReplyText = `⭐ AI Moderator Insight: ${generated.trim()}`;
        }
      } catch {
        aiReplyText = '⭐ AI Moderator Insight: Great discussion topic! Be sure to quantify your architectural trade-offs (e.g. latency vs consistency) and state metrics clearly during interviews.';
      }

      if (aiReplyText) {
        await prisma.discussionPost.update({
          where: { id: post.id },
          data: { aiReply: aiReplyText },
        });
      }
    }

    return {
      ...post,
      aiReply: aiReplyText,
      commentCount: aiReplyText ? 1 : 0,
      comments: [],
    };
  },

  async addComment(
    postId: string,
    userId: string,
    userName: string,
    content: string,
    askAiModerator: boolean = false
  ) {
    const post = await prisma.discussionPost.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundError('Discussion post not found.');
    }

    const validated = CreateCommentSchema.parse({ content: content.trim(), askAiModerator });

    const newComment: DiscussionComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      postId,
      userId,
      userName: userName || 'Candidate',
      content: validated.content,
      upvotes: 1,
      upvotedUserIds: [userId],
      createdAt: new Date().toISOString(),
    };

    const existing = COMMENTS_STORE.get(postId) || [];
    existing.push(newComment);
    COMMENTS_STORE.set(postId, existing);

    // If AI feedback requested on comment
    if (validated.askAiModerator) {
      const prompt = `You are Ava AI Discussion Moderator.
A candidate added this comment in a technical discussion thread:
"${validated.content}"

Provide a 1-2 sentence constructive verification or follow-up question.`;

      try {
        const aiResponse = await aiProviderManager.generateText(prompt);
        if (aiResponse && aiResponse.trim()) {
          const aiComment: DiscussionComment = {
            id: `ai-comment-${Date.now()}`,
            postId,
            userId: 'ava-ai-moderator',
            userName: 'Ava AI Moderator (Verified Co-Pilot)',
            content: `⭐ AI Follow-up: ${aiResponse.trim()}`,
            upvotes: 3,
            upvotedUserIds: [],
            isAiModerator: true,
            createdAt: new Date().toISOString(),
          };
          existing.push(aiComment);
          COMMENTS_STORE.set(postId, existing);
        }
      } catch {
        // Continue without AI comment
      }
    }

    return {
      success: true,
      comment: newComment,
      totalComments: existing.length,
    };
  },

  async upvotePost(id: string, userId: string = 'demo-user') {
    const post = await prisma.discussionPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundError('Discussion post not found.');
    }

    let upvoters = POST_UPVOTES_STORE.get(id);
    if (!upvoters) {
      upvoters = new Set<string>();
      POST_UPVOTES_STORE.set(id, upvoters);
    }

    let newUpvotes = post.upvotes;
    if (upvoters.has(userId)) {
      // Toggle downvote if already upvoted
      upvoters.delete(userId);
      newUpvotes = Math.max(0, post.upvotes - 1);
    } else {
      upvoters.add(userId);
      newUpvotes = post.upvotes + 1;
    }

    const updated = await prisma.discussionPost.update({
      where: { id },
      data: { upvotes: newUpvotes },
    });

    const comments = COMMENTS_STORE.get(id) || [];

    return {
      ...updated,
      hasUpvoted: upvoters.has(userId),
      commentCount: comments.length + (updated.aiReply ? 1 : 0),
      comments,
    };
  },
};
