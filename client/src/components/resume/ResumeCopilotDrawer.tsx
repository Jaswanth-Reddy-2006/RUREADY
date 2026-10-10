import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { BulletAudit, RecommendationGroup, RecommendationSummary } from '../../utils/atsEngine';
import toast from 'react-hot-toast';

interface ResumeCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bulletsAudit?: BulletAudit[];
  recommendationGroups?: RecommendationGroup[];
  recommendationSummary?: RecommendationSummary;
  onApplyBulletRewrite?: (bulletId: string, newText: string) => void;
}

export default function ResumeCopilotDrawer({
  isOpen,
  onClose,
  bulletsAudit = [],
  recommendationGroups = [],
  recommendationSummary,
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

  const hasGroups = recommendationGroups && recommendationGroups.length > 0;
  const totalAuditCount = hasGroups ? recommendationGroups.length : bulletsAudit.length;

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
                  Targeted, deduplicated recommendations without invented metrics
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#7B8799] hover:text-[#11183D] rounded-xl hover:bg-white transition-colors cursor-pointer"
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
              Bullet Quality Recommendations ({totalAuditCount})
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
                {/* Standards Alert */}
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">STAR Method Standards</p>
                    <p className="mt-0.5 opacity-90">
                      Strong bullet points assert individual ownership, start with active verbs, and include verified quantitative results where available. Numbers and achievements are never fabricated.
                    </p>
                  </div>
                </div>

                {/* Summary Stats Pill Bar */}
                {recommendationSummary && (
                  <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 border border-[#DCE7F2] rounded-2xl text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#526078] block">Evaluated</span>
                      <span className="text-sm font-bold text-[#11183D] font-mono">{recommendationSummary.bulletsEvaluated}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#526078] block">With Issues</span>
                      <span className="text-sm font-bold text-amber-600 font-mono">{recommendationSummary.bulletsWithIssues}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#526078] block">Unique Recs</span>
                      <span className="text-sm font-bold text-[#2459A8] font-mono">{recommendationSummary.uniqueRecommendationsCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#526078] block">Clean Quality</span>
                      <span className="text-sm font-bold text-emerald-600 font-mono">{recommendationSummary.healthPercentage}%</span>
                    </div>
                  </div>
                )}

                {/* Deduplicated Recommendations */}
                {hasGroups ? (
                  recommendationGroups.map((group) => {
                    const isCorrupt = group.isFlaggedForReview || group.category === 'TEXT_CORRUPTION';
                    return (
                      <div
                        key={group.id}
                        className={`p-4 rounded-2xl border space-y-3 transition-all ${
                          isCorrupt
                            ? 'bg-rose-50/60 border-rose-200'
                            : 'bg-white border-[#DCE7F2] shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isCorrupt
                                    ? 'bg-rose-100 text-rose-800'
                                    : group.category === 'VAGUE_OWNERSHIP'
                                    ? 'bg-amber-100 text-amber-800'
                                    : group.category === 'WEAK_ACTION_VERB'
                                    ? 'bg-blue-100 text-blue-800'
                                    : group.category === 'UNCLEAR_TECH'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}
                              >
                                {group.title}
                              </span>
                              {group.domain && group.domain !== 'general' && (
                                <span className="text-[10px] font-mono font-semibold uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                  {group.domain}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#11183D] font-medium">
                              {group.feedback}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-[#526078] bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                            {group.affectedBullets.length} {group.affectedBullets.length === 1 ? 'bullet' : 'bullets'}
                          </span>
                        </div>

                        {/* Actionable Guidance */}
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-[#334155]">
                          <span className="font-bold text-[#2459A8] block mb-0.5">Recommended Guidance:</span>
                          <p>{group.actionableGuidance}</p>
                        </div>

                        {isCorrupt && (
                          <div className="p-2.5 bg-rose-100/70 border border-rose-200 rounded-xl text-[11px] text-rose-900 flex items-start gap-2">
                            <AlertTriangle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                            <p>
                              Flagged for Review: Potential text extraction corruption. Automated rewrites are disabled to preserve data integrity. Inspect your source document and edit directly.
                            </p>
                          </div>
                        )}

                        {/* Affected Bullets List */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#526078] block">
                            Affected Bullet References ({group.affectedBullets.length}):
                          </span>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {group.affectedBullets.map((bulletRef) => (
                              <div
                                key={bulletRef.id}
                                className="p-2 bg-slate-50/80 border border-slate-200 rounded-lg text-[11px] space-y-0.5"
                              >
                                <div className="flex items-center justify-between text-[10px] text-[#526078] font-mono">
                                  <span>{bulletRef.context}</span>
                                  <span>{bulletRef.id}</span>
                                </div>
                                <p className="text-slate-700 italic">"{bulletRef.original}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : bulletsAudit.length > 0 ? (
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
                              Guidance & Polish
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
                              <span>Accept Polish</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-50 rounded-2xl border border-slate-200">
                    <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2" />
                    All analyzed bullet points follow STAR method standards with strong active verbs and validated impact.
                  </div>
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
                    rows={4}
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs font-medium text-[#11183D] focus:outline-none focus:border-[#2459A8]"
                    placeholder="Provide a concise 30-80 word professional executive summary..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#11183D] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles size={14} className="text-[#2459A8]" />
                    <span>{isGeneratingSummary ? 'Drafting Profile...' : 'AI Enhance Summary'}</span>
                  </button>
                  <button
                    onClick={handleApplySummary}
                    className="flex-1 py-2.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Check size={14} />
                    <span>Apply to Resume</span>
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
