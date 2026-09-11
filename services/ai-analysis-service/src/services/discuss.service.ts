// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — Role Discussion & Community Hub Service
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import { aiProviderManager } from '../lib/ai-provider-manager.js';
import { NotFoundError, BadRequestError } from '../lib/errors.js';

export const discussService = {
  async getPostsByCategory(category?: string) {
    const whereCondition = category && category !== 'ALL' ? { roleCategory: category.toUpperCase() } : {};
    
    let posts = await prisma.discussionPost.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (posts.length === 0 && (!category || category === 'ALL' || category === 'FULLSTACK')) {
      // Seed initial community discussion threads
      const seed = await prisma.discussionPost.create({
        data: {
          userId: 'community-seed-1',
          userName: 'Alex Chen (Senior Lead)',
          roleCategory: 'FULLSTACK',
          title: 'How do you handle Redis cache stampedes in high-throughput Node.js microservices?',
          content: 'We recently experienced p99 latency spikes when a top-level cached user permissions key expired. What architectural patterns (e.g. probabilistic early expiration, distributed Mutex locks) do you enforce during system design interviews?',
          tags: ['System Design', 'Redis', 'Node.js', 'Caching'],
          upvotes: 14,
          aiReply: '⭐ AI Moderator Co-Pilot Insight: A proven industry approach is Probabilistic Early Expiration (XFetch algorithm) combined with a Redis Distributed Lock (Redlock). When a request detects key TTL < threshold, it asynchronously triggers a background refresh while serving stale cache, avoiding cascading DB load.',
        },
      });
      posts = [seed];
    }

    return posts;
  },

  async createPost(
    userId: string,
    userName: string,
    roleCategory: string,
    title: string,
    content: string,
    tags: string[] = []
  ) {
    if (!title || !title.trim()) {
      throw new BadRequestError('Post title is required.');
    }
    if (!content || !content.trim()) {
      throw new BadRequestError('Post content is required.');
    }

    // Step 1: Create initial post
    const post = await prisma.discussionPost.create({
      data: {
        userId,
        userName: userName || 'Candidate',
        roleCategory: roleCategory.toUpperCase(),
        title,
        content,
        tags: tags.length > 0 ? tags : ['Interview Prep'],
        upvotes: 1,
      },
    });

    // Step 2: Trigger AI Moderator Co-Pilot response
    const prompt = `You are Ava AI Discussion Moderator & Senior Engineering Lead.
A candidate posted this technical question / STAR interview experience in the community thread for ${roleCategory}:

Title: "${title}"
Content: "${content}"

Provide a concise 2-3 sentence technical critique, architectural tip, or STAR methodology suggestion to help the candidate excel.`;

    let aiReplyText = '⭐ AI Moderator Co-Pilot Insight: Great candidate topic! Be sure to quantify your business impact (e.g. latency reduction %, throughput QPS) and explain trade-offs when discussing this approach in live technical interviews.';

    try {
      const generated = await aiProviderManager.generateText(prompt);
      if (generated && generated.trim()) {
        aiReplyText = `⭐ AI Moderator Co-Pilot Insight: ${generated.trim()}`;
      }
    } catch {
      // Use fallback
    }

    const updatedPost = await prisma.discussionPost.update({
      where: { id: post.id },
      data: { aiReply: aiReplyText },
    });

    return updatedPost;
  },

  async upvotePost(id: string) {
    const post = await prisma.discussionPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundError('Discussion post not found.');
    }

    return prisma.discussionPost.update({
      where: { id },
      data: { upvotes: post.upvotes + 1 },
    });
  },
};
