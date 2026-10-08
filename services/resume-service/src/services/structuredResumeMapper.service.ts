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
  ['extracurricular', /^(?:extra\s*[- ]*curricular\s+activities|co\s*[- ]*curricular\s+activities|extracurriculars?|activities)$/i],
  ['courses', /^(?:courses?|relevant\s+courses?|relevant\s+coursework|key\s+courses?|key\s+coursework|coursework)$/i],
  ['achievements', /^(?:scholastic\s+achievements?|academic\s+achievements?|achievements?|honou?rs?\s*(?:&|and)\s*awards?|awards?\s*(?:&|and)\s*honou?rs?|awards?|honou?rs?|accomplishments?|recognitions?|scholarships?)$/i],
  ['patents', /^(?:patents?|intellectual\s+property|inventions?)$/i],
  ['publications', /^(?:publications?|papers?|articles?|conference\s+proceedings|journal\s+publications|refereed\s+papers?|theses|thesis)$/i],
  ['certifications', /^(?:certifications?|professional\s+certifications?|licenses?\s*(?:&|and)\s*certifications?|certifications?\s*(?:&|and)\s*licenses?)$/i],
  ['education', /^(?:education|academics?|educational\s+qualifications|educational\s+background|qualifications?|degrees?)$/i],
  ['skills', /^(?:technical\s+(?:skills?|competencies|expertise|proficiencies)|skills?\s*(?:&|and|\/)\s*(?:abilities|tools|competencies)|skills?|technologies|tech\s+stack|competenc(?:y|ies)|proficienc(?:y|ies)|areas?\s+of\s+expertise|programming\s+languages?\s*(?:&|and|\/)\s*tools?|computational\s+skills)$/i],
  ['programming_languages', /^(?:programming\s+languages?|coding\s+languages?|technical\s+languages?|computer\s+languages?)$/i],
  ['spoken_languages', /^(?:spoken\s+languages?|language\s+proficiency|foreign\s+languages?|natural\s+languages?)$/i],
  ['projects', /^(?:projects?|personal\s+projects|academic\s+projects|key\s+projects|technical\s+projects|selected\s+projects|capstone\s+projects?)$/i],
  ['experience', /^(?:professional\s+experience|work\s+experience|experience|employment|work\s+history|career\s+history|professional\s+background|industry\s+experience)$/i],
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
  const clean = cleanMarkdownDecorators(headerText).replace(/[:\-–—]+$/, '').trim();
  if (!clean) return 'unknown';

  // Exact anchor match first
  for (const [cat, re] of SECTION_PATTERNS) {
    if (re.test(clean)) return cat;
  }

  // Word boundary substring match for compound/decorated headers
  for (const [cat, re] of SECTION_PATTERNS) {
    const source = re.source.replace(/^\^|\$$/g, '');
    if (new RegExp(`\\b(?:${source})\\b`, 'i').test(clean)) {
      return cat;
    }
  }

  return 'unknown';
}

// ── Shared regexes ────────────────────────────────────────────────────────
const MONTH = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?';
const DATE_TOKEN = `(?:${MONTH}\\s*\\d{0,4}|\\d{1,2}\\/\\d{4}|\\d{4})`;
const DATE_RANGE_RE = new RegExp(
  `(${DATE_TOKEN})\\s*(?:-|–|—|to|until|through)\\s*((?:${DATE_TOKEN})|present|current|now|ongoing)`,
  'i'
);
const SINGLE_DATE_RE = new RegExp(`(${MONTH}\\s*\\d{4}|\\b\\d{4}\\b)`, 'i');
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
}

/** Group blocks into sections using section_header boundaries. */
function groupSections(blocks: Block[]): { preamble: Block[]; sections: Section[] } {
  const preamble: Block[] = [];
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const b of blocks) {
    const isHeader =
      b.type === 'section_header' ||
      (b.type === 'title' && sections.length > 0) ||
      isSectionHeaderLine(b.text);

    // Title element at the top is the candidate document title/name
    if (b.type === 'title' && sections.length === 0 && !current && !isSectionHeaderLine(b.text)) {
      preamble.push(b);
      continue;
    }

    if (isHeader) {
      const category = classifyHeader(b.text);
      current = { category, header: cleanMarkdownDecorators(b.text).replace(/[:\-–—]+$/, '').trim(), blocks: [] };
      sections.push(current);
    } else if (current) {
      current.blocks.push(b);
    } else {
      preamble.push(b);
    }
  }
  return { preamble, sections };
}

function sectionTextLines(sec: Section): string[] {
  return sec.blocks.map((b) => b.text.trim()).filter(Boolean);
}

// ── Personal info ─────────────────────────────────────────────────────────
const SECTION_HEADING_WORDS = /^(?:resume|curriculum\s+vitae|cv|experience|work\s+experience|education|skills|technical\s+skills|projects|summary|profile|contact|contact\s+info|certifications|achievements|courses|publications|patents)$/i;

function looksLikeName(line: string): boolean {
  const clean = cleanMarkdownDecorators(line);
  if (!clean) return false;
  if (EMAIL_RE.test(clean) || PHONE_RE.test(clean) || URL_RE.test(clean)) return false;
  if (/\d/.test(clean) || /[|•\/]/.test(clean)) return false;
  if (SECTION_HEADING_WORDS.test(clean)) return false;
  if (classifyHeader(clean) !== 'unknown') return false;
  const words = clean.split(/\s+/);
  if (words.length < 1 || words.length > 5) return false;
  return words.every((w) => /^[A-Za-z.'\-]+$/.test(w));
}

function extractPersonalInfo(preamble: Block[], fullText: string): StructuredResumePersonalInfo {
  const info = emptyResume().personalInfo;
  const preLines = preamble.map((b) => b.text.trim()).filter(Boolean);
  const fullTopLines = fullText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 15);
  const searchPool = [...preLines, ...fullTopLines];
  const joined = searchPool.join('\n');

  // Name: first name-like line in preamble, fallback to top lines of fullText
  for (const rawLine of [...preLines.slice(0, 6), ...fullTopLines.slice(0, 6)]) {
    const cleaned = cleanMarkdownDecorators(rawLine);
    if (looksLikeName(cleaned)) {
      info.fullName = cleaned;
      break;
    }
    const segments = cleaned.split(/[|•–—]/).map((s) => s.trim());
    if (segments.length > 1 && looksLikeName(segments[0])) {
      info.fullName = segments[0];
      break;
    }
  }

  // Email
  const emailMatch = joined.match(EMAIL_RE);
  if (emailMatch) info.email = emailMatch[0].trim();

  // Phone
  const phoneMatch = joined.match(/(?:\+?\d{1,4}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}(?:[-.\s]?\d{1,4})?/);
  if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 7) {
    info.phone = phoneMatch[0].trim();
  }

  // LinkedIn
  const liMdMatch = joined.match(/\[.*?linkedin.*?\]\((https?:\/\/[^\s\)]+)\)/i);
  const liMatch = joined.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub|company)?\/?[a-zA-Z0-9_.\-%/]+/i);
  const liPrefixMatch = joined.match(/(?:linkedin|linkedin\.com)\s*[:\-]\s*(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com\/(?:in|pub)?\/?)?([a-zA-Z0-9_.\-%]+)/i);

  if (liMdMatch) {
    info.linkedin = liMdMatch[1].trim();
  } else if (liMatch) {
    const rawLi = liMatch[0].trim().replace(/[)\]]+$/, '');
    info.linkedin = rawLi.startsWith('http') ? rawLi : `https://${rawLi}`;
  } else if (liPrefixMatch) {
    const handle = liPrefixMatch[1].trim();
    info.linkedin = `https://linkedin.com/in/${handle}`;
  }

  // GitHub
  const ghMdMatch = joined.match(/\[.*?github.*?\]\((https?:\/\/[^\s\)]+)\)/i);
  const ghMatch = joined.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_.\-%/]+/i);
  const ghPrefixMatch = joined.match(/(?:github|github\.com)\s*[:\-]\s*(?:https?:\/\/)?(?:www\.)?(?:github\.com\/)?([a-zA-Z0-9_.\-%]+)/i);

  if (ghMdMatch) {
    info.github = ghMdMatch[1].trim();
  } else if (ghMatch) {
    const rawGh = ghMatch[0].trim().replace(/[)\]]+$/, '');
    info.github = rawGh.startsWith('http') ? rawGh : `https://${rawGh}`;
  } else if (ghPrefixMatch) {
    const handle = ghPrefixMatch[1].trim();
    info.github = `https://github.com/${handle}`;
  }

  // Portfolio / Personal Website
  const portfolioLabelMatch = joined.match(/(?:portfolio|website|site|homepage)\s*[:\-]\s*(?:https?:\/\/)?([a-zA-Z0-9_.\-]+\.[a-zA-Z]{2,}(?:\/[^\s,|]*)?)/i);
  if (portfolioLabelMatch) {
    const rawPort = portfolioLabelMatch[1].trim().replace(/[)\]]+$/, '');
    info.portfolio = rawPort.startsWith('http') ? rawPort : `https://${rawPort}`;
  } else {
    const textWithoutEmails = joined.replace(new RegExp(EMAIL_RE, 'gi'), ' ');
    const urlMatches = textWithoutEmails.match(new RegExp(URL_RE, 'gi')) || [];
    const portfolio = urlMatches.find(
      (u) =>
        !/linkedin\.com/i.test(u) &&
        !/github\.com/i.test(u) &&
        !/@/i.test(u) &&
        !/gmail|yahoo|hotmail|outlook|example\.com/i.test(u)
    );
    if (portfolio) {
      const rawPort = portfolio.trim().replace(/[)\]]+$/, '');
      info.portfolio = rawPort.startsWith('http') ? rawPort : `https://${rawPort}`;
    }
  }

  // Professional Title: search near the name or inspect top lines
  const roleRegex = /^(?:Senior|Junior|Lead|Principal|Staff|Associate|Chief|Founding)?\s*(?:Software|Full\s*Stack|Frontend|Backend|DevOps|Cloud|Data|ML|AI|Cybersecurity|Systems?|Platform|Product|Design|UI\/UX|Mobile|iOS|Android|Web|Research|Graduate)?\s*(?:Engineer|Developer|Designer|Architect|Manager|Specialist|Analyst|Scientist|Consultant|Researcher|Administrator|Lead|Intern|Fellow|Assistant)\b/i;

  for (const cand of searchPool.slice(0, 8)) {
    const cleanCand = cleanMarkdownDecorators(cand);
    if (!cleanCand || cleanCand === info.fullName) continue;
    if (EMAIL_RE.test(cleanCand) || URL_RE.test(cleanCand)) continue;
    if (classifyHeader(cleanCand) !== 'unknown') continue;
    if (roleRegex.test(cleanCand) && cleanCand.length <= 80) {
      info.title = cleanCand;
      break;
    }
  }

  // Location: inspect individual segments in the contact header lines
  for (const line of searchPool.slice(0, 10)) {
    const cleanLine = cleanMarkdownDecorators(line);
    if (cleanLine === info.fullName || cleanLine === info.title) continue;
    const segments = cleanLine.split(/[|•–—\n]/).map((s) => s.trim()).filter(Boolean);
    for (const seg of segments) {
      if (EMAIL_RE.test(seg) || URL_RE.test(seg) || (phoneMatch && seg.includes(phoneMatch[0]))) continue;
      if (/university|college|institute|school|technologies|solutions|github|linkedin|portfolio/i.test(seg)) continue;
      const placeMatch = seg.match(PLACE_RE);
      if (placeMatch && seg.length <= 60 && !/\d{5,}/.test(seg)) {
        info.location = seg.replace(/^Location\s*[:\-]\s*/i, '').trim();
        break;
      }
    }
    if (info.location) break;
  }

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

    if (bullet) {
      if (cur) {
        cur.bullets.push(stripBullet(text));
      } else {
        cur = { headerLines: [], bullets: [stripBullet(text)] };
        entries.push(cur);
      }
      continue;
    }

    const curHasDate = cur ? cur.headerLines.some((hl) => DATE_RANGE_RE.test(hl) || SINGLE_DATE_RE.test(hl)) : false;
    const startsEntry =
      !cur ||
      cur.bullets.length > 0 ||
      (hasDate && curHasDate) ||
      (!hasDate && curHasDate && cur.headerLines.length >= 2);

    if (startsEntry) {
      cur = { headerLines: [text], bullets: [] };
      entries.push(cur);
    } else if (cur) {
      cur.headerLines.push(text);
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

const DEGREE_REGEX = /\b(bachelor(?:'s)?(?:\s+of\s+[^,]+)?|master(?:'s)?(?:\s+of\s+[^,]+)?|dual\s+degree(?:\s*\([^)]+\))?|b\.?\s?tech(?:\.|\b)(?:\s*(?:in|of)\s*[^,|]+)?|m\.?\s?tech(?:\.|\b)(?:\s*(?:in|of)\s*[^,|]+)?|b\.?\s?sc(?:\.|\b)|m\.?\s?sc(?:\.|\b)|b\.?\s?e(?:\.|\b)|m\.?\s?e(?:\.|\b)|b\.?\s?a(?:\.|\b)|m\.?\s?a(?:\.|\b)|ph\.?\s?d(?:\.|\b)|doctorate|doctor\s+of\s+philosophy|associate(?:\s+degree)?|diploma|mba|class\s+(?:xii|x|12|10)|senior\s+secondary|higher\s+secondary|secondary\s+school(?:\s+examination)?|high\s+school|cbse|icse)\b/i;

function mapEducation(sec: Section, startIdx: number): StructuredResume['education'] {
  const out: StructuredResume['education'] = [];
  const entries = parseEntries(sec);

  // If section has list items or multiple lines, evaluate each line/entry
  const rawLines = sectionTextLines(sec);

  entries.forEach((entry, i) => {
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

    const degreeMatch = remainder.match(DEGREE_REGEX);
    if (degreeMatch) degree = degreeMatch[0].trim();

    const segments = splitSegments(remainder);
    const nonDegree = segments.filter((s) => s !== degree && !GPA_RE.test(s));

    if (degree) {
      school = nonDegree[0] || '';
      location = nonDegree.length >= 2 ? nonDegree[1] : '';
    } else if (segments.length >= 1) {
      school = segments[0] || '';
      degree = segments.length >= 2 ? segments[1] : '';
      location = segments.length >= 3 ? segments[2] : '';
    }

    if (location && !PLACE_RE.test(location)) location = '';

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
    const headerJoined = cleanSeparators(entry.headerLines.join(' '));
    const dates = extractDates(headerJoined);
    const nameLine = (dates.remainder || headerJoined).trim();

    let name = nameLine;
    let liveUrl = '';
    let repoUrl = '';
    const gh = nameLine.match(GITHUB_RE);
    if (gh) {
      repoUrl = gh[0];
      name = nameLine.replace(gh[0], '').replace(/\s*[|,]\s*$/, '').trim();
    }
    const otherUrl = nameLine.match(new RegExp(URL_RE, 'i'));
    if (otherUrl && !/github\.com/i.test(otherUrl[0])) {
      liveUrl = otherUrl[0];
      name = name.replace(otherUrl[0], '').replace(/\s*[|,]\s*$/, '').trim();
    }

    const techStack: string[] = [];
    const bullets: string[] = [];
    for (const raw of entry.bullets) {
      const b = stripBullet(raw);
      const techMatch = b.match(/^(?:tech(?:nologies)?|stack|built with|tools?)\s*[:\-]\s*(.+)/i);
      if (techMatch) {
        techMatch[1]
          .split(/[,;•|]/)
          .map((t) => t.trim())
          .filter(Boolean)
          .forEach((t) => techStack.push(t));
      } else {
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
  ['languages', /^(?:programming\s+)?languages?$/i],
  ['frameworks', /^(?:frameworks?|frameworks?\s*(?:&|and|\/)\s*libraries|web\s+frameworks)$/i],
  ['libraries', /^libraries$/i],
  ['databases', /^(?:databases?|data\s*stores?|sql|nosql)$/i],
  ['cloudDevOps', /^(?:cloud|devops|ci\/cd|infrastructure|platforms?|cloud\s*(?:&|and|\/)\s*devops|cloud\s+technologies)$/i],
  ['security', /^(?:security|infosec|cybersecurity)$/i],
  ['tools', /^(?:tools?|developer\s+tools|software\s*(?:&|and|\/)\s*tools?|software|ides?|operating\s+systems?|os|environments?)$/i],
  ['other', /^(?:other|core\s+competencies|areas?\s+of\s+interest|general|methodologies|web\s+technologies)$/i],
];

export function splitSkillList(value: string): string[] {
  return value
    .split(/[,;•|\/\n]/)
    .map((s) => cleanMarkdownDecorators(s).trim())
    .filter((s) => s.length > 0 && !/^[:\-–—]+$/.test(s));
}

function mapSkills(sec: Section): StructuredResume['skills'] {
  const skills = emptyResume().skills;
  const lines = sectionTextLines(sec);
  let matchedAny = false;

  for (const line of lines) {
    const clean = cleanMarkdownDecorators(line).trim();
    if (!clean) continue;

    // Check for "Label: Value, Value, Value"
    const labelMatch = clean.match(/^([A-Za-z\s&/]{2,40})[:\-–—]\s*(.+)$/);
    if (labelMatch) {
      const rawLabel = labelMatch[1].trim();
      const rawValues = splitSkillList(labelMatch[2]);
      if (!rawValues.length) continue;

      const catEntry = SKILL_CATEGORY_LABELS.find(([, re]) => re.test(rawLabel));
      if (catEntry) {
        const key = catEntry[0];
        let bucket: keyof StructuredResume['skills'] = key;
        if (/^libraries$/i.test(rawLabel)) {
          bucket = 'libraries';
        } else if (/framework/i.test(rawLabel)) {
          bucket = 'frameworks';
          if (/librar/i.test(rawLabel)) {
            skills.libraries.push(...rawValues);
          }
        }
        (skills[bucket] as string[]).push(...rawValues);
        matchedAny = true;
        continue;
      }

      // Check if values are programming languages
      if (/programming|coding|scripting/i.test(rawLabel)) {
        skills.languages.push(...rawValues);
        matchedAny = true;
        continue;
      }

      skills.other.push(...rawValues);
      matchedAny = true;
      continue;
    }

    // Unlabelled list
    const values = splitSkillList(clean);
    if (values.length) {
      values.forEach((v) => {
        if (KNOWN_PROGRAMMING_LANGUAGES.has(v.toLowerCase())) {
          skills.languages.push(v);
        } else {
          skills.other.push(v);
        }
      });
      matchedAny = true;
    }
  }

  if (!matchedAny) return skills;

  // De-duplicate each bucket while preserving order
  (Object.keys(skills) as Array<keyof StructuredResume['skills']>).forEach((k) => {
    skills[k] = Array.from(new Set(skills[k] as string[]));
  });
  return skills;
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
    let body = dates.remainder || text;
    const urlMatch = body.match(URL_RE);
    let credentialUrl = '';
    if (urlMatch && /credential|verify|http/i.test(urlMatch[0])) {
      credentialUrl = urlMatch[0];
      body = body.replace(urlMatch[0], '').replace(/\s*[|,]\s*$/, '').trim();
    }
    const segs = splitSegments(body);
    const title = segs[0] || body;
    const issuer = segs.length >= 2 ? segs[1] : '';
    if (title && title.length < 120) {
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
  const fullText = input.plain_text || input.resumeText || input.markdown || '';
  resume.rawText = fullText;

  const blocks = toBlocks(input);
  const { preamble, sections } = groupSections(blocks);

  resume.personalInfo = extractPersonalInfo(preamble, fullText);

  const summarySection = sections.find((s) => s.category === 'summary');

  let idx = 0;
  const customSectionCandidates: Section[] = [];

  for (const sec of sections) {
    const i = idx++;
    switch (sec.category) {
      case 'personal_info': {
        const text = sectionTextLines(sec).join(' | ');
        const p = extractPersonalInfo(sec.blocks, text);
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
        const items = mapStringList(sec);
        if (items.length > 0) {
          resume.customSections.push({
            id: `sec-research-${i}`,
            title: sec.header || 'Research Experience',
            items,
          });
        }
        break;
      }
      case 'teaching_experience': {
        const items = mapStringList(sec);
        if (items.length > 0) {
          resume.customSections.push({
            id: `sec-teaching-${i}`,
            title: sec.header || 'Teaching Experience',
            items,
          });
        }
        break;
      }
      case 'education':
        resume.education.push(...mapEducation(sec, i));
        break;
      case 'projects':
        resume.projects.push(...mapProjects(sec, i));
        break;
      case 'skills': {
        const s = mapSkills(sec);
        (Object.keys(s) as Array<keyof StructuredResume['skills']>).forEach((k) => {
          (resume.skills[k] as string[]).push(...((s[k] as string[]) || []));
        });
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
      case 'achievements':
        resume.achievements.push(...mapStringList(sec));
        break;
      case 'responsibility': {
        const items = mapStringList(sec);
        if (items.length > 0) {
          resume.customSections.push({
            id: `sec-resp-${i}`,
            title: sec.header || 'Positions of Responsibility',
            items,
          });
        }
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
          // Also link to first education entry coursework if empty
          if (resume.education.length > 0 && !resume.education[0].coursework) {
            resume.education[0].coursework = items.join(', ');
          }
        }
        break;
      }
      case 'extracurricular': {
        const items = mapStringList(sec);
        if (items.length > 0) {
          resume.customSections.push({
            id: `sec-extra-${i}`,
            title: sec.header || 'Extra Curricular Activities',
            items,
          });
          resume.hobbies.push(...items);
        }
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

  // Preserve any unrecognized non-empty section as a custom section, EXCEPT if it's canonical info
  customSectionCandidates.forEach((sec, i) => {
    const headerLower = (sec.header || '').toLowerCase();
    if (/\b(?:personal|contact|education|academic|experience|skills|summary|profile|awards|achievements|certifications|publications|patents)\b/i.test(headerLower)) {
      return;
    }
    const items = mapStringList(sec);
    if (!sec.header && items.length === 0) return;
    const isOnlyContact = items.every((it) => EMAIL_RE.test(it) || PHONE_RE.test(it) || LINKEDIN_RE.test(it) || GITHUB_RE.test(it));
    if (isOnlyContact) return;

    if (items.length > 0) {
      resume.customSections.push({
        id: `sec-custom-${i}`,
        title: sec.header || 'Additional Section',
        items,
      });
    }
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
