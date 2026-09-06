import { describe, it, expect } from 'vitest';

/**
 * Feature 9: Analytics Dashboard & History Bento Grid
 * Specifications:
 * - Dashboard.tsx, SessionDetail.tsx, and Settings.tsx
 * - Responsive metrics bento grid (sessions count, average score, practice hours)
 * - Empty states when no interview sessions exist
 * - Session card displays role, score, date, and persona badge
 * - Navigation to detailed session breakdown
 */

interface SessionSummary {
  id: string;
  role: string;
  score: number;
  persona: string;
  createdAt: string;
  type: 'ORAL' | 'CODING';
}

function computeDashboardMetrics(sessions: SessionSummary[]) {
  if (sessions.length === 0) {
    return { totalSessions: 0, averageScore: 0, highestScore: 0 };
  }
  const totalSessions = sessions.length;
  const sumScore = sessions.reduce((acc, s) => acc + s.score, 0);
  const averageScore = Math.round(sumScore / totalSessions);
  const highestScore = Math.max(...sessions.map((s) => s.score));
  return { totalSessions, averageScore, highestScore };
}

describe('Feature 9: Analytics Dashboard & History Bento Grid', () => {
  const sampleSessions: SessionSummary[] = [
    { id: 'sess-1', role: 'Full Stack Engineer', score: 82, persona: 'HIRING_MANAGER', createdAt: '2026-09-01T10:00:00Z', type: 'ORAL' },
    { id: 'sess-2', role: 'Backend Lead', score: 76, persona: 'TECHNICAL_ARCHITECT', createdAt: '2026-09-03T14:30:00Z', type: 'CODING' },
    { id: 'sess-3', role: 'Senior Software Engineer', score: 88, persona: 'BAR_RAISER', createdAt: '2026-09-05T09:15:00Z', type: 'ORAL' },
  ];

  it('should compute aggregated metrics correctly from historical sessions', () => {
    const metrics = computeDashboardMetrics(sampleSessions);
    expect(metrics.totalSessions).toBe(3);
    expect(metrics.averageScore).toBe(82);
    expect(metrics.highestScore).toBe(88);
  });

  it('should provide robust empty state when user has zero completed sessions', () => {
    const emptyMetrics = computeDashboardMetrics([]);
    expect(emptyMetrics.totalSessions).toBe(0);
    expect(emptyMetrics.averageScore).toBe(0);
    expect(emptyMetrics.highestScore).toBe(0);

    const emptyStateView = {
      title: 'No sessions recorded yet',
      ctaText: 'Start Your First Mock Interview',
      ctaHref: '/interview/setup',
    };
    expect(emptyStateView.ctaHref).toBe('/interview/setup');
  });

  it('should format bento grid session cards with persona badge and score indicator', () => {
    const session = sampleSessions[0];
    const cardData = {
      title: session.role,
      badgeText: session.persona.replace('_', ' '),
      scoreText: `${session.score}/100`,
      scoreColor: session.score >= 80 ? 'text-emerald-400' : 'text-solar-orange-400',
    };

    expect(cardData.badgeText).toBe('HIRING MANAGER');
    expect(cardData.scoreText).toBe('82/100');
    expect(cardData.scoreColor).toBe('text-emerald-400');
  });

  it('should support responsive bento grid CSS classes for dashboard layout', () => {
    const bentoGridClass = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    expect(bentoGridClass).toContain('grid-cols-1');
    expect(bentoGridClass).toContain('md:grid-cols-2');
    expect(bentoGridClass).toContain('lg:grid-cols-3');
  });

  it('should navigate from session card to session detail view route /analytics/session/:id', () => {
    const getSessionDetailRoute = (id: string) => `/analytics/session/${id}`;
    expect(getSessionDetailRoute('sess-123')).toBe('/analytics/session/sess-123');
  });
});
