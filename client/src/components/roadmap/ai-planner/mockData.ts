import { CareerRoleOption, FollowUpQuestion } from './types';

export const POPULAR_CAREER_ROLES: CareerRoleOption[] = [
  { id: 'software-engineer', name: 'Software Engineer', category: 'Engineering', popular: true },
  { id: 'fullstack-developer', name: 'Full-Stack Developer', category: 'Engineering', popular: true },
  { id: 'backend-engineer', name: 'Backend Engineer', category: 'Engineering', popular: true },
  { id: 'frontend-developer', name: 'Frontend Developer', category: 'Engineering', popular: true },
  { id: 'ml-engineer', name: 'Machine Learning Engineer', category: 'AI & Data', popular: true },
  { id: 'ai-engineer', name: 'AI Engineer', category: 'AI & Data', popular: true },
  { id: 'data-scientist', name: 'Data Scientist', category: 'AI & Data', popular: true },
  { id: 'data-analyst', name: 'Data Analyst', category: 'AI & Data', popular: true },
  { id: 'cloud-engineer', name: 'Cloud Engineer', category: 'Infrastructure', popular: true },
  { id: 'devops-engineer', name: 'DevOps Engineer', category: 'Infrastructure', popular: true },
  { id: 'cybersecurity-engineer', name: 'Cybersecurity Engineer', category: 'Security', popular: true },
  { id: 'product-manager', name: 'Product Manager', category: 'Product', popular: true },
  { id: 'ui-ux-designer', name: 'UI/UX Designer', category: 'Design', popular: true },
  { id: 'other', name: 'Other', category: 'General', popular: false },
];

export const SKILL_PRESETS_BY_ROLE: Record<string, string[]> = {
  'ml-engineer': ['Python', 'SQL', 'NumPy', 'Pandas', 'Statistics', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Git', 'Docker', 'Cloud'],
  'ai-engineer': ['Python', 'SQL', 'PyTorch', 'Transformers', 'LLMs', 'Prompt Engineering', 'LangChain', 'Vector DBs', 'Git', 'Docker', 'Cloud'],
  'data-scientist': ['Python', 'SQL', 'R', 'Pandas', 'NumPy', 'Statistics', 'Machine Learning', 'Data Visualization', 'Scikit-Learn', 'Git'],
  'data-analyst': ['SQL', 'Excel', 'Python', 'Pandas', 'PowerBI', 'Tableau', 'Statistics', 'Data Visualization'],
  'fullstack-developer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'HTML/CSS', 'SQL', 'MongoDB', 'Git', 'REST APIs', 'Docker', 'Testing', 'System Design'],
  'software-engineer': ['Data Structures', 'Algorithms', 'Java', 'Python', 'C++', 'SQL', 'Git', 'System Design', 'Testing', 'OOP'],
  'backend-engineer': ['Java', 'Python', 'Node.js', 'Go', 'SQL', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Microservices', 'System Design', 'Git'],
  'frontend-developer': ['HTML/CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'TailwindCSS', 'Redux/Zustand', 'Web Performance', 'Git', 'REST/GraphQL'],
  'cloud-engineer': ['Linux', 'Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Python', 'Bash', 'Networking', 'Cloud Security'],
  'devops-engineer': ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS', 'Python', 'Bash', 'Monitoring (Prometheus)', 'Ansible'],
  'cybersecurity-engineer': ['Networking', 'Linux', 'Python', 'Penetration Testing', 'Cryptography', 'Wireshark', 'Security Architecture', 'OWASP Top 10'],
  'product-manager': ['Product Strategy', 'Agile/Scrum', 'User Research', 'Data Analysis', 'Roadmapping', 'Wireframing', 'SQL'],
  'ui-ux-designer': ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing', 'HTML/CSS'],
  'default': ['Problem Solving', 'Git', 'Basic Programming', 'SQL', 'Data Structures', 'Communication', 'Project Management'],
};

export const STARTING_LEVELS = [
  {
    id: 'Starting out',
    title: 'Starting out',
    description: 'Little or no experience',
  },
  {
    id: 'Some experience',
    title: 'Some experience',
    description: "I've learned the basics and built a few things",
  },
  {
    id: 'Comfortable',
    title: 'Comfortable',
    description: 'I can build things independently',
  },
  {
    id: 'Experienced',
    title: 'Experienced',
    description: 'I already work seriously in this field',
  },
];

export const EXPERIENCE_TYPES = [
  'College / School',
  'Personal Projects',
  'Internship',
  'Full-time Work',
  'Freelancing',
  'Open Source',
  'Courses / Certifications',
  'Nothing yet',
];

export const OBJECTIVES = [
  'Get a Job',
  'Get an Internship',
  'Switch Careers',
  'Grow in My Current Career',
  'Master the Field',
  'Build Strong Projects',
  'Prepare for Interviews',
];

export const TIME_COMMITMENTS = [
  'Under 5 hrs/week',
  '5–10 hrs/week',
  '10–15 hrs/week',
  '15–20 hrs/week',
  '20+ hrs/week',
];

export const PACING_OPTIONS = [
  {
    id: 'Fast-paced',
    title: 'Fast-paced',
    description: 'Intensive progress',
  },
  {
    id: 'Balanced',
    title: 'Balanced',
    description: 'Consistent progress',
  },
  {
    id: 'Flexible',
    title: 'Flexible',
    description: 'No fixed deadline',
  },
];

export const FOCUS_AREAS = [
  {
    id: 'Fundamentals',
    title: 'Fundamentals',
    description: 'Build strong foundations',
  },
  {
    id: 'Practical Skills',
    title: 'Practical Skills',
    description: 'Learn what is used in real work',
  },
  {
    id: 'Projects',
    title: 'Projects',
    description: 'Build a strong portfolio',
  },
  {
    id: 'Interviews',
    title: 'Interviews',
    description: 'Prepare for technical interviews',
  },
  {
    id: 'Job Readiness',
    title: 'Job Readiness',
    description: 'Focus on becoming employable',
  },
  {
    id: 'Advanced Skills',
    title: 'Advanced Skills',
    description: 'Go deeper into specialization',
  },
  {
    id: 'Problem Solving',
    title: 'Problem Solving',
    description: 'DSA, coding and analytical thinking',
  },
];

// Helper to resolve skills list for selected career
export function getSkillsForRole(roleId: string, roleName: string): string[] {
  const normalizedId = roleId.toLowerCase();
  if (SKILL_PRESETS_BY_ROLE[normalizedId]) {
    return SKILL_PRESETS_BY_ROLE[normalizedId];
  }
  const nameMatchKey = Object.keys(SKILL_PRESETS_BY_ROLE).find(key => 
    roleName.toLowerCase().includes(key.replace('-', ' '))
  );
  if (nameMatchKey) {
    return SKILL_PRESETS_BY_ROLE[nameMatchKey];
  }
  return SKILL_PRESETS_BY_ROLE['default'];
}
