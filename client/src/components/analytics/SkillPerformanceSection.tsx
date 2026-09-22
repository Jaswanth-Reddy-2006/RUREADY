import React from 'react';
import { SkillGroup, SkillItem } from '../../utils/careerAnalyticsAggregator';
import { Layers, FileText, ArrowRight, Eye, Sparkles } from 'lucide-react';

interface SkillPerformanceSectionProps {
  skillGroups: SkillGroup[];
  onOpenEvidence: (skill: SkillItem) => void;
}

export default function SkillPerformanceSection({
  skillGroups,
  onOpenEvidence,
}: SkillPerformanceSectionProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-4">
        <div>
          <h3 className="text-lg font-bold font-display text-[#11183D]">
            Skill Performance Breakdown
          </h3>
          <p className="text-xs text-[#526078] mt-0.5">
            Granular evaluation metrics grouped by career preparation domain.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {skillGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2459A8] bg-[#EFFAFD] px-3 py-1 rounded-lg border border-[#DCE7F2] inline-block">
              {group.domainTitle}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.skills.map((skill) => {
                const hasScore = skill.score !== null && skill.score !== undefined;

                return (
                  <div
                    key={skill.id}
                    className="p-3.5 bg-slate-50 border border-[#DCE7F2] rounded-2xl flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-[#11183D]">{skill.name}</p>
                      <p className="text-[11px] text-[#526078] font-mono">
                        {skill.evidenceCount} session{skill.evidenceCount === 1 ? '' : 's'} recorded
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono">
                        <span className="font-bold text-sm text-[#11183D]">
                          {hasScore ? `${skill.score}%` : '--'}
                        </span>
                        {hasScore && (
                          <span className="block text-[10px] text-emerald-700 font-bold">
                            {skill.trend === 'UP' ? '↑' : skill.trend === 'DOWN' ? '↓' : '→'}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onOpenEvidence(skill)}
                        className="px-2.5 py-1.5 bg-white border border-[#DCE7F2] hover:bg-blue-50 text-[#2459A8] rounded-xl font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        title="View underlying interview evidence timestamps"
                      >
                        <Eye size={12} />
                        <span>Evidence</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
