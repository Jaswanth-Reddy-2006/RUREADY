import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Award, Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  TrendingUp, RefreshCw, BarChart2, ShieldCheck, Zap, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { RoadmapSprintDTO, SprintReviewResultDTO, UnifiedSprintTelemetryDTO } from '@ru-ready/shared';

interface SprintReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartNextSprint: () => void;
  sprint?: RoadmapSprintDTO | null;
}

export default function SprintReviewModal({
  isOpen,
  onClose,
  onStartNextSprint,
  sprint: propSprint,
}: SprintReviewModalProps) {
  const { 
    activeUserRoadmap, 
    userRoadmaps, 
    activeRoadmapId, 
    completeSprint, 
    isCompletingSprint,
    fetchSprintTelemetry,
  } = useRoadmapStore();

  const userRoadmap = activeUserRoadmap || (activeRoadmapId ? userRoadmaps[activeRoadmapId] : null) || Object.values(userRoadmaps)[0] || null;
  const activeSprint = propSprint || userRoadmap?.sprints?.find((s) => s.status === 'ACTIVE') || userRoadmap?.sprints?.[0] || null;

  const sprintNumber = activeSprint?.sprintNumber || 1;
  const tasks = activeSprint?.tasks || [];
  const completedTasksCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const calculatedConsistency = tasks.length > 0 
    ? Math.round((completedTasksCount / tasks.length) * 100) 
    : 85;

  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
  const [codingScore, setCodingScore] = useState<number | null>(null);
  const [practicalScore, setPracticalScore] = useState<number | null>(null);
  const [consistencyScore, setConsistencyScore] = useState<number>(calculatedConsistency);
  const [telemetry, setTelemetry] = useState<UnifiedSprintTelemetryDTO | null>(null);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(false);
  const [telemetryError, setTelemetryError] = useState<string | null>(null);
  const [reviewResult, setReviewResult] = useState<SprintReviewResultDTO | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (isOpen && activeSprint?.id) {
      setIsTelemetryLoading(true);
      setTelemetryError(null);
      setReviewResult(null);

      fetchSprintTelemetry(activeSprint.id)
        .then((data) => {
          if (!isMounted) return;
          if (data) {
            setTelemetry(data);
            setAssessmentScore(typeof data.assessmentScore === 'number' ? data.assessmentScore : null);
            setPracticalScore(typeof data.practicalScore === 'number' ? data.practicalScore : null);
            setCodingScore(typeof data.practicalScore === 'number' ? data.practicalScore : null);
            setConsistencyScore(typeof data.taskCompletionRate === 'number' ? data.taskCompletionRate : calculatedConsistency);
          } else {
            setTelemetry(null);
            setAssessmentScore(null);
            setPracticalScore(null);
            setCodingScore(null);
            setConsistencyScore(calculatedConsistency);
          }
        })
        .catch((err) => {
          if (!isMounted) return;
          console.warn('[SprintReviewModal] Telemetry fetch notice:', err);
          setTelemetryError('Unable to load telemetry. Using local task metrics.');
          setAssessmentScore(null);
          setPracticalScore(null);
          setCodingScore(null);
          setConsistencyScore(calculatedConsistency);
        })
        .finally(() => {
          if (isMounted) {
            setIsTelemetryLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeSprint?.id, fetchSprintTelemetry, calculatedConsistency]);

  if (!isOpen) return null;

  const performanceMetrics = [
    { label: 'Knowledge (Assessment)', score: assessmentScore, color: 'bg-[#4A8BDF]' },
    { label: 'Coding / Problem Solving', score: codingScore, color: 'bg-[#2459A8]' },
    { label: 'Practical Drills', score: practicalScore, color: 'bg-[#A0006D]' },
    { label: 'Sprint Consistency', score: consistencyScore, color: 'bg-[#168A62]' },
  ];

  const handleFinalizeSprint = async () => {
    if (!activeSprint) {
      toast.error('No active sprint found to complete.');
      return;
    }

    const payload = {
      assessmentScore: assessmentScore !== null ? assessmentScore : undefined,
      codingScore: codingScore !== null ? codingScore : undefined,
      practicalScore: practicalScore !== null ? practicalScore : undefined,
      consistencyScore,
      notes: `Sprint 0${sprintNumber} review completed with ${completedTasksCount}/${tasks.length} tasks done.`,
    };

    const res = await completeSprint(activeSprint.id, payload);
    if (res.success && res.review) {
      setReviewResult(res.review);
      toast.success(`Sprint 0${sprintNumber} completed! Adaptive roadmap updated.`);
    } else {
      toast.error(res.error || 'Failed to complete sprint');
    }
  };

  const handleStartNext = () => {
    onStartNextSprint();
    onClose();
  };

  const nextSprintNumber = reviewResult?.nextSprint?.sprintNumber || (sprintNumber + 1);
  const nextSprintObjective = reviewResult?.nextSprint?.objective || `Sprint 0${nextSprintNumber} Next Step Objectives`;
  const isAlreadyCompleted = activeSprint?.status === 'COMPLETED' || reviewResult !== null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl border border-[#DCE7F2] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-body text-[#11183D]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#DCE7F2] bg-gradient-to-r from-[#EFFAFD] via-white to-[#F8EAF4]">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-2xl bg-[#168A62] text-white shadow-xs">
                <Award size={20} />
              </span>
              <div>
                <span className="text-[10px] font-bold font-mono text-[#168A62] uppercase tracking-wider block">
                  {isAlreadyCompleted ? 'Sprint Finalized' : 'Sprint Ready For Review'}
                </span>
                <h2 className="text-xl font-bold font-display text-[#11183D]">
                  Sprint 0{sprintNumber} Performance Review
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#7B8799] hover:text-[#11183D] hover:bg-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Performance Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-display text-[#7B8799] uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart2 size={14} className="text-[#4A8BDF]" />
                  Skill Performance Metrics
                </h3>
                <span className="text-[11px] font-mono font-semibold text-[#526078]">
                  Task Completion: {completedTasksCount}/{tasks.length} ({tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 100}%)
                </span>
              </div>

              {telemetryError && (
                <div className="bg-[#FEF2F2] border border-[#FCA5A5] p-3 rounded-2xl text-xs text-[#991B1B] flex items-center gap-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{telemetryError} Defaulting to completed task metrics.</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {performanceMetrics.map((m) => (
                  <div key={m.label} className="bg-[#EFFAFD] p-3.5 rounded-2xl border border-[#DCE7F2] text-center space-y-1">
                    <span className="block text-[11px] font-semibold text-[#526078] truncate" title={m.label}>{m.label}</span>
                    {isTelemetryLoading ? (
                      <div className="h-7 flex items-center justify-center">
                        <RefreshCw size={14} className="animate-spin text-[#7B8799]" />
                      </div>
                    ) : (
                      <span className="text-xl font-extrabold font-mono text-[#11183D]">
                        {typeof m.score === 'number' ? `${m.score}%` : 'N/A'}
                      </span>
                    )}
                    <div className="w-full bg-[#DCE7F2] h-1.5 rounded-full overflow-hidden mt-1">
                      <div 
                        className={`${m.color} h-full rounded-full transition-all duration-300`} 
                        style={{ width: isTelemetryLoading ? '0%' : `${typeof m.score === 'number' ? Math.min(100, Math.max(0, m.score)) : 0}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strong Areas & Needs Practice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#E8F5F0] p-4 rounded-2xl border border-[#168A62]/30 space-y-2">
                <h4 className="text-xs font-bold font-display text-[#168A62] flex items-center gap-1.5 uppercase">
                  <CheckCircle2 size={14} />
                  Strong Areas
                </h4>
                <ul className="text-xs text-[#11183D] space-y-1.5 font-medium">
                  {tasks.filter((t) => t.status === 'COMPLETED').slice(0, 2).map((t, idx) => (
                    <li key={t.id || idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#168A62] shrink-0" />
                      <span className="truncate">{t.title}</span>
                    </li>
                  ))}
                  {completedTasksCount === 0 && (
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#168A62] shrink-0" />
                      Sprint core objectives completed
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-[#FEF3C7] p-4 rounded-2xl border border-[#F59E0B]/40 space-y-2">
                <h4 className="text-xs font-bold font-display text-[#B45309] flex items-center gap-1.5 uppercase">
                  <AlertTriangle size={14} />
                  Target Focus & Adaptation
                </h4>
                <ul className="text-xs text-[#11183D] space-y-1.5 font-medium">
                  {tasks.filter((t) => t.status !== 'COMPLETED').slice(0, 2).map((t, idx) => (
                    <li key={t.id || idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0" />
                      <span className="truncate">{t.title} (Carried forward)</span>
                    </li>
                  ))}
                  {tasks.filter((t) => t.status !== 'COMPLETED').length === 0 && (
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0" />
                      Ready for next phase advancement & drills
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Roadmap Adaptation Notice */}
            <div className="bg-[#F8EAF4] p-5 rounded-2xl border border-[#A0006D]/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold font-display text-[#A0006D] uppercase">
                  <Sparkles size={14} />
                  <span>Roadmap Dynamic Adaptation Engine</span>
                </div>
                {reviewResult?.recommendation && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#A0006D] text-white">
                    {reviewResult.recommendation.decision}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#11183D] leading-relaxed">
                {reviewResult?.recommendation?.reason ||
                  `Based on your performance in Sprint 0${sprintNumber}, the adaptation engine calibrates your next sprint workload and reinforces any key competency gaps before advancing.`}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold font-display text-[#A0006D]">
                <span className="truncate pr-2">Next Up: Sprint 0{nextSprintNumber} • {nextSprintObjective}</span>
                <span className="font-mono shrink-0">Adaptive</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-[#DCE7F2] bg-[#EFFAFD] flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="text-xs font-display border-[#DCE7F2]"
            >
              Close Review
            </Button>

            {isAlreadyCompleted ? (
              <Button
                variant="eggplant"
                size="sm"
                onClick={handleStartNext}
                className="text-xs font-display flex items-center gap-2 shadow-sm"
                icon={<ArrowRight size={14} />}
              >
                Start Next Sprint (Sprint 0{nextSprintNumber})
              </Button>
            ) : (
              <Button
                variant="eggplant"
                size="sm"
                onClick={handleFinalizeSprint}
                disabled={isCompletingSprint || isTelemetryLoading}
                className="text-xs font-display flex items-center gap-2 shadow-sm"
                icon={isCompletingSprint ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
              >
                {isCompletingSprint ? 'Finalizing Sprint...' : `Complete Sprint 0${sprintNumber}`}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
