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
router.post('/matches/:matchId/forfeit', challengeController.forfeitMatch);

// Invitations (1v1 Direct Challenge)
router.post('/invite', challengeController.createInvitation);
router.get('/invitations/pending', challengeController.getPendingInvitations);
router.post('/invitations/:inviteId/accept', challengeController.acceptInvitation);
router.post('/invitations/:inviteId/decline', challengeController.declineInvitation);
router.post('/invitations/:inviteId/cancel', challengeController.cancelInvitation);

// Quizzes
router.post('/quizzes', challengeController.createQuiz);
router.get('/quizzes/:sessionIdOrCode', challengeController.getQuizSession);
router.post('/quizzes/:sessionId/answer', challengeController.submitQuizAnswer);

// Leaderboard & Ratings & History
router.get('/leaderboard', challengeController.getLeaderboard);
router.get('/ratings/:userId', challengeController.getUserRating);
router.get('/history/:userId', challengeController.getUserHistory);

export default router;
