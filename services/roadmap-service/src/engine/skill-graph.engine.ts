// ═══════════════════════════════════════════════════════════════
// Skill Graph Engine — Directed Acyclic Graph (DAG) Traversal
// Topological Ordering, Cycle Detection & Prerequisite Resolver
// ═══════════════════════════════════════════════════════════════

import {
  SKILL_TAXONOMY,
  CANONICAL_ROLES,
  ROLE_ALIASES,
  TaxonomySkill,
  CanonicalRoleDefinition,
} from '../data/skill-taxonomy.data.js';
import { BadRequestError, NotFoundError } from '../lib/errors.js';

export interface ResolvedRoleSkill {
  skill: TaxonomySkill;
  targetProficiency: number;
  isCore: boolean;
}

export class SkillGraphEngine {
  private taxonomy: Record<string, TaxonomySkill>;
  private roles: Record<string, CanonicalRoleDefinition>;
  private aliases: Record<string, string>;

  constructor(
    customTaxonomy = SKILL_TAXONOMY,
    customRoles = CANONICAL_ROLES,
    customAliases = ROLE_ALIASES
  ) {
    this.taxonomy = customTaxonomy;
    this.roles = customRoles;
    this.aliases = customAliases;
  }

  /**
   * Normalizes arbitrary user-supplied role strings into a canonical role key.
   * If the role matches an existing alias or canonical role, returns the canonical key.
   * If it does not match, returns the user's sanitized role string without rejecting valid careers.
   */
  public normalizeRole(roleInput: string): string {
    if (!roleInput || typeof roleInput !== 'string' || !roleInput.trim()) {
      throw new BadRequestError('Role input must be a non-empty string');
    }

    const cleanInput = roleInput.trim().toLowerCase();
    
    // 1. Check exact alias table match
    if (this.aliases[cleanInput]) {
      return this.aliases[cleanInput];
    }

    // 2. Check if uppercase is directly a canonical key
    const upperInput = roleInput.trim().toUpperCase();
    if (this.roles[upperInput]) {
      return upperInput;
    }

    // 3. Fallback fuzzy substring matching
    for (const [alias, canonicalKey] of Object.entries(this.aliases)) {
      if (cleanInput.includes(alias) || alias.includes(cleanInput)) {
        return canonicalKey;
      }
    }

    // 4. Open-ended role support: preserve original user role if no alias matches
    return roleInput.trim();
  }

  /**
   * Retrieves a single skill from the taxonomy by slug.
   */
  public getSkill(slug: string): TaxonomySkill {
    const skill = this.taxonomy[slug];
    if (!skill) {
      throw new NotFoundError(`Skill with slug "${slug}" does not exist in the canonical taxonomy`);
    }
    return { ...skill, prerequisites: [...skill.prerequisites] };
  }

  /**
   * Resolves the required skills and target proficiencies for a given role and company tier.
   * Supports both canonical roles and arbitrary custom roles with intelligent contextual matching.
   */
  public resolveRoleSkills(rolePath: string, tier: string = 'FAANG'): ResolvedRoleSkill[] {
    const canonicalKey = this.normalizeRole(rolePath);
    const roleDef = this.roles[canonicalKey];

    // Tier benchmark modifier: FAANG / Tier-1 FinTech require higher bar (+5% capped at 100)
    const isHighTier = ['FAANG', 'Tier-1 FinTech'].includes(tier);
    const tierBonus = isHighTier ? 5 : 0;

    if (roleDef) {
      return roleDef.skills.map((req) => {
        const skill = this.getSkill(req.skillSlug);
        const targetProficiency = Math.min(100, req.targetProficiency + tierBonus);
        return {
          skill,
          targetProficiency,
          isCore: req.isCore ?? true,
        };
      });
    }

    // Custom / Open-Ended Role Handling:
    // Extract contextually relevant skills from taxonomy based on terms in the role title
    const lowerRole = rolePath.toLowerCase();
    const matchedSkills: TaxonomySkill[] = [];

    for (const skill of Object.values(this.taxonomy)) {
      const lowerName = skill.name.toLowerCase();
      const lowerCat = skill.category.toLowerCase();
      const lowerDesc = skill.description.toLowerCase();

      // Check if role contains category or skill keywords
      const terms = lowerRole.split(/[\s\-_/]+/);
      const isRelevant = terms.some((term) => {
        if (term.length < 3) return false;
        return lowerName.includes(term) || lowerCat.includes(term) || lowerDesc.includes(term);
      });

      if (isRelevant) {
        matchedSkills.push(skill);
      }
    }

    // If matches found, use them; otherwise use core foundational engineering skills
    const resolvedSkillsList = matchedSkills.length > 0
      ? matchedSkills
      : [
          this.getSkill('programming-fundamentals'),
          this.getSkill('git-version-control'),
          this.getSkill('computer-networks'),
          this.getSkill('sql-foundations'),
        ];

    return resolvedSkillsList.map((skill) => ({
      skill,
      targetProficiency: Math.min(100, 85 + tierBonus),
      isCore: true,
    }));
  }

  /**
   * Recursively traverses and expands a list of skill slugs to include all transitive prerequisites.
   * Guarantees no duplicate skills and preserves full dependency graphs.
   */
  public expandWithPrerequisites(skillSlugs: string[]): TaxonomySkill[] {
    const collected = new Map<string, TaxonomySkill>();
    const visited = new Set<string>();

    const dfs = (slug: string, trace: string[]) => {
      if (trace.includes(slug)) {
        const cycle = [...trace.slice(trace.indexOf(slug)), slug];
        throw new BadRequestError(`Circular prerequisite dependency detected: ${cycle.join(' -> ')}`);
      }

      if (visited.has(slug)) {
        return;
      }

      const skill = this.getSkill(slug);
      visited.add(slug);

      for (const prereqSlug of skill.prerequisites) {
        dfs(prereqSlug, [...trace, slug]);
      }

      collected.set(slug, skill);
    };

    for (const slug of skillSlugs) {
      dfs(slug, []);
    }

    return Array.from(collected.values());
  }

  /**
   * Detects cycles in a given set of skills or the full taxonomy.
   */
  public detectCycles(skills?: TaxonomySkill[]): { hasCycle: boolean; cyclePath?: string[] } {
    const skillList = skills || Object.values(this.taxonomy);
    const skillMap = new Map<string, TaxonomySkill>(skillList.map((s) => [s.slug, s]));

    const state = new Map<string, 'UNVISITED' | 'VISITING' | 'VISITED'>();
    for (const s of skillList) {
      state.set(s.slug, 'UNVISITED');
    }

    let cycleFound: string[] | null = null;

    const dfs = (currentSlug: string, currentPath: string[]): boolean => {
      state.set(currentSlug, 'VISITING');
      currentPath.push(currentSlug);

      const skill = skillMap.get(currentSlug) || this.taxonomy[currentSlug];
      const prereqs = skill?.prerequisites || [];

      for (const prereq of prereqs) {
        // Only inspect if prerequisite is part of the graph or known
        if (state.get(prereq) === 'VISITING') {
          const cycleStartIndex = currentPath.indexOf(prereq);
          cycleFound = [...currentPath.slice(cycleStartIndex), prereq];
          return true;
        }

        if (state.get(prereq) === 'UNVISITED') {
          if (dfs(prereq, currentPath)) return true;
        }
      }

      currentPath.pop();
      state.set(currentSlug, 'VISITED');
      return false;
    };

    for (const s of skillList) {
      if (state.get(s.slug) === 'UNVISITED') {
        if (dfs(s.slug, [])) {
          return { hasCycle: true, cyclePath: cycleFound || [] };
        }
      }
    }

    return { hasCycle: false };
  }

  /**
   * Returns a deterministic prerequisite-first linear ordering using Kahn's Algorithm.
   * If Skill A is a prerequisite of Skill B, Skill A is guaranteed to appear before Skill B.
   */
  public getTopologicalOrder(skills: TaxonomySkill[] | string[]): TaxonomySkill[] {
    const rawSkills: TaxonomySkill[] = typeof skills[0] === 'string'
      ? (skills as string[]).map((slug) => this.getSkill(slug))
      : (skills as TaxonomySkill[]);

    if (rawSkills.length === 0) return [];

    // 1. Expand all prerequisites to ensure the graph is closed
    const fullSkills = this.expandWithPrerequisites(rawSkills.map((s) => s.slug));
    
    // 2. Validate acyclic
    const cycleCheck = this.detectCycles(fullSkills);
    if (cycleCheck.hasCycle) {
      throw new BadRequestError(`Cannot compute topological order: Cycle detected [${cycleCheck.cyclePath?.join(' -> ')}]`);
    }

    const skillMap = new Map<string, TaxonomySkill>(fullSkills.map((s) => [s.slug, s]));
    
    // 3. Build Adjacency List (prereq -> dependents) and compute in-degrees
    // In-degree = number of prerequisites that must be completed before this skill
    const inDegree = new Map<string, number>();
    const dependentsMap = new Map<string, string[]>();

    for (const skill of fullSkills) {
      inDegree.set(skill.slug, 0);
      dependentsMap.set(skill.slug, []);
    }

    for (const skill of fullSkills) {
      for (const prereq of skill.prerequisites) {
        if (skillMap.has(prereq)) {
          inDegree.set(skill.slug, (inDegree.get(skill.slug) || 0) + 1);
          dependentsMap.get(prereq)!.push(skill.slug);
        }
      }
    }

    // 4. Queue all zero in-degree skills (foundational skills with no active prerequisites)
    // Deterministic tie-breaking: sort alphabetically by slug
    const queue: string[] = fullSkills
      .filter((s) => inDegree.get(s.slug) === 0)
      .map((s) => s.slug)
      .sort((a, b) => a.localeCompare(b));

    const result: TaxonomySkill[] = [];

    while (queue.length > 0) {
      const currentSlug = queue.shift()!;
      result.push(skillMap.get(currentSlug)!);

      // Decrement in-degree for all dependent skills
      const dependents = dependentsMap.get(currentSlug) || [];
      const readyDependents: string[] = [];

      for (const depSlug of dependents) {
        const updatedDegree = (inDegree.get(depSlug) || 1) - 1;
        inDegree.set(depSlug, updatedDegree);
        if (updatedDegree === 0) {
          readyDependents.push(depSlug);
        }
      }

      // Sort ready dependents alphabetically before enqueueing to maintain deterministic output
      readyDependents.sort((a, b) => a.localeCompare(b));
      queue.push(...readyDependents);
    }

    if (result.length !== fullSkills.length) {
      throw new BadRequestError('Topological sort failed: Unresolved cyclic dependency in skill set');
    }

    return result;
  }

  /**
   * Calculates the DAG depth/layer for each skill:
   * Depth 0 = Foundational (no prerequisites)
   * Depth 1 = Core (requires depth 0)
   * Depth 2+ = Advanced / Specialized
   */
  public calculateSkillDepths(skills: TaxonomySkill[] | string[]): Map<string, number> {
    const sorted = this.getTopologicalOrder(skills);
    const depthMap = new Map<string, number>();

    for (const skill of sorted) {
      if (!skill.prerequisites || skill.prerequisites.length === 0) {
        depthMap.set(skill.slug, 0);
      } else {
        let maxPrereqDepth = -1;
        for (const prereq of skill.prerequisites) {
          if (depthMap.has(prereq)) {
            maxPrereqDepth = Math.max(maxPrereqDepth, depthMap.get(prereq)!);
          }
        }
        depthMap.set(skill.slug, maxPrereqDepth + 1);
      }
    }

    return depthMap;
  }
}

export const skillGraphEngine = new SkillGraphEngine();
