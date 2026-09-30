import React from 'react';

interface PlannerProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitle?: string;
}

export default function PlannerProgress({ currentStep, totalSteps, stepTitle }: PlannerProgressProps) {
  if (currentStep === 0) return null; // Intro step

  return (
    <div className="w-full max-w-xl mx-auto flex items-center justify-between py-2 text-xs text-[#526078]">
      {/* Step Dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'w-6 bg-[#2459A8]'
                  : isCompleted
                  ? 'w-1.5 bg-[#4A8BDF]'
                  : 'w-1.5 bg-[#DCE7F2]'
              }`}
            />
          );
        })}
      </div>

      {/* Step counter text */}
      <div className="font-mono text-[11px] font-bold text-slate-500">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}
