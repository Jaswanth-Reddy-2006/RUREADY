import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldCheck, Sparkles, Users, Clock, Layers, Award,
  ChevronDown, ChevronUp, ExternalLink, Code2, BookOpen, Target,
  CheckCircle2, ArrowRight, Copy, Share2, FileCode, Heart, Bookmark, Check
} from 'lucide-react';
import { Roadmap, RoadmapNode, useRoadmapStore } from '../../store/useRoadmapStore';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import toast from 'react-hot-toast';

interface RoadmapPreviewModalProps {
  roadmap: Roadmap | null;
  isOpen: boolean;
  onClose: () => void;
  onEnrollAndStart: (roadmap: Roadmap) => void;
  onCloneToBuilder?: (roadmap: Roadmap) => void;
}

export default function RoadmapPreviewModal({
  roadmap,
  isOpen,
  onClose,
  onEnrollAndStart,
  onCloneToBuilder,
}: RoadmapPreviewModalProps) {
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const { likedRoadmapIds, toggleUpvoteRoadmap, enrolledRoadmapIds, claimRoadmap } = useRoadmapStore();

  if (!isOpen || !roadmap) return null;

  const isLiked = likedRoadmapIds?.includes(roadmap.id);
  const isEnrolled = enrolledRoadmapIds?.includes(roadmap.id);

  const toggleNodeAccordion = (nodeId: string) => {
    setExpandedNodeId(expandedNodeId === nodeId ? null : nodeId);
  };

  const handleCopyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/roadmap/${roadmap.id}`);
      toast.success('Roadmap link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs font-body text-[#11183D]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-[#DCE7F2] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header Bar */}
          <div className="p-6 bg-[#EFFAFD] border-b border-[#DCE7F2] flex items-start justify-between gap-4 shrink-0">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {roadmap.isOfficial ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold font-display bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30">
                    <ShieldCheck size={14} className="text-[#4A8BDF]" />
                    Official RU Ready Blueprint
                  </span>
                ) : roadmap.isAiGenerated ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold font-display bg-[#F8EAF4] text-[#A0006D] border border-[#A0006D]/30">
                    <Sparkles size={14} className="text-[#A0006D]" />
                    AI Synthesized Custom Track
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-display bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30">
                    <Users size={14} className="text-[#168A62]" />
                    Community Created Track
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase bg-white text-[#526078] border border-[#DCE7F2]">
                  Target: {roadmap.targetCompanyTier}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-white text-[#526078] border border-[#DCE7F2]">
                  {roadmap.difficulty}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold font-display text-[#11183D] tracking-tight">
                {roadmap.title}
              </h2>

              <p className="text-xs text-[#526078] leading-relaxed max-w-2xl">
                {roadmap.description}
              </p>

              {/* Creator Credit */}
              <div className="flex items-center gap-2 pt-1 text-xs text-[#526078]">
                <span>Curated by:</span>
                <strong className="font-bold text-[#11183D] font-display">{roadmap.creatorName}</strong>
                {roadmap.creatorRole && <span>• {roadmap.creatorRole}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  toggleUpvoteRoadmap(roadmap.id);
                  if (isLiked) {
                    toast('Vote removed from roadmap.', { icon: '🤍' });
                  } else {
                    toast.success(`Voted! Added to Liked Roadmaps.`);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isLiked
                    ? 'bg-[#F8EAF4] text-[#A0006D] border-[#A0006D]/40 shadow-xs'
                    : 'bg-white text-[#526078] border-[#DCE7F2] hover:text-[#A0006D]'
                }`}
                title={isLiked ? 'Unvote roadmap' : 'Vote / Upvote roadmap'}
              >
                <Heart size={14} className={isLiked ? 'fill-[#A0006D] text-[#A0006D]' : ''} />
                <span>{roadmap.upvotes || 0}</span>
              </button>

              <button
                onClick={handleCopyShareLink}
                title="Share Roadmap"
                className="p-2 rounded-xl text-[#526078] hover:bg-white border border-transparent hover:border-[#DCE7F2] transition-colors cursor-pointer"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#526078] hover:bg-white border border-transparent hover:border-[#DCE7F2] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="px-6 py-3 bg-white border-b border-[#DCE7F2] flex items-center justify-between text-xs text-[#526078] shrink-0 overflow-x-auto">
            <div className="flex items-center gap-6 shrink-0">
              <div className="flex items-center gap-1.5 font-medium">
                <Layers size={14} className="text-[#4A8BDF]" />
                <span>{roadmap.nodesData.length} Sequential Steps</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock size={14} className="text-[#A0006D]" />
                <span>~{roadmap.estimatedWeeks} Weeks to Completion</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Users size={14} className="text-[#168A62]" />
                <span>{roadmap.enrolledCount} Active Candidates</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#7B8799]">
                Click any step below to preview instructions, sources & exact drills
              </span>
            </div>
          </div>

          {/* Scrollable Node Tree Preview Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-[#11183D]">
              Complete Step-by-Step Curriculum Preview
            </h3>

            <div className="space-y-3">
              {roadmap.nodesData.map((node, index) => {
                const isExpanded = expandedNodeId === node.id || (!expandedNodeId && index === 0);

                return (
                  <div
                    key={node.id}
                    className="border border-[#DCE7F2] rounded-2xl overflow-hidden bg-white shadow-2xs transition-all"
                  >
                    {/* Step Header Accordion Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleNodeAccordion(node.id)}
                      className="w-full p-4.5 flex items-center justify-between text-left hover:bg-[#EFFAFD]/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Step Number Badge */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2459A8] to-[#4A8BDF] text-white flex items-center justify-center font-display font-extrabold text-sm shrink-0 shadow-xs">
                          0{node.orderIndex || index + 1}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#A0006D] font-mono">
                            {node.subHeader || `Step 0${index + 1} • ${node.category}`}
                          </p>
                          <h4 className="text-base font-bold font-display text-[#11183D] truncate">
                            {node.title}
                          </h4>
                          <p className="text-xs text-[#526078] line-clamp-1 mt-0.5">
                            {node.whatShouldIDo?.summary || 'Core milestone challenge and practical drill'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className="text-[11px] font-semibold text-[#526078] hidden sm:inline-block">
                          ~{node.estimatedHours || 16} hrs
                        </span>
                        {isExpanded ? (
                          <ChevronUp size={18} className="text-[#526078]" />
                        ) : (
                          <ChevronDown size={18} className="text-[#526078]" />
                        )}
                      </div>
                    </button>

                    {/* Step Detailed Expanded View: The 3 Core Pillars */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-5 pt-0 border-t border-[#DCE7F2] bg-[#FAFCFE] space-y-6"
                      >
                        {/* 1. WHAT SHOULD I DO? */}
                        <div className="p-4 rounded-2xl bg-white border border-[#DCE7F2] space-y-3 shadow-2xs mt-4">
                          <div className="flex items-center gap-2 text-xs font-extrabold font-display uppercase tracking-wider text-[#2459A8]">
                            <Target size={15} className="text-[#4A8BDF]" />
                            <span>1. What Should I Do? (Action Directives & Core Concepts)</span>
                          </div>

                          <p className="text-xs text-[#11183D] font-medium leading-relaxed">
                            {node.whatShouldIDo?.summary}
                          </p>

                          {node.whatShouldIDo?.actionSteps && node.whatShouldIDo.actionSteps.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[11px] font-bold text-[#526078] uppercase">
                                Action Items:
                              </span>
                              <ul className="space-y-1.5">
                                {node.whatShouldIDo.actionSteps.map((step, sIdx) => (
                                  <li key={sIdx} className="text-xs text-[#334155] flex items-start gap-2">
                                    <CheckCircle2 size={13} className="text-[#168A62] shrink-0 mt-0.5" />
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {node.whatShouldIDo?.mentalModels && node.whatShouldIDo.mentalModels.length > 0 && (
                            <div className="p-3 bg-[#EFFAFD] rounded-xl border border-[#4A8BDF]/20 space-y-1">
                              <span className="text-[10px] font-bold text-[#2459A8] uppercase tracking-wider block">
                                Mental Model / Architecture Rule:
                              </span>
                              {node.whatShouldIDo.mentalModels.map((m, mIdx) => (
                                <p key={mIdx} className="text-[11px] text-[#11183D] italic">
                                  💡 {m}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 2. WHAT IS THE SOURCE? */}
                        <div className="p-4 rounded-2xl bg-white border border-[#DCE7F2] space-y-3 shadow-2xs">
                          <div className="flex items-center gap-2 text-xs font-extrabold font-display uppercase tracking-wider text-[#168A62]">
                            <BookOpen size={15} className="text-[#168A62]" />
                            <span>2. What Is The Source? (Curated Docs, Videos & Repos)</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {node.whatIsTheSource && node.whatIsTheSource.length > 0 ? (
                              node.whatIsTheSource.map((src) => (
                                <a
                                  key={src.id}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 rounded-xl border border-[#DCE7F2] bg-[#EFFAFD]/40 hover:bg-[#EFFAFD] transition-all flex items-start justify-between gap-3 group"
                                >
                                  <div className="space-y-1 min-w-0">
                                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase bg-white border border-[#DCE7F2] text-[#526078]">
                                      {src.type}
                                    </span>
                                    <h5 className="text-xs font-bold text-[#11183D] group-hover:text-[#2459A8] transition-colors leading-snug line-clamp-1">
                                      {src.title}
                                    </h5>
                                    {src.description && (
                                      <p className="text-[11px] text-[#526078] line-clamp-1">
                                        {src.description}
                                      </p>
                                    )}
                                  </div>
                                  <ExternalLink size={13} className="text-[#7B8799] group-hover:text-[#2459A8] shrink-0 mt-1" />
                                </a>
                              ))
                            ) : (
                              <p className="text-xs text-[#7B8799] italic">Standard industry documentation & books referenced.</p>
                            )}
                          </div>
                        </div>

                        {/* 3. WHAT IS THE EXACT THING? */}
                        <div className="p-4 rounded-2xl bg-white border border-[#DCE7F2] space-y-3 shadow-2xs">
                          <div className="flex items-center gap-2 text-xs font-extrabold font-display uppercase tracking-wider text-[#A0006D]">
                            <Code2 size={15} className="text-[#A0006D]" />
                            <span>3. What Is The Exact Thing? (Concrete Practical Project / Drill)</span>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-xs font-bold text-[#11183D]">
                              {node.whatIsTheExactThing?.title || 'Hands-On Deliverable'}
                            </h5>
                            <p className="text-xs text-[#526078] leading-relaxed">
                              {node.whatIsTheExactThing?.description}
                            </p>

                            <div className="p-3 rounded-xl bg-[#F8EAF4]/50 border border-[#A0006D]/20 text-xs">
                              <strong className="text-[#A0006D] font-bold block mb-1">
                                Tangible Deliverable:
                              </strong>
                              <span className="text-[#11183D]">
                                {node.whatIsTheExactThing?.deliverable}
                              </span>
                            </div>

                            {node.whatIsTheExactThing?.starterCode && (
                              <div className="pt-2">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#526078] mb-1">
                                  <FileCode size={12} />
                                  <span>Starter Drill Template:</span>
                                </div>
                                <pre className="p-3 rounded-xl bg-[#1E1E1E] text-[#E0E0E0] text-[11px] font-mono overflow-x-auto max-h-36">
                                  {node.whatIsTheExactThing.starterCode}
                                </pre>
                              </div>
                            )}

                            {node.whatIsTheExactThing?.verificationChecklist && (
                              <div className="pt-2 space-y-1">
                                <span className="text-[11px] font-bold text-[#526078] uppercase">
                                  Verification Criteria:
                                </span>
                                <ul className="space-y-1">
                                  {node.whatIsTheExactThing.verificationChecklist.map((c, cIdx) => (
                                    <li key={cIdx} className="text-xs text-[#334155] flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#A0006D]" />
                                      <span>{c}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="p-4 sm:p-5 bg-[#EFFAFD] border-t border-[#DCE7F2] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-[#526078]">
              <Award size={16} className="text-[#A0006D]" />
              <span>Full curriculum includes interactive Monaco code sandbox & Ava Micro-Interview defenses.</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {onCloneToBuilder && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => onCloneToBuilder(roadmap)}
                  className="flex-1 sm:flex-none text-xs font-display"
                  icon={<Copy size={14} />}
                >
                  Fork
                </Button>
              )}

              {!isEnrolled ? (
                <>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      claimRoadmap(roadmap.id);
                      toast.success(`Claimed! "${roadmap.title}" added to My Roadmaps.`);
                    }}
                    className="flex-1 sm:flex-none text-xs font-display bg-white"
                    icon={<Bookmark size={14} className="text-[#4A8BDF]" />}
                  >
                    Claim Roadmap
                  </Button>
                  <Button
                    variant="royal"
                    size="md"
                    onClick={() => {
                      claimRoadmap(roadmap.id);
                      onEnrollAndStart(roadmap);
                    }}
                    className="flex-1 sm:flex-none text-xs font-display shadow-md"
                    icon={<ArrowRight size={15} />}
                  >
                    Claim & Start
                  </Button>
                </>
              ) : (
                <Button
                  variant="eggplant"
                  size="md"
                  onClick={() => onEnrollAndStart(roadmap)}
                  className="flex-1 sm:flex-none text-xs font-display shadow-md"
                  icon={<ArrowRight size={15} />}
                >
                  Resume Track
                </Button>
              )}
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
