import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';

interface PlannerIntroProps {
  onStart: () => void;
  onCancel: () => void;
}

export default function PlannerIntro({ onStart, onCancel }: PlannerIntroProps) {
  return (
    <div className="max-w-xl mx-auto py-10 sm:py-16 text-center space-y-8 animate-fadeIn">
      {/* Badge icon */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2459A8] to-[#A0006D] text-white flex items-center justify-center mx-auto shadow-md">
        <Compass size={28} />
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-[#11183D]">
          Let's build your career path.
        </h1>
        <p className="text-sm text-[#526078] leading-relaxed max-w-lg mx-auto font-medium">
          Tell us where you want to go and where you're starting from. We'll create a personalized roadmap around your goals.
        </p>
      </div>

      {/* Small metadata text */}
      <p className="text-xs text-slate-400 font-medium">
        Takes about 2 minutes · You can change your answers later
      </p>

      {/* CTAs */}
      <div className="space-y-3 pt-2">
        <div>
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#C026D3] hover:from-[#1D4ED8] hover:to-[#A21CAF] text-white font-bold font-display text-sm shadow-lg shadow-purple-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
          >
            <span>Let's Build My Roadmap</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-2 px-4 cursor-pointer"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
