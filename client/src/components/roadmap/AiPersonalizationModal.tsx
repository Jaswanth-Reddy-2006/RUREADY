import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Check, RefreshCw, SlidersHorizontal, MessageSquare,
  ArrowRight, ShieldCheck, Zap
} from 'lucide-react';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface AiPersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyChanges?: (customPrompt: string) => void;
}

export default function AiPersonalizationModal({
  isOpen,
  onClose,
  onApplyChanges,
}: AiPersonalizationModalProps) {
  const [customPrompt, setCustomPrompt] = useState(
    'I have college exams for the next two weeks. Reduce my workload and focus more on DSA.'
  );
  const [isApplying, setIsApplying] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'I have less time',
    'I want more practice',
    'Make this beginner friendly',
    'Focus on projects',
    'Make it free',
    'Increase DSA',
    'Reduce theory',
    'Prepare me for interviews',
  ];

  const handleApply = () => {
    setIsApplying(true);
    toast('Applying AI personalization to roadmap...', { icon: '✨' });

    setTimeout(() => {
      setIsApplying(false);
      toast.success('Roadmap adjusted successfully based on your prompt!');
      onApplyChanges?.(customPrompt);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl border border-[#DCE7F2] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-body text-[#11183D]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#DCE7F2] bg-gradient-to-r from-[#F8EAF4] via-white to-[#EFFAFD]">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-2xl bg-[#A0006D] text-white shadow-xs">
                <SlidersHorizontal size={20} />
              </span>
              <div>
                <span className="text-[10px] font-bold font-mono text-[#A0006D] uppercase tracking-wider block">
                  AI Roadmap Personalizer
                </span>
                <h2 className="text-xl font-bold font-display text-[#11183D]">
                  Customize Your Roadmap Schedule
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#7B8799] hover:text-[#11183D] hover:bg-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Custom Prompt Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold font-display text-[#11183D] flex items-center gap-1.5">
                <MessageSquare size={14} className="text-[#A0006D]" />
                Tell AI co-pilot how to adapt your schedule:
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                className="w-full saas-input p-3 text-xs leading-relaxed focus:border-[#A0006D]"
                placeholder="e.g. I have college exams for the next two weeks. Reduce my workload and focus more on DSA..."
              />
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#7B8799] uppercase tracking-wider block">
                Suggested Prompt Chips:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setCustomPrompt(chip)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2] hover:bg-[#F8EAF4] hover:text-[#A0006D] hover:border-[#A0006D]/30 transition-all cursor-pointer"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Proposed Adjustment Side-by-Side Preview */}
            <div className="bg-[#EFFAFD]/60 p-5 rounded-2xl border border-[#DCE7F2] space-y-3">
              <h4 className="text-xs font-bold font-display text-[#11183D] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#A0006D]" />
                Preview of Proposed Adjustments:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-[#DCE7F2] space-y-1">
                  <span className="text-[10px] font-mono text-[#7B8799] uppercase block">Before Adjustment</span>
                  <p className="font-bold text-[#11183D]">1.5 hours/day • 10 Nodes</p>
                  <p className="text-[11px] text-[#526078]">Balanced theory & projects across all tracks.</p>
                </div>

                <div className="bg-[#F8EAF4] p-3.5 rounded-xl border border-[#A0006D]/30 space-y-1">
                  <span className="text-[10px] font-mono text-[#A0006D] font-bold uppercase block">After AI Adaptation</span>
                  <p className="font-bold text-[#A0006D]">45 mins/day • DSA Heavy</p>
                  <p className="text-[11px] text-[#11183D]">Pauses heavy system projects during exam window.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-[#DCE7F2] bg-[#EFFAFD] flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="text-xs font-display border-[#DCE7F2]"
            >
              Cancel
            </Button>
            <Button
              variant="eggplant"
              size="sm"
              onClick={handleApply}
              disabled={isApplying}
              className="text-xs font-display flex items-center gap-2 shadow-sm"
              icon={<Sparkles size={14} />}
            >
              {isApplying ? 'Applying...' : 'Apply AI Changes'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
