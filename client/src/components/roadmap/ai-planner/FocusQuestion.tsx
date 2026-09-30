import React from 'react';
import { FOCUS_AREAS } from './mockData';
import { Check } from 'lucide-react';

interface FocusQuestionProps {
  selectedFocus: string[];
  onToggleFocus: (focusId: string) => void;
}

export default function FocusQuestion({ selectedFocus, onToggleFocus }: FocusQuestionProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto animate-fadeIn font-body">
      {/* Question Header */}
      <div className="space-y-1 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
          What should your roadmap focus on?
        </h2>
        <p className="text-xs sm:text-sm text-[#526078] font-medium">
          Choose up to 3.
        </p>
      </div>

      {/* Focus Area Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FOCUS_AREAS.map((item) => {
          const isSelected = selectedFocus.includes(item.id);
          const isMaxReached = selectedFocus.length >= 3 && !isSelected;

          return (
            <button
              key={item.id}
              type="button"
              disabled={isMaxReached}
              onClick={() => onToggleFocus(item.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1 ${
                isSelected
                  ? 'bg-blue-50/90 border-[#2459A8] text-[#2459A8] shadow-2xs'
                  : isMaxReached
                  ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-white border-[#DCE7F2] hover:border-slate-300 text-slate-700 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold font-display">{item.title}</span>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-[#2459A8] text-white flex items-center justify-center">
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
