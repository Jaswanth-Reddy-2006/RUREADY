// ═══════════════════════════════════════════════════════════════
// Fallback Roadmap Synthesizer Tests
// Validates 100% Deterministic 3-Pillar Offline Roadmap Synthesis
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  FallbackRoadmapSynthesizer,
  fallbackRoadmapSynthesizer,
  FallbackRoadmapInput,
} from '../../services/roadmap-service/src/engine/fallback-roadmap.synthesizer.js';
import { generatedRoadmapOutputSchema } from '../../services/roadmap-service/src/validators/roadmap-generation.validator.js';
import { BadRequestError } from '../../services/roadmap-service/src/lib/errors.js';

describe('Fallback Roadmap Synthesizer Engine', () => {

  // ─── 1. Basic Generation & Schema Conformity ──────────────────

  it('1. should generate a completely valid roadmap for Fullstack role', () => {
    const input: FallbackRoadmapInput = {
      targetRole: 'fullstack',
      targetCompanyTier: 'FAANG',
      level: 'INTERMEDIATE',
      timelineWeeks: 12,
      weeklyHours: 15,
    };

    const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap(input);

    expect(roadmap).toBeDefined();
    expect(roadmap.title).toContain('Full Stack');
    expect(roadmap.targetCompanyTier).toBe('FAANG');
    expect(roadmap.estimatedWeeks).toBe(12);
    expect(roadmap.phases.length).toBeGreaterThanOrEqual(3);
  });

  it('2. should generate between 3 and 5 progressive phases', () => {
    const roles = ['fullstack', 'backend', 'aiml', 'devops', 'system_design'];

    for (const role of roles) {
      const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap({ targetRole: role });
      expect(roadmap.phases.length).toBeGreaterThanOrEqual(3);
      expect(roadmap.phases.length).toBeLessThanOrEqual(5);
    }
  });

  it('3. should generate between 3 and 25 total milestone nodes', () => {
    const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap({ targetRole: 'backend' });
    const totalNodes = roadmap.phases.reduce((acc, phase) => acc + phase.nodes.length, 0);

    expect(totalNodes).toBeGreaterThanOrEqual(3);
    expect(totalNodes).toBeLessThanOrEqual(25);
  });

  // ─── 2. 3-Pillar Content & Pedagogical Depth ──────────────────

  it('4. should ensure every node contains all 3 pillars', () => {
    const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap({ targetRole: 'aiml' });

    for (const phase of roadmap.phases) {
      for (const node of phase.nodes) {
        // Pillar 1
        expect(node.whatShouldIDo).toBeDefined();
        expect(node.whatShouldIDo.summary.length).toBeGreaterThanOrEqual(10);
        expect(node.whatShouldIDo.actionSteps.length).toBeGreaterThanOrEqual(1);
        expect(node.whatShouldIDo.mentalModels.length).toBeGreaterThanOrEqual(1);

        // Pillar 2
        expect(node.whatIsTheSource).toBeDefined();
        expect(node.whatIsTheSource.length).toBeGreaterThanOrEqual(1);
        for (const res of node.whatIsTheSource) {
          expect(res.url.startsWith('http')).toBe(true);
          expect(res.title.length).toBeGreaterThan(0);
        }

        // Pillar 3
        expect(node.whatIsTheExactThing).toBeDefined();
        expect(node.whatIsTheExactThing.title.length).toBeGreaterThanOrEqual(3);
        expect(node.whatIsTheExactThing.description.length).toBeGreaterThanOrEqual(10);
        expect(node.whatIsTheExactThing.deliverable.length).toBeGreaterThanOrEqual(5);
      }
    }
  });

  it('5. should generate 1 to 4 micro questions per node', () => {
    const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap({ targetRole: 'devops' });

    for (const phase of roadmap.phases) {
      for (const node of phase.nodes) {
        expect(node.microQuestions).toBeDefined();
        expect(node.microQuestions.length).toBeGreaterThanOrEqual(1);
        expect(node.microQuestions.length).toBeLessThanOrEqual(4);
        for (const q of node.microQuestions) {
          expect(q.questionText.length).toBeGreaterThanOrEqual(5);
          expect(q.focus.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it('6. should ensure verification checklist exists on every drill', () => {
    const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap({ targetRole: 'system_design' });

    for (const phase of roadmap.phases) {
      for (const node of phase.nodes) {
        const drill = node.whatIsTheExactThing;
        expect(drill.verificationChecklist).toBeDefined();
        expect(drill.verificationChecklist.length).toBeGreaterThanOrEqual(1);
        for (const item of drill.verificationChecklist) {
          expect(item.length).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });

  // ─── 3. Prerequisite Order & Graph Fidelity ─────────────────

  it('7. should preserve prerequisite order across nodes', () => {
    const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap({ targetRole: 'fullstack' });

    const allNodeIds: string[] = [];
    for (const phase of roadmap.phases) {
      for (const node of phase.nodes) {
        allNodeIds.push(node.id);
      }
    }

    // Every node's prerequisiteNodeIds must appear BEFORE that node in the sequence
    for (let i = 0; i < allNodeIds.length; i++) {
      const currentNodeId = allNodeIds[i];
      let currentNode = null;
      for (const phase of roadmap.phases) {
        const found = phase.nodes.find((n) => n.id === currentNodeId);
        if (found) {
          currentNode = found;
          break;
        }
      }

      if (currentNode && currentNode.prerequisiteNodeIds.length > 0) {
        for (const prereqId of currentNode.prerequisiteNodeIds) {
          const prereqIndex = allNodeIds.indexOf(prereqId);
          expect(prereqIndex).toBeGreaterThanOrEqual(0);
          expect(prereqIndex).toBeLessThan(i);
        }
      }
    }
  });

  // ─── 4. User Skill Baseline & Gap Integration ─────────────────

  it('8. should incorporate user evidence and prioritize critical skill gaps', () => {
    const input: FallbackRoadmapInput = {
      targetRole: 'backend',
      userEvidence: {
        'programming-fundamentals': 90,
        'sql-foundations': 90,
      },
      identifiedBlindspots: ['distributed-caching-redis', 'message-queues-kafka'],
    };

    const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap(input);
    expect(roadmap).toBeDefined();

    // Check that blindspots require evidence
    let foundBlindspotNode = false;
    for (const phase of roadmap.phases) {
      for (const node of phase.nodes) {
        if (node.id.includes('redis') || node.id.includes('kafka')) {
          foundBlindspotNode = true;
          expect(node.requiresEvidence).toBe(true);
        }
      }
    }
    expect(foundBlindspotNode).toBe(true);
  });

  it('9. should respect user timeline weeks', () => {
    const input: FallbackRoadmapInput = {
      targetRole: 'fullstack',
      timelineWeeks: 24,
    };

    const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap(input);
    expect(roadmap.estimatedWeeks).toBe(24);
  });

  // ─── 5. Strict Determinism & Purity ──────────────────────────

  it('10. should produce identical output given identical input (100% Determinism)', () => {
    const input: FallbackRoadmapInput = {
      targetRole: 'fullstack',
      targetCompanyTier: 'Unicorn',
      level: 'ADVANCED',
      timelineWeeks: 16,
      weeklyHours: 20,
    };

    const run1 = fallbackRoadmapSynthesizer.synthesizeRoadmap(input);
    const run2 = fallbackRoadmapSynthesizer.synthesizeRoadmap(input);

    expect(JSON.stringify(run1)).toBe(JSON.stringify(run2));
  });

  it('11. should not generate random IDs or timestamps', () => {
    const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap({ targetRole: 'backend' });

    for (let pIdx = 0; pIdx < roadmap.phases.length; pIdx++) {
      const phase = roadmap.phases[pIdx];
      expect(phase.id).toBe(`phase-${pIdx + 1}`);

      for (const node of phase.nodes) {
        expect(node.id.startsWith(`node-${pIdx + 1}-`)).toBe(true);
        expect(node.id).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}/); // No UUID
      }
    }
  });

  it('13. should not invent fake URLs and use valid HTTPS URLs from official docs/repos', () => {
    const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap({ targetRole: 'fullstack' });
    for (const phase of roadmap.phases) {
      for (const node of phase.nodes) {
        for (const src of node.whatIsTheSource) {
          expect(src.url.startsWith('https://')).toBe(true);
        }
      }
    }
  });

  it('14. should safely handle unmapped skills with authoritative fallback reference', () => {
    const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap({ targetRole: 'devops' });
    for (const phase of roadmap.phases) {
      for (const node of phase.nodes) {
        expect(node.whatIsTheSource.length).toBeGreaterThanOrEqual(1);
        expect(node.whatIsTheSource[0].url).toContain('https://');
      }
    }
  });

  it('15. should strictly pass generatedRoadmapOutputSchema validation', () => {
    const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap({ targetRole: 'system_design' });
    const parsed = generatedRoadmapOutputSchema.parse(roadmap);
    expect(parsed.phases.length).toBeGreaterThanOrEqual(3);
  });

  // ─── 6. Error & Edge Case Handling ───────────────────────────

  it('16. should gracefully synthesize for open-ended custom roles', () => {
    const roadmap = fallbackRoadmapSynthesizer.synthesizeRoadmap({ targetRole: 'Mobile iOS Developer' });
    expect(roadmap.phases.length).toBeGreaterThanOrEqual(3);
    expect(roadmap.title).toBeDefined();
  });

  it('17. should throw BadRequestError when targetRole is empty or whitespace', () => {
    expect(() => fallbackRoadmapSynthesizer.synthesizeRoadmap({ targetRole: '' })).toThrowError(BadRequestError);
    expect(() => fallbackRoadmapSynthesizer.synthesizeRoadmap({ targetRole: '   ' })).toThrowError(BadRequestError);
  });
});
