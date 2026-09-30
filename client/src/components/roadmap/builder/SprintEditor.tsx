import React, { useState } from 'react';
import { BuilderSprint, BuilderTask } from './types';
import { 
  Layers, 
  Trash2, 
  Clock, 
  Target, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  ArrowRight,
  Copy,
  BookOpen,
  Brain,
  Code,
  FileCheck2,
  RotateCcw,
  Mic,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SprintEditorProps {
  sprint: BuilderSprint;
  onUpdate: (updated: BuilderSprint) => void;
  onDelete: () => void;
  onAddTask: () => void;
  onSelectTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDuplicateTask: (taskId: string) => void;
  onMoveTask: (taskId: string, direction: 'up' | 'down') => void;
}

const DURATION_OPTIONS = [
  { label: '3 days', value: 3 },
  { label: '5 days', value: 5 },
  { label: '7 days', value: 7 },
  { label: '10 days', value: 10 },
  { label: '14 days', value: 14 },
];

export const SprintEditor: React.FC<SprintEditorProps> = ({
  sprint,
  onUpdate,
  onDelete,
  onAddTask,
  onSelectTask,
  onDeleteTask,
  onDuplicateTask,
  onMoveTask
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isCustomDays, setIsCustomDays] = useState(
    !DURATION_OPTIONS.some(opt => opt.value === sprint.durationDays)
  );

  const handleFieldChange = (field: keyof BuilderSprint, value: any) => {
    onUpdate({
      ...sprint,
      [field]: value
    });
  };

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
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-xl">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Layers className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Sprint Editor
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {sprint.title || 'Untitled Sprint'}
            </h2>
          </div>
        </div>

        {confirmDelete ? (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 p-1.5 rounded-xl">
            <span className="text-xs text-red-400 px-2">Delete sprint & tasks?</span>
            <button
              onClick={() => {
                onDelete();
                setConfirmDelete(false);
              }}
              className="px-2.5 py-1 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        )}
      </div>

      {/* Basic fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            Sprint Name <span className="text-emerald-400">*</span>
          </label>
          <input
            type="text"
            value={sprint.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="e.g. Python Fundamentals"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>

        {/* Sprint Duration Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Sprint Duration
          </label>
          
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setIsCustomDays(false);
                  handleFieldChange('durationDays', option.value);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  !isCustomDays && sprint.durationDays === option.value
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCustomDays(true)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                isCustomDays
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Custom
            </button>
          </div>

          {isCustomDays && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min="1"
                max="90"
                value={sprint.durationDays}
                onChange={(e) => handleFieldChange('durationDays', parseInt(e.target.value) || 1)}
                className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white text-center focus:outline-none focus:border-emerald-500"
              />
              <span className="text-xs text-slate-400">days</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Description (Optional)
        </label>
        <input
          type="text"
          value={sprint.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Short overview of what this sprint covers..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Sprint Goal */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-emerald-400" />
          Sprint Goal <span className="text-emerald-400">*</span>
        </label>
        <textarea
          rows={2}
          value={sprint.goal}
          onChange={(e) => handleFieldChange('goal', e.target.value)}
          placeholder="What specific outcome should be accomplished by the end of this sprint?"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
        />
      </div>

      {/* Tasks Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Sprint Tasks ({sprint.tasks.length})
            </h3>
            <p className="text-xs text-slate-400">
              Tasks should be bite-sized learning activities, exercises, or projects.
            </p>
          </div>
          <button
            onClick={onAddTask}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        {sprint.tasks.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/50 border border-dashed border-slate-800 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-medium text-white">No tasks added yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add the actions learners will complete in this sprint (learning, practice, project, or assessment).
            </p>
            <button
              onClick={onAddTask}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white font-semibold text-xs rounded-xl hover:bg-purple-500 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> Add First Task
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {sprint.tasks.map((task, index) => (
              <div
                key={task.id}
                className="group flex items-center justify-between p-3.5 bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 rounded-xl transition-all"
              >
                <div 
                  onClick={() => onSelectTask(task.id)}
                  className="flex items-center space-x-3 flex-1 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {getTaskIcon(task.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium capitalize text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {task.type}
                      </span>
                      {task.required ? (
                        <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                          Required
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                          Optional
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors mt-0.5">
                      {task.title || 'Untitled Task'}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-400 mr-2">
                  <span>⏱ {task.estimatedMinutes} min</span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onMoveTask(task.id, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onMoveTask(task.id, 'down')}
                    disabled={index === sprint.tasks.length - 1}
                    className="p-1.5 text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDuplicateTask(task.id)}
                    className="p-1.5 text-slate-500 hover:text-purple-300 transition-colors"
                    title="Duplicate Task"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSelectTask(task.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors font-medium ml-1"
                  >
                    <span>Edit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors ml-1"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
