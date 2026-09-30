import React from 'react';
import { BuilderRoadmapState } from './types';
import { 
  Eye, 
  Send, 
  Layers, 
  CheckSquare, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Award,
  Sparkles,
  Save,
  AlertCircle
} from 'lucide-react';

interface RoadmapSummaryProps {
  state: BuilderRoadmapState;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  onPreview: () => void;
  onPublish: () => void;
  isMobileDrawer?: boolean;
}

export const RoadmapSummary: React.FC<RoadmapSummaryProps> = ({
  state,
  saveStatus,
  onPreview,
  onPublish,
  isMobileDrawer = false
}) => {
  // Calculate total counts dynamically
  const phaseCount = state.phases.length;
  let milestoneCount = 0;
  let sprintCount = 0;
  let taskCount = 0;
  let totalTaskMinutes = 0;

  state.phases.forEach((phase) => {
    milestoneCount += phase.milestones.length;
    phase.milestones.forEach((milestone) => {
      sprintCount += milestone.sprints.length;
      milestone.sprints.forEach((sprint) => {
        taskCount += sprint.tasks.length;
        sprint.tasks.forEach((task) => {
          totalTaskMinutes += task.estimatedMinutes || 30;
        });
      });
    });
  });

  const estimatedWeeks = Math.max(1, Math.ceil(sprintCount * 1.5)); // rough estimate if empty

  return (
    <div className={`space-y-6 ${isMobileDrawer ? 'p-4' : 'p-5 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-xl'}`}>
      {/* Top Header & Autosave indicator */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Live Summary
          </span>
          <h3 className="text-sm font-bold text-white truncate max-w-[180px]">
            {state.title || 'Untitled Roadmap'}
          </h3>
        </div>

        <div className="flex items-center space-x-1 text-xs">
          {saveStatus === 'saved' && (
            <span className="flex items-center text-emerald-400 gap-1 text-[11px] font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Saved
            </span>
          )}
          {saveStatus === 'saving' && (
            <span className="flex items-center text-amber-400 gap-1 text-[11px] font-medium bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 animate-pulse">
              <Save className="w-3 h-3" /> Saving...
            </span>
          )}
          {saveStatus === 'unsaved' && (
            <span className="flex items-center text-slate-400 gap-1 text-[11px] font-medium bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Unsaved
            </span>
          )}
        </div>
      </div>

      {/* Primary Info Cards */}
      <div className="space-y-2.5">
        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Target Role</span>
          <p className="text-xs font-semibold text-purple-300 truncate">
            {state.targetRole || 'Not specified'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Category</span>
            <p className="text-xs font-medium text-slate-200 truncate">
              {state.category || 'General'}
            </p>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Difficulty</span>
            <p className="text-xs font-medium text-slate-200 capitalize">
              {state.difficulty || 'Intermediate'}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
          Structure Breakdown
        </span>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2.5 p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{phaseCount}</div>
              <div className="text-[10px] text-slate-400 font-medium">Phases</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{milestoneCount}</div>
              <div className="text-[10px] text-slate-400 font-medium">Milestones</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{sprintCount}</div>
              <div className="text-[10px] text-slate-400 font-medium">Sprints</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{taskCount}</div>
              <div className="text-[10px] text-slate-400 font-medium">Tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Time Badge */}
      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-purple-200 font-medium">Est. Duration:</span>
        </div>
        <span className="text-xs font-bold text-purple-300">
          {state.estimatedDuration || `~${estimatedWeeks} weeks`}
        </span>
      </div>

      {/* Action CTAs */}
      <div className="space-y-2 pt-2">
        <button
          onClick={onPreview}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
        >
          <Eye className="w-4 h-4 text-slate-400" />
          <span>Preview Learner View</span>
        </button>

        <button
          onClick={onPublish}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <Send className="w-4 h-4" />
          <span>Publish Roadmap</span>
        </button>
      </div>
    </div>
  );
};
