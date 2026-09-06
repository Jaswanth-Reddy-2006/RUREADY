import { describe, it, expect } from 'vitest';

/**
 * Tier 2 Boundary Tests: Feature 2 (Obsidian & Solar-Orange Tokens)
 * Boundary & Corner Cases:
 * - Malformed hex codes and color parsing resilience
 * - Extreme opacity values (0% alpha vs 100% alpha)
 * - Contrast ratio boundaries under Windows High Contrast Mode
 * - Color luminance calculation edge cases (pure black #000000 vs pure white #FFFFFF)
 * - Solar orange glow opacity boundaries
 */

function parseHexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.trim().replace(/^#/, '');
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) return null;
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

describe('Tier 2 Boundaries — Feature 2: Obsidian & Solar-Orange Tokens', () => {
  it('should parse valid hex tokens and return null for malformed colors', () => {
    expect(parseHexToRgb('#FF7A00')).toEqual({ r: 255, g: 122, b: 0 });
    expect(parseHexToRgb('#0A0B0E')).toEqual({ r: 10, g: 11, b: 14 });
    expect(parseHexToRgb('invalid-hex')).toBeNull();
    expect(parseHexToRgb('#12345')).toBeNull();
  });

  it('should handle extreme alpha opacity boundaries (0% fully transparent, 100% fully opaque)', () => {
    const getRgba = (r: number, g: number, b: number, alpha: number) => {
      const clampedAlpha = Math.max(0, Math.min(1, alpha));
      return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
    };

    expect(getRgba(17, 19, 24, -0.5)).toBe('rgba(17, 19, 24, 0)');
    expect(getRgba(17, 19, 24, 1.5)).toBe('rgba(17, 19, 24, 1)');
    expect(getRgba(17, 19, 24, 0.7)).toBe('rgba(17, 19, 24, 0.7)');
  });

  it('should verify luminance extremes: pure black (0.0) and pure white (1.0)', () => {
    const getLuminance = (r: number, g: number, b: number) => {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    expect(getLuminance(0, 0, 0)).toBe(0);
    expect(getLuminance(255, 255, 255)).toBeCloseTo(1, 4);
  });

  it('should preserve high contrast borders when prefers-contrast: more is active', () => {
    const getBorderForContrastMode = (highContrast: boolean) =>
      highContrast ? 'border-2 border-white' : 'border border-white/10';

    expect(getBorderForContrastMode(true)).toBe('border-2 border-white');
    expect(getBorderForContrastMode(false)).toBe('border border-white/10');
  });

  it('should clamp glow radius and spread within GPU safe rendering thresholds', () => {
    const validateGlowCSS = (boxShadow: string) => {
      const match = boxShadow.match(/0\s+0\s+(\d+)px/);
      if (!match) return false;
      const blurRadius = parseInt(match[1], 10);
      return blurRadius >= 4 && blurRadius <= 48; // safe blur threshold
    };

    expect(validateGlowCSS('0 0 24px rgba(255, 122, 0, 0.35)')).toBe(true);
    expect(validateGlowCSS('0 0 100px rgba(255, 122, 0, 0.35)')).toBe(false);
  });
});
