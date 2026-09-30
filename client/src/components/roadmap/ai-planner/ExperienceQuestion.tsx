import React from 'react';
import { EXPERIENCE_TYPES } from './mockData';

interface ExperienceQuestionProps {
  selectedTypes: string[];
  experienceDescription: string;
  onToggleType: (type: string) => void;
  onDescriptionChange: (desc: string) => void;
}

export default function ExperienceQuestion({
  selectedTypes,
  experienceDescription,
  onToggleType,
  onDescriptionChange,
}: ExperienceQuestionProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto animate-fadeIn font-body">
      {/* Question Header */}
      <div className="space-y-1 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
          What have you done so far?
        </h2>
        <p className="text-xs sm:text-sm text-[#526078] font-medium">
          This helps us understand your experience beyond your skill list.
        </p>
      </div>

      {/* Selectable Options Chips/Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {EXPERIENCE_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => onToggleType(type)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-display text-xs font-bold ${
                isSelected
                  ? 'bg-blue-50/90 border-[#2459A8] text-[#2459A8] shadow-2xs'
                  : 'bg-white border-[#DCE7F2] hover:border-slate-300 text-slate-700'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Optional Description Input */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-[#11183D]">
            Tell us about your most relevant project or experience
          </label>
          <span className="text-slate-400 font-semibold">Optional</span>
        </div>

        <div className="relative">
          <textarea
            value={experienceDescription}
            onChange={(e) => onDescriptionChange(e.target.value.slice(0, 500))}
            placeholder="Example: Built a face recognition app using Python and OpenCV..."
            rows={3}
            className="w-full p-3.5 bg-white border border-[#DCE7F2] rounded-2xl text-xs text-[#11183D] placeholder:text-slate-400 focus:outline-none focus:border-[#2459A8] shadow-xs leading-relaxed resize-none"
          />
          <div className="text-[10px] font-mono text-slate-400 text-right mt-1">
            {experienceDescription.length} / 500
          </div>
        </div>
      </div>
    </div>
  );
}
