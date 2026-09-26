// ═══════════════════════════════════════════════════════════════
// RU Ready? — Automated Unit Tests: Elo Rating Engine
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { challengeService } from '../services/challenge.service.js';

describe('Challenge Elo & Rating System', () => {
  it('correctly calculates expected outcome and new Elo rating when Player 1 wins', () => {
    // Both start at 1200
    const res = challengeService.calculateElo(1200, 1200, 1, 32);
    expect(res.deltaA).toBe(16);
    expect(res.deltaB).toBe(-16);
    expect(res.newRatingA).toBe(1216);
    expect(res.newRatingB).toBe(1184);
  });

  it('correctly handles ties / draws', () => {
    const res = challengeService.calculateElo(1200, 1200, 0.5, 32);
    expect(res.deltaA).toBe(0);
    expect(res.deltaB).toBe(0);
    expect(res.newRatingA).toBe(1200);
    expect(res.newRatingB).toBe(1200);
  });

  it('awards greater Elo gains to lower-ranked underdog winning against high-ranked player', () => {
    // Underdog (1200) beats Grandmaster (1800)
    const res = challengeService.calculateElo(1200, 1800, 1, 32);
    expect(res.deltaA).toBeGreaterThan(28);
    expect(res.deltaB).toBeLessThan(-28);
  });

  it('assigns correct tier badges based on official thresholds', () => {
    expect(challengeService.getRankTier(1100)).toBe('BRONZE');
    expect(challengeService.getRankTier(1250)).toBe('SILVER');
    expect(challengeService.getRankTier(1400)).toBe('GOLD');
    expect(challengeService.getRankTier(1550)).toBe('PLATINUM');
    expect(challengeService.getRankTier(1700)).toBe('DIAMOND');
    expect(challengeService.getRankTier(1900)).toBe('GRANDMASTER');
  });

  it('enforces rating floor of 800', () => {
    const res = challengeService.calculateElo(810, 1400, 0, 32);
    expect(res.newRatingA).toBeGreaterThanOrEqual(800);
  });
});
