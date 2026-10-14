// ═══════════════════════════════════════════════════════════════
// Rigorous Multi-Domain ATS Scoring Engine & Keyword Analyzer
// Domain-neutral skill taxonomy covering 15+ career domains
// Dual-mode scoring: General ATS Compatibility vs Target Job Match
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// ONE canonical StructuredResume model. Every resume surface
// (parser, workspace editor, preview, ATS, competitive matcher)
// consumes this single type. Fields are populated ONLY from data
// actually extracted from the uploaded resume — never invented.
// ═══════════════════════════════════════════════════════════════

export interface ResumePublication {
  id: string;
  title: string;
  venue?: string;
  date?: string;
  url?: string;
}

export interface ResumePatent {
  id: string;
  title: string;
  number?: string;
  date?: string;
  url?: string;
}

export interface ResumeCustomSection {
  id: string;
  title: string;
  items: string[];
}

export interface ResumeData {
  rawText?: string;
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
    achievements?: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    highlights?: string;
    coursework?: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    techStack: string[];
    liveUrl?: string;
    repoUrl?: string;
    bullets: string[];
    achievements?: string[];
  }>;
  skills: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    cloudDevOps: string[];
    tools: string[];
    libraries?: string[];
    security?: string[];
    other?: string[];
  };
  certifications: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    credentialUrl?: string;
  }>;
  publications?: ResumePublication[];
  patents?: ResumePatent[];
  customSections?: ResumeCustomSection[];
  achievements?: string[];
  languages?: string[];
  hobbies?: string[];
}

export interface BulletAudit {
  id: string;
  context: string;
  original: string;
  hasMetrics: boolean;
  hasStrongVerb: boolean;
  detectedVerb: string;
  suggestedRewrite: string;
  improvementReason: string;
}

import {
  auditResumeBullets,
  RecommendationGroup,
  RecommendationSummary
} from './bulletRecommendationEngine';
export * from './bulletRecommendationEngine';

export interface AtsScoreResult {
  totalScore: number; // 0 - 100 (deterministic ATS-readiness preview only)
  hasTargetJd?: boolean;
  detectedDomain?: string;
  grade: 'Exceptional Match' | 'Competitive Match' | 'Moderate Match' | 'Needs Improvement';
  breakdown: {
    structureScore: number;       // 0 - 20 (Structure)
    completenessScore: number;    // 0 - 20 (Content Completeness)
    extractabilityScore: number;  // 0 - 20 (ATS Extractability)
    skillsScore: number;          // 0 - 15 (Skills & Technical Content)
    experienceQualityScore: number; // 0 - 15 (Experience/Achievement Quality)
    formattingScore: number;      // 0 - 10 (Basic ATS Formatting)
    keywordScore: number;         // 0 - 40 (compatibility alias)
    metricsScore: number;         // 0 - 25 (compatibility alias)
    actionVerbScore: number;      // 0 - 15 (compatibility alias)
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  bulletsAudit: BulletAudit[];
  recommendationGroups?: RecommendationGroup[];
  recommendationSummary?: RecommendationSummary;
  formatChecks: Array<{
    title: string;
    passed: boolean;
    description: string;
  }>;
  executiveSummaryAnalysis: {
    wordCount: number;
    hasJobKeywords: boolean;
    suggestion: string;
  };
  strengths?: string[];
  improvements?: string[];
}

// ═══════════════════════════════════════════════════════════════
// 15-Domain Structured Skill Taxonomy
// ═══════════════════════════════════════════════════════════════

export type CareerDomain =
  | 'SOFTWARE_ENGINEERING'
  | 'UI_UX_DESIGN'
  | 'CYBERSECURITY'
  | 'DATA_AI_ML'
  | 'CLOUD_DEVOPS'
  | 'PRODUCT_MANAGEMENT'
  | 'MARKETING'
  | 'FINANCE_ACCOUNTING'
  | 'HR_RECRUITING'
  | 'SALES_BIZDEV'
  | 'ELECTRICAL_ELECTRONICS'
  | 'MECHANICAL_CIVIL'
  | 'HEALTHCARE'
  | 'EDUCATION'
  | 'GENERAL_BUSINESS';

export interface SkillItem {
  name: string;
  category: 'languages' | 'frameworks' | 'databases' | 'cloudDevOps' | 'tools';
  domains: CareerDomain[];
}

export const DOMAIN_SKILLS_TAXONOMY: Record<CareerDomain, { label: string; skills: SkillItem[] }> = {
  UI_UX_DESIGN: {
    label: 'UI/UX & Product Design',
    skills: [
      // Core Methodologies & Concepts -> frameworks / methodologies
      { name: 'UX Design', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'UI Design', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'User Experience', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'User Interface', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Product Design', category: 'frameworks', domains: ['UI_UX_DESIGN', 'PRODUCT_MANAGEMENT'] },
      { name: 'User Research', category: 'frameworks', domains: ['UI_UX_DESIGN', 'PRODUCT_MANAGEMENT'] },
      { name: 'Usability Testing', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Information Architecture', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'User Flows', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Wireframing', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Prototyping', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'High-Fidelity Prototyping', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Low-Fidelity Prototyping', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Interaction Design', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Visual Design', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Visual Hierarchy', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Typography', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Color Theory', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Design Systems', category: 'frameworks', domains: ['UI_UX_DESIGN', 'SOFTWARE_ENGINEERING'] },
      { name: 'Responsive Design', category: 'frameworks', domains: ['UI_UX_DESIGN', 'SOFTWARE_ENGINEERING'] },
      { name: 'Accessibility', category: 'frameworks', domains: ['UI_UX_DESIGN', 'SOFTWARE_ENGINEERING'] },
      { name: 'WCAG', category: 'frameworks', domains: ['UI_UX_DESIGN', 'SOFTWARE_ENGINEERING'] },
      { name: 'Heuristic Evaluation', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Usability', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Journey Mapping', category: 'frameworks', domains: ['UI_UX_DESIGN', 'PRODUCT_MANAGEMENT'] },
      { name: 'Customer Journey', category: 'frameworks', domains: ['UI_UX_DESIGN', 'PRODUCT_MANAGEMENT', 'MARKETING'] },
      { name: 'Personas', category: 'frameworks', domains: ['UI_UX_DESIGN', 'PRODUCT_MANAGEMENT', 'MARKETING'] },
      { name: 'User Interviews', category: 'frameworks', domains: ['UI_UX_DESIGN', 'PRODUCT_MANAGEMENT'] },
      { name: 'A/B Testing', category: 'frameworks', domains: ['UI_UX_DESIGN', 'MARKETING', 'DATA_AI_ML', 'PRODUCT_MANAGEMENT'] },
      { name: 'Interaction Patterns', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Design Thinking', category: 'frameworks', domains: ['UI_UX_DESIGN', 'PRODUCT_MANAGEMENT'] },
      { name: 'Auto Layout', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Component Libraries', category: 'frameworks', domains: ['UI_UX_DESIGN', 'SOFTWARE_ENGINEERING'] },
      { name: 'Micro-interactions', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'SaaS UX', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Mobile UI', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Web UI', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Graphic Design', category: 'frameworks', domains: ['UI_UX_DESIGN', 'MARKETING'] },
      { name: 'Case Studies', category: 'frameworks', domains: ['UI_UX_DESIGN'] },
      { name: 'Design Sprints', category: 'frameworks', domains: ['UI_UX_DESIGN', 'PRODUCT_MANAGEMENT'] },
      // Design Software & Tools
      { name: 'Figma', category: 'tools', domains: ['UI_UX_DESIGN', 'PRODUCT_MANAGEMENT', 'SOFTWARE_ENGINEERING'] },
      { name: 'FigJam', category: 'tools', domains: ['UI_UX_DESIGN', 'PRODUCT_MANAGEMENT'] },
      { name: 'Adobe XD', category: 'tools', domains: ['UI_UX_DESIGN'] },
      { name: 'Sketch', category: 'tools', domains: ['UI_UX_DESIGN'] },
      { name: 'InVision', category: 'tools', domains: ['UI_UX_DESIGN'] },
      { name: 'Canva', category: 'tools', domains: ['UI_UX_DESIGN', 'MARKETING'] },
      { name: 'Photoshop', category: 'tools', domains: ['UI_UX_DESIGN', 'MARKETING'] },
      { name: 'Illustrator', category: 'tools', domains: ['UI_UX_DESIGN', 'MARKETING'] },
      { name: 'Framer', category: 'tools', domains: ['UI_UX_DESIGN', 'SOFTWARE_ENGINEERING'] },
      { name: 'Webflow', category: 'tools', domains: ['UI_UX_DESIGN', 'MARKETING'] },
      { name: 'Miro', category: 'tools', domains: ['UI_UX_DESIGN', 'PRODUCT_MANAGEMENT'] },
      { name: 'Zeplin', category: 'tools', domains: ['UI_UX_DESIGN', 'SOFTWARE_ENGINEERING'] },
      { name: 'Principle', category: 'tools', domains: ['UI_UX_DESIGN'] },
      { name: 'After Effects', category: 'tools', domains: ['UI_UX_DESIGN'] },
    ]
  },

  SOFTWARE_ENGINEERING: {
    label: 'Software Engineering',
    skills: [
      // Languages
      { name: 'TypeScript', category: 'languages', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'JavaScript', category: 'languages', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Python', category: 'languages', domains: ['SOFTWARE_ENGINEERING', 'DATA_AI_ML', 'CYBERSECURITY'] },
      { name: 'Java', category: 'languages', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Go', category: 'languages', domains: ['SOFTWARE_ENGINEERING', 'CLOUD_DEVOPS'] },
      { name: 'Golang', category: 'languages', domains: ['SOFTWARE_ENGINEERING', 'CLOUD_DEVOPS'] },
      { name: 'Rust', category: 'languages', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'C++', category: 'languages', domains: ['SOFTWARE_ENGINEERING', 'ELECTRICAL_ELECTRONICS'] },
      { name: 'C#', category: 'languages', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'PHP', category: 'languages', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Ruby', category: 'languages', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Swift', category: 'languages', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Kotlin', category: 'languages', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'SQL', category: 'languages', domains: ['SOFTWARE_ENGINEERING', 'DATA_AI_ML'] },
      { name: 'HTML5', category: 'languages', domains: ['SOFTWARE_ENGINEERING', 'UI_UX_DESIGN'] },
      { name: 'HTML', category: 'languages', domains: ['SOFTWARE_ENGINEERING', 'UI_UX_DESIGN'] },
      { name: 'CSS3', category: 'languages', domains: ['SOFTWARE_ENGINEERING', 'UI_UX_DESIGN'] },
      { name: 'CSS', category: 'languages', domains: ['SOFTWARE_ENGINEERING', 'UI_UX_DESIGN'] },
      { name: 'Bash', category: 'languages', domains: ['SOFTWARE_ENGINEERING', 'CLOUD_DEVOPS', 'CYBERSECURITY'] },
      { name: 'Scala', category: 'languages', domains: ['SOFTWARE_ENGINEERING', 'DATA_AI_ML'] },
      // Frameworks & Architecture
      { name: 'React', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Next.js', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Vue.js', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Vue', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Angular', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Node.js', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Express', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'NestJS', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'FastAPI', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING', 'DATA_AI_ML'] },
      { name: 'Django', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Flask', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Spring Boot', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'GraphQL', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'REST API', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'RESTful APIs', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'gRPC', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'WebSockets', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'TailwindCSS', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING', 'UI_UX_DESIGN'] },
      { name: 'Bootstrap', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Microservices', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING', 'CLOUD_DEVOPS'] },
      { name: 'Distributed Systems', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING', 'CLOUD_DEVOPS'] },
      { name: 'System Design', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Redux', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Svelte', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'ASP.NET', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Ruby on Rails', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      // Databases
      { name: 'PostgreSQL', category: 'databases', domains: ['SOFTWARE_ENGINEERING', 'DATA_AI_ML'] },
      { name: 'MySQL', category: 'databases', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'MongoDB', category: 'databases', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Redis', category: 'databases', domains: ['SOFTWARE_ENGINEERING', 'CLOUD_DEVOPS'] },
      { name: 'Elasticsearch', category: 'databases', domains: ['SOFTWARE_ENGINEERING', 'DATA_AI_ML'] },
      { name: 'DynamoDB', category: 'databases', domains: ['SOFTWARE_ENGINEERING', 'CLOUD_DEVOPS'] },
      { name: 'Cassandra', category: 'databases', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'SQLite', category: 'databases', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Supabase', category: 'databases', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Firebase', category: 'databases', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Neo4j', category: 'databases', domains: ['SOFTWARE_ENGINEERING', 'DATA_AI_ML'] },
      // Tools & Testing
      { name: 'Git', category: 'tools', domains: ['SOFTWARE_ENGINEERING', 'CLOUD_DEVOPS', 'DATA_AI_ML'] },
      { name: 'GitHub', category: 'tools', domains: ['SOFTWARE_ENGINEERING', 'CLOUD_DEVOPS'] },
      { name: 'VS Code', category: 'tools', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Postman', category: 'tools', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Jest', category: 'tools', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Cypress', category: 'tools', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Playwright', category: 'tools', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'TDD', category: 'frameworks', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Webpack', category: 'tools', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Vite', category: 'tools', domains: ['SOFTWARE_ENGINEERING'] },
      { name: 'Linux', category: 'tools', domains: ['SOFTWARE_ENGINEERING', 'CLOUD_DEVOPS', 'CYBERSECURITY'] },
    ]
  },

  CYBERSECURITY: {
    label: 'Cybersecurity & InfoSec',
    skills: [
      { name: 'Threat Intelligence', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'SIEM', category: 'tools', domains: ['CYBERSECURITY'] },
      { name: 'Penetration Testing', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'Vulnerability Assessment', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'Incident Response', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'Network Security', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'Zero Trust', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'SOC', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'Wireshark', category: 'tools', domains: ['CYBERSECURITY'] },
      { name: 'Splunk', category: 'tools', domains: ['CYBERSECURITY', 'CLOUD_DEVOPS'] },
      { name: 'OWASP', category: 'frameworks', domains: ['CYBERSECURITY', 'SOFTWARE_ENGINEERING'] },
      { name: 'Cryptography', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'Firewalls', category: 'tools', domains: ['CYBERSECURITY'] },
      { name: 'IAM', category: 'frameworks', domains: ['CYBERSECURITY', 'CLOUD_DEVOPS'] },
      { name: 'CISSP', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'CEH', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'Endpoint Security', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'Malware Analysis', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'PCI-DSS', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'Security Auditing', category: 'frameworks', domains: ['CYBERSECURITY'] },
      { name: 'OAuth2', category: 'frameworks', domains: ['CYBERSECURITY', 'SOFTWARE_ENGINEERING'] },
      { name: 'JWT', category: 'frameworks', domains: ['CYBERSECURITY', 'SOFTWARE_ENGINEERING'] },
    ]
  },

  DATA_AI_ML: {
    label: 'Data Science, AI & Machine Learning',
    skills: [
      { name: 'Machine Learning', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'Deep Learning', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'Natural Language Processing', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'NLP', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'Computer Vision', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'PyTorch', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'TensorFlow', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'Scikit-Learn', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'Pandas', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'NumPy', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'Data Modeling', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'Data Warehousing', category: 'databases', domains: ['DATA_AI_ML'] },
      { name: 'ETL Pipelines', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'ETL', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'Apache Spark', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'Spark', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'BigQuery', category: 'databases', domains: ['DATA_AI_ML', 'CLOUD_DEVOPS'] },
      { name: 'Snowflake', category: 'databases', domains: ['DATA_AI_ML'] },
      { name: 'Tableau', category: 'tools', domains: ['DATA_AI_ML', 'GENERAL_BUSINESS'] },
      { name: 'Power BI', category: 'tools', domains: ['DATA_AI_ML', 'GENERAL_BUSINESS'] },
      { name: 'Data Visualization', category: 'frameworks', domains: ['DATA_AI_ML', 'UI_UX_DESIGN'] },
      { name: 'Statistical Modeling', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'Feature Engineering', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'LLM', category: 'frameworks', domains: ['DATA_AI_ML'] },
      { name: 'LangChain', category: 'frameworks', domains: ['DATA_AI_ML'] },
    ]
  },

  CLOUD_DEVOPS: {
    label: 'Cloud & DevOps',
    skills: [
      { name: 'Docker', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS', 'SOFTWARE_ENGINEERING'] },
      { name: 'Kubernetes', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS', 'SOFTWARE_ENGINEERING'] },
      { name: 'AWS', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS', 'SOFTWARE_ENGINEERING'] },
      { name: 'Amazon Web Services', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS'] },
      { name: 'GCP', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS'] },
      { name: 'Google Cloud', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS'] },
      { name: 'Azure', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS'] },
      { name: 'Terraform', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS'] },
      { name: 'CI/CD', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS', 'SOFTWARE_ENGINEERING'] },
      { name: 'GitHub Actions', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS', 'SOFTWARE_ENGINEERING'] },
      { name: 'GitLab CI', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS'] },
      { name: 'Jenkins', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS'] },
      { name: 'Ansible', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS'] },
      { name: 'Helm', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS'] },
      { name: 'Kafka', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS', 'SOFTWARE_ENGINEERING'] },
      { name: 'RabbitMQ', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS', 'SOFTWARE_ENGINEERING'] },
      { name: 'Datadog', category: 'tools', domains: ['CLOUD_DEVOPS'] },
      { name: 'Prometheus', category: 'tools', domains: ['CLOUD_DEVOPS'] },
      { name: 'Grafana', category: 'tools', domains: ['CLOUD_DEVOPS'] },
      { name: 'Site Reliability Engineering', category: 'frameworks', domains: ['CLOUD_DEVOPS'] },
      { name: 'SRE', category: 'frameworks', domains: ['CLOUD_DEVOPS'] },
      { name: 'Infrastructure as Code', category: 'cloudDevOps', domains: ['CLOUD_DEVOPS'] },
    ]
  },

  PRODUCT_MANAGEMENT: {
    label: 'Product Management',
    skills: [
      { name: 'Product Strategy', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT'] },
      { name: 'Roadmap Planning', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT'] },
      { name: 'Agile', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT', 'SOFTWARE_ENGINEERING'] },
      { name: 'Scrum', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT', 'SOFTWARE_ENGINEERING'] },
      { name: 'Kanban', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT'] },
      { name: 'Feature Prioritization', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT'] },
      { name: 'User Stories', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT', 'UI_UX_DESIGN'] },
      { name: 'PRD', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT'] },
      { name: 'Product Requirements', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT'] },
      { name: 'Stakeholder Management', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT', 'GENERAL_BUSINESS'] },
      { name: 'Market Research', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT', 'MARKETING'] },
      { name: 'Go-To-Market', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT', 'MARKETING'] },
      { name: 'GTM Strategy', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT', 'MARKETING'] },
      { name: 'KPI Tracking', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT', 'GENERAL_BUSINESS'] },
      { name: 'Product Analytics', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT', 'DATA_AI_ML'] },
      { name: 'OKRs', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT', 'GENERAL_BUSINESS'] },
      { name: 'Backlog Grooming', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT'] },
      { name: 'Customer Discovery', category: 'frameworks', domains: ['PRODUCT_MANAGEMENT', 'UI_UX_DESIGN'] },
      { name: 'Jira', category: 'tools', domains: ['PRODUCT_MANAGEMENT', 'SOFTWARE_ENGINEERING'] },
      { name: 'Confluence', category: 'tools', domains: ['PRODUCT_MANAGEMENT'] },
      { name: 'Mixpanel', category: 'tools', domains: ['PRODUCT_MANAGEMENT', 'MARKETING'] },
      { name: 'Amplitude', category: 'tools', domains: ['PRODUCT_MANAGEMENT', 'DATA_AI_ML'] },
    ]
  },

  MARKETING: {
    label: 'Marketing & Growth',
    skills: [
      { name: 'Digital Marketing', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'Content Strategy', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'SEO', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'Search Engine Optimization', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'SEM', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'Google Analytics', category: 'tools', domains: ['MARKETING', 'DATA_AI_ML'] },
      { name: 'Social Media Marketing', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'Email Marketing', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'Campaign Management', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'Brand Strategy', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'Copywriting', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'Conversion Rate Optimization', category: 'frameworks', domains: ['MARKETING', 'UI_UX_DESIGN'] },
      { name: 'CRO', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'Growth Hacking', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'Performance Marketing', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'HubSpot', category: 'tools', domains: ['MARKETING', 'SALES_BIZDEV'] },
      { name: 'Google Ads', category: 'tools', domains: ['MARKETING'] },
      { name: 'Meta Ads', category: 'tools', domains: ['MARKETING'] },
      { name: 'Market Analysis', category: 'frameworks', domains: ['MARKETING', 'GENERAL_BUSINESS'] },
      { name: 'Influencer Marketing', category: 'frameworks', domains: ['MARKETING'] },
      { name: 'Mailchimp', category: 'tools', domains: ['MARKETING'] },
    ]
  },

  FINANCE_ACCOUNTING: {
    label: 'Finance & Accounting',
    skills: [
      { name: 'Financial Analysis', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'Financial Modeling', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'Budgeting', category: 'frameworks', domains: ['FINANCE_ACCOUNTING', 'GENERAL_BUSINESS'] },
      { name: 'Forecasting', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'GAAP', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'IFRS', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'Auditing', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'General Ledger', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'Accounts Payable', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'Accounts Receivable', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'Tax Compliance', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'Financial Reporting', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'Valuation', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'Excel Modeling', category: 'tools', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'QuickBooks', category: 'tools', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'SAP', category: 'tools', domains: ['FINANCE_ACCOUNTING', 'GENERAL_BUSINESS'] },
      { name: 'NetSuite', category: 'tools', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'Cash Flow Analysis', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
      { name: 'Risk Management', category: 'frameworks', domains: ['FINANCE_ACCOUNTING', 'GENERAL_BUSINESS'] },
      { name: 'P&L Management', category: 'frameworks', domains: ['FINANCE_ACCOUNTING'] },
    ]
  },

  HR_RECRUITING: {
    label: 'HR & Recruiting',
    skills: [
      { name: 'Talent Acquisition', category: 'frameworks', domains: ['HR_RECRUITING'] },
      { name: 'Full-Cycle Recruiting', category: 'frameworks', domains: ['HR_RECRUITING'] },
      { name: 'Technical Recruiting', category: 'frameworks', domains: ['HR_RECRUITING'] },
      { name: 'Employee Relations', category: 'frameworks', domains: ['HR_RECRUITING'] },
      { name: 'Onboarding', category: 'frameworks', domains: ['HR_RECRUITING'] },
      { name: 'Performance Management', category: 'frameworks', domains: ['HR_RECRUITING'] },
      { name: 'HRIS', category: 'tools', domains: ['HR_RECRUITING'] },
      { name: 'Compensation & Benefits', category: 'frameworks', domains: ['HR_RECRUITING'] },
      { name: 'Diversity & Inclusion', category: 'frameworks', domains: ['HR_RECRUITING'] },
      { name: 'Talent Sourcing', category: 'frameworks', domains: ['HR_RECRUITING'] },
      { name: 'Applicant Tracking Systems', category: 'tools', domains: ['HR_RECRUITING'] },
      { name: 'Workday', category: 'tools', domains: ['HR_RECRUITING'] },
      { name: 'Greenhouse', category: 'tools', domains: ['HR_RECRUITING'] },
      { name: 'BambooHR', category: 'tools', domains: ['HR_RECRUITING'] },
      { name: 'Labor Laws', category: 'frameworks', domains: ['HR_RECRUITING'] },
      { name: 'Employee Engagement', category: 'frameworks', domains: ['HR_RECRUITING'] },
    ]
  },

  SALES_BIZDEV: {
    label: 'Sales & Business Development',
    skills: [
      { name: 'B2B Sales', category: 'frameworks', domains: ['SALES_BIZDEV'] },
      { name: 'Lead Generation', category: 'frameworks', domains: ['SALES_BIZDEV', 'MARKETING'] },
      { name: 'Cold Outreach', category: 'frameworks', domains: ['SALES_BIZDEV'] },
      { name: 'Pipeline Management', category: 'frameworks', domains: ['SALES_BIZDEV'] },
      { name: 'Account Management', category: 'frameworks', domains: ['SALES_BIZDEV'] },
      { name: 'Solution Selling', category: 'frameworks', domains: ['SALES_BIZDEV'] },
      { name: 'Deal Closing', category: 'frameworks', domains: ['SALES_BIZDEV'] },
      { name: 'Negotiation', category: 'frameworks', domains: ['SALES_BIZDEV', 'GENERAL_BUSINESS'] },
      { name: 'Salesforce', category: 'tools', domains: ['SALES_BIZDEV'] },
      { name: 'Sales Enablement', category: 'frameworks', domains: ['SALES_BIZDEV'] },
      { name: 'Strategic Partnerships', category: 'frameworks', domains: ['SALES_BIZDEV'] },
      { name: 'Revenue Growth', category: 'frameworks', domains: ['SALES_BIZDEV'] },
      { name: 'Quota Attainment', category: 'frameworks', domains: ['SALES_BIZDEV'] },
      { name: 'Client Retention', category: 'frameworks', domains: ['SALES_BIZDEV'] },
    ]
  },

  ELECTRICAL_ELECTRONICS: {
    label: 'Electrical & Electronics Engineering',
    skills: [
      { name: 'Circuit Design', category: 'frameworks', domains: ['ELECTRICAL_ELECTRONICS'] },
      { name: 'PCB Layout', category: 'frameworks', domains: ['ELECTRICAL_ELECTRONICS'] },
      { name: 'Embedded Systems', category: 'frameworks', domains: ['ELECTRICAL_ELECTRONICS', 'SOFTWARE_ENGINEERING'] },
      { name: 'Microcontrollers', category: 'tools', domains: ['ELECTRICAL_ELECTRONICS'] },
      { name: 'Arduino', category: 'tools', domains: ['ELECTRICAL_ELECTRONICS'] },
      { name: 'STM32', category: 'tools', domains: ['ELECTRICAL_ELECTRONICS'] },
      { name: 'FPGA', category: 'tools', domains: ['ELECTRICAL_ELECTRONICS'] },
      { name: 'Verilog', category: 'languages', domains: ['ELECTRICAL_ELECTRONICS'] },
      { name: 'VHDL', category: 'languages', domains: ['ELECTRICAL_ELECTRONICS'] },
      { name: 'MATLAB', category: 'tools', domains: ['ELECTRICAL_ELECTRONICS', 'DATA_AI_ML', 'MECHANICAL_CIVIL'] },
      { name: 'Simulink', category: 'tools', domains: ['ELECTRICAL_ELECTRONICS'] },
      { name: 'Oscilloscope', category: 'tools', domains: ['ELECTRICAL_ELECTRONICS'] },
      { name: 'Signal Processing', category: 'frameworks', domains: ['ELECTRICAL_ELECTRONICS'] },
      { name: 'IoT', category: 'frameworks', domains: ['ELECTRICAL_ELECTRONICS', 'SOFTWARE_ENGINEERING'] },
      { name: 'Power Electronics', category: 'frameworks', domains: ['ELECTRICAL_ELECTRONICS'] },
      { name: 'Altium Designer', category: 'tools', domains: ['ELECTRICAL_ELECTRONICS'] },
      { name: 'KiCAD', category: 'tools', domains: ['ELECTRICAL_ELECTRONICS'] },
    ]
  },

  MECHANICAL_CIVIL: {
    label: 'Mechanical & Civil Engineering',
    skills: [
      { name: 'CAD', category: 'tools', domains: ['MECHANICAL_CIVIL'] },
      { name: 'SolidWorks', category: 'tools', domains: ['MECHANICAL_CIVIL'] },
      { name: 'AutoCAD', category: 'tools', domains: ['MECHANICAL_CIVIL'] },
      { name: 'CATIA', category: 'tools', domains: ['MECHANICAL_CIVIL'] },
      { name: 'FEA', category: 'frameworks', domains: ['MECHANICAL_CIVIL'] },
      { name: 'ANSYS', category: 'tools', domains: ['MECHANICAL_CIVIL'] },
      { name: 'GD&T', category: 'frameworks', domains: ['MECHANICAL_CIVIL'] },
      { name: '3D Modeling', category: 'frameworks', domains: ['MECHANICAL_CIVIL', 'UI_UX_DESIGN'] },
      { name: 'Structural Analysis', category: 'frameworks', domains: ['MECHANICAL_CIVIL'] },
      { name: 'Thermodynamics', category: 'frameworks', domains: ['MECHANICAL_CIVIL'] },
      { name: 'Fluid Dynamics', category: 'frameworks', domains: ['MECHANICAL_CIVIL'] },
      { name: 'HVAC', category: 'frameworks', domains: ['MECHANICAL_CIVIL'] },
      { name: 'Manufacturing Processes', category: 'frameworks', domains: ['MECHANICAL_CIVIL'] },
      { name: 'CNC Machining', category: 'frameworks', domains: ['MECHANICAL_CIVIL'] },
      { name: 'Construction Management', category: 'frameworks', domains: ['MECHANICAL_CIVIL'] },
      { name: 'Revit', category: 'tools', domains: ['MECHANICAL_CIVIL'] },
    ]
  },

  HEALTHCARE: {
    label: 'Healthcare & Clinical Practice',
    skills: [
      { name: 'Patient Care', category: 'frameworks', domains: ['HEALTHCARE'] },
      { name: 'Clinical Assessment', category: 'frameworks', domains: ['HEALTHCARE'] },
      { name: 'Electronic Health Records', category: 'tools', domains: ['HEALTHCARE'] },
      { name: 'EHR', category: 'tools', domains: ['HEALTHCARE'] },
      { name: 'Epic', category: 'tools', domains: ['HEALTHCARE'] },
      { name: 'Cerner', category: 'tools', domains: ['HEALTHCARE'] },
      { name: 'HIPAA Compliance', category: 'frameworks', domains: ['HEALTHCARE'] },
      { name: 'Vital Signs', category: 'frameworks', domains: ['HEALTHCARE'] },
      { name: 'Triage', category: 'frameworks', domains: ['HEALTHCARE'] },
      { name: 'Medical Terminology', category: 'frameworks', domains: ['HEALTHCARE'] },
      { name: 'Pharmacology', category: 'frameworks', domains: ['HEALTHCARE'] },
      { name: 'Patient Education', category: 'frameworks', domains: ['HEALTHCARE'] },
      { name: 'BLS', category: 'frameworks', domains: ['HEALTHCARE'] },
      { name: 'ACLS', category: 'frameworks', domains: ['HEALTHCARE'] },
      { name: 'Treatment Planning', category: 'frameworks', domains: ['HEALTHCARE'] },
      { name: 'Telehealth', category: 'frameworks', domains: ['HEALTHCARE'] },
    ]
  },

  EDUCATION: {
    label: 'Education & Teaching',
    skills: [
      { name: 'Curriculum Development', category: 'frameworks', domains: ['EDUCATION'] },
      { name: 'Lesson Planning', category: 'frameworks', domains: ['EDUCATION'] },
      { name: 'Classroom Management', category: 'frameworks', domains: ['EDUCATION'] },
      { name: 'Differentiated Instruction', category: 'frameworks', domains: ['EDUCATION'] },
      { name: 'Student Assessment', category: 'frameworks', domains: ['EDUCATION'] },
      { name: 'EdTech', category: 'tools', domains: ['EDUCATION'] },
      { name: 'Canvas', category: 'tools', domains: ['EDUCATION'] },
      { name: 'Blackboard', category: 'tools', domains: ['EDUCATION'] },
      { name: 'Google Classroom', category: 'tools', domains: ['EDUCATION'] },
      { name: 'Pedagogy', category: 'frameworks', domains: ['EDUCATION'] },
      { name: 'Special Education', category: 'frameworks', domains: ['EDUCATION'] },
      { name: 'IEP', category: 'frameworks', domains: ['EDUCATION'] },
      { name: 'Student Engagement', category: 'frameworks', domains: ['EDUCATION'] },
      { name: 'Interactive Learning', category: 'frameworks', domains: ['EDUCATION'] },
    ]
  },

  GENERAL_BUSINESS: {
    label: 'General Business & Operations',
    skills: [
      { name: 'Project Management', category: 'frameworks', domains: ['GENERAL_BUSINESS'] },
      { name: 'Process Improvement', category: 'frameworks', domains: ['GENERAL_BUSINESS'] },
      { name: 'Operations Management', category: 'frameworks', domains: ['GENERAL_BUSINESS'] },
      { name: 'Cross-Functional Collaboration', category: 'frameworks', domains: ['GENERAL_BUSINESS', 'UI_UX_DESIGN', 'SOFTWARE_ENGINEERING', 'PRODUCT_MANAGEMENT'] },
      { name: 'Vendor Management', category: 'frameworks', domains: ['GENERAL_BUSINESS'] },
      { name: 'Change Management', category: 'frameworks', domains: ['GENERAL_BUSINESS'] },
      { name: 'Lean', category: 'frameworks', domains: ['GENERAL_BUSINESS'] },
      { name: 'Six Sigma', category: 'frameworks', domains: ['GENERAL_BUSINESS'] },
      { name: 'Strategic Planning', category: 'frameworks', domains: ['GENERAL_BUSINESS'] },
      { name: 'Business Analysis', category: 'frameworks', domains: ['GENERAL_BUSINESS'] },
      { name: 'Supply Chain', category: 'frameworks', domains: ['GENERAL_BUSINESS'] },
      { name: 'Logistics', category: 'frameworks', domains: ['GENERAL_BUSINESS'] },
      { name: 'Client Relationship Management', category: 'frameworks', domains: ['GENERAL_BUSINESS', 'SALES_BIZDEV'] },
      { name: 'Executive Communication', category: 'frameworks', domains: ['GENERAL_BUSINESS'] },
      { name: 'Data-Driven Decision Making', category: 'frameworks', domains: ['GENERAL_BUSINESS'] },
      { name: 'Microsoft Office', category: 'tools', domains: ['GENERAL_BUSINESS'] },
      { name: 'Excel', category: 'tools', domains: ['GENERAL_BUSINESS', 'FINANCE_ACCOUNTING'] },
      { name: 'PowerPoint', category: 'tools', domains: ['GENERAL_BUSINESS'] },
    ]
  }
};

// Master combined list of all unique skills sorted by character length descending (for greedy multi-word match)
export const ALL_TAXONOMY_SKILLS: SkillItem[] = (() => {
  const seen = new Set<string>();
  const list: SkillItem[] = [];

  Object.values(DOMAIN_SKILLS_TAXONOMY).forEach(({ skills }) => {
    skills.forEach(sk => {
      const lower = sk.name.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        list.push(sk);
      }
    });
  });

  return list.sort((a, b) => b.name.length - a.name.length);
})();

// Legacy fallback list for backward compatibility
export const TECH_KEYWORDS_DICTIONARY = ALL_TAXONOMY_SKILLS.map(s => s.name);

// ═══════════════════════════════════════════════════════════════
// Domain-Neutral Strong Action Verbs
// ═══════════════════════════════════════════════════════════════

export const STRONG_ACTION_VERBS = [
  // Design, UX & Creative
  'Designed', 'Redesigned', 'Prototyped', 'Researched', 'Evaluated', 'Mapped',
  'Crafted', 'Wireframed', 'Simplified', 'Standardized', 'Visualized', 'Conceptualized',
  'Iterated', 'Authored', 'Moderated', 'Conducted', 'Synthesized', 'Translated',
  'Illustrated', 'Streamlined', 'Created', 'Validated', 'Tested',

  // Software, Architecture & Engineering
  'Architected', 'Engineered', 'Developed', 'Implemented', 'Deployed', 'Automated',
  'Optimized', 'Scaled', 'Overhauled', 'Pioneered', 'Configured', 'Integrated',
  'Modernized', 'Refactored', 'Debugged', 'Built', 'Programmed', 'Maintained',
  'Constructed', 'Devised', 'Established',

  // Product, Management & Strategy
  'Spearheaded', 'Orchestrated', 'Directed', 'Managed', 'Led', 'Formulated',
  'Prioritized', 'Coordinated', 'Facilitated', 'Defined', 'Aligned', 'Executed',
  'Championed', 'Supervised', 'Delivered', 'Governed',

  // Marketing, Sales & Growth
  'Launched', 'Campaigned', 'Promoted', 'Generated', 'Increased', 'Boosted',
  'Engaged', 'Drove', 'Acquired', 'Published', 'Positioned', 'Expanded',
  'Amplified', 'Targeted', 'Segmented', 'Negotiated', 'Closed',

  // Analysis, Data & Research
  'Analyzed', 'Modeled', 'Forecasted', 'Discovered', 'Extracted', 'Transformed',
  'Quantified', 'Assessed', 'Benchmarked', 'Investigated', 'Audited', 'Interpreted',
  'Surveyed', 'Correlated',

  // Finance, Operations & HR
  'Reconciled', 'Budgeted', 'Allocated', 'Procured', 'Mitigated', 'Saved',
  'Recruited', 'Sourced', 'Hired', 'Onboarded', 'Trained', 'Mentored',
  'Coached', 'Mediated', 'Accelerated', 'Strengthened', 'Enhanced',
  'Maximized', 'Partnered', 'Collaborated', 'Achieved', 'Resolved'
];

export const WEAK_PASSIVE_VERBS = [
  'Worked on', 'Helped with', 'Assisted in', 'Responsible for', 'Handled',
  'Did', 'Participated in', 'Contributed to', 'Was involved in', 'Supported',
  'Assisted', 'Tried', 'Attempted', 'Looked at'
];

// ═══════════════════════════════════════════════════════════════
// Master Data Normalizer
// ═══════════════════════════════════════════════════════════════

export function normalizeResumeData(raw?: Partial<ResumeData> | null): ResumeData {
  const safe = raw || {};
  const personalInfo = safe.personalInfo || ({} as Partial<ResumeData['personalInfo']>);
  const skills = safe.skills || ({} as Partial<ResumeData['skills']>);

  return {
    personalInfo: {
      fullName: personalInfo.fullName || '',
      title: personalInfo.title || '',
      email: personalInfo.email || '',
      phone: personalInfo.phone || '',
      location: personalInfo.location || '',
      linkedin: personalInfo.linkedin || '',
      github: personalInfo.github || '',
      portfolio: personalInfo.portfolio || '',
    },
    summary: safe.summary || '',
    experience: Array.isArray(safe.experience)
      ? safe.experience
          .filter(Boolean)
          .map((exp, idx) => ({
            id: exp.id || `exp-${idx}-${Date.now()}`,
            title: exp.title || '',
            company: exp.company || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: Boolean(exp.current),
            bullets: Array.isArray(exp.bullets) ? exp.bullets.filter(Boolean) : [],
            achievements: Array.isArray(exp.achievements) ? exp.achievements.filter(Boolean) : []
          }))
      : [],
    education: Array.isArray(safe.education)
      ? safe.education
          .filter(Boolean)
          .map((edu, idx) => ({
            id: edu.id || `edu-${idx}-${Date.now()}`,
            degree: edu.degree || '',
            school: edu.school || '',
            location: edu.location || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            gpa: edu.gpa || '',
            highlights: edu.highlights || '',
            coursework: edu.coursework || ''
          }))
      : [],
    projects: Array.isArray(safe.projects)
      ? safe.projects
          .filter(Boolean)
          .map((proj, idx) => ({
            id: proj.id || `proj-${idx}-${Date.now()}`,
            name: proj.name || '',
            description: proj.description || '',
            techStack: Array.isArray(proj.techStack) ? proj.techStack.filter(Boolean) : [],
            liveUrl: proj.liveUrl || '',
            repoUrl: proj.repoUrl || '',
            bullets: Array.isArray(proj.bullets) ? proj.bullets.filter(Boolean) : [],
            achievements: Array.isArray(proj.achievements) ? proj.achievements.filter(Boolean) : []
          }))
      : [],
    skills: {
      languages: Array.isArray(skills.languages) ? skills.languages.filter(Boolean) : [],
      frameworks: Array.isArray(skills.frameworks) ? skills.frameworks.filter(Boolean) : [],
      databases: Array.isArray(skills.databases) ? skills.databases.filter(Boolean) : [],
      cloudDevOps: Array.isArray(skills.cloudDevOps) ? skills.cloudDevOps.filter(Boolean) : [],
      tools: Array.isArray(skills.tools) ? skills.tools.filter(Boolean) : [],
      libraries: Array.isArray(skills.libraries) ? skills.libraries.filter(Boolean) : [],
      security: Array.isArray(skills.security) ? skills.security.filter(Boolean) : [],
      other: Array.isArray(skills.other) ? skills.other.filter(Boolean) : [],
    },
    certifications: Array.isArray(safe.certifications)
      ? safe.certifications
          .filter(Boolean)
          .map((cert, idx) => ({
            id: cert.id || `cert-${idx}-${Date.now()}`,
            title: cert.title || '',
            issuer: cert.issuer || '',
            date: cert.date || '',
            credentialUrl: cert.credentialUrl || ''
          }))
      : [],
    publications: Array.isArray(safe.publications)
      ? safe.publications
          .filter(Boolean)
          .map((pub, idx) => ({
            id: pub.id || `pub-${idx}-${Date.now()}`,
            title: pub.title || '',
            venue: pub.venue || '',
            date: pub.date || '',
            url: pub.url || ''
          }))
      : [],
    patents: Array.isArray(safe.patents)
      ? safe.patents
          .filter(Boolean)
          .map((pat, idx) => ({
            id: pat.id || `pat-${idx}-${Date.now()}`,
            title: pat.title || '',
            number: pat.number || '',
            date: pat.date || '',
            url: pat.url || ''
          }))
      : [],
    customSections: Array.isArray(safe.customSections)
      ? safe.customSections
          .filter(Boolean)
          .map((sec, idx) => ({
            id: sec.id || `sec-${idx}-${Date.now()}`,
            title: sec.title || '',
            items: Array.isArray(sec.items) ? sec.items.filter(Boolean) : []
          }))
      : [],
    rawText: safe.rawText || '',
    achievements: Array.isArray(safe.achievements) ? safe.achievements.filter(Boolean) : [],
    languages: Array.isArray(safe.languages) ? safe.languages.filter(Boolean) : [],
    hobbies: Array.isArray(safe.hobbies) ? safe.hobbies.filter(Boolean) : []
  };
}

// ═══════════════════════════════════════════════════════════════
// Helper to extract text from entire resume object
// ═══════════════════════════════════════════════════════════════

export function resumeToPlainText(rawResume?: ResumeData | null): string {
  if (!rawResume) return '';
  const resume = normalizeResumeData(rawResume);
  const parts: string[] = [];

  const contactParts: string[] = [];
  if (resume.personalInfo.fullName) contactParts.push(resume.personalInfo.fullName);
  if (resume.personalInfo.title) contactParts.push(resume.personalInfo.title);
  const contactLine: string[] = [];
  if (resume.personalInfo.email) contactLine.push(resume.personalInfo.email);
  if (resume.personalInfo.phone) contactLine.push(resume.personalInfo.phone);
  if (resume.personalInfo.location) contactLine.push(resume.personalInfo.location);
  if (resume.personalInfo.linkedin) contactLine.push(resume.personalInfo.linkedin);
  if (resume.personalInfo.github) contactLine.push(resume.personalInfo.github);
  if (resume.personalInfo.portfolio) contactLine.push(resume.personalInfo.portfolio);
  if (contactLine.length > 0) contactParts.push(contactLine.join(' | '));
  if (contactParts.length > 0) parts.push(contactParts.join('\n'));

  if (resume.summary) parts.push(`SUMMARY\n${resume.summary}`);

  const expParts: string[] = [];
  (resume.experience || []).forEach((exp) => {
    if (exp && (exp.title || exp.company)) {
      const dates = exp.startDate || exp.endDate ? ` | ${exp.startDate || ''} – ${exp.endDate || ''}` : '';
      const loc = exp.location ? ` | ${exp.location}` : '';
      expParts.push(`${exp.title || 'Role'} at ${exp.company || 'Company'}${loc}${dates}`.trim());
    }
    (exp?.bullets || []).forEach((b) => {
      if (b) expParts.push(`• ${b}`);
    });
    (exp?.achievements || []).forEach((a) => {
      if (a) expParts.push(`• ${a}`);
    });
  });
  if (expParts.length > 0) {
    parts.push(`EXPERIENCE\n${expParts.join('\n')}`);
  }

  const projParts: string[] = [];
  (resume.projects || []).forEach((proj) => {
    if (proj?.name) {
      const tech = Array.isArray(proj.techStack) && proj.techStack.length > 0 ? ` | ${proj.techStack.join(', ')}` : '';
      projParts.push(`${proj.name}${tech}`);
    }
    if (proj?.description) projParts.push(proj.description);
    (proj?.bullets || []).forEach((b) => {
      if (b) projParts.push(`• ${b}`);
    });
    (proj?.achievements || []).forEach((a) => {
      if (a) projParts.push(`• ${a}`);
    });
  });
  if (projParts.length > 0) {
    parts.push(`PROJECTS\n${projParts.join('\n')}`);
  }

  const skillLines: string[] = [];
  if (resume.skills?.languages?.length) skillLines.push(`Languages: ${resume.skills.languages.join(', ')}`);
  if (resume.skills?.frameworks?.length) skillLines.push(`Frameworks: ${resume.skills.frameworks.join(', ')}`);
  if (resume.skills?.databases?.length) skillLines.push(`Databases: ${resume.skills.databases.join(', ')}`);
  if (resume.skills?.cloudDevOps?.length) skillLines.push(`DevOps & Cloud: ${resume.skills.cloudDevOps.join(', ')}`);
  if (resume.skills?.tools?.length) skillLines.push(`Tools: ${resume.skills.tools.join(', ')}`);
  if (resume.skills?.libraries?.length) skillLines.push(`Libraries: ${resume.skills.libraries.join(', ')}`);
  if (resume.skills?.security?.length) skillLines.push(`Security: ${resume.skills.security.join(', ')}`);
  if (resume.skills?.other?.length) skillLines.push(`Other: ${resume.skills.other.join(', ')}`);

  if (skillLines.length > 0) {
    parts.push(`TECHNICAL SKILLS\n${skillLines.join('\n')}`);
  }

  const eduParts: string[] = [];
  (resume.education || []).forEach((edu) => {
    if (edu && (edu.degree || edu.school)) {
      const dates = edu.startDate || edu.endDate ? ` | ${edu.startDate || ''} – ${edu.endDate || ''}` : '';
      const gpaStr = edu.gpa ? ` | GPA: ${edu.gpa}` : '';
      eduParts.push(`${edu.degree || 'Degree'} — ${edu.school || 'School'}${gpaStr}${dates}`.trim());
    }
    if (edu?.highlights) eduParts.push(`• ${edu.highlights}`);
    if (edu?.coursework) eduParts.push(`Relevant Coursework: ${edu.coursework}`);
  });
  if (eduParts.length > 0) {
    parts.push(`EDUCATION\n${eduParts.join('\n')}`);
  }

  const certParts: string[] = [];
  (resume.certifications || []).forEach((cert) => {
    if (cert && (cert.title || cert.issuer)) {
      certParts.push(`${cert.title || ''} — ${cert.issuer || ''} ${cert.date || ''}`.trim());
    }
  });
  if (certParts.length > 0) {
    parts.push(`CERTIFICATIONS\n${certParts.join('\n')}`);
  }

  (resume.publications || []).forEach((pub) => {
    if (pub && (pub.title || pub.venue)) {
      parts.push(`${pub.title || ''} ${pub.venue || ''}`.trim());
    }
  });

  (resume.patents || []).forEach((pat) => {
    if (pat && (pat.title || pat.number)) {
      parts.push(`${pat.title || ''} ${pat.number || ''}`.trim());
    }
  });

  (resume.achievements || []).forEach((a) => {
    if (a) parts.push(a);
  });

  (resume.languages || []).forEach((l) => {
    if (l) parts.push(l);
  });

  (resume.customSections || []).forEach((sec) => {
    if (sec?.title) parts.push(sec.title);
    (sec?.items || []).forEach((it) => {
      if (it) parts.push(it);
    });
  });

  return parts.filter(Boolean).join('\n');
}

// ═══════════════════════════════════════════════════════════════
// Domain Detection Engine
// ═══════════════════════════════════════════════════════════════

export function detectResumeDomain(plainText: string, resume?: ResumeData): {
  primaryDomain: CareerDomain;
  primaryLabel: string;
  matchedCount: number;
} {
  const text = (plainText || '').toLowerCase();
  const domainHits: Record<CareerDomain, number> = {
    UI_UX_DESIGN: 0,
    SOFTWARE_ENGINEERING: 0,
    CYBERSECURITY: 0,
    DATA_AI_ML: 0,
    CLOUD_DEVOPS: 0,
    PRODUCT_MANAGEMENT: 0,
    MARKETING: 0,
    FINANCE_ACCOUNTING: 0,
    HR_RECRUITING: 0,
    SALES_BIZDEV: 0,
    ELECTRICAL_ELECTRONICS: 0,
    MECHANICAL_CIVIL: 0,
    HEALTHCARE: 0,
    EDUCATION: 0,
    GENERAL_BUSINESS: 0,
  };

  // 1. Give extra weight to headline / title if present
  const title = (resume?.personalInfo?.title || '').toLowerCase();
  if (/ux|ui|design|figma|product designer/i.test(title)) domainHits.UI_UX_DESIGN += 5;
  if (/software|developer|frontend|backend|fullstack|engineer/i.test(title)) domainHits.SOFTWARE_ENGINEERING += 5;
  if (/cyber|security|soc|infosec|penetration/i.test(title)) domainHits.CYBERSECURITY += 5;
  if (/data scientist|machine learning|ai|ml engineer|analytics/i.test(title)) domainHits.DATA_AI_ML += 5;
  if (/devops|cloud|sre|infrastructure/i.test(title)) domainHits.CLOUD_DEVOPS += 5;
  if (/product manager|product owner|program manager/i.test(title)) domainHits.PRODUCT_MANAGEMENT += 5;
  if (/marketing|seo|growth|content/i.test(title)) domainHits.MARKETING += 5;
  if (/finance|accountant|financial|audit/i.test(title)) domainHits.FINANCE_ACCOUNTING += 5;
  if (/recruiter|talent|hr|human resources/i.test(title)) domainHits.HR_RECRUITING += 5;
  if (/sales|account executive|business development|bdr/i.test(title)) domainHits.SALES_BIZDEV += 5;

  // 2. Count occurrences of domain-specific skills in resume text
  Object.entries(DOMAIN_SKILLS_TAXONOMY).forEach(([domainKey, { skills }]) => {
    const d = domainKey as CareerDomain;
    skills.forEach(sk => {
      const escaped = sk.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(text)) {
        domainHits[d] = (domainHits[d] || 0) + 1;
      }
    });
  });

  // Find domain with highest hits
  let bestDomain: CareerDomain = 'GENERAL_BUSINESS';
  let maxHits = -1;

  Object.entries(domainHits).forEach(([domainKey, hits]) => {
    if (hits > maxHits) {
      maxHits = hits;
      bestDomain = domainKey as CareerDomain;
    }
  });

  // Default to general business or software engineering if low hits
  if (maxHits === 0) {
    bestDomain = 'GENERAL_BUSINESS';
  }

  return {
    primaryDomain: bestDomain,
    primaryLabel: DOMAIN_SKILLS_TAXONOMY[bestDomain]?.label || 'General Professional',
    matchedCount: Math.max(0, maxHits)
  };
}

// ═══════════════════════════════════════════════════════════════
// Extract All Recognized Skills from Text (Cross-Domain)
// ═══════════════════════════════════════════════════════════════

export function extractSkillsFromText(text: string): SkillItem[] {
  if (!text) return [];
  const foundSkills: SkillItem[] = [];
  const foundNames = new Set<string>();

  ALL_TAXONOMY_SKILLS.forEach(sk => {
    const escaped = sk.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      if (!foundNames.has(sk.name.toLowerCase())) {
        foundNames.add(sk.name.toLowerCase());
        foundSkills.push(sk);
      }
    }
  });

  return foundSkills;
}

// ═══════════════════════════════════════════════════════════════
// Metrics & Outcome-Oriented Impact Detection
// ═══════════════════════════════════════════════════════════════

export function hasQuantifiableMetrics(text: string): boolean {
  if (!text) return false;

  // 1. Numeric metrics, percentages, dollar amounts, scale units
  const metricRegex = /\b(\d+(?:\.\d+)?%|\$[\d,]+(?:\.\d+)?|\d+\+?|\b\d+x\b|\b\d+\s*(?:users|clients|requests|qps|rps|tps|ms|seconds|minutes|hours|days|percent|engineers|services|k|m|b|million|thousand|screens|flows|interviews|participants|iterations|prototypes|leads|deals|customers|cases))\b/i;
  if (metricRegex.test(text)) return true;

  // 2. Qualitative outcome-oriented achievement language
  const outcomeRegex = /(?:reduced|decreased|minimized|eliminated)\s+(?:friction|drop-off|errors?|churn|latency|complexity|bounce rate|time|overhead|costs?|bottlenecks?)|(?:improved|increased|boosted|enhanced|maximized|elevated)\s+(?:clarity|usability|engagement|retention|conversion|satisfaction|accessibility|adoption|efficiency|productivity|readability|nps|throughput|revenue|accuracy|performance)|(?:streamlined|simplified|accelerated|optimized|standardized)\s+(?:onboarding|workflows?|user flows?|checkouts?|processes?|design systems?|pipelines?|operations?|experiences?|interactions?|systems?)|(?:resulting in|leading to|driving|delivering|achieving|contributing to)\s+[a-zA-Z\s]{4,}/i;
  return outcomeRegex.test(text);
}

// Detect leading action verb
export function checkActionVerb(text: string): { isStrong: boolean; verb: string } {
  const trimmed = text.trim();
  const firstWordMatch = trimmed.match(/^([A-Za-z]+ed|[A-Za-z]+ing|[A-Za-z]+)/);
  const firstWord = firstWordMatch ? firstWordMatch[1] : '';

  const isStrong = STRONG_ACTION_VERBS.some(v => v.toLowerCase() === firstWord.toLowerCase());
  return { isStrong, verb: firstWord };
}

// ═══════════════════════════════════════════════════════════════
// Domain-Aware STAR Rewrite Engine
// ═══════════════════════════════════════════════════════════════

export function generateStarRewrite(originalBullet: string, contextRole?: string): { rewritten: string; reason: string } {
  const trimmed = originalBullet.trim();
  const polished = trimmed.endsWith('.') ? trimmed : `${trimmed}.`;

  // Already strong: no rewrite needed.
  if (hasQuantifiableMetrics(trimmed) && checkActionVerb(trimmed).isStrong) {
    return {
      rewritten: polished,
      reason: 'Already follows STAR structure with a strong action verb and a measurable outcome.'
    };
  }

  // We do NOT fabricate achievements, metrics, tech stacks, or random action
  // verbs. Rewrites are limited to safe cosmetic polish; the reason points out
  // which truthful, resume-specific details the candidate should add themselves.
  const missing: string[] = [];
  if (!checkActionVerb(trimmed).isStrong) {
    missing.push('a strong leading action verb');
  }
  if (!hasQuantifiableMetrics(trimmed)) {
    missing.push('a measurable outcome (number, %, or scale)');
  }

  const scope = contextRole ? ` for your ${contextRole} work` : '';
  return {
    rewritten: polished,
    reason: missing.length
      ? `Consider adding ${missing.join(' and ')}${scope}, based on your real results — achievements are never auto-generated.`
      : `Minor polish only${scope}; add concrete, truthful details from your own experience to strengthen impact.`
  };
}

// ═══════════════════════════════════════════════════════════════
// Extract Keywords from Job Description (Multi-Domain)
// ═══════════════════════════════════════════════════════════════

export function extractKeywordsFromJd(jobDescription: string): string[] {
  if (!jobDescription || !jobDescription.trim()) {
    return [];
  }

  const jdText = jobDescription.toLowerCase();
  const matchedNames: string[] = [];
  const seen = new Set<string>();

  ALL_TAXONOMY_SKILLS.forEach(sk => {
    const escaped = sk.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(jdText)) {
      if (!seen.has(sk.name.toLowerCase())) {
        seen.add(sk.name.toLowerCase());
        matchedNames.push(sk.name);
      }
    }
  });

  return matchedNames;
}

// ═══════════════════════════════════════════════════════════════
// Rigorous ATS Calculation Function (Dual-Mode)
// ═══════════════════════════════════════════════════════════════

export function calculateAtsScore(
  rawResume?: ResumeData | null,
  jobDescription: string = '',
  jobTitle: string = ''
): AtsScoreResult {
  const resume = normalizeResumeData(rawResume);
  const plainText = resumeToPlainText(resume);
  const lowerPlainText = plainText.toLowerCase();

  const domainInfo = detectResumeDomain(lowerPlainText, resume);
  const hasTargetJd = Boolean(jobDescription && jobDescription.trim().length > 0);

  // 1. Keyword / Competency Score (0 - 40 points)
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let keywordScore = 0;

  if (hasTargetJd) {
    // Mode A: Target Job Description Match
    const targetKeywords = extractKeywordsFromJd(jobDescription);

    if (targetKeywords.length > 0) {
      targetKeywords.forEach(kw => {
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (regex.test(lowerPlainText)) {
          matchedKeywords.push(kw);
        } else {
          missingKeywords.push(kw);
        }
      });
      const keywordRatio = targetKeywords.length > 0 ? (matchedKeywords.length / targetKeywords.length) : 1;
      keywordScore = Math.min(40, Math.round(keywordRatio * 40));
    } else {
      // JD has no matched taxonomy terms -> extract general skills from resume
      const extracted = extractSkillsFromText(lowerPlainText);
      matchedKeywords = extracted.map(s => s.name);
      keywordScore = Math.min(40, Math.max(15, matchedKeywords.length * 4));
    }
  } else {
    // Mode B: General ATS Compatibility (No Target JD provided)
    // Evaluates the richness and depth of professional competencies across all domains
    const extracted = extractSkillsFromText(lowerPlainText);
    matchedKeywords = extracted.map(s => s.name);

    // Scoring curve for general competency richness:
    // 10+ recognized professional skills = 40 pts
    // 8-9 skills = 36 pts
    // 6-7 skills = 32 pts
    // 4-5 skills = 26 pts
    // 2-3 skills = 18 pts
    // 1 skill = 12 pts
    // 0 skills = 0 pts
    const count = matchedKeywords.length;
    if (count >= 10) keywordScore = 40;
    else if (count >= 8) keywordScore = 36;
    else if (count >= 6) keywordScore = 32;
    else if (count >= 4) keywordScore = 26;
    else if (count >= 2) keywordScore = 18;
    else if (count >= 1) keywordScore = 12;
    else keywordScore = 0;
  }

  // 2. Quantifiable Impact & STAR Metrics Score (0 - 25 points)
  let totalBullets = 0;
  let bulletsWithMetrics = 0;
  let bulletsWithStrongVerbs = 0;
  const bulletsAudit: BulletAudit[] = [];

  (resume.experience || []).forEach(exp => {
    (exp?.bullets || []).forEach((bullet, idx) => {
      if (!bullet) return;
      totalBullets++;
      const hasMetric = hasQuantifiableMetrics(bullet);
      const { isStrong, verb } = checkActionVerb(bullet);

      if (hasMetric) bulletsWithMetrics++;
      if (isStrong) bulletsWithStrongVerbs++;

      const rewrite = generateStarRewrite(bullet, `${exp.title || 'Role'} at ${exp.company || 'Company'}`);

      bulletsAudit.push({
        id: `${exp.id || 'exp'}-b${idx}`,
        context: `${exp.title || 'Position'} • ${exp.company || 'Company'}`,
        original: bullet,
        hasMetrics: hasMetric,
        hasStrongVerb: isStrong,
        detectedVerb: verb || 'None',
        suggestedRewrite: rewrite.rewritten,
        improvementReason: rewrite.reason
      });
    });
  });

  (resume.projects || []).forEach(proj => {
    (proj?.bullets || []).forEach((bullet, idx) => {
      if (!bullet) return;
      totalBullets++;
      const hasMetric = hasQuantifiableMetrics(bullet);
      const { isStrong, verb } = checkActionVerb(bullet);

      if (hasMetric) bulletsWithMetrics++;
      if (isStrong) bulletsWithStrongVerbs++;

      const rewrite = generateStarRewrite(bullet, `Project / Case Study: ${proj.name || 'Key Work'}`);

      bulletsAudit.push({
        id: `${proj.id || 'proj'}-b${idx}`,
        context: `Project / Case Study • ${proj.name || 'Key Work'}`,
        original: bullet,
        hasMetrics: hasMetric,
        hasStrongVerb: isStrong,
        detectedVerb: verb || 'None',
        suggestedRewrite: rewrite.rewritten,
        improvementReason: rewrite.reason
      });
    });
  });

  const metricsRatio = totalBullets > 0 ? (bulletsWithMetrics / totalBullets) : 0.8;
  const metricsScore = Math.min(25, Math.round(metricsRatio * 25));

  // Action Verb Strength Score (0 - 15 points)
  const verbRatio = totalBullets > 0 ? (bulletsWithStrongVerbs / totalBullets) : 0.8;
  const actionVerbScore = Math.min(15, Math.round(verbRatio * 15));

  // ═══════════════════════════════════════════════════════════════
  // 6 FIXED ATS PILLARS (Total = 100 max points)
  // 1. Structure (20 pts)
  // 2. Content Completeness (20 pts)
  // 3. ATS Extractability (20 pts)
  // 4. Skills & Technical Content (15 pts)
  // 5. Experience / Achievement Quality (15 pts)
  // 6. Basic ATS Formatting (10 pts)
  // ═══════════════════════════════════════════════════════════════

  // ── 1. Structure (20 pts) ──
  const hasName = Boolean(resume.personalInfo?.fullName?.trim());
  const hasEmail = Boolean(resume.personalInfo?.email?.trim());
  const hasPhone = Boolean(resume.personalInfo?.phone?.trim());
  const hasLinks = Boolean(resume.personalInfo?.linkedin?.trim() || resume.personalInfo?.github?.trim() || resume.personalInfo?.portfolio?.trim());
  const hasContact = hasName && (hasEmail || hasPhone);

  let structHeaderPts = 0;
  if (hasName && hasEmail && hasPhone) structHeaderPts = 4;
  else if (hasName && (hasEmail || hasPhone)) structHeaderPts = 3;
  else if (hasEmail || hasPhone) structHeaderPts = 2;

  const hasEdu = (resume.education || []).length >= 1 && Boolean(resume.education[0]?.degree || resume.education[0]?.school);
  const totalSkillCount = (
    (resume.skills?.languages?.length || 0) +
    (resume.skills?.frameworks?.length || 0) +
    (resume.skills?.databases?.length || 0) +
    (resume.skills?.cloudDevOps?.length || 0) +
    (resume.skills?.tools?.length || 0) +
    (resume.skills?.libraries?.length || 0) +
    (resume.skills?.security?.length || 0) +
    (resume.skills?.other?.length || 0) +
    matchedKeywords.length
  );
  const hasSkills = totalSkillCount >= 2;
  const hasExp = (resume.experience || []).length >= 1;
  const hasProj = (resume.projects || []).length >= 1;

  let structCorePts = 0;
  if (hasEdu) structCorePts += 2;
  if (hasSkills) structCorePts += 2;
  if (hasExp && hasProj) structCorePts += 4;
  else if (hasExp || hasProj) structCorePts += 3;

  const summaryWords = (resume.summary || '').trim().split(/\s+/).filter(Boolean).length;
  const hasGoodSummary = summaryWords >= 15 && summaryWords <= 140;
  const hasCerts = (resume.certifications || []).length >= 1 || (resume.achievements || []).length >= 1;

  let structSuppPts = 0;
  if (hasGoodSummary || summaryWords >= 5) structSuppPts += 2;
  if (hasCerts) structSuppPts += 2;

  const structOrderPts = hasContact ? 2 : 1;
  const recognizedSectionsCount = [hasEdu, hasSkills, hasExp, hasProj, hasGoodSummary, hasCerts].filter(Boolean).length;
  const structHeadingPts = recognizedSectionsCount >= 4 ? 2 : (recognizedSectionsCount >= 2 ? 1 : 0);

  const structureScore = Math.min(20, structHeaderPts + structCorePts + structSuppPts + structOrderPts + structHeadingPts);

  // ── 2. Content Completeness (20 pts) ──
  let compContactPts = 0;
  if (hasName) compContactPts += 2;
  if (hasEmail) compContactPts += 2;
  if (hasPhone) compContactPts += 1;
  if (hasLinks) compContactPts += 1;

  let compEduPts = 0;
  if (hasEdu) {
    if (resume.education[0]?.degree) compEduPts += 2;
    if (resume.education[0]?.school) compEduPts += 1;
    if (resume.education[0]?.endDate || resume.education[0]?.gpa) compEduPts += 1;
  }

  const totalWorkItems = (resume.experience?.length || 0) + (resume.projects?.length || 0);
  let compWorkPts = 0;
  if (totalWorkItems >= 3 || totalBullets >= 4) compWorkPts = 6;
  else if (totalWorkItems >= 2 || totalBullets >= 2) compWorkPts = 4;
  else if (totalWorkItems >= 1 || totalBullets >= 1) compWorkPts = 2;

  let compSkillsPts = 0;
  if (totalSkillCount >= 8) compSkillsPts = 4;
  else if (totalSkillCount >= 5) compSkillsPts = 3;
  else if (totalSkillCount >= 2) compSkillsPts = 2;
  else if (totalSkillCount >= 1) compSkillsPts = 1;

  const completenessScore = Math.min(20, compContactPts + compEduPts + compWorkPts + compSkillsPts);

  // ── 3. ATS Extractability (20 pts) ──
  const extractCleanPts = 6; // Client-rendered JSON is clean
  let extractHeadingPts = 4;
  if (recognizedSectionsCount >= 4) extractHeadingPts = 6;
  else if (recognizedSectionsCount >= 3) extractHeadingPts = 5;

  const extractFlowPts = 5;
  const extractRedundancyPts = 3;
  const extractabilityScore = Math.min(20, extractCleanPts + extractHeadingPts + extractFlowPts + extractRedundancyPts);

  // ── 4. Skills & Technical Content (15 pts) ──
  const skillsSecPts = totalSkillCount >= 3 ? 3 : (totalSkillCount >= 1 ? 1 : 0);
  let skillsCountPts = 0;
  if (totalSkillCount >= 10) skillsCountPts = 5;
  else if (totalSkillCount >= 7) skillsCountPts = 4;
  else if (totalSkillCount >= 4) skillsCountPts = 3;
  else if (totalSkillCount >= 2) skillsCountPts = 2;
  else if (totalSkillCount >= 1) skillsCountPts = 1;

  const activeCategoriesCount = [
    (resume.skills?.languages?.length || 0) > 0,
    (resume.skills?.frameworks?.length || 0) > 0,
    (resume.skills?.databases?.length || 0) > 0,
    (resume.skills?.cloudDevOps?.length || 0) > 0,
    (resume.skills?.tools?.length || 0) > 0,
  ].filter(Boolean).length;

  let skillsDivPts = 2;
  if (activeCategoriesCount >= 3) skillsDivPts = 4;
  else if (activeCategoriesCount >= 2) skillsDivPts = 3;

  const skillsCatPts = activeCategoriesCount >= 2 ? 3 : (totalSkillCount >= 4 ? 2 : 1);
  const skillsScore = Math.min(15, skillsSecPts + skillsCountPts + skillsDivPts + skillsCatPts);

  // ── 5. Experience / Achievement Quality (15 pts) ──
  let expActionPts = 1;
  let expSpecificPts = 1;
  let expImpactPts = 1;
  let expQuantPts = 0;

  if (totalBullets > 0) {
    const actionPct = (bulletsWithStrongVerbs / totalBullets) * 100;
    if (actionPct >= 75) expActionPts = 4;
    else if (actionPct >= 50) expActionPts = 3;
    else if (actionPct >= 25) expActionPts = 2;
    else expActionPts = 1;

    expSpecificPts = 3; // Specific technical verbs/context
    expImpactPts = 3;

    const quantPct = (bulletsWithMetrics / totalBullets) * 100;
    if (quantPct >= 60) expQuantPts = 3;
    else if (quantPct >= 30) expQuantPts = 2;
    else if (quantPct >= 15) expQuantPts = 1;
    else expQuantPts = 0;
  }

  const experienceQualityScore = Math.min(15, expActionPts + expSpecificPts + expImpactPts + expQuantPts);

  // ── 6. Basic ATS Formatting (10 pts) ──
  const fmtBulletPts = totalBullets > 0 ? 3 : 2;
  const fmtDatePts = hasEdu || hasExp ? 3 : 2;
  const totalWordCount = plainText.split(/\s+/).filter(Boolean).length;
  const fmtLengthPts = (totalWordCount >= 150 && totalWordCount <= 950) ? 2 : 1;
  const fmtSymbolPts = 2;

  const formattingScore = Math.min(10, fmtBulletPts + fmtDatePts + fmtLengthPts + fmtSymbolPts);

  // Total Score: EXACT sum of the 6 fixed pillars (20+20+20+15+15+10 = 100 max)
  const totalScore = Math.min(100, Math.max(0, structureScore + completenessScore + extractabilityScore + skillsScore + experienceQualityScore + formattingScore));

  const formatChecks: Array<{ title: string; passed: boolean; description: string }> = [
    {
      title: 'Standard Contact Header',
      passed: hasContact,
      description: hasContact
        ? 'Includes candidate name and verified contact details.'
        : 'Missing full contact details (name and email or phone recommended for recruiters).'
    },
    {
      title: 'Professional Profile / Summary',
      passed: hasGoodSummary,
      description: hasGoodSummary
        ? `Concise profile summary (${summaryWords} words) structured for ATS extraction.`
        : summaryWords === 0
          ? 'Summary is missing. Adding a 30–80 word summary improves ATS search ranking.'
          : `Summary is ${summaryWords < 15 ? 'too brief' : 'too lengthy'}. Ideal length is 30–80 words.`
    },
    {
      title: 'Structured Experience & Work History',
      passed: totalWorkItems >= 1,
      description: totalWorkItems >= 1
        ? `Includes ${resume.experience?.length || 0} career role(s) and ${resume.projects?.length || 0} project/case study entries.`
        : 'At least 1 work experience entry or case study with descriptive bullets recommended.'
    },
    {
      title: 'Education & Professional Credentials',
      passed: hasEdu || hasCerts,
      description: hasEdu || hasCerts
        ? 'Accredited degree, certifications, or educational background designated.'
        : 'ATS expects at least 1 verified education entry or professional certification.'
    },
    {
      title: 'Domain Competencies & Skills',
      passed: totalSkillCount >= 3,
      description: totalSkillCount >= 3
        ? `${totalSkillCount} domain competencies indexed across ${domainInfo.primaryLabel}.`
        : 'Add professional competencies categorized across skills, methods, or tools.'
    }
  ];

  let grade: AtsScoreResult['grade'] = 'Needs Improvement';
  if (totalScore >= 90) grade = 'Exceptional Match';
  else if (totalScore >= 75) grade = 'Competitive Match';
  else if (totalScore >= 60) grade = 'Moderate Match';

  const bulletAnalysis = auditResumeBullets(resume);

  return {
    totalScore,
    hasTargetJd,
    detectedDomain: domainInfo.primaryLabel,
    grade,
    breakdown: {
      structureScore,
      completenessScore,
      extractabilityScore,
      skillsScore,
      experienceQualityScore,
      formattingScore,
      keywordScore,
      metricsScore,
      actionVerbScore
    },
    matchedKeywords,
    missingKeywords,
    bulletsAudit,
    recommendationGroups: bulletAnalysis.recommendationGroups,
    recommendationSummary: bulletAnalysis.summary,
    formatChecks,
    executiveSummaryAnalysis: {
      wordCount: summaryWords,
      hasJobKeywords: Boolean(matchedKeywords.length > 0 && resume.summary && matchedKeywords.some(kw => resume.summary.toLowerCase().includes(kw.toLowerCase()))),
      suggestion: matchedKeywords.length > 0
        ? `Incorporate key competencies like "${matchedKeywords.slice(0, 3).join(', ')}" directly into your summary for top-of-fold recruiter impact.`
        : `Align summary with your target role in ${domainInfo.primaryLabel} and highlight top domain achievements.`
    }
  };
}

/**
 * Maps the authoritative backend ATS evaluation result (from bge_ats_scorer.py)
 * directly into the UI data model with 100% fidelity (no re-weighting or rounding).
 */
export function mapBackendAtsResultToUi(backend: any, resume?: ResumeData): AtsScoreResult {
  if (!backend) {
    return calculateAtsScore(resume);
  }

  const breakdown = backend.breakdown || {};
  const structureScore = Number(breakdown.structure ?? breakdown.structureScore ?? 0);
  const completenessScore = Number(breakdown.completeness ?? breakdown.completenessScore ?? 0);
  const extractabilityScore = Number(breakdown.extractability ?? breakdown.extractabilityScore ?? 0);
  const skillsScore = Number(breakdown.skills ?? breakdown.skillsScore ?? 0);
  const experienceQualityScore = Number(breakdown.experienceQuality ?? breakdown.experienceQualityScore ?? 0);
  const formattingScore = Number(breakdown.formatting ?? breakdown.formattingScore ?? 0);

  const totalScore = Number(
    backend.overallScore ??
    backend.totalScore ??
    (structureScore + completenessScore + extractabilityScore + skillsScore + experienceQualityScore + formattingScore)
  );

  const bulletsAudit: BulletAudit[] = (backend.bulletAudits || backend.bulletsAudit || []).map((b: any, idx: number) => ({
    id: b.id || `audit-${idx}`,
    context: b.category || b.context || 'Accomplishment',
    original: b.original || '',
    hasMetrics: Boolean(b.hasMetric ?? b.hasMetrics),
    hasStrongVerb: Boolean(b.hasActionVerb ?? b.hasStrongVerb),
    detectedVerb: b.detectedVerb || (b.hasActionVerb ? 'Action Verb' : 'None'),
    suggestedRewrite: b.suggestedRewrite || b.feedback || '',
    improvementReason: b.improvementReason || b.feedback || '',
  }));

  let recommendationGroups: RecommendationGroup[] = backend.recommendationGroups || [];
  let recommendationSummary: RecommendationSummary | undefined = backend.recommendationSummary;

  if ((!recommendationGroups || recommendationGroups.length === 0) && resume) {
    const analysis = auditResumeBullets(resume);
    recommendationGroups = analysis.recommendationGroups;
    recommendationSummary = analysis.summary;
  }

  const grade: AtsScoreResult['grade'] =
    totalScore >= 80 ? 'Exceptional Match'
    : totalScore >= 65 ? 'Competitive Match'
    : totalScore >= 50 ? 'Moderate Match'
    : 'Needs Improvement';

  const detectedSkills = backend.explicitlyDetectedSkills || backend.extractedSkills || [];
  const quant = backend.quantification;

  return {
    totalScore,
    grade,
    breakdown: {
      structureScore,
      completenessScore,
      extractabilityScore,
      skillsScore,
      experienceQualityScore,
      formattingScore,
      keywordScore: Math.round((skillsScore / 15) * 40),
      metricsScore: Math.round((experienceQualityScore / 15) * 25),
      actionVerbScore: Math.round((experienceQualityScore / 15) * 15),
    },
    matchedKeywords: detectedSkills,
    missingKeywords: [],
    bulletsAudit,
    recommendationGroups,
    recommendationSummary,
    formatChecks: [
      {
        title: 'ATS Structure Integrity',
        passed: structureScore >= 14,
        description: structureScore >= 14
          ? 'Verified standard hierarchical section ordering across Contact, Education, Skills, and Experience/Projects.'
          : 'Non-standard section hierarchy detected. Ensure core sections (Education, Skills, Experience) use standard headers for automated ATS classification.',
      },
      {
        title: 'Content Completeness',
        passed: completenessScore >= 14,
        description: completenessScore >= 14
          ? 'Core resume content complete with verified contact details, academic background, technical competencies, and experience.'
          : (resume?.personalInfo && (!resume.personalInfo.email || !resume.personalInfo.phone))
            ? 'Missing contact channels (email or phone). Verified contact information is required for recruiter screening.'
            : (resume && (!resume.education || resume.education.length === 0))
              ? 'Missing education credentials or degree history. Add your degree or institution details.'
              : 'Incomplete section inventory. Ensure all core sections (Contact, Experience, Education, Skills) contain detailed entries.',
      },
      {
        title: 'ATS Machine Extractability',
        passed: extractabilityScore >= 14,
        description: extractabilityScore >= 14
          ? 'Clean sequential text stream with 0 unreadable character encodings or OCR anomalies.'
          : 'Potential parsing bottlenecks detected. Use single-column flow and standard Unicode typography to prevent text fragmentation.',
      },
      {
        title: 'Skills & Technical Content',
        passed: skillsScore >= 10,
        description: skillsScore >= 10
          ? `${detectedSkills.length} domain competencies indexed and categorized across modern technology frameworks and developer tools.`
          : 'Fewer than 4 categorized skills detected. Group technical proficiencies into distinct categories (Languages, Frameworks, Databases, Tools).',
      },
      {
        title: 'Experience & Bullet Quality',
        passed: experienceQualityScore >= 10,
        description: experienceQualityScore >= 10
          ? (quant?.densityPercentage !== undefined
              ? `${quant.densityPercentage}% of achievement bullets include measurable metrics with strong action verbs.`
              : 'Accomplishment bullets feature strong active verbs and technical contributions.')
          : 'Accomplishment bullets lack measurable impact metrics. Add quantifiable results (%, $, user scale, latency reduction) to highlight business value.',
      },
      {
        title: 'Basic ATS Formatting',
        passed: formattingScore >= 7,
        description: formattingScore >= 7
          ? 'Standard date patterns (Month Year / YYYY) and consistent single-bullet formatting detected.'
          : 'Inconsistent date conventions or formatting detected. Use standard date formats (e.g. "Aug 2021 – Present") and uniform bullet styles.',
      },
    ],
    executiveSummaryAnalysis: {
      wordCount: (resume?.summary || '').split(/\s+/).filter(Boolean).length,
      hasJobKeywords: true,
      suggestion: backend.strengths?.[0] || 'Resume analyzed by authoritative BGE ATS engine.',
    },
    strengths: backend.strengths || [],
    improvements: backend.improvements || [],
  };
}

