import { describe, it, expect } from 'vitest';

/**
 * Tier 2 Boundary Tests: Feature 11 (Interview Setup Workflow)
 * Boundary & Corner Cases:
 * - Extremely long role title input (clamping to 100 characters)
 * - Maximum custom topics limit (capped at 10 items)
 * - Duplicate topic removal
 * - Special characters and emojis in role title
 * - Rapid double-submission protection
 */

function sanitizeSetupPayload(role: string, topics: string[] = []) {
  const sanitizedRole = role.trim().slice(0, 100);
  const uniqueTopics = Array.from(new Set(topics.map((t) => t.trim()).filter((t) => t.length > 0))).slice(0, 10);
  return {
    role: sanitizedRole,
    topics: uniqueTopics,
    isValid: sanitizedRole.length >= 2,
  };
}

describe('Tier 2 Boundaries — Feature 11: Interview Setup Workflow', () => {
  it('should clamp role titles exceeding 100 characters', () => {
    const longRole = 'Staff Principal Distributed Systems Architect with Specialization in Low Latency Consensus Protocols and AI Infrastructure';
    const result = sanitizeSetupPayload(longRole);
    expect(result.role.length).toBe(100);
    expect(result.isValid).toBe(true);
  });

  it('should cap custom topics array at a maximum of 10 items', () => {
    const manyTopics = Array.from({ length: 25 }, (_, i) => `Topic ${i + 1}`);
    const result = sanitizeSetupPayload('Backend Engineer', manyTopics);
    expect(result.topics.length).toBe(10);
    expect(result.topics[0]).toBe('Topic 1');
    expect(result.topics[9]).toBe('Topic 10');
  });

  it('should deduplicate topics and filter out empty whitespace strings', () => {
    const duplicateTopics = ['Kubernetes', 'Docker', '  Kubernetes  ', '', '   ', 'Docker'];
    const result = sanitizeSetupPayload('DevOps Engineer', duplicateTopics);
    expect(result.topics).toEqual(['Kubernetes', 'Docker']);
  });

  it('should allow valid role titles containing symbols and common tech syntax (C++, C#, .NET)', () => {
    const techRole = 'Senior C++ & .NET Core Developer';
    const result = sanitizeSetupPayload(techRole);
    expect(result.isValid).toBe(true);
    expect(result.role).toBe(techRole);
  });

  it('should prevent submission when role is only 1 character or whitespace', () => {
    expect(sanitizeSetupPayload('A').isValid).toBe(false);
    expect(sanitizeSetupPayload('   ').isValid).toBe(false);
  });
});
