import React from 'react';
import { OBJECTIVES } from './mockData';

interface ObjectiveQuestionProps {
  selectedObjectives: string[];
  targetCompanies: string;
  onToggleObjective: (obj: string) => void;
  onTargetCompaniesChange: (text: string) => void;
}

export default function ObjectiveQuestion({
  selectedObjectives,
  targetCompanies,
  onToggleObjective,
  onTargetCompaniesChange,
}: ObjectiveQuestionProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto animate-fadeIn font-body">
      {/* Question Header */}
      <div className="space-y-1 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
          What are you trying to achieve?
        </h2>
        <p className="text-xs sm:text-sm text-[#526078] font-medium">
          Choose up to 2.
        </p>
      </div>

      {/* Objective Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {OBJECTIVES.map((obj) => {
          const isSelected = selectedObjectives.includes(obj);
          const isMaxReached = selectedObjectives.length >= 2 && !isSelected;

          return (
            <button
              key={obj}
              type="button"
              disabled={isMaxReached}
              onClick={() => onToggleObjective(obj)}
              className={`p-3.5 rounded-2xl border text-left transition-all font-display text-xs font-bold ${
                isSelected
                  ? 'bg-blue-50/90 border-[#2459A8] text-[#2459A8] shadow-2xs'
                  : isMaxReached
                  ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-white border-[#DCE7F2] hover:border-slate-300 text-slate-700 cursor-pointer'
              }`}
            >
              {obj}
            </button>
          );
        })}
      </div>

      {/* Optional Target Companies / Industries input */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-[#11183D]">
            Any specific companies, industries, or opportunities?
          </label>
          <span className="text-slate-400 font-semibold">Optional</span>
        </div>

        <input
          type="text"
          value={targetCompanies}
          onChange={(e) => onTargetCompaniesChange(e.target.value)}
          placeholder="Example: Product companies, AI startups, Google..."
          className="w-full px-3.5 py-3 bg-white border border-[#DCE7F2] rounded-2xl text-xs text-[#11183D] placeholder:text-slate-400 focus:outline-none focus:border-[#2459A8] shadow-xs"
        />
      </div>
    </div>
  );
}
