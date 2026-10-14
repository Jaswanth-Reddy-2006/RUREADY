/**
 * Regression Test Suite: Bullet Recommendation Engine Quality & Integrity
 *
 * Validates:
 * 1. Duplicate recommendation suppression & grouping with preserved bullet references
 * 2. Bullet-specific advice differentiation (vague ownership, weak action verb, unclear tech, missing outcome)
 * 3. Never invent achievements, metrics, or performance numbers
 * 4. Validation of extracted text & flagging corruption for review (no silent rewrite)
 * 5. Conditional metrics advice (only for optimization/scale/efficiency, domain-specific)
 * 6. Truthful summary calculations (correct denominator, safe zero-bullet handling, no NaN)
 */

import {
  validateBulletText,
  detectBulletDomain,
  evaluateSingleBullet,
  buildRecommendationGroups,
  auditResumeBullets,
  EvaluatedBullet,
} from '../utils/bulletRecommendationEngine';
import { calculateAtsScore } from '../utils/atsEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`❌ Assertion Failed: ${message}`);
  }
}

console.log('🧪 Starting Bullet Recommendation Quality Regression Tests...\n');

// ─────────────────────────────────────────────────────────────────────────────
// Test 1: Validation of Extracted Text & Corruption Flagging
// ─────────────────────────────────────────────────────────────────────────────
console.log('--- Test 1: Text Corruption Detection & Flagging ---');

const corruptSamples = [
  { text: 'Engineered backend api with \uFFFD replacement character', reason: 'Replacement character' },
  { text: 'Integrated Stripe payments using â€™ mojibake encoding artifact', reason: 'Mojibake' },
  { text: 'Deployed cluster to AWS with null \0 byte', reason: 'Null byte' },
  { text: 'Architected microservices with \x07 bell control char', reason: 'Control char' },
  { text: 't h i s   i s   f r a g m e n t e d   p d f   t e x t', reason: 'Fragmented single characters' },
  { text: 'Designed system ^~~~`||| nonsense symbols', reason: 'Symbol cluster' },
  { text: '@@@@####$$$$%%%%^^^^&&&&****((((', reason: 'High symbol density' },
];

for (const sample of corruptSamples) {
  const validation = validateBulletText(sample.text);
  assert(validation.isCorrupted === true, `Expected corruption detected for: ${sample.reason}`);

  const evaluated = evaluateSingleBullet(sample.text, 'b-test', 'Context', false, true, 'Engineered');
  assert(evaluated.category === 'TEXT_CORRUPTION', `Category should be TEXT_CORRUPTION for: ${sample.reason}`);
  assert(evaluated.isCorrupted === true, 'isCorrupted flag should be true');
  assert(
    evaluated.feedback.includes('Flagged for Review: Potential Text Extraction Corruption'),
    'Should contain corruption review warning'
  );
  // Must NOT silently alter or invent a fake rewrite
  assert(evaluated.suggestedRewrite === sample.text.trim(), 'Should not invent rewrite for corrupted text');
}

// Clean bullets should not be flagged as corrupt
const cleanBullet = 'Architected a distributed payment gateway in Go, reducing p99 latency by 35%.';
assert(validateBulletText(cleanBullet).isCorrupted === false, 'Clean bullet should not be flagged as corrupt');
console.log('✅ Passed: Text corruption detected and flagged for review without silent modification.\n');

// ─────────────────────────────────────────────────────────────────────────────
// Test 2: Bullet-Specific Advice Differentiation
// ─────────────────────────────────────────────────────────────────────────────
console.log('--- Test 2: Bullet-Specific Advice Differentiation ---');

// A. Vague Ownership
const vagueSprint = evaluateSingleBullet(
  'Participated in daily agile meetings and sprint planning cycles.',
  'b-vague-1',
  'Stripe',
  false,
  false,
  'Participated'
);
assert(vagueSprint.category === 'VAGUE_OWNERSHIP', 'Sprint participation should be VAGUE_OWNERSHIP');
assert(
  vagueSprint.feedback.includes('Clarify what specific feature, module, or fix you personally delivered during these sprint cycles'),
  'Should provide sprint-specific ownership feedback'
);

const vagueDuties = evaluateSingleBullet(
  'Responsible for database backups and system monitoring.',
  'b-vague-2',
  'Acme',
  false,
  false,
  'Responsible'
);
assert(vagueDuties.category === 'VAGUE_OWNERSHIP', 'Duties included should be VAGUE_OWNERSHIP');
assert(
  vagueDuties.feedback.includes('Shift focus from assigned duties to the specific features, systems, or solutions'),
  'Should provide duty-shift feedback'
);

const vagueAssisted = evaluateSingleBullet(
  'Assisted the team with building user onboarding components.',
  'b-vague-3',
  'Acme',
  false,
  false,
  'Assisted'
);
assert(
  vagueAssisted.feedback.includes('Clarify your individual ownership by stating which component'),
  'Should provide individual ownership feedback for assisted/helped'
);

// B. Weak Action Verb vs Domain
const weakVerbFrontend = evaluateSingleBullet(
  'User interface components in React with Tailwind CSS.',
  'b-weak-1',
  'Acme',
  false,
  false,
  'User'
);
assert(weakVerbFrontend.category === 'WEAK_ACTION_VERB', 'Should be WEAK_ACTION_VERB');
assert(
  weakVerbFrontend.feedback.includes('user interface or component delivered'),
  'Frontend bullet should receive frontend action verb advice'
);

const weakVerbDevOps = evaluateSingleBullet(
  'Docker containers deployed to Kubernetes clusters on AWS.',
  'b-weak-2',
  'Acme',
  false,
  false,
  'Docker'
);
assert(
  weakVerbDevOps.feedback.includes('infrastructure ownership'),
  'DevOps bullet should receive infrastructure action verb advice'
);

// C. Unclear Tech
const unclearTech = evaluateSingleBullet(
  'Engineered the system workflow to facilitate client communication across departments.',
  'b-tech-1',
  'Acme',
  false,
  true,
  'Engineered'
);
assert(unclearTech.category === 'UNCLEAR_TECH', 'Should be UNCLEAR_TECH when tech is absent');
assert(
  unclearTech.feedback.includes('Specify the key technologies, libraries, or architectural patterns'),
  'Should request concrete technologies'
);

// D. Missing Outcome / Conditional Metrics
const optimizationBullet = evaluateSingleBullet(
  'Optimized backend PostgreSQL queries and database indexing.',
  'b-outcome-1',
  'Acme',
  false,
  true,
  'Optimized'
);
assert(optimizationBullet.category === 'MISSING_OUTCOME', 'Should be MISSING_OUTCOME');
assert(
  optimizationBullet.feedback.includes('verified database performance outcome'),
  'Database optimization should suggest database-relevant outcome (query latency ms or record volume)'
);

const standardFeatureBullet = evaluateSingleBullet(
  'Architected a user authentication module using JWT tokens and Redis session storage.',
  'b-outcome-2',
  'Acme',
  false,
  true,
  'Architected'
);
assert(standardFeatureBullet.category === 'MISSING_OUTCOME', 'Should be MISSING_OUTCOME');
assert(
  standardFeatureBullet.feedback.includes('Clarify the operational impact or user adoption'),
  'Standard feature should NOT force fake metrics; prompt for operational impact or adoption'
);

console.log('✅ Passed: Specific advice correctly differentiated across categories and domains.\n');

// ─────────────────────────────────────────────────────────────────────────────
// Test 3: Never Invent Achievements or Fake Metrics
// ─────────────────────────────────────────────────────────────────────────────
console.log('--- Test 3: Zero Invention of Fictional Numbers & Metrics ---');

const testBullets = [
  'Engineered the checkout system in React and TypeScript.',
  'Deployed CI/CD pipelines using GitHub Actions and Terraform.',
  'Built REST APIs in Node.js and Express.',
  'Responsible for resolving bugs in the customer service portal.',
];

for (const text of testBullets) {
  const evaluated = evaluateSingleBullet(text, 't-id', 'Test', false, true, 'Engineered');
  // Check that no invented percentage or metric number is in feedback or rewrite
  assert(!/\b(?:\d+%(?!\))|\b\d+ms\b|\b\d+ users\b|\$\d+)/.test(evaluated.feedback),
    `Feedback must not contain invented numbers: ${evaluated.feedback}`);
  assert(!/\b(?:\d+%(?!\))|\b\d+ms\b|\b\d+ users\b|\$\d+)/.test(evaluated.suggestedRewrite),
    `Rewrite must not inject invented numbers: ${evaluated.suggestedRewrite}`);
}
console.log('✅ Passed: Zero fictional numbers, percentages, or achievements invented.\n');

// ─────────────────────────────────────────────────────────────────────────────
// Test 4: Deduplicate Recommendations & Preserve Affected Bullet References
// ─────────────────────────────────────────────────────────────────────────────
console.log('--- Test 4: Duplicate Recommendation Suppression & Reference Preservation ---');

const evaluatedList: EvaluatedBullet[] = [
  evaluateSingleBullet(
    'Assisted with developing frontend UI dashboard in React.',
    'bullet-1',
    'Frontend Role • TechCorp',
    false,
    false,
    'Assisted'
  ),
  evaluateSingleBullet(
    'Assisted with developing client profile page in React.',
    'bullet-2',
    'Frontend Role • TechCorp',
    false,
    false,
    'Assisted'
  ),
  evaluateSingleBullet(
    'Assisted with developing settings modal in React.',
    'bullet-3',
    'Project • Portfolio Site',
    false,
    false,
    'Assisted'
  ),
  evaluateSingleBullet(
    'Optimized backend API services in Go for payment processing.',
    'bullet-4',
    'Backend Role • Fintech',
    false,
    true,
    'Optimized'
  ),
  evaluateSingleBullet(
    'Optimized backend API microservice for order routing in Go.',
    'bullet-5',
    'Backend Role • Fintech',
    false,
    true,
    'Optimized'
  ),
];

const { recommendationGroups, summary } = buildRecommendationGroups(evaluatedList);

// We had 3 bullets with identical "assisted with" vague ownership feedback -> must merge into 1 group
const vagueGroup = recommendationGroups.find((g) => g.category === 'VAGUE_OWNERSHIP');
assert(Boolean(vagueGroup), 'Vague ownership group must exist');
assert(vagueGroup!.affectedBullets.length === 3, 'All 3 affected bullets must be grouped together');
assert(vagueGroup!.affectedBullets[0].id === 'bullet-1', 'Bullet 1 reference preserved');
assert(vagueGroup!.affectedBullets[1].id === 'bullet-2', 'Bullet 2 reference preserved');
assert(vagueGroup!.affectedBullets[2].id === 'bullet-3', 'Bullet 3 reference preserved');
assert(vagueGroup!.affectedBullets[0].context === 'Frontend Role • TechCorp', 'Context preserved');

// We had 2 backend optimization bullets missing outcomes -> must merge into 1 group
const outcomeGroup = recommendationGroups.find((g) => g.category === 'MISSING_OUTCOME');
assert(Boolean(outcomeGroup), 'Missing outcome group must exist');
assert(outcomeGroup!.affectedBullets.length === 2, 'Both backend bullets must be grouped together');
assert(outcomeGroup!.affectedBullets[0].id === 'bullet-4', 'Bullet 4 reference preserved');
assert(outcomeGroup!.affectedBullets[1].id === 'bullet-5', 'Bullet 5 reference preserved');

// Total unique recommendations should be 2, NOT 5!
assert(recommendationGroups.length === 2, `Expected 2 unique recommendation groups, got ${recommendationGroups.length}`);
assert(summary.uniqueRecommendationsCount === 2, 'Summary should report 2 unique recommendations');
assert(summary.bulletsEvaluated === 5, 'Summary should report 5 bullets evaluated');
assert(summary.bulletsWithIssues === 5, 'Summary should report 5 bullets with issues');
console.log('✅ Passed: Equivalent recommendations deduplicated and all affected bullet references preserved.\n');

// ─────────────────────────────────────────────────────────────────────────────
// Test 5: Summary Truthfulness & Safe Zero-Bullet Handling
// ─────────────────────────────────────────────────────────────────────────────
console.log('--- Test 5: Truthful Percentages & Zero-Bullet Safe Handling ---');

// Zero bullets resume
const zeroBulletResult = buildRecommendationGroups([]);
assert(zeroBulletResult.summary.bulletsEvaluated === 0, 'Zero bullets evaluated');
assert(zeroBulletResult.summary.bulletsWithIssues === 0, 'Zero bullets with issues');
assert(zeroBulletResult.summary.uniqueRecommendationsCount === 0, 'Zero unique recommendations');
assert(zeroBulletResult.summary.healthPercentage === 100, 'Safe 100% health for zero bullets');
assert(zeroBulletResult.summary.issuePercentage === 0, 'Safe 0% issue rate for zero bullets');
assert(!Number.isNaN(zeroBulletResult.summary.healthPercentage), 'Must not be NaN');
assert(!Number.isNaN(zeroBulletResult.summary.issuePercentage), 'Must not be NaN');

// Mixed resume with clean and issue bullets
const mixedList: EvaluatedBullet[] = [
  // 1 strong bullet
  evaluateSingleBullet(
    'Architected a distributed Redis caching layer in TypeScript, reducing p99 response times by 40%.',
    'b-clean',
    'Role',
    true,
    true,
    'Architected'
  ),
  // 1 bullet with weak verb
  evaluateSingleBullet(
    'Frontend interface in React and Tailwind CSS.',
    'b-weak',
    'Role',
    false,
    false,
    'Frontend'
  ),
  // 1 bullet with vague ownership
  evaluateSingleBullet(
    'Participated in daily standups and sprint planning.',
    'b-vague',
    'Role',
    false,
    false,
    'Participated'
  ),
  // 1 bullet with corruption
  evaluateSingleBullet(
    'Deployed cluster with \uFFFD replacement char',
    'b-corrupt',
    'Role',
    false,
    false,
    'Deployed'
  ),
];

const mixedResult = buildRecommendationGroups(mixedList);
assert(mixedResult.summary.bulletsEvaluated === 4, '4 bullets evaluated');
assert(mixedResult.summary.bulletsWithIssues === 3, '3 bullets with issues');
assert(mixedResult.summary.issueFreeBullets === 1, '1 issue free bullet');
// Health % = (1 / 4) * 100 = 25%
assert(mixedResult.summary.healthPercentage === 25, `Health should be 25%, got ${mixedResult.summary.healthPercentage}%`);
// Issue % = (3 / 4) * 100 = 75%
assert(mixedResult.summary.issuePercentage === 75, `Issue % should be 75%, got ${mixedResult.summary.issuePercentage}%`);
console.log('✅ Passed: Truthful denominator calculations and safe zero-bullet behavior.\n');

// ─────────────────────────────────────────────────────────────────────────────
// Test 6: End-to-End ATS Engine Integration
// ─────────────────────────────────────────────────────────────────────────────
console.log('--- Test 6: calculateAtsScore Integration & Pillar Score Invariant ---');

const resumeWithIssues = {
  personalInfo: {
    fullName: 'Alex Morgan',
    title: 'Senior Full Stack Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1-555-0199',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    portfolio: 'alexmorgan.dev',
  },
  summary: 'Experienced Full Stack Engineer with 5+ years specializing in scalable React and Node.js architectures.',
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2016',
      endDate: '2020',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      title: 'Full Stack Engineer',
      company: 'CloudScale Technologies',
      location: 'San Francisco, CA',
      startDate: '2021',
      endDate: 'Present',
      current: true,
      bullets: [
        'Assisted with developing frontend UI dashboard in React.',
        'Assisted with developing client profile page in React.',
        'Optimized backend API services in Go for payment processing.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Cloud Observability Tool',
      description: 'Distributed tracing dashboard',
      techStack: ['Go', 'React', 'Docker'],
      bullets: [
        'Optimized backend API microservice for order routing in Go.',
      ],
    },
  ],
  skills: {
    languages: ['TypeScript', 'JavaScript', 'Go', 'Python'],
    frameworks: ['React', 'Node.js', 'Express', 'Tailwind CSS'],
    databases: ['PostgreSQL', 'Redis'],
    cloudDevOps: ['Docker', 'AWS', 'CI/CD'],
    tools: ['Git', 'GitHub'],
  },
  certifications: [],
};

const atsResult = calculateAtsScore(resumeWithIssues as any);
assert(Boolean(atsResult.recommendationGroups), 'recommendationGroups should be present on AtsScoreResult');
assert(Boolean(atsResult.recommendationSummary), 'recommendationSummary should be present on AtsScoreResult');
assert(atsResult.recommendationSummary!.bulletsEvaluated === 4, 'Should evaluate 4 total bullets');
// 2 vague assisted bullets merged into 1 group + 2 backend optimization bullets merged into 1 group = 2 unique groups!
assert(
  atsResult.recommendationGroups!.length === 2,
  `Expected 2 deduplicated recommendation groups, got ${atsResult.recommendationGroups!.length}`
);

// Verify Authoritative 6-Pillar Score Invariant
const sumOfPillars =
  atsResult.breakdown.structureScore +
  atsResult.breakdown.completenessScore +
  atsResult.breakdown.extractabilityScore +
  atsResult.breakdown.skillsScore +
  atsResult.breakdown.experienceQualityScore +
  atsResult.breakdown.formattingScore;

assert(atsResult.totalScore === sumOfPillars, 'Authoritative ATS score must equal the exact sum of the 6 pillars');
console.log(`ATS Total Score: ${atsResult.totalScore}/100 (Exact sum of 6 pillars: ${sumOfPillars})`);
console.log('✅ Passed: calculateAtsScore produces grouped recommendations and preserves 6-pillar score invariant.\n');

console.log('🎉 ALL RECOMMENDATION QUALITY REGRESSION TESTS PASSED CLEANLY!');
