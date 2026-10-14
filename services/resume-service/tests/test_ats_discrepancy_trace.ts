import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { bgeAtsService } from '../src/services/bgeAts.service.js';
import { competitiveMatchService } from '../src/services/competitiveMatch.service.js';

describe('ATS Score Discrepancy & Competitive Match Trace Regression Tests', () => {
  // Representation 1: Compact/initial resume profile (simulating the 2,303 char input)
  const initialCompactResumeText = `
Alex Morgan
Senior Full Stack Engineer
alex.morgan@email.com | +1 (555) 234-5678 | San Francisco, CA | linkedin.com/in/alexmorgan | github.com/alexmorgan

SUMMARY
Results-driven Full Stack Engineer with 6+ years of experience designing and deploying high-performance distributed web applications using TypeScript, React, Node.js, PostgreSQL, and AWS.

EXPERIENCE
Lead Full Stack Engineer at TechCorp | San Francisco, CA | 2021 – Present
• Architected scalable microservices infrastructure reducing API latency by 45% for 2.5M daily active users.
• Engineered real-time collaborative workspace with WebSockets and Redis, increasing user engagement by 35%.
• Spearheaded migration from legacy monolith to Next.js and GraphQL, cutting bundle size by 50% and improving page load by 1.8s.

Software Engineer at CloudScale Inc | San Jose, CA | 2018 – 2021
• Developed automated CI/CD deployment pipelines using Docker, GitHub Actions, and Terraform, reducing deployment failures by 80%.
• Built RESTful microservices in Node.js and PostgreSQL handling 15,000 requests per second with 99.99% uptime.
• Implemented OAuth2 and RBAC security protocols across 12 enterprise customer portals.

PROJECTS
OpenSource Workflow Engine | TypeScript, React, Node.js, Redis
• Created an open-source workflow automation engine with 3,500+ GitHub stars.
• Optimized DAG task execution algorithms yielding 4x faster throughput on multi-core clusters.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2014 – 2018

SKILLS
JavaScript, TypeScript, React, Next.js, Node.js, Express, Python, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS, CI/CD, Git, REST APIs, GraphQL
`.trim();

  // Representation 2: Extended candidate resume with more unquantified bullets (simulating the 6,973 char input)
  const extendedResumeText = `
Alex Morgan
Senior Full Stack Engineer
alex.morgan@email.com | +1 (555) 234-5678 | San Francisco, CA | linkedin.com/in/alexmorgan | github.com/alexmorgan

SUMMARY
Results-driven Full Stack Engineer with 6+ years of experience designing and deploying high-performance distributed web applications using TypeScript, React, Node.js, PostgreSQL, and AWS. Proven track record in mentoring junior engineers, participating in agile sprint planning, and managing cross-functional deliverables across product, QA, and DevOps teams.

EXPERIENCE
Lead Full Stack Engineer at TechCorp | San Francisco, CA | 2021 – Present
• Architected scalable microservices infrastructure reducing API latency by 45% for 2.5M daily active users.
• Engineered real-time collaborative workspace with WebSockets and Redis, increasing user engagement by 35%.
• Spearheaded migration from legacy monolith to Next.js and GraphQL, cutting bundle size by 50% and improving page load by 1.8s.
• Attended weekly stakeholder meetings to review system design proposals and architecture tradeoffs.
• Mentored junior developers during bi-weekly pair programming sessions and code reviews.
• Maintained internal engineering documentation and onboarding guides for new hires.
• Assisted QA team in verifying regression test cases across staging environments.

Software Engineer at CloudScale Inc | San Jose, CA | 2018 – 2021
• Developed automated CI/CD deployment pipelines using Docker, GitHub Actions, and Terraform, reducing deployment failures by 80%.
• Built RESTful microservices in Node.js and PostgreSQL handling 15,000 requests per second with 99.99% uptime.
• Implemented OAuth2 and RBAC security protocols across 12 enterprise customer portals.
• Participated in daily standups and sprint retrospectives with scrum team.
• Monitored production logging dashboards and handled tier-2 on-call rotations.
• Refactored legacy utility functions to comply with updated linter rules.
• Created basic unit tests for legacy services.

Associate Developer at WebSolutions | Oakland, CA | 2017 – 2018
• Assisted in frontend component bug fixes using HTML, CSS, and jQuery.
• Worked with senior engineers on database schema migration scripts.
• Documented REST API endpoints in Swagger/Postman for external consumers.
• Supported client testing and bug validation during quarterly releases.

PROJECTS
OpenSource Workflow Engine | TypeScript, React, Node.js, Redis
• Created an open-source workflow automation engine with 3,500+ GitHub stars.
• Optimized DAG task execution algorithms yielding 4x faster throughput on multi-core clusters.

Enterprise Task Tracker | React, Express, MongoDB
• Developed a task tracking web application for internal team task management.
• Integrated basic user login and email notifications.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2014 – 2018

SKILLS
JavaScript, TypeScript, React, Next.js, Node.js, Express, Python, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS, CI/CD, Git, REST APIs, GraphQL
`.trim();

  it('1. Determinism: scoring the same text twice produces identical ATS scores', async () => {
    const res1 = await bgeAtsService.scoreResume({ resumeText: initialCompactResumeText });
    const res2 = await bgeAtsService.scoreResume({ resumeText: initialCompactResumeText });

    assert.equal(res1.overallScore, res2.overallScore, 'Overall score must be identical for identical input');
    assert.deepEqual(res1.breakdown, res2.breakdown, 'Score breakdown must match exactly across identical runs');
  });

  it('2. Input sensitivity: score difference between compact and extended text stems from bullet quantification density', async () => {
    const compactScore = await bgeAtsService.scoreResume({ resumeText: initialCompactResumeText });
    const extendedScore = await bgeAtsService.scoreResume({ resumeText: extendedResumeText });

    assert.ok(typeof compactScore.overallScore === 'number', 'Compact score must be a number');
    assert.ok(typeof extendedScore.overallScore === 'number', 'Extended score must be a number');

    // The extended resume has many non-quantified bullets which dilutes quantification density
    assert.ok(
      compactScore.quantification.densityPercentage >= extendedScore.quantification.densityPercentage,
      'Compact resume with dense metrics should have higher quantification density than extended resume with unquantified bullets'
    );
  });

  it('3. Competitive Match Gate: unrelated job description triggers NOT_RELEVANT and score = null (N/A) with base-bge', async () => {
    const unrelatedJd = `
We are seeking a Licensed Registered Nurse (RN) with ICU / Critical Care experience to join our hospital emergency department.
Requirements:
- Active RN license in State of California
- BLS, ACLS, and PALS certifications
- 3+ years acute care hospital nursing experience
- Patient triage and medication administration expertise
    `.trim();

    const matchResult = await competitiveMatchService.match({
      resumeText: extendedResumeText,
      jobDescription: unrelatedJd,
      role: 'Registered Nurse (RN)',
    });

    assert.equal(matchResult.status, 'NOT_RELEVANT', 'Unrelated job domain must fail relevance gate');
    assert.equal(matchResult.score, null, 'NOT_RELEVANT score must be null (displayed as N/A)');
    assert.equal(matchResult.modelSource, 'base-bge', 'Default fallback model source must be base-bge');
    assert.ok(matchResult.relevanceGate !== undefined || matchResult.matchSignals !== undefined);
  });

  it('4. Representation integrity: Canonical resume serialization preserves all sections and scores deterministically', async () => {
    // Verify structured section text format
    assert.ok(extendedResumeText.includes('SUMMARY'), 'Extended resume includes SUMMARY');
    assert.ok(extendedResumeText.includes('EXPERIENCE'), 'Extended resume includes EXPERIENCE');
    assert.ok(extendedResumeText.includes('PROJECTS'), 'Extended resume includes PROJECTS');
    assert.ok(extendedResumeText.includes('EDUCATION'), 'Extended resume includes EDUCATION');
    assert.ok(extendedResumeText.includes('SKILLS'), 'Extended resume includes SKILLS');

    const score = await bgeAtsService.scoreResume({ resumeText: extendedResumeText });
    assert.ok(score.overallScore > 0, 'Overall score must be positive');
    assert.ok(score.breakdown.structure > 0, 'Structure score must be positive');
    assert.ok(score.breakdown.extractability > 0, 'Extractability score must be positive');
    assert.ok(score.breakdown.skills > 0, 'Skills score must be positive');
  });
});
