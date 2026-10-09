import { structuredResumeMapperService, classifyHeader } from '../src/services/structuredResumeMapper.service.js';

console.log('🧪 [Test] Running Canonical Section Classification & Mapping Regression Suite...\n');

// ── 1. Test Generic Section Header Classification ──────────────────────────
console.log('--- 1. Testing Generic Section Header Classification ---');

const headerTestCases: Array<{ header: string; expected: string }> = [
  { header: 'Personal Information', expected: 'personal_info' },
  { header: 'Contact Details', expected: 'personal_info' },
  { header: 'Education', expected: 'education' },
  { header: 'EDUCATIONAL QUALIFICATIONS', expected: 'education' },
  { header: 'Academic Background', expected: 'education' },
  { header: 'Professional Experience', expected: 'experience' },
  { header: 'Work Experience', expected: 'experience' },
  { header: 'Research Experience', expected: 'research_experience' },
  { header: 'Academic Research', expected: 'research_experience' },
  { header: 'Teaching Experience', expected: 'teaching_experience' },
  { header: 'Teaching Assistantships', expected: 'teaching_experience' },
  { header: 'Publications and Patents', expected: 'publications_and_patents' },
  { header: 'Publications & Patents', expected: 'publications_and_patents' },
  { header: 'Publications', expected: 'publications' },
  { header: 'Patents', expected: 'patents' },
  { header: 'Projects', expected: 'projects' },
  { header: 'Key Projects', expected: 'projects' },
  { header: 'Academic Projects', expected: 'projects' },
  { header: 'Courses', expected: 'courses' },
  { header: 'Relevant Coursework', expected: 'courses' },
  { header: 'Skills', expected: 'skills' },
  { header: 'Technical Skills', expected: 'skills' },
  { header: 'Technical Competencies', expected: 'skills' },
  { header: 'Programming Languages', expected: 'programming_languages' },
  { header: 'Spoken Languages', expected: 'spoken_languages' },
  { header: 'Scholastic Achievements', expected: 'achievements' },
  { header: 'Honors and Awards', expected: 'achievements' },
  { header: 'Positions of Responsibility', expected: 'responsibility' },
  { header: 'Positions of Leadership', expected: 'responsibility' },
  { header: 'Extra Curricular Activities', expected: 'extracurricular' },
  { header: 'Extracurricular Activities', expected: 'extracurricular' },
  { header: 'Executive Summary', expected: 'summary' },
  { header: 'Professional Summary', expected: 'summary' },
];

let classificationPassed = 0;
for (const tc of headerTestCases) {
  const actual = classifyHeader(tc.header);
  if (actual !== tc.expected) {
    throw new Error(`Classification failure: "${tc.header}" -> expected "${tc.expected}", got "${actual}"`);
  }
  classificationPassed++;
}
console.log(`✅ All ${classificationPassed} generic header classifications passed accurately.`);

// ── 2. Test Full 12-Section Multi-Role Regression Document ─────────────────
console.log('\n--- 2. Testing 12-Section Multi-Role CV Mapping ---');

const complexCvDoclingInput = {
  plain_text: '',
  structured_elements: [
    { type: 'title', text: 'Monisha Jegadeesan' },
    { type: 'paragraph', text: 'Software Engineer | Google' },
    { type: 'paragraph', text: 'monisha.j@example.com | +1 (650) 555-0199 | Mountain View, CA | linkedin.com/in/monisha-j | github.com/monishaj | monishaj.dev' },
    
    // Education
    { type: 'section_header', text: 'Education' },
    { type: 'paragraph', text: 'Indian Institute of Technology, Madras' },
    { type: 'paragraph', text: 'Dual Degree (B.Tech + M.Tech) in Computer Science and Engineering' },
    { type: 'paragraph', text: '2015 – 2020 | CGPA: 9.6 / 10' },
    { type: 'list_item', text: '• Master Thesis: Distributed Optimization in Asynchronous Graph Neural Networks' },
    { type: 'list_item', text: '• Relevant Coursework: Advanced Algorithms, Distributed Systems, Deep Learning, Operating Systems' },
    
    // Professional Experience with Multi-Role under same employer
    { type: 'section_header', text: 'Professional Experience' },
    { type: 'paragraph', text: 'Google | Mountain View, CA' },
    { type: 'paragraph', text: 'Software Engineer III' },
    { type: 'paragraph', text: 'July 2021 – Present' },
    { type: 'list_item', text: '• Architected large-scale distributed streaming infrastructure handling 120M+ QPS with 99.999% availability.' },
    { type: 'list_item', text: '• Decreased p99 tail latency by 35% through custom zero-copy serialization and SIMD optimizations in C++.' },
    { type: 'paragraph', text: 'Software Engineer II' },
    { type: 'paragraph', text: 'August 2019 – June 2021' },
    { type: 'list_item', text: '• Designed and implemented real-time analytics aggregation pipelines using Go, Spanner, and Kafka.' },
    { type: 'list_item', text: '• Led cross-functional migration of 14 microservices to Kubernetes, saving $1.2M in annual cluster compute costs.' },
    { type: 'paragraph', text: 'Software Engineering Intern' },
    { type: 'paragraph', text: 'May 2018 – August 2018' },
    { type: 'list_item', text: '• Built high-performance caching layer in Go reducing database load by 40%.' },

    // Research Experience
    { type: 'section_header', text: 'Research Experience' },
    { type: 'paragraph', text: 'Scalable Systems Research Lab, IIT Madras | Research Scholar | 2018 – 2020' },
    { type: 'list_item', text: '• Developed asynchronous parameter server for distributed deep learning models.' },
    { type: 'list_item', text: '• Evaluated gradient synchronization algorithms across multi-GPU clusters.' },

    // Publications and Patents
    { type: 'section_header', text: 'Publications and Patents' },
    { type: 'list_item', text: '• "High-Throughput Asynchronous Graph Embeddings for Heterogeneous Networks", IEEE Transactions on Parallel and Distributed Systems, 2021' },
    { type: 'list_item', text: '• "Low-Latency Distributed Consensus in Partitioned Networks", ACM SIGOPS Operating Systems Review, 2020' },
    { type: 'list_item', text: '• US Patent 11456789B2: Dynamic Resource Allocation for Cloud-Native Distributed Microservices, Granted 2022' },

    // Projects
    { type: 'section_header', text: 'Projects' },
    { type: 'paragraph', text: 'Aether: Distributed Key-Value Store | github.com/monishaj/aether' },
    { type: 'list_item', text: '• Tech: Go, Raft, gRPC, RocksDB' },
    { type: 'list_item', text: '• Implemented multi-Raft consensus protocol with dynamic shard rebalancing.' },

    // Teaching Experience
    { type: 'section_header', text: 'Teaching Experience' },
    { type: 'list_item', text: '• Head Teaching Assistant for CS3100 Operating Systems (Fall 2019), conducting weekly lab sessions for 140+ students.' },
    { type: 'list_item', text: '• Teaching Assistant for CS2800 Advanced Data Structures and Algorithms (Spring 2019).' },

    // Courses
    { type: 'section_header', text: 'Courses' },
    { type: 'list_item', text: '• Advanced Distributed Systems, Machine Learning Theory, Compiler Design, Database Internals, Computer Architecture' },

    // Skills / Technical Competencies
    { type: 'section_header', text: 'Technical Competencies' },
    { type: 'paragraph', text: 'Languages: C++, Go, Python, Java, TypeScript, SQL, Bash' },
    { type: 'paragraph', text: 'Frameworks & Libraries: React, PyTorch, gRPC, Protocol Buffers, Node.js' },
    { type: 'paragraph', text: 'Databases: PostgreSQL, Google Spanner, Redis, RocksDB' },
    { type: 'paragraph', text: 'Cloud & DevOps: Docker, Kubernetes, GCP, Linux, CI/CD, Terraform' },
    { type: 'paragraph', text: 'Developer Tools: Git, GDB, Perf, Bazel, Vim' },
    { type: 'paragraph', text: 'Security: TLS, OAuth2, Cryptography, Memory Safety' },

    // Scholastic Achievements
    { type: 'section_header', text: 'Scholastic Achievements' },
    { type: 'list_item', text: '• Institute Gold Medal for Academic Excellence in Computer Science, IIT Madras (2020)' },
    { type: 'list_item', text: '• All India Rank 14 in GATE Computer Science Examination out of 100,000+ candidates (2019)' },

    // Positions of Responsibility
    { type: 'section_header', text: 'Positions of Responsibility' },
    { type: 'list_item', text: '• Overall Coordinator, Shaastra (Annual Technical Festival, IIT Madras), managing 400+ student coordinators.' },
    { type: 'list_item', text: '• Student Representative, Department Academic Advisory Committee, CSE Dept.' },

    // Extra Curricular Activities
    { type: 'section_header', text: 'Extra Curricular Activities' },
    { type: 'list_item', text: '• Lead Cellist in University Western Music Ensemble.' },
    { type: 'list_item', text: '• Active volunteer and mentor at Women in Computer Science outreach programs.' },
  ],
};

const mapped = structuredResumeMapperService.mapDoclingToStructuredResume(complexCvDoclingInput);

// Verify Personal Info
console.log('Checking Personal Info...');
if (mapped.personalInfo.fullName !== 'Monisha Jegadeesan') throw new Error(`Name mismatch: ${mapped.personalInfo.fullName}`);
if (mapped.personalInfo.email !== 'monisha.j@example.com') throw new Error(`Email mismatch: ${mapped.personalInfo.email}`);
if (mapped.personalInfo.phone !== '+1 (650) 555-0199') throw new Error(`Phone mismatch: ${mapped.personalInfo.phone}`);
if (mapped.personalInfo.location !== 'Mountain View, CA') throw new Error(`Location mismatch: ${mapped.personalInfo.location}`);
if (mapped.personalInfo.github !== 'https://github.com/monishaj') throw new Error(`GitHub mismatch: ${mapped.personalInfo.github}`);
if (mapped.personalInfo.linkedin !== 'https://linkedin.com/in/monisha-j') throw new Error(`LinkedIn mismatch: ${mapped.personalInfo.linkedin}`);
if (mapped.personalInfo.portfolio !== 'https://monishaj.dev') throw new Error(`Portfolio mismatch: ${mapped.personalInfo.portfolio}`);
console.log('✅ Personal info extracted cleanly.');

// Verify Summary is NOT populated with corrupted fallback preamble
console.log('Checking Summary Fallback Leakage...');
if (mapped.summary) {
  throw new Error(`Expected empty summary when no explicit summary section exists, got leaked: "${mapped.summary}"`);
}
console.log('✅ No summary section leakage or preamble dumping.');

// Verify Education
console.log('Checking Education entries...');
if (mapped.education.length === 0) throw new Error('Education is empty!');
const edu0 = mapped.education[0];
if (!edu0.degree.includes('Dual Degree') && !edu0.degree.includes('B.Tech')) {
  throw new Error(`Degree mismatch: ${edu0.degree}`);
}
if (!edu0.school.includes('Indian Institute of Technology')) {
  throw new Error(`School mismatch: ${edu0.school}`);
}
if (!edu0.gpa.includes('9.6')) {
  throw new Error(`GPA mismatch: ${edu0.gpa}`);
}
console.log(`✅ Education entry extracted: ${edu0.degree} at ${edu0.school} (GPA: ${edu0.gpa})`);

// Verify Professional Experience (Multi-role Google)
console.log('Checking Experience multi-role grouping...');
if (mapped.experience.length !== 3) {
  throw new Error(`Expected 3 Google roles, got ${mapped.experience.length}`);
}
for (const exp of mapped.experience) {
  if (exp.company !== 'Google') {
    throw new Error(`Role "${exp.title}" failed to inherit company "Google", got "${exp.company}"`);
  }
}
if (mapped.experience[0].title !== 'Software Engineer III' || mapped.experience[0].current !== true) {
  throw new Error(`Role 1 mismatch: ${mapped.experience[0].title}`);
}
if (mapped.experience[1].title !== 'Software Engineer II' || mapped.experience[1].startDate !== 'August 2019') {
  throw new Error(`Role 2 mismatch: ${mapped.experience[1].title}`);
}
if (mapped.experience[2].title !== 'Software Engineering Intern') {
  throw new Error(`Role 3 mismatch: ${mapped.experience[2].title}`);
}
console.log('✅ All 3 Google roles grouped with inherited company name, dates, and bullets.');

// Verify Technical Skills
console.log('Checking Technical Skills categories...');
if (mapped.skills.languages.length < 5 || !mapped.skills.languages.includes('C++') || !mapped.skills.languages.includes('Go')) {
  throw new Error(`Languages missing: ${JSON.stringify(mapped.skills.languages)}`);
}
if (mapped.skills.frameworks.length < 2 || !mapped.skills.frameworks.includes('React') || !mapped.skills.frameworks.includes('PyTorch')) {
  throw new Error(`Frameworks missing: ${JSON.stringify(mapped.skills.frameworks)}`);
}
if (mapped.skills.databases.length < 2 || !mapped.skills.databases.includes('PostgreSQL') || !mapped.skills.databases.includes('Google Spanner')) {
  throw new Error(`Databases missing: ${JSON.stringify(mapped.skills.databases)}`);
}
if (mapped.skills.cloudDevOps.length < 3 || !mapped.skills.cloudDevOps.includes('Kubernetes')) {
  throw new Error(`Cloud/DevOps missing: ${JSON.stringify(mapped.skills.cloudDevOps)}`);
}
if (mapped.skills.tools.length < 3 || !mapped.skills.tools.includes('Git') || !mapped.skills.tools.includes('Bazel')) {
  throw new Error(`Tools missing: ${JSON.stringify(mapped.skills.tools)}`);
}
if (mapped.skills.security.length < 2 || !mapped.skills.security.includes('TLS')) {
  throw new Error(`Security missing: ${JSON.stringify(mapped.skills.security)}`);
}
console.log('✅ Technical Competencies accurately categorized across all skill buckets.');

// Verify Publications and Patents split
console.log('Checking Publications & Patents split...');
if (mapped.publications.length !== 2) {
  throw new Error(`Expected 2 publications, got ${mapped.publications.length}`);
}
if (mapped.patents.length !== 1) {
  throw new Error(`Expected 1 patent, got ${mapped.patents.length}`);
}
if (!mapped.patents[0].number.includes('11456789B2')) {
  throw new Error(`Patent number mismatch: ${mapped.patents[0].number}`);
}
console.log(`✅ 2 Publications and 1 Patent correctly split and extracted.`);

// Verify Projects
console.log('Checking Projects...');
if (mapped.projects.length !== 1 || mapped.projects[0].name !== 'Aether: Distributed Key-Value Store') {
  throw new Error(`Project mismatch: ${JSON.stringify(mapped.projects)}`);
}
console.log('✅ Projects extracted.');

// Verify Custom Distinct Sections
console.log('Checking Custom Distinct Sections...');
const customTitles = mapped.customSections.map((s) => s.title);
console.log('Custom Section Titles:', customTitles);

const expectedSections = [
  'Research Experience',
  'Teaching Experience',
  'Courses',
  'Positions of Responsibility',
  'Extra Curricular Activities',
];

for (const expTitle of expectedSections) {
  const found = mapped.customSections.find((s) => s.title.toLowerCase().includes(expTitle.toLowerCase()));
  if (!found || found.items.length === 0) {
    throw new Error(`Missing distinct custom section: "${expTitle}"`);
  }
}
console.log('✅ All 5 custom sections preserved distinctly with full bullet content.');

// Verify Scholastic Achievements
console.log('Checking Scholastic Achievements...');
if (mapped.achievements.length !== 2) {
  throw new Error(`Achievements count mismatch: ${mapped.achievements.length}`);
}
console.log('✅ Scholastic Achievements extracted into achievements array.');

// Verify Certifications is NOT created from education or random blocks
console.log('Checking Certifications (should be 0 because source has no Certifications section)...');
if (mapped.certifications.length !== 0) {
  throw new Error(`Expected 0 certifications, got ${mapped.certifications.length}: ${JSON.stringify(mapped.certifications)}`);
}
console.log('✅ Certifications correctly left empty (0) when not present in source.');

// Verify Spoken Languages is NOT populated with programming skills
console.log('Checking Spoken Languages (should be 0 because skills only contained programming languages)...');
if (mapped.languages.length !== 0) {
  throw new Error(`Expected 0 spoken languages, got ${mapped.languages.length}: ${JSON.stringify(mapped.languages)}`);
}
console.log('✅ Spoken languages correctly left empty when only programming languages exist.');

// ── 3. Test Generic Synthetic Disambiguation Suite ─────────────────────────
console.log('\n--- 3. Testing Synthetic Language Disambiguation & Optional Sections ---');

const syntheticDisambiguationDoc = {
  plain_text: '',
  structured_elements: [
    { type: 'title', text: 'Alex Taylor' },
    { type: 'paragraph', text: 'alex.taylor@example.org | +1 555-0100 | San Francisco, CA' },
    
    // Skills with both Programming and Spoken Languages
    { type: 'section_header', text: 'Skills' },
    { type: 'paragraph', text: 'Languages: Rust, TypeScript, Python, C++, SQL' },
    { type: 'paragraph', text: 'Frameworks: Next.js, Express, TailwindCSS' },

    // Explicit Spoken Languages Section
    { type: 'section_header', text: 'Languages' },
    { type: 'paragraph', text: 'English (Native), Spanish (Fluent), German (Conversational)' },

    // Real Certifications section
    { type: 'section_header', text: 'Certifications' },
    { type: 'paragraph', text: 'AWS Certified Solutions Architect - Associate | Amazon Web Services | 2023' },
    { type: 'paragraph', text: 'CKA: Certified Kubernetes Administrator - Linux Foundation (2022)' },

    // Real Custom Section (e.g. Volunteer Work)
    { type: 'section_header', text: 'Volunteer Work' },
    { type: 'list_item', text: '• Mentored 25 high school students in STEM fundamentals.' },
    { type: 'list_item', text: '• Organized regional science fairs.' },
  ],
};

const mappedSynthetic = structuredResumeMapperService.mapDoclingToStructuredResume(syntheticDisambiguationDoc);

// 1. Technical Skills should contain programming languages
if (!mappedSynthetic.skills.languages.includes('Rust') || !mappedSynthetic.skills.languages.includes('TypeScript')) {
  throw new Error(`Technical languages missing in skills.languages: ${JSON.stringify(mappedSynthetic.skills.languages)}`);
}
// 2. Spoken languages should contain English, Spanish, German and NO programming tokens
if (mappedSynthetic.languages.length !== 3) {
  throw new Error(`Expected 3 spoken languages, got ${mappedSynthetic.languages.length}: ${JSON.stringify(mappedSynthetic.languages)}`);
}
const hasProgrammingInSpoken = mappedSynthetic.languages.some(l => /rust|typescript|python|c\+\+|sql/i.test(l));
if (hasProgrammingInSpoken) {
  throw new Error(`Programming language leaked into spoken languages: ${JSON.stringify(mappedSynthetic.languages)}`);
}
console.log('✅ Technical vs Spoken languages strictly separated into respective canonical fields.');

// 3. Certifications should contain the 2 valid certs
if (mappedSynthetic.certifications.length !== 2) {
  throw new Error(`Expected 2 certifications, got ${mappedSynthetic.certifications.length}: ${JSON.stringify(mappedSynthetic.certifications)}`);
}
console.log('✅ Certifications correctly populated when explicit section is present.');

// 4. Custom section contains Volunteer Work and NO canonical fields
if (mappedSynthetic.customSections.length !== 1 || !mappedSynthetic.customSections[0].title.includes('Volunteer')) {
  throw new Error(`Custom sections mismatch: ${JSON.stringify(mappedSynthetic.customSections)}`);
}
console.log('✅ Custom sections strictly contain genuinely distinct sections.');

// 5. Verify optional sections when omitted remain empty arrays
if (mappedSynthetic.publications.length !== 0 || mappedSynthetic.patents.length !== 0) {
  throw new Error('Non-existent optional sections were incorrectly populated!');
}
console.log('✅ Non-existent optional sections (publications, patents) remain empty [].');

// ── 4. Test Nested Headings, Compound Skills, Slash Tokens & Cert Integrity ───
console.log('\n--- 4. Testing Nested Headings, Compound Skills & Slash Tokens ---');

const nestedDoclingDoc = {
  plain_text: '',
  structured_elements: [
    { type: 'title', text: 'Sarah Connor', level: 1 },
    { type: 'paragraph', text: 'sarah.connor@example.com | +1 415-555-0144 | Los Angeles, CA | linkedin.com/in/sarahconnor | github.com/sarahconnor' },
    
    // Summary
    { type: 'section_header', text: 'Professional Summary', level: 2 },
    { type: 'paragraph', text: 'Senior Full Stack Cloud Engineer with 8+ years designing microservices, CI/CD pipelines, and high-volume data platforms.' },

    // Technical Skills with Compound Categories and Slash-Containing Names
    { type: 'section_header', text: 'Technical Skills', level: 2 },
    { type: 'paragraph', text: 'Programming Languages: TypeScript, Python, Go, Java, PL/SQL' },
    { type: 'paragraph', text: 'Frameworks & Developer Tools: React, Next.js, Node.js, Express, FastAPI, Vite' },
    { type: 'paragraph', text: 'Databases & Storage: PostgreSQL, MongoDB, Redis, Elasticsearch' },
    { type: 'paragraph', text: 'Cloud & DevOps: AWS, Docker, Kubernetes, Terraform, CI/CD, GitHub Actions' },
    { type: 'paragraph', text: 'Specializations: UI/UX Design, TCP/IP Networking, Microservices' },

    // Work Experience with Nested Section Headers (Level 3 headings for roles)
    { type: 'section_header', text: 'Work Experience', level: 2 },
    { type: 'section_header', text: 'Lead Cloud Architect | Cyberdyne Systems', level: 3 },
    { type: 'paragraph', text: 'March 2022 – Present | Sunnyvale, CA' },
    { type: 'list_item', text: '• Engineered automated CI/CD deployment workflows supporting 200+ microservices.' },
    { type: 'list_item', text: '• Optimized PostgreSQL and Redis data layer, reducing p99 latency by 50%.' },

    { type: 'section_header', text: 'Senior Software Engineer | Skynet Technologies', level: 3 },
    { type: 'paragraph', text: 'June 2018 – February 2022 | Los Angeles, CA' },
    { type: 'list_item', text: '• Designed event-driven Kafka stream processing pipelines handling 10M events/day.' },
    { type: 'list_item', text: '• Implemented secure authentication with zero-trust networking protocols.' },

    // Education with Nested Section Header (Level 3 heading for degree)
    { type: 'section_header', text: 'Education', level: 2 },
    { type: 'section_header', text: 'Bachelor of Science in Computer Science', level: 3 },
    { type: 'paragraph', text: 'University of California, Los Angeles | 2014 – 2018 | GPA: 3.9 / 4.0' },
    { type: 'paragraph', text: 'Relevant Coursework: Distributed Systems, Operating Systems, Database Management' },

    // Projects with Nested Section Header (Level 3 heading for project)
    { type: 'section_header', text: 'Projects', level: 2 },
    { type: 'section_header', text: 'Automated CI/CD Pipeline Orchestrator | github.com/sarahconnor/pipeline-orch', level: 3 },
    { type: 'list_item', text: '• Built distributed pipeline manager in Go, Docker, and Redis with webhook triggers.' },
    { type: 'paragraph', text: 'Technologies: Go, Redis, Docker, CI/CD, gRPC' },

    // Certifications with Hyphenated Title and Pipe Delimited Issuer
    { type: 'section_header', text: 'Certifications', level: 2 },
    { type: 'paragraph', text: 'AWS Certified Solutions Architect - Associate | Amazon Web Services | 2023' },
    { type: 'paragraph', text: 'Google Cloud Certified - Professional Cloud Architect | Google Cloud | 2022' },

    // Positions of Responsibility (Genuine Custom Section)
    { type: 'section_header', text: 'Positions of Responsibility', level: 2 },
    { type: 'list_item', text: '• Lead Organizer, Southern California Cloud & DevOps Meetup (2022 – Present)' },
  ],
};

const mappedNested = structuredResumeMapperService.mapDoclingToStructuredResume(nestedDoclingDoc);

// 1. Verify Experience count and details
if (mappedNested.experience.length !== 2) {
  throw new Error(`Expected 2 experience entries, got ${mappedNested.experience.length}: ${JSON.stringify(mappedNested.experience)}`);
}
if (mappedNested.experience[0].company !== 'Cyberdyne Systems' || mappedNested.experience[0].title !== 'Lead Cloud Architect') {
  throw new Error(`Experience 0 role mismatch: ${JSON.stringify(mappedNested.experience[0])}`);
}
if (mappedNested.experience[1].company !== 'Skynet Technologies' || mappedNested.experience[1].title !== 'Senior Software Engineer') {
  throw new Error(`Experience 1 role mismatch: ${JSON.stringify(mappedNested.experience[1])}`);
}
if (mappedNested.experience[0].bullets.length !== 2 || mappedNested.experience[1].bullets.length !== 2) {
  throw new Error(`Experience bullets lost or corrupted: ${JSON.stringify(mappedNested.experience)}`);
}
console.log('✅ Experience: Nested level 3 headings preserved as entries with complete bullets and dates.');

// 2. Verify Education count and details
if (mappedNested.education.length !== 1) {
  throw new Error(`Expected 1 education entry, got ${mappedNested.education.length}: ${JSON.stringify(mappedNested.education)}`);
}
if (!mappedNested.education[0].degree.includes('Bachelor of Science') || !mappedNested.education[0].school.includes('University of California')) {
  throw new Error(`Education fields mismatch: ${JSON.stringify(mappedNested.education[0])}`);
}
if (mappedNested.education[0].gpa !== '3.9 / 4.0' || !mappedNested.education[0].coursework.includes('Distributed Systems')) {
  throw new Error(`Education GPA/coursework mismatch: ${JSON.stringify(mappedNested.education[0])}`);
}
console.log('✅ Education: Nested degree header preserved with clean school, degree, GPA, and coursework.');

// 3. Verify Projects count, techStack, and repoUrl
if (mappedNested.projects.length !== 1) {
  throw new Error(`Expected 1 project entry, got ${mappedNested.projects.length}: ${JSON.stringify(mappedNested.projects)}`);
}
if (!mappedNested.projects[0].name.includes('Automated CI/CD Pipeline Orchestrator')) {
  throw new Error(`Project name mismatch: ${JSON.stringify(mappedNested.projects[0])}`);
}
if (!mappedNested.projects[0].techStack.includes('CI/CD') || !mappedNested.projects[0].techStack.includes('Go')) {
  throw new Error(`Project techStack mismatch (CI/CD missing or split): ${JSON.stringify(mappedNested.projects[0].techStack)}`);
}
console.log('✅ Projects: Nested project header preserved with repoUrl, bullets, and intact techStack.');

// 4. Verify Compound Skill Categories and Protected Slash Tokens
if (!mappedNested.skills.databases.includes('PostgreSQL') || !mappedNested.skills.databases.includes('MongoDB')) {
  throw new Error(`Databases & Storage failed to map to skills.databases: ${JSON.stringify(mappedNested.skills)}`);
}
if (!mappedNested.skills.frameworks.includes('React') || !mappedNested.skills.frameworks.includes('Next.js')) {
  throw new Error(`Frameworks & Developer Tools failed to map to skills.frameworks: ${JSON.stringify(mappedNested.skills)}`);
}
if (!mappedNested.skills.cloudDevOps.includes('CI/CD') || !mappedNested.skills.languages.includes('PL/SQL')) {
  throw new Error(`Protected slash tokens (CI/CD, PL/SQL) corrupted: ${JSON.stringify(mappedNested.skills)}`);
}
// Ensure frameworks are NOT duplicated into libraries
if (mappedNested.skills.libraries.length > 0) {
  throw new Error(`Frameworks duplicated into libraries: ${JSON.stringify(mappedNested.skills.libraries)}`);
}
console.log('✅ Skills: Compound categories (Databases & Storage, Frameworks & Developer Tools) mapped correctly with intact slash tokens (CI/CD, PL/SQL).');

// 5. Verify Certification Title / Issuer Integrity
if (mappedNested.certifications.length !== 2) {
  throw new Error(`Expected 2 certifications, got ${mappedNested.certifications.length}: ${JSON.stringify(mappedNested.certifications)}`);
}
if (mappedNested.certifications[0].title !== 'AWS Certified Solutions Architect - Associate' || mappedNested.certifications[0].issuer !== 'Amazon Web Services') {
  throw new Error(`Cert 0 title/issuer mismatch: ${JSON.stringify(mappedNested.certifications[0])}`);
}
if (mappedNested.certifications[1].title !== 'Google Cloud Certified - Professional Cloud Architect' || mappedNested.certifications[1].issuer !== 'Google Cloud') {
  throw new Error(`Cert 1 title/issuer mismatch: ${JSON.stringify(mappedNested.certifications[1])}`);
}
console.log('✅ Certifications: Hyphenated titles and pipe-separated issuers preserved with 100% fidelity.');

// 6. Verify Custom Sections only contains Positions of Responsibility (no leaked job/degree/project entries)
if (mappedNested.customSections.length !== 1 || mappedNested.customSections[0].title !== 'Positions of Responsibility') {
  throw new Error(`Custom sections contaminated: ${JSON.stringify(mappedNested.customSections)}`);
}
console.log('✅ Custom Sections: No core sections leaked; only genuine Positions of Responsibility section preserved.');

console.log('\n🎉 ALL CANONICAL MAPPING REGRESSION TESTS PASSED WITH 100% ACCURACY!');

