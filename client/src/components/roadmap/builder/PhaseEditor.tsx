import React, { useState } from 'react';
import { Layers, Plus, Trash2, Clock, Target, ArrowRight } from 'lucide-react';
import { BuilderPhase } from './types';

export interface PhaseEditorProps {
  phase: BuilderPhase;
  phaseIndex?: number;
  totalPhases?: number;
  onChange?: (updates: Partial<BuilderPhase>) => void;
  onUpdate?: (updatedPhase: BuilderPhase) => void;
  onAddMilestone: () => void;
  onDeletePhase?: () => void;
  onDelete?: () => void;
  onSelectMilestone?: (msId: string) => void;
  onDeleteMilestone?: (msId: string) => void;
  onMoveMilestone?: (msId: string, dir: 'up' | 'down') => void;
}

export const PhaseEditor: React.FC<PhaseEditorProps> = ({
  phase,
  onChange,
  onUpdate,
  onAddMilestone,
  onDeletePhase,
  onDelete,
  onSelectMilestone,
  onDeleteMilestone,
  onMoveMilestone
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleFieldChange = (field: keyof BuilderPhase, value: any) => {
    const updated = { ...phase, [field]: value };
    if (onUpdate) onUpdate(updated);
    if (onChange) onChange({ [field]: value });
  };

  const handleConfirmDelete = () => {
    if (onDelete) onDelete();
    if (onDeletePhase) onDeletePhase();
    setConfirmDelete(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-xl">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
              Phase Editor
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              {phase.title || 'Untitled Phase'}
            </h2>
          </div>
        </div>

        {confirmDelete ? (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 p-1.5 rounded-xl">
            <span className="text-xs text-red-400 px-2">Delete this phase?</span>
            <button
              onClick={handleConfirmDelete}
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
            <span>Delete Phase</span>
          </button>
        )}
      </div>

      {/* Main details fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            Phase Name <span className="text-blue-400">*</span>
          </label>
          <input
            type="text"
            value={phase.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="e.g. Programming Foundations"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Estimated Duration
          </label>
          <input
            type="text"
            value={phase.estimatedDuration || ''}
            onChange={(e) => handleFieldChange('estimatedDuration', e.target.value)}
            placeholder="e.g. 4 weeks"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Description (Optional)
        </label>
        <textarea
          rows={2}
          value={phase.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="High-level overview of what this phase covers..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Phase Objective */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-blue-400" />
          Phase Objective (Optional)
        </label>
        <input
          type="text"
          value={phase.objective || ''}
          onChange={(e) => handleFieldChange('objective', e.target.value)}
          placeholder="What should the learner achieve by the end of this phase?"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Milestones inside Phase */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Phase Milestones ({phase.milestones.length})
            </h3>
            <p className="text-xs text-slate-400">
              Break this phase down into targeted milestones.
            </p>
          </div>
          <button
            onClick={onAddMilestone}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        </div>

        {phase.milestones.length === 0 ? (
          <div className="p-6 text-center bg-slate-950/50 border border-dashed border-slate-800 rounded-xl space-y-2">
            <p className="text-xs text-slate-400">Break this phase into milestones.</p>
            <button
              onClick={onAddMilestone}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white font-semibold text-xs rounded-lg hover:bg-purple-500 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Milestone
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {phase.milestones.map((ms, idx) => (
              <div
                key={ms.id}
                onClick={() => onSelectMilestone && onSelectMilestone(ms.id)}
                className="group flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 rounded-xl transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-md bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-500/20">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                      {ms.title || `Milestone ${idx + 1}`}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {ms.sprints.length} sprints • {ms.skills.length} skills covered
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectMilestone) onSelectMilestone(ms.id);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors font-medium"
                >
                  <span>Edit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseEditor;
