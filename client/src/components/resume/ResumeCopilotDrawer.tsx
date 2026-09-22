import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, RefreshCw, AlertCircle, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { BulletAudit } from '../../utils/atsEngine';
import toast from 'react-hot-toast';

interface ResumeCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bulletsAudit?: BulletAudit[];
  onApplyBulletRewrite?: (bulletId: string, newText: string) => void;
}

export default function ResumeCopilotDrawer({
  isOpen,
  onClose,
  bulletsAudit = [],
  onApplyBulletRewrite
}: ResumeCopilotDrawerProps) {
  const { masterResume, updateSummary, applyStarRewrite } = useResumeStore();
  const [activeTab, setActiveTab] = useState<'STAR_BULLETS' | 'SUMMARY_OPT'>('STAR_BULLETS');

  // Summary state
  const [editedSummary, setEditedSummary] = useState(masterResume.summary || '');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Applied tracking
  const [appliedBulletIds, setAppliedBulletIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleGenerateSummary = () => {
    setIsGeneratingSummary(true);
    setTimeout(() => {
      const enhanced = `Results-oriented ${masterResume.personalInfo.title || 'Software Engineer'} specializing in scalable cloud microservices, high-throughput database optimization, and modern React/TypeScript applications. Demonstrated track record delivering high-availability features with quantifiable P99 performance gains.`;
      setEditedSummary(enhanced);
      setIsGeneratingSummary(false);
      toast.success('Generated AI executive summary options!');
    }, 600);
  };

  const handleApplySummary = () => {
    updateSummary(editedSummary);
    toast.success('Executive summary updated!');
  };

  const handleAcceptRewrite = (audit: BulletAudit) => {
    if (onApplyBulletRewrite) {
      onApplyBulletRewrite(audit.id, audit.suggestedRewrite);
    } else {
      applyStarRewrite(audit.id, audit.suggestedRewrite);
    }
    setAppliedBulletIds((prev) => [...prev, audit.id]);
    toast.success('STAR bullet rewrite applied cleanly!');
  };

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
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white text-[#2459A8] border border-[#DCE7F2] shadow-2xs">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-[#11183D]">
                  Non-Destructive AI Copilot
                </h3>
                <p className="text-xs text-[#526078]">
                  Before/After comparison rewrites without metric fabrication
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#7B8799] hover:text-[#11183D] rounded-xl hover:bg-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-[#DCE7F2] bg-slate-50 px-6 py-2 gap-2 text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveTab('STAR_BULLETS')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'STAR_BULLETS'
                  ? 'bg-white text-[#2459A8] border border-[#DCE7F2] shadow-2xs'
                  : 'text-[#526078] hover:text-[#11183D]'
              }`}
            >
              STAR Bullet Audits ({bulletsAudit.length})
            </button>
            <button
              onClick={() => setActiveTab('SUMMARY_OPT')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'SUMMARY_OPT'
                  ? 'bg-white text-[#2459A8] border border-[#DCE7F2] shadow-2xs'
                  : 'text-[#526078] hover:text-[#11183D]'
              }`}
            >
              Executive Summary Copilot
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {activeTab === 'STAR_BULLETS' ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">STAR Method Standards</p>
                    <p className="mt-0.5 opacity-90">
                      Strong bullet points start with active verbs (e.g. <em>Architected, Spearheaded</em>) and include verified quantitative results.
                    </p>
                  </div>
                </div>

                {bulletsAudit.length > 0 ? (
                  bulletsAudit.map((audit) => {
                    const isApplied = appliedBulletIds.includes(audit.id);
                    return (
                      <div
                        key={audit.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isApplied ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-[#DCE7F2]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold font-mono text-[#526078]">{audit.context}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              audit.hasMetrics ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {audit.hasMetrics ? 'Quantified Metric' : 'Needs Quantification'}
                          </span>
                        </div>

                        {/* Before / After Comparison Box */}
                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              Original Bullet
                            </span>
                            <p className="text-[#526078]">{audit.original}</p>
                          </div>

                          <div className="p-2.5 bg-blue-50/50 border border-blue-200 rounded-xl">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2459A8] block mb-1 flex items-center gap-1">
                              <Sparkles size={11} />
                              AI Suggested STAR Rewrite
                            </span>
                            <p className="text-[#11183D] font-medium">{audit.suggestedRewrite}</p>
                            <p className="text-[10px] text-[#526078] mt-1.5 italic">
                              Reason: {audit.improvementReason}
                            </p>
                          </div>
                        </div>

                        {/* Action Row */}
                        <div className="mt-3 flex items-center justify-end">
                          {isApplied ? (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 size={14} /> Applied to Resume
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAcceptRewrite(audit)}
                              className="px-3.5 py-1.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Check size={13} />
                              <span>Accept Rewrite</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[#526078] italic">No bullet point audits available for this version.</p>
                )}
              </div>
            ) : (
              /* Tab 2: Summary Opt */
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#11183D]">
                    Current Resume Summary
                  </label>
                  <textarea
                    rows={5}
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-[#DCE7F2] rounded-2xl text-xs text-[#11183D] focus:outline-none focus:border-[#2459A8]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="px-3 py-1.5 bg-[#EFFAFD] border border-[#DCE7F2] text-[#2459A8] rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 cursor-pointer"
                  >
                    <RefreshCw size={13} className={isGeneratingSummary ? 'animate-spin' : ''} />
                    <span>{isGeneratingSummary ? 'Generating...' : 'Enhance with AI'}</span>
                  </button>

                  <button
                    onClick={handleApplySummary}
                    className="px-4 py-2 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                  >
                    Save Summary
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
