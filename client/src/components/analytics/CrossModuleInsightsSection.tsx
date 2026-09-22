import React from 'react';
import { CrossModuleInsight } from '../../utils/careerAnalyticsAggregator';
import { Sparkles, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CrossModuleInsightsSectionProps {
  insights: CrossModuleInsight[];
}

export default function CrossModuleInsightsSection({ insights }: CrossModuleInsightsSectionProps) {
  const navigate = useNavigate();

  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]">
            <Sparkles size={16} />
          </span>
          <h3 className="text-base font-bold font-display text-[#11183D]">
            Cross-Module Intelligence Insights
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#2459A8]">Prep ↔ Interview ↔ ATS</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
              ins.type === 'POSITIVE'
                ? 'bg-emerald-50/40 border-emerald-200'
                : 'bg-amber-50/40 border-amber-200'
            }`}
          >
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#11183D] flex items-center gap-1.5">
                {ins.type === 'POSITIVE' ? (
                  <TrendingUp size={14} className="text-emerald-600" />
                ) : (
                  <AlertCircle size={14} className="text-amber-600" />
                )}
                {ins.title}
              </h4>
              <p className="text-xs text-[#526078] leading-relaxed pt-1">
                {ins.description}
              </p>
            </div>

            <button
              onClick={() => navigate(ins.actionUrl)}
              className="self-start px-3 py-1.5 bg-white border border-[#DCE7F2] hover:bg-slate-50 text-[#11183D] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <span>{ins.actionLabel}</span>
              <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
