// ═══════════════════════════════════════════════════════════════
// RU Ready? — Production Socket.IO Server with Presence & Auth
// ═══════════════════════════════════════════════════════════════

import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { matchmakingService, type MatchFoundPayload } from '../services/matchmaking.service.js';
import { challengeService, type ChallengeRoomState, type MatchSessionState } from '../services/challenge.service.js';

export function setupSocketServer(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io',
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  // Presence & Session Mapping: userId -> socketId
  const userSocketMap = new Map<string, string>();
  const socketUserMap = new Map<string, { userId: string; userName: string }>();
  // Active disconnect grace timers: userId -> NodeJS.Timeout
  const disconnectGraceTimers = new Map<string, any>();

  // Wire up matchmaking match found event to broadcast to both sockets
  matchmakingService.onMatchFound((payload: MatchFoundPayload) => {
    const match = challengeService.createDirectMatch({
      matchId: payload.matchId,
      problem: payload.problem,
      player1: {
        userId: payload.player1.userId,
        userName: payload.player1.userName,
        userAvatar: payload.player1.userAvatar,
        userRating: payload.player1.userRating,
      },
      player2: {
        userId: payload.player2.userId,
        userName: payload.player2.userName,
        userAvatar: payload.player2.userAvatar,
        userRating: payload.player2.userRating,
      },
      durationSeconds: payload.durationSeconds,
      matchType: 'RANKED_1V1',
    });

    const sock1 = userSocketMap.get(payload.player1.userId) || payload.player1.socketId;
    const sock2 = userSocketMap.get(payload.player2.userId) || payload.player2.socketId;

    io.to(sock1).emit('matchmaking:match_found', {
      matchId: payload.matchId,
      match,
      opponent: {
        userId: payload.player2.userId,
        userName: payload.player2.userName,
        userAvatar: payload.player2.userAvatar,
        rating: payload.player2.userRating,
      },
      problem: payload.problem,
      startsInMs: 5000,
    });

    io.to(sock2).emit('matchmaking:match_found', {
      matchId: payload.matchId,
      match,
      opponent: {
        userId: payload.player1.userId,
        userName: payload.player1.userName,
        userAvatar: payload.player1.userAvatar,
        rating: payload.player1.userRating,
      },
      problem: payload.problem,
      startsInMs: 5000,
    });
  });

  io.on('connection', (socket: Socket) => {
    // Authenticate / Register socket user identity from handshake
    const authData = socket.handshake.auth || {};
    const handshakeUserId = authData.userId || (socket.handshake.query.userId as string);
    const handshakeUserName = authData.userName || (socket.handshake.query.userName as string) || 'Challenger';

    if (handshakeUserId) {
      userSocketMap.set(handshakeUserId, socket.id);
      socketUserMap.set(socket.id, { userId: handshakeUserId, userName: handshakeUserName });

      // Cancel disconnect grace timer if reconnecting
      if (disconnectGraceTimers.has(handshakeUserId)) {
        clearTimeout(disconnectGraceTimers.get(handshakeUserId));
        disconnectGraceTimers.delete(handshakeUserId);
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 1. MATCHMAKING
    // ─────────────────────────────────────────────────────────────
    socket.on('matchmaking:join', async (data: {
      userId: string;
      userName: string;
      userAvatar?: string;
      userRating?: number;
      difficulty?: string;
      topic?: string;
      language?: string;
    }) => {
      const actualUserId = data.userId || handshakeUserId || 'usr_guest';
      const actualUserName = data.userName || handshakeUserName || 'Challenger';

      userSocketMap.set(actualUserId, socket.id);
      socketUserMap.set(socket.id, { userId: actualUserId, userName: actualUserName });

      const ratingData = await challengeService.getUserRating(actualUserId, actualUserName, data.userAvatar);

      const res = matchmakingService.enqueue({
        userId: actualUserId,
        userName: actualUserName,
        userAvatar: data.userAvatar,
        userRating: data.userRating || ratingData.rating,
        difficulty: data.difficulty || 'MEDIUM',
        topic: data.topic || 'DSA',
        language: data.language || 'all',
        socketId: socket.id,
        joinedAt: Date.now(),
      });

      socket.emit('matchmaking:queued', { success: res.success, message: res.message });
    });

    socket.on('matchmaking:leave', (data: { userId: string }) => {
      const uid = data.userId || handshakeUserId;
      if (uid) {
        matchmakingService.dequeue(uid);
      }
      socket.emit('matchmaking:left', { success: true });
    });

    socket.on('matchmaking:status', (data: { userId: string }) => {
      const uid = data.userId || handshakeUserId;
      if (uid) {
        const status = matchmakingService.getQueueStatus(uid);
        socket.emit('matchmaking:status_update', status);
      }
    });

    // ─────────────────────────────────────────────────────────────
    // 2. ROOM MANAGEMENT
    // ─────────────────────────────────────────────────────────────
    socket.on('room:join', async (data: {
      roomCodeOrId: string;
      userId: string;
      userName: string;
      userAvatar?: string;
    }) => {
      const actualUserId = data.userId || handshakeUserId || 'usr_guest';
      const actualUserName = data.userName || handshakeUserName || 'Challenger';

      const joinRes = await challengeService.joinRoom({
        roomCodeOrId: data.roomCodeOrId,
        userId: actualUserId,
        userName: actualUserName,
        userAvatar: data.userAvatar,
        socketId: socket.id,
      });

      if (joinRes.success && joinRes.room) {
        socket.join(joinRes.room.id);
        io.to(joinRes.room.id).emit('room:updated', joinRes.room);
        socket.emit('room:joined', { success: true, room: joinRes.room });
      } else {
        socket.emit('room:error', { message: joinRes.error || 'Failed to join room' });
      }
    });

    socket.on('room:toggle_ready', (data: { roomId: string; userId: string; isReady?: boolean }) => {
      const uid = data.userId || handshakeUserId;
      const room = challengeService.toggleReady(data.roomId, uid, data.isReady);
      if (room) {
        io.to(room.id).emit('room:updated', room);
      }
    });

    socket.on('room:start', (data: { roomId: string; userId: string }) => {
      const uid = data.userId || handshakeUserId;
      const room = challengeService.getRoom(data.roomId);
      if (room && room.createdBy === uid) {
        const match = challengeService.createMatchFromRoom(room);
        io.to(room.id).emit('room:match_started', {
          matchId: match.id,
          match,
          problem: match.problem,
        });
      }
    });

    socket.on('room:leave', (data: { roomId: string; userId: string }) => {
      const uid = data.userId || handshakeUserId;
      const res = challengeService.leaveRoom(data.roomId, uid);
      socket.leave(data.roomId);
      if (res.room) {
        io.to(res.room.id).emit('room:updated', res.room);
      }
    });

    // ─────────────────────────────────────────────────────────────
    // 3. 1v1 BATTLE / CONTEST MATCH ACTIONS
    // ─────────────────────────────────────────────────────────────
    socket.on('match:join_room', (data: { matchId: string; userId: string }) => {
      socket.join(data.matchId);
      const match = challengeService.getMatch(data.matchId);
      if (match) {
        socket.emit('match:state', match);
      }
    });

    socket.on('match:progress', (data: { matchId: string; userId: string; passedTests: number; totalTests: number }) => {
      const uid = data.userId || handshakeUserId;
      const match = challengeService.getMatch(data.matchId);
      if (match && match.participants[uid]) {
        match.participants[uid].passedTests = data.passedTests;
        match.participants[uid].totalTests = data.totalTests;
        socket.to(data.matchId).emit('match:opponent_progress', {
          userId: uid,
          passedTests: data.passedTests,
          totalTests: data.totalTests,
        });
      }
    });

    socket.on('match:run_sample', async (data: {
      problemId: string;
      code: string;
      language: string;
    }) => {
      try {
        const result = await challengeService.runSampleTests({
          problemId: data.problemId,
          code: data.code,
          language: data.language,
        });
        socket.emit('match:sample_result', result);
      } catch (err: any) {
        socket.emit('match:sample_result', {
          passed: 0,
          total: 0,
          results: [],
          stdout: err.message || 'Execution error',
        });
      }
    });

    socket.on('match:submit', async (data: {
      matchId: string;
      userId: string;
      userName: string;
      code: string;
      language: string;
    }) => {
      try {
        const uid = data.userId || handshakeUserId || 'usr_guest';
        const uname = data.userName || handshakeUserName || 'Challenger';

        const result = await challengeService.submitSolution({
          matchId: data.matchId,
          userId: uid,
          userName: uname,
          code: data.code,
          language: data.language,
        });

        socket.emit('match:submit_result', {
          success: true,
          submissionResult: result.submissionResult,
          isWinner: result.isWinner,
          match: result.match,
        });

        io.to(data.matchId).emit('match:state_update', result.match);

        if (result.isWinner || result.allCompleted) {
          io.to(data.matchId).emit('match:completed', {
            match: result.match,
            winnerId: result.match.winnerId,
          });
        }
      } catch (err: any) {
        socket.emit('match:submit_result', {
          success: false,
          error: err.message || 'Submission failed',
        });
      }
    });

    // ─────────────────────────────────────────────────────────────
    // 4. QUIZ ARENA ACTIONS
    // ─────────────────────────────────────────────────────────────
    socket.on('quiz:join', (data: {
      sessionCodeOrId: string;
      userId: string;
      userName: string;
      userAvatar?: string;
    }) => {
      const uid = data.userId || handshakeUserId || 'usr_guest';
      const uname = data.userName || handshakeUserName || 'Quiz Challenger';

      const res = challengeService.joinQuizSession({
        sessionCodeOrId: data.sessionCodeOrId,
        userId: uid,
        userName: uname,
        userAvatar: data.userAvatar,
      });

      if (res.success && res.session) {
        socket.join(res.session.id);
        io.to(res.session.id).emit('quiz:state_update', res.session);
        socket.emit('quiz:joined', { success: true, session: res.session });
      } else {
        socket.emit('quiz:error', { message: res.error || 'Failed to join quiz' });
      }
    });

    socket.on('quiz:start', (data: { sessionId: string }) => {
      const session = challengeService.startQuiz(data.sessionId);
      if (session) {
        io.to(session.id).emit('quiz:started', session);
      }
    });

    socket.on('quiz:submit_answer', (data: {
      sessionId: string;
      userId: string;
      questionIndex: number;
      selectedIndex: number;
    }) => {
      try {
        const uid = data.userId || handshakeUserId || 'usr_guest';
        const res = challengeService.submitQuizAnswer({
          sessionId: data.sessionId,
          userId: uid,
          questionIndex: data.questionIndex,
          selectedIndex: data.selectedIndex,
        });

        socket.emit('quiz:answer_result', {
          isCorrect: res.isCorrect,
          correctIndex: res.correctIndex,
          explanation: res.explanation,
          pointsEarned: res.pointsEarned,
        });

        io.to(data.sessionId).emit('quiz:state_update', res.session);
      } catch (err: any) {
        socket.emit('quiz:error', { message: err.message });
      }
    });

    socket.on('quiz:next_question', (data: { sessionId: string }) => {
      try {
        const res = challengeService.advanceQuizQuestion(data.sessionId);
        if (res.isCompleted) {
          io.to(data.sessionId).emit('quiz:completed', res.session);
        } else {
          io.to(data.sessionId).emit('quiz:next_question_started', res.session);
        }
      } catch (err: any) {
        socket.emit('quiz:error', { message: err.message });
      }
    });

    // ─────────────────────────────────────────────────────────────
    // 5. DISCONNECT & GRACE PERIOD
    // ─────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      const userInfo = socketUserMap.get(socket.id);
      if (userInfo) {
        matchmakingService.dequeue(userInfo.userId);

        // Set 60s grace timer before forfeiting any active matches
        const timer = setTimeout(() => {
          userSocketMap.delete(userInfo.userId);
          socketUserMap.delete(socket.id);
          disconnectGraceTimers.delete(userInfo.userId);
        }, 60000);

        disconnectGraceTimers.set(userInfo.userId, timer);
      }
    });
  });

  return io;
}
