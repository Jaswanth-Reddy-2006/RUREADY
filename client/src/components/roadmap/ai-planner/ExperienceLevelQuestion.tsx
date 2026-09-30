import React from 'react';
import { Check } from 'lucide-react';
import { STARTING_LEVELS, getSkillsForRole } from './mockData';

interface ExperienceLevelQuestionProps {
  careerRole: { id: string; name: string };
  experienceLevel: string;
  knownSkills: string[];
  onSelectLevel: (level: string) => void;
  onToggleSkill: (skill: string) => void;
  onClearSkills: () => void;
}

export default function ExperienceLevelQuestion({
  careerRole,
  experienceLevel,
  knownSkills,
  onSelectLevel,
  onToggleSkill,
  onClearSkills,
}: ExperienceLevelQuestionProps) {
  const dynamicSkills = getSkillsForRole(careerRole.id, careerRole.name);

  return (
    <div className="space-y-6 max-w-xl mx-auto animate-fadeIn font-body">
      {/* Question Header */}
      <div className="space-y-1 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
          Where are you starting from?
        </h2>
        <p className="text-xs sm:text-sm text-[#526078] font-medium">
          Choose the option that feels closest to your current level.
        </p>
      </div>

      {/* 4 Large Selectable Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STARTING_LEVELS.map((lvl) => {
          const isSelected = experienceLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onSelectLevel(lvl.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                isSelected
                  ? 'bg-blue-50/90 border-[#2459A8] text-[#2459A8] shadow-xs'
                  : 'bg-white border-[#DCE7F2] hover:border-slate-300 text-[#11183D]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold font-display">{lvl.title}</span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#2459A8] text-white flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-500 font-medium leading-tight">
                {lvl.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Skill Chips Section (renders once a level is selected) */}
      {experienceLevel && (
        <div className="space-y-3 pt-2 border-t border-slate-100 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-display text-[#11183D]">
              Which of these do you already know?
            </h3>
            <button
              type="button"
              onClick={onClearSkills}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Not sure? You can skip this.
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {dynamicSkills.map((skill) => {
              const isKnown = knownSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => onToggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer border ${
                    isKnown
                      ? 'bg-[#2459A8] text-white border-[#2459A8] shadow-2xs'
                      : 'bg-white text-slate-700 border-[#DCE7F2] hover:border-slate-300'
                  }`}
                >
                  {isKnown ? `✓ ${skill}` : skill}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
