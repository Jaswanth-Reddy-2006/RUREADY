import React from 'react';
import { PriorityImprovement } from '../../utils/careerAnalyticsAggregator';
import { AlertTriangle, BookOpen, Target, ArrowRight, Eye, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PriorityImprovementsSectionProps {
  improvements: PriorityImprovement[];
  onOpenEvidence: (title: string, items: any[]) => void;
}

export default function PriorityImprovementsSection({
  improvements,
  onOpenEvidence,
}: PriorityImprovementsSectionProps) {
  const navigate = useNavigate();

  if (!improvements || improvements.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs font-sans space-y-2">
        <h3 className="text-base font-bold font-display text-[#11183D] flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-600" />
          <span>Priority Improvements</span>
        </h3>
        <p className="text-xs text-[#526078] italic">
          No critical performance bottlenecks detected yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
        <h3 className="text-base font-bold font-display text-[#11183D] flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-600" />
          <span>Priority Improvements</span>
        </h3>
        <span className="text-xs text-[#526078] font-mono">Actionable Growth Areas</span>
      </div>

      <div className="space-y-3">
        {improvements.map((imp, idx) => (
          <div
            key={imp.id}
            className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-900">{idx + 1}.</span>
                <span className="font-bold text-[#11183D]">{imp.title}</span>
                <span className="font-mono text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                  {imp.score}%
                </span>
              </div>
              <p className="text-[#526078] leading-relaxed">{imp.reason}</p>
              <p className="text-[11px] text-slate-500 font-mono">
                Evidence: <strong>{imp.evidenceCount} interview moments</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => onOpenEvidence(imp.title, imp.evidenceItems)}
                className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <Eye size={12} />
                <span>Evidence</span>
              </button>

              <button
                onClick={() => navigate(imp.actionUrl)}
                className="px-3 py-1.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
              >
                <span>{imp.actionLabel}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
