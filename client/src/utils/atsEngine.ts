// ═══════════════════════════════════════════════════════════════
// Rigorous Multi-Domain ATS Scoring Engine & Keyword Analyzer
// Domain-neutral skill taxonomy covering 15+ career domains
// Dual-mode scoring: General ATS Compatibility vs Target Job Match
// ═══════════════════════════════════════════════════════════════

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
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    techStack: string[];
    liveUrl?: string;
    repoUrl?: string;
    bullets: string[];
  }>;
  skills: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    cloudDevOps: string[];
    tools: string[];
  };
  certifications: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    credentialUrl?: string;
  }>;
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

export interface AtsScoreResult {
  totalScore: number; // 0 - 100
  semanticScore: number; // 0 - 100 (Semantic AI similarity)
  hasTargetJd?: boolean;
  detectedDomain?: string;
  grade: 'Exceptional Match' | 'Competitive Match' | 'Moderate Match' | 'Needs Improvement';
  breakdown: {
    keywordScore: number;      // 0 - 40
    metricsScore: number;      // 0 - 25
    completenessScore: number; // 0 - 20
    actionVerbScore: number;   // 0 - 15
    semanticScore: number;     // 0 - 100
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  bulletsAudit: BulletAudit[];
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
            bullets: Array.isArray(exp.bullets) ? exp.bullets.filter(Boolean) : []
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
            highlights: edu.highlights || ''
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
            bullets: Array.isArray(proj.bullets) ? proj.bullets.filter(Boolean) : []
          }))
      : [],
    skills: {
      languages: Array.isArray(skills.languages) ? skills.languages.filter(Boolean) : [],
      frameworks: Array.isArray(skills.frameworks) ? skills.frameworks.filter(Boolean) : [],
      databases: Array.isArray(skills.databases) ? skills.databases.filter(Boolean) : [],
      cloudDevOps: Array.isArray(skills.cloudDevOps) ? skills.cloudDevOps.filter(Boolean) : [],
      tools: Array.isArray(skills.tools) ? skills.tools.filter(Boolean) : [],
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

  if (resume.personalInfo.fullName) parts.push(resume.personalInfo.fullName);
  if (resume.personalInfo.title) parts.push(resume.personalInfo.title);
  if (resume.personalInfo.location) parts.push(resume.personalInfo.location);
  if (resume.summary) parts.push(resume.summary);

  (resume.experience || []).forEach((exp) => {
    if (exp && (exp.title || exp.company)) {
      parts.push(`${exp.title || ''} at ${exp.company || ''}`.trim());
    }
    (exp?.bullets || []).forEach((b) => {
      if (b) parts.push(b);
    });
  });

  (resume.projects || []).forEach((proj) => {
    if (proj?.name) parts.push(proj.name);
    if (proj?.description) parts.push(proj.description);
    if (Array.isArray(proj?.techStack) && proj.techStack.length > 0) {
      parts.push(proj.techStack.join(' '));
    }
    (proj?.bullets || []).forEach((b) => {
      if (b) parts.push(b);
    });
  });

  const allSkills = [
    ...(resume.skills?.languages || []),
    ...(resume.skills?.frameworks || []),
    ...(resume.skills?.databases || []),
    ...(resume.skills?.cloudDevOps || []),
    ...(resume.skills?.tools || [])
  ];
  if (allSkills.length > 0) {
    parts.push(allSkills.join(' '));
  }

  (resume.education || []).forEach((edu) => {
    if (edu && (edu.degree || edu.school)) {
      parts.push(`${edu.degree || ''} ${edu.school || ''}`.trim());
    }
    if (edu?.highlights) parts.push(edu.highlights);
  });

  (resume.certifications || []).forEach((cert) => {
    if (cert && (cert.title || cert.issuer)) {
      parts.push(`${cert.title || ''} ${cert.issuer || ''}`.trim());
    }
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

  // If already strong with metrics & strong action verb, polish punctuation
  if (hasQuantifiableMetrics(trimmed) && checkActionVerb(trimmed).isStrong) {
    return {
      rewritten: trimmed.endsWith('.') ? trimmed : `${trimmed}.`,
      reason: 'Adheres to high-impact STAR structure with action verb and outcome.'
    };
  }

  const lower = trimmed.toLowerCase();

  // UI/UX & Design Bullet Rewrites
  if (lower.includes('figma') || lower.includes('wireframe') || lower.includes('prototype') || lower.includes('design') || lower.includes('ux') || lower.includes('ui') || lower.includes('user research') || lower.includes('flow')) {
    return {
      rewritten: `Designed and prototyped responsive design systems and end-to-end user flows in Figma, reducing user friction by 34% and improving task completion rates to 94%.`,
      reason: 'Injected leading strong action verb (Designed), design tool context, and measurable usability outcome.'
    };
  }

  // Engineering & Backend Rewrites
  if (lower.includes('api') || lower.includes('backend') || lower.includes('database') || lower.includes('sql') || lower.includes('node') || lower.includes('endpoint')) {
    return {
      rewritten: `Architected resilient high-throughput RESTful services using Node.js & PostgreSQL, reducing p99 latency by 38% while scaling to 150,000+ daily active requests.`,
      reason: 'Injected leading strong action verb (Architected), specific tech stack, and quantified latency & throughput metrics.'
    };
  }

  // Frontend & Web UI Rewrites
  if (lower.includes('frontend') || lower.includes('react') || lower.includes('component') || lower.includes('css') || lower.includes('typescript')) {
    return {
      rewritten: `Engineered accessible component libraries in TypeScript React, decreasing client bundle size by 27% and boosting Lighthouse performance score to 98/100.`,
      reason: 'Replaced passive phrasing with strong verb (Engineered), emphasized performance optimization, and added Lighthouse metrics.'
    };
  }

  // DevOps & Cloud Rewrites
  if (lower.includes('ci') || lower.includes('deploy') || lower.includes('docker') || lower.includes('cloud') || lower.includes('pipeline') || lower.includes('aws')) {
    return {
      rewritten: `Automated end-to-end CI/CD deployment pipelines using Docker & GitHub Actions, cutting release cycle lead time from 4 hours to 12 minutes with 90%+ automated test coverage.`,
      reason: 'Demonstrated business value with before/after time metrics and test coverage percentage.'
    };
  }

  // Marketing & Growth Rewrites
  if (lower.includes('market') || lower.includes('campaign') || lower.includes('seo') || lower.includes('lead') || lower.includes('content') || lower.includes('conversion')) {
    return {
      rewritten: `Launched multi-channel growth campaigns and conversion rate optimization (CRO) strategies, driving a 42% surge in qualified leads and lowering CAC by 28%.`,
      reason: 'Formulated with strong action verb (Launched) and quantifiable growth metrics (lead volume and acquisition cost).'
    };
  }

  // Finance & Accounting Rewrites
  if (lower.includes('finance') || lower.includes('budget') || lower.includes('audit') || lower.includes('reconcil') || lower.includes('tax') || lower.includes('report')) {
    return {
      rewritten: `Reconciled financial reporting ledgers and automated monthly budget variance forecasting, accelerating the monthly close cycle by 4 days with 99.8% audit accuracy.`,
      reason: 'Emphasized accuracy, process acceleration, and strong financial leadership verbs.'
    };
  }

  // Product Management Rewrites
  if (lower.includes('product') || lower.includes('roadmap') || lower.includes('agile') || lower.includes('scrum') || lower.includes('stakeholder') || lower.includes('feature')) {
    return {
      rewritten: `Spearheaded product roadmap and feature backlog prioritization using Agile Scrum, delivering 4 core releases on schedule and lifting customer NPS by 18 points.`,
      reason: 'Highlighted leadership, execution velocity, and customer satisfaction metrics.'
    };
  }

  // Generic Domain-Neutral Powerful Fallback
  const strongVerb = STRONG_ACTION_VERBS[Math.floor(Math.random() * 8)];
  return {
    rewritten: `${strongVerb} high-impact initiatives for ${contextRole || 'core operations'}, driving measurable efficiency gains of 30%+ and elevating stakeholder satisfaction.`,
    reason: 'Transformed into STAR methodology (Situation, Task, Action, Result) with measurable operational outcomes.'
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

  // 3. Action Verb Strength Score (0 - 15 points)
  const verbRatio = totalBullets > 0 ? (bulletsWithStrongVerbs / totalBullets) : 0.8;
  const actionVerbScore = Math.min(15, Math.round(verbRatio * 15));

  // 4. Section Completeness & ATS Format Compliance (0 - 20 points)
  const formatChecks: Array<{ title: string; passed: boolean; description: string }> = [];

  // Contact info check (5 pts)
  const hasContact = Boolean(
    resume.personalInfo.fullName &&
    (resume.personalInfo.email || resume.personalInfo.phone)
  );
  formatChecks.push({
    title: 'Standard Contact Header',
    passed: hasContact,
    description: hasContact
      ? 'Includes candidate name and verified contact details.'
      : 'Missing full contact details (name and email or phone recommended for recruiters).'
  });

  // Summary / Profile check (4 pts)
  const summaryWords = (resume.summary || '').trim().split(/\s+/).filter(Boolean).length;
  const hasGoodSummary = summaryWords >= 15 && summaryWords <= 140;
  formatChecks.push({
    title: 'Professional Profile / Summary',
    passed: hasGoodSummary,
    description: hasGoodSummary
      ? `Concise profile summary (${summaryWords} words) structured for ATS extraction.`
      : summaryWords === 0
        ? 'Summary is missing. Adding a 30–80 word summary improves ATS search ranking.'
        : `Summary is ${summaryWords < 15 ? 'too brief' : 'too lengthy'}. Ideal length is 30–80 words.`
  });

  // Experience / Case Studies depth check (4 pts)
  const hasExpOrWork = (resume.experience || []).length >= 1 || (resume.projects || []).length >= 1;
  formatChecks.push({
    title: 'Structured Experience & Work History',
    passed: hasExpOrWork,
    description: hasExpOrWork
      ? `Includes ${resume.experience.length} career role(s) and ${resume.projects.length} project/case study entries.`
      : 'At least 1 work experience entry or case study with descriptive bullets recommended.'
  });

  // Education / Credentials presence check (3 pts)
  const hasEdu = (resume.education || []).length >= 1 && Boolean(resume.education[0]?.degree || resume.education[0]?.school);
  const hasCerts = (resume.certifications || []).length >= 1;
  const hasEduOrCerts = hasEdu || hasCerts;
  formatChecks.push({
    title: 'Education & Professional Credentials',
    passed: hasEduOrCerts,
    description: hasEduOrCerts
      ? 'Accredited degree, certifications, or educational background designated.'
      : 'ATS expects at least 1 verified education entry or professional certification.'
  });

  // Categorized Skills check (4 pts)
  const totalSkillCount = (
    (resume.skills?.languages?.length || 0) +
    (resume.skills?.frameworks?.length || 0) +
    (resume.skills?.databases?.length || 0) +
    (resume.skills?.cloudDevOps?.length || 0) +
    (resume.skills?.tools?.length || 0) +
    matchedKeywords.length
  );
  const hasSkills = totalSkillCount >= 3;
  formatChecks.push({
    title: 'Domain Competencies & Skills',
    passed: hasSkills,
    description: hasSkills
      ? `${matchedKeywords.length > 0 ? matchedKeywords.length : totalSkillCount} domain competencies indexed across ${domainInfo.primaryLabel}.`
      : 'Add professional competencies categorized across skills, methods, or tools.'
  });

  let completenessScore = 0;
  if (hasContact) completenessScore += 5;
  if (hasGoodSummary) completenessScore += 4;
  if (hasExpOrWork) completenessScore += 4;
  if (hasEduOrCerts) completenessScore += 3;
  if (hasSkills) completenessScore += 4;

  // 5. Semantic Match Score (0 - 100)
  let semanticScore = 0;
  if (hasTargetJd) {
    const resumeTokens = new Set(lowerPlainText.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2));
    const jdTokens = new Set((jobDescription || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2));
    let tokenOverlap = 0;
    for (const token of jdTokens) {
      if (resumeTokens.has(token)) tokenOverlap++;
    }
    const semanticOverlapRatio = jdTokens.size > 0 ? tokenOverlap / jdTokens.size : 0;
    semanticScore = jdTokens.size > 0
      ? Math.min(96, Math.max(45, Math.round(semanticOverlapRatio * 85 + (keywordScore / 40) * 15)))
      : 0;
  }

  // 6. Total Score Calculation
  const deterministicBase = Math.min(100, Math.max(0, keywordScore + metricsScore + completenessScore + actionVerbScore));
  const totalScore = hasTargetJd
    ? Math.min(100, Math.max(0, Math.round(deterministicBase * 0.70 + semanticScore * 0.30)))
    : deterministicBase;

  let grade: AtsScoreResult['grade'] = 'Needs Improvement';
  if (totalScore >= 90) grade = 'Exceptional Match';
  else if (totalScore >= 75) grade = 'Competitive Match';
  else if (totalScore >= 60) grade = 'Moderate Match';

  return {
    totalScore,
    semanticScore,
    hasTargetJd,
    detectedDomain: domainInfo.primaryLabel,
    grade,
    breakdown: {
      keywordScore,
      metricsScore,
      completenessScore,
      actionVerbScore,
      semanticScore
    },
    matchedKeywords,
    missingKeywords,
    bulletsAudit,
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
