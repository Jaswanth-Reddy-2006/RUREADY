import { describe, expect, it } from 'vitest';
import {
  SkillGraphEngine,
  skillGraphEngine,
} from '../../services/roadmap-service/src/engine/skill-graph.engine.js';
import {
  SkillGapAnalyzer,
  skillGapAnalyzer,
} from '../../services/roadmap-service/src/engine/skill-gap.analyzer.js';
import {
  SKILL_TAXONOMY,
  CANONICAL_ROLES,
  TaxonomySkill,
} from '../../services/roadmap-service/src/data/skill-taxonomy.data.js';

describe('Skill Knowledge Base & Dependency Graph Engine (Stage 2)', () => {
  // ─── A. Role Resolution & Aliases ─────────────────────────────
  describe('A. Role Resolution & Alias Normalization', () => {
    it('resolves canonical uppercase roles', () => {
      const fullstack = skillGraphEngine.resolveRoleSkills('FULLSTACK');
      expect(fullstack.length).toBeGreaterThan(5);
      expect(fullstack.some((s) => s.skill.slug === 'react-architecture')).toBe(true);

      const backend = skillGraphEngine.resolveRoleSkills('BACKEND');
      expect(backend.some((s) => s.skill.slug === 'message-queues-kafka')).toBe(true);

      const aiml = skillGraphEngine.resolveRoleSkills('AIML');
      expect(aiml.some((s) => s.skill.slug === 'rag-vector-search')).toBe(true);

      const devops = skillGraphEngine.resolveRoleSkills('DEVOPS');
      expect(devops.some((s) => s.skill.slug === 'kubernetes-orchestration')).toBe(true);

      const systemDesign = skillGraphEngine.resolveRoleSkills('SYSTEM_DESIGN');
      expect(systemDesign.some((s) => s.skill.slug === 'system-design-hld')).toBe(true);
    });

    it('resolves user-facing aliases to canonical keys', () => {
      expect(skillGraphEngine.normalizeRole('Full Stack Software Engineer')).toBe('FULLSTACK');
      expect(skillGraphEngine.normalizeRole('backend engineer')).toBe('BACKEND');
      expect(skillGraphEngine.normalizeRole('ai / ml specialist')).toBe('AIML');
      expect(skillGraphEngine.normalizeRole('cloud native devops')).toBe('DEVOPS');
      expect(skillGraphEngine.normalizeRole('distributed systems engineer')).toBe('SYSTEM_DESIGN');
      expect(skillGraphEngine.normalizeRole('Data Scientist')).toBe('DATA_SCIENTIST');
      expect(skillGraphEngine.normalizeRole('Data Analyst')).toBe('DATA_ANALYST');
      expect(skillGraphEngine.normalizeRole('Frontend Developer')).toBe('FRONTEND');
    });

    it('adjusts target proficiencies for FAANG and Tier-1 FinTech tiers', () => {
      const standard = skillGraphEngine.resolveRoleSkills('FULLSTACK', 'High-Growth Startup');
      const faang = skillGraphEngine.resolveRoleSkills('FULLSTACK', 'FAANG');

      const standardScore = standard.find((s) => s.skill.slug === 'react-architecture')?.targetProficiency || 0;
      const faangScore = faang.find((s) => s.skill.slug === 'react-architecture')?.targetProficiency || 0;

      expect(faangScore).toBe(Math.min(100, standardScore + 5));
    });

    it('supports arbitrary open-ended roles without throwing 400', () => {
      const customRole = 'Cybersecurity Penetration Tester';
      expect(skillGraphEngine.normalizeRole(customRole)).toBe(customRole);

      const resolved = skillGraphEngine.resolveRoleSkills(customRole);
      expect(resolved.length).toBeGreaterThan(0);
      expect(resolved[0].skill).toBeDefined();
    });

    it('throws BadRequestError for empty or non-string role inputs', () => {
      expect(() => skillGraphEngine.normalizeRole('')).toThrow(/Role input must be a non-empty string/);
      expect(() => skillGraphEngine.normalizeRole('   ')).toThrow(/Role input must be a non-empty string/);
    });
  });

  // ─── B. Prerequisite Expansion ────────────────────────────────
  describe('B. Prerequisite Expansion', () => {
    it('expands a single-level dependency correctly', () => {
      const expanded = skillGraphEngine.expandWithPrerequisites(['database-internals-indexing']);
      const slugs = expanded.map((s) => s.slug);

      expect(slugs).toContain('database-internals-indexing');
      expect(slugs).toContain('sql-foundations');
    });

    it('expands multi-level recursive dependencies', () => {
      // trees-graphs-dsa -> algorithms-sorting-searching -> data-structures-core -> programming-fundamentals
      const expanded = skillGraphEngine.expandWithPrerequisites(['trees-graphs-dsa']);
      const slugs = expanded.map((s) => s.slug);

      expect(slugs).toContain('trees-graphs-dsa');
      expect(slugs).toContain('algorithms-sorting-searching');
      expect(slugs).toContain('data-structures-core');
      expect(slugs).toContain('programming-fundamentals');
    });

    it('removes duplicate prerequisites when expanding multiple dependent skills', () => {
      // Both react-architecture and nodejs-async-runtime require javascript-modern-es6
      const expanded = skillGraphEngine.expandWithPrerequisites(['react-architecture', 'nodejs-async-runtime']);
      const slugs = expanded.map((s) => s.slug);

      const jsCount = slugs.filter((slug) => slug === 'javascript-modern-es6').length;
      expect(jsCount).toBe(1);
    });

    it('does not drag unrelated web/DOM frontend dependencies into Data Science / AI stacks', () => {
      const expanded = skillGraphEngine.expandWithPrerequisites(['rag-vector-search', 'machine-learning-foundations']);
      const slugs = expanded.map((s) => s.slug);

      expect(slugs).toContain('machine-learning-foundations');
      expect(slugs).toContain('python-data-stack');
      expect(slugs).toContain('statistics-probability');
      expect(slugs).toContain('programming-fundamentals');

      // Unrelated frontend/Node prerequisites must NOT be pulled in
      expect(slugs).not.toContain('html-css-dom');
      expect(slugs).not.toContain('javascript-modern-es6');
      expect(slugs).not.toContain('nodejs-async-runtime');
    });
  });

  // ─── C. Topological Ordering ──────────────────────────────────
  describe('C. Topological Ordering (Kahn Algorithm)', () => {
    it('orders prerequisites strictly before their dependent skills', () => {
      const ordered = skillGraphEngine.getTopologicalOrder(['trees-graphs-dsa', 'react-architecture']);
      const orderMap = new Map(ordered.map((s, idx) => [s.slug, idx]));

      // programming-fundamentals must come before data-structures-core
      expect(orderMap.get('programming-fundamentals')!).toBeLessThan(orderMap.get('data-structures-core')!);
      // data-structures-core must come before algorithms-sorting-searching
      expect(orderMap.get('data-structures-core')!).toBeLessThan(orderMap.get('algorithms-sorting-searching')!);
      // algorithms-sorting-searching must come before trees-graphs-dsa
      expect(orderMap.get('algorithms-sorting-searching')!).toBeLessThan(orderMap.get('trees-graphs-dsa')!);

      // javascript-modern-es6 must come before react-architecture
      expect(orderMap.get('javascript-modern-es6')!).toBeLessThan(orderMap.get('react-architecture')!);
    });

    it('produces 100% deterministic ordering across multiple runs', () => {
      const run1 = skillGraphEngine.getTopologicalOrder(['system-design-hld', 'rag-vector-search']).map((s) => s.slug);
      const run2 = skillGraphEngine.getTopologicalOrder(['system-design-hld', 'rag-vector-search']).map((s) => s.slug);

      expect(run1).toEqual(run2);
    });
  });

  // ─── D. Cycle Detection ───────────────────────────────────────
  describe('D. Cycle Detection & Graph Safety', () => {
    it('confirms the canonical taxonomy is acyclic', () => {
      const cycleCheck = skillGraphEngine.detectCycles();
      expect(cycleCheck.hasCycle).toBe(false);
    });

    it('detects a simple 2-node cycle (A -> B -> A)', () => {
      const cyclicTaxonomy: Record<string, TaxonomySkill> = {
        'skill-a': { slug: 'skill-a', name: 'Skill A', category: 'Test', description: '', prerequisites: ['skill-b'] },
        'skill-b': { slug: 'skill-b', name: 'Skill B', category: 'Test', description: '', prerequisites: ['skill-a'] },
      };

      const customEngine = new SkillGraphEngine(cyclicTaxonomy);
      const check = customEngine.detectCycles(Object.values(cyclicTaxonomy));

      expect(check.hasCycle).toBe(true);
      expect(check.cyclePath).toBeDefined();
    });

    it('detects a multi-node cycle (A -> B -> C -> A)', () => {
      const cyclicTaxonomy: Record<string, TaxonomySkill> = {
        'skill-a': { slug: 'skill-a', name: 'Skill A', category: 'Test', description: '', prerequisites: ['skill-b'] },
        'skill-b': { slug: 'skill-b', name: 'Skill B', category: 'Test', description: '', prerequisites: ['skill-c'] },
        'skill-c': { slug: 'skill-c', name: 'Skill C', category: 'Test', description: '', prerequisites: ['skill-a'] },
      };

      const customEngine = new SkillGraphEngine(cyclicTaxonomy);
      expect(() => customEngine.getTopologicalOrder(Object.values(cyclicTaxonomy))).toThrow(/Circular prerequisite dependency detected|Cycle detected/);
    });
  });

  // ─── E. Skill Depth & Layer Calculation ───────────────────────
  describe('E. Skill Depth & Layer Calculation', () => {
    it('assigns depth 0 to foundational skills and progressive depths to dependents', () => {
      const depths = skillGraphEngine.calculateSkillDepths(['trees-graphs-dsa']);

      expect(depths.get('programming-fundamentals')).toBe(0);
      expect(depths.get('data-structures-core')).toBe(1);
      expect(depths.get('algorithms-sorting-searching')).toBe(2);
      expect(depths.get('trees-graphs-dsa')).toBe(3);
    });
  });

  // ─── F. Skill Gap Analysis ────────────────────────────────────
  describe('F. Skill Gap Analysis Engine', () => {
    const required = skillGraphEngine.resolveRoleSkills('FULLSTACK');

    it('evaluates a candidate with zero demonstrated skills', () => {
      const result = skillGapAnalyzer.analyzeSkillGap({
        targetRole: 'FULLSTACK',
        requiredSkills: required,
      });

      expect(result.overallReadinessBaseline).toBe(0);
      expect(result.masteredSkillsCount).toBe(0);
      expect(result.unmetSkillsCount).toBe(required.length);
      expect(result.skillGaps.every((g) => g.priority === 'CRITICAL')).toBe(true);
    });

    it('evaluates a candidate with fully mastered skills', () => {
      const perfectEvidence = required.map((r) => ({
        skillSlug: r.skill.slug,
        score: r.targetProficiency,
      }));

      const result = skillGapAnalyzer.analyzeSkillGap({
        targetRole: 'FULLSTACK',
        requiredSkills: required,
        userEvidence: perfectEvidence,
      });

      expect(result.overallReadinessBaseline).toBe(100);
      expect(result.masteredSkillsCount).toBe(required.length);
      expect(result.unmetSkillsCount).toBe(0);
    });

    it('evaluates mixed evidence and prioritizes explicit candidate blindspots as CRITICAL', () => {
      const result = skillGapAnalyzer.analyzeSkillGap({
        targetRole: 'FULLSTACK',
        requiredSkills: required,
        userEvidence: {
          'html-css-dom': 90,
          'javascript-modern-es6': 85,
          'sql-foundations': 70,
        },
        knownSkillNames: ['React'],
        identifiedBlindspots: ['database-internals-indexing', 'distributed-caching-redis'],
      });

      expect(result.overallReadinessBaseline).toBeGreaterThan(20);
      expect(result.overallReadinessBaseline).toBeLessThan(80);

      // Verify blindspots have CRITICAL priority
      const dbGap = result.skillGaps.find((g) => g.skillName.includes('Database Internals'));
      expect(dbGap?.priority).toBe('CRITICAL');
      expect(dbGap?.recommendedFocus).toContain('blindspot');
    });
  });

  // ─── G. Data Integrity ────────────────────────────────────────
  describe('G. Data Integrity & Taxonomy Verification', () => {
    it('verifies all role skill references point to valid taxonomy slugs', () => {
      for (const [roleKey, roleDef] of Object.entries(CANONICAL_ROLES)) {
        for (const req of roleDef.skills) {
          expect(SKILL_TAXONOMY[req.skillSlug]).toBeDefined();
        }
      }
    });

    it('verifies all skill prerequisites point to valid taxonomy slugs', () => {
      for (const [slug, skill] of Object.entries(SKILL_TAXONOMY)) {
        for (const prereq of skill.prerequisites) {
          expect(SKILL_TAXONOMY[prereq]).toBeDefined();
        }
      }
    });
  });
});
