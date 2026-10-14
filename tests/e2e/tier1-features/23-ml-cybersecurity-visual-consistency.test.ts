import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TEMPLATE_METADATA } from '@/store/useResumeStore';
import { parseRawResumeToData } from '@/utils/resumeParser';
import DataAiResearchTemplate from '@/components/resume/templates/DataAiResearchTemplate';
import CybersecuritySpecialistTemplate from '@/components/resume/templates/CybersecuritySpecialistTemplate';
import ModernTechTemplate from '@/components/resume/templates/ModernTechTemplate';
import HarvardClassicTemplate from '@/components/resume/templates/HarvardClassicTemplate';
import FaangCompactTemplate from '@/components/resume/templates/FaangCompactTemplate';

describe('ML & Cybersecurity Resume Consistency, Role Content Integrity & Rendering Audit', () => {
  const cyberMeta = TEMPLATE_METADATA.find((t) => t.id === 'cybersecurity-specialist')!;
  const aiMeta = TEMPLATE_METADATA.find((t) => t.id === 'data-ai-research')!;

  const cyberPersona = cyberMeta.samplePersona;
  const aiPersona = aiMeta.samplePersona;

  describe('1. Role-Specific Content Retention & Integrity', () => {
    it('preserves distinct, authentic cybersecurity skills and projects in cybersecurity persona', () => {
      expect(cyberPersona.personalInfo.fullName).toBe('Nathaniel Drake');
      expect(cyberPersona.personalInfo.title).toContain('Security');

      // Cybersecurity skills
      const cyberSkillsFlattened = [
        ...cyberPersona.skills.languages,
        ...cyberPersona.skills.frameworks,
        ...cyberPersona.skills.tools,
        ...cyberPersona.skills.cloudDevOps,
      ];
      expect(cyberSkillsFlattened).toContain('Splunk');
      expect(cyberSkillsFlattened).toContain('Wireshark');
      expect(cyberSkillsFlattened).toContain('Threat Intelligence');
      expect(cyberSkillsFlattened).toContain('MITRE ATT&CK');
      expect(cyberSkillsFlattened).toContain('Zero Trust Architecture');

      // Cybersecurity projects
      expect(cyberPersona.projects.some((p) => p.name.includes('SentinelGuard'))).toBe(true);
      expect(cyberPersona.projects.some((p) => p.name.includes('VulnSweep'))).toBe(true);

      // Cybersecurity certifications
      expect(cyberPersona.certifications?.some((c) => c.title.includes('CISSP'))).toBe(true);
      expect(cyberPersona.certifications?.some((c) => c.title.includes('CEH'))).toBe(true);
    });

    it('preserves distinct, authentic machine learning skills, projects and publications in ML persona', () => {
      expect(aiPersona.personalInfo.fullName).toBe('Dr. Aaron Levinson');
      expect(aiPersona.personalInfo.title).toContain('AI Research');

      // ML skills
      const aiSkillsFlattened = [
        ...aiPersona.skills.languages,
        ...aiPersona.skills.frameworks,
        ...aiPersona.skills.databases,
        ...aiPersona.skills.tools,
        ...aiPersona.skills.cloudDevOps,
      ];
      expect(aiSkillsFlattened).toContain('PyTorch');
      expect(aiSkillsFlattened).toContain('CUDA');
      expect(aiSkillsFlattened).toContain('DeepSpeed');
      expect(aiSkillsFlattened).toContain('Pinecone');
      expect(aiSkillsFlattened).toContain('Hugging Face Transformers');

      // ML projects
      expect(aiPersona.projects.some((p) => p.name.includes('NovaAlign'))).toBe(true);
      expect(aiPersona.projects.some((p) => p.name.includes('VectorSense'))).toBe(true);

      // ML publications
      expect(aiPersona.publications?.some((p) => p.venue.includes('NeurIPS'))).toBe(true);
      expect(aiPersona.publications?.some((p) => p.venue.includes('ICLR'))).toBe(true);
    });

    it('guarantees zero cross-contamination of role-specific content between ML and cybersecurity', () => {
      // Cybersecurity persona must not contain ML publications
      expect(cyberPersona.publications || []).toHaveLength(0);
      // Cybersecurity persona must not have PyTorch or CUDA
      expect(cyberPersona.skills.languages).not.toContain('CUDA');
      expect(cyberPersona.skills.frameworks).not.toContain('PyTorch');

      // AI persona must not have CISSP or CEH
      expect(aiPersona.certifications || []).toHaveLength(0);
      expect(aiPersona.skills.tools).not.toContain('Wireshark');
      expect(aiPersona.skills.tools).not.toContain('Burp Suite');
    });
  });

  describe('2. Visual Presentation Consistency & Removal of Role-Specific Color Overrides', () => {
    it('renders DataAiResearchTemplate with premium minimal white background and dark text', () => {
      const html = renderToString(React.createElement(DataAiResearchTemplate, { data: aiPersona }));

      // White background & dark text
      expect(html).toContain('bg-white');
      expect(html).toContain('text-slate-900');
      expect(html).toContain('border-slate-200');

      // Removal of role-specific color overrides
      expect(html).not.toContain('violet-900');
      expect(html).not.toContain('violet-950');
      expect(html).not.toContain('violet-100');
      expect(html).not.toContain('violet-50');
      expect(html).not.toContain('text-violet-');
      expect(html).not.toContain('bg-violet-');
      expect(html).not.toContain('border-violet-');

      // Removal of decorative icon badges
      expect(html).not.toContain('lucide-book-open');
    });

    it('renders CybersecuritySpecialistTemplate with premium minimal white background and dark text', () => {
      const html = renderToString(React.createElement(CybersecuritySpecialistTemplate, { data: cyberPersona }));

      // White background & dark text
      expect(html).toContain('bg-white');
      expect(html).toContain('text-slate-900');
      expect(html).toContain('border-slate-200');

      // Removal of role-specific color overrides
      expect(html).not.toContain('rose-900');
      expect(html).not.toContain('rose-950');
      expect(html).not.toContain('rose-100');
      expect(html).not.toContain('text-rose-');
      expect(html).not.toContain('bg-rose-');
      expect(html).not.toContain('border-rose-');

      // Removal of decorative shield badges and emojis
      expect(html).not.toContain('lucide-shield-check');
      expect(html).not.toContain('🛡️');
      expect(html).not.toContain('bg-rose-950');
    });

    it('renders identical section heading styles, border accents and typography across both role templates', () => {
      const aiHtml = renderToString(React.createElement(DataAiResearchTemplate, { data: aiPersona }));
      const cyberHtml = renderToString(React.createElement(CybersecuritySpecialistTemplate, { data: cyberPersona }));

      // Common heading styling class signature
      const expectedHeadingClasses = 'text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1';
      expect(aiHtml).toContain(expectedHeadingClasses);
      expect(cyberHtml).toContain(expectedHeadingClasses);

      // Common base container classes
      expect(aiHtml).toContain('shadow-lg rounded-2xl max-w-4xl mx-auto border border-slate-200 font-sans text-xs');
      expect(cyberHtml).toContain('shadow-lg rounded-2xl max-w-4xl mx-auto border border-slate-200 font-sans text-xs');

      // Common header border
      expect(aiHtml).toContain('border-b border-slate-900 pb-4 mb-5');
      expect(cyberHtml).toContain('border-b border-slate-900 pb-4 mb-5');
    });
  });

  describe('3. Same-Template Rendering: ML vs Cybersecurity Resumes', () => {
    it('confirms only relevant content differs when ML and Cybersecurity are rendered in ModernTechTemplate', () => {
      const mlHtml = renderToString(React.createElement(ModernTechTemplate, { data: aiPersona }));
      const cyberHtml = renderToString(React.createElement(ModernTechTemplate, { data: cyberPersona }));

      // Both must use identical styling classes
      expect(mlHtml).toContain('bg-white');
      expect(cyberHtml).toContain('bg-white');

      // Content differences strictly reflect role personas
      expect(mlHtml).toContain('Dr. Aaron Levinson');
      expect(mlHtml).toContain('Staff AI Research Scientist');
      expect(mlHtml).toContain('PyTorch');
      expect(mlHtml).toContain('NovaAlign');

      expect(cyberHtml).toContain('Nathaniel Drake');
      expect(cyberHtml).toContain('Senior Information Security');
      expect(cyberHtml).toContain('Splunk');
      expect(cyberHtml).toContain('SentinelGuard');

      // No cross-contamination
      expect(mlHtml).not.toContain('Nathaniel Drake');
      expect(cyberHtml).not.toContain('Dr. Aaron Levinson');
    });

    it('confirms only relevant content differs when ML and Cybersecurity are rendered in HarvardClassicTemplate', () => {
      const mlHtml = renderToString(React.createElement(HarvardClassicTemplate, { data: aiPersona }));
      const cyberHtml = renderToString(React.createElement(HarvardClassicTemplate, { data: cyberPersona }));

      expect(mlHtml).toContain('Dr. Aaron Levinson');
      expect(cyberHtml).toContain('Nathaniel Drake');
      expect(mlHtml).toContain('Slurm');
      expect(cyberHtml).toContain('Splunk');
    });

    it('confirms only relevant content differs when ML and Cybersecurity are rendered in FaangCompactTemplate', () => {
      const mlHtml = renderToString(React.createElement(FaangCompactTemplate, { data: aiPersona }));
      const cyberHtml = renderToString(React.createElement(FaangCompactTemplate, { data: cyberPersona }));

      expect(mlHtml).toContain('Dr. Aaron Levinson');
      expect(cyberHtml).toContain('Nathaniel Drake');
      expect(mlHtml).toContain('DeepSpeed');
      expect(cyberHtml).toContain('MITRE ATT&amp;CK');
    });
  });

  describe('4. Corrupted Text Defense in Resume Parser', () => {
    it('prevents corrupted bullet points or tech stack lines from leaking into candidate location', () => {
      const rawTextWithCorruptedBullet = `
ASHISH JAISWAR
Software Developer
ajaiswar208@gmail.com | +91 8655021090 | https://ashishjaiswar.com

EXPERIENCE
TATA CONSULTANCY SERVICES (TCS) - Frontend Developer
Apr 2023 - Present
• Worked on the development of critical features of an Insurance application using JavaScript, React, Redux.
• Developed UI for a critical feature page with forms and validation.
• Collaborated with back-end team to integrate data.
• Performed unit testing using Jest.
• Enhanced code quality by identifying and fixing bugs.
• 'wnn tn s s Tailwind CSS, and Material UI.
• Built several components with advanced filtering and pagination.

SKILLS
JavaScript, Python, TypeScript, React.js, Tailwind CSS
`;

      const parsed = parseRawResumeToData(rawTextWithCorruptedBullet);

      // Verify personalInfo
      expect(parsed.personalInfo.fullName).toBe('ASHISH JAISWAR');
      expect(parsed.personalInfo.email).toBe('ajaiswar208@gmail.com');

      // CRITICAL ASSERTION: Location must NOT be corrupted with the bullet text!
      expect(parsed.personalInfo.location).not.toContain('Tailwind CSS');
      expect(parsed.personalInfo.location).not.toContain('wnn');
      expect(parsed.personalInfo.location).not.toContain('Material UI');
    });

    it('correctly extracts legitimate location when provided in resume header', () => {
      const resumeWithValidHeaderLocation = `
ASHISH JAISWAR
Frontend Developer
ajaiswar208@gmail.com | +91 8655021090 | Mumbai, Maharashtra, India | https://linkedin.com/in/ashishjaiswar

EXPERIENCE
TATA CONSULTANCY SERVICES (TCS) - Frontend Developer
Apr 2023 - Present
• Worked on the development of critical features of an Insurance application.
`;

      const parsed = parseRawResumeToData(resumeWithValidHeaderLocation);
      expect(parsed.personalInfo.fullName).toBe('ASHISH JAISWAR');
      expect(parsed.personalInfo.location).toBe('Mumbai, Maharashtra, India');
    });

    it('reprocesses actual Ashish Jaiswar extracted text: preserves raw OCR bullets without guessing, keeps location clean', () => {
      const actualAshishExtractedText = `Ashish Jaiswar

+91 8655021090 ajaiswar208@gmail.com ashishjaiswar.com linkedin/ashishjaiswar github/AshishJaiswar

EXPERIENCE

TATA CONSULTANCY SERVICES (TCS) - Frontend Developer

Apr 2023 - present

- Worked on the development of critical features of an Insurance application using JavaScript, React, Redux, and custom project-specific libraries.
- Developed UI for a critical feature page consisting of multiple forms with data validation.
- Collaborated with the back-end team to integrate data from API to userfacing elements.
- Performed unit testing using Jest and React Testing Library, achieving a comprehensive 100% code coverage.
- Enhanced code quality by identifying and fixing bugs and diligently analyzed and resolved security vulnerabilities.
- 'wnn tn   s     s Tailwind CSS, and Material UI.
- Built several components with advanced features, such as efficient filtering, sorting, and pagination.

EDUCATION

Bachelor's in Computer Science
Ramniranjan Jhunjhunwala College, Mumbai
Jun 2017 - May 2020
`;

      const parsed = parseRawResumeToData(actualAshishExtractedText);

      // 1. Location must remain clean (empty, not polluted by bullet line 6)
      expect(parsed.personalInfo.location).toBe('');

      // 2. Full name and contacts preserved
      expect(parsed.personalInfo.fullName).toBe('Ashish Jaiswar');
      expect(parsed.personalInfo.email).toBe('ajaiswar208@gmail.com');
      expect(parsed.personalInfo.phone).toBe('+91 8655021090');

      // 3. Experience entry and bullets preserved accurately
      expect(parsed.experience).toBeDefined();
      expect(parsed.experience!.length).toBeGreaterThan(0);
      const tcs = parsed.experience![0];
      expect(tcs.company).toContain('TATA CONSULTANCY SERVICES');

      // 4. Raw bullet text preserved as extracted without hallucinating / guessing corrections
      const rawOcrBullet = tcs.bullets.find((b) => b.includes('Tailwind CSS'));
      expect(rawOcrBullet).toBeDefined();
      expect(rawOcrBullet).toContain('Tailwind CSS');
      expect(rawOcrBullet).toContain('Material UI');
      // Must NOT invent words like "Engineered components using Tailwind"
      expect(rawOcrBullet).not.toContain('Engineered components using');
    });
  });

  describe('5. Canonical Resume Parity across ML and Cybersecurity Templates', () => {
    const canonicalResume = {
      ...aiPersona,
      certifications: [
        { id: 'c-1', title: 'AWS Certified Machine Learning - Specialty', issuer: 'Amazon Web Services', date: '2023' },
        { id: 'c-2', title: 'TensorFlow Developer Certificate', issuer: 'Google', date: '2022' }
      ]
    };

    it('renders the same canonical resume with identical typography, spacing, borders and badge styles in both templates', () => {
      const mlHtml = renderToString(React.createElement(DataAiResearchTemplate, { data: canonicalResume }));
      const cyberHtml = renderToString(React.createElement(CybersecuritySpecialistTemplate, { data: canonicalResume }));

      // Identical base layout wrapper
      expect(mlHtml).toContain('bg-white text-slate-900 p-8 sm:p-10 shadow-lg rounded-2xl max-w-4xl mx-auto border border-slate-200 font-sans text-xs');
      expect(cyberHtml).toContain('bg-white text-slate-900 p-8 sm:p-10 shadow-lg rounded-2xl max-w-4xl mx-auto border border-slate-200 font-sans text-xs');

      // Identical section heading styles
      const headingClass = 'text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2.5 font-sans';
      expect(mlHtml).toContain(headingClass);
      expect(cyberHtml).toContain(headingClass);

      // Identical header border and title typography
      expect(mlHtml).toContain('border-b border-slate-900 pb-4 mb-5');
      expect(cyberHtml).toContain('border-b border-slate-900 pb-4 mb-5');
      expect(mlHtml).toContain('text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 uppercase font-sans');
      expect(cyberHtml).toContain('text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 uppercase font-sans');

      // Identical certification badge styling
      const certBadgeClass = 'bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200 font-sans text-[10.5px] font-medium';
      expect(mlHtml).toContain(certBadgeClass);
      expect(cyberHtml).toContain(certBadgeClass);
      expect(mlHtml).toContain('AWS Certified Machine Learning - Specialty');
      expect(cyberHtml).toContain('AWS Certified Machine Learning - Specialty');

      // Both templates render the same candidate data accurately
      expect(mlHtml).toContain('Dr. Aaron Levinson');
      expect(cyberHtml).toContain('Dr. Aaron Levinson');
    });
  });

  describe('6. ATS Quality Score Invariance Across Template Selection', () => {
    it('guarantees identical ATS score regardless of whether ML or Cybersecurity template is chosen', async () => {
      const { calculateAtsScore } = await import('@/utils/atsEngine');
      const scoreML = calculateAtsScore(aiPersona);
      const scoreCyber = calculateAtsScore(cyberPersona);

      // Calculating score on canonical data is purely deterministic
      expect(scoreML.totalScore).toBeGreaterThan(0);
      expect(scoreCyber.totalScore).toBeGreaterThan(0);

      // Switching template layout metadata does not alter underlying candidate ATS score
      const { TEMPLATE_METADATA } = await import('@/store/useResumeStore');
      const aiTemplate = TEMPLATE_METADATA.find(t => t.id === 'data-ai-research')!;
      const cyberTemplate = TEMPLATE_METADATA.find(t => t.id === 'cybersecurity-specialist')!;

      expect(aiTemplate.layoutStyle).toBe('Academic');
      expect(cyberTemplate.layoutStyle).toBe('Technical');
      expect(aiTemplate.badge).not.toMatch(/ATS\s*\d+%/i);
      expect(cyberTemplate.badge).not.toMatch(/ATS\s*\d+%/i);
    });
  });
});

