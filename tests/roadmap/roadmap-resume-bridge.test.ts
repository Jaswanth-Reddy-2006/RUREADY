// ═══════════════════════════════════════════════════════════════
// Stage 8.1: Resume-to-Roadmap AI Skill Bridge Tests
// Verified Integration, Normalization, Security, & Error Handling
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  ResumeBridgeService,
  resumeBridgeService,
  RawResumeRecord,
  RawUserProfileRecord,
  RawAtsMatchRecord,
} from '../../services/roadmap-service/src/services/resume-bridge.service.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import {
  normalizeSkillName,
  normalizeSkillList,
  CANONICAL_SKILL_ALIASES,
  ResumeRoadmapPrefillDTO,
} from '../../packages/shared/src/types/index.js';
import { UnauthorizedError, ForbiddenError, NotFoundError } from '../../services/roadmap-service/src/lib/errors.js';
import { roadmapGeneratorEngine } from '../../services/roadmap-service/src/engine/roadmap-generator.engine.js';

describe('Stage 8.1: Resume-to-Roadmap AI Skill Bridge', () => {
  let bridgeService: ResumeBridgeService;

  beforeEach(() => {
    vi.clearAllMocks();
    bridgeService = new ResumeBridgeService();
    bridgeService.clearMemoryStore();
    resumeBridgeService.clearMemoryStore();
  });

  describe('A. Skill Normalization & Alias Mapping', () => {
    it('1. Normalizes framework and language aliases to canonical forms', () => {
      expect(normalizeSkillName('react.js')).toBe('React');
      expect(normalizeSkillName('REACTJS')).toBe('React');
      expect(normalizeSkillName('node.js')).toBe('Node.js');
      expect(normalizeSkillName('nodejs')).toBe('Node.js');
      expect(normalizeSkillName('postgres')).toBe('PostgreSQL');
      expect(normalizeSkillName('postgresql')).toBe('PostgreSQL');
      expect(normalizeSkillName('k8s')).toBe('Kubernetes');
      expect(normalizeSkillName('kubernetes')).toBe('Kubernetes');
      expect(normalizeSkillName('ts')).toBe('TypeScript');
      expect(normalizeSkillName('py')).toBe('Python');
      expect(normalizeSkillName('fastapi')).toBe('FastAPI');
      expect(normalizeSkillName('aws')).toBe('AWS');
      expect(normalizeSkillName('system design')).toBe('System Design');
      expect(normalizeSkillName('hld')).toBe('High-Level Design (HLD)');
    });

    it('2. Preserves unknown or non-aliased skills with clean formatting', () => {
      expect(normalizeSkillName('Solidity')).toBe('Solidity');
      expect(normalizeSkillName('  Figma  ')).toBe('Figma');
      expect(normalizeSkillName('TailwindCSS')).toBe('TailwindCSS');
      expect(normalizeSkillName('')).toBe('');
    });

    it('3. Deduplicates case-variant and alias-duplicate skill lists', () => {
      const rawSkills = [
        'React',
        'react.js',
        'REACTJS',
        'Node.js',
        'nodejs',
        'PostgreSQL',
        'postgres',
        'Docker',
        'docker',
        'Kubernetes',
        'k8s',
        'TypeScript',
        'ts',
      ];

      const normalized = normalizeSkillList(rawSkills);
      expect(normalized).toEqual([
        'React',
        'Node.js',
        'PostgreSQL',
        'Docker',
        'Kubernetes',
        'TypeScript',
      ]);
      expect(normalized.length).toBe(6);
    });

    it('4. Handles empty or non-array skill lists safely without throwing', () => {
      expect(normalizeSkillList([])).toEqual([]);
      expect(normalizeSkillList(null as any)).toEqual([]);
      expect(normalizeSkillList(undefined as any)).toEqual([]);
      expect(normalizeSkillList(['', '   ', null as any])).toEqual([]);
    });
  });

  describe('B. Resume-to-Roadmap Prefill Synthesis', () => {
    it('5. Successfully synthesizes ResumeRoadmapPrefillDTO from user resume', async () => {
      const userId = 'usr-candidate-1';
      bridgeService.setMockProfile({
        id: 'prof-1',
        userId,
        name: 'Sarah Chen',
        title: 'Backend Developer',
        experienceYears: 3,
        targetRoles: ['Backend Engineer'],
      });

      bridgeService.setMockResume({
        id: 'res-101',
        userId,
        fileName: 'Sarah_Chen_Senior_Resume.pdf',
        skills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'redis', 'react.js'],
        uploadedAt: new Date('2026-03-01T10:00:00Z'),
      });

      const prefill = await bridgeService.getResumePrefill(userId, { resumeId: 'res-101' });

      expect(prefill.resumeId).toBe('res-101');
      expect(prefill.fileName).toBe('Sarah_Chen_Senior_Resume.pdf');
      expect(prefill.candidateName).toBe('Sarah Chen');
      expect(prefill.suggestedTargetRole).toBe('Backend Engineer');
      expect(prefill.suggestedLevel).toBe('INTERMEDIATE');
      expect(prefill.suggestedCompanyTier).toBe('FAANG');
      expect(prefill.source).toBe('RESUME_PROFILE');
      expect(prefill.knownSkills).toContain('TypeScript');
      expect(prefill.knownSkills).toContain('Node.js');
      expect(prefill.knownSkills).toContain('PostgreSQL');
      expect(prefill.knownSkills).toContain('Docker');
      expect(prefill.knownSkills).toContain('Redis');
      expect(prefill.knownSkills).toContain('React');
      expect(prefill.identifiedBlindspots).toEqual([]); // No ATS gaps fabricated
      expect(prefill.rawSkillCount).toBe(6);
      expect(prefill.normalizedSkillCount).toBe(6);
    });

    it('6. Enriches prefill with verified gaps when ATS match report exists', async () => {
      const userId = 'usr-candidate-2';
      bridgeService.setMockProfile({
        id: 'prof-2',
        userId,
        name: 'Alex Rivera',
        title: 'Software Engineer',
        experienceYears: 6,
        targetRoles: ['Staff Distributed System Architect'],
      });

      bridgeService.setMockResume({
        id: 'res-202',
        userId,
        fileName: 'Alex_Rivera_CV.pdf',
        skills: ['Go', 'Postgres', 'Docker', 'gRPC'],
        uploadedAt: new Date('2026-03-02T12:00:00Z'),
      });

      bridgeService.setMockAtsMatch({
        id: 'ats-909',
        userId,
        jobTitle: 'Staff Distributed System Architect',
        companyName: 'Citadel FinTech',
        matchScore: 78,
        summary: 'Strong backend systems background with distributed messaging gaps.',
        matchedSkills: ['Go', 'PostgreSQL', 'Docker'],
        missingSkills: ['Kafka', 'k8s', 'system design'],
        experienceMatch: 'Exceeds standard senior bar',
        createdAt: new Date('2026-03-02T14:00:00Z'),
      });

      const prefill = await bridgeService.getResumePrefill(userId, {
        resumeId: 'res-202',
        atsMatchId: 'ats-909',
      });

      expect(prefill.source).toBe('ATS_ANALYSIS');
      expect(prefill.suggestedTargetRole).toBe('Staff Distributed System Architect');
      expect(prefill.suggestedCompanyTier).toBe('Tier-1 FinTech');
      expect(prefill.suggestedLevel).toBe('ADVANCED');
      expect(prefill.atsMatchScore).toBe(78);
      expect(prefill.summary).toContain('Strong backend systems');

      // Verified known skills
      expect(prefill.knownSkills).toContain('Go');
      expect(prefill.knownSkills).toContain('PostgreSQL');
      expect(prefill.knownSkills).toContain('Docker');

      // Verified ATS gaps mapped into blindspots
      expect(prefill.identifiedBlindspots).toContain('Kafka');
      expect(prefill.identifiedBlindspots).toContain('Kubernetes');
      expect(prefill.identifiedBlindspots).toContain('System Design');
    });

    it('7. Derives suggested level accurately from experience years', async () => {
      const testCases = [
        { years: 0, expected: 'BEGINNER' },
        { years: 1, expected: 'BEGINNER' },
        { years: 3, expected: 'INTERMEDIATE' },
        { years: 5, expected: 'ADVANCED' },
        { years: 10, expected: 'STAFF' },
      ];

      for (const tc of testCases) {
        bridgeService.clearMemoryStore();
        const uid = `usr-exp-${tc.years}`;
        bridgeService.setMockProfile({
          id: `prof-${tc.years}`,
          userId: uid,
          name: 'Test Candidate',
          experienceYears: tc.years,
        });
        bridgeService.setMockResume({
          id: `res-${tc.years}`,
          userId: uid,
          fileName: 'resume.pdf',
          skills: ['Python'],
          uploadedAt: new Date(),
        });

        const prefill = await bridgeService.getResumePrefill(uid);
        expect(prefill.suggestedLevel).toBe(tc.expected);
      }
    });

    it('8. Safely returns empty prefill when no resume exists without throwing error', async () => {
      const prefill = await bridgeService.getResumePrefill('usr-no-resume');
      expect(prefill.source).toBe('MANUAL');
      expect(prefill.knownSkills).toEqual([]);
      expect(prefill.identifiedBlindspots).toEqual([]);
      expect(prefill.rawSkillCount).toBe(0);
      expect(prefill.normalizedSkillCount).toBe(0);
    });
  });

  describe('C. Security, Authorization & Privacy Isolation', () => {
    it('9. Denies access when requesting another user resume ID (403 Forbidden)', async () => {
      bridgeService.setMockResume({
        id: 'res-private-owner',
        userId: 'usr-victim',
        fileName: 'Victim_Confidential_Resume.pdf',
        skills: ['Secret AI Tech'],
        uploadedAt: new Date(),
      });

      await expect(
        bridgeService.getResumePrefill('usr-attacker', { resumeId: 'res-private-owner' })
      ).rejects.toThrow(ForbiddenError);
    });

    it('10. Denies access when requesting another user ATS Match ID (403 Forbidden)', async () => {
      bridgeService.setMockAtsMatch({
        id: 'ats-private-match',
        userId: 'usr-victim',
        jobTitle: 'Confidential Lead',
        matchScore: 99,
        summary: 'Secret audit',
        matchedSkills: [],
        missingSkills: [],
        createdAt: new Date(),
      });

      await expect(
        bridgeService.getResumePrefill('usr-attacker', { atsMatchId: 'ats-private-match' })
      ).rejects.toThrow(ForbiddenError);
    });

    it('11. Throws UnauthorizedError when unauthenticated', async () => {
      await expect(bridgeService.getResumePrefill('')).rejects.toThrow(UnauthorizedError);
      await expect(bridgeService.getResumePrefill(null as any)).rejects.toThrow(UnauthorizedError);
    });

    it('12. Completely excludes private personal identifiers from DTO payload', async () => {
      const userId = 'usr-privacy-test';
      bridgeService.setMockProfile({
        id: 'prof-priv',
        userId,
        name: 'Jane Doe',
      });
      bridgeService.setMockResume({
        id: 'res-priv',
        userId,
        fileName: 'Jane_Doe_Resume.pdf',
        skills: ['React', 'TypeScript'],
        uploadedAt: new Date(),
      });

      const prefill = await bridgeService.getResumePrefill(userId);

      // Verify no leaked private keys
      expect((prefill as any).email).toBeUndefined();
      expect((prefill as any).phoneNumber).toBeUndefined();
      expect((prefill as any).address).toBeUndefined();
      expect((prefill as any).parsedText).toBeUndefined();
      expect((prefill as any).filePath).toBeUndefined();
    });
  });

  describe('D. Controller & API Integration', () => {
    it('13. Controller getResumePrefill returns HTTP 200 with standard envelope', async () => {
      resumeBridgeService.clearMemoryStore();
      const userId = 'usr-controller-test';
      resumeBridgeService.setMockProfile({
        id: 'prof-ctrl',
        userId,
        name: 'Jordan Lee',
        title: 'Fullstack Engineer',
        experienceYears: 2,
      });
      resumeBridgeService.setMockResume({
        id: 'res-ctrl',
        userId,
        fileName: 'Jordan_Resume.pdf',
        skills: ['React', 'Node.js', 'Postgres'],
        uploadedAt: new Date(),
      });

      const req: any = {
        headers: { 'x-user-id': userId },
        query: { resumeId: 'res-ctrl' },
        body: {},
      };

      let jsonPayload: any = null;
      let statusCode = 0;
      const res: any = {
        status: (code: number) => {
          statusCode = code;
          return {
            json: (data: any) => {
              jsonPayload = data;
            },
          };
        },
      };
      const next = vi.fn();

      await roadmapController.getResumePrefill(req, res, next);

      expect(statusCode).toBe(200);
      expect(jsonPayload.success).toBe(true);
      expect(jsonPayload.data.fileName).toBe('Jordan_Resume.pdf');
      expect(jsonPayload.data.knownSkills).toEqual(['React', 'Node.js', 'PostgreSQL']);
      expect(next).not.toHaveBeenCalled();
    });

    it('14. Controller handles unauthorized request by passing error to next', async () => {
      const req: any = {
        headers: {},
        query: {},
        body: {},
      };
      const res: any = {};
      const next = vi.fn();

      await roadmapController.getResumePrefill(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('E. End-to-End Generation Engine Integration', () => {
    it('15. Seamlessly generates personalized roadmap using resume prefill data', async () => {
      const prefill: ResumeRoadmapPrefillDTO = {
        resumeId: 'res-e2e-1',
        candidateName: 'Elena Rostova',
        suggestedTargetRole: 'FULLSTACK',
        suggestedCompanyTier: 'FAANG',
        suggestedLevel: 'INTERMEDIATE',
        knownSkills: ['React', 'Node.js', 'PostgreSQL'],
        identifiedBlindspots: ['Distributed Message Queues & Event-Driven Architecture (Kafka)'],
        source: 'ATS_ANALYSIS',
        rawSkillCount: 4,
        normalizedSkillCount: 4,
      };

      const mockPersist = vi.spyOn(
        (roadmapGeneratorEngine as any).persistenceService,
        'persistRoadmap'
      ).mockImplementation(async (params: any) => ({
        id: params.backendContext?.id || 'mock_rdmp_id',
        userId: params.backendContext?.userId || 'mock_user_id',
        title: params.generatedRoadmap?.title || 'Mock Roadmap',
        description: params.generatedRoadmap?.description || 'Mock Description',
        rolePath: params.generatedRoadmap?.rolePath || 'FULLSTACK',
        targetCompanyTier: params.generatedRoadmap?.targetCompanyTier || 'FAANG',
        difficulty: params.generatedRoadmap?.difficulty || 'INTERMEDIATE',
        overallReadiness: 50,
        estimatedWeeks: 12,
        isOfficial: params.backendContext?.isOfficial || false,
        isPublic: params.backendContext?.isPublic || true,
        isAiGenerated: true,
        creatorId: params.backendContext?.userId || 'mock_user_id',
        enrolledCount: 0,
        upvotes: 0,
        tags: [],
        phases: params.generatedRoadmap?.phases || [],
        nodesData: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      const result = await roadmapGeneratorEngine.generateRoadmap(
        {
          targetRole: prefill.suggestedTargetRole!,
          targetCompanyTier: prefill.suggestedCompanyTier,
          currentLevel: prefill.suggestedLevel,
          knownSkills: prefill.knownSkills,
          identifiedBlindspots: prefill.identifiedBlindspots,
          timelineWeeks: 12,
          hoursPerDay: 2,
          daysPerWeek: 5,
        },
        {
          id: 'rdmp_resume_e2e',
          userId: 'usr-e2e-tester',
          creatorName: prefill.candidateName,
          creatorUsername: 'elena_rostova',
          isOfficial: false,
          isPublic: true,
          isAiGenerated: true,
        }
      );

      expect(result.roadmap).toBeDefined();
      expect(result.roadmap.title).toContain('Full Stack');
      expect(result.skillGapAnalysis).toBeDefined();
      expect(result.skillGapAnalysis.targetRole).toBe('FULLSTACK');

      // Verify that candidate known skills from resume were evaluated in gap analysis
      const reactGap = result.skillGapAnalysis.skillGaps.find((g) => g.skillName.includes('React'));
      if (reactGap) {
        expect(reactGap.currentProficiency).toBeGreaterThanOrEqual(50);
      }

      mockPersist.mockRestore();
    });

    it('16. Manual roadmap generation remains 100% functional without resume prefill', async () => {
      const mockPersist = vi.spyOn(
        (roadmapGeneratorEngine as any).persistenceService,
        'persistRoadmap'
      ).mockImplementation(async (params: any) => ({
        id: params.backendContext?.id || 'mock_rdmp_id',
        userId: params.backendContext?.userId || 'mock_user_id',
        title: params.generatedRoadmap?.title || 'Mock Roadmap',
        description: params.generatedRoadmap?.description || 'Mock Description',
        rolePath: params.generatedRoadmap?.rolePath || 'BACKEND',
        targetCompanyTier: params.generatedRoadmap?.targetCompanyTier || 'Unicorn',
        difficulty: params.generatedRoadmap?.difficulty || 'ADVANCED',
        overallReadiness: 20,
        estimatedWeeks: 8,
        isOfficial: params.backendContext?.isOfficial || false,
        isPublic: params.backendContext?.isPublic || true,
        isAiGenerated: true,
        creatorId: params.backendContext?.userId || 'mock_user_id',
        enrolledCount: 0,
        upvotes: 0,
        tags: [],
        phases: params.generatedRoadmap?.phases || [],
        nodesData: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      const result = await roadmapGeneratorEngine.generateRoadmap(
        {
          targetRole: 'BACKEND',
          targetCompanyTier: 'Unicorn',
          currentLevel: 'ADVANCED',
          knownSkills: ['Go', 'Docker'],
          timelineWeeks: 8,
          hoursPerDay: 3,
          daysPerWeek: 5,
        },
        {
          id: 'rdmp_manual_test',
          userId: 'usr-manual-tester',
          isOfficial: false,
          isPublic: true,
          isAiGenerated: true,
        }
      );

      expect(result.roadmap).toBeDefined();
      expect(result.roadmap.rolePath.toUpperCase()).toBe('BACKEND');
      expect(result.skillGapAnalysis.targetRole).toBe('BACKEND');

      mockPersist.mockRestore();
    });
  });
});
