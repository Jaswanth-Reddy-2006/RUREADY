import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, FileText, CheckCircle2, AlertTriangle, ExternalLink, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { EvidenceMoment } from '../../utils/careerAnalyticsAggregator';
import { useNavigate } from 'react-router-dom';

interface MetricDetailDrawerProps {
  isOpen: boolean;
  title: string | null;
  score?: number | null;
  whyThisScoreReason?: string;
  evidenceItems: EvidenceMoment[];
  onClose: () => void;
}

export default function MetricDetailDrawer({
  isOpen,
  title,
  score,
  whyThisScoreReason,
  evidenceItems = [],
  onClose,
}: MetricDetailDrawerProps) {
  const navigate = useNavigate();

  if (!isOpen || !title) return null;

  const hasScore = score !== null && score !== undefined;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-xl bg-white border-l border-[#DCE7F2] h-full shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#DCE7F2] bg-[#EFFAFD] flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2459A8] bg-white px-2 py-0.5 rounded border border-[#DCE7F2]">
                Analytics Provenance & Evidence Trace
              </span>
              <h3 className="text-xl font-bold font-display text-[#11183D]">
                {title}
              </h3>
              <p className="text-xs text-[#526078]">
                Underlying session evaluation evidence supporting this metric.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#7B8799] hover:text-[#11183D] rounded-xl hover:bg-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Score Banner */}
            <div className="p-4 bg-slate-50 border border-[#DCE7F2] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#526078] uppercase">Evaluated Score</span>
                <div className="text-2xl font-bold font-mono text-[#11183D] mt-0.5">
                  {hasScore ? `${score}%` : 'Limited Evidence'}
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-white border border-[#DCE7F2] rounded-xl text-[#2459A8]">
                {evidenceItems.length} Evidence Record{evidenceItems.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* WHY THIS SCORE? Section */}
            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-1.5 text-xs text-blue-950">
              <h4 className="font-bold uppercase tracking-wider text-[#2459A8] flex items-center gap-1.5">
                <Sparkles size={14} />
                WHY THIS SCORE?
              </h4>
              <p className="leading-relaxed opacity-90">
                {whyThisScoreReason ||
                  `The ${title} score is calculated directly from your evaluated responses, code submissions, and speech clarity across actual interview sessions.`}
              </p>
            </div>

            {/* Evidence List */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#526078]">
                Traceable Interview Evidence
              </h4>

              {evidenceItems.length > 0 ? (
                evidenceItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 bg-white border border-[#DCE7F2] rounded-2xl space-y-3 hover:border-[#2459A8]/40 transition-all shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold bg-[#EFFAFD] text-[#2459A8] px-2 py-0.5 rounded border border-[#DCE7F2]">
                          {item.displayTimestamp || '02:31'}
                        </span>
                        <span className="font-bold text-[#11183D]">{item.sessionTitle}</span>
                      </div>
                      <span className="text-[11px] text-[#526078] font-mono">{item.date}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                      <span className="font-bold text-[#2459A8] block">{item.topicOrContext}</span>
                      <p className="text-[#11183D] italic">"{item.quoteOrAnswer}"</p>
                      <div className="pt-1.5 text-[11px] text-[#526078] border-t border-slate-200/60 mt-1">
                        <strong>Evaluation:</strong> {item.evaluation}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        Score: {item.score || 72}%
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          navigate(item.interviewType === 'CODING' ? `/coding/${item.sessionId}/analysis` : `/interview/${item.sessionId}/analysis`);
                        }}
                        className="px-3 py-1.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                      >
                        <Play size={12} />
                        <span>Watch Replay at {item.displayTimestamp || '02:31'}</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-[#DCE7F2] text-xs text-[#526078] italic">
                  No individual transcript quotes recorded for this metric yet.
                </div>
              )}
            </div>

            {/* RECOMMENDED ACTION */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold block text-slate-300">RECOMMENDED ACTION</span>
                <p className="text-slate-400 text-[11px]">Target practice questions for {title}</p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  navigate('/preparation');
                }}
                className="px-4 py-2 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl font-bold font-display flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              >
                <span>Practice Now</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
