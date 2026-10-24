// ═══════════════════════════════════════════════════════════════
// RU Ready? — Automated End-to-End Suite: 28-DSA-1v1-Challenge-Overhaul
// Comprehensive Testing: Matchmaking, Concurrency, Invitations, Sandbox, Elo & History
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach } from 'vitest';
import { matchmakingService } from '../../../services/challenge-service/src/services/matchmaking.service.js';
import { challengeService } from '../../../services/challenge-service/src/services/challenge.service.js';
import { sandboxService } from '../../../services/challenge-service/src/services/sandbox.service.js';
import { CHALLENGE_PROBLEMS } from '../../../services/challenge-service/src/data/challengeProblems.data.js';

describe('28 — DSA 1v1 Challenge Overhaul: End-to-End Engine Verification', { timeout: 15000 }, () => {
  beforeEach(() => {
    matchmakingService.clearQueue();
  });

  // ─────────────────────────────────────────────────────────────
  // 1. Matchmaking Engine & Self-Match Prevention
  // ─────────────────────────────────────────────────────────────
  describe('Matchmaking Engine', () => {
    it('enqueues authenticated player and reports truthful queue status', () => {
      const player1 = {
        userId: 'usr_alice_01',
        userName: 'Alice',
        userRating: 1400,
        difficulty: 'MEDIUM',
        topic: 'DSA',
        language: 'javascript',
        socketId: 'sock_alice',
        joinedAt: Date.now(),
      };

      const res = matchmakingService.enqueue(player1);
      expect(res.success).toBe(true);

      const status = matchmakingService.getQueueStatus('usr_alice_01');
      expect(status.inQueue).toBe(true);
      expect(status.queueSize).toBe(1);
      expect(status.difficulty).toBe('MEDIUM');
    });

    it('strictly prevents self-matchmaking when same user enters multiple times', () => {
      let matchCreated = false;
      const callback = () => {
        matchCreated = true;
      };
      matchmakingService.onMatchFound(callback);

      // Alice joins with socket 1
      matchmakingService.enqueue({
        userId: 'usr_alice_solo',
        userName: 'Alice',
        userRating: 1400,
        difficulty: 'MEDIUM',
        topic: 'DSA',
        language: 'javascript',
        socketId: 'sock_alice_1',
        joinedAt: Date.now(),
      });

      // Alice tries to join again with socket 2
      matchmakingService.enqueue({
        userId: 'usr_alice_solo',
        userName: 'Alice',
        userRating: 1400,
        difficulty: 'MEDIUM',
        topic: 'DSA',
        language: 'javascript',
        socketId: 'sock_alice_2',
        joinedAt: Date.now(),
      });

      matchmakingService.processQueue();

      // Alice should never be matched with herself
      expect(matchCreated).toBe(false);
      const status = matchmakingService.getQueueStatus('usr_alice_solo');
      expect(status.queueSize).toBe(1);
    });

    it('matches two compatible different players atomically', () => {
      let matchedData: any = null;
      matchmakingService.onMatchFound((payload) => {
        matchedData = payload;
      });

      matchmakingService.enqueue({
        userId: 'usr_p1_duel',
        userName: 'Player One',
        userRating: 1300,
        difficulty: 'MEDIUM',
        topic: 'DSA',
        language: 'javascript',
        socketId: 'sock_p1',
        joinedAt: Date.now(),
      });

      matchmakingService.enqueue({
        userId: 'usr_p2_duel',
        userName: 'Player Two',
        userRating: 1320,
        difficulty: 'MEDIUM',
        topic: 'DSA',
        language: 'javascript',
        socketId: 'sock_p2',
        joinedAt: Date.now(),
      });

      matchmakingService.processQueue();

      expect(matchedData).not.toBeNull();
      expect(matchedData.player1.userId).toBe('usr_p1_duel');
      expect(matchedData.player2.userId).toBe('usr_p2_duel');
      expect(matchedData.matchId).toMatch(/^match_/);
      expect(matchedData.problem).toBeDefined();
    });

    it('dequeues a player cleanly when requested or abandoned', () => {
      matchmakingService.enqueue({
        userId: 'usr_abandon',
        userName: 'Ghost',
        userRating: 1200,
        difficulty: 'EASY',
        topic: 'DSA',
        language: 'all',
        socketId: 'sock_ghost',
        joinedAt: Date.now(),
      });

      expect(matchmakingService.getQueueStatus('usr_abandon').inQueue).toBe(true);

      const dequeued = matchmakingService.dequeue('usr_abandon');
      expect(dequeued).toBe(true);
      expect(matchmakingService.getQueueStatus('usr_abandon').inQueue).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Direct Friend Challenge & Invitation Flow
  // ─────────────────────────────────────────────────────────────
  describe('Direct Friend Challenge Workflow', () => {
    it('disallows challenging oneself', async () => {
      await expect(
        challengeService.createInvitation({
          fromUserId: 'usr_same',
          fromUserName: 'Same User',
          toUserId: 'usr_same',
          toUserName: 'Same User',
          difficulty: 'MEDIUM',
        })
      ).rejects.toThrow('You cannot challenge yourself');
    });

    it('creates pending invitation and retrieves it for recipient', async () => {
      const inv = await challengeService.createInvitation({
        fromUserId: 'usr_sender_101',
        fromUserName: 'Ada Lovelace',
        toUserId: 'usr_recipient_202',
        toUserName: 'Alan Turing',
        difficulty: 'HARD',
        topic: 'DSA',
      });

      expect(inv.id).toMatch(/^inv_/);
      expect(inv.status).toBe('PENDING');
      expect(inv.fromUserName).toBe('Ada Lovelace');
      expect(inv.difficulty).toBe('HARD');

      const pending = challengeService.getPendingInvitations('usr_recipient_202');
      expect(pending.length).toBeGreaterThanOrEqual(1);
      const found = pending.find((item) => item.id === inv.id);
      expect(found).toBeDefined();
      expect(found?.fromUserId).toBe('usr_sender_101');
    });

    it('prevents duplicate pending invitations between the same users', async () => {
      const inv1 = await challengeService.createInvitation({
        fromUserId: 'usr_dup_sender',
        fromUserName: 'Alice',
        toUserId: 'usr_dup_target',
        toUserName: 'Bob',
      });

      const inv2 = await challengeService.createInvitation({
        fromUserId: 'usr_dup_sender',
        fromUserName: 'Alice',
        toUserId: 'usr_dup_target',
        toUserName: 'Bob',
      });

      expect(inv1.id).toBe(inv2.id);
    });

    it('handles decline of invitation properly', async () => {
      const inv = await challengeService.createInvitation({
        fromUserId: 'usr_dec_sender',
        fromUserName: 'Alice',
        toUserId: 'usr_dec_target',
        toUserName: 'Bob',
      });

      const declined = challengeService.declineInvitation(inv.id, 'usr_dec_target');
      expect(declined.status).toBe('DECLINED');

      const pendingAfter = challengeService.getPendingInvitations('usr_dec_target');
      expect(pendingAfter.find((item) => item.id === inv.id)).toBeUndefined();
    });

    it('transitions both players into an active match upon acceptance', async () => {
      const inv = await challengeService.createInvitation({
        fromUserId: 'usr_acc_sender',
        fromUserName: 'Grace Hopper',
        toUserId: 'usr_acc_target',
        toUserName: 'Claude Shannon',
        difficulty: 'MEDIUM',
      });

      const acceptedResult = await challengeService.acceptInvitation({
        invitationId: inv.id,
        userId: 'usr_acc_target',
        userName: 'Claude Shannon',
      });

      expect(acceptedResult.invitation.status).toBe('ACCEPTED');
      expect(acceptedResult.invitation.matchId).toBeDefined();

      const match = acceptedResult.match;
      expect(match.status).toBe('IN_PROGRESS');
      expect(match.participants['usr_acc_sender']).toBeDefined();
      expect(match.participants['usr_acc_target']).toBeDefined();
      expect(match.problem).toBeDefined();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Sandbox Code Execution & Hidden Test Suites
  // ─────────────────────────────────────────────────────────────
  describe('Sandbox Execution Engine', () => {
    it('evaluates sample tests for Two Sum correctly', async () => {
      const validTwoSumJs = `
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
`;
      const sampleRes = await challengeService.runSampleTests({
        problemId: 'two-sum',
        code: validTwoSumJs,
        language: 'javascript',
      });

      expect(sampleRes.passed).toBe(sampleRes.total);
      expect(sampleRes.results.length).toBeGreaterThan(0);
      expect(sampleRes.results[0].passed).toBe(true);
    });

    it('reports failure when code produces wrong answer without crashing', async () => {
      const buggyJs = `
function twoSum(nums, target) {
  return [0, 0];
}
`;
      const sampleRes = await challengeService.runSampleTests({
        problemId: 'two-sum',
        code: buggyJs,
        language: 'javascript',
      });

      expect(sampleRes.passed).toBe(0);
      expect(sampleRes.results[0].passed).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Atomic Concurrency & Winner Determination
  // ─────────────────────────────────────────────────────────────
  describe('Atomic Submission & Elo Resolution', () => {
    it('safely resolves simultaneous solves: first solver wins, second cannot overwrite', async () => {
      const twoSumProblem = CHALLENGE_PROBLEMS.find((p) => p.id === 'two-sum') || CHALLENGE_PROBLEMS[0];
      const matchId = `match_concurrency_${Date.now()}`;

      const directMatch = challengeService.createDirectMatch({
        matchId,
        problem: twoSumProblem,
        player1: {
          userId: 'usr_racer_1',
          userName: 'Racer Fast',
          userRating: 1400,
        },
        player2: {
          userId: 'usr_racer_2',
          userName: 'Racer Slow',
          userRating: 1400,
        },
        durationSeconds: 1200,
        matchType: 'RANKED_1V1',
      });

      const validSolution = `
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
`;

      // Player 1 submits first and passes 100%
      const res1 = await challengeService.submitSolution({
        matchId,
        userId: 'usr_racer_1',
        userName: 'Racer Fast',
        code: validSolution,
        language: 'javascript',
      });

      expect(res1.isWinner).toBe(true);
      expect(res1.match.status).toBe('COMPLETED');
      expect(res1.match.winnerId).toBe('usr_racer_1');

      // Player 2 submits valid code shortly after or concurrently
      // Because match is already completed with Player 1 as winner, Player 2 is marked LOST
      const res2 = await challengeService.submitSolution({
        matchId,
        userId: 'usr_racer_2',
        userName: 'Racer Slow',
        code: validSolution,
        language: 'javascript',
      }).catch((err) => ({ error: err.message }));

      // Either caught as completed or marked as non-winner
      if ('error' in res2) {
        expect(res2.error).toContain('completed');
      } else {
        expect(res2.isWinner).toBe(false);
      }

      // Final winner must remain Player 1
      const finalizedMatch = challengeService.getMatch(matchId);
      expect(finalizedMatch?.winnerId).toBe('usr_racer_1');

      // Verify Elo: Player 1 gained rating, Player 2 lost rating
      expect(finalizedMatch?.participants['usr_racer_1'].ratingAfter).toBeGreaterThan(1400);
      expect(finalizedMatch?.participants['usr_racer_2'].ratingAfter).toBeLessThan(1400);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 5. Forfeit Flow & Authoritative Resolution
  // ─────────────────────────────────────────────────────────────
  describe('Forfeit Mechanism', () => {
    it('awards immediate victory to opponent when participant forfeits', async () => {
      const problem = CHALLENGE_PROBLEMS[0];
      const matchId = `match_forfeit_${Date.now()}`;

      challengeService.createDirectMatch({
        matchId,
        problem,
        player1: {
          userId: 'usr_surrender',
          userName: 'GiveUp Guy',
          userRating: 1300,
        },
        player2: {
          userId: 'usr_victor',
          userName: 'Steady Victor',
          userRating: 1300,
        },
        durationSeconds: 1200,
        matchType: 'RANKED_1V1',
      });

      const completedMatch = await challengeService.forfeitMatch(matchId, 'usr_surrender');

      expect(completedMatch.status).toBe('COMPLETED');
      expect(completedMatch.winnerId).toBe('usr_victor');
      expect(completedMatch.participants['usr_surrender'].status).toBe('LOST');
      expect(completedMatch.participants['usr_victor'].status).toBe('WON');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 6. Persisted Match History Truthfulness
  // ─────────────────────────────────────────────────────────────
  describe('Match History Truthfulness', () => {
    it('retrieves accurate match history without fabricated or dummy opponents', async () => {
      const problem = CHALLENGE_PROBLEMS[0];
      const matchId = `match_history_audit_${Date.now()}`;

      const match = challengeService.createDirectMatch({
        matchId,
        problem,
        player1: {
          userId: 'usr_real_player',
          userName: 'Real Player',
          userRating: 1250,
        },
        player2: {
          userId: 'usr_real_opponent',
          userName: 'Opponent Master',
          userRating: 1280,
        },
        durationSeconds: 1200,
        matchType: 'RANKED_1V1',
      });

      await challengeService.finalizeMatch(match, 'usr_real_player');

      const history = await challengeService.getUserMatchHistory('usr_real_player');
      expect(history.length).toBeGreaterThan(0);

      const recentDuel = history.find((h: any) => h.matchId === matchId);
      expect(recentDuel).toBeDefined();
      expect(recentDuel?.result).toBe('WIN');
      expect(recentDuel?.opponent?.userId).toBe('usr_real_opponent');
      expect(recentDuel?.opponent?.userName).toBe('Opponent Master');
      expect(recentDuel?.problemTitle).toBe(problem.title);
      expect(recentDuel?.ratingAfter).toBeGreaterThanOrEqual(1250);
    });
  });
});
