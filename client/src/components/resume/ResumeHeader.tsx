import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileSearch, Plus, Layers } from 'lucide-react';
import Button from '../ui/Button';

interface ResumeHeaderProps {
  onCreateClick: () => void;
  onAnalyzeClick?: () => void;
}

export default function ResumeHeader({ onCreateClick, onAnalyzeClick }: ResumeHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          AI Resume & ATS Command Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Build resumes that clearly communicate your skills, experience, and relevance to target roles.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
        <Button
          onClick={() => navigate('/resume/analyze')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
        >
          <FileSearch className="w-4 h-4 text-slate-500" />
          <span>Analyze Resume</span>
        </Button>

        <Button
          onClick={onCreateClick}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Resume</span>
        </Button>
      </div>
    </div>
  );
}
