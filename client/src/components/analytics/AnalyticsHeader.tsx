import React from 'react';
import { TrendingUp, Sparkles, ShieldCheck, Layers } from 'lucide-react';
import { EvidenceStateLevel } from '../../utils/careerAnalyticsAggregator';

interface AnalyticsHeaderProps {
  totalAnalyzedSessions: number;
  evidenceLevelLabel: string;
  evidenceLevel: EvidenceStateLevel;
}

export default function AnalyticsHeader({
  totalAnalyzedSessions,
  evidenceLevelLabel,
  evidenceLevel,
}: AnalyticsHeaderProps) {
  const getBadgeColor = () => {
    switch (evidenceLevel) {
      case 'NO_EVIDENCE':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'LIMITED_EVIDENCE':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'DEVELOPING_PROFILE':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'ESTABLISHED_PROFILE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE7F2] font-sans">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFFAFD] border border-[#2459A8]/30 text-[#2459A8] text-xs font-bold tracking-wide">
          <ShieldCheck size={14} />
          <span>Evidence-based performance analytics</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#11183D] tracking-tight">
          Career Analytics & Insights
        </h1>

        <p className="text-xs sm:text-sm text-[#526078] max-w-2xl">
          Understand your progress, identify skill gaps, and see what to work on next.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <div className={`px-3.5 py-2 rounded-2xl border text-xs font-bold font-mono flex items-center gap-2 ${getBadgeColor()}`}>
          <Sparkles size={14} className="text-[#2459A8]" />
          <span>{totalAnalyzedSessions} Analyzed Session{totalAnalyzedSessions === 1 ? '' : 's'}</span>
          <span className="opacity-40">•</span>
          <span className="font-sans font-semibold">{evidenceLevelLabel}</span>
        </div>
      </div>
    </div>
  );
}
