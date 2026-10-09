import {
  findStandardRoleProfile,
  getAllStandardRoleProfiles,
  StandardRoleProfile,
} from '../data/standardizedRoleProfiles.data.js';
import {
  competitiveMatchService,
  CompetitiveMatchResult,
} from './competitiveMatch.service.js';

export interface RoleMatchRequest {
  resumeText: string;
  role: string;
  structuredElements?: any[];
}

export interface RoleMatchResult {
  status: 'MATCHED' | 'NOT_RELEVANT' | 'UNKNOWN_ROLE';
  score: number | null;
  role: string;
  isStandardizedProfile: boolean;
  standardizedProfile: {
    id: string;
    title: string;
    category: string;
    description: string;
    requiredSkills: string[];
    responsibilities: string[];
  } | null;
  reason?: string;
  model: string;
  modelSource: 'fine-tuned' | 'base-bge';
  weights: Record<string, number>;
  gate: Record<string, number>;
  matchSignals: {
    semanticSimilarity: number;
    skillOverlap: number;
    experienceRelevance: number;
    terminologyMatch: number;
  };
  signalsDetail: {
    rawCosine: number;
    matchedSkills: string[];
    missingSkills: string[];
    resumeSkills: string[];
  };
}

export const roleMatchingService = {
  /**
   * Return all available standardized role profile metadata.
   */
  getAvailableRoles(): Array<{ id: string; title: string; category: string; description: string; requiredSkills: string[] }> {
    return getAllStandardRoleProfiles().map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      description: p.description,
      requiredSkills: p.requiredSkills,
    }));
  },

  /**
   * Evaluate a resume against a target role's standardized profile.
   * Uses BGE semantic embedding and skill overlap on the comprehensive
   * standardized role profile.
   */
  async matchRole(request: RoleMatchRequest): Promise<RoleMatchResult> {
    const { resumeText, role, structuredElements } = request;
    const cleanRole = (role || '').trim();

    if (!cleanRole) {
      return {
        status: 'UNKNOWN_ROLE',
        score: null,
        role: 'Unknown',
        isStandardizedProfile: false,
        standardizedProfile: null,
        reason: 'Please specify a target role title to evaluate.',
        model: 'BAAI/bge-large-en-v1.5',
        modelSource: 'base-bge',
        weights: {},
        gate: {},
        matchSignals: {
          semanticSimilarity: 0,
          skillOverlap: 0,
          experienceRelevance: 0,
          terminologyMatch: 0,
        },
        signalsDetail: {
          rawCosine: 0,
          matchedSkills: [],
          missingSkills: [],
          resumeSkills: [],
        },
      };
    }

    const profile = findStandardRoleProfile(cleanRole);

    if (!profile) {
      return {
        status: 'UNKNOWN_ROLE',
        score: null,
        role: cleanRole,
        isStandardizedProfile: false,
        standardizedProfile: null,
        reason: `No standardized role profile found for "${cleanRole}". Please select a recognized engineering or technical role (e.g., Frontend Developer, Backend Developer, Full Stack Developer, Cybersecurity Analyst).`,
        model: 'BAAI/bge-large-en-v1.5',
        modelSource: 'base-bge',
        weights: {},
        gate: {},
        matchSignals: {
          semanticSimilarity: 0,
          skillOverlap: 0,
          experienceRelevance: 0,
          terminologyMatch: 0,
        },
        signalsDetail: {
          rawCosine: 0,
          matchedSkills: [],
          missingSkills: [],
          resumeSkills: [],
        },
      };
    }

    // Evaluate using BGE against the standardized role profile
    const compResult: CompetitiveMatchResult = await competitiveMatchService.match({
      resumeText,
      jobDescription: profile.standardizedJdText,
      role: profile.title,
      structuredElements,
    });

    return {
      status: compResult.status === 'MATCHED' ? 'MATCHED' : 'NOT_RELEVANT',
      score: compResult.score,
      role: profile.title,
      isStandardizedProfile: true,
      standardizedProfile: {
        id: profile.id,
        title: profile.title,
        category: profile.category,
        description: profile.description,
        requiredSkills: profile.requiredSkills,
        responsibilities: profile.responsibilities,
      },
      reason: compResult.reason,
      model: compResult.model,
      modelSource: compResult.modelSource,
      weights: compResult.weights,
      gate: compResult.gate,
      matchSignals: compResult.matchSignals,
      signalsDetail: compResult.signalsDetail,
    };
  },
};
