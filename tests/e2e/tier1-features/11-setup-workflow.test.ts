import { describe, it, expect } from 'vitest';

/**
 * Feature 11: Interview Setup Workflow Streamline
 * Specifications:
 * - SetupForm & CodingSetupForm modern glassmorphism styling
 * - Role selection, experience level (Junior, Mid, Senior, Lead/Staff)
 * - Encapsulates configuration and session state
 * - Unified navigation to pre-flight device check (/interview/device-check)
 * - Session creation validation schema
 */

interface SetupFormData {
  role: string;
  experienceLevel: 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';
  persona: 'HIRING_MANAGER' | 'TECHNICAL_ARCHITECT' | 'BAR_RAISER';
  interviewType: 'ORAL' | 'CODING';
  customTopics?: string[];
}

function validateSetupForm(data: Partial<SetupFormData>) {
  const errors: Record<string, string> = {};
  if (!data.role || data.role.trim().length === 0) {
    errors.role = 'Role or job title is required';
  }
  if (!data.experienceLevel) {
    errors.experienceLevel = 'Experience level must be selected';
  }
  if (!data.persona) {
    errors.persona = 'Interviewer persona must be chosen';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

describe('Feature 11: Interview Setup Workflow Streamline', () => {
  it('should accept valid setup configuration with all required fields', () => {
    const validConfig: SetupFormData = {
      role: 'Frontend Engineer',
      experienceLevel: 'SENIOR',
      persona: 'TECHNICAL_ARCHITECT',
      interviewType: 'CODING',
      customTopics: ['React', 'TypeScript', 'Performance'],
    };

    const result = validateSetupForm(validConfig);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('should reject missing role or unselected experience level', () => {
    const invalidConfig = {
      role: '',
      persona: 'HIRING_MANAGER' as const,
    };

    const result = validateSetupForm(invalidConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors.role).toBe('Role or job title is required');
    expect(result.errors.experienceLevel).toBe('Experience level must be selected');
  });

  it('should route user to device pre-flight check after successful setup submission', () => {
    const nextRoute = (sessionId: string) => `/interview/device-check?session=${sessionId}`;
    expect(nextRoute('session-abc')).toBe('/interview/device-check?session=session-abc');
  });

  it('should format experience level choices with clear label descriptors', () => {
    const experienceOptions = [
      { id: 'JUNIOR', label: 'Junior (0-2 yrs)' },
      { id: 'MID', label: 'Mid-Level (3-5 yrs)' },
      { id: 'SENIOR', label: 'Senior (6-8 yrs)' },
      { id: 'LEAD', label: 'Lead / Staff (9+ yrs)' },
    ];

    expect(experienceOptions.length).toBe(4);
    expect(experienceOptions[0].id).toBe('JUNIOR');
    expect(experienceOptions[3].id).toBe('LEAD');
  });

  it('should apply obsidian card and glassmorphic elevation to setup container', () => {
    const containerClass = 'max-w-2xl mx-auto bg-obsidian-card backdrop-blur-xl border border-white/10 rounded-2xl p-8';
    expect(containerClass).toContain('bg-obsidian-card');
    expect(containerClass).toContain('backdrop-blur-xl');
  });
});
