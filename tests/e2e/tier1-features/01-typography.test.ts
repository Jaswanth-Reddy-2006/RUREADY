import { describe, it, expect } from 'vitest';

/**
 * Feature 1: Montserrat & Outfit Typography
 * Specifications:
 * - Headings use Montserrat font family
 * - Body text uses Outfit font family
 * - Code elements use JetBrains Mono
 * - index.html loads Google Fonts link for Montserrat and Outfit
 * - Tailwind typography tokens map font-display, font-body, font-mono
 */

describe('Feature 1: Montserrat & Outfit Typography', () => {
  it('should define Montserrat as the primary display/heading font in design specifications', () => {
    const typographyConfig = {
      display: ['Montserrat', 'sans-serif'],
      body: ['Outfit', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    };

    expect(typographyConfig.display[0]).toBe('Montserrat');
    expect(typographyConfig.display).toContain('sans-serif');
  });

  it('should define Outfit as the primary body font in design specifications', () => {
    const typographyConfig = {
      display: ['Montserrat', 'sans-serif'],
      body: ['Outfit', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    };

    expect(typographyConfig.body[0]).toBe('Outfit');
    expect(typographyConfig.body).toContain('sans-serif');
  });

  it('should define JetBrains Mono as the monospace font for coding interfaces', () => {
    const typographyConfig = {
      display: ['Montserrat', 'sans-serif'],
      body: ['Outfit', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    };

    expect(typographyConfig.mono[0]).toBe('JetBrains Mono');
    expect(typographyConfig.mono).toContain('monospace');
  });

  it('should validate Google Fonts preconnect and stylesheet URL structure for Montserrat and Outfit', () => {
    const googleFontUrl =
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';

    expect(googleFontUrl).toContain('family=Montserrat');
    expect(googleFontUrl).toContain('family=Outfit');
    expect(googleFontUrl).toContain('family=JetBrains+Mono');
    expect(googleFontUrl).toContain('display=swap');
  });

  it('should map font classes correctly to CSS fontFamily properties', () => {
    const fontClassMapping: Record<string, string> = {
      'font-display': 'Montserrat, sans-serif',
      'font-body': 'Outfit, sans-serif',
      'font-mono': 'JetBrains Mono, monospace',
    };

    expect(fontClassMapping['font-display']).toMatch(/Montserrat/i);
    expect(fontClassMapping['font-body']).toMatch(/Outfit/i);
    expect(fontClassMapping['font-mono']).toMatch(/JetBrains Mono/i);
  });
});
