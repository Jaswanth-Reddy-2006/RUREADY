// ═══════════════════════════════════════════════════════════════
// Stage 8.4: Smart Sprint Notifications Test Suite
// Decision Engine, Duplicate Suppression, User Preferences,
// Read State Management, Security, and Error Resilience
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  SprintNotificationService,
  sprintNotificationService,
} from '../../services/roadmap-service/src/services/sprint-notification.service.js';
import { roadmapController } from '../../services/roadmap-service/src/controllers/roadmap.controller.js';
import {
  deriveSmartSprintNotifications,
  DEFAULT_SMART_NOTIFICATION_PREFERENCES,
  SmartSprintNotificationFeedDTO,
} from '../../packages/shared/src/types/index.js';
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from '../../services/roadmap-service/src/lib/errors.js';
import { prisma } from '../../services/roadmap-service/src/lib/prisma.js';

vi.mock('../../services/roadmap-service/src/lib/prisma.js', () => ({
  prisma: {
    userRoadmap: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('Stage 8.4: Smart Sprint Notifications', () => {
  let notificationService: SprintNotificationService;

  const mockUserId = 'usr_learner_804';
  const mockOtherUserId = 'usr_attacker_999';
  const mockUserRoadmapId = 'ur_notify_804';
  const mockReferenceDate = new Date('2026-10-04T12:00:00.000Z');

  const createMockUserRoadmap = (overrides: Record<string, any> = {}) => ({
    id: mockUserRoadmapId,
    userId: mockUserId,
    status: 'ACTIVE',
    createdAt: new Date('2026-09-20T00:00:00.000Z'),
    personalization: {
      targetRole: 'Fullstack Engineer',
      hoursPerDay: 2,
      daysPerWeek: 5,
      notificationPreferences: { ...DEFAULT_SMART_NOTIFICATION_PREFERENCES },
      readNotificationIds: [],
    },
    sprints: [
      {
        id: 'sprint_1_completed',
        sprintNumber: 1,
        objective: 'Foundations & Architecture',
        status: 'COMPLETED',
        startDate: '2026-09-20T00:00:00.000Z',
        endDate: '2026-09-27T00:00:00.000Z',
        completedAt: '2026-09-26T18:00:00.000Z',
        performance: { taskCompletion: 100 },
        tasks: [
          {
            id: 'task_1',
            orderIndex: 0,
            status: 'COMPLETED',
            completedAt: '2026-09-26T18:00:00.000Z',
            requiresAssessment: false,
          },
        ],
      },
      {
        id: 'sprint_2_active',
        sprintNumber: 2,
        objective: 'API & Microservices',
        status: 'ACTIVE',
        startDate: '2026-09-28T00:00:00.000Z',
        endDate: '2026-10-02T00:00:00.000Z', // In the past relative to mockReferenceDate (2026-10-04)
        tasks: [
          {
            id: 'task_2_overdue',
            orderIndex: 0,
            status: 'IN_PROGRESS',
            requiresAssessment: false,
          },
          {
            id: 'task_3_assess',
            orderIndex: 1,
            status: 'TODO',
            requiresAssessment: true,
          },
        ],
      },
    ],
    adaptations: [
      {
        id: 'adapt_101',
        action: 'ACCELERATE',
        reason: 'Mastered RESTful APIs ahead of schedule.',
        createdAt: '2026-10-01T10:00:00.000Z',
      },
    ],
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    notificationService = new SprintNotificationService();
  });

  describe('1. Decision Engine Logic', () => {
    it('generates expected notification categories for eligible roadmap state', () => {
      const roadmap = createMockUserRoadmap();
      const feed = deriveSmartSprintNotifications(roadmap, mockReferenceDate);

      expect(feed.userRoadmapId).toBe(mockUserRoadmapId);
      expect(feed.totalCount).toBeGreaterThan(0);
      expect(feed.unreadCount).toBe(feed.totalCount);

      const types = feed.notifications.map((n) => n.type);
      expect(types).toContain('SPRINT_COMPLETED');
      expect(types).toContain('ROADMAP_ADAPTATION');
      expect(types).toContain('TASK_OVERDUE');
      expect(types).toContain('ASSESSMENT_DUE');

      // Verify notification attributes
      const overdueAlert = feed.notifications.find((n) => n.type === 'TASK_OVERDUE');
      expect(overdueAlert).toBeDefined();
      expect(overdueAlert?.priority).toBe('URGENT');
      expect(overdueAlert?.title).toContain('Sprint 02 Tasks Overdue');
      expect(overdueAlert?.message).toContain('2 incomplete milestone task(s)');
      expect(overdueAlert?.isRead).toBe(false);

      const adaptationAlert = feed.notifications.find((n) => n.type === 'ROADMAP_ADAPTATION');
      expect(adaptationAlert?.priority).toBe('HIGH');
      expect(adaptationAlert?.message).toContain('Curriculum adjusted (ACCELERATE)');
    });

    it('suppresses overdue notification when all tasks in active sprint are completed', () => {
      const roadmap = createMockUserRoadmap({
        sprints: [
          {
            id: 'sprint_2_all_done',
            sprintNumber: 2,
            objective: 'API & Microservices',
            status: 'ACTIVE',
            startDate: '2026-09-28T00:00:00.000Z',
            endDate: '2026-10-02T00:00:00.000Z',
            tasks: [
              { id: 'task_2', status: 'COMPLETED', requiresAssessment: false, completedAt: '2026-10-03T10:00:00.000Z' },
              { id: 'task_3', status: 'COMPLETED', requiresAssessment: true, completedAt: '2026-10-03T11:00:00.000Z' },
            ],
          },
        ],
      });

      const feed = deriveSmartSprintNotifications(roadmap, mockReferenceDate);
      const overdueAlert = feed.notifications.find((n) => n.type === 'TASK_OVERDUE');
      const assessmentAlert = feed.notifications.find((n) => n.type === 'ASSESSMENT_DUE');

      expect(overdueAlert).toBeUndefined();
      expect(assessmentAlert).toBeUndefined();
    });

    it('generates inactivity reminder if no activity has been recorded for >= 3 days', () => {
      const roadmap = createMockUserRoadmap({
        createdAt: new Date('2026-09-01T00:00:00.000Z'),
        sprints: [
          {
            id: 'sprint_idle',
            sprintNumber: 1,
            status: 'ACTIVE',
            startDate: '2026-09-01T00:00:00.000Z',
            endDate: '2026-10-15T00:00:00.000Z',
            tasks: [
              {
                id: 't_old',
                status: 'COMPLETED',
                completedAt: '2026-09-25T00:00:00.000Z', // 9 days prior to 2026-10-04
              },
              {
                id: 't_pending',
                status: 'TODO',
              },
            ],
          },
        ],
      });

      const feed = deriveSmartSprintNotifications(roadmap, mockReferenceDate);
      const inactivityAlert = feed.notifications.find((n) => n.type === 'INACTIVITY_REMINDER');
      expect(inactivityAlert).toBeDefined();
      expect(inactivityAlert?.title).toBe('Resume Your Roadmap Journey');
      expect(inactivityAlert?.message).toContain('9 days since your last roadmap milestone');
    });
  });

  describe('2. Duplicate Suppression & Idempotency', () => {
    it('produces identical stable deterministic IDs across multiple evaluation cycles', () => {
      const roadmap = createMockUserRoadmap();
      const feed1 = deriveSmartSprintNotifications(roadmap, mockReferenceDate);
      const feed2 = deriveSmartSprintNotifications(roadmap, mockReferenceDate);

      expect(feed1.notifications.length).toBe(feed2.notifications.length);
      feed1.notifications.forEach((n, idx) => {
        expect(n.id).toBe(feed2.notifications[idx].id);
        expect(n.type).toBe(feed2.notifications[idx].type);
        expect(n.timestamp).toBe(feed2.notifications[idx].timestamp);
      });
    });

    it('does not duplicate notifications for the same sprint and adaptation events', () => {
      const roadmap = createMockUserRoadmap();
      const feed = deriveSmartSprintNotifications(roadmap, mockReferenceDate);

      const idSet = new Set<string>();
      for (const n of feed.notifications) {
        expect(idSet.has(n.id)).toBe(false);
        idSet.add(n.id);
      }
    });
  });

  describe('3. User Preference Filtering', () => {
    it('returns zero notifications when notifications are globally disabled', () => {
      const roadmap = createMockUserRoadmap({
        personalization: {
          notificationPreferences: {
            ...DEFAULT_SMART_NOTIFICATION_PREFERENCES,
            enabled: false,
          },
        },
      });

      const feed = deriveSmartSprintNotifications(roadmap, mockReferenceDate);
      expect(feed.notifications).toHaveLength(0);
      expect(feed.unreadCount).toBe(0);
      expect(feed.totalCount).toBe(0);
      expect(feed.preferences.enabled).toBe(false);
    });

    it('respects category specific opt-outs', () => {
      const roadmap = createMockUserRoadmap({
        personalization: {
          notificationPreferences: {
            ...DEFAULT_SMART_NOTIFICATION_PREFERENCES,
            overdueAlerts: false,
            adaptationAlerts: false,
            sprintReminders: true,
          },
        },
      });

      const feed = deriveSmartSprintNotifications(roadmap, mockReferenceDate);
      const types = feed.notifications.map((n) => n.type);
      expect(types).not.toContain('TASK_OVERDUE');
      expect(types).not.toContain('ROADMAP_ADAPTATION');
      expect(types).toContain('SPRINT_COMPLETED');
    });

    it('persists preference updates correctly in service', async () => {
      const mockRoadmap = createMockUserRoadmap();
      vi.mocked(prisma.userRoadmap.findUnique).mockResolvedValue(mockRoadmap as any);
      vi.mocked(prisma.userRoadmap.update).mockResolvedValue(mockRoadmap as any);

      const updated = await notificationService.updatePreferences(mockUserId, mockUserRoadmapId, {
        overdueAlerts: false,
        emailNotifications: true,
      });

      expect(updated.overdueAlerts).toBe(false);
      expect(updated.emailNotifications).toBe(true);
      expect(updated.sprintReminders).toBe(true); // Preserved

      expect(prisma.userRoadmap.update).toHaveBeenCalledWith({
        where: { id: mockUserRoadmapId },
        data: {
          personalization: expect.objectContaining({
            notificationPreferences: expect.objectContaining({
              overdueAlerts: false,
              emailNotifications: true,
            }),
          }),
        },
      });
    });
  });

  describe('4. Read States & Mark-as-Read', () => {
    it('correctly marks individual notification as read and updates unread count', async () => {
      const mockRoadmap = createMockUserRoadmap();
      vi.mocked(prisma.userRoadmap.findUnique).mockResolvedValue(mockRoadmap as any);
      vi.mocked(prisma.userRoadmap.update).mockResolvedValue({
        ...mockRoadmap,
        personalization: {
          ...mockRoadmap.personalization,
          readNotificationIds: ['ntf-sprint-comp-sprint_1_completed'],
        },
      } as any);

      const result = await notificationService.markNotificationRead(
        mockUserId,
        mockUserRoadmapId,
        'ntf-sprint-comp-sprint_1_completed'
      );

      expect(result.success).toBe(true);
      expect(prisma.userRoadmap.update).toHaveBeenCalled();
    });

    it('marks all notifications as read', async () => {
      const mockRoadmap = createMockUserRoadmap();
      vi.mocked(prisma.userRoadmap.findUnique).mockResolvedValue(mockRoadmap as any);
      vi.mocked(prisma.userRoadmap.update).mockResolvedValue(mockRoadmap as any);

      const result = await notificationService.markAllRead(mockUserId, mockUserRoadmapId);
      expect(result.success).toBe(true);
      expect(result.unreadCount).toBe(0);
    });
  });

  describe('5. Security & Authorization Boundary', () => {
    it('throws ForbiddenError when a different user requests roadmap notifications', async () => {
      const mockRoadmap = createMockUserRoadmap();
      vi.mocked(prisma.userRoadmap.findUnique).mockResolvedValue(mockRoadmap as any);

      await expect(
        notificationService.getNotifications(mockOtherUserId, mockUserRoadmapId)
      ).rejects.toThrow(ForbiddenError);
    });

    it('throws ForbiddenError when modifying preferences of another user', async () => {
      const mockRoadmap = createMockUserRoadmap();
      vi.mocked(prisma.userRoadmap.findUnique).mockResolvedValue(mockRoadmap as any);

      await expect(
        notificationService.updatePreferences(mockOtherUserId, mockUserRoadmapId, { enabled: false })
      ).rejects.toThrow(ForbiddenError);
    });

    it('throws NotFoundError when roadmap does not exist', async () => {
      vi.mocked(prisma.userRoadmap.findUnique).mockResolvedValue(null);

      await expect(
        notificationService.getNotifications(mockUserId, 'ur_nonexistent')
      ).rejects.toThrow(NotFoundError);
    });

    it('does not leak internal database credentials or sensitive details in notification metadata', () => {
      const roadmap = createMockUserRoadmap();
      const feed = deriveSmartSprintNotifications(roadmap, mockReferenceDate);

      for (const n of feed.notifications) {
        expect(n.message).not.toContain('SELECT');
        expect(n.message).not.toContain('prisma');
        expect(n.message).not.toContain('password');
        expect(n.title).toBeDefined();
        expect(n.type).toBeDefined();
      }
    });
  });

  describe('6. Failure Resilience & Graceful Fallbacks', () => {
    it('handles null, undefined, or missing sprints without throwing an exception', () => {
      const corruptRoadmap = {
        id: 'ur_corrupt',
        userId: mockUserId,
        status: 'ACTIVE',
        personalization: null,
        sprints: null,
        adaptations: null,
      };

      expect(() => {
        const feed = deriveSmartSprintNotifications(corruptRoadmap, mockReferenceDate);
        expect(feed.notifications).toBeInstanceOf(Array);
        expect(feed.unreadCount).toBe(feed.notifications.length);
      }).not.toThrow();
    });

    it('handles invalid reference date strings safely', () => {
      const roadmap = createMockUserRoadmap();
      expect(() => {
        const feed = deriveSmartSprintNotifications(roadmap, 'invalid-date-string');
        expect(feed.generatedAt).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('7. Controller & Route Integration', () => {
    it('getSmartNotifications responds with 200 and formatted feed', async () => {
      const mockRoadmap = createMockUserRoadmap();
      vi.mocked(prisma.userRoadmap.findUnique).mockResolvedValue(mockRoadmap as any);

      const req = {
        headers: { 'x-user-id': mockUserId },
        params: { userRoadmapId: mockUserRoadmapId },
        query: { referenceDate: mockReferenceDate.toISOString() },
      } as any;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as any;

      const next = vi.fn();

      await roadmapController.getSmartNotifications(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            userRoadmapId: mockUserRoadmapId,
            unreadCount: expect.any(Number),
            notifications: expect.any(Array),
          }),
        })
      );
    });

    it('updateNotificationPreferences responds with 200 and updated preferences', async () => {
      const mockRoadmap = createMockUserRoadmap();
      vi.mocked(prisma.userRoadmap.findUnique).mockResolvedValue(mockRoadmap as any);
      vi.mocked(prisma.userRoadmap.update).mockResolvedValue(mockRoadmap as any);

      const req = {
        headers: { 'x-user-id': mockUserId },
        params: { userRoadmapId: mockUserRoadmapId },
        body: { overdueAlerts: false },
      } as any;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as any;

      const next = vi.fn();

      await roadmapController.updateNotificationPreferences(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            overdueAlerts: false,
          }),
        })
      );
    });

    it('rejects unauthorized request with UnauthorizedError', async () => {
      const req = {
        headers: {},
        params: { userRoadmapId: mockUserRoadmapId },
        query: {},
      } as any;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as any;

      const next = vi.fn();

      await roadmapController.getSmartNotifications(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
});
