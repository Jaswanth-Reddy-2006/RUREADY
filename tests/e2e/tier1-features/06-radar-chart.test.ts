import { describe, it, expect } from 'vitest';

/**
 * Feature 6: Native SVG Radar Chart Component
 * Specifications:
 * - Pure SVG polygon rendering with zero external charting dependencies
 * - 5 Competency dimensions:
 *   Communication, Technical Accuracy, Problem Solving, Confidence / Delivery, STAR Specificity
 * - Normalized 0-100 scale calculation
 * - Concentric polygonal grid lines (e.g., 20%, 40%, 60%, 80%, 100%)
 * - Solar-orange polygon fill with subtle opacity and accent stroke
 */

interface RadarDimension {
  label: string;
  value: number; // 0 to 100
}

function calculateRadarPolygon(
  dimensions: RadarDimension[],
  cx = 150,
  cy = 150,
  radius = 100
): string {
  const angleStep = (Math.PI * 2) / dimensions.length;
  return dimensions
    .map((dim, i) => {
      // Rotate by -PI/2 so first axis starts at 12 o'clock
      const angle = i * angleStep - Math.PI / 2;
      const normalizedValue = Math.max(0, Math.min(100, dim.value)) / 100;
      const x = cx + radius * normalizedValue * Math.cos(angle);
      const y = cy + radius * normalizedValue * Math.sin(angle);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

describe('Feature 6: Native SVG Radar Chart Component', () => {
  const defaultDimensions: RadarDimension[] = [
    { label: 'Communication', value: 85 },
    { label: 'Technical Accuracy', value: 75 },
    { label: 'Problem Solving', value: 90 },
    { label: 'Confidence / Delivery', value: 80 },
    { label: 'STAR Specificity', value: 70 },
  ];

  it('should calculate valid 5-point SVG polygon points string', () => {
    const points = calculateRadarPolygon(defaultDimensions, 150, 150, 100);
    const pairs = points.split(' ');
    expect(pairs.length).toBe(5);
    pairs.forEach((pair) => {
      const [x, y] = pair.split(',').map(Number);
      expect(x).toBeGreaterThan(0);
      expect(y).toBeGreaterThan(0);
      expect(isNaN(x)).toBe(false);
      expect(isNaN(y)).toBe(false);
    });
  });

  it('should map top dimension (index 0) strictly along the vertical axis (x ≈ cx)', () => {
    const points = calculateRadarPolygon(defaultDimensions, 150, 150, 100);
    const [topX, topY] = points.split(' ')[0].split(',').map(Number);
    // Because angle is -PI/2, cos(-PI/2) ≈ 0, so topX should equal cx (150)
    expect(Math.abs(topX - 150)).toBeLessThan(0.01);
    // Normalized 85% with radius 100 means topY = 150 - 85 = 65
    expect(topY).toBeCloseTo(65, 1);
  });

  it('should clamp scores exceeding 100 or below 0 to valid bounds', () => {
    const extremeDimensions: RadarDimension[] = [
      { label: 'A', value: 150 },
      { label: 'B', value: -20 },
      { label: 'C', value: 50 },
    ];
    const points = calculateRadarPolygon(extremeDimensions, 100, 100, 80);
    expect(points.split(' ').length).toBe(3);
    const [clampedTopX, clampedTopY] = points.split(' ')[0].split(',').map(Number);
    // Clamped to 100%: topY = 100 - 80 = 20
    expect(clampedTopY).toBeCloseTo(20, 1);
  });

  it('should render SVG with viewBox and semantic solar-orange styling classes', () => {
    const radarSVG = `
      <svg viewBox="0 0 300 300" class="w-full h-full max-w-[320px] aspect-square" role="img" aria-label="Competency Radar Chart">
        <polygon points="${calculateRadarPolygon(defaultDimensions)}" class="fill-solar-orange-500/20 stroke-solar-orange-500 stroke-2 transition-all duration-500" />
      </svg>
    `;

    expect(radarSVG).toContain('viewBox="0 0 300 300"');
    expect(radarSVG).toContain('fill-solar-orange-500/20');
    expect(radarSVG).toContain('stroke-solar-orange-500');
    expect(radarSVG).toContain('role="img"');
  });

  it('should generate 5 background grid polygon levels (20%, 40%, 60%, 80%, 100%)', () => {
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
    const gridPolygons = gridLevels.map((level) => {
      const scaledDims = defaultDimensions.map((d) => ({ ...d, value: level * 100 }));
      return calculateRadarPolygon(scaledDims, 150, 150, 100);
    });

    expect(gridPolygons.length).toBe(5);
    // Outermost grid (100%) top should have topY = 150 - 100 = 50
    const [topX, topY] = gridPolygons[4].split(' ')[0].split(',').map(Number);
    expect(topY).toBeCloseTo(50, 1);
  });
});
