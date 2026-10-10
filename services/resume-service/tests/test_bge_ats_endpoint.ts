import { bgeAtsService } from '../src/services/bgeAts.service.js';

async function runTest() {
  console.log('--- Testing Role-Independent ATS Scoring Engine on Synthetic Student Resume ---');
  
  const studentResume = `
ALEX MORGAN
San Francisco, CA | +1 (555) 234-5678 | alex.morgan@example.com
linkedin.com/in/alexmorgan-dev | github.com/alexmorgan-tech

EDUCATION
Bachelor of Technology — Computer Science & Engineering
Vidya Jyothi Institute of Technology, Hyderabad
GPA: 8.76 / 10 | 2028 Expected

Intermediate
Narayana Junior College, Hyderabad
2022 - 2024

SKILLS
Python, Java, C++, JavaScript, TypeScript, React, Node.js, Express, MongoDB, Git, Docker

PROJECTS
Smart Health Analytics Platform | React, Node.js, MongoDB
• Developed real-time health monitoring analytics dashboard handling 10,000+ telemetry records.
• Built predictive health scoring algorithms with 94% accuracy.
`;

  try {
    const result = await bgeAtsService.scoreResume({
      resumeText: studentResume,
    });

    console.log(`\nModel: ${result.model}`);
    console.log(`Overall ATS Score: ${result.overallScore} / 100`);
    console.log('\nBreakdown:');
    console.log(`  Structure: ${result.breakdown.structure} / 20`);
    console.log(`  Content Completeness: ${result.breakdown.completeness} / 20`);
    console.log(`  Extractability: ${result.breakdown.extractability} / 20`);
    console.log(`  Skills & Technical Content: ${result.breakdown.skills} / 15`);
    console.log(`  Experience Quality: ${result.breakdown.experienceQuality} / 15`);
    console.log(`  Formatting: ${result.breakdown.formatting} / 10`);

    const sum = Object.values(result.breakdown).reduce((a, b) => a + b, 0);
    console.log(`\nExact Breakdown Sum: ${sum} / 100`);

    if (sum !== result.overallScore) {
      throw new Error(`Score mismatch: sum=${sum}, overall=${result.overallScore}`);
    }

    console.log(`\nExtracted Skills (${result.extractedSkills.length}):`, result.extractedSkills.join(', '));
    console.log(`Strengths (${result.strengths.length}):`, result.strengths);
    console.log(`Improvements (${result.improvements.length}):`, result.improvements);
    console.log(`Bullet Audits (${result.bulletAudits.length}):`, result.bulletAudits);

    // Strict validation assertions
    if (result.bulletAudits.some(b => b.original.includes('Hyderabad') || b.original.includes('Vidya') || b.original.includes('8.76') || b.original.includes('94.8%'))) {
      throw new Error('FAIL: Contact or Education items received quantification suggestions!');
    }

    console.log('\nAll role-independent ATS verification tests PASSED successfully!');
  } catch (err: any) {
    console.error('Test FAILED:', err);
    process.exit(1);
  }
}

runTest();
