// ═══════════════════════════════════════════════════════════════
// Skill Gap Analyzer — Deterministic Competency Evaluator
// Compares Candidate Baseline Evidence Against Target Role Benchmarks
// ═══════════════════════════════════════════════════════════════

import { SkillGapAnalysisResult } from '@ru-ready/shared';
import { TaxonomySkill } from '../data/skill-taxonomy.data.js';
import { ResolvedRoleSkill } from './skill-graph.engine.js';

export interface UserSkillAssessmentInput {
  skillSlug?: string;
  skillName?: string;
  score: number; // 0 to 100
}

export interface AnalyzeSkillGapParams {
  targetRole: string;
  requiredSkills: ResolvedRoleSkill[];
  userEvidence?: UserSkillAssessmentInput[] | Record<string, number>;
  knownSkillNames?: string[];
  identifiedBlindspots?: string[];
}

export class SkillGapAnalyzer {
  /**
   * Evaluates candidate skill proficiencies against target role requirements.
   * Produces a canonical SkillGapAnalysisResult with priority ratings and readiness scores.
   */
  public analyzeSkillGap(params: AnalyzeSkillGapParams): SkillGapAnalysisResult {
    const {
      targetRole,
      requiredSkills,
      userEvidence,
      knownSkillNames = [],
      identifiedBlindspots = [],
    } = params;

    // 1. Build a normalized user score map (slug/normalized-name -> score 0-100)
    const userScoreMap = new Map<string, number>();

    if (userEvidence) {
      if (Array.isArray(userEvidence)) {
        for (const item of userEvidence) {
          const key = (item.skillSlug || item.skillName || '').toLowerCase().trim();
          if (key) {
            userScoreMap.set(key, Math.max(0, Math.min(100, Math.round(item.score))));
          }
        }
      } else {
        for (const [key, score] of Object.entries(userEvidence)) {
          userScoreMap.set(key.toLowerCase().trim(), Math.max(0, Math.min(100, Math.round(score))));
        }
      }
    }

    // 2. Incorporate self-reported known skill strings (with optional proficiency e.g. "Python: Advanced", "SQL: 85")
    for (const rawEntry of knownSkillNames) {
      const lower = rawEntry.toLowerCase().trim();
      let skillPart = lower;
      let score = 50;

      if (lower.includes(':') || lower.includes('-') || lower.includes('(')) {
        const parts = lower.split(/[:\-(]/);
        skillPart = parts[0].trim();
        const levelPart = parts.slice(1).join(' ').trim();
        const numMatch = levelPart.match(/\b(100|[1-9]?[0-9])\b/);
        if (numMatch) {
          score = parseInt(numMatch[1], 10);
        } else if (levelPart.includes('adv') || levelPart.includes('expert') || levelPart.includes('master')) {
          score = 90;
        } else if (levelPart.includes('inter') || levelPart.includes('mid') || levelPart.includes('proficient')) {
          score = 65;
        } else if (levelPart.includes('beg') || levelPart.includes('basic') || levelPart.includes('novice')) {
          score = 30;
        }
      }

      // Map skillPart to canonical taxonomy slugs
      const matchedKeys: string[] = [skillPart];
      if (skillPart.includes('python') || skillPart.includes('pandas') || skillPart.includes('numpy')) {
        matchedKeys.push('python-data-stack', 'programming-fundamentals');
      }
      if (skillPart.includes('sql') || skillPart.includes('postgres') || skillPart.includes('mysql')) {
        matchedKeys.push('sql-foundations');
      }
      if (skillPart.includes('database')) {
        matchedKeys.push('sql-foundations', 'database-internals-indexing');
      }
      if (skillPart.includes('html') || skillPart.includes('css') || skillPart.includes('javascript') || skillPart.includes('js')) {
        matchedKeys.push('html-css-dom', 'javascript-modern-es6');
      }
      if (skillPart.includes('react')) {
        matchedKeys.push('react-architecture');
      }
      if (skillPart.includes('node')) {
        matchedKeys.push('nodejs-async-runtime');
      }
      if (skillPart.includes('stat')) {
        matchedKeys.push('statistics-probability');
      }
      if (skillPart.includes('machine learning') || skillPart === 'ml') {
        matchedKeys.push('machine-learning-foundations');
      }
      if (skillPart.includes('deep learning') || skillPart === 'dl') {
        matchedKeys.push('deep-learning-neural-networks');
      }
      if (skillPart.includes('bi') || skillPart.includes('power bi') || skillPart.includes('tableau') || skillPart.includes('excel')) {
        matchedKeys.push('business-intelligence-bi');
      }

      for (const k of matchedKeys) {
        if (!userScoreMap.has(k) || userScoreMap.get(k)! < score) {
          userScoreMap.set(k, score);
        }
      }
    }

    const normalizedBlindspots = new Set(identifiedBlindspots.map((s) => s.toLowerCase().trim()));

    let totalTargetScore = 0;
    let totalDemonstratedScore = 0;
    let masteredCount = 0;
    let unmetCount = 0;

    const gapEntries: SkillGapAnalysisResult['skillGaps'] = [];

    for (const req of requiredSkills) {
      const skill = req.skill;
      const targetProficiency = req.targetProficiency;
      const slugKey = skill.slug.toLowerCase();
      const nameKey = skill.name.toLowerCase();

      // Determine candidate's current score
      let currentScore = 0;

      if (userScoreMap.has(slugKey)) {
        currentScore = userScoreMap.get(slugKey)!;
      } else if (userScoreMap.has(nameKey)) {
        currentScore = userScoreMap.get(nameKey)!;
      } else {
        for (const [k, sc] of userScoreMap.entries()) {
          if (slugKey.includes(k) || nameKey.includes(k) || k.includes(slugKey)) {
            currentScore = Math.max(currentScore, sc);
          }
        }
      }

      // Check if this skill is an explicitly identified blindspot
      const isBlindspot = Array.from(normalizedBlindspots).some(
        (spot) => slugKey.includes(spot) || nameKey.includes(spot) || spot.includes(slugKey)
      );

      if (isBlindspot) {
        // Blindspots cap current proficiency estimate at max 20%
        currentScore = Math.min(currentScore, 20);
      }

      const effectiveScore = Math.min(currentScore, targetProficiency);
      const gap = Math.max(0, targetProficiency - currentScore);

      totalTargetScore += targetProficiency;
      totalDemonstratedScore += effectiveScore;

      let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' = 'MEDIUM';
      let recommendedFocus = 'Refine advanced edge cases and practice Socratic defense';

      if (gap >= 40 || (currentScore === 0 && targetProficiency >= 80) || isBlindspot) {
        priority = 'CRITICAL';
        recommendedFocus = isBlindspot
          ? 'Explicit candidate blindspot: allocate deep prerequisite drills & foundational study'
          : 'Major competency deficit: allocate dedicated multi-task sprint focus';
      } else if (gap >= 20) {
        priority = 'HIGH';
        recommendedFocus = 'Substantial gap: reinforce through practical code drills and exercises';
      } else if (gap === 0) {
        priority = 'MEDIUM';
        recommendedFocus = 'Benchmark target met: ready for architectural interview challenge';
      }

      if (gap === 0) {
        masteredCount++;
      } else {
        unmetCount++;
      }

      gapEntries.push({
        skillName: skill.name,
        category: skill.category,
        requiredProficiency: targetProficiency,
        currentProficiency: currentScore,
        priority,
        recommendedFocus,
      });
    }

    // Deterministic sorting: CRITICAL first, then HIGH, then MEDIUM, then highest gap
    const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 };
    gapEntries.sort((a, b) => {
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pDiff !== 0) return pDiff;
      const gapA = a.requiredProficiency - a.currentProficiency;
      const gapB = b.requiredProficiency - b.currentProficiency;
      return gapB - gapA;
    });

    const overallReadinessBaseline = totalTargetScore > 0
      ? Math.min(100, Math.round((totalDemonstratedScore / totalTargetScore) * 100))
      : 0;

    return {
      targetRole,
      totalRequiredSkills: requiredSkills.length,
      masteredSkillsCount: masteredCount,
      unmetSkillsCount: unmetCount,
      overallReadinessBaseline,
      skillGaps: gapEntries,
    };
  }
}

export const skillGapAnalyzer = new SkillGapAnalyzer();
