import React, { useState } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { BuilderRoadmapState } from './types';

export interface RoadmapSetupProps {
  state?: BuilderRoadmapState;
  initialData?: BuilderRoadmapState;
  onChange?: (updates: Partial<BuilderRoadmapState>) => void;
  onContinue?: () => void;
  onComplete?: (setupData: Partial<BuilderRoadmapState>) => void;
}

const TARGET_ROLE_SUGGESTIONS = [
  'Machine Learning Engineer',
  'Software Engineer',
  'Full-Stack Developer',
  'Backend Engineer',
  'Frontend Developer',
  'Data Scientist',
  'Generative AI Engineer',
  'Cybersecurity Engineer',
  'Cloud Engineer / DevOps',
  'Product Manager',
  'UI/UX Designer',
];

const CATEGORY_OPTIONS = [
  'Software Development',
  'Data & AI',
  'Cloud & DevOps',
  'Cybersecurity',
  'Product & Design',
  'Business',
  'Other',
];

const DURATION_OPTIONS = ['1 month', '3 months', '6 months', '9 months', '12 months', 'Custom'];

export const RoadmapSetup: React.FC<RoadmapSetupProps> = ({
  state: externalState,
  initialData,
  onChange,
  onContinue,
  onComplete
}) => {
  const currentData = externalState || initialData || {
    title: '',
    targetRole: 'Machine Learning Engineer',
    category: 'Software Development',
    description: '',
    difficulty: 'Intermediate',
    estimatedDuration: '3 months',
  };

  const [formData, setFormData] = useState({
    title: currentData.title || '',
    targetRole: currentData.targetRole || '',
    category: currentData.category || 'Software Development',
    description: currentData.description || '',
    difficulty: currentData.difficulty || 'Intermediate',
    estimatedDuration: currentData.estimatedDuration || '3 months',
  });

  const isFormValid = formData.title.trim().length > 0 && formData.targetRole.trim().length > 0;

  const handleFieldChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (onChange) onChange({ [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    if (onComplete) onComplete(formData as any);
    if (onContinue) onContinue();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-slate-900/60 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="space-y-1 text-center">
        <span className="text-[11px] uppercase font-bold text-purple-400 tracking-wider bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          Create Your Roadmap
        </span>
        <h2 className="text-2xl font-extrabold text-white mt-2">Start with the basics</h2>
        <p className="text-xs text-slate-400">
          Build a structured learning path around a goal, skill, or career. You can edit everything later.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        {/* Roadmap Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Roadmap Name <span className="text-purple-400">*</span></span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="e.g. Machine Learning Engineer Roadmap"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Target Role / Goal */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            What is this roadmap for? <span className="text-purple-400">*</span>
          </label>
          <select
            value={formData.targetRole}
            onChange={(e) => handleFieldChange('targetRole', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="" disabled>Select target role...</option>
            {TARGET_ROLE_SUGGESTIONS.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Category & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => handleFieldChange('difficulty', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Estimated Duration */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Estimated Duration</label>
          <select
            value={formData.estimatedDuration}
            onChange={(e) => handleFieldChange('estimatedDuration', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            {DURATION_OPTIONS.map((dur) => (
              <option key={dur} value={dur}>{dur}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex justify-between">
            <span>Description</span>
            <span className="text-slate-500 text-[10px]">Optional</span>
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="What will someone achieve by completing this roadmap?"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Submit button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
          >
            <span>Continue →</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoadmapSetup;
