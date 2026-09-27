import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Award, Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  TrendingUp, RefreshCw, BarChart2, ShieldCheck, Zap
} from 'lucide-react';
import Button from '../ui/Button';

interface SprintReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartNextSprint: () => void;
}

export default function SprintReviewModal({
  isOpen,
  onClose,
  onStartNextSprint,
}: SprintReviewModalProps) {
  if (!isOpen) return null;

  const performanceMetrics = [
    { label: 'Knowledge', score: 86, color: 'bg-[#4A8BDF]' },
    { label: 'Problem Solving', score: 74, color: 'bg-[#2459A8]' },
    { label: 'Practical', score: 78, color: 'bg-[#A0006D]' },
    { label: 'Consistency', score: 92, color: 'bg-[#168A62]' },
  ];

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
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#DCE7F2] bg-gradient-to-r from-[#EFFAFD] via-white to-[#F8EAF4]">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-2xl bg-[#168A62] text-white shadow-xs">
                <Award size={20} />
              </span>
              <div>
                <span className="text-[10px] font-bold font-mono text-[#168A62] uppercase tracking-wider block">
                  Sprint Complete
                </span>
                <h2 className="text-xl font-bold font-display text-[#11183D]">
                  Sprint 07 Performance Review
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

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Performance Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-display text-[#7B8799] uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 size={14} className="text-[#4A8BDF]" />
                Skill Performance Metrics
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {performanceMetrics.map((m) => (
                  <div key={m.label} className="bg-[#EFFAFD] p-3.5 rounded-2xl border border-[#DCE7F2] text-center space-y-1">
                    <span className="block text-[11px] font-semibold text-[#526078]">{m.label}</span>
                    <span className="text-xl font-extrabold font-mono text-[#11183D]">{m.score}%</span>
                    <div className="w-full bg-[#DCE7F2] h-1.5 rounded-full overflow-hidden mt-1">
                      <div className={`${m.color} h-full rounded-full`} style={{ width: `${m.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strong Areas & Needs Practice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#E8F5F0] p-4 rounded-2xl border border-[#168A62]/30 space-y-2">
                <h4 className="text-xs font-bold font-display text-[#168A62] flex items-center gap-1.5 uppercase">
                  <CheckCircle2 size={14} />
                  Strong Areas
                </h4>
                <ul className="text-xs text-[#11183D] space-y-1.5 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#168A62]" />
                    Java Collections basics & ArrayList memory layout
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#168A62]" />
                    LinkedList node insertion & deletion complexity
                  </li>
                </ul>
              </div>

              <div className="bg-[#FEF3C7] p-4 rounded-2xl border border-[#F59E0B]/40 space-y-2">
                <h4 className="text-xs font-bold font-display text-[#B45309] flex items-center gap-1.5 uppercase">
                  <AlertTriangle size={14} />
                  Needs Practice
                </h4>
                <ul className="text-xs text-[#11183D] space-y-1.5 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    HashMap collision treeify threshold & load factors
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    Generics wildcard type bounds (? extends T)
                  </li>
                </ul>
              </div>
            </div>

            {/* Roadmap Adaptation Notice */}
            <div className="bg-[#F8EAF4] p-5 rounded-2xl border border-[#A0006D]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold font-display text-[#A0006D] uppercase">
                <Sparkles size={14} />
                <span>Roadmap Dynamic Adaptation</span>
              </div>
              <p className="text-xs text-[#11183D] leading-relaxed">
                "Based on your performance in HashMap internals and type bounds, your next sprint schedule has been automatically adjusted to reinforce Hashing + Advanced Collections before advancing to System Design."
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold font-display text-[#A0006D]">
                <span>Next Up: Sprint 08 • Hashing & Advanced Collections</span>
                <span className="font-mono">10 Days</span>
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
              Close Review
            </Button>
            <Button
              variant="eggplant"
              size="sm"
              onClick={onStartNextSprint}
              className="text-xs font-display flex items-center gap-2 shadow-sm"
              icon={<ArrowRight size={14} />}
            >
              Start Next Sprint (Sprint 08)
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
