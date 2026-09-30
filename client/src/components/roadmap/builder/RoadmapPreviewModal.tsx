import React, { useState } from 'react';
import { BuilderRoadmapState } from './types';
import { convertToRoadmapModel } from './roadmapService';
import { 
  X, 
  Layers, 
  CheckSquare, 
  Clock, 
  Award, 
  BookOpen, 
  Brain, 
  Code, 
  FileCheck2, 
  RotateCcw, 
  Mic, 
  ChevronRight, 
  Sparkles,
  ArrowLeft,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface RoadmapPreviewModalProps {
  isOpen: boolean;
  state: BuilderRoadmapState;
  onClose: () => void;
}

export const RoadmapPreviewModal: React.FC<RoadmapPreviewModalProps> = ({
  isOpen,
  state,
  onClose
}) => {
  if (!isOpen) return null;

  const roadmapModel = convertToRoadmapModel(state);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const activePhase = state.phases[activePhaseIndex] || state.phases[0];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'learning': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'practice': return <Brain className="w-4 h-4 text-purple-400" />;
      case 'project': return <Code className="w-4 h-4 text-emerald-400" />;
      case 'assessment': return <FileCheck2 className="w-4 h-4 text-amber-400" />;
      case 'revision': return <RotateCcw className="w-4 h-4 text-sky-400" />;
      case 'interview': return <Mic className="w-4 h-4 text-rose-400" />;
      default: return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[90vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Banner header indicating Learner Preview */}
        <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-900/60 p-4 px-6 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Learner View Preview
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              This is how learners will view and navigate your roadmap.
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Builder</span>
          </button>
        </div>

        {/* Roadmap Title Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold">
                {state.targetRole || 'Career Roadmap'}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-medium">
                {state.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs capitalize">
                {state.difficulty}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white">
              {state.title || 'Untitled Roadmap'}
            </h1>

            {state.description && (
              <p className="text-sm text-slate-300 max-w-3xl">
                {state.description}
              </p>
            )}
          </div>
        </div>

        {/* Phase Navigation Tabs */}
        {state.phases.length > 0 && (
          <div className="flex border-b border-slate-800 bg-slate-900/30 overflow-x-auto custom-scrollbar px-6">
            {state.phases.map((phase, idx) => (
              <button
                key={phase.id}
                onClick={() => setActivePhaseIndex(idx)}
                className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-xs font-bold tracking-wider uppercase transition-colors shrink-0 ${
                  activePhaseIndex === idx
                    ? 'border-purple-500 text-purple-300 bg-purple-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <span>Phase {idx + 1}:</span>
                <span className="truncate max-w-[160px]">{phase.title || `Phase ${idx + 1}`}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {activePhase ? (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Active Phase Details */}
              <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">
                    Phase {activePhaseIndex + 1}
                  </span>
                  {activePhase.estimatedDuration && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {activePhase.estimatedDuration}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">{activePhase.title}</h2>
                {activePhase.description && (
                  <p className="text-sm text-slate-300">{activePhase.description}</p>
                )}
                {activePhase.objective && (
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-200">
                    <span className="font-semibold block text-purple-300 mb-0.5">Objective:</span>
                    {activePhase.objective}
                  </div>
                )}
              </div>

              {/* Milestones in this Phase */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Milestones ({activePhase.milestones.length})
                </h3>

                {activePhase.milestones.map((milestone, mIdx) => (
                  <div
                    key={milestone.id}
                    className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-6"
                  >
                    <div className="space-y-2 border-b border-slate-800/80 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400">
                          Milestone {mIdx + 1}
                        </span>
                        {milestone.estimatedDuration && (
                          <span className="text-xs text-slate-400">
                            ⏱ {milestone.estimatedDuration}
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-white">{milestone.title}</h4>
                      {milestone.objective && (
                        <p className="text-xs text-slate-300">{milestone.objective}</p>
                      )}

                      {/* Skill tags */}
                      {milestone.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {milestone.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-0.5 rounded bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sprints inside Milestone */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        Sprints ({milestone.sprints.length})
                      </h5>

                      <div className="grid grid-cols-1 gap-4">
                        {milestone.sprints.map((sprint, sIdx) => (
                          <div
                            key={sprint.id}
                            className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <h6 className="text-sm font-bold text-white flex items-center gap-2">
                                <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 text-xs flex items-center justify-center font-semibold">
                                  {sIdx + 1}
                                </span>
                                {sprint.title}
                              </h6>
                              <span className="text-xs text-slate-400">
                                ⏱ {sprint.durationDays} days
                              </span>
                            </div>

                            {sprint.goal && (
                              <p className="text-xs text-slate-400 italic">
                                Goal: {sprint.goal}
                              </p>
                            )}

                            {/* Task List */}
                            <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                              {sprint.tasks.map((task) => (
                                <div
                                  key={task.id}
                                  className="flex items-center justify-between p-2.5 bg-slate-900/60 border border-slate-800/40 rounded-lg text-xs"
                                >
                                  <div className="flex items-center space-x-2.5">
                                    {getTaskIcon(task.type)}
                                    <span className="font-medium text-slate-200">
                                      {task.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                                    <span>{task.estimatedMinutes}m</span>
                                    {task.required && (
                                      <span className="text-[10px] uppercase font-bold text-emerald-400">
                                        Req
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}

                              {sprint.tasks.length === 0 && (
                                <p className="text-xs text-slate-500 italic p-1">No tasks in sprint.</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              No phases created yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
