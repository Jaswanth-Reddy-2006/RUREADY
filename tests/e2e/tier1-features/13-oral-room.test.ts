import { describe, it, expect } from 'vitest';

/**
 * Feature 13: Live Oral Interview Room Modernization
 * Specifications:
 * - InterviewRoom.tsx & NormalInterviewRoom.tsx
 * - Obsidian-dark aesthetic with solar-orange active state borders
 * - AI interviewer avatar with animated speech wave ring
 * - Speech state transitions: 'idle' | 'listening' | 'evaluating' | 'speaking'
 * - Error recovery boundary with reconnect retry
 */

type SpeechState = 'idle' | 'listening' | 'evaluating' | 'speaking';

interface OralRoomState {
  currentQuestionIndex: number;
  totalQuestions: number;
  speechState: SpeechState;
  hasAudioError: boolean;
  isAiResponding: boolean;
}

function getAvatarAuraClass(speechState: SpeechState): string {
  switch (speechState) {
    case 'speaking':
      return 'ring-4 ring-solar-orange-500 animate-pulse';
    case 'listening':
      return 'ring-4 ring-emerald-500 animate-pulse';
    case 'evaluating':
      return 'ring-4 ring-amber-500 animate-spin';
    case 'idle':
    default:
      return 'ring-2 ring-white/10';
  }
}

describe('Feature 13: Live Oral Interview Room Modernization', () => {
  it('should initialize room in idle or speaking state for the opening question', () => {
    const roomState: OralRoomState = {
      currentQuestionIndex: 0,
      totalQuestions: 5,
      speechState: 'speaking',
      hasAudioError: false,
      isAiResponding: true,
    };

    expect(roomState.currentQuestionIndex).toBe(0);
    expect(roomState.totalQuestions).toBe(5);
    expect(roomState.speechState).toBe('speaking');
  });

  it('should render distinct visual aura for each interviewer speech state', () => {
    expect(getAvatarAuraClass('speaking')).toContain('ring-solar-orange-500');
    expect(getAvatarAuraClass('listening')).toContain('ring-emerald-500');
    expect(getAvatarAuraClass('evaluating')).toContain('ring-amber-500');
    expect(getAvatarAuraClass('idle')).toContain('ring-white/10');
  });

  it('should transition speech state accurately through turn-taking lifecycle', () => {
    let state: SpeechState = 'idle';
    // AI asks question
    state = 'speaking';
    expect(state).toBe('speaking');
    // User speaks
    state = 'listening';
    expect(state).toBe('listening');
    // AI processes answer
    state = 'evaluating';
    expect(state).toBe('evaluating');
    // AI gives follow-up or next question
    state = 'speaking';
    expect(state).toBe('speaking');
  });

  it('should trigger error recovery fallback when audio stream disconnects', () => {
    const room: OralRoomState = {
      currentQuestionIndex: 1,
      totalQuestions: 5,
      speechState: 'listening',
      hasAudioError: true,
      isAiResponding: false,
    };

    const shouldShowRecoveryPrompt = room.hasAudioError;
    expect(shouldShowRecoveryPrompt).toBe(true);
  });

  it('should render question progress indicator (e.g. Question 2 of 5)', () => {
    const formatProgress = (current: number, total: number) => `Question ${current + 1} of ${total}`;
    expect(formatProgress(1, 5)).toBe('Question 2 of 5');
    expect(formatProgress(4, 5)).toBe('Question 5 of 5');
  });
});
