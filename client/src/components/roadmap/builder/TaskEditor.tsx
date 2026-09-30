import React, { useState } from 'react';
import { BuilderTask, TaskType, TaskResource, ProjectData, AssessmentData, RevisionData, InterviewData } from './types';
import { 
  CheckCircle2, 
  Trash2, 
  Clock, 
  Tag, 
  Plus, 
  BookOpen, 
  Brain, 
  Code, 
  FileCheck2, 
  RotateCcw, 
  Mic, 
  ExternalLink,
  ListChecks,
  Award,
  HelpCircle,
  HelpCircleIcon
} from 'lucide-react';

interface TaskEditorProps {
  task: BuilderTask;
  onUpdate: (updated: BuilderTask) => void;
  onDelete: () => void;
}

const TASK_TYPES: { type: TaskType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'learning', label: 'Learning', icon: <BookOpen className="w-4 h-4" />, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { type: 'practice', label: 'Practice', icon: <Brain className="w-4 h-4" />, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { type: 'project', label: 'Project', icon: <Code className="w-4 h-4" />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { type: 'assessment', label: 'Assessment', icon: <FileCheck2 className="w-4 h-4" />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { type: 'revision', label: 'Revision', icon: <RotateCcw className="w-4 h-4" />, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  { type: 'interview', label: 'Interview', icon: <Mic className="w-4 h-4" />, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
];

export const TaskEditor: React.FC<TaskEditorProps> = ({
  task,
  onUpdate,
  onDelete
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Resource state for Learning tasks
  const [resTitle, setResTitle] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resType, setResType] = useState<TaskResource['type']>('Article');

  // Project checklist criterion state
  const [newProjectCriterion, setNewProjectCriterion] = useState('');

  const handleFieldChange = (field: keyof BuilderTask, value: any) => {
    onUpdate({
      ...task,
      [field]: value
    });
  };

  const handleTypeChange = (newType: TaskType) => {
    // Initialize default sub-data if absent when switching types
    let updatedTask = { ...task, type: newType };

    if (newType === 'project' && !updatedTask.projectData) {
      updatedTask.projectData = {
        title: updatedTask.title || 'Mini Project',
        description: '',
        skillsDemonstrated: [],
        completionCriteria: ['Dataset prepared', 'Model trained', 'Evaluation completed', 'README created']
      };
    } else if (newType === 'assessment' && !updatedTask.assessmentData) {
      updatedTask.assessmentData = {
        title: updatedTask.title || 'Knowledge Assessment',
        passingScore: 80,
        questionSource: 'rennetus_bank'
      };
    } else if (newType === 'revision' && !updatedTask.revisionData) {
      updatedTask.revisionData = {
        topics: [],
        recommendedMinutes: updatedTask.estimatedMinutes || 30
      };
    } else if (newType === 'interview' && !updatedTask.interviewData) {
      updatedTask.interviewData = {
        topic: updatedTask.title || 'Technical Interview Prep',
        questionCount: 5,
        difficulty: 'Intermediate'
      };
    }

    onUpdate(updatedTask);
  };

  // Skill Handlers
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const cleanSkill = newSkill.trim();
    if (!task.skills.includes(cleanSkill)) {
      onUpdate({ ...task, skills: [...task.skills, cleanSkill] });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onUpdate({ ...task, skills: task.skills.filter(s => s !== skillToRemove) });
  };

  // Resource Handlers
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;
    const newRes: TaskResource = {
      id: 'res-' + Date.now(),
      title: resTitle.trim(),
      url: resUrl.trim() || '#',
      type: resType
    };
    onUpdate({
      ...task,
      resources: [...task.resources, newRes]
    });
    setResTitle('');
    setResUrl('');
  };

  const handleRemoveResource = (id: string) => {
    onUpdate({
      ...task,
      resources: task.resources.filter(r => r.id !== id)
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-xl">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                Task Editor
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {task.title || 'Untitled Task'}
            </h2>
          </div>
        </div>

        {confirmDelete ? (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 p-1.5 rounded-xl">
            <span className="text-xs text-red-400 px-2">Delete task?</span>
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

      {/* Task Type Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Task Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {TASK_TYPES.map((tt) => {
            const isSelected = task.type === tt.type;
            return (
              <button
                key={tt.type}
                type="button"
                onClick={() => handleTypeChange(tt.type)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? `${tt.color} ring-1 ring-purple-500 border-purple-500 shadow-md`
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="mb-1">{tt.icon}</div>
                <span>{tt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Basic fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            Task Name <span className="text-purple-400">*</span>
          </label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="e.g. Learn Python Functions"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Estimated Time
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="5"
              step="5"
              value={task.estimatedMinutes}
              onChange={(e) => handleFieldChange('estimatedMinutes', parseInt(e.target.value) || 15)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white text-center focus:outline-none focus:border-purple-500"
            />
            <span className="text-xs text-slate-400 font-medium">mins</span>
          </div>
        </div>
      </div>

      {/* Description & Requirement Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Description
          </label>
          <textarea
            rows={2}
            value={task.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Instructions or details for completing this task..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Required Task?
          </label>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">
              {task.required ? 'Learner MUST complete this' : 'Optional bonus activity'}
            </span>
            <button
              type="button"
              onClick={() => handleFieldChange('required', !task.required)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                task.required ? 'bg-purple-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  task.required ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Skills Covered Tags */}
      <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-blue-400" />
          Task Skills
        </label>

        <div className="flex flex-wrap gap-2 pt-1">
          {task.skills.map((skill) => (
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

          {task.skills.length === 0 && (
            <span className="text-xs italic text-slate-500">No task skills attached.</span>
          )}
        </div>

        <form onSubmit={handleAddSkill} className="flex gap-2 pt-1">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add task skill tag..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Tag Skill
          </button>
        </form>
      </div>

      {/* ======================================================== */}
      {/* TASK TYPE SPECIFIC FIELDS */}
      {/* ======================================================== */}

      {/* 1. LEARNING TASK FIELDS */}
      {task.type === 'learning' && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Learning Resources ({task.resources.length})
            </h3>
          </div>

          <div className="space-y-2">
            {task.resources.map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-semibold">
                    {res.type}
                  </span>
                  <div>
                    <h4 className="font-medium text-white">{res.title}</h4>
                    {res.url && res.url !== '#' && (
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-purple-400 flex items-center gap-1 text-[11px] truncate max-w-md"
                      >
                        {res.url} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveResource(res.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddResource} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300">Add New Resource</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={resTitle}
                onChange={(e) => setResTitle(e.target.value)}
                placeholder="Resource Title (e.g. Official Docs)"
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <input
                type="url"
                value={resUrl}
                onChange={(e) => setResUrl(e.target.value)}
                placeholder="URL (https://...)"
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <select
                value={resType}
                onChange={(e) => setResType(e.target.value as TaskResource['type'])}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Video">Video</option>
                <option value="Article">Article</option>
                <option value="Documentation">Documentation</option>
                <option value="Course">Course</option>
                <option value="Book">Book</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Resource
            </button>
          </form>
        </div>
      )}

      {/* 2. PRACTICE TASK FIELDS */}
      {task.type === 'practice' && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            Practice Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Practice Instructions</label>
              <textarea
                rows={3}
                value={task.practiceInstructions || ''}
                onChange={(e) => handleFieldChange('practiceInstructions', e.target.value)}
                placeholder="Instructions or problem set description for practice..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Practice Link / Resource URL</label>
                <input
                  type="url"
                  value={task.practiceResourceUrl || ''}
                  onChange={(e) => handleFieldChange('practiceResourceUrl', e.target.value)}
                  placeholder="https://leetcode.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Number of Problems</label>
                <input
                  type="number"
                  min="1"
                  value={task.problemCount || 1}
                  onChange={(e) => handleFieldChange('problemCount', parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PROJECT TASK FIELDS */}
      {task.type === 'project' && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            Project Deliverable Setup
          </h3>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300">Project Title</label>
            <input
              type="text"
              value={task.projectData?.title || ''}
              onChange={(e) =>
                handleFieldChange('projectData', { ...task.projectData, title: e.target.value })
              }
              placeholder="e.g. Build Movie Recommendation Engine"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Completion Criteria Checklist</label>
            <div className="space-y-2">
              {task.projectData?.completionCriteria.map((criterion, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span>{criterion}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedCriteria = task.projectData?.completionCriteria.filter((_, i) => i !== idx) || [];
                      handleFieldChange('projectData', { ...task.projectData, completionCriteria: updatedCriteria });
                    }}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newProjectCriterion.trim()) return;
                const currentCriteria = task.projectData?.completionCriteria || [];
                handleFieldChange('projectData', {
                  ...task.projectData,
                  completionCriteria: [...currentCriteria, newProjectCriterion.trim()]
                });
                setNewProjectCriterion('');
              }}
              className="flex gap-2 pt-2"
            >
              <input
                type="text"
                value={newProjectCriterion}
                onChange={(e) => setNewProjectCriterion(e.target.value)}
                placeholder="Add checklist item (e.g. README created)..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. ASSESSMENT TASK FIELDS */}
      {task.type === 'assessment' && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            Assessment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Passing Score (%)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={task.assessmentData?.passingScore || 80}
                  onChange={(e) =>
                    handleFieldChange('assessmentData', {
                      ...task.assessmentData,
                      passingScore: parseInt(e.target.value) || 80
                    })
                  }
                  className="w-28 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-amber-500"
                />
                <span className="text-xs text-slate-400">% minimum required to pass</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Question Source</label>
              <select
                value={task.assessmentData?.questionSource || 'rennetus_bank'}
                onChange={(e) =>
                  handleFieldChange('assessmentData', {
                    ...task.assessmentData,
                    questionSource: e.target.value as any
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="rennetus_bank">Select from Rennetus Question Bank</option>
                <option value="custom">Create Custom Questions</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 5. REVISION TASK FIELDS */}
      {task.type === 'revision' && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-sky-400" />
            Revision Topics
          </h3>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Topics to Revise (comma separated)</label>
            <input
              type="text"
              value={task.revisionData?.topics.join(', ') || ''}
              onChange={(e) =>
                handleFieldChange('revisionData', {
                  ...task.revisionData,
                  topics: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })
              }
              placeholder="e.g. List Comprehensions, Decorators, Generators"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      )}

      {/* 6. INTERVIEW TASK FIELDS */}
      {task.type === 'interview' && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Mic className="w-4 h-4 text-rose-400" />
            Mock Interview Setup
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Interview Topic</label>
              <input
                type="text"
                value={task.interviewData?.topic || ''}
                onChange={(e) =>
                  handleFieldChange('interviewData', { ...task.interviewData, topic: e.target.value })
                }
                placeholder="e.g. Python OOP Concepts"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Difficulty Level</label>
              <select
                value={task.interviewData?.difficulty || 'Intermediate'}
                onChange={(e) =>
                  handleFieldChange('interviewData', {
                    ...task.interviewData,
                    difficulty: e.target.value as any
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
