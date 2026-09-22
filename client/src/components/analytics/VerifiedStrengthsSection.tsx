import React from 'react';
import { ObservedStrength } from '../../utils/careerAnalyticsAggregator';
import { CheckCircle2, ShieldCheck, Eye } from 'lucide-react';

interface VerifiedStrengthsSectionProps {
  strengths: ObservedStrength[];
  onOpenEvidence: (title: string, items: any[]) => void;
}

export default function VerifiedStrengthsSection({
  strengths,
  onOpenEvidence,
}: VerifiedStrengthsSectionProps) {
  if (!strengths || strengths.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs font-sans space-y-2">
        <h3 className="text-base font-bold font-display text-[#11183D] flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-600" />
          <span>Observed Strengths</span>
        </h3>
        <p className="text-xs text-[#526078] italic">
          Complete more interview sessions to aggregate observed strength trends with evidence.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
        <h3 className="text-base font-bold font-display text-[#11183D] flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>Observed Strengths</span>
        </h3>
        <span className="text-xs text-[#526078] font-mono">Evidence-Backed</span>
      </div>

      <div className="space-y-3">
        {strengths.map((str) => (
          <div
            key={str.id}
            className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                <span>✓</span> {str.title}
              </p>
              <p className="text-[11px] text-emerald-800 font-mono">
                {str.observedFrequency}
              </p>
            </div>

            <button
              onClick={() => onOpenEvidence(str.title, str.evidenceItems)}
              className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs shrink-0"
            >
              <Eye size={12} />
              <span>View Evidence</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
