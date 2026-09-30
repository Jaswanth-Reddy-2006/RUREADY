import React, { useEffect } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface PlannerNavigationProps {
  onNext: () => void;
  onBack: () => void;
  canNext: boolean;
  canBack: boolean;
  nextLabel?: string;
  isSubmitting?: boolean;
}

export default function PlannerNavigation({
  onNext,
  onBack,
  canNext,
  canBack,
  nextLabel = 'Continue →',
  isSubmitting = false,
}: PlannerNavigationProps) {
  // Global keyboard shortcuts (Enter to continue, Esc / Left arrow for back if input not focused)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in textarea or text input
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      if (e.key === 'Enter' && canNext && !isSubmitting) {
        // If typing in input, enter will advance unless it's a multiline textarea
        if (target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        onNext();
      } else if (e.key === 'Escape' && canBack) {
        e.preventDefault();
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canNext, canBack, onNext, onBack, isSubmitting]);

  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#DCE7F2] max-w-xl mx-auto w-full">
      {canBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer font-display"
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>
      ) : (
        <div />
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext || isSubmitting}
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold font-display transition-all shadow-md cursor-pointer ${
          canNext && !isSubmitting
            ? 'bg-gradient-to-r from-[#2563EB] to-[#C026D3] hover:from-[#1D4ED8] hover:to-[#A21CAF] text-white shadow-purple-500/20'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
        }`}
      >
        <span>{isSubmitting ? 'Processing...' : nextLabel}</span>
      </button>
    </div>
  );
}
