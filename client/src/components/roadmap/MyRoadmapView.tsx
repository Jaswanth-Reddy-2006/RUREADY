import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Play, Circle, Clock, Target, ArrowRight,
  Sparkles, Layers, BookOpen, Award, Check, ChevronRight, Zap, RefreshCw,
  Calendar, Flame, AlertCircle, CheckCircle, History
} from 'lucide-react';
import { Roadmap, RoadmapNode, useRoadmapStore } from '../../store/useRoadmapStore';
import RoadmapLearningHistoryView from './RoadmapLearningHistoryView';
import { 
  deriveDailyLearningPlan, 
  resolveResumeTask,
  deriveDailyLearningActivity 
} from '@ru-ready/shared';
import Button from '../ui/Button';

interface MyRoadmapViewProps {
  roadmap: Roadmap;
  onOpenSprintModal: (taskId?: string) => void;
  onSelectNode?: (nodeId: string) => void;
}

export default function MyRoadmapView({
  roadmap,
  onOpenSprintModal,
  onSelectNode,
}: MyRoadmapViewProps) {
  const { activeUserRoadmap, userRoadmaps } = useRoadmapStore();
  const userRoadmap = activeUserRoadmap || userRoadmaps[roadmap.id] || null;
  const activeSprint = userRoadmap?.sprints?.find((s) => s.status === 'ACTIVE') || userRoadmap?.sprints?.[0];

  // Derive deterministic daily learning plan for the active sprint (Stage 6.1)
  const dailyPlan = activeSprint
    ? deriveDailyLearningPlan(activeSprint, userRoadmap?.personalization)
    : null;

  // Resolve deterministic resume task for one-click continue learning (Stage 6.2)
  const resumeTask = activeSprint
    ? resolveResumeTask(activeSprint, userRoadmap?.personalization)
    : null;

  // Derive deterministic learning activity, streaks, and consistency (Stage 6.4)
  const activity = deriveDailyLearningActivity(userRoadmap);

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

  // Real active sprint data calculations
  const sprintNumber = activeSprint?.sprintNumber || 1;
  const sprintDurationDays = userRoadmap?.personalization?.sprintDurationDays || 7;
  const sprintTasks = activeSprint?.tasks || [];
  const completedSprintTasksCount = sprintTasks.filter((t) => t.status === 'COMPLETED').length;
  const totalSprintTasksCount = sprintTasks.length;
  const sprintProgressPercent = totalSprintTasksCount > 0
    ? Math.round((completedSprintTasksCount / totalSprintTasksCount) * 100)
    : 0;
  const sprintGoal = activeSprint?.objective || `Progress toward ${roadmap.title}`;

  const [viewTab, setViewTab] = useState<'TRACK' | 'HISTORY'>('TRACK');

  return (
    <div className="space-y-6 font-body text-[#11183D]">
      {/* Header Banner & Core Readiness Stats */}
      <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#DCE7F2]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold font-display text-[#2459A8] uppercase tracking-wider mb-1">
              <Target size={14} />
              <span>Target Role Path: {roadmap.rolePath || 'Software Engineer'} → {roadmap.targetCompanyTier || 'FAANG'}</span>
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
            <span className="text-2xl font-extrabold font-mono text-[#168A62]">Sprint 0{sprintNumber}</span>
            <span className="block text-[11px] text-[#168A62] font-semibold mt-0.5">
              {totalSprintTasksCount > 0 ? `${completedSprintTasksCount} / ${totalSprintTasksCount} Tasks Done` : 'Sprint Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Section Switcher: Active Track vs Learning History */}
      <div className="flex items-center gap-2 p-1.5 bg-[#EFFAFD] rounded-2xl border border-[#DCE7F2] w-fit" role="tablist">
        <button
          role="tab"
          aria-selected={viewTab === 'TRACK'}
          onClick={() => setViewTab('TRACK')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
            viewTab === 'TRACK'
              ? 'bg-white text-[#2459A8] shadow-xs border border-[#DCE7F2]'
              : 'text-[#526078] hover:text-[#2459A8]'
          }`}
        >
          <Zap size={14} className={viewTab === 'TRACK' ? 'text-[#4A8BDF]' : 'text-[#7B8799]'} />
          <span>Active Track & Sprints</span>
        </button>
        <button
          role="tab"
          aria-selected={viewTab === 'HISTORY'}
          onClick={() => setViewTab('HISTORY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
            viewTab === 'HISTORY'
              ? 'bg-white text-[#2459A8] shadow-xs border border-[#DCE7F2]'
              : 'text-[#526078] hover:text-[#2459A8]'
          }`}
        >
          <History size={14} className={viewTab === 'HISTORY' ? 'text-[#2459A8]' : 'text-[#7B8799]'} />
          <span>Learning History & Proof of Work</span>
        </button>
      </div>

      {viewTab === 'HISTORY' ? (
        <RoadmapLearningHistoryView
          userRoadmapId={userRoadmap?.id}
          onSelectNode={onSelectNode}
          onBackToTrack={() => setViewTab('TRACK')}
        />
      ) : (
        <div className="space-y-8">

      {/* Stage 6.1: Today's Learning Focus Section */}
      {dailyPlan && (
        <div className="bg-white rounded-3xl border-2 border-[#2459A8]/30 p-6 md:p-7 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DCE7F2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EFFAFD] border border-[#4A8BDF]/30 flex items-center justify-center text-[#2459A8]">
                <Calendar size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold font-mono text-[#2459A8] uppercase tracking-wider">
                    Today's Learning Focus
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30">
                    Day {dailyPlan.sprintDayNumber} of {dailyPlan.totalSprintDays}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-[#11183D]">
                  {dailyPlan.statusSummary === 'REST_DAY'
                    ? 'Buffer & Review Day'
                    : dailyPlan.statusSummary === 'SPRINT_COMPLETED'
                    ? 'Sprint Milestones Completed'
                    : dailyPlan.todayTasks.length > 0
                    ? `Today's Workload: ${dailyPlan.todayTasks[0].title}`
                    : 'Today\'s Scheduled Work Completed'}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {dailyPlan.statusSummary === 'ON_TRACK' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-display bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30">
                  <Flame size={13} className="text-[#168A62]" />
                  On Pace
                </span>
              )}
              {dailyPlan.statusSummary === 'BEHIND' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-display bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B]/30">
                  <AlertCircle size={13} />
                  {dailyPlan.overdueTasks.length} Overdue Task{dailyPlan.overdueTasks.length > 1 ? 's' : ''}
                </span>
              )}
              {dailyPlan.statusSummary === 'REST_DAY' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-display bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30">
                  <Clock size={13} />
                  Buffer Day
                </span>
              )}
              {dailyPlan.statusSummary === 'SPRINT_COMPLETED' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-display bg-[#F8EAF4] text-[#A0006D] border border-[#A0006D]/30">
                  <Award size={13} />
                  Sprint Complete
                </span>
              )}
            </div>
          </div>

          {/* Stage 6.4: Learning Consistency & Streak Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#EFFAFD]/50 p-3.5 rounded-2xl border border-[#DCE7F2]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-[#DCE7F2] flex items-center justify-center text-[#A0006D] shrink-0 shadow-2xs">
                <Flame size={16} className={activity.currentStreak > 0 ? 'text-[#A0006D] fill-[#A0006D]' : 'text-slate-400'} />
              </div>
              <div>
                <span className="block text-[10px] font-bold font-display uppercase tracking-wider text-[#7B8799]">Current Streak</span>
                <span className="text-sm font-extrabold font-mono text-[#11183D]">
                  {activity.currentStreak} {activity.currentStreak === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-[#DCE7F2] flex items-center justify-center text-[#2459A8] shrink-0 shadow-2xs">
                <Calendar size={16} />
              </div>
              <div>
                <span className="block text-[10px] font-bold font-display uppercase tracking-wider text-[#7B8799]">Last 7 Days</span>
                <span className="text-sm font-extrabold font-mono text-[#11183D]">
                  {activity.activeDaysLast7} / 7 Days
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-[#DCE7F2] flex items-center justify-center text-[#168A62] shrink-0 shadow-2xs">
                <Target size={16} />
              </div>
              <div>
                <span className="block text-[10px] font-bold font-display uppercase tracking-wider text-[#7B8799]">Last 30 Days</span>
                <span className="text-sm font-extrabold font-mono text-[#11183D]">
                  {activity.activeDaysLast30} Days
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${
                activity.todayActive ? 'bg-[#E8F5F0] border-[#168A62]/30 text-[#168A62]' : 'bg-white border-[#DCE7F2] text-slate-400'
              }`}>
                {activity.todayActive ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </div>
              <div>
                <span className="block text-[10px] font-bold font-display uppercase tracking-wider text-[#7B8799]">Today's Status</span>
                <span className={`text-xs font-bold font-display ${activity.todayActive ? 'text-[#168A62]' : 'text-[#526078]'}`}>
                  {activity.todayActive ? 'Activity Recorded' : 'Not Yet Completed'}
                </span>
              </div>
            </div>
          </div>

          {/* Today's Actionable Tasks Grid */}
          <div className="space-y-3">
            {dailyPlan.todayTasks.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#526078]">
                  <span>Active Tasks for Today ({dailyPlan.todayTasks.length})</span>
                  <span className="font-mono text-[#2459A8]">Est. ~{dailyPlan.todayEstimatedMinutes} mins</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dailyPlan.todayTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onOpenSprintModal(task.id)}
                      className="p-4 rounded-2xl border border-[#DCE7F2] bg-[#EFFAFD]/40 hover:bg-[#EFFAFD] hover:border-[#4A8BDF]/40 transition-all cursor-pointer flex items-start justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-white border border-[#DCE7F2] text-[#7B8799]">
                            Task 0{task.orderIndex}
                          </span>
                          {task.status === 'IN_PROGRESS' && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-display bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30">
                              In Progress
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold font-display text-[#11183D] truncate">
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-[#526078] line-clamp-1">
                          {task.description || 'Milestone competency drill'}
                        </p>
                      </div>

                      <span className="text-[10px] font-mono text-[#7B8799] shrink-0 bg-white px-2 py-1 rounded-lg border border-[#DCE7F2]">
                        ~{task.estimatedMinutes || 45}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#E8F5F0]/50 border border-[#168A62]/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[#168A62] shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold font-display text-[#11183D]">
                      {dailyPlan.statusSummary === 'SPRINT_COMPLETED'
                        ? 'All sprint tasks have been mastered!'
                        : 'Today\'s scheduled tasks are complete!'}
                    </h4>
                    <p className="text-[11px] text-[#526078]">
                      {dailyPlan.statusSummary === 'SPRINT_COMPLETED'
                        ? 'Ready to finalize sprint review and advance.'
                        : 'Great work maintaining pace. You can review completed materials or rest.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Today's Progress Bar and Footer CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#DCE7F2]">
            <div className="flex items-center gap-4 text-xs font-medium text-[#526078]">
              <span>
                Today's Progress: <strong className="font-mono text-[#11183D]">{dailyPlan.todayCompletionPercentage}%</strong>
              </span>
              <span>•</span>
              <span>
                Daily Study Target: <strong className="font-mono text-[#11183D]">{dailyPlan.hoursPerDay}h/day</strong>
              </span>
            </div>

            <Button
              variant="royal"
              size="sm"
              onClick={() => onOpenSprintModal(resumeTask?.id)}
              className="text-xs font-display flex items-center gap-1.5 shadow-2xs"
              icon={<Play size={13} className="fill-white" />}
            >
              Continue Today's Sprint
            </Button>
          </div>
        </div>
      )}

      {/* Active Sprint Highlights Card */}
      <div className="bg-gradient-to-br from-white via-[#EFFAFD]/50 to-white rounded-3xl border-2 border-[#4A8BDF]/40 p-6 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-extrabold font-mono bg-[#A0006D] text-white">
              SPRINT 0{sprintNumber}
            </span>
            <span className="text-xs font-bold text-[#526078]">{sprintDurationDays}-Day Sprint Duration</span>
          </div>
          <span className="text-xs font-bold font-mono text-[#168A62] bg-[#E8F5F0] px-3 py-1 rounded-full border border-[#168A62]/30">
            {totalSprintTasksCount > 0
              ? `${completedSprintTasksCount} / ${totalSprintTasksCount} Tasks (${sprintProgressPercent}% Done)`
              : 'Active Sprint'}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold font-display text-[#11183D]">
            Sprint Goal: {sprintGoal}
          </h3>
          <p className="text-xs text-[#526078]">
            {activeSprint?.tasks?.[0]?.description || 'Focusing on core competency milestones and practical drills for your target role.'}
          </p>
        </div>

        <div className="w-full bg-[#DCE7F2] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#4A8BDF] via-[#2459A8] to-[#A0006D] h-full rounded-full transition-all duration-500"
            style={{ width: `${sprintProgressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs font-medium text-[#526078]">
            <Clock size={13} className="text-[#4A8BDF]" />
            <span>Est. total sprint workload: ~{activeSprint?.expectedMinutes || (totalSprintTasksCount * 60) || 180} mins</span>
          </div>
          <Button
            variant="eggplant"
            size="sm"
            onClick={() => onOpenSprintModal(resumeTask?.id)}
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
      )}
    </div>
  );
}
