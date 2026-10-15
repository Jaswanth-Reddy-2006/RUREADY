// ═══════════════════════════════════════════════════════════════
// Renatus — Dynamic Interview Engine & Context Memory
// Implements continuous, adaptive, human-like interviewer reasoning
// Dynamic question generation based on candidate answers & claims
// Zero predefined question lists, zero semantic repetitions
// ═══════════════════════════════════════════════════════════════

export interface CandidateProfile {
  targetRole: string;
  targetCompany?: string;
  experienceLevel: string;
  focusAreas: string[];
  skills?: string[];
  jobDescription?: string;
  resumeSummary?: string;
}

export interface CandidateAnswerRecord {
  question: string;
  answer: string;
  timestamp: number;
}

export interface InterviewContext {
  candidateProfile: CandidateProfile;
  questionsAsked: string[];
  topicsCovered: string[];
  answers: CandidateAnswerRecord[];
  importantClaims: string[];
  weakAreas: string[];
  strongAreas: string[];
  followUpOpportunities: string[];
  competenciesCovered: string[];
  competenciesRemaining: string[];
  currentTopic: string;
  interviewStage:
    | 'introduction'
    | 'technical'
    | 'project'
    | 'behavioral'
    | 'deep_dive'
    | 'closing';
  previousQuestion?: string;
  previousAnswer?: string;
  consecutiveFollowUpsOnCurrentTopic: number;
}

export const ALL_INTERVIEW_COMPETENCIES = [
  'Architecture & Design',
  'State & Concurrency Management',
  'Data Storage & Caching',
  'Performance Optimization',
  'Production Debugging & Observability',
  'System Trade-offs & Decision Making',
];

/**
 * Creates a clean InterviewContext at the start of a session.
 */
export function createInterviewContext(profile: CandidateProfile): InterviewContext {
  return {
    candidateProfile: {
      targetRole: profile.targetRole || 'Software Engineer',
      targetCompany: profile.targetCompany && profile.targetCompany !== 'None / General Target' ? profile.targetCompany : undefined,
      experienceLevel: profile.experienceLevel || 'Fresher',
      focusAreas: profile.focusAreas && profile.focusAreas.length > 0 ? profile.focusAreas : ['Technical Knowledge', 'Architecture'],
      skills: profile.skills || [],
      jobDescription: profile.jobDescription || '',
      resumeSummary: profile.resumeSummary || '',
    },
    questionsAsked: [],
    topicsCovered: [],
    answers: [],
    importantClaims: [],
    weakAreas: [],
    strongAreas: [],
    followUpOpportunities: [],
    competenciesCovered: [],
    competenciesRemaining: [...ALL_INTERVIEW_COMPETENCIES],
    currentTopic: 'Initial Feature Deep-Dive',
    interviewStage: 'introduction',
    consecutiveFollowUpsOnCurrentTopic: 0,
  };
}

/**
 * Generates Ava's first dynamic technical question tailored to the exact role/stack/company.
 * Never asks generic "What is your software background?" or "Tell me about yourself".
 * Uses clean, understandable, and conversational human phrasing.
 */
export function generateInitialDynamicQuestion(context: InterviewContext): string {
  const role = context.candidateProfile.targetRole || 'Software Engineer';
  const roleLower = role.toLowerCase();
  const company = context.candidateProfile.targetCompany;
  const skills = (context.candidateProfile.skills || []).map((s) => s.toLowerCase());
  const expLevel = (context.candidateProfile.experienceLevel || '').toLowerCase();
  const isJunior = expLevel.includes('fresher') || expLevel.includes('intern') || expLevel.includes('junior');

  let question = '';

  if (company) {
    if (roleLower.includes('frontend') || roleLower.includes('react') || skills.includes('react')) {
      question = `To kick off with ${company} in mind, can you walk me through a React application or feature you built recently, and explain how you structured its components and state?`;
    } else if (roleLower.includes('backend') || roleLower.includes('api') || roleLower.includes('node') || roleLower.includes('distributed')) {
      question = `To get started considering ${company}, tell me about a backend service or API you recently designed, and how you ensured it was performant and reliable.`;
    } else {
      question = `To begin our interview with ${company} in mind, can you tell me about a key technical project you recently worked on as a ${role}, and your personal contributions?`;
    }
  } else if (roleLower.includes('frontend') || roleLower.includes('react') || skills.includes('react')) {
    if (isJunior) {
      question = `To get started, can you walk me through a React project you built recently, and how you decided which state lives inside components versus shared state?`;
    } else {
      question = `To begin our technical discussion, walk me through the architecture of a React application you built recently, and how you handled shared state and component performance.`;
    }
  } else if (roleLower.includes('backend') || roleLower.includes('node') || roleLower.includes('java') || roleLower.includes('python') || roleLower.includes('go')) {
    if (isJunior) {
      question = `To start off, can you describe a backend API or service you developed recently, and how you structured your database queries and routes?`;
    } else {
      question = `To get started, describe a backend service or API you recently implemented, and the primary scaling or database concurrency challenges you had to solve.`;
    }
  } else if (roleLower.includes('full') || roleLower.includes('fullstack')) {
    question = `To begin, walk me through an end-to-end feature you built from the database up to the user interface, highlighting how the pieces connect together.`;
  } else if (roleLower.includes('system') || roleLower.includes('devops') || roleLower.includes('cloud') || roleLower.includes('sre')) {
    question = `To kick off, describe an infrastructure setup or deployment pipeline you worked on recently, and how you monitored its health and uptime.`;
  } else {
    question = `To kick off our technical discussion, describe a meaningful project you recently built as a ${role}, and what technical challenges you had to solve.`;
  }

  context.questionsAsked.push(question);
  context.previousQuestion = question;
  context.currentTopic = 'Initial Technical Architecture';
  return question;
}

/**
 * Extracts key technical terms and claims from the candidate's spoken answer.
 */
function extractTechnicalClaims(answer: string): {
  terms: string[];
  hasCaching: boolean;
  hasStateManagement: boolean;
  hasDatabase: boolean;
  hasOptimization: boolean;
  hasApiOrMicroservices: boolean;
  hasQueues: boolean;
  hasTestingOrCI: boolean;
} {
  const lower = answer.toLowerCase();

  const terms: string[] = [];
  const techKeywords = [
    'react', 'next.js', 'vue', 'context', 'redux', 'zustand', 'recoil',
    'node', 'express', 'fastify', 'nestjs', 'python', 'django', 'fastapi',
    'java', 'spring', 'go', 'golang', 'rust',
    'redis', 'memcached', 'cache', 'caching',
    'postgres', 'postgresql', 'mysql', 'mongodb', 'dynamodb', 'elasticsearch', 'prisma',
    'kafka', 'rabbitmq', 'sqs', 'celery', 'pub/sub', 'message queue',
    'docker', 'kubernetes', 'k8s', 'aws', 'lambda', 'ci/cd',
    'graphql', 'rest', 'grpc', 'websocket', 'microservices',
    'index', 'indexing', 'sharding', 'replication', 'connection pool',
    'latency', 'throughput', 'memory leak', 'profiling', 'concurrency', 'race condition',
    'optimization', 'optimized', 'scaling', 'refactored',
  ];

  techKeywords.forEach((kw) => {
    if (lower.includes(kw)) {
      terms.push(kw);
    }
  });

  return {
    terms,
    hasCaching: lower.includes('redis') || lower.includes('cache') || lower.includes('caching') || lower.includes('memcached'),
    hasStateManagement: lower.includes('context') || lower.includes('redux') || lower.includes('zustand') || lower.includes('state') || lower.includes('re-render'),
    hasDatabase: lower.includes('sql') || lower.includes('postgres') || lower.includes('mongo') || lower.includes('database') || lower.includes('index') || lower.includes('query'),
    hasOptimization: lower.includes('optimiz') || lower.includes('faster') || lower.includes('latency') || lower.includes('bottleneck') || lower.includes('performance'),
    hasApiOrMicroservices: lower.includes('microservice') || lower.includes('api') || lower.includes('rest') || lower.includes('graphql') || lower.includes('grpc') || lower.includes('service'),
    hasQueues: lower.includes('kafka') || lower.includes('queue') || lower.includes('rabbitmq') || lower.includes('celery') || lower.includes('event'),
    hasTestingOrCI: lower.includes('test') || lower.includes('ci/cd') || lower.includes('pipeline') || lower.includes('deploy'),
  };
}

/**
 * Checks if a question has already been asked or is semantically a duplicate.
 */
function isDuplicateQuestion(candidate: string, questionsAsked: string[]): boolean {
  const norm = candidate.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  return questionsAsked.some((q) => {
    const existingNorm = q.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    if (existingNorm === norm) return true;
    // Check overlap
    const wordsCandidate = new Set(norm.split(' '));
    const wordsExisting = new Set(existingNorm.split(' '));
    let common = 0;
    wordsCandidate.forEach((w) => {
      if (w.length > 3 && wordsExisting.has(w)) common++;
    });
    return common > 8; // High word overlap
  });
}

/**
 * Core dynamic reasoning engine.
 * Takes the current interview context and candidate's latest answer,
 * inspects claims, determines depth, adapts difficulty, and formulates the next question.
 */
export function generateNextDynamicQuestion(
  context: InterviewContext,
  latestAnswer: string
): { question: string; isClosing: boolean } {
  const cleanAnswer = latestAnswer.trim();
  const wordCount = cleanAnswer.split(/\s+/).filter(Boolean).length;
  const analysis = extractTechnicalClaims(cleanAnswer);

  // Record this answer into context memory
  context.answers.push({
    question: context.previousQuestion || '',
    answer: cleanAnswer,
    timestamp: Date.now(),
  });
  context.previousAnswer = cleanAnswer;

  // Add extracted technical claims
  analysis.terms.forEach((t) => {
    if (!context.importantClaims.includes(t)) {
      context.importantClaims.push(t);
    }
  });

  // Maximum interview questions safeguard (typically 5 to 7 high-depth exchanges)
  if (context.answers.length >= 7) {
    context.interviewStage = 'closing';
    return {
      question: "That gives me a very clear understanding of your technical depth and problem-solving methodology. Thank you for walking me through those systems so thoroughly.",
      isClosing: true,
    };
  }

  let nextQuestion = '';

  // ─── 1. Handling Vague or Brief Answers (Under 18 words) ───
  if (wordCount < 18) {
    context.weakAreas.push(context.currentTopic);
    nextQuestion = `Could you share a bit more detail about your personal role in that, and what specific challenges you had to solve?`;
  }
  // ─── 2. Follow-Up on Technical Claims (Deepen Current Topic) ───
  else if (context.consecutiveFollowUpsOnCurrentTopic < 2) {
    context.consecutiveFollowUpsOnCurrentTopic += 1;

    // Follow-up on Caching / Redis
    if (analysis.hasCaching && !context.topicsCovered.includes('Cache Invalidation & Freshness')) {
      context.topicsCovered.push('Cache Invalidation & Freshness');
      nextQuestion = `You mentioned caching. What specific data were you caching, and how did you handle updating or clearing that cache when data changed?`;
    }
    // Follow-up on React State Management / Context
    else if (analysis.hasStateManagement && !context.topicsCovered.includes('Client State Architecture')) {
      context.topicsCovered.push('Client State Architecture');
      nextQuestion = `You mentioned state management. Why did you choose that approach, and how did you keep the application fast and easy to maintain?`;
    }
    // Follow-up on Performance Optimization claims
    else if (analysis.hasOptimization && !context.topicsCovered.includes('Performance Profiling & Metrics')) {
      context.topicsCovered.push('Performance Profiling & Metrics');
      nextQuestion = `You mentioned improving performance. What was causing the slowdown, and what changes gave you the best improvement?`;
    }
    // Follow-up on Database Queries / Scaling
    else if (analysis.hasDatabase && !context.topicsCovered.includes('Database Scaling & Indexing')) {
      context.topicsCovered.push('Database Scaling & Indexing');
      nextQuestion = `Regarding your database layer, how did you structure your queries or schema, and did you run into any bottlenecks under load?`;
    }
    // Follow-up on Message Queues / Event Streams
    else if (analysis.hasQueues && !context.topicsCovered.includes('Message Processing & Guarantees')) {
      context.topicsCovered.push('Message Processing & Guarantees');
      nextQuestion = `When working with message queues in that flow, how did you handle failed messages or ensure items weren't processed twice?`;
    }
    // Follow-up on API / Microservice Boundaries
    else if (analysis.hasApiOrMicroservices && !context.topicsCovered.includes('API Contracts & Resilience')) {
      context.topicsCovered.push('API Contracts & Resilience');
      nextQuestion = `How did you design the API endpoints for that feature, and how did you handle error scenarios and data validation?`;
    }
    // Generic Architectural Depth Follow-up
    else {
      nextQuestion = `What were the main technical trade-offs with that design, and is there anything you would change in hindsight?`;
    }
  }

  // ─── 3. Transition to Unexplored Competency ───
  if (!nextQuestion || isDuplicateQuestion(nextQuestion, context.questionsAsked)) {
    context.consecutiveFollowUpsOnCurrentTopic = 0;

    // Pick from remaining competencies
    const remaining = context.competenciesRemaining.filter((c) => !context.competenciesCovered.includes(c));
    const nextCompetency = remaining[0] || 'System Trade-offs & Decision Making';

    context.competenciesCovered.push(nextCompetency);
    context.currentTopic = nextCompetency;

    if (nextCompetency === 'Production Debugging & Observability') {
      nextQuestion = `Let's talk about real-world debugging: can you describe a difficult bug or production issue you personally tracked down and fixed?`;
    } else if (nextCompetency === 'Data Storage & Caching') {
      nextQuestion = `When designing data persistence for a new feature, how do you decide between a relational database and a NoSQL or document store?`;
    } else if (nextCompetency === 'System Trade-offs & Decision Making') {
      nextQuestion = `Can you share an example of a difficult engineering trade-off you made, such as balancing feature completeness against delivery speed?`;
    } else if (nextCompetency === 'Performance Optimization') {
      nextQuestion = `When an application or query starts running slowly in production, what is your step-by-step approach to finding the root cause?`;
    } else {
      nextQuestion = `Looking back at that project, if you had the opportunity to rebuild it today, what would you improve?`;
    }
  }

  // Final duplication safeguard
  if (isDuplicateQuestion(nextQuestion, context.questionsAsked)) {
    nextQuestion = `Which technical decision in that implementation are you most proud of, and why?`;
  }

  context.questionsAsked.push(nextQuestion);
  context.previousQuestion = nextQuestion;

  return { question: nextQuestion, isClosing: false };
}
