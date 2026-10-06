import { bgeAtsService } from '../src/services/bgeAts.service.js';

async function runDifferentiationTests() {
  console.log('================================================================');
  console.log('ATS SCORING ENGINE: MULTI-RESUME SCORE DIFFERENTIATION TEST');
  console.log('================================================================\n');

  // 1. Weak / Bare-bones Resume
  const weakResume = `
John
john@test.com

Work
did various tasks and helped with stuff
responsible for making pages

Skills
coding
`;

  // 2. Average Student Resume (Unquantified, basic structure)
  const averageResume = `
Alex Johnson
alex.j@email.com | 555-019-2834 | New York, NY

EDUCATION
Bachelor of Science in Computer Science
City College of New York
2020 - 2024

SKILLS
JavaScript, Python, React, HTML, CSS, Git

EXPERIENCE
Junior Web Developer | TechSolutions | 2023 - 2024
• Responsible for building user interface components.
• Worked on bug fixing and code maintenance.
• Assisted senior developers with frontend feature rollouts.

PROJECTS
Recipe Finder Web App
• Built recipe search website using React and JavaScript.
• Implemented user login and favorite recipe storage.
`;

  // 3. High-Quality Concise Student Resume (Jaswanth Reddy)
  const jaswanthResume = `
JASWANTH REDDY
Hyderabad, Telangana, India | +91 8008154808 | jaswanthre9@gmail.com
linkedin.com/in/jasreaug | github.com/Jaswanth-Reddy-2006

EDUCATION
Bachelor of Technology — Computer Science & Engineering
Vidya Jyothi Institute of Technology, Hyderabad
GPA: 8.76 / 10 | 2028 Expected

Intermediate
Narayana Junior College, Hyderabad
2022 - 2024

SKILLS
Languages: Python, Java, C++, JavaScript, TypeScript
Frameworks & Databases: React, Node.js, Express.js, MongoDB
Developer Tools: Git, Docker

PROJECTS
Smart Health Analytics Platform | React, Node.js, MongoDB
• Developed real-time health monitoring analytics dashboard handling 10,000+ telemetry records.
• Built predictive health scoring algorithms with 94% accuracy.
`;

  // 4. Senior Staff Engineer Resume (Top-Tier, Extensively Quantified & Categorized)
  const seniorResume = `
Dr. Sarah Jenkins
sarah.jenkins@techleads.io | +1 (415) 555-8920 | San Francisco, CA
linkedin.com/in/sarahjenkins | github.com/sjenkins-cloud

PROFESSIONAL SUMMARY
Principal Distributed Systems Engineer with 9+ years of expertise architecting high-throughput microservices, Kubernetes platforms, and real-time streaming architectures.

EXPERIENCE
Staff Infrastructure Engineer | Stripe | May 2021 – Present
• Architected global distributed payment routing engine using Go, Python, and Apache Kafka, scaling transaction throughput by 350% to sustain 65M daily API calls.
• Reduced P99 latency by 48% (from 280ms to 145ms) by deploying Redis cluster caching and tuning PostgreSQL query execution plans.
• Spearheaded zero-downtime multi-region Kubernetes migration across 4 AWS availability zones.

Senior Software Engineer | Uber | Jan 2018 – Apr 2021
• Engineered real-time driver dispatch matching system handling 120,000 requests/sec with 99.99% uptime.
• Automated end-to-end CI/CD deployment pipelines using GitHub Actions and Terraform, reducing deployment cycle times from 45 minutes to 7 minutes.

EDUCATION
Master of Science in Computer Science | Stanford University | 2017
Bachelor of Science in Electrical Engineering | UC Berkeley | 2015

SKILLS
Languages: Go, Python, TypeScript, Java, SQL
Frameworks & Cloud: FastAPI, Spring Boot, React, AWS, Docker, Kubernetes, Apache Kafka, Terraform
Databases: PostgreSQL, Redis, DynamoDB, MongoDB
`;

  // 5. Bloated & Repetitive Resume (Generic Duties & Filler Phrases)
  const bloatedResume = `
Bob Smith
bob@genericmail.com | 111-222-3333

SUMMARY
Hard working individual with strong work ethic seeking software role.

EXPERIENCE
Developer | OldCompany | 2021 - 2023
• Responsible for daily duties as assigned by project manager.
• Duties included attending meetings and discussing project tasks.
• Worked on various tasks relating to internal web development.
• Assisted team with daily bug fixing and maintenance chores.
• Handled tasks and general duties as required by team lead.
• Participated in daily standup calls and took notes.
• Did work on frontend and backend pages.
• Worked with team on website features and general coding.

EDUCATION
College of Tech | 2020

SKILLS
coding, computers, javascript, react, html, css
`;

  // 6. Non-Software Domain Resume (Digital Marketing & Analytics Lead)
  const marketingResume = `
Elena Rostova
elena.rostova@growthmarketing.com | +1 (212) 555-7341 | New York, NY
linkedin.com/in/elenarostova | elenarostova.portfolio.com

PROFESSIONAL SUMMARY
Performance Marketing Lead with 6+ years driving customer acquisition, multi-channel growth campaigns, and data analytics.

EXPERIENCE
Senior Growth Marketing Manager | FinTech App | 2021 – Present
• Spearheaded paid acquisition campaigns across Google Ads and Meta, boosting monthly active leads by 140% while reducing CAC by 32%.
• Optimized automated lifecycle marketing funnels in Salesforce CRM, driving a 28% increase in 90-day retention.
• Orchestrated organic SEO strategy resulting in 450,000+ monthly unique visitors within 12 months.

Digital Marketing Specialist | Retail Brand | 2018 – 2021
• Managed $1.2M annual digital advertising budget across search, display, and social channels.
• Analyzed conversion funnels in Google Analytics, improving checkout conversion rate from 2.1% to 3.8%.

EDUCATION
Bachelor of Business Administration (BBA) — Marketing & Analytics
New York University (NYU), Stern School of Business | 2018

SKILLS
Marketing & Analytics: SEO, SEM, Google Analytics, Salesforce, CRM, Figma
Methodologies & Tools: Agile Methodology, Scrum, Jira, Financial Modeling
`;

  const resumes = [
    { name: '1. Weak / Bare-bones Resume', text: weakResume, expectedRange: [25, 45] },
    { name: '2. Average Student Resume (Unquantified)', text: averageResume, expectedRange: [50, 70] },
    { name: '3. Jaswanth Reddy Resume (Concise, High-Quality)', text: jaswanthResume, expectedRange: [85, 93] },
    { name: '4. Senior Staff Engineer Resume (Top-Tier)', text: seniorResume, expectedRange: [90, 98] },
    { name: '5. Bloated & Repetitive Resume (Filler Phrases)', text: bloatedResume, expectedRange: [40, 65] },
    { name: '6. Non-Software Marketing Lead Resume', text: marketingResume, expectedRange: [80, 95] },
  ];

  const results: Array<{ name: string; score: number; breakdown: any }> = [];

  for (const item of resumes) {
    const res = await bgeAtsService.scoreResume({ resumeText: item.text });
    const sum = Object.values(res.breakdown).reduce((a, b) => a + b, 0);

    console.log(`=== ${item.name} ===`);
    console.log(`Overall ATS Score: ${res.overallScore} / 100`);
    console.log(`Breakdown (Sum: ${sum}/100):`);
    console.log(`  - Structure: ${res.breakdown.structure} / 20`);
    console.log(`  - Content Completeness: ${res.breakdown.completeness} / 20`);
    console.log(`  - Extractability: ${res.breakdown.extractability} / 20`);
    console.log(`  - Skills & Technical Content: ${res.breakdown.skills} / 15`);
    console.log(`  - Experience Quality: ${res.breakdown.experienceQuality} / 15`);
    console.log(`  - Formatting: ${res.breakdown.formatting} / 10`);
    console.log(`Extracted Skills (${res.extractedSkills.length}):`, res.extractedSkills.slice(0, 8).join(', '));
    console.log(`Quantification: ${res.quantification.densityPercentage}% metrics, ${res.quantification.actionVerbRatio}% action verbs`);
    console.log(`Strengths (${res.strengths.length}):`, res.strengths.slice(0, 2));
    console.log(`Improvements (${res.improvements.length}):`, res.improvements.slice(0, 2));
    console.log('----------------------------------------------------------------\n');

    // Strict assertions
    if (sum !== res.overallScore) {
      throw new Error(`FAIL: Breakdown sum (${sum}) does not equal overallScore (${res.overallScore}) for ${item.name}`);
    }
    if (res.overallScore < 0 || res.overallScore > 100) {
      throw new Error(`FAIL: Score out of 0-100 range: ${res.overallScore}`);
    }

    results.push({ name: item.name, score: res.overallScore, breakdown: res.breakdown });
  }

  console.log('================================================================');
  console.log('SUMMARY SCORE DIFFERENTIATION TABLE');
  console.log('================================================================');
  for (const r of results) {
    console.log(`${r.name.padEnd(50)} -> ${r.score} / 100`);
  }

  // Verify meaningful score distribution
  const weakScore = results[0].score;
  const avgScore = results[1].score;
  const jaswanthScore = results[2].score;
  const seniorScore = results[3].score;
  const bloatedScore = results[4].score;
  const marketingScore = results[5].score;

  if (!(weakScore < avgScore && avgScore < jaswanthScore && jaswanthScore <= seniorScore)) {
    throw new Error(`FAIL: Expected weak (${weakScore}) < avg (${avgScore}) < jaswanth (${jaswanthScore}) <= senior (${seniorScore})`);
  }

  if (bloatedScore >= jaswanthScore) {
    throw new Error(`FAIL: Bloated resume (${bloatedScore}) should score lower than high quality resume (${jaswanthScore})`);
  }

  console.log('\nALL DIFFERENTIATION ASSERTIONS PASSED SUCCESSFULLY!');
}

runDifferentiationTests().catch(err => {
  console.error('Test run error:', err);
  process.exit(1);
});
