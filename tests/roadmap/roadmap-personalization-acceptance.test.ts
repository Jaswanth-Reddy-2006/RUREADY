// ═══════════════════════════════════════════════════════════════
// 4-Profile Acceptance Test — Personalization & Proficiency Engine
// Verifies dynamic personalization, workload calibration, and
// gap-driven differentiation across distinct learner profiles
// ═══════════════════════════════════════════════════════════════

import { describe, expect, it } from 'vitest';
import { fallbackRoadmapSynthesizer } from '../../services/roadmap-service/src/engine/fallback-roadmap.synthesizer.js';
import { skillGraphEngine } from '../../services/roadmap-service/src/engine/skill-graph.engine.js';
import { skillGapAnalyzer } from '../../services/roadmap-service/src/engine/skill-gap.analyzer.js';
import { buildRoadmapUserPrompt, buildRoadmapSystemPrompt } from '../../services/roadmap-service/src/ai/prompt-templates.js';

describe('Roadmap Personalization & 4-Profile Acceptance Test (Step 7)', () => {
  // ── Profile A: Data Scientist (Beginner ML/Stats, 5h/wk, 12w) ──
  const profileA_Input = {
    targetRole: 'Data Scientist',
    targetCompanyTier: 'FAANG',
    level: 'BEGINNER',
    timelineWeeks: 12,
    weeklyHours: 5,
    knownSkills: ['Python', 'SQL', 'Pandas', 'NumPy'],
    identifiedBlindspots: ['statistics-probability', 'machine-learning-foundations'],
    userEvidence: {
      'python-data-stack': 90,
      'sql-foundations': 85,
      'statistics-probability': 20,
      'machine-learning-foundations': 20,
    },
  };

  // ── Profile B: Data Scientist (Advanced ML/Stats, 20h/wk, 12w) ──
  const profileB_Input = {
    targetRole: 'Data Scientist',
    targetCompanyTier: 'FAANG',
    level: 'ADVANCED',
    timelineWeeks: 12,
    weeklyHours: 20,
    knownSkills: ['Python', 'SQL', 'Pandas', 'Statistics', 'Machine Learning'],
    identifiedBlindspots: ['deep-learning-neural-networks', 'llm-fine-tuning-inference'],
    userEvidence: {
      'python-data-stack': 95,
      'sql-foundations': 90,
      'statistics-probability': 90,
      'machine-learning-foundations': 90,
      'deep-learning-neural-networks': 45,
    },
  };

  // ── Profile C: Full Stack Developer (10h/wk, 12w) ──
  const profileC_Input = {
    targetRole: 'Full Stack Developer',
    targetCompanyTier: 'High-Growth Startup',
    level: 'INTERMEDIATE',
    timelineWeeks: 12,
    weeklyHours: 10,
    knownSkills: ['HTML', 'CSS', 'JavaScript Modern ES6', 'React Architecture'],
    identifiedBlindspots: ['nodejs-async-runtime', 'database-internals-indexing', 'distributed-caching-redis'],
    userEvidence: {
      'html-css-dom': 90,
      'javascript-modern-es6': 90,
      'typescript-type-systems': 80,
      'react-architecture': 80,
      'nodejs-async-runtime': 25,
      'database-internals-indexing': 20,
    },
  };

  // ── Profile D: Data Analyst (7h/wk, 12w) ──
  const profileD_Input = {
    targetRole: 'Data Analyst',
    targetCompanyTier: 'Enterprise',
    level: 'BEGINNER',
    timelineWeeks: 12,
    weeklyHours: 7,
    knownSkills: ['Excel', 'Spreadsheet Modeling'],
    identifiedBlindspots: ['sql-foundations', 'statistics-probability', 'business-intelligence-bi', 'exploratory-data-analysis'],
    userEvidence: {
      'sql-foundations': 20,
      'statistics-probability': 20,
      'exploratory-data-analysis': 25,
      'business-intelligence-bi': 20,
    },
  };

  describe('1. Non-Identity Invariant (Profile A vs Profile B)', () => {
    it('generates distinct, non-identical roadmaps for candidates with same role but different skill baselines', () => {
      const roadmapA = fallbackRoadmapSynthesizer.synthesizeRoadmap(profileA_Input);
      const roadmapB = fallbackRoadmapSynthesizer.synthesizeRoadmap(profileB_Input);

      // Verify they are NOT identical
      expect(roadmapA).not.toEqual(roadmapB);

      // Extract all node titles
      const titlesA = roadmapA.phases.flatMap((p) => p.nodes.map((n) => n.title));
      const titlesB = roadmapB.phases.flatMap((p) => p.nodes.map((n) => n.title));

      expect(titlesA).not.toEqual(titlesB);

      // Profile A has blindspots in statistics and machine learning foundations
      expect(titlesA.some((t) => t.includes('Statistics') || t.includes('Machine Learning'))).toBe(true);

      // Profile B already mastered Stats/ML foundations, so Profile B progresses toward Deep Learning
      expect(titlesB.some((t) => t.includes('Deep Learning') || t.includes('Advanced'))).toBe(true);
    });
  });

  describe('2. Workload & Study Hours Calibration', () => {
    it('scales estimated hours and node depth proportionally to available study hours', () => {
      const roadmapA = fallbackRoadmapSynthesizer.synthesizeRoadmap(profileA_Input); // 5 hrs/week
      const roadmapB = fallbackRoadmapSynthesizer.synthesizeRoadmap(profileB_Input); // 20 hrs/week

      const totalHoursA = roadmapA.phases
        .flatMap((p) => p.nodes)
        .reduce((sum, n) => sum + n.estimatedHours, 0);

      const totalHoursB = roadmapB.phases
        .flatMap((p) => p.nodes)
        .reduce((sum, n) => sum + n.estimatedHours, 0);

      // Profile B (20h/wk) must have higher total estimated hours than Profile A (5h/wk)
      expect(totalHoursB).toBeGreaterThan(totalHoursA);
    });
  });

  describe('3. Profile C (Full Stack Developer) Specialization', () => {
    it('focuses Full Stack candidate on backend & database gaps rather than repeating HTML/CSS', () => {
      const roadmapC = fallbackRoadmapSynthesizer.synthesizeRoadmap(profileC_Input);
      const allNodeTitles = roadmapC.phases.flatMap((p) => p.nodes.map((n) => n.title));

      // Should contain backend and database gap areas
      expect(
        allNodeTitles.some((t) => t.includes('Node.js') || t.includes('Database') || t.includes('Caching') || t.includes('REST'))
      ).toBe(true);

      // Should not repeat basic HTML/CSS as beginner lesson
      const htmlLesson = allNodeTitles.find((t) => t.includes('Modern Semantic HTML'));
      expect(htmlLesson).toBeUndefined();
    });
  });

  describe('4. Profile D (Data Analyst) Acceptance & Custom Career Path', () => {
    it('accepts Data Analyst role and synthesizes a tailored BI and SQL analytics curriculum', () => {
      expect(skillGraphEngine.normalizeRole(profileD_Input.targetRole)).toBe('DATA_ANALYST');

      const roadmapD = fallbackRoadmapSynthesizer.synthesizeRoadmap(profileD_Input);
      expect(roadmapD.title).toContain('Data');

      const allNodeTitles = roadmapD.phases.flatMap((p) => p.nodes.map((n) => n.title));

      // Must cover SQL, Statistics, EDA, and BI
      expect(allNodeTitles.some((t) => t.includes('SQL') || t.includes('Relational'))).toBe(true);
      expect(allNodeTitles.some((t) => t.includes('Statistics') || t.includes('Probability'))).toBe(true);
      expect(allNodeTitles.some((t) => t.includes('Business Intelligence') || t.includes('Exploratory'))).toBe(true);
    });
  });

  describe('5. LLM Prompt Construction Verifications', () => {
    it('constructs prompt with clear instructions to skip known skills and focus on gaps', () => {
      const systemPrompt = buildRoadmapSystemPrompt();
      expect(systemPrompt).toContain('DO NOT create redundant beginner milestones for skills the candidate has already mastered');
      expect(systemPrompt).toContain('Allocate 75%+ of the curriculum depth and milestone hours to the candidate\'s identified skill gaps');

      const userPromptA = buildRoadmapUserPrompt({
        role: 'data_scientist',
        targetRoleTitle: 'Lead Data Scientist',
        tier: 'FAANG',
        level: 'BEGINNER',
        timelineWeeks: 12,
        weeklyHours: 5,
        requiredSkills: ['Python for Data', 'SQL', 'Statistics', 'Machine Learning'],
        missingSkills: ['Statistics', 'Machine Learning'],
        knownSkills: ['Python', 'SQL', 'Pandas'],
        identifiedBlindspots: ['statistics-probability'],
        prerequisiteOrder: ['Python', 'SQL', 'Statistics', 'Machine Learning'],
        depthLayers: { 0: ['Python'], 1: ['Statistics'], 2: ['Machine Learning'] },
      });

      expect(userPromptA).toContain('Known Skills (Already Mastered — SKIP beginner milestones for these): Python, SQL, Pandas');
      expect(userPromptA).toContain('Identified Skill Gaps / Weak Areas (PRIORITY FOCUS — dedicate 75%+ of roadmap): Statistics, Machine Learning');
      expect(userPromptA).toContain('5 hours/week available, Total Budget: ~60 hours');
    });
  });
});
