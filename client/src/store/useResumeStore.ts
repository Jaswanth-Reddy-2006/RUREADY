import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ResumeData, calculateAtsScore, AtsScoreResult, extractKeywordsFromJd } from '../utils/atsEngine';

export type ResumeTemplateId =
  | 'modern-tech'
  | 'harvard-classic'
  | 'minimal-executive'
  | 'creative-fullstack'
  | 'faang-compact'
  | 'stanford-academic'
  | 'startup-innovator'
  | 'executive-suite';

export interface TemplateMetadata {
  id: ResumeTemplateId;
  name: string;
  tag: string;
  badge: string;
  desc: string;
  atsRating: number;
  recommendedFor: string;
  highlights: string[];
  samplePersona: ResumeData;
}

export interface ResumeStoreState {
  // Master Resume Data (Saved across Profile & ATS Builder)
  masterResume: ResumeData;

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
  removeCertification: (id: string) => void;

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

export const DEFAULT_MASTER_RESUME: ResumeData = {
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

// ─── 8 Diverse Templates with Distinct Random Personas (NO user-specific names) ───
export const TEMPLATE_METADATA: TemplateMetadata[] = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    tag: 'Silicon Valley Standard',
    badge: 'Popular',
    desc: 'High-contrast typography with colored technical badges, clean horizontal rules, and modern headers.',
    atsRating: 99,
    recommendedFor: 'Full-Stack Developers, Frontend Engineers, Cloud & DevOps Specialists',
    highlights: ['Single-page density', 'Tag-based skills matrix', 'STAR bullet metrics emphasis'],
    samplePersona: {
      ...DEFAULT_MASTER_RESUME,
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
    tag: 'Ivy League Traditional',
    badge: 'ATS 100%',
    desc: 'Timeless single-column serif formatting favored by Fortune 500 recruiters and academic institutions.',
    atsRating: 100,
    recommendedFor: 'Campus Graduates, Software Engineers, Quant Developers, Management Consultants',
    highlights: ['100% legacy ATS machine-readable', 'Conservative serif hierarchy', 'Clean academic date alignments'],
    samplePersona: {
      ...DEFAULT_MASTER_RESUME,
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
    tag: 'Staff & Principal Lead',
    badge: 'High Density',
    desc: 'Crisp typographic layout engineered for maximum information density without visual clutter.',
    atsRating: 98,
    recommendedFor: 'Staff Software Engineers, Tech Leads, Engineering Managers, Architects',
    highlights: ['Maximum bullet density', 'Subtle border dividers', 'Zero wasted whitespace'],
    samplePersona: {
      ...DEFAULT_MASTER_RESUME,
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
    tag: 'Brand Accent & Portfolio',
    badge: 'Two-Column',
    desc: 'Two-column structured layout highlighting a persistent skills matrix and highlighted production projects.',
    atsRating: 96,
    recommendedFor: 'UI/UX Engineers, Product Engineers, Creative Technologists, Mobile Developers',
    highlights: ['Visual skill rating bars', 'Sidebar contact & links', 'Showcased repository links'],
    samplePersona: {
      ...DEFAULT_MASTER_RESUME,
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
    tag: 'Big Tech Engineering',
    badge: 'Recruiter Favorite',
    desc: 'Ultra-dense single-page engineering layout favored by recruiters at Google, Meta, and Amazon.',
    atsRating: 100,
    recommendedFor: 'Targeting FAANG / Tier-1 Tech, High-Volume Job Applications, Backend Engineers',
    highlights: ['Single-page guaranteed', 'Metrics-first bold keywords', 'Tight line spacing'],
    samplePersona: {
      ...DEFAULT_MASTER_RESUME,
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
    tag: 'Research & Scholarly CV',
    badge: 'Academic Standard',
    desc: 'Formal scholarly layout prioritizing university distinctions, research papers, GPA, and coursework.',
    atsRating: 99,
    recommendedFor: 'MS/PhD Candidates, Research Scientists, Machine Learning Researchers, Interns',
    highlights: ['Education first hierarchy', 'Research grants & honors', 'Standard scholarly serif'],
    samplePersona: {
      ...DEFAULT_MASTER_RESUME,
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
    tag: 'Venture & High-Growth',
    badge: 'Modern Accent',
    desc: 'Dynamic, modern format designed for agile engineers who build 0-to-1 products and ship fast.',
    atsRating: 97,
    recommendedFor: 'Founding Engineers, Early-Stage Hires, Hackathon Winners, Full-Stack Builders',
    highlights: ['0-to-1 impact metrics', 'Product launch badges', 'Modern indigo accents'],
    samplePersona: {
      ...DEFAULT_MASTER_RESUME,
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
    tag: 'Leadership & Director',
    badge: 'Executive',
    desc: 'Sophisticated corporate design featuring centered header, strategic milestone banner, and governance points.',
    atsRating: 98,
    recommendedFor: 'VP of Engineering, CTO, Engineering Directors, Technical Product Leaders',
    highlights: ['Executive summary callout', 'Strategic P&L metrics', 'Leadership governance framing'],
    samplePersona: {
      ...DEFAULT_MASTER_RESUME,
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
  }
];

export const useResumeStore = create<ResumeStoreState>()(
  persist(
    (set, get) => ({
      masterResume: DEFAULT_MASTER_RESUME,
      activeTemplate: 'modern-tech',
      isTailoringActive: false,
      targetJobTitle: 'Senior Full Stack Software Engineer',
      targetCompanyName: 'Stripe',
      targetJobDescription: `Responsibilities:
• Architect, build, and maintain high-throughput backend payment services in Node.js, TypeScript, and Go.
• Build delightful, performant customer checkouts and dashboard UI components in React, TypeScript, and TailwindCSS.
• Design schema migrations and optimize relational database query performance in PostgreSQL and Redis distributed caching.
• Own end-to-end reliability, CI/CD deployment pipelines, and observability across microservices handling millions of events daily.

Requirements:
• 4+ years of professional full stack engineering experience.
• Mastery of TypeScript/JavaScript, React, Node.js, and SQL (PostgreSQL).
• Hands-on experience with Docker, Redis caching, microservices, and automated testing (Jest/Cypress).`,
      tailoredResume: null,

      setTemplate: (templateId: ResumeTemplateId) => {
        set({ activeTemplate: templateId });
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
            certifications: [...state.masterResume.certifications, newCert]
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                certifications: [...state.masterResume.certifications, newCert]
              }
            : null
        }));
      },

      removeCertification: (id) => {
        set((state) => ({
          masterResume: {
            ...state.masterResume,
            certifications: state.masterResume.certifications.filter((c) => c.id !== id)
          },
          tailoredResume: state.tailoredResume
            ? {
                ...state.tailoredResume,
                certifications: state.tailoredResume.certifications.filter((c) => c.id !== id)
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
        set((state) => {
          const updated: ResumeData = {
            ...state.masterResume,
            personalInfo: {
              ...state.masterResume.personalInfo,
              fullName: profile.name || state.masterResume.personalInfo.fullName,
              email: profile.email || state.masterResume.personalInfo.email,
              phone: profile.phoneNumber || state.masterResume.personalInfo.phone,
              location: profile.location || state.masterResume.personalInfo.location,
              linkedin: profile.linkedinUrl || state.masterResume.personalInfo.linkedin,
              github: profile.githubUrl || state.masterResume.personalInfo.github,
              portfolio: profile.portfolioUrl || state.masterResume.personalInfo.portfolio,
              title: profile.headline || profile.targetRole || state.masterResume.personalInfo.title
            },
            summary: profile.bio || state.masterResume.summary
          };

          if (profile.education && state.masterResume.education.length === 0) {
            updated.education = [
              {
                id: `edu-${Date.now()}`,
                degree: profile.education,
                school: 'University',
                location: profile.location || 'USA',
                startDate: '2020',
                endDate: '2024',
                gpa: '3.8 / 4.0'
              }
            ];
          }

          return {
            masterResume: updated,
            tailoredResume: state.tailoredResume ? updated : null
          };
        });
      },

      // Extract & Load from parsed resume
      extractAndLoadResume: (parsedData: Partial<ResumeData>) => {
        set((state) => {
          const merged: ResumeData = {
            personalInfo: {
              ...state.masterResume.personalInfo,
              ...(parsedData.personalInfo || {})
            },
            summary: parsedData.summary || state.masterResume.summary,
            experience: parsedData.experience && parsedData.experience.length > 0
              ? parsedData.experience
              : state.masterResume.experience,
            education: parsedData.education && parsedData.education.length > 0
              ? parsedData.education
              : state.masterResume.education,
            projects: parsedData.projects && parsedData.projects.length > 0
              ? parsedData.projects
              : state.masterResume.projects,
            skills: {
              languages: parsedData.skills?.languages?.length ? parsedData.skills.languages : state.masterResume.skills.languages,
              frameworks: parsedData.skills?.frameworks?.length ? parsedData.skills.frameworks : state.masterResume.skills.frameworks,
              databases: parsedData.skills?.databases?.length ? parsedData.skills.databases : state.masterResume.skills.databases,
              cloudDevOps: parsedData.skills?.cloudDevOps?.length ? parsedData.skills.cloudDevOps : state.masterResume.skills.cloudDevOps,
              tools: parsedData.skills?.tools?.length ? parsedData.skills.tools : state.masterResume.skills.tools,
            },
            certifications: parsedData.certifications && parsedData.certifications.length > 0
              ? parsedData.certifications
              : state.masterResume.certifications
          };
          return { masterResume: merged, tailoredResume: null, isTailoringActive: false };
        });
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
      storage: createJSONStorage(() => localStorage)
    }
  )
);
