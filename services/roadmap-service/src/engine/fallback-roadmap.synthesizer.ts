// ═══════════════════════════════════════════════════════════════
// Deterministic Fallback Roadmap Curriculum Synthesizer
// Generates 100% Valid 3-Pillar Roadmaps Without External AI
// ═══════════════════════════════════════════════════════════════

import { RoadmapTier, RoadmapLevel } from '@ru-ready/shared';
import {
  generatedRoadmapOutputSchema,
  GeneratedRoadmapOutput,
  GeneratedPhaseDefinition,
  GeneratedNodeDefinition,
  GeneratedResourceSource,
  GeneratedPracticalDrill,
  GeneratedMicroQuestion,
} from '../validators/roadmap-generation.validator.js';
import {
  skillGraphEngine,
  SkillGraphEngine,
  ResolvedRoleSkill,
} from './skill-graph.engine.js';
import {
  skillGapAnalyzer,
  SkillGapAnalyzer,
  UserSkillAssessmentInput,
} from './skill-gap.analyzer.js';
import { TaxonomySkill } from '../data/skill-taxonomy.data.js';
import { BadRequestError } from '../lib/errors.js';

export interface FallbackRoadmapInput {
  targetRole: string;
  targetCompanyTier?: RoadmapTier | string;
  level?: RoadmapLevel | string;
  timelineWeeks?: number;
  weeklyHours?: number;
  userEvidence?: UserSkillAssessmentInput[] | Record<string, number>;
  knownSkills?: string[];
  identifiedBlindspots?: string[];
  focusAreas?: string[];
}

// ─── Verified Authoritative Resource Registry ─────────────────

const CANONICAL_SKILL_RESOURCES: Record<string, Array<{ title: string; url: string; type: 'DOCS' | 'COURSE' | 'REPO' | 'BOOK' | 'ARTICLE'; description: string }>> = {
  'programming-fundamentals': [
    {
      title: 'Structure and Interpretation of Computer Programs (MIT)',
      url: 'https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.xhtml',
      type: 'BOOK',
      description: 'Foundational computer science principles, abstraction, and control flow mechanics.',
    },
  ],
  'oop-foundations': [
    {
      title: 'Refactoring Guru: Design Patterns & SOLID Principles',
      url: 'https://refactoring.guru/design-patterns',
      type: 'DOCS',
      description: 'Definitive guide to object-oriented architecture, SOLID principles, and design patterns.',
    },
  ],
  'data-structures-core': [
    {
      title: 'Open Data Structures: Core Linear & Array Structures',
      url: 'https://opendatastructures.org/',
      type: 'BOOK',
      description: 'Mathematical analysis and implementation of dynamic arrays, linked lists, stacks, and queues.',
    },
  ],
  'algorithms-sorting-searching': [
    {
      title: 'Algorithms, 4th Edition (Sedgewick & Wayne)',
      url: 'https://algs4.cs.princeton.edu/home/',
      type: 'DOCS',
      description: 'Rigorous asymptotic complexity analysis, binary search, and sorting implementations.',
    },
  ],
  'trees-graphs-dsa': [
    {
      title: 'Visualizing Algorithms & Graph Traversal (USFCA)',
      url: 'https://www.cs.usfca.edu/~galles/visualization/Algorithms.html',
      type: 'DOCS',
      description: 'Interactive visualization and implementation of BFS, DFS, Dijkstra, and Topological Sort.',
    },
  ],
  'operating-systems-core': [
    {
      title: 'Operating Systems: Three Easy Pieces (OSTEP)',
      url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
      type: 'BOOK',
      description: 'Comprehensive guide to virtualization, concurrency, lock synchronization, and persistence.',
    },
  ],
  'linux-shell-scripting': [
    {
      title: 'GNU Bash Reference Manual',
      url: 'https://www.gnu.org/software/bash/manual/',
      type: 'DOCS',
      description: 'Official GNU documentation on POSIX shell scripting, I/O redirection, and process signals.',
    },
  ],
  'computer-networks': [
    {
      title: 'Computer Networks: A Systems Approach',
      url: 'https://book.systemsapproach.org/',
      type: 'BOOK',
      description: 'Deep dive into TCP/IP protocol stack, DNS resolution, TLS handshakes, and HTTP/2/3 transport.',
    },
  ],
  'git-version-control': [
    {
      title: 'Pro Git Book (Official Documentation)',
      url: 'https://git-scm.com/book/en/v2',
      type: 'DOCS',
      description: 'Internal object store mechanics, interactive rebasing, branch topologies, and commit trees.',
    },
  ],
  'sql-foundations': [
    {
      title: 'PostgreSQL Official Documentation: SQL Tutorial',
      url: 'https://www.postgresql.org/docs/current/tutorial-sql.html',
      type: 'DOCS',
      description: 'Relational schema design, normalization (3NF), joins, subqueries, and aggregation functions.',
    },
  ],
  'database-internals-indexing': [
    {
      title: 'Use The Index, Luke! — SQL Indexing Explained',
      url: 'https://use-the-index-luke.com/',
      type: 'DOCS',
      description: 'B-Tree internals, composite index ordering, execution plan analysis, and query tuning.',
    },
  ],
  'html-css-dom': [
    {
      title: 'MDN Web Docs: HTML & CSS Semantic Foundations',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
      type: 'DOCS',
      description: 'Semantic DOM elements, accessibility (a11y), CSS Grid, and responsive layout architectures.',
    },
  ],
  'javascript-modern-es6': [
    {
      title: 'JavaScript.info — The Modern JavaScript Tutorial',
      url: 'https://javascript.info/',
      type: 'DOCS',
      description: 'Detailed coverage of the JS runtime, closures, prototype chain, and event loop microtasks.',
    },
  ],
  'typescript-type-systems': [
    {
      title: 'TypeScript Official Handbook & Type System Guide',
      url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
      type: 'DOCS',
      description: 'Generics, conditional types, mapped types, type narrowing, and strict compiler configs.',
    },
  ],
  'react-architecture': [
    {
      title: 'React 19 Official Documentation & Architecture',
      url: 'https://react.dev/learn',
      type: 'DOCS',
      description: 'Virtual DOM, Fiber reconciliation, custom hooks, and state management design patterns.',
    },
  ],
  'nodejs-async-runtime': [
    {
      title: 'Node.js Official Documentation & libuv Architecture',
      url: 'https://nodejs.org/docs/latest/api/',
      type: 'DOCS',
      description: 'libuv event loop phases, non-blocking stream backpressure, buffer allocation, and worker threads.',
    },
  ],
  'rest-api-design': [
    {
      title: 'RESTful API Design Best Practices (Microsoft Docs)',
      url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design',
      type: 'DOCS',
      description: 'Idempotency, HTTP status semantics, JWT authentication, rate limiting, and versioning.',
    },
  ],
  'distributed-caching-redis': [
    {
      title: 'Redis Official Documentation & Architecture Guide',
      url: 'https://redis.io/docs/latest/',
      type: 'DOCS',
      description: 'Cache-aside patterns, eviction strategies, distributed locking (Redlock), and cluster sharding.',
    },
  ],
  'message-queues-kafka': [
    {
      title: 'Apache Kafka Documentation & Event Streaming Architecture',
      url: 'https://kafka.apache.org/documentation/',
      type: 'DOCS',
      description: 'Distributed commit log, partition keys, consumer groups, and idempotent event processing.',
    },
  ],
  'system-design-hld': [
    {
      title: 'The System Design Primer (Donne Martin)',
      url: 'https://github.com/donnemartin/system-design-primer',
      type: 'REPO',
      description: 'Large-scale distributed systems, load balancing, sharding, replication, and CAP theorem.',
    },
  ],
  'docker-containerization': [
    {
      title: 'Docker Official Get Started & Best Practices Guide',
      url: 'https://docs.docker.com/get-started/',
      type: 'DOCS',
      description: 'Multi-stage Dockerfiles, image layer caching, cgroups, namespaces, and bridge networking.',
    },
  ],
  'kubernetes-orchestration': [
    {
      title: 'Kubernetes Official Concepts & Cluster Architecture',
      url: 'https://kubernetes.io/docs/concepts/',
      type: 'DOCS',
      description: 'Pod lifecycles, Deployments, Services, Ingress controllers, and Horizontal Pod Autoscaling (HPA).',
    },
  ],
  'ci-cd-github-actions': [
    {
      title: 'GitHub Actions Workflow Automation Documentation',
      url: 'https://docs.github.com/en/actions',
      type: 'DOCS',
      description: 'Continuous integration pipelines, automated matrix test runners, and artifact caching.',
    },
  ],
  'python-data-stack': [
    {
      title: 'NumPy & Pandas Official User Guides',
      url: 'https://pandas.pydata.org/docs/user_guide/index.html',
      type: 'DOCS',
      description: 'Vectorized operations, DataFrame indexing, memory optimization, and data transformations.',
    },
  ],
  'statistics-probability': [
    {
      title: 'OpenIntro Statistics & Probability Foundations',
      url: 'https://www.openintro.org/book/os/',
      type: 'BOOK',
      description: 'Probability distributions, central limit theorem, hypothesis testing, confidence intervals, and p-values.',
    },
    {
      title: 'MIT OpenCourseWare: Introduction to Probability & Statistics',
      url: 'https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2014/',
      type: 'COURSE',
      description: 'Rigorous statistical inference, Bayes theorem, maximum likelihood estimation, and distributions.',
    },
  ],
  'exploratory-data-analysis': [
    {
      title: 'Python Data Science Handbook: Data Manipulation & Visualization',
      url: 'https://jakevdp.github.io/PythonDataScienceHandbook/',
      type: 'BOOK',
      description: 'Practical exploratory data analysis with Pandas, Matplotlib, and Seaborn for data science.',
    },
  ],
  'business-intelligence-bi': [
    {
      title: 'Mode Analytics: Advanced SQL & Business Intelligence Guide',
      url: 'https://mode.com/sql-tutorial/',
      type: 'DOCS',
      description: 'Analytical window functions, cohort analysis, funnel tracking, and executive KPI dashboard design.',
    },
  ],
  'machine-learning-foundations': [
    {
      title: 'Scikit-Learn Machine Learning & PyTorch Foundations Guide',
      url: 'https://scikit-learn.org/stable/user_guide.html',
      type: 'DOCS',
      description: 'Regression, classification algorithms, loss optimization, validation curves, and model metrics.',
    },
  ],
  'deep-learning-neural-networks': [
    {
      title: 'PyTorch Deep Learning & Neural Network Architecture Tutorials',
      url: 'https://pytorch.org/tutorials/',
      type: 'DOCS',
      description: 'Tensors, autograd, convolution layers, sequence models, Transformers, and GPU training optimization.',
    },
  ],
  'rag-vector-search': [
    {
      title: 'LangChain & Vector Database RAG Conceptual Architecture',
      url: 'https://python.langchain.com/docs/concepts/rag/',
      type: 'DOCS',
      description: 'Embedding generation, vector chunking, dense/sparse hybrid search, and prompt grounding.',
    },
  ],
  'llm-fine-tuning-inference': [
    {
      title: 'Hugging Face PEFT & LoRA Fine-Tuning Guide',
      url: 'https://huggingface.co/docs/peft/index',
      type: 'DOCS',
      description: 'Parameter-efficient fine-tuning (LoRA/QLoRA), KV caching, quantization, and vLLM inference.',
    },
  ],
};

// ─── Deterministic Synthesizer Engine ─────────────────────────

export class FallbackRoadmapSynthesizer {
  private graphEngine: SkillGraphEngine;
  private gapAnalyzer: SkillGapAnalyzer;

  constructor(
    graphEngine = skillGraphEngine,
    gapAnalyzer = skillGapAnalyzer
  ) {
    this.graphEngine = graphEngine;
    this.gapAnalyzer = gapAnalyzer;
  }

  /**
   * Generates a fully validated, deterministic 3-Pillar Career Roadmap.
   * Completely offline, reproducible, and compliant with generatedRoadmapOutputSchema.
   */
  public synthesizeRoadmap(input: FallbackRoadmapInput): GeneratedRoadmapOutput {
    if (!input.targetRole || typeof input.targetRole !== 'string' || !input.targetRole.trim()) {
      throw new BadRequestError('targetRole must be a non-empty string');
    }

    const tier: RoadmapTier = (['FAANG', 'Unicorn', 'Tier-1 FinTech', 'High-Growth Startup', 'Enterprise'].includes(
      input.targetCompanyTier as RoadmapTier
    )
      ? (input.targetCompanyTier as RoadmapTier)
      : 'FAANG');

    const level: RoadmapLevel = (['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'STAFF'].includes(
      input.level as RoadmapLevel
    )
      ? (input.level as RoadmapLevel)
      : 'INTERMEDIATE');

    const timelineWeeks = Math.max(1, Math.min(104, Math.round(input.timelineWeeks || 12)));
    const weeklyHours = Math.max(1, Math.min(60, Math.round(input.weeklyHours || 15)));

    // 1. Resolve role skills & normalize role
    const canonicalKey = this.graphEngine.normalizeRole(input.targetRole);
    const resolvedRoleSkills = this.graphEngine.resolveRoleSkills(canonicalKey, tier);

    if (!resolvedRoleSkills || resolvedRoleSkills.length === 0) {
      throw new BadRequestError(`No skills mapped to canonical role: ${canonicalKey}`);
    }

    // 2. Expand with all transitive prerequisites
    const expandedSkills = this.graphEngine.expandWithPrerequisites(
      resolvedRoleSkills.map((r) => r.skill.slug)
    );

    // 3. Compute topological order & DAG depth layers
    const orderedSkills = this.graphEngine.getTopologicalOrder(expandedSkills);
    const depthMap = this.graphEngine.calculateSkillDepths(orderedSkills);

    // 4. Perform skill-gap analysis
    const gapAnalysis = this.gapAnalyzer.analyzeSkillGap({
      targetRole: canonicalKey,
      requiredSkills: resolvedRoleSkills,
      userEvidence: input.userEvidence,
      knownSkillNames: input.knownSkills,
      identifiedBlindspots: input.identifiedBlindspots,
    });

    const gapMap = new Map<string, { current: number; required: number; priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' }>();
    for (const g of gapAnalysis.skillGaps) {
      gapMap.set(g.skillName.toLowerCase(), {
        current: g.currentProficiency,
        required: g.requiredProficiency,
        priority: g.priority,
      });
    }

    // 5. Personalization & Proficiency Pruning:
    // Prioritize skills where learner has genuine gaps (current < required).
    // If a learner has already mastered a skill (current >= required), do not generate redundant beginner milestones.
    const gapSkills = orderedSkills.filter((s) => {
      const g = gapMap.get(s.name.toLowerCase());
      return !g || g.current < g.required;
    });

    // If candidate has mastered everything, keep the top advanced skills so roadmap is non-empty
    const activeSkills = gapSkills.length >= 3
      ? gapSkills
      : orderedSkills.length >= 3
        ? orderedSkills.slice(-4)
        : orderedSkills;

    // 6. Partition active skills into 3 to 4 logical phases based on DAG depth
    const maxDepth = Math.max(...activeSkills.map((s) => depthMap.get(s.slug) || 0), 0);
    const phaseCount = activeSkills.length >= 6 ? (maxDepth >= 2 ? 4 : 3) : 3;

    const phaseBuckets: TaxonomySkill[][] = Array.from({ length: phaseCount }, () => []);

    for (let i = 0; i < activeSkills.length; i++) {
      const skill = activeSkills[i];
      const bucketIdx = Math.min(phaseCount - 1, Math.floor((i / activeSkills.length) * phaseCount));
      phaseBuckets[bucketIdx].push(skill);
    }

    // Ensure every phase has at least 1 skill (redistribute if empty)
    for (let i = 0; i < phaseCount; i++) {
      if (phaseBuckets[i].length === 0) {
        for (let j = 0; j < phaseCount; j++) {
          if (phaseBuckets[j].length > 1) {
            const moved = phaseBuckets[j].pop()!;
            phaseBuckets[i].push(moved);
            break;
          }
        }
      }
    }

    // 7. Generate Phase & Node structures
    const phaseTitles = this.getPhaseTitles(canonicalKey, phaseCount);
    const generatedPhases: GeneratedPhaseDefinition[] = [];
    const nodeIdMap = new Map<string, string>(); // skillSlug -> nodeId

    let globalNodeIndex = 0;

    for (let pIdx = 0; pIdx < phaseCount; pIdx++) {
      const phaseSkills = phaseBuckets[pIdx];
      const phaseId = `phase-${pIdx + 1}`;
      const nodes: GeneratedNodeDefinition[] = [];

      for (let nIdx = 0; nIdx < phaseSkills.length; nIdx++) {
        const skill = phaseSkills[nIdx];
        const nodeId = `node-${pIdx + 1}-${skill.slug}`;
        nodeIdMap.set(skill.slug, nodeId);

        // Map prerequisite node IDs from topological dependencies that exist in active roadmap
        const prereqNodeIds: string[] = skill.prerequisites
          .map((pSlug) => nodeIdMap.get(pSlug))
          .filter((id): id is string => Boolean(id) && id !== nodeId);

        const gapInfo = gapMap.get(skill.name.toLowerCase()) || {
          current: 0,
          required: 80,
          priority: 'MEDIUM',
        };

        const estimatedHours = this.calculateEstimatedHours(
          gapInfo.current,
          gapInfo.required,
          depthMap.get(skill.slug) || 0,
          level,
          weeklyHours
        );

        const isMastered = gapInfo.current >= 75;
        const nodeTitle = isMastered
          ? `Advanced Scale & System Patterns: ${skill.name}`
          : `Core Mastery & Deep Architecture: ${skill.name}`;

        const nodeDef: GeneratedNodeDefinition = {
          id: nodeId,
          phaseId,
          title: nodeTitle,
          subHeader: `Core competency in ${skill.category}`,
          category: skill.category,
          orderIndex: nIdx,
          estimatedHours,
          status: 'LOCKED',
          score: 0,
          requiresEvidence: gapInfo.priority === 'CRITICAL' || (depthMap.get(skill.slug) || 0) >= 2,
          requiresAssessment: gapInfo.priority === 'CRITICAL' || (depthMap.get(skill.slug) || 0) >= 2,
          targetProficiency: gapInfo.required,
          skills: [
            {
              name: skill.name,
              category: skill.category,
              targetProficiency: gapInfo.required,
            },
          ],
          prerequisiteNodeIds: prereqNodeIds,

          // ── Pillar 1: What Should I Do ──
          whatShouldIDo: this.generateWhatShouldIDo(skill, gapInfo.current),

          // ── Pillar 2: What is the Source ──
          whatIsTheSource: this.generateWhatIsTheSource(skill),

          // ── Pillar 3: What is the Exact Thing (Drill) ──
          whatIsTheExactThing: this.generateWhatIsTheExactThing(skill),

          // ── Socratic Micro-Questions ──
          microQuestions: this.generateMicroQuestions(skill),
        };

        nodes.push(nodeDef);
        globalNodeIndex++;
      }

      generatedPhases.push({
        id: phaseId,
        title: phaseTitles[pIdx] || `Phase ${pIdx + 1}: ${phaseSkills[0]?.category || 'Core Systems'}`,
        description: `Progressive competency milestones focusing on ${phaseSkills.map((s) => s.name).join(', ')}.`,
        orderIndex: pIdx,
        nodes,
      });
    }

    // 8. Assemble Complete Output
    const roleTitle = this.getRoleDisplayTitle(canonicalKey);
    const generatedRoadmap: GeneratedRoadmapOutput = {
      title: `${roleTitle} Mastery Roadmap`,
      description: `A production-grade, prerequisite-ordered curriculum tailored for ${roleTitle} (${tier} benchmark). Focuses on ${activeSkills.length} prioritized competencies across ${phaseCount} progressive phases based on candidate skill gaps.`,
      rolePath: canonicalKey.toLowerCase(),
      targetCompanyTier: tier,
      difficulty: level,
      estimatedWeeks: timelineWeeks,
      phases: generatedPhases,
    };

    // 9. Strict Schema Validation check before returning
    return generatedRoadmapOutputSchema.parse(generatedRoadmap);
  }

  // ─── Helper Methods ─────────────────────────────────────────

  private getPhaseTitles(canonicalRole: string, phaseCount: number): string[] {
    const titlesMap: Record<string, string[]> = {
      FULLSTACK: [
        'Phase 1: Foundational Web Architecture & Language Core',
        'Phase 2: Modern Frontend Frameworks & Component Engineering',
        'Phase 3: Asynchronous Backend Systems & Database Optimization',
        'Phase 4: Distributed Caching, Containerization & Production Scale',
      ],
      FRONTEND: [
        'Phase 1: Modern Semantic HTML, CSS & Responsive Layouts',
        'Phase 2: Modern JavaScript (ES2024+) & TypeScript Type Systems',
        'Phase 3: React 19 Component Architecture & State Management',
        'Phase 4: REST API Integration, Web Performance & Accessibility',
      ],
      BACKEND: [
        'Phase 1: Core Computer Science, Concurrency & Networking',
        'Phase 2: Asynchronous Microservices & Relational Database Design',
        'Phase 3: Database Internals, Indexing & Distributed Caching',
        'Phase 4: Event Streaming, High-Level System Design & Cloud Scale',
      ],
      DATA_SCIENTIST: [
        'Phase 1: Statistical Foundations, Probability & Data Exploration',
        'Phase 2: High-Performance Python Vector Stack & SQL',
        'Phase 3: Classical Machine Learning & Neural Network Foundations',
        'Phase 4: Deep Learning Architectures & Advanced Model Systems',
      ],
      DATA_ANALYST: [
        'Phase 1: Relational Database Querying & SQL Optimization',
        'Phase 2: Statistical Inference & Probability Distributions',
        'Phase 3: Exploratory Data Analysis & Python Data Profiling',
        'Phase 4: Executive KPI Dashboards & Business Intelligence',
      ],
      AIML: [
        'Phase 1: Programming Fundamentals & Python Vector Stack',
        'Phase 2: Machine Learning & Neural Network Foundations',
        'Phase 3: Retrieval-Augmented Generation (RAG) & Vector Search',
        'Phase 4: LLM Fine-Tuning (LoRA) & High-Throughput Model Serving',
      ],
      DEVOPS: [
        'Phase 1: Linux Administration, Shell Scripting & Networks',
        'Phase 2: Git Version Control & Docker Multi-Stage Builds',
        'Phase 3: Kubernetes Pod Orchestration & Service Mesh',
        'Phase 4: CI/CD Pipelines, Infrastructure as Code & Observability',
      ],
      SYSTEM_DESIGN: [
        'Phase 1: Operating Systems, Concurrency & Network Protocols',
        'Phase 2: Database Indexing, B-Trees & Distributed Caching',
        'Phase 3: Event-Driven Architecture & Message Streaming',
        'Phase 4: Large-Scale System Design (HLD) & Distributed Consensus',
      ],
    };

    const roleTitles = titlesMap[canonicalRole] || [
      'Phase 1: Foundations & Core Architecture',
      'Phase 2: Application Systems & Data Engineering',
      'Phase 3: Distributed Systems & Performance Optimization',
      'Phase 4: Production Hardening & High Availability',
    ];

    if (phaseCount === 3) {
      return [roleTitles[0], roleTitles[1], roleTitles[roleTitles.length - 1]];
    }

    return roleTitles.slice(0, phaseCount);
  }

  private getRoleDisplayTitle(canonicalKey: string): string {
    const map: Record<string, string> = {
      FULLSTACK: 'Senior Full Stack & Cloud Systems Architect',
      FRONTEND: 'Senior Frontend & Web Application Architect',
      BACKEND: 'High-Throughput Backend & Distributed Systems Engineer',
      DATA_SCIENTIST: 'Lead Data Scientist & Applied Machine Learning Specialist',
      DATA_ANALYST: 'Senior Data & Business Intelligence Analyst',
      AIML: 'Generative AI, LLM & RAG Systems Engineer',
      DEVOPS: 'Cloud Native DevOps & Site Reliability Engineer',
      SYSTEM_DESIGN: 'Staff Distributed System Architect',
    };
    return map[canonicalKey] || canonicalKey;
  }

  private calculateEstimatedHours(
    currentProficiency: number,
    targetProficiency: number,
    dagDepth: number,
    level: string,
    weeklyHours: number = 15
  ): number {
    const gap = Math.max(0, targetProficiency - currentProficiency);
    const baseHours = 6 + dagDepth * 2;
    const gapMultiplier = gap > 50 ? 1.5 : gap > 20 ? 1.1 : 0.6;
    const levelBonus = level === 'ADVANCED' || level === 'STAFF' ? 3 : 0;
    const weeklyFactor = weeklyHours < 10 ? 0.8 : weeklyHours > 25 ? 1.3 : 1.0;

    const estimated = Math.round((baseHours * gapMultiplier + levelBonus) * weeklyFactor);
    return Math.max(3, Math.min(60, estimated));
  }

  private generateWhatShouldIDo(skill: TaxonomySkill, currentProficiency: number = 0): GeneratedNodeDefinition['whatShouldIDo'] {
    if (currentProficiency >= 75) {
      return {
        summary: `Refine high-throughput production architecture, concurrency limits, and failure modes for ${skill.name}.`,
        actionSteps: [
          `Analyze telemetry profiles and latency bottlenecks for large-scale ${skill.name} implementations.`,
          `Implement automated circuit-breaking, retry policies, and graceful degradation strategies.`,
          `Conduct an architecture review assessing security posture, resource limits, and memory footprint.`,
        ],
        mentalModels: [
          `Production Hardening: Optimize for mean time to recovery (MTTR) and observability in ${skill.name}.`,
          `Scale Trade-offs: Evaluate memory overhead vs execution latency under peak concurrent loads.`,
        ],
      };
    }

    return {
      summary: `Master the fundamental mechanics, theoretical foundations, and architectural trade-offs of ${skill.name}. ${skill.description}`,
      actionSteps: [
        `Study the theoretical principles and lifecycle execution of ${skill.name}.`,
        `Implement a minimal working prototype from scratch without third-party boilerplate.`,
        `Stress test the implementation under simulated production failure modes and inspect bottlenecks.`,
        `Conduct an architectural code review to verify clean separation of concerns and type safety.`,
      ],
      mentalModels: [
        `First Principles: Understand the runtime memory and concurrency cost of ${skill.name}.`,
        `Trade-off Matrix: Evaluate simplicity vs scalability when choosing ${skill.name} in high-throughput systems.`,
      ],
    };
  }

  private generateWhatIsTheSource(skill: TaxonomySkill): GeneratedResourceSource[] {
    const predefined = CANONICAL_SKILL_RESOURCES[skill.slug];
    if (predefined && predefined.length > 0) {
      return predefined.map((res, idx) => ({
        id: `res-${skill.slug}-${idx + 1}`,
        title: res.title,
        url: res.url,
        type: res.type,
        description: res.description,
      }));
    }

    // Safe fallback canonical resource
    return [
      {
        id: `res-${skill.slug}-1`,
        title: `${skill.name} Official Technical Reference`,
        url: 'https://developer.mozilla.org/en-US/docs/Web',
        type: 'DOCS',
        description: `Official technical reference documentation for ${skill.name} and related specifications.`,
      },
    ];
  }

  private generateWhatIsTheExactThing(skill: TaxonomySkill): GeneratedPracticalDrill {
    return {
      title: `${skill.name} Production-Grade Engineering Drill`,
      description: `Build and verify a production-hardened implementation utilizing ${skill.name}. Focus on edge-case handling, error recovery, and benchmark performance metrics.`,
      deliverable: `A complete, modular TypeScript/SQL/Python implementation of ${skill.name} accompanied by unit tests.`,
      starterCode: `// Production scaffold for ${skill.name}\nexport interface I${skill.slug.replace(/[^a-zA-Z0-9]/g, '')}Handler {\n  execute(): Promise<void>;\n}`,
      verificationChecklist: [
        `Passes all automated unit tests covering standard execution paths.`,
        `Gracefully handles network timeouts, null inputs, and unexpected exceptions.`,
        `Demonstrates deterministic time complexity within defined benchmark limits.`,
      ],
    };
  }

  private generateMicroQuestions(skill: TaxonomySkill): GeneratedMicroQuestion[] {
    return [
      {
        id: `q-${skill.slug}-1`,
        questionText: `What specific production bottleneck or architectural challenge does ${skill.name} solve?`,
        focus: `${skill.category} Core Mechanics`,
        suggestedAnswer: `${skill.name} eliminates operational bottlenecks by providing structured abstraction, deterministic performance, and reliable fault tolerance.`,
      },
      {
        id: `q-${skill.slug}-2`,
        questionText: `What are the primary architectural trade-offs (e.g. latency vs consistency, memory vs CPU) when adopting ${skill.name}?`,
        focus: `${skill.category} Trade-off Analysis`,
        suggestedAnswer: `Adopting ${skill.name} introduces operational overhead and memory footprint, which is offset by higher throughput, maintainability, and scalability.`,
      },
    ];
  }
}

export const fallbackRoadmapSynthesizer = new FallbackRoadmapSynthesizer();
