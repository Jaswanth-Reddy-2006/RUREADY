import { prisma } from './lib/prisma.js';

const curatedRoadmaps = [
  {
    key: 'rennetus-frontend-foundations',
    title: 'Frontend Engineer Foundations',
    creatorName: 'Rennetus Expert Committee',
    description: 'A practical path from web fundamentals to a portfolio-ready frontend application.',
    goal: 'Build the foundations and project evidence needed for a frontend engineering role.',
    category: 'Frontend Engineering',
    difficulty: 'BEGINNER',
    estimatedWeeks: 12,
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Portfolio'],
    nodes: [
      ['Web foundations', 'Learn semantic HTML, accessible CSS, responsive layouts, and browser fundamentals.'],
      ['JavaScript in practice', 'Build small browser projects while learning async JavaScript and APIs.'],
      ['React application architecture', 'Create a maintainable React application with routing, state, and tests.'],
      ['Portfolio project', 'Ship one polished project with a public demo, README, and technical story.'],
    ],
  },
  {
    key: 'rennetus-data-analytics',
    title: 'Data Analytics to Decision-Making',
    creatorName: 'Rennetus Expert Committee',
    description: 'A guided path for turning raw data into clear analysis, dashboards, and business recommendations.',
    goal: 'Become confident solving practical analytics problems with SQL, Python, and visualization.',
    category: 'Data & Analytics',
    difficulty: 'INTERMEDIATE',
    estimatedWeeks: 14,
    tags: ['SQL', 'Python', 'Analytics', 'Dashboards', 'Case Studies'],
    nodes: [
      ['SQL foundations', 'Query, clean, join, and validate relational data with confidence.'],
      ['Python for analysis', 'Use notebooks, pandas, and reproducible analysis workflows.'],
      ['Communicating insights', 'Choose useful charts and explain findings for non-technical audiences.'],
      ['Analytics case study', 'Complete an end-to-end analysis with recommendations and a presentation.'],
    ],
  },
  {
    key: 'rennetus-interview-system',
    title: 'Technical Interview Readiness',
    creatorName: 'Rennetus Expert Committee',
    description: 'A balanced preparation plan combining coding patterns, system design, communication, and mock interviews.',
    goal: 'Build repeatable interview habits and demonstrate technical thinking under time pressure.',
    category: 'Interview Preparation',
    difficulty: 'INTERMEDIATE',
    estimatedWeeks: 10,
    tags: ['DSA', 'System Design', 'Mock Interviews', 'Communication'],
    nodes: [
      ['Problem-solving patterns', 'Practice arrays, strings, trees, graphs, and complexity explanations.'],
      ['System design essentials', 'Model requirements, APIs, data, scaling, and trade-offs.'],
      ['Behavioral stories', 'Prepare concise evidence-led stories for ownership, conflict, and learning.'],
      ['Mock interview loop', 'Run timed mocks, review feedback, and close the gaps you find.'],
    ],
  },
  {
    key: 'rennetus-backend-cloud',

    title: 'Backend & Distributed Systems Architecture',
    creatorName: 'Rennetus Expert Committee',
    description: 'Master enterprise-grade API engineering, database scaling, caching, and distributed systems design.',
    goal: 'Design and deploy high-throughput, fault-tolerant backend services from ground up.',
    category: 'Backend Engineering',
    difficulty: 'ADVANCED',
    estimatedWeeks: 16,
    tags: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'Microservices', 'System Design'],
    nodes: [
      ['REST & gRPC API Design', 'Build resilient APIs with structured validation, rate limiting, and protobufs.'],
      ['Relational & Distributed Data', 'Schema design, indexing strategies, replication, and ACID guarantees.'],
      ['Caching & Async Messaging', 'Redis caching patterns, message queues (Kafka/RabbitMQ), and idempotency.'],
      ['Microservices & Observability', 'Containerization, OpenTelemetry tracing, metrics, and failure recovery.'],
      ['Production Capstone', 'Architect and deploy a high-concurrency transactional service with zero downtime.'],
    ],
  },
  {
    key: 'rennetus-ai-engineering',
    title: 'Full-Stack AI & LLM Systems Engineering',
    creatorName: 'Rennetus Expert Committee',
    description: 'Build modern AI applications utilizing LLMs, RAG architectures, vector databases, and multi-agent systems.',
    goal: 'Ship production-ready generative AI and intelligent agent applications.',
    category: 'Artificial Intelligence',
    difficulty: 'INTERMEDIATE',
    estimatedWeeks: 12,
    tags: ['Python', 'LLMs', 'RAG', 'Vector Databases', 'LangChain', 'Agents'],
    nodes: [
      ['AI & Python Core Foundations', 'Master modern Python typing, async concurrency, and tokenization mechanics.'],
      ['Prompt Engineering & Structured Outputs', 'Few-shot prompting, schema-constrained generation, and guardrails.'],
      ['Retrieval Augmented Generation (RAG)', 'Chunking strategies, hybrid search, embeddings, and vector indexing.'],
      ['Autonomous AI Agents & Tool Calling', 'Multi-agent orchestration, human-in-the-loop workflows, and state memory.'],
      ['Production AI Deployment', 'Streaming responses, rate limits, eval benchmarks, and latency optimization.'],
    ],
  },
  {
    key: 'rennetus-devops-sre',
    title: 'Cloud Native DevOps & Site Reliability',
    creatorName: 'Rennetus Expert Committee',
    description: 'Learn modern DevOps workflows: Linux, Docker, Kubernetes, Terraform IaC, and resilient CI/CD pipelines.',
    goal: 'Automate deployments and maintain reliable 99.99% uptime cloud infrastructure.',
    category: 'DevOps & Cloud',
    difficulty: 'INTERMEDIATE',
    estimatedWeeks: 14,
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS', 'Prometheus'],
    nodes: [
      ['Linux Internals & Networking', 'Bash scripting, systemd, TCP/IP fundamentals, and TLS configuration.'],
      ['Containers & Orchestration', 'Multi-stage Docker builds, Kubernetes manifests, Helm charts, and ingress.'],
      ['Infrastructure as Code (IaC)', 'Declarative cloud provisioning with Terraform and state management.'],
      ['GitOps & Automated Pipelines', 'GitHub Actions CI/CD workflows, automated testing, and blue-green deployments.'],
      ['Observability & Incident Readiness', 'SLOs, SLIs, Prometheus alerting, Grafana dashboards, and chaos engineering.'],
    ],
  },
];


export async function seedPublicRoadmaps() {
  try {
    for (const roadmap of curatedRoadmaps) {
      const existing = await prisma.roadmap.findFirst({ where: { ownerId: roadmap.key } });
      if (existing) continue;
      await prisma.roadmap.create({
        data: {
          ownerId: roadmap.key,
          creatorName: roadmap.creatorName,
          title: roadmap.title,
          description: roadmap.description,
          goal: roadmap.goal,
          category: roadmap.category,
          difficulty: roadmap.difficulty,
          estimatedWeeks: roadmap.estimatedWeeks,
          tags: roadmap.tags,
          status: 'PUBLISHED',
          isPublished: true,
          publishedAt: new Date(),
          nodes: { create: roadmap.nodes.map(([title, description], position) => ({ title, description, type: 'MILESTONE', position })) },
        },
      });
    }
    console.log('[Roadmap Service] Curated public roadmaps verified/seeded successfully.');
  } catch (error) {
    console.warn('[Roadmap Service] Warning: Unable to seed curated public roadmaps:', error);
  }
}

