import {
  AlertTriangle,
  X,
  Play,
  Save,
  Award,
} from 'lucide-react';

interface ExitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndExit: () => void;
  onEndAndSubmit: () => void;
  interviewType?: 'ORAL' | 'CODING';
}

export default function ExitConfirmationModal({
  isOpen,
  onClose,
  onSaveAndExit,
  onEndAndSubmit,
  interviewType = 'ORAL',
}: ExitConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn select-none">
      <div className="bg-white rounded-3xl border border-[#DCE7F2] shadow-2xl w-full max-w-md overflow-hidden space-y-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">
                Leave this interview?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {interviewType === 'CODING' ? 'Your code and test execution state will be preserved.' : 'Your verbal answers and transcript will be saved.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed font-sans">
          You can save your current progress to resume anytime from the Interview Command Center, or end the session to grade your answers right now.
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4A8BDF] hover:bg-blue-600 text-white rounded-2xl text-xs font-bold font-sans shadow-xs transition-colors"
          >
            <Play size={14} />
            <span>Continue Interview</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSaveAndExit}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold font-sans transition-colors"
            >
              <Save size={14} />
              <span>Save & Exit</span>
            </button>

            <button
              type="button"
              onClick={onEndAndSubmit}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-xs font-bold font-sans shadow-xs transition-colors"
            >
              <Award size={14} />
              <span>End & Grade</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
