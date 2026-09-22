import React, { useState } from 'react';
import { SessionTimelinePoint } from '../../utils/careerAnalyticsAggregator';
import { TrendingUp, ExternalLink, Sparkles, ArrowRight, Video, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PerformanceTrendChartProps {
  points: SessionTimelinePoint[];
}

export default function PerformanceTrendChart({ points }: PerformanceTrendChartProps) {
  const navigate = useNavigate();
  const [hoveredPoint, setHoveredPoint] = useState<SessionTimelinePoint | null>(points[points.length - 1] || null);

  if (!points || points.length === 0) {
    return null;
  }

  const chartHeight = 180;
  const paddingY = 20;

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#DCE7F2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#2459A8]" />
            <h3 className="text-lg font-bold font-display text-[#11183D]">
              Performance Trend Across Interview Sessions
            </h3>
          </div>
          <p className="text-xs text-[#526078] mt-0.5">
            Plotting real evaluation scores chronologically. Hover over data points to inspect session evidence.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
          {points.length} Data Point{points.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Actual Plot Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* SVG Session Scatter/Line Plot */}
        <div className="lg:col-span-2 relative bg-slate-50 border border-[#DCE7F2] rounded-2xl p-4 min-h-[220px] flex flex-col justify-between">
          <div className="h-[180px] w-full flex items-end justify-between relative px-6">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-2 border-b border-slate-200/60 border-dashed" />
            <div className="absolute inset-x-0 top-1/2 border-b border-slate-200/60 border-dashed" />
            <div className="absolute inset-x-0 bottom-2 border-b border-slate-200/60 border-dashed" />

            {/* Connecting line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
              {points.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#2459A8"
                  strokeWidth="2.5"
                  strokeDasharray="0"
                  points={points
                    .map((p, idx) => {
                      const x = (idx / (points.length - 1 || 1)) * 90 + 5; // percentage
                      const y = chartHeight - ((p.score - 40) / 60) * (chartHeight - paddingY * 2) - paddingY;
                      return `${x}%,${y}`;
                    })
                    .join(' ')}
                />
              )}
            </svg>

            {/* Data Point Nodes */}
            {points.map((p, idx) => {
              const isHovered = hoveredPoint?.id === p.id;
              const yPercent = ((p.score - 40) / 60) * 80 + 10;

              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoveredPoint(p)}
                  onClick={() => navigate(p.analysisUrl)}
                  style={{ bottom: `${yPercent}%` }}
                  className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                    isHovered
                      ? 'bg-[#2459A8] text-white border-white scale-125 shadow-md'
                      : 'bg-white text-[#2459A8] border-[#2459A8] hover:scale-110'
                  }`}
                  title={`${p.title}: ${p.score}%`}
                >
                  <span className="text-[10px] font-bold font-mono">{p.score}</span>
                </div>
              );
            })}
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[11px] font-mono font-bold text-[#526078] pt-2 px-2 border-t border-slate-200">
            {points.map((p, idx) => (
              <span key={p.id} className="truncate max-w-[80px]">
                {p.date}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Inspector Card */}
        {hoveredPoint ? (
          <div className="p-5 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2459A8] uppercase tracking-wider flex items-center gap-1">
                {hoveredPoint.interviewType === 'CODING' ? <Code2 size={14} /> : <Video size={14} />}
                {hoveredPoint.interviewType} SESSION
              </span>
              <span className="font-mono text-[#526078]">{hoveredPoint.date}</span>
            </div>

            <div>
              <h4 className="text-base font-bold text-[#11183D]">{hoveredPoint.title}</h4>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-[#11183D]">{hoveredPoint.score}%</span>
                <span className="text-xs text-[#526078]">Evaluation Score</span>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-[#DCE7F2] pt-3">
              <div>
                <span className="font-bold text-emerald-800">Primary Strength:</span>
                <p className="text-[#526078] mt-0.5">{hoveredPoint.topStrength}</p>
              </div>
              <div>
                <span className="font-bold text-amber-800">Area to Refine:</span>
                <p className="text-[#526078] mt-0.5">{hoveredPoint.topWeakness}</p>
              </div>
            </div>

            <button
              onClick={() => navigate(hoveredPoint.analysisUrl)}
              className="w-full py-2 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>View Interview Analysis</span>
              <ExternalLink size={13} />
            </button>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#526078] italic bg-slate-50 rounded-2xl border border-[#DCE7F2]">
            Hover over a data point to inspect session details.
          </div>
        )}
      </div>
    </div>
  );
}
