import { describe, it, expect } from 'vitest';

/**
 * Tier 2 Boundary Tests: Feature 6 (SVG Radar Chart)
 * Boundary & Corner Cases:
 * - All scores zero (0,0,0,0,0) -> collapsed central dot
 * - All scores maximum (100,100,100,100,100) -> full outer perimeter
 * - Single-axis spike (100 on axis 0, 0 on all others) -> single needle line
 * - NaN, null, and undefined value handling
 * - Odd or variable number of competency dimensions (e.g. 3 or 6 axes)
 */

interface Dimension {
  label: string;
  value: number;
}

function generateSafePolygon(dims: Dimension[], cx = 150, cy = 150, radius = 100): string {
  if (dims.length < 3) return `${cx},${cy}`;
  const angleStep = (Math.PI * 2) / dims.length;
  return dims
    .map((dim, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const rawVal = Number.isFinite(dim.value) ? dim.value : 0;
      const normalized = Math.max(0, Math.min(100, rawVal)) / 100;
      const x = cx + radius * normalized * Math.cos(angle);
      const y = cy + radius * normalized * Math.sin(angle);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

describe('Tier 2 Boundaries — Feature 6: SVG Radar Chart', () => {
  it('should collapse to central coordinates (cx,cy) when all scores are 0', () => {
    const allZero: Dimension[] = [
      { label: 'A', value: 0 },
      { label: 'B', value: 0 },
      { label: 'C', value: 0 },
      { label: 'D', value: 0 },
      { label: 'E', value: 0 },
    ];
    const points = generateSafePolygon(allZero, 150, 150, 100);
    const pairs = points.split(' ');
    pairs.forEach((pair) => {
      expect(pair).toBe('150.00,150.00');
    });
  });

  it('should reach maximum perimeter radius when all scores are 100', () => {
    const allMax: Dimension[] = [
      { label: 'A', value: 100 },
      { label: 'B', value: 100 },
      { label: 'C', value: 100 },
    ];
    const points = generateSafePolygon(allMax, 150, 150, 100);
    const [topX, topY] = points.split(' ')[0].split(',').map(Number);
    expect(topX).toBeCloseTo(150, 1);
    expect(topY).toBeCloseTo(50, 1); // 150 - 100 = 50
  });

  it('should sanitize NaN and undefined inputs without producing "NaN,NaN" in SVG path', () => {
    const dirtyDims: Dimension[] = [
      { label: 'A', value: NaN },
      { label: 'B', value: undefined as unknown as number },
      { label: 'C', value: 75 },
    ];
    const points = generateSafePolygon(dirtyDims, 150, 150, 100);
    expect(points).not.toContain('NaN');
    expect(points).not.toContain('undefined');
  });

  it('should handle single spike (only one dimension nonzero) cleanly', () => {
    const spikeDims: Dimension[] = [
      { label: 'Spike', value: 100 },
      { label: 'Zero1', value: 0 },
      { label: 'Zero2', value: 0 },
      { label: 'Zero3', value: 0 },
    ];
    const points = generateSafePolygon(spikeDims, 150, 150, 100);
    const pairs = points.split(' ');
    expect(pairs[0]).toBe('150.00,50.00');
    expect(pairs[1]).toBe('150.00,150.00');
    expect(pairs[2]).toBe('150.00,150.00');
    expect(pairs[3]).toBe('150.00,150.00');
  });

  it('should fallback to center point if fewer than 3 dimensions are provided', () => {
    const twoDims: Dimension[] = [
      { label: 'A', value: 80 },
      { label: 'B', value: 90 },
    ];
    expect(generateSafePolygon(twoDims, 150, 150, 100)).toBe('150,150');
  });
});
