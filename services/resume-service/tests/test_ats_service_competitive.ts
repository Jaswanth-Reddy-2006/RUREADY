/**
 * Backend contract tests for the unified Competitive Score path in
 * ats.service.analyzeResumeAndJob.
 *
 * The LLM, the Prisma client and the Python matcher bridge are all stubbed so
 * these tests are deterministic and need no DB, no model and no network. They
 * verify the four invariants introduced by the Competitive Score cleanup:
 *   1. The persisted/returned matchScore is the matcher's score — never a
 *      fabricated or LLM-provided number (single authoritative source).
 *   2. Docling structuredElements from the request are forwarded to the matcher.
 *   3. NOT_RELEVANT yields null end-to-end and is persisted as null (never 0).
 *   4. A matcher/engine failure throws an honest 503 and persists NOTHING —
 *      there is no heuristic word-overlap fallback score anymore.
 *
 * Run: npx tsx tests/test_ats_service_competitive.ts
 */

import { atsService } from '../src/services/ats.service.js';
import {
  competitiveMatchService,
  CompetitiveMatchError,
} from '../src/services/competitiveMatch.service.js';
import { prisma } from '../src/lib/prisma.js';
import { aiProviderManager } from '../src/lib/ai-provider-manager.js';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`ASSERTION FAILED: ${msg}`);
}

const RESUME = [
  'JANE DOE',
  'jane.doe@email.com | Seattle, WA',
  '',
  'SKILLS',
  'Python, TypeScript, React, Node.js, Docker, Kubernetes, PostgreSQL, REST API',
  '',
  'EXPERIENCE',
  'Software Engineer — CloudCorp — Mar 2021 - Present',
  '• Architected distributed backend services in Python and Node.js serving 2M requests/day.',
].join('\n');

const JD = [
  'Senior Software Engineer',
  'Requirements: Python, TypeScript, React, Node.js, Docker, Kubernetes, PostgreSQL, REST API.',
  'Build and operate distributed backend services and CI/CD pipelines.',
].join('\n');

const STRUCTURED_ELEMENTS = [
  {
    type: 'paragraph',
    label: 'text',
    text: 'Architected distributed backend services in Python and Node.js serving 2M requests/day.',
    level: 0,
    page_no: 1,
  },
];

const WEIGHTS = {
  semanticSimilarity: 0.45,
  skillOverlap: 0.25,
  experienceRelevance: 0.15,
  terminologyMatch: 0.15,
};

// ── Stub the LLM so the analysis is deterministic and never hits a provider. ──
// Throwing forces ats.service down its qualitative-only fallback (which must NOT
// produce any numeric score) before the competitive matcher runs.
(aiProviderManager as any).generateText = async () => {
  throw new Error('LLM disabled in test');
};

// ── Stub Prisma so no DB is touched; capture what would be persisted. ─────────
let capturedCreate: any = null;
let createCallCount = 0;
(prisma.atsMatch as any).create = async (args: any) => {
  createCallCount += 1;
  capturedCreate = args;
  return { id: 'test-match-id' };
};

// ── Stub the matcher bridge; capture the params it receives. ──────────────────
let capturedMatchParams: any = null;

function stubMatch(result: any) {
  (competitiveMatchService as any).match = async (params: any) => {
    capturedMatchParams = params;
    return typeof result === 'function' ? result(params) : result;
  };
}

async function run() {
  console.log('--- Testing unified Competitive Score path (ats.service) ---\n');

  // TEST 1 + 2: MATCHED → authoritative score, structuredElements forwarded.
  capturedCreate = null;
  capturedMatchParams = null;
  createCallCount = 0;
  stubMatch((params: any) => ({
    status: 'MATCHED',
    score: 73,
    role: params.role,
    model: 'BAAI/bge-large-en-v1.5',
    modelSource: 'base-bge',
    weights: WEIGHTS,
    gate: {},
    matchSignals: {
      semanticSimilarity: 0.62,
      skillOverlap: 0.7,
      experienceRelevance: 0.5,
      terminologyMatch: 0.55,
    },
    signalsDetail: {
      rawCosine: 0.58,
      matchedSkills: ['Python', 'TypeScript'],
      missingSkills: ['Kafka'],
      resumeSkills: ['Python', 'TypeScript', 'React'],
    },
  }));

  const matched = await atsService.analyzeResumeAndJob(
    'user-1', RESUME, JD, 'Software Engineer', 'Acme', STRUCTURED_ELEMENTS
  );

  console.log('Case 1 (MATCHED):');
  console.log(`  status=${matched.status} matchScore=${matched.matchScore} overallScore=${matched.overallScore}`);
  console.log(`  persisted matchScore=${capturedCreate?.data?.matchScore} semanticScore=${capturedCreate?.data?.semanticScore}`);

  assert(matched.status === 'MATCHED', 'status must be MATCHED');
  assert(matched.matchScore === 73, 'returned matchScore must equal the matcher score (73)');
  assert(matched.overallScore === 73, 'overallScore must mirror the matcher score');
  assert(matched.competitive?.score === 73, 'competitive result must be passed through unchanged');
  assert(capturedCreate.data.matchScore === 73, 'persisted matchScore must be the real matcher score');
  // semanticScore is the genuine matcher signal (0.62 * 100), not a default.
  assert(capturedCreate.data.semanticScore === 62, 'persisted semanticScore must come from the real signal (62)');

  // structuredElements forwarded from the request into the matcher.
  const forwarded = capturedMatchParams?.structuredElements;
  assert(Array.isArray(forwarded) && forwarded.length === 1, 'structuredElements must be forwarded to the matcher');
  assert(forwarded[0].text === STRUCTURED_ELEMENTS[0].text, 'forwarded structuredElements must be the Docling elements');

  // TEST 3: NOT_RELEVANT → null everywhere, persisted as null (never 0).
  capturedCreate = null;
  createCallCount = 0;
  stubMatch((params: any) => ({
    status: 'NOT_RELEVANT',
    score: null,
    role: params.role,
    reason: 'Resume domain does not sufficiently match the selected role.',
    model: 'BAAI/bge-large-en-v1.5',
    modelSource: 'base-bge',
    weights: WEIGHTS,
    gate: {},
    matchSignals: {
      semanticSimilarity: 0.1,
      skillOverlap: 0.05,
      experienceRelevance: 0.1,
      terminologyMatch: 0.08,
    },
    signalsDetail: {
      rawCosine: 0.2,
      matchedSkills: [],
      missingSkills: ['Python', 'Kubernetes'],
      resumeSkills: ['SolidWorks'],
    },
  }));

  const notRelevant = await atsService.analyzeResumeAndJob(
    'user-1', RESUME, JD, 'Software Engineer', 'Acme', STRUCTURED_ELEMENTS
  );

  console.log('\nCase 2 (NOT_RELEVANT):');
  console.log(`  status=${notRelevant.status} matchScore=${notRelevant.matchScore} overallScore=${notRelevant.overallScore}`);
  console.log(`  persisted matchScore=${capturedCreate?.data?.matchScore}`);

  assert(notRelevant.status === 'NOT_RELEVANT', 'status must be NOT_RELEVANT');
  assert(notRelevant.matchScore === null, 'NOT_RELEVANT matchScore must be null');
  assert(notRelevant.overallScore === null, 'NOT_RELEVANT overallScore must be null');
  assert(capturedCreate.data.matchScore === null, 'NOT_RELEVANT must persist matchScore=null, never 0');
  // The string-prefix hack is gone: experienceMatch must NOT encode the status.
  assert(
    typeof capturedCreate.data.experienceMatch !== 'string' ||
      !capturedCreate.data.experienceMatch.startsWith('NOT_RELEVANT'),
    'experienceMatch must not be used to encode NOT_RELEVANT status'
  );

  // TEST 4: matcher/engine failure → honest 503, nothing persisted, no fallback score.
  capturedCreate = null;
  createCallCount = 0;
  stubMatch(() => {
    throw new Error('python bridge exploded');
  });

  let thrown: any = null;
  try {
    await atsService.analyzeResumeAndJob(
      'user-1', RESUME, JD, 'Software Engineer', 'Acme', STRUCTURED_ELEMENTS
    );
  } catch (err) {
    thrown = err;
  }

  console.log('\nCase 3 (engine failure):');
  console.log(`  threw=${thrown?.name} statusCode=${thrown?.statusCode} persistedRows=${createCallCount}`);

  assert(thrown instanceof CompetitiveMatchError, 'engine failure must throw CompetitiveMatchError');
  assert(thrown.statusCode === 503, 'engine failure must surface as 503 (unavailable)');
  assert(createCallCount === 0, 'engine failure must persist NOTHING (no fabricated score)');

  console.log('\nAll unified Competitive Score service tests PASSED!');
}

run().catch((err) => {
  console.error('Test FAILED:', err?.message || err);
  process.exit(1);
});
