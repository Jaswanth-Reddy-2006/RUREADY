// ═══════════════════════════════════════════════════════════════
// R U Ready? — Canonical Single-Pipeline Resume Parser
// Unified architecture:
// PDF -> PDF Extractor -> rawText ──┐
//                                  ├──> SAME RESUME NORMALIZER -> Canonical Resume JSON -> Builder / ATS
// DOCX -> DOCX Extractor -> rawText ┘
// ═══════════════════════════════════════════════════════════════

import mammoth from 'mammoth';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import apiClient from '../api/client';
import {
  ResumeData,
  normalizeResumeData,
  ALL_TAXONOMY_SKILLS,
  extractSkillsFromText,
  detectResumeDomain
} from './atsEngine';

export { normalizeResumeData };

// Initialize PDF.js worker
if (typeof window !== 'undefined' && pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch {
    // fallback
  }
}

/**
 * Validates whether the extracted text contains suspicious raw PDF internal object structure
 */
export function isCorruptedPdfSyntax(text: string): boolean {
  if (!text || typeof text !== 'string') return true;

  const suspiciousPatterns = [
    /\/Parent\s+\d+\s+\d+\s+R/i,
    /\/Dest\s+\d+\s+\d+\s+R/i,
    /\/XYZ\s+[\d.-]+/i,
    /\/Type\s*\/(?:Catalog|Pages|Page|Font|ObjStm|XObject)/i,
    /\/MediaBox\s*\[/i,
    /\/Resources\s*<</i,
    /\bendobj\b/i,
    /\bstartxref\b/i,
    /\/Prev\s+\d+\s+\d+\s+R/i,
    /\/Next\s+\d+\s+\d+\s+R/i
  ];

  let matches = 0;
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(text)) {
      matches++;
    }
  }

  return matches >= 2;
}

/**
 * Helper to strip XML tags and clean decoded text
 */
function extractXmlTextContent(xml: string): string {
  const withBreaks = xml
    .replace(/<\/w:p>/gi, '\n')
    .replace(/<\/w:tr>/gi, '\n')
    .replace(/<\/w:tc>/gi, ' | ')
    .replace(/<w:tab\/>/gi, ' ')
    .replace(/<w:br[^>]*\/>/gi, '\n');

  return withBreaks
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n');
}

/**
 * High-Fidelity DOCX Text Extractor:
 * 1. Uses Mammoth for structured body paragraphs and tables
 * 2. Uses JSZip to inspect OpenXML package for headers, footers, textboxes, and hyperlinked URLs
 * 3. Preserves 100% of candidate details without dropping tables, contact headers, or links
 */
export async function extractTextFromDocxArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  const parts: string[] = [];
  const urls: string[] = [];

  // 1. Primary extraction with Mammoth
  try {
    const nodeBuffer = typeof Buffer !== 'undefined' ? Buffer.from(arrayBuffer) : undefined;
    const result = await mammoth.extractRawText({ arrayBuffer, buffer: nodeBuffer } as any);
    if (result.value && result.value.trim().length > 0) {
      parts.push(result.value.trim());
    }
  } catch (err) {
    console.warn('[ResumeParser] Mammoth primary extraction notice:', err);
  }

  // 2. OpenXML deep inspection via JSZip (captures headers, footers, drawing textboxes, and hyperlink URLs)
  try {
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Relationship URLs (e.g. LinkedIn, GitHub, Portfolio targets)
    const relsFile = zip.file('word/_rels/document.xml.rels');
    if (relsFile) {
      const relsXml = await relsFile.async('text');
      const targetMatches = relsXml.matchAll(/Target="(https?:\/\/[^"]+)"/g);
      for (const match of targetMatches) {
        if (match[1] && !urls.includes(match[1])) {
          urls.push(match[1]);
        }
      }
    }

    // Document Headers (where contact info & name are frequently stored in Word resumes)
    const headerFiles = zip.file(/^word\/header\d+\.xml$/);
    for (const hFile of headerFiles) {
      const hXml = await hFile.async('text');
      const hText = extractXmlTextContent(hXml);
      if (hText && !parts.some((p) => p.includes(hText))) {
        parts.unshift(hText);
      }
    }

    // Floating Text Boxes & DrawingML shapes
    const docFile = zip.file('word/document.xml');
    if (docFile) {
      const docXml = await docFile.async('text');
      const txbxMatches = docXml.matchAll(/<w:txbxContent>([\s\S]*?)<\/w:txbxContent>/g);
      for (const txbx of txbxMatches) {
        const boxText = extractXmlTextContent(txbx[1]);
        if (boxText && !parts.some((p) => p.includes(boxText))) {
          parts.push(boxText);
        }
      }
    }

    // Footers
    const footerFiles = zip.file(/^word\/footer\d+\.xml$/);
    for (const fFile of footerFiles) {
      const fXml = await fFile.async('text');
      const fText = extractXmlTextContent(fXml);
      if (fText && !parts.some((p) => p.includes(fText))) {
        parts.push(fText);
      }
    }
  } catch (zipErr) {
    console.warn('[ResumeParser] OpenXML deep inspection notice:', zipErr);
  }

  const combined = parts.join('\n\n');
  const missingUrls = urls.filter((u) => !combined.includes(u));
  if (missingUrls.length > 0) {
    return (combined + '\n\n' + missingUrls.join(' | ')).trim();
  }

  return combined.trim();
}

/**
 * High-Fidelity PDF Text Extractor:
 * Uses PDF.js to extract textContent items and accurately cluster them into logical lines by (X, Y) coordinates.
 */
export async function extractTextFromPdfArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      isEvalSupported: false,
    });

    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY: number | null = null;
      const pageLines: string[] = [];
      let currentLine = '';

      for (const item of textContent.items) {
        if ('str' in item) {
          const str = item.str;
          if (!str && str !== ' ') continue;

          const currentY = item.transform ? item.transform[5] : null;

          if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 4) {
            if (currentLine.trim()) {
              pageLines.push(currentLine.trim());
            }
            currentLine = str;
          } else {
            if (currentLine.length > 0 && !currentLine.endsWith(' ') && !str.startsWith(' ') && !item.hasEOL) {
              currentLine += ' ' + str;
            } else {
              currentLine += str;
            }
          }

          if (item.hasEOL) {
            if (currentLine.trim()) {
              pageLines.push(currentLine.trim());
            }
            currentLine = '';
            lastY = null;
          } else {
            lastY = currentY;
          }
        }
      }

      if (currentLine.trim()) {
        pageLines.push(currentLine.trim());
      }

      const pageCombined = pageLines.join('\n');
      if (pageCombined.trim()) {
        pageTexts.push(pageCombined.trim());
      }
    }

    const fullExtracted = pageTexts.join('\n\n');

    if (isCorruptedPdfSyntax(fullExtracted)) {
      throw new Error('Corrupted PDF internal syntax detected.');
    }

    if (!fullExtracted || fullExtracted.trim().length < 15) {
      throw new Error('PDF contains no readable text content (it may be scanned/an image).');
    }

    return fullExtracted.trim();
  } catch (err: any) {
    console.error('[ResumeParser] PDF.js extraction error:', err);
    throw new Error(
      err?.message?.includes('password')
        ? 'This PDF is password-protected. Please upload an unlocked PDF.'
        : 'Unable to extract text from this PDF. Please upload a text-based PDF or DOCX file.'
    );
  }
}

/**
 * Attempts to extract text using the dedicated Docling backend parser.
 */
async function extractTextViaDoclingBackend(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/ats/extract', formData, {
      timeout: 60000,
    });
    if (res.data?.success && res.data?.data) {
      const { resumeText, plain_text, markdown } = res.data.data;
      return resumeText || plain_text || markdown || null;
    }
  } catch (err: any) {
    if (
      err.response?.data?.errorType === 'UnsupportedFormatError' ||
      err.response?.data?.error?.includes('.doc')
    ) {
      throw new Error(
        err.response?.data?.error ||
        'Legacy Microsoft Word format (.doc) is not supported by Docling. Please save or export your document as .docx or .pdf and upload again.'
      );
    }
    console.warn('[ResumeParser] Docling backend extraction notice:', err?.response?.data?.error || err.message);
  }
  return null;
}

/**
 * Universal File Reader: Converts any PDF, DOCX, DOC, TXT, or MD into clean rawText using Docling
 */
export async function readFileToPlainText(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()?.toLowerCase();

  if (fileExt === 'doc') {
    throw new Error(
      'Legacy Microsoft Word format (.doc) is not supported by Docling. Please save or export your document as .docx or .pdf and upload again.'
    );
  }

  // 1. Primary: Extract directly via backend Docling engine for PDF and DOCX
  if (fileExt === 'pdf' || fileExt === 'docx') {
    try {
      const doclingText = await extractTextViaDoclingBackend(file);
      if (doclingText && doclingText.trim().length > 0) {
        return doclingText.trim();
      }
    } catch (err: any) {
      if (err.message?.includes('.doc') || err.message?.includes('Legacy Microsoft Word') || err.message?.includes('Unsupported')) {
        throw err;
      }
      console.warn('[ResumeParser] Docling backend extraction fallback triggered:', err);
    }
  }

  // 2. DOCX Fallback
  if (fileExt === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    return extractTextFromDocxArrayBuffer(arrayBuffer);
  }

  // 3. PDF Fallback
  if (fileExt === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    return extractTextFromPdfArrayBuffer(arrayBuffer);
  }

  // 4. TXT / Markdown / Plain text files
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = (reader.result as string) || '';
      if (isCorruptedPdfSyntax(content)) {
        reject(new Error('Corrupted document content detected.'));
      } else {
        resolve(content.trim());
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Universal resume parser entry point:
 * PDF/DOCX/TXT -> rawText -> parseRawResumeToData -> normalizeResumeData
 */
export async function parseResumeFile(file: File): Promise<ResumeData> {
  const rawText = await readFileToPlainText(file);
  const parsed = parseRawResumeToData(rawText);
  return normalizeResumeData(parsed);
}

/**
 * Intelligent pattern-matching parser that converts raw resume text into structured ResumeData across all career domains
 */
export function parseRawResumeToData(rawText: string): Partial<ResumeData> {
  if (!rawText || typeof rawText !== 'string') {
    return normalizeResumeData({});
  }

  // Sanity check: prevent raw PDF binary dumps from entering resume fields
  if (isCorruptedPdfSyntax(rawText)) {
    throw new Error('Corrupted PDF syntax detected. Please upload a standard text-based PDF or DOCX.');
  }

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const cleanFull = rawText.replace(/\r/g, '');

  // 1. Email extraction
  const emailMatch = cleanFull.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // 2. Phone extraction (international support e.g. +91 8008154808, +1 (555) 234-5678, (555) 987-6543, 8008154808)
  const phoneMatch = cleanFull.match(/(?:\+?\d{1,4}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}(?:[-.\s]?\d{1,4})?/);
  const phone = phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 7 ? phoneMatch[0].trim() : '';

  // 3. URLs
  const linkedinMatch = cleanFull.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_.-]+)/i);
  let linkedin = '';
  if (linkedinMatch) {
    linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;
  }

  const githubMatch = cleanFull.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)/i);
  let github = '';
  if (githubMatch) {
    github = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;
  }

  let portfolio = '';
  const portfolioMatch = cleanFull.match(/(?:https?:\/\/)?(?:www\.)?(?!github\.com|linkedin\.com|gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)([a-zA-Z0-9.-]+\.(?:com|org|net|io|dev|app|me|tech|design|site|co|in|edu))(?:\/[^\s\n|]*)?/i);
  if (portfolioMatch) {
    portfolio = portfolioMatch[0].startsWith('http') ? portfolioMatch[0] : `https://${portfolioMatch[0]}`;
  }

  // 4. Candidate Name: First 1-6 lines that look like a person's name
  let fullName = '';
  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i].trim();
    if (
      line.length >= 3 &&
      line.length <= 45 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('.com') &&
      !line.includes('.org') &&
      !line.includes('.in') &&
      !line.includes('/') &&
      !line.includes('|') &&
      !/^(?:resume|curriculum\s+vitae|cv|contact|page|phone|email|portfolio|designer|engineer|developer|specialist|summary|education|skills|experience|projects)/i.test(line) &&
      /^[A-Za-z.'-]+(?:\s+[A-Za-z.'-]+)+$/.test(line)
    ) {
      fullName = line;
      break;
    }
  }

  // Fallback candidate name from first clean line if not matched
  if (!fullName && lines.length > 0) {
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const candidate = lines[i].trim();
      if (
        candidate.length >= 3 &&
        candidate.length <= 40 &&
        !candidate.includes('@') &&
        !candidate.includes('http') &&
        !candidate.includes('.com') &&
        !candidate.includes('|') &&
        !/^(?:resume|curriculum|cv|summary|skills|education|experience)/i.test(candidate)
      ) {
        fullName = candidate;
        break;
      }
    }
  }

  // 5. Professional Title Detection from header lines (do NOT invent dummy fallback)
  let title = '';
  const titleRegex = /^(?:Senior|Junior|Lead|Principal|Staff|Associate|Chief)?\s*(?:Software|Frontend|Backend|Full\s*Stack|DevOps|Cloud|Data|ML|AI|Cybersecurity|Security|UI\/UX|Product|Web|Mobile|iOS|Android|System|Quality|QA|QA\/QC)?\s*(?:Engineer|Developer|Designer|Architect|Manager|Specialist|Analyst|Scientist|Consultant|Researcher|Administrator|Officer|Coordinator|Lead|Intern)\b/i;

  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const line = lines[i].trim();
    if (
      titleRegex.test(line) &&
      line !== fullName &&
      line.length < 60 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('|') &&
      !/^(?:education|experience|skills|summary|projects)/i.test(line)
    ) {
      title = line;
      break;
    }
  }

  // 6. Location (e.g. Hyderabad, Telangana, India | San Francisco, CA | Seattle, WA | Bangalore, Karnataka)
  let location = '';
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const line = lines[i].trim();
    if (line === fullName || line === title || /^(?:education|experience|skills|summary|projects)/i.test(line)) continue;

    // Check if line contains pipe/separator with location
    const parts = line.split(/[|•–—]/).map((p) => p.trim());
    for (const part of parts) {
      if (
        !part.includes('@') &&
        !part.includes('http') &&
        !part.includes('.com') &&
        !part.includes('.in') &&
        !/university|college|institute|school|technologies|solutions/i.test(part) &&
        !/^(?:phone|email|portfolio|github|linkedin)/i.test(part) &&
        /\b(?:[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*,\s*[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*(?:,\s*[A-Z][a-zA-Z]+)?|Remote|Hybrid|On-site)\b/i.test(part)
      ) {
        location = part;
        break;
      }
    }
    if (location) break;
  }

  // 7. Multi-Domain Skills Extraction (Preserving multi-word skills)
  const extractedSkills = {
    languages: [] as string[],
    frameworks: [] as string[],
    databases: [] as string[],
    cloudDevOps: [] as string[],
    tools: [] as string[],
  };

  const recognizedSkills = extractSkillsFromText(cleanFull);

  recognizedSkills.forEach((sk) => {
    if (sk.category === 'languages' && !extractedSkills.languages.includes(sk.name)) {
      extractedSkills.languages.push(sk.name);
    } else if (sk.category === 'frameworks' && !extractedSkills.frameworks.includes(sk.name)) {
      extractedSkills.frameworks.push(sk.name);
    } else if (sk.category === 'databases' && !extractedSkills.databases.includes(sk.name)) {
      extractedSkills.databases.push(sk.name);
    } else if (sk.category === 'cloudDevOps' && !extractedSkills.cloudDevOps.includes(sk.name)) {
      extractedSkills.cloudDevOps.push(sk.name);
    } else if (sk.category === 'tools' && !extractedSkills.tools.includes(sk.name)) {
      extractedSkills.tools.push(sk.name);
    }
  });

function extractSectionContent(text: string, headerRegex: RegExp): string {
  const match = text.match(headerRegex);
  if (!match || match.index === undefined) return '';

  const startIdx = match.index + match[0].length;
  const remaining = text.slice(startIdx);

  const nextHeaderRegex = /(?:^|\n)\s*(?:EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT HISTORY|EMPLOYMENT|WORK HISTORY|CAREER HISTORY|EDUCATION|ACADEMIC BACKGROUND|ACADEMIC QUALIFICATIONS|SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|AREAS OF EXPERTISE|PROJECTS|KEY PROJECTS|CASE STUDIES|SELECTED WORK|PORTFOLIO|CERTIFICATIONS|CERTIFICATES|AWARDS)\b/i;

  const nextMatch = remaining.match(nextHeaderRegex);
  if (nextMatch && nextMatch.index !== undefined) {
    return remaining.slice(0, nextMatch.index).trim();
  }
  return remaining.trim();
}

  // 8. Summary / Profile / Objective Extraction
  let summary = '';
  const summaryBody = extractSectionContent(cleanFull, /(?:^|\n)\s*(?:SUMMARY|PROFESSIONAL SUMMARY|EXECUTIVE SUMMARY|ABOUT ME|ABOUT|PROFILE|OBJECTIVE|CAREER PROFILE|STATEMENT)[^\n]*\n/i);
  if (summaryBody) {
    summary = summaryBody.slice(0, 500);
  }

  // 9. Education Extraction
  const education: ResumeData['education'] = [];
  const eduBody = extractSectionContent(cleanFull, /(?:^|\n)\s*(?:EDUCATION|ACADEMIC BACKGROUND|ACADEMIC QUALIFICATIONS|EDUCATION & CREDENTIALS|ACADEMIC HISTORY)[^\n]*\n/i);
  if (eduBody) {
    const eduLines = eduBody
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    let currentEdu: any = null;
    eduLines.forEach((line) => {
      const isDegreeLine = /bachelor|master|b\.tech|btech|m\.tech|mtech|b\.s\.|m\.s\.|b\.e\.|m\.e\.|b\.sc|m\.sc|b\.des|m\.des|bba|mba|phd|diploma|intermediate|higher secondary|high school|matriculation|associate\s+degree/i.test(line);
      const isSchoolLine = /university|college|institute|school|academy|vidyapeeth|polytechnic|campus/i.test(line);
      const isYearLine = /\b(19\d\d|20\d\d)\b/.test(line);

      const shouldStartNew = !currentEdu || (
        (isDegreeLine || isSchoolLine) &&
        (
          (currentEdu.school && isSchoolLine) ||
          (currentEdu.degree && isDegreeLine) ||
          (currentEdu.endDate || currentEdu.gpa)
        )
      );

      if (shouldStartNew) {
        if (currentEdu && (currentEdu.school || currentEdu.degree)) {
          education.push(currentEdu);
        }

        let schoolName = isSchoolLine ? line : '';
        let schoolLoc = '';
        if (schoolName.includes(',')) {
          const parts = schoolName.split(',').map((p) => p.trim());
          schoolName = parts[0];
          schoolLoc = parts.slice(1).join(', ');
        }

        currentEdu = {
          id: `edu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          school: schoolName,
          degree: isDegreeLine ? line : '',
          location: schoolLoc,
          startDate: '',
          endDate: '',
          gpa: ''
        };
      } else {
        if (isSchoolLine && !currentEdu.school) {
          let schoolName = line;
          let schoolLoc = '';
          if (schoolName.includes(',')) {
            const parts = schoolName.split(',').map((p) => p.trim());
            schoolName = parts[0];
            schoolLoc = parts.slice(1).join(', ');
          }
          currentEdu.school = schoolName;
          if (schoolLoc && !currentEdu.location) currentEdu.location = schoolLoc;
        } else if (isDegreeLine && !currentEdu.degree) {
          currentEdu.degree = line;
        }
      }

      if (currentEdu) {
        // Extract GPA / CGPA / Percentage
        const gpaMatch = line.match(/\b(?:GPA|CGPA|Score|Percentage)?\s*:?\s*(\d+(?:\.\d+)?\s*(?:\/\s*10|\/\s*4\.0|\/\s*4|%)?)/i);
        if (gpaMatch && gpaMatch[1] && !currentEdu.gpa) {
          const val = gpaMatch[0].trim();
          if (/\d/.test(val) && !/\b(19\d\d|20\d\d)\b/.test(val)) {
            currentEdu.gpa = val;
          }
        }

        // Extract Dates (e.g. 2024 - 2028 Expected, 2020 - 2024, 2028 Expected, 2024)
        if (isYearLine) {
          const years = line.match(/\b(19\d\d|20\d\d)\b/g);
          if (years && years.length >= 2) {
            currentEdu.startDate = years[0];
            currentEdu.endDate = /expected/i.test(line) ? `${years[1]} Expected` : years[1];
          } else if (years && years.length === 1) {
            currentEdu.endDate = /expected/i.test(line) ? `${years[0]} Expected` : years[0];
          }
        }
      }
    });

    if (currentEdu && (currentEdu.school || currentEdu.degree)) {
      education.push(currentEdu);
    }
  }

  // 10. Experience Extraction across all disciplines
  const experience: ResumeData['experience'] = [];
  const expBody = extractSectionContent(cleanFull, /(?:^|\n)\s*(?:EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT HISTORY|EMPLOYMENT|WORK HISTORY|CAREER HISTORY)[^\n]*\n/i);
  if (expBody) {
    const expLines = expBody
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    let currentExp: any = null;
    expLines.forEach((line) => {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\.\s+/.test(line);
      const isDateLine = /\b(19\d\d|20\d\d|present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(line);

      // Check if line is a metadata line for current experience (company | dates)
      if (!isBullet && currentExp && isDateLine && (line.includes('|') || line.includes('-') || line.includes('–') || line.includes(','))) {
        const parts = line.split(/[|–—]|\s+-\s+/).map((p) => p.trim());
        if (parts.length >= 2) {
          currentExp.company = parts[0] || currentExp.company;
          const datePart = parts[1] || '';
          const years = datePart.match(/\b(19\d\d|20\d\d|Present)\b/gi);
          if (years && years.length >= 2) {
            currentExp.startDate = years[0];
            currentExp.endDate = years[1];
            currentExp.current = /present/i.test(years[1]);
          } else if (years) {
            currentExp.endDate = years[0];
          }
        }
        return;
      }

      const isRoleTitle = !isBullet && !isDateLine && (
        /designer|engineer|developer|lead|architect|intern|manager|analyst|scientist|director|researcher|consultant|specialist|strategist|coordinator|officer|associate|executive|recruiter|writer|accountant|technician|representative|instructor|educator|practitioner|auditor|administrator/i.test(line) ||
        line.includes(' at ') || line.includes(' @ ')
      );

      if (isRoleTitle && line.length < 80) {
        if (currentExp) experience.push(currentExp);
        let titlePart = line;
        let companyPart = '';

        if (line.includes(' at ')) {
          const atParts = line.split(' at ');
          titlePart = atParts[0].trim();
          companyPart = atParts[1].trim();
        } else if (line.includes(' @ ')) {
          const atParts = line.split(' @ ');
          titlePart = atParts[0].trim();
          companyPart = atParts[1].trim();
        }

        currentExp = {
          id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: titlePart,
          company: companyPart,
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          bullets: []
        };
      } else if (currentExp) {
        const cleanBullet = line.replace(/^[•\-*]\s*|^\d+\.\s*/, '').trim();
        if (cleanBullet.length > 12) {
          currentExp.bullets.push(cleanBullet);
        }
      }
    });
    if (currentExp) experience.push(currentExp);
  }

  // 11. Projects, Portfolio & Case Studies Extraction
  const projects: ResumeData['projects'] = [];
  const projBody = extractSectionContent(cleanFull, /(?:^|\n)\s*(?:PROJECTS|TECHNICAL PROJECTS|KEY PROJECTS|CASE STUDIES|SELECTED WORK|PORTFOLIO|FEATURED PROJECTS|DESIGN WORK|RECENT WORK)[^\n]*\n/i);
  if (projBody) {
    const projLines = projBody
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    let currentProj: any = null;
    projLines.forEach((line) => {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\.\s+/.test(line);
      const isDateLine = /^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})\b/i.test(line);
      const isProjectTitle = !isBullet && !isDateLine && line.length < 90 && (!line.endsWith('.') || line.includes('|') || line.includes(' - '));

      if (isProjectTitle && (!currentProj || currentProj.bullets.length > 0 || !currentProj.name)) {
        if (currentProj && currentProj.name) projects.push(currentProj);

        let projName = line;
        const techStack: string[] = [];
        if (line.includes('|')) {
          const parts = line.split('|').map((p) => p.trim());
          projName = parts[0];
          parts.slice(1).forEach((p) => {
            p.split(/[,/]/).forEach((t) => {
              if (t.trim()) techStack.push(t.trim());
            });
          });
        }

        currentProj = {
          id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: projName,
          description: '',
          techStack,
          bullets: []
        };
      } else if (currentProj) {
        const cleanBullet = line.replace(/^[•\-*]\s*|^\d+\.\s*/, '').trim();
        if (cleanBullet.length > 12) {
          currentProj.bullets.push(cleanBullet);
        }
      }
    });
    if (currentProj && currentProj.name) projects.push(currentProj);
  }

  // 12. Certifications & Credentials Extraction
  const certifications: ResumeData['certifications'] = [];
  const certBody = extractSectionContent(cleanFull, /(?:^|\n)\s*(?:CERTIFICATIONS|CERTIFICATES|LICENSES|CREDENTIALS|AWARDS|ACCREDITATIONS|HONORS)[^\n]*\n/i);
  if (certBody) {
    const certLines = certBody
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    certLines.forEach((line) => {
      const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
      if (cleanLine.length > 3 && cleanLine.length < 100) {
        const yearMatch = cleanLine.match(/\b(19\d\d|20\d\d)\b/);
        const certDate = yearMatch ? yearMatch[0] : '';
        let titlePart = cleanLine;
        let issuerPart = '';

        if (cleanLine.includes(' - ')) {
          const parts = cleanLine.split(' - ').map((p) => p.trim());
          titlePart = parts[0];
          issuerPart = parts[1];
        } else if (cleanLine.includes(' | ')) {
          const parts = cleanLine.split(' | ').map((p) => p.trim());
          titlePart = parts[0];
          issuerPart = parts[1];
        }

        certifications.push({
          id: `cert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: titlePart,
          issuer: issuerPart,
          date: certDate,
          credentialUrl: ''
        });
      }
    });
  }

  // 13. Auxiliary sections (Achievements, Languages, Hobbies)
  const achievements: string[] = [];
  const achBody = extractSectionContent(cleanFull, /(?:^|\n)\s*(?:ACHIEVEMENTS|KEY ACHIEVEMENTS|HONORS|ACCOMPLISHMENTS)[^\n]*\n/i);
  if (achBody) {
    achBody.split('\n').map((l) => l.trim()).filter(Boolean).forEach((line) => {
      const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
      if (cleanLine.length > 5) achievements.push(cleanLine);
    });
  }

  const languages: string[] = [];
  const langBody = extractSectionContent(cleanFull, /(?:^|\n)\s*(?:LANGUAGES|LANGUAGE PROFICIENCY)[^\n]*\n/i);
  if (langBody) {
    langBody.split(/[,\n|•]/).map((l) => l.trim()).filter(Boolean).forEach((lang) => {
      if (lang.length > 2 && lang.length < 30) languages.push(lang);
    });
  }

  const hobbies: string[] = [];
  const hobBody = extractSectionContent(cleanFull, /(?:^|\n)\s*(?:HOBBIES|INTERESTS|ACTIVITIES)[^\n]*\n/i);
  if (hobBody) {
    hobBody.split(/[,\n|•]/).map((l) => l.trim()).filter(Boolean).forEach((hob) => {
      if (hob.length > 2 && hob.length < 40) hobbies.push(hob);
    });
  }

  return normalizeResumeData({
    rawText,
    personalInfo: {
      fullName: fullName || '',
      title: title || '',
      email: email || '',
      phone: phone || '',
      location: location || '',
      linkedin: linkedin || '',
      github: github || '',
      portfolio: portfolio || ''
    },
    summary: summary || '',
    education,
    experience,
    projects,
    skills: extractedSkills,
    certifications,
    achievements,
    languages,
    hobbies
  });
}

/**
 * Extraction Quality Assurance Check:
 * Validates whether the imported document contains complete resume data or if parsing missed sections.
 */
export interface ExtractionQualityReport {
  isComplete: boolean;
  qualityScore: number;
  warnings: string[];
  stats: {
    rawTextLength: number;
    wordCount: number;
    skillsCount: number;
    experienceCount: number;
    educationCount: number;
    projectsCount: number;
    hasName: boolean;
    hasContactInfo: boolean;
  };
}

export function validateExtractionQuality(resume: ResumeData): ExtractionQualityReport {
  const warnings: string[] = [];
  const rawText = resume.rawText || '';
  const wordCount = rawText ? rawText.split(/\s+/).filter(Boolean).length : 0;
  const skillsCount = Object.values(resume.skills || {}).flat().length;
  const experienceCount = (resume.experience || []).length;
  const educationCount = (resume.education || []).length;
  const projectsCount = (resume.projects || []).length;
  const hasName = Boolean(resume.personalInfo?.fullName && resume.personalInfo.fullName.trim().length > 0);
  const hasContactInfo = Boolean(resume.personalInfo?.email || resume.personalInfo?.phone || resume.personalInfo?.linkedin);

  let qualityScore = 100;

  if (rawText.length < 100) {
    qualityScore -= 40;
    warnings.push('Resume document text is very short or could not be fully read.');
  }

  if (!hasName) {
    qualityScore -= 15;
    warnings.push('Candidate full name could not be automatically determined.');
  }

  if (!hasContactInfo) {
    qualityScore -= 15;
    warnings.push('Contact information (email/phone) was not found in the header.');
  }

  if (educationCount === 0 && experienceCount === 0 && projectsCount === 0) {
    qualityScore -= 30;
    warnings.push('Resume extraction may be incomplete. Please review imported sections.');
  }

  if (rawText.length > 500 && skillsCount === 0) {
    qualityScore -= 20;
    warnings.push('Resume extraction may be incomplete. Please review imported sections.');
  }

  return {
    isComplete: qualityScore >= 60 && warnings.length === 0,
    qualityScore: Math.max(0, qualityScore),
    warnings,
    stats: {
      rawTextLength: rawText.length,
      wordCount,
      skillsCount,
      experienceCount,
      educationCount,
      projectsCount,
      hasName,
      hasContactInfo
    }
  };
}

/**
 * Diagnostic Extraction Comparator for development & testing:
 * Compares PDF rawText vs DOCX rawText to assert data consistency and flag discrepancies.
 */
export interface ExtractionComparisonResult {
  pdfStats: {
    charCount: number;
    wordCount: number;
    lineCount: number;
    email: string;
    phone: string;
    skillsCount: number;
    educationCount: number;
    experienceCount: number;
    projectsCount: number;
  };
  docxStats: {
    charCount: number;
    wordCount: number;
    lineCount: number;
    email: string;
    phone: string;
    skillsCount: number;
    educationCount: number;
    experienceCount: number;
    projectsCount: number;
  };
  overlap: {
    skillsOverlapPercent: number;
    contentSimilarityPercent: number;
    isConsistent: boolean;
  };
  differences: string[];
}

export function compareExtractionResults(pdfRawText: string, docxRawText: string): ExtractionComparisonResult {
  const pdfParsed = normalizeResumeData(parseRawResumeToData(pdfRawText));
  const docxParsed = normalizeResumeData(parseRawResumeToData(docxRawText));

  const pdfSkills = Object.values(pdfParsed.skills).flat();
  const docxSkills = Object.values(docxParsed.skills).flat();

  const intersection = pdfSkills.filter((s) => docxSkills.some((ds) => ds.toLowerCase() === s.toLowerCase()));
  const union = Array.from(new Set([...pdfSkills.map((s) => s.toLowerCase()), ...docxSkills.map((s) => s.toLowerCase())]));

  const skillsOverlapPercent = union.length > 0 ? Math.round((intersection.length / union.length) * 100) : 100;

  const differences: string[] = [];

  if (pdfParsed.personalInfo.fullName !== docxParsed.personalInfo.fullName) {
    differences.push(`Candidate Name discrepancy: PDF="${pdfParsed.personalInfo.fullName}" vs DOCX="${docxParsed.personalInfo.fullName}"`);
  }
  if (pdfParsed.personalInfo.email !== docxParsed.personalInfo.email) {
    differences.push(`Email discrepancy: PDF="${pdfParsed.personalInfo.email}" vs DOCX="${docxParsed.personalInfo.email}"`);
  }
  if (pdfParsed.personalInfo.phone !== docxParsed.personalInfo.phone) {
    differences.push(`Phone discrepancy: PDF="${pdfParsed.personalInfo.phone}" vs DOCX="${docxParsed.personalInfo.phone}"`);
  }
  if (pdfParsed.education.length !== docxParsed.education.length) {
    differences.push(`Education count discrepancy: PDF=${pdfParsed.education.length} vs DOCX=${docxParsed.education.length}`);
  }
  if (pdfParsed.experience.length !== docxParsed.experience.length) {
    differences.push(`Experience count discrepancy: PDF=${pdfParsed.experience.length} vs DOCX=${docxParsed.experience.length}`);
  }
  if (pdfParsed.projects.length !== docxParsed.projects.length) {
    differences.push(`Projects count discrepancy: PDF=${pdfParsed.projects.length} vs DOCX=${docxParsed.projects.length}`);
  }

  const pdfWords = new Set(pdfRawText.toLowerCase().split(/\s+/).filter((w) => w.length > 2));
  const docxWords = new Set(docxRawText.toLowerCase().split(/\s+/).filter((w) => w.length > 2));
  const wordOverlap = Array.from(pdfWords).filter((w) => docxWords.has(w)).length;
  const wordUnion = new Set([...Array.from(pdfWords), ...Array.from(docxWords)]).size;
  const contentSimilarityPercent = wordUnion > 0 ? Math.round((wordOverlap / wordUnion) * 100) : 100;

  return {
    pdfStats: {
      charCount: pdfRawText.length,
      wordCount: pdfRawText.split(/\s+/).filter(Boolean).length,
      lineCount: pdfRawText.split('\n').length,
      email: pdfParsed.personalInfo.email,
      phone: pdfParsed.personalInfo.phone,
      skillsCount: pdfSkills.length,
      educationCount: pdfParsed.education.length,
      experienceCount: pdfParsed.experience.length,
      projectsCount: pdfParsed.projects.length
    },
    docxStats: {
      charCount: docxRawText.length,
      wordCount: docxRawText.split(/\s+/).filter(Boolean).length,
      lineCount: docxRawText.split('\n').length,
      email: docxParsed.personalInfo.email,
      phone: docxParsed.personalInfo.phone,
      skillsCount: docxSkills.length,
      educationCount: docxParsed.education.length,
      experienceCount: docxParsed.experience.length,
      projectsCount: docxParsed.projects.length
    },
    overlap: {
      skillsOverlapPercent,
      contentSimilarityPercent,
      isConsistent: differences.length === 0 && skillsOverlapPercent >= 80
    },
    differences
  };
}
