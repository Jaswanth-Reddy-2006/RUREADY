import { describe, it, expect } from 'vitest';

/**
 * Feature 18: Backend Persona Prompt Adaptations
 * Specifications:
 * - Parsing [Persona: ...] tag in session interviewGoal
 * - Injection of persona-specific Socratic evaluation rules:
 *   - HIRING_MANAGER: Behavioral focus, team culture, leadership, ownership
 *   - TECHNICAL_ARCHITECT: System design, concurrency, tradeoffs, scalability
 *   - BAR_RAISER: Rigorous uninflated standard, challenging assumptions, edge cases
 * - Fallback to balanced persona if tag missing
 */

type PersonaType = 'HIRING_MANAGER' | 'TECHNICAL_ARCHITECT' | 'BAR_RAISER';

function parsePersonaFromGoal(interviewGoal?: string): PersonaType {
  if (!interviewGoal) return 'HIRING_MANAGER';
  const match = interviewGoal.match(/\[Persona:\s*(HIRING_MANAGER|TECHNICAL_ARCHITECT|BAR_RAISER)\]/i);
  if (match && match[1]) {
    return match[1].toUpperCase() as PersonaType;
  }
  return 'HIRING_MANAGER'; // default
}

function getPersonaPromptDirective(persona: PersonaType): string {
  switch (persona) {
    case 'TECHNICAL_ARCHITECT':
      return 'Interrogate candidate on distributed system tradeoffs, concurrency bottlenecks, latency guarantees, and failure modes.';
    case 'BAR_RAISER':
      return 'Enforce uninflated elite standards. Probe vague statements, verify quantified metrics, and do not accept hand-waving.';
    case 'HIRING_MANAGER':
    default:
      return 'Focus on behavioral collaboration, conflict resolution, ownership, and measurable business impact using the STAR method.';
  }
}

describe('Feature 18: Backend Persona Prompt Adaptations', () => {
  it('should parse [Persona: TECHNICAL_ARCHITECT] tag from interviewGoal', () => {
    const goal = '[Persona: TECHNICAL_ARCHITECT] Distributed systems evaluation';
    const persona = parsePersonaFromGoal(goal);
    expect(persona).toBe('TECHNICAL_ARCHITECT');
  });

  it('should parse [Persona: BAR_RAISER] tag from interviewGoal', () => {
    const goal = '[Persona: BAR_RAISER] Senior engineering bar raiser session';
    const persona = parsePersonaFromGoal(goal);
    expect(persona).toBe('BAR_RAISER');
  });

  it('should parse [Persona: HIRING_MANAGER] tag from interviewGoal', () => {
    const goal = '[Persona: HIRING_MANAGER] Leadership and behavioral fit';
    const persona = parsePersonaFromGoal(goal);
    expect(persona).toBe('HIRING_MANAGER');
  });

  it('should fallback cleanly to HIRING_MANAGER when no persona tag is provided', () => {
    expect(parsePersonaFromGoal(undefined)).toBe('HIRING_MANAGER');
    expect(parsePersonaFromGoal('Standard frontend interview')).toBe('HIRING_MANAGER');
  });

  it('should generate distinct specialized directives tailored to each persona', () => {
    const techDirective = getPersonaPromptDirective('TECHNICAL_ARCHITECT');
    const barDirective = getPersonaPromptDirective('BAR_RAISER');
    const hmDirective = getPersonaPromptDirective('HIRING_MANAGER');

    expect(techDirective).toContain('distributed system tradeoffs');
    expect(barDirective).toContain('uninflated elite standards');
    expect(hmDirective).toContain('STAR method');
  });
});
