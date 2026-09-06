import { describe, it, expect } from 'vitest';
import React from '../../client/node_modules/react';
import { renderToString } from '../../client/node_modules/react-dom/server';
import RadarChart, { RadarMetric } from '../../client/src/components/ui/RadarChart';

// Helper to calculate WCAG 2.2 relative luminance and contrast ratio
export function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Challenger Adversarial: RadarChart Geometry & Error Handling', () => {
  const base5Dimensions: RadarMetric[] = [
    { key: 'comm', label: 'Communication', value: 85, benchmarkValue: 80 },
    { key: 'tech', label: 'Technical Accuracy', value: 75, benchmarkValue: 75 },
    { key: 'ps', label: 'Problem Solving', value: 90, benchmarkValue: 85 },
    { key: 'conf', label: 'Confidence / Delivery', value: 80, benchmarkValue: 70 },
    { key: 'star', label: 'STAR Specificity', value: 70, benchmarkValue: 75 },
  ];

  it('1. Score 0: renders collapsed polygon at center coordinates without crashing', () => {
    const zeroData = base5Dimensions.map((d) => ({ ...d, value: 0 }));
    let html = '';
    expect(() => {
      html = renderToString(React.createElement(RadarChart, { data: zeroData, size: 400 }));
    }).not.toThrow();

    expect(html).toContain('<svg');
    expect(html).toContain('viewBox="0 0 400 400"');
    // Center is (200.00, 200.00) for size 400
    // Candidate points should be collapsed to 200.00,200.00
    expect(html).toContain('200.00,200.00');
  });

  it('2. Score 100: renders maximum perimeter polygon with valid coordinates', () => {
    const maxData = base5Dimensions.map((d) => ({ ...d, value: 100 }));
    let html = '';
    expect(() => {
      html = renderToString(React.createElement(RadarChart, { data: maxData, size: 400 }));
    }).not.toThrow();

    expect(html).toContain('<svg');
    // Top coordinate at index 0 (angle = -PI/2): x = 200.00, y = 200 - 125 = 75.00
    expect(html).toContain('200.00,75.00');
  });

  it('3. Out-of-bounds score (> 100): clamps to maxScore and produces valid coordinates', () => {
    const oobData: RadarMetric[] = [
      { key: 'a', label: 'A', value: 150 },
      { key: 'b', label: 'B', value: 9999 },
      { key: 'c', label: 'C', value: 50 },
    ];
    let html = '';
    expect(() => {
      html = renderToString(React.createElement(RadarChart, { data: oobData, size: 400 }));
    }).not.toThrow();

    // The top axis (index 0) has value 150, which should clamp to 100 -> y = 75.00
    expect(html).toContain('200.00,75.00');
  });

  it('4. Negative scores (< 0): clamps to 0 without NaN or negative radius', () => {
    const negData: RadarMetric[] = [
      { key: 'a', label: 'A', value: -20 },
      { key: 'b', label: 'B', value: -100 },
      { key: 'c', label: 'C', value: 50 },
    ];
    let html = '';
    expect(() => {
      html = renderToString(React.createElement(RadarChart, { data: negData, size: 400 }));
    }).not.toThrow();

    // Negative values clamp to 0 -> center 200.00,200.00
    expect(html).toContain('200.00,200.00');
  });

  it('5. NaN score: observe behavior on candidate points', () => {
    const nanData: RadarMetric[] = [
      { key: 'a', label: 'A', value: NaN },
      { key: 'b', label: 'B', value: 50 },
      { key: 'c', label: 'C', value: 75 },
    ];
    let html = '';
    expect(() => {
      html = renderToString(React.createElement(RadarChart, { data: nanData, size: 400 }));
    }).not.toThrow();

    // Check if points contain NaN
    const containsNaNInPoints = html.includes('points="NaN,NaN') || html.includes('NaN');
    console.log('Adversarial Test 5: Does RadarChart output NaN in SVG points when value is NaN?', containsNaNInPoints);
    expect(typeof html).toBe('string');
  });

  it('6. 1-axis dataset: gracefully displays fallback without unhandled exception', () => {
    const singleAxis: RadarMetric[] = [{ key: 'a', label: 'A', value: 80 }];
    let html = '';
    expect(() => {
      html = renderToString(React.createElement(RadarChart, { data: singleAxis }));
    }).not.toThrow();

    expect(html).toContain('Competency radar requires at least 3 dimensions to render.');
  });

  it('7. 2-axis dataset: gracefully displays fallback without unhandled exception', () => {
    const twoAxes: RadarMetric[] = [
      { key: 'a', label: 'A', value: 80 },
      { key: 'b', label: 'B', value: 90 },
    ];
    let html = '';
    expect(() => {
      html = renderToString(React.createElement(RadarChart, { data: twoAxes }));
    }).not.toThrow();

    expect(html).toContain('Competency radar requires at least 3 dimensions to render.');
  });

  it('8. 10-axis dataset: calculates 10 valid finite angles and endpoints', () => {
    const tenAxes: RadarMetric[] = Array.from({ length: 10 }, (_, i) => ({
      key: `axis-${i}`,
      label: `Dimension ${i + 1}`,
      value: 50 + i * 5,
    }));
    let html = '';
    expect(() => {
      html = renderToString(React.createElement(RadarChart, { data: tenAxes, size: 400 }));
    }).not.toThrow();

    expect(html).toContain('<svg');
    // 10 spoke lines should be present
    expect((html.match(/<line\s/g) || []).length).toBe(10);
  });

  it('9. Empty array dataset: returns fallback message', () => {
    let html = '';
    expect(() => {
      html = renderToString(React.createElement(RadarChart, { data: [] }));
    }).not.toThrow();

    expect(html).toContain('Competency radar requires at least 3 dimensions to render.');
  });

  it('9b. Null / Undefined dataset: check if component crashes or handles gracefully', () => {
    let thrownError: Error | null = null;
    try {
      renderToString(React.createElement(RadarChart, { data: undefined as any }));
    } catch (err: any) {
      thrownError = err;
    }
    console.log('Adversarial Test 9b: Passing undefined data threw error:', thrownError ? thrownError.message : 'No error');
  });

  it('10. Accessible table rendering (WCAG 2.2 AA)', () => {
    const html = renderToString(
      React.createElement(RadarChart, {
        data: base5Dimensions,
        title: 'Interview Evaluation',
        showBenchmark: true,
      })
    );

    expect(html).toContain('<table class="sr-only"');
    expect(html).toContain('<caption>Interview Evaluation</caption>');
    expect(html).toContain('scope="col"');
    expect(html).toContain('Communication');
    expect(html).toContain('85');
    expect(html).toContain('100');
  });
});

describe('Challenger Adversarial: WCAG 2.2 AA Contrast Ratios', () => {
  const obsidianTokens = {
    'obsidian-950': '#0A0B0E',
    'obsidian-900': '#111318',
    'obsidian-850': '#14171F',
    'obsidian-800': '#181B22',
    'obsidian-750': '#1C2029',
    'obsidian-700': '#222734',
    'obsidian-600': '#2E3545',
  };

  const textTokens = {
    white: '#FFFFFF',
    'slate-300': '#CBD5E1',
    'slate-400': '#94A3B8',
    'solar-orange-500': '#FF7A00',
    'solar-orange-400': '#FF9433',
    'solar-orange-300': '#FDBA74',
    'sky-400': '#38BDF8',
  };

  it('white text on all obsidian backgrounds satisfies WCAG 2.2 AAA (>= 7.0:1)', () => {
    for (const [bgName, bgHex] of Object.entries(obsidianTokens)) {
      const ratio = getContrastRatio(textTokens.white, bgHex);
      expect(ratio).toBeGreaterThanOrEqual(7.0);
    }
  });

  it('slate-300 text on obsidian backgrounds satisfies WCAG 2.2 AA for normal text (>= 4.5:1)', () => {
    for (const [bgName, bgHex] of Object.entries(obsidianTokens)) {
      const ratio = getContrastRatio(textTokens['slate-300'], bgHex);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('solar-orange-500 on obsidian backgrounds evaluates contrast ratio', () => {
    for (const [bgName, bgHex] of Object.entries(obsidianTokens)) {
      const ratio = getContrastRatio(textTokens['solar-orange-500'], bgHex);
      // Let's test what the exact ratio is:
      // #FF7A00 luminance is ~0.33, obsidian-950 luminance is ~0.004
      // Ratio: (0.33 + 0.05) / (0.004 + 0.05) = 0.38 / 0.054 = ~7.03:1
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('evaluates text on solar-orange-500 button background', () => {
    const whiteOnOrange = getContrastRatio('#FFFFFF', '#FF7A00');
    const blackOnOrange = getContrastRatio('#0A0B0E', '#FF7A00');

    // WCAG contrast check
    // White on #FF7A00 is (1.05) / (0.33 + 0.05) = ~2.76:1 (FAILS normal text 4.5:1!)
    // Dark #0A0B0E on #FF7A00 is (0.33 + 0.05) / (0.004 + 0.05) = ~7.03:1 (PASSES AA and AAA!)
    expect(blackOnOrange).toBeGreaterThanOrEqual(4.5);
  });
});
