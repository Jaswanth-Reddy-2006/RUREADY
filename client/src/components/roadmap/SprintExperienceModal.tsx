import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, Circle, Play, Clock, ArrowRight,
  BookOpen, Code2, Award, Zap, ChevronRight, FileText, Check
} from 'lucide-react';
import Button from '../ui/Button';

interface SprintExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSprint: () => void;
}

export default function SprintExperienceModal({
  isOpen,
  onClose,
  onCompleteSprint,
}: SprintExperienceModalProps) {
  const [completedDays, setCompletedDays] = useState<number[]>([1, 2, 3, 4]);
  const [activeDay, setActiveDay] = useState<number>(5);

  const sprintTasks = [
    { day: 1, title: 'Arrays & Dynamic Resizing', type: 'Theory & Drill', time: '45m', status: 'COMPLETED' },
    { day: 2, title: 'ArrayList Internals & amortized O(1)', type: 'Code Practice', time: '50m', status: 'COMPLETED' },
    { day: 3, title: 'LinkedList Memory Nodes vs Array Cache Locality', type: 'Benchmark Drill', time: '60m', status: 'COMPLETED' },
    { day: 4, title: 'HashMap Hash Collisions & Red-Black Tree Treeify', type: 'Core Theory', time: '55m', status: 'COMPLETED' },
    { day: 5, title: 'HashSet & Custom hashCode() / equals() Override', type: 'Practical Drill', time: '45m', status: 'IN_PROGRESS' },
    { day: 6, title: 'Generics Type Erasure & Wildcards (? extends T)', type: 'Concept Drill', time: '50m', status: 'UPCOMING' },
    { day: 7, title: 'Collections Utility Class & Sorting Mechanics', type: 'Code Practice', time: '40m', status: 'UPCOMING' },
    { day: 8, title: 'Mini-Project: Concurrent Thread-Safe LRU Cache', type: 'Project', time: '90m', status: 'UPCOMING' },
    { day: 9, title: 'Comprehensive Revision & Pitfalls Review', type: 'Revision', time: '40m', status: 'UPCOMING' },
    { day: 10, title: 'Sprint 07 Final Skill Assessment', type: 'Assessment', time: '30m', status: 'UPCOMING' },
  ];

  const handleToggleDay = (dayNum: number) => {
    if (completedDays.includes(dayNum)) {
      setCompletedDays(completedDays.filter((d) => d !== dayNum));
    } else {
      setCompletedDays([...completedDays, dayNum]);
    }
  };

  const currentTask = sprintTasks.find((t) => t.day === activeDay) || sprintTasks[4];
  const progressPercent = Math.round((completedDays.length / 10) * 100);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl border border-[#DCE7F2] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-body text-[#11183D]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#DCE7F2] bg-[#EFFAFD]">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl text-xs font-extrabold font-mono bg-[#A0006D] text-white">
                SPRINT 07
              </span>
              <div>
                <h2 className="text-lg font-bold font-display text-[#11183D]">
                  Current 10-Day Sprint Experience
                </h2>
                <p className="text-xs text-[#526078]">
                  Goal: Master Java Collections & Memory Optimizations
                </p>
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

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Progress Bar Header */}
            <div className="bg-[#EFFAFD]/60 p-4 rounded-2xl border border-[#DCE7F2] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold font-display">
                <span className="text-[#526078]">Sprint Progress ({completedDays.length} / 10 Days Completed)</span>
                <span className="text-[#A0006D] font-mono font-extrabold text-sm">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#DCE7F2] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#4A8BDF] via-[#2459A8] to-[#A0006D] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Split View: Left 10-Day Timeline, Right Active Task Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: 10-Day Checklist */}
              <div className="lg:col-span-5 space-y-2">
                <h3 className="text-xs font-bold font-display text-[#7B8799] uppercase tracking-wider mb-2">
                  10-Day Action Schedule
                </h3>

                <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                  {sprintTasks.map((t) => {
                    const isDone = completedDays.includes(t.day);
                    const isActive = activeDay === t.day;

                    return (
                      <div
                        key={t.day}
                        onClick={() => setActiveDay(t.day)}
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
                              handleToggleDay(t.day);
                            }}
                            className="shrink-0 cursor-pointer"
                          >
                            {isDone ? (
                              <CheckCircle2 size={18} className="text-[#168A62]" />
                            ) : isActive ? (
                              <Zap size={18} className="text-[#4A8BDF]" />
                            ) : (
                              <Circle size={18} className="text-[#CBD5E1]" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <span className="text-[10px] font-mono font-bold text-[#7B8799] block">
                              Day {t.day} • {t.type}
                            </span>
                            <p className="text-xs font-bold font-display text-[#11183D] truncate">
                              {t.title}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-[#7B8799] shrink-0 bg-white px-2 py-0.5 rounded-lg border border-[#DCE7F2]">
                          {t.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Active Task Workspace */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DCE7F2] p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                    <span className="px-3 py-1 rounded-full text-xs font-bold font-display bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30">
                      Day {currentTask.day} Task Details
                    </span>
                    <span className="text-xs font-mono text-[#526078] flex items-center gap-1">
                      <Clock size={13} className="text-[#A0006D]" />
                      Est. Time: {currentTask.time}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold font-display text-[#11183D] mb-1">
                      {currentTask.title}
                    </h4>
                    <p className="text-xs text-[#526078] leading-relaxed">
                      Complete this targeted exercise to master core performance mechanics, memory layouts, and interview defense patterns.
                    </p>
                  </div>

                  <div className="bg-[#EFFAFD] p-4 rounded-xl border border-[#DCE7F2] space-y-2">
                    <h5 className="text-xs font-bold font-display text-[#11183D] flex items-center gap-1.5">
                      <BookOpen size={14} className="text-[#4A8BDF]" />
                      Key Deliverable & Resource Checklist
                    </h5>
                    <ul className="text-xs text-[#526078] space-y-1.5 pl-5 list-disc">
                      <li>Review JDK source code for {currentTask.title.split(' ')[0]}</li>
                      <li>Run memory footprint benchmarks under 100,000 element insertions</li>
                      <li>Pass automated unit verification checklist</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#DCE7F2] flex items-center justify-between gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleToggleDay(currentTask.day)}
                    className="text-xs font-display flex items-center gap-1.5 border-[#DCE7F2]"
                  >
                    {completedDays.includes(currentTask.day) ? (
                      <>
                        <Check size={14} className="text-[#168A62]" />
                        Mark Incomplete
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} className="text-[#168A62]" />
                        Mark Day {currentTask.day} Complete
                      </>
                    )}
                  </Button>

                  {completedDays.length >= 8 ? (
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
                      onClick={() => setActiveDay(Math.min(10, activeDay + 1))}
                      className="text-xs font-display flex items-center gap-1.5"
                      icon={<ArrowRight size={14} />}
                    >
                      Next Task
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
