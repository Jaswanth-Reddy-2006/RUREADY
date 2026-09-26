// ═══════════════════════════════════════════════════════════════
// RU Ready? — Challenge Service Production HTTP Controllers
// ═══════════════════════════════════════════════════════════════

import { Request, Response } from 'express';
import { challengeService } from '../services/challenge.service.js';
import { CHALLENGE_PROBLEMS } from '../data/challengeProblems.data.js';
import { QUIZ_QUESTIONS_BANK } from '../data/quizQuestions.data.js';

export const challengeController = {
  // ─────────────────────────────────────────────────────────────
  // Hub & Overview (100% Real DB Data)
  // ─────────────────────────────────────────────────────────────
  async getHubOverview(req: Request, res: Response) {
    try {
      const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string) || 'usr_default';
      const userRating = await challengeService.getUserRating(userId);
      const publicRooms = challengeService.listPublicRooms();
      const leaderboard = await challengeService.getGlobalLeaderboard(10);
      const recentMatches = await challengeService.getUserMatchHistory(userId);

      res.json({
        success: true,
        data: {
          userStats: {
            userId,
            userName: userRating.userName,
            rating: userRating.rating,
            wins: userRating.battlesWon,
            losses: Math.max(0, userRating.battlesTotal - userRating.battlesWon),
            matchesPlayed: userRating.battlesTotal,
            winRate: userRating.winRate,
            rankTier: userRating.tier,
            currentStreak: userRating.currentStreak,
            totalXP: userRating.totalXP,
          },
          activeRoomsCount: publicRooms.length,
          publicRooms,
          topLeaderboard: leaderboard,
          recentMatches,
          problemCount: CHALLENGE_PROBLEMS.length,
          quizCount: QUIZ_QUESTIONS_BANK.length,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // ─────────────────────────────────────────────────────────────
  // Rooms
  // ─────────────────────────────────────────────────────────────
  async createRoom(req: Request, res: Response) {
    try {
      const { hostId, hostName, hostAvatar, title, type, visibility, difficulty, topic, language, maxParticipants, durationMinutes } = req.body;
      const room = await challengeService.createRoom({
        hostId: hostId || 'usr_default',
        hostName: hostName || 'Player 1',
        hostAvatar,
        title,
        type,
        visibility,
        difficulty,
        topic,
        language,
        maxParticipants,
        durationMinutes,
      });

      res.status(201).json({ success: true, data: room });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getRoom(req: Request, res: Response) {
    try {
      const roomIdOrCode = String(req.params.roomIdOrCode);
      const room = challengeService.getRoom(roomIdOrCode);
      if (!room) {
        return res.status(404).json({ success: false, error: 'Room not found' });
      }
      res.json({ success: true, data: room });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async listRooms(req: Request, res: Response) {
    try {
      const rooms = challengeService.listPublicRooms();
      res.json({ success: true, data: rooms });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async joinRoom(req: Request, res: Response) {
    try {
      const roomCodeOrId = String(req.params.roomCodeOrId);
      const { userId, userName, userAvatar } = req.body;

      const result = await challengeService.joinRoom({
        roomCodeOrId,
        userId: userId || 'usr_default',
        userName: userName || 'Challenger',
        userAvatar,
      });

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }

      res.json({ success: true, data: result.room });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // ─────────────────────────────────────────────────────────────
  // Matches
  // ─────────────────────────────────────────────────────────────
  async getMatch(req: Request, res: Response) {
    try {
      const matchId = String(req.params.matchId);
      const match = challengeService.getMatch(matchId);
      if (!match) {
        return res.status(404).json({ success: false, error: 'Match not found' });
      }
      res.json({ success: true, data: match });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async runSampleTests(req: Request, res: Response) {
    try {
      const { problemId, code, language } = req.body;
      const results = await challengeService.runSampleTests({
        problemId,
        code,
        language: language || 'javascript',
      });
      res.json({ success: true, data: results });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async submitMatchSolution(req: Request, res: Response) {
    try {
      const matchId = String(req.params.matchId);
      const { userId, userName, code, language } = req.body;

      const result = await challengeService.submitSolution({
        matchId,
        userId: userId || 'usr_default',
        userName: userName || 'Challenger',
        code,
        language: language || 'javascript',
      });

      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // ─────────────────────────────────────────────────────────────
  // Quizzes
  // ─────────────────────────────────────────────────────────────
  async createQuiz(req: Request, res: Response) {
    try {
      const { hostId, hostName, hostAvatar, category, questionCount, timePerQuestionSec } = req.body;
      const session = challengeService.createQuizSession({
        hostId: hostId || 'usr_default',
        hostName: hostName || 'Host',
        hostAvatar,
        category,
        questionCount,
        timePerQuestionSec,
      });

      res.status(201).json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getQuizSession(req: Request, res: Response) {
    try {
      const sessionIdOrCode = String(req.params.sessionIdOrCode);
      const session = challengeService.getQuizSession(sessionIdOrCode);
      if (!session) {
        return res.status(404).json({ success: false, error: 'Quiz session not found' });
      }

      // Hide correct index for active questions until answered to prevent client inspection
      const sanitizedQuestions = session.questions.map((q, idx) => {
        if (session.status === 'COMPLETED' || idx < session.currentQuestionIndex) {
          return q;
        }
        const { correctIndex, explanation, ...sanitized } = q;
        return sanitized;
      });

      res.json({
        success: true,
        data: {
          ...session,
          questions: sanitizedQuestions,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async submitQuizAnswer(req: Request, res: Response) {
    try {
      const sessionId = String(req.params.sessionId);
      const { userId, questionIndex, selectedIndex } = req.body;

      const result = challengeService.submitQuizAnswer({
        sessionId,
        userId: userId || 'usr_default',
        questionIndex: Number(questionIndex),
        selectedIndex: Number(selectedIndex),
      });

      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // ─────────────────────────────────────────────────────────────
  // Leaderboard & Rating (Real DB Data)
  // ─────────────────────────────────────────────────────────────
  async getLeaderboard(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 20;
      const leaderboard = await challengeService.getGlobalLeaderboard(limit);
      res.json({ success: true, data: leaderboard });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getUserRating(req: Request, res: Response) {
    try {
      const userId = String(req.params.userId);
      const ratingData = await challengeService.getUserRating(userId);
      res.json({ success: true, data: ratingData });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getUserHistory(req: Request, res: Response) {
    try {
      const userId = String(req.params.userId);
      const history = await challengeService.getUserMatchHistory(userId);
      res.json({ success: true, data: history });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
