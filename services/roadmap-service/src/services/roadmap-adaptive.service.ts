// ═══════════════════════════════════════════════════════════════
// RU Ready? — Adaptive Diagnostic Assessment & Path Engine
// Identifies learner prior knowledge and recommends personalized path adjustments
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';

export interface DiagnosticQuestion {
  id: string;
  nodeId: string;
  moduleTitle: string;
  domain: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface DiagnosticRecommendation {
  nodeId: string;
  moduleTitle: string;
  action: 'START' | 'SKIP' | 'REVIEW' | 'ADVANCED';
  score: number;
  reason: string;
  suggestedAction: string;
}

export interface DiagnosticEvaluationResult {
  completedAt: string;
  overallScore: number;
  domainProficiencies: Record<string, number>;
  recommendations: DiagnosticRecommendation[];
  summary: string;
}

export class RoadmapAdaptiveService {
  /**
   * Generate diagnostic questions for a roadmap to evaluate prior knowledge
   */
  static async generateDiagnostic(roadmapId: string): Promise<{
    roadmapId: string;
    roadmapTitle: string;
    questions: DiagnosticQuestion[];
  }> {
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: { nodes: { orderBy: { position: 'asc' } } },
    });

    if (!roadmap) {
      throw new Error(`Roadmap '${roadmapId}' not found`);
    }

    const nodes = roadmap.nodes || [];
    const questions: DiagnosticQuestion[] = [];

    for (const [idx, node] of nodes.slice(0, 6).entries()) {
      const lower = node.title.toLowerCase();
      let domain = 'Core Engineering';
      let qText = `What is the primary architectural trade-off when implementing ${node.title}?`;
      let opts = [
        'Higher initial complexity in exchange for predictable scalability and fault isolation.',
        'Immediate cost reduction without requiring automated testing or CI/CD pipelines.',
        'Guaranteed zero CPU utilization during peak traffic spikes.',
        'Automatic replacement of relational ACID transactions with synchronous REST calls.',
      ];
      let correctIdx = 0;
      let exp = 'Scalable distributed systems accept initial design complexity to guarantee predictable throughput and fault isolation.';

      if (lower.includes('network') || lower.includes('http') || lower.includes('socket')) {
        domain = 'Networking & Protocols';
        qText = 'In HTTP/2 and HTTP/3 architectures, what is the primary advantage of multiplexing over HTTP/1.1 pipelining?';
        opts = [
          'Eliminating Head-of-Line (HoL) blocking across simultaneous concurrent streams over a single connection.',
          'Requiring all connections to run over unencrypted UDP without TLS.',
          'Eliminating the need for domain name resolution (DNS).',
          'Enforcing strict synchronous FIFO execution of server responses.',
        ];
        correctIdx = 0;
        exp = 'Multiplexing interleaves frames from multiple requests simultaneously over one TCP/QUIC connection, preventing HoL blocking.';
      } else if (lower.includes('database') || lower.includes('sql') || lower.includes('postgres') || lower.includes('index')) {
        domain = 'Databases & Query Optimization';
        qText = 'When analyzing a slow query with EXPLAIN (ANALYZE, BUFFERS) in PostgreSQL, what does a "Seq Scan" with high buffer reads typically signal?';
        opts = [
          'The query is reading entire table pages from disk/cache because no selective index is available or the table statistics are stale.',
          'The database hardware memory is corrupt and needs an immediate restart.',
          'The transaction isolation level is set to Read Committed.',
          'The query has automatically cached the result in Redis.',
        ];
        correctIdx = 0;
        exp = 'Seq Scan scans all pages sequentially; composite or B-tree indexing on filter predicates avoids unnecessary disk I/O.';
      } else if (lower.includes('redis') || lower.includes('cache')) {
        domain = 'Caching & In-Memory Systems';
        qText = 'How does a distributed system effectively mitigate "Cache Stampede" (thundering herd) when a popular key expires?';
        opts = [
          'Using distributed mutex locks or probabilistic early expiration (XFetch algorithm) so only one worker recalculates the cache.',
          'Setting the TTL of all keys to expire simultaneously at midnight.',
          'Disabling caching entirely during peak traffic periods.',
          'Increasing the database pool size to 10,000 concurrent threads.',
        ];
        correctIdx = 0;
        exp = 'Mutex locks or probabilistic early refreshing ensures only one process recomputes the stale key while others use grace values.';
      } else if (lower.includes('kafka') || lower.includes('event') || lower.includes('message')) {
        domain = 'Event Streaming & Messaging';
        qText = 'In Apache Kafka, what guarantees strict message ordering across distributed consumers?';
        opts = [
          'Producing messages with the same partition key, which routes them deterministically to the same partition consumed by a single consumer thread.',
          'Broadcasting messages across all partitions randomly with Round Robin.',
          'Using unbuffered synchronous HTTP POST requests to each consumer node.',
          'Disabling offsets and committing every millisecond.',
        ];
        correctIdx = 0;
        exp = 'Strict total ordering is guaranteed per partition in Kafka; consistent partition keys ensure related events go to the same partition.';
      } else if (lower.includes('docker') || lower.includes('kubernetes') || lower.includes('container')) {
        domain = 'Containerization & Cloud';
        qText = 'What is the primary security benefit of multi-stage Docker builds in production deployments?';
        opts = [
          'Separating build-time dependencies (compilers, SDKs) from the minimal hardened final runtime image running as non-root.',
          'Doubling the image layer count to increase download speed.',
          'Granting the container root privileges inside the host kernel.',
          'Embedding plain-text production secrets into the Dockerfile layers.',
        ];
        correctIdx = 0;
        exp = 'Multi-stage builds produce tiny production images free from build tools and security vulnerabilities.';
      }

      questions.push({
        id: `diag_q_${idx + 1}`,
        nodeId: node.id,
        moduleTitle: node.title,
        domain,
        question: qText,
        options: opts,
        correctOptionIndex: correctIdx,
        explanation: exp,
      });
    }

    return {
      roadmapId,
      roadmapTitle: roadmap.title,
      questions,
    };
  }

  /**
   * Evaluate diagnostic submission and generate personalized path recommendations
   */
  static async evaluateDiagnostic(params: {
    roadmapId: string;
    userId: string;
    answers: Record<string, number>; // questionId -> selectedOptionIndex
  }): Promise<DiagnosticEvaluationResult> {
    const { roadmapId, userId, answers } = params;

    const diagnosticData = await this.generateDiagnostic(roadmapId);
    const domainScores: Record<string, { total: number; correct: number }> = {};
    const recommendations: DiagnosticRecommendation[] = [];
    let totalQuestions = diagnosticData.questions.length;
    let correctCount = 0;

    for (const q of diagnosticData.questions) {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctOptionIndex;

      if (!domainScores[q.domain]) {
        domainScores[q.domain] = { total: 0, correct: 0 };
      }
      domainScores[q.domain].total += 1;
      if (isCorrect) {
        domainScores[q.domain].correct += 1;
        correctCount += 1;
      }

      // Generate recommendation for this node
      if (isCorrect) {
        recommendations.push({
          nodeId: q.nodeId,
          moduleTitle: q.moduleTitle,
          action: 'SKIP',
          score: 100,
          reason: `Demonstrated strong conceptual mastery in ${q.domain}. You can safely skip to practical capstone challenges.`,
          suggestedAction: 'Skip module or jump straight to hands-on project mission',
        });
      } else {
        recommendations.push({
          nodeId: q.nodeId,
          moduleTitle: q.moduleTitle,
          action: 'REVIEW',
          score: 40,
          reason: `Knowledge gap identified in ${q.domain}. We recommend following the structured curriculum and completing all practical exercises.`,
          suggestedAction: 'Prioritize this milestone and complete all hands-on exercises',
        });
      }
    }

    const overallScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const domainProficiencies: Record<string, number> = {};
    for (const [dom, stats] of Object.entries(domainScores)) {
      domainProficiencies[dom] = Math.round((stats.correct / stats.total) * 100);
    }

    const summary = overallScore >= 80
      ? `High proficiency demonstrated (${overallScore}%). We recommend an accelerated path focusing on capstone architecture defense.`
      : `Diagnostic score: ${overallScore}%. We recommend following the standard learning path with extra focus on highlighted gap domains.`;

    const result: DiagnosticEvaluationResult = {
      completedAt: new Date().toISOString(),
      overallScore,
      domainProficiencies,
      recommendations,
      summary,
    };

    // Store in RoadmapInstance customOverrides
    const existingInstance = await prisma.roadmapInstance.findUnique({
      where: { userId_roadmapId: { userId, roadmapId } },
    });

    if (existingInstance) {
      const overrides = (existingInstance.customOverrides as any) || {};
      await prisma.roadmapInstance.update({
        where: { id: existingInstance.id },
        data: {
          customOverrides: {
            ...overrides,
            diagnostic: result,
          },
        },
      });
    }

    return result;
  }
}
