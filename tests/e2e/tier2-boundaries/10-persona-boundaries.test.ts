import { describe, it, expect } from 'vitest';

/**
 * Tier 2 Boundary Tests: Feature 10 (Persona Selection UI)
 * Boundary & Corner Cases:
 * - Case-insensitive persona tag parsing
 * - Extra whitespace and non-standard spacing inside [Persona: ...]
 * - Unknown or deprecated persona identifier fallback
 * - Multiple conflicting persona tags in the same interview goal
 * - Unclosed or malformed persona bracket syntax
 */

type ValidPersona = 'HIRING_MANAGER' | 'TECHNICAL_ARCHITECT' | 'BAR_RAISER';

function extractPersonaRobust(goalText?: string): ValidPersona {
  if (!goalText) return 'HIRING_MANAGER';
  // Regex supporting case-insensitive, variable whitespace
  const match = goalText.match(/\[\s*Persona\s*:\s*([A-Za-z_]+)\s*\]/i);
  if (!match) return 'HIRING_MANAGER';

  const normalized = match[1].toUpperCase();
  if (normalized === 'HIRING_MANAGER' || normalized === 'TECHNICAL_ARCHITECT' || normalized === 'BAR_RAISER') {
    return normalized as ValidPersona;
  }
  return 'HIRING_MANAGER'; // default fallback
}

describe('Tier 2 Boundaries — Feature 10: Persona Selection UI', () => {
  it('should parse case-insensitive persona strings correctly', () => {
    expect(extractPersonaRobust('[persona: bar_raiser]')).toBe('BAR_RAISER');
    expect(extractPersonaRobust('[Persona: technical_architect]')).toBe('TECHNICAL_ARCHITECT');
    expect(extractPersonaRobust('[PERSONA: HIRING_MANAGER]')).toBe('HIRING_MANAGER');
  });

  it('should tolerate arbitrary spacing inside the persona tag', () => {
    expect(extractPersonaRobust('[   Persona   :   BAR_RAISER   ] Focus on scalability')).toBe('BAR_RAISER');
  });

  it('should fallback to HIRING_MANAGER when an unrecognized persona is provided', () => {
    expect(extractPersonaRobust('[Persona: QUANTUM_PHYSICIST]')).toBe('HIRING_MANAGER');
    expect(extractPersonaRobust('[Persona: CHAT_GPT_4]')).toBe('HIRING_MANAGER');
  });

  it('should prioritize the first tag when multiple conflicting persona tags exist', () => {
    const multiTag = '[Persona: TECHNICAL_ARCHITECT] and also [Persona: BAR_RAISER]';
    expect(extractPersonaRobust(multiTag)).toBe('TECHNICAL_ARCHITECT');
  });

  it('should fallback gracefully when bracket is unclosed or malformed', () => {
    expect(extractPersonaRobust('[Persona: BAR_RAISER')).toBe('HIRING_MANAGER');
    expect(extractPersonaRobust('Persona: BAR_RAISER]')).toBe('HIRING_MANAGER');
  });
});
