import assert from 'node:assert';
import { bgeAtsService, BgeAtsScoreResult } from '../src/services/bgeAts.service.js';
import { competitiveMatchService } from '../src/services/competitiveMatch.service.js';

/**
 * UI mapping function mirroring client/src/utils/atsEngine.ts:mapBackendAtsResultToUi
 */
function mapBackendAtsResultToUi(backend: BgeAtsScoreResult) {
  const breakdown = backend.breakdown || {};
  const structureScore = Number(breakdown.structure ?? 0);
  const completenessScore = Number(breakdown.completeness ?? 0);
  const extractabilityScore = Number(breakdown.extractability ?? 0);
  const skillsScore = Number(breakdown.skills ?? 0);
  const experienceQualityScore = Number(breakdown.experienceQuality ?? 0);
  const formattingScore = Number(breakdown.formatting ?? 0);

  const totalScore = Number(backend.overallScore);

  return {
    totalScore,
    grade:
      totalScore >= 80 ? 'Exceptional Match'
      : totalScore >= 65 ? 'Competitive Match'
      : totalScore >= 50 ? 'Moderate Match'
      : 'Needs Improvement',
    breakdown: {
      structureScore,
      completenessScore,
      extractabilityScore,
      skillsScore,
      experienceQualityScore,
      formattingScore,
    },
    bulletsAudit: backend.bulletAudits,
    matchedKeywords: backend.explicitlyDetectedSkills,
  };
}

async function testAtsParity() {
  console.log('--- Testing ATS Backend/Frontend Parity ---');

  const resumeText = `Marcus Hayes
San Francisco, CA | marcus@example.com | (555) 123-4567 | linkedin.com/in/mhayes | github.com/mhayes

SUMMARY
Experienced Senior Software Engineer with 7+ years architecting scalable cloud services, microservices, and distributed data systems.

SKILLS
Languages: TypeScript, JavaScript, Python, Go, SQL
Frameworks: React, Next.js, Node.js, Express, FastAPI
Databases: PostgreSQL, Redis, MongoDB
Cloud & DevOps: Docker, Kubernetes, AWS, Terraform, CI/CD

EXPERIENCE
Senior Software Engineer | Stripe (2021 - Present)
- Architected and built high-throughput payment ingestion pipeline processing 40,000 requests/second with 99.99% uptime.
- Optimized PostgreSQL database queries and connection pooling, reducing p99 response latency by 42%.
- Mentored 5 junior engineers and led technical design reviews across 3 cross-functional teams.

Software Engineer | Cloudflare (2018 - 2021)
- Developed edge routing microservices in Go, decreasing cache invalidation latency by 28%.
- Built automated continuous integration pipelines with Docker, cutting deployment cycle times by 50%.

EDUCATION
Bachelor of Science in Computer Science | Stanford University (2014 - 2018)
GPA: 3.85 / 4.0`;

  // 1. Authoritative backend ATS evaluation
  const backendResult = await bgeAtsService.scoreResume({ resumeText });

  console.log(`Backend ATS Overall Score: ${backendResult.overallScore}/100`);
  console.log('Backend Pillar Breakdown:', backendResult.breakdown);

  // 2. Exact sum verification
  const pillarSum =
    backendResult.breakdown.structure +
    backendResult.breakdown.completeness +
    backendResult.breakdown.extractability +
    backendResult.breakdown.skills +
    backendResult.breakdown.experienceQuality +
    backendResult.breakdown.formatting;

  assert.strictEqual(
    backendResult.overallScore,
    pillarSum,
    `Backend overallScore (${backendResult.overallScore}) must equal exact sum of 6 pillars (${pillarSum})`
  );

  // 3. UI Data Model mapping
  const uiModel = mapBackendAtsResultToUi(backendResult);

  // 4. Parity Assertions
  assert.strictEqual(uiModel.totalScore, backendResult.overallScore, 'UI totalScore must equal backend overallScore directly');
  assert.strictEqual(uiModel.breakdown.structureScore, backendResult.breakdown.structure, 'Structure pillar must match');
  assert.strictEqual(uiModel.breakdown.completenessScore, backendResult.breakdown.completeness, 'Completeness pillar must match');
  assert.strictEqual(uiModel.breakdown.extractabilityScore, backendResult.breakdown.extractability, 'Extractability pillar must match');
  assert.strictEqual(uiModel.breakdown.skillsScore, backendResult.breakdown.skills, 'Skills pillar must match');
  assert.strictEqual(uiModel.breakdown.experienceQualityScore, backendResult.breakdown.experienceQuality, 'Experience Quality pillar must match');
  assert.strictEqual(uiModel.breakdown.formattingScore, backendResult.breakdown.formatting, 'Formatting pillar must match');

  console.log('✓ ATS Backend/Frontend parity verified: 100% identical values and exact 6-pillar sum');

  // 5. Competitive score independence verification
  console.log('\n--- Testing Competitive Score Independence ---');
  const jdText = `Requirements:
- 5+ years experience in Software Engineering
- Strong proficiency in TypeScript, React, Node.js, PostgreSQL
- Experience designing scalable distributed systems`;

  const compResult = await competitiveMatchService.match({
    resumeText,
    jobDescription: jdText,
    role: 'Senior Software Engineer'
  });

  console.log(`Competitive Score: ${compResult.score}/100 (Status: ${compResult.status})`);
  assert.notStrictEqual(compResult.score, null, 'Relevant role should be MATCHED');
  assert.strictEqual(compResult.status, 'MATCHED');

  // Verify NOT_RELEVANT role returns null score
  const irrelevantMatch = await competitiveMatchService.match({
    resumeText: `Jane Doe
Registered Nurse, Clinical Care, Patient Triage, Medical Records`,
    jobDescription: jdText,
    role: 'Senior Software Engineer'
  });

  console.log(`Irrelevant Role Match Status: ${irrelevantMatch.status}, Score: ${irrelevantMatch.score}`);
  assert.strictEqual(irrelevantMatch.status, 'NOT_RELEVANT', 'Irrelevant role must be marked NOT_RELEVANT');
  assert.strictEqual(irrelevantMatch.score, null, 'NOT_RELEVANT must have null score (no fabricated defaults)');

  console.log('✓ Competitive Score separation and relevance gate verified!');
}

testAtsParity().then(() => {
  console.log('\nAll parity regression tests PASSED!');
  process.exit(0);
}).catch((err) => {
  console.error('\nParity regression test failed:', err);
  process.exit(1);
});
