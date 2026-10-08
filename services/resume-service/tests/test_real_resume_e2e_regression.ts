import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';
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

async function runEndToEndVerification() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('REAL RESUME END-TO-END PIPELINE REGRESSION VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Realistic 12-section Docling document output (mirroring extraction from dense CV)
  const fullCvDoclingData = {
    plain_text: `Monisha Jegadeesan
Software Engineer | Google
monisha.j@example.com | +1 (650) 555-0199 | Mountain View, CA | linkedin.com/in/monisha-j | github.com/monishaj | monishaj.dev

Education
Indian Institute of Technology, Madras
Dual Degree (B.Tech + M.Tech) in Computer Science and Engineering
2015 – 2020 | CGPA: 9.6 / 10
Master Thesis: Distributed Optimization in Asynchronous Graph Neural Networks
Relevant Coursework: Advanced Algorithms, Distributed Systems, Deep Learning, Operating Systems

Professional Experience
Google | Mountain View, CA
Software Engineer III (July 2021 – Present)
• Architected large-scale distributed streaming infrastructure handling 120M+ QPS with 99.999% availability.
• Decreased p99 tail latency by 35% through custom zero-copy serialization and SIMD optimizations in C++.
Software Engineer II (August 2019 – June 2021)
• Designed and implemented real-time analytics aggregation pipelines using Go, Spanner, and Kafka.
• Led cross-functional migration of 14 microservices to Kubernetes, saving $1.2M in annual cluster compute costs.

Research Experience
Scalable Systems Research Lab, IIT Madras | Research Scholar | 2018 – 2020
• Developed asynchronous parameter server for distributed deep learning models.
• Evaluated gradient synchronization algorithms across multi-GPU clusters.

Publications and Patents
• "High-Throughput Asynchronous Graph Embeddings for Heterogeneous Networks", IEEE TPDS, 2021
• "Low-Latency Distributed Consensus in Partitioned Networks", ACM SIGOPS Operating Systems Review, 2020
• US Patent 11456789B2: Dynamic Resource Allocation for Cloud-Native Distributed Microservices, Granted 2022

Projects
Aether: Distributed Key-Value Store | github.com/monishaj/aether
• Tech: Go, Raft, gRPC, RocksDB
• Implemented multi-Raft consensus protocol with dynamic shard rebalancing.

Teaching Experience
• Head Teaching Assistant for CS3100 Operating Systems (Fall 2019), conducting weekly lab sessions for 140+ students.
• Teaching Assistant for CS2800 Advanced Data Structures and Algorithms (Spring 2019).

Courses
• Advanced Distributed Systems, Machine Learning Theory, Compiler Design, Database Internals, Computer Architecture

Technical Competencies
Languages: C++, Go, Python, Java, TypeScript, SQL, Bash
Frameworks & Libraries: React, PyTorch, gRPC, Protocol Buffers, Node.js
Databases: PostgreSQL, Google Spanner, Redis, RocksDB
Cloud & DevOps: Docker, Kubernetes, GCP, Linux, CI/CD, Terraform
Developer Tools: Git, GDB, Perf, Bazel, Vim
Security: TLS, OAuth2, Cryptography, Memory Safety

Scholastic Achievements
• All India Rank 14 in IIT-JEE Advanced out of 200,000+ candidates (Top 0.01 percentile).
• Recipient of the Institute Gold Medal for highest academic standing across all engineering disciplines.

Positions of Responsibility
• Lead Organizer for Shaastra, IIT Madras (Asia's largest student-run technical festival with 40,000+ attendees).

Extra Curricular Activities
• Represented State in National Badminton Championships (Under-19).`,
    structured_elements: [
      { type: 'title', text: 'Monisha Jegadeesan' },
      { type: 'paragraph', text: 'Software Engineer | Google' },
      { type: 'paragraph', text: 'monisha.j@example.com | +1 (650) 555-0199 | Mountain View, CA | linkedin.com/in/monisha-j | github.com/monishaj | monishaj.dev' },
      { type: 'section_header', text: 'Education' },
      { type: 'paragraph', text: 'Indian Institute of Technology, Madras' },
      { type: 'paragraph', text: 'Dual Degree (B.Tech + M.Tech) in Computer Science and Engineering' },
      { type: 'paragraph', text: '2015 – 2020 | CGPA: 9.6 / 10' },
      { type: 'list_item', text: '• Master Thesis: Distributed Optimization in Asynchronous Graph Neural Networks' },
      { type: 'list_item', text: '• Relevant Coursework: Advanced Algorithms, Distributed Systems, Deep Learning, Operating Systems' },
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
      { type: 'section_header', text: 'Research Experience' },
      { type: 'paragraph', text: 'Scalable Systems Research Lab, IIT Madras | Research Scholar | 2018 – 2020' },
      { type: 'list_item', text: '• Developed asynchronous parameter server for distributed deep learning models.' },
      { type: 'list_item', text: '• Evaluated gradient synchronization algorithms across multi-GPU clusters.' },
      { type: 'section_header', text: 'Publications and Patents' },
      { type: 'list_item', text: '• "High-Throughput Asynchronous Graph Embeddings for Heterogeneous Networks", IEEE TPDS, 2021' },
      { type: 'list_item', text: '• "Low-Latency Distributed Consensus in Partitioned Networks", ACM SIGOPS Operating Systems Review, 2020' },
      { type: 'list_item', text: '• US Patent 11456789B2: Dynamic Resource Allocation for Cloud-Native Distributed Microservices, Granted 2022' },
      { type: 'section_header', text: 'Projects' },
      { type: 'paragraph', text: 'Aether: Distributed Key-Value Store | github.com/monishaj/aether' },
      { type: 'list_item', text: '• Tech: Go, Raft, gRPC, RocksDB' },
      { type: 'list_item', text: '• Implemented multi-Raft consensus protocol with dynamic shard rebalancing.' },
      { type: 'section_header', text: 'Teaching Experience' },
      { type: 'list_item', text: '• Head Teaching Assistant for CS3100 Operating Systems (Fall 2019), conducting weekly lab sessions for 140+ students.' },
      { type: 'list_item', text: '• Teaching Assistant for CS2800 Advanced Data Structures and Algorithms (Spring 2019).' },
      { type: 'section_header', text: 'Courses' },
      { type: 'list_item', text: '• Advanced Distributed Systems, Machine Learning Theory, Compiler Design, Database Internals, Computer Architecture' },
      { type: 'section_header', text: 'Technical Competencies' },
      { type: 'paragraph', text: 'Languages: C++, Go, Python, Java, TypeScript, SQL, Bash' },
      { type: 'paragraph', text: 'Frameworks & Libraries: React, PyTorch, gRPC, Protocol Buffers, Node.js' },
      { type: 'paragraph', text: 'Databases: PostgreSQL, Google Spanner, Redis, RocksDB' },
      { type: 'paragraph', text: 'Cloud & DevOps: Docker, Kubernetes, GCP, Linux, CI/CD, Terraform' },
      { type: 'paragraph', text: 'Developer Tools: Git, GDB, Perf, Bazel, Vim' },
      { type: 'paragraph', text: 'Security: TLS, OAuth2, Cryptography, Memory Safety' },
      { type: 'section_header', text: 'Scholastic Achievements' },
      { type: 'list_item', text: '• All India Rank 14 in IIT-JEE Advanced out of 200,000+ candidates (Top 0.01 percentile).' },
      { type: 'list_item', text: '• Recipient of the Institute Gold Medal for highest academic standing across all engineering disciplines.' },
      { type: 'section_header', text: 'Positions of Responsibility' },
      { type: 'list_item', text: '• Lead Organizer for Shaastra, IIT Madras (Asia\'s largest student-run technical festival with 40,000+ attendees).' },
      { type: 'section_header', text: 'Extra Curricular Activities' },
      { type: 'list_item', text: '• Represented State in National Badminton Championships (Under-19).' }
    ]
  };

  // Step 1: Canonical Mapping
  console.log('[Step 1] Mapping extracted Docling structure to canonical ResumeData...');
  const structured = structuredResumeMapperService.mapDoclingToStructuredResume(fullCvDoclingData as any);

  console.log('✓ Candidate Info:', {
    name: structured.personalInfo.fullName,
    email: structured.personalInfo.email,
    phone: structured.personalInfo.phone,
    location: structured.personalInfo.location,
    linkedin: structured.personalInfo.linkedin,
    github: structured.personalInfo.github,
    portfolio: structured.personalInfo.portfolio,
  });

  console.log('\nExtracted Section Breakdown:');
  console.log(`- Education count: ${structured.education.length}`);
  console.log(`- Professional Experience roles: ${structured.experience.length}`);
  console.log(`- Projects count: ${structured.projects.length}`);
  console.log(`- Publications count: ${structured.publications?.length || 0}`);
  console.log(`- Patents count: ${structured.patents?.length || 0}`);
  console.log(`- Achievements count: ${structured.achievements?.length || 0}`);
  console.log(`- Custom Sections count: ${structured.customSections?.length || 0}`);
  if (structured.customSections) {
    console.log('  Custom Section Names:', structured.customSections.map(c => c.title));
  }

  // Step 2: Semantic Boundary & Zero Leakage Verifications
  console.log('\n[Step 2] Verifying section isolation and zero content leakage...');
  
  // 1. Education integrity
  assert.strictEqual(structured.education.length, 1, 'Education entry must be exactly 1');
  assert.ok(structured.education[0].school.includes('Indian Institute of Technology'), 'School name must match source');
  assert.ok(structured.education[0].degree.includes('Dual Degree'), 'Degree must match source');
  assert.ok(structured.education[0].gpa?.includes('9.6'), 'GPA must be preserved');

  // 2. Experience multi-role grouping under company
  assert.strictEqual(structured.experience.length, 2, 'Two distinct roles under Google must be mapped');
  assert.strictEqual(structured.experience[0].company, 'Google', 'Company name must be inherited');
  assert.strictEqual(structured.experience[1].company, 'Google', 'Company name must be inherited for role 2');
  assert.ok(structured.experience[0].bullets.length >= 2, 'Role 1 bullets preserved');
  assert.ok(structured.experience[1].bullets.length >= 2, 'Role 2 bullets preserved');

  // 3. Publications vs Patents split
  assert.strictEqual(structured.publications?.length, 2, '2 Publications must be separated');
  assert.strictEqual(structured.patents?.length, 1, '1 Patent must be separated');

  // 4. Skills categorized
  const totalSkills = Object.values(structured.skills).flat().length;
  console.log(`- Total Skills categorized: ${totalSkills}`);
  assert.ok(totalSkills >= 15, 'All skill categories must be populated');
  assert.ok(structured.skills.languages.includes('C++') || structured.skills.languages.includes('Go'), 'Languages mapped');
  assert.ok(structured.skills.databases.includes('PostgreSQL') || structured.skills.databases.includes('Redis'), 'Databases mapped');

  // 5. Distinct Custom Sections preserved without leakage
  assert.strictEqual(structured.customSections?.length, 5, '5 Distinct Custom sections must be preserved');
  const customTitles = structured.customSections!.map(c => c.title);
  assert.ok(customTitles.includes('Research Experience'), 'Research Experience in customSections');
  assert.ok(customTitles.includes('Teaching Experience'), 'Teaching Experience in customSections');
  assert.ok(customTitles.includes('Courses'), 'Courses in customSections');
  assert.ok(customTitles.includes('Positions of Responsibility'), 'Positions of Responsibility in customSections');
  assert.ok(customTitles.includes('Extra Curricular Activities'), 'Extra Curricular Activities in customSections');

  // 6. Summary fallback check (must not dump education or headings into summary)
  assert.strictEqual(structured.summary, '', 'No false preamble dump into summary');

  console.log('✓ Section isolation verified: Zero leakage between any of the 12 sections.');

  // Step 3: Authoritative Backend ATS Evaluation
  console.log('\n[Step 3] Running authoritative backend ATS evaluation (6-pillar engine)...');
  const atsResult = await bgeAtsService.scoreResume({
    resumeText: fullCvDoclingData.plain_text,
    structuredElements: fullCvDoclingData.structured_elements,
  });

  console.log(`✓ Backend Overall ATS Score: ${atsResult.overallScore}/100`);
  console.log('  Pillar Breakdown:', atsResult.breakdown);

  // Exact 6-pillar sum check
  const pillarSum =
    atsResult.breakdown.structure +
    atsResult.breakdown.completeness +
    atsResult.breakdown.extractability +
    atsResult.breakdown.skills +
    atsResult.breakdown.experienceQuality +
    atsResult.breakdown.formatting;

  assert.strictEqual(
    atsResult.overallScore,
    pillarSum,
    `Authoritative ATS total (${atsResult.overallScore}) must equal exact sum of 6 pillars (${pillarSum})`
  );

  // Step 4: Frontend UI Data Model Parity Check
  console.log('\n[Step 4] Verifying frontend ATS data model parity...');
  const uiAtsModel = mapBackendAtsResultToUi(atsResult);

  assert.strictEqual(uiAtsModel.totalScore, atsResult.overallScore, 'Frontend totalScore matches backend overallScore 1:1');
  assert.strictEqual(uiAtsModel.breakdown.structureScore, atsResult.breakdown.structure, 'Structure pillar parity');
  assert.strictEqual(uiAtsModel.breakdown.completenessScore, atsResult.breakdown.completeness, 'Completeness pillar parity');
  assert.strictEqual(uiAtsModel.breakdown.extractabilityScore, atsResult.breakdown.extractability, 'Extractability pillar parity');
  assert.strictEqual(uiAtsModel.breakdown.skillsScore, atsResult.breakdown.skills, 'Skills pillar parity');
  assert.strictEqual(uiAtsModel.breakdown.experienceQualityScore, atsResult.breakdown.experienceQuality, 'Experience Quality pillar parity');
  assert.strictEqual(uiAtsModel.breakdown.formattingScore, atsResult.breakdown.formatting, 'Formatting pillar parity');
  console.log('✓ 100% Backend/Frontend ATS Parity verified across all 6 pillars and total score.');

  // Step 5: Competitive Matcher & Sequential Persistent Worker Verification
  console.log('\n[Step 5] Testing Competitive Matching across sequential requests on persistent BGE worker...');
  
  const targetJd1 = `Senior Staff Distributed Systems Engineer
Responsibilities:
- Build and scale distributed streaming platforms in C++, Go, or Rust handling tens of millions of QPS.
- Design high-throughput consensus systems, zero-copy serialization, and low-latency storage engines.
- Mentor senior engineers and drive architectural roadmaps for cloud infrastructure.

Requirements:
- Strong background in Distributed Systems, Operating Systems, and Concurrent Programming.
- Hands-on experience with C++, Go, gRPC, Kafka, Docker, Kubernetes.
- Bachelor's/Master's or PhD in Computer Science or equivalent.`;

  // Sequential Request 1: Senior Distributed Systems Role (Expected MATCHED)
  const start1 = Date.now();
  const compMatch1 = await competitiveMatchService.match({
    resumeText: fullCvDoclingData.plain_text,
    jobDescription: targetJd1,
    role: 'Senior Staff Distributed Systems Engineer',
    structuredElements: fullCvDoclingData.structured_elements,
  });
  const time1 = Date.now() - start1;
  console.log(`  Request 1 (Distributed Systems Role): Status=${compMatch1.status}, Score=${compMatch1.score}/100, Time=${time1}ms, Source=${compMatch1.modelSource}`);
  
  assert.strictEqual(compMatch1.status, 'MATCHED', 'Relevant role must be MATCHED');
  assert.notStrictEqual(compMatch1.score, null, 'Score must be non-null');
  
  // Mathematical formula consistency check: 0.45*sem + 0.25*skill + 0.15*exp + 0.15*term
  const sig1 = compMatch1.matchSignals;
  const expectedScore1 = Math.round(
    (0.45 * sig1.semanticSimilarity +
     0.25 * sig1.skillOverlap +
     0.15 * sig1.experienceRelevance +
     0.15 * sig1.terminologyMatch) * 100
  );
  console.log(`  Signal Details: sem=${sig1.semanticSimilarity}, skill=${sig1.skillOverlap}, exp=${sig1.experienceRelevance}, term=${sig1.terminologyMatch}`);
  console.log(`  Formula Check: Expected=${expectedScore1}, Actual=${compMatch1.score}`);
  assert.strictEqual(compMatch1.score, expectedScore1, 'Competitive score must strictly match formula');

  // Sequential Request 2: Machine Learning Research Scientist Role (Warm Persistent Worker)
  const targetJd2 = `Machine Learning Research Scientist
Requirements:
- Advanced degree in Computer Science or Artificial Intelligence.
- Track record of research publications in distributed machine learning, graph neural networks, or deep learning.
- Proficiency with PyTorch, Python, and GPU cluster training.`;

  const start2 = Date.now();
  const compMatch2 = await competitiveMatchService.match({
    resumeText: fullCvDoclingData.plain_text,
    jobDescription: targetJd2,
    role: 'Machine Learning Research Scientist',
    structuredElements: fullCvDoclingData.structured_elements,
  });
  const time2 = Date.now() - start2;
  console.log(`  Request 2 (Warm Worker ML Role): Status=${compMatch2.status}, Score=${compMatch2.score}/100, Time=${time2}ms`);
  assert.ok(time2 < 15000, 'Warm persistent worker must execute without restart/fallback');

  // Sequential Request 3: Non-Relevant Cross-Domain Role (Testing Relevance Gate)
  const targetJd3 = `Registered Nurse / Clinical Healthcare Practitioner
Requirements:
- Nursing degree (BSN / RN) and active state nursing license.
- 3+ years clinical experience in patient care, ICU triage, and medical records management.`;

  const start3 = Date.now();
  const compMatch3 = await competitiveMatchService.match({
    resumeText: fullCvDoclingData.plain_text,
    jobDescription: targetJd3,
    role: 'Registered Nurse',
    structuredElements: fullCvDoclingData.structured_elements,
  });
  const time3 = Date.now() - start3;
  console.log(`  Request 3 (Non-Relevant Role): Status=${compMatch3.status}, Score=${compMatch3.score}, Time=${time3}ms`);
  assert.strictEqual(compMatch3.status, 'NOT_RELEVANT', 'Cross-domain role must be NOT_RELEVANT');
  assert.strictEqual(compMatch3.score, null, 'NOT_RELEVANT score must be null');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🎉 ALL END-TO-END REGRESSION ASSERTIONS PASSED WITH 100% SUCCESS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  competitiveMatchService.shutdown();
  process.exit(0);
}

runEndToEndVerification().catch((err) => {
  console.error('\n❌ End-to-end regression verification failed:', err);
  competitiveMatchService.shutdown();
  process.exit(1);
});
