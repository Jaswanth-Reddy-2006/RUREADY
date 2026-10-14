import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ResumeData, calculateAtsScore, AtsScoreResult, extractKeywordsFromJd, normalizeResumeData } from '../utils/atsEngine';

export type TemplateCategory =
  | 'ATS-friendly'
  | 'Modern professional'
  | 'Technical specialist'
  | 'Academic and research'
  | 'Creative and visual';

export type ResumeTemplateId =
  | 'modern-tech'
  | 'harvard-classic'
  | 'minimal-executive'
  | 'creative-fullstack'
  | 'faang-compact'
  | 'stanford-academic'
  | 'startup-innovator'
  | 'executive-suite'
  | 'swiss-precision'
  | 'executive-blackline'
  | 'harvard-professional'
  | 'modern-editorial'
  | 'career-pivot'
  | 'graduate-launch'
  | 'compact-professional'
  | 'principal-engineer'
  | 'fullstack-architect'
  | 'cloud-devops'
  | 'cybersecurity-specialist'
  | 'data-ai-research'
  | 'product-engineering'
  | 'product-manager'
  | 'ux-case-study'
  | 'academic-researcher'
  | 'consulting-strategy';

export interface TemplateMetadata {
  id: ResumeTemplateId;
  name: string;
  category: TemplateCategory;
  tag: string;
  badge: string;
  desc: string;
  layoutStyle: string;
  recommendedFor: string;
  highlights: string[];
  isAtsOptimized: boolean;
  samplePersona: ResumeData;
}

export interface ResumeVersion {
  id: string;
  name: string;
  targetRole: string;
  targetCompany: string;
  targetJd?: string;
  resumeData: ResumeData;
  templateId: ResumeTemplateId;
  atsScore: number | null;
  atsAnalysis?: AtsScoreResult | null;
  usedInApplicationsCount: number;
  lastUpdated: string;
}

export interface ResumeStoreState {
  // Master Resume Data & Saved Versions
  masterResume: ResumeData;
  resumeVersions: ResumeVersion[];
  activityLogs: Array<{ id: string; type: string; title: string; details: string; timestamp: string }>;

  // Selected visual template
  activeTemplate: ResumeTemplateId;

  // Job-Targeted Customization
  isTailoringActive: boolean;
  targetJobTitle: string;
  targetCompanyName: string;
  targetJobDescription: string;
  tailoredResume: ResumeData | null;

  // Actions
  setTemplate: (templateId: ResumeTemplateId) => void;
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  updateSummary: (summary: string) => void;
  
  // Resume Version Actions
  createResumeVersion: (name: string, targetRole: string, targetCompany: string, targetJd?: string, customResumeData?: ResumeData) => string;
  updateResumeVersion: (id: string, updates: Partial<ResumeVersion>) => void;
  deleteResumeVersion: (id: string) => void;
  duplicateResumeVersion: (id: string) => string;
  saveAtsAnalysis: (versionId: string, result: AtsScoreResult) => void;
  addActivityLog: (type: string, title: string, details: string) => void;

  // Experience CRUD
  addExperience: (exp: Omit<ResumeData['experience'][0], 'id'>) => void;
  updateExperience: (id: string, exp: Partial<ResumeData['experience'][0]>) => void;
  removeExperience: (id: string) => void;
  addExperienceBullet: (expId: string, bullet: string) => void;
  updateExperienceBullet: (expId: string, bulletIndex: number, newBullet: string) => void;
  removeExperienceBullet: (expId: string, bulletIndex: number) => void;

  // Education CRUD
  addEducation: (edu: Omit<ResumeData['education'][0], 'id'>) => void;
  updateEducation: (id: string, edu: Partial<ResumeData['education'][0]>) => void;
  removeEducation: (id: string) => void;

  // Projects CRUD
  addProject: (proj: Omit<ResumeData['projects'][0], 'id'>) => void;
  updateProject: (id: string, proj: Partial<ResumeData['projects'][0]>) => void;
  removeProject: (id: string) => void;
  addProjectBullet: (projId: string, bullet: string) => void;
  updateProjectBullet: (projId: string, bulletIndex: number, newBullet: string) => void;
  removeProjectBullet: (projId: string, bulletIndex: number) => void;

  // Skills CRUD
  updateSkillsCategory: (category: keyof ResumeData['skills'], skills: string[]) => void;
  addSkillToCategory: (category: keyof ResumeData['skills'], skill: string) => void;
  removeSkillFromCategory: (category: keyof ResumeData['skills'], skill: string) => void;
  addMissingKeywordToSkills: (keyword: string) => void;

  // Certifications CRUD
  addCertification: (cert: Omit<ResumeData['certifications'][0], 'id'>) => void;
  updateCertification: (id: string, cert: Partial<ResumeData['certifications'][0]>) => void;
  removeCertification: (id: string) => void;

  // Publications CRUD
  addPublication: (pub: Omit<NonNullable<ResumeData['publications']>[0], 'id'>) => void;
  updatePublication: (id: string, pub: Partial<NonNullable<ResumeData['publications']>[0]>) => void;
  removePublication: (id: string) => void;

  // Patents CRUD
  addPatent: (pat: Omit<NonNullable<ResumeData['patents']>[0], 'id'>) => void;
  updatePatent: (id: string, pat: Partial<NonNullable<ResumeData['patents']>[0]>) => void;
  removePatent: (id: string) => void;

  // Achievements CRUD
  addAchievement: (achievement: string) => void;
  updateAchievement: (index: number, value: string) => void;
  removeAchievement: (index: number) => void;
  setAchievements: (achievements: string[]) => void;

  // Languages CRUD
  addLanguage: (language: string) => void;
  updateLanguage: (index: number, value: string) => void;
  removeLanguage: (index: number) => void;
  setLanguages: (languages: string[]) => void;

  // Custom Sections CRUD
  addCustomSection: (title: string, items?: string[]) => void;
  updateCustomSection: (id: string, title: string, items: string[]) => void;
  removeCustomSection: (id: string) => void;
  addCustomSectionItem: (sectionId: string, item: string) => void;
  removeCustomSectionItem: (sectionId: string, itemIndex: number) => void;

  // Job Tailoring
  setTargetJob: (title: string, company: string, jd: string) => void;
  toggleTailoring: (active?: boolean) => void;
  generateTailoredResume: (targetJd?: string, jobTitle?: string, company?: string) => void;
  resetTailoring: () => void;

  // Profile Sync & Extraction
  syncFromProfile: (profile: any) => void;
  extractAndLoadResume: (parsedData: Partial<ResumeData>) => void;
  resetToDefaultResume: () => void;
  clearResumeData: () => void;

  // STAR Bullet replacement helper
  applyStarRewrite: (bulletAuditId: string, rewrittenBullet: string) => void;
}

/**
 * Empty default resume skeleton.
 * Sample candidate data lives exclusively in TEMPLATE_METADATA.samplePersona
 * (used only for template preview thumbnails).
 */
export const DEFAULT_MASTER_RESUME: ResumeData = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
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

/**
 * Rich sample persona used ONLY for template preview thumbnails.
 * Never loaded into the user's masterResume or any editing context.
 */
const SAMPLE_PERSONA_BASE: ResumeData = {
  personalInfo: {
    fullName: 'Alex Morgan',
    title: 'Senior Full Stack & Distributed Systems Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA / Remote',
    linkedin: 'https://linkedin.com/in/alexmorgan-dev',
    github: 'https://github.com/alexmorgan-tech',
    portfolio: 'https://alexmorgan.dev'
  },
  summary: 'Architecturally driven Senior Full Stack Engineer with 4+ years of expertise in designing high-throughput distributed microservices, scalable React/TypeScript web apps, and low-latency PostgreSQL/Redis caching tiers. Proven track record scaling applications to 250,000+ daily active users with 99.95% uptime.',
  experience: [
    {
      id: 'exp-1',
      title: 'Senior Software Engineer',
      company: 'CloudScale Technologies',
      location: 'San Francisco, CA',
      startDate: '2023-01',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected high-throughput microservices using Node.js, TypeScript, and PostgreSQL handling $12M+ monthly transaction volume.',
        'Engineered distributed Redis caching layers with proactive invalidation, decreasing p99 database query latency by 42% across 250k daily active users.',
        'Spearheaded automated CI/CD pipelines via Docker and GitHub Actions, slashing release deployment cycles from 3 hours to 8 minutes with 92% automated test coverage.',
        'Mentored 6 junior engineers on distributed systems patterns, database indexing, and STAR code review standards.'
      ]
    },
    {
      id: 'exp-2',
      title: 'Full Stack Software Engineer',
      company: 'ScaleMetric Systems Inc.',
      location: 'Austin, TX',
      startDate: '2021-06',
      endDate: '2022-12',
      current: false,
      bullets: [
        'Built enterprise analytics dashboards using React, TypeScript, and TailwindCSS with sub-second page rendering for 50,000+ enterprise accounts.',
        'Designed RESTful & GraphQL API contracts connecting microservices with PostgreSQL and ElasticSearch clusters.',
        'Eliminated memory leak bottlenecks in WebSocket streaming pipelines, boosting server concurrency capacity by 3.5x under peak load.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.Tech in Computer Science & Engineering',
      school: 'National Institute of Technology',
      location: 'India',
      startDate: '2017-08',
      endDate: '2021-05',
      gpa: '3.85 / 4.00',
      highlights: 'Distinction in Distributed Systems, Algorithms & Database Management Systems. President of Open Source Engineering Society.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'PulseFlow — Real-Time Event Streaming & Analytics Platform',
      description: 'Distributed streaming platform processing 40,000 events/sec with sub-50ms query latency, automated anomaly detection, and interactive metric dashboards.',
      techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'TailwindCSS'],
      liveUrl: 'https://pulseflow.demo.dev',
      repoUrl: 'https://github.com/alexmorgan-tech/pulseflow',
      bullets: [
        'Engineered multi-tier architecture isolating ingestion pipelines, telemetry processing, and interactive monitoring dashboards.',
        'Implemented WebSocket bidirectional streaming with sub-50ms latency for real-time traffic spike alerts.'
      ]
    },
    {
      id: 'proj-2',
      name: 'HyperCache — Distributed In-Memory Cache Invalidator',
      description: 'High-concurrency caching utility built on Redis pub/sub and Raft consensus for deterministic multi-region cache coherence.',
      techStack: ['Go', 'Redis', 'Docker', 'gRPC', 'PostgreSQL'],
      repoUrl: 'https://github.com/alexmorgan-tech/hypercache',
      bullets: [
        'Designed lightweight gRPC sidecar daemon synchronizing invalidation messages across 8 containerized application replicas in under 15ms.',
        'Wrote automated benchmarks simulating 10,000 concurrent writes without dirty reads or cache stampedes.'
      ]
    }
  ],
  skills: {
    languages: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL', 'HTML5/CSS3'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Express', 'TailwindCSS', 'FastAPI'],
    databases: ['PostgreSQL', 'Redis', 'MongoDB', 'Elasticsearch'],
    cloudDevOps: ['Docker', 'Kubernetes', 'AWS (S3, ECS, RDS)', 'CI/CD (GitHub Actions)', 'Terraform'],
    tools: ['Git', 'Linux', 'Jest', 'Cypress', 'Vite', 'Postman', 'GraphQL']
  },
  certifications: [
    {
      id: 'cert-1',
      title: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023-09'
    },
    {
      id: 'cert-2',
      title: 'Certified Kubernetes Application Developer (CKAD)',
      issuer: 'Linux Foundation & CNCF',
      date: '2022-11'
    }
  ]
};

// ─── 25 Distinct Premium Templates (NO user-specific names) ───
export const TEMPLATE_METADATA: TemplateMetadata[] = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    category: 'Modern professional',
    tag: 'Silicon Valley Standard',
    badge: 'Popular',
    desc: 'High-contrast typography with colored technical badges, clean horizontal rules, and modern headers.',
    layoutStyle: 'Modern',
    isAtsOptimized: true,
    recommendedFor: 'Full-Stack Developers, Frontend Engineers, Cloud & DevOps Specialists',
    highlights: ['Single-page density', 'Tag-based skills matrix', 'STAR bullet metrics emphasis'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Alex Morgan',
        title: 'Senior Full Stack Software Engineer',
        email: 'alex.morgan@techmail.io',
        phone: '+1 (415) 890-1234',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/alexmorgan-tech',
        github: 'https://github.com/alexmorgan-dev',
        portfolio: 'https://alexmorgan.dev'
      }
    }
  },
  {
    id: 'harvard-classic',
    name: 'Harvard Classic',
    category: 'ATS-friendly',
    tag: 'Ivy League Traditional',
    badge: 'Traditional',
    desc: 'Timeless single-column serif formatting favored by Fortune 500 recruiters and academic institutions.',
    layoutStyle: 'Traditional',
    isAtsOptimized: true,
    recommendedFor: 'Campus Graduates, Software Engineers, Quant Developers, Management Consultants',
    highlights: ['Legacy ATS machine-readable format', 'Conservative serif hierarchy', 'Clean academic date alignments'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Eleanor Vance',
        title: 'Systems Software Engineer & Algorithm Specialist',
        email: 'eleanor.vance@alumni.harvard.edu',
        phone: '+1 (617) 495-1000',
        location: 'Cambridge, MA',
        linkedin: 'https://linkedin.com/in/eleanor-vance',
        github: 'https://github.com/evance-systems',
        portfolio: 'https://eleanorvance.com'
      }
    }
  },
  {
    id: 'minimal-executive',
    name: 'Minimalist Executive',
    category: 'Modern professional',
    tag: 'Staff & Principal Lead',
    badge: 'High Density',
    desc: 'Crisp typographic layout engineered for maximum information density without visual clutter.',
    layoutStyle: 'Minimal',
    isAtsOptimized: true,
    recommendedFor: 'Staff Software Engineers, Tech Leads, Engineering Managers, Architects',
    highlights: ['Maximum bullet density', 'Subtle border dividers', 'Zero wasted whitespace'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'David Chen',
        title: 'Principal Distributed Systems Architect',
        email: 'd.chen@enterprise-arch.net',
        phone: '+1 (206) 555-0192',
        location: 'Seattle, WA',
        linkedin: 'https://linkedin.com/in/davidchen-architect',
        github: 'https://github.com/dchen-distributed',
        portfolio: 'https://davidchen.io'
      }
    }
  },
  {
    id: 'creative-fullstack',
    name: 'Creative Fullstack',
    category: 'Creative and visual',
    tag: 'Brand Accent & Portfolio',
    badge: 'Two-Column',
    desc: 'Two-column structured layout highlighting a persistent skills matrix and highlighted production projects.',
    layoutStyle: 'Two-column',
    isAtsOptimized: false,
    recommendedFor: 'UI/UX Engineers, Product Engineers, Creative Technologists, Mobile Developers',
    highlights: ['Visual skill rating bars', 'Sidebar contact & links', 'Showcased repository links'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Sarah Jenkins',
        title: 'Lead Frontend & Design Systems Engineer',
        email: 'sarah.jenkins@designcode.studio',
        phone: '+1 (312) 770-4321',
        location: 'Chicago, IL / Remote',
        linkedin: 'https://linkedin.com/in/sarahjenkins-ui',
        github: 'https://github.com/sarahj-creative',
        portfolio: 'https://sarahjenkins.design'
      }
    }
  },
  {
    id: 'faang-compact',
    name: 'FAANG High-Yield',
    category: 'ATS-friendly',
    tag: 'Big Tech Engineering',
    badge: 'Recruiter Favorite',
    desc: 'Ultra-dense single-page engineering layout favored by recruiters at Google, Meta, and Amazon.',
    layoutStyle: 'Compact',
    isAtsOptimized: true,
    recommendedFor: 'Targeting FAANG / Tier-1 Tech, High-Volume Job Applications, Backend Engineers',
    highlights: ['Single-page guaranteed', 'Metrics-first bold keywords', 'Tight line spacing'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Marcus Hayes',
        title: 'Infrastructure & Cloud Platform Engineer',
        email: 'm.hayes@cloudengineers.org',
        phone: '+1 (408) 555-8822',
        location: 'Sunnyvale, CA',
        linkedin: 'https://linkedin.com/in/marcushayes-infra',
        github: 'https://github.com/mhayes-cloud',
        portfolio: 'https://marcushayes.dev'
      }
    }
  },
  {
    id: 'stanford-academic',
    name: 'Stanford Academic',
    category: 'Academic and research',
    tag: 'Research & Scholarly CV',
    badge: 'Academic Standard',
    desc: 'Formal scholarly layout prioritizing university distinctions, research papers, GPA, and coursework.',
    layoutStyle: 'Academic',
    isAtsOptimized: true,
    recommendedFor: 'MS/PhD Candidates, Research Scientists, Machine Learning Researchers, Interns',
    highlights: ['Education first hierarchy', 'Research grants & honors', 'Standard scholarly serif'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Dr. Maya Patel',
        title: 'Machine Learning Research Scientist',
        email: 'maya.patel@stanford.alumni.org',
        phone: '+1 (650) 723-2300',
        location: 'Palo Alto, CA',
        linkedin: 'https://linkedin.com/in/mayapatel-ml',
        github: 'https://github.com/mayapatel-research',
        portfolio: 'https://mayapatel.ai'
      }
    }
  },
  {
    id: 'startup-innovator',
    name: 'Startup Innovator',
    category: 'Modern professional',
    tag: 'Venture & High-Growth',
    badge: 'Modern Accent',
    desc: 'Dynamic, modern format designed for agile engineers who build 0-to-1 products and ship fast.',
    layoutStyle: 'Modern',
    isAtsOptimized: true,
    recommendedFor: 'Founding Engineers, Early-Stage Hires, Hackathon Winners, Full-Stack Builders',
    highlights: ['0-to-1 impact metrics', 'Product launch badges', 'Modern indigo accents'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: "Liam O'Connor",
        title: 'Founding Full Stack Engineer',
        email: 'liam@buildfast.dev',
        phone: '+1 (917) 555-0345',
        location: 'New York, NY',
        linkedin: 'https://linkedin.com/in/liam-oconnor-dev',
        github: 'https://github.com/liam-builder',
        portfolio: 'https://liamoconnor.tech'
      }
    }
  },
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    category: 'Modern professional',
    tag: 'Leadership & Director',
    badge: 'Executive',
    desc: 'Sophisticated corporate design featuring centered header, strategic milestone banner, and governance points.',
    layoutStyle: 'Executive',
    isAtsOptimized: true,
    recommendedFor: 'VP of Engineering, CTO, Engineering Directors, Technical Product Leaders',
    highlights: ['Executive summary callout', 'Strategic P&L metrics', 'Leadership governance framing'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Sophia Sterling',
        title: 'VP of Engineering & Technology Strategy',
        email: 'sophia.sterling@leadership-executive.com',
        phone: '+1 (212) 555-9011',
        location: 'New York, NY',
        linkedin: 'https://linkedin.com/in/sophiasterling-exec',
        github: 'https://github.com/ssterling-lead',
        portfolio: 'https://sophiasterling.com'
      }
    }
  },
  {
    id: 'swiss-precision',
    name: 'Swiss Precision',
    category: 'ATS-friendly',
    tag: 'Disciplined Grid & Whitespace',
    badge: 'Monochrome',
    desc: 'Minimal Swiss-inspired typography, disciplined grid, elegant whitespace, and crisp monochrome hierarchy.',
    layoutStyle: 'Minimal',
    isAtsOptimized: true,
    recommendedFor: 'Systems Engineers, Quantitative Analysts, Architects, Precision-Focused Professionals',
    highlights: ['Strict architectural grid', 'High-contrast typography', 'Tabular alignment'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Julian Meier',
        title: 'Principal Systems & Performance Engineer',
        email: 'julian.meier@zurich-tech.ch',
        phone: '+41 44 632 11 11',
        location: 'Zurich, Switzerland',
        linkedin: 'https://linkedin.com/in/julian-meier-systems',
        github: 'https://github.com/jmeier-swiss',
        portfolio: 'https://julianmeier.design'
      }
    }
  },
  {
    id: 'executive-blackline',
    name: 'Executive Blackline',
    category: 'Modern professional',
    tag: 'Director & C-Suite Authority',
    badge: 'Leadership',
    desc: 'Senior professional and director-level resume with a strong nameplate, leadership summary, and executive experience hierarchy.',
    layoutStyle: 'Executive',
    isAtsOptimized: true,
    recommendedFor: 'Directors, VPs, Heads of Engineering, Senior Enterprise Leaders',
    highlights: ['Authoritative nameplate bar', 'Leadership scope callout', 'Governance & board milestones'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Richard Vance Thorne',
        title: 'Chief Technology Officer & Engineering Director',
        email: 'richard.thorne@executive-advisory.io',
        phone: '+1 (202) 555-0188',
        location: 'Washington, DC / New York',
        linkedin: 'https://linkedin.com/in/richardvthorne',
        github: 'https://github.com/rvthorne-exec',
        portfolio: 'https://richardthorne.io'
      }
    }
  },
  {
    id: 'harvard-professional',
    name: 'Harvard Professional',
    category: 'ATS-friendly',
    tag: 'Consulting & Legal Gold Standard',
    badge: 'Traditional',
    desc: 'Traditional single-column, serif-inspired academic and consulting format with refined classical rules.',
    layoutStyle: 'Traditional',
    isAtsOptimized: true,
    recommendedFor: 'Strategy Consultants, Corporate Lawyers, Investment Bankers, Senior Economists',
    highlights: ['Flawless parsing layout', 'Classical serif typography', 'Flush-right aligned chronologies'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Arthur Kensington III',
        title: 'Principal Strategy & Management Consultant',
        email: 'arthur.kensington@alumni.harvard.edu',
        phone: '+1 (617) 555-0143',
        location: 'Boston, MA',
        linkedin: 'https://linkedin.com/in/arthur-kensington',
        github: 'https://github.com/akensington-consult',
        portfolio: 'https://kensingtonadvisory.com'
      }
    }
  },
  {
    id: 'modern-editorial',
    name: 'Modern Editorial',
    category: 'Modern professional',
    tag: 'Refined Typography & Rules',
    badge: 'Editorial',
    desc: 'Refined editorial typography, subtle rules, carefully spaced headings, and a premium document feel.',
    layoutStyle: 'Modern',
    isAtsOptimized: true,
    recommendedFor: 'Technical Writers, Strategists, Communications Leads, Senior Analysts',
    highlights: ['Balanced editorial leading', 'Subtle dividing rules', 'Sophisticated typographic contrast'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Camille Laurent',
        title: 'Staff Technical Communications & Product Strategist',
        email: 'camille.laurent@editorial-tech.fr',
        phone: '+33 1 42 68 55 00',
        location: 'Paris, France / Remote',
        linkedin: 'https://linkedin.com/in/camille-laurent-editorial',
        github: 'https://github.com/claurent-writings',
        portfolio: 'https://camillelaurent.press'
      }
    }
  },
  {
    id: 'career-pivot',
    name: 'Career Pivot',
    category: 'Modern professional',
    tag: 'Transferable Competencies',
    badge: 'Skills-Forward',
    desc: 'Skills-forward layout that highlights transferable capabilities, selected achievements, and relevant projects.',
    layoutStyle: 'Modern',
    isAtsOptimized: true,
    recommendedFor: 'Career Changers, Industry Switchers, Boot Camp Graduates, Returning Professionals',
    highlights: ['Prominent transferable matrix', 'Selected transition achievements', 'Hybrid functional chronology'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Elena Rostova',
        title: 'Software Engineer & Former Operations Lead',
        email: 'elena.rostova@career-transition.dev',
        phone: '+1 (415) 555-0177',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/elena-rostova-pivot',
        github: 'https://github.com/erostova-builds',
        portfolio: 'https://elenarostova.dev'
      }
    }
  },
  {
    id: 'graduate-launch',
    name: 'Graduate Launch',
    category: 'ATS-friendly',
    tag: 'Education-First & Internships',
    badge: 'Campus',
    desc: 'Designed for fresh graduates, internships, academic projects, certifications, and education-first presentation.',
    layoutStyle: 'Modern',
    isAtsOptimized: true,
    recommendedFor: 'University Graduates, Interns, Entry-Level Engineers, Fellowship Applicants',
    highlights: ['Education-first hierarchy', 'Showcased capstone projects', 'Coursework & honors callouts'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Ethan Zhang',
        title: 'Incoming Associate Software Engineer',
        email: 'ethan.zhang@university-grad.edu',
        phone: '+1 (206) 555-0165',
        location: 'Seattle, WA',
        linkedin: 'https://linkedin.com/in/ethan-zhang-cs',
        github: 'https://github.com/ezhang-launch',
        portfolio: 'https://ethanzhang.me'
      }
    }
  },
  {
    id: 'compact-professional',
    name: 'Compact Professional',
    category: 'ATS-friendly',
    tag: 'Space-Efficient Chronology',
    badge: 'Compact',
    desc: 'Space-efficient layout for experienced candidates with substantial work history, without sacrificing readability.',
    layoutStyle: 'Compact',
    isAtsOptimized: true,
    recommendedFor: 'Senior Engineers with 10+ Years History, Contractors, Multi-Role Professionals',
    highlights: ['Condensed vertical rhythm', 'Inline contact coordinates', 'Maximized content density'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Thomas Bradley',
        title: 'Lead Software Architect & Senior Consultant',
        email: 't.bradley@tech-consultancy.co.uk',
        phone: '+44 20 7946 0912',
        location: 'London, UK',
        linkedin: 'https://linkedin.com/in/thomasbradley-lead',
        github: 'https://github.com/tbradley-arch',
        portfolio: 'https://thomasbradley.net'
      }
    }
  },
  {
    id: 'principal-engineer',
    name: 'Principal Engineer',
    category: 'Technical specialist',
    tag: 'Architecture & System Scale',
    badge: 'Technical',
    desc: 'Architecture, technical leadership, engineering impact, distributed systems design, and mentoring.',
    layoutStyle: 'Technical',
    isAtsOptimized: true,
    recommendedFor: 'Principal Engineers, Staff Engineers, Chief Architects, Systems Fellows',
    highlights: ['Systems scale callouts', 'Architectural milestone bullets', 'Mentorship & patents section'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Dr. Raymond Scott',
        title: 'Principal Systems Architect & Technical Director',
        email: 'raymond.scott@distributed-systems.org',
        phone: '+1 (408) 555-0131',
        location: 'Santa Clara, CA',
        linkedin: 'https://linkedin.com/in/raymond-scott-principal',
        github: 'https://github.com/rscott-distributed',
        portfolio: 'https://raymondscott.systems'
      }
    }
  },
  {
    id: 'fullstack-architect',
    name: 'Full-Stack Architect',
    category: 'Technical specialist',
    tag: 'End-to-End Stack & Delivery',
    badge: 'Technical',
    desc: 'Technical stack, production projects, architecture decisions, and software delivery experience.',
    layoutStyle: 'Technical',
    isAtsOptimized: true,
    recommendedFor: 'Full-Stack Architects, Lead Developers, Solutions Engineers',
    highlights: ['4-tier tech taxonomy', 'Production systems showcase', 'Delivery lifecycle metrics'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Lucas Vasquez',
        title: 'Staff Full-Stack & Solutions Architect',
        email: 'lucas.vasquez@fullstack-arch.io',
        phone: '+1 (512) 555-0129',
        location: 'Austin, TX',
        linkedin: 'https://linkedin.com/in/lucasvasquez-arch',
        github: 'https://github.com/lvasquez-code',
        portfolio: 'https://lucasvasquez.dev'
      }
    }
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    category: 'Technical specialist',
    tag: 'Infrastructure, SRE & CI/CD',
    badge: 'Technical',
    desc: 'Cloud platforms, infrastructure, CI/CD, automation, observability, and certifications.',
    layoutStyle: 'Technical',
    isAtsOptimized: true,
    recommendedFor: 'DevOps Engineers, SREs, Cloud Architects, Platform Engineers',
    highlights: ['Dedicated cloud certs banner', 'IaC & CI/CD pipeline focus', 'SLA & uptime reliability metrics'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Kavita Sundaram',
        title: 'Staff Cloud Infrastructure & SRE Platform Lead',
        email: 'kavita.sundaram@cloud-platform.net',
        phone: '+1 (206) 555-0199',
        location: 'Seattle, WA',
        linkedin: 'https://linkedin.com/in/kavita-sundaram-sre',
        github: 'https://github.com/ksundaram-infra',
        portfolio: 'https://kavitasundaram.cloud'
      }
    }
  },
  {
    id: 'cybersecurity-specialist',
    name: 'Cybersecurity Specialist',
    category: 'Technical specialist',
    tag: 'Security, PenTesting & GRC',
    badge: 'Technical',
    desc: 'Security tools, authorized labs, defensive experience, certifications, and security projects.',
    layoutStyle: 'Technical',
    isAtsOptimized: true,
    recommendedFor: 'Security Engineers, Penetration Testers, SOC Analysts, AppSec Leads',
    highlights: ['Security clearances & certs', 'Threat modeling competencies', 'Defensive infrastructure bullets'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Nathaniel Drake',
        title: 'Senior Information Security & DevSecOps Engineer',
        email: 'nathaniel.drake@infosec-defense.org',
        phone: '+1 (703) 555-0182',
        location: 'Reston, VA',
        linkedin: 'https://linkedin.com/in/nathaniel-drake-sec',
        github: 'https://github.com/ndrake-security',
        portfolio: 'https://nathanieldrake.sec'
      },
      summary: 'Information Security and DevSecOps Engineer with 6+ years specializing in SIEM monitoring, vulnerability management, threat intelligence, and zero-trust cloud architecture. Proven track record mitigating 150+ critical CVEs across hybrid enterprise infrastructures.',
      skills: {
        languages: ['Python', 'Bash', 'PowerShell', 'Go', 'SQL'],
        frameworks: ['Threat Intelligence', 'MITRE ATT&CK', 'NIST CSF', 'OWASP Top 10', 'Zero Trust Architecture'],
        databases: ['PostgreSQL', 'Elasticsearch', 'Redis', 'BigQuery'],
        cloudDevOps: ['AWS Security Hub', 'Terraform', 'Docker', 'Kubernetes', 'GuardDuty'],
        tools: ['Splunk', 'Wireshark', 'Burp Suite', 'Tenable Nessus', 'CrowdStrike Falcon', 'Snort', 'Git']
      },
      projects: [
        {
          id: 'proj-cyber-1',
          name: 'SentinelGuard — Automated Threat Intelligence & SIEM Pipeline',
          description: 'Automated real-time log ingestion and threat correlation system integrating Splunk alerts with MITRE ATT&CK taxonomy.',
          techStack: ['Python', 'Splunk', 'Elasticsearch', 'Docker', 'Bash'],
          repoUrl: 'https://github.com/ndrake-security/sentinelguard',
          bullets: [
            'Engineered automated SIEM ingestion pipelines processing 50M+ security events daily with sub-second alert dispatch.',
            'Developed custom threat detection rules eliminating 45% of false positive alerts across enterprise endpoints.'
          ]
        },
        {
          id: 'proj-cyber-2',
          name: 'VulnSweep — Continuous CI/CD Vulnerability Scanner',
          description: 'DevSecOps automated container and dependency security audit gate integrated with GitHub Actions.',
          techStack: ['Go', 'Tenable Nessus', 'Docker', 'GitHub Actions'],
          repoUrl: 'https://github.com/ndrake-security/vulnsweep',
          bullets: [
            'Automated CVE scanning blocking high-severity container image vulnerabilities before production deployment.',
            'Reduced vulnerability resolution turnaround time from 14 days to 48 hours across 24 microservices.'
          ]
        }
      ],
      certifications: [
        {
          id: 'cert-cyber-1',
          title: 'Certified Information Systems Security Professional (CISSP)',
          issuer: '(ISC)²',
          date: '2023-05'
        },
        {
          id: 'cert-cyber-2',
          title: 'Certified Ethical Hacker (CEH)',
          issuer: 'EC-Council',
          date: '2022-08'
        }
      ]
    }
  },
  {
    id: 'data-ai-research',
    name: 'Data & AI Research',
    category: 'Academic and research',
    tag: 'Machine Learning & Neural Models',
    badge: 'Academic',
    desc: 'Data science, machine learning, research, technical publications, models, and measurable experimental findings.',
    layoutStyle: 'Academic',
    isAtsOptimized: true,
    recommendedFor: 'Machine Learning Engineers, AI Researchers, Data Scientists, Quant Modelers',
    highlights: ['Model architecture matrix', 'Experimental benchmark metrics', 'Peer-reviewed research links'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Dr. Aaron Levinson',
        title: 'Staff AI Research Scientist & Deep Learning Lead',
        email: 'aaron.levinson@ai-research-labs.org',
        phone: '+1 (617) 555-0193',
        location: 'Cambridge, MA',
        linkedin: 'https://linkedin.com/in/aaron-levinson-ai',
        github: 'https://github.com/alevinson-models',
        portfolio: 'https://aaronlevinson.ai'
      },
      summary: 'AI Research Scientist with a Ph.D. in Computer Science and 5+ years of experience leading deep learning architecture design, multimodal representation learning, and distributed LLM fine-tuning. First-author on 4 NeurIPS/ICLR publications with 1,200+ citations.',
      skills: {
        languages: ['Python', 'C++', 'CUDA', 'Julia', 'SQL'],
        frameworks: ['PyTorch', 'JAX', 'Hugging Face Transformers', 'TensorFlow', 'DeepSpeed', 'vLLM'],
        databases: ['Pinecone', 'Milvus', 'ChromaDB', 'PostgreSQL (pgvector)'],
        cloudDevOps: ['NVIDIA Slurm', 'AWS EC2 (H100/A100)', 'Docker', 'Kubernetes (KubeFlow)', 'Ray'],
        tools: ['Weights & Biases', 'Git', 'MLflow', 'Triton Inference Server', 'ONNX']
      },
      projects: [
        {
          id: 'proj-ai-1',
          name: 'NovaAlign — Parameter-Efficient Fine-Tuning for Multimodal LLMs',
          description: 'Open-source distributed framework for low-rank adaptation and alignment of 70B parameter multimodal architectures.',
          techStack: ['Python', 'PyTorch', 'DeepSpeed', 'Hugging Face', 'CUDA'],
          repoUrl: 'https://github.com/alevinson-models/nova-align',
          bullets: [
            'Architected distributed FP8 training pipelines scaling to 64 NVIDIA H100 GPUs with 94.2% linear scaling efficiency.',
            'Achieved 14% higher inference throughput and 3.2x memory savings compared to baseline LoRA implementations.'
          ]
        },
        {
          id: 'proj-ai-2',
          name: 'VectorSense — High-Dimensional Retrieval & Re-Ranking Engine',
          description: 'Sub-millisecond dense retrieval pipeline combining approximate nearest neighbors with cross-encoder re-ranking.',
          techStack: ['Python', 'C++', 'pgvector', 'Milvus', 'Triton'],
          repoUrl: 'https://github.com/alevinson-models/vector-sense',
          bullets: [
            'Built vector indexing architecture indexing 20M+ text embeddings with 98.7% recall at k=10 in 18ms latency.',
            'Deployed production microservice handling 4,000 queries per second with automated fallback caches.'
          ]
        }
      ],
      publications: [
        {
          id: 'pub-ai-1',
          title: 'Scaling Laws for Parameter-Efficient Multimodal Representation Learning',
          venue: 'Conference on Neural Information Processing Systems (NeurIPS)',
          date: '2024',
          url: 'https://doi.org/10.48550/arXiv.2405.00001'
        },
        {
          id: 'pub-ai-2',
          title: 'Sub-quadratic Attention Routing for Long-Context Sequence Modeling',
          venue: 'International Conference on Learning Representations (ICLR)',
          date: '2023',
          url: 'https://doi.org/10.48550/arXiv.2305.00002'
        }
      ],
      certifications: []
    }
  },
  {
    id: 'product-engineering',
    name: 'Product & Engineering',
    category: 'Technical specialist',
    tag: 'Feature Delivery & UX Impact',
    badge: 'Technical',
    desc: 'Product engineering, cross-functional collaboration, shipped features, and product outcomes.',
    layoutStyle: 'Modern',
    isAtsOptimized: true,
    recommendedFor: 'Product Engineers, Growth Engineers, Frontend Architects, Startup Builders',
    highlights: ['User impact metrics', 'Shipped product callouts', 'Cross-functional scope framing'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Clara Oswald',
        title: 'Lead Product Software Engineer',
        email: 'clara.oswald@shipped-product.io',
        phone: '+1 (347) 555-0158',
        location: 'Brooklyn, NY',
        linkedin: 'https://linkedin.com/in/clara-oswald-prod',
        github: 'https://github.com/coswald-product',
        portfolio: 'https://claraoswald.io'
      }
    }
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    category: 'Modern professional',
    tag: 'Launches, Prioritization & Growth',
    badge: 'Modern',
    desc: 'Product summary, product launches, ownership, prioritization, and verified business outcomes.',
    layoutStyle: 'Modern',
    isAtsOptimized: true,
    recommendedFor: 'Product Managers, Technical PMs, Group PMs, VP of Product',
    highlights: ['Problem-Solution-Impact format', 'User growth & retention numbers', 'Product methodology skills'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Priya Sharma',
        title: 'Lead Technical Product Manager',
        email: 'priya.sharma@product-leadership.com',
        phone: '+1 (415) 555-0149',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/priyasharma-pm',
        github: 'https://github.com/psharma-pm',
        portfolio: 'https://priyasharma.pm'
      }
    }
  },
  {
    id: 'ux-case-study',
    name: 'UX Case Study',
    category: 'Creative and visual',
    tag: 'Design Systems & Case Studies',
    badge: 'Two-Column',
    desc: 'Product design, research, case studies, design systems, and portfolio links, with a carefully controlled visual layout.',
    layoutStyle: 'Two-column',
    isAtsOptimized: false,
    recommendedFor: 'Product Designers, UX Researchers, Design System Leads, UI Specialists',
    highlights: ['Controlled two-column canvas', 'Dedicated design toolkit', 'Case study narrative highlights'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Mia Lindqvist',
        title: 'Staff Product Designer & Design Systems Lead',
        email: 'mia.lindqvist@design-systems.se',
        phone: '+46 8 123 45 67',
        location: 'Stockholm, Sweden / Remote',
        linkedin: 'https://linkedin.com/in/mialindqvist-ux',
        github: 'https://github.com/mlindqvist-design',
        portfolio: 'https://mialindqvist.design'
      }
    }
  },
  {
    id: 'academic-researcher',
    name: 'Academic Researcher',
    category: 'Academic and research',
    tag: 'Publications, Grants & Teaching',
    badge: 'Academic',
    desc: 'Education, research experience, publications, presentations, grants, teaching, and academic achievements.',
    layoutStyle: 'Academic',
    isAtsOptimized: true,
    recommendedFor: 'Postdocs, Professors, PhD Fellows, University Lecturers, Grant Researchers',
    highlights: ['Comprehensive scholarly CV format', 'Formatted publication bibliographies', 'Grants, fellowships & teaching'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Dr. Gregory Houseman',
        title: 'Associate Professor of Computer Science & Research Director',
        email: 'g.houseman@university-research.edu',
        phone: '+1 (312) 555-0196',
        location: 'Chicago, IL',
        linkedin: 'https://linkedin.com/in/ghouseman-academic',
        github: 'https://github.com/ghouseman-lab',
        portfolio: 'https://housemanlab.edu'
      }
    }
  },
  {
    id: 'consulting-strategy',
    name: 'Consulting & Strategy',
    category: 'Modern professional',
    tag: 'Executive Impact & Client Advisory',
    badge: 'Executive',
    desc: 'Structured executive summary, selected impact, analytical projects, leadership, and client-facing experience.',
    layoutStyle: 'Executive',
    isAtsOptimized: true,
    recommendedFor: 'Management Consultants, Corporate Strategy Managers, Engagement Managers',
    highlights: ['Executive engagement framing', 'Structured impact quantification', 'Practice area competencies'],
    samplePersona: {
      ...SAMPLE_PERSONA_BASE,
      personalInfo: {
        fullName: 'Victoria Sterling Chase',
        title: 'Engagement Manager & Strategy Practice Lead',
        email: 'victoria.chase@global-advisory-partners.com',
        phone: '+1 (212) 555-0144',
        location: 'New York, NY',
        linkedin: 'https://linkedin.com/in/victoriachase-strategy',
        github: 'https://github.com/vchase-consulting',
        portfolio: 'https://victoriachase.consulting'
      }
    }
  }
];

export const DEFAULT_RESUME_VERSIONS: ResumeVersion[] = [];

export const useResumeStore = create<ResumeStoreState>()(
  persist(
    (set, get) => ({
      masterResume: DEFAULT_MASTER_RESUME,
      resumeVersions: DEFAULT_RESUME_VERSIONS,
      activityLogs: [],
      activeTemplate: 'modern-tech',
      isTailoringActive: false,
      targetJobTitle: '',
      targetCompanyName: '',
      targetJobDescription: '',
      tailoredResume: null,

      setTemplate: (templateId: ResumeTemplateId) => {
        set({ activeTemplate: templateId });
      },

      createResumeVersion: (name, targetRole, targetCompany, targetJd, customData) => {
        const id = `ver_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const dataToUse = normalizeResumeData(customData || DEFAULT_MASTER_RESUME);
        const newVersion: ResumeVersion = {
          id,
          name,
          targetRole,
          targetCompany,
          targetJd,
          resumeData: dataToUse,
          templateId: get().activeTemplate,
          atsScore: null,
          usedInApplicationsCount: 0,
          lastUpdated: new Date().toISOString(),
        };

        set((state) => ({
          resumeVersions: [newVersion, ...state.resumeVersions],
        }));

        get().addActivityLog('VERSION', `Created ${name}`, `Targeted for ${targetRole} @ ${targetCompany}`);
        return id;
      },

      updateResumeVersion: (id, updates) => {
        set((state) => ({
          resumeVersions: state.resumeVersions.map((v) =>
            v.id === id
              ? {
                  ...v,
                  ...updates,
                  resumeData: updates.resumeData ? normalizeResumeData(updates.resumeData) : v.resumeData,
                  lastUpdated: new Date().toISOString()
                }
              : v
          ),
        }));
      },

      deleteResumeVersion: (id) => {
        set((state) => ({
          resumeVersions: state.resumeVersions.filter((v) => v.id !== id),
        }));
      },

      duplicateResumeVersion: (id) => {
        const target = get().resumeVersions.find((v) => v.id === id);
        if (!target) return id;
        const newId = `ver_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const copy: ResumeVersion = {
          ...JSON.parse(JSON.stringify(target)),
          id: newId,
          name: `${target.name} (Copy)`,
          lastUpdated: new Date().toISOString(),
          usedInApplicationsCount: 0,
        };
        set((state) => ({
          resumeVersions: [copy, ...state.resumeVersions],
        }));
        get().addActivityLog('VERSION', `Duplicated ${target.name}`, 'Created copy version.');
        return newId;
      },

      saveAtsAnalysis: (versionId, result) => {
        set((state) => ({
          resumeVersions: state.resumeVersions.map((v) =>
            v.id === versionId ? { ...v, atsScore: result.totalScore, atsAnalysis: result, lastUpdated: new Date().toISOString() } : v
          ),
        }));
        get().addActivityLog('ANALYSIS', `Ran ATS Analysis`, `Scored ${result.totalScore}% ATS Match.`);
      },

      addActivityLog: (type, title, details) => {
        set((state) => ({
          activityLogs: [
            {
              id: `log_${Date.now()}`,
              type,
              title,
              details,
              timestamp: new Date().toISOString(),
            },
            ...state.activityLogs,
          ],
        }));
      },

      updatePersonalInfo: (info) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            personalInfo: { ...state.masterResume.personalInfo, ...info }
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                personalInfo: { ...state.tailoredResume.personalInfo, ...info }
              }
            : null
        }));
      },

      updateSummary: (summary) => {
        set((state) => ({
          masterResume: { ...state.masterResume, summary },
          tailoredResume: state.tailoredResume
            ? { ...state.tailoredResume, summary }
            : null
        }));
      },

      // Experience CRUD
      addExperience: (exp) => {
        const newExp = { ...exp, id: `exp-${Date.now()}` };
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            experience: [newExp, ...state.masterResume.experience]
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                experience: [newExp, ...state.tailoredResume.experience]
              }
            : null
        }));
      },

      updateExperience: (id, exp) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            experience: state.masterResume.experience.map((e) =>
              e.id === id ? { ...e, ...exp } : e
            )
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                experience: state.tailoredResume.experience.map((e) =>
                  e.id === id ? { ...e, ...exp } : e
                )
              }
            : null
        }));
      },

      removeExperience: (id) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            experience: state.masterResume.experience.filter((e) => e.id !== id)
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                experience: state.tailoredResume.experience.filter((e) => e.id !== id)
              }
            : null
        }));
      },

      addExperienceBullet: (expId, bullet) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            experience: state.masterResume.experience.map((e) =>
              e.id === expId ? { ...e, bullets: [...e.bullets, bullet] } : e
            )
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                experience: state.tailoredResume.experience.map((e) =>
                  e.id === expId ? { ...e, bullets: [...e.bullets, bullet] } : e
                )
              }
            : null
        }));
      },

      updateExperienceBullet: (expId, bulletIndex, newBullet) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            experience: state.masterResume.experience.map((e) => {
              if (e.id !== expId) return e;
              const nextBullets = [...e.bullets];
              nextBullets[bulletIndex] = newBullet;
              return { ...e, bullets: nextBullets };
            })
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                experience: state.tailoredResume.experience.map((e) => {
                  if (e.id !== expId) return e;
                  const nextBullets = [...e.bullets];
                  nextBullets[bulletIndex] = newBullet;
                  return { ...e, bullets: nextBullets };
                })
              }
            : null
        }));
      },

      removeExperienceBullet: (expId, bulletIndex) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            experience: state.masterResume.experience.map((e) => {
              if (e.id !== expId) return e;
              return { ...e, bullets: e.bullets.filter((_, i) => i !== bulletIndex) };
            })
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                experience: state.tailoredResume.experience.map((e) => {
                  if (e.id !== expId) return e;
                  return { ...e, bullets: e.bullets.filter((_, i) => i !== bulletIndex) };
                })
              }
            : null
        }));
      },

      // Education CRUD
      addEducation: (edu) => {
        const newEdu = { ...edu, id: `edu-${Date.now()}` };
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            education: [newEdu, ...state.masterResume.education]
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                education: [newEdu, ...state.tailoredResume.education]
              }
            : null
        }));
      },

      updateEducation: (id, edu) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            education: state.masterResume.education.map((e) =>
              e.id === id ? { ...e, ...edu } : e
            )
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                education: state.tailoredResume.education.map((e) =>
                  e.id === id ? { ...e, ...edu } : e
                )
              }
            : null
        }));
      },

      removeEducation: (id) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            education: state.masterResume.education.filter((e) => e.id !== id)
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                education: state.tailoredResume.education.filter((e) => e.id !== id)
              }
            : null
        }));
      },

      // Projects CRUD
      addProject: (proj) => {
        const newProj = { ...proj, id: `proj-${Date.now()}` };
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            projects: [newProj, ...state.masterResume.projects]
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                projects: [newProj, ...state.tailoredResume.projects]
              }
            : null
        }));
      },

      updateProject: (id, proj) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            projects: state.masterResume.projects.map((p) =>
              p.id === id ? { ...p, ...proj } : p
            )
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                projects: state.tailoredResume.projects.map((p) =>
                  p.id === id ? { ...p, ...proj } : p
                )
              }
            : null
        }));
      },

      removeProject: (id) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            projects: state.masterResume.projects.filter((p) => p.id !== id)
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                projects: state.tailoredResume.projects.filter((p) => p.id !== id)
              }
            : null
        }));
      },

      addProjectBullet: (projId, bullet) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            projects: state.masterResume.projects.map((p) =>
              p.id === projId ? { ...p, bullets: [...p.bullets, bullet] } : p
            )
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                projects: state.tailoredResume.projects.map((p) =>
                  p.id === projId ? { ...p, bullets: [...p.bullets, bullet] } : p
                )
              }
            : null
        }));
      },

      updateProjectBullet: (projId, bulletIndex, newBullet) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            projects: state.masterResume.projects.map((p) => {
              if (p.id !== projId) return p;
              const nextBullets = [...p.bullets];
              nextBullets[bulletIndex] = newBullet;
              return { ...p, bullets: nextBullets };
            })
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                projects: state.tailoredResume.projects.map((p) => {
                  if (p.id !== projId) return p;
                  const nextBullets = [...p.bullets];
                  nextBullets[bulletIndex] = newBullet;
                  return { ...p, bullets: nextBullets };
                })
              }
            : null
        }));
      },

      removeProjectBullet: (projId, bulletIndex) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            projects: state.masterResume.projects.map((p) => {
              if (p.id !== projId) return p;
              return { ...p, bullets: p.bullets.filter((_, i) => i !== bulletIndex) };
            })
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                projects: state.tailoredResume.projects.map((p) => {
                  if (p.id !== projId) return p;
                  return { ...p, bullets: p.bullets.filter((_, i) => i !== bulletIndex) };
                })
              }
            : null
        }));
      },

      // Skills CRUD
      updateSkillsCategory: (category, skills) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            skills: {
              ...state.masterResume.skills,
              [category]: skills
            }
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                skills: {
                  ...state.tailoredResume.skills,
                  [category]: skills
                }
              }
            : null
        }));
      },

      addSkillToCategory: (category, skill) => {
        const trimmed = skill.trim();
        if (!trimmed) return;
        set((state) => {
          const currentList = state.masterResume.skills[category] || [];
          if (currentList.includes(trimmed)) return state;
          const updated = [...currentList, trimmed];
          return {
            masterResume: {
              ...state.masterResume,
              skills: {
                ...state.masterResume.skills,
                [category]: updated
              }
            },
            tailoredResume: state.tailoredResume
              ? {
                  ...state.tailoredResume,
                  skills: {
                    ...state.tailoredResume.skills,
                    [category]: updated
                  }
                }
              : null
          };
        });
      },

      removeSkillFromCategory: (category, skill) => {
        set((state) => {
          const updated = (state.masterResume.skills[category] || []).filter((s) => s !== skill);
          return {
            masterResume: {
              ...state.masterResume,
              skills: {
                ...state.masterResume.skills,
                [category]: updated
              }
            },
            tailoredResume: state.tailoredResume
              ? {
                  ...state.tailoredResume,
                  skills: {
                    ...state.tailoredResume.skills,
                    [category]: updated
                  }
                }
              : null
          };
        });
      },

      addMissingKeywordToSkills: (keyword: string) => {
        const state = get();
        const kwLower = keyword.toLowerCase();
        let targetCategory: keyof ResumeData['skills'] = 'tools';

        if (/python|javascript|typescript|golang|go|java|c\+\+|c#|ruby|rust|sql|php|swift|kotlin/i.test(kwLower)) {
          targetCategory = 'languages';
        } else if (/react|vue|angular|node|express|nest|django|flask|spring|tailwind|next|svelte|fastapi/i.test(kwLower)) {
          targetCategory = 'frameworks';
        } else if (/postgres|mysql|mongo|redis|cassandra|elasticsearch|dynamodb|oracle|sqlite/i.test(kwLower)) {
          targetCategory = 'databases';
        } else if (/docker|kubernetes|aws|gcp|azure|terraform|ci\/cd|github actions|jenkins|linux|ansible/i.test(kwLower)) {
          targetCategory = 'cloudDevOps';
        }

        const currentList = state.masterResume.skills[targetCategory];
        if (!currentList.some((s) => s.toLowerCase() === kwLower)) {
          state.updateSkillsCategory(targetCategory, [...currentList, keyword]);
        }
      },

      // Certifications CRUD
      addCertification: (cert) => {
        const newCert = { ...cert, id: `cert-${Date.now()}` };
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            certifications: [...(state.masterResume.certifications || []), newCert]
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                certifications: [...(state.tailoredResume.certifications || []), newCert]
              }
            : null
        }));
      },

      updateCertification: (id, cert) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            certifications: (state.masterResume.certifications || []).map((c) => (c.id === id ? { ...c, ...cert } : c))
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                certifications: (state.tailoredResume.certifications || []).map((c) => (c.id === id ? { ...c, ...cert } : c))
              }
            : null
        }));
      },

      removeCertification: (id) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            certifications: (state.masterResume.certifications || []).filter((c) => c.id !== id)
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                certifications: (state.tailoredResume.certifications || []).filter((c) => c.id !== id)
              }
            : null
        }));
      },

      // Publications CRUD
      addPublication: (pub) => {
        const newPub = { ...pub, id: `pub-${Date.now()}` };
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            publications: [...(state.masterResume.publications || []), newPub]
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                publications: [...(state.tailoredResume.publications || []), newPub]
              }
            : null
        }));
      },

      updatePublication: (id, pub) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            publications: (state.masterResume.publications || []).map((p) => (p.id === id ? { ...p, ...pub } : p))
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                publications: (state.tailoredResume.publications || []).map((p) => (p.id === id ? { ...p, ...pub } : p))
              }
            : null
        }));
      },

      removePublication: (id) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            publications: (state.masterResume.publications || []).filter((p) => p.id !== id)
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                publications: (state.tailoredResume.publications || []).filter((p) => p.id !== id)
              }
            : null
        }));
      },

      // Patents CRUD
      addPatent: (pat) => {
        const newPat = { ...pat, id: `pat-${Date.now()}` };
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            patents: [...(state.masterResume.patents || []), newPat]
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                patents: [...(state.tailoredResume.patents || []), newPat]
              }
            : null
        }));
      },

      updatePatent: (id, pat) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            patents: (state.masterResume.patents || []).map((p) => (p.id === id ? { ...p, ...pat } : p))
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                patents: (state.tailoredResume.patents || []).map((p) => (p.id === id ? { ...p, ...pat } : p))
              }
            : null
        }));
      },

      removePatent: (id) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            patents: (state.masterResume.patents || []).filter((p) => p.id !== id)
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                patents: (state.tailoredResume.patents || []).filter((p) => p.id !== id)
              }
            : null
        }));
      },

      // Achievements CRUD
      addAchievement: (achievement) => {
        const trimmed = achievement.trim();
        if (!trimmed) return;
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            achievements: [...(state.masterResume.achievements || []), trimmed]
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                achievements: [...(state.tailoredResume.achievements || []), trimmed]
              }
            : null
        }));
      },

      updateAchievement: (index, value) => {
        set((state) => {
          const list = [...(state.masterResume.achievements || [])];
          list[index] = value;
          return {
            masterResume: { ...state.masterResume, achievements: list },
            tailoredResume: state.tailoredResume ? { ...state.tailoredResume, achievements: list } : null
          };
        });
      },

      removeAchievement: (index) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            achievements: (state.masterResume.achievements || []).filter((_, i) => i !== index)
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                achievements: (state.tailoredResume.achievements || []).filter((_, i) => i !== index)
              }
            : null
        }));
      },

      setAchievements: (achievements) => {
        set((state) => ({
          masterResume: { ...state.masterResume, achievements },
          tailoredResume: state.tailoredResume ? { ...state.tailoredResume, achievements } : null
        }));
      },

      // Languages CRUD
      addLanguage: (language) => {
        const trimmed = language.trim();
        if (!trimmed) return;
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            languages: [...(state.masterResume.languages || []), trimmed]
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                languages: [...(state.tailoredResume.languages || []), trimmed]
              }
            : null
        }));
      },

      updateLanguage: (index, value) => {
        set((state) => {
          const list = [...(state.masterResume.languages || [])];
          list[index] = value;
          return {
            masterResume: { ...state.masterResume, languages: list },
            tailoredResume: state.tailoredResume ? { ...state.tailoredResume, languages: list } : null
          };
        });
      },

      removeLanguage: (index) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            languages: (state.masterResume.languages || []).filter((_, i) => i !== index)
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                languages: (state.tailoredResume.languages || []).filter((_, i) => i !== index)
              }
            : null
        }));
      },

      setLanguages: (languages) => {
        set((state) => ({
          masterResume: { ...state.masterResume, languages },
          tailoredResume: state.tailoredResume ? { ...state.tailoredResume, languages } : null
        }));
      },

      // Custom Sections CRUD
      addCustomSection: (title, items = []) => {
        const newSec = { id: `custom-${Date.now()}`, title: title.trim() || 'Custom Section', items };
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            customSections: [...(state.masterResume.customSections || []), newSec]
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                customSections: [...(state.tailoredResume.customSections || []), newSec]
              }
            : null
        }));
      },

      updateCustomSection: (id, title, items) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            customSections: (state.masterResume.customSections || []).map((s) => (s.id === id ? { ...s, title, items } : s))
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                customSections: (state.tailoredResume.customSections || []).map((s) => (s.id === id ? { ...s, title, items } : s))
              }
            : null
        }));
      },

      removeCustomSection: (id) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            customSections: (state.masterResume.customSections || []).filter((s) => s.id !== id)
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                customSections: (state.tailoredResume.customSections || []).filter((s) => s.id !== id)
              }
            : null
        }));
      },

      addCustomSectionItem: (sectionId, item) => {
        const trimmed = item.trim();
        if (!trimmed) return;
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            customSections: (state.masterResume.customSections || []).map((s) =>
              s.id === sectionId ? { ...s, items: [...s.items, trimmed] } : s
            )
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                customSections: (state.tailoredResume.customSections || []).map((s) =>
                  s.id === sectionId ? { ...s, items: [...s.items, trimmed] } : s
                )
              }
            : null
        }));
      },

      removeCustomSectionItem: (sectionId, itemIndex) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            customSections: (state.masterResume.customSections || []).map((s) =>
              s.id === sectionId ? { ...s, items: s.items.filter((_, i) => i !== itemIndex) } : s
            )
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                customSections: (state.tailoredResume.customSections || []).map((s) =>
                  s.id === sectionId ? { ...s, items: s.items.filter((_, i) => i !== itemIndex) } : s
                )
              }
            : null
        }));
      },

      // Job Tailoring
      setTargetJob: (title, company, jd) => {
        set({
          targetJobTitle: title,
          targetCompanyName: company,
          targetJobDescription: jd
        });
        if (get().isTailoringActive) {
          get().generateTailoredResume(jd, title, company);
        }
      },

      toggleTailoring: (active) => {
        const nextState = active !== undefined ? active : !get().isTailoringActive;
        set({ isTailoringActive: nextState });
        if (nextState) {
          get().generateTailoredResume();
        }
      },

      generateTailoredResume: (targetJd, jobTitle, company) => {
        const state = get();
        const jd = targetJd || state.targetJobDescription;
        const role = jobTitle || state.targetJobTitle;
        const comp = company || state.targetCompanyName;

        const base = JSON.parse(JSON.stringify(state.masterResume)) as ResumeData;
        const jdKeywords = extractKeywordsFromJd(jd);

        if (role) {
          base.personalInfo.title = `${role} | Distributed Systems & Cloud`;
        }

        const topKeywords = jdKeywords.slice(0, 4).join(', ');
        base.summary = `Performance-focused ${role || 'Software Engineer'} specializing in high-throughput architecture and cloud-native solutions. Experienced across ${topKeywords || 'modern web ecosystems'}, driving measurable scalability, automated CI/CD reliability, and high system uptime.`;

        jdKeywords.slice(0, 6).forEach((kw) => {
          const kwLower = kw.toLowerCase();
          const allSkills = Object.values(base.skills).flat().map((s) => s.toLowerCase());
          if (!allSkills.includes(kwLower)) {
            if (/typescript|javascript|python|go|java|c\+\+|sql/i.test(kwLower)) {
              base.skills.languages.push(kw);
            } else if (/react|node|express|next|tailwind|django/i.test(kwLower)) {
              base.skills.frameworks.push(kw);
            } else if (/postgres|redis|mongo|elasticsearch/i.test(kwLower)) {
              base.skills.databases.push(kw);
            } else if (/docker|kubernetes|aws|gcp|terraform/i.test(kwLower)) {
              base.skills.cloudDevOps.push(kw);
            } else {
              base.skills.tools.push(kw);
            }
          }
        });

        set({ tailoredResume: base });
      },

      resetTailoring: () => {
        set({ isTailoringActive: false, tailoredResume: null });
      },

      // Profile Sync
      syncFromProfile: (profile: any) => {
        if (!profile) return;

        let skillsObj: ResumeData['skills'] = {
          languages: [],
          frameworks: [],
          databases: [],
          cloudDevOps: [],
          tools: []
        };

        if (profile.skills) {
          if (Array.isArray(profile.skills)) {
            const rawSkills = profile.skills
              .map((s: any) => (typeof s === 'string' ? s : s?.name))
              .filter(Boolean);
            rawSkills.forEach((s: string) => {
              const lower = s.toLowerCase();
              if (/typescript|javascript|python|java|c\+\+|c#|ruby|go|rust|php|swift|kotlin|sql|html|css/i.test(lower)) {
                skillsObj.languages.push(s);
              } else if (/react|angular|vue|next|node|express|django|flask|spring|fastapi|tailwind/i.test(lower)) {
                skillsObj.frameworks.push(s);
              } else if (/postgres|mysql|mongo|redis|elasticsearch|cassandra|dynamodb|sqlite|supabase/i.test(lower)) {
                skillsObj.databases.push(s);
              } else if (/docker|kubernetes|aws|gcp|azure|ci\/cd|terraform|linux|git/i.test(lower)) {
                skillsObj.cloudDevOps.push(s);
              } else {
                skillsObj.tools.push(s);
              }
            });
          } else if (typeof profile.skills === 'object') {
            skillsObj = {
              languages: Array.isArray(profile.skills.languages) ? profile.skills.languages : [],
              frameworks: Array.isArray(profile.skills.frameworks) ? profile.skills.frameworks : [],
              databases: Array.isArray(profile.skills.databases) ? profile.skills.databases : [],
              cloudDevOps: Array.isArray(profile.skills.cloudDevOps) ? profile.skills.cloudDevOps : [],
              tools: Array.isArray(profile.skills.tools) ? profile.skills.tools : []
            };
          }
        }

        const educationList = profile.education
          ? [
              {
                id: `edu-${Date.now()}`,
                degree: typeof profile.education === 'string' ? profile.education : (profile.education.degree || ''),
                school: typeof profile.education === 'string' ? 'University' : (profile.education.school || 'University'),
                location: profile.location || '',
                startDate: '',
                endDate: '',
                gpa: ''
              }
            ]
          : [];

        const freshResume: ResumeData = {
          personalInfo: {
            fullName: profile.name || profile.fullName || '',
            title: profile.headline || profile.targetRole || profile.title || '',
            email: profile.email || '',
            phone: profile.phoneNumber || profile.phone || '',
            location: profile.location || '',
            linkedin: profile.linkedinUrl || profile.linkedin || '',
            github: profile.githubUrl || profile.github || '',
            portfolio: profile.portfolioUrl || profile.portfolio || ''
          },
          summary: profile.bio || profile.summary || '',
          experience: [],
          education: educationList,
          projects: [],
          skills: skillsObj,
          certifications: []
        };

        set({
          masterResume: normalizeResumeData(freshResume),
          tailoredResume: null,
          isTailoringActive: false
        });
      },

      // Extract & Load from parsed resume
      extractAndLoadResume: (parsedData: Partial<ResumeData>) => {
        const normalized = normalizeResumeData(parsedData);
        set({ masterResume: normalized, tailoredResume: null, isTailoringActive: false });
      },

      resetToDefaultResume: () => {
        set({ masterResume: DEFAULT_MASTER_RESUME, tailoredResume: null, isTailoringActive: false });
      },

      clearResumeData: () => {
        const emptyResume: ResumeData = {
          personalInfo: {
            fullName: '',
            title: '',
            email: '',
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
        set({ masterResume: emptyResume, tailoredResume: null, isTailoringActive: false });
      },

      // STAR Bullet replacement helper
      applyStarRewrite: (bulletAuditId: string, rewrittenBullet: string) => {
        set((state) => {
          const expMatch = bulletAuditId.match(/^(exp-[^]+)-b(\d+)$/);
          if (expMatch) {
            const expId = expMatch[1];
            const bulletIdx = parseInt(expMatch[2], 10);
            return {
              masterResume: {
                ...state.masterResume,
                experience: state.masterResume.experience.map((e) => {
                  if (e.id !== expId) return e;
                  const nextBullets = [...e.bullets];
                  nextBullets[bulletIdx] = rewrittenBullet;
                  return { ...e, bullets: nextBullets };
                })
              },
              tailoredResume: state.tailoredResume
                ? {
                    ...state.tailoredResume,
                    experience: state.tailoredResume.experience.map((e) => {
                      if (e.id !== expId) return e;
                      const nextBullets = [...e.bullets];
                      nextBullets[bulletIdx] = rewrittenBullet;
                      return { ...e, bullets: nextBullets };
                    })
                  }
                : null
            };
          }

          const projMatch = bulletAuditId.match(/^(proj-[^]+)-b(\d+)$/);
          if (projMatch) {
            const projId = projMatch[1];
            const bulletIdx = parseInt(projMatch[2], 10);
            return {
              masterResume: {
                ...state.masterResume,
                projects: state.masterResume.projects.map((p) => {
                  if (p.id !== projId) return p;
                  const nextBullets = [...p.bullets];
                  nextBullets[bulletIdx] = rewrittenBullet;
                  return { ...p, bullets: nextBullets };
                })
              },
              tailoredResume: state.tailoredResume
                ? {
                    ...state.tailoredResume,
                    projects: state.tailoredResume.projects.map((p) => {
                      if (p.id !== projId) return p;
                      const nextBullets = [...p.bullets];
                      nextBullets[bulletIdx] = rewrittenBullet;
                      return { ...p, bullets: nextBullets };
                    })
                  }
                : null
            };
          }

          return state;
        });
      }
    }),
    {
      name: 'ru-ready-master-resume',
      storage: createJSONStorage(() => (typeof window !== 'undefined' && window.localStorage ? window.localStorage : (globalThis.localStorage || {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
      }))),
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2 && persistedState) {
          // If legacy persisted state contained the sample candidate, sanitize to empty default
          if (persistedState.masterResume?.personalInfo?.fullName === 'Alex Morgan') {
            persistedState.masterResume = DEFAULT_MASTER_RESUME;
          }
          if (Array.isArray(persistedState.resumeVersions)) {
            persistedState.resumeVersions = persistedState.resumeVersions.filter(
              (v: any) => v.resumeData?.personalInfo?.fullName !== 'Alex Morgan'
            );
          }
        }
        return persistedState;
      }
    }
  )
);
