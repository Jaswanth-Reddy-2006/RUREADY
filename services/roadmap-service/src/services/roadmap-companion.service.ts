// ═══════════════════════════════════════════════════════════════
// RU Ready? — Interactive AI Learning Companion Engine
// Context-aware Socratic mentor, concept explainer, debug assistant & next action guide
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';

export type CompanionMode =
  | 'EXPLAIN'
  | 'SOCRATIC_HINT'
  | 'DEBUG'
  | 'NEXT_STEP';

export interface CompanionChatInput {
  roadmapId: string;
  nodeId: string;
  userId: string;
  message: string;
  mode?: CompanionMode;
}

export interface CompanionResponse {
  mode: CompanionMode;
  reply: string;
  suggestedPrompts: string[];
  keyConceptSummary?: string;
  recommendedAction?: string;
}

export class RoadmapCompanionService {
  /**
   * Generate interactive pedagogical response from AI Learning Companion
   */
  static async chat(input: CompanionChatInput): Promise<CompanionResponse> {
    const { roadmapId, nodeId, userId, message, mode = 'SOCRATIC_HINT' } = input;

    // 1. Fetch module and learner context
    const [roadmap, node, progress, submissions] = await Promise.all([
      prisma.roadmap.findUnique({
        where: { id: roadmapId },
        select: { id: true, title: true, category: true, difficulty: true },
      }),
      prisma.roadmapNode.findFirst({
        where: { id: nodeId, roadmapId },
      }),
      prisma.roadmapProgress.findUnique({
        where: { nodeId_userId: { nodeId, userId } },
      }),
      (prisma as any).roadmapSubmission.findMany({
        where: { nodeId, userId },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
    ]);

    if (!node) {
      throw new Error(`Module node '${nodeId}' not found`);
    }

    const metadata = (node.metadata as any) || {};
    const objectives = metadata.learningObjectives || metadata.whatYouWillLearn || [];
    const whatToBuild = metadata.whatToBuild || 'Practical implementation';
    const cleanMsg = message.trim().toLowerCase();

    let reply = '';
    let suggestedPrompts: string[] = [];
    let keyConceptSummary = '';
    let recommendedAction = '';

    // 2. Mode-Specific Pedagogical Logic
    if (mode === 'EXPLAIN' || cleanMsg.includes('explain') || cleanMsg.includes('what is') || cleanMsg.includes('how does')) {
      keyConceptSummary = `${node.title}: Core architectural foundations and runtime behavior.`;
      reply = `In **${node.title}**, the central idea is decoupling systems so that each layer can fail or scale independently.\n\n` +
        `**Key Mental Model:**\n` +
        `1. **The Problem:** Naive implementations block execution threads or overwhelm databases when concurrency surges.\n` +
        `2. **The Mechanism:** By utilizing ${objectives[0] || 'proper indexing and non-blocking I/O'}, systems isolate resources and keep latency under predictable p99 thresholds.\n` +
        `3. **Why It Matters:** When traffic spikes 10x, well-architected systems degrade gracefully rather than suffering cascading service failure.`;

      suggestedPrompts = [
        'How does this fail in production?',
        'Give me a Socratic hint for the hands-on task',
        'What should I build to test this?',
      ];
      recommendedAction = `Review the documentation for "${objectives[0] || node.title}" and start your practical task.`;
    } else if (mode === 'DEBUG' || cleanMsg.includes('error') || cleanMsg.includes('bug') || cleanMsg.includes('fail') || cleanMsg.includes('stuck')) {
      reply = `Let's isolate the root cause systematically without guessing.\n\n` +
        `**Diagnostic Checklist for ${node.title}:**\n` +
        `1. **State & Connections:** Are your database connection pools, Redis clients, or Kafka consumers leaking handles or reaching max limits?\n` +
        `2. **Concurrency & Race Conditions:** If queries return stale data or time out, inspect whether locks are acquired in consistent order to prevent deadlocks.\n` +
        `3. **Execution Plan:** If slow query latency is the issue, run \`EXPLAIN (ANALYZE, BUFFERS)\` to verify whether an index is being used instead of a table scan.\n\n` +
        `*What specific error message or log line are you seeing? Share the output and we'll dissect it.*`;

      suggestedPrompts = [
        'How do I inspect thread dumps or query plans?',
        'Show me common edge cases for this module',
        'Help me structure my unit tests',
      ];
      recommendedAction = 'Check server logs for connection timeouts or unhandled promise rejections.';
    } else if (mode === 'NEXT_STEP' || cleanMsg.includes('what next') || cleanMsg.includes('where do i start') || cleanMsg.includes('roadmap')) {
      const isComplete = progress?.percent === 100;
      const isMastered = progress?.masteryStatus === 'MASTERED' || progress?.masteryStatus === 'ASSESSMENT_PASSED';

      if (isMastered) {
        reply = `You have already demonstrated verified mastery of **${node.title}**! Your next best move is to proceed to the next module in your curriculum to maintain continuous momentum.`;
        recommendedAction = 'Advance to the next curriculum milestone.';
      } else if (isComplete && !isMastered) {
        reply = `You have marked learning complete for **${node.title}**, but haven't defended your competencies yet.\n\n` +
          `**Your Immediate Next Action:**\n` +
          `• Click **Verify Skills with AI** or submit your deliverable for: *"${whatToBuild}"*.\n` +
          `• Passing this verification will upgrade your status to **Verified Mastery** on your public record.`;
        recommendedAction = 'Take the AI Socratic assessment or submit your repository.';
      } else {
        reply = `You are currently working on **${node.title}**.\n\n` +
          `**Clear Next Action:**\n` +
          `1. Build the milestone deliverable: *${whatToBuild}*\n` +
          `2. Document your key design decisions in the Mission tab\n` +
          `3. Submit your GitHub repository URL for automated rubric evaluation.`;
        recommendedAction = `Implement "${whatToBuild}" and submit evidence.`;
      }

      suggestedPrompts = [
        'Explain the deliverable requirements',
        'Give me starter architecture suggestions',
        'Take me to the AI verification quiz',
      ];
    } else {
      // Default: Socratic Hint mode (Guiding questions without spoiling)
      reply = `Great question regarding **${node.title}**!\n\n` +
        `Before writing code, consider this question: *If two concurrent requests attempt to modify the same resource at the exact same millisecond, what guarantees prevent one from overwriting the other?*\n\n` +
        `**Guiding Clue:**\n` +
        `Think about whether you want **Optimistic Concurrency Control** (version checking) or **Pessimistic Locking** (row locks). Which one scales better for mostly-read workloads?`;

      suggestedPrompts = [
        'Explain optimistic vs pessimistic locking',
        'How do I test concurrent requests with autocannon?',
        'Give me the next Socratic hint',
      ];
      recommendedAction = 'Think through the concurrency trade-off and draft your implementation.';
    }

    return {
      mode,
      reply,
      suggestedPrompts,
      keyConceptSummary,
      recommendedAction,
    };
  }
}
