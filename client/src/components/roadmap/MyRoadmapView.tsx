import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Play, Circle, Clock, Target, ArrowRight,
  Sparkles, Layers, BookOpen, Award, Check, ChevronRight, Zap, RefreshCw
} from 'lucide-react';
import { Roadmap, RoadmapNode } from '../../store/useRoadmapStore';
import Button from '../ui/Button';

interface MyRoadmapViewProps {
  roadmap: Roadmap;
  onOpenSprintModal: () => void;
  onSelectNode?: (nodeId: string) => void;
}

export default function MyRoadmapView({
  roadmap,
  onOpenSprintModal,
  onSelectNode,
}: MyRoadmapViewProps) {
  // Default roadmap stage timeline if none exists
  const defaultStages = [
    { title: 'Foundation', status: 'COMPLETED' },
    { title: 'Programming', status: 'COMPLETED' },
    { title: 'Data Structures', status: 'IN_PROGRESS' },
    { title: 'Backend Development', status: 'UPCOMING' },
    { title: 'Databases', status: 'UPCOMING' },
    { title: 'System Design', status: 'UPCOMING' },
    { title: 'Cloud Systems', status: 'UPCOMING' },
    { title: 'Projects', status: 'UPCOMING' },
    { title: 'Interview Preparation', status: 'UPCOMING' },
  ];

  const completedNodesCount = roadmap.nodesData.filter((n) => n.status === 'MASTERED').length;
  const totalNodesCount = roadmap.nodesData.length;
  const overallProgress = totalNodesCount > 0 ? Math.round((completedNodesCount / totalNodesCount) * 100) : 62;
  const currentReadiness = roadmap.overallReadiness || 42;

  return (
    <div className="space-y-8 font-body text-[#11183D]">
      {/* Header Banner & Core Readiness Stats */}
      <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#DCE7F2]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold font-display text-[#2459A8] uppercase tracking-wider mb-1">
              <Target size={14} />
              <span>Target Role Path: {roadmap.rolePath || 'Backend Engineer'} → {roadmap.targetCompanyTier || 'Amazon'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-[#11183D]">
              {roadmap.title}
            </h1>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold font-display bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30">
            <Zap size={14} className="text-[#4A8BDF]" />
            Active Learning Journey
          </span>
        </div>

        {/* 4 Core Stat Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#EFFAFD] rounded-2xl p-4 border border-[#DCE7F2]">
            <span className="block text-xs font-semibold text-[#7B8799] uppercase mb-1">Current Readiness</span>
            <span className="text-2xl font-extrabold font-mono text-[#4A8BDF]">{currentReadiness}%</span>
            <span className="block text-[11px] text-[#526078] mt-0.5">+8% this week</span>
          </div>

          <div className="bg-[#F8EAF4] rounded-2xl p-4 border border-[#A0006D]/20">
            <span className="block text-xs font-semibold text-[#7B8799] uppercase mb-1">Overall Progress</span>
            <span className="text-2xl font-extrabold font-mono text-[#A0006D]">{overallProgress}%</span>
            <span className="block text-[11px] text-[#526078] mt-0.5">{completedNodesCount} of {totalNodesCount} completed</span>
          </div>

          <div className="bg-[#EFFAFD] rounded-2xl p-4 border border-[#DCE7F2]">
            <span className="block text-xs font-semibold text-[#7B8799] uppercase mb-1">Estimated Journey</span>
            <span className="text-2xl font-extrabold font-mono text-[#11183D]">{roadmap.estimatedWeeks || 24} Wks</span>
            <span className="block text-[11px] text-[#526078] mt-0.5">Target finish: Nov 2026</span>
          </div>

          <div className="bg-[#E8F5F0] rounded-2xl p-4 border border-[#168A62]/30">
            <span className="block text-xs font-semibold text-[#7B8799] uppercase mb-1">Current Sprint</span>
            <span className="text-2xl font-extrabold font-mono text-[#168A62]">Sprint 07</span>
            <span className="block text-[11px] text-[#168A62] font-semibold mt-0.5">Day 6 / 10 Active</span>
          </div>
        </div>
      </div>

      {/* Active Sprint Highlights Card */}
      <div className="bg-gradient-to-br from-white via-[#EFFAFD]/50 to-white rounded-3xl border-2 border-[#4A8BDF]/40 p-6 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-extrabold font-mono bg-[#A0006D] text-white">
              SPRINT 07
            </span>
            <span className="text-xs font-bold text-[#526078]">10-Day Sprint Duration</span>
          </div>
          <span className="text-xs font-bold font-mono text-[#168A62] bg-[#E8F5F0] px-3 py-1 rounded-full border border-[#168A62]/30">
            Day 6 / 10 (78% Done)
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold font-display text-[#11183D]">
            Sprint Goal: Master Java Collections & Memory Optimizations
          </h3>
          <p className="text-xs text-[#526078]">
            Focusing on HashMap internals, ArrayList vs LinkedList trade-offs, and HashSet time complexity.
          </p>
        </div>

        <div className="w-full bg-[#DCE7F2] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#4A8BDF] via-[#2459A8] to-[#A0006D] h-full rounded-full transition-all duration-500"
            style={{ width: '78%' }}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs font-medium text-[#526078]">
            <Clock size={13} className="text-[#4A8BDF]" />
            <span>Est. time remaining today: ~45 mins</span>
          </div>
          <Button
            variant="eggplant"
            size="sm"
            onClick={onOpenSprintModal}
            className="text-xs font-display flex items-center gap-2 shadow-sm"
            icon={<Play size={13} className="fill-white" />}
          >
            Continue Sprint
          </Button>
        </div>
      </div>

      {/* Roadmap Stage Journey Timeline */}
      <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE7F2]">
          <div>
            <h2 className="text-xl font-bold font-display text-[#11183D]">
              Sequential Career Stage Journey
            </h2>
            <p className="text-xs text-[#526078]">
              Your personalized milestone path. The highlighted stage is your active focus.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#2459A8] bg-[#EFFAFD] px-3 py-1 rounded-full border border-[#DCE7F2]">
            9 Stages Total
          </span>
        </div>

        {/* Horizontal Visual Pipeline / Stepper */}
        <div className="overflow-x-auto pb-4">
          <div className="flex items-center min-w-max gap-3 py-2">
            {defaultStages.map((stage, idx) => {
              const isCompleted = stage.status === 'COMPLETED';
              const isInProgress = stage.status === 'IN_PROGRESS';

              return (
                <React.Fragment key={stage.title}>
                  <div
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold font-display transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-[#E8F5F0] text-[#168A62] border-[#168A62]/30'
                        : isInProgress
                        ? 'bg-[#4A8BDF] text-white border-[#2459A8] shadow-md ring-4 ring-[#4A8BDF]/20 scale-105'
                        : 'bg-[#EFFAFD]/60 text-[#7B8799] border-[#DCE7F2]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="text-[#168A62]" />
                    ) : isInProgress ? (
                      <Zap size={16} className="text-yellow-300 animate-pulse" />
                    ) : (
                      <Circle size={16} className="text-[#CBD5E1]" />
                    )}
                    <span>{stage.title}</span>
                  </div>

                  {idx < defaultStages.length - 1 && (
                    <ChevronRight size={16} className="text-[#CBD5E1] shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Detailed Milestones / Nodes List */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold font-display text-[#11183D] uppercase tracking-wider">
            Detailed Track Nodes ({roadmap.nodesData.length})
          </h3>

          <div className="space-y-3">
            {roadmap.nodesData.map((node, i) => {
              const isDone = node.status === 'MASTERED';
              const isCurrent = node.status === 'IN_PROGRESS';

              return (
                <div
                  key={node.id}
                  onClick={() => onSelectNode?.(node.id)}
                  className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    isCurrent
                      ? 'bg-[#EFFAFD] border-[#4A8BDF] shadow-sm'
                      : isDone
                      ? 'bg-white border-[#168A62]/30 hover:border-[#168A62]'
                      : 'bg-white border-[#DCE7F2] opacity-75 hover:opacity-100 hover:border-[#4A8BDF]/40'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#168A62]" />
                      ) : isCurrent ? (
                        <div className="w-5 h-5 rounded-full bg-[#4A8BDF] flex items-center justify-center text-white text-[10px] font-bold">
                          {i + 1}
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-[#CBD5E1]" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#7B8799] uppercase">
                          {node.subHeader || `Step ${i + 1}`}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A0006D] text-white">
                            Current Focus
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold font-display text-[#11183D]">
                        {node.title}
                      </h4>

                      <p className="text-xs text-[#526078] line-clamp-2">
                        {node.whatShouldIDo?.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-[#7B8799]">
                      ~{node.estimatedHours || 12}h
                    </span>
                    <ArrowRight size={16} className="text-[#4A8BDF]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
