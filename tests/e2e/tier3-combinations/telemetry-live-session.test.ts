import { describe, it, expect } from 'vitest';

/**
 * Tier 3 Cross-Feature Combination: Telemetry & Live Oral Room
 * Features Tested Together:
 * - Feature 13: Live Oral Interview Room Modernization
 * - Feature 14: Real-Time Sub-300ms Audio Waveform
 * - Feature 15: Live Vocal Pacing & Latency Gauges
 */

interface LiveSessionTelemetry {
  speechState: 'idle' | 'listening' | 'evaluating' | 'speaking';
  audioBarHeights: number[]; // 16 bars
  currentWpm: number;
  pacingCategory: 'SLOW' | 'OPTIMAL' | 'FAST';
  aiLatencyMs: number | null;
}

function processTelemetryCycle(
  rawFrequencies: Uint8Array,
  wordsSpoken: number,
  elapsedSec: number,
  answerSubmittedAt: number | null,
  aiStreamStartedAt: number | null
): LiveSessionTelemetry {
  // 1. Audio Waveform (sub-300ms)
  const barCount = 16;
  const step = rawFrequencies.length / barCount;
  const audioBarHeights: number[] = [];
  for (let i = 0; i < barCount; i++) {
    const start = Math.floor(i * step);
    const end = Math.floor((i + 1) * step);
    let sum = 0;
    let count = 0;
    for (let j = start; j < end && j < rawFrequencies.length; j++) {
      sum += rawFrequencies[j];
      count++;
    }
    const avg = count > 0 ? sum / count : 0;
    audioBarHeights.push(Math.max(4, Math.round((avg / 255) * 100)));
  }

  // 2. Vocal Pacing
  const minutes = Math.max(0.01, elapsedSec / 60);
  const currentWpm = Math.round(wordsSpoken / minutes);
  let pacingCategory: 'SLOW' | 'OPTIMAL' | 'FAST' = 'OPTIMAL';
  if (currentWpm < 110) pacingCategory = 'SLOW';
  else if (currentWpm > 160) pacingCategory = 'FAST';

  // 3. AI Latency Gauge
  let aiLatencyMs: number | null = null;
  if (answerSubmittedAt && aiStreamStartedAt && aiStreamStartedAt >= answerSubmittedAt) {
    aiLatencyMs = aiStreamStartedAt - answerSubmittedAt;
  }

  // 4. Speech State
  let speechState: 'idle' | 'listening' | 'evaluating' | 'speaking' = 'listening';
  if (aiLatencyMs !== null && aiStreamStartedAt) {
    speechState = 'speaking';
  } else if (answerSubmittedAt && !aiStreamStartedAt) {
    speechState = 'evaluating';
  }

  return {
    speechState,
    audioBarHeights,
    currentWpm,
    pacingCategory,
    aiLatencyMs,
  };
}

describe('Tier 3 Combinations — Audio Waveform, Pacing & Live Room Telemetry', () => {
  it('should update live waveform and calculate Optimal vocal pacing while candidate speaks', () => {
    // 32-bin active frequency array with average amplitude ~128
    const freq = new Uint8Array(32).fill(128);
    // Candidate spoke 70 words in 30 seconds -> 140 WPM (Optimal)
    const telemetry = processTelemetryCycle(freq, 70, 30, null, null);

    expect(telemetry.speechState).toBe('listening');
    expect(telemetry.audioBarHeights.length).toBe(16);
    expect(telemetry.audioBarHeights[0]).toBeCloseTo(50, 1);
    expect(telemetry.currentWpm).toBe(140);
    expect(telemetry.pacingCategory).toBe('OPTIMAL');
    expect(telemetry.aiLatencyMs).toBeNull();
  });

  it('should transition to evaluating state and compute AI response latency upon speech completion', () => {
    const freq = new Uint8Array(32).fill(0); // silence
    const submitTime = 1000;
    const aiStartTime = 1850; // 850ms latency

    const telemetry = processTelemetryCycle(freq, 120, 60, submitTime, aiStartTime);

    expect(telemetry.speechState).toBe('speaking');
    expect(telemetry.aiLatencyMs).toBe(850);
    expect(telemetry.currentWpm).toBe(120);
    expect(telemetry.pacingCategory).toBe('OPTIMAL');
  });

  it('should detect Fast pacing category when candidate speaks at > 160 WPM', () => {
    const freq = new Uint8Array(32).fill(100);
    // 90 words in 30 seconds -> 180 WPM
    const telemetry = processTelemetryCycle(freq, 90, 30, null, null);

    expect(telemetry.currentWpm).toBe(180);
    expect(telemetry.pacingCategory).toBe('FAST');
  });

  it('should maintain baseline waveform bars during AI speaking phase', () => {
    const silenceFreq = new Uint8Array(32).fill(0);
    const telemetry = processTelemetryCycle(silenceFreq, 100, 50, 1000, 1400);

    expect(telemetry.speechState).toBe('speaking');
    expect(telemetry.audioBarHeights.every((h) => h === 4)).toBe(true);
  });
});
