import { describe, it, expect } from 'vitest';

/**
 * Tier 3 Cross-Feature Combination: Setup, Persona & Device Check Pre-flight
 * Features Tested Together:
 * - Feature 10: Multi-Agent Persona Selection UI
 * - Feature 11: Interview Setup Workflow Streamline
 * - Feature 12: Hardware Device Check Overhaul
 */

interface SetupSubmission {
  role: string;
  experienceLevel: 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';
  persona: 'HIRING_MANAGER' | 'TECHNICAL_ARCHITECT' | 'BAR_RAISER';
  interviewGoal: string;
}

interface PreflightChecklist {
  microphone: boolean;
  camera: boolean;
  displayResolution: boolean;
}

function processSetupAndPreflight(
  submission: SetupSubmission,
  hardware: { hasMic: boolean; hasCam: boolean; screenWidth: number; screenHeight: number }
) {
  // Step 1: Encode persona into interviewGoal
  const encodedGoal = `[Persona: ${submission.persona}] ${submission.interviewGoal}`.trim();

  // Step 2: Validate pre-flight checks
  const checklist: PreflightChecklist = {
    microphone: hardware.hasMic,
    camera: hardware.hasCam,
    displayResolution: hardware.screenWidth >= 1024 && hardware.screenHeight >= 720,
  };

  const isReady = checklist.microphone && checklist.camera && checklist.displayResolution;

  return {
    sessionId: 'sess-' + Math.random().toString(36).substring(2, 9),
    role: submission.role,
    encodedGoal,
    persona: submission.persona,
    checklist,
    isReadyForRoom: isReady,
    redirectUrl: isReady ? '/interview/room' : '/interview/device-check?error=hardware_unmet',
  };
}

describe('Tier 3 Combinations — Persona Selection, Setup & Device Check', () => {
  it('should seamlessly process Technical Architect setup into device check with 4K screen pass', () => {
    const setup: SetupSubmission = {
      role: 'Staff Infrastructure Engineer',
      experienceLevel: 'LEAD',
      persona: 'TECHNICAL_ARCHITECT',
      interviewGoal: 'High-scale distributed streaming systems',
    };

    const hardware = {
      hasMic: true,
      hasCam: true,
      screenWidth: 3840,
      screenHeight: 2160,
    };

    const session = processSetupAndPreflight(setup, hardware);

    expect(session.encodedGoal).toBe('[Persona: TECHNICAL_ARCHITECT] High-scale distributed streaming systems');
    expect(session.checklist.displayResolution).toBe(true);
    expect(session.isReadyForRoom).toBe(true);
    expect(session.redirectUrl).toBe('/interview/room');
  });

  it('should hold candidate in device check when microphone is missing during Bar Raiser setup', () => {
    const setup: SetupSubmission = {
      role: 'Senior SDE',
      experienceLevel: 'SENIOR',
      persona: 'BAR_RAISER',
      interviewGoal: 'Amazon leadership principles and system tradeoffs',
    };

    const hardware = {
      hasMic: false, // Mic missing
      hasCam: true,
      screenWidth: 1920,
      screenHeight: 1080,
    };

    const session = processSetupAndPreflight(setup, hardware);

    expect(session.checklist.microphone).toBe(false);
    expect(session.isReadyForRoom).toBe(false);
    expect(session.redirectUrl).toContain('/interview/device-check?error=hardware_unmet');
  });

  it('should verify Ultrawide monitor (3440x1440) passes pre-flight without false-positive error', () => {
    const setup: SetupSubmission = {
      role: 'Full Stack Engineer',
      experienceLevel: 'MID',
      persona: 'HIRING_MANAGER',
      interviewGoal: 'Cross-functional project leadership',
    };

    const hardware = {
      hasMic: true,
      hasCam: true,
      screenWidth: 3440,
      screenHeight: 1440,
    };

    const session = processSetupAndPreflight(setup, hardware);

    expect(session.checklist.displayResolution).toBe(true);
    expect(session.isReadyForRoom).toBe(true);
  });

  it('should preserve persona tag integrity through preflight to room redirection', () => {
    const setup: SetupSubmission = {
      role: 'Product Engineer',
      experienceLevel: 'SENIOR',
      persona: 'HIRING_MANAGER',
      interviewGoal: '',
    };

    const session = processSetupAndPreflight(setup, {
      hasMic: true,
      hasCam: true,
      screenWidth: 1920,
      screenHeight: 1080,
    });

    expect(session.encodedGoal).toBe('[Persona: HIRING_MANAGER]');
    expect(session.persona).toBe('HIRING_MANAGER');
  });
});
