// ═══════════════════════════════════════════════════════════════
// RU Ready? — Production Challenge Service (Authoritative State & DB Persistence)
// ═══════════════════════════════════════════════════════════════

import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma.js';
import { CHALLENGE_PROBLEMS, type ChallengeProblemSeed } from '../data/challengeProblems.data.js';
import { QUIZ_QUESTIONS_BANK, type QuizQuestionSeed } from '../data/quizQuestions.data.js';
import { sandboxService, type EvaluationResult } from './sandbox.service.js';

export interface RoomParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  isHost: boolean;
  isReady: boolean;
  joinedAt: number;
  socketId?: string;
}

export interface ChallengeRoomState {
  id: string;
  roomCode: string;
  title: string;
  type: 'BATTLE_1V1' | 'CONTEST' | 'QUIZ';
  visibility: 'PUBLIC' | 'PRIVATE';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED';
  topic: string;
  language: string;
  maxParticipants: number;
  durationMinutes: number;
  status: 'WAITING' | 'COUNTDOWN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  hostName?: string;
  createdAt: number;
  startedAt?: number;
  participants: RoomParticipant[];
  problem?: ChallengeProblemSeed;
  activeMatchId?: string;
}

export interface MatchParticipantState {
  userId: string;
  userName: string;
  userAvatar?: string;
  ratingBefore: number;
  ratingAfter: number;
  score: number;
  passedTests: number;
  totalTests: number;
  timeTakenSec: number;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'WON' | 'LOST' | 'TIED' | 'DISCONNECTED';
  xpAwarded: number;
  code?: string;
  language?: string;
}

export interface MatchSessionState {
  id: string;
  roomId?: string;
  matchType: 'RANKED_1V1' | 'CASUAL_1V1' | 'CONTEST';
  difficulty: string;
  topic: string;
  problem: ChallengeProblemSeed;
  status: 'COUNTDOWN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt: number;
  endsAt: number;
  winnerId?: string;
  participants: Record<string, MatchParticipantState>;
  submissions: Array<{
    id: string;
    userId: string;
    userName: string;
    language: string;
    passed: number;
    total: number;
    execTimeMs: number;
    isAllPassed: boolean;
    submittedAt: number;
  }>;
}

export interface QuizParticipantState {
  userId: string;
  userName: string;
  userAvatar?: string;
  score: number;
  correctAnswers: number;
  streak: number;
  lastAnswerTimeMs: number;
  answers: Record<string, { selectedIndex: number; isCorrect: boolean; timeTakenMs: number; points: number }>;
}

export interface QuizSessionState {
  id: string;
  sessionCode: string;
  title: string;
  category: string;
  difficulty: string;
  status: 'LOBBY' | 'QUESTION_ACTIVE' | 'ANSWER_REVEAL' | 'COMPLETED';
  currentQuestionIndex: number;
  totalQuestions: number;
  timePerQuestionSec: number;
  questionStartedAt?: number;
  questions: QuizQuestionSeed[];
  participants: Record<string, QuizParticipantState>;
  createdBy: string;
  createdAt: number;
}

export interface RatingData {
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  tier: string;
  battlesTotal: number;
  battlesWon: number;
  winRate: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
}

class ChallengeService {
  private activeRooms: Map<string, ChallengeRoomState> = new Map();
  private codeToRoomId: Map<string, string> = new Map();
  private activeMatches: Map<string, MatchSessionState> = new Map();
  private activeQuizzes: Map<string, QuizSessionState> = new Map();
  private codeToQuizId: Map<string, string> = new Map();
  private ratingsCache: Map<string, RatingData> = new Map();

  // ═══════════════════════════════════════════════════════════════
  // 1. Authoritative Rating & Elo Calculation (K=32, Base 1200)
  // ═══════════════════════════════════════════════════════════════

  public getRankTier(rating: number): string {
    if (rating >= 1850) return 'GRANDMASTER';
    if (rating >= 1700) return 'DIAMOND';
    if (rating >= 1550) return 'PLATINUM';
    if (rating >= 1400) return 'GOLD';
    if (rating >= 1250) return 'SILVER';
    return 'BRONZE';
  }

  public calculateElo(ratingA: number, ratingB: number, scoreA: number, kFactor = 32): { newRatingA: number; newRatingB: number; deltaA: number; deltaB: number } {
    const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    const expectedB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400));
    const scoreB = 1 - scoreA;

    const deltaA = Math.round(kFactor * (scoreA - expectedA));
    const deltaB = Math.round(kFactor * (scoreB - expectedB));

    return {
      newRatingA: Math.max(800, ratingA + deltaA),
      newRatingB: Math.max(800, ratingB + deltaB),
      deltaA,
      deltaB,
    };
  }

  public async getUserRating(userId: string, userName?: string, userAvatar?: string): Promise<RatingData> {
    if (this.ratingsCache.has(userId)) {
      return this.ratingsCache.get(userId)!;
    }

    try {
      const dbRating = await prisma.challengeRating.findUnique({
        where: { userId },
      });

      if (dbRating) {
        const ratingData: RatingData = {
          userId: dbRating.userId,
          userName: dbRating.userName || userName || 'Challenger',
          userAvatar: dbRating.userAvatar || userAvatar,
          rating: dbRating.rating,
          tier: dbRating.tier || this.getRankTier(dbRating.rating),
          battlesTotal: dbRating.battlesTotal,
          battlesWon: dbRating.battlesWon,
          winRate: dbRating.winRate || (dbRating.battlesTotal > 0 ? Math.round((dbRating.battlesWon / dbRating.battlesTotal) * 100) : 0),
          currentStreak: dbRating.currentStreak,
          longestStreak: dbRating.longestStreak,
          totalXP: dbRating.totalXP,
        };
        this.ratingsCache.set(userId, ratingData);
        return ratingData;
      }
    } catch (err) {
      console.warn('[Challenge Service] DB rating lookup fallback:', err);
    }

    // Default provisional profile for new players
    const defaultData: RatingData = {
      userId,
      userName: userName || 'Challenger',
      userAvatar,
      rating: 1200,
      tier: 'BRONZE',
      battlesTotal: 0,
      battlesWon: 0,
      winRate: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalXP: 0,
    };

    this.ratingsCache.set(userId, defaultData);
    return defaultData;
  }

  public async updateUserRatingInDb(data: RatingData) {
    this.ratingsCache.set(data.userId, data);
    try {
      await prisma.challengeRating.upsert({
        where: { userId: data.userId },
        create: {
          userId: data.userId,
          userName: data.userName,
          userAvatar: data.userAvatar,
          rating: data.rating,
          tier: data.tier,
          battlesTotal: data.battlesTotal,
          battlesWon: data.battlesWon,
          winRate: data.winRate,
          currentStreak: data.currentStreak,
          longestStreak: data.longestStreak,
          totalXP: data.totalXP,
        },
        update: {
          userName: data.userName,
          userAvatar: data.userAvatar,
          rating: data.rating,
          tier: data.tier,
          battlesTotal: data.battlesTotal,
          battlesWon: data.battlesWon,
          winRate: data.winRate,
          currentStreak: data.currentStreak,
          longestStreak: data.longestStreak,
          totalXP: data.totalXP,
        },
      });
    } catch (err) {
      console.warn('[Challenge Service] Rating persist warning:', err);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. Room Lifecycle & Management
  // ═══════════════════════════════════════════════════════════════

  public generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  public async createRoom(params: {
    hostId: string;
    hostName: string;
    hostAvatar?: string;
    title: string;
    type?: 'BATTLE_1V1' | 'CONTEST' | 'QUIZ';
    visibility?: 'PUBLIC' | 'PRIVATE';
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED';
    topic?: string;
    language?: string;
    maxParticipants?: number;
    durationMinutes?: number;
  }): Promise<ChallengeRoomState> {
    const roomId = `room_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    let roomCode = this.generateRoomCode();
    while (this.codeToRoomId.has(roomCode)) {
      roomCode = this.generateRoomCode();
    }

    const hostRatingData = await this.getUserRating(params.hostId, params.hostName, params.hostAvatar);

    const room: ChallengeRoomState = {
      id: roomId,
      roomCode,
      title: params.title || `${params.hostName}'s Arena`,
      type: params.type || 'BATTLE_1V1',
      visibility: params.visibility || 'PUBLIC',
      difficulty: params.difficulty || 'MEDIUM',
      topic: params.topic || 'DSA',
      language: params.language || 'all',
      maxParticipants: params.maxParticipants || (params.type === 'BATTLE_1V1' ? 2 : 10),
      durationMinutes: params.durationMinutes || 30,
      status: 'WAITING',
      createdBy: params.hostId,
      hostName: params.hostName,
      createdAt: Date.now(),
      participants: [
        {
          userId: params.hostId,
          userName: params.hostName,
          userAvatar: params.hostAvatar,
          rating: hostRatingData.rating,
          isHost: true,
          isReady: true,
          joinedAt: Date.now(),
        },
      ],
    };

    this.activeRooms.set(roomId, room);
    this.codeToRoomId.set(roomCode, roomId);

    // Asynchronously create room in PostgreSQL
    prisma.challengeRoom.create({
      data: {
        id: roomId,
        roomCode,
        title: room.title,
        type: room.type,
        visibility: room.visibility,
        difficulty: room.difficulty,
        topic: room.topic,
        language: room.language,
        maxParticipants: room.maxParticipants,
        durationMinutes: room.durationMinutes,
        status: 'WAITING',
        createdBy: params.hostId,
        hostName: params.hostName,
        participants: {
          create: {
            userId: params.hostId,
            userName: params.hostName,
            userAvatar: params.hostAvatar,
            userRating: hostRatingData.rating,
            isHost: true,
            isReady: true,
          },
        },
      },
    }).catch((e) => console.warn('[Challenge Service] Room DB create fallback:', e));

    return room;
  }

  public getRoom(roomIdOrCode: string): ChallengeRoomState | null {
    if (this.activeRooms.has(roomIdOrCode)) {
      return this.activeRooms.get(roomIdOrCode)!;
    }
    const mappedId = this.codeToRoomId.get(roomIdOrCode.toUpperCase());
    if (mappedId && this.activeRooms.has(mappedId)) {
      return this.activeRooms.get(mappedId)!;
    }
    return null;
  }

  public listPublicRooms(): ChallengeRoomState[] {
    return Array.from(this.activeRooms.values()).filter(
      (r) => r.visibility === 'PUBLIC' && (r.status === 'WAITING' || r.status === 'COUNTDOWN')
    );
  }

  public async joinRoom(params: {
    roomCodeOrId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    socketId?: string;
  }): Promise<{ success: boolean; room?: ChallengeRoomState; error?: string }> {
    const room = this.getRoom(params.roomCodeOrId);
    if (!room) {
      return { success: false, error: 'Challenge room not found or expired' };
    }

    if (room.status !== 'WAITING' && room.status !== 'COUNTDOWN') {
      const existing = room.participants.find((p) => p.userId === params.userId);
      if (existing) {
        existing.socketId = params.socketId;
        return { success: true, room };
      }
      return { success: false, error: 'Match has already started' };
    }

    const existingIdx = room.participants.findIndex((p) => p.userId === params.userId);
    const userRatingData = await this.getUserRating(params.userId, params.userName, params.userAvatar);

    if (existingIdx !== -1) {
      room.participants[existingIdx].socketId = params.socketId;
      return { success: true, room };
    }

    if (room.participants.length >= room.maxParticipants) {
      return { success: false, error: 'Room is full' };
    }

    room.participants.push({
      userId: params.userId,
      userName: params.userName,
      userAvatar: params.userAvatar,
      rating: userRatingData.rating,
      isHost: false,
      isReady: false,
      joinedAt: Date.now(),
      socketId: params.socketId,
    });

    // Update DB record
    prisma.challengeParticipant.upsert({
      where: { roomId_userId: { roomId: room.id, userId: params.userId } },
      create: {
        roomId: room.id,
        userId: params.userId,
        userName: params.userName,
        userAvatar: params.userAvatar,
        userRating: userRatingData.rating,
        isHost: false,
        isReady: false,
      },
      update: {
        userName: params.userName,
        userAvatar: params.userAvatar,
        userRating: userRatingData.rating,
      },
    }).catch(() => {});

    return { success: true, room };
  }

  public toggleReady(roomId: string, userId: string, isReady?: boolean): ChallengeRoomState | null {
    const room = this.getRoom(roomId);
    if (!room) return null;
    const participant = room.participants.find((p) => p.userId === userId);
    if (participant) {
      participant.isReady = isReady !== undefined ? isReady : !participant.isReady;
    }
    return room;
  }

  public leaveRoom(roomId: string, userId: string): { room: ChallengeRoomState | null; destroyed: boolean } {
    const room = this.getRoom(roomId);
    if (!room) return { room: null, destroyed: false };

    room.participants = room.participants.filter((p) => p.userId !== userId);

    if (room.participants.length === 0) {
      this.activeRooms.delete(room.id);
      this.codeToRoomId.delete(room.roomCode);
      return { room: null, destroyed: true };
    }

    if (room.createdBy === userId && room.participants.length > 0) {
      room.participants[0].isHost = true;
      room.participants[0].isReady = true;
      room.createdBy = room.participants[0].userId;
      room.hostName = room.participants[0].userName;
    }

    return { room, destroyed: false };
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. Match Creation, Execution & Server-Authoritative Scorer
  // ═══════════════════════════════════════════════════════════════

  public createMatchFromRoom(room: ChallengeRoomState): MatchSessionState {
    const targetDiff = room.difficulty;
    const candidateProblems = CHALLENGE_PROBLEMS.filter(
      (prob) => prob.difficulty === targetDiff || targetDiff === 'MIXED'
    );
    const chosenProblem = candidateProblems.length > 0
      ? candidateProblems[Math.floor(Math.random() * candidateProblems.length)]
      : CHALLENGE_PROBLEMS[0];

    const matchId = `match_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    const durationSec = room.durationMinutes * 60;
    const now = Date.now();

    const participantsMap: Record<string, MatchParticipantState> = {};
    for (const p of room.participants) {
      participantsMap[p.userId] = {
        userId: p.userId,
        userName: p.userName,
        userAvatar: p.userAvatar,
        ratingBefore: p.rating,
        ratingAfter: p.rating,
        score: 0,
        passedTests: 0,
        totalTests: chosenProblem.testCases.length,
        timeTakenSec: 0,
        status: 'IN_PROGRESS',
        xpAwarded: 0,
      };
    }

    const match: MatchSessionState = {
      id: matchId,
      roomId: room.id,
      matchType: room.type === 'BATTLE_1V1' ? (room.visibility === 'PUBLIC' ? 'RANKED_1V1' : 'CASUAL_1V1') : 'CONTEST',
      difficulty: room.difficulty,
      topic: room.topic,
      problem: chosenProblem,
      status: 'IN_PROGRESS',
      startedAt: now,
      endsAt: now + durationSec * 1000,
      participants: participantsMap,
      submissions: [],
    };

    room.status = 'IN_PROGRESS';
    room.problem = chosenProblem;
    room.activeMatchId = matchId;

    this.activeMatches.set(matchId, match);
    this.persistMatchInDb(match);

    return match;
  }

  public createDirectMatch(params: {
    matchId: string;
    problem: ChallengeProblemSeed;
    player1: { userId: string; userName: string; userAvatar?: string; userRating: number };
    player2: { userId: string; userName: string; userAvatar?: string; userRating: number };
    durationSeconds?: number;
    matchType?: 'RANKED_1V1' | 'CASUAL_1V1';
  }): MatchSessionState {
    const duration = params.durationSeconds || 1200;
    const now = Date.now();

    const participantsMap: Record<string, MatchParticipantState> = {
      [params.player1.userId]: {
        userId: params.player1.userId,
        userName: params.player1.userName,
        userAvatar: params.player1.userAvatar,
        ratingBefore: params.player1.userRating,
        ratingAfter: params.player1.userRating,
        score: 0,
        passedTests: 0,
        totalTests: params.problem.testCases.length,
        timeTakenSec: 0,
        status: 'IN_PROGRESS',
        xpAwarded: 0,
      },
      [params.player2.userId]: {
        userId: params.player2.userId,
        userName: params.player2.userName,
        userAvatar: params.player2.userAvatar,
        ratingBefore: params.player2.userRating,
        ratingAfter: params.player2.userRating,
        score: 0,
        passedTests: 0,
        totalTests: params.problem.testCases.length,
        timeTakenSec: 0,
        status: 'IN_PROGRESS',
        xpAwarded: 0,
      },
    };

    const match: MatchSessionState = {
      id: params.matchId,
      matchType: params.matchType || 'RANKED_1V1',
      difficulty: params.problem.difficulty,
      topic: params.problem.topicTags[0] || 'Algorithms',
      problem: params.problem,
      status: 'IN_PROGRESS',
      startedAt: now,
      endsAt: now + duration * 1000,
      participants: participantsMap,
      submissions: [],
    };

    this.activeMatches.set(params.matchId, match);
    this.persistMatchInDb(match);

    return match;
  }

  private async persistMatchInDb(match: MatchSessionState) {
    try {
      await prisma.matchSession.create({
        data: {
          id: match.id,
          roomId: match.roomId,
          matchType: match.matchType,
          difficulty: match.difficulty,
          status: match.status,
          startedAt: new Date(match.startedAt),
          durationSeconds: Math.floor((match.endsAt - match.startedAt) / 1000),
          problemId: match.problem.id,
          participants: {
            create: Object.values(match.participants).map((p) => ({
              userId: p.userId,
              userName: p.userName,
              userAvatar: p.userAvatar,
              ratingBefore: p.ratingBefore,
              ratingAfter: p.ratingAfter,
              totalTests: p.totalTests,
              status: p.status,
            })),
          },
        },
      });
    } catch (e) {
      console.warn('[Challenge Service] Match DB save fallback:', e);
    }
  }

  public getMatch(matchId: string): MatchSessionState | null {
    return this.activeMatches.get(matchId) || null;
  }

  public async runSampleTests(params: {
    problemId: string;
    code: string;
    language: string;
  }): Promise<{ passed: number; total: number; results: any[]; stdout?: string }> {
    const problem = CHALLENGE_PROBLEMS.find((p) => p.id === params.problemId) || CHALLENGE_PROBLEMS[0];
    const sampleTests = problem.testCases.slice(0, 2);

    const execResult = await sandboxService.evaluateCode(
      params.code,
      sampleTests,
      params.language
    );

    return {
      passed: execResult.passedCount,
      total: execResult.totalCount,
      results: execResult.testResults,
      stdout: execResult.stdout,
    };
  }

  public async submitSolution(params: {
    matchId: string;
    userId: string;
    userName: string;
    code: string;
    language: string;
  }): Promise<{
    submissionResult: EvaluationResult;
    match: MatchSessionState;
    isWinner: boolean;
    allCompleted: boolean;
  }> {
    const match = this.getMatch(params.matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status === 'COMPLETED') {
      throw new Error('Match has already completed');
    }

    const participant = match.participants[params.userId];
    if (!participant) {
      throw new Error('Participant not registered in this match');
    }

    // Rate-limit check (prevent spamming evaluation)
    const rateCheck = sandboxService.checkRateLimit(params.userId, 1200);
    if (!rateCheck.allowed) {
      throw new Error(`Please wait ${Math.ceil(rateCheck.waitTimeMs / 1000)}s before submitting again`);
    }

    // Run ALL test cases (sample + hidden)
    const execResult = await sandboxService.evaluateCode(
      params.code,
      match.problem.testCases,
      params.language
    );

    const isAllPassed = execResult.passedCount === execResult.totalCount && execResult.totalCount > 0;
    const timeTakenSec = Math.max(1, Math.floor((Date.now() - match.startedAt) / 1000));

    participant.passedTests = execResult.passedCount;
    participant.totalTests = execResult.totalCount;
    participant.timeTakenSec = timeTakenSec;
    participant.code = params.code;
    participant.language = params.language;

    const baseScore = Math.round((execResult.passedCount / Math.max(1, execResult.totalCount)) * 1000);
    const timeBonus = isAllPassed ? Math.max(0, 300 - Math.floor(timeTakenSec / 4)) : 0;
    participant.score = baseScore + timeBonus;

    const subId = uuidv4().slice(0, 8);
    match.submissions.push({
      id: subId,
      userId: params.userId,
      userName: params.userName,
      language: params.language,
      passed: execResult.passedCount,
      total: execResult.totalCount,
      execTimeMs: execResult.runtimeMs || 0,
      isAllPassed,
      submittedAt: Date.now(),
    });

    // Record submission to DB asynchronously
    prisma.challengeSubmission.create({
      data: {
        id: subId,
        matchId: match.id,
        userId: params.userId,
        problemId: match.problem.id,
        language: params.language,
        sourceCode: params.code,
        status: isAllPassed ? 'ACCEPTED' : 'WRONG_ANSWER',
        executionTimeMs: Math.round(execResult.runtimeMs || 0),
        passedTestCases: execResult.passedCount,
        totalTestCases: execResult.totalCount,
        score: participant.score,
        stdout: execResult.stdout,
        errorDetails: execResult.errorDetails,
      },
    }).catch(() => {});

    let isWinner = false;

    if (isAllPassed) {
      participant.status = 'WON';
      match.winnerId = params.userId;
      isWinner = true;
      await this.finalizeMatch(match, params.userId);
    }

    const allCompleted = Object.values(match.participants).every(
      (p) => p.status === 'WON' || p.status === 'LOST' || p.status === 'SUBMITTED' || p.status === 'TIED'
    );

    return {
      submissionResult: execResult,
      match,
      isWinner,
      allCompleted,
    };
  }

  public async finalizeMatch(match: MatchSessionState, winnerId?: string) {
    if (match.status === 'COMPLETED') return;
    match.status = 'COMPLETED';

    const pKeys = Object.keys(match.participants);
    if (pKeys.length === 2) {
      const p1 = match.participants[pKeys[0]];
      const p2 = match.participants[pKeys[1]];

      let scoreP1 = 0.5;
      if (winnerId === p1.userId) {
        scoreP1 = 1;
        p1.status = 'WON';
        p2.status = 'LOST';
      } else if (winnerId === p2.userId) {
        scoreP1 = 0;
        p1.status = 'LOST';
        p2.status = 'WON';
      } else {
        if (p1.passedTests > p2.passedTests) {
          scoreP1 = 1;
          p1.status = 'WON';
          p2.status = 'LOST';
          match.winnerId = p1.userId;
        } else if (p2.passedTests > p1.passedTests) {
          scoreP1 = 0;
          p1.status = 'LOST';
          p2.status = 'WON';
          match.winnerId = p2.userId;
        } else if (p1.score > p2.score) {
          scoreP1 = 1;
          p1.status = 'WON';
          p2.status = 'LOST';
          match.winnerId = p1.userId;
        } else if (p2.score > p1.score) {
          scoreP1 = 0;
          p1.status = 'LOST';
          p2.status = 'WON';
          match.winnerId = p2.userId;
        } else {
          scoreP1 = 0.5;
          p1.status = 'TIED';
          p2.status = 'TIED';
        }
      }

      // Compute Elo changes if RANKED_1V1
      if (match.matchType === 'RANKED_1V1') {
        const eloResult = this.calculateElo(p1.ratingBefore, p2.ratingBefore, scoreP1);
        p1.ratingAfter = eloResult.newRatingA;
        p2.ratingAfter = eloResult.newRatingB;

        // Fetch & update user 1 rating
        const u1 = await this.getUserRating(p1.userId, p1.userName, p1.userAvatar);
        u1.rating = p1.ratingAfter;
        u1.battlesTotal += 1;
        if (scoreP1 === 1) {
          u1.battlesWon += 1;
          u1.currentStreak += 1;
          u1.longestStreak = Math.max(u1.longestStreak, u1.currentStreak);
        } else if (scoreP1 === 0) {
          u1.currentStreak = 0;
        }
        u1.winRate = u1.battlesTotal > 0 ? Math.round((u1.battlesWon / u1.battlesTotal) * 100) : 0;
        u1.tier = this.getRankTier(u1.rating);
        u1.totalXP += (scoreP1 === 1 ? 120 : scoreP1 === 0.5 ? 70 : 40);
        await this.updateUserRatingInDb(u1);

        // Fetch & update user 2 rating
        const u2 = await this.getUserRating(p2.userId, p2.userName, p2.userAvatar);
        u2.rating = p2.ratingAfter;
        u2.battlesTotal += 1;
        if (scoreP1 === 0) {
          u2.battlesWon += 1;
          u2.currentStreak += 1;
          u2.longestStreak = Math.max(u2.longestStreak, u2.currentStreak);
        } else if (scoreP1 === 1) {
          u2.currentStreak = 0;
        }
        u2.winRate = u2.battlesTotal > 0 ? Math.round((u2.battlesWon / u2.battlesTotal) * 100) : 0;
        u2.tier = this.getRankTier(u2.rating);
        u2.totalXP += (scoreP1 === 0 ? 120 : scoreP1 === 0.5 ? 70 : 40);
        await this.updateUserRatingInDb(u2);
      }

      p1.xpAwarded = p1.status === 'WON' ? 120 : p1.status === 'TIED' ? 70 : 40;
      p2.xpAwarded = p2.status === 'WON' ? 120 : p2.status === 'TIED' ? 70 : 40;

      // Update match record in DB
      prisma.matchSession.update({
        where: { id: match.id },
        data: {
          status: 'COMPLETED',
          winnerId: match.winnerId,
          endedAt: new Date(),
        },
      }).catch(() => {});
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. Quiz Sessions Management
  // ═══════════════════════════════════════════════════════════════

  public createQuizSession(params: {
    hostId: string;
    hostName: string;
    hostAvatar?: string;
    category?: string;
    questionCount?: number;
    timePerQuestionSec?: number;
  }): QuizSessionState {
    const sessionId = `quiz_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    let sessionCode = this.generateRoomCode();
    while (this.codeToQuizId.has(sessionCode)) {
      sessionCode = this.generateRoomCode();
    }

    const category = params.category || 'DSA';
    const candidateQuestions = QUIZ_QUESTIONS_BANK.filter(
      (q) => category === 'MIXED' || q.category.toLowerCase() === category.toLowerCase()
    );
    const count = params.questionCount || 5;
    const shuffled = [...candidateQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));

    const session: QuizSessionState = {
      id: sessionId,
      sessionCode,
      title: `${category.toUpperCase()} Technical Quiz Arena`,
      category,
      difficulty: 'MEDIUM',
      status: 'LOBBY',
      currentQuestionIndex: 0,
      totalQuestions: selectedQuestions.length,
      timePerQuestionSec: params.timePerQuestionSec || 20,
      questions: selectedQuestions,
      participants: {
        [params.hostId]: {
          userId: params.hostId,
          userName: params.hostName,
          userAvatar: params.hostAvatar,
          score: 0,
          correctAnswers: 0,
          streak: 0,
          lastAnswerTimeMs: 0,
          answers: {},
        },
      },
      createdBy: params.hostId,
      createdAt: Date.now(),
    };

    this.activeQuizzes.set(sessionId, session);
    this.codeToQuizId.set(sessionCode, sessionId);

    return session;
  }

  public getQuizSession(idOrCode: string): QuizSessionState | null {
    if (this.activeQuizzes.has(idOrCode)) {
      return this.activeQuizzes.get(idOrCode)!;
    }
    const mapped = this.codeToQuizId.get(idOrCode.toUpperCase());
    if (mapped && this.activeQuizzes.has(mapped)) {
      return this.activeQuizzes.get(mapped)!;
    }
    return null;
  }

  public joinQuizSession(params: {
    sessionCodeOrId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
  }): { success: boolean; session?: QuizSessionState; error?: string } {
    const session = this.getQuizSession(params.sessionCodeOrId);
    if (!session) {
      return { success: false, error: 'Quiz session not found' };
    }

    if (!session.participants[params.userId]) {
      session.participants[params.userId] = {
        userId: params.userId,
        userName: params.userName,
        userAvatar: params.userAvatar,
        score: 0,
        correctAnswers: 0,
        streak: 0,
        lastAnswerTimeMs: 0,
        answers: {},
      };
    }

    return { success: true, session };
  }

  public startQuiz(sessionId: string): QuizSessionState | null {
    const session = this.getQuizSession(sessionId);
    if (!session) return null;
    session.status = 'QUESTION_ACTIVE';
    session.currentQuestionIndex = 0;
    session.questionStartedAt = Date.now();
    return session;
  }

  public submitQuizAnswer(params: {
    sessionId: string;
    userId: string;
    questionIndex: number;
    selectedIndex: number;
  }): {
    isCorrect: boolean;
    correctIndex: number;
    explanation: string;
    pointsEarned: number;
    session: QuizSessionState;
  } {
    const session = this.getQuizSession(params.sessionId);
    if (!session) throw new Error('Quiz session not found');

    const participant = session.participants[params.userId];
    if (!participant) throw new Error('Participant not in quiz');

    const question = session.questions[params.questionIndex];
    if (!question) throw new Error('Invalid question index');

    const isCorrect = params.selectedIndex === question.correctIndex;
    const timeTakenMs = session.questionStartedAt ? Date.now() - session.questionStartedAt : 5000;
    const timeRatio = Math.max(0, 1 - timeTakenMs / (session.timePerQuestionSec * 1000));

    let points = 0;
    if (isCorrect) {
      participant.correctAnswers += 1;
      participant.streak += 1;
      const streakBonus = Math.min(100, participant.streak * 20);
      const speedBonus = Math.round(timeRatio * 150);
      points = 100 + streakBonus + speedBonus;
      participant.score += points;
    } else {
      participant.streak = 0;
    }

    participant.answers[question.id] = {
      selectedIndex: params.selectedIndex,
      isCorrect,
      timeTakenMs,
      points,
    };

    return {
      isCorrect,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      pointsEarned: points,
      session,
    };
  }

  public advanceQuizQuestion(sessionId: string): { session: QuizSessionState; isCompleted: boolean } {
    const session = this.getQuizSession(sessionId);
    if (!session) throw new Error('Quiz not found');

    if (session.currentQuestionIndex + 1 < session.totalQuestions) {
      session.currentQuestionIndex += 1;
      session.status = 'QUESTION_ACTIVE';
      session.questionStartedAt = Date.now();
      return { session, isCompleted: false };
    } else {
      session.status = 'COMPLETED';
      return { session, isCompleted: true };
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. Global Leaderboard & Stats (No Fake Users)
  // ═══════════════════════════════════════════════════════════════

  public async getGlobalLeaderboard(limit = 20): Promise<RatingData[]> {
    try {
      const records = await prisma.challengeRating.findMany({
        orderBy: { rating: 'desc' },
        take: limit,
      });

      if (records.length > 0) {
        return records.map((r) => ({
          userId: r.userId,
          userName: r.userName,
          userAvatar: r.userAvatar || undefined,
          rating: r.rating,
          tier: r.tier || this.getRankTier(r.rating),
          battlesTotal: r.battlesTotal,
          battlesWon: r.battlesWon,
          winRate: r.winRate,
          currentStreak: r.currentStreak,
          longestStreak: r.longestStreak,
          totalXP: r.totalXP,
        }));
      }
    } catch (err) {
      console.warn('[Challenge Service] Leaderboard DB query fallback:', err);
    }

    // Fallback to active in-memory cache sorted by rating (honest empty if 0 real players)
    return Array.from(this.ratingsCache.values())
      .filter((u) => u.battlesTotal > 0 || u.rating !== 1200)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  public async getUserMatchHistory(userId: string) {
    try {
      const submissions = await prisma.challengeSubmission.findMany({
        where: { userId },
        orderBy: { submittedAt: 'desc' },
        take: 20,
        include: {
          match: true,
        },
      });
      return submissions;
    } catch (e) {
      return [];
    }
  }
}

export const challengeService = new ChallengeService();
