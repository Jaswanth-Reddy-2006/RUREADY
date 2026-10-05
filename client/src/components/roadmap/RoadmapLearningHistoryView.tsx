import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  ExternalLink,
  Filter,
  Layers,
  Zap,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  FileCheck2,
  Code2,
  History,
  TrendingUp,
  ShieldCheck,
  XCircle,
  FolderGit2,
} from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import {
  RoadmapLearningHistoryDTO,
  MilestoneTimelineItemDTO,
  HistoricalSprintArchiveDTO,
  HistoricalEvidenceItemDTO,
  HistoricalAssessmentItemDTO,
  HistoricalAdaptationItemDTO,
} from '@ru-ready/shared';

interface RoadmapLearningHistoryViewProps {
  userRoadmapId?: string;
  onSelectNode?: (nodeId: string) => void;
  onBackToTrack?: () => void;
}

type HistoryTab = 'TIMELINE' | 'SPRINTS' | 'EVIDENCE' | 'ASSESSMENTS' | 'ADAPTATIONS';
type TimelineFilter = 'ALL' | 'MILESTONES' | 'SPRINTS' | 'EVIDENCE' | 'ASSESSMENTS' | 'PRACTICAL' | 'ADAPTATIONS';

export default function RoadmapLearningHistoryView({
  userRoadmapId,
  onSelectNode,
  onBackToTrack,
}: RoadmapLearningHistoryViewProps) {
  const {
    activeUserRoadmap,
    userRoadmaps,
    roadmapHistories,
    isHistoryLoading,
    historyError,
    fetchRoadmapHistory,
  } = useRoadmapStore();

  const resolvedUserRoadmapId =
    userRoadmapId ||
    activeUserRoadmap?.id ||
    Object.values(userRoadmaps)[0]?.id;

  const history: RoadmapLearningHistoryDTO | undefined = resolvedUserRoadmapId
    ? roadmapHistories[resolvedUserRoadmapId]
    : undefined;

  const [activeTab, setActiveTab] = useState<HistoryTab>('TIMELINE');
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('ALL');
  const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (resolvedUserRoadmapId && !roadmapHistories[resolvedUserRoadmapId]) {
      fetchRoadmapHistory(resolvedUserRoadmapId);
    }
  }, [resolvedUserRoadmapId, fetchRoadmapHistory, roadmapHistories]);

  const toggleSprintExpand = (sprintId: string) => {
    setExpandedSprints((prev) => ({
      ...prev,
      [sprintId]: !prev[sprintId],
    }));
  };

  const handleRetry = () => {
    if (resolvedUserRoadmapId) {
      fetchRoadmapHistory(resolvedUserRoadmapId);
    }
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  // Safe external URL renderer
  const renderExternalLink = (url?: string | null) => {
    if (!url || typeof url !== 'string') return null;
    const isSafeUrl = /^https?:\/\//i.test(url.trim());
    if (!isSafeUrl) {
      return <span className="text-xs font-mono text-[#526078] break-all">{url}</span>;
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2459A8] hover:text-[#4A8BDF] hover:underline break-all"
      >
        <span>{url.length > 40 ? `${url.slice(0, 37)}...` : url}</span>
        <ExternalLink size={12} className="shrink-0" />
      </a>
    );
  };

  // Loading State
  if (isHistoryLoading && !history) {
    return (
      <div className="space-y-6 font-body text-[#11183D] animate-pulse" data-testid="history-loading">
        <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 md:p-8 space-y-4">
          <div className="h-6 w-48 bg-[#EFFAFD] rounded-lg" />
          <div className="h-9 w-80 bg-[#EFFAFD] rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-[#EFFAFD] rounded-2xl border border-[#DCE7F2]" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 space-y-4">
          <div className="h-8 w-64 bg-[#EFFAFD] rounded-lg" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#EFFAFD]/60 rounded-2xl border border-[#DCE7F2]" />
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (historyError && !history) {
    return (
      <div className="bg-white rounded-3xl border-2 border-red-200 p-8 text-center space-y-4 font-body" data-testid="history-error">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
          <AlertCircle size={24} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-display text-[#11183D]">
            Unable to Load Learning History
          </h3>
          <p className="text-xs text-[#526078] max-w-md mx-auto">
            {historyError}
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display bg-[#2459A8] text-white hover:bg-[#1B437E] transition-all shadow-xs"
          >
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
          {onBackToTrack && (
            <button
              onClick={onBackToTrack}
              className="px-4 py-2 rounded-xl text-xs font-bold font-display bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30 hover:bg-[#DCE7F2] transition-all"
            >
              Back to Active Track
            </button>
          )}
        </div>
      </div>
    );
  }

  // Filter timeline items
  const filteredTimeline = (history?.timeline || []).filter((item) => {
    if (timelineFilter === 'ALL') return true;
    if (timelineFilter === 'MILESTONES') return item.type === 'TASK_COMPLETED';
    if (timelineFilter === 'SPRINTS') return item.type === 'SPRINT_COMPLETED';
    if (timelineFilter === 'EVIDENCE') return item.type === 'SKILL_EVIDENCE' || item.type === 'PRACTICAL_DRILL';
    if (timelineFilter === 'ASSESSMENTS') return item.type === 'ASSESSMENT_PASSED';
    if (timelineFilter === 'PRACTICAL') return item.type === 'PRACTICAL_DRILL';
    if (timelineFilter === 'ADAPTATIONS') return item.type === 'ROADMAP_ADAPTATION';
    return true;
  });

  const getTimelineIcon = (type: MilestoneTimelineItemDTO['type']) => {
    switch (type) {
      case 'TASK_COMPLETED':
        return <CheckCircle2 size={16} className="text-[#168A62]" />;
      case 'SPRINT_COMPLETED':
        return <Award size={16} className="text-[#A0006D]" />;
      case 'SKILL_EVIDENCE':
        return <FileCheck2 size={16} className="text-[#2459A8]" />;
      case 'ASSESSMENT_PASSED':
        return <ShieldCheck size={16} className="text-[#168A62]" />;
      case 'PRACTICAL_DRILL':
        return <Code2 size={16} className="text-[#A0006D]" />;
      case 'ROADMAP_ADAPTATION':
        return <Zap size={16} className="text-[#4A8BDF]" />;
      default:
        return <Sparkles size={16} className="text-[#2459A8]" />;
    }
  };

  const getTimelineBadge = (type: MilestoneTimelineItemDTO['type']) => {
    switch (type) {
      case 'TASK_COMPLETED':
        return { label: 'Task Milestone', bg: 'bg-[#E8F5F0]', text: 'text-[#168A62]', border: 'border-[#168A62]/30' };
      case 'SPRINT_COMPLETED':
        return { label: 'Sprint Completed', bg: 'bg-[#F8EAF4]', text: 'text-[#A0006D]', border: 'border-[#A0006D]/30' };
      case 'SKILL_EVIDENCE':
        return { label: 'Skill Evidence', bg: 'bg-[#EFFAFD]', text: 'text-[#2459A8]', border: 'border-[#4A8BDF]/30' };
      case 'ASSESSMENT_PASSED':
        return { label: 'Assessment Passed', bg: 'bg-[#E8F5F0]', text: 'text-[#168A62]', border: 'border-[#168A62]/30' };
      case 'PRACTICAL_DRILL':
        return { label: 'Practical Drill', bg: 'bg-[#F8EAF4]', text: 'text-[#A0006D]', border: 'border-[#A0006D]/30' };
      case 'ROADMAP_ADAPTATION':
        return { label: 'Roadmap Adaptation', bg: 'bg-[#EFFAFD]', text: 'text-[#4A8BDF]', border: 'border-[#4A8BDF]/30' };
      default:
        return { label: 'Milestone', bg: 'bg-[#EFFAFD]', text: 'text-[#2459A8]', border: 'border-[#4A8BDF]/30' };
    }
  };

  return (
    <div className="space-y-6 font-body text-[#11183D]" data-testid="learning-history-view">
      {/* Header Banner & Summary Metrics */}
      <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#DCE7F2]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold font-display text-[#2459A8] uppercase tracking-wider mb-1">
              <History size={14} />
              <span>Verified Learning History & Evidence</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-[#11183D]">
              Proof-of-Work Portfolio
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {history?.targetRole && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-display bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30">
                <Target size={13} />
                {history.targetRole} {history.targetCompanyTier ? `• ${history.targetCompanyTier}` : ''}
              </span>
            )}
            <button
              onClick={handleRetry}
              title="Refresh learning history"
              className="p-2 rounded-xl text-[#526078] hover:text-[#2459A8] hover:bg-[#EFFAFD] transition-all border border-[#DCE7F2]"
              aria-label="Refresh history"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* 5 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" data-testid="summary-metrics">
          <div className="bg-[#EFFAFD] rounded-2xl p-4 border border-[#DCE7F2] space-y-0.5">
            <span className="block text-[11px] font-bold text-[#7B8799] uppercase tracking-wider">Completed Sprints</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-[#2459A8]">
                {history?.completedSprintsCount ?? 0}
              </span>
              <span className="text-xs font-mono text-[#526078]">/ {history?.totalSprintsCount ?? 0}</span>
            </div>
            <span className="block text-[10px] text-[#526078]">Verified cycles</span>
          </div>

          <div className="bg-[#E8F5F0] rounded-2xl p-4 border border-[#168A62]/30 space-y-0.5">
            <span className="block text-[11px] font-bold text-[#168A62] uppercase tracking-wider">Milestones Mastered</span>
            <span className="text-2xl font-extrabold font-mono text-[#168A62] block">
              {history?.totalMilestonesCompleted ?? 0}
            </span>
            <span className="block text-[10px] text-[#168A62]/80">Tasks completed</span>
          </div>

          <div className="bg-[#EFFAFD] rounded-2xl p-4 border border-[#4A8BDF]/30 space-y-0.5">
            <span className="block text-[11px] font-bold text-[#2459A8] uppercase tracking-wider">Skill Evidence</span>
            <span className="text-2xl font-extrabold font-mono text-[#2459A8] block">
              {history?.totalEvidenceCount ?? 0}
            </span>
            <span className="block text-[10px] text-[#526078]">Artifacts recorded</span>
          </div>

          <div className="bg-[#F8EAF4] rounded-2xl p-4 border border-[#A0006D]/30 space-y-0.5">
            <span className="block text-[11px] font-bold text-[#A0006D] uppercase tracking-wider">Micro-Assessments</span>
            <span className="text-2xl font-extrabold font-mono text-[#A0006D] block">
              {history?.totalAssessmentsTaken ?? 0}
            </span>
            <span className="block text-[10px] text-[#A0006D]/80">Graded attempts</span>
          </div>

          <div className="bg-[#EFFAFD] rounded-2xl p-4 border border-[#DCE7F2] space-y-0.5 col-span-2 sm:col-span-1">
            <span className="block text-[11px] font-bold text-[#7B8799] uppercase tracking-wider">Practical Drills</span>
            <span className="text-2xl font-extrabold font-mono text-[#11183D] block">
              {history?.totalPracticalsCompleted ?? 0}
            </span>
            <span className="block text-[10px] text-[#526078]">Project milestones</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE7F2] pb-2">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'TIMELINE'}
            onClick={() => setActiveTab('TIMELINE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'TIMELINE'
                ? 'bg-[#2459A8] text-white shadow-xs'
                : 'bg-white text-[#526078] hover:bg-[#EFFAFD] hover:text-[#2459A8] border border-[#DCE7F2]'
            }`}
          >
            Historical Timeline ({history?.timeline?.length || 0})
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'SPRINTS'}
            onClick={() => setActiveTab('SPRINTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'SPRINTS'
                ? 'bg-[#2459A8] text-white shadow-xs'
                : 'bg-white text-[#526078] hover:bg-[#EFFAFD] hover:text-[#2459A8] border border-[#DCE7F2]'
            }`}
          >
            Sprint Archives ({history?.sprintArchives?.length || 0})
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'EVIDENCE'}
            onClick={() => setActiveTab('EVIDENCE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'EVIDENCE'
                ? 'bg-[#2459A8] text-white shadow-xs'
                : 'bg-white text-[#526078] hover:bg-[#EFFAFD] hover:text-[#2459A8] border border-[#DCE7F2]'
            }`}
          >
            Skill Evidence ({history?.evidence?.length || 0})
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'ASSESSMENTS'}
            onClick={() => setActiveTab('ASSESSMENTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'ASSESSMENTS'
                ? 'bg-[#2459A8] text-white shadow-xs'
                : 'bg-white text-[#526078] hover:bg-[#EFFAFD] hover:text-[#2459A8] border border-[#DCE7F2]'
            }`}
          >
            Assessments ({history?.assessments?.length || 0})
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'ADAPTATIONS'}
            onClick={() => setActiveTab('ADAPTATIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'ADAPTATIONS'
                ? 'bg-[#2459A8] text-white shadow-xs'
                : 'bg-white text-[#526078] hover:bg-[#EFFAFD] hover:text-[#2459A8] border border-[#DCE7F2]'
            }`}
          >
            Adaptations ({history?.adaptations?.length || 0})
          </button>
        </div>
      </div>

      {/* TAB 1: HISTORICAL TIMELINE */}
      {activeTab === 'TIMELINE' && (
        <div className="space-y-4" data-testid="timeline-section">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white rounded-2xl border border-[#DCE7F2]">
            <span className="text-[11px] font-bold text-[#7B8799] uppercase px-2 flex items-center gap-1">
              <Filter size={12} />
              Filter:
            </span>
            {(['ALL', 'MILESTONES', 'SPRINTS', 'EVIDENCE', 'ASSESSMENTS', 'PRACTICAL', 'ADAPTATIONS'] as TimelineFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setTimelineFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-display transition-all ${
                  timelineFilter === f
                    ? 'bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/40 font-bold'
                    : 'text-[#526078] hover:bg-slate-50'
                }`}
              >
                {f === 'ALL'
                  ? 'All'
                  : f === 'MILESTONES'
                  ? 'Milestones'
                  : f === 'SPRINTS'
                  ? 'Sprints'
                  : f === 'EVIDENCE'
                  ? 'Evidence'
                  : f === 'ASSESSMENTS'
                  ? 'Assessments'
                  : f === 'PRACTICAL'
                  ? 'Practical'
                  : 'Adaptations'}
              </button>
            ))}
          </div>

          {/* Timeline Feed */}
          {filteredTimeline.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#DCE7F2] p-8 text-center space-y-2" data-testid="timeline-empty">
              <div className="w-10 h-10 rounded-2xl bg-[#EFFAFD] text-[#2459A8] flex items-center justify-center mx-auto border border-[#DCE7F2]">
                <Layers size={18} />
              </div>
              <h4 className="text-sm font-bold font-display text-[#11183D]">
                No Timeline Events Found
              </h4>
              <p className="text-xs text-[#526078] max-w-sm mx-auto">
                {timelineFilter !== 'ALL'
                  ? `No events matching the "${timelineFilter.toLowerCase()}" filter yet.`
                  : 'Complete tasks, submit evidence, or pass assessments in your active sprint to build your proof-of-work timeline.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 relative before:absolute before:top-4 before:bottom-4 before:left-5 before:w-0.5 before:bg-[#DCE7F2]">
              {filteredTimeline.map((item) => {
                const badge = getTimelineBadge(item.type);
                return (
                  <div
                    key={item.id}
                    className="relative flex items-start gap-3.5 pl-2"
                  >
                    {/* Event Icon Node */}
                    <div className="relative z-10 w-7 h-7 rounded-full bg-white border-2 border-[#DCE7F2] flex items-center justify-center shrink-0 shadow-2xs mt-3">
                      {getTimelineIcon(item.type)}
                    </div>

                    {/* Event Card */}
                    <div className="flex-1 bg-white rounded-2xl border border-[#DCE7F2] p-4 hover:border-[#4A8BDF]/40 transition-all shadow-2xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-display border ${badge.bg} ${badge.text} ${badge.border}`}>
                            {badge.label}
                          </span>
                          {item.skillName && (
                            <span className="text-xs font-semibold text-[#526078]">
                              • {item.skillName}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-[#7B8799]">
                          {formatDate(item.date)}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold font-display text-[#11183D]">
                        {item.title}
                      </h4>

                      {item.description && (
                        <p className="text-xs text-[#526078] leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {typeof item.score === 'number' && (
                        <div className="flex items-center gap-2 pt-1 text-xs">
                          <span className="font-semibold text-[#7B8799]">Demonstrated Score:</span>
                          <span className="font-bold font-mono text-[#168A62]">{item.score}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SPRINT ARCHIVES */}
      {activeTab === 'SPRINTS' && (
        <div className="space-y-4" data-testid="sprint-archives-section">
          {(!history?.sprintArchives || history.sprintArchives.length === 0) ? (
            <div className="bg-white rounded-3xl border border-[#DCE7F2] p-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#EFFAFD] text-[#2459A8] flex items-center justify-center mx-auto border border-[#DCE7F2]">
                <Award size={18} />
              </div>
              <h4 className="text-sm font-bold font-display text-[#11183D]">
                No Sprints Archived Yet
              </h4>
              <p className="text-xs text-[#526078] max-w-sm mx-auto">
                Completed sprints are permanently archived here with performance ratings, telemetry, and verified deliverables.
              </p>
            </div>
          ) : (
            history.sprintArchives.map((sprint) => {
              const isExpanded = Boolean(expandedSprints[sprint.sprintId]);

              return (
                <div
                  key={sprint.sprintId}
                  className="bg-white rounded-3xl border border-[#DCE7F2] p-5 md:p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30">
                          Sprint {sprint.sprintNumber < 10 ? `0${sprint.sprintNumber}` : sprint.sprintNumber}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-display ${
                          sprint.status === 'COMPLETED'
                            ? 'bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30'
                            : 'bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30'
                        }`}>
                          {sprint.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                        </span>
                        {sprint.decision && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            Decision: {sprint.decision}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base md:text-lg font-bold font-display text-[#11183D]">
                        {sprint.objective}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleSprintExpand(sprint.sprintId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-display bg-[#EFFAFD] text-[#2459A8] hover:bg-[#DCE7F2] transition-all border border-[#4A8BDF]/30"
                      aria-expanded={isExpanded}
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Performance & Skills'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="bg-slate-50 rounded-xl p-3 border border-[#DCE7F2]">
                      <span className="block text-[10px] font-bold text-[#7B8799] uppercase">Tasks Completion</span>
                      <span className="text-sm font-extrabold font-mono text-[#11183D]">
                        {sprint.completedTasks} / {sprint.totalTasks} ({sprint.completionPercentage}%)
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 border border-[#DCE7F2]">
                      <span className="block text-[10px] font-bold text-[#7B8799] uppercase">Assessment Score</span>
                      <span className="text-sm font-extrabold font-mono text-[#2459A8]">
                        {typeof sprint.performance?.assessmentScore === 'number' ? `${sprint.performance.assessmentScore}%` : '—'}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 border border-[#DCE7F2]">
                      <span className="block text-[10px] font-bold text-[#7B8799] uppercase">Practical Score</span>
                      <span className="text-sm font-extrabold font-mono text-[#168A62]">
                        {typeof sprint.performance?.practicalScore === 'number' ? `${sprint.performance.practicalScore}%` : '—'}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 border border-[#DCE7F2]">
                      <span className="block text-[10px] font-bold text-[#7B8799] uppercase">Completed Date</span>
                      <span className="text-xs font-mono text-[#526078]">
                        {formatDate(sprint.completedAt || sprint.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Skills & Performance Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-3 border-t border-[#DCE7F2]"
                      >
                        {sprint.performance?.notes && (
                          <div className="bg-[#EFFAFD] rounded-2xl p-4 border border-[#4A8BDF]/30 space-y-1">
                            <span className="text-[10px] font-bold text-[#2459A8] uppercase tracking-wider block">
                              Sprint Review Notes
                            </span>
                            <p className="text-xs text-[#11183D] leading-relaxed">
                              {sprint.performance.notes}
                            </p>
                          </div>
                        )}

                        {sprint.skillsAddressed && sprint.skillsAddressed.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-bold font-display text-[#11183D] uppercase tracking-wider block">
                              Skills Addressed ({sprint.skillsAddressed.length})
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {sprint.skillsAddressed.map((skillName, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                                >
                                  <CheckCircle2 size={12} className="text-[#168A62]" />
                                  {skillName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: SKILL EVIDENCE */}
      {activeTab === 'EVIDENCE' && (
        <div className="space-y-4" data-testid="evidence-section">
          {(!history?.evidence || history.evidence.length === 0) ? (
            <div className="bg-white rounded-3xl border border-[#DCE7F2] p-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#EFFAFD] text-[#2459A8] flex items-center justify-center mx-auto border border-[#DCE7F2]">
                <FileCheck2 size={18} />
              </div>
              <h4 className="text-sm font-bold font-display text-[#11183D]">
                No Verified Evidence Recorded Yet
              </h4>
              <p className="text-xs text-[#526078] max-w-sm mx-auto">
                Evidence is verified when completing practical coding drills, submitting project repositories, or completing assessments.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.evidence.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white rounded-2xl border border-[#DCE7F2] p-5 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ev.source === 'PROJECT'
                          ? 'bg-[#F8EAF4] text-[#A0006D] border border-[#A0006D]/30'
                          : ev.source === 'ASSESSMENT'
                          ? 'bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30'
                          : 'bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30'
                      }`}>
                        Source: {ev.source}
                      </span>
                      <span className="text-[11px] font-mono text-[#7B8799]">
                        {formatDate(ev.assessedAt)}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-display text-[#11183D]">
                      {ev.skillName || 'Skill Competency'}
                    </h4>

                    {ev.skillCategory && (
                      <span className="text-xs text-[#526078] block">
                        Category: {ev.skillCategory}
                      </span>
                    )}

                    {ev.externalReference && (
                      <div className="pt-1">
                        <span className="text-[10px] font-bold text-[#7B8799] uppercase block mb-0.5">
                          Evidence Reference:
                        </span>
                        {renderExternalLink(ev.externalReference)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#DCE7F2]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#7B8799]">Demonstrated Score:</span>
                      <span className="text-xs font-bold font-mono text-[#168A62]">
                        {typeof ev.demonstratedScore === 'number' ? `${ev.demonstratedScore}%` : 'Verified'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-[#7B8799]">Confidence:</span>
                      <span className="text-[10px] font-bold font-mono text-[#2459A8]">{ev.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ASSESSMENTS */}
      {activeTab === 'ASSESSMENTS' && (
        <div className="space-y-4" data-testid="assessments-section">
          {(!history?.assessments || history.assessments.length === 0) ? (
            <div className="bg-white rounded-3xl border border-[#DCE7F2] p-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#EFFAFD] text-[#2459A8] flex items-center justify-center mx-auto border border-[#DCE7F2]">
                <ShieldCheck size={18} />
              </div>
              <h4 className="text-sm font-bold font-display text-[#11183D]">
                No Assessment Attempts Recorded
              </h4>
              <p className="text-xs text-[#526078] max-w-sm mx-auto">
                Micro-assessments taken during your learning track will appear here with scores, passing status, and completion timestamps.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.assessments.map((att) => (
                <div
                  key={att.id}
                  className="bg-white rounded-2xl border border-[#DCE7F2] p-4 md:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        att.passed
                          ? 'bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {att.passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {att.passed ? 'Passed (≥70%)' : 'Needs Practice (<70%)'}
                      </span>
                      {att.skillName && (
                        <span className="text-xs font-semibold text-[#526078]">
                          • {att.skillName}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm md:text-base font-bold font-display text-[#11183D]">
                      {att.title}
                    </h4>

                    <span className="text-xs text-[#526078]">
                      {att.correctAnswers} of {att.totalQuestions} questions correct
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-extrabold font-mono text-[#11183D]">
                      {att.score}%
                    </div>
                    <span className="text-[11px] font-mono text-[#7B8799]">
                      {formatDate(att.completedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ADAPTATIONS */}
      {activeTab === 'ADAPTATIONS' && (
        <div className="space-y-4" data-testid="adaptations-section">
          {(!history?.adaptations || history.adaptations.length === 0) ? (
            <div className="bg-white rounded-3xl border border-[#DCE7F2] p-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#EFFAFD] text-[#2459A8] flex items-center justify-center mx-auto border border-[#DCE7F2]">
                <Zap size={18} />
              </div>
              <h4 className="text-sm font-bold font-display text-[#11183D]">
                No Adaptations Triggered Yet
              </h4>
              <p className="text-xs text-[#526078] max-w-sm mx-auto">
                When you complete sprints, the adaptive engine tunes your pace, reinforces gaps, or accelerates advanced tasks.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.adaptations.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-white rounded-2xl border border-[#DCE7F2] p-5 shadow-2xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-display bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30">
                        {ad.action}
                      </span>
                      {ad.sprintNumber && (
                        <span className="text-xs font-semibold text-[#526078]">
                          Triggered after Sprint {ad.sprintNumber}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-[#7B8799]">
                      {formatDate(ad.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-[#11183D] leading-relaxed">
                    {ad.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
