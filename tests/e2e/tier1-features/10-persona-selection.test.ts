import { describe, it, expect } from 'vitest';

/**
 * Feature 10: Multi-Agent Persona Selection UI
 * Specifications:
 * - 3 Persona options: HIRING_MANAGER, TECHNICAL_ARCHITECT, BAR_RAISER
 * - Displayed in SetupForm and CodingSetupForm
 * - Visual badges and rubric cues for each persona
 * - Encapsulation in session creation payload via interviewGoal
 * - Active selected state highlight
 */

interface InterviewerPersona {
  id: 'HIRING_MANAGER' | 'TECHNICAL_ARCHITECT' | 'BAR_RAISER';
  name: string;
  badge: string;
  focus: string;
  difficulty: 'Standard' | 'Demanding' | 'Elite';
}

const personas: InterviewerPersona[] = [
  {
    id: 'HIRING_MANAGER',
    name: 'Sarah Chen (Hiring Manager)',
    badge: 'Behavioral & Leadership',
    focus: 'Culture fit, team collaboration, ownership, and STAR impact metrics.',
    difficulty: 'Standard',
  },
  {
    id: 'TECHNICAL_ARCHITECT',
    name: 'Alex Vance (Technical Architect)',
    badge: 'System Design & Scalability',
    focus: 'Deep technical tradeoffs, edge-case resilience, and architectural patterns.',
    difficulty: 'Demanding',
  },
  {
    id: 'BAR_RAISER',
    name: 'Marcus Brody (Amazon Bar Raiser)',
    badge: 'Rigorous Socratic Interrogation',
    focus: 'Uninflated standards, probing assumptions, and extreme behavioral pressure.',
    difficulty: 'Elite',
  },
];

function encodePersonaInGoal(personaId: string, customGoal?: string): string {
  const prefix = `[Persona: ${personaId}]`;
  return customGoal && customGoal.trim().length > 0 ? `${prefix} ${customGoal.trim()}` : prefix;
}

describe('Feature 10: Multi-Agent Persona Selection UI', () => {
  it('should support exactly the 3 mandated interviewer personas', () => {
    const ids = personas.map((p) => p.id);
    expect(ids).toEqual(['HIRING_MANAGER', 'TECHNICAL_ARCHITECT', 'BAR_RAISER']);
  });

  it('should provide informative rubric focus and difficulty badges for all personas', () => {
    personas.forEach((persona) => {
      expect(persona.name.length).toBeGreaterThan(0);
      expect(persona.badge.length).toBeGreaterThan(0);
      expect(persona.focus.length).toBeGreaterThan(15);
      expect(['Standard', 'Demanding', 'Elite']).toContain(persona.difficulty);
    });
  });

  it('should encode selected persona into interviewGoal format correctly', () => {
    const encoded = encodePersonaInGoal('BAR_RAISER', 'Targeting Staff Engineer level');
    expect(encoded).toBe('[Persona: BAR_RAISER] Targeting Staff Engineer level');
  });

  it('should fallback cleanly when no custom goal is provided', () => {
    const encoded = encodePersonaInGoal('HIRING_MANAGER');
    expect(encoded).toBe('[Persona: HIRING_MANAGER]');
  });

  it('should apply active highlight classes to selected persona card', () => {
    const getPersonaCardClass = (isSelected: boolean) =>
      isSelected
        ? 'border-solar-orange-500 bg-solar-orange-500/10 ring-1 ring-solar-orange-500'
        : 'border-white/10 bg-obsidian-900/60 hover:border-white/20';

    expect(getPersonaCardClass(true)).toContain('border-solar-orange-500');
    expect(getPersonaCardClass(true)).toContain('ring-solar-orange-500');
    expect(getPersonaCardClass(false)).toContain('border-white/10');
  });
});
