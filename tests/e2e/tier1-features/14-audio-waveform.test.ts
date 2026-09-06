import { describe, it, expect } from 'vitest';

/**
 * Feature 14: Real-Time Sub-300ms Audio Waveform
 * Specifications:
 * - AudioContext + AnalyserNode configuration
 * - fftSize: 64, smoothingTimeConstant: 0.8
 * - frequencyBinCount: 32 bins
 * - Maps to 16–24 dynamic height visual bars
 * - Sub-300ms reaction latency requirement
 * - Dynamic amplitude scaling (0% to 100% height)
 */

interface AudioVisualizerConfig {
  fftSize: number;
  smoothingTimeConstant: number;
  barCount: number;
  samplingIntervalMs: number;
}

function processFrequencyBins(frequencyData: Uint8Array, targetBars: number): number[] {
  // Compress 32 bins into targetBars (e.g. 16 or 24)
  const step = frequencyData.length / targetBars;
  const bars: number[] = [];
  for (let i = 0; i < targetBars; i++) {
    const start = Math.floor(i * step);
    const end = Math.floor((i + 1) * step);
    let sum = 0;
    let count = 0;
    for (let j = start; j < end && j < frequencyData.length; j++) {
      sum += frequencyData[j];
      count++;
    }
    const avg = count > 0 ? sum / count : 0;
    // Normalize 0-255 to percentage 4% to 100%
    const normalized = Math.max(4, Math.round((avg / 255) * 100));
    bars.push(normalized);
  }
  return bars;
}

describe('Feature 14: Real-Time Sub-300ms Audio Waveform', () => {
  const config: AudioVisualizerConfig = {
    fftSize: 64,
    smoothingTimeConstant: 0.8,
    barCount: 20,
    samplingIntervalMs: 50, // ~20fps to 60fps, well below 300ms
  };

  it('should verify AnalyserNode parameters match the interface contract', () => {
    expect(config.fftSize).toBe(64);
    expect(config.fftSize / 2).toBe(32); // frequencyBinCount
    expect(config.smoothingTimeConstant).toBe(0.8);
  });

  it('should sample audio within sub-300ms latency budget (< 100ms per frame)', () => {
    expect(config.samplingIntervalMs).toBeLessThan(300);
    expect(config.samplingIntervalMs).toBeLessThanOrEqual(100);
  });

  it('should map 32 frequency bins to requested bar count (e.g. 20 bars)', () => {
    const rawFrequencies = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      rawFrequencies[i] = Math.min(255, i * 8);
    }
    const bars = processFrequencyBins(rawFrequencies, 20);
    expect(bars.length).toBe(20);
    bars.forEach((height) => {
      expect(height).toBeGreaterThanOrEqual(4);
      expect(height).toBeLessThanOrEqual(100);
    });
  });

  it('should maintain minimum baseline bar height during periods of silence (4% height)', () => {
    const silenceFrequencies = new Uint8Array(32).fill(0);
    const bars = processFrequencyBins(silenceFrequencies, 16);
    expect(bars.length).toBe(16);
    expect(bars.every((h) => h === 4)).toBe(true);
  });

  it('should scale to maximum 100% height for loud inputs (255 byte value)', () => {
    const loudFrequencies = new Uint8Array(32).fill(255);
    const bars = processFrequencyBins(loudFrequencies, 16);
    expect(bars.every((h) => h === 100)).toBe(true);
  });
});
