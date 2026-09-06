import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export interface RadarMetric {
  key: string;
  label: string;
  value: number; // Candidate Score (0-100)
  benchmarkValue?: number; // Optional Target/Hiring Bar Score (0-100)
  fullMark?: number; // Default 100
  description?: string; // Optional evaluation feedback
}

export interface RadarChartProps {
  data: RadarMetric[];
  title?: string;
  subtitle?: string;
  maxScore?: number;
  size?: number; // ViewBox dimension (default 400)
  className?: string;
  showBenchmark?: boolean;
  benchmarkLabel?: string;
  seriesLabel?: string;
  levels?: number; // Number of concentric grid polygons (default 5: 20, 40, 60, 80, 100)
  animated?: boolean;
  showTooltips?: boolean;
  showLegend?: boolean;
}

export default function RadarChart({
  data,
  title,
  subtitle,
  maxScore = 100,
  size = 400,
  className = '',
  showBenchmark = true,
  benchmarkLabel = 'FANG Hiring Bar Target',
  seriesLabel = 'Candidate Performance',
  levels = 5,
  animated = true,
  showTooltips = true,
  showLegend = true,
}: RadarChartProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const radius = 125; // Leaving 75px on all sides for axis labels

  const numAxes = data.length;

  // Calculate geometric angles for each axis starting at 12 o'clock (-PI / 2)
  const angles = useMemo(() => {
    return data.map((_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / numAxes);
  }, [data, numAxes]);

  // Generate concentric polygon grid points
  const gridRings = useMemo(() => {
    const rings: { points: string; level: number; radius: number }[] = [];
    for (let l = 1; l <= levels; l++) {
      const levelRadius = (l / levels) * radius;
      const pts = angles
        .map((a) => {
          const x = cx + levelRadius * Math.cos(a);
          const y = cy + levelRadius * Math.sin(a);
          return `${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(' ');
      rings.push({ points: pts, level: l, radius: levelRadius });
    }
    return rings;
  }, [angles, cx, cy, levels, radius]);

  // Compute candidate data polygon points & coordinates
  const { candidatePoints, candidateCoords } = useMemo(() => {
    const coords = data.map((d, i) => {
      const clampedVal = Math.max(0, Math.min(maxScore, d.value));
      const r = (clampedVal / maxScore) * radius;
      const x = cx + r * Math.cos(angles[i]);
      const y = cy + r * Math.sin(angles[i]);
      return { x, y, value: clampedVal, metric: d };
    });
    const points = coords.map((c) => `${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(' ');
    return { candidatePoints: points, candidateCoords: coords };
  }, [data, maxScore, radius, cx, cy, angles]);

  // Compute benchmark polygon points & coordinates (if benchmark data exists)
  const { hasBenchmarkData, benchmarkPoints, benchmarkCoords } = useMemo(() => {
    const hasData = showBenchmark && data.some((d) => d.benchmarkValue !== undefined);
    if (!hasData) return { hasBenchmarkData: false, benchmarkPoints: '', benchmarkCoords: [] };

    const coords = data.map((d, i) => {
      const benchmarkVal = Math.max(0, Math.min(maxScore, d.benchmarkValue ?? 75));
      const r = (benchmarkVal / maxScore) * radius;
      const x = cx + r * Math.cos(angles[i]);
      const y = cy + r * Math.sin(angles[i]);
      return { x, y, value: benchmarkVal, metric: d };
    });
    const points = coords.map((c) => `${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(' ');
    return { hasBenchmarkData: true, benchmarkPoints: points, benchmarkCoords: coords };
  }, [data, showBenchmark, maxScore, radius, cx, cy, angles]);

  // Calculate axis outer endpoint & label coordinates
  const axisEndpoints = useMemo(() => {
    return angles.map((a, i) => {
      const spokeX = cx + radius * Math.cos(a);
      const spokeY = cy + radius * Math.sin(a);

      // Label placed slightly further out
      const labelRadius = radius + 28;
      const labelX = cx + labelRadius * Math.cos(a);
      const labelY = cy + labelRadius * Math.sin(a);

      const cos = Math.cos(a);
      const sin = Math.sin(a);

      let textAnchor: 'start' | 'middle' | 'end' = 'middle';
      if (cos > 0.25) textAnchor = 'start';
      else if (cos < -0.25) textAnchor = 'end';

      let dominantBaseline: 'auto' | 'central' | 'hanging' = 'central';
      if (sin < -0.5) dominantBaseline = 'auto';
      else if (sin > 0.5) dominantBaseline = 'hanging';

      return {
        spokeX,
        spokeY,
        labelX,
        labelY,
        textAnchor,
        dominantBaseline,
        metric: data[i],
      };
    });
  }, [angles, cx, cy, radius, data]);

  if (!data || data.length < 3) {
    return (
      <div className="p-8 text-center bg-obsidian-900 bg-[#111318] border border-white/[0.08] rounded-2xl text-slate-400 font-mono text-xs">
        Competency radar requires at least 3 dimensions to render.
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Chart Headers */}
      {(title || subtitle) && (
        <div className="w-full text-center mb-3">
          {title && (
            <h4 className="text-sm font-bold font-display uppercase tracking-widest text-white">
              {title}
            </h4>
          )}
          {subtitle && (
            <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* SVG Container */}
      <div className="relative w-full max-w-[420px] aspect-square">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full overflow-visible"
          role="img"
          aria-label={title || 'Competency Radar Chart'}
        >
          <defs>
            {/* Solar Orange Fill Gradient */}
            <linearGradient id="solar-radar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0.15" />
            </linearGradient>

            {/* Glowing filter for data polygon */}
            <filter id="solar-radar-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Accessible title and description for screen readers */}
          <title>{title || 'Competency Radar Chart'}</title>
          <desc>
            {data.map((d) => `${d.label}: ${d.value} out of ${maxScore}`).join(', ')}
          </desc>

          {/* 1. Background Concentric Polygons */}
          {gridRings.map((ring) => (
            <polygon
              key={`ring-${ring.level}`}
              points={ring.points}
              fill={ring.level === levels ? 'rgba(255, 255, 255, 0.02)' : 'none'}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              strokeDasharray={ring.level < levels ? '3 3' : 'none'}
            />
          ))}

          {/* 2. Grid Level Axis Ticks (rendered on 12 o'clock spoke) */}
          {gridRings.map((ring) => (
            <text
              key={`tick-${ring.level}`}
              x={cx + 4}
              y={cy - ring.radius + 3}
              fill="rgba(255, 255, 255, 0.25)"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {Math.round((ring.level / levels) * maxScore)}
            </text>
          ))}

          {/* 3. Spoke Lines from Center to Perimeter */}
          {axisEndpoints.map((axis, i) => (
            <line
              key={`spoke-${i}`}
              x1={cx}
              y1={cy}
              x2={axis.spokeX}
              y2={axis.spokeY}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          ))}

          {/* 4. Benchmark Target Polygon (if active) */}
          {hasBenchmarkData && (
            <motion.polygon
              initial={animated ? { opacity: 0, scale: 0.8 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
              points={benchmarkPoints}
              fill="rgba(56, 189, 248, 0.08)"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* 5. Candidate Performance Polygon */}
          <motion.polygon
            initial={animated ? { opacity: 0, scale: 0.7 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            points={candidatePoints}
            fill="url(#solar-radar-grad)"
            stroke="#FF7A00"
            strokeWidth="2.5"
            filter="url(#solar-radar-glow)"
          />

          {/* 6. Benchmark Nodes */}
          {hasBenchmarkData &&
            benchmarkCoords.map((pt, i) => (
              <circle
                key={`bench-node-${i}`}
                cx={pt.x}
                cy={pt.y}
                r="3"
                fill="#38BDF8"
                stroke="#0A0B0E"
                strokeWidth="1"
              />
            ))}

          {/* 7. Candidate Data Nodes (Interactive) */}
          {candidateCoords.map((pt, i) => {
            const isHovered = activeIdx === i;
            return (
              <circle
                key={`cand-node-${i}`}
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 6 : 4}
                fill={isHovered ? '#FF7A00' : '#111318'}
                stroke="#FF7A00"
                strokeWidth={isHovered ? 2.5 : 2}
                tabIndex={0}
                role="button"
                aria-label={`${pt.metric.label}: ${pt.value}/${maxScore}`}
                className="cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-solar-orange-500"
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                onFocus={() => setActiveIdx(i)}
                onBlur={() => setActiveIdx(null)}
              />
            );
          })}

          {/* 8. Axis Labels */}
          {axisEndpoints.map((axis, i) => {
            const isHovered = activeIdx === i;
            return (
              <text
                key={`label-${i}`}
                x={axis.labelX}
                y={axis.labelY}
                textAnchor={axis.textAnchor}
                dominantBaseline={axis.dominantBaseline}
                className="cursor-pointer"
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <tspan
                  className={`font-display text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                    isHovered ? 'fill-solar-orange-500 fill-[#FF7A00]' : 'fill-slate-300'
                  }`}
                >
                  {axis.metric.label}
                </tspan>
                <tspan
                  className={`font-mono text-[10px] font-black transition-colors duration-200 ${
                    isHovered ? 'fill-white' : 'fill-solar-orange-500 fill-[#FF7A00]'
                  }`}
                  dx="4"
                >
                  {axis.metric.value}
                </tspan>
              </text>
            );
          })}

          {/* 9. Dynamic Interactive Tooltip */}
          {showTooltips && activeIdx !== null && (
            <g
              transform={`translate(${Math.max(
                70,
                Math.min(size - 70, candidateCoords[activeIdx].x)
              )}, ${Math.max(
                45,
                Math.min(size - 45, candidateCoords[activeIdx].y - 20)
              )})`}
              className="pointer-events-none"
            >
              {/* Tooltip Background Card */}
              <rect
                x="-65"
                y="-32"
                width="130"
                height="38"
                rx="8"
                fill="#181B22"
                stroke="#FF7A00"
                strokeWidth="1.2"
                strokeOpacity="0.6"
                filter="drop-shadow(0 4px 12px rgba(0,0,0,0.6))"
              />
              {/* Metric Label */}
              <text
                x="0"
                y="-18"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight="bold"
                className="uppercase tracking-wider"
              >
                {data[activeIdx].label}
              </text>
              {/* Candidate Score vs Target */}
              <text
                x="0"
                y="-6"
                textAnchor="middle"
                fill="#FF7A00"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Score: {data[activeIdx].value}
                {hasBenchmarkData && data[activeIdx].benchmarkValue !== undefined && (
                  <tspan fill="#38BDF8" dx="4">
                    | Bar: {data[activeIdx].benchmarkValue}
                  </tspan>
                )}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Accessible Table for Screen Readers (WCAG 2.2 AA) */}
      <table className="sr-only">
        <caption>{title || 'Competency Radar Evaluation'}</caption>
        <thead>
          <tr>
            <th scope="col">Competency Dimension</th>
            <th scope="col">Candidate Score</th>
            {hasBenchmarkData && <th scope="col">Hiring Bar Target</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.key}>
              <th scope="row">{item.label}</th>
              <td>{item.value} / {maxScore}</td>
              {hasBenchmarkData && <td>{item.benchmarkValue ?? 'N/A'} / {maxScore}</td>}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3 pt-3 border-t border-white/[0.08] text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-solar-orange-500 bg-[#FF7A00] shadow-[0_0_6px_rgba(255,122,0,0.5)]" />
            <span className="text-slate-300 font-semibold">{seriesLabel}</span>
          </div>
          {hasBenchmarkData && (
            <div className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 border-b-2 border-dashed border-sky-400" />
              <span className="text-sky-400 font-semibold">{benchmarkLabel}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
