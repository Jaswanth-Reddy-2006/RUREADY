/**
 * Bullet Recommendation Engine
 *
 * Provides deduplicated, bullet-specific actionable recommendations
 * for resume bullets, with text corruption detection, conditional metrics,
 * and truthful summary metrics. Never fabricates numbers or achievements.
 */

export const STRONG_ACTION_VERBS = [
  // Design, UX & Creative
  'Designed', 'Redesigned', 'Prototyped', 'Researched', 'Evaluated', 'Mapped',
  'Crafted', 'Wireframed', 'Simplified', 'Standardized', 'Visualized', 'Conceptualized',
  'Iterated', 'Authored', 'Moderated', 'Conducted', 'Synthesized', 'Translated',
  'Illustrated', 'Streamlined', 'Created', 'Validated', 'Tested',

  // Software, Architecture & Engineering
  'Architected', 'Engineered', 'Developed', 'Implemented', 'Deployed', 'Automated',
  'Optimized', 'Scaled', 'Overhauled', 'Pioneered', 'Configured', 'Integrated',
  'Modernized', 'Refactored', 'Debugged', 'Built', 'Programmed', 'Maintained',
  'Constructed', 'Devised', 'Established',

  // Product, Management & Strategy
  'Spearheaded', 'Orchestrated', 'Directed', 'Managed', 'Led', 'Formulated',
  'Prioritized', 'Coordinated', 'Facilitated', 'Defined', 'Aligned', 'Executed',
  'Championed', 'Supervised', 'Delivered', 'Governed',

  // Marketing, Sales & Growth
  'Launched', 'Campaigned', 'Promoted', 'Generated', 'Increased', 'Boosted',
  'Engaged', 'Drove', 'Acquired', 'Published', 'Positioned', 'Expanded',
  'Amplified', 'Targeted', 'Segmented', 'Negotiated', 'Closed',

  // Analysis, Data & Research
  'Analyzed', 'Modeled', 'Forecasted', 'Discovered', 'Extracted', 'Transformed',
  'Quantified', 'Assessed', 'Benchmarked', 'Investigated', 'Audited', 'Interpreted',
  'Surveyed', 'Correlated',

  // Finance, Operations & HR
  'Reconciled', 'Budgeted', 'Allocated', 'Procured', 'Mitigated', 'Saved',
  'Recruited', 'Sourced', 'Hired', 'Onboarded', 'Trained', 'Mentored',
  'Coached', 'Mediated', 'Accelerated', 'Strengthened', 'Enhanced',
  'Maximized', 'Partnered', 'Collaborated', 'Achieved', 'Resolved'
];

export type BulletIssueCategory =
  | 'TEXT_CORRUPTION'
  | 'VAGUE_OWNERSHIP'
  | 'WEAK_ACTION_VERB'
  | 'UNCLEAR_TECH'
  | 'MISSING_OUTCOME'
  | 'NONE';

export interface AffectedBulletRef {
  id: string;
  context: string;
  original: string;
  hasMetrics: boolean;
  hasStrongVerb: boolean;
  detectedVerb: string;
  isCorrupted?: boolean;
}

export interface RecommendationGroup {
  id: string;
  category: BulletIssueCategory;
  title: string;
  feedback: string;
  actionableGuidance: string;
  affectedBullets: AffectedBulletRef[];
  isFlaggedForReview: boolean;
  domain?: string;
}

export interface RecommendationSummary {
  bulletsEvaluated: number;
  bulletsWithIssues: number;
  uniqueRecommendationsCount: number;
  issueFreeBullets: number;
  healthPercentage: number;
  issuePercentage: number;
}

export interface EvaluatedBullet {
  id: string;
  context: string;
  original: string;
  category: BulletIssueCategory;
  isCorrupted: boolean;
  corruptionReason?: string;
  hasMetrics: boolean;
  hasStrongVerb: boolean;
  detectedVerb: string;
  feedback: string;
  suggestedRewrite: string;
  improvementReason: string;
  domain: string;
}

export interface BulletAuditAnalysisResult {
  audits: EvaluatedBullet[];
  recommendationGroups: RecommendationGroup[];
  summary: RecommendationSummary;
}

/**
 * Validates text for potential extraction corruption (encoding errors, mojibake, replacement chars, control chars, broken spacing).
 */
export function validateBulletText(text: string): { isCorrupted: boolean; reason?: string } {
  if (!text || typeof text !== 'string') {
    return { isCorrupted: false };
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { isCorrupted: false };
  }

  // 1. Replacement characters or null bytes
  if (trimmed.includes('\uFFFD') || trimmed.includes('\0')) {
    return {
      isCorrupted: true,
      reason: 'Contains null or unmapped unicode replacement characters (\\uFFFD)',
    };
  }

  // 2. Mojibake encoding artifacts (UTF-8 bytes misinterpreted as Windows-1252/Latin-1)
  if (/(?:â€™|â€œ|â€ |â€"|â€˜|Ã©|Ã¢|Ã¯|Ã¼|Ã±|Ã¨)/.test(trimmed)) {
    return {
      isCorrupted: true,
      reason: 'Contains mojibake encoding artifacts from corrupted document decoding',
    };
  }

  // 3. Unprintable control characters (excluding newline, carriage return, and tab)
  if (/[\x01-\x08\x0B\x0C\x0E-\x1F]/.test(trimmed)) {
    return {
      isCorrupted: true,
      reason: 'Contains unprintable control characters',
    };
  }

  // 4. Broken spaced character tokens (e.g. "t h i s   i s   c o r r u p t e d")
  if (/(?:\b[a-zA-Z]\s+){4,}[a-zA-Z]\b/.test(trimmed)) {
    return {
      isCorrupted: true,
      reason: 'Contains fragmented, single-spaced character artifacts from PDF extraction',
    };
  }

  // 5. Clustered nonsense symbols
  if (/[\^~`|\\<>{}\[\]@#$%\*]{4,}/.test(trimmed)) {
    return {
      isCorrupted: true,
      reason: 'Contains clustered unreadable symbols',
    };
  }

  // 6. High symbol density check (> 25% unusual non-alphanumeric chars for text > 25 chars)
  if (trimmed.length > 25) {
    const alphanumericAndSpace = trimmed.replace(/[^a-zA-Z0-9\s.,;:'"()\-–—/&]/g, '');
    const unusualSymbolCount = trimmed.length - alphanumericAndSpace.length;
    if (unusualSymbolCount / trimmed.length > 0.25) {
      return {
        isCorrupted: true,
        reason: 'High density of unreadable non-alphanumeric characters',
      };
    }
  }

  return { isCorrupted: false };
}

/**
 * Detects leading action verb.
 */
export function checkActionVerb(text: string): { isStrong: boolean; verb: string } {
  const trimmed = text.trim();
  const firstWordMatch = trimmed.match(/^([A-Za-z]+ed|[A-Za-z]+ing|[A-Za-z]+)/);
  const firstWord = firstWordMatch ? firstWordMatch[1] : '';

  const isStrong = STRONG_ACTION_VERBS.some((v) => v.toLowerCase() === firstWord.toLowerCase());
  return { isStrong, verb: firstWord };
}

/**
 * Checks for quantifiable metrics, percentages, dollar amounts, or validated outcome achievements.
 */
export function hasQuantifiableMetrics(text: string): boolean {
  if (!text) return false;

  // 1. Numeric metrics, percentages, dollar amounts, scale units
  const metricRegex = /\b(\d+(?:\.\d+)?%|\$[\d,]+(?:\.\d+)?|\d+\+?|\b\d+x\b|\b\d+\s*(?:users|clients|requests|qps|rps|tps|ms|seconds|minutes|hours|days|percent|engineers|services|k|m|b|million|thousand|screens|flows|interviews|participants|iterations|prototypes|leads|deals|customers|cases))\b/i;
  if (metricRegex.test(text)) return true;

  // 2. Qualitative outcome-oriented achievement language
  const outcomeRegex = /(?:reduced|decreased|minimized|eliminated)\s+(?:friction|drop-off|errors?|churn|latency|complexity|bounce rate|time|overhead|costs?|bottlenecks?)|(?:improved|increased|boosted|enhanced|maximized|elevated)\s+(?:clarity|usability|engagement|retention|conversion|satisfaction|accessibility|adoption|efficiency|productivity|readability|nps|throughput|revenue|accuracy|performance)|(?:streamlined|simplified|accelerated|optimized|standardized)\s+(?:onboarding|workflows?|user flows?|checkouts?|processes?|design systems?|pipelines?|operations?|experiences?|interactions?|systems?)|(?:resulting in|leading to|driving|delivering|achieving|contributing to)\s+[a-zA-Z\s]{4,}/i;
  return outcomeRegex.test(text);
}

/**
 * Detects domain area of a bullet point to tailor advice.
 */
export function detectBulletDomain(text: string): string {
  const lower = text.toLowerCase();
  if (/\b(?:postgres|postgresql|mongodb|redis|sql|mysql|dynamodb|cassandra|database|schema|query|queries|indexing)\b/.test(lower)) {
    return 'database';
  }
  if (/\b(?:security|encryption|auth|oauth|jwt|vulnerability|firewall|threat|pen-?test|cve|ssl|tls|audit)\b/.test(lower)) {
    return 'security';
  }
  if (/\b(?:ai|ml|model|pytorch|tensorflow|algorithm|prediction|training|accuracy|llm|nlp|dataset|inference)\b/.test(lower)) {
    return 'data_ml';
  }
  if (/\b(?:docker|kubernetes|k8s|aws|cloud|ci\/cd|pipeline|terraform|deploy|deployment|serverless|linux|infrastructure)\b/.test(lower)) {
    return 'devops';
  }
  if (/\b(?:android|ios|kotlin|swift|jetpack|flutter|mobile)\b/.test(lower)) {
    return 'mobile';
  }
  if (/\b(?:react|vue|angular|css|tailwind|html|ui|ux|canvas|frontend|component|responsive|dashboard|wireframe|figma)\b/.test(lower)) {
    return 'frontend';
  }
  if (/\b(?:api|apis|rest|graphql|microservice|grpc|express|node|fastapi|backend|endpoint|server|gateway)\b/.test(lower)) {
    return 'backend';
  }
  return 'general';
}

/**
 * Checks if a bullet contains identifiable technologies, tools, or architectural concepts.
 */
function hasIdentifiableTech(text: string): boolean {
  const techRegex = /\b(?:react|vue|angular|svelte|next\.js|node|express|fastapi|django|flask|spring|python|java|javascript|typescript|c\+\+|c#|go|golang|rust|ruby|php|sql|postgresql|postgres|mysql|mongodb|redis|dynamodb|cassandra|sqlite|docker|kubernetes|aws|gcp|azure|terraform|linux|git|github|canvas api|rest|graphql|grpc|ci\/cd|tailwind|html|css|pytorch|tensorflow|scikit-learn|pandas|numpy|jest|cypress|playwright|figma)\b/i;
  return techRegex.test(text);
}

/**
 * Checks whether this bullet type materially benefits from a quantitative metric.
 */
function benefitsFromMetric(text: string): boolean {
  const optimizationPattern = /\b(?:optimiz|reduc|increas|accelerat|improv|decreas|boost|enhanc|scal|speed|minimiz|streamlin|cut|sav|generat|handl|process|load|latenc|throughput|concurr|uptime)\w*\b/i;
  return optimizationPattern.test(text);
}

const WEAK_OPENING_REGEX = /^(?:participated in|assisted in|assisted with|assisted the team with|assisted the team in|helped with|helped the team with|contributed to|was responsible for|responsible for|duties included|tasked with|worked on|involved in)\b/i;

/**
 * Evaluates an individual bullet and assigns the primary issue category and bullet-specific guidance.
 */
export function evaluateSingleBullet(
  bullet: string,
  id: string,
  context: string,
  hasMetrics: boolean,
  hasStrongVerb: boolean,
  detectedVerb: string
): EvaluatedBullet {
  const trimmed = bullet.trim();
  const domain = detectBulletDomain(trimmed);
  const corruptionCheck = validateBulletText(trimmed);

  // 1. TEXT CORRUPTION (Priority 0)
  if (corruptionCheck.isCorrupted) {
    const feedback = 'Flagged for Review: Potential Text Extraction Corruption. This entry contains unreadable or fragmented characters from document parsing. Verify and edit the source text directly.';
    return {
      id,
      context,
      original: trimmed,
      category: 'TEXT_CORRUPTION',
      isCorrupted: true,
      corruptionReason: corruptionCheck.reason,
      hasMetrics,
      hasStrongVerb,
      detectedVerb,
      feedback,
      suggestedRewrite: trimmed,
      improvementReason: feedback,
      domain,
    };
  }

  // 2. VAGUE RESPONSIBILITY / PASSIVE OWNERSHIP (Priority 1)
  if (WEAK_OPENING_REGEX.test(trimmed)) {
    let feedback = '';
    if (/\b(?:sprint|scrum|agile|meeting|cycle|standup)\b/i.test(trimmed)) {
      feedback = 'Clarify what specific feature, module, or fix you personally delivered during these sprint cycles rather than describing passive participation.';
    } else if (/\b(?:responsible for|duties included|was responsible for)\b/i.test(trimmed)) {
      feedback = 'Shift focus from assigned duties to the specific features, systems, or solutions you individually delivered.';
    } else if (/\b(?:helped with|assisted)\b/i.test(trimmed)) {
      feedback = 'Clarify your individual ownership by stating which component, module, or tool you independently designed or built.';
    } else if (/\b(?:worked on)\b/i.test(trimmed)) {
      feedback = 'Specify your direct technical contribution by detailing which modules, fixes, or architecture you implemented.';
    } else {
      feedback = 'Detail the concrete technical contribution you executed instead of using passive framing.';
    }

    return {
      id,
      context,
      original: trimmed,
      category: 'VAGUE_OWNERSHIP',
      isCorrupted: false,
      hasMetrics,
      hasStrongVerb,
      detectedVerb,
      feedback,
      suggestedRewrite: trimmed.endsWith('.') ? trimmed : `${trimmed}.`,
      improvementReason: feedback,
      domain,
    };
  }

  // 3. WEAK OR MISSING ACTION VERB (Priority 2)
  if (!hasStrongVerb) {
    let feedback = '';
    switch (domain) {
      case 'frontend':
        feedback = 'Begin with a strong action verb (e.g., Developed, Designed, Engineered) highlighting the specific user interface or component delivered.';
        break;
      case 'backend':
        feedback = 'Begin with a strong action verb (e.g., Architected, Engineered, Implemented) highlighting the API service or architecture delivered.';
        break;
      case 'devops':
        feedback = 'Begin with a strong action verb (e.g., Automated, Deployed, Orchestrated) showcasing direct infrastructure ownership.';
        break;
      case 'data_ml':
        feedback = 'Begin with a strong action verb (e.g., Trained, Engineered, Implemented) highlighting the data pipeline or model built.';
        break;
      case 'security':
        feedback = 'Begin with a strong action verb (e.g., Hardened, Engineered, Implemented) describing the security mechanism delivered.';
        break;
      case 'database':
        feedback = 'Begin with a strong action verb (e.g., Optimized, Designed, Structured) describing the database schema or query delivered.';
        break;
      case 'mobile':
        feedback = 'Begin with a strong action verb (e.g., Developed, Architected, Engineered) describing the mobile feature delivered.';
        break;
      default:
        feedback = 'Begin with a strong action verb (e.g., Engineered, Spearheaded, Implemented) describing your direct contribution.';
        break;
    }

    return {
      id,
      context,
      original: trimmed,
      category: 'WEAK_ACTION_VERB',
      isCorrupted: false,
      hasMetrics,
      hasStrongVerb: false,
      detectedVerb,
      feedback,
      suggestedRewrite: trimmed.endsWith('.') ? trimmed : `${trimmed}.`,
      improvementReason: feedback,
      domain,
    };
  }

  // 4. UNCLEAR TECHNICAL CONTRIBUTION (Priority 3)
  if (!hasIdentifiableTech(trimmed) && trimmed.split(/\s+/).length >= 5) {
    const feedback = 'Specify the key technologies, libraries, or architectural patterns used to deliver this solution.';
    return {
      id,
      context,
      original: trimmed,
      category: 'UNCLEAR_TECH',
      isCorrupted: false,
      hasMetrics,
      hasStrongVerb: true,
      detectedVerb,
      feedback,
      suggestedRewrite: trimmed.endsWith('.') ? trimmed : `${trimmed}.`,
      improvementReason: feedback,
      domain,
    };
  }

  // 5. MISSING MEASURABLE OUTCOME / CONDITIONAL METRICS (Priority 4)
  if (!hasMetrics) {
    if (benefitsFromMetric(trimmed)) {
      let feedback = '';
      switch (domain) {
        case 'frontend':
          feedback = 'Add a verified user or performance outcome if available from your results (e.g., page load reduction % or active user count).';
          break;
        case 'backend':
          feedback = 'Add a verified scale or latency outcome if available from your results (e.g., p99 latency reduction ms or throughput QPS).';
          break;
        case 'devops':
          feedback = 'Add a verified infrastructure outcome if available from your results (e.g., deployment cycle speedup % or CI build time reduction).';
          break;
        case 'data_ml':
          feedback = 'Add a verified accuracy or throughput outcome if available from your results (e.g., model accuracy % or inference latency ms).';
          break;
        case 'database':
          feedback = 'Add a verified database performance outcome if available from your results (e.g., query execution time reduction or record volume handled).';
          break;
        case 'security':
          feedback = 'Add a verified security outcome if available from your results (e.g., vulnerability reduction % or audit turnaround time).';
          break;
        default:
          feedback = 'Add a verified efficiency outcome if available from your results (e.g., processing time saved or volume handled).';
          break;
      }

      return {
        id,
        context,
        original: trimmed,
        category: 'MISSING_OUTCOME',
        isCorrupted: false,
        hasMetrics: false,
        hasStrongVerb: true,
        detectedVerb,
        feedback,
        suggestedRewrite: trimmed.endsWith('.') ? trimmed : `${trimmed}.`,
        improvementReason: feedback,
        domain,
      };
    } else {
      // Standard feature development: clarify operational outcome or team adoption rather than forcing synthetic numbers
      const feedback = 'Clarify the operational impact or user adoption achieved by this deliverable, if available from your actual experience.';
      return {
        id,
        context,
        original: trimmed,
        category: 'MISSING_OUTCOME',
        isCorrupted: false,
        hasMetrics: false,
        hasStrongVerb: true,
        detectedVerb,
        feedback,
        suggestedRewrite: trimmed.endsWith('.') ? trimmed : `${trimmed}.`,
        improvementReason: feedback,
        domain,
      };
    }
  }

  // 6. NO ISSUE DETECTED (Already strong: strong verb + tech + metrics/outcome + uncorrupted)
  return {
    id,
    context,
    original: trimmed,
    category: 'NONE',
    isCorrupted: false,
    hasMetrics: true,
    hasStrongVerb: true,
    detectedVerb,
    feedback: 'Follows STAR structure with a strong action verb, clear technical scope, and quantified outcome.',
    suggestedRewrite: trimmed.endsWith('.') ? trimmed : `${trimmed}.`,
    improvementReason: 'Strong bullet with clear active ownership and verified impact.',
    domain,
  };
}

/**
 * Deduplicates individual bullet evaluations into clean recommendation groups
 * and computes truthful summary statistics.
 */
export function buildRecommendationGroups(
  evaluatedBullets: EvaluatedBullet[]
): { recommendationGroups: RecommendationGroup[]; summary: RecommendationSummary } {
  const bulletsEvaluated = evaluatedBullets.length;

  if (bulletsEvaluated === 0) {
    return {
      recommendationGroups: [],
      summary: {
        bulletsEvaluated: 0,
        bulletsWithIssues: 0,
        uniqueRecommendationsCount: 0,
        issueFreeBullets: 0,
        healthPercentage: 100, // Safe default, zero bullets (no NaN)
        issuePercentage: 0,
      },
    };
  }

  const groupMap = new Map<string, RecommendationGroup>();
  const bulletsWithIssuesSet = new Set<string>();

  for (const b of evaluatedBullets) {
    if (b.category === 'NONE') {
      continue;
    }

    bulletsWithIssuesSet.add(b.id);
    const groupKey = `${b.category}:::${b.feedback}`;

    if (!groupMap.has(groupKey)) {
      let title = '';
      let actionableGuidance = '';

      switch (b.category) {
        case 'TEXT_CORRUPTION':
          title = 'Flagged for Review: Potential Text Extraction Corruption';
          actionableGuidance = 'Inspect this bullet in your source document and re-enter or correct the text. Automated rewrites are disabled for corrupted text to preserve data integrity.';
          break;
        case 'VAGUE_OWNERSHIP':
          title = 'Clarify Individual Ownership on Collaborative Tasks';
          actionableGuidance = 'Use active ownership language: "[Strong Verb] [specific feature/module] using [technologies], delivering [verified outcome]".';
          break;
        case 'WEAK_ACTION_VERB':
          title = 'Strengthen Opening Action Verbs';
          actionableGuidance = 'Replace passive openers or noun headings with a strong, domain-aligned past-tense action verb asserting your direct execution.';
          break;
        case 'UNCLEAR_TECH':
          title = 'Specify Technologies & Architecture Used';
          actionableGuidance = 'Name the concrete languages, frameworks, libraries, or architectural patterns used so technical screeners can assess depth.';
          break;
        case 'MISSING_OUTCOME':
          title = 'Add Verified Outcomes to Accomplishments';
          actionableGuidance = 'Incorporate verified quantitative metrics or business outcomes from your actual experience. Never invent numbers or achievements.';
          break;
        default:
          title = 'Enhance Accomplishment Quality';
          actionableGuidance = 'Strengthen this bullet with specific, verified details from your experience.';
          break;
      }

      groupMap.set(groupKey, {
        id: `rec-${groupMap.size + 1}`,
        category: b.category,
        title,
        feedback: b.feedback,
        actionableGuidance,
        affectedBullets: [],
        isFlaggedForReview: b.category === 'TEXT_CORRUPTION',
        domain: b.domain,
      });
    }

    const group = groupMap.get(groupKey)!;
    group.affectedBullets.push({
      id: b.id,
      context: b.context,
      original: b.original,
      hasMetrics: b.hasMetrics,
      hasStrongVerb: b.hasStrongVerb,
      detectedVerb: b.detectedVerb,
      isCorrupted: b.isCorrupted,
    });
  }

  const recommendationGroups = Array.from(groupMap.values());
  const bulletsWithIssues = bulletsWithIssuesSet.size;
  const issueFreeBullets = Math.max(0, bulletsEvaluated - bulletsWithIssues);
  const healthPercentage = Math.round((issueFreeBullets / bulletsEvaluated) * 100);
  const issuePercentage = Math.round((bulletsWithIssues / bulletsEvaluated) * 100);

  return {
    recommendationGroups,
    summary: {
      bulletsEvaluated,
      bulletsWithIssues,
      uniqueRecommendationsCount: recommendationGroups.length,
      issueFreeBullets,
      healthPercentage,
      issuePercentage,
    },
  };
}

/**
 * Audits all bullets in a resume data structure and produces both individual audits,
 * deduplicated recommendation groups, and truthful summary statistics.
 */
export function auditResumeBullets(resume?: any): BulletAuditAnalysisResult {
  const safeResume = resume || {};
  const evaluatedBullets: EvaluatedBullet[] = [];

  (safeResume.experience || []).forEach((exp: any, expIdx: number) => {
    (exp?.bullets || []).forEach((bullet: string, bIdx: number) => {
      if (!bullet || !bullet.trim()) return;
      const { isStrong, verb } = checkActionVerb(bullet);
      const hasMetric = hasQuantifiableMetrics(bullet);
      const id = `${exp.id || `exp-${expIdx}`}-b${bIdx}`;
      const context = `${exp.title || 'Role'} • ${exp.company || 'Organization'}`;
      evaluatedBullets.push(
        evaluateSingleBullet(bullet, id, context, hasMetric, isStrong, verb)
      );
    });
  });

  (safeResume.projects || []).forEach((proj: any, projIdx: number) => {
    (proj?.bullets || []).forEach((bullet: string, bIdx: number) => {
      if (!bullet || !bullet.trim()) return;
      const { isStrong, verb } = checkActionVerb(bullet);
      const hasMetric = hasQuantifiableMetrics(bullet);
      const id = `${proj.id || `proj-${projIdx}`}-b${bIdx}`;
      const context = `Project • ${proj.name || 'Key Work'}`;
      evaluatedBullets.push(
        evaluateSingleBullet(bullet, id, context, hasMetric, isStrong, verb)
      );
    });
  });

  const { recommendationGroups, summary } = buildRecommendationGroups(evaluatedBullets);
  return {
    audits: evaluatedBullets,
    recommendationGroups,
    summary,
  };
}
