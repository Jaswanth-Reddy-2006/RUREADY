import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { structuredResumeMapperService } from '../src/services/structuredResumeMapper.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTruthfulnessRegression() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('TRUTHFULNESS & EXTRACTION DEFECT REGRESSION SUITE');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const fixturePath = path.resolve(__dirname, 'fixtures/design_resume_docling.json');
  assert.ok(fs.existsSync(fixturePath), `Fixture exists at ${fixturePath}`);
  const doclingData = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));

  const resume = structuredResumeMapperService.mapDoclingToStructuredResume(doclingData);

  // 1. Defect 2 Verification: Candidate Preamble & Contacts Not Absorbed into Custom Sections
  console.log('[Check 1] Validating Candidate Personal Info Extraction...');
  assert.strictEqual(resume.personalInfo.fullName, 'SAM KALE', 'Candidate Name');
  assert.strictEqual(resume.personalInfo.title, 'UI/UX & PRODUCT DESIGNER', 'Candidate Title');
  assert.strictEqual(resume.personalInfo.email, 'sam.kale@example.com', 'Candidate Email from mailto: hyperlink');
  assert.strictEqual(resume.personalInfo.location, 'Hyderabad, India', 'Candidate Location from header block');
  assert.ok(resume.personalInfo.phone.includes('98765 43210'), `Phone formatting: ${resume.personalInfo.phone}`);
  assert.ok(resume.personalInfo.linkedin.includes('linkedin.com/in/samkale-design'), 'LinkedIn URL');
  assert.ok(resume.personalInfo.portfolio.includes('notion.site'), 'Portfolio URL');
  console.log('✓ Candidate personal info passed 100% of assertions.');

  // 2. Summary
  console.log('\n[Check 2] Validating Professional Summary...');
  assert.ok(resume.summary.includes('UI/UX Designer focused on simplifying complex digital experiences'), 'Summary content');
  console.log('✓ Summary extracted cleanly without leakage.');

  // 3. Experience & Education
  console.log('\n[Check 3] Validating Experience and Education Structure...');
  assert.strictEqual(resume.experience.length, 1, 'Expected 1 experience entry');
  assert.strictEqual(resume.experience[0].title, 'Graphic Design Intern', 'Experience title');
  assert.strictEqual(resume.experience[0].bullets.length, 3, 'Experience bullets count');
  assert.strictEqual(resume.education.length, 1, 'Expected 1 education entry');
  assert.strictEqual(resume.education[0].school, 'Vidya Jyothi Institute of Technology', 'Education school');
  assert.strictEqual(resume.education[0].degree, 'B.Tech, Computer Science', 'Education degree');
  console.log('✓ Experience and Education extracted cleanly.');

  // 4. Defect 1 Verification: Projects (Case Studies) Not Lost to Custom Sections
  console.log('\n[Check 4] Validating Case Studies as Canonical Projects...');
  assert.strictEqual(resume.projects.length, 4, `Expected exactly 4 projects, got ${resume.projects.length}`);
  
  const p0 = resume.projects[0];
  assert.strictEqual(p0.name, 'Replit Landing Page Redesign', 'Project 0 Name');
  assert.strictEqual(p0.bullets.length, 3, 'Project 0 Bullets');
  assert.ok(p0.bullets[2].includes('single prompt-first interaction'), 'Project 0 description bullet');

  const p1 = resume.projects[1];
  assert.strictEqual(p1.name, 'Bolt Homepage Redesign', 'Project 1 Name');
  assert.strictEqual(p1.bullets.length, 3, 'Project 1 Bullets');
  assert.ok(p1.bullets[2].includes('CTA hierarchy'), 'Project 1 description bullet');

  const p2 = resume.projects[2];
  assert.strictEqual(p2.name, 'Food Delivery App', 'Project 2 Name');
  assert.strictEqual(p2.bullets.length, 3, 'Project 2 Bullets');
  assert.ok(p2.bullets[2].includes('intent-based filters'), 'Project 2 description bullet');

  const p3 = resume.projects[3];
  assert.strictEqual(p3.name, 'NestWay Marketing Flyer', 'Project 3 Name');
  assert.strictEqual(p3.bullets.length, 3, 'Project 3 Bullets');
  assert.ok(p3.bullets[2].includes('marketing collateral'), 'Project 3 description bullet');
  console.log('✓ All 4 case studies correctly mapped to canonical projects with 100% of bullets.');

  // 5. Defect 3 & 5 Verification: Tools Section & Compound Skill Soft-Wrap Repair
  console.log('\n[Check 5] Validating Tools Categorization & Soft-Wrap Token Repair...');
  const tools = resume.skills.tools;
  assert.ok(tools.includes('Figma'), 'Tools contains Figma');
  assert.ok(tools.includes('FigJam'), 'Tools contains FigJam');
  assert.ok(tools.includes('Canva'), 'Tools contains Canva');
  assert.ok(tools.includes('Prototyping'), 'Tools contains Prototyping');
  assert.ok(tools.includes('Wireframing'), 'Tools contains Wireframing');
  assert.ok(tools.includes('Auto Layout'), 'Tools contains Auto Layout');
  
  // Ensure Auto and Layout are NOT split as separate fragments in other
  assert.strictEqual(resume.skills.other.includes('Auto'), false, 'Auto must not be a separate fragment');
  assert.strictEqual(resume.skills.other.includes('Layout'), false, 'Layout must not be a separate fragment');
  console.log('✓ Tools properly categorized; "Auto Layout" soft-wrap cleanly repaired.');

  // 6. Defect 2 Invariant: No Orphan Custom Sections Created
  console.log('\n[Check 6] Validating Zero Orphan Custom Sections...');
  assert.strictEqual(resume.customSections.length, 0, `Expected 0 custom sections, got ${resume.customSections.length}`);
  console.log('✓ Zero orphan custom sections created.');

  // 7. Spoken Languages
  console.log('\n[Check 7] Validating Spoken Languages Disambiguation...');
  assert.deepStrictEqual(resume.languages.sort(), ['English', 'Hindi', 'Telugu'].sort(), 'Spoken languages');
  console.log('✓ Spoken languages accurately parsed.');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🎉 ALL TRUTHFULNESS & EXTRACTION REGRESSION CHECKS PASSED (100%)');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

runTruthfulnessRegression().catch((err) => {
  console.error('FAIL:', err);
  process.exit(1);
});
