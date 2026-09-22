import React from 'react';
import { Award, Brain, Zap, Target, Eye, TrendingUp, Calendar, Layers } from 'lucide-react';

interface PerformanceSnapshotProps {
  overallScore: number | null;
  totalAnalyzedSessions: number;
  lastAnalyzedDate: string | null;
  overallTrend: 'UP' | 'DOWN' | 'STABLE' | 'NO_DATA';
  technicalScore: number | null;
  communicationScore: number | null;
  problemSolvingScore: number | null;
  deliveryScore: number | null;
}

export default function PerformanceSnapshot({
  overallScore,
  totalAnalyzedSessions,
  lastAnalyzedDate,
  overallTrend,
  technicalScore,
  communicationScore,
  problemSolvingScore,
  deliveryScore,
}: PerformanceSnapshotProps) {
  const getTrendBadge = () => {
    switch (overallTrend) {
      case 'UP':
        return <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">↑ Improving</span>;
      case 'DOWN':
        return <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">↓ Declining</span>;
      case 'STABLE':
        return <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">→ Stable</span>;
      default:
        return <span className="text-xs text-slate-500 font-mono">No Trend Data</span>;
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Top Banner Row */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-white via-[#EFFAFD] to-blue-50 border border-[#DCE7F2] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2459A8] bg-white px-2.5 py-0.5 rounded-full border border-[#DCE7F2]">
            Career Performance Profile
          </span>
          <h2 className="text-xl font-bold font-display text-[#11183D]">
            Overall Interview Readiness
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#526078] font-mono pt-1">
            <span>Evidence: <strong>{totalAnalyzedSessions} Analyzed Sessions</strong></span>
            {lastAnalyzedDate && (
              <span className="flex items-center gap-1">
                <Calendar size={12} /> Last Analyzed: <strong>{lastAnalyzedDate}</strong>
              </span>
            )}
            <div className="flex items-center gap-1">
              <span>Trend:</span>
              {getTrendBadge()}
            </div>
          </div>
        </div>

        {/* Big Overall Gauge */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[#DCE7F2] self-stretch md:self-auto justify-center shadow-2xs">
          <div className="text-center">
            <span className="text-3xl font-bold font-mono text-[#11183D]">
              {overallScore !== null ? `${overallScore}%` : '--'}
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#526078] mt-0.5">
              Aggregate Score
            </span>
          </div>
        </div>
      </div>

      {/* 4 Supporting KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Technical Performance */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#526078]">
            <span className="text-xs font-bold uppercase tracking-wider">Technical Performance</span>
            <Brain size={18} className="text-[#2459A8]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#11183D]">
              {technicalScore !== null ? `${technicalScore}%` : '--'}
            </span>
            <span className="text-[11px] text-[#526078]">Algorithmic & System Depth</span>
          </div>
        </div>

        {/* KPI 2: Communication & Explanation */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#526078]">
            <span className="text-xs font-bold uppercase tracking-wider">Communication & Explanation</span>
            <Zap size={18} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#11183D]">
              {communicationScore !== null ? `${communicationScore}%` : '--'}
            </span>
            <span className="text-[11px] text-[#526078]">STAR Pacing & Clarity</span>
          </div>
        </div>

        {/* KPI 3: Problem Solving */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#526078]">
            <span className="text-xs font-bold uppercase tracking-wider">Problem Solving</span>
            <Target size={18} className="text-purple-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#11183D]">
              {problemSolvingScore !== null ? `${problemSolvingScore}%` : '--'}
            </span>
            <span className="text-[11px] text-[#526078]">Analytical Reasoning</span>
          </div>
        </div>

        {/* KPI 4: Delivery & Presentation */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#526078]">
            <span className="text-xs font-bold uppercase tracking-wider">Delivery & Presentation</span>
            <Eye size={18} className="text-amber-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#11183D]">
              {deliveryScore !== null ? `${deliveryScore}%` : '--'}
            </span>
            <span className="text-[11px] text-[#526078]">Speech & Camera Telemetry</span>
          </div>
        </div>
      </div>
    </div>
  );
}
