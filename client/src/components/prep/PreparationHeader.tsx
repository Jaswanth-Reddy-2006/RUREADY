import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Map, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

interface PreparationHeaderProps {
  isAssessed: boolean;
}

export default function PreparationHeader({ isAssessed }: PreparationHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Placement Preparation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Learn, practice and assess the skills required for placements.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
        <Button
          onClick={() => navigate('/preparation/skills')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
        >
          <Map className="w-4 h-4 text-slate-500" />
          <span>View Skill Map</span>
        </Button>

        <Button
          onClick={() => navigate(isAssessed ? '/preparation/today' : '/preparation/assessment')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          {isAssessed ? (
            <>
              <span>Continue Preparation</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Take Baseline Assessment</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
