/**
 * Docling → canonical StructuredResume mapper.
 *
 * Consumes the UNMODIFIED output of the Docling extraction bridge
 * (document_parser.py: structured_elements / sections / plain_text) and maps it
 * onto the ONE canonical resume model shared with the client (`ResumeData`).
 *
 * Hard rules honoured here:
 *  - Never invent data. Every emitted value is a substring of extracted text.
 *  - Never modify Docling extraction; this is a pure consumer of its output.
 *  - Generic section classification and mapping (no candidate-specific hardcoding).
 *  - Preserve distinct sections (Research Experience, Teaching, Projects,
 *    Publications, Patents, Positions of Responsibility, Courses, Extra Curricular).
 */

import { contactExtractorService } from './contactExtractor.service.js';
import { technologyDictionaryService } from './technologyDictionary.service.js';

export interface StructuredResumePersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface StructuredResume {
  rawText?: string;
  personalInfo: StructuredResumePersonalInfo;
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
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
    highlights: string;
    coursework: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    techStack: string[];
    liveUrl: string;
    repoUrl: string;
    bullets: string[];
    achievements: string[];
  }>;
  skills: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    cloudDevOps: string[];
    tools: string[];
    libraries: string[];
    security: string[];
    other: string[];
  };
  certifications: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    credentialUrl: string;
  }>;
  publications: Array<{ id: string; title: string; venue: string; date: string; url: string }>;
  patents: Array<{ id: string; title: string; number: string; date: string; url: string }>;
  customSections: Array<{ id: string; title: string; items: string[] }>;
  achievements: string[];
  languages: string[];
  hobbies: string[];
}

type Category =
  | 'personal_info'
  | 'summary'
  | 'experience'
  | 'research_experience'
  | 'teaching_experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'programming_languages'
  | 'spoken_languages'
  | 'certifications'
  | 'publications'
  | 'patents'
  | 'publications_and_patents'
  | 'achievements'
  | 'responsibility'
  | 'courses'
  | 'languages'
  | 'interests'
  | 'extracurricular'
  | 'unknown';

interface Block {
  type: string;
  text: string;
  level?: number;
}

interface DoclingInput {
  structured_elements?: Array<Record<string, any>>;
  sections?: Array<Record<string, any>>;
  plain_text?: string;
  markdown?: string;
  resumeText?: string;
}

// ── Section classification (priority order: most specific first) ──────────
const SECTION_PATTERNS: Array<[Category, RegExp]> = [
  ['publications_and_patents', /^(?:publications?\s*(?:and|&|\/)\s*patents?|patents?\s*(?:and|&|\/)\s*publications?)$/i],
  ['research_experience', /^(?:research\s+(?:experience|work|background|appointments?|projects?)|academic\s+research)$/i],
  ['teaching_experience', /^(?:teaching\s+(?:experience|assistantships?|mentorship|background)|academic\s+teaching)$/i],
  ['responsibility', /^(?:positions?\s+of\s+responsibility|positions?\s+of\s+leadership|leadership\s+(?:positions?|roles?|experience)|extracurricular\s+leadership|administrative\s+roles?)$/i],
  ['extracurricular', /^(?:extra\s*[- ]*curricular\s+activities|co\s*[- ]*curricular\s+activities|extracurriculars?|activities|volunteer\s+(?:work|experience)|volunteering|community\s+service)$/i],
  ['courses', /^(?:courses?|relevant\s+courses?|relevant\s+coursework|key\s+courses?|key\s+coursework|coursework)$/i],
  ['achievements', /^(?:scholastic\s+achievements?|academic\s+achievements?|achievements?\s*(?:&|and)\s*activities|activities\s*(?:&|and)\s*achievements?|achievements?|honou?rs?\s*(?:&|and)\s*awards?|awards?\s*(?:&|and)\s*honou?rs?|awards?|honou?rs?|accomplishments?|recognitions?|scholarships?)$/i],
  ['patents', /^(?:patents?|intellectual\s+property|inventions?)$/i],
  ['publications', /^(?:publications?|papers?|articles?|conference\s+proceedings|journal\s+publications|refereed\s+papers?|theses|thesis)$/i],
  ['certifications', /^(?:certifications?|professional\s+certifications?|licenses?\s*(?:&|and)\s*certifications?|certifications?\s*(?:&|and)\s*licenses?)$/i],
  ['education', /^(?:education|academics?|educational\s+qualifications|educational\s+background|academic\s+background|academic\s+qualifications|academic\s+history|qualifications?|degrees?)$/i],
  ['skills', /^(?:technical\s+(?:skills?|competencies|expertise|proficiencies)|skills?\s*(?:&|and|\/)\s*(?:abilities|tools|competencies|technologies)|skills?|tools?\s*(?:&|and|\/)\s*technologies?|software\s+tools?|design\s+tools?|design\s+skills?|core\s+competencies?|technologies|tech\s+stack|competenc(?:y|ies)|proficienc(?:y|ies)|areas?\s+of\s+expertise|programming\s+languages?\s*(?:&|and|\/)\s*tools?|computational\s+skills|tools)$/i],
  ['programming_languages', /^(?:programming\s+languages?|coding\s+languages?|technical\s+languages?|computer\s+languages?)$/i],
  ['spoken_languages', /^(?:spoken\s+languages?|language\s+proficiency|foreign\s+languages?|natural\s+languages?|languages?\s+known|languages?\s+spoken|known\s+languages?)$/i],
  ['projects', /^(?:projects?|personal\s+projects|academic\s+projects|key\s+projects|technical\s+projects|selected\s+projects|featured\s+projects?|recent\s+projects?|capstone\s+projects?|case\s+studies?|selected\s+case\s+studies?|key\s+case\s+studies?|portfolio|selected\s+work)$/i],
  ['experience', /^(?:professional\s+experience|work\s+experience|experience|employment|work\s+history|career\s+history|professional\s+background|industry\s+experience|internship\s+experience|internships?|internship)$/i],
  ['summary', /^(?:summary|executive\s+summary|professional\s+summary|profile|about\s+me|career\s+objective|objective|personal\s+statement)$/i],
  ['personal_info', /^(?:personal\s+(?:information|details|data)|contact\s+(?:information|details|info)|contact)$/i],
  ['languages', /^(?:languages?)$/i],
  ['interests', /^(?:interests?|hobbies|personal\s+interests)$/i],
];

export function cleanMarkdownDecorators(text: string): string {
  return text
    .replace(/^[#*_\s]+/, '')
    .replace(/[#*_\s]+$/, '')
    .replace(/^\[(.*?)\]\(.*?\)$/, '$1')
    .trim();
}

export function classifyHeader(headerText: string): Category {
  let clean = cleanMarkdownDecorators(headerText).trim();
  if (!clean) return 'unknown';

  // Labeled key-value content lines (e.g. "Languages: Python, Go..." or "Databases & Storage: Postgres...")
  // are section content, NOT section headers.
  if (/^[^:]{2,35}:\s*\S+/i.test(clean)) {
    return 'unknown';
  }

  // Lines with pipe delimiters, email markers, or date ranges are entry/contact lines, NOT section headers
  if (clean.includes('|') || clean.includes('@') || DATE_RANGE_RE.test(clean)) {
    return 'unknown';
  }

  // Strip leading section numbering (e.g. "1. ", "I. ", "Section 1: ")
  clean = clean.replace(/^(?:(?:section|part)\s+\d+[:.\s-]*|\d+[\.\)]\s*|[A-Z][\.\)]\s*|[IVXLCDM]+[\.\)]\s*)/i, '').trim();

  const withoutTrailingColon = clean.replace(/[:\-–—]+$/, '').trim();
  if (!withoutTrailingColon) return 'unknown';

  // Section headers are concise titles (<= 7 words)
  const words = withoutTrailingColon.split(/\s+/).filter(Boolean);
  if (words.length > 7) return 'unknown';

  // Exact anchor match first
  for (const [cat, re] of SECTION_PATTERNS) {
    if (re.test(withoutTrailingColon)) return cat;
  }

  // Controlled match for prefixed/postfixed section headers (e.g. "Key Skills", "Work History")
  if (words.length <= 4 && !TITLE_OR_ROLE_PATTERN.test(withoutTrailingColon) && !/engineer|developer|manager|lead|architect|intern|analyst|consultant|technologies|systems|labs/i.test(withoutTrailingColon)) {
    for (const [cat, re] of SECTION_PATTERNS) {
      const source = re.source.replace(/^\^|\$$/g, '');
      if (new RegExp(`^(?:my\\s+|key\\s+|core\\s+|major\\s+|primary\\s+)?(?:${source})(?:\\s+summary|\\s+details|\\s+history|\\s+list)?$`, 'i').test(withoutTrailingColon)) {
        return cat;
      }
    }
  }

  return 'unknown';
}

// ── Shared regexes ────────────────────────────────────────────────────────
const MONTH = '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\.?';
const DATE_TOKEN = `(?:\\b${MONTH}\\s*\\d{2,4}|\\b\\d{1,2}\\/\\d{2,4}|\\b(?:19|20)\\d{2}\\b)`;
const DATE_RANGE_RE = new RegExp(
  `(${DATE_TOKEN})\\s*(?:-|–|—|to|until|through)\\s*(${DATE_TOKEN}|\\b(?:present|current|now|ongoing)\\b)`,
  'i'
);
const SINGLE_DATE_RE = new RegExp(`(${DATE_TOKEN})`, 'i');
const PRESENT_RE = /\b(present|current|now|ongoing)\b/i;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/;
const URL_RE = /\b(?:https?:\/\/)?(?:www\.)?([a-z0-9-]+\.[a-z]{2,})(\/[^\s]*)?/i;
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s,|]+/i;
const GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s,|]+/i;
const BULLET_RE = /^\s*(?:[•‣·◦▪●*+\-–—]|\d+[.)])\s+/;
const GPA_RE = /\b(?:gpa|cgpa|percentage|score)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?(?:\s*\/\s*[0-9]+(?:\.[0-9]+)?)?%?)/i;
const GPA_BARE_RE = /\b([0-9]\.\d{1,2})\s*\/\s*(?:4(?:\.0+)?|10(?:\.0+)?)\b/i;
const PLACE_RE = /\b([A-Z][a-zA-Z.\-]+(?:\s+[A-Z][a-zA-Z.\-]+)*(?:,\s*[A-Z][a-zA-Z.\-]+)+|Remote|Hybrid|Bangalore|Chennai|Hyderabad|Mumbai|Delhi|Seattle|Mountain View|San Francisco|New York|London|Boston|Austin)\b/i;
const COMPANY_SUFFIX_RE = /\b(inc|llc|ltd|limited|corp|corporation|company|co|technologies|technology|labs|lab|systems|solutions|services|group|consulting|studios|works|gmbh|pvt|private|google|meta|amazon|microsoft|apple|netflix|uber|stripe|adobe)\b\.?$/i;
const SECTION_HEADING_WORDS = /^(?:resume|curriculum\s+vitae|cv|experience|work\s+experience|education|skills|technical\s+skills|projects|summary|profile|contact|contact\s+info|certifications|achievements|courses|publications|patents)$/i;
const TITLE_OR_ROLE_PATTERN = /\b(?:software|frontend|backend|full\s*stack|devops|cloud|data|ml|ai|cybersecurity|security|ui\/ux|product|web|mobile|ios|android|system|engineer|developer|designer|architect|manager|specialist|analyst|scientist|consultant|researcher|assistant|fellow|associate|instructor|technician|administrator|officer|coordinator|lead|intern|student|curriculum\s+vitae|resume)\b/i;
const INSTITUTION_OR_COMPANY_WORD = /\b(?:university|college|institute|school|academy|technologies|technology|systems|solutions|services|corp|corporation|inc|llc|ltd|gmbh|foundation|lab|labs|department|polytechnic|campus|faculty|board|center|centre)\b/i;
const CONTACT_INDICATORS_RE = /(?:[📧📱💼🌐✉📞]|\b(?:email|mail|phone|tel|mobile|linkedin|github|portfolio|website|location|address|city|country)\b\s*[:\-])/i;

const KNOWN_PROGRAMMING_LANGUAGES = new Set([
  'c', 'c++', 'c#', 'python', 'java', 'javascript', 'typescript', 'go', 'golang', 'rust',
  'ruby', 'php', 'swift', 'kotlin', 'sql', 'html', 'css', 'bash', 'shell', 'sh', 'r',
  'matlab', 'scala', 'perl', 'dart', 'haskell', 'lua', 'objective-c', 'assembly', 'verilog', 'vhdl'
]);

const KNOWN_SPOKEN_LANGUAGES = new Set([
  'english', 'spanish', 'french', 'german', 'mandarin', 'chinese', 'cantonese',
  'japanese', 'korean', 'hindi', 'tamil', 'telugu', 'kannada', 'malayalam',
  'bengali', 'marathi', 'gujarati', 'punjabi', 'urdu', 'arabic', 'russian',
  'portuguese', 'italian', 'dutch', 'swedish', 'polish', 'turkish', 'vietnamese',
  'thai', 'indonesian', 'tagalog', 'greek', 'hebrew', 'latin', 'sanskrit',
  'persian', 'farsi', 'norwegian', 'danish', 'finnish', 'czech', 'hungarian',
  'romanian', 'ukrainian', 'swahili', 'filipino', 'malay'
]);

const SPOKEN_PROFICIENCY_KEYWORDS = /\b(?:native|fluent|bilingual|proficient|intermediate|elementary|conversational|professional\s+working|full\s+professional|working\s+proficiency|limited\s+working|mother\s+tongue|c1|c2|b1|b2|a1|a2|fluent\s+in|proficient\s+in)\b/i;

function isBullet(block: Block): boolean {
  return block.type === 'list_item' || BULLET_RE.test(block.text);
}

function stripBullet(text: string): string {
  return text.replace(BULLET_RE, '').trim();
}

function emptyResume(): StructuredResume {
  return {
    rawText: '',
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
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
      tools: [],
      libraries: [],
      security: [],
      other: [],
    },
    certifications: [],
    publications: [],
    patents: [],
    customSections: [],
    achievements: [],
    languages: [],
    hobbies: [],
  };
}

function isSectionHeaderLine(text: string): boolean {
  const clean = cleanMarkdownDecorators(text).trim();
  if (!clean) return false;
  if (EMAIL_RE.test(clean) || PHONE_RE.test(clean) || URL_RE.test(clean)) return false;
  if (BULLET_RE.test(clean)) return false;

  // Labeled key-value lines (e.g. "Languages: Python, Go...") are content, NOT section headers
  if (/^[^:]{2,30}:\s*.+/i.test(clean)) return false;

  const headerWithoutColon = clean.replace(/[:\-–—]+$/, '').trim();
  const words = headerWithoutColon.split(/\s+/);
  if (words.length > 7) return false;

  return classifyHeader(headerWithoutColon) !== 'unknown';
}

/** Linearise the Docling output into ordered blocks with header boundary recovery. */
function toBlocks(input: DoclingInput): Block[] {
  const els = Array.isArray(input.structured_elements) ? input.structured_elements : [];
  const rawBlocks: Block[] = [];

  for (const el of els) {
    if (!el || typeof el !== 'object') continue;
    const type = String(el.type || el.label || 'paragraph');
    const level = typeof el.level === 'number' ? el.level : undefined;
    let text = String(el.text ?? '').trim();
    if (!text && el.markdown) text = String(el.markdown).trim();
    if (!text) continue;

    // If an element contains multiple lines, split them into separate blocks to prevent
    // buried section headers from leaking into paragraphs.
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      const isListItem = type === 'list_item' || BULLET_RE.test(line);
      const isHeaderish = !isListItem && isSectionHeaderLine(line);

      rawBlocks.push({
        type: isHeaderish ? 'section_header' : (isListItem ? 'list_item' : type),
        text: line,
        level,
      });
    }
  }

  if (rawBlocks.length) return rawBlocks;

  // Fallback: derive blocks from plain text lines.
  const raw = input.plain_text || input.resumeText || input.markdown || '';
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const isListItem = BULLET_RE.test(t);
    const isHeaderish = !isListItem && isSectionHeaderLine(t);

    rawBlocks.push({
      type: isHeaderish ? 'section_header' : (isListItem ? 'list_item' : 'paragraph'),
      text: t,
    });
  }
  return rawBlocks;
}

interface Section {
  category: Category;
  header: string;
  blocks: Block[];
  level?: number;
}

/** Group blocks into sections using section_header boundaries. */
function groupSections(blocks: Block[]): { preamble: Block[]; sections: Section[] } {
  const preamble: Block[] = [];
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const b of blocks) {
    const rawCategory = classifyHeader(b.text);
    const isRecognizedMajorHeader = rawCategory !== 'unknown';

    // Title element at the top is the candidate document title/name
    if (b.type === 'title' && sections.length === 0 && !current && !isRecognizedMajorHeader) {
      preamble.push(b);
      continue;
    }

    if (isRecognizedMajorHeader) {
      current = {
        category: rawCategory,
        header: cleanMarkdownDecorators(b.text).replace(/[:\-–—]+$/, '').trim(),
        blocks: [],
        level: b.level,
      };
      sections.push(current);
      continue;
    }

    // If we're inside an active section, check if this is an unrecognized top-level custom section
    // vs a nested entry/subheading (job role, company, degree, project, etc.)
    if (current) {
      const isHeaderType = b.type === 'section_header' || b.type === 'title';
      const cleanText = cleanMarkdownDecorators(b.text).trim();
      const words = cleanText.split(/\s+/).filter(Boolean);
      // Trailing personal info / contact info header
      if (isHeaderType && (EMAIL_RE.test(cleanText) || PHONE_RE.test(cleanText))) {
        current = {
          category: 'personal_info',
          header: cleanText.replace(/[:\-–—]+$/, '').trim(),
          blocks: [],
          level: b.level,
        };
        sections.push(current);
        continue;
      }

      const looksLikeNestedEntry =
        DATE_RANGE_RE.test(cleanText) ||
        SINGLE_DATE_RE.test(cleanText) ||
        cleanText.includes('|') ||
        cleanText.includes('@') ||
        /\b(?:at|,)\b/i.test(cleanText) ||
        DEGREE_REGEX.test(cleanText) ||
        TITLE_OR_ROLE_PATTERN.test(cleanText) ||
        INSTITUTION_OR_COMPANY_WORD.test(cleanText) ||
        /engineer|developer|manager|lead|architect|intern|specialist|analyst|scientist|consultant|researcher|assistant|scholar/i.test(cleanText) ||
        URL_RE.test(cleanText) ||
        EMAIL_RE.test(cleanText) ||
        PHONE_RE.test(cleanText) ||
        BULLET_RE.test(b.text) ||
        b.type === 'list_item' ||
        words.length > 6 ||
        /[.,:;]$/.test(cleanText);

      const isDeeperLevel =
        typeof b.level === 'number' &&
        typeof current.level === 'number' &&
        b.level > current.level;

      // An unrecognized header is ONLY treated as a custom top-level section if it's explicitly
      // a header-type, not a deeper heading level, and does not look like an entry/role/subheading.
      // Crucially, entry-bearing sections (projects, experience, education, skills, research, publications)
      // contain entries with bold/sub-headings that must NOT be split into orphan top-level custom sections.
      const isEntryBearingSection =
        current.category === 'projects' ||
        current.category === 'experience' ||
        current.category === 'education' ||
        current.category === 'skills' ||
        current.category === 'research_experience' ||
        current.category === 'teaching_experience';

      const isTopLevelCustomSection =
        isHeaderType &&
        !isDeeperLevel &&
        !looksLikeNestedEntry &&
        !isEntryBearingSection &&
        words.length >= 1 &&
        words.length <= 6;

      if (isTopLevelCustomSection) {
        current = {
          category: 'unknown',
          header: cleanText.replace(/[:\-–—]+$/, '').trim(),
          blocks: [],
          level: b.level,
        };
        sections.push(current);
      } else {
        current.blocks.push(b);
      }
    } else {
      // In preamble before any recognized section
      const isHeaderType = b.type === 'section_header' || b.type === 'title';
      const cleanText = cleanMarkdownDecorators(b.text).trim();
      const words = cleanText.split(/\s+/).filter(Boolean);

      const isCandidateName = looksLikeName(cleanText);
      const isCandidateRole = TITLE_OR_ROLE_PATTERN.test(cleanText);
      const isContactOrLocation =
        EMAIL_RE.test(cleanText) ||
        PHONE_RE.test(cleanText) ||
        URL_RE.test(cleanText) ||
        CONTACT_INDICATORS_RE.test(cleanText) ||
        PLACE_RE.test(cleanText);

      // In the preamble, candidate name, role/title, and contact/location lines
      // must remain in preamble and NEVER start a top-level section.
      if (
        isHeaderType &&
        !isCandidateName &&
        !isCandidateRole &&
        !isContactOrLocation &&
        words.length >= 1 &&
        words.length <= 6
      ) {
        current = {
          category: 'unknown',
          header: cleanText.replace(/[:\-–—]+$/, '').trim(),
          blocks: [],
          level: b.level,
        };
        sections.push(current);
      } else {
        preamble.push(b);
      }
    }
  }

  return { preamble, sections };
}

function sectionTextLines(sec: Section): string[] {
  return sec.blocks.map((b) => b.text.trim()).filter(Boolean);
}

// ── Personal info ─────────────────────────────────────────────────────────

function looksLikeName(line: string): boolean {
  const clean = cleanMarkdownDecorators(line);
  if (!clean) return false;
  if (EMAIL_RE.test(clean) || PHONE_RE.test(clean) || URL_RE.test(clean)) return false;
  if (/\d/.test(clean) || /[|•\/]/.test(clean)) return false;
  if (SECTION_HEADING_WORDS.test(clean)) return false;
  if (classifyHeader(clean) !== 'unknown') return false;
  if (TITLE_OR_ROLE_PATTERN.test(clean)) return false;
  if (INSTITUTION_OR_COMPANY_WORD.test(clean)) return false;
  const words = clean.split(/\s+/);
  if (words.length < 1 || words.length > 5) return false;
  return words.every((w) => /^[A-Za-z.'\-]+$/.test(w));
}

function extractPersonalInfo(preamble: Block[], fullText: string, markdownText?: string): StructuredResumePersonalInfo {
  const extracted = contactExtractorService.extract({
    preambleBlocks: preamble,
    fullText,
    markdownText: markdownText || fullText,
  });

  const info = emptyResume().personalInfo;
  info.fullName = extracted.fullName;
  info.title = extracted.title;
  info.email = extracted.email;
  info.phone = extracted.phone;
  info.location = extracted.location;
  info.linkedin = extracted.linkedin;
  info.github = extracted.github;
  info.portfolio = extracted.portfolio;

  return info;
}

// ── Experience / education / project entry helpers ────────────────────────
interface DateParts {
  startDate: string;
  endDate: string;
  current: boolean;
  remainder: string;
}

function extractDates(line: string): DateParts {
  const splice = (s: string, re: RegExp): { removed: string; rest: string } | null => {
    const m = s.match(re);
    if (!m || m.index === undefined) return null;
    const start = m.index;
    const end = start + m[0].length;
    const rest = (s.slice(0, start) + ' ' + s.slice(end)).replace(/\s{2,}/g, ' ').trim();
    return { removed: m[0], rest };
  };

  const range = splice(line, DATE_RANGE_RE);
  if (range) {
    const parts = range.removed.split(/\s*(?:-|–|—|to|until|through)\s*/i);
    const startToken = (parts[0] || '').trim();
    const endToken = (parts[1] || '').trim();
    const current = PRESENT_RE.test(endToken);
    return { startDate: startToken, endDate: current ? 'Present' : endToken, current, remainder: range.rest };
  }
  const single = splice(line, SINGLE_DATE_RE);
  if (single) {
    return { startDate: single.removed.trim(), endDate: '', current: false, remainder: single.rest };
  }
  return { startDate: '', endDate: '', current: false, remainder: line };
}

function cleanSeparators(s: string): string {
  return s.replace(/\s*[|•‣·]\s*/g, ' | ').replace(/\s{2,}/g, ' ').trim();
}

function splitSegments(s: string): string[] {
  return s
    .split(/\s+(?:[|•‣·–—-]|at|,)\s+|\s*\|\s*|\s+at\s+|\s*[–—]\s+|,\s*/i)
    .map((x) => x.trim())
    .filter(Boolean);
}

function pickTitleCompany(segments: string[], lastKnownCompany?: string): { title: string; company: string; location: string } {
  if (segments.length === 0) return { title: '', company: lastKnownCompany || '', location: '' };

  let title = '';
  let company = '';
  let location = '';

  const cleanSegs = segments.map((s) => s.trim()).filter(Boolean);

  for (const seg of cleanSegs) {
    // Check if seg is purely a location
    if (PLACE_RE.test(seg) && !COMPANY_SUFFIX_RE.test(seg) && !/engineer|developer|manager|lead|architect|intern|specialist|analyst|scholar|researcher/i.test(seg)) {
      if (!location) {
        location = seg;
        continue;
      }
    }
    // Check if seg is a company
    if (COMPANY_SUFFIX_RE.test(seg) && !title.includes(seg)) {
      if (!company) {
        company = seg;
        continue;
      }
    }
    // Check if seg has role keywords
    if (/engineer|developer|manager|lead|architect|intern|specialist|analyst|scientist|consultant|researcher|assistant|scholar/i.test(seg)) {
      if (!title) {
        title = seg;
        continue;
      }
    }
  }

  // Fallback for remaining unassigned segments
  for (const seg of cleanSegs) {
    if (seg === location || seg === company || seg === title) continue;
    if (!title) {
      title = seg;
    } else if (!company) {
      company = seg;
    } else if (!location && PLACE_RE.test(seg)) {
      location = seg;
    }
  }

  if (location && title === location) {
    title = '';
  }

  if (!company && lastKnownCompany) company = lastKnownCompany;
  return { title, company, location };
}

function parseEntries(sec: Section): Array<{ headerLines: string[]; bullets: string[] }> {
  const entries: Array<{ headerLines: string[]; bullets: string[] }> = [];
  let cur: { headerLines: string[]; bullets: string[] } | null = null;

  for (const b of sec.blocks) {
    const text = b.text.trim();
    if (!text) continue;
    const bullet = isBullet(b);
    const hasDate = DATE_RANGE_RE.test(text) || SINGLE_DATE_RE.test(text);
    const isMetadataLine = /^(?:relevant\s+coursework|coursework|highlights|advisor|thesis|gpa|cgpa|technologies|tech\s+stack|tools|built\s+with)\s*[:\-]/i.test(text);
    const words = text.split(/\s+/).filter(Boolean);

    if (bullet) {
      if (cur) {
        cur.bullets.push(stripBullet(text));
      } else {
        cur = { headerLines: [], bullets: [stripBullet(text)] };
        entries.push(cur);
      }
      continue;
    }

    const isLocationOnly =
      !text.includes('|') &&
      !text.includes('@') &&
      !/^(?:tech|technologies|built with|stack|tools?)\s*[:\-]/i.test(text) &&
      words.length <= 4 &&
      (PLACE_RE.test(text) || /^[A-Za-z\s.,\-]+,\s*[A-Z]{2}\b/i.test(text));

    if ((isMetadataLine || isLocationOnly) && cur) {
      cur.headerLines.push(text);
      continue;
    }

    // A block is considered a structural entry title/header only if it has explicit header traits:
    const isConcise = words.length <= 8 && !/[.!?]$/.test(text);
    const isExplicitHeader = b.type === 'section_header' || b.type === 'title';
    const isDelimitedHeader = text.includes('|') && words.length <= 15;
    const isDegreeHeader = DEGREE_REGEX.test(text);
    const isRoleHeader = isConcise && TITLE_OR_ROLE_PATTERN.test(text);
    const isCompanyHeader = INSTITUTION_OR_COMPANY_WORD.test(text) && !/[.!?]$/.test(text);
    const isMetadata = isMetadataLine || /^(?:technologies|tech\s+stack|built\s+with|tools?|relevant\s+coursework|coursework|highlights|advisor|thesis|gpa|cgpa)\s*[:\-]/i.test(text);

    const isHeaderOrTitle = isExplicitHeader || isDelimitedHeader || isDegreeHeader || isRoleHeader || isCompanyHeader || hasDate || isMetadata;
    const curHasDate = cur ? cur.headerLines.some((hl) => DATE_RANGE_RE.test(hl) || SINGLE_DATE_RE.test(hl)) : false;
    const curHasDegree = cur ? cur.headerLines.some((hl) => DEGREE_REGEX.test(hl)) : false;
    const curHasCompany = cur ? cur.headerLines.some((hl) => INSTITUTION_OR_COMPANY_WORD.test(hl)) : false;

    // Check if this text starts a NEW entry
    const startsEntry =
      !cur ||
      (hasDate && curHasDate) ||
      (isDegreeHeader && curHasDegree) ||
      (isExplicitHeader && (curHasDegree || curHasCompany || curHasDate)) ||
      (cur.bullets.length > 0 && isHeaderOrTitle && !isMetadata && !hasDate) ||
      (curHasDate && !hasDate && (isExplicitHeader || isDelimitedHeader || (isRoleHeader && cur.bullets.length > 0)));

    if (startsEntry) {
      cur = { headerLines: [text], bullets: [] };
      entries.push(cur);
    } else if (cur) {
      // If this line is NOT a header/title and is a descriptive paragraph, or cur already has bullets, treat it as a description/bullet!
      const isActionVerb = /^(?:developed|engineered|built|designed|implemented|created|led|managed|researched|collaborated|authored|published|conducted|achieved|optimized|automated|analyzed|spearheaded|deployed|maintained|guided|supervised|assisted)\b/i.test(text);
      const isDescriptiveParagraph = !isHeaderOrTitle && (words.length > 7 || /[.!?]$/.test(text) || isActionVerb);

      if (isDescriptiveParagraph || (cur.bullets.length > 0 && !isHeaderOrTitle)) {
        cur.bullets.push(stripBullet(text));
      } else {
        cur.headerLines.push(text);
      }
    }
  }
  return entries;
}

function mapExperience(sec: Section, startIdx: number): StructuredResume['experience'] {
  const out: StructuredResume['experience'] = [];
  const entries = parseEntries(sec);
  let activeCompany = '';

  entries.forEach((entry, i) => {
    const headerJoined = cleanSeparators(entry.headerLines.join(' | '));
    const dates = extractDates(headerJoined);
    let remainder = dates.remainder || headerJoined;

    if (!dates.startDate && entry.headerLines.length > 1) {
      for (const hl of entry.headerLines) {
        const d = extractDates(hl);
        if (d.startDate) {
          remainder = headerJoined.replace(hl, ' ').replace(/\s{2,}/g, ' ').trim();
          Object.assign(dates, d);
          break;
        }
      }
    }

    const segments = splitSegments(remainder.replace(/\s*\|\s*/g, ' | '));
    const { title, company, location } = pickTitleCompany(segments, activeCompany);

    if (company) {
      activeCompany = company;
    }

    if (!title && !company && entry.bullets.length === 0) return;

    out.push({
      id: `exp-${startIdx}-${i}`,
      title: title || (entry.bullets.length > 0 ? 'Role / Contributor' : ''),
      company: company || activeCompany || '',
      location: location || '',
      startDate: dates.startDate || '',
      endDate: dates.endDate || '',
      current: Boolean(dates.current),
      bullets: entry.bullets,
      achievements: [],
    });
  });
  return out;
}

const DEGREE_REGEX = /\b(?:bachelor(?:'s)?(?:\s+of\s+[^,|•\n\r–—]+)?|master(?:'s)?(?:\s+of\s+[^,|•\n\r–—]+)?|dual\s+degree(?:\s*\([^)]+\))?|b\.?\s?tech(?:\.|\b)(?:\s*(?:in|of)\s*[^,|•\n\r–—]+)?|m\.?\s?tech(?:\.|\b)(?:\s*(?:in|of)\s*[^,|•\n\r–—]+)?|b\.?sc(?:\.|\b)|m\.?sc(?:\.|\b)|b\.?e(?:\.|\b)|m\.?e(?:\.|\b)|b\.?a(?:\.|\b)|m\.?a(?:\.|\b)|b\.?s(?:\.|\b)|m\.?s(?:\.|\b)|ph\.?d(?:\.|\b)|doctorate|doctor\s+of\s+philosophy|associate(?:'s)?(?:\s+(?:degree|of|in)\s+[^,|•\n\r–—]+|\s+degree)?|diploma|mba|intermediate(?:\s*\([^)]+\))?|10\+2|\+2|class\s+(?:xii|x|12|10)|senior\s+secondary|higher\s+secondary|secondary\s+school(?:\s+certificate|\s+examination)?|high\s+school|ssc|cbse|icse)\b/i;

function mapEducation(sec: Section, startIdx: number): StructuredResume['education'] {
  const out: StructuredResume['education'] = [];

  // Partition blocks by distinct degree headers if multiple degree headers exist
  const degreeIndices: number[] = [];
  sec.blocks.forEach((b, idx) => {
    const text = b.text.trim();
    if (DEGREE_REGEX.test(text) && !isBullet(b)) {
      degreeIndices.push(idx);
    }
  });

  let rawEntries: Array<{ headerLines: string[]; bullets: string[] }> = [];

  if (degreeIndices.length >= 2) {
    for (let d = 0; d < degreeIndices.length; d++) {
      const start = degreeIndices[d];
      const end = d + 1 < degreeIndices.length ? degreeIndices[d + 1] : sec.blocks.length;
      const entryBlocks = sec.blocks.slice(start, end);
      const headerLines: string[] = [];
      const bullets: string[] = [];
      for (const eb of entryBlocks) {
        if (isBullet(eb)) {
          bullets.push(stripBullet(eb.text));
        } else {
          headerLines.push(eb.text.trim());
        }
      }
      rawEntries.push({ headerLines, bullets });
    }
  } else {
    rawEntries = parseEntries(sec);
  }

  // If section has list items or multiple lines, evaluate each line/entry
  const rawLines = sectionTextLines(sec);

  rawEntries.forEach((entry, i) => {
    const headerJoined = cleanSeparators(entry.headerLines.join(' | '));
    const dates = extractDates(headerJoined);
    const remainder = dates.remainder || headerJoined;

    let degree = '';
    let school = '';
    let location = '';
    let gpa = '';
    let coursework = '';
    const highlightsArr: string[] = [];

    const allText = [headerJoined, ...entry.bullets].join('\n');
    const gpaMatch = allText.match(GPA_RE) || allText.match(GPA_BARE_RE);
    if (gpaMatch) gpa = gpaMatch[1].trim();

    const cwMatch = allText.match(/(?:relevant\s+)?coursework\s*[:\-]\s*(.+)/i);
    if (cwMatch) coursework = cwMatch[1].trim();

    // Find the segment that contains degree
    const pipeSegments = headerJoined.split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
    for (const seg of pipeSegments) {
      if (DEGREE_REGEX.test(seg) && !degree) {
        degree = seg.replace(GPA_RE, '').trim();
      } else if (INSTITUTION_OR_COMPANY_WORD.test(seg) && !school) {
        school = seg;
      }
    }

    if (!degree) {
      const degreeMatch = remainder.match(DEGREE_REGEX);
      if (degreeMatch) degree = degreeMatch[0].trim();
    }

    const segments = splitSegments(remainder);
    const nonDegree = segments.filter((s) => !DEGREE_REGEX.test(s) && !GPA_RE.test(s) && !/coursework/i.test(s));

    if (!school && nonDegree.length > 0) {
      const candidateSchool = nonDegree.find((s) => !/^(?:graduated|passed|completed|expected)$/i.test(s.trim())) || nonDegree[0] || '';
      school = candidateSchool;
    }
    school = school.replace(GPA_RE, '').replace(/\b(?:percentage|gpa|cgpa)\b[:\-]?\s*[\d.]+%?/i, '').replace(/[:\-–—|]+$/, '').trim();

    if (!location && nonDegree.length >= 2 && PLACE_RE.test(nonDegree[1])) {
      location = nonDegree[1] || '';
    }

    for (const b of entry.bullets) {
      if (!cwMatch || !b.includes(cwMatch[1])) {
        highlightsArr.push(b);
      }
    }

    if (!degree && !school) {
      // Check if remainder or any bullet had institution/degree keywords
      if (allText.length > 5) {
        school = headerJoined || entry.bullets[0] || '';
      } else {
        return;
      }
    }

    out.push({
      id: `edu-${startIdx}-${i}`,
      degree: degree || '',
      school: school || '',
      location: location || '',
      startDate: dates.startDate || '',
      endDate: dates.endDate || '',
      gpa: gpa || '',
      highlights: highlightsArr.join('; '),
      coursework: coursework || '',
    });
  });

  // Fallback: If parseEntries yielded 0 entries but sectionTextLines has educational lines
  if (out.length === 0 && rawLines.length > 0) {
    rawLines.forEach((line, i) => {
      const dates = extractDates(line);
      const remainder = dates.remainder || line;
      const deg = remainder.match(DEGREE_REGEX)?.[0] || '';
      const gpa = remainder.match(GPA_RE)?.[1] || '';
      const segs = splitSegments(remainder);
      const school = segs.find((s) => s !== deg && !GPA_RE.test(s)) || segs[0] || '';
      out.push({
        id: `edu-${startIdx}-${i}`,
        degree: deg,
        school: school,
        location: '',
        startDate: dates.startDate || '',
        endDate: dates.endDate || '',
        gpa,
        highlights: '',
        coursework: '',
      });
    });
  }

  return out;
}

function mapProjects(sec: Section, startIdx: number): StructuredResume['projects'] {
  const out: StructuredResume['projects'] = [];
  const entries = parseEntries(sec);

  entries.forEach((entry, i) => {
    let rawTitleLine = '';
    const metadataLines: string[] = [];

    for (const hl of entry.headerLines) {
      if (!rawTitleLine) {
        rawTitleLine = hl;
      } else {
        metadataLines.push(hl);
      }
    }

    const allHeaderJoined = cleanSeparators(entry.headerLines.join(' | '));
    const dates = extractDates(allHeaderJoined);

    let name = rawTitleLine || dates.remainder || allHeaderJoined;
    let liveUrl = '';
    let repoUrl = '';

    // Extract GitHub / URLs from title and metadata lines
    for (const line of [name, ...metadataLines]) {
      const gh = line.match(GITHUB_RE);
      if (gh && !repoUrl) {
        repoUrl = gh[0];
      }
      const otherUrl = line.match(new RegExp(URL_RE, 'i'));
      if (
        otherUrl &&
        !liveUrl &&
        !/github\.com/i.test(otherUrl[0]) &&
        !/\.(?:js|ts|py|cpp|java|html|css)\b/i.test(otherUrl[0]) &&
        !technologyDictionaryService.lookup(otherUrl[0])
      ) {
        liveUrl = otherUrl[0];
      }
    }

    if (repoUrl) {
      name = name.replace(repoUrl, '').replace(/\s*[|,]\s*$/, '').trim();
    }
    if (liveUrl) {
      name = name.replace(liveUrl, '').replace(/\s*[|,]\s*$/, '').trim();
    }

    const techStack: string[] = [];

    // Extract inline pipe-separated tech stack (e.g. "Gitlytics | Python, Flask, React...")
    if (name.includes('|')) {
      const [projName, ...restTech] = name.split('|');
      name = projName.trim();
      const techStr = restTech.join(' ');
      splitSkillList(techStr).forEach((t) => {
        const matched = technologyDictionaryService.matchSkillToken(t);
        const canon = matched ? matched.canonicalName : t;
        if (!techStack.includes(canon)) techStack.push(canon);
      });
    }

    // Clean dates out of project name if any leaked
    const nameDates = extractDates(name);
    if (nameDates.startDate) {
      name = nameDates.remainder.trim();
      if (!dates.startDate) Object.assign(dates, nameDates);
    }

    const bullets: string[] = [];
    const allLines = [...metadataLines, ...entry.bullets];
    for (const raw of allLines) {
      const b = stripBullet(raw);
      const techMatch = b.match(/^(?:tech(?:nologies)?|stack|built with|tools?)\s*[:\-]\s*(.+)/i);
      if (techMatch) {
        splitSkillList(techMatch[1]).forEach((t) => {
          const matched = technologyDictionaryService.matchSkillToken(t);
          const canon = matched ? matched.canonicalName : t;
          if (!techStack.includes(canon)) techStack.push(canon);
        });
      } else if (!b.match(GITHUB_RE) && !b.match(new RegExp(URL_RE, 'i')) && !DATE_RANGE_RE.test(b) && !SINGLE_DATE_RE.test(b)) {
        bullets.push(b);
      }
    }

    if (!name && bullets.length === 0) return;
    out.push({
      id: `proj-${startIdx}-${i}`,
      name: name || '',
      description: bullets[0] && !name ? bullets.shift() || '' : '',
      techStack,
      liveUrl: liveUrl || '',
      repoUrl: repoUrl || '',
      bullets,
      achievements: [],
    });
  });
  return out;
}

// ── Skills ────────────────────────────────────────────────────────────────
const SKILL_CATEGORY_LABELS: Array<[keyof StructuredResume['skills'], RegExp]> = [
  ['languages', /^(?:programming\s+)?languages?(?:\s*(?:&|and|\/)\s*technologies)?$/i],
  ['frameworks', /^(?:frameworks?(?:\s*(?:&|and|\/|\+)\s*(?:libraries|librar(?:y|ies)|packages|developer\s+tools|tools))?|web\s+frameworks)$/i],
  ['libraries', /^(?:libraries|packages|libraries\s*(?:&|and|\/|\+)\s*packages)$/i],
  ['databases', /^(?:databases?(?:\s*(?:&|and|\/|\+)\s*(?:storage|stores?|systems?|tools|technologies))?|data\s*stores?(?:\s*(?:&|and|\/|\+)\s*warehouses?)?|database\s+systems?|sql\s*(?:&|and|\/|\+)\s*nosql|nosql|sql|storage\s*(?:&|and|\/|\+)\s*databases?)$/i],
  ['cloudDevOps', /^(?:cloud(?:\s*(?:&|and|\/|\+)\s*(?:devops|infrastructure|platforms?|technologies|tools|ci\/cd))?|devops(?:\s*(?:&|and|\/|\+)\s*(?:cloud|infrastructure|tools|ci\/cd))?|ci\/cd|infrastructure|platforms?|cloud\s+technologies|cloud\s+platforms)$/i],
  ['security', /^(?:security|infosec|cybersecurity|information\s+security)$/i],
  ['tools', /^(?:tools?(?:\s*(?:&|and|\/|\+)\s*(?:technologies|platforms|methodologies|software|utilities))?|developer\s+tools|software(?:\s*(?:&|and|\/|\+)\s*tools?)?|ides?|operating\s+systems?|os|environments?|build\s+tools)$/i],
  ['other', /^(?:other(?:\s+skills)?|core\s+competencies|areas?\s+of\s+(?:interest|expertise)|general|methodologies|web\s+technologies)$/i],
];

export function splitSkillList(value: string): string[] {
  return technologyDictionaryService.splitSkillTokens(value);
}

function mapSkills(sec: Section): StructuredResume['skills'] {
  const lines = sectionTextLines(sec);
  const result = technologyDictionaryService.extractSkillsFromSection(lines, sec.header);
  return result.skills;
}

// ── Simple list sections ──────────────────────────────────────────────────
function mapCertifications(sec: Section, startIdx: number): StructuredResume['certifications'] {
  const out: StructuredResume['certifications'] = [];
  const lines = sectionTextLines(sec);

  // Guard against education records or employment titles leaking into certifications
  const isEduOrWorkLine = (text: string) => {
    return /\b(?:bachelor|master|b\.?tech|m\.?tech|ph\.?d|degree|university|institute|cgpa|gpa|software\s+engineer|developer|intern)\b/i.test(text);
  };

  lines.forEach((line, i) => {
    const text = stripBullet(line).trim();
    if (!text) return;
    if (isEduOrWorkLine(text)) return;

    const dates = extractDates(text);
    let body = (dates.remainder || text).trim();
    const urlMatch = body.match(URL_RE);
    let credentialUrl = '';
    if (urlMatch && /credential|verify|http/i.test(urlMatch[0])) {
      credentialUrl = urlMatch[0];
      body = body.replace(urlMatch[0], '').replace(/\s*[|,]\s*$/, '').trim();
    }

    let title = '';
    let issuer = '';

    // Primary delimiter: Pipe (|)
    if (body.includes('|')) {
      const parts = body.split('|').map((p) => p.trim()).filter(Boolean);
      title = parts[0] || '';
      issuer = parts.length >= 2 ? parts[1] : '';
    } else {
      // Check for explicit "by <Issuer>" or "from <Issuer>" or "issued by <Issuer>"
      const byMatch = body.match(/^(.+?)\s+(?:by|from|issued by)\s+(.+)$/i);
      if (byMatch) {
        title = byMatch[1].trim();
        issuer = byMatch[2].trim();
      } else if (body.includes(' – ') || body.includes(' — ')) {
        const parts = body.split(/\s+[–—]\s+/).map((p) => p.trim()).filter(Boolean);
        title = parts[0] || '';
        issuer = parts.length >= 2 ? parts[1] : '';
      } else if (body.includes(',')) {
        const parts = body.split(',').map((p) => p.trim()).filter(Boolean);
        title = parts[0] || '';
        issuer = parts.length >= 2 ? parts[1] : '';
      } else {
        title = body;
      }
    }

    title = title.replace(/[:\-–—|]+$/, '').trim();
    issuer = issuer.replace(/[:\-–—|]+$/, '').trim();

    if (title && title.length < 140) {
      out.push({
        id: `cert-${startIdx}-${i}`,
        title: title.trim(),
        issuer: issuer.trim(),
        date: dates.startDate || '',
        credentialUrl,
      });
    }
  });
  return out.filter((c) => c.title);
}

function mapPublications(sec: Section, startIdx: number): StructuredResume['publications'] {
  const out: StructuredResume['publications'] = [];
  const lines = sectionTextLines(sec);
  lines.forEach((line, i) => {
    const text = stripBullet(line).trim();
    if (!text) return;
    const dates = extractDates(text);
    let body = dates.remainder || text;
    const urlMatch = body.match(URL_RE);
    let url = '';
    if (urlMatch) {
      url = urlMatch[0];
      body = body.replace(urlMatch[0], '').replace(/\s*[|,]\s*$/, '').trim();
    }
    const segs = splitSegments(body);
    const title = segs[0] || body;
    const venue = segs.length >= 2 ? segs.slice(1).join(', ') : '';
    out.push({ id: `pub-${startIdx}-${i}`, title: title.trim(), venue: venue.trim(), date: dates.startDate || '', url });
  });
  return out.filter((p) => p.title);
}

function mapPatents(sec: Section, startIdx: number): StructuredResume['patents'] {
  const out: StructuredResume['patents'] = [];
  const lines = sectionTextLines(sec);
  lines.forEach((line, i) => {
    const text = stripBullet(line).trim();
    if (!text) return;
    const dates = extractDates(text);
    let body = dates.remainder || text;
    const numMatch = body.match(/\b(?:patent\s*(?:no\.?|number)?\s*[:#\-]?\s*)?([A-Z]{0,3}\d{5,}[A-Z0-9]*)\b/i);
    let number = '';
    if (numMatch) {
      number = numMatch[1];
      body = body.replace(numMatch[0], '').replace(/\s*[|,]\s*$/, '').trim();
    }
    out.push({ id: `pat-${startIdx}-${i}`, title: body.trim(), number, date: dates.startDate || '', url: '' });
  });
  return out.filter((p) => p.title || p.number);
}

function mapPublicationsAndPatents(sec: Section, startIdx: number): { publications: StructuredResume['publications']; patents: StructuredResume['patents'] } {
  const pubs: StructuredResume['publications'] = [];
  const pats: StructuredResume['patents'] = [];
  const lines = sectionTextLines(sec);

  lines.forEach((line, i) => {
    const text = stripBullet(line).trim();
    if (!text) return;
    const isPatent = /\b(?:patent|granted|filed|application\s+no|ipr)\b/i.test(text);
    if (isPatent) {
      const dates = extractDates(text);
      let body = dates.remainder || text;
      const numMatch = body.match(/\b(?:patent\s*(?:no\.?|number)?\s*[:#\-]?\s*)?([A-Z]{0,3}\d{5,}[A-Z0-9]*)\b/i);
      let number = '';
      if (numMatch) {
        number = numMatch[1];
        body = body.replace(numMatch[0], '').replace(/\s*[|,]\s*$/, '').trim();
      }
      pats.push({ id: `pat-${startIdx}-${i}`, title: body.trim(), number, date: dates.startDate || '', url: '' });
    } else {
      const dates = extractDates(text);
      let body = dates.remainder || text;
      const urlMatch = body.match(URL_RE);
      let url = '';
      if (urlMatch) {
        url = urlMatch[0];
        body = body.replace(urlMatch[0], '').replace(/\s*[|,]\s*$/, '').trim();
      }
      const segs = splitSegments(body);
      const title = segs[0] || body;
      const venue = segs.length >= 2 ? segs.slice(1).join(', ') : '';
      pubs.push({ id: `pub-${startIdx}-${i}`, title: title.trim(), venue: venue.trim(), date: dates.startDate || '', url });
    }
  });

  return { publications: pubs, patents: pats };
}

function mapStructuredCustomSection(sec: Section, startIdx: number, defaultTitle: string): { id: string; title: string; items: string[] } | null {
  const entries = parseEntries(sec);
  if (entries.length === 0) {
    const rawLines = mapStringList(sec);
    if (rawLines.length === 0) return null;
    return {
      id: `sec-custom-${startIdx}`,
      title: sec.header || defaultTitle,
      items: rawLines,
    };
  }

  const items: string[] = [];
  for (const entry of entries) {
    const header = entry.headerLines.join(' | ').trim();
    if (entry.bullets.length > 0) {
      if (header) {
        items.push(`${header}\n${entry.bullets.map((b) => `• ${b}`).join('\n')}`);
      } else {
        items.push(entry.bullets.join('\n'));
      }
    } else if (header) {
      items.push(header);
    }
  }

  if (items.length === 0) return null;
  return {
    id: `sec-custom-${startIdx}`,
    title: sec.header || defaultTitle,
    items,
  };
}

function mapStringList(sec: Section): string[] {
  return sectionTextLines(sec)
    .map((l) => stripBullet(l).trim())
    .filter(Boolean);
}

function isProgrammingToken(token: string): boolean {
  const t = token.toLowerCase();
  if (KNOWN_PROGRAMMING_LANGUAGES.has(t)) return true;
  if (/^(?:c\+\+|c#|\.net|node\.?js|react|angular|vue|python|java|rust|go|golang|sql|bash|html|css|r|matlab|scala)$/i.test(t)) return true;
  return false;
}

function mapLanguages(sec: Section): { spoken: string[]; programming: string[] } {
  const spoken: string[] = [];
  const programming: string[] = [];
  const lines = sectionTextLines(sec);

  const isExplicitSpokenHeader = sec.category === 'spoken_languages' || /spoken|foreign|natural/i.test(sec.header);
  const isExplicitProgHeader = sec.category === 'programming_languages' || /programming|coding|technical/i.test(sec.header);

  for (const line of lines) {
    const text = stripBullet(line).trim();
    if (!text) continue;

    const labelMatch = text.match(/^([^:]{2,40}):\s*(.+)$/);
    if (labelMatch) {
      const rawLabel = labelMatch[1].trim().toLowerCase();
      const rawVals = splitSkillList(labelMatch[2]);

      if (rawLabel === 'languages' || rawLabel === 'programming languages' || rawLabel === 'technical languages') {
        rawVals.forEach((v) => {
          if (KNOWN_PROGRAMMING_LANGUAGES.has(v.toLowerCase()) || isProgrammingToken(v) || isExplicitProgHeader) {
            programming.push(v);
          } else if (KNOWN_SPOKEN_LANGUAGES.has(v.toLowerCase()) || SPOKEN_PROFICIENCY_KEYWORDS.test(v)) {
            spoken.push(v);
          } else if (!isExplicitSpokenHeader) {
            programming.push(v);
          }
        });
        continue;
      }

      if (KNOWN_SPOKEN_LANGUAGES.has(rawLabel) || isExplicitSpokenHeader) {
        spoken.push(`${labelMatch[1].trim()} (${labelMatch[2].trim()})`);
        continue;
      }
    }

    const vals = splitSkillList(text);
    vals.forEach((v) => {
      const vClean = v.replace(/\s*\([^)]*\)/, '').trim().toLowerCase();
      if (KNOWN_PROGRAMMING_LANGUAGES.has(vClean) || isProgrammingToken(vClean) || isExplicitProgHeader) {
        programming.push(v);
      } else if (KNOWN_SPOKEN_LANGUAGES.has(vClean) || SPOKEN_PROFICIENCY_KEYWORDS.test(v) || isExplicitSpokenHeader) {
        spoken.push(v);
      } else if (!isExplicitSpokenHeader && isProgrammingToken(vClean)) {
        programming.push(v);
      }
    });
  }

  return {
    spoken: Array.from(new Set(spoken)),
    programming: Array.from(new Set(programming)),
  };
}

// ── Main mapper ───────────────────────────────────────────────────────────
export function mapDoclingToStructuredResume(input: DoclingInput): StructuredResume {
  const resume = emptyResume();
  const blocks = toBlocks(input);
  const fullText = input.plain_text || input.resumeText || input.markdown || blocks.map((b) => b.text).join('\n');
  resume.rawText = fullText;

  const { preamble, sections } = groupSections(blocks);

  resume.personalInfo = extractPersonalInfo(preamble, fullText, input.markdown);

  const summarySection = sections.find((s) => s.category === 'summary');

  let idx = 0;
  const customSectionCandidates: Section[] = [];

  for (const sec of sections) {
    const i = idx++;
    switch (sec.category) {
      case 'personal_info': {
        const text = sectionTextLines(sec).join(' | ');
        const p = extractPersonalInfo(sec.blocks, text, input.markdown);
        resume.personalInfo = {
          fullName: resume.personalInfo.fullName || p.fullName,
          title: resume.personalInfo.title || p.title,
          email: resume.personalInfo.email || p.email,
          phone: resume.personalInfo.phone || p.phone,
          location: resume.personalInfo.location || p.location,
          linkedin: resume.personalInfo.linkedin || p.linkedin,
          github: resume.personalInfo.github || p.github,
          portfolio: resume.personalInfo.portfolio || p.portfolio,
        };
        break;
      }
      case 'summary':
        resume.summary = sectionTextLines(sec).join(' ').replace(/\s{2,}/g, ' ').trim();
        break;
      case 'experience':
        resume.experience.push(...mapExperience(sec, i));
        break;
      case 'research_experience': {
        const secRes = mapStructuredCustomSection(sec, i, 'Research Experience');
        if (secRes) resume.customSections.push(secRes);
        break;
      }
      case 'teaching_experience': {
        const secRes = mapStructuredCustomSection(sec, i, 'Teaching Experience');
        if (secRes) resume.customSections.push(secRes);
        break;
      }
      case 'education':
        resume.education.push(...mapEducation(sec, i));
        break;
      case 'projects':
        resume.projects.push(...mapProjects(sec, i));
        break;
      case 'skills': {
        const lines = sectionTextLines(sec);
        const { skills: s, spokenLanguages } = technologyDictionaryService.extractSkillsFromSection(lines, sec.header);
        (Object.keys(s) as Array<keyof StructuredResume['skills']>).forEach((k) => {
          (resume.skills[k] as string[]).push(...((s[k] as string[]) || []));
        });
        if (spokenLanguages.length > 0) {
          resume.languages.push(...spokenLanguages);
        }
        break;
      }
      case 'programming_languages': {
        const res = mapLanguages(sec);
        if (res.programming.length > 0) resume.skills.languages.push(...res.programming);
        if (res.spoken.length > 0) resume.languages.push(...res.spoken);
        break;
      }
      case 'spoken_languages': {
        const res = mapLanguages(sec);
        if (res.spoken.length > 0) resume.languages.push(...res.spoken);
        if (res.programming.length > 0) resume.skills.languages.push(...res.programming);
        break;
      }
      case 'certifications':
        resume.certifications.push(...mapCertifications(sec, i));
        break;
      case 'publications':
        resume.publications.push(...mapPublications(sec, i));
        break;
      case 'patents':
        resume.patents.push(...mapPatents(sec, i));
        break;
      case 'publications_and_patents': {
        const res = mapPublicationsAndPatents(sec, i);
        resume.publications.push(...res.publications);
        resume.patents.push(...res.patents);
        break;
      }
      case 'achievements': {
        const items = mapStringList(sec);
        resume.achievements.push(...items);
        if (items.length > 0) {
          resume.customSections.push({
            id: `sec-achievements-${i}`,
            title: sec.header || 'Achievements & Activities',
            items,
          });
        }
        break;
      }
      case 'responsibility': {
        const secRes = mapStructuredCustomSection(sec, i, 'Positions of Responsibility');
        if (secRes) resume.customSections.push(secRes);
        break;
      }
      case 'courses': {
        const items = mapStringList(sec);
        if (items.length > 0) {
          resume.customSections.push({
            id: `sec-courses-${i}`,
            title: sec.header || 'Courses',
            items,
          });
        }
        break;
      }
      case 'extracurricular': {
        const secRes = mapStructuredCustomSection(sec, i, 'Extra Curricular Activities');
        if (secRes) resume.customSections.push(secRes);
        break;
      }
      case 'languages': {
        const langResult = mapLanguages(sec);
        if (langResult.spoken.length > 0) {
          resume.languages.push(...langResult.spoken);
        }
        if (langResult.programming.length > 0) {
          resume.skills.languages.push(...langResult.programming);
        }
        break;
      }
      case 'interests':
        resume.hobbies.push(...mapStringList(sec));
        break;
      default:
        customSectionCandidates.push(sec);
    }
  }

  // Collect orphan date/location pairs from personal_info or custom section candidates
  const orphanDates: Array<{ startDate: string; endDate: string; location: string }> = [];

  const scanForOrphans = (secList: Section[]) => {
    for (const sec of secList) {
      for (let i = 0; i < sec.blocks.length; i++) {
        const t = sec.blocks[i].text.trim();
        if (EMAIL_RE.test(t) || PHONE_RE.test(t) || URL_RE.test(t)) continue;
        if (looksLikeName(t)) continue;
        const d = extractDates(t);
        if (d.startDate) {
          let loc = '';
          if (i + 1 < sec.blocks.length) {
            const nextText = sec.blocks[i + 1].text.trim();
            if (PLACE_RE.test(nextText) || /^[A-Za-z\s.,\-]+,\s*[A-Z]{2}\b/i.test(nextText)) {
              loc = nextText;
              i++; // consume location block too
            }
          }
          orphanDates.push({ startDate: d.startDate, endDate: d.endDate, location: loc });
        }
      }
    }
  };

  scanForOrphans(sections.filter((s) => s.category === 'personal_info'));
  scanForOrphans(customSectionCandidates);

  // Backfill into experience items missing dates
  for (const exp of resume.experience) {
    if (!exp.startDate && orphanDates.length > 0) {
      const orphan = orphanDates.shift()!;
      exp.startDate = orphan.startDate;
      exp.endDate = orphan.endDate;
      exp.current = PRESENT_RE.test(orphan.endDate);
      if (!exp.location && orphan.location) {
        exp.location = orphan.location;
      }
    }
  }

  // Preserve any unrecognized non-empty section as a custom section, EXCEPT if it's canonical info
  customSectionCandidates.forEach((sec, i) => {
    const headerLower = (sec.header || '').toLowerCase();
    if (
      classifyHeader(sec.header || '') !== 'unknown' ||
      /\b(?:personal\s+info|contact\s+info)\b/i.test(headerLower)
    ) {
      return;
    }
    const items = mapStringList(sec).filter((it) => {
      if (DATE_RANGE_RE.test(it) && it.length < 35) return false;
      if (EMAIL_RE.test(it) || PHONE_RE.test(it) || URL_RE.test(it)) return false;
      return true;
    });
    if (!sec.header && items.length === 0) return;
    if (items.length === 0) return;

    resume.customSections.push({
      id: `sec-custom-${i}`,
      title: sec.header || 'Additional Section',
      items,
    });
  });

  // Fallback summary: ONLY use trailing preamble prose if there is a real prose paragraph (>= 15 words)
  // that does not contain section names, dates/years, contact info, or candidate name.
  if (!resume.summary && !summarySection) {
    const isRealSummary = (t: string) => {
      const words = t.split(/\s+/).filter(Boolean);
      if (words.length < 15) return false;
      if (EMAIL_RE.test(t) || PHONE_RE.test(t) || URL_RE.test(t)) return false;
      if (resume.personalInfo.fullName && t.includes(resume.personalInfo.fullName)) return false;
      if (/\b(?:education|experience|skills|projects|publications|achievements|courses|gpa|cgpa)\b/i.test(t)) return false;
      if (/\b(?:19|20)\d{2}\s*(?:-|–|—|to)\s*(?:(?:19|20)\d{2}|present)\b/i.test(t)) return false;
      return true;
    };
    const prose = preamble.map((b) => b.text.trim()).filter(isRealSummary);
    if (prose.length) resume.summary = prose[0];
  }

  // De-duplicate skill buckets and lists
  (Object.keys(resume.skills) as Array<keyof StructuredResume['skills']>).forEach((k) => {
    resume.skills[k] = Array.from(new Set(resume.skills[k] as string[]));
  });

  // Strict: ensure resume.languages contains only genuine spoken languages and zero programming tokens
  resume.languages = Array.from(new Set(resume.languages)).filter((lang) => {
    const clean = lang.replace(/\s*\([^)]*\)/, '').trim().toLowerCase();
    return !isProgrammingToken(clean) && !KNOWN_PROGRAMMING_LANGUAGES.has(clean);
  });

  resume.achievements = Array.from(new Set(resume.achievements));
  resume.hobbies = Array.from(new Set(resume.hobbies));

  return resume;
}

export const structuredResumeMapperService = {
  mapDoclingToStructuredResume,
};
