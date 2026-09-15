import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Lock, Sparkles, Clock, ArrowRight, Play,
  Target, Code2, BookOpen, ChevronRight, Layers, Eye
} from 'lucide-react';
import { Roadmap, RoadmapNode } from '../../store/useRoadmapStore';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface RoadmapCanvasViewProps {
  roadmap: Roadmap;
  onOpenNodeStudio: (node: RoadmapNode) => void;
}

export default function RoadmapCanvasView({
  roadmap,
  onOpenNodeStudio,
}: RoadmapCanvasViewProps) {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'IN_PROGRESS' | 'MASTERED' | 'LOCKED'>('ALL');

  const filteredNodes = roadmap.nodesData.filter((node) => {
    if (filterStatus === 'ALL') return true;
    return node.status === filterStatus;
  });

  return (
    <div className="space-y-6 font-body text-[#11183D]">
      {/* Top Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#DCE7F2] shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-display uppercase tracking-wider text-[#526078]">
            Filter Milestones:
          </span>
          {(['ALL', 'IN_PROGRESS', 'MASTERED', 'LOCKED'] as const).map((status) => {
            const isSel = filterStatus === status;
            const count = status === 'ALL'
              ? roadmap.nodesData.length
              : roadmap.nodesData.filter((n) => n.status === status).length;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-[#2459A8] text-white shadow-xs'
                    : 'bg-[#EFFAFD] text-[#526078] hover:text-[#11183D]'
                }`}
              >
                <span>{status === 'ALL' ? 'All Milestones' : status.replace('_', ' ')}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${isSel ? 'bg-white/20 text-white' : 'bg-white text-[#526078]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-[#526078] hidden md:flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#168A62]" /> Mastered
          <span className="w-2.5 h-2.5 rounded-full bg-[#4A8BDF] animate-pulse ml-2" /> In Progress
          <span className="w-2.5 h-2.5 rounded-full bg-[#DCE7F2] ml-2" /> Locked
        </div>
      </div>

      {/* Interactive Tech-Tree Canvas with Connected Cable Layout */}
      <div className="relative p-6 sm:p-10 bg-white/80 backdrop-blur-sm rounded-3xl border border-[#DCE7F2] shadow-sm min-h-[550px]">
        {/* Ambient SVG Connection Grid Line */}
        <div className="absolute left-10 sm:left-14 top-14 bottom-14 w-1 bg-gradient-to-b from-[#168A62] via-[#4A8BDF] to-[#DCE7F2] -z-0 rounded-full" />

        <div className="space-y-10 relative z-10">
          {filteredNodes.map((node, idx) => {
            const isMastered = node.status === 'MASTERED';
            const isInProgress = node.status === 'IN_PROGRESS';
            const isLocked = node.status === 'LOCKED';

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-start gap-4 sm:gap-6 group"
              >
                {/* Node Orb Pin */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-sm sm:text-base shrink-0 shadow-md transition-all duration-300 ${
                    isMastered
                      ? 'bg-[#168A62] text-white ring-4 ring-[#168A62]/20'
                      : isInProgress
                      ? 'bg-gradient-to-tr from-[#2459A8] via-[#4A8BDF] to-[#A0006D] text-white ring-4 ring-[#4A8BDF]/30 scale-105 animate-pulse'
                      : 'bg-[#EFFAFD] border-2 border-[#DCE7F2] text-[#7B8799]'
                  }`}
                >
                  {isMastered ? (
                    <CheckCircle2 size={24} className="text-white" />
                  ) : isLocked ? (
                    <Lock size={20} className="text-[#7B8799]" />
                  ) : (
                    `0${node.orderIndex || idx + 1}`
                  )}
                </div>

                {/* Main Milestone Card */}
                <div
                  onClick={() => !isLocked && onOpenNodeStudio(node)}
                  className={`flex-1 p-6 rounded-3xl border-2 transition-all duration-300 ${
                    isLocked
                      ? 'bg-white/60 border-[#DCE7F2] opacity-75 cursor-not-allowed'
                      : isInProgress
                      ? 'bg-white border-[#4A8BDF] shadow-lg ring-4 ring-[#4A8BDF]/10 hover:shadow-xl cursor-pointer'
                      : 'bg-white border-[#DCE7F2] hover:border-[#168A62]/60 hover:shadow-md cursor-pointer'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 min-w-0 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#A0006D] font-mono">
                          {node.subHeader || `Milestone 0${idx + 1}`}
                        </span>
                        <span className="text-xs text-[#7B8799]">•</span>
                        <span className="text-xs font-semibold text-[#526078] flex items-center gap-1">
                          <Clock size={12} className="text-[#4A8BDF]" />
                          ~{node.estimatedHours || 16} Hours
                        </span>
                        <span className="text-xs text-[#7B8799]">•</span>
                        <span className="text-xs font-bold text-[#2459A8]">
                          {node.category}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold font-display text-[#11183D] leading-snug group-hover:text-[#2459A8] transition-colors">
                        {node.title}
                      </h3>

                      <p className="text-xs text-[#526078] leading-relaxed line-clamp-2">
                        {node.whatShouldIDo?.summary || 'Interactive architectural milestone with deliverables and Socratic challenge.'}
                      </p>

                      {/* Pill Highlights of the 3 Pillars */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2] font-semibold">
                          <Target size={12} />
                          {node.whatShouldIDo?.actionSteps?.length || 3} Action Steps
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/20 font-semibold">
                          <BookOpen size={12} />
                          {node.whatIsTheSource?.length || 2} Curated Sources
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F8EAF4] text-[#A0006D] border border-[#A0006D]/20 font-semibold">
                          <Code2 size={12} />
                          Concrete Project Drill
                        </span>
                      </div>
                    </div>

                    {/* Right Status & Launch Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DCE7F2]">
                      <div className="flex items-center gap-2">
                        {isMastered && <Badge variant="success" size="sm">MASTERED</Badge>}
                        {isInProgress && <Badge variant="royal" size="sm">IN PROGRESS</Badge>}
                        {isLocked && <Badge variant="neutral" size="sm">LOCKED</Badge>}
                      </div>

                      {isLocked ? (
                        <span className="text-[11px] font-semibold text-[#7B8799] flex items-center gap-1">
                          <Lock size={12} /> Complete prior step
                        </span>
                      ) : (
                        <Button
                          variant={isMastered ? 'secondary' : 'royal'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenNodeStudio(node);
                          }}
                          icon={<Play size={13} />}
                          className="text-xs font-display shadow-xs"
                        >
                          {isMastered ? 'Review Studio' : 'Launch Studio'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
