import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { structuredResumeMapperService } from '../src/services/structuredResumeMapper.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
  console.log('--- Testing Student Resume Regression (Synthetic Fixture) ---');
  const fixturePath = path.resolve(__dirname, 'fixtures/jaswanth_docling_utf8.json');
  const fixtureRaw = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
  const doclingData = fixtureRaw.data;
  
  assert.ok(doclingData.character_count > 3000, `Docling extracted ${doclingData.character_count} chars`);
  assert.ok(doclingData.structured_elements.length >= 50, `Extracted ${doclingData.structured_elements.length} elements`);

  const resume = structuredResumeMapperService.mapDoclingToStructuredResume(doclingData);

  // 1. Personal Info
  assert.strictEqual(resume.personalInfo.fullName, 'ALEX MORGAN');
  assert.strictEqual(resume.personalInfo.email, 'alex.morgan@example.com');
  assert.ok(resume.personalInfo.phone.includes('234-5678'), `Phone ${resume.personalInfo.phone}`);
  assert.strictEqual(resume.personalInfo.linkedin, 'https://linkedin.com/in/alexmorgan-dev');
  assert.strictEqual(resume.personalInfo.github, 'https://github.com/alexmorgan-tech');

  // 2. Summary
  assert.ok(resume.summary.includes('Computer Science undergraduate'), 'Summary preserved');
  assert.ok(resume.summary.includes('Vibeathon 2025'), 'Summary contains hackathon mention');

  // 3. Experience (1 Internship entry, 6 bullets)
  assert.strictEqual(resume.experience.length, 1, `Expected 1 experience entry, got ${resume.experience.length}`);
  const exp = resume.experience[0];
  assert.strictEqual(exp.title, 'AI Frontend Developer Intern');
  assert.strictEqual(exp.company, 'EnviGuide');
  assert.strictEqual(exp.location, 'Hyderabad');
  assert.strictEqual(exp.startDate, 'Jan 2026');
  assert.strictEqual(exp.endDate, 'Mar 2026');
  assert.strictEqual(exp.bullets.length, 6, `Expected 6 bullets, got ${exp.bullets.length}`);
  assert.ok(exp.bullets[0].includes('Developed AI-driven frontend interfaces'), 'Bullet 0');
  assert.ok(exp.bullets[5].includes('agile sprint cycles'), 'Bullet 5');

  // 4. Education (3 distinct entries)
  assert.strictEqual(resume.education.length, 3, `Expected 3 education entries, got ${resume.education.length}`);
  const [btech, inter, ssc] = resume.education;
  assert.ok(btech.degree.includes('Bachelor of Technology'), `Degree: ${btech.degree}`);
  assert.ok(btech.school.includes('Vidya Jyothi Institute'), `School: ${btech.school}`);
  assert.strictEqual(btech.gpa, '8.76 / 10');

  assert.ok(inter.degree.includes('Intermediate'), `Degree: ${inter.degree}`);
  assert.ok(inter.school.includes('Narayana Junior College'), `School: ${inter.school}`);
  assert.strictEqual(inter.gpa, '94.8%');

  assert.ok(ssc.degree.includes('Secondary School Certificate') || ssc.degree.includes('SSC'), `Degree: ${ssc.degree}`);
  assert.ok(ssc.school.includes('ZPHS Nagole'), `School: ${ssc.school}`);
  assert.strictEqual(ssc.gpa, '93.0%');

  // 5. Projects (1 entry, 4 tech items, 4 bullets, no false liveUrl)
  assert.strictEqual(resume.projects.length, 1, `Expected 1 project, got ${resume.projects.length}`);
  const proj = resume.projects[0];
  assert.ok(proj.name.includes('AlgoScope'), `Name: ${proj.name}`);
  assert.strictEqual(proj.liveUrl, '', 'React.js should not be captured as liveUrl');
  assert.ok(proj.repoUrl.includes('AlgoScope'), `Repo: ${proj.repoUrl}`);
  assert.strictEqual(proj.bullets.length, 4, `Expected 4 bullets, got ${proj.bullets.length}`);
  assert.ok(proj.techStack.includes('React'), 'Tech: React');
  assert.ok(proj.techStack.includes('JavaScript'), 'Tech: JavaScript');
  assert.ok(proj.techStack.includes('Canvas API'), 'Tech: Canvas API');
  assert.ok(proj.techStack.includes('Vercel'), 'Tech: Vercel');

  // 6. Skills (Categorized accurately)
  assert.ok(resume.skills.languages.includes('Python'), 'Skills languages');
  assert.ok(resume.skills.languages.includes('TypeScript'), 'Skills languages');
  assert.ok(resume.skills.frameworks.includes('React'), 'Skills frameworks');
  assert.ok(resume.skills.frameworks.includes('Node.js'), 'Skills frameworks');
  assert.ok(resume.skills.databases.includes('MongoDB'), 'Skills databases');
  assert.ok(resume.skills.databases.includes('PostgreSQL'), 'Skills databases');
  assert.ok(resume.skills.cloudDevOps.includes('Vercel'), 'Skills cloudDevOps');
  assert.ok(resume.skills.tools.includes('Git'), 'Skills tools');
  assert.ok(resume.skills.other.some((s) => s.includes('RESTful APIs') || s.includes('Data Structures')), 'Skills other');

  // 7. Spoken Languages
  assert.deepStrictEqual(resume.languages.sort(), ['English', 'Hindi', 'Telugu'].sort());

  // 8. Hobbies
  assert.ok(resume.hobbies.length >= 1, `Hobbies: ${resume.hobbies.length}`);
  assert.ok(resume.hobbies.some((h) => h.includes('Coding and building')), 'Hobby coding');

  // 9. Achievements & Activities
  assert.ok(resume.achievements.length >= 6, `Achievements: ${resume.achievements.length}`);
  assert.ok(resume.achievements.some((a) => a.includes('36 hours') || a.includes('top 10')), 'Top 10 hackathon');

  // 10. Custom Sections (CORE STRENGTHS, DECLARATION)
  const coreStrengths = resume.customSections.find((s) => /core\s+strengths/i.test(s.title));
  assert.ok(coreStrengths, 'Core Strengths custom section preserved');
  assert.strictEqual(coreStrengths.items.length, 3, `Core strengths items: ${coreStrengths.items.length}`);

  const declaration = resume.customSections.find((s) => /declaration/i.test(s.title));
  assert.ok(declaration, 'Declaration custom section preserved');
  assert.ok(declaration.items.some((i) => i.includes('authenticity of the details')), 'Declaration text');

  console.log('PASS: All assertions verified for Student Resume Regression!');
}

runTest().catch((err) => {
  console.error('FAIL:', err);
  process.exit(1);
});
