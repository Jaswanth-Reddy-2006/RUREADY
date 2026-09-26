// ═══════════════════════════════════════════════════════════════
// RU Ready? — Challenge Service Routes
// ═══════════════════════════════════════════════════════════════

import { Router, type IRouter } from 'express';
import { challengeController } from '../controllers/challenge.controller.js';

const router: IRouter = Router();

// Hub Overview
router.get('/hub', challengeController.getHubOverview);

// Rooms
router.post('/rooms', challengeController.createRoom);
router.get('/rooms', challengeController.listRooms);
router.get('/rooms/:roomIdOrCode', challengeController.getRoom);
router.post('/rooms/:roomCodeOrId/join', challengeController.joinRoom);

// Matches
router.get('/matches/:matchId', challengeController.getMatch);
router.post('/matches/run-tests', challengeController.runSampleTests);
router.post('/matches/:matchId/submit', challengeController.submitMatchSolution);

// Quizzes
router.post('/quizzes', challengeController.createQuiz);
router.get('/quizzes/:sessionIdOrCode', challengeController.getQuizSession);
router.post('/quizzes/:sessionId/answer', challengeController.submitQuizAnswer);

// Leaderboard & Ratings & History
router.get('/leaderboard', challengeController.getLeaderboard);
router.get('/ratings/:userId', challengeController.getUserRating);
router.get('/history/:userId', challengeController.getUserHistory);

export default router;
