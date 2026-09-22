import React from 'react';
import { NextBestAction } from '../../utils/careerAnalyticsAggregator';
import { Target, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NextBestActionsSectionProps {
  actions: NextBestAction[];
}

export default function NextBestActionsSection({ actions }: NextBestActionsSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#EFFAFD] text-[#2459A8] rounded-lg border border-[#DCE7F2]">
              <Sparkles size={16} />
            </span>
            <h3 className="text-lg font-bold font-display text-[#11183D]">
              Your Next Best Actions
            </h3>
          </div>
          <p className="text-xs text-[#526078] mt-0.5">
            Personalized, evidence-driven recommendations to accelerate your placement readiness.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((act) => (
          <div
            key={act.id}
            className="p-5 rounded-2xl bg-linear-to-b from-white to-slate-50 border border-[#DCE7F2] hover:border-[#2459A8]/40 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-mono text-[#2459A8] bg-[#EFFAFD] px-2.5 py-0.5 rounded-md border border-[#DCE7F2]">
                  {act.stepNumber}
                </span>
                <span className="text-[11px] text-[#526078] font-mono flex items-center gap-1">
                  <Clock size={12} /> {act.estimatedTime}
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#11183D] group-hover:text-[#2459A8] transition-colors leading-snug">
                {act.title}
              </h4>

              <p className="text-xs text-[#526078] leading-relaxed">
                {act.reason}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200">
              <button
                onClick={() => navigate(act.actionUrl)}
                className="w-full py-2 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              >
                <span>{act.actionLabel}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
