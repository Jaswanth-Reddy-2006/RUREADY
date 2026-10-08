import {
  calculateAtsScore,
  extractSkillsFromText,
  detectResumeDomain,
  extractKeywordsFromJd,
  normalizeResumeData,
  resumeToPlainText,
  hasQuantifiableMetrics,
  STRONG_ACTION_VERBS
} from '../utils/atsEngine';
import { parseRawResumeToData } from '../utils/resumeParser';

console.log('═══════════════════════════════════════════════════════════════');
console.log('MULTI-DOMAIN ATS ENGINE VERIFICATION SUITE');
console.log('═══════════════════════════════════════════════════════════════\n');

// Profile 1: UI/UX & Product Designer (Similar to user case)
const uiuxRawText = `
SATHVIK GOUD
UI/UX & Product Designer
sathvik.goud@example.com | +1 (555) 234-5678 | San Francisco, CA | linkedin.com/in/sathvikgoud | sathvikgoud.design

PROFESSIONAL SUMMARY
Passionate UI/UX & Product Designer with 4+ years of experience designing user-centric web and mobile interfaces. Proven track record of conducting user research, building scalable design systems, and improving product usability for SaaS and mobile platforms.

CORE SKILLS & COMPETENCIES
UX Design, UI Design, User Research, Information Architecture, User Flows, Wireframing, Prototyping, High-Fidelity Prototyping, Interaction Design, Heuristic Evaluation, Visual Hierarchy, Typography, Auto Layout, Design Systems, Responsive Design, Usability Testing, SaaS UX, Mobile UI, Figma, FigJam, Canva, Miro

PROFESSIONAL EXPERIENCE
Senior Product Designer
Creative Studios | 2022 - Present
• Designed end-to-end user flows and high-fidelity wireframes in Figma for enterprise SaaS platforms, reducing user friction and drop-off by 32%.
• Created comprehensive design systems with Auto Layout and reusable component libraries, accelerating frontend handoff velocity by 40%.
• Conducted user research and usability testing sessions with 45+ participants to validate core interaction design patterns.
• Redesigned mobile UI navigation hierarchy, leading to a 28% increase in daily user engagement and improved task completion rates.

UI/UX Designer
DesignLab Solutions | 2020 - 2022
• Prototyped interactive web and mobile prototypes in Figma and FigJam for client case studies.
• Performed heuristic evaluations across 12 product surfaces, identifying key usability bottlenecks.
• Streamlined customer onboarding journey, resulting in improved clarity and reducing initial setup time from 15 minutes to 4 minutes.

EDUCATION
Bachelor of Design in Interaction Design
National Institute of Design | 2016 - 2020
`;

// Profile 2: Software Engineer
const softwareEngRawText = `
ALEX CHEN
Senior Software Engineer
alex.chen@example.com | (555) 987-6543 | Seattle, WA | github.com/alexchen | linkedin.com/in/alexchen

SUMMARY
Senior Software Engineer with 6+ years building distributed backend services and high-throughput cloud infrastructure with TypeScript, Node.js, and PostgreSQL.

SKILLS
TypeScript, JavaScript, Python, Go, React, Node.js, Express, PostgreSQL, Redis, Docker, Kubernetes, AWS, GraphQL, REST API, Microservices, Git, Jest, CI/CD

EXPERIENCE
Lead Backend Engineer
CloudScale Tech | 2021 - Present
• Architected resilient microservices using TypeScript and Node.js, reducing p99 latency by 38% across 200,000+ daily active requests.
• Optimized PostgreSQL indexing and distributed Redis caching, cutting query response times by 45%.
• Automated CI/CD deployment pipelines using Docker and GitHub Actions, achieving 99.98% service uptime.

EDUCATION
Bachelor of Science in Computer Science
University of Washington | 2015 - 2019
`;

// Profile 3: Cybersecurity Analyst
const cyberRawText = `
JORDAN REED
Cybersecurity Analyst
jordan.reed@example.com | (555) 345-6789 | Austin, TX | linkedin.com/in/jordanreed

SUMMARY
Certified Information Systems Security Professional with expertise in Threat Intelligence, SIEM monitoring, Incident Response, and Vulnerability Assessment.

SKILLS
Threat Intelligence, SIEM, Splunk, Incident Response, Vulnerability Assessment, Network Security, Zero Trust, SOC, Wireshark, OWASP, Firewalls, IAM, CISSP

EXPERIENCE
Information Security Analyst
SecureNet Solutions | 2022 - Present
• Monitored SIEM security events in Splunk across 5,000+ enterprise endpoints, reducing mean time to detect (MTTD) incidents by 45%.
• Conducted vulnerability assessments and penetration testing on internal networks, mitigating 80+ high-severity vulnerabilities.
• Implemented Zero Trust access controls and IAM policies, eliminating unauthorized access attempts.

EDUCATION
Bachelor of Science in Cybersecurity
Texas A&M University | 2017 - 2021
`;

// Profile 4: Data Scientist
const dataRawText = `
PRIYA SHARMA
Data Scientist & Machine Learning Engineer
priya.sharma@example.com | (555) 456-7890 | New York, NY | linkedin.com/in/priyasharma

SUMMARY
Data Scientist with 5+ years of experience delivering machine learning models, statistical analysis, and predictive analytics in Python and SQL.

SKILLS
Python, SQL, Machine Learning, Deep Learning, PyTorch, TensorFlow, Scikit-Learn, Pandas, NumPy, Data Modeling, Data Warehousing, BigQuery, Snowflake, Tableau

EXPERIENCE
Senior Data Scientist
Analytics Corp | 2021 - Present
• Engineered predictive ML models in Python using PyTorch and Scikit-Learn, improving customer churn prediction accuracy to 91.5%.
• Formulated automated ETL pipelines in BigQuery and Snowflake processing 10M+ rows daily.
• Designed executive dashboards in Tableau to communicate key business insights to C-level stakeholders.

EDUCATION
Master of Science in Data Science
Columbia University | 2019 - 2021
`;

// Profile 5: Marketing Candidate
const marketingRawText = `
EMILY WATSON
Growth & Digital Marketing Manager
emily.watson@example.com | (555) 567-8901 | Chicago, IL | linkedin.com/in/emilywatson

SUMMARY
Performance marketing and growth leader with proven experience driving digital customer acquisition, SEO strategy, and multi-channel campaign execution.

SKILLS
Digital Marketing, Content Strategy, SEO, SEM, Google Analytics, Social Media Marketing, Email Marketing, Campaign Management, Brand Strategy, Copywriting, CRO, HubSpot, Google Ads

EXPERIENCE
Growth Marketing Manager
VentureScale Inc | 2021 - Present
• Launched multi-channel paid acquisition campaigns across Google Ads and Meta Ads, increasing qualified inbound leads by 54%.
• Optimized conversion rate optimization (CRO) landing pages, boosting visitor-to-lead conversion from 2.1% to 4.8%.
• Managed content strategy and SEO optimizations, growing organic search traffic by 120% year-over-year.

EDUCATION
Bachelor of Arts in Marketing & Communications
Northwestern University | 2016 - 2020
`;

const testCases = [
  { name: 'UI/UX & Product Designer', raw: uiuxRawText },
  { name: 'Software Engineer', raw: softwareEngRawText },
  { name: 'Cybersecurity Analyst', raw: cyberRawText },
  { name: 'Data Scientist', raw: dataRawText },
  { name: 'Growth Marketing Manager', raw: marketingRawText },
];

testCases.forEach(({ name, raw }, idx) => {
  console.log(`[TEST ${idx + 1}] Processing Profile: ${name}`);
  const parsed = parseRawResumeToData(raw);
  const normalized = normalizeResumeData(parsed);

  console.log(`  Extracted Title: "${normalized.personalInfo.title}"`);
  console.log(`  Extracted Name: "${normalized.personalInfo.fullName}"`);
  console.log(`  Languages: [${normalized.skills.languages.join(', ')}]`);
  console.log(`  Frameworks/Methodologies: [${normalized.skills.frameworks.join(', ')}]`);
  console.log(`  Tools: [${normalized.skills.tools.join(', ')}]`);
  console.log(`  Experience Roles: ${normalized.experience.length}`);

  // Test 1: General ATS score (No JD)
  const generalScore = calculateAtsScore(normalized, '');
  console.log(`  -> General ATS Score: ${generalScore.totalScore}/100 (${generalScore.grade})`);
  console.log(`     Detected Domain: ${generalScore.detectedDomain}`);
  console.log(`     Keywords/Competencies: ${generalScore.breakdown.keywordScore}/40 (${generalScore.matchedKeywords.length} recognized skills)`);
  console.log(`     Metrics/Outcomes: ${generalScore.breakdown.metricsScore}/25`);
  console.log(`     Completeness: ${generalScore.breakdown.completenessScore}/20`);
  console.log(`     Action Verbs: ${generalScore.breakdown.actionVerbScore}/15`);

  if (generalScore.totalScore < 60) {
    throw new Error(`FAILED: Score too low (${generalScore.totalScore}/100) for valid resume!`);
  } else {
    console.log(`  ✅ PASSED General ATS evaluation\n`);
  }
});

// Test 2: Targeted JD Match for UI/UX
console.log('[TEST 6] Targeted JD Match for UI/UX Designer');
const uiuxParsed = normalizeResumeData(parseRawResumeToData(uiuxRawText));
const uiuxJd = `
Role: Senior Product Designer
Requirements:
- 3+ years in UX Design, UI Design, Wireframing, and Prototyping.
- Expertise in Figma, Design Systems, Information Architecture, and User Research.
- Experience with SaaS UX, Responsive Design, and Usability Testing.
`;
const targetedUiuxScore = calculateAtsScore(uiuxParsed, uiuxJd, 'Senior Product Designer');
console.log(`  Targeted ATS Score: ${targetedUiuxScore.totalScore}/100 (${targetedUiuxScore.grade})`);
console.log(`  Matched Keywords: [${targetedUiuxScore.matchedKeywords.join(', ')}]`);
console.log(`  Missing Keywords: [${targetedUiuxScore.missingKeywords.join(', ')}]`);
if (targetedUiuxScore.totalScore < 75 || targetedUiuxScore.matchedKeywords.length < 5) {
  throw new Error(`Targeted UI/UX match failed!`);
} else {
  console.log(`  ✅ PASSED Targeted UI/UX JD match!\n`);
}

// Test 3: Targeted JD Match for Software Engineer
console.log('[TEST 7] Targeted JD Match for Software Engineer');
const sweParsed = normalizeResumeData(parseRawResumeToData(softwareEngRawText));
const sweJd = `
Role: Senior Backend Engineer
Requirements:
- Strong proficiency in TypeScript, Node.js, and PostgreSQL.
- Experience with Docker, Redis, Kubernetes, Microservices, and REST API.
`;
const targetedSweScore = calculateAtsScore(sweParsed, sweJd, 'Senior Backend Engineer');
console.log(`  Targeted ATS Score: ${targetedSweScore.totalScore}/100 (${targetedSweScore.grade})`);
console.log(`  Matched Keywords: [${targetedSweScore.matchedKeywords.join(', ')}]`);
console.log(`  Missing Keywords: [${targetedSweScore.missingKeywords.join(', ')}]`);
if (targetedSweScore.totalScore < 75 || targetedSweScore.matchedKeywords.length < 5) {
  throw new Error(`Targeted Software Engineer match failed!`);
} else {
  console.log(`  ✅ PASSED Targeted Software Engineer JD match!\n`);
}

// Test 3b: The client ATS engine must NOT fabricate a semantic/competitive score
// and must NOT blend one into totalScore. totalScore is a purely deterministic
// ATS-readiness preview; the authoritative Competitive Score comes only from the
// backend BGE matcher.
console.log('[TEST 7b] No Client-Side Fake Semantic Score / No ATS+Semantic Blending');
if ('semanticScore' in targetedSweScore) {
  throw new Error('FAILED: client ATS result must not expose a fabricated semanticScore');
}
if ('semanticScore' in targetedSweScore.breakdown) {
  throw new Error('FAILED: client ATS breakdown must not expose a fabricated semanticScore');
}
{
  const b = targetedSweScore.breakdown;
  const deterministicSum = Math.min(
    100,
    Math.max(
      0,
      b.structureScore +
        b.completenessScore +
        b.extractabilityScore +
        b.skillsScore +
        b.experienceQualityScore +
        b.formattingScore
    )
  );
  if (targetedSweScore.totalScore !== deterministicSum) {
    throw new Error(
      `FAILED: totalScore (${targetedSweScore.totalScore}) must equal the deterministic sum of the 6 fixed pillars (${deterministicSum}); no semantic blending allowed`
    );
  }
  // A JD is linked, yet the score must still be the deterministic sum (proving
  // the old 70/30 ATS+semantic blend is gone even when hasTargetJd is true).
  if (targetedSweScore.hasTargetJd !== true) {
    throw new Error('FAILED: expected a target JD to be linked for this case');
  }
}
console.log(`  totalScore=${targetedSweScore.totalScore} == deterministic sum, semanticScore absent`);
console.log(`  ✅ PASSED No fabricated semantic score and no ATS+semantic blending!\n`);

// Test 4: Strict Data Integrity Verification (No Fake Data Injected)
console.log('[TEST 8] Strict Data Integrity & Zero Fake Defaults Verification');
const studentResumeRaw = `
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
Python, Java, C++, JavaScript, TypeScript, React, Node.js, Express, MongoDB, Git, Docker

PROJECTS
Smart Health Analytics Platform | React, Node.js, MongoDB
• Developed real-time health monitoring analytics dashboard handling 10,000+ telemetry records.
• Built predictive health scoring algorithms with 94% accuracy.
`;

const studentParsed = normalizeResumeData(parseRawResumeToData(studentResumeRaw));

console.log(`  Parsed Name: "${studentParsed.personalInfo.fullName}"`);
console.log(`  Parsed Location: "${studentParsed.personalInfo.location}"`);
console.log(`  Parsed Phone: "${studentParsed.personalInfo.phone}"`);
console.log(`  Parsed Email: "${studentParsed.personalInfo.email}"`);
console.log(`  Parsed LinkedIn: "${studentParsed.personalInfo.linkedin}"`);
console.log(`  Parsed GitHub: "${studentParsed.personalInfo.github}"`);
console.log(`  Parsed Education Count: ${studentParsed.education.length}`);
console.log(`  Education 1: ${studentParsed.education[0]?.school} | ${studentParsed.education[0]?.degree} | GPA: ${studentParsed.education[0]?.gpa} | End: ${studentParsed.education[0]?.endDate}`);
console.log(`  Parsed Experience Count: ${studentParsed.experience.length}`);

if (studentParsed.personalInfo.fullName !== 'JASWANTH REDDY') {
  throw new Error(`Data Integrity Error: Name mismatch! Got "${studentParsed.personalInfo.fullName}"`);
}
if (!studentParsed.personalInfo.location.includes('Hyderabad')) {
  throw new Error(`Data Integrity Error: Location mismatch! Got "${studentParsed.personalInfo.location}"`);
}
if (studentParsed.personalInfo.phone !== '+91 8008154808') {
  throw new Error(`Data Integrity Error: Phone mismatch! Got "${studentParsed.personalInfo.phone}"`);
}
if (studentParsed.personalInfo.email !== 'jaswanthre9@gmail.com') {
  throw new Error(`Data Integrity Error: Email mismatch! Got "${studentParsed.personalInfo.email}"`);
}
if (!studentParsed.personalInfo.linkedin.includes('jasreaug')) {
  throw new Error(`Data Integrity Error: LinkedIn mismatch! Got "${studentParsed.personalInfo.linkedin}"`);
}
if (!studentParsed.personalInfo.github.includes('Jaswanth-Reddy-2006')) {
  throw new Error(`Data Integrity Error: GitHub mismatch! Got "${studentParsed.personalInfo.github}"`);
}
if (studentParsed.experience.length !== 0) {
  throw new Error(`Data Integrity Error: Injected fake experience! Experience length is ${studentParsed.experience.length}`);
}
if (studentParsed.education.length !== 2) {
  throw new Error(`Data Integrity Error: Education length is ${studentParsed.education.length} (expected 2)`);
}
const firstEdu = studentParsed.education[0];
if (!firstEdu || (!firstEdu.gpa?.includes('8.76') && firstEdu.gpa !== '8.76 / 10')) {
  throw new Error(`Data Integrity Error: GPA mismatch! Got "${firstEdu?.gpa}"`);
}
if (firstEdu.location === 'USA') {
  throw new Error(`Data Integrity Error: Injected fake 'USA' location in education!`);
}

console.log('  ✅ PASSED Strict Data Integrity verification\n');

// Test 5: DOCX Generation + Existing Mammoth DOCX Parser Pipeline Verification
console.log('[TEST 9] DOCX Document Generation & Mammoth Parser Pipeline Verification');
const { Document, Paragraph, TextRun, HeadingLevel, Packer } = await import('docx');
const mammoth = (await import('mammoth')).default;

const docxSample = new Document({
  sections: [
    {
      children: [
        new Paragraph({ text: 'JASWANTH REDDY', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: 'Hyderabad, Telangana, India | +91 8008154808 | jaswanthre9@gmail.com' }),
        new Paragraph({ text: 'https://linkedin.com/in/jasreaug | https://github.com/Jaswanth-Reddy-2006' }),
        new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: 'Bachelor of Technology — Computer Science & Engineering' }),
        new Paragraph({ text: 'Vidya Jyothi Institute of Technology, Hyderabad' }),
        new Paragraph({ text: 'GPA: 8.76 / 10 | 2028 Expected' }),
        new Paragraph({ text: 'Intermediate' }),
        new Paragraph({ text: 'Narayana Junior College, Hyderabad' }),
        new Paragraph({ text: '2022 - 2024' }),
        new Paragraph({ text: 'SKILLS', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: 'Python, Java, C++, JavaScript, TypeScript, React, Node.js, Express, MongoDB, Git, Docker' }),
        new Paragraph({ text: 'PROJECTS', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: 'Smart Health Analytics Platform | React, Node.js, MongoDB' }),
        new Paragraph({
          children: [new TextRun('Developed real-time health monitoring analytics dashboard handling 10,000+ telemetry records.')],
          bullet: { level: 0 }
        }),
        new Paragraph({
          children: [new TextRun('Built predictive health scoring algorithms with 94% accuracy.')],
          bullet: { level: 0 }
        })
      ]
    }
  ]
});

const docxBuffer = await Packer.toArrayBuffer(docxSample);
const mammothResult = await mammoth.extractRawText({ arrayBuffer: docxBuffer, buffer: Buffer.from(docxBuffer) } as any);
const parsedFromDocx = normalizeResumeData(parseRawResumeToData(mammothResult.value));

console.log(`  DOCX Extracted Candidate: "${parsedFromDocx.personalInfo.fullName}"`);
console.log(`  DOCX Extracted Location: "${parsedFromDocx.personalInfo.location}"`);
console.log(`  DOCX Extracted Email: "${parsedFromDocx.personalInfo.email}"`);
console.log(`  DOCX Extracted Phone: "${parsedFromDocx.personalInfo.phone}"`);
console.log(`  DOCX Extracted Education Count: ${parsedFromDocx.education.length}`);
console.log(`  DOCX Extracted Projects Count: ${parsedFromDocx.projects.length}`);

if (parsedFromDocx.personalInfo.fullName !== 'JASWANTH REDDY') {
  throw new Error(`DOCX Parser Error: Name mismatch! Got "${parsedFromDocx.personalInfo.fullName}"`);
}
if (!parsedFromDocx.personalInfo.location.includes('Hyderabad')) {
  throw new Error(`DOCX Parser Error: Location mismatch! Got "${parsedFromDocx.personalInfo.location}"`);
}
if (parsedFromDocx.education.length !== 2) {
  throw new Error(`DOCX Parser Error: Expected 2 education entries, got ${parsedFromDocx.education.length}`);
}
if (parsedFromDocx.experience.length !== 0) {
  throw new Error(`DOCX Parser Error: Injected fake experience into DOCX resume!`);
}

console.log('  ✅ PASSED DOCX & Mammoth Parser Pipeline Verification\n');

// Test 6: Extraction Quality Validation
console.log('[TEST 10] Extraction Quality Checks & Diagnostics');
const { validateExtractionQuality, compareExtractionResults } = await import('../utils/resumeParser');

const qualityCheckPass = validateExtractionQuality(studentParsed);
console.log(`  Complete Resume Validation: isComplete=${qualityCheckPass.isComplete}, score=${qualityCheckPass.qualityScore}/100, warnings=${qualityCheckPass.warnings.length}`);
if (!qualityCheckPass.isComplete) {
  throw new Error(`Complete student resume failed quality validation: ${qualityCheckPass.warnings.join('; ')}`);
}

const incompleteResume = normalizeResumeData(parseRawResumeToData("John Doe\njohn@example.com\nSome small text."));
const qualityCheckFail = validateExtractionQuality(incompleteResume);
console.log(`  Incomplete Resume Validation: isComplete=${qualityCheckFail.isComplete}, score=${qualityCheckFail.qualityScore}/100, warnings=${qualityCheckFail.warnings.length}`);
if (qualityCheckFail.isComplete || qualityCheckFail.warnings.length === 0) {
  throw new Error('Incomplete resume should have failed extraction quality validation!');
}
console.log('  ✅ PASSED Extraction Quality Checks\n');

// Test 7: PDF vs DOCX Raw Text Comparison & ATS Score Equivalence Test
console.log('[TEST 11] PDF vs DOCX Canonical Pipeline Parity & ATS Equivalence Test');

// Simulated rawText from PDF extractor (with PDF linebreaks)
const pdfExtractedRaw = `
JASWANTH REDDY
Hyderabad, Telangana, India
+91 8008154808 | jaswanthre9@gmail.com | linkedin.com/in/jasreaug | github.com/Jaswanth-Reddy-2006

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

// Simulated rawText from DOCX extractor (with table/paragraph formatting)
const docxExtractedRaw = `
JASWANTH REDDY
Hyderabad, Telangana, India | +91 8008154808 | jaswanthre9@gmail.com
https://linkedin.com/in/jasreaug | https://github.com/Jaswanth-Reddy-2006

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
Developed real-time health monitoring analytics dashboard handling 10,000+ telemetry records.
Built predictive health scoring algorithms with 94% accuracy.
`;

const comparison = compareExtractionResults(pdfExtractedRaw, docxExtractedRaw);
console.log(`  Raw Text Comparison: PDF char count=${comparison.pdfStats.charCount}, DOCX char count=${comparison.docxStats.charCount}`);
console.log(`  PDF Skills Count=${comparison.pdfStats.skillsCount}, DOCX Skills Count=${comparison.docxStats.skillsCount}`);
console.log(`  Skills Overlap: ${comparison.overlap.skillsOverlapPercent}% (Consistent: ${comparison.overlap.isConsistent})`);
console.log(`  Discrepancies found: ${comparison.differences.length === 0 ? 'None (Identical)' : comparison.differences.join('; ')}`);

const canonicalFromPdf = normalizeResumeData(parseRawResumeToData(pdfExtractedRaw));
const canonicalFromDocx = normalizeResumeData(parseRawResumeToData(docxExtractedRaw));

const targetJobDescription = `
Role: Full Stack Software Engineer
Requirements:
- Strong experience in React, Node.js, JavaScript, TypeScript, MongoDB.
- Knowledge of Git, Docker, REST APIs, Python.
`;

const atsScorePdf = calculateAtsScore(canonicalFromPdf, targetJobDescription, 'Full Stack Software Engineer');
const atsScoreDocx = calculateAtsScore(canonicalFromDocx, targetJobDescription, 'Full Stack Software Engineer');

console.log(`  Canonical PDF ATS Score:  ${atsScorePdf.totalScore}/100 (Keyword: ${atsScorePdf.breakdown.keywordScore}, Action: ${atsScorePdf.breakdown.actionVerbScore})`);
console.log(`  Canonical DOCX ATS Score: ${atsScoreDocx.totalScore}/100 (Keyword: ${atsScoreDocx.breakdown.keywordScore}, Action: ${atsScoreDocx.breakdown.actionVerbScore})`);

const scoreDiff = Math.abs(atsScorePdf.totalScore - atsScoreDocx.totalScore);
console.log(`  Score Difference between PDF & DOCX: ${scoreDiff} point(s)`);

if (scoreDiff > 3) {
  throw new Error(`ATS score mismatch between PDF and DOCX for same resume content! Difference is ${scoreDiff} points.`);
}

if (canonicalFromPdf.personalInfo.fullName !== canonicalFromDocx.personalInfo.fullName) {
  throw new Error(`Personal Info mismatch: PDF="${canonicalFromPdf.personalInfo.fullName}", DOCX="${canonicalFromDocx.personalInfo.fullName}"`);
}

if (canonicalFromPdf.education.length !== canonicalFromDocx.education.length) {
  throw new Error(`Education count mismatch: PDF=${canonicalFromPdf.education.length}, DOCX=${canonicalFromDocx.education.length}`);
}

if (canonicalFromPdf.projects.length !== canonicalFromDocx.projects.length) {
  throw new Error(`Projects count mismatch: PDF=${canonicalFromPdf.projects.length}, DOCX=${canonicalFromDocx.projects.length}`);
}

console.log('  ✅ PASSED PDF vs DOCX Canonical Parity & ATS Equivalence Test\n');

console.log('═══════════════════════════════════════════════════════════════');
console.log('ALL ATS, DATA INTEGRITY, DOCX & CANONICAL PIPELINE TESTS PASSED! 🎉');
console.log('═══════════════════════════════════════════════════════════════');

