import { Router } from 'express';
import { roadmapController } from '../controllers/roadmap.controller.js';

const router: Router = Router();

router.get('/catalog', roadmapController.getCatalog);
router.get('/recruiter/search', roadmapController.searchRecruiterTalent);
router.get('/recruiter/talent-search', roadmapController.searchRecruiterTalent);
router.post('/recruiter/match-job', roadmapController.matchJobDescription);
router.post('/recruiter/match', roadmapController.matchJobDescription);
router.post('/recruiter/shortlist', roadmapController.addToShortlist);
router.get('/recruiter/shortlist', roadmapController.getRecruiterShortlist);
router.get('/recruiter/shortlist/export', roadmapController.exportRecruiterShortlist);
router.post('/recruiter/shortlist/export', roadmapController.exportRecruiterShortlist);
router.get('/recruiter/shortlist/:id', roadmapController.getShortlistEntryById);
router.patch('/recruiter/shortlist/:id/status', roadmapController.updateShortlistEntry);
router.patch('/recruiter/shortlist/:id', roadmapController.updateShortlistEntry);
router.delete('/recruiter/shortlist/:id', roadmapController.removeFromShortlist);

// Stage 11.2: Multi-Recruiter Collaborative Pipeline & Feedback Rubrics Routes
router.post('/recruiter/feedback', roadmapController.submitCandidateFeedback);
router.post('/recruiter/candidates/:candidateId/feedback', roadmapController.submitCandidateFeedback);
router.patch('/recruiter/feedback/:feedbackId', roadmapController.updateCandidateFeedback);
router.get('/recruiter/candidates/:candidateId/collaboration', roadmapController.getCandidateCollaborationThread);
router.get('/recruiter/feedback', roadmapController.listOrganizationFeedback);

router.get('/recruiter/analytics/cohort', roadmapController.getCohortAnalytics);
router.post('/recruiter/analytics/cohort', roadmapController.getCohortAnalytics);
router.get('/recruiter/cohort-analytics', roadmapController.getCohortAnalytics);
router.get('/analytics/cohort', roadmapController.getCohortAnalytics);
router.get('/recruiter/analytics/export', roadmapController.exportCohortAnalytics);
router.post('/recruiter/analytics/export', roadmapController.exportCohortAnalytics);
router.get('/analytics/cohort/export', roadmapController.exportCohortAnalytics);
router.get('/verify/:verificationId/export', roadmapController.exportVerificationRecord);

// Stage 11.1: Institutional Cohort & Batch Tracking Routes
router.get('/institution/cohorts', roadmapController.getInstitutionalCohortSummary);
router.post('/institution/cohorts', roadmapController.getInstitutionalCohortSummary);
router.get('/institution/cohort-summary', roadmapController.getInstitutionalCohortSummary);
router.get('/institution/cohorts/batches', roadmapController.getInstitutionalBatches);
router.get('/institution/batches', roadmapController.getInstitutionalBatches);

// Stage 11.3: ATS Integration & Standardized Batch Export Routes
router.get('/recruiter/ats/export', roadmapController.exportRecruiterAtsPipeline);
router.post('/recruiter/ats/export', roadmapController.exportRecruiterAtsPipeline);
router.get('/institution/ats/export', roadmapController.exportInstitutionalAtsBatch);
router.post('/institution/ats/export', roadmapController.exportInstitutionalAtsBatch);
router.get('/institution/cohorts/ats/export', roadmapController.exportInstitutionalAtsBatch);
router.post('/institution/cohorts/ats/export', roadmapController.exportInstitutionalAtsBatch);

// Stage 11.4: Bulk Credential Attestation & Verification Routes
router.post('/institution/credentials/verify-bulk', roadmapController.bulkVerifyCredentials);
router.post('/institution/verify-bulk', roadmapController.bulkVerifyCredentials);
router.post('/recruiter/credentials/verify-bulk', roadmapController.bulkVerifyCredentials);
router.post('/verify/bulk', roadmapController.bulkVerifyCredentials);

router.post('/structured', roadmapController.createStructuredRoadmap);
router.post('/manual', roadmapController.createManualRoadmap);
router.get('/adaptive', roadmapController.getMyAdaptiveRoadmaps);
router.get('/adaptive/:userRoadmapId', roadmapController.getAdaptiveRoadmap);
router.get('/adaptive/:userRoadmapId/history', roadmapController.getRoadmapHistory);
router.get('/adaptive/:userRoadmapId/readiness', roadmapController.getRoadmapReadiness);
router.get('/adaptive/:userRoadmapId/analytics', roadmapController.getRoadmapReadiness);
router.get('/adaptive/:userRoadmapId/verified-profile', roadmapController.getVerifiedProfile);
router.get('/adaptive/:userRoadmapId/certificate', roadmapController.getCertificate);
router.get('/adaptive/:userRoadmapId/certificate/download', roadmapController.downloadCertificatePdf);
router.get('/adaptive/:userRoadmapId/notifications', roadmapController.getSmartNotifications);
router.patch('/adaptive/:userRoadmapId/notifications/preferences', roadmapController.updateNotificationPreferences);
router.post('/adaptive/:userRoadmapId/notifications/:notificationId/read', roadmapController.markNotificationRead);
router.post('/adaptive/:userRoadmapId/notifications/mark-all-read', roadmapController.markAllNotificationsRead);
router.get('/adaptive/:userRoadmapId/profile-summary', roadmapController.getProfileSummary);
router.get('/profile-summary', roadmapController.getProfileSummary);
router.get('/resume-prefill', roadmapController.getResumePrefill);
router.post('/resume-prefill', roadmapController.getResumePrefill);
router.post('/telemetry/interview', roadmapController.ingestInterviewTelemetry);
router.post('/adaptive/:userRoadmapId/telemetry/interview', roadmapController.ingestInterviewTelemetry);
router.get('/verify/:verificationId', roadmapController.verifyPublicProfile);
router.get('/certificate/verify/:verificationId', roadmapController.verifyCertificate);
router.post('/adaptive/:userRoadmapId/evidence', roadmapController.recordSkillEvidence);
router.patch('/sprints/:sprintId/tasks/:taskId', roadmapController.updateSprintTask);
router.get('/sprints/:sprintId/telemetry', roadmapController.getSprintTelemetry);
router.post('/sprints/:sprintId/complete', roadmapController.completeSprint);
router.get('/assessments/nodes/:nodeId', roadmapController.getAssessmentForNode);
router.get('/assessments/user/attempts', roadmapController.getUserAssessmentAttempts);
router.get('/assessments/:assessmentId', roadmapController.getAssessmentById);
router.post('/assessments/submit', roadmapController.submitAssessment);
router.get('/user', roadmapController.getUserRoadmaps);
router.get('/user/:userId', roadmapController.getUserRoadmapsByCreator);
router.get('/', roadmapController.getUserRoadmaps);
router.post('/generate', roadmapController.generateRoadmap);
router.post('/:id/follow', roadmapController.followRoadmap);
router.post('/drill/evaluate', roadmapController.evaluatePracticalDrill);
router.post('/:id/nodes/:nodeId/drill', roadmapController.evaluatePracticalDrill);
router.get('/:id', roadmapController.getRoadmapById);
router.post('/:id/attempt', roadmapController.submitNodeAttempt);

export default router;

