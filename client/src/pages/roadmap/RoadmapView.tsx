import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Award, CheckCircle2, Lock, Play, ArrowRight, 
  Sparkles, Code2, BookOpen, MessageSquare, ChevronRight, X,
  Building2, Zap, RefreshCw, Check, ArrowLeft, ExternalLink,
  Target, FileCode, Clock, ShieldCheck, Share2, BarChart3,
  Layers, ListTree, Heart, Bookmark
} from 'lucide-react';
import { useRoadmapStore, Roadmap, RoadmapNode } from '../../store/useRoadmapStore';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

// Innovative New Components
import RoadmapCanvasView from '../../components/roadmap/RoadmapCanvasView';
import RoadmapMilestoneList from '../../components/roadmap/RoadmapMilestoneList';
import RoadmapNodeStudio from '../../components/roadmap/RoadmapNodeStudio';
import RoadmapAnalyticsModal from '../../components/roadmap/RoadmapAnalyticsModal';
import RoadmapCertificateModal from '../../components/roadmap/RoadmapCertificateModal';

type ViewMode = 'CANVAS' | 'OUTLINE';

export default function RoadmapView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    roadmaps, 
    completeNode, 
    likedRoadmapIds, 
    toggleUpvoteRoadmap, 
    enrolledRoadmapIds, 
    claimRoadmap 
  } = useRoadmapStore();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // View Mode: Tech-tree Canvas vs Curriculum Outline
  const [viewMode, setViewMode] = useState<ViewMode>('CANVAS');

  // Studio & Modals State
  const [selectedStudioNode, setSelectedStudioNode] = useState<RoadmapNode | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  useEffect(() => {
    // 1. Check in persistent store
    const found = roadmaps.find((r) => r.id === id);
    if (found) {
      setRoadmap(found);
      setIsLoading(false);
      return;
    }

    // 2. Fallback to API if not present in store
    async function fetchRoadmap() {
      try {
        const res = await apiClient.get(`/roadmap/${id}`);
        if (res.data?.data) {
          setRoadmap(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch roadmap:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoadmap();
  }, [id, roadmaps]);

  const handleOpenStudio = (node: RoadmapNode) => {
    setSelectedStudioNode(node);
  };

  const handleMasterNode = (node: RoadmapNode) => {
    if (!roadmap) return;
    completeNode(roadmap.id, node.id, 95);
    toast.success(`Milestone "${node.title}" Mastered! Next step unlocked.`);
    setSelectedStudioNode(null);
  };

  const handleShareRoadmap = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Roadmap link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EFFAFD] flex items-center justify-center font-body text-[#11183D]">
        <div className="text-center space-y-3">
          <RefreshCw size={32} className="animate-spin text-[#4A8BDF] mx-auto" />
          <p className="text-xs font-bold font-display text-[#526078]">
            Calibrating Career Mastery Canvas...
          </p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-[#EFFAFD] flex items-center justify-center p-4 font-body">
        <Card className="p-8 text-center space-y-4 max-w-md bg-white border-[#DCE7F2] rounded-3xl shadow-sm">
          <Compass size={40} className="text-[#4A8BDF] mx-auto" />
          <h2 className="text-lg font-bold font-display text-[#11183D]">Roadmap Not Found</h2>
          <p className="text-xs text-[#526078]">
            This roadmap may have been moved or removed. Browse all available roadmaps in the marketplace catalog.
          </p>
          <Button variant="royal" onClick={() => navigate('/roadmap')}>
            Return to Roadmap Catalog
          </Button>
        </Card>
      </div>
    );
  }

  const masteredCount = roadmap.nodesData.filter((n) => n.status === 'MASTERED').length;
  const totalCount = roadmap.nodesData.length;
  const currentReadiness = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-8 px-4 sm:px-6 lg:px-8 font-body text-[#11183D]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ══════════════════════════════════════════════════════════ */}
        {/* TOP TOOLBAR & BREADCRUMB                                   */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate('/roadmap')}
            className="inline-flex items-center gap-2 text-xs font-bold font-display text-[#526078] hover:text-[#2459A8] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Career Roadmap Catalog</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle: Canvas vs Outline */}
            <div className="bg-white p-1 rounded-2xl border border-[#DCE7F2] flex items-center gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('CANVAS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                  viewMode === 'CANVAS'
                    ? 'bg-[#2459A8] text-white shadow-xs'
                    : 'text-[#526078] hover:text-[#11183D]'
                }`}
              >
                <Layers size={13} />
                <span>Tech-Tree Canvas</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('OUTLINE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                  viewMode === 'OUTLINE'
                    ? 'bg-[#2459A8] text-white shadow-xs'
                    : 'text-[#526078] hover:text-[#11183D]'
                }`}
              >
                <ListTree size={13} />
                <span>Curriculum Outline</span>
              </button>
            </div>

            {/* Vote / Upvote Button */}
            <button
              type="button"
              onClick={() => {
                toggleUpvoteRoadmap(roadmap.id);
                if (likedRoadmapIds.includes(roadmap.id)) {
                  toast('Vote removed from roadmap.', { icon: '🤍' });
                } else {
                  toast.success(`Voted! Added to Liked Roadmaps.`);
                }
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold font-display flex items-center gap-1.5 transition-all cursor-pointer border shadow-2xs ${
                likedRoadmapIds.includes(roadmap.id)
                  ? 'bg-[#F8EAF4] text-[#A0006D] border-[#A0006D]/40'
                  : 'bg-white text-[#526078] border-[#DCE7F2] hover:text-[#A0006D]'
              }`}
              title={likedRoadmapIds.includes(roadmap.id) ? 'Click to unvote' : 'Vote / Upvote this roadmap'}
            >
              <Heart size={14} className={likedRoadmapIds.includes(roadmap.id) ? 'fill-[#A0006D] text-[#A0006D]' : ''} />
              <span>{roadmap.upvotes || 0} Votes</span>
            </button>

            {/* Claim / In My Roadmaps Button */}
            {!enrolledRoadmapIds.includes(roadmap.id) ? (
              <Button
                variant="royal"
                size="sm"
                onClick={() => {
                  claimRoadmap(roadmap.id);
                  toast.success(`Claimed! "${roadmap.title}" added to My Roadmaps.`);
                }}
                icon={<Bookmark size={14} />}
                className="shadow-2xs text-xs font-display"
              >
                Claim Roadmap
              </Button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold font-display bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30 shadow-2xs">
                <Check size={13} />
                In My Roadmaps
              </span>
            )}

            {/* Analytics Drawer Trigger */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAnalyticsOpen(true)}
              icon={<BarChart3 size={14} className="text-[#4A8BDF]" />}
              className="bg-white shadow-2xs text-xs font-display"
            >
              Readiness & Velocity
            </Button>

            {/* Certificate Trigger */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCertificateOpen(true)}
              icon={<Award size={14} className="text-[#A0006D]" />}
              className="bg-white shadow-2xs text-xs font-display"
            >
              Milestone Certificate
            </Button>

            {/* Share Track */}
            <button
              onClick={handleShareRoadmap}
              title="Share Track URL"
              className="p-2 rounded-xl bg-white border border-[#DCE7F2] text-[#526078] hover:text-[#11183D] shadow-2xs transition-colors cursor-pointer"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* OVERVIEW HERO CARD WITH TARGET BENCHMARK & READINESS       */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="p-6 sm:p-8 bg-white border border-[#DCE7F2] shadow-sm rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                {roadmap.isOfficial ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold font-display bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30">
                    <ShieldCheck size={13} className="text-[#4A8BDF]" />
                    Official RU Ready Blueprint
                  </span>
                ) : roadmap.isAiGenerated ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold font-display bg-[#F8EAF4] text-[#A0006D] border border-[#A0006D]/30">
                    <Sparkles size={13} className="text-[#A0006D]" />
                    AI Synthesized
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-display bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30">
                    Community Track by {roadmap.creatorName || 'Community Member'}
                  </span>
                )}

                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#F8EAF4] text-[#A0006D] uppercase font-mono">
                  {roadmap.targetCompanyTier} Benchmark
                </span>
                <span className="text-xs font-semibold text-[#526078]">
                  • {roadmap.difficulty}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
                {roadmap.title}
              </h1>

              <p className="text-xs text-[#526078] leading-relaxed">
                {roadmap.description}
              </p>

              {/* Creator Credit & Key Specs */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#526078]">
                <div className="flex items-center gap-2">
                  {roadmap.creatorAvatar ? (
                    <img
                      src={roadmap.creatorAvatar}
                      alt={roadmap.creatorName}
                      className="w-6 h-6 rounded-full object-cover border border-[#DCE7F2]"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2459A8] to-[#4A8BDF] text-white flex items-center justify-center text-[10px] font-bold">
                      {roadmap.creatorName.charAt(0)}
                    </div>
                  )}
                  <span>Curated by: <strong className="font-bold text-[#11183D]">{roadmap.creatorName}</strong></span>
                </div>

                <div className="flex items-center gap-1.5 font-medium">
                  <Bookmark size={13} className="text-[#168A62]" />
                  <span>{roadmap.enrolledCount} Claimed</span>
                </div>

                <div className="flex items-center gap-1.5 font-medium">
                  <Clock size={13} className="text-[#A0006D]" />
                  <span>~{roadmap.estimatedWeeks} Weeks</span>
                </div>

                <div className="flex items-center gap-1.5 font-medium">
                  <Layers size={13} className="text-[#4A8BDF]" />
                  <span>{roadmap.nodesData.length} Milestones</span>
                </div>
              </div>
            </div>

            {/* Overall Readiness Meter Card */}
            <div className="flex items-center gap-4 bg-[#EFFAFD] p-5 rounded-2xl border border-[#DCE7F2] shrink-0">
              <div className="text-right">
                <span className="text-3xl font-black font-display text-[#A0006D]">
                  {currentReadiness}%
                </span>
                <span className="text-[10px] font-bold text-[#526078] block uppercase tracking-wider">
                  Target Readiness
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#A0006D] to-[#4A8BDF] text-white flex items-center justify-center shadow-xs">
                <Award size={24} />
              </div>
            </div>
          </div>

          {/* Progress Bar & Quick Velocity Info */}
          <div className="space-y-1.5 pt-2 border-t border-[#DCE7F2]">
            <div className="flex items-center justify-between text-xs text-[#526078]">
              <span>Milestones Progress ({masteredCount} of {totalCount} completed)</span>
              <span className="font-mono font-bold text-[#11183D]">{currentReadiness}% Mastered</span>
            </div>
            <div className="w-full bg-[#EFFAFD] h-2.5 rounded-full overflow-hidden border border-[#DCE7F2]">
              <div
                className="bg-gradient-to-r from-[#4A8BDF] via-[#2459A8] to-[#A0006D] h-full rounded-full transition-all duration-500"
                style={{ width: `${currentReadiness}%` }}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* DUAL-MODE CONTENT DISPLAY                                  */}
        {/* ══════════════════════════════════════════════════════════ */}
        {viewMode === 'CANVAS' ? (
          <RoadmapCanvasView
            roadmap={roadmap}
            onOpenNodeStudio={handleOpenStudio}
          />
        ) : (
          <RoadmapMilestoneList
            roadmap={roadmap}
            onOpenNodeStudio={handleOpenStudio}
          />
        )}

      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* FLAGSHIP INTERACTIVE NODE STUDIO WORKSPACE                 */}
      {/* ══════════════════════════════════════════════════════════ */}
      <RoadmapNodeStudio
        roadmap={roadmap}
        node={selectedStudioNode}
        isOpen={!!selectedStudioNode}
        onClose={() => setSelectedStudioNode(null)}
        onCompleteNode={handleMasterNode}
      />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* READINESS & VELOCITY ANALYTICS MODAL                       */}
      {/* ══════════════════════════════════════════════════════════ */}
      <RoadmapAnalyticsModal
        roadmap={roadmap}
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* VERIFIED MILESTONE CERTIFICATE MODAL                       */}
      {/* ══════════════════════════════════════════════════════════ */}
      <RoadmapCertificateModal
        roadmap={roadmap}
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

    </div>
  );
}
