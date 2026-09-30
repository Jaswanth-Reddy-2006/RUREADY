import React, { useState } from 'react';
import { BuilderMilestone, BuilderSprint } from './types';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Target, 
  Clock, 
  Tag, 
  ListChecks, 
  Layers, 
  ChevronUp, 
  ChevronDown, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface MilestoneEditorProps {
  milestone: BuilderMilestone;
  onUpdate: (updated: BuilderMilestone) => void;
  onDelete: () => void;
  onAddSprint: () => void;
  onSelectSprint: (sprintId: string) => void;
  onDeleteSprint: (sprintId: string) => void;
  onMoveSprint: (sprintId: string, direction: 'up' | 'down') => void;
}

export const MilestoneEditor: React.FC<MilestoneEditorProps> = ({
  milestone,
  onUpdate,
  onDelete,
  onAddSprint,
  onSelectSprint,
  onDeleteSprint,
  onMoveSprint
}) => {
  const [newSkill, setNewSkill] = useState('');
  const [newCriterion, setNewCriterion] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleFieldChange = (field: keyof BuilderMilestone, value: any) => {
    onUpdate({
      ...milestone,
      [field]: value
    });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const skillClean = newSkill.trim();
    if (!milestone.skills.includes(skillClean)) {
      onUpdate({
        ...milestone,
        skills: [...milestone.skills, skillClean]
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onUpdate({
      ...milestone,
      skills: milestone.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCriterion.trim()) return;
    onUpdate({
      ...milestone,
      completionCriteria: [...milestone.completionCriteria, newCriterion.trim()]
    });
    setNewCriterion('');
  };

  const handleRemoveCriterion = (index: number) => {
    onUpdate({
      ...milestone,
      completionCriteria: milestone.completionCriteria.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-xl">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <CheckSquare className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                Milestone Editor
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {milestone.title || 'Untitled Milestone'}
            </h2>
          </div>
        </div>

        {confirmDelete ? (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 p-1.5 rounded-xl">
            <span className="text-xs text-red-400 px-2">Delete milestone?</span>
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

      {/* Basic details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            Milestone Name <span className="text-purple-400">*</span>
          </label>
          <input
            type="text"
            value={milestone.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="e.g. Python for Machine Learning"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Estimated Duration
          </label>
          <input
            type="text"
            value={milestone.estimatedDuration || ''}
            onChange={(e) => handleFieldChange('estimatedDuration', e.target.value)}
            placeholder="e.g. 2 weeks"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Milestone Objective */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-purple-400" />
          Milestone Objective <span className="text-purple-400">*</span>
        </label>
        <textarea
          rows={3}
          value={milestone.objective}
          onChange={(e) => handleFieldChange('objective', e.target.value)}
          placeholder="What should the learner be able to do after completing this milestone?"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
        />
      </div>

      {/* Skills Covered Tags */}
      <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-blue-400" />
          Skills Covered
        </label>
        <p className="text-xs text-slate-400">
          Add specific technical or functional skills learners gain in this milestone.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {milestone.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs font-medium text-purple-300"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-red-400 transition-colors"
              >
                ×
              </button>
            </span>
          ))}

          {milestone.skills.length === 0 && (
            <span className="text-xs italic text-slate-500">No skill tags added yet.</span>
          )}
        </div>

        <form onSubmit={handleAddSkill} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add skill tag (e.g. Data Structures)..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Tag
          </button>
        </form>
      </div>

      {/* Completion Criteria Checklist */}
      <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
          Completion Criteria Checklist
        </label>
        <p className="text-xs text-slate-400">
          Simple goals that learners check off to mark this milestone complete.
        </p>

        <div className="space-y-2 pt-1">
          {milestone.completionCriteria.map((criterion, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 bg-slate-900/80 border border-slate-800/60 rounded-lg text-xs text-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded border border-slate-700 flex items-center justify-center text-slate-500">
                  ✓
                </span>
                <span>{criterion}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveCriterion(idx)}
                className="text-slate-500 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {milestone.completionCriteria.length === 0 && (
            <div className="text-xs italic text-slate-500 p-2">
              Default criteria will include completing all sprints. Add custom criteria if desired.
            </div>
          )}
        </div>

        <form onSubmit={handleAddCriterion} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newCriterion}
            onChange={(e) => setNewCriterion(e.target.value)}
            placeholder="Add criterion (e.g. Pass assessment with 80%+)..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Criterion
          </button>
        </form>
      </div>

      {/* Sprints in this Milestone */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Sprints ({milestone.sprints.length})
            </h3>
          </div>
          <button
            onClick={onAddSprint}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sprint</span>
          </button>
        </div>

        {milestone.sprints.length === 0 ? (
          <div className="p-6 text-center bg-slate-950/50 border border-dashed border-slate-800 rounded-xl space-y-2">
            <p className="text-xs text-slate-400">
              No sprints created for this milestone yet.
            </p>
            <button
              onClick={onAddSprint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-slate-950 font-semibold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Sprint
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {milestone.sprints.map((sprint, index) => (
              <div
                key={sprint.id}
                className="group flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all"
              >
                <div 
                  onClick={() => onSelectSprint(sprint.id)}
                  className="flex items-center space-x-3 flex-1 cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/20">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                      {sprint.title || 'Untitled Sprint'}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-3">
                      <span>⏱ {sprint.durationDays} days</span>
                      <span>•</span>
                      <span>{sprint.tasks.length} tasks</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onMoveSprint(sprint.id, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onMoveSprint(sprint.id, 'down')}
                    disabled={index === milestone.sprints.length - 1}
                    className="p-1.5 text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSelectSprint(sprint.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors font-medium ml-2"
                  >
                    <span>Edit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteSprint(sprint.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors ml-1"
                    title="Delete Sprint"
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
