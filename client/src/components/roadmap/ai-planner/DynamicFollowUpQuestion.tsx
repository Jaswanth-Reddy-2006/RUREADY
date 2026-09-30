import React from 'react';
import { Check } from 'lucide-react';
import { FollowUpQuestion } from './types';

interface DynamicFollowUpQuestionProps {
  question: FollowUpQuestion;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
}

export default function DynamicFollowUpQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
}: DynamicFollowUpQuestionProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto animate-fadeIn font-body">
      {/* Question Header */}
      <div className="space-y-1 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
          {question.questionText}
        </h2>
        {question.supportingText && (
          <p className="text-xs sm:text-sm text-[#526078] font-medium">
            {question.supportingText}
          </p>
        )}
      </div>

      {/* Selectable Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((opt) => {
          const isSelected = selectedAnswer === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelectAnswer(opt)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between font-display text-xs font-bold ${
                isSelected
                  ? 'bg-blue-50/90 border-[#2459A8] text-[#2459A8] shadow-2xs'
                  : 'bg-white border-[#DCE7F2] hover:border-slate-300 text-slate-700'
              }`}
            >
              <span>{opt}</span>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[#2459A8] text-white flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
