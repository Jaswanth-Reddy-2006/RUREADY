// ═══════════════════════════════════════════════════════════════
// R U Ready? — AI Service
// Bridges to the custom OpenAI-compatible endpoint or generates mock data
// ═══════════════════════════════════════════════════════════════

import {
  InterviewType,
  ExperienceLevel,
  QuestionType,
  Difficulty,
  ReadinessVerdict,
  Question,
  InterviewSession,
  ActionableTip,
} from '@ru-ready/shared';
import { prisma } from '../lib/prisma.js';
import {
  MASTER_PROMPT_QUESTION,
  MASTER_PROMPT_EVALUATION,
  MASTER_PROMPT_ANALYSIS,
  MASTER_PROMPT_TRANSCRIPT,
  MASTER_PROMPT_CODING_EVALUATION,
} from '../prompts/master_prompt.js';

import { aiProviderManager } from '../lib/ai-provider-manager.js';

interface GeneratedQuestionAI {
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  rationale?: string;
  isFollowUp?: boolean;
}

interface EvaluatedAnswerAI {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  betterAnswer: string;
  technicalDepth?: number;
  subjectCoverage?: number;
  communicationClarity?: number;
  completeness?: number;
  topicsCovered?: string[];
  gaps?: string[];
  needsFollowUp?: boolean;
  followUpReason?: string;
  isSkip?: boolean;
  starCompliance?: number;
  tutorialCopierFlag?: boolean;
  technicalOriginality?: number;
  algorithmicEfficiency?: number;
  codeQuality?: number;
  complexityJustification?: number;
  phaseReached?: string;
}

interface GeneratedAnalysisAI {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  structureScore: number;
  eyeContactScore: number;
  presenceScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  actionableTips: ActionableTip[];
  readinessVerdict: ReadinessVerdict;
}

/**
 * Clean and parse JSON returned from AI chat completions.
 * Handles markdown formatting code blocks.
 */
function parseJsonFromResponse<T>(text: string): T {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error('Could not parse JSON from AI response');
  }
}

/**
 * Call the active AI provider (Ollama, OpenAI, Gemini, Custom).
 */
async function callAICompletions<T>(
  systemPrompt: string,
  userPrompt: string,
  timeoutMs: number = 30000
): Promise<T> {
  const currentConfig = aiProviderManager.getConfig();
  if (currentConfig.provider === 'mock') {
    throw new Error('Mock mode is enabled. Use mock generators instead.');
  }

  try {
    const rawContent = await aiProviderManager.callChatCompletion(systemPrompt, userPrompt, timeoutMs);
    return parseJsonFromResponse<T>(rawContent);
  } catch (error) {
    console.warn(`[AIService] ${currentConfig.provider.toUpperCase()} call failed, activating graceful fallback:`, error);
    throw error;
  }
}


// ─── AI Service Exported Methods ─────────────────────────────

export const aiService = {
  /**
   * Cleans speech-to-text transcript before evaluation.
   */
  async enhanceTranscript(
    rawTranscript: string,
    questionText: string,
    session: InterviewSession,
  ): Promise<string> {
    if (!rawTranscript.trim()) return rawTranscript;
    if (aiProviderManager.getConfig().provider === 'mock') return rawTranscript.trim();

    const userPrompt = `Role: ${session.targetRole}
Question asked: ${questionText}
Raw spoken transcript (may contain STT errors):
"""
${rawTranscript}
"""`;

    try {
      const result = await callAICompletions<{ cleanedText: string }>(
        MASTER_PROMPT_TRANSCRIPT,
        userPrompt,
        10000,
      );
      return result.cleanedText?.trim() || rawTranscript.trim();
    } catch {
      return rawTranscript.trim();
    }
  },

  /**
   * Chain 1: Generates the next adaptive question based on setup and previous Q&As.
   */
  async generateNextQuestion(
    session: InterviewSession,
    previousQA: Array<{
      questionText: string;
      answerText?: string;
      score?: number;
      wordCount?: number;
      signoff?: boolean;
      needsFollowUp?: boolean;
      followUpReason?: string;
      gaps?: string[];
    }>,
    orderIndex: number
  ): Promise<GeneratedQuestionAI> {
    if ((session as any).mode === 'CODING' || (session.interviewType as string) === 'CODING') {
      let diff = 'EASY';
      const goalStr = session.interviewGoal || '';
      const diffMatch = goalStr.match(/\[Difficulty:\s*([^\]]+)\]/i);
      if (diffMatch) {
        diff = diffMatch[1].toUpperCase();
      } else if (session.experienceLevel === ExperienceLevel.MID) {
        diff = 'MEDIUM';
      } else if (session.experienceLevel === ExperienceLevel.SENIOR) {
        diff = 'HARD';
      }

      const problem = await prisma.preDefinedProblem.findFirst({
        where: { difficulty: diff },
      }) || await prisma.preDefinedProblem.findFirst();

      if (problem) {
        return {
          questionText: `PROBLEM: ${problem.title}\n\n${problem.description}\n\nOptimal Time: ${problem.optimalTime} | Space: ${problem.optimalSpace}`,
          questionType: QuestionType.TECHNICAL,
          difficulty: problem.difficulty as Difficulty,
        };
      }
    }

    const baselineMock = this.mockNextQuestion(session, previousQA, orderIndex);

    if (aiProviderManager.getConfig().provider === 'mock') {
      return baselineMock;
    }

    const systemPrompt = MASTER_PROMPT_QUESTION;

    const role = session.targetRole || 'Software Engineer';
    const roleLower = role.toLowerCase();
    let archetype = 'generic';
    if (/front[- ]?end|react|vue|angular|js|ts|javascript|typescript|ui|css|web/i.test(roleLower)) {
      archetype = 'frontend';
    } else if (/back[- ]?end|node|express|django|flask|spring|java|c#|python|go|golang|ruby|rust|api|database|sql|postgres|dbms/i.test(roleLower)) {
      archetype = 'backend';
    } else if (/full[- ]?stack/i.test(roleLower)) {
      archetype = 'fullstack';
    } else if (/ai|ml|machine[- ]?learning|deep[- ]?learning|nlp|vision|data[- ]?scientist|data[- ]?science/i.test(roleLower)) {
      archetype = 'aiml';
    } else if (/devops|sre|cloud|sysadmin|infrastructure|platform|kubernetes|docker|aws|gcp|azure/i.test(roleLower)) {
      archetype = 'devops';
    } else if (/mobile|ios|android|swift|kotlin|flutter|react[- ]?native/i.test(roleLower)) {
      archetype = 'mobile';
    } else if (/embedded|iot|firmware|hardware|microcontroller|c\+\+/i.test(roleLower)) {
      archetype = 'embedded';
    } else if (/security|cyber|penetration|network[- ]?security|secops/i.test(roleLower)) {
      archetype = 'security';
    } else if (/qa|test|quality|automation[- ]?engineer/i.test(roleLower)) {
      archetype = 'qa';
    } else if (/product|pm|po|manager/i.test(roleLower)) {
      archetype = 'product';
    }

    const last = previousQA[previousQA.length - 1];
    const userPrompt = `Candidate Session Details:
- Interview Type: ${session.interviewType}
- Target Role: ${session.targetRole} (Archetype: ${archetype})
- Target Company: ${session.targetCompany || 'Not specified'}
- Industry: ${session.industry}
- Experience Level: ${session.experienceLevel}
- Focus Areas: ${session.focusAreas.join(', ')}
- Resume Context: ${(session as any).resume?.parsedText?.slice(0, 2000) || 'No resume uploaded.'}
- Goals: ${session.interviewGoal?.slice(0, 1500) || 'General practice.'}
- Question Number in Sequence: ${orderIndex + 1}

Suggested Question Blueprint: "${baselineMock.questionText}"

CRITICAL INSTRUCTION FOR AVA:
The candidate is interviewing for a ${session.targetRole} role. Do NOT ask generic server-crash or database-recovery questions unless this is an SRE, DevOps, or Backend role. You must tailor the question specifically to the role archetype (${archetype}) and the suggested blueprint above.

Last answer assessment:
${last
  ? `- Score: ${last.score ?? 'n/a'}
- Needs follow-up: ${last.needsFollowUp ? 'YES — ' + (last.followUpReason || 'clarify gaps') : 'NO — move to new topic'}
- Gaps: ${(last.gaps || []).join('; ') || 'none'}`
  : 'N/A (first question)'}

Previous Q&A history:
${
  previousQA.length === 0
    ? 'FIRST question: open with a strong role-specific question (not generic "tell me about yourself" unless HR round).'
    : previousQA
        .map(
          (qa, i) =>
            `Q${i + 1}: ${qa.questionText}\nAnswer: ${qa.answerText || '[none]'}\nScore: ${qa.score ?? 'n/a'} | words: ${qa.wordCount ?? 'n/a'} | signoff: ${qa.signoff ? 'yes' : 'no'} | needsFollowUp was: ${qa.needsFollowUp ?? 'n/a'}`,
        )
        .join('\n\n')
}`;

    try {
      const raw = await callAICompletions<GeneratedQuestionAI>(systemPrompt, userPrompt, 25000);
      const questionText = raw.questionText?.trim() || '';

      // Post-generation validation
      const isServerCrash = /production[- ]?server|server[- ]?crash|diagnostic[- ]?workflow|crashes under high loads/i.test(questionText);
      const isIncorrectRole = archetype === 'frontend' || archetype === 'mobile' || archetype === 'design' || archetype === 'product';
      const isGenericRepeat = /retell|repeat|tell me again|say that again|repeat your answer|retell the complete/i.test(questionText) || questionText.length < 20;

      if (!questionText || (isServerCrash && isIncorrectRole) || isGenericRepeat) {
        console.warn(`[AIService] AI returned irrelevant/default/repeat question for ${archetype}: "${questionText}". Falling back to blueprint.`);
        return baselineMock;
      }

      return {
        questionText,
        questionType: Object.values(QuestionType).includes(raw.questionType as QuestionType)
          ? raw.questionType
          : QuestionType.BEHAVIOURAL,
        difficulty: Object.values(Difficulty).includes(raw.difficulty as Difficulty)
          ? raw.difficulty
          : Difficulty.MEDIUM,
        rationale: raw.rationale,
        isFollowUp: Boolean(raw.isFollowUp),
      };
    } catch {
      return baselineMock;
    }
  },

  /**
   * Chain 2: Evaluates a single answer to a single question.
   */
  async evaluateAnswer(
    questionText: string,
    questionType: QuestionType,
    answerText: string,
    session: InterviewSession
  ): Promise<EvaluatedAnswerAI> {
    if (aiProviderManager.getConfig().provider === 'mock') {
      return this.mockEvaluateAnswer(questionText, questionType, answerText, session);
    }

    const systemPrompt =
      (session as any).mode === 'CODING' || (session.interviewType as string) === 'CODING'
        ? MASTER_PROMPT_CODING_EVALUATION
        : MASTER_PROMPT_EVALUATION;

    const userPrompt = `Context:
- Interview Type: ${session.interviewType}
- Target Role: ${session.targetRole}
- Experience Level: ${session.experienceLevel}
- Focus Areas: ${session.focusAreas.join(', ')}
- Industry: ${session.industry}

Question:
${questionText}
Type: ${questionType}

Candidate spoken answer (transcribed):
"""
${answerText}
"""`;

    try {
      return await callAICompletions<EvaluatedAnswerAI>(systemPrompt, userPrompt, 25000);
    } catch {
      return this.mockEvaluateAnswer(questionText, questionType, answerText, session);
    }
  },

  /**
   * Chain 3: Summarizes the entire performance session into a comprehensive analysis.
   */
  async generateSessionAnalysis(
    session: InterviewSession,
    evaluatedQuestions: Array<{
      questionText: string;
      questionType: QuestionType;
      answerText: string;
      score: number;
      feedback: string;
    }>,
    proctoring?: {
      eyeContactScore: number;
      presenceScore: number;
      tabBlurCount: number;
    },
  ): Promise<GeneratedAnalysisAI> {
    if (aiProviderManager.getConfig().provider === 'mock') {
      return this.mockSessionAnalysis(session, evaluatedQuestions, proctoring);
    }

    const systemPrompt = MASTER_PROMPT_ANALYSIS;

    const userPrompt = `Interview Setup:
- Role: ${session.targetRole}
- Company: ${session.targetCompany || 'Generic'}
- Industry: ${session.industry}
- Experience Level: ${session.experienceLevel}
- Interview Type: ${session.interviewType}
${proctoring ? `- Eye Contact Score: ${proctoring.eyeContactScore}/100
- Presence Score: ${proctoring.presenceScore}/100
- Tab Focus Breaks: ${proctoring.tabBlurCount}` : ''}

Questions & Evaluations:
${evaluatedQuestions
  .map(
    (q, i) =>
      `Q${i + 1}: ${q.questionText}\nCandidate Answer: ${q.answerText}\nScore: ${q.score}/100\nFeedback: ${q.feedback}`
  )
  .join('\n\n')}`;

    try {
      return await callAICompletions<GeneratedAnalysisAI>(systemPrompt, userPrompt, 30000);
    } catch {
      return this.mockSessionAnalysis(session, evaluatedQuestions, proctoring);
    }
  },

  // ─── HIGH-FIDELITY MOCK GENERATORS ───────────────────────────

  mockNextQuestion(
    session: InterviewSession,
    previousQA: Array<{
      questionText: string;
      answerText?: string;
      score?: number;
      wordCount?: number;
      signoff?: boolean;
      needsFollowUp?: boolean;
      followUpReason?: string;
      gaps?: string[];
    }>,
    orderIndex: number
  ): GeneratedQuestionAI {
    const focusArea = session.focusAreas[orderIndex % session.focusAreas.length] || 'General';
    const role = session.targetRole || 'Software Engineer';
    const exp = session.experienceLevel || ExperienceLevel.MID;

    const goalStr = session.interviewGoal || '';
    const timerMatch = goalStr.match(/\[Timer:\s*([^\]]+)\]/i);
    const diffMatch = goalStr.match(/\[Difficulty:\s*([^\]]+)\]/i);
    const skillsMatch = goalStr.match(/\[Skills:\s*([^\]]*)\]/i);
    const toolsMatch = goalStr.match(/\[Tools:\s*([^\]]*)\]/i);
    const subjectsMatch = goalStr.match(/\[Subjects:\s*([^\]]*)\]/i);

    const skills = skillsMatch && skillsMatch[1] ? skillsMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];
    const tools = toolsMatch && toolsMatch[1] ? toolsMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];
    const subjects = subjectsMatch && subjectsMatch[1] ? subjectsMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];

    let difficulty = Difficulty.MEDIUM;
    if (diffMatch && Object.values(Difficulty).includes(diffMatch[1].toUpperCase() as Difficulty)) {
      difficulty = diffMatch[1].toUpperCase() as Difficulty;
    } else {
      if (exp === ExperienceLevel.FRESHER) difficulty = Difficulty.EASY;
      else if (exp === ExperienceLevel.SENIOR) difficulty = Difficulty.HARD;
    }

    // Role Categorization Archetypes
    const roleLower = role.toLowerCase();
    let archetype = 'generic';
    if (/front[- ]?end|react|vue|angular|js|ts|javascript|typescript|ui|css|web/i.test(roleLower)) {
      archetype = 'frontend';
    } else if (/back[- ]?end|node|express|django|flask|spring|java|c#|python|go|golang|ruby|rust|api|database|sql|postgres|dbms/i.test(roleLower)) {
      archetype = 'backend';
    } else if (/full[- ]?stack/i.test(roleLower)) {
      archetype = 'fullstack';
    } else if (/ai|ml|machine[- ]?learning|deep[- ]?learning|nlp|vision|data[- ]?scientist|data[- ]?science/i.test(roleLower)) {
      archetype = 'aiml';
    } else if (/devops|sre|cloud|sysadmin|infrastructure|platform|kubernetes|docker|aws|gcp|azure/i.test(roleLower)) {
      archetype = 'devops';
    } else if (/mobile|ios|android|swift|kotlin|flutter|react[- ]?native/i.test(roleLower)) {
      archetype = 'mobile';
    } else if (/embedded|iot|firmware|hardware|microcontroller|c\+\+/i.test(roleLower)) {
      archetype = 'embedded';
    } else if (/security|cyber|penetration|network[- ]?security|secops/i.test(roleLower)) {
      archetype = 'security';
    } else if (/qa|test|quality|automation[- ]?engineer/i.test(roleLower)) {
      archetype = 'qa';
    } else if (/product|pm|po|manager/i.test(roleLower)) {
      archetype = 'product';
    }

    // Question Bank by Archetype and Difficulty
    const questionBank: Record<string, Record<string, string[]>> = {
      frontend: {
        EASY: [
          `What are the core differences between semantic HTML elements and non-semantic elements? Why is this crucial for accessibility in a modern web environment?`,
          `Explain the lifecycle of a React component or the fundamental rules of React Hooks. How do state changes trigger rendering?`,
          `What is the difference between a CSS 'id' selector, 'class' selector, and 'attribute' selector? When would you use each?`
        ],
        MEDIUM: [
          `How do you optimize rendering performance in highly dynamic React applications? Explain techniques like virtualization, memoization, and custom selector subscriptions.`,
          `Explain the difference between client-side rendering (CSR), server-side rendering (SSR), and static site generation (SSG) in frameworks like Next.js.`,
          `Describe the browser's critical rendering path. How do you defer blocking scripts, optimize css load times, and minimize reflows/paints?`
        ],
        HARD: [
          `How would you architect a micro-frontend architecture for a large scale enterprise application? Detail your strategies for dependency sharing, routing, and independent deployments.`,
          `Walk me through your system design for a real-time collaborative web editor (like Google Docs). How would you manage dynamic client-side state synchronization with low latency?`,
          `Explain layout virtualization and custom selector subscriptions for massive real-time data tables rendering hundreds of updates per second.`
        ]
      },
      backend: {
        EASY: [
          `What is the difference between a GET request and a POST request in REST API design? When and why would you use each?`,
          `Explain the basic differences between SQL relational databases and NoSQL non-relational databases.`,
          `What is the purpose of database indexing, and how does it affect read vs write speeds in a basic system?`
        ],
        MEDIUM: [
          `How do you ensure data integrity, concurrency, and performance optimization when configuring PostgreSQL schemas for a relational service?`,
          `Explain your approach to implementing distributed caching using Redis. How do you handle cache invalidation, stampede, and hot keys?`,
          `Describe how you design secure API authentication and session management. What are the pros/cons of JWT tokens in local storage vs HttpOnly cookies?`
        ],
        HARD: [
          `Design a globally distributed event-driven message queuing system using RabbitMQ or Apache Kafka. How do you guarantee strictly-ordered processing and exactly-once delivery semantics?`,
          `Describe how you would handle lock contention, deadlocks, and transaction isolation levels in a massive database under write-heavy, highly concurrent workloads.`,
          `How would you design a highly scalable multi-region active-active database replication schema that prevents write collisions and guarantees eventual consistency?`
        ]
      },
      fullstack: {
        EASY: [
          `What is the client-server architecture? Explain how a request from a browser reaches a backend database and returns a response.`,
          `Explain CORS (Cross-Origin Resource Sharing). Why does the browser enforce it, and how do you configure it safely?`,
          `What are web cookies? What is the difference between session cookies and permanent cookies, and what do secure flags accomplish?`
        ],
        MEDIUM: [
          `Describe how you would optimize the full-stack performance of a slow-loading web page. How do you audit database queries, network latency, asset bundles, and client rendering?`,
          `Design a secure, real-time messaging dashboard. What would your backend communication protocol be (WebSockets vs Server-Sent Events) and how do you manage client connection states?`,
          `Explain how you prevent web security vulnerabilities like Cross-Site Scripting (XSS), SQL Injection, and Cross-Site Request Forgery (CSRF).`
        ],
        HARD: [
          `Architect a high-traffic e-commerce portal from scratch. Detail your design for the frontend caching, API gateway, inventory microservices, relational databases, and payment queues.`,
          `How would you handle full-stack session synchronizations and state synchronization across multiple tabs, mobile interfaces, and web clients under high concurrency?`,
          `Design a robust, containerized CI/CD automated deployment workflow with green-blue deployments and automatic database migration rollbacks.`
        ]
      },
      aiml: {
        EASY: [
          `What is the difference between supervised learning and unsupervised learning? Give an example of each.`,
          `Explain overfitting and underfitting in machine learning models. How do you diagnose them?`,
          `What are the basic steps you take to clean, pre-process, and normalize noisy datasets before training a model?`
        ],
        MEDIUM: [
          `Explain how you evaluate model performance. What are the key differences between accuracy, precision, recall, and F1-score? When is precision more important?`,
          `Describe the architecture and use cases of Vector Databases. How do they enable semantic search or Retrieval-Augmented Generation (RAG)?`,
          `What is hyperparameter tuning? Compare grid search, random search, and Bayesian optimization in terms of computational efficiency.`
        ],
        HARD: [
          `How would you design and scale an ML production pipeline that processes real-time sensor streams with sub-50ms inference latency? How do you monitor for model drift?`,
          `Architect a high-performance RAG (Retrieval-Augmented Generation) system for enterprise document search. How do you optimize chunking strategies, vector embeddings, and LLM fine-tuning?`,
          `Explain how you optimize large neural networks for production deployment (e.g. quantization, pruning, distillation) to fit inside strict edge hardware memory bounds.`
        ]
      },
      devops: {
        EASY: [
          `What is containerization? Explain the fundamental differences between virtual machines and Docker containers.`,
          `What is CI/CD, and what are the main stages of a standard automated deployment pipeline?`,
          `What is the role of a load balancer in web architecture, and how does it distribute incoming traffic?`
        ],
        MEDIUM: [
          `Explain your strategy for scaling microservices using Kubernetes. What is the difference between horizontal pod autoscaling and node autoscaling?`,
          `How do you implement Infrastructure as Code (IaC) using Terraform? How do you securely manage state files in multi-developer teams?`,
          `Describe how you structure log aggregation and real-time alerting systems using tools like Prometheus, Grafana, or ELK Stack.`
        ],
        HARD: [
          `Design a zero-downtime multi-cloud disaster recovery architecture. How do you automate DNS failover, database state synchronization, and microservices failover?`,
          `How do you handle secrets management and zero-trust IAM architecture at scale in an enterprise environment running hundreds of containerized applications?`,
          `Describe how you would debug a sudden packet drop issue between dynamic Kubernetes pods in a virtual private network under heavy network throughput.`
        ]
      },
      mobile: {
        EASY: [
          `What are the key differences between native mobile development (Swift, Kotlin) and cross-platform frameworks (React Native, Flutter)?`,
          `Explain the mobile application lifecycle. What states does an app transition through when a user receives a phone call?`,
          `How does local storage work on mobile devices (e.g. AsyncStorage, CoreData, SQLite)?`
        ],
        MEDIUM: [
          `Explain your approach to offline data synchronization in a mobile app. How do you handle conflict resolutions when the user goes back online?`,
          `How do you diagnose and resolve memory leaks and scroll jankiness (frame drops) in highly complex list layouts?`,
          `Describe how secure push notifications are routed from your backend server to iOS and Android devices.`
        ],
        HARD: [
          `Architect a highly modular mobile codebase for a massive team of 50+ engineers. How do you enforce strict API boundaries, handle dynamic feature module delivery, and manage dependency graphs?`,
          `How do you design a battery-efficient background synchronization service that processes GPS coordinate updates and database uploads under unstable network connectivity?`,
          `Detail the security measures you take to prevent reverse-engineering, secure local data storage, and implement secure SSL pinning in high-security mobile applications.`
        ]
      },
      embedded: {
        EASY: [
          `What is a microcontroller, and how does it differ from a general-purpose microprocessor?`,
          `Explain the difference between synchronous and asynchronous serial communication.`,
          `What are hardware interrupts, and why are they preferred over polling in embedded systems?`
        ],
        MEDIUM: [
          `Describe how an RTOS (Real-Time Operating System) handles task prioritization and scheduling. What is priority inversion, and how do you solve it?`,
          `How do you write memory-safe and leak-free C/C++ firmware in systems lacking a garbage collector and having severe RAM limits?`,
          `Explain serial communication protocols like I2C, SPI, and UART. Compare them in terms of speed, pin counts, and bus topologies.`
        ],
        HARD: [
          `Design the firmware architecture for an ultra-low-power IoT medical device that must run on a coin-cell battery for 5 years. Detail sleep states, sensor polling, and flash wear leveling.`,
          `How do you troubleshoot a rare, non-reproducible hardware crash or heap corruption in an active embedded system without attaching a physical JTAG debugger?`,
          `Architect a secure, fail-safe Over-the-Air (OTA) firmware update protocol for an autonomous vehicle module. How do you verify signatures, handle power failure mid-write, and execute atomic rollbacks?`
        ]
      },
      security: {
        EASY: [
          `What is the difference between symmetric and asymmetric encryption? Give a common use case for each.`,
          `What does the OWASP Top 10 represent? Briefly explain the significance of SQL Injection or XSS.`,
          `Explain the purpose of Multi-Factor Authentication (MFA) and how it blocks phishing attacks.`
        ],
        MEDIUM: [
          `Explain Zero-Trust network architecture. What are the key principles and how do you implement it in a modern corporate cloud network?`,
          `Describe the step-by-step diagnostic workflow you initiate to investigate a suspected server breach.`,
          `How does an SSL/TLS handshake work, and what security measures prevent man-in-the-middle (MITM) attacks?`
        ],
        HARD: [
          `How would you architect a secure identity and access control (IAM) system for a global financial platform? Detail your design for token lifecycle, federated authentication, and biometric verification.`,
          `Design a scalable, automated intrusion detection and prevention pipeline (IDPS) that filters gigabits of nested API payloads in real time.`,
          `Walk me through how you would audit a large-scale microservices system for supply-chain vulnerabilities, open-source license risks, and container image security.`
        ]
      },
      qa: {
        EASY: [
          `What is the difference between manual testing and automated testing? When would you choose to perform manual tests?`,
          `What is the software testing lifecycle (STLC), and what is the difference between a bug and a defect?`,
          `What are regression tests, and why are they run before a production release?`
        ],
        MEDIUM: [
          `Describe how you write robust automated test suites using frameworks like Playwright, Cypress, or Selenium. How do you handle dynamic selectors and race conditions?`,
          `What is the difference between unit testing, integration testing, and end-to-end (E2E) testing? How do you balance them in a testing pyramid?`,
          `How do you handle flaky test suites in a CI/CD pipeline? What are the root causes, and how do you resolve them systematically?`
        ],
        HARD: [
          `Design a distributed automated testing framework that executes 10,000 parallel E2E browser test scenarios in under 5 minutes inside a Kubernetes cluster.`,
          `How would you design a robust visual regression testing tool that identifies pixel-level shifts across various browser engines while handling dynamic content?`,
          `Describe how you create and maintain high-fidelity seed data and database sandboxes for automated integration tests without violating user data privacy (GDPR).`
        ]
      },
      product: {
        EASY: [
          `What is a product roadmap, and how do you define a MVP (Minimum Viable Product)?`,
          `Explain what a North Star Metric is. Why is it important, and how is it different from standard business KPIs?`,
          `How do you handle user feedback when deciding what features to build next?`
        ],
        MEDIUM: [
          `Walk me through your framework for prioritizing features when multiple high-influence stakeholders disagree on the product direction.`,
          `How do you design and evaluate an A/B test? Explain key statistical concepts like sample size, p-values, and statistical significance in layman terms.`,
          `What is user retention? How do you analyze user drop-offs in a conversion funnel, and what actions would you take to optimize it?`
        ],
        HARD: [
          `You are the Product Manager for a major social app. A new privacy regulation bans targeted ads. How do you re-align your product strategy to sustain monetization without losing users?`,
          `Walk me through how you define product-market fit (PMF) for a highly technical SaaS platform. How do you construct customer personas, evaluate competitor models, and design pricing tiers?`,
          `How would you lead a cross-functional squad of 15+ engineers and designers to rebuild a core, highly legacy interface that drives 80% of company revenue?`
        ]
      },
      generic: {
        EASY: [
          `Explain the key principles of Object-Oriented Programming (OOP) and why they are useful in modern software development.`,
          `What is version control? Why is Git essential, and what is the difference between merging and rebasing?`,
          `What are standard data structures like arrays, hash maps, and queues? Give a typical use case for each.`
        ],
        MEDIUM: [
          `How do you analyze code performance using Big O notation? Walk me through a time when you refactored an inefficient algorithm to improve time or space complexity.`,
          `Describe a major technical conflict you had with another engineer. How did you compromise without damaging the codebase quality?`,
          `Describe a technical blocker you faced in a project deadline. How did you negotiate scope or communicate with stakeholders?`
        ],
        HARD: [
          `Design a highly scalable, fault-tolerant system architecture for a high-traffic service (e.g. Uber, Netflix). How do you handle microservice coordination, caching layers, and load balancing?`,
          `How do you design software systems that conform to SOLID design principles? Elaborate on your approach to dependency inversion and open-closed architecture.`,
          `Describe a major architectural mistake you made in a previous system. What were the root causes, how did you resolve them, and what did you learn?`
        ]
      }
    };

    let questionText = '';
    let questionType = QuestionType.TECHNICAL;

    // Retrieve questions matching archetype & difficulty
    const targetSet = questionBank[archetype] || questionBank.generic;
    const pool = targetSet[difficulty] || targetSet.MEDIUM || targetSet.EASY;

    const hasCustomContext = skills.length > 0 || tools.length > 0 || subjects.length > 0;

    if ((session.interviewType as string) === 'CODING') {
      const codingQuestionBank: Record<string, Record<string, string[]>> = {
        frontend: {
          EASY: [
            `Write a function deepClone(obj) in JavaScript that creates a deep copy of a nested object/array. Do not use JSON.parse(JSON.stringify(obj)). Explain your base cases and recursive strategy in the IDE.`,
            `Write a custom React hook called usePrevious(value) that returns the value from the previous render. Show how you use useRef and useEffect to store the historical state.`
          ],
          MEDIUM: [
            `Below is a buggy implementation of a throttle function in TypeScript. Identify the bug and write the corrected version in the IDE:\n\nfunction throttle(func: Function, limit: number) {\n  let inThrottle: boolean;\n  return function(this: any, ...args: any[]) {\n    if (!inThrottle) {\n      func.apply(this, args);\n      inThrottle = true;\n      setTimeout(() => inThrottle = false, limit);\n    }\n  }\n}`,
            `Write a utility function debounce(func, wait) in JavaScript that delays executing a function until after 'wait' milliseconds have elapsed since the last time it was invoked. Ensure it preserves 'this' and argument arrays.`
          ],
          HARD: [
            `Implement layout virtualization from scratch. Write a simple JS class or React component that renders only the visible items from a list of 100,000 items with a fixed row height, updating on scroll. Write the code in the IDE.`,
            `Write an optimized sliding window algorithm in JavaScript to find the longest substring without repeating characters in O(N) runtime. Show your code in the IDE.`
          ]
        },
        backend: {
          EASY: [
            `Write an SQL query to find the second highest salary from an Employee table. If there is no second highest salary, return NULL. Explain how you would optimize this using database indexes.`,
            `Write a simple Node.js Express middleware that rate-limits incoming HTTP requests per IP address using an in-memory map. Clear expired keys periodically to prevent memory leaks.`
          ],
          MEDIUM: [
            `Below is a buggy implementation of a Node.js function that processes an array of database queries in parallel. Identify why it can exhaust connection pools and write the corrected version using sequential batching or p-limit:\n\nasync function processAll(items: any[]) {\n  return Promise.all(items.map(async (item) => {\n    const conn = await db.getConnection();\n    try { return await conn.query(item.sql); } \n    finally { conn.release(); }\n  }));\n}`,
            `Write an optimized Node.js function to read a massive log file (10GB) line-by-line and count occurrences of the keyword 'ERROR'. Use streams (readline module) to ensure O(1) memory usage.`
          ],
          HARD: [
            `Write a robust Redis-based distributed lock implementation in Node.js (similar to Redlock). Handle token renewal (heartbeat), dynamic lock timeouts, and safe lock release (releasing only if the token matches). Write the full JS/TS implementation.`,
            `Write a thread-safe task worker queue in Node.js with CPU clustering and backpressure mitigation techniques. Show how you communicate between master and worker processes.`
          ]
        },
        generic: {
          EASY: [
            `Write a function to detect if a string is a valid palindrome, ignoring casing and non-alphanumeric characters. Provide the full solution in the IDE.`,
            `Implement a binary search algorithm in JavaScript to find an item in a sorted array. Discuss the time and space complexity.`
          ],
          MEDIUM: [
            `Write a function in JS/TS to detect a cycle in a singly linked list in O(N) time complexity and O(1) space complexity. Explain Floyd's tortoise and hare dual-pointer algorithm.`,
            `Implement a custom task runner in JavaScript that runs asynchronous tasks with a maximum concurrency limit. For example: runTasks(tasks, concurrencyLimit) -> Promise<any[]>.`
          ],
          HARD: [
            `Write an efficient algorithm to find the longest substring without repeating characters. Optimize it to run in O(N) time using a sliding window technique with a hash map. Write the full code in the IDE.`,
            `Implement an LRU Cache from scratch in JS/TS using a Doubly Linked List and a Hash Map for O(1) get and put operations. Write the code in the IDE.`
          ]
        }
      };

      const codingTargetSet = codingQuestionBank[archetype] || codingQuestionBank.generic;
      const codingPool = codingTargetSet[difficulty] || codingTargetSet.MEDIUM || codingTargetSet.EASY;
      questionText = codingPool[orderIndex % codingPool.length]!;
      questionType = QuestionType.TECHNICAL;
    } else if (
      session.interviewType === InterviewType.HR_ROUND ||
      focusArea.toLowerCase().includes('hr')
    ) {
      const hrQuestions = [
        `Why are you interested in this ${role} opportunity at ${session.targetCompany || 'our organization'}, and what motivates your career move right now?`,
        `Tell me about a time you received critical feedback. How did you respond, and what changed afterward?`,
        `How do you handle competing priorities when stakeholders disagree on what should ship first?`,
        `What are your salary expectations, and what factors matter most to you beyond compensation?`,
        `Describe a situation where you had to adapt quickly to a major organizational or team change.`
      ];
      questionText = hrQuestions[orderIndex % hrQuestions.length]!;
      questionType = QuestionType.BEHAVIOURAL;
    } else if (session.interviewType === InterviewType.COMMUNICATION) {
      const commQuestions = [
        `Explain a complex ${role} topic to someone non-technical in under two minutes. How do you structure your explanation?`,
        `Tell me about a presentation or update that did not land well. What did you change in how you communicated next time?`,
        `How do you give constructive feedback to a peer without damaging the working relationship?`,
        `Describe a time you had to influence a decision without formal authority. What was your approach?`
      ];
      questionText = commQuestions[orderIndex % commQuestions.length]!;
      questionType = QuestionType.BEHAVIOURAL;
    } else if (hasCustomContext) {
      // Focus on selected custom skills/subjects
      const allCustoms = [...subjects, ...skills, ...tools];
      const item = allCustoms[orderIndex % allCustoms.length] || 'modern system design';

      if (orderIndex === 0) {
        if (skills.length > 0) {
          questionText = `Focusing on your stack: you specified ${skills[0]} as a key skill. Walk me through a challenging problem you solved using ${skills[0]}, and how you ensured it was robust and scalable for a ${role} position.`;
        } else if (subjects.length > 0) {
          questionText = `Let's start with a foundational subject you configured. Can you explain your core understanding of ${subjects[0]}, and how you apply its principles when architecting a professional ${role} application?`;
        } else {
          questionText = `How do you apply best-practice engineering patterns when working with ${item} to ensure code coverage and high performance in a ${role} environment?`;
        }
      } else if (orderIndex === 1) {
        if (skills.length > 1) {
          questionText = `Let's drill down into ${skills[1]}. In your experience as a ${role}, what is the single biggest performance gotcha or architectural limitation of ${skills[1]}, and how do you mitigate it?`;
        } else if (subjects.length > 0) {
          questionText = `Regarding your subject expertise in ${subjects[0]}, how do you compare it with alternative methodologies, and when would you choose *not* to use it in a ${role} system?`;
        } else {
          questionText = `How do you apply best-practice engineering patterns when working with ${item} to ensure high performance in a ${role} environment?`;
        }
      } else {
        questionText = `You also mentioned ${item} in your profile. How do you structure your daily workflow around ${item} on a multi-engineer team, and how do you handle complex integration or testing tasks with it?`;
      }
      questionType = QuestionType.TECHNICAL;
    } else {
      // Use role-specific pool question!
      questionText = pool[orderIndex % pool.length]!;
      // Determine question type based on index
      if (orderIndex % 3 === 0) {
        questionType = QuestionType.TECHNICAL;
      } else if (orderIndex % 3 === 1) {
        questionType = QuestionType.SITUATIONAL;
      } else {
        questionType = QuestionType.BEHAVIOURAL;
      }
    }

    // Dynamic Follow-Up Logic: reference last answer and dive deeper
    const lastAnswer = previousQA[previousQA.length - 1];
    const lastScore = (lastAnswer as { score?: number })?.score;
    const wasLastFollowUp = lastAnswer?.questionText?.includes("could use more depth") || 
                            lastAnswer?.questionText?.includes("building on what you shared") || 
                            lastAnswer?.questionText?.includes("answered again") ||
                            lastAnswer?.questionText?.includes("retell") ||
                            lastAnswer?.questionText?.includes("repeat");
    const isLastSkip = lastAnswer?.answerText?.toLowerCase().includes("skipped") || 
                       lastAnswer?.needsFollowUp === false || 
                       wasLastFollowUp;

    if (lastAnswer?.answerText && lastScore != null && lastScore < 65 && !isLastSkip && lastAnswer.needsFollowUp) {
      const snippet = lastAnswer.answerText.trim().slice(0, 60);
      questionText = `Thanks for that. Your last answer on "${snippet}..." could use more depth — what specific trade-offs, metrics, or examples would you add if you answered again?`;
      questionType = QuestionType.BEHAVIOURAL;
    } else if (lastAnswer?.answerText && lastScore != null && lastScore >= 85 && !isLastSkip && lastAnswer.needsFollowUp) {
      questionText = `Strong answer. Building on what you shared about ${role} work — what is the hardest follow-up challenge you've faced after shipping that kind of solution?`;
      questionType = QuestionType.SITUATIONAL;
    }

    // Prevent duplicates
    const prevTexts = previousQA.map((q) => q.questionText.toLowerCase());
    if (prevTexts.includes(questionText.toLowerCase())) {
      questionText = `How do you approach continuous testing, code reviews, and robust CI/CD pipelines in a professional ${role} workflow?`;
      questionType = QuestionType.TECHNICAL;
    }

    return {
      questionText,
      questionType,
      difficulty,
      rationale: `Selected focus area: ${focusArea} at experience level ${exp} for ${role} role (archetype: ${archetype})`,
    };
  },

  mockEvaluateAnswer(
    questionText: string,
    questionType: QuestionType,
    answerText: string,
    session: InterviewSession
  ): EvaluatedAnswerAI {
    const wordCount = answerText.split(/\s+/).filter(Boolean).length;
    const qLower = questionText.toLowerCase();
    const aLower = answerText.toLowerCase();

    const isCodingMode = (session as any).mode === 'CODING' || (session.interviewType as string) === 'CODING';
    if (isCodingMode) {
      const hintCount = (session as any).hintCount || 0;
      const hintDeduction = hintCount * 15;
      
      let baseScore = 85;
      if (wordCount < 20) baseScore = 50;
      else if (wordCount < 50) baseScore = 70;
      
      const finalScore = Math.max(0, baseScore - hintDeduction);
      const isSkip = ["that's it", "that's all", 'thats it', 'thats all', 'done', 'no more', 'nothing else', 'i dont know', "i don't know", 'skip', 'next question'].some(p => aLower.includes(p)) && wordCount < 15;
      
      if (isSkip) {
        return {
          score: 0,
          feedback: "The candidate opted to skip or did not complete the coding problem.",
          strengths: [
            "Opted to transition early to avoid stalling",
            "Recognized complexity bounds beyond current reach",
            "Kept professional communication during block"
          ],
          weaknesses: [
            "Did not write executable solution code",
            "Missing brute force entry path",
            "Skipped Big-O complexity analysis verification"
          ],
          betterAnswer: "Provide the fully optimized algorithm with O(N) runtime in the editor.",
          isSkip: true,
          needsFollowUp: false,
          algorithmicEfficiency: 0,
          codeQuality: 0,
          complexityJustification: 0,
          phaseReached: 'EXPLANATION'
        };
      }

      return {
        score: finalScore,
        feedback: `Candidate solved the coding problem. Phase reached: COMPLEXITY_CHECK. Consume hint count: ${hintCount}. Hint deduction: -${hintDeduction} points.`,
        strengths: [
          "Optimized array operations with early boundary checks",
          "Clean layout with robust handling of empty parameters",
          "Correct Time and Space Big-O complexity analysis"
        ],
        weaknesses: [
          "Slightly verbose index traversal loops",
          "Did not check for maximum integer overflow bounds",
          "Could benefit from helper function separation"
        ],
        betterAnswer: `// Optimal Javascript/Typescript solution\nfunction solve(arr) {\n  if (!arr || arr.length === 0) return [];\n  // ... optimal code ...\n}`,
        algorithmicEfficiency: Math.max(0, 85 - hintDeduction),
        codeQuality: 80,
        complexityJustification: 90,
        phaseReached: 'COMPLEXITY_CHECK',
        needsFollowUp: false
      };
    }
    
    let topic = "General Engineering Workflow";
    let strengths: string[] = [];
    let weaknesses: string[] = [];
    let betterAnswer = "";

    const isSkip = ["that's it", "that's all", 'thats it', 'thats all', 'done', 'no more', 'nothing else', 'i dont know', "i don't know", 'skip', 'next question'].some(p => aLower.includes(p)) && wordCount < 15;

    if (isSkip) {
      return {
        score: 0,
        feedback: "The candidate opted to skip or did not know the answer to this question.",
        strengths: [
          "Recognized gaps in current technical knowledge",
          "Maintained professional integrity by not guessing",
          "Communicated state of understanding directly"
        ],
        weaknesses: [
          "Question skipped entirely",
          "Failed to present any structural context or fundamentals",
          "Lacked recovery strategies for missing knowledge"
        ],
        betterAnswer: "Provide any relevant context you know, or state what you would do to find the answer.",
        isSkip: true,
        needsFollowUp: false,
        starCompliance: 0,
        tutorialCopierFlag: false,
        technicalOriginality: 0
      };
    }
    
    // 1. Context-based matching to extract high-fidelity tech topics & answers
    if (qLower.includes("performance") || qLower.includes("bottleneck") || qLower.includes("state")) {
      topic = "State Management & React Rendering Bottlenecks";
      betterAnswer = `"When managing complex state trees in interactive react applications, I prevent unnecessary render cycles by utilizing decoupled state hooks like Zustand or atomic libraries like Recoil. For example, instead of wrapping a large dashboard in a standard React Context provider—which forces every child component to re-render whenever any slice of state changes—I implement selector-based subscriber patterns. In a recent project with real-time financial feeds, using Zustand's shallow comparisons and selector functions reduced rendering frequency by 85%, decreasing memory overhead and maintaining 60 FPS under high throughput."`;
      strengths = ["Decoupling state changes via selector subscribers", "State optimization with Zustand/Recoil instead of generic Context", "Performance profiling with Chrome DevTools Performance tab"];
      weaknesses = ["Did not mention shallow equality checks explicitly", "Could expand on virtualization for rendering massive data tables", "Omitted description of server state reconciliation"];
    } else if (qLower.includes("client-side") || qLower.includes("static site") || qLower.includes("generation") || qLower.includes("ssr") || qLower.includes("ssg")) {
      topic = "Web Rendering Paradigms (CSR, SSR, SSG, ISR)";
      betterAnswer = `"I choose the rendering paradigm depending strictly on the dynamic nature of the page and SEO requirements. For highly static pages (e.g., product details or blogs), I employ Static Site Generation (SSG) combined with Incremental Static Regeneration (ISR) to compile HTML at build time while updating stale caches on CDN edges asynchronously. For authenticated, highly dynamic user dashboards, I prefer Client-Side Rendering (CSR) behind a secure CDN, fetching user data via client-side GraphQL queries. When combining these, I use server-side rendering (SSR) for initial payloads to ensure first contentful paint (FCP) remains under 800ms, while avoiding hydration mismatches by utilizing layout components with standard lifecycle hooks."`;
      strengths = ["Decoupled SSG and CSR architecture selection", "Minimizing First Contentful Paint (FCP)", "Leveraging Edge CDNs for ISR caching"];
      weaknesses = ["Could address hydration mismatch causes in React 18+", "Didn't explore dynamic pre-fetching strategies", "Omitted comparison of hosting server costs for SSR vs SSG"];
    } else if (qLower.includes("cycle") || qLower.includes("linked list") || qLower.includes("detect")) {
      topic = "Data Structures & Floyd's Tortoise and Hare Cycle Detection";
      betterAnswer = `"To detect a cycle in a singly linked list in O(N) time and O(1) space, I use Floyd's Cycle Detection Algorithm (the tortoise and hare method). I initialize two pointers: a slow pointer moving one node at a time, and a fast pointer moving two nodes. If there is no cycle, the fast pointer will eventually reach the tail node (pointing to null), indicating a cycle-free list. If a cycle exists, the fast pointer will eventually 'lap' the slow pointer, and they will meet at the same node. Once the collision is detected, we can confirm a cycle exists; to find the cycle start node, we reset the slow pointer to the head of the list and move both at a rate of one step per iteration—the node where they meet next is the starting node."`;
      strengths = ["O(N) time and O(1) space dual pointer cycle detection", "Accurate formulation of Floyd's Tortoise & Hare algorithm", "Detailed boundary checks for null nodes"];
      weaknesses = ["Could cover cycle start-node identification mathematical proof", "Failed to analyze cache locality benefits of standard arrays", "Did not discuss recursive alternative memory limitations"];
    } else if (qLower.includes("postgresql") || qLower.includes("integrity") || qLower.includes("concurrency") || qLower.includes("database")) {
      topic = "Relational Databases & PostgreSQL Performance Optimization";
      betterAnswer = `"I guarantee database performance and integrity by structuring schema design with normalized relations up to 3NF, utilizing foreign key constraints, and leveraging proper indexing strategies. For frequent query lookups, I analyze execution plans using EXPLAIN ANALYZE and apply compound B-Tree indexes matching our query filter order. For concurrency control, I use appropriate transaction isolation levels (e.g., Read Committed vs Serializable) to prevent dirty or phantom reads without introducing deadlock risks. Under write-heavy workloads, I set up connection pooling using PgBouncer and optimize vacuum configurations to prevent table bloat."`;
      strengths = ["Execution plan analysis using EXPLAIN ANALYZE", "Database integrity via 3NF normalization and foreign keys", "Preventing lock contention and handling deadlock hazards"];
      weaknesses = ["Could cover PostgreSQL index types (e.g., GIN, GiST) for JSONB fields", "Did not mention database sharding or read-replica setups", "Lacks coverage of connection pool sizing formulas"];
    } else if (qLower.includes("xss") || qLower.includes("csrf") || qLower.includes("security")) {
      topic = "Web Application Security & OWASP Top 10 Mitigation";
      betterAnswer = `"Preventing XSS and CSRF requires a multi-layered defense. To mitigate Cross-Site Scripting (XSS), I implement strict Content Security Policies (CSP) restricting script execution sources, sanitize all dynamic user inputs using libraries like DOMPurify, and ensure all React payloads use JSX context escaping. To block Cross-Site Request Forgery (CSRF), I serve all session identifiers inside HttpOnly, Secure, SameSite=Strict cookies, and require anti-CSRF double-submit tokens for all state-changing API endpoints, validating them cryptographically on the server."`;
      strengths = ["Content Security Policy (CSP) headers", "XSS mitigation with sanitization (DOMPurify) and contextual escaping", "CSRF defense using SameSite cookies and cryptographic double-submit tokens"];
      weaknesses = ["Could mention JWT storage security inside local storage vs session cookies", "Did not mention CORS policy configuration", "Omitted description of Subresource Integrity (SRI) hashes"];
    } else if (questionType === QuestionType.BEHAVIOURAL || qLower.includes("time you") || qLower.includes("conflict") || qLower.includes("mistake") || qLower.includes("deadline")) {
      topic = "Behavioral Leadership & STAR Execution";
      betterAnswer = `"In my experience, resolving high-stress deadlocks or conflicts requires direct, empathetic alignment. On a business-critical system migration, we hit a tight deadline blocker. Utilizing the STAR method: Situation: Our legacy payment processor was hitting deprecated API errors 2 weeks before Black Friday. Task: I needed to migrate to Stripe without disrupting live traffic. Action: I negotiated reducing scope for non-essential reporting features, set up daily standups with the payment team, and built a fallback routing bridge. Result: We successfully deployed 4 days ahead of schedule, retaining 100% of checkouts with zero downtime and processing $2M in revenue."`;
      strengths = ["Excellent STAR methodology structure", "Empathic technical conflict mediation", "Quantitative impact framing"];
      weaknesses = ["Could elaborate on post-mortem documentation and long-term preventive actions", "Omitted describing stakeholder communication protocols", "Did not cover backup roll-back criteria if migration failed"];
    } else {
      const role = session.targetRole || "Software Engineer";
      const isFE = role.toLowerCase().includes("frontend") || role.toLowerCase().includes("react") || role.toLowerCase().includes("ui") || role.toLowerCase().includes("css");
      const isBE = role.toLowerCase().includes("backend") || role.toLowerCase().includes("node") || role.toLowerCase().includes("api") || role.toLowerCase().includes("service") || role.toLowerCase().includes("system");
      
      if (isFE) {
        topic = "Modern Frontend Engineering & a11y Standards";
        betterAnswer = `"For a professional Frontend Engineer role, I prioritize performance, accessibility (a11y), and semantic markup. When implementing a critical user-facing module, I ensure we achieve a Lighthouse accessibility score of 100% by using proper ARIA labels, keyboard focus trapping for modals, and screen-reader navigable elements. I optimize bundle sizes via lazy-loading and dynamic imports in Webpack/Vite, reducing the bundle size by 40% and cutting Time-to-Interactive (TTI) to under 1.2s."`;
        strengths = ["A11y accessibility standards & screen reader navigation", "Webpack/Vite code-splitting & dynamic imports", "Lighthouse core web vitals optimization"];
        weaknesses = ["Could specify error-boundary implementation strategies", "Omitted dynamic pre-fetching strategies based on viewport intersections", "Failed to address web font rendering optimization (FOIT/FOUT)"];
      } else if (isBE) {
        topic = "Backend Scale, API Design & Event-Driven Architecture";
        betterAnswer = `"As a Backend Engineer, I design systems with high availability, fault tolerance, and clear API boundaries. I follow RESTful principles or GraphQL schemas, structuring endpoints with proper error handlers, request validation via Zod, and rate-limiting to prevent DDoS. To scale services, I implement distributed caching using Redis and decoupled event-driven architectures with message brokers like RabbitMQ or Kafka. In my last backend system, this architecture allowed us to scale from 2,000 to 25,000 concurrent websocket connections under sub-50ms latency."`;
        strengths = ["Event-driven system scaling with message brokers (Kafka/RabbitMQ)", "API robustness using Zod validators & security rate-limits", "Distributed cache architectures with Redis"];
        weaknesses = ["Could detail circuit breaker patterns for fault-tolerant microservices", "Did not mention database partition strategies", "Lacks discussion of dead-letter exchange (DLX) error handling"];
      } else {
        topic = "Core Clean Architecture & CI/CD Operations";
        betterAnswer = `"In my career, I approach challenges systematically by analyzing the full lifecycle. I ensure high-quality software through clean architecture principles, test-driven development (TDD) reaching 90% unit test coverage, and automated CI/CD pipelines. By automating regression tests and code linting, our engineering team reduced production defect rates by 60% and accelerated feature delivery cycles."`;
        strengths = ["Clean Architecture principles and SOLID designs", "Automated CI/CD integration and test automation", "TDD unit test coverage best-practices"];
        weaknesses = ["Could cover cloud-native deployment trade-offs in AWS/GCP", "Lacked definition of trunk-based vs GitFlow branching models", "Omitted blue-green dynamic routing rollback conditions"];
      }
    }

    // 2. Perform intelligent semantic matching heuristics on candidate answer
    let score = 75;
    let feedback = "";
    
    let starCompliance = 75;
    let tutorialCopierFlag = false;
    let technicalOriginality = 80;

    // Evaluate tutorial copier buzzwords
    if (aLower.includes("synergy") && aLower.includes("paradigm") && !aLower.includes("metric") && !aLower.includes("reduced")) {
      tutorialCopierFlag = true;
      score = Math.max(40, score - 15);
    }
    
    // Evaluate STAR metrics presence
    if (!aLower.includes("%") && !aLower.includes("ms") && !aLower.includes("sec") && !aLower.includes("$") && !aLower.includes("gb")) {
      starCompliance = 45;
      score = Math.max(30, score - 15); // deduct 15 points
    } else {
      starCompliance = 90;
    }

    if (wordCount < 12) {
      score = 30 + Math.floor(Math.random() * 8); // 30-37
      feedback = `The response for "${topic}" is extremely brief and lacks technical substance. You should elaborate by explaining the underlying architecture, giving concrete engineering examples, and detailing your specific actions using direct domain terms.`;
      strengths.push("Direct answer");
      weaknesses.push("Severely lacks technical details", "Missing structured examples", "Too short to measure domain knowledge");
    } else if (wordCount < 30) {
      score = 52 + Math.floor(Math.random() * 8); // 52-59
      feedback = `You demonstrate basic conceptual knowledge of ${topic}, but your answer is surface-level. Proactively explain the "why", detail the architectural compromises, and include real-world metrics to stand out.`;
      strengths.push("Covers basic definitions");
      weaknesses.push("Lacks contextual application", "Doesn't mention any metrics or architectural compromises");
    } else {
      // Analyze actual keywords present in candidate response for senior-grade grading!
      let hits = 0;
      const keywords = ["virtual", "render", "hook", "state", "optimize", "scale", "performance", "cache", "latency", "index", "concurrency", "security", "xss", "csrf", "csp", "cookie", "star", "situation", "action", "metric", "deploy", "ci/cd", "git", "docker", "aws", "framer", "motion", "flex", "pill", "layout"];
      keywords.forEach(kw => {
        if (aLower.includes(kw)) hits++;
      });
      
      const isSenior = session.experienceLevel === ExperienceLevel.SENIOR;
      
      if (hits >= 4) {
        score = 86 + Math.floor(Math.random() * 10); // 86-95
        if (score > 100) score = 98;
        feedback = `Exceptional evaluation on "${topic}". You demonstrated deep domain expertise, high technical fluency, and successfully backed your claims with structured methodologies, metrics, and actionable engineering trade-offs.`;
        strengths.push("Excellent articulation of core concepts", "Highly precise technical terminology", "Clear narrative flow and trade-off synthesis");
        if (isSenior) {
          weaknesses.push("Could slightly highlight long-term operational recovery metrics");
        } else {
          weaknesses.push("None — exceptionally strong for this level");
        }
      } else if (hits >= 2) {
        score = 76 + Math.floor(Math.random() * 8); // 76-83
        feedback = `This is a solid, descriptive answer for "${topic}". You successfully combined conceptual definitions with practical engineering experiences and structured details.`;
        strengths.push("Addresses the question directly with technical depth", "Good integration of engineering challenges");
        weaknesses.push("Could slightly highlight outcome metrics and architectural trade-offs");
      } else {
        score = 66 + Math.floor(Math.random() * 8); // 66-73
        feedback = `A reasonable answer for "${topic}", but lacks advanced senior-level metrics. Introduce quantitative data (e.g. latency reductions, load times, system benchmarks) and discuss the architectural alternatives.`;
        strengths.push("Addresses the question directly");
        weaknesses.push("Missing quantitative business outcome metrics", "Could elaborate on trade-offs against alternative solutions");
      }
    }

    const needsFollowUp = score < 72 || wordCount < 35;
    
    // Ensure strictly 3 strengths and 3 weaknesses
    let finalStrengths = Array.from(new Set(strengths));
    let finalWeaknesses = Array.from(new Set(weaknesses));
    
    while (finalStrengths.length < 3) {
      finalStrengths.push("Demonstrated reliable technical understanding");
    }
    while (finalWeaknesses.length < 3) {
      finalWeaknesses.push("Could further outline alternative design configurations");
    }
    
    finalStrengths = finalStrengths.slice(0, 3);
    finalWeaknesses = finalWeaknesses.slice(0, 3);

    return {
      score,
      feedback,
      strengths: finalStrengths,
      weaknesses: finalWeaknesses,
      betterAnswer,
      technicalDepth: score,
      subjectCoverage: Math.max(0, Math.min(100, score - 5 + Math.floor(Math.random() * 5))),
      communicationClarity: Math.max(0, Math.min(100, score + 3 - Math.floor(Math.random() * 6))),
      completeness: wordCount >= 55 ? score : Math.max(0, score - 20),
      topicsCovered: [topic, ...finalStrengths.slice(0, 1)],
      gaps: finalWeaknesses,
      needsFollowUp,
      followUpReason: needsFollowUp
        ? `Answer lacked depth or completeness on critical aspects of ${topic}.`
        : '',
      starCompliance,
      tutorialCopierFlag,
      technicalOriginality
    };
  },

  mockSessionAnalysis(
    session: InterviewSession,
    evaluatedQuestions: Array<{
      questionText: string;
      questionType: QuestionType;
      answerText: string;
      score: number;
      feedback: string;
    }>,
    proctoring?: {
      eyeContactScore: number;
      presenceScore: number;
      tabBlurCount: number;
    },
  ): GeneratedAnalysisAI {
    const scores = evaluatedQuestions.map((q) => q.score);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 75;

    const commScore = Math.min(100, Math.max(40, avgScore + (Math.random() > 0.5 ? 4 : -4)));
    const techScore = Math.min(100, Math.max(40, avgScore + (Math.random() > 0.5 ? -2 : 5)));
    const confScore = Math.min(100, Math.max(40, avgScore + (Math.random() > 0.5 ? 6 : -3)));
    const structScore = Math.min(100, Math.max(40, avgScore + (Math.random() > 0.5 ? -5 : 3)));
    const blurPenalty = (proctoring?.tabBlurCount ?? 0) * 4;
    const eyeScore = proctoring?.eyeContactScore
      ?? Math.min(100, Math.max(40, avgScore + (Math.random() > 0.5 ? -3 : 7) - blurPenalty));
    const presScore = proctoring?.presenceScore
      ?? Math.min(100, Math.max(40, avgScore + (Math.random() > 0.5 ? 2 : -6) - blurPenalty));

    let verdict = ReadinessVerdict.ALMOST_READY;
    if (avgScore < 50) {
      verdict = ReadinessVerdict.NOT_READY;
    } else if (avgScore >= 82) {
      verdict = ReadinessVerdict.STRONG;
    } else if (avgScore >= 70) {
      verdict = ReadinessVerdict.READY;
    }

    return {
      overallScore: avgScore,
      communicationScore: commScore,
      technicalScore: techScore,
      confidenceScore: confScore,
      structureScore: structScore,
      eyeContactScore: eyeScore,
      presenceScore: presScore,
      summary: `The candidate performed well during this mock interview for the ${session.targetRole} role. They demonstrated reliable conceptual clarity and strong focus on selected areas like ${session.focusAreas.slice(0, 2).join(' & ')}, showing mature professional skills.`,
      strengths: [
        'Solid structural responses that lay out code structures cleanly.',
        'High technical fluency, especially when discussing modern tools.',
        'Clear articulation of collaborative experience on behavioral questions.',
      ],
      improvements: [
        'Proactively back up claims with quantitative business outcome metrics.',
        'Improve situational handling on high-stress architectural bottlenecks.',
        'Perfect the STAR structural layout (Situation, Task, Action, Result) in behavioural queries.',
      ],
      actionableTips: [
        {
          tip: 'Quantify engineering impacts',
          reason: 'Instead of saying you "improved speeds", state that you "reduced latency by 45% using database indexing." This adds immense credibility.',
        },
        {
          tip: 'Flesh out list virtualization',
          reason: 'For senior front-end roles, top companies like Stripe evaluate how you manage massive rendering datasets. Study list virtualizers.',
        },
        {
          tip: 'Apply the STAR blueprint',
          reason: 'Ensure that your behavioral responses explicitly conclude with a distinct, positive business metric outcome.',
        },
      ],
      readinessVerdict: verdict,
    };
  },
};
