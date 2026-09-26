// ═══════════════════════════════════════════════════════════════
// RU Ready? — Real-time Matchmaking Queue with Progressive Elo
// ═══════════════════════════════════════════════════════════════

import { v4 as uuidv4 } from 'uuid';
import { CHALLENGE_PROBLEMS, type ChallengeProblemSeed } from '../data/challengeProblems.data.js';

export interface QueuePlayer {
  userId: string;
  userName: string;
  userAvatar?: string;
  userRating: number;
  difficulty: string;
  topic: string;
  language: string;
  socketId: string;
  joinedAt: number;
}

export interface MatchFoundPayload {
  matchId: string;
  problem: ChallengeProblemSeed;
  player1: QueuePlayer;
  player2: QueuePlayer;
  startedAt: number;
  durationSeconds: number;
}

class MatchmakingQueueService {
  private queue: QueuePlayer[] = [];
  private onMatchFoundCallbacks: ((match: MatchFoundPayload) => void)[] = [];

  constructor() {
    // Run matchmaking loop every 1.5 seconds
    setInterval(() => this.processQueue(), 1500);
  }

  public enqueue(player: QueuePlayer): { success: boolean; message: string } {
    // Prevent duplicate entries
    const existingIdx = this.queue.findIndex((p) => p.userId === player.userId);
    if (existingIdx !== -1) {
      this.queue[existingIdx] = { ...player, joinedAt: Date.now() };
      return { success: true, message: 'Queue updated' };
    }

    this.queue.push({
      ...player,
      joinedAt: Date.now(),
      userRating: player.userRating || 1200,
    });

    // Attempt immediate match
    this.processQueue();
    return { success: true, message: 'Joined matchmaking queue' };
  }

  public dequeue(userId: string): boolean {
    const initialLen = this.queue.length;
    this.queue = this.queue.filter((p) => p.userId !== userId);
    return this.queue.length < initialLen;
  }

  public getQueueStatus(userId: string): { inQueue: boolean; waitTimeSec: number; queueSize: number } {
    const player = this.queue.find((p) => p.userId === userId);
    return {
      inQueue: !!player,
      waitTimeSec: player ? Math.floor((Date.now() - player.joinedAt) / 1000) : 0,
      queueSize: this.queue.length,
    };
  }

  public onMatchFound(callback: (match: MatchFoundPayload) => void) {
    this.onMatchFoundCallbacks.push(callback);
  }

  private processQueue() {
    if (this.queue.length < 2) return;

    const matchedIndices = new Set<number>();

    for (let i = 0; i < this.queue.length; i++) {
      if (matchedIndices.has(i)) continue;
      const p1 = this.queue[i];
      const waitSec = (Date.now() - p1.joinedAt) / 1000;

      // Progressive rating range expansion
      let allowedDiff = 100;
      if (waitSec > 5) allowedDiff = 250;
      if (waitSec > 10) allowedDiff = 500;
      if (waitSec > 15) allowedDiff = 1500; // Match any available player

      for (let j = i + 1; j < this.queue.length; j++) {
        if (matchedIndices.has(j)) continue;
        const p2 = this.queue[j];

        // Rating difference check
        const ratingDiff = Math.abs(p1.userRating - p2.userRating);
        if (ratingDiff <= allowedDiff) {
          // Check difficulty compatibility
          const diffMatch =
            p1.difficulty === 'MIXED' ||
            p2.difficulty === 'MIXED' ||
            p1.difficulty === p2.difficulty;

          if (diffMatch || waitSec > 12) {
            matchedIndices.add(i);
            matchedIndices.add(j);

            this.createMatch(p1, p2);
            break;
          }
        }
      }
    }

    // Remove matched players from queue
    if (matchedIndices.size > 0) {
      this.queue = this.queue.filter((_, idx) => !matchedIndices.has(idx));
    }
  }

  private createMatch(p1: QueuePlayer, p2: QueuePlayer) {
    const targetDiff = p1.difficulty !== 'MIXED' ? p1.difficulty : p2.difficulty !== 'MIXED' ? p2.difficulty : 'MEDIUM';
    
    // Pick suitable problem
    const candidateProblems = CHALLENGE_PROBLEMS.filter(
      (prob) => prob.difficulty === targetDiff || targetDiff === 'MIXED'
    );
    const chosenProblem = candidateProblems.length > 0
      ? candidateProblems[Math.floor(Math.random() * candidateProblems.length)]
      : CHALLENGE_PROBLEMS[0];

    const matchId = `match_${uuidv4().replace(/-/g, '').slice(0, 16)}`;

    const matchPayload: MatchFoundPayload = {
      matchId,
      problem: chosenProblem,
      player1: p1,
      player2: p2,
      startedAt: Date.now() + 5000, // 5 second countdown buffer
      durationSeconds: 1200, // 20 minutes
    };

    this.onMatchFoundCallbacks.forEach((cb) => cb(matchPayload));
  }
}

export const matchmakingService = new MatchmakingQueueService();
