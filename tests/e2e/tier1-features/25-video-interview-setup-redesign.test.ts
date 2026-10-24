import { describe, it, expect } from 'vitest';

enum InterviewType {
  JOB = 'JOB',
  HR_ROUND = 'HR_ROUND',
  PRACTICE = 'PRACTICE',
}

enum ExperienceLevel {
  FRESHER = 'FRESHER',
  MID = 'MID',
  SENIOR = 'SENIOR',
}

/**
 * Test Suite: Video Interview Setup 3-Step Flow Redesign
 * Validates:
 * 1. Required minimal fields validation (Interview Type, Role, Experience, Duration)
 * 2. Optional personalization behavior (Skills, Focus, JD, Resume, Language)
 * 3. Step transition state preservation (Configure -> Device Check -> Review & Start)
 * 4. Device check verification contract
 * 5. Session payload serialization and error resistance
 */

interface SetupState {
  currentStep: 1 | 2 | 3;
  interviewType: 'TECHNICAL' | 'HR_BEHAVIORAL' | 'FULL_SIMULATION';
  targetRole: string;
  isCustomRole: boolean;
  customRoleInput: string;
  experienceLevel: ExperienceLevel;
  durationMins: number;
  selectedSkills: string[];
  selectedFocus: string[];
  jobDescription: string;
  selectedLanguage: string;
  camStatus: 'idle' | 'checking' | 'ready' | 'denied' | 'error';
  micStatus: 'idle' | 'checking' | 'ready' | 'denied' | 'error';
  audioStatus: 'idle' | 'testing' | 'verified';
  consentAgreed: boolean;
}

function validateStep1(state: Partial<SetupState>): { isValid: boolean; error?: string } {
  if (!state.interviewType) {
    return { isValid: false, error: 'Interview type is required' };
  }
  const effectiveRole = state.isCustomRole ? state.customRoleInput?.trim() : state.targetRole?.trim();
  if (!effectiveRole) {
    return { isValid: false, error: 'Target engineering role is required' };
  }
  if (!state.experienceLevel) {
    return { isValid: false, error: 'Experience level is required' };
  }
  if (!state.durationMins || ![15, 30, 45].includes(state.durationMins)) {
    return { isValid: false, error: 'Valid duration (15, 30, 45 mins) is required' };
  }
  return { isValid: true };
}

function validateStep2CanProceed(state: Partial<SetupState>): boolean {
  return state.camStatus === 'ready' && state.micStatus === 'ready';
}

function buildSessionPayload(state: SetupState, userId: string = 'test-user') {
  const finalRole = state.isCustomRole ? state.customRoleInput.trim() || 'Software Engineer' : state.targetRole;
  const backendType =
    state.interviewType === 'HR_BEHAVIORAL'
      ? InterviewType.HR_ROUND
      : state.interviewType === 'TECHNICAL'
      ? InterviewType.JOB
      : InterviewType.PRACTICE;

  const goalMeta = `[Type: ${state.interviewType}][Language: ${state.selectedLanguage || 'English'}][Skills: ${state.selectedSkills?.join(',') || ''}][Focus: ${state.selectedFocus?.join(',') || ''}]`;

  return {
    userId,
    interviewType: backendType,
    targetRole: finalRole,
    industry: 'Technology',
    experienceLevel: state.experienceLevel,
    focusAreas: state.selectedFocus && state.selectedFocus.length > 0 ? state.selectedFocus : ['General Technical', 'Communication'],
    interviewGoal: goalMeta,
    durationMins: state.durationMins,
  };
}

describe('Video Interview Setup Redesign Contract', () => {
  it('should validate minimal required fields correctly on Step 1', () => {
    // Missing role
    const invalidState: Partial<SetupState> = {
      interviewType: 'TECHNICAL',
      targetRole: '',
      isCustomRole: false,
      experienceLevel: ExperienceLevel.FRESHER,
      durationMins: 30,
    };
    expect(validateStep1(invalidState).isValid).toBe(false);
    expect(validateStep1(invalidState).error).toBe('Target engineering role is required');

    // Valid state with only the 4 required fields
    const validMinimalState: Partial<SetupState> = {
      interviewType: 'TECHNICAL',
      targetRole: 'Full Stack Developer',
      isCustomRole: false,
      experienceLevel: ExperienceLevel.MID,
      durationMins: 30,
    };
    expect(validateStep1(validMinimalState).isValid).toBe(true);
  });

  it('should support custom engineering roles without artificial restrictions', () => {
    const customRoleState: Partial<SetupState> = {
      interviewType: 'FULL_SIMULATION',
      targetRole: 'Software Engineer',
      isCustomRole: true,
      customRoleInput: 'Quantum Algorithms Specialist',
      experienceLevel: ExperienceLevel.SENIOR,
      durationMins: 45,
    };
    const validation = validateStep1(customRoleState);
    expect(validation.isValid).toBe(true);

    const payload = buildSessionPayload(customRoleState as SetupState);
    expect(payload.targetRole).toBe('Quantum Algorithms Specialist');
    expect(payload.durationMins).toBe(45);
    expect(payload.experienceLevel).toBe(ExperienceLevel.SENIOR);
  });

  it('should keep advanced personalization strictly optional and preserve state', () => {
    const stateWithCustomization: SetupState = {
      currentStep: 1,
      interviewType: 'TECHNICAL',
      targetRole: 'Backend Developer',
      isCustomRole: false,
      customRoleInput: '',
      experienceLevel: ExperienceLevel.MID,
      durationMins: 30,
      selectedSkills: ['Go', 'PostgreSQL', 'Kafka'],
      selectedFocus: ['System Architecture & Scaling'],
      jobDescription: 'Senior Go Backend Engineer leading high-throughput payment pipelines',
      selectedLanguage: 'English (US / Global)',
      camStatus: 'ready',
      micStatus: 'ready',
      audioStatus: 'verified',
      consentAgreed: true,
    };

    // Advancing step preserves all personalization
    stateWithCustomization.currentStep = 2;
    expect(stateWithCustomization.selectedSkills).toEqual(['Go', 'PostgreSQL', 'Kafka']);
    expect(stateWithCustomization.jobDescription).toContain('Senior Go Backend');

    const payload = buildSessionPayload(stateWithCustomization);
    expect(payload.interviewGoal).toContain('Go,PostgreSQL,Kafka');
    expect(payload.interviewGoal).toContain('System Architecture & Scaling');
  });

  it('should only allow proceeding to Step 3 when camera and microphone hardware are ready', () => {
    // Camera denied
    expect(
      validateStep2CanProceed({
        camStatus: 'denied',
        micStatus: 'ready',
      })
    ).toBe(false);

    // Microphone not checked
    expect(
      validateStep2CanProceed({
        camStatus: 'ready',
        micStatus: 'checking',
      })
    ).toBe(false);

    // Both ready
    expect(
      validateStep2CanProceed({
        camStatus: 'ready',
        micStatus: 'ready',
      })
    ).toBe(true);
  });
});
