import React from 'react';
import { MetricDimension } from '../../utils/careerAnalyticsAggregator';
import { BarChart3, ShieldCheck, AlertCircle } from 'lucide-react';

interface CompetencyProfileProps {
  competencies: MetricDimension[];
}

export default function CompetencyProfile({ competencies }: CompetencyProfileProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-[#2459A8]" />
            <h3 className="text-lg font-bold font-display text-[#11183D]">
              Competency Profile
            </h3>
          </div>
          <p className="text-xs text-[#526078] mt-0.5">
            Evaluated capability breakdown across core technical, problem-solving, and communication dimensions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competencies.map((comp) => {
          const hasScore = comp.score !== null && comp.score !== undefined;

          return (
            <div
              key={comp.key}
              className="p-4 rounded-2xl bg-slate-50 border border-[#DCE7F2] space-y-2.5 transition-all hover:border-[#2459A8]/40"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#11183D]">{comp.label}</span>

                <div className="flex items-center gap-2 font-mono">
                  {hasScore ? (
                    <>
                      <span className="font-bold text-[#2459A8] text-sm">{comp.score}%</span>
                      <span className="text-[10px] text-slate-500 font-sans">({comp.evidenceCount} session{comp.evidenceCount === 1 ? '' : 's'})</span>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-sans">
                      -- Limited evidence
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar or unassessed bar */}
              {hasScore ? (
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2459A8] rounded-full transition-all duration-500"
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#526078]">
                    <span>Status: <strong>{comp.statusText}</strong></span>
                    <span>{comp.trend === 'UP' ? '↑ Improving' : comp.trend === 'DOWN' ? '↓ Declining' : '→ Stable'}</span>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-500 italic">
                  Not measured yet. Complete an interview covering this dimension to record score.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
