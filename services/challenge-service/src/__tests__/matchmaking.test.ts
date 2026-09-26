// ═══════════════════════════════════════════════════════════════
// RU Ready? — Automated Unit Tests: Matchmaking Queue
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { matchmakingService } from '../services/matchmaking.service.js';

describe('Matchmaking Queue Service', () => {
  it('enqueues a player and prevents duplicate entries', () => {
    const p1 = {
      userId: 'test_usr_1',
      userName: 'Alice',
      userRating: 1400,
      difficulty: 'MEDIUM',
      topic: 'DSA',
      language: 'javascript',
      socketId: 'sock_1',
      joinedAt: Date.now(),
    };

    const res1 = matchmakingService.enqueue(p1);
    expect(res1.success).toBe(true);

    const status1 = matchmakingService.getQueueStatus('test_usr_1');
    expect(status1.inQueue).toBe(true);

    // Enqueueing again updates existing entry
    const res2 = matchmakingService.enqueue(p1);
    expect(res2.success).toBe(true);

    // Dequeue cleans up
    matchmakingService.dequeue('test_usr_1');
    const status2 = matchmakingService.getQueueStatus('test_usr_1');
    expect(status2.inQueue).toBe(false);
  });
});
