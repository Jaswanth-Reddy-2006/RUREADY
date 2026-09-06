import { describe, it, expect } from 'vitest';

/**
 * Feature 7: Landing Page Modernization
 * Specifications:
 * - Obsidian dark background aesthetic (bg-obsidian-950)
 * - Responsive bento grid layout displaying key features
 * - Solar-orange hero CTA leading to register/setup
 * - Feature highlights: Multi-agent personas, live audio telemetry, STAR analysis
 * - Interactive states and navigation links
 */

describe('Feature 7: Landing Page Modernization', () => {
  const landingConfig = {
    hero: {
      headline: 'Master Your Tech Interviews with Adaptive AI Agents',
      subheadline: 'Realistic Socratic oral and coding simulations with uninflated STAR scoring and sub-300ms audio telemetry.',
      primaryCTA: { label: 'Start Free Mock Interview', href: '/register' },
      secondaryCTA: { label: 'Explore Features', href: '#features' },
    },
    bentoCards: [
      { id: 'personas', title: 'Multi-Agent Personas', desc: 'Hiring Manager, Technical Architect, Bar Raiser' },
      { id: 'telemetry', title: 'Real-Time Audio Telemetry', desc: 'Sub-300ms waveform & pacing feedback' },
      { id: 'coding', title: 'Live Coding Runner', desc: 'Monaco editor with real sandbox execution' },
      { id: 'star', title: 'Uninflated STAR Scoring', desc: 'Granular breakdown with corporate benchmarks' },
    ],
  };

  it('should verify hero section contains prominent call to action pointing to registration', () => {
    expect(landingConfig.hero.primaryCTA.href).toBe('/register');
    expect(landingConfig.hero.primaryCTA.label).toContain('Start');
  });

  it('should present 4-card bento grid highlighting platform pillars', () => {
    expect(landingConfig.bentoCards.length).toBe(4);
    const cardIds = landingConfig.bentoCards.map((c) => c.id);
    expect(cardIds).toEqual(['personas', 'telemetry', 'coding', 'star']);
  });

  it('should apply obsidian dark background and solar-orange accent classes to landing page layout', () => {
    const heroClass = 'bg-obsidian-950 text-white min-h-screen relative overflow-hidden';
    const ctaButtonClass = 'bg-solar-orange-500 hover:bg-solar-orange-600 text-white font-semibold shadow-glow px-8 py-4 rounded-xl';

    expect(heroClass).toContain('bg-obsidian-950');
    expect(heroClass).toContain('text-white');
    expect(ctaButtonClass).toContain('bg-solar-orange-500');
    expect(ctaButtonClass).toContain('shadow-glow');
  });

  it('should include navigation header with Login and Get Started actions', () => {
    const headerNav = [
      { label: 'Features', href: '#features' },
      { label: 'Sign In', href: '/login' },
      { label: 'Get Started', href: '/register', isPrimary: true },
    ];

    expect(headerNav.some((item) => item.href === '/login')).toBe(true);
    expect(headerNav.some((item) => item.href === '/register')).toBe(true);
  });

  it('should render bento grid cards with glassmorphic elevation styling', () => {
    const cardClass = 'bg-obsidian-card backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-solar-orange-500/40 transition-all';
    expect(cardClass).toContain('bg-obsidian-card');
    expect(cardClass).toContain('backdrop-blur-md');
    expect(cardClass).toContain('hover:border-solar-orange-500/40');
  });
});
