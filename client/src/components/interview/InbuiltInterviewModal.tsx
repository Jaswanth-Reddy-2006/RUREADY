import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Sliders,
  Clock,
  Award,
  Target,
  Sparkles,
  CheckCircle2,
  Building2,
  Code2,
  Video,
  FileText,
  User,
  ShieldCheck,
  ChevronRight,
  Terminal,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { InbuiltInterview } from '../../data/inbuiltInterviewsData';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface InbuiltInterviewModalProps {
  interview: InbuiltInterview | null;
  onClose: () => void;
  onStartDirect?: (interview: InbuiltInterview) => void;
}

export default function InbuiltInterviewModal({
  interview,
  onClose,
  onStartDirect,
}: InbuiltInterviewModalProps) {
  const navigate = useNavigate();

  if (!interview) return null;

  const isVideo = interview.category === 'video';

  const handleStartNow = () => {
    onClose();
    if (onStartDirect) {
      onStartDirect(interview);
      return;
    }

    if (isVideo) {
      // Direct jump to review/setup with preloaded parameters
      navigate(
        `/video/new?role=${encodeURIComponent(interview.role)}&mode=${encodeURIComponent(
          interview.trackType === 'Behavioral & Leadership' ? 'HR_BEHAVIORAL' : 'FULL_SIMULATION'
        )}&company=${encodeURIComponent(interview.company || '')}&skills=${encodeURIComponent(
          interview.skills.join(',')
        )}&focus=${encodeURIComponent(interview.focusAreas.join(','))}&duration=${interview.durationMins}`
      );
    } else {
      navigate(
        `/coding/new?role=${encodeURIComponent(interview.role)}&focus=${encodeURIComponent(
          interview.trackType
        )}&duration=${interview.durationMins}&company=${encodeURIComponent(interview.company || '')}`
      );
    }
  };

  const handleCustomize = () => {
    onClose();
    if (isVideo) {
      navigate(
        `/video/new?role=${encodeURIComponent(interview.role)}&mode=${encodeURIComponent(
          interview.trackType === 'Behavioral & Leadership' ? 'HR_BEHAVIORAL' : 'FULL_SIMULATION'
        )}&company=${encodeURIComponent(interview.company || '')}&skills=${encodeURIComponent(
          interview.skills.join(',')
        )}&focus=${encodeURIComponent(interview.focusAreas.join(','))}&duration=${interview.durationMins}`
      );
    } else {
      navigate(
        `/coding/new?role=${encodeURIComponent(interview.role)}&focus=${encodeURIComponent(
          interview.trackType
        )}&duration=${interview.durationMins}&company=${encodeURIComponent(interview.company || '')}`
      );
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return <Badge variant="success" size="xs">Beginner</Badge>;
      case 'Intermediate':
        return <Badge variant="royal" size="xs">Intermediate</Badge>;
      case 'Advanced':
        return <Badge variant="warning" size="xs">Advanced</Badge>;
      case 'Hardcore':
        return <Badge variant="ai" size="xs">Hardcore Tier-1</Badge>;
      default:
        return <Badge variant="neutral" size="xs">{diff}</Badge>;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#11183D] border border-slate-200 dark:border-[#1E293B] rounded-3xl shadow-2xl z-50 overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]"
        >
          {/* Header Banner */}
          <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-purple-50/60 dark:from-[#152046] dark:via-[#11183D] dark:to-[#1e1a38]">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white font-mono shadow-2xs">
                  {isVideo ? <Video className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
                  {isVideo ? 'Oral Video Mock' : 'Coding Sandbox'}
                </span>

                {interview.company && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white dark:bg-[#152046] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                    <Building2 className="w-3 h-3" />
                    {interview.company}
                  </span>
                )}

                {getDifficultyBadge(interview.difficulty)}

                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                  {interview.tag}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-snug">
                {interview.title}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Target Role: <strong className="text-slate-900 dark:text-white">{interview.role}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
            {/* Description */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                Overview & Objective
              </span>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {interview.description}
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0E152E] border border-slate-200/80 dark:border-[#1E293B] text-center space-y-0.5">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 font-medium block">Duration</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  {interview.durationMins} mins
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0E152E] border border-slate-200/80 dark:border-[#1E293B] text-center space-y-0.5">
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 font-medium block">Questions</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  {interview.questionCount} Prompts
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0E152E] border border-slate-200/80 dark:border-[#1E293B] text-center space-y-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 font-medium block">Simulation</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase truncate block">
                  {interview.simulationMode}
                </span>
              </div>
            </div>

            {/* AI Evaluator Profile */}
            <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-[#152046] border border-blue-100 dark:border-[#1E293B] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                {interview.interviewerPersona.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    {interview.interviewerPersona.name} ({interview.interviewerPersona.role})
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                    AI Evaluator
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {interview.interviewerPersona.traits}
                </p>
              </div>
            </div>

            {/* Skills Tested */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                Key Skills & Technologies Evaluated
              </span>
              <div className="flex flex-wrap gap-1.5">
                {interview.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#152046] text-slate-700 dark:text-slate-300 font-medium text-xs border border-slate-200/60 dark:border-[#1E293B]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Assessment Rubrics */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                Grading Rubrics & Evaluation Criteria
              </span>
              <div className="space-y-1.5">
                {interview.rubrics.map((rubric, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0E152E] border border-slate-100 dark:border-[#1E293B] text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{rubric}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Questions / Problems */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                Sample Interview Prompts Preview
              </span>
              <div className="space-y-2">
                {interview.sampleQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E152E] border border-slate-200/70 dark:border-[#1E293B] text-slate-800 dark:text-slate-200 font-mono text-[11px] leading-relaxed"
                  >
                    <span className="text-blue-600 dark:text-blue-400 font-bold mr-2">Q{idx + 1}:</span>
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#0E152E] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCustomize}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#152046] text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Modify & Customize</span>
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 font-semibold text-xs hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <Button
                onClick={handleStartNow}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Interview Now</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
