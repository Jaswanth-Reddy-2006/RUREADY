import { InterviewType } from '@ru-ready/shared';

export const NOT_ROLE_SPECIFIC = 'Not role-specific (general)';

export const ROLE_OPTIONS_BY_TYPE: Partial<Record<InterviewType, string[]>> = {
  [InterviewType.HR_ROUND]: [
    NOT_ROLE_SPECIFIC,
    'Software Engineer',
    'Product Manager',
    'Data Analyst',
    'Designer',
    'Sales / Business Development',
    'Operations',
    'Other (Custom)',
  ],
  [InterviewType.COMMUNICATION]: [
    NOT_ROLE_SPECIFIC,
    'Public Speaking / Presentation',
    'Client Communication',
    'Cross-team Collaboration',
    'Executive Briefing',
    'Technical Explanation (non-coding)',
    'Other (Custom)',
  ],
  [InterviewType.PRODUCT_MANAGER]: [
    'Associate Product Manager',
    'Product Manager',
    'Senior Product Manager',
    'Group Product Manager',
    'Other (Custom)',
  ],
  [InterviewType.DATA_SCIENCE]: [
    'Data Analyst',
    'Data Scientist',
    'ML Engineer',
    'Research Scientist',
    'Other (Custom)',
  ],
};

export function isRoleOptional(type: InterviewType): boolean {
  return (
    type === InterviewType.HR_ROUND ||
    type === InterviewType.COMMUNICATION ||
    type === InterviewType.PRACTICE
  );
}

export function isFocusAreasOptional(type: InterviewType, targetRole: string): boolean {
  if (type === InterviewType.HR_ROUND || type === InterviewType.COMMUNICATION) {
    return true;
  }
  const normalized = targetRole.toLowerCase();
  if (
    normalized.includes('fullstack') ||
    normalized.includes('full stack') ||
    normalized.includes('full-stack')
  ) {
    return true;
  }
  return false;
}

export function getRoleOptionsForType(
  type: InterviewType,
  defaultOptions: string[],
): string[] {
  return ROLE_OPTIONS_BY_TYPE[type] ?? defaultOptions;
}

export function resolveTargetRole(
  option: string,
  customRole: string,
  type: InterviewType,
): string {
  if (option === 'Other (Custom)') {
    return customRole.trim();
  }
  if (option === NOT_ROLE_SPECIFIC) {
    if (type === InterviewType.HR_ROUND) return 'General HR / Culture Fit';
    if (type === InterviewType.COMMUNICATION) return 'Communication & Soft Skills';
    return 'General Practice';
  }
  return option;
}
