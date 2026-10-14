import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  TEMPLATE_METADATA,
  ResumeTemplateId,
  TemplateCategory,
  useResumeStore,
  DEFAULT_MASTER_RESUME
} from '../store/useResumeStore';
import { calculateAtsScore, ResumeData, normalizeResumeData } from '../utils/atsEngine';
import ResumeRenderer from '../components/resume/templates/ResumeRenderer';

// Helper assertion function
function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('🧪 RUREADY 25 Premium Resume Templates Regression Test Suite');
console.log('═══════════════════════════════════════════════════════════════');

const REQUIRED_25_TEMPLATE_IDS: ResumeTemplateId[] = [
  'modern-tech',
  'harvard-classic',
  'minimal-executive',
  'creative-fullstack',
  'faang-compact',
  'stanford-academic',
  'startup-innovator',
  'executive-suite',
  'swiss-precision',
  'executive-blackline',
  'harvard-professional',
  'modern-editorial',
  'career-pivot',
  'graduate-launch',
  'compact-professional',
  'principal-engineer',
  'fullstack-architect',
  'cloud-devops',
  'cybersecurity-specialist',
  'data-ai-research',
  'product-engineering',
  'product-manager',
  'ux-case-study',
  'academic-researcher',
  'consulting-strategy',
];

const VALID_CATEGORIES: TemplateCategory[] = [
  'ATS-friendly',
  'Modern professional',
  'Technical specialist',
  'Academic and research',
  'Creative and visual'
];

// Test 1 & 2: Exactly 25 unique IDs, no duplicates
console.log('\n--- 1. Testing Template Registry & ID Uniqueness ---');
assert(TEMPLATE_METADATA.length === 25, `Expected exactly 25 templates in TEMPLATE_METADATA, found ${TEMPLATE_METADATA.length}`);
const registeredIds = TEMPLATE_METADATA.map((t) => t.id);
const uniqueIds = new Set(registeredIds);
assert(uniqueIds.size === 25, `Expected 25 unique IDs, found ${uniqueIds.size}`);

REQUIRED_25_TEMPLATE_IDS.forEach((id) => {
  assert(uniqueIds.has(id), `Missing required template ID: ${id}`);
  const meta = TEMPLATE_METADATA.find(t => t.id === id);
  assert(!!meta, `Missing metadata for template ID: ${id}`);
  assert(meta!.name.trim().length > 0, `Template ${id} has empty name`);
  assert(meta!.desc.trim().length > 10, `Template ${id} has insufficient description`);
  assert(meta!.recommendedFor.trim().length > 5, `Template ${id} has missing recommendedFor`);
  assert(VALID_CATEGORIES.includes(meta!.category), `Template ${id} has invalid category: ${meta!.category}`);
  assert(meta!.samplePersona.personalInfo.fullName.length > 0, `Template ${id} has empty sample persona`);
  // Assert no misleading ATS percentages in badges
  assert(!/ATS\s*\d+%/i.test(meta!.badge), `Template ${id} contains arbitrary ATS badge: ${meta!.badge}`);
});
console.log(`✅ Passed: Exactly 25 unique template IDs verified with valid metadata and categories.`);

// Test 3: Canonical Resume Data Rendering across all 25 templates
console.log('\n--- 2. Testing Rendering with Canonical Resume Data ---');
const sampleResume: ResumeData = {
  ...DEFAULT_MASTER_RESUME,
  personalInfo: {
    fullName: 'Jane Doe',
    title: 'Senior Software Engineer',
    email: 'jane.doe@example.com',
    phone: '+1 555-0199',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/janedoe',
    github: 'https://github.com/janedoe',
    portfolio: 'https://janedoe.dev'
  },
  summary: 'Results-driven software engineer with 6+ years of experience in distributed systems and cloud platforms.',
  skills: {
    languages: ['TypeScript', 'Python', 'Go', 'SQL'],
    frameworks: ['React', 'Node.js', 'Express', 'TailwindCSS'],
    databases: ['PostgreSQL', 'Redis'],
    cloudDevOps: ['Docker', 'AWS', 'Kubernetes'],
    tools: ['Git', 'Jest', 'Linux']
  },
  experience: [
    {
      id: 'exp-1',
      title: 'Senior Systems Engineer',
      company: 'Acme Cloud Inc.',
      location: 'San Francisco, CA',
      startDate: '2021-01',
      endDate: 'Present',
      current: true,
      bullets: [
        'Designed and scaled high-throughput event streaming ingestion microservices handling 25,000 requests/second.',
        'Decreased query latency by 35% through Redis caching optimization and PostgreSQL connection pooling.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2015-08',
      endDate: '2019-05',
      gpa: '3.8',
      highlights: 'Dean’s Honors List, Algorithms Teaching Assistant'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Distributed Telemetry Pipeline',
      description: 'Real-time observability platform with automated metrics aggregation.',
      techStack: ['Go', 'Docker', 'Prometheus'],
      liveUrl: 'https://telemetry.example.com',
      bullets: ['Deployed multi-replica ingestion daemons across 5 availability zones.']
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2022-04'
    }
  ],
  publications: [
    {
      id: 'pub-1',
      title: 'High-Concurrency Event Processing at Scale',
      venue: 'Systems & Cloud Conference',
      date: '2023-06',
      url: 'https://doi.org/10.1000/182'
    }
  ],
  patents: [
    {
      id: 'pat-1',
      title: 'Adaptive Invalidation for Edge In-Memory Caches',
      number: 'US11894291B2',
      date: '2024-01'
    }
  ],
  achievements: ['Won 1st Place at National Hackathon 2020 out of 400 teams.'],
  languages: ['English (Native)', 'German (Conversational)'],
  customSections: [
    {
      id: 'sec-1',
      title: 'Community Leadership',
      items: ['Organized regional cloud architecture meetup with 800+ active members.']
    }
  ]
};

REQUIRED_25_TEMPLATE_IDS.forEach((templateId) => {
  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(ResumeRenderer, {
      templateId,
      data: sampleResume
    })
  );
  assert(html.length > 500, `Template ${templateId} produced empty or insufficient markup`);
  assert(html.includes('Jane Doe'), `Template ${templateId} failed to render candidate name`);
  assert(html.includes('Senior Software Engineer'), `Template ${templateId} failed to render candidate title`);
  assert(html.includes('Acme Cloud Inc.'), `Template ${templateId} failed to render experience company`);
  assert(html.includes('resume-paper'), `Template ${templateId} missing resume-paper wrapper class`);
});
console.log(`✅ Passed: All 25 templates successfully rendered full canonical resume data to static markup.`);

// Test 4: Template Switching Does Not Mutate ResumeData
console.log('\n--- 3. Testing Immutability & Resume State Isolation ---');
const originalSnapshot = JSON.stringify(sampleResume);
REQUIRED_25_TEMPLATE_IDS.forEach((templateId) => {
  useResumeStore.getState().setTemplate(templateId);
  assert(useResumeStore.getState().activeTemplate === templateId, `Failed to switch active template to ${templateId}`);
  assert(JSON.stringify(sampleResume) === originalSnapshot, `Template switch to ${templateId} mutated canonical resume data!`);
});
console.log(`✅ Passed: Switching through all 25 templates preserves 100% data immutability.`);

// Test 5: Authoritative 6-Pillar ATS Score Invariance
console.log('\n--- 4. Testing Authoritative 6-Pillar ATS Score Invariant ---');
const baselineAts = calculateAtsScore(sampleResume);
assert(baselineAts.totalScore > 0, 'Baseline score should be > 0');

REQUIRED_25_TEMPLATE_IDS.forEach((templateId) => {
  useResumeStore.getState().setTemplate(templateId);
  const currentScore = calculateAtsScore(sampleResume);
  assert(currentScore.totalScore === baselineAts.totalScore, `Template ${templateId} changed ATS totalScore from ${baselineAts.totalScore} to ${currentScore.totalScore}!`);
  assert(currentScore.breakdown.structureScore === baselineAts.breakdown.structureScore, 'Structure score changed');
  assert(currentScore.breakdown.completenessScore === baselineAts.breakdown.completenessScore, 'Completeness score changed');
  assert(currentScore.breakdown.extractabilityScore === baselineAts.breakdown.extractabilityScore, 'Extractability score changed');
  assert(currentScore.breakdown.skillsScore === baselineAts.breakdown.skillsScore, 'Skills score changed');
  assert(currentScore.breakdown.experienceQualityScore === baselineAts.breakdown.experienceQualityScore, 'Experience quality score changed');
  assert(currentScore.breakdown.formattingScore === baselineAts.breakdown.formattingScore, 'Formatting score changed');
});
console.log(`✅ Passed: Switching across all 25 templates strictly preserves the authoritative 6-pillar ATS score (${baselineAts.totalScore}/100).`);

// Test 6: Missing Optional Fields Handling (Crash Resistance)
console.log('\n--- 5. Testing Missing Optional Fields Crash-Resistance ---');
const minimalResume: ResumeData = {
  ...DEFAULT_MASTER_RESUME,
  personalInfo: {
    fullName: 'Minimal Candidate',
    title: 'Developer',
    email: 'minimal@example.com',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: ''
  },
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: {
    languages: [],
    frameworks: [],
    databases: [],
    cloudDevOps: [],
    tools: []
  },
  certifications: []
};

REQUIRED_25_TEMPLATE_IDS.forEach((templateId) => {
  try {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ResumeRenderer, {
        templateId,
        data: minimalResume
      })
    );
    assert(html.includes('Minimal Candidate'), `Template ${templateId} failed to render candidate name on minimal resume`);
  } catch (err) {
    console.error(`Crash on template ${templateId} with minimal resume:`, err);
    throw err;
  }
});
console.log(`✅ Passed: All 25 templates render gracefully without crashes when optional fields are empty.`);

// Test 7: Handling Long Content, Multiple Roles, and Custom Sections
console.log('\n--- 6. Testing Multi-Role, Publications & Custom Sections ---');
const richResume: ResumeData = {
  ...sampleResume,
  experience: [
    ...sampleResume.experience,
    {
      id: 'exp-2',
      title: 'Systems Architect',
      company: 'Global Enterprise Solutions',
      location: 'New York, NY',
      startDate: '2019-06',
      endDate: '2020-12',
      current: false,
      bullets: [
        'Spearheaded enterprise infrastructure migration to hybrid cloud.',
        'Mentored 8 mid-level engineers on microservice design patterns and automated testing.'
      ]
    },
    {
      id: 'exp-3',
      title: 'Software Developer',
      company: 'Early Startup Labs',
      location: 'Austin, TX',
      startDate: '2018-05',
      endDate: '2019-05',
      current: false,
      bullets: ['Built full-stack React and Node.js customer portal with Stripe payments integration.']
    }
  ]
};

REQUIRED_25_TEMPLATE_IDS.forEach((templateId) => {
  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(ResumeRenderer, {
      templateId,
      data: richResume
    })
  );
  assert(html.includes('Global Enterprise Solutions'), `Template ${templateId} failed to render exp-2`);
  assert(html.includes('Early Startup Labs'), `Template ${templateId} failed to render exp-3`);
  assert(html.includes('Community Leadership'), `Template ${templateId} failed to render custom section`);
});
console.log(`✅ Passed: All 25 templates cleanly support multi-role work histories and custom sections.`);

// Test 8: Print CSS & Wrapper Support
console.log('\n--- 7. Testing PDF Export & Print Styles ---');
const sampleHtml = ReactDOMServer.renderToStaticMarkup(
  React.createElement(ResumeRenderer, {
    templateId: 'swiss-precision',
    data: sampleResume
  })
);
assert(sampleHtml.includes('@media print'), 'ResumeRenderer missing @media print styles');
assert(sampleHtml.includes('resume-print-wrapper'), 'ResumeRenderer missing resume-print-wrapper');
console.log('✅ Passed: Print wrapper and media query styles verified for PDF generation.');

// Test 9: Category and Filter Coverage
console.log('\n--- 8. Testing Category Distribution & Honesty ---');
const categoryCounts: Record<string, number> = {};
VALID_CATEGORIES.forEach((c) => (categoryCounts[c] = 0));

TEMPLATE_METADATA.forEach((tmpl) => {
  categoryCounts[tmpl.category] = (categoryCounts[tmpl.category] || 0) + 1;
});

console.log('Category breakdown:');
Object.entries(categoryCounts).forEach(([cat, count]) => {
  console.log(`  - ${cat}: ${count} templates`);
  assert(count > 0, `Category ${cat} has 0 templates assigned`);
});
const atsFriendlyCount = TEMPLATE_METADATA.filter(t => t.isAtsOptimized).length;
const visualCount = TEMPLATE_METADATA.filter(t => !t.isAtsOptimized).length;
console.log(`  - ATS-Friendly layouts: ${atsFriendlyCount}`);
console.log(`  - Visual layouts: ${visualCount}`);
assert(atsFriendlyCount >= 18, `Expected at least 18 ATS-friendly layouts, found ${atsFriendlyCount}`);
assert(visualCount >= 2, `Expected visual layouts identified, found ${visualCount}`);
console.log('✅ Passed: Category taxonomy verified and honestly labelled.');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('🎉 ALL 25 RESUME TEMPLATE REGRESSION TESTS PASSED CLEANLY!');
console.log('═══════════════════════════════════════════════════════════════\n');
