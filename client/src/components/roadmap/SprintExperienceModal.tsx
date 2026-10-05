import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, Circle, Play, Pause, RotateCcw, Clock, ArrowRight,
  BookOpen, Code2, Award, Zap, ChevronRight, FileText, Check, ShieldCheck, RefreshCw, Brain,
  AlertTriangle, Sparkles, Timer
} from 'lucide-react';
import Button from '../ui/Button';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { 
  SprintTaskDTO, 
  TaskState, 
  resolveResumeTask,
  TaskSessionState,
  getSafeSessionDuration,
  formatTimerSeconds
} from '@ru-ready/shared';
import MicroAssessmentModal from './MicroAssessmentModal';
import toast from 'react-hot-toast';

interface SprintExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSprint: () => void;
  initialTaskId?: string | null;
}

export default function SprintExperienceModal({
  isOpen,
  onClose,
  onCompleteSprint,
  initialTaskId,
}: SprintExperienceModalProps) {
  const { 
    activeUserRoadmap, 
    userRoadmaps, 
    activeRoadmapId, 
    updateSprintTaskStatus,
    submitSkillEvidence,
    isSubmittingEvidence,
  } = useRoadmapStore();
  
  const userRoadmap = activeUserRoadmap || (activeRoadmapId ? userRoadmaps[activeRoadmapId] : null);
  const activeSprint = userRoadmap?.sprints?.find((s) => s.status === 'ACTIVE') || userRoadmap?.sprints?.[0];

  // Default fallback tasks in case store has not yet populated sprints
  const fallbackTasks: SprintTaskDTO[] = [
    {
      id: 'task-fallback-1',
      sprintId: activeSprint?.id || 'sprint-fallback',
      title: 'Milestone 01: Core Architecture & Runtime Models',
      description: 'Analyze memory lifecycle and concurrency paradigms for the target engineering role.',
      orderIndex: 1,
      estimatedMinutes: 60,
      requiresEvidence: false,
      status: 'IN_PROGRESS',
    },
    {
      id: 'task-fallback-2',
      sprintId: activeSprint?.id || 'sprint-fallback',
      title: 'Milestone 02: High-Throughput Practical Drill',
      description: 'Implement backpressure-safe streaming and query execution optimization.',
      orderIndex: 2,
      estimatedMinutes: 90,
      requiresEvidence: true,
      status: 'TODO',
    },
  ];

  const tasks: SprintTaskDTO[] = activeSprint?.tasks && activeSprint.tasks.length > 0
    ? activeSprint.tasks
    : fallbackTasks;

  const [activeTaskId, setActiveTaskId] = useState<string | null>(initialTaskId || null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEvidenceFormOpen, setIsEvidenceFormOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [evidenceProficiency, setEvidenceProficiency] = useState(85);
  const [evidenceNotes, setEvidenceNotes] = useState('');

  // ── Stage 6.3: Local Focus Session State ──────────────────────
  const [sessionState, setSessionState] = useState<TaskSessionState>('NOT_STARTED');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(45 * 60);
  const [initialSeconds, setInitialSeconds] = useState<number>(45 * 60);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState<boolean>(false);
  const [pendingSwitchTaskId, setPendingSwitchTaskId] = useState<string | null>(null);
  const [pendingClose, setPendingClose] = useState<boolean>(false);

  // Synchronize active task when modal opens or initialTaskId is updated
  useEffect(() => {
    if (isOpen) {
      if (initialTaskId && tasks.some((t) => t.id === initialTaskId)) {
        setActiveTaskId(initialTaskId);
      } else {
        const smartTask = resolveResumeTask(activeSprint, userRoadmap?.personalization);
        if (smartTask && tasks.some((t) => t.id === smartTask.id)) {
          setActiveTaskId(smartTask.id);
        } else if (tasks.length > 0) {
          setActiveTaskId(tasks[0].id);
        }
      }
    }
  }, [isOpen, initialTaskId, activeSprint, userRoadmap?.personalization, tasks]);

  // Selected task resolution
  const currentTask = tasks.find((t) => t.id === (activeTaskId || tasks[0]?.id)) || tasks[0];
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const sprintDurationDays = userRoadmap?.personalization?.sprintDurationDays || 7;
  const sprintNumber = activeSprint?.sprintNumber || 1;
  const evidenceList = userRoadmap?.skillEvidence || [];
  const hasRecordedEvidence = evidenceList.length > 0;

  // Initialize/reset local session state whenever current task changes
  useEffect(() => {
    if (currentTask) {
      const safeDuration = getSafeSessionDuration(currentTask.estimatedMinutes);
      setInitialSeconds(safeDuration);
      setRemainingSeconds(safeDuration);
      setSessionState('NOT_STARTED');
      setIsEvidenceFormOpen(false);
    }
  }, [currentTask?.id, currentTask?.estimatedMinutes]);

  // Active Timer Interval (counts down when RUNNING, stops at 00:00)
  useEffect(() => {
    if (sessionState !== 'RUNNING') return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setSessionState('COMPLETED');
          toast.success('🎉 Time-box session complete! Complete the task or record evidence below.', {
            duration: 5000,
            icon: '⏱️',
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionState]);

  // Session Control Handlers
  const handleStartSession = () => {
    if (sessionState === 'COMPLETED') {
      setRemainingSeconds(initialSeconds);
    }
    setSessionState('RUNNING');
    toast('Focus session started! Deep work mode active.', { icon: '🔥' });
  };

  const handlePauseSession = () => {
    setSessionState('PAUSED');
    toast('Focus session paused.', { icon: '⏸️' });
  };

  const handleResumeSession = () => {
    setSessionState('RUNNING');
    toast('Focus session resumed.', { icon: '▶️' });
  };

  const handleResetSession = () => {
    setSessionState('NOT_STARTED');
    setRemainingSeconds(initialSeconds);
    toast('Session timer reset.', { icon: '↩️' });
  };

  // Safe Task Switch Handler
  const handleSelectTask = (targetTaskId: string) => {
    if (targetTaskId === activeTaskId) return;

    if (sessionState === 'RUNNING') {
      setPendingSwitchTaskId(targetTaskId);
      setPendingClose(false);
      setIsLeaveConfirmOpen(true);
      return;
    }

    setActiveTaskId(targetTaskId);
  };

  // Safe Modal Close Handler
  const handleAttemptClose = () => {
    if (sessionState === 'RUNNING') {
      setPendingClose(true);
      setPendingSwitchTaskId(null);
      setIsLeaveConfirmOpen(true);
      return;
    }
    onClose();
  };

  // Confirm Leave Session
  const handleConfirmLeaveSession = () => {
    setSessionState('NOT_STARTED');
    setIsLeaveConfirmOpen(false);

    if (pendingSwitchTaskId) {
      setActiveTaskId(pendingSwitchTaskId);
      setPendingSwitchTaskId(null);
    } else if (pendingClose) {
      setPendingClose(false);
      onClose();
    }
  };

  // Cancel Leave Session
  const handleCancelLeaveSession = () => {
    setIsLeaveConfirmOpen(false);
    setPendingSwitchTaskId(null);
    setPendingClose(false);
  };

  const handleToggleTaskStatus = async (task: SprintTaskDTO) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const isCurrentlyCompleted = task.status === 'COMPLETED';
    const nextStatus: TaskState = isCurrentlyCompleted ? 'TODO' : 'COMPLETED';

    const sprintId = activeSprint?.id || task.sprintId;
    const res = await updateSprintTaskStatus(sprintId, task.id, nextStatus);

    setIsUpdating(false);

    if (res.success) {
      if (nextStatus === 'COMPLETED') {
        toast.success(`Task "${task.title}" completed!`);
      } else {
        toast('Task marked incomplete.', { icon: '↩️' });
      }
    } else {
      if (res.error && res.error.toLowerCase().includes('evidence')) {
        toast.error(`Evidence Gate: ${res.error}`, {
          icon: '🛡️',
          duration: 5000,
        });
      } else {
        toast.error(res.error || 'Failed to update sprint task status');
      }
    }
  };

  const handleNextTask = () => {
    const currentIndex = tasks.findIndex((t) => t.id === currentTask.id);
    if (currentIndex < tasks.length - 1) {
      handleSelectTask(tasks[currentIndex + 1].id);
    }
  };

  const getTaskSkillId = (task?: SprintTaskDTO | null): string | null => {
    if (!task) return null;
    if (task.skillId) return task.skillId;
    if (task.skills && task.skills.length > 0 && task.skills[0].id) {
      return task.skills[0].id;
    }
    if (task.roadmapNode?.skills && task.roadmapNode.skills.length > 0) {
      const nodeSkill = task.roadmapNode.skills[0];
      return nodeSkill.skillId || nodeSkill.skill?.id || null;
    }
    return null;
  };

  const getTaskSkillName = (task?: SprintTaskDTO | null): string | null => {
    if (!task) return null;
    if (task.skills && task.skills.length > 0 && task.skills[0].name) {
      return task.skills[0].name;
    }
    if (task.roadmapNode?.skills && task.roadmapNode.skills.length > 0) {
      const nodeSkill = task.roadmapNode.skills[0];
      return nodeSkill.skill?.name || null;
    }
    return null;
  };

  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userRoadmap?.id) {
      toast.error('No enrolled roadmap instance found.');
      return;
    }

    const skillId = getTaskSkillId(currentTask);
    if (!skillId) {
      toast.error('No valid skill associated with this task. Evidence cannot be submitted without a valid skill.');
      return;
    }

    const taskSkillName = getTaskSkillName(currentTask);
    const res = await submitSkillEvidence(userRoadmap.id, {
      skillId,
      estimatedProficiency: evidenceProficiency,
      notes: evidenceNotes.trim() || `Demonstrated milestone competency drill for ${currentTask.title}${taskSkillName ? ` (${taskSkillName})` : ''}`,
    });

    if (res.success) {
      toast.success('Skill evidence recorded! Task evidence gate unlocked.', { icon: '🛡️' });
      setIsEvidenceFormOpen(false);
      setEvidenceNotes('');
    } else {
      toast.error(res.error || 'Failed to record skill evidence');
    }
  };

  if (!isOpen) return null;

  const timerProgress = initialSeconds > 0 ? Math.min(100, Math.max(0, Math.round(((initialSeconds - remainingSeconds) / initialSeconds) * 100))) : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl border border-[#DCE7F2] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-body text-[#11183D] relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#DCE7F2] bg-[#EFFAFD]">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl text-xs font-extrabold font-mono bg-[#A0006D] text-white">
                SPRINT 0{sprintNumber}
              </span>
              <div>
                <h2 className="text-lg font-bold font-display text-[#11183D]">
                  Current {sprintDurationDays}-Day Sprint Experience
                </h2>
                <p className="text-xs text-[#526078]">
                  Goal: {activeSprint?.objective || userRoadmap?.personalization?.targetRole || 'Progress on core career milestones'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAttemptClose}
              className="p-2 rounded-xl text-[#7B8799] hover:text-[#11183D] hover:bg-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Progress Bar Header */}
            <div className="bg-[#EFFAFD]/60 p-4 rounded-2xl border border-[#DCE7F2] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold font-display">
                <span className="text-[#526078]">Sprint Progress ({completedTasks.length} / {tasks.length} Tasks Completed)</span>
                <span className="text-[#A0006D] font-mono font-extrabold text-sm">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#DCE7F2] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#4A8BDF] via-[#2459A8] to-[#A0006D] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Split View: Left Timeline/Checklist, Right Active Task Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Sprint Task List */}
              <div className="lg:col-span-5 space-y-2">
                <h3 className="text-xs font-bold font-display text-[#7B8799] uppercase tracking-wider mb-2">
                  Sprint Task Schedule ({tasks.length} Tasks)
                </h3>

                <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                  {tasks.map((t, idx) => {
                    const isDone = t.status === 'COMPLETED';
                    const isActive = currentTask?.id === t.id;

                    return (
                      <div
                        key={t.id || idx}
                        onClick={() => handleSelectTask(t.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isActive
                            ? 'bg-[#EFFAFD] border-[#4A8BDF] shadow-xs'
                            : isDone
                            ? 'bg-white border-[#168A62]/30 opacity-90'
                            : 'bg-white border-[#DCE7F2] hover:border-[#4A8BDF]/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleTaskStatus(t);
                            }}
                            className="shrink-0 cursor-pointer"
                            title={isDone ? 'Mark task incomplete' : 'Mark task complete'}
                          >
                            {isDone ? (
                              <CheckCircle2 size={18} className="text-[#168A62]" />
                            ) : t.status === 'IN_PROGRESS' ? (
                              <Zap size={18} className="text-[#4A8BDF]" />
                            ) : (
                              <Circle size={18} className="text-[#CBD5E1]" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold text-[#7B8799] block">
                                Task 0{t.orderIndex || idx + 1}
                              </span>
                              {t.requiresAssessment && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold font-mono bg-[#EFFAFD] text-[#0284C7]">
                                  <Brain size={9} /> Assessment
                                </span>
                              )}
                              {t.requiresEvidence && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold font-mono bg-[#F8EAF4] text-[#A0006D]">
                                  <ShieldCheck size={9} /> Evidence
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-bold font-display text-[#11183D] truncate">
                              {t.title}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-[#7B8799] shrink-0 bg-white px-2 py-0.5 rounded-lg border border-[#DCE7F2]">
                          ~{t.estimatedMinutes || 45}m
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Active Task Workspace & Focus Mode */}
              {currentTask && (
                <div className={`lg:col-span-7 bg-white rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                  sessionState === 'RUNNING' 
                    ? 'border-[#4A8BDF] shadow-md ring-2 ring-[#4A8BDF]/20' 
                    : 'border-[#DCE7F2]'
                }`}>
                  <div className="space-y-4">
                    {/* Focus Mode & Time-box Session Timer Card */}
                    <div className={`p-4 rounded-2xl border transition-all ${
                      sessionState === 'RUNNING'
                        ? 'bg-gradient-to-br from-[#11183D] to-[#1C2652] text-white border-[#2459A8] shadow-md'
                        : sessionState === 'PAUSED'
                        ? 'bg-[#FFFBEB] text-[#11183D] border-[#FDE68A]'
                        : sessionState === 'COMPLETED'
                        ? 'bg-[#ECFDF5] text-[#11183D] border-[#A7F3D0]'
                        : 'bg-[#EFFAFD] text-[#11183D] border-[#DCE7F2]'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Timer size={16} className={sessionState === 'RUNNING' ? 'text-[#4A8BDF] animate-pulse' : 'text-[#A0006D]'} />
                          <span className="text-xs font-bold font-display">
                            {sessionState === 'RUNNING'
                              ? 'Active Focus Mode'
                              : sessionState === 'PAUSED'
                              ? 'Focus Session Paused'
                              : sessionState === 'COMPLETED'
                              ? 'Time-box Target Reached'
                              : 'Time-box Session Timer'}
                          </span>
                        </div>

                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          sessionState === 'RUNNING'
                            ? 'bg-[#168A62]/30 text-[#4ADE80] border-[#168A62]'
                            : sessionState === 'PAUSED'
                            ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                            : sessionState === 'COMPLETED'
                            ? 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]'
                            : 'bg-white text-[#526078] border-[#DCE7F2]'
                        }`}>
                          {sessionState}
                        </span>
                      </div>

                      {/* Timer Display & Action Row */}
                      <div className="flex items-center justify-between gap-4 py-1">
                        <div>
                          <div className={`font-mono text-3xl font-extrabold tracking-tight ${
                            sessionState === 'RUNNING' ? 'text-white' : 'text-[#11183D]'
                          }`}>
                            {formatTimerSeconds(remainingSeconds)}
                          </div>
                          <span className={`text-[11px] font-body ${
                            sessionState === 'RUNNING' ? 'text-slate-300' : 'text-[#7B8799]'
                          }`}>
                            Est. {currentTask.estimatedMinutes || 45} mins ({Math.round(initialSeconds / 60)}m target)
                          </span>
                        </div>

                        {/* Session Action Controls */}
                        <div className="flex items-center gap-2">
                          {sessionState === 'NOT_STARTED' && (
                            <Button
                              variant="eggplant"
                              size="sm"
                              onClick={handleStartSession}
                              className="text-xs font-display flex items-center gap-1.5 shadow-sm"
                              icon={<Play size={13} />}
                            >
                              Start Focus
                            </Button>
                          )}

                          {sessionState === 'RUNNING' && (
                            <>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={handlePauseSession}
                                className="text-xs font-display flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border-white/20"
                                icon={<Pause size={13} />}
                              >
                                Pause
                              </Button>
                              <button
                                type="button"
                                onClick={handleResetSession}
                                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                title="Reset session timer"
                              >
                                <RotateCcw size={14} />
                              </button>
                            </>
                          )}

                          {sessionState === 'PAUSED' && (
                            <>
                              <Button
                                variant="royal"
                                size="sm"
                                onClick={handleResumeSession}
                                className="text-xs font-display flex items-center gap-1.5"
                                icon={<Play size={13} />}
                              >
                                Resume
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleResetSession}
                                className="text-xs font-display flex items-center gap-1.5 border-[#DCE7F2]"
                                icon={<RotateCcw size={13} />}
                              >
                                Reset
                              </Button>
                            </>
                          )}

                          {sessionState === 'COMPLETED' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={handleStartSession}
                              className="text-xs font-display flex items-center gap-1.5 border-[#A7F3D0] text-[#059669] hover:bg-[#D1FAE5]"
                              icon={<RotateCcw size={13} />}
                            >
                              Restart Timer
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Timer Progress Indicator */}
                      <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            sessionState === 'RUNNING'
                              ? 'bg-gradient-to-r from-[#4A8BDF] to-[#0284C7]'
                              : sessionState === 'COMPLETED'
                              ? 'bg-[#168A62]'
                              : 'bg-[#A0006D]'
                          }`}
                          style={{ width: `${timerProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Task Title & Meta Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#DCE7F2]">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold font-display bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30">
                          Task 0{currentTask.orderIndex || 1} Details
                        </span>
                        {currentTask.requiresAssessment && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-display bg-[#EFFAFD] text-[#0284C7] border border-[#0284C7]/30">
                            <Brain size={11} /> Assessment Required
                          </span>
                        )}
                        {currentTask.requiresEvidence && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-display bg-[#F8EAF4] text-[#A0006D] border border-[#A0006D]/30">
                            <ShieldCheck size={11} /> Evidence Required
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-[#526078] flex items-center gap-1">
                        <Clock size={13} className="text-[#A0006D]" />
                        Est. Time: ~{currentTask.estimatedMinutes || 45} mins
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold font-display text-[#11183D] mb-1">
                        {currentTask.title}
                      </h4>
                      <p className="text-xs text-[#526078] leading-relaxed">
                        {currentTask.description || 'Targeted milestone exercise to build job-ready practical competency.'}
                      </p>
                    </div>

                    {/* Evidence Verification Gate Box */}
                    {currentTask.requiresEvidence && (
                      <div className="p-3.5 bg-[#F8EAF4]/80 rounded-2xl border border-[#A0006D]/30 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold font-display text-[#A0006D] flex items-center gap-1.5">
                            <ShieldCheck size={14} />
                            Evidence Verification Gate
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            hasRecordedEvidence 
                              ? 'bg-[#E8F5F0] text-[#168A62] border-[#168A62]/30' 
                              : 'bg-white text-[#A0006D] border-[#A0006D]/30'
                          }`}>
                            {hasRecordedEvidence ? 'Gate Unlocked' : 'Evidence Required'}
                          </span>
                        </div>

                        {hasRecordedEvidence ? (
                          <div className="bg-white/80 p-2.5 rounded-xl border border-[#168A62]/20 space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold text-[#11183D]">
                              <span className="flex items-center gap-1 text-[#168A62]">
                                <CheckCircle2 size={12} />
                                {evidenceList[0]?.source || 'SELF_REPORTED'} Evidence Recorded
                              </span>
                              <span className="font-mono text-[11px] text-[#526078]">
                                {evidenceList[0]?.estimatedProficiency ?? 85}% Proficiency
                              </span>
                            </div>
                            <p className="text-[11px] text-[#526078] leading-relaxed">
                              {evidenceList[0]?.metadata && typeof evidenceList[0].metadata === 'object' && 'notes' in (evidenceList[0].metadata as any)
                                ? String((evidenceList[0].metadata as any).notes)
                                : 'Demonstrated competency drill completed and attached to roadmap.'}
                            </p>
                          </div>
                        ) : (
                          <p className="text-[11px] text-[#526078] leading-relaxed">
                            This task requires demonstrated skill evidence (e.g. self-reported proof, drill, or assessment) before it can be marked as completed.
                          </p>
                        )}

                        {!isEvidenceFormOpen ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setIsAssessmentModalOpen(true)}
                              className="text-xs font-display py-1.5 px-3 flex items-center gap-1.5 border-[#2459A8]/30 text-[#2459A8] hover:bg-[#EFFAFD] shadow-xs"
                              icon={<Brain size={12} />}
                            >
                              Take Micro-Assessment
                            </Button>
                            <Button
                              variant="eggplant"
                              size="sm"
                              onClick={() => setIsEvidenceFormOpen(true)}
                              className="text-xs font-display py-1.5 px-3 flex items-center gap-1.5 bg-[#A0006D] hover:bg-[#850059] shadow-xs"
                              icon={<FileText size={12} />}
                            >
                              {hasRecordedEvidence ? 'Record Additional Evidence' : 'Record Skill Evidence'}
                            </Button>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmitEvidence} className="bg-white p-3 rounded-xl border border-[#A0006D]/20 space-y-3">
                            {getTaskSkillName(currentTask) && (
                              <div className="flex items-center gap-1.5 text-[11px] text-[#526078]">
                                <span className="font-semibold text-[#11183D]">Target Skill:</span>
                                <span className="px-2 py-0.5 rounded-md bg-[#EFFAFD] border border-[#DCE7F2] font-mono text-[11px] text-[#0284C7] font-bold">
                                  {getTaskSkillName(currentTask)}
                                </span>
                              </div>
                            )}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-semibold text-[#11183D]">
                                <span>Estimated Proficiency</span>
                                <span className="font-mono text-[#A0006D] font-bold">{evidenceProficiency}%</span>
                              </div>
                              <input
                                type="range"
                                min={0}
                                max={100}
                                value={evidenceProficiency}
                                onChange={(e) => setEvidenceProficiency(Number(e.target.value))}
                                className="w-full accent-[#A0006D] cursor-pointer"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-[#11183D] block">
                                Proof Description / Notes
                              </label>
                              <textarea
                                rows={2}
                                value={evidenceNotes}
                                onChange={(e) => setEvidenceNotes(e.target.value)}
                                placeholder="Completed practical drill, tested edge cases, and verified test pass criteria."
                                className="w-full text-xs p-2 rounded-xl border border-[#DCE7F2] bg-white focus:outline-none focus:border-[#A0006D] font-body"
                              />
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <Button
                                type="submit"
                                variant="eggplant"
                                size="sm"
                                disabled={isSubmittingEvidence}
                                className="text-xs font-display flex items-center gap-1.5 bg-[#A0006D]"
                                icon={isSubmittingEvidence ? <RefreshCw size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                              >
                                {isSubmittingEvidence ? 'Submitting...' : 'Submit Evidence'}
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => setIsEvidenceFormOpen(false)}
                                className="text-xs font-display border-[#DCE7F2]"
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}

                    <div className="bg-[#EFFAFD] p-4 rounded-xl border border-[#DCE7F2] space-y-2">
                      <h5 className="text-xs font-bold font-display text-[#11183D] flex items-center gap-1.5">
                        <BookOpen size={14} className="text-[#4A8BDF]" />
                        Key Deliverable & Action Checklist
                      </h5>
                      <ul className="text-xs text-[#526078] space-y-1.5 pl-5 list-disc">
                        <li>Master core concept and implementation details for {currentTask.title}</li>
                        <li>Execute practical coding drill or test suite with verification</li>
                        <li>Pass milestone readiness criteria before advancing</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#DCE7F2] flex items-center justify-between gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleToggleTaskStatus(currentTask)}
                      disabled={isUpdating}
                      className="text-xs font-display flex items-center gap-1.5 border-[#DCE7F2]"
                    >
                      {currentTask.status === 'COMPLETED' ? (
                        <>
                          <Check size={14} className="text-[#168A62]" />
                          Mark Incomplete
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} className="text-[#168A62]" />
                          Mark Task Complete
                        </>
                      )}
                    </Button>

                    {completedTasks.length >= Math.max(1, Math.ceil(tasks.length * 0.75)) ? (
                      <Button
                        variant="eggplant"
                        size="sm"
                        onClick={onCompleteSprint}
                        className="text-xs font-display flex items-center gap-1.5 shadow-sm"
                        icon={<Award size={14} />}
                      >
                        Finish Sprint & Review
                      </Button>
                    ) : (
                      <Button
                        variant="royal"
                        size="sm"
                        onClick={handleNextTask}
                        className="text-xs font-display flex items-center gap-1.5"
                        icon={<ArrowRight size={14} />}
                      >
                        Next Task
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Leave Session Confirmation Dialog */}
          {isLeaveConfirmOpen && (
            <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-[#DCE7F2] p-6 max-w-sm w-full shadow-2xl space-y-4"
              >
                <div className="flex items-center gap-2 text-[#D97706]">
                  <AlertTriangle size={20} />
                  <h4 className="text-sm font-bold font-display text-[#11183D]">
                    Active Focus Session
                  </h4>
                </div>

                <p className="text-xs text-[#526078] leading-relaxed">
                  Session is still running. Leaving this task will stop your current timer session. Do you want to continue focusing?
                </p>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleConfirmLeaveSession}
                    className="text-xs font-display border-[#DCE7F2] text-[#DC2626] hover:bg-[#FEF2F2]"
                  >
                    Leave Session
                  </Button>
                  <Button
                    variant="royal"
                    size="sm"
                    onClick={handleCancelLeaveSession}
                    className="text-xs font-display"
                  >
                    Continue Session
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      <MicroAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        nodeId={currentTask?.roadmapNodeId || currentTask?.id || 'node-fs-1'}
        skillId={getTaskSkillId(currentTask) || undefined}
        skillName={getTaskSkillName(currentTask) || undefined}
        sprintId={activeSprint?.id}
        sprintTaskId={currentTask?.id}
        userRoadmapId={userRoadmap?.id}
      />
    </AnimatePresence>
  );
}

