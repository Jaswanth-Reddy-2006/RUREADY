/**
 * Contact & Personal Information Extractor for RUREADY Resume Engine.
 *
 * Deterministic, evidence-grounded extraction of:
 *  - Candidate Full Name (Docling structural title, layout anchors, email proximity)
 *  - Professional Title / Headline
 *  - Verified Email Address
 *  - Phone Numbers (including Indian formats +91, 10-digit mobile, US/Canada, and International)
 *  - LinkedIn Profile URLs (strictly distinguishing profile handles from company/learning links)
 *  - GitHub Profile URLs (strictly distinguishing candidate profile from repository URLs)
 *  - Portfolio / Personal Website URLs (with strict exclusion of documentation & third-party SaaS)
 *  - Candidate Location (City, State/Country)
 *
 * Hard rules:
 *  - NEVER invent or hallucinate contact values.
 *  - Extract from markdown link targets and plain text.
 *  - Normalize protocols, strip tracking parameters and extraneous punctuation.
 */

export interface ContactExtractionResult {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  discoveredRepoUrls: string[];
}

export interface BlockLike {
  type: string;
  text: string;
  level?: number;
  bbox?: { l?: number; t?: number; r?: number; b?: number };
}

// ── Email Regex ────────────────────────────────────────────────────────────
const STRICT_EMAIL_RE = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;

// ── Indian & International Phone Patterns ──────────────────────────────────
// Indian numbers: +91 9876543210, +91-98765 43210, +919876543210, 09876543210, or 10-digit starting with 6,7,8,9
const INDIAN_PHONE_RE = /(?:\+91[\s-]?)?(?:0)?[6-9]\d{4}[\s-]?\d{5}\b/g;
// US / Canada: (123) 456-7890, 123-456-7890, +1 123 456 7890, 123.456.7890
const US_INTL_PHONE_RE = /(?:\+?1[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
// General International with country code: +44 20 7123 4567, +49 30 123456
const GENERAL_INTL_PHONE_RE = /\+\d{1,4}[\s.-]?(?:\(?\d{1,4}\)?[\s.-]?)?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{2,4}\b/g;

// ── URL & Social Patterns ──────────────────────────────────────────────────
const MARKDOWN_LINK_RE = /\[([^\]]*)\]\((https?:\/\/[^\s\)]+|www\.[^\s\)]+|[a-zA-Z0-9_.\-]+\.[a-zA-Z]{2,}[^\s\)]*)\)/gi;
const RAW_URL_RE = /\b(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)+)(?:\/[^\s,|<>"'\]\)]*)?/gi;

// Documentation / Library / Third-Party Domains to ignore for portfolio
const EXCLUDED_PORTFOLIO_DOMAINS = new Set([
  'github.com',
  'linkedin.com',
  'gitlab.com',
  'bitbucket.org',
  'twitter.com',
  'x.com',
  'facebook.com',
  'instagram.com',
  'medium.com',
  'substack.com',
  'youtube.com',
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'protonmail.com',
  'example.com',
  'reactjs.org',
  'react.dev',
  'nodejs.org',
  'npmjs.com',
  'pypi.org',
  'python.org',
  'fastapi.tiangolo.com',
  'expressjs.com',
  'vuejs.org',
  'angular.io',
  'nextjs.org',
  'tailwindcss.com',
  'docker.com',
  'kubernetes.io',
  'aws.amazon.com',
  'cloud.google.com',
  'azure.microsoft.com',
  'spring.io',
  'postgresql.org',
  'mongodb.com',
  'redis.io',
  'stackoverflow.com',
  'leetcode.com',
  'hackerrank.com',
  'codeforces.com',
  'kaggle.com',
  'w3schools.com',
  'mozilla.org',
  'wikipedia.org',
  'arxiv.org',
  'doi.org',
  'ieeexplore.ieee.org',
]);

const PLACE_PATTERNS = [
  /\b([A-Z][a-zA-Z.\-]+(?:\s+[A-Z][a-zA-Z.\-]+)*(?:,\s*[A-Z]{2}\b|,\s*[A-Z][a-zA-Z.\-]+)+)/,
  /\b(Bangalore|Bengaluru|Hyderabad|Chennai|Mumbai|Pune|Delhi|Noida|Gurgaon|Gurugram|Kolkata|Ahmedabad|San Francisco|Mountain View|Sunnyvale|Palo Alto|San Jose|Seattle|Redmond|Austin|Boston|New York|Chicago|London|Berlin|Toronto|Vancouver|Singapore|Sydney|Remote|Hybrid)\b/i,
];

const NON_NAME_TOKENS = new Set([
  'resume', 'curriculum', 'vitae', 'cv', 'profile', 'summary', 'experience', 'education',
  'skills', 'projects', 'certifications', 'contact', 'email', 'phone', 'address', 'github',
  'linkedin', 'portfolio', 'objective', 'about', 'work', 'history', 'university', 'college',
  'institute', 'technologies', 'engineering', 'school', 'developer', 'software', 'engineer'
]);

export class ContactExtractorService {
  /**
   * Extract complete verified contact details from parsed blocks and text.
   */
  public extract(input: {
    preambleBlocks?: BlockLike[];
    allBlocks?: BlockLike[];
    fullText: string;
    markdownText?: string;
  }): ContactExtractionResult {
    const fullText = input.fullText || '';
    const markdownText = input.markdownText || fullText;
    const preamble = input.preambleBlocks || [];
    const allBlocks = input.allBlocks || [];

    // 1. Extract markdown links to capture actual URLs behind anchor text
    const markdownLinks = this.extractMarkdownLinks(markdownText);

    // 2. Email extraction
    const email = this.extractEmail(fullText, markdownLinks);

    // 3. Phone extraction
    const phone = this.extractPhone(fullText);

    // 4. LinkedIn profile extraction
    const linkedin = this.extractLinkedIn(fullText, markdownLinks);

    // 5. GitHub profile & discovered repo extraction
    const { github, repoUrls } = this.extractGitHub(fullText, markdownLinks);

    // 6. Portfolio / personal site extraction
    const knownUrls = [linkedin, github, ...repoUrls].filter(Boolean);
    const portfolio = this.extractPortfolio(fullText, markdownLinks, knownUrls);

    // 7. Candidate Name extraction
    const fullName = this.extractName(preamble, allBlocks, fullText, email);

    // 8. Candidate Professional Title extraction
    const title = this.extractTitle(preamble, fullName, email, phone);

    // 9. Location extraction
    const location = this.extractLocation(preamble, allBlocks, fullName, title);

    return {
      fullName,
      title,
      email,
      phone,
      location,
      linkedin,
      github,
      portfolio,
      discoveredRepoUrls: repoUrls,
    };
  }

  /**
   * Extract markdown links [text](url) from markdown text.
   */
  public extractMarkdownLinks(markdown: string): Array<{ text: string; url: string }> {
    const links: Array<{ text: string; url: string }> = [];
    if (!markdown) return links;

    let match: RegExpExecArray | null;
    const re = new RegExp(MARKDOWN_LINK_RE.source, 'gi');
    while ((match = re.exec(markdown)) !== null) {
      const text = (match[1] || '').trim();
      let url = (match[2] || '').trim();
      if (url) {
        url = this.normalizeUrl(url);
        links.push({ text, url });
      }
    }
    return links;
  }

  /**
   * Extract verified email address.
   */
  public extractEmail(text: string, markdownLinks: Array<{ text: string; url: string }> = []): string {
    // Check mailto: links in markdown
    for (const link of markdownLinks) {
      if (link.url.toLowerCase().startsWith('mailto:')) {
        const email = link.url.replace(/^mailto:/i, '').trim();
        if (this.isValidEmail(email)) return email.toLowerCase();
      }
    }

    // Check plain text matches
    const matches = text.match(STRICT_EMAIL_RE);
    if (matches && matches.length > 0) {
      for (const m of matches) {
        const clean = m.trim().replace(/[.,;:\s]+$/, '');
        if (this.isValidEmail(clean)) {
          return clean.toLowerCase();
        }
      }
    }
    return '';
  }

  private isValidEmail(email: string): boolean {
    if (!email || email.length < 5 || email.length > 100) return false;
    const lower = email.toLowerCase();
    if (lower === 'yourname@email.com' || lower === 'user@domain.com' || lower === 'email@address.com') return false;
    const parts = lower.split('@');
    if (parts.length !== 2) return false;
    const [user, domain] = parts;
    if (!user || !domain || !domain.includes('.')) return false;
    const tld = domain.split('.').pop();
    if (!tld || tld.length < 2) return false;
    return true;
  }

  /**
   * Extract phone numbers supporting Indian, US/Canada, and International standards.
   */
  public extractPhone(text: string): string {
    if (!text) return '';

    // Search header / top 1500 chars first for highest accuracy
    const headerSlice = text.slice(0, 1500);

    // 1. Try Indian phone number pattern first (+91 or 10-digit starting 6-9)
    const indianMatches = headerSlice.match(INDIAN_PHONE_RE) || text.match(INDIAN_PHONE_RE);
    if (indianMatches && indianMatches.length > 0) {
      for (const raw of indianMatches) {
        const digits = raw.replace(/\D/g, '');
        if (digits.length === 10 || (digits.length === 12 && digits.startsWith('91')) || (digits.length === 11 && digits.startsWith('0'))) {
          // Format cleanly
          return this.formatIndianPhone(raw);
        }
      }
    }

    // 2. Try US / North American pattern
    const usMatches = headerSlice.match(US_INTL_PHONE_RE) || text.match(US_INTL_PHONE_RE);
    if (usMatches && usMatches.length > 0) {
      for (const raw of usMatches) {
        const digits = raw.replace(/\D/g, '');
          // Discard if it looks like a year range e.g. 2018 - 2021
          if (digits.startsWith('20') && raw.includes('-') && digits.length === 10 && (digits.endsWith('20') || digits.endsWith('21') || digits.endsWith('22') || digits.endsWith('23') || digits.endsWith('24') || digits.endsWith('25') || digits.endsWith('26'))) continue;
          return raw.trim().replace(/^[,\s|•]+|[,\s|•]+$/g, '');
      }
    }

    // 3. Try General International pattern
    const intlMatches = headerSlice.match(GENERAL_INTL_PHONE_RE) || text.match(GENERAL_INTL_PHONE_RE);
    if (intlMatches && intlMatches.length > 0) {
      for (const raw of intlMatches) {
        const digits = raw.replace(/\D/g, '');
        if (digits.length >= 8 && digits.length <= 15) {
          return raw.trim().replace(/^[,\s|•]+|[,\s|•]+$/g, '');
        }
      }
    }

    return '';
  }

  private formatIndianPhone(raw: string): string {
    const clean = raw.trim().replace(/^[,\s|•]+|[,\s|•]+$/g, '');
    const digits = clean.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) {
      const mobile = digits.slice(2);
      return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;
    }
    if (digits.length === 11 && digits.startsWith('0')) {
      const mobile = digits.slice(1);
      return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;
    }
    if (digits.length === 10) {
      if (clean.includes('+91')) {
        return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
      }
      return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    return clean;
  }

  /**
   * Extract LinkedIn profile URL, strictly excluding company or search links.
   */
  public extractLinkedIn(
    text: string,
    markdownLinks: Array<{ text: string; url: string }> = []
  ): string {
    // 1. Check markdown links
    for (const link of markdownLinks) {
      const url = link.url.toLowerCase();
      if (url.includes('linkedin.com')) {
        const normalized = this.normalizeLinkedInUrl(link.url);
        if (normalized) return normalized;
      }
    }

    // 2. Check labeled prefixes: "LinkedIn: https://linkedin.com/in/..." or "LinkedIn: username"
    const labelMatch = text.match(/(?:linkedin|linkedin\.com)\s*[:\-]\s*(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com\/(?:in|pub)?\/?)?([a-zA-Z0-9_.\-%]+)/i);
    if (labelMatch && labelMatch[1]) {
      const handle = labelMatch[1].trim().replace(/[/\s)]+$/, '');
      if (handle && !handle.toLowerCase().includes('company') && !handle.toLowerCase().includes('jobs')) {
        return `https://linkedin.com/in/${handle}`;
      }
    }

    // 3. Check plain text URL matches
    const plainMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub)\/([a-zA-Z0-9_.\-%]+)/i);
    if (plainMatch) {
      return this.normalizeLinkedInUrl(plainMatch[0]);
    }

    // 4. Fallback generic linkedin.com/username (if not company)
    const fallbackMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/([a-zA-Z0-9_.\-%]+)/i);
    if (fallbackMatch && fallbackMatch[1]) {
      const segment = fallbackMatch[1].toLowerCase();
      if (!['company', 'school', 'jobs', 'feed', 'learning', 'posts'].includes(segment)) {
        return this.normalizeLinkedInUrl(fallbackMatch[0]);
      }
    }

    return '';
  }

  private normalizeLinkedInUrl(rawUrl: string): string {
    if (!rawUrl) return '';
    let clean = rawUrl.trim().replace(/[)\]'",;]+$/, '');
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    // Remove query params
    clean = clean.split('?')[0].replace(/\/+$/, '');
    
    // Ensure it uses /in/ for individual profiles if not already present
    const inMatch = clean.match(/linkedin\.com\/(?:in|pub)\/([a-zA-Z0-9_.\-%]+)/i);
    if (inMatch) {
      return `https://linkedin.com/in/${inMatch[1]}`;
    }
    const genericMatch = clean.match(/linkedin\.com\/([a-zA-Z0-9_.\-%]+)/i);
    if (genericMatch && !['company', 'school', 'jobs', 'feed'].includes(genericMatch[1].toLowerCase())) {
      return `https://linkedin.com/in/${genericMatch[1]}`;
    }
    return clean;
  }

  /**
   * Extract GitHub profile URL and collect project repository URLs.
   */
  public extractGitHub(
    text: string,
    markdownLinks: Array<{ text: string; url: string }> = []
  ): { github: string; repoUrls: string[] } {
    let githubProfile = '';
    const repoUrls: string[] = [];

    const handleCandidate = (rawUrl: string) => {
      const clean = this.normalizeGitHubUrl(rawUrl);
      if (!clean) return;

      const pathParts = clean.replace(/^https?:\/\/(?:www\.)?github\.com\/?/i, '').split('/').filter(Boolean);
      if (pathParts.length === 1) {
        // Single segment = user/org profile (e.g. github.com/jake)
        if (!githubProfile) githubProfile = clean;
      } else if (pathParts.length >= 2) {
        // Two segments = repository (e.g. github.com/jake/gitlytics)
        if (!repoUrls.includes(clean)) repoUrls.push(clean);
        if (!githubProfile) {
          githubProfile = `https://github.com/${pathParts[0]}`;
        }
      }
    };

    // 1. Check markdown links
    for (const link of markdownLinks) {
      if (link.url.toLowerCase().includes('github.com')) {
        handleCandidate(link.url);
      }
    }

    // 2. Check labeled prefixes: "GitHub: https://github.com/..." or "GitHub: username"
    const labelMatches = text.matchAll(/(?:github|github\.com)\s*[:\-]\s*(?:https?:\/\/)?(?:www\.)?(?:github\.com\/)?([a-zA-Z0-9_.\-%]+(?:\/[a-zA-Z0-9_.\-%]+)?)/gi);
    for (const m of labelMatches) {
      if (m[1]) {
        handleCandidate(`https://github.com/${m[1].trim()}`);
      }
    }

    // 3. Check plain text GitHub URLs
    const plainMatches = text.matchAll(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.\-%]+(?:\/[a-zA-Z0-9_.\-%]+)?)/gi);
    for (const m of plainMatches) {
      handleCandidate(m[0]);
    }

    return {
      github: githubProfile,
      repoUrls,
    };
  }

  private normalizeGitHubUrl(rawUrl: string): string {
    if (!rawUrl) return '';
    let clean = rawUrl.trim().replace(/[)\]'",;]+$/, '');
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    clean = clean.split('?')[0].replace(/\.git$/i, '').replace(/\/+$/, '');
    return clean;
  }

  /**
   * Extract personal website / portfolio URL with strict exclusion of third-party domains.
   */
  public extractPortfolio(
    text: string,
    markdownLinks: Array<{ text: string; url: string }> = [],
    knownUrls: string[] = []
  ): string {
    const knownSet = new Set(knownUrls.map((u) => u.toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '')));

    // 1. Check explicit labeled markdown links in header/contact area
    for (const link of markdownLinks) {
      const lowerText = link.text.toLowerCase();
      const lowerUrl = link.url.toLowerCase();
      if (/portfolio|website|homepage|personal\s+site|my\s+site/i.test(lowerText)) {
        if (!this.isExcludedDomain(lowerUrl)) {
          return link.url;
        }
      }
    }

    // 2. Check labeled plain text: "Portfolio: https://..." or "Website: ..."
    const labelMatch = text.match(/(?:portfolio|website|site|homepage|web)\s*[:\-]\s*(?:https?:\/\/)?([a-zA-Z0-9_.\-]+\.[a-zA-Z]{2,}(?:\/[^\s,|]*)?)/i);
    if (labelMatch && labelMatch[1]) {
      const candidate = this.normalizeUrl(labelMatch[1]);
      if (!this.isExcludedDomain(candidate)) {
        return candidate;
      }
    }

    // 3. Check for developer portfolios on personal subdomains (username.github.io, *.vercel.app, *.dev, *.tech)
    const subdomainMatch = text.match(/\b([a-zA-Z0-9\-]{3,}\.(?:github\.io|vercel\.app|netlify\.app|pages\.dev|me|dev|tech))\b/i);
    if (subdomainMatch && subdomainMatch[1]) {
      const matchedDomain = subdomainMatch[1].trim();
      if (!/^(?:b|m)\.tech$/i.test(matchedDomain)) {
        const candidate = this.normalizeUrl(matchedDomain);
        if (!this.isExcludedDomain(candidate)) {
          return candidate;
        }
      }
    }

    // 4. Scan markdown links for general valid URLs
    for (const link of markdownLinks) {
      const clean = this.normalizeUrl(link.url);
      const host = clean.toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
      if (!this.isExcludedDomain(clean) && !knownSet.has(host) && !/@/.test(clean)) {
        return clean;
      }
    }

    return '';
  }

  private isExcludedDomain(url: string): boolean {
    if (!url) return true;
    const lower = url.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
    const domain = lower.split('/')[0];
    if (EXCLUDED_PORTFOLIO_DOMAINS.has(domain)) return true;
    for (const excluded of EXCLUDED_PORTFOLIO_DOMAINS) {
      if (domain.endsWith(`.${excluded}`)) return true;
    }
    return false;
  }

  /**
   * Extract candidate full name from Docling structural elements, layout positions, and email proximity.
   */
  public extractName(
    preamble: BlockLike[],
    allBlocks: BlockLike[],
    fullText: string,
    email?: string
  ): string {
    // Strategy 1: Title element in preamble tagged by Docling
    const titleBlock = preamble.find(
      (b) => (b.type === 'title' || b.type === 'section_header') && b.text && this.looksLikeValidName(b.text)
    );
    if (titleBlock) {
      const name = this.cleanNameString(titleBlock.text);
      if (name) return name;
    }

    // Strategy 2: Block immediately preceding the email address
    if (email) {
      const allLines = fullText.split('\n').map((l) => l.trim()).filter(Boolean);
      const emailLineIdx = allLines.findIndex((l) => l.toLowerCase().includes(email.toLowerCase()));
      if (emailLineIdx !== -1) {
        if (emailLineIdx > 0 && this.looksLikeValidName(allLines[emailLineIdx - 1])) {
          const name = this.cleanNameString(allLines[emailLineIdx - 1]);
          if (name) return name;
        }
        // Name on the same line as email (e.g. "Jake Ryan | 123-456-7890 | jake@su.edu")
        const sameLineSegments = allLines[emailLineIdx].split(/[|•–—\t]/).map((s) => s.trim());
        if (sameLineSegments.length > 1 && this.looksLikeValidName(sameLineSegments[0])) {
          const name = this.cleanNameString(sameLineSegments[0]);
          if (name) return name;
        }
      }
    }

    // Strategy 3: Preamble top text blocks
    for (const block of preamble.slice(0, 6)) {
      const text = block.text || '';
      if (this.looksLikeValidName(text)) {
        const name = this.cleanNameString(text);
        if (name) return name;
      }
      const segments = text.split(/[|•–—\n]/).map((s) => s.trim());
      if (segments.length > 1 && this.looksLikeValidName(segments[0])) {
        const name = this.cleanNameString(segments[0]);
        if (name) return name;
      }
    }

    // Strategy 4: Top lines of full text
    const topLines = fullText.split('\n').slice(0, 10).map((l) => l.trim()).filter(Boolean);
    for (const line of topLines) {
      if (this.looksLikeValidName(line)) {
        const name = this.cleanNameString(line);
        if (name) return name;
      }
    }

    return '';
  }

  private looksLikeValidName(text: string): boolean {
    if (!text) return false;
    const clean = text.replace(/^[#*_\s]+|[#*_\s]+$/g, '').trim();
    if (!clean || clean.length < 2 || clean.length > 50) return false;

    // Must not contain email, phone, or URLs
    if (STRICT_EMAIL_RE.test(clean) || INDIAN_PHONE_RE.test(clean) || RAW_URL_RE.test(clean)) return false;
    if (clean.includes('@') || clean.includes('http') || clean.includes('www.')) return false;

    // Must not be numbers, dates, or bullet points
    if (/^\d/.test(clean) || /\b(?:19|20)\d{2}\b/.test(clean)) return false;
    if (/^[•‣·◦▪●*+\-–—]/.test(clean)) return false;

    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length < 1 || words.length > 5) return false;

    // Check against non-name vocabulary
    for (const w of words) {
      if (NON_NAME_TOKENS.has(w.toLowerCase().replace(/[^a-z]/g, ''))) return false;
    }

    // Must contain letters
    if (!/[a-zA-Z]/.test(clean)) return false;

    return true;
  }

  private cleanNameString(text: string): string {
    let clean = text.replace(/^[#*_\s]+|[#*_\s]+$/g, '').trim();
    // Strip trailing pipes or delimiters
    clean = clean.split(/[|•–—\t\n]/)[0].trim();
    clean = clean.replace(/^(?:name\s*[:\-]|candidate\s*[:\-])\s*/i, '').trim();
    return clean;
  }

  /**
   * Extract candidate professional title or headline from preamble.
   */
  public extractTitle(
    preamble: BlockLike[],
    fullName?: string,
    email?: string,
    phone?: string
  ): string {
    const titleRegex = /\b(?:software\s+(?:engineer|developer)|full\s*stack|frontend|backend|data\s+(?:scientist|analyst|engineer)|machine\s+learning|ai\s+engineer|devops\s+engineer|cloud\s+architect|product\s+manager|ui\s*\/\s*ux\s+designer|system\s+architect|research\s+assistant)\b/i;

    for (const block of preamble.slice(0, 8)) {
      const clean = block.text.replace(/^[#*_\s]+|[#*_\s]+$/g, '').trim();
      if (!clean || clean === fullName) continue;
      if (email && clean.includes(email)) continue;
      if (phone && clean.includes(phone)) continue;

      const words = clean.split(/\s+/).filter(Boolean);
      if (words.length <= 6 && titleRegex.test(clean)) {
        return clean.split(/[|•–—]/)[0].trim();
      }
    }
    return '';
  }

  /**
   * Extract candidate location from preamble.
   */
  public extractLocation(
    preamble: BlockLike[],
    allBlocks: BlockLike[],
    fullName?: string,
    title?: string
  ): string {
    // Inspect preamble lines first
    for (const block of preamble.slice(0, 12)) {
      const clean = block.text.replace(/^[#*_\s]+|[#*_\s]+$/g, '').trim();
      if (!clean || clean === fullName || clean === title) continue;

      const segments = clean.split(/[|•–—\t\n]/).map((s) => s.trim()).filter(Boolean);
      for (const seg of segments) {
        if (STRICT_EMAIL_RE.test(seg) || RAW_URL_RE.test(seg) || INDIAN_PHONE_RE.test(seg) || US_INTL_PHONE_RE.test(seg)) continue;
        if (/github|linkedin|portfolio|http/i.test(seg)) continue;

        for (const re of PLACE_PATTERNS) {
          const match = seg.match(re);
          if (match && seg.length <= 60 && !/\d{5,}/.test(seg)) {
            return seg.replace(/^Location\s*[:\-]\s*/i, '').trim();
          }
        }
      }
    }
    return '';
  }

  private normalizeUrl(url: string): string {
    let clean = url.trim().replace(/[)\]'",;]+$/, '');
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    return clean;
  }
}

export const contactExtractorService = new ContactExtractorService();
