import React from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, ShieldCheck, Users, Clock, Award, Eye, ArrowRight,
  Layers, Sparkles, CheckCircle2, Bookmark, Heart, Check
} from 'lucide-react';
import { Roadmap, useRoadmapStore } from '../../store/useRoadmapStore';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import toast from 'react-hot-toast';

interface RoadmapCardProps {
  roadmap: Roadmap;
  isEnrolled?: boolean;
  onPreview: (roadmap: Roadmap) => void;
  onEnrollOrStart: (roadmap: Roadmap) => void;
  onClaim?: (roadmap: Roadmap) => void;
}

export default function RoadmapCard({
  roadmap,
  isEnrolled = false,
  onPreview,
  onEnrollOrStart,
  onClaim,
}: RoadmapCardProps) {
  const { likedRoadmapIds, toggleUpvoteRoadmap, claimRoadmap } = useRoadmapStore();
  const isLiked = likedRoadmapIds?.includes(roadmap.id);

  const completedNodesCount = roadmap.nodesData.filter((n) => n.status === 'MASTERED').length;
  const totalNodesCount = roadmap.nodesData.length;
  const calculatedReadiness = totalNodesCount > 0 
    ? Math.round((completedNodesCount / totalNodesCount) * 100) 
    : 0;

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleUpvoteRoadmap(roadmap.id);
    if (isLiked) {
      toast('Vote removed from roadmap.', { icon: '🤍' });
    } else {
      toast.success(`Voted! Added to Liked Roadmaps.`);
    }
  };

  const handleClaim = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClaim) {
      onClaim(roadmap);
    } else {
      claimRoadmap(roadmap.id);
      toast.success(`Claimed! "${roadmap.title}" added to My Roadmaps.`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-xs hover:shadow-xl hover:border-[#4A8BDF]/40 transition-all duration-300 font-body text-[#11183D] relative group"
    >
      {/* Top Meta Bar */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {roadmap.isOfficial ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold font-display bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30 shadow-xs">
              <ShieldCheck size={13} className="text-[#4A8BDF]" />
              Official Blueprint
            </span>
          ) : roadmap.isAiGenerated ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold font-display bg-[#F8EAF4] text-[#A0006D] border border-[#A0006D]/30 shadow-xs">
              <Sparkles size={13} className="text-[#A0006D]" />
              AI Synthesized
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-display bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30">
              <Users size={12} className="text-[#168A62]" />
              Community Track
            </span>
          )}

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-[#EFFAFD] text-[#526078] border border-[#DCE7F2]">
            {roadmap.targetCompanyTier}
          </span>

          {isEnrolled && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-display bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30">
              <Check size={11} />
              In My Roadmaps
            </span>
          )}
        </div>

        {/* Upvote / Vote Button */}
        <button
          type="button"
          onClick={handleToggleLike}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
            isLiked
              ? 'bg-[#F8EAF4] text-[#A0006D] border-[#A0006D]/40 shadow-xs'
              : 'bg-white text-[#7B8799] border-[#DCE7F2] hover:text-[#A0006D] hover:border-[#A0006D]/30'
          }`}
          title={isLiked ? 'Click to unvote' : 'Vote / Upvote this roadmap'}
        >
          <Heart size={13} className={isLiked ? 'fill-[#A0006D] text-[#A0006D]' : ''} />
          <span className="font-mono text-[11px]">{roadmap.upvotes || 0}</span>
        </button>
      </div>

      {/* Main Title & Description */}
      <div className="space-y-2 flex-1">
        <h3 className="text-lg font-bold font-display text-[#11183D] leading-snug group-hover:text-[#2459A8] transition-colors">
          {roadmap.title}
        </h3>
        <p className="text-xs text-[#526078] line-clamp-2 leading-relaxed">
          {roadmap.description}
        </p>
      </div>

      {/* Author Details if Community or AI */}
      <div className="flex items-center gap-2.5 pt-4 mt-4 border-t border-[#DCE7F2]">
        {roadmap.creatorAvatar ? (
          <img
            src={roadmap.creatorAvatar}
            alt={roadmap.creatorName}
            className="w-7 h-7 rounded-full object-cover border border-[#DCE7F2]"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2459A8] to-[#4A8BDF] flex items-center justify-center text-white text-[11px] font-bold font-display">
            {roadmap.creatorName.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold font-display text-[#11183D] truncate">
            {roadmap.creatorName}
          </p>
          <p className="text-[10px] text-[#7B8799] truncate">
            {roadmap.creatorRole || `@${roadmap.creatorUsername}`}
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[#526078] shrink-0 bg-[#EFFAFD] px-2.5 py-1 rounded-xl">
          {roadmap.difficulty}
        </span>
      </div>

      {/* Key Metrics / Specs */}
      <div className="grid grid-cols-3 gap-2 py-3.5 my-3 bg-[#EFFAFD]/60 rounded-2xl border border-[#DCE7F2]/80 text-center">
        <div>
          <span className="block text-[10px] font-semibold text-[#7B8799] uppercase">Milestones</span>
          <span className="text-xs font-bold font-display text-[#11183D] flex items-center justify-center gap-1">
            <Layers size={12} className="text-[#4A8BDF]" />
            {roadmap.nodesData.length} Steps
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-semibold text-[#7B8799] uppercase">Duration</span>
          <span className="text-xs font-bold font-display text-[#11183D] flex items-center justify-center gap-1">
            <Clock size={12} className="text-[#A0006D]" />
            ~{roadmap.estimatedWeeks} Wks
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-semibold text-[#7B8799] uppercase">Claimed</span>
          <span className="text-xs font-bold font-display text-[#11183D] flex items-center justify-center gap-1">
            <Bookmark size={12} className="text-[#168A62]" />
            {roadmap.enrolledCount}
          </span>
        </div>
      </div>

      {/* Progress Bar if Enrolled / Claimed */}
      {isEnrolled && (
        <div className="mb-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#526078]">Your Track Readiness</span>
            <span className="font-extrabold font-mono text-[#A0006D]">{calculatedReadiness}%</span>
          </div>
          <div className="w-full bg-[#DCE7F2] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#4A8BDF] to-[#A0006D] h-full rounded-full transition-all duration-500"
              style={{ width: `${calculatedReadiness}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPreview(roadmap)}
          className="flex-1 text-xs font-display flex items-center justify-center gap-1.5 border-[#DCE7F2] hover:bg-[#EFFAFD]"
          icon={<Eye size={14} className="text-[#4A8BDF]" />}
        >
          Preview
        </Button>

        {!isEnrolled ? (
          <Button
            variant="royal"
            size="sm"
            onClick={handleClaim}
            className="flex-1 text-xs font-display flex items-center justify-center gap-1.5 shadow-sm"
            icon={<Bookmark size={14} />}
          >
            Claim Roadmap
          </Button>
        ) : (
          <Button
            variant="eggplant"
            size="sm"
            onClick={() => onEnrollOrStart(roadmap)}
            className="flex-1 text-xs font-display flex items-center justify-center gap-1.5 shadow-sm"
            icon={<ArrowRight size={14} />}
          >
            Resume Track
          </Button>
        )}
      </div>
    </motion.div>
  );
}
