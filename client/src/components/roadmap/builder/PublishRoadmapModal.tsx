import React from 'react';
import { BuilderRoadmapState, ValidationResult, ValidationIssueItem } from './types';
import { validateRoadmapState } from './roadmapService';
import { 
  X, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  CheckSquare, 
  Calendar, 
  ListCheck
} from 'lucide-react';

interface PublishRoadmapModalProps {
  isOpen: boolean;
  state: BuilderRoadmapState;
  onClose: () => void;
  onConfirmPublish: () => void;
  onNavigateToItem: (item: { type: 'phase' | 'milestone' | 'sprint' | 'task'; phaseId?: string; milestoneId?: string; sprintId?: string; taskId?: string }) => void;
}

export const PublishRoadmapModal: React.FC<PublishRoadmapModalProps> = ({
  isOpen,
  state,
  onClose,
  onConfirmPublish,
  onNavigateToItem
}) => {
  if (!isOpen) return null;

  const validation: ValidationResult = validateRoadmapState(state);

  // Structural statistics
  const phaseCount = state.phases.length;
  let milestoneCount = 0;
  let sprintCount = 0;
  let taskCount = 0;

  state.phases.forEach((p) => {
    milestoneCount += p.milestones.length;
    p.milestones.forEach((m) => {
      sprintCount += m.sprints.length;
      m.sprints.forEach((s) => {
        taskCount += s.tasks.length;
      });
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Ready to publish?</h2>
              <p className="text-xs text-slate-400">
                Review your roadmap structure before making it live for learners.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Overview summary */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-purple-300">{state.title || 'Untitled Roadmap'}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Target Role</span>
                <span className="font-semibold text-slate-200">{state.targetRole || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Category</span>
                <span className="font-semibold text-slate-200">{state.category || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Difficulty</span>
                <span className="font-semibold text-slate-200 capitalize">{state.difficulty}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Estimated Duration</span>
                <span className="font-semibold text-slate-200">{state.estimatedDuration || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Counts */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
              <span className="text-lg font-bold text-white">{phaseCount}</span>
              <span className="text-[10px] text-slate-400 block uppercase">Phases</span>
            </div>
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
              <span className="text-lg font-bold text-white">{milestoneCount}</span>
              <span className="text-[10px] text-slate-400 block uppercase">Milestones</span>
            </div>
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
              <span className="text-lg font-bold text-white">{sprintCount}</span>
              <span className="text-[10px] text-slate-400 block uppercase">Sprints</span>
            </div>
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
              <span className="text-lg font-bold text-white">{taskCount}</span>
              <span className="text-[10px] text-slate-400 block uppercase">Tasks</span>
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Automatic Validation Results
            </h4>

            <div className="space-y-2">
              {validation.isValid && validation.warnings.length === 0 && (
                <div className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold">Structure is complete & valid!</span>
                    <p className="text-[11px] text-emerald-400/80">
                      Every phase has milestones, milestones have sprints, and sprints contain actionable tasks.
                    </p>
                  </div>
                </div>
              )}

              {/* Show Errors */}
              {validation.errors.map((err: ValidationIssueItem, idx: number) => (
                <div
                  key={idx}
                  onClick={() => {
                    onClose();
                    onNavigateToItem({
                      type: err.type,
                      phaseId: err.phaseId,
                      milestoneId: err.milestoneId,
                      sprintId: err.sprintId,
                      taskId: err.taskId
                    });
                  }}
                  className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-xl text-xs text-red-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{err.message}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-red-400 underline">Fix Item →</span>
                </div>
              ))}

              {/* Show Warnings */}
              {validation.warnings.map((warn: ValidationIssueItem, idx: number) => (
                <div
                  key={idx}
                  onClick={() => {
                    onClose();
                    onNavigateToItem({
                      type: warn.type,
                      phaseId: warn.phaseId,
                      milestoneId: warn.milestoneId,
                      sprintId: warn.sprintId,
                      taskId: warn.taskId
                    });
                  }}
                  className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 rounded-xl text-xs text-amber-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{warn.message}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-400 underline">Review →</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-900/80">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Keep Editing</span>
          </button>

          <button
            onClick={onConfirmPublish}
            disabled={!validation.isValid}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Publish Roadmap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
