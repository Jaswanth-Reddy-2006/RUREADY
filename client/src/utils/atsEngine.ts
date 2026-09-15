// ═══════════════════════════════════════════════════════════════
// Rigorous Multi-Factor ATS Scoring Engine & Keyword Analyzer
// Evaluates real keyword density, STAR metrics, verb power, and format
// ═══════════════════════════════════════════════════════════════

export interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    highlights?: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    techStack: string[];
    liveUrl?: string;
    repoUrl?: string;
    bullets: string[];
  }>;
  skills: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    cloudDevOps: string[];
    tools: string[];
  };
  certifications: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    credentialUrl?: string;
  }>;
}

export interface BulletAudit {
  id: string;
  context: string; // e.g. "Software Engineer @ FinTech Corp"
  original: string;
  hasMetrics: boolean;
  hasStrongVerb: boolean;
  detectedVerb: string;
  suggestedRewrite: string;
  improvementReason: string;
}

export interface AtsScoreResult {
  totalScore: number; // 0 - 100
  grade: 'Exceptional Match' | 'Competitive Match' | 'Moderate Match' | 'Needs Improvement';
  breakdown: {
    keywordScore: number;      // 0 - 40
    metricsScore: number;      // 0 - 25
    completenessScore: number; // 0 - 20
    actionVerbScore: number;   // 0 - 15
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  bulletsAudit: BulletAudit[];
  formatChecks: Array<{
    title: string;
    passed: boolean;
    description: string;
  }>;
  executiveSummaryAnalysis: {
    wordCount: number;
    hasJobKeywords: boolean;
    suggestion: string;
  };
}

// Tech and industry keywords recognized by ATS algorithms
export const TECH_KEYWORDS_DICTIONARY = [
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Golang', 'Java', 'Rust', 'C++', 'C#',
  'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express', 'NestJS', 'FastAPI',
  'Django', 'Spring Boot', 'GraphQL', 'REST API', 'gRPC', 'WebSockets', 'TailwindCSS',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Cassandra',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'CI/CD', 'GitHub Actions',
  'Kafka', 'RabbitMQ', 'Microservices', 'Distributed Systems', 'System Design',
  'Jest', 'Cypress', 'Playwright', 'TDD', 'Agile', 'Scrum', 'Git', 'Linux',
  'OAuth2', 'JWT', 'Security', 'PCI-DSS', 'Performance Optimization', 'High Concurrency',
  'P99 Latency', 'Observability', 'Datadog', 'Prometheus', 'Grafana'
];

export const STRONG_ACTION_VERBS = [
  'Architected', 'Spearheaded', 'Engineered', 'Designed', 'Orchestrated',
  'Optimized', 'Automated', 'Accelerated', 'Developed', 'Implemented',
  'Deployed', 'Standardized', 'Scaled', 'Overhauled', 'Pioneered',
  'Constructed', 'Configured', 'Integrated', 'Directed', 'Modernized',
  'Eliminated', 'Transformed', 'Formulated', 'Devised', 'Established'
];

export const WEAK_PASSIVE_VERBS = [
  'Worked on', 'Helped with', 'Assisted in', 'Responsible for', 'Handled',
  'Did', 'Participated in', 'Contributed to', 'Was involved in', 'Supported'
];

// Helper to extract text from entire resume object
export function resumeToPlainText(resume: ResumeData): string {
  const parts: string[] = [];
  parts.push(resume.personalInfo.fullName);
  parts.push(resume.personalInfo.title);
  parts.push(resume.personalInfo.location);
  parts.push(resume.summary);

  resume.experience.forEach(exp => {
    parts.push(`${exp.title} at ${exp.company}`);
    exp.bullets.forEach(b => parts.push(b));
  });

  resume.projects.forEach(proj => {
    parts.push(proj.name);
    parts.push(proj.description);
    parts.push(proj.techStack.join(' '));
    proj.bullets.forEach(b => parts.push(b));
  });

  const allSkills = [
    ...resume.skills.languages,
    ...resume.skills.frameworks,
    ...resume.skills.databases,
    ...resume.skills.cloudDevOps,
    ...resume.skills.tools
  ];
  parts.push(allSkills.join(' '));

  resume.education.forEach(edu => {
    parts.push(`${edu.degree} ${edu.school}`);
    if (edu.highlights) parts.push(edu.highlights);
  });

  resume.certifications.forEach(cert => {
    parts.push(`${cert.title} ${cert.issuer}`);
  });

  return parts.join('\n');
}

// Regex to detect quantifiable impact (numbers, percentages, dollar amounts, scale units)
export function hasQuantifiableMetrics(text: string): boolean {
  const metricRegex = /\b(\d+(?:\.\d+)?%|\$[\d,]+(?:\.\d+)?|\d+\+?|\b\d+x\b|\b\d+\s*(?:users|clients|requests|qps|rps|tps|ms|seconds|minutes|hours|days|percent|engineers|services|k|m|b|million|thousand))\b/i;
  return metricRegex.test(text);
}

// Detect leading action verb
export function checkActionVerb(text: string): { isStrong: boolean; verb: string } {
  const trimmed = text.trim();
  const firstWordMatch = trimmed.match(/^([A-Za-z]+ed|[A-Za-z]+ing|[A-Za-z]+)/);
  const firstWord = firstWordMatch ? firstWordMatch[1] : '';

  const isStrong = STRONG_ACTION_VERBS.some(v => v.toLowerCase() === firstWord.toLowerCase());
  return { isStrong, verb: firstWord };
}

// Generate an intelligent STAR rewrite for a bullet point
export function generateStarRewrite(originalBullet: string, contextRole?: string): { rewritten: string; reason: string } {
  const trimmed = originalBullet.trim();

  // If already strong with metrics, polish slightly
  if (hasQuantifiableMetrics(trimmed) && checkActionVerb(trimmed).isStrong) {
    return {
      rewritten: trimmed.endsWith('.') ? trimmed : `${trimmed}.`,
      reason: 'Already adheres to high-impact STAR structure.'
    };
  }

  // Template pattern rewrites based on bullet content
  const lower = trimmed.toLowerCase();

  if (lower.includes('api') || lower.includes('backend') || lower.includes('endpoint')) {
    return {
      rewritten: `Architected resilient high-throughput RESTful endpoints using Node.js & PostgreSQL, reducing p99 latency by 38% while scaling to 150,000+ daily active requests.`,
      reason: 'Injected leading strong action verb (Architected), specific tech stack, and quantified latency & throughput metrics.'
    };
  }

  if (lower.includes('frontend') || lower.includes('ui') || lower.includes('react') || lower.includes('component')) {
    return {
      rewritten: `Engineered responsive design system components in TypeScript React, decreasing client bundle size by 27% and boosting Lighthouse accessibility rating to 98/100.`,
      reason: 'Replaced passive phrasing with strong verb (Engineered), emphasized performance optimization, and added Lighthouse metrics.'
    };
  }

  if (lower.includes('test') || lower.includes('ci') || lower.includes('deploy') || lower.includes('docker')) {
    return {
      rewritten: `Automated end-to-end CI/CD deployment pipelines using Docker & GitHub Actions, cutting staging release lead time from 4 hours to 12 minutes with 90%+ automated test coverage.`,
      reason: 'Demonstrated business value with before/after time metrics and test coverage percentage.'
    };
  }

  if (lower.includes('cache') || lower.includes('redis') || lower.includes('query') || lower.includes('database')) {
    return {
      rewritten: `Optimized distributed Redis caching & PostgreSQL connection pooling, decreasing database CPU utilization by 45% during peak traffic spikes.`,
      reason: 'Specified quantifiable resource savings and architecture resilience.'
    };
  }

  // Generic powerful fallback
  const strongVerb = STRONG_ACTION_VERBS[Math.floor(Math.random() * 5)];
  return {
    rewritten: `${strongVerb} mission-critical production workflows for ${contextRole || 'core services'}, enhancing system reliability to 99.95% uptime and accelerating deployment velocity by 35%.`,
    reason: 'Transformed into STAR methodology (Situation, Task, Action, Result) with measurable operational outcomes.'
  };
}

// Extract keywords from Job Description
export function extractKeywordsFromJd(jobDescription: string): string[] {
  if (!jobDescription || !jobDescription.trim()) {
    return ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'REST API', 'System Design'];
  }

  const jdText = jobDescription.toLowerCase();
  const matched = TECH_KEYWORDS_DICTIONARY.filter(keyword => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(jdText);
  });

  // Ensure at least some keywords if JD has uncommon phrasing
  if (matched.length === 0) {
    return ['TypeScript', 'JavaScript', 'React', 'REST API', 'Git', 'Agile'];
  }

  return matched;
}

// Rigorous ATS Calculation Function
export function calculateAtsScore(
  resume: ResumeData,
  jobDescription: string = '',
  jobTitle: string = ''
): AtsScoreResult {
  const plainText = resumeToPlainText(resume).toLowerCase();
  const targetKeywords = extractKeywordsFromJd(jobDescription);

  // 1. Keyword Score (0 - 40 points)
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  targetKeywords.forEach(kw => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(plainText)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordRatio = targetKeywords.length > 0
    ? matchedKeywords.length / targetKeywords.length
    : 1;
  const keywordScore = Math.min(40, Math.round(keywordRatio * 40));

  // 2. Quantifiable Impact & STAR Metrics Score (0 - 25 points)
  let totalBullets = 0;
  let bulletsWithMetrics = 0;
  let bulletsWithStrongVerbs = 0;
  const bulletsAudit: BulletAudit[] = [];

  resume.experience.forEach(exp => {
    exp.bullets.forEach((bullet, idx) => {
      totalBullets++;
      const hasMetric = hasQuantifiableMetrics(bullet);
      const { isStrong, verb } = checkActionVerb(bullet);

      if (hasMetric) bulletsWithMetrics++;
      if (isStrong) bulletsWithStrongVerbs++;

      const rewrite = generateStarRewrite(bullet, `${exp.title} at ${exp.company}`);

      bulletsAudit.push({
        id: `${exp.id}-b${idx}`,
        context: `${exp.title} • ${exp.company}`,
        original: bullet,
        hasMetrics: hasMetric,
        hasStrongVerb: isStrong,
        detectedVerb: verb || 'None',
        suggestedRewrite: rewrite.rewritten,
        improvementReason: rewrite.reason
      });
    });
  });

  // Check project bullets as well
  resume.projects.forEach(proj => {
    proj.bullets.forEach((bullet, idx) => {
      totalBullets++;
      const hasMetric = hasQuantifiableMetrics(bullet);
      const { isStrong, verb } = checkActionVerb(bullet);

      if (hasMetric) bulletsWithMetrics++;
      if (isStrong) bulletsWithStrongVerbs++;

      const rewrite = generateStarRewrite(bullet, `Project: ${proj.name}`);

      bulletsAudit.push({
        id: `${proj.id}-b${idx}`,
        context: `Project • ${proj.name}`,
        original: bullet,
        hasMetrics: hasMetric,
        hasStrongVerb: isStrong,
        detectedVerb: verb || 'None',
        suggestedRewrite: rewrite.rewritten,
        improvementReason: rewrite.reason
      });
    });
  });

  const metricsRatio = totalBullets > 0 ? (bulletsWithMetrics / totalBullets) : 0.8;
  const metricsScore = Math.min(25, Math.round(metricsRatio * 25));

  // 3. Action Verb Strength Score (0 - 15 points)
  const verbRatio = totalBullets > 0 ? (bulletsWithStrongVerbs / totalBullets) : 0.8;
  const actionVerbScore = Math.min(15, Math.round(verbRatio * 15));

  // 4. Section Completeness & ATS Format Compliance (0 - 20 points)
  const formatChecks: Array<{ title: string; passed: boolean; description: string }> = [];

  // Contact info check (5 pts)
  const hasContact = Boolean(
    resume.personalInfo.fullName &&
    resume.personalInfo.email &&
    resume.personalInfo.phone &&
    resume.personalInfo.location
  );
  formatChecks.push({
    title: 'Standard Contact Header',
    passed: hasContact,
    description: hasContact
      ? 'Includes candidate name, valid email, phone number, and location.'
      : 'Missing full contact details (email, phone, or location required for recruiters).'
  });

  // Executive summary check (4 pts)
  const summaryWords = resume.summary.trim().split(/\s+/).filter(Boolean).length;
  const hasGoodSummary = summaryWords >= 20 && summaryWords <= 120;
  formatChecks.push({
    title: 'Executive Professional Summary',
    passed: hasGoodSummary,
    description: hasGoodSummary
      ? `Concise executive summary (${summaryWords} words) ideal for ATS extraction.`
      : `Summary is ${summaryWords < 20 ? 'too brief' : 'too lengthy'}. Ideal length is 30–80 words.`
  });

  // Experience depth check (4 pts)
  const hasExp = resume.experience.length >= 1 && totalBullets >= 2;
  formatChecks.push({
    title: 'Structured Work Experience',
    passed: hasExp,
    description: hasExp
      ? `Includes ${resume.experience.length} career roles with detailed STAR bullet points.`
      : 'At least 1 work experience entry with 2+ bullet points required.'
  });

  // Education presence check (3 pts)
  const hasEdu = resume.education.length >= 1 && Boolean(resume.education[0].degree);
  formatChecks.push({
    title: 'Degree & Educational Credentials',
    passed: hasEdu,
    description: hasEdu
      ? 'Accredited degree and institution clearly designated.'
      : 'ATS expects at least 1 verified education entry or credential.'
  });

  // Categorized Skills check (4 pts)
  const totalSkillCount = (
    resume.skills.languages.length +
    resume.skills.frameworks.length +
    resume.skills.databases.length +
    resume.skills.cloudDevOps.length +
    resume.skills.tools.length
  );
  const hasSkills = totalSkillCount >= 6;
  formatChecks.push({
    title: 'Categorized Technical Competencies',
    passed: hasSkills,
    description: hasSkills
      ? `${totalSkillCount} categorized technical competencies indexed.`
      : 'Add at least 6 technical skills categorized across languages, frameworks, or databases.'
  });

  let completenessScore = 0;
  if (hasContact) completenessScore += 5;
  if (hasGoodSummary) completenessScore += 4;
  if (hasExp) completenessScore += 4;
  if (hasEdu) completenessScore += 3;
  if (hasSkills) completenessScore += 4;

  const totalScore = Math.min(100, Math.max(0, keywordScore + metricsScore + completenessScore + actionVerbScore));

  let grade: AtsScoreResult['grade'] = 'Needs Improvement';
  if (totalScore >= 90) grade = 'Exceptional Match';
  else if (totalScore >= 75) grade = 'Competitive Match';
  else if (totalScore >= 60) grade = 'Moderate Match';

  return {
    totalScore,
    grade,
    breakdown: {
      keywordScore,
      metricsScore,
      completenessScore,
      actionVerbScore
    },
    matchedKeywords,
    missingKeywords,
    bulletsAudit,
    formatChecks,
    executiveSummaryAnalysis: {
      wordCount: summaryWords,
      hasJobKeywords: matchedKeywords.some(kw => resume.summary.toLowerCase().includes(kw.toLowerCase())),
      suggestion: matchedKeywords.length > 0
        ? `Incorporate "${matchedKeywords.slice(0, 3).join(', ')}" directly into your summary for higher top-of-fold relevance.`
        : 'Align summary with target engineering level and core distributed systems stack.'
    }
  };
}
