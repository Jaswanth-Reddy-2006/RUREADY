// ═══════════════════════════════════════════════════════════════
// Stage 8.4: Smart Sprint Notification Service
// Server-Authoritative Deterministic Notification Decision Engine
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import {
  SmartNotificationPreferencesDTO,
  SmartSprintNotificationFeedDTO,
  DEFAULT_SMART_NOTIFICATION_PREFERENCES,
  deriveSmartSprintNotifications,
} from '@ru-ready/shared';
import { NotFoundError, ForbiddenError } from '../lib/errors.js';

interface PersonalizationState {
  notificationPreferences?: SmartNotificationPreferencesDTO;
  readNotificationIds?: string[];
  [key: string]: unknown;
}

export class SprintNotificationService {
  /**
   * Generates a deterministic, server-authoritative notification feed for a learner's roadmap.
   */
  public async getNotifications(
    userId: string,
    userRoadmapId: string,
    referenceDate = new Date()
  ): Promise<SmartSprintNotificationFeedDTO> {
    const userRoadmap = await prisma.userRoadmap.findUnique({
      where: { id: userRoadmapId },
      include: {
        sprints: {
          include: {
            tasks: {
              orderBy: { orderIndex: 'asc' },
            },
            performance: true,
          },
          orderBy: { sprintNumber: 'asc' },
        },
        adaptations: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!userRoadmap) {
      throw new NotFoundError('User roadmap not found');
    }

    if (userRoadmap.userId !== userId) {
      throw new ForbiddenError('You are not authorized to access notifications for this roadmap');
    }

    // Deterministic generation from authoritative roadmap state
    return deriveSmartSprintNotifications(userRoadmap, referenceDate);
  }

  /**
   * Updates learner notification preferences safely within the UserRoadmap.personalization JSON.
   */
  public async updatePreferences(
    userId: string,
    userRoadmapId: string,
    updates: Partial<SmartNotificationPreferencesDTO>
  ): Promise<SmartNotificationPreferencesDTO> {
    const userRoadmap = await prisma.userRoadmap.findUnique({
      where: { id: userRoadmapId },
    });

    if (!userRoadmap) {
      throw new NotFoundError('User roadmap not found');
    }

    if (userRoadmap.userId !== userId) {
      throw new ForbiddenError('You are not authorized to update preferences for this roadmap');
    }

    const personalization: PersonalizationState =
      typeof userRoadmap.personalization === 'string'
        ? JSON.parse(userRoadmap.personalization)
        : (userRoadmap.personalization as PersonalizationState) || {};

    const existingPrefs = personalization.notificationPreferences || DEFAULT_SMART_NOTIFICATION_PREFERENCES;
    const mergedPreferences: SmartNotificationPreferencesDTO = {
      ...existingPrefs,
      ...updates,
    };

    const updatedPersonalization = {
      ...personalization,
      notificationPreferences: mergedPreferences,
    };

    await prisma.userRoadmap.update({
      where: { id: userRoadmapId },
      data: {
        personalization: updatedPersonalization as any,
      },
    });

    return mergedPreferences;
  }

  /**
   * Marks a specific notification as read.
   */
  public async markNotificationRead(
    userId: string,
    userRoadmapId: string,
    notificationId: string
  ): Promise<{ success: boolean; unreadCount: number }> {
    const userRoadmap = await prisma.userRoadmap.findUnique({
      where: { id: userRoadmapId },
      include: {
        sprints: {
          include: {
            tasks: { orderBy: { orderIndex: 'asc' } },
            performance: true,
          },
          orderBy: { sprintNumber: 'asc' },
        },
        adaptations: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!userRoadmap) {
      throw new NotFoundError('User roadmap not found');
    }

    if (userRoadmap.userId !== userId) {
      throw new ForbiddenError('You are not authorized to modify notifications for this roadmap');
    }

    const personalization: PersonalizationState =
      typeof userRoadmap.personalization === 'string'
        ? JSON.parse(userRoadmap.personalization)
        : (userRoadmap.personalization as PersonalizationState) || {};

    const readIds = new Set<string>(personalization.readNotificationIds || []);
    readIds.add(notificationId);

    const updatedPersonalization = {
      ...personalization,
      readNotificationIds: Array.from(readIds),
    };

    const updatedUserRoadmap = await prisma.userRoadmap.update({
      where: { id: userRoadmapId },
      data: {
        personalization: updatedPersonalization as any,
      },
      include: {
        sprints: {
          include: {
            tasks: { orderBy: { orderIndex: 'asc' } },
            performance: true,
          },
          orderBy: { sprintNumber: 'asc' },
        },
        adaptations: { orderBy: { createdAt: 'desc' } },
      },
    });

    const feed = deriveSmartSprintNotifications(updatedUserRoadmap);
    return {
      success: true,
      unreadCount: feed.unreadCount,
    };
  }

  /**
   * Marks all current notifications as read for a roadmap.
   */
  public async markAllRead(
    userId: string,
    userRoadmapId: string
  ): Promise<{ success: boolean; unreadCount: number }> {
    const feed = await this.getNotifications(userId, userRoadmapId);

    const userRoadmap = await prisma.userRoadmap.findUnique({
      where: { id: userRoadmapId },
    });

    if (!userRoadmap) {
      throw new NotFoundError('User roadmap not found');
    }

    if (userRoadmap.userId !== userId) {
      throw new ForbiddenError('You are not authorized to modify notifications for this roadmap');
    }

    const personalization: PersonalizationState =
      typeof userRoadmap.personalization === 'string'
        ? JSON.parse(userRoadmap.personalization)
        : (userRoadmap.personalization as PersonalizationState) || {};

    const readIds = new Set<string>(personalization.readNotificationIds || []);
    feed.notifications.forEach((n) => readIds.add(n.id));

    const updatedPersonalization = {
      ...personalization,
      readNotificationIds: Array.from(readIds),
    };

    await prisma.userRoadmap.update({
      where: { id: userRoadmapId },
      data: {
        personalization: updatedPersonalization as any,
      },
    });

    return {
      success: true,
      unreadCount: 0,
    };
  }
}

export const sprintNotificationService = new SprintNotificationService();
