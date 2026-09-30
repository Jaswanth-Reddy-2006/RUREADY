import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Plus, Layers, Target, Clock, CheckCircle2,
  BookOpen, Code2, FileText, RotateCcw, Mic, ArrowUp, ArrowDown,
  Trash2, Copy, Compass
} from 'lucide-react';
import { 
  BuilderRoadmapState, SelectedTreeNode, BuilderPhase, 
  BuilderMilestone, BuilderSprint, BuilderTask 
} from './types';

export interface RoadmapTreeProps {
  state: BuilderRoadmapState;
  selectedItem?: SelectedTreeNode;
  selectedNode?: SelectedTreeNode;
  onSelectItem?: (node: SelectedTreeNode) => void;
  onSelectNode?: (node: SelectedTreeNode) => void;
  expandedNodes?: Record<string, boolean>;
  onToggleExpand?: (id: string) => void;
  onAddPhase: () => void;
  onAddMilestone: (phaseId: string) => void;
  onAddSprint: (phaseId: string, milestoneId: string) => void;
  onAddTask: (phaseId: string, milestoneId: string, sprintId: string) => void;
  onMovePhase: (phaseIdentifier: any, direction: 'up' | 'down') => void;
  onMoveMilestone: (phaseId: string, milestoneIdentifier: any, direction: 'up' | 'down') => void;
  onMoveSprint: (phaseId: string, milestoneId: string, sprintIdentifier: any, direction: 'up' | 'down') => void;
  onMoveTask: (phaseId: string, milestoneId: string, sprintId: string, taskIdentifier: any, direction: 'up' | 'down') => void;
  onDeleteNode?: (node: SelectedTreeNode) => void;
}

export const RoadmapTree: React.FC<RoadmapTreeProps> = ({
  state,
  selectedItem,
  selectedNode,
  onSelectItem,
  onSelectNode,
  expandedNodes: propExpandedNodes,
  onToggleExpand,
  onAddPhase,
  onAddMilestone,
  onAddSprint,
  onAddTask,
  onMovePhase,
  onMoveMilestone,
  onMoveSprint,
  onMoveTask,
  onDeleteNode
}) => {
  const [internalExpanded, setInternalExpanded] = useState<Record<string, boolean>>({});

  const currentSelection = selectedItem || selectedNode || { type: 'roadmap' };

  const handleSelect = (node: SelectedTreeNode) => {
    if (onSelectItem) onSelectItem(node);
    if (onSelectNode) onSelectNode(node);
  };

  const handleToggle = (id: string) => {
    if (onToggleExpand) {
      onToggleExpand(id);
    } else {
      setInternalExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const isExpanded = (id: string) => {
    if (propExpandedNodes && id in propExpandedNodes) {
      return propExpandedNodes[id];
    }
    return internalExpanded[id] ?? true;
  };

  const isSelected = (type: string, id?: string) => {
    if (currentSelection.type !== type) return false;
    if (type === 'roadmap') return true;
    if (type === 'phase') return currentSelection.phaseId === id;
    if (type === 'milestone') return currentSelection.milestoneId === id;
    if (type === 'sprint') return currentSelection.sprintId === id;
    if (type === 'task') return currentSelection.taskId === id;
    return false;
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'learning': return <BookOpen className="w-3.5 h-3.5 text-blue-400" />;
      case 'practice': return <Target className="w-3.5 h-3.5 text-purple-400" />;
      case 'project': return <Code2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'assessment': return <FileText className="w-3.5 h-3.5 text-amber-400" />;
      case 'revision': return <RotateCcw className="w-3.5 h-3.5 text-sky-400" />;
      case 'interview': return <Mic className="w-3.5 h-3.5 text-rose-400" />;
      default: return <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Root Roadmap Node */}
      <div
        onClick={() => handleSelect({ type: 'roadmap' })}
        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
          isSelected('roadmap')
            ? 'bg-purple-500/10 border-purple-500/40 text-purple-300 font-bold'
            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center space-x-2.5 truncate">
          <Compass className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="truncate">{state.title || 'Untitled Roadmap'}</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
          Root
        </span>
      </div>

      {/* Hierarchy Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
          Roadmap Tree ({state.phases.length} Phases)
        </span>
        <button
          onClick={onAddPhase}
          className="flex items-center space-x-1 px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg text-[11px] font-medium border border-purple-500/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Phase</span>
        </button>
      </div>

      {/* Phases List */}
      <div className="space-y-2">
        {state.phases.map((phase, pIdx) => {
          const phaseExpanded = isExpanded(phase.id);
          const phaseSel = isSelected('phase', phase.id);

          return (
            <div key={phase.id} className="space-y-1">
              {/* Phase Node Item */}
              <div
                onClick={() => handleSelect({ type: 'phase', phaseId: phase.id })}
                className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  phaseSel
                    ? 'bg-blue-500/10 border-blue-500/40 text-blue-300 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(phase.id);
                    }}
                    className="p-0.5 text-slate-500 hover:text-white"
                  >
                    {phaseExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{phase.title || `Phase ${pIdx + 1}`}</span>
                </div>

                <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); onMovePhase(phase.id, 'up'); }}
                    disabled={pIdx === 0}
                    className="p-1 text-slate-500 hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onMovePhase(phase.id, 'down'); }}
                    disabled={pIdx === state.phases.length - 1}
                    className="p-1 text-slate-500 hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onAddMilestone(phase.id); }}
                    className="p-1 text-purple-400 hover:bg-purple-500/10 rounded"
                    title="Add Milestone"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Milestones Subtree */}
              {phaseExpanded && (
                <div className="pl-4 border-l border-slate-800 space-y-1 ml-2">
                  {phase.milestones.map((milestone, mIdx) => {
                    const msExpanded = isExpanded(milestone.id);
                    const msSel = isSelected('milestone', milestone.id);

                    return (
                      <div key={milestone.id} className="space-y-1">
                        {/* Milestone Node Item */}
                        <div
                          onClick={() => handleSelect({ type: 'milestone', phaseId: phase.id, milestoneId: milestone.id })}
                          className={`group p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                            msSel
                              ? 'bg-purple-500/10 border-purple-500/40 text-purple-300 font-bold'
                              : 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggle(milestone.id);
                              }}
                              className="p-0.5 text-slate-500 hover:text-white"
                            >
                              {msExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            </button>
                            <Target className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="truncate">{milestone.title || `Milestone ${mIdx + 1}`}</span>
                          </div>

                          <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100">
                            <button
                              onClick={(e) => { e.stopPropagation(); onMoveMilestone(phase.id, milestone.id, 'up'); }}
                              disabled={mIdx === 0}
                              className="p-0.5 text-slate-500 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onMoveMilestone(phase.id, milestone.id, 'down'); }}
                              disabled={mIdx === phase.milestones.length - 1}
                              className="p-0.5 text-slate-500 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onAddSprint(phase.id, milestone.id); }}
                              className="p-0.5 text-emerald-400 hover:bg-emerald-500/10 rounded"
                              title="Add Sprint"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Sprints Subtree */}
                        {msExpanded && (
                          <div className="pl-4 border-l border-slate-800/80 space-y-1 ml-2">
                            {milestone.sprints.map((sprint, sIdx) => {
                              const spExpanded = isExpanded(sprint.id);
                              const spSel = isSelected('sprint', sprint.id);

                              return (
                                <div key={sprint.id} className="space-y-1">
                                  {/* Sprint Node Item */}
                                  <div
                                    onClick={() => handleSelect({ type: 'sprint', phaseId: phase.id, milestoneId: milestone.id, sprintId: sprint.id })}
                                    className={`group p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                                      spSel
                                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold'
                                        : 'bg-slate-950/60 border-slate-800/60 text-slate-400 hover:text-slate-200'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-1.5 truncate">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggle(sprint.id);
                                        }}
                                        className="p-0.5 text-slate-500 hover:text-white"
                                      >
                                        {spExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                      </button>
                                      <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                                      <span className="truncate">{sprint.title || `Sprint ${sIdx + 1}`}</span>
                                    </div>

                                    <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); onMoveSprint(phase.id, milestone.id, sprint.id, 'up'); }}
                                        disabled={sIdx === 0}
                                        className="p-0.5 text-slate-500 hover:text-white disabled:opacity-30"
                                      >
                                        <ArrowUp className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); onMoveSprint(phase.id, milestone.id, sprint.id, 'down'); }}
                                        disabled={sIdx === milestone.sprints.length - 1}
                                        className="p-0.5 text-slate-500 hover:text-white disabled:opacity-30"
                                      >
                                        <ArrowDown className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); onAddTask(phase.id, milestone.id, sprint.id); }}
                                        className="p-0.5 text-purple-400 hover:bg-purple-500/10 rounded"
                                        title="Add Task"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Tasks Subtree */}
                                  {spExpanded && (
                                    <div className="pl-4 border-l border-slate-800/60 space-y-1 ml-2">
                                      {sprint.tasks.map((task, tIdx) => {
                                        const tkSel = isSelected('task', task.id);

                                        return (
                                          <div
                                            key={task.id}
                                            onClick={() => handleSelect({ type: 'task', phaseId: phase.id, milestoneId: milestone.id, sprintId: sprint.id, taskId: task.id })}
                                            className={`group p-1.5 rounded-md border transition-all cursor-pointer flex items-center justify-between text-[11px] ${
                                              tkSel
                                                ? 'bg-purple-500/10 border-purple-500/40 text-purple-300 font-medium'
                                                : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200'
                                            }`}
                                          >
                                            <div className="flex items-center space-x-2 truncate">
                                              {getTaskIcon(task.type)}
                                              <span className="truncate">{task.title || `Task ${tIdx + 1}`}</span>
                                            </div>

                                            <div className="flex items-center space-x-0.5 opacity-80 group-hover:opacity-100">
                                              <button
                                                onClick={(e) => { e.stopPropagation(); onMoveTask(phase.id, milestone.id, sprint.id, task.id, 'up'); }}
                                                disabled={tIdx === 0}
                                                className="p-0.5 text-slate-500 hover:text-white disabled:opacity-30"
                                              >
                                                <ArrowUp className="w-2.5 h-2.5" />
                                              </button>
                                              <button
                                                onClick={(e) => { e.stopPropagation(); onMoveTask(phase.id, milestone.id, sprint.id, task.id, 'down'); }}
                                                disabled={tIdx === sprint.tasks.length - 1}
                                                className="p-0.5 text-slate-500 hover:text-white disabled:opacity-30"
                                              >
                                                <ArrowDown className="w-2.5 h-2.5" />
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapTree;
