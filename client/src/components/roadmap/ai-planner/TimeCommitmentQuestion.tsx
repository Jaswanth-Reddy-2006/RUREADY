import React from 'react';
import { TIME_COMMITMENTS, PACING_OPTIONS } from './mockData';
import { Check } from 'lucide-react';

interface TimeCommitmentQuestionProps {
  weeklyHours: string;
  pace: string;
  onSelectHours: (hrs: string) => void;
  onSelectPace: (pace: string) => void;
}

export default function TimeCommitmentQuestion({
  weeklyHours,
  pace,
  onSelectHours,
  onSelectPace,
}: TimeCommitmentQuestionProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto animate-fadeIn font-body">
      {/* Question Header */}
      <div className="space-y-1 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
          How much time can you realistically commit?
        </h2>
        <p className="text-xs sm:text-sm text-[#526078] font-medium">
          Be realistic. We'll build the roadmap around your actual schedule.
        </p>
      </div>

      {/* Selectable Time Options Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {TIME_COMMITMENTS.map((hrs) => {
          const isSelected = weeklyHours === hrs;
          return (
            <button
              key={hrs}
              type="button"
              onClick={() => onSelectHours(hrs)}
              className={`p-3 rounded-2xl border text-center font-display text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/90 border-[#2459A8] text-[#2459A8] shadow-2xs'
                  : 'bg-white border-[#DCE7F2] hover:border-slate-300 text-slate-700'
              }`}
            >
              {hrs}
            </button>
          );
        })}
      </div>

      {/* Pace Selection Section */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold font-display text-[#11183D]">
          How fast do you want to reach your goal?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PACING_OPTIONS.map((opt) => {
            const isSelected = pace === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectPace(opt.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#2459A8] text-[#2459A8] shadow-2xs'
                    : 'bg-white border-[#DCE7F2] hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold font-display">{opt.title}</span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-[#2459A8] text-white flex items-center justify-center">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
