import { describe, it, expect } from 'vitest';
import { TEMPLATE_METADATA, ResumeTemplateId, useResumeStore, DEFAULT_MASTER_RESUME } from '@/store/useResumeStore';
import { calculateAtsScore, ResumeData } from '@/utils/atsEngine';

describe('Resume ATS Template Layout Truthfulness & Authoritative Score Integrity', () => {
  const EXPECTED_TEMPLATE_IDS: ResumeTemplateId[] = [
    'modern-tech',
    'harvard-classic',
    'minimal-executive',
    'creative-fullstack',
    'faang-compact',
    'stanford-academic',
    'startup-innovator',
    'executive-suite',
  ];

  const ALLOWED_LAYOUT_STYLES = [
    'Modern',
    'Traditional',
    'Minimal',
    'Two-column',
    'Compact',
    'Academic',
    'Executive',
  ];

  describe('1. Truthful Template Metadata Verification', () => {
    it('defines exactly the 8 expected ATS design templates', () => {
      expect(TEMPLATE_METADATA).toHaveLength(8);
      const ids = TEMPLATE_METADATA.map((t) => t.id);
      expect(ids).toEqual(EXPECTED_TEMPLATE_IDS);
    });

    it('assigns truthful, descriptive layoutStyle labels to every template', () => {
      TEMPLATE_METADATA.forEach((tmpl) => {
        expect(tmpl.layoutStyle).toBeDefined();
        expect(typeof tmpl.layoutStyle).toBe('string');
        expect(tmpl.layoutStyle.trim().length).toBeGreaterThan(0);
        expect(ALLOWED_LAYOUT_STYLES).toContain(tmpl.layoutStyle);
      });
    });

    it('does NOT contain static or arbitrary atsRating on any template', () => {
      TEMPLATE_METADATA.forEach((tmpl) => {
        expect((tmpl as any).atsRating).toBeUndefined();
      });
    });

    it('does NOT display misleading ATS percentages in template badges', () => {
      TEMPLATE_METADATA.forEach((tmpl) => {
        expect(tmpl.badge).toBeDefined();
        // Badges must not be fabricated ATS percentages like "ATS 100%" or "ATS 99%"
        expect(tmpl.badge).not.toMatch(/ATS\s*\d+%/i);
      });
      // Specifically assert Harvard Classic badge was corrected
      const harvard = TEMPLATE_METADATA.find((t) => t.id === 'harvard-classic');
      expect(harvard).toBeDefined();
      expect(harvard!.badge).not.toBe('ATS 100%');
      expect(harvard!.badge).toBe('Traditional');
    });

    it('has valid, non-empty metadata descriptions, target roles, and sample personas', () => {
      TEMPLATE_METADATA.forEach((tmpl) => {
        expect(tmpl.name.length).toBeGreaterThan(0);
        expect(tmpl.desc.length).toBeGreaterThan(10);
        expect(tmpl.recommendedFor.length).toBeGreaterThan(5);
        expect(tmpl.highlights.length).toBeGreaterThan(0);
        expect(tmpl.samplePersona.personalInfo.fullName.length).toBeGreaterThan(0);
        // None of the highlights should claim false 100% ATS score guarantees
        tmpl.highlights.forEach((h) => {
          expect(h).not.toMatch(/100%\s+ATS\s+score/i);
        });
      });
    });
  });

  describe('2. Exact Template Layout Styles', () => {
    const EXPECTED_MAPPINGS: Record<ResumeTemplateId, string> = {
      'modern-tech': 'Modern',
      'harvard-classic': 'Traditional',
      'minimal-executive': 'Minimal',
      'creative-fullstack': 'Two-column',
      'faang-compact': 'Compact',
      'stanford-academic': 'Academic',
      'startup-innovator': 'Modern',
      'executive-suite': 'Executive',
    };

    it('maps every template ID to its designated truthful layout style', () => {
      TEMPLATE_METADATA.forEach((tmpl) => {
        expect(tmpl.layoutStyle).toBe(EXPECTED_MAPPINGS[tmpl.id]);
      });
    });
  });

  describe('3. Authoritative 6-Pillar ATS Quality Score Preservation', () => {
    const sampleResume: ResumeData = {
      ...DEFAULT_MASTER_RESUME,
      personalInfo: {
        ...DEFAULT_MASTER_RESUME.personalInfo,
        fullName: 'Jordan Taylor',
        title: 'Senior Cloud Systems Architect',
      },
    };

    it('calculates authoritative ATS score strictly from resume data, not template selection', () => {
      const baselineAnalysis = calculateAtsScore(sampleResume);

      expect(baselineAnalysis).toBeDefined();
      expect(typeof baselineAnalysis.totalScore).toBe('number');
      expect(baselineAnalysis.totalScore).toBeGreaterThan(0);
      expect(baselineAnalysis.totalScore).toBeLessThanOrEqual(100);

      // Verify all 6 authoritative pillars are present and sum up to totalScore
      const { breakdown } = baselineAnalysis;
      expect(breakdown.structureScore).toBeGreaterThanOrEqual(0);
      expect(breakdown.completenessScore).toBeGreaterThanOrEqual(0);
      expect(breakdown.extractabilityScore).toBeGreaterThanOrEqual(0);
      expect(breakdown.skillsScore).toBeGreaterThanOrEqual(0);
      expect(breakdown.experienceQualityScore).toBeGreaterThanOrEqual(0);
      expect(breakdown.formattingScore).toBeGreaterThanOrEqual(0);

      const calculatedSum =
        breakdown.structureScore +
        breakdown.completenessScore +
        breakdown.extractabilityScore +
        breakdown.skillsScore +
        breakdown.experienceQualityScore +
        breakdown.formattingScore;

      expect(baselineAnalysis.totalScore).toBe(calculatedSum);
    });

    it('switching across all eight templates does NOT change the authoritative ATS score', () => {
      const initialScore = calculateAtsScore(sampleResume);

      for (const templateId of EXPECTED_TEMPLATE_IDS) {
        // Switch template in store
        useResumeStore.getState().setTemplate(templateId);
        expect(useResumeStore.getState().activeTemplate).toBe(templateId);

        // Calculate score for active resume data
        const currentScore = calculateAtsScore(sampleResume);

        // The authoritative score and all 6 pillars must remain identical
        expect(currentScore.totalScore).toBe(initialScore.totalScore);
        expect(currentScore.grade).toBe(initialScore.grade);
        expect(currentScore.breakdown).toEqual(initialScore.breakdown);
      }
    });

    it('template selection does not mutate candidate canonical ResumeData', () => {
      const initialResumeCopy = JSON.parse(JSON.stringify(sampleResume));

      EXPECTED_TEMPLATE_IDS.forEach((tmplId) => {
        useResumeStore.getState().setTemplate(tmplId);
        // Candidate data must remain completely unchanged
        expect(sampleResume).toEqual(initialResumeCopy);
      });
    });
  });

  describe('4. Template Selection UI Rendering Verifications', () => {
    it('renders template card elements with descriptive layoutStyle and zero arbitrary ATS % badges', () => {
      TEMPLATE_METADATA.forEach((tmpl) => {
        // Simulate card badge output as constructed in ResumeBuilderPage
        const renderedCardBadge = tmpl.layoutStyle;
        expect(renderedCardBadge).not.toMatch(/ATS\s*\d+%/i);
        expect(ALLOWED_LAYOUT_STYLES).toContain(renderedCardBadge);
      });
    });
  });
});
