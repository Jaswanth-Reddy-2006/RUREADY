import React from 'react';
import { Sparkles, ArrowLeft, Check, Edit2, Target, Clock, Trophy, BookOpen } from 'lucide-react';
import { AIPlannerAnswers } from './types';

interface PlannerConfirmationProps {
  answers: AIPlannerAnswers;
  onEdit: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function PlannerConfirmation({
  answers,
  onEdit,
  onGenerate,
  isGenerating,
}: PlannerConfirmationProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto animate-fadeIn font-body">
      {/* Header */}
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
          Here's what we understood.
        </h2>
        <p className="text-xs sm:text-sm text-[#526078] font-medium">
          Review your inputs. We'll build your custom sequential blueprint based on these.
        </p>
      </div>

      {/* Compact Summary Card */}
      <div className="bg-white rounded-3xl border border-[#DCE7F2] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-extrabold font-display text-[#2459A8] uppercase tracking-wider flex items-center gap-1.5">
            <Target size={14} />
            Career Blueprint Summary
          </span>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-bold text-slate-500 hover:text-[#2459A8] flex items-center gap-1 cursor-pointer"
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Career Goal */}
          <div className="space-y-0.5">
            <span className="text-slate-400 font-semibold block text-[11px]">Career Goal</span>
            <span className="font-extrabold text-[#11183D] font-display text-sm">
              {answers.careerGoal.name || 'Not specified'}
            </span>
          </div>

          {/* Starting Point */}
          <div className="space-y-0.5">
            <span className="text-slate-400 font-semibold block text-[11px]">Starting Point</span>
            <span className="font-bold text-slate-800">
              {answers.experienceLevel || 'Starting out'}
            </span>
          </div>

          {/* Experience Types */}
          <div className="space-y-0.5">
            <span className="text-slate-400 font-semibold block text-[11px]">Experience</span>
            <span className="font-medium text-slate-700">
              {answers.experienceTypes.length > 0 ? answers.experienceTypes.join(' · ') : 'None listed'}
            </span>
          </div>

          {/* Objectives */}
          <div className="space-y-0.5">
            <span className="text-slate-400 font-semibold block text-[11px]">Goal / Objective</span>
            <span className="font-medium text-slate-700">
              {answers.objectives.length > 0 ? answers.objectives.join(' · ') : 'Career Growth'}
            </span>
          </div>

          {/* Time & Pace */}
          <div className="space-y-0.5">
            <span className="text-slate-400 font-semibold block text-[11px]">Schedule & Pace</span>
            <span className="font-medium text-slate-700">
              {answers.weeklyHours || '5–10 hrs/week'} · {answers.pace || 'Balanced'}
            </span>
          </div>

          {/* Focus Areas */}
          <div className="space-y-0.5">
            <span className="text-slate-400 font-semibold block text-[11px]">Focus Areas</span>
            <span className="font-medium text-slate-700">
              {answers.focusAreas.length > 0 ? answers.focusAreas.join(' · ') : 'Practical Skills'}
            </span>
          </div>
        </div>

        {/* Known Skills List if any */}
        {answers.knownSkills.length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">Existing Known Skills:</span>
            <div className="flex flex-wrap gap-1.5">
              {answers.knownSkills.map((sk) => (
                <span
                  key={sk}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-[#2459A8] border border-blue-100"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Follow-up answers summary if present */}
        {Object.keys(answers.followUpAnswers).length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">Additional Context:</span>
            <div className="space-y-1 text-xs text-slate-700 font-medium">
              {Object.entries(answers.followUpAnswers).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-500 capitalize">{k.replace(/_/g, ' ')}:</span>
                  <span className="font-bold text-slate-800">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 font-medium text-center">
        Your answers can be changed later.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer font-display w-full sm:w-auto justify-center"
        >
          <ArrowLeft size={15} />
          <span>Edit Answers</span>
        </button>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#C026D3] hover:from-[#1D4ED8] hover:to-[#A21CAF] text-white font-bold font-display text-sm shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
        >
          <Sparkles size={18} className={isGenerating ? 'animate-spin' : ''} />
          <span>{isGenerating ? 'Synthesizing Roadmap...' : 'Generate My Roadmap'}</span>
        </button>
      </div>
    </div>
  );
}
