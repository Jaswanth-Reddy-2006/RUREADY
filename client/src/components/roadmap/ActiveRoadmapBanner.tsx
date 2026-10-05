import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, ArrowRight, Compass, Sparkles, CheckCircle2,
  Clock, Layers, Target, TrendingUp, Calendar, Zap
} from 'lucide-react';
import { Roadmap, RoadmapNode } from '../../store/useRoadmapStore';
import Button from '../ui/Button';

interface ActiveRoadmapBannerProps {
  roadmap: Roadmap;
  onContinueSprint: () => void;
  onViewRoadmap: () => void;
}

export default function ActiveRoadmapBanner({
  roadmap,
  onContinueSprint,
  onViewRoadmap,
}: ActiveRoadmapBannerProps) {
  const completedCount = roadmap.nodesData.filter((n) => n.status === 'MASTERED').length;
  const totalCount = roadmap.nodesData.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const currentSprintNumber = Math.max(1, completedCount + 1);
  const currentDay = Math.min(6, 10);
  const currentSprintProgress = 78;

  const currentActiveNode: RoadmapNode | undefined = 
    roadmap.nodesData.find((n) => n.status === 'IN_PROGRESS') || roadmap.nodesData[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border-2 border-[#4A8BDF]/40 p-6 md:p-8 shadow-lg relative overflow-hidden font-body text-[#11183D] mb-8"
    >
      {/* Background Subtle Gradient Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#EFFAFD] via-[#F8EAF4]/30 to-transparent rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#DCE7F2]">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-display bg-[#4A8BDF] text-white shadow-xs">
            <Zap size={13} className="text-yellow-300" />
            YOUR CURRENT ROADMAP
          </span>
          <span className="text-xs font-semibold text-[#526078] bg-[#EFFAFD] px-3 py-1 rounded-full border border-[#DCE7F2]">
            {roadmap.targetCompanyTier} Track
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#7B8799]">Overall Track Progress:</span>
          <span className="text-sm font-extrabold font-mono text-[#4A8BDF]">{progressPercent}%</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Roadmap Goal & Metadata */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold font-display text-[#2459A8] uppercase tracking-wider">
            <Target size={14} />
            <span>Active Goal: {roadmap.rolePath} → {roadmap.targetCompanyTier}</span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold font-display text-[#11183D] leading-snug">
            {roadmap.title}
          </h2>

          <p className="text-xs md:text-sm text-[#526078] line-clamp-2 leading-relaxed">
            {roadmap.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#526078] pt-1">
            <span className="flex items-center gap-1.5 bg-[#EFFAFD] px-2.5 py-1 rounded-lg border border-[#DCE7F2]">
              <Layers size={13} className="text-[#4A8BDF]" />
              {completedCount} of {totalCount} Milestones Done
            </span>
            <span className="flex items-center gap-1.5 bg-[#EFFAFD] px-2.5 py-1 rounded-lg border border-[#DCE7F2]">
              <Clock size={13} className="text-[#A0006D]" />
              ~{roadmap.estimatedWeeks} Weeks Left
            </span>
          </div>
        </div>

        {/* Right Column: Active Sprint Card */}
        <div className="lg:col-span-6 bg-[#EFFAFD]/90 rounded-2xl border border-[#DCE7F2] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono bg-[#A0006D] text-white">
                SPRINT 07
              </span>
              <span className="text-xs font-bold font-display text-[#11183D]">
                10-Day Sprint Focus
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#168A62] bg-[#E8F5F0] px-2.5 py-0.5 rounded-full border border-[#168A62]/30">
              Day {currentDay} / 10
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#526078]">Current Active Sprint Target:</p>
            <p className="text-sm font-bold font-display text-[#11183D]">
              {currentActiveNode ? currentActiveNode.title : 'Mastering Core Software Engineering & System Patterns'}
            </p>
          </div>

          {/* Sprint Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#7B8799] font-medium">Sprint Completion</span>
              <span className="font-extrabold font-mono text-[#A0006D]">{currentSprintProgress}%</span>
            </div>
            <div className="w-full bg-[#DCE7F2] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#4A8BDF] via-[#2459A8] to-[#A0006D] h-full rounded-full transition-all duration-500"
                style={{ width: `${currentSprintProgress}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="eggplant"
              size="sm"
              onClick={onContinueSprint}
              className="flex-1 text-xs font-display flex items-center justify-center gap-2 shadow-sm"
              icon={<Play size={14} className="fill-white" />}
            >
              Continue Sprint
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onViewRoadmap}
              className="flex-1 text-xs font-display flex items-center justify-center gap-1.5 border-[#DCE7F2] bg-white hover:bg-[#EFFAFD]"
              icon={<ArrowRight size={14} className="text-[#4A8BDF]" />}
            >
              View Roadmap
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
