import React from 'react';
import { Flag, CheckCircle2, Circle } from 'lucide-react';
import Card from '../ui/Card';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  userAnswers: Record<number, number>;
  markedForReview: Record<number, boolean>;
  onSelectQuestion: (index: number) => void;
}

export default function QuestionNavigator({
  totalQuestions,
  currentIndex,
  userAnswers,
  markedForReview,
  onSelectQuestion,
}: QuestionNavigatorProps) {
  return (
    <Card className="p-4 bg-white border-slate-200/80 shadow-xs rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
          Question Navigator
        </h4>
        <span className="text-[11px] font-mono font-bold text-blue-600">
          {Object.keys(userAnswers).length}/{totalQuestions} Answered
        </span>
      </div>

      {/* Grid of Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = userAnswers[idx] !== undefined;
          const isMarked = markedForReview[idx] === true;

          let btnClass = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400';
          if (isCurrent) {
            btnClass = 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs scale-105';
          } else if (isMarked) {
            btnClass = 'bg-amber-100 border-amber-400 text-amber-900 font-bold';
          } else if (isAnswered) {
            btnClass = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold';
          }

          return (
            <button
              key={idx}
              onClick={() => onSelectQuestion(idx)}
              className={`h-9 rounded-xl text-xs font-mono transition-all border flex items-center justify-center relative ${btnClass}`}
            >
              <span>{idx + 1}</span>
              {isMarked && !isCurrent && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-50 border border-emerald-300 shrink-0" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-400 shrink-0" />
          <span>Marked Review</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-blue-600 shrink-0" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-slate-50 border border-slate-200 shrink-0" />
          <span>Unvisited</span>
        </div>
      </div>
    </Card>
  );
}
