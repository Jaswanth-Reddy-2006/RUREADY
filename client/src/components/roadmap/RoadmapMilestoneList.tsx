import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, CheckCircle2, Lock, Play, Clock,
  Target, BookOpen, Code2, Sparkles, ExternalLink, ArrowRight
} from 'lucide-react';
import { Roadmap, RoadmapNode } from '../../store/useRoadmapStore';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface RoadmapMilestoneListProps {
  roadmap: Roadmap;
  onOpenNodeStudio: (node: RoadmapNode) => void;
}

export default function RoadmapMilestoneList({
  roadmap,
  onOpenNodeStudio,
}: RoadmapMilestoneListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(roadmap.nodesData[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] shadow-sm overflow-hidden font-body text-[#11183D]">
      {/* Table Header Summary */}
      <div className="p-5 bg-[#EFFAFD] border-b border-[#DCE7F2] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold font-display text-[#11183D]">
            Curriculum Sequence Outline
          </h3>
          <p className="text-xs text-[#526078]">
            Detailed syllabus breakdown across all {roadmap.nodesData.length} milestones.
          </p>
        </div>

        <div className="text-xs font-semibold text-[#526078]">
          Total Track: ~{roadmap.nodesData.reduce((acc, n) => acc + (n.estimatedHours || 16), 0)} Study Hours
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#DCE7F2]">
        {roadmap.nodesData.map((node, idx) => {
          const isExpanded = expandedId === node.id;
          const isMastered = node.status === 'MASTERED';
          const isInProgress = node.status === 'IN_PROGRESS';
          const isLocked = node.status === 'LOCKED';

          return (
            <div key={node.id} className="transition-colors hover:bg-[#EFFAFD]/30">
              {/* Row Header */}
              <div
                onClick={() => toggleExpand(node.id)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-extrabold text-xs shrink-0 ${
                      isMastered
                        ? 'bg-[#168A62] text-white'
                        : isInProgress
                        ? 'bg-[#2459A8] text-white animate-pulse'
                        : 'bg-[#DCE7F2] text-[#526078]'
                    }`}
                  >
                    {isMastered ? <CheckCircle2 size={18} /> : isLocked ? <Lock size={15} /> : `0${idx + 1}`}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono uppercase text-[#A0006D]">
                        {node.subHeader || `Step 0${idx + 1}`}
                      </span>
                      <span className="text-xs text-[#7B8799]">•</span>
                      <span className="text-xs text-[#526078]">{node.category}</span>
                    </div>
                    <h4 className="text-sm font-bold font-display text-[#11183D] truncate">
                      {node.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-[#526078] hidden sm:inline-block">
                    ~{node.estimatedHours || 16} hrs
                  </span>

                  <div className="flex items-center gap-2">
                    {isMastered && <Badge variant="success" size="xs">MASTERED</Badge>}
                    {isInProgress && <Badge variant="royal" size="xs">IN PROGRESS</Badge>}
                    {isLocked && <Badge variant="neutral" size="xs">LOCKED</Badge>}
                  </div>

                  {isExpanded ? (
                    <ChevronUp size={18} className="text-[#526078]" />
                  ) : (
                    <ChevronDown size={18} className="text-[#526078]" />
                  )}
                </div>
              </div>

              {/* Row Expanded Preview */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6 pt-2 bg-[#FAFCFE] border-t border-[#DCE7F2]/60 space-y-4"
                  >
                    <p className="text-xs text-[#526078] leading-relaxed">
                      {node.whatShouldIDo?.summary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* What Should I Do Box */}
                      <div className="p-3.5 rounded-2xl bg-white border border-[#DCE7F2] space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold font-display text-[#2459A8] uppercase text-[11px]">
                          <Target size={13} />
                          <span>1. Action Items</span>
                        </div>
                        <ul className="space-y-1 text-[#334155]">
                          {node.whatShouldIDo?.actionSteps?.slice(0, 2).map((s, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2459A8] mt-1 shrink-0" />
                              <span className="line-clamp-2">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* What is the Source Box */}
                      <div className="p-3.5 rounded-2xl bg-white border border-[#DCE7F2] space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold font-display text-[#168A62] uppercase text-[11px]">
                          <BookOpen size={13} />
                          <span>2. Curated Sources</span>
                        </div>
                        <p className="text-[11px] text-[#526078] line-clamp-2">
                          {node.whatIsTheSource?.[0]?.title || 'Industry documentation and standard specifications'}
                        </p>
                        <span className="text-[10px] font-mono text-[#168A62] block">
                          +{node.whatIsTheSource?.length || 1} Reference links
                        </span>
                      </div>

                      {/* What is the Exact Thing Box */}
                      <div className="p-3.5 rounded-2xl bg-white border border-[#DCE7F2] space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold font-display text-[#A0006D] uppercase text-[11px]">
                          <Code2 size={13} />
                          <span>3. Concrete Drill</span>
                        </div>
                        <p className="text-[11px] font-bold text-[#11183D] line-clamp-1">
                          {node.whatIsTheExactThing?.title}
                        </p>
                        <p className="text-[11px] text-[#526078] line-clamp-1">
                          {node.whatIsTheExactThing?.deliverable}
                        </p>
                      </div>
                    </div>

                    {/* Launch Studio CTA */}
                    <div className="flex justify-end pt-2">
                      <Button
                        variant={isLocked ? 'secondary' : 'royal'}
                        size="sm"
                        disabled={isLocked}
                        onClick={() => onOpenNodeStudio(node)}
                        icon={<Play size={13} />}
                        className="text-xs font-display shadow-xs"
                      >
                        {isLocked ? 'Locked (Complete Prior Steps)' : 'Open Interactive Studio'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
