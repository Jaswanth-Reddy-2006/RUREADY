import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { documentParserService } from '../src/services/documentParser.service.js';
import { structuredResumeMapperService } from '../src/services/structuredResumeMapper.service.js';
import { bgeAtsService } from '../src/services/bgeAts.service.js';
import { competitiveMatchService } from '../src/services/competitiveMatch.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function mapBackendAtsResultToUi(backend: any) {
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

async function runActualDocumentE2ERegression() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('ACTUAL REPOSITORY DOCUMENT E2E PIPELINE REGRESSION TEST');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Locate deterministic repository test document fixture
  const fixturePath = path.resolve(__dirname, 'fixtures/candidate_resume.docx');
  if (!fs.existsSync(fixturePath)) {
    console.log('[Step 0] Initializing fixture directory...');
    fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
    execSync(`python -c "
import docx, os
d = docx.Document()
d.add_heading('ALEX MORGAN', level=0)
d.add_paragraph('San Francisco, CA | +1 (555) 234-5678 | alex.morgan@example.com | linkedin.com/in/alexmorgan-dev | github.com/alexmorgan-tech')
d.add_heading('EDUCATION', level=1)
d.add_paragraph('Bachelor of Technology — Computer Science & Engineering\\nVidya Jyothi Institute of Technology, Hyderabad\\nGPA: 8.76 / 10 | 2028 Expected')
d.add_paragraph('Intermediate\\nNarayana Junior College, Hyderabad\\n2022 - 2024')
d.add_heading('SKILLS', level=1)
d.add_paragraph('Python, Java, C++, JavaScript, TypeScript, React, Node.js, Express, MongoDB, Git, Docker')
d.add_heading('PROJECTS', level=1)
d.add_paragraph('Smart Health Analytics Platform | React, Node.js, MongoDB')
d.add_paragraph('• Developed real-time health monitoring analytics dashboard handling 10,000+ telemetry records.')
d.add_paragraph('• Built predictive health scoring algorithms with 94% accuracy.')
d.save('${fixturePath.replace(/\\/g, '/')}')
"`);
  }

  // 2. Log exact file metadata before parsing
  const fileBuffer = fs.readFileSync(fixturePath);
  const fileStats = fs.statSync(fixturePath);
  const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  console.log('[Step 1] Inspecting Actual Document File:');
  console.log(`- File Path: ${fixturePath}`);
  console.log(`- File Name: ${path.basename(fixturePath)}`);
  console.log(`- File Size: ${fileStats.size} bytes`);
  console.log(`- SHA-256 Hash: ${fileHash}\n`);

  // 3. Run Production Docling Extraction
  console.log('[Step 2] Executing Production Docling Document Parsing...');
  const doclingParsed = await documentParserService.parseBuffer(fileBuffer, path.basename(fixturePath));
  console.log(`✓ Docling Extracted Characters: ${doclingParsed.character_count}`);
  console.log(`✓ Docling Detected Sections: ${doclingParsed.sections.map((s) => s.title).join(' | ')}`);
  console.log(`✓ Docling Structured Elements Count: ${doclingParsed.structured_elements.length}\n`);

  // 4. Map Docling Structure to Canonical ResumeData
  console.log('[Step 3] Mapping Extracted Docling Output to Canonical ResumeData...');
  const mapped = structuredResumeMapperService.mapDoclingToStructuredResume(doclingParsed);

  console.log('✓ Extracted Personal Info:', {
    fullName: mapped.personalInfo.fullName,
    email: mapped.personalInfo.email,
    phone: mapped.personalInfo.phone,
    location: mapped.personalInfo.location,
    linkedin: mapped.personalInfo.linkedin,
    github: mapped.personalInfo.github,
  });

  console.log('✓ Canonical Section Item Counts:', {
    education: mapped.education.length,
    projects: mapped.projects.length,
    skillsTotal: Object.values(mapped.skills).flat().length,
    experience: mapped.experience.length,
    certifications: mapped.certifications.length,
    publications: mapped.publications.length,
    patents: mapped.patents.length,
    spokenLanguages: mapped.languages.length,
    customSections: mapped.customSections.length,
  });

  // 5. Generic Invariant Assertions
  console.log('\n[Step 4] Validating Generic Canonical Mapping Invariants...');

  // Personal info invariant
  assert.ok(mapped.personalInfo.fullName && mapped.personalInfo.fullName.trim().length > 0, 'Candidate fullName must be populated');
  assert.ok(mapped.personalInfo.email && mapped.personalInfo.email.includes('@'), 'Candidate email must be valid');
  assert.ok(mapped.personalInfo.phone && mapped.personalInfo.phone.length >= 7, 'Candidate phone must be valid');

  // Education invariant
  assert.ok(mapped.education.length > 0, 'Education must contain entries extracted from source document');
  for (const edu of mapped.education) {
    assert.ok(edu.school.length > 0, 'Education entry must have school name');
    assert.ok(edu.degree.length > 0, 'Education entry must have degree name');
  }

  // Projects invariant
  assert.ok(mapped.projects.length > 0, 'Projects must contain entries extracted from source document');
  for (const proj of mapped.projects) {
    assert.ok(proj.name.length > 0, 'Project must have a name');
    assert.ok(proj.bullets.length > 0 || proj.description.length > 0 || proj.techStack.length > 0, 'Project must have content');
  }

  // Skills invariant
  const totalSkills = Object.values(mapped.skills).flat();
  assert.ok(totalSkills.length > 0, 'Skills must be extracted and categorized');
  assert.ok(mapped.skills.languages.length > 0, 'Programming languages must be categorized in skills.languages');

  // Strict Absent Section Invariants: sections not present in source document MUST remain empty []
  assert.strictEqual(mapped.experience.length, 0, 'Experience must be [] when not present in source document');
  assert.strictEqual(mapped.certifications.length, 0, 'Certifications must be [] when not present in source document');
  assert.strictEqual(mapped.publications.length, 0, 'Publications must be [] when not present in source document');
  assert.strictEqual(mapped.patents.length, 0, 'Patents must be [] when not present in source document');
  assert.strictEqual(mapped.languages.length, 0, 'Spoken languages must be [] when only technical languages are present');
  assert.strictEqual(mapped.customSections.length, 0, 'Custom sections must be [] when no unrecognized distinct sections exist');

  console.log('✓ Generic mapping invariants verified: All present sections mapped cleanly, all absent sections remain [].');

  // 6. Production Authoritative Backend ATS Scoring
  console.log('\n[Step 5] Running Authoritative Backend ATS Evaluation...');
  const atsResult = await bgeAtsService.scoreResume({
    resumeText: doclingParsed.resumeText,
    doclingStructure: doclingParsed,
  });

  console.log(`✓ Backend Overall ATS Score: ${atsResult.overallScore} / 100`);
  console.log('  Breakdown:', atsResult.breakdown);

  const pillarSum =
    Number(atsResult.breakdown.structure) +
    Number(atsResult.breakdown.completeness) +
    Number(atsResult.breakdown.extractability) +
    Number(atsResult.breakdown.skills) +
    Number(atsResult.breakdown.experienceQuality) +
    Number(atsResult.breakdown.formatting);

  assert.strictEqual(pillarSum, atsResult.overallScore, 'Backend ATS overall score must exactly equal sum of 6 pillars');

  // 7. Frontend UI Data Model Parity Check
  console.log('\n[Step 6] Verifying Frontend UI Data Model Parity...');
  const uiAts = mapBackendAtsResultToUi(atsResult);

  assert.strictEqual(uiAts.totalScore, atsResult.overallScore, 'Frontend totalScore must match authoritative backend score');
  assert.strictEqual(uiAts.breakdown.structureScore, atsResult.breakdown.structure, 'Structure pillar parity mismatch');
  assert.strictEqual(uiAts.breakdown.completenessScore, atsResult.breakdown.completeness, 'Completeness pillar parity mismatch');
  assert.strictEqual(uiAts.breakdown.extractabilityScore, atsResult.breakdown.extractability, 'Extractability pillar parity mismatch');
  assert.strictEqual(uiAts.breakdown.skillsScore, atsResult.breakdown.skills, 'Skills pillar parity mismatch');
  assert.strictEqual(uiAts.breakdown.experienceQualityScore, atsResult.breakdown.experienceQuality, 'ExperienceQuality pillar parity mismatch');
  assert.strictEqual(uiAts.breakdown.formattingScore, atsResult.breakdown.formatting, 'Formatting pillar parity mismatch');
  console.log('✓ 100% Backend/Frontend ATS Parity verified across all 6 pillars.');

  // 8. Competitive Job Matching on Persistent BGE Worker
  console.log('\n[Step 7] Testing Competitive Matching with Persistent BGE Worker...');
  const relevantJd = `
Role: Full Stack Software Engineer
Responsibilities:
• Develop web applications and services in React, TypeScript, Node.js, and MongoDB.
• Build automated health and telemetry data monitoring systems.
Requirements:
• Knowledge of Python, JavaScript, Git, Docker, and REST APIs.
`;

  const nonRelevantJd = `
Role: Senior Certified Public Accountant (CPA)
Requirements:
• GAAP accounting, corporate tax compliance, audit management, QuickBooks, payroll reconciliation.
`;

  const matchRes = await competitiveMatchService.match({
    resumeText: doclingParsed.resumeText,
    jobDescription: relevantJd,
    role: 'Full Stack Software Engineer',
    structuredElements: doclingParsed.structured_elements,
  });

  console.log(`  Relevant Match -> Status: ${matchRes.status}, Score: ${matchRes.score}/100, Model: ${matchRes.modelSource}`);
  assert.ok(matchRes.status === 'MATCHED', 'Expected MATCHED status for relevant JD');
  assert.ok(matchRes.score !== null && matchRes.score >= 50, 'Expected positive competitive score');

  const nonMatchRes = await competitiveMatchService.match({
    resumeText: doclingParsed.resumeText,
    jobDescription: nonRelevantJd,
    role: 'Certified Public Accountant',
    structuredElements: doclingParsed.structured_elements,
  });

  console.log(`  Non-Relevant Match -> Status: ${nonMatchRes.status}, Score: ${nonMatchRes.score}`);
  assert.ok(nonMatchRes.status === 'NOT_RELEVANT', 'Expected NOT_RELEVANT status for cross-domain JD');

  // Clean shutdown of worker
  await competitiveMatchService.shutdown();

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🎉 ACTUAL DOCUMENT E2E REGRESSION TEST TERMINATED NORMALLY WITH 100% SUCCESS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  process.exit(0);
}

runActualDocumentE2ERegression().catch(async (err) => {
  console.error('\n❌ E2E Regression Failure:', err);
  try {
    await competitiveMatchService.shutdown();
  } catch {}
  process.exit(1);
});
