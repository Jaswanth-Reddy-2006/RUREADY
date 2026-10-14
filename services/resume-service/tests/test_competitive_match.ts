import { competitiveMatchService } from '../src/services/competitiveMatch.service.js';

const SOFTWARE_JD = `
Senior Software Engineer
Requirements: Python, TypeScript, React, Node.js, Docker, Kubernetes, REST API design, PostgreSQL.
Responsibilities: build and operate distributed backend services, design CI/CD pipelines,
mentor engineers, participate in architecture reviews.
`;

const SOFTWARE_RESUME = `
JANE DOE
jane.doe@email.com | Seattle, WA

SKILLS
Python, TypeScript, React, Node.js, Docker, Kubernetes, PostgreSQL, REST API, CI/CD

EXPERIENCE
Senior Software Engineer — CloudCorp — Mar 2021 - Present
• Architected distributed backend services in Python and Node.js serving 2M requests/day.
• Built CI/CD pipelines with Docker and Kubernetes, reducing deployment time by 40%.
• Migrated legacy PostgreSQL schema, improving query latency by 35%.

Software Engineer — WebStart — Jun 2018 - Feb 2021
• Developed React frontends and REST APIs used by 50k monthly active users.
`;

const MECHANICAL_RESUME = `
JOHN SMITH
john.smith@email.com | Detroit, MI

SKILLS
SolidWorks, AutoCAD, ANSYS, Finite Element Analysis, GD&T, Thermodynamics, CFD

EXPERIENCE
Mechanical Design Engineer — Turbo Systems — Jan 2016 - Present
• Designed turbine housings using SolidWorks and ANSYS simulation.
• Improved heat exchanger efficiency by 12% through CFD-driven geometry optimization.
• Led mechanical tolerance analysis for automotive powertrain assemblies.
`;

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`ASSERTION FAILED: ${msg}`);
}

async function runTest() {
  console.log('--- Testing Competitive Matcher (BGE resume/JD matching) ---\n');

  // TEST 1: aligned resume -> MATCHED with a real score
  const matched = await competitiveMatchService.match({
    resumeText: SOFTWARE_RESUME,
    jobDescription: SOFTWARE_JD,
    role: 'Software Engineer',
  });

  console.log('Case 1 (software resume vs software JD):');
  console.log(`  status=${matched.status} score=${matched.score} modelSource=${matched.modelSource}`);
  console.log(`  signals=${JSON.stringify(matched.matchSignals)}`);
  console.log(`  matchedSkills=${matched.signalsDetail.matchedSkills.join(', ')}`);

  assert(matched.status === 'MATCHED', 'aligned resume must be MATCHED');
  assert(matched.score !== null && matched.score >= 0 && matched.score <= 100, 'score must be 0-100');
  assert(matched.matchSignals.skillOverlap > 0.4, 'skill overlap must be substantial');
  for (const [k, v] of Object.entries(matched.matchSignals)) {
    assert(v >= 0 && v <= 1, `signal ${k} must be within [0,1]`);
  }
  const w = matched.weights;
  const s = matched.matchSignals;
  const expected = Math.round(
    100 * (w.semanticSimilarity * s.semanticSimilarity
      + w.skillOverlap * s.skillOverlap
      + w.experienceRelevance * s.experienceRelevance
      + w.terminologyMatch * s.terminologyMatch)
  );
  assert(matched.score === Math.max(0, Math.min(100, expected)),
    `score must equal documented weighted blend (expected ${expected}, got ${matched.score})`);

  // TEST 2: cross-domain resume -> NOT_RELEVANT with score null (never 0)
  const notRelevant = await competitiveMatchService.match({
    resumeText: MECHANICAL_RESUME,
    jobDescription: SOFTWARE_JD,
    role: 'Software Engineer',
  });

  console.log('\nCase 2 (mechanical resume vs software JD):');
  console.log(`  status=${notRelevant.status} score=${notRelevant.score}`);
  console.log(`  signals=${JSON.stringify(notRelevant.matchSignals)}`);
  console.log(`  reason=${notRelevant.reason || '(none)'}`);

  assert(notRelevant.status === 'NOT_RELEVANT', 'cross-domain resume must be NOT_RELEVANT');
  assert(notRelevant.score === null, 'NOT_RELEVANT score must be null (N/A), not 0');
  assert(notRelevant.matchSignals.skillOverlap < 0.2, 'cross-domain skill overlap must be low');

  // TEST 3: aligned score must exceed cross-domain semantic similarity
  assert(matched.matchSignals.semanticSimilarity > notRelevant.matchSignals.semanticSimilarity,
    'aligned resume must have higher semantic similarity than cross-domain');

  console.log('\nAll competitive matcher tests PASSED!');
}

runTest().catch((err) => {
  console.error('Test FAILED:', err?.message || err);
  process.exit(1);
});
