import apiClient from './client';
import {
  UserRoadmapDTO,
  CareerRoadmapDTO,
  RoadmapGenerationInput,
  RoadmapGenerationResult,
  SprintTaskDTO,
  SprintPerformanceInput,
  SprintReviewResultDTO,
  SkillEvidenceDTO,
  SelfReportedEvidenceInput,
  MicroAssessmentDTO,
  SubmitAssessmentInput,
  AssessmentAttemptResultDTO,
  PracticalDrillResultDTO,
  SubmitPracticalDrillInput,
  UnifiedSprintTelemetryDTO,
  RoadmapReadinessAnalyticsDTO,
  VerifiedCareerProfileDTO,
  PublicVerifiedProfileDTO,
  RoadmapLearningHistoryDTO,
  RoadmapProfileSummaryDTO,
  ResumeRoadmapPrefillDTO,
  ResumeRoadmapPrefillInput,
  InterviewTelemetryIngressDTO,
  InterviewTelemetryIngressResultDTO,
  VerifiableCertificateDTO,
  CertificateVerificationResultDTO,
  SmartNotificationDTO,
  SmartNotificationPreferencesDTO,
  SmartSprintNotificationFeedDTO,
  RecruiterTalentQueryDTO,
  RecruiterTalentSearchResponseDTO,
  JobDescriptionMatchInputDTO,
  JobDescriptionMatchResponseDTO,
  AddToShortlistInputDTO,
  UpdateShortlistStatusInputDTO,
  RecruiterShortlistQueryDTO,
  RecruiterShortlistEntryDTO,
  RecruiterShortlistResponseDTO,
  CohortAnalyticsQueryDTO,
  CohortAnalyticsResponseDTO,
  RecruiterExportQueryDTO,
  CohortExportQueryDTO,
  ExportResultDTO,
  InstitutionalCohortQueryDTO,
  InstitutionalBatchSummaryDTO,
  InstitutionalBatchListResponseDTO,
  SubmitCandidateFeedbackInputDTO,
  UpdateCandidateFeedbackInputDTO,
  CandidateCollaborativeFeedbackDTO,
  CandidateCollaborationThreadDTO,
  CandidateFeedbackQueryDTO,
  AtsExportQueryDTO,
  AtsBatchExportResponseDTO,
  BulkCredentialVerificationQueryDTO,
  BulkCredentialVerificationResponseDTO,
} from '@ru-ready/shared';

export interface RoadmapPersonalizationInput {
  currentLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  targetRole: string;
  targetCompany?: string;
  targetOutcome: string;
  deadline?: string | Date;
  hoursPerDay: number;
  daysPerWeek: number;
  sprintDurationDays?: 7 | 10;
  learningPreferences?: string[];
  freeOnly?: boolean;
  budgetCents?: number;
  preferredTechnologies?: string[];
}

export interface RoadmapSourceItem {
  id: string;
  title: string;
  url: string;
  type: 'DOCS' | 'COURSE' | 'REPO' | 'BOOK' | 'ARTICLE';
  description?: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  subHeader: string;
  category: string;
  orderIndex: number;
  status: 'LOCKED' | 'IN_PROGRESS' | 'MASTERED';
  score: number;
  estimatedHours: number;
  whatShouldIDo: {
    summary: string;
    actionSteps: string[];
    mentalModels: string[];
  };
  whatIsTheSource: RoadmapSourceItem[];
  whatIsTheExactThing: {
    title: string;
    description: string;
    deliverable: string;
    starterCode?: string;
    verificationChecklist: string[];
  };
  microQuestions: Array<{
    id: string;
    questionText: string;
    focus: string;
    suggestedAnswer?: string;
  }>;
}

export interface Roadmap {
  id: string;
  title: string;
  rolePath: string;
  category: 'FULLSTACK' | 'AIML' | 'DEVOPS' | 'SYSTEM_DESIGN' | 'DATA' | 'FRONTEND' | 'MOBILE' | 'CYBERSECURITY';
  targetCompanyTier: 'FAANG' | 'Unicorn' | 'Tier-1 FinTech' | 'High-Growth Startup' | 'Enterprise';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Staff';
  description: string;
  estimatedWeeks: number;
  isOfficial: boolean;
  isPublic: boolean;
  isAiGenerated: boolean;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar?: string;
  creatorRole?: string;
  overallReadiness: number;
  enrolledCount: number;
  upvotes: number;
  tags: string[];
  nodesData: RoadmapNode[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Builds a valid personalization payload that satisfies the backend personalizationSchema.
 */
export function buildDefaultPersonalization(roadmap?: Partial<Roadmap>): RoadmapPersonalizationInput {
  const levelMap: Record<string, 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'> = {
    Beginner: 'BEGINNER',
    BEGINNER: 'BEGINNER',
    Intermediate: 'INTERMEDIATE',
    INTERMEDIATE: 'INTERMEDIATE',
    Advanced: 'ADVANCED',
    ADVANCED: 'ADVANCED',
    Staff: 'ADVANCED',
    STAFF: 'ADVANCED',
  };

  const rawLevel = roadmap?.difficulty || 'INTERMEDIATE';
  const currentLevel = levelMap[rawLevel] || 'INTERMEDIATE';
  const targetRole = (roadmap?.rolePath || roadmap?.title || 'Software Engineer').trim().slice(0, 120);
  const targetOutcome = `Master ${roadmap?.title || 'Career Curriculum'}`.trim().slice(0, 160);
  const targetCompany = roadmap?.targetCompanyTier ? String(roadmap.targetCompanyTier).trim().slice(0, 120) : undefined;
  const preferredTechnologies = Array.isArray(roadmap?.tags) ? roadmap.tags.filter(Boolean).slice(0, 20) : [];

  return {
    currentLevel,
    targetRole: targetRole.length >= 2 ? targetRole : 'Software Engineer',
    targetCompany: targetCompany && targetCompany.length >= 2 ? targetCompany : undefined,
    targetOutcome: targetOutcome.length >= 2 ? targetOutcome : 'Master Career Track',
    hoursPerDay: 1.5,
    daysPerWeek: 5,
    sprintDurationDays: 7,
    learningPreferences: [],
    freeOnly: false,
    preferredTechnologies,
  };
}

export const roadmapApi = {
  /**
   * Generates a personalized 3-Pillar Career Roadmap from learner diagnostic inputs.
   * Calls POST /api/roadmap/generate
   */
  async generateRoadmap(input: RoadmapGenerationInput): Promise<RoadmapGenerationResult> {
    const response = await apiClient.post<{ success: boolean; data: RoadmapGenerationResult }>(
      '/roadmap/generate',
      input
    );
    return response.data.data;
  },

  /**
   * Enrolls/follows a roadmap by ID with personalization payload.
   * Calls POST /api/roadmap/:id/follow
   */
  async followRoadmap(id: string, personalization?: Partial<RoadmapPersonalizationInput>): Promise<UserRoadmapDTO> {
    const response = await apiClient.post<{ success: boolean; data: UserRoadmapDTO }>(
      `/roadmap/${id}/follow`,
      personalization || {}
    );
    return response.data.data;
  },

  /**
   * Fetches user's enrolled adaptive roadmaps with active sprints and tasks.
   * Calls GET /api/roadmap/adaptive
   */
  async getAdaptiveRoadmaps(): Promise<UserRoadmapDTO[]> {
    const response = await apiClient.get<{ success: boolean; data: UserRoadmapDTO[] }>('/roadmap/adaptive');
    return response.data.data;
  },

  /**
   * Fetches specific UserRoadmap details by userRoadmapId.
   * Calls GET /api/roadmap/adaptive/:userRoadmapId
   */
  async getAdaptiveRoadmap(userRoadmapId: string): Promise<UserRoadmapDTO> {
    const response = await apiClient.get<{ success: boolean; data: UserRoadmapDTO }>(`/roadmap/adaptive/${userRoadmapId}`);
    return response.data.data;
  },

  /**
   * Fetches calibrated readiness score and skill graph analytics.
   * Calls GET /api/roadmap/adaptive/:userRoadmapId/readiness
   */
  async getRoadmapReadiness(userRoadmapId: string): Promise<RoadmapReadinessAnalyticsDTO> {
    const response = await apiClient.get<{ success: boolean; data: RoadmapReadinessAnalyticsDTO }>(
      `/roadmap/adaptive/${userRoadmapId}/readiness`
    );
    return response.data.data;
  },

  /**
   * Fetches public catalog roadmaps.
   * Calls GET /api/roadmap/catalog
   */
  async getCatalog(): Promise<CareerRoadmapDTO[]> {
    const response = await apiClient.get<{ success: boolean; data: CareerRoadmapDTO[] }>('/roadmap/catalog');
    return response.data.data;
  },

  /**
   * Fetches roadmap by ID.
   * Calls GET /api/roadmap/:id
   */
  async getRoadmapById(id: string): Promise<CareerRoadmapDTO> {
    const response = await apiClient.get<{ success: boolean; data: CareerRoadmapDTO }>(`/roadmap/${id}`);
    return response.data.data;
  },

  /**
   * Submits interactive node challenge attempt.
   * Calls POST /api/roadmap/:id/attempt
   */
  async submitNodeAttempt(id: string, data: { nodeId: string; codeAnswer?: string }): Promise<unknown> {
    const response = await apiClient.post(`/roadmap/${id}/attempt`, data);
    return response.data;
  },

  /**
   * Updates progress of a sprint task.
   * Calls PATCH /api/roadmap/sprints/:sprintId/tasks/:taskId
   */
  async updateSprintTask(
    sprintId: string,
    taskId: string,
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'
  ): Promise<SprintTaskDTO> {
    const response = await apiClient.patch<{ success: boolean; data: SprintTaskDTO }>(
      `/roadmap/sprints/${sprintId}/tasks/${taskId}`,
      { status }
    );
    return response.data.data;
  },

  /**
   * Completes a sprint and triggers adaptive next sprint creation.
   * Calls POST /api/roadmap/sprints/:sprintId/complete
   */
  async completeSprint(
    sprintId: string,
    performance?: SprintPerformanceInput
  ): Promise<SprintReviewResultDTO> {
    const response = await apiClient.post<{ success: boolean; data: SprintReviewResultDTO }>(
      `/roadmap/sprints/${sprintId}/complete`,
      performance || {}
    );
    return response.data.data;
  },

  /**
   * Fetches deterministic unified sprint telemetry.
   * Calls GET /api/roadmap/sprints/:sprintId/telemetry
   */
  async getSprintTelemetry(sprintId: string): Promise<UnifiedSprintTelemetryDTO> {
    const response = await apiClient.get<{ success: boolean; data: UnifiedSprintTelemetryDTO }>(
      `/roadmap/sprints/${sprintId}/telemetry`
    );
    return response.data.data;
  },

  /**
   * Submits self-reported skill evidence for an enrolled UserRoadmap.
   * Calls POST /api/roadmap/adaptive/:userRoadmapId/evidence
   */
  async submitSkillEvidence(
    userRoadmapId: string,
    evidence: SelfReportedEvidenceInput
  ): Promise<SkillEvidenceDTO> {
    const response = await apiClient.post<{ success: boolean; data: SkillEvidenceDTO }>(
      `/roadmap/adaptive/${userRoadmapId}/evidence`,
      evidence
    );
    return response.data.data;
  },

  /**
   * Fetches assessment by assessmentId.
   * Calls GET /api/roadmap/assessments/:assessmentId
   */
  async getAssessment(assessmentId: string): Promise<MicroAssessmentDTO> {
    const response = await apiClient.get<{ success: boolean; data: MicroAssessmentDTO }>(
      `/roadmap/assessments/${assessmentId}`
    );
    return response.data.data;
  },

  /**
   * Fetches or generates assessment for a roadmap node or skill.
   * Calls GET /api/roadmap/assessments/nodes/:nodeId
   */
  async getAssessmentForNode(nodeId: string, skillId?: string): Promise<MicroAssessmentDTO> {
    const response = await apiClient.get<{ success: boolean; data: MicroAssessmentDTO }>(
      `/roadmap/assessments/nodes/${nodeId}`,
      { params: skillId ? { skillId } : undefined }
    );
    return response.data.data;
  },

  /**
   * Submits assessment answers for server-side grading and persistence.
   * Calls POST /api/roadmap/assessments/submit
   */
  async submitAssessment(input: SubmitAssessmentInput): Promise<AssessmentAttemptResultDTO> {
    const response = await apiClient.post<{ success: boolean; data: AssessmentAttemptResultDTO }>(
      `/roadmap/assessments/submit`,
      input
    );
    return response.data.data;
  },

  /**
   * Fetches user's past assessment attempts.
   * Calls GET /api/roadmap/assessments/user/attempts
   */
  async getUserAssessmentAttempts(assessmentId?: string): Promise<AssessmentAttemptResultDTO[]> {
    const response = await apiClient.get<{ success: boolean; data: AssessmentAttemptResultDTO[] }>(
      `/roadmap/assessments/user/attempts`,
      { params: assessmentId ? { assessmentId } : undefined }
    );
    return response.data.data;
  },

  /**
   * Evaluates practical coding drill in server-side sandbox and records SkillEvidence.
   * Calls POST /api/roadmap/drill/evaluate
   */
  async evaluatePracticalDrill(input: SubmitPracticalDrillInput): Promise<PracticalDrillResultDTO> {
    const response = await apiClient.post<{ success: boolean; data: PracticalDrillResultDTO }>(
      `/roadmap/drill/evaluate`,
      input
    );
    return response.data.data;
  },

  /**
   * Fetches server-authoritative verified career readiness profile.
   * Calls GET /api/roadmap/adaptive/:userRoadmapId/verified-profile
   */
  async getVerifiedProfile(userRoadmapId: string): Promise<VerifiedCareerProfileDTO> {
    const response = await apiClient.get<{ success: boolean; data: VerifiedCareerProfileDTO }>(
      `/roadmap/adaptive/${userRoadmapId}/verified-profile`
    );
    return response.data.data;
  },

  /**
   * Performs public verification lookup by verificationId.
   * Calls GET /api/roadmap/verify/:verificationId
   */
  async verifyPublicProfile(verificationId: string): Promise<PublicVerifiedProfileDTO> {
    const response = await apiClient.get<{ success: boolean; data: PublicVerifiedProfileDTO }>(
      `/roadmap/verify/${verificationId}`
    );
    return response.data.data;
  },

  /**
   * Fetches deterministic learning history & proof-of-work portfolio (Stage 7.1 / 7.2).
   * Calls GET /api/roadmap/adaptive/:userRoadmapId/history
   */
  async getRoadmapHistory(userRoadmapId: string): Promise<RoadmapLearningHistoryDTO> {
    const response = await apiClient.get<{ success: boolean; data: RoadmapLearningHistoryDTO }>(
      `/roadmap/adaptive/${userRoadmapId}/history`
    );
    return response.data.data;
  },

  /**
   * Fetches verified roadmap profile summary for the learner profile page (Stage 7.4).
   * Calls GET /api/roadmap/profile-summary or GET /api/roadmap/adaptive/:userRoadmapId/profile-summary
   */
  async getProfileSummary(userRoadmapId?: string): Promise<RoadmapProfileSummaryDTO | null> {
    const url = userRoadmapId
      ? `/roadmap/adaptive/${userRoadmapId}/profile-summary`
      : `/roadmap/profile-summary`;
    const response = await apiClient.get<{ success: boolean; data: RoadmapProfileSummaryDTO | null }>(
      url
    );
    return response.data.data;
  },

  /**
   * Fetches normalized candidate resume skills and ATS analysis prefill (Stage 8.1).
   * Calls GET /api/roadmap/resume-prefill
   */
  async getResumePrefill(options?: ResumeRoadmapPrefillInput): Promise<ResumeRoadmapPrefillDTO> {
    const response = await apiClient.get<{ success: boolean; data: ResumeRoadmapPrefillDTO }>(
      '/roadmap/resume-prefill',
      { params: options }
    );
    return response.data.data;
  },

  /**
   * Ingests completed mock/oral/coding interview telemetry into roadmap skill evidence (Stage 8.2).
   * Calls POST /api/roadmap/telemetry/interview
   */
  async ingestInterviewTelemetry(
    payload: InterviewTelemetryIngressDTO
  ): Promise<InterviewTelemetryIngressResultDTO> {
    const url = payload.userRoadmapId
      ? `/roadmap/adaptive/${payload.userRoadmapId}/telemetry/interview`
      : '/roadmap/telemetry/interview';
    const response = await apiClient.post<{ success: boolean; data: InterviewTelemetryIngressResultDTO }>(
      url,
      payload
    );
    return response.data.data;
  },

  /**
   * Fetches verifiable certificate metadata and eligibility for user roadmap (Stage 8.3).
   * Calls GET /api/roadmap/adaptive/:userRoadmapId/certificate
   */
  async getCertificate(userRoadmapId: string): Promise<VerifiableCertificateDTO> {
    const response = await apiClient.get<{ success: boolean; data: VerifiableCertificateDTO }>(
      `/roadmap/adaptive/${userRoadmapId}/certificate`
    );
    return response.data.data;
  },

  /**
   * Returns authenticated direct download URL for verifiable PDF certificate (Stage 8.3).
   */
  getCertificateDownloadUrl(userRoadmapId: string): string {
    return `/api/roadmap/adaptive/${userRoadmapId}/certificate/download`;
  },

  /**
   * Verifies certificate authenticity via verification ID (Stage 8.3).
   * Calls GET /api/roadmap/certificate/verify/:verificationId
   */
  async verifyCertificate(verificationId: string): Promise<CertificateVerificationResultDTO> {
    const response = await apiClient.get<{ success: boolean; data: CertificateVerificationResultDTO }>(
      `/roadmap/certificate/verify/${verificationId}`
    );
    return response.data.data;
  },

  /**
   * Fetches deterministic smart sprint notification feed for enrolled roadmap (Stage 8.4).
   * Calls GET /api/roadmap/adaptive/:userRoadmapId/notifications
   */
  async getSmartNotifications(
    userRoadmapId: string,
    referenceDate?: Date | string
  ): Promise<SmartSprintNotificationFeedDTO> {
    const response = await apiClient.get<{ success: boolean; data: SmartSprintNotificationFeedDTO }>(
      `/roadmap/adaptive/${userRoadmapId}/notifications`,
      { params: referenceDate ? { referenceDate: typeof referenceDate === 'string' ? referenceDate : referenceDate.toISOString() } : undefined }
    );
    return response.data.data;
  },

  /**
   * Updates user roadmap notification preferences (Stage 8.4).
   * Calls PATCH /api/roadmap/adaptive/:userRoadmapId/notifications/preferences
   */
  async updateNotificationPreferences(
    userRoadmapId: string,
    preferences: Partial<SmartNotificationPreferencesDTO>
  ): Promise<SmartNotificationPreferencesDTO> {
    const response = await apiClient.patch<{ success: boolean; data: SmartNotificationPreferencesDTO }>(
      `/roadmap/adaptive/${userRoadmapId}/notifications/preferences`,
      preferences
    );
    return response.data.data;
  },

  /**
   * Marks a specific smart notification as read (Stage 8.4).
   * Calls POST /api/roadmap/adaptive/:userRoadmapId/notifications/:notificationId/read
   */
  async markNotificationRead(
    userRoadmapId: string,
    notificationId: string
  ): Promise<{ success: boolean; unreadCount: number }> {
    const response = await apiClient.post<{ success: boolean; data: { success: boolean; unreadCount: number } }>(
      `/roadmap/adaptive/${userRoadmapId}/notifications/${notificationId}/read`
    );
    return response.data.data;
  },

  /**
   * Marks all smart notifications as read (Stage 8.4).
   * Calls POST /api/roadmap/adaptive/:userRoadmapId/notifications/mark-all-read
   */
  async markAllNotificationsRead(
    userRoadmapId: string
  ): Promise<{ success: boolean; unreadCount: number }> {
    const response = await apiClient.post<{ success: boolean; data: { success: boolean; unreadCount: number } }>(
      `/roadmap/adaptive/${userRoadmapId}/notifications/mark-all-read`
    );
    return response.data.data;
  },

  /**
   * Searches and filters verified candidates for recruiters (Stage 10.1).
   * Calls GET /api/roadmap/recruiter/search
   */
  async searchRecruiterTalent(
    query?: RecruiterTalentQueryDTO
  ): Promise<RecruiterTalentSearchResponseDTO> {
    const response = await apiClient.get<{ success: boolean; data: RecruiterTalentSearchResponseDTO }>(
      '/roadmap/recruiter/search',
      { params: query }
    );
    return response.data.data;
  },

  /**
   * Matches candidate pool against a target Job Description (Stage 10.2).
   * Calls POST /api/roadmap/recruiter/match-job
   */
  async matchJobDescription(
    input: JobDescriptionMatchInputDTO
  ): Promise<JobDescriptionMatchResponseDTO> {
    const response = await apiClient.post<{ success: boolean; data: JobDescriptionMatchResponseDTO }>(
      '/roadmap/recruiter/match-job',
      input
    );
    return response.data.data;
  },

  /**
   * Adds a candidate to recruiter's shortlist (Stage 10.3).
   * Calls POST /api/roadmap/recruiter/shortlist
   */
  async addToShortlist(
    input: AddToShortlistInputDTO
  ): Promise<RecruiterShortlistEntryDTO> {
    const response = await apiClient.post<{ success: boolean; data: RecruiterShortlistEntryDTO }>(
      '/roadmap/recruiter/shortlist',
      input
    );
    return response.data.data;
  },

  /**
   * Fetches recruiter's shortlist and candidate pipeline (Stage 10.3).
   * Calls GET /api/roadmap/recruiter/shortlist
   */
  async getShortlist(
    query?: RecruiterShortlistQueryDTO
  ): Promise<RecruiterShortlistResponseDTO> {
    const response = await apiClient.get<{ success: boolean; data: RecruiterShortlistResponseDTO }>(
      '/roadmap/recruiter/shortlist',
      { params: query }
    );
    return response.data.data;
  },

  /**
   * Fetches a specific candidate shortlist entry by ID (Stage 10.3).
   * Calls GET /api/roadmap/recruiter/shortlist/:id
   */
  async getShortlistEntryById(
    id: string
  ): Promise<RecruiterShortlistEntryDTO> {
    const response = await apiClient.get<{ success: boolean; data: RecruiterShortlistEntryDTO }>(
      `/roadmap/recruiter/shortlist/${id}`
    );
    return response.data.data;
  },

  /**
   * Updates pipeline status and/or recruiter notes for a shortlist entry (Stage 10.3).
   * Calls PATCH /api/roadmap/recruiter/shortlist/:id
   */
  async updateShortlistEntry(
    id: string,
    input: UpdateShortlistStatusInputDTO
  ): Promise<RecruiterShortlistEntryDTO> {
    const response = await apiClient.patch<{ success: boolean; data: RecruiterShortlistEntryDTO }>(
      `/roadmap/recruiter/shortlist/${id}`,
      input
    );
    return response.data.data;
  },

  /**
   * Removes a candidate from the recruiter's shortlist (Stage 10.3).
   * Calls DELETE /api/roadmap/recruiter/shortlist/:id
   */
  async removeFromShortlist(
    id: string
  ): Promise<{ success: boolean; id: string }> {
    const response = await apiClient.delete<{ success: boolean; data: { success: boolean; id: string } }>(
      `/roadmap/recruiter/shortlist/${id}`
    );
    return response.data.data;
  },

  /**
   * Fetches deterministic cohort & campus analytics (Stage 10.4).
   * Calls GET /api/roadmap/recruiter/analytics/cohort
   */
  async getCohortAnalytics(
    query?: CohortAnalyticsQueryDTO
  ): Promise<CohortAnalyticsResponseDTO> {
    const response = await apiClient.get<{ success: boolean; data: CohortAnalyticsResponseDTO }>(
      '/roadmap/recruiter/analytics/cohort',
      { params: query }
    );
    return response.data.data;
  },

  /**
   * Exports recruiter shortlist in CSV or JSON format (Stage 10.5).
   * Calls GET /api/roadmap/recruiter/shortlist/export
   */
  async exportRecruiterShortlist(
    query?: RecruiterExportQueryDTO
  ): Promise<ExportResultDTO> {
    const response = await apiClient.get<{ success: boolean; data: ExportResultDTO }>(
      '/roadmap/recruiter/shortlist/export',
      { params: query }
    );
    return response.data.data;
  },

  /**
   * Exports cohort analytics in CSV or JSON format (Stage 10.5).
   * Calls GET /api/roadmap/recruiter/analytics/export
   */
  async exportCohortAnalytics(
    query?: CohortExportQueryDTO
  ): Promise<ExportResultDTO> {
    const response = await apiClient.get<{ success: boolean; data: ExportResultDTO }>(
      '/roadmap/recruiter/analytics/export',
      { params: query }
    );
    return response.data.data;
  },

  /**
   * Exports candidate public verification record in CSV or JSON (Stage 10.5).
   * Calls GET /api/roadmap/verify/:verificationId/export
   */
  async exportVerificationRecord(
    verificationId: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<ExportResultDTO> {
    const response = await apiClient.get<{ success: boolean; data: ExportResultDTO }>(
      `/roadmap/verify/${verificationId}/export`,
      { params: { format } }
    );
    return response.data.data;
  },

  /**
   * Retrieves aggregate institutional cohort analytics and batch summary (Stage 11.1).
   * Calls GET /api/roadmap/institution/cohorts
   */
  async getInstitutionalCohortSummary(
    query?: InstitutionalCohortQueryDTO
  ): Promise<InstitutionalBatchSummaryDTO> {
    const response = await apiClient.get<{ success: boolean; data: InstitutionalBatchSummaryDTO }>(
      '/roadmap/institution/cohorts',
      { params: query }
    );
    return response.data.data;
  },

  /**
   * Retrieves overview of all batches / graduation cohorts for an institution (Stage 11.1).
   * Calls GET /api/roadmap/institution/cohorts/batches
   */
  async getInstitutionalBatches(
    query?: InstitutionalCohortQueryDTO
  ): Promise<InstitutionalBatchListResponseDTO> {
    const response = await apiClient.get<{ success: boolean; data: InstitutionalBatchListResponseDTO }>(
      '/roadmap/institution/cohorts/batches',
      { params: query }
    );
    return response.data.data;
  },

  /**
   * Submits candidate feedback and rubric evaluation (Stage 11.2).
   * Calls POST /api/roadmap/recruiter/feedback
   */
  async submitCandidateFeedback(
    input: SubmitCandidateFeedbackInputDTO
  ): Promise<CandidateCollaborativeFeedbackDTO> {
    const response = await apiClient.post<{ success: boolean; data: CandidateCollaborativeFeedbackDTO }>(
      '/roadmap/recruiter/feedback',
      input
    );
    return response.data.data;
  },

  /**
   * Updates candidate feedback and rubric evaluation (Stage 11.2).
   * Calls PATCH /api/roadmap/recruiter/feedback/:feedbackId
   */
  async updateCandidateFeedback(
    feedbackId: string,
    input: UpdateCandidateFeedbackInputDTO
  ): Promise<CandidateCollaborativeFeedbackDTO> {
    const response = await apiClient.patch<{ success: boolean; data: CandidateCollaborativeFeedbackDTO }>(
      `/roadmap/recruiter/feedback/${feedbackId}`,
      input
    );
    return response.data.data;
  },

  /**
   * Retrieves candidate collaborative feedback thread and audit activity (Stage 11.2).
   * Calls GET /api/roadmap/recruiter/candidates/:candidateId/collaboration
   */
  async getCandidateCollaborationThread(
    candidateId: string
  ): Promise<CandidateCollaborationThreadDTO> {
    const response = await apiClient.get<{ success: boolean; data: CandidateCollaborationThreadDTO }>(
      `/roadmap/recruiter/candidates/${candidateId}/collaboration`
    );
    return response.data.data;
  },

  /**
   * Lists all feedback submitted within the recruiter's organization (Stage 11.2).
   * Calls GET /api/roadmap/recruiter/feedback
   */
  async listOrganizationFeedback(
    query?: CandidateFeedbackQueryDTO
  ): Promise<{ feedback: CandidateCollaborativeFeedbackDTO[]; total: number }> {
    const response = await apiClient.get<{ success: boolean; data: { feedback: CandidateCollaborativeFeedbackDTO[]; total: number } }>(
      '/roadmap/recruiter/feedback',
      { params: query }
    );
    return response.data.data;
  },

  /**
   * Exports recruiter talent pipeline formatted for an ATS adapter (Stage 11.3).
   * Calls GET /api/roadmap/recruiter/ats/export
   */
  async exportRecruiterAtsPipeline(
    query?: AtsExportQueryDTO,
    download?: boolean
  ): Promise<ExportResultDTO> {
    const response = await apiClient.get<{ success: boolean; data: ExportResultDTO }>(
      '/roadmap/recruiter/ats/export',
      { params: { ...query, download: download ? 'true' : undefined } }
    );
    return response.data.data;
  },

  /**
   * Exports institutional cohort/batch candidates formatted for an ATS adapter (Stage 11.3).
   * Calls GET /api/roadmap/institution/ats/export
   */
  async exportInstitutionalAtsBatch(
    query?: AtsExportQueryDTO,
    download?: boolean
  ): Promise<ExportResultDTO> {
    const response = await apiClient.get<{ success: boolean; data: ExportResultDTO }>(
      '/roadmap/institution/ats/export',
      { params: { ...query, download: download ? 'true' : undefined } }
    );
    return response.data.data;
  },

  /**
   * Bulk verifies candidate credentials server-authoritatively (Stage 11.4).
   * Calls POST /api/roadmap/institution/credentials/verify-bulk or /verify/bulk
   */
  async bulkVerifyCredentials(
    input: BulkCredentialVerificationQueryDTO,
    endpoint: 'institution' | 'recruiter' | 'public' = 'institution'
  ): Promise<BulkCredentialVerificationResponseDTO> {
    const path =
      endpoint === 'recruiter'
        ? '/roadmap/recruiter/credentials/verify-bulk'
        : endpoint === 'public'
        ? '/roadmap/verify/bulk'
        : '/roadmap/institution/credentials/verify-bulk';

    const response = await apiClient.post<{
      success: boolean;
      data: BulkCredentialVerificationResponseDTO;
    }>(path, input);
    return response.data.data;
  },
};







