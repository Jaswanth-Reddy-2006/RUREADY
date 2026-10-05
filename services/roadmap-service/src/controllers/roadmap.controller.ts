import { Request, Response, NextFunction } from 'express';
import { roadmapService } from '../services/roadmap.service.js';
import { adaptiveRoadmapService } from '../services/adaptive-roadmap.service.js';
import { microAssessmentService } from '../services/micro-assessment.service.js';
import { practicalDrillService } from '../services/practical-drill.service.js';
import { verifiedProfileService } from '../services/verified-profile.service.js';
import { resumeBridgeService } from '../services/resume-bridge.service.js';
import { interviewTelemetryService } from '../services/interview-telemetry.service.js';
import { certificateGeneratorService } from '../services/certificate-generator.service.js';
import { sprintNotificationService } from '../services/sprint-notification.service.js';
import { recruiterTalentService } from '../services/recruiter-talent.service.js';
import { validateRecruiterTalentQuery } from '../validators/recruiter-talent.validator.js';
import { jobDescriptionMatchService } from '../services/job-description-match.service.js';
import { validateJobDescriptionMatchInput } from '../validators/job-description-match.validator.js';
import { recruiterShortlistService } from '../services/recruiter-shortlist.service.js';
import {
  validateAddToShortlistInput,
  validateUpdateShortlistStatusInput,
  validateRecruiterShortlistQuery,
} from '../validators/recruiter-shortlist.validator.js';
import { cohortAnalyticsService } from '../services/cohort-analytics.service.js';
import { validateCohortAnalyticsQuery } from '../validators/cohort-analytics.validator.js';
import { exportVerificationService } from '../services/export-verification.service.js';
import {
  validateRecruiterExportQuery,
  validateCohortExportQuery,
} from '../validators/export-verification.validator.js';
import { institutionalCohortService } from '../services/institutional-cohort.service.js';
import { validateInstitutionalCohortQuery } from '../validators/institutional-cohort.validator.js';
import { recruiterCollaborationService } from '../services/recruiter-collaboration.service.js';
import {
  validateSubmitCandidateFeedback,
  validateUpdateCandidateFeedback,
  validateCandidateFeedbackQuery,
} from '../validators/recruiter-collaboration.validator.js';
import { atsExportService } from '../services/ats-export.service.js';
import { validateAtsExportQuery } from '../validators/ats-export.validator.js';
import { bulkVerificationService } from '../services/bulk-verification.service.js';
import { validateBulkCredentialVerificationInput } from '../validators/bulk-verification.validator.js';
import { UnauthorizedError } from '../lib/errors.js';

function getUserId(req: Request): string {
  const header = req.headers['x-user-id'];
  const userId = Array.isArray(header) ? header[0] : header;
  if (!userId) throw new UnauthorizedError();
  return userId;
}

export const roadmapController = {
  async getUserRoadmaps(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const roadmaps = await roadmapService.getUserRoadmaps(userId);

      res.status(200).json({
        success: true,
        data: roadmaps,
      });
    } catch (err) {
      next(err);
    }
  },

  async generateRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const creatorName = (Array.isArray(req.headers['x-user-name']) ? req.headers['x-user-name'][0] : req.headers['x-user-name']) as string | undefined;
      const creatorUsername = (Array.isArray(req.headers['x-user-username']) ? req.headers['x-user-username'][0] : req.headers['x-user-username']) as string | undefined;
      const creatorAvatar = (Array.isArray(req.headers['x-user-avatar']) ? req.headers['x-user-avatar'][0] : req.headers['x-user-avatar']) as string | undefined;
      const creatorRole = (Array.isArray(req.headers['x-user-role']) ? req.headers['x-user-role'][0] : req.headers['x-user-role']) as string | undefined;

      const result = await roadmapService.generateRoadmap(
        userId,
        req.body,
        { creatorName, creatorUsername, creatorAvatar, creatorRole }
      );

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getRoadmapById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const id = req.params.id as string;
      const roadmap = await roadmapService.getRoadmapById(id, userId);

      res.status(200).json({
        success: true,
        data: roadmap,
      });
    } catch (err) {
      next(err);
    }
  },

  async submitNodeAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const id = req.params.id as string;
      const { nodeId, codeAnswer, verbalAnswer } = req.body;

      const result = await roadmapService.submitNodeAttempt(
        userId,
        id,
        nodeId,
        codeAnswer,
        verbalAnswer
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getCatalog(req: Request, res: Response, next: NextFunction) {
    try {
      const roadmaps = await roadmapService.getPublicCatalog();
      res.status(200).json({
        success: true,
        data: roadmaps,
      });
    } catch (err) {
      next(err);
    }
  },

  async createManualRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const roadmap = await roadmapService.createManualRoadmap(userId, req.body);
      res.status(201).json({
        success: true,
        data: roadmap,
      });
    } catch (err) {
      next(err);
    }
  },

  async getUserRoadmapsByCreator(req: Request, res: Response, next: NextFunction) {
    try {
      const targetUserId = req.params.userId as string;
      const roadmaps = await roadmapService.getUserCreatedRoadmaps(targetUserId);
      res.status(200).json({
        success: true,
        data: roadmaps,
      });
    } catch (err) {
      next(err);
    }
  },

  async createStructuredRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const roadmap = await adaptiveRoadmapService.createStructuredRoadmap(getUserId(req), req.body);
      res.status(201).json({ success: true, data: roadmap });
    } catch (err) {
      next(err);
    }
  },

  async followRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const roadmap = await adaptiveRoadmapService.followRoadmap(getUserId(req), req.params.id as string, req.body);
      res.status(201).json({ success: true, data: roadmap });
    } catch (err) {
      next(err);
    }
  },

  async getMyAdaptiveRoadmaps(req: Request, res: Response, next: NextFunction) {
    try {
      const roadmaps = await adaptiveRoadmapService.getUserRoadmaps(getUserId(req));
      res.status(200).json({ success: true, data: roadmaps });
    } catch (err) {
      next(err);
    }
  },

  async getAdaptiveRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const roadmap = await adaptiveRoadmapService.getUserRoadmap(getUserId(req), req.params.userRoadmapId as string);
      res.status(200).json({ success: true, data: roadmap });
    } catch (err) {
      next(err);
    }
  },

  async getRoadmapHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await adaptiveRoadmapService.getRoadmapLearningHistory(getUserId(req), req.params.userRoadmapId as string);
      res.status(200).json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  },

  async updateSprintTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await adaptiveRoadmapService.updateSprintTask(
        getUserId(req),
        req.params.sprintId as string,
        req.params.taskId as string,
        req.body,
      );
      res.status(200).json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  async completeSprint(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await adaptiveRoadmapService.completeSprint(getUserId(req), req.params.sprintId as string, req.body);
      res.status(200).json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  },

  async getSprintTelemetry(req: Request, res: Response, next: NextFunction) {
    try {
      const telemetry = await adaptiveRoadmapService.getSprintTelemetry(getUserId(req), req.params.sprintId as string);
      res.status(200).json({ success: true, data: telemetry });
    } catch (err) {
      next(err);
    }
  },

  async getRoadmapReadiness(req: Request, res: Response, next: NextFunction) {
    try {
      const readiness = await adaptiveRoadmapService.getRoadmapReadiness(getUserId(req), req.params.userRoadmapId as string);
      res.status(200).json({ success: true, data: readiness });
    } catch (err) {
      next(err);
    }
  },

  async recordSkillEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      const evidence = await adaptiveRoadmapService.recordSelfReportedEvidence(
        getUserId(req),
        req.params.userRoadmapId as string,
        req.body,
      );
      res.status(201).json({ success: true, data: evidence });
    } catch (err) {
      next(err);
    }
  },

  async getAssessmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const assessment = await microAssessmentService.getAssessment(req.params.assessmentId as string);
      res.status(200).json({ success: true, data: assessment });
    } catch (err) {
      next(err);
    }
  },

  async getAssessmentForNode(req: Request, res: Response, next: NextFunction) {
    try {
      const nodeId = req.params.nodeId as string;
      const skillId = req.query.skillId as string | undefined;
      const assessment = await microAssessmentService.getOrCreateAssessmentForNode(nodeId, skillId);
      res.status(200).json({ success: true, data: assessment });
    } catch (err) {
      next(err);
    }
  },

  async submitAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const result = await microAssessmentService.submitAssessment(userId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getUserAssessmentAttempts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const assessmentId = req.query.assessmentId as string | undefined;
      const attempts = await microAssessmentService.getUserAttempts(userId, assessmentId);
      res.status(200).json({ success: true, data: attempts });
    } catch (err) {
      next(err);
    }
  },

  async evaluatePracticalDrill(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const result = await practicalDrillService.evaluatePracticalDrill(userId, {
        ...req.body,
        ...(req.params.id ? { roadmapId: req.params.id } : {}),
        ...(req.params.nodeId ? { nodeId: req.params.nodeId } : {}),
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getVerifiedProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const userRoadmapId = req.params.userRoadmapId as string;
      const baseUrl = req.headers.origin as string || `${req.protocol}://${req.get('host')}`;
      const profile = await verifiedProfileService.getVerifiedProfile(userId, userRoadmapId, baseUrl);
      res.status(200).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  },

  async verifyPublicProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const verificationId = req.params.verificationId as string;
      const result = await verifiedProfileService.verifyPublicProfile(verificationId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getProfileSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const userRoadmapId = (req.params.userRoadmapId || req.query.userRoadmapId) as string | undefined;
      const baseUrl = (req.headers.origin as string) || `${req.protocol}://${req.get('host')}`;
      const summary = await verifiedProfileService.getProfileSummary(userId, userRoadmapId, baseUrl);
      res.status(200).json({ success: true, data: summary });
    } catch (err) {
      next(err);
    }
  },

  async getResumePrefill(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const resumeId = (req.query.resumeId || req.body?.resumeId) as string | undefined;
      const atsMatchId = (req.query.atsMatchId || req.body?.atsMatchId) as string | undefined;
      const prefill = await resumeBridgeService.getResumePrefill(userId, { resumeId, atsMatchId });
      res.status(200).json({ success: true, data: prefill });
    } catch (err) {
      next(err);
    }
  },

  async ingestInterviewTelemetry(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const userRoadmapId = (req.params.userRoadmapId || req.body?.userRoadmapId) as string | undefined;
      const result = await interviewTelemetryService.ingestTelemetry(userId, {
        ...req.body,
        userId: req.body?.userId || userId,
        userRoadmapId,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const userRoadmapId = req.params.userRoadmapId as string;
      const baseUrl = (req.headers.origin as string) || `${req.protocol}://${req.get('host')}`;
      const certData = await certificateGeneratorService.generateCertificateData(userId, userRoadmapId, baseUrl);
      res.status(200).json({ success: true, data: certData });
    } catch (err) {
      next(err);
    }
  },

  async downloadCertificatePdf(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const userRoadmapId = req.params.userRoadmapId as string;
      const baseUrl = (req.headers.origin as string) || `${req.protocol}://${req.get('host')}`;
      const result = await certificateGeneratorService.generateCertificatePdf(userId, userRoadmapId, baseUrl);

      res.setHeader('Content-Type', result.contentType);
      res.setHeader('Content-Disposition', `inline; filename="${result.filename}"`);
      res.setHeader('Content-Length', result.buffer.length);
      res.status(200).send(result.buffer);
    } catch (err) {
      next(err);
    }
  },

  async verifyCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const verificationId = req.params.verificationId as string;
      const result = await certificateGeneratorService.verifyCertificate(verificationId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getSmartNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const userRoadmapId = req.params.userRoadmapId as string;
      const refDateStr = req.query.referenceDate as string | undefined;
      const referenceDate = refDateStr ? new Date(refDateStr) : new Date();
      const feed = await sprintNotificationService.getNotifications(userId, userRoadmapId, referenceDate);
      res.status(200).json({ success: true, data: feed });
    } catch (err) {
      next(err);
    }
  },

  async updateNotificationPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const userRoadmapId = req.params.userRoadmapId as string;
      const updatedPrefs = await sprintNotificationService.updatePreferences(userId, userRoadmapId, req.body);
      res.status(200).json({ success: true, data: updatedPrefs });
    } catch (err) {
      next(err);
    }
  },

  async markNotificationRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const userRoadmapId = req.params.userRoadmapId as string;
      const notificationId = req.params.notificationId as string;
      const result = await sprintNotificationService.markNotificationRead(userId, userRoadmapId, notificationId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async markAllNotificationsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const userRoadmapId = req.params.userRoadmapId as string;
      const result = await sprintNotificationService.markAllRead(userId, userRoadmapId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async searchRecruiterTalent(req: Request, res: Response, next: NextFunction) {
    try {
      // Require authenticated recruiter/user
      getUserId(req);
      const validatedQuery = validateRecruiterTalentQuery(req.query);
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;
      const result = await recruiterTalentService.searchCandidates(validatedQuery, baseUrl);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async matchJobDescription(req: Request, res: Response, next: NextFunction) {
    try {
      // Require authenticated recruiter/user
      getUserId(req);
      const validatedInput = validateJobDescriptionMatchInput(req.body);
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;
      const result = await jobDescriptionMatchService.matchJobDescription(validatedInput, baseUrl);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async addToShortlist(req: Request, res: Response, next: NextFunction) {
    try {
      const recruiterId = getUserId(req);
      const validatedInput = validateAddToShortlistInput(req.body);
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;
      const entry = await recruiterShortlistService.addToShortlist(recruiterId, validatedInput, baseUrl);
      res.status(201).json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  },

  async getRecruiterShortlist(req: Request, res: Response, next: NextFunction) {
    try {
      const recruiterId = getUserId(req);
      const validatedQuery = validateRecruiterShortlistQuery(req.query);
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;
      const result = await recruiterShortlistService.getShortlist(recruiterId, validatedQuery, baseUrl);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getShortlistEntryById(req: Request, res: Response, next: NextFunction) {
    try {
      const recruiterId = getUserId(req);
      const entryId = req.params.id as string;
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;
      const entry = await recruiterShortlistService.getShortlistEntryById(recruiterId, entryId, baseUrl);
      res.status(200).json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  },

  async updateShortlistEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const recruiterId = getUserId(req);
      const entryId = req.params.id as string;
      const validatedInput = validateUpdateShortlistStatusInput(req.body);
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;
      const updated = await recruiterShortlistService.updateShortlistEntry(
        recruiterId,
        entryId,
        validatedInput,
        baseUrl
      );
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  async removeFromShortlist(req: Request, res: Response, next: NextFunction) {
    try {
      const recruiterId = getUserId(req);
      const entryId = req.params.id as string;
      const result = await recruiterShortlistService.removeFromShortlist(recruiterId, entryId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getCohortAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      // Require authenticated recruiter / institutional user
      getUserId(req);
      // Merge query and body params for versatility
      const queryParams = req.method === 'POST' ? { ...req.query, ...req.body } : req.query;
      const validatedQuery = validateCohortAnalyticsQuery(queryParams);
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;
      const analytics = await cohortAnalyticsService.getCohortAnalytics(validatedQuery, baseUrl);
      res.status(200).json({ success: true, data: analytics });
    } catch (err) {
      next(err);
    }
  },

  async exportRecruiterShortlist(req: Request, res: Response, next: NextFunction) {
    try {
      const recruiterId = getUserId(req);
      const queryParams = req.method === 'POST' ? { ...req.query, ...req.body } : req.query;
      const validatedQuery = validateRecruiterExportQuery(queryParams);
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;
      const result = await exportVerificationService.exportRecruiterShortlist(
        recruiterId,
        validatedQuery,
        baseUrl
      );
      if (req.query.download === 'true') {
        res.setHeader('Content-Type', result.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.status(200).send(result.data);
      } else {
        res.status(200).json({ success: true, data: result });
      }
    } catch (err) {
      next(err);
    }
  },

  async exportCohortAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      getUserId(req);
      const queryParams = req.method === 'POST' ? { ...req.query, ...req.body } : req.query;
      const validatedQuery = validateCohortExportQuery(queryParams);
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;
      const result = await exportVerificationService.exportCohortAnalytics(
        validatedQuery,
        baseUrl
      );
      if (req.query.download === 'true') {
        res.setHeader('Content-Type', result.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.status(200).send(result.data);
      } else {
        res.status(200).json({ success: true, data: result });
      }
    } catch (err) {
      next(err);
    }
  },

  async exportVerificationRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const verificationId = req.params.verificationId as string;
      const format = (req.query.format as string) === 'csv' ? 'csv' : 'json';
      const result = await exportVerificationService.exportVerificationRecord(verificationId, format);
      if (req.query.download === 'true') {
        res.setHeader('Content-Type', result.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.status(200).send(result.data);
      } else {
        res.status(200).json({ success: true, data: result });
      }
    } catch (err) {
      next(err);
    }
  },

  async getInstitutionalCohortSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers['x-institution-id'] || req.headers['x-institution-name'];
      const institutionName = Array.isArray(authHeader) ? authHeader[0] : (authHeader as string | undefined);
      const userRole = (Array.isArray(req.headers['x-user-role']) ? req.headers['x-user-role'][0] : req.headers['x-user-role']) as string | undefined;
      const userId = (Array.isArray(req.headers['x-user-id']) ? req.headers['x-user-id'][0] : req.headers['x-user-id']) as string | undefined;

      const authContext = {
        userId,
        userRole,
        institutionName,
      };

      const queryParams = req.method === 'POST' ? { ...req.query, ...req.body } : req.query;
      const validatedQuery = validateInstitutionalCohortQuery(queryParams);
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;

      const result = await institutionalCohortService.getInstitutionalBatchSummary(
        authContext,
        validatedQuery,
        baseUrl
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getInstitutionalBatches(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers['x-institution-id'] || req.headers['x-institution-name'];
      const institutionName = Array.isArray(authHeader) ? authHeader[0] : (authHeader as string | undefined);
      const userRole = (Array.isArray(req.headers['x-user-role']) ? req.headers['x-user-role'][0] : req.headers['x-user-role']) as string | undefined;
      const userId = (Array.isArray(req.headers['x-user-id']) ? req.headers['x-user-id'][0] : req.headers['x-user-id']) as string | undefined;

      const authContext = {
        userId,
        userRole,
        institutionName,
      };

      const queryParams = req.method === 'POST' ? { ...req.query, ...req.body } : req.query;
      const validatedQuery = validateInstitutionalCohortQuery(queryParams);
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;

      const result = await institutionalCohortService.getInstitutionalBatches(
        authContext,
        validatedQuery,
        baseUrl
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async submitCandidateFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const authContext = getRecruiterCollaborationAuthContext(req);
      const candidateId = req.params.candidateId || req.body.candidateId;
      const validatedInput = validateSubmitCandidateFeedback({
        ...req.body,
        candidateId,
      });

      const result = await recruiterCollaborationService.submitFeedback(
        authContext,
        validatedInput
      );

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateCandidateFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const authContext = getRecruiterCollaborationAuthContext(req);
      const feedbackId = (Array.isArray(req.params.feedbackId) ? req.params.feedbackId[0] : req.params.feedbackId) as string;
      const validatedInput = validateUpdateCandidateFeedback(req.body);

      const result = await recruiterCollaborationService.updateFeedback(
        authContext,
        feedbackId,
        validatedInput
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getCandidateCollaborationThread(req: Request, res: Response, next: NextFunction) {
    try {
      const authContext = getRecruiterCollaborationAuthContext(req);
      const candidateId = (Array.isArray(req.params.candidateId) ? req.params.candidateId[0] : req.params.candidateId) as string;

      const result = await recruiterCollaborationService.getCandidateCollaborationThread(
        authContext,
        candidateId
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async listOrganizationFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const authContext = getRecruiterCollaborationAuthContext(req);
      const validatedQuery = validateCandidateFeedbackQuery(req.query);

      const result = await recruiterCollaborationService.listOrganizationFeedback(
        authContext,
        validatedQuery
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async exportRecruiterAtsPipeline(req: Request, res: Response, next: NextFunction) {
    try {
      const authContext = getRecruiterCollaborationAuthContext(req);
      const queryParams = req.method === 'POST' ? { ...req.query, ...req.body } : req.query;
      const validatedQuery = validateAtsExportQuery(queryParams);
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;

      const result = await atsExportService.exportRecruiterAtsPipeline(
        authContext,
        validatedQuery,
        baseUrl
      );

      if (req.query.download === 'true') {
        res.setHeader('Content-Type', result.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.status(200).send(result.data);
      } else {
        res.status(200).json({ success: true, data: result });
      }
    } catch (err) {
      next(err);
    }
  },

  async exportInstitutionalAtsBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers['x-institution-id'] || req.headers['x-institution-name'];
      const institutionName = Array.isArray(authHeader) ? authHeader[0] : (authHeader as string | undefined);
      const userRole = (Array.isArray(req.headers['x-user-role']) ? req.headers['x-user-role'][0] : req.headers['x-user-role']) as string | undefined;
      const userId = (Array.isArray(req.headers['x-user-id']) ? req.headers['x-user-id'][0] : req.headers['x-user-id']) as string | undefined;

      const authContext = {
        userId,
        userRole,
        institutionName,
      };

      const queryParams = req.method === 'POST' ? { ...req.query, ...req.body } : req.query;
      const validatedQuery = validateAtsExportQuery(queryParams);
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;

      const result = await atsExportService.exportInstitutionalAtsBatch(
        authContext,
        validatedQuery,
        baseUrl
      );

      if (req.query.download === 'true') {
        res.setHeader('Content-Type', result.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.status(200).send(result.data);
      } else {
        res.status(200).json({ success: true, data: result });
      }
    } catch (err) {
      next(err);
    }
  },

  async bulkVerifyCredentials(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers['x-institution-id'] || req.headers['x-institution-name'];
      const institutionName = Array.isArray(authHeader) ? authHeader[0] : (authHeader as string | undefined);
      const orgHeader = req.headers['x-organization-id'] || req.headers['x-organization-name'];
      const organizationId = Array.isArray(orgHeader) ? orgHeader[0] : (orgHeader as string | undefined);
      const userRole = (Array.isArray(req.headers['x-user-role']) ? req.headers['x-user-role'][0] : req.headers['x-user-role']) as string | undefined;
      const userId = (Array.isArray(req.headers['x-user-id']) ? req.headers['x-user-id'][0] : req.headers['x-user-id']) as string | undefined;

      const authContext = {
        userId,
        userRole,
        institutionName,
        organizationId,
      };

      const validatedInput = validateBulkCredentialVerificationInput(req.body);
      const baseUrl = `${req.protocol}://${req.get('host') || 'localhost:4000'}`;

      const result = await bulkVerificationService.verifyBulkCredentials(
        authContext,
        validatedInput,
        baseUrl
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};

function getRecruiterCollaborationAuthContext(req: Request) {
  const recruiterIdHeader = req.headers['x-recruiter-id'] || req.headers['x-user-id'];
  const recruiterId = Array.isArray(recruiterIdHeader) ? recruiterIdHeader[0] : (recruiterIdHeader as string | undefined);

  const orgHeader =
    req.headers['x-organization-id'] ||
    req.headers['x-organization-name'] ||
    req.headers['x-institution-id'] ||
    req.headers['x-institution-name'];
  const organizationId = Array.isArray(orgHeader) ? orgHeader[0] : (orgHeader as string | undefined);

  const recruiterNameHeader = req.headers['x-user-name'] || req.headers['x-recruiter-name'];
  const recruiterName = Array.isArray(recruiterNameHeader) ? recruiterNameHeader[0] : (recruiterNameHeader as string | undefined);

  const roleHeader = req.headers['x-user-role'];
  const role = Array.isArray(roleHeader) ? roleHeader[0] : (roleHeader as string | undefined);

  return {
    recruiterId: recruiterId || '',
    organizationId: organizationId || '',
    recruiterName,
    role,
  };
}







