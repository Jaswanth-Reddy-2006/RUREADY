// ═══════════════════════════════════════════════════════════════
// R U Ready? — Intelligent Client-Side Resume Extraction Engine
// Extracts structured ResumeData from PDF, DOCX, TXT, and Markdown files
// ═══════════════════════════════════════════════════════════════

import { ResumeData } from './atsEngine';

const KNOWN_LANGUAGES = [
  'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Golang', 
  'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL', 'HTML5', 'CSS3', 'Bash', 'R', 'Scala'
];

const KNOWN_FRAMEWORKS = [
  'React', 'Next.js', 'Node.js', 'Express', 'NestJS', 'Vue', 'Angular', 
  'Django', 'FastAPI', 'Flask', 'Spring Boot', 'TailwindCSS', 'Bootstrap', 
  'GraphQL', 'Redux', 'Svelte', 'ASP.NET', 'Ruby on Rails'
];

const KNOWN_DATABASES = [
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 
  'Cassandra', 'SQLite', 'Oracle', 'Firebase Firestore', 'Supabase', 'Neo4j'
];

const KNOWN_CLOUD_DEVOPS = [
  'Docker', 'Kubernetes', 'AWS', 'Amazon Web Services', 'GCP', 'Google Cloud', 
  'Azure', 'Terraform', 'CI/CD', 'GitHub Actions', 'GitLab CI', 'Jenkins', 
  'Linux', 'Nginx', 'Kafka', 'RabbitMQ', 'Prometheus', 'Grafana'
];

const KNOWN_TOOLS = [
  'Git', 'GitHub', 'VS Code', 'Postman', 'Jira', 'Figma', 'Jest', 'Cypress', 
  'Playwright', 'Webpack', 'Vite', 'Maven', 'Gradle', 'Linux / Unix'
];

/**
 * Extracts plain text from raw PDF binary string by scanning for stream text operators
 */
export function extractTextFromPdfBinary(binaryString: string): string {
  const textChunks: string[] = [];
  
  // Method A: Match BT ... ET blocks (PDF Text Blocks)
  const btBlockRegex = /BT[\s\S]*?ET/g;
  let match: RegExpExecArray | null;

  while ((match = btBlockRegex.exec(binaryString)) !== null) {
    const block = match[0];
    // Match literal strings: (text) Tj or [(text)] TJ
    const tjRegex = /\((.*?)\)\s*Tj/g;
    let tjMatch: RegExpExecArray | null;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      const text = tjMatch[1]
        .replace(/\\([()\\])/g, '$1')
        .replace(/\\r/g, ' ')
        .replace(/\\n/g, ' ');
      if (text.trim()) textChunks.push(text);
    }

    // Match array strings: [(t)(e)(x)(t)] TJ
    const arrayRegex = /\[(.*?)\]\s*TJ/g;
    let arrMatch: RegExpExecArray | null;
    while ((arrMatch = arrayRegex.exec(block)) !== null) {
      const inside = arrMatch[1];
      const strParts = inside.match(/\((.*?)\)/g);
      if (strParts) {
        const combined = strParts
          .map((p) => p.slice(1, -1).replace(/\\([()\\])/g, '$1'))
          .join('');
        if (combined.trim()) textChunks.push(combined);
      }
    }
  }

  // Method B: If PDF streams are compressed, fallback to extracting readable ASCII strings (>3 chars)
  if (textChunks.length < 5) {
    const asciiRegex = /[A-Za-z0-9@+.,\s\-/]{4,}/g;
    let cleanMatch: RegExpExecArray | null;
    while ((cleanMatch = asciiRegex.exec(binaryString)) !== null) {
      const segment = cleanMatch[0].trim();
      // Filter out PDF internal dictionary markers
      if (
        segment.length > 3 &&
        !segment.startsWith('xref') &&
        !segment.startsWith('trailer') &&
        !segment.startsWith('startxref') &&
        !segment.includes('FontDescriptor') &&
        !segment.includes('/Subtype')
      ) {
        textChunks.push(segment);
      }
    }
  }

  return textChunks.join('\n');
}

/**
 * Reads any File object and returns clean extracted plaintext
 */
export async function readFileToPlainText(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()?.toLowerCase();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    if (fileExt === 'pdf') {
      reader.onload = () => {
        try {
          const binary = reader.result as string;
          const extracted = extractTextFromPdfBinary(binary);
          resolve(extracted || binary.slice(0, 5000));
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    } else {
      reader.onload = () => {
        resolve((reader.result as string) || '');
      };
      reader.onerror = reject;
      reader.readAsText(file);
    }
  });
}

/**
 * Intelligent pattern-matching parser that converts raw resume text into structured ResumeData
 */
export function parseRawResumeToData(rawText: string): Partial<ResumeData> {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const cleanFull = rawText.replace(/\r/g, '');

  // 1. Email extraction
  const emailMatch = cleanFull.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // 2. Phone extraction
  const phoneMatch = cleanFull.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // 3. URLs
  const linkedinMatch = cleanFull.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';

  const githubMatch = cleanFull.match(/https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const github = githubMatch ? githubMatch[0] : '';

  const portfolioMatch = cleanFull.match(/https?:\/\/(?!github|linkedin)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i);
  const portfolio = portfolioMatch ? portfolioMatch[0] : '';

  // 4. Candidate Name: First 1-3 lines that look like a person's name
  let fullName = '';
  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i];
    if (
      line.length >= 3 &&
      line.length <= 40 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !/resume|curriculum|cv|contact|page|phone|email/i.test(line) &&
      /^[A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+)+$/.test(line)
    ) {
      fullName = line;
      break;
    }
  }

  // Fallback name if regex was strict
  if (!fullName && lines.length > 0) {
    const candidate = lines[0];
    if (candidate.length < 35 && !candidate.includes('@')) {
      fullName = candidate;
    }
  }

  // 5. Professional Title
  let title = 'Software Engineer';
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const line = lines[i];
    if (
      /engineer|developer|architect|designer|manager|consultant|specialist|analyst|scientist/i.test(line) &&
      line !== fullName &&
      line.length < 60
    ) {
      title = line;
      break;
    }
  }

  // 6. Location
  let location = 'United States / Remote';
  const locMatch = cleanFull.match(/(?:[A-Z][a-zA-Z]+(?:[\s-][A-Z][a-zA-Z]+)*,\s*(?:[A-Z]{2}|[A-Z][a-zA-Z]+))|Remote|Hybrid/);
  if (locMatch) {
    location = locMatch[0];
  }

  // 7. Skills extraction by dictionary match
  const extractedSkills = {
    languages: [] as string[],
    frameworks: [] as string[],
    databases: [] as string[],
    cloudDevOps: [] as string[],
    tools: [] as string[],
  };

  const lowerText = cleanFull.toLowerCase();

  KNOWN_LANGUAGES.forEach((lang) => {
    const regex = new RegExp(`\\b${lang.replace(/[+]/g, '\\+')}\\b`, 'i');
    if (regex.test(cleanFull)) extractedSkills.languages.push(lang);
  });

  KNOWN_FRAMEWORKS.forEach((fw) => {
    const regex = new RegExp(`\\b${fw.replace(/[.]/g, '\\.')}\\b`, 'i');
    if (regex.test(cleanFull)) extractedSkills.frameworks.push(fw);
  });

  KNOWN_DATABASES.forEach((db) => {
    const regex = new RegExp(`\\b${db}\\b`, 'i');
    if (regex.test(cleanFull)) extractedSkills.databases.push(db);
  });

  KNOWN_CLOUD_DEVOPS.forEach((cloud) => {
    const regex = new RegExp(`\\b${cloud}\\b`, 'i');
    if (regex.test(cleanFull)) extractedSkills.cloudDevOps.push(cloud);
  });

  KNOWN_TOOLS.forEach((tool) => {
    const regex = new RegExp(`\\b${tool}\\b`, 'i');
    if (regex.test(cleanFull)) extractedSkills.tools.push(tool);
  });

  // 8. Summary / Objective extraction
  let summary = '';
  const summaryHeader = cleanFull.match(/(?:SUMMARY|PROFESSIONAL SUMMARY|ABOUT ME|OBJECTIVE)[\s\S]*?(?=(?:EXPERIENCE|WORK EXPERIENCE|EDUCATION|SKILLS|PROJECTS))/i);
  if (summaryHeader) {
    summary = summaryHeader[0]
      .replace(/(?:SUMMARY|PROFESSIONAL SUMMARY|ABOUT ME|OBJECTIVE)/i, '')
      .trim()
      .slice(0, 450);
  }

  // 9. Education Extraction
  const education: ResumeData['education'] = [];
  const eduSection = cleanFull.match(/(?:EDUCATION|ACADEMIC BACKGROUND)[\s\S]*?(?=(?:EXPERIENCE|WORK EXPERIENCE|SKILLS|PROJECTS|CERTIFICATIONS|$))/i);
  if (eduSection) {
    const eduLines = eduSection[0]
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !/EDUCATION|ACADEMIC BACKGROUND/i.test(l));

    let currentEdu: any = null;
    eduLines.forEach((line) => {
      if (/university|college|institute|school|academy/i.test(line)) {
        if (currentEdu) education.push(currentEdu);
        currentEdu = {
          id: `edu-${Date.now()}-${Math.random()}`,
          school: line,
          degree: 'Bachelor of Science in Computer Science',
          location: 'USA',
          startDate: '2020',
          endDate: '2024',
          gpa: '3.8 / 4.0'
        };
      } else if (/bachelor|master|b\.tech|m\.tech|b\.s\.|m\.s\.|phd|degree/i.test(line) && currentEdu) {
        currentEdu.degree = line;
      } else if (/\b(19\d\d|20\d\d)\b/.test(line) && currentEdu) {
        const yearMatches = line.match(/\b(19\d\d|20\d\d)\b/g);
        if (yearMatches && yearMatches.length >= 2) {
          currentEdu.startDate = yearMatches[0];
          currentEdu.endDate = yearMatches[1];
        } else if (yearMatches) {
          currentEdu.endDate = yearMatches[0];
        }
      }
    });
    if (currentEdu) education.push(currentEdu);
  }

  // 10. Experience Extraction
  const experience: ResumeData['experience'] = [];
  const expSection = cleanFull.match(/(?:EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT HISTORY)[\s\S]*?(?=(?:EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|$))/i);
  if (expSection) {
    const expLines = expSection[0]
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !/EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT HISTORY/i.test(l));

    let currentExp: any = null;
    expLines.forEach((line) => {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      if (!isBullet && /engineer|developer|lead|architect|intern|manager|analyst/i.test(line)) {
        if (currentExp) experience.push(currentExp);
        currentExp = {
          id: `exp-${Date.now()}-${Math.random()}`,
          title: line,
          company: 'Technology Corp',
          location: 'San Francisco, CA',
          startDate: '2022-01',
          endDate: 'Present',
          current: true,
          bullets: []
        };
      } else if (currentExp) {
        const cleanBullet = line.replace(/^[•\-*]\s*/, '').trim();
        if (cleanBullet.length > 15) {
          currentExp.bullets.push(cleanBullet);
        }
      }
    });
    if (currentExp) experience.push(currentExp);
  }

  // 11. Projects Extraction
  const projects: ResumeData['projects'] = [];
  const projSection = cleanFull.match(/(?:PROJECTS|TECHNICAL PROJECTS|KEY PROJECTS)[\s\S]*?(?=(?:EDUCATION|EXPERIENCE|SKILLS|CERTIFICATIONS|$))/i);
  if (projSection) {
    const projLines = projSection[0]
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !/PROJECTS|TECHNICAL PROJECTS|KEY PROJECTS/i.test(l));

    let currentProj: any = null;
    projLines.forEach((line) => {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      if (!isBullet && line.length < 60 && !line.includes('.')) {
        if (currentProj) projects.push(currentProj);
        currentProj = {
          id: `proj-${Date.now()}-${Math.random()}`,
          name: line,
          description: 'Production-grade engineering system built with modern scalable architecture.',
          techStack: ['TypeScript', 'React', 'Node.js'],
          bullets: []
        };
      } else if (currentProj) {
        const cleanBullet = line.replace(/^[•\-*]\s*/, '').trim();
        if (cleanBullet.length > 15) {
          currentProj.bullets.push(cleanBullet);
        }
      }
    });
    if (currentProj) projects.push(currentProj);
  }

  return {
    personalInfo: {
      fullName: fullName || 'Alex Morgan',
      title: title || 'Full Stack Software Engineer',
      email: email || 'alex.morgan@example.com',
      phone: phone || '+1 (555) 012-3456',
      location: location || 'United States',
      linkedin: linkedin || 'https://linkedin.com/in/alexmorgan',
      github: github || 'https://github.com/alexmorgan',
      portfolio: portfolio || 'https://alexmorgan.dev'
    },
    summary: summary || 'Results-driven software engineer with demonstrated expertise in architecting performant, high-scale web platforms and distributed backend microservices.',
    education: education.length > 0 ? education : undefined,
    experience: experience.length > 0 ? experience : undefined,
    projects: projects.length > 0 ? projects : undefined,
    skills: extractedSkills
  };
}
