import { vi } from 'vitest';

// Global mocks for browser APIs required across live interview telemetry and visualizers
if (typeof window !== 'undefined') {
  // matchMedia mock
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // ResizeObserver mock
  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  (window as unknown as { ResizeObserver: typeof MockResizeObserver }).ResizeObserver = MockResizeObserver;

  // IntersectionObserver mock
  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  (window as unknown as { IntersectionObserver: typeof MockIntersectionObserver }).IntersectionObserver = MockIntersectionObserver;

  // Web Audio API mock for sub-300ms audio visualizer tests
  class MockAnalyserNode {
    fftSize = 64;
    smoothingTimeConstant = 0.8;
    frequencyBinCount = 32;
    getByteFrequencyData = vi.fn((array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 128);
      }
    });
    getByteTimeDomainData = vi.fn((array: Uint8Array) => {
      array.fill(128);
    });
    connect = vi.fn();
    disconnect = vi.fn();
  }

  class MockAudioContext {
    state = 'running';
    createAnalyser = vi.fn(() => new MockAnalyserNode());
    createMediaStreamSource = vi.fn(() => ({
      connect: vi.fn(),
      disconnect: vi.fn(),
    }));
    resume = vi.fn().mockResolvedValue(undefined);
    close = vi.fn().mockResolvedValue(undefined);
  }

  (window as unknown as { AudioContext: typeof MockAudioContext }).AudioContext = MockAudioContext;
  (window as unknown as { webkitAudioContext: typeof MockAudioContext }).webkitAudioContext = MockAudioContext;

  // MediaDevices mock
  if (!navigator.mediaDevices) {
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue({
          getTracks: () => [
            { stop: vi.fn(), kind: 'audio', enabled: true },
            { stop: vi.fn(), kind: 'video', enabled: true },
          ],
          getAudioTracks: () => [{ stop: vi.fn(), enabled: true }],
          getVideoTracks: () => [{ stop: vi.fn(), enabled: true }],
        }),
        enumerateDevices: vi.fn().mockResolvedValue([
          { deviceId: 'default', kind: 'audioinput', label: 'Default Microphone' },
          { deviceId: 'camera1', kind: 'videoinput', label: 'Integrated Camera' },
        ]),
      },
    });
  }
}
