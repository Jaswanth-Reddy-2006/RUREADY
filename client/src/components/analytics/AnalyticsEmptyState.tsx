import React from 'react';
import { Video, Code2, Sparkles, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AnalyticsEmptyState() {
  const navigate = useNavigate();

  const measuredCompetencies = [
    'Technical Problem Solving',
    'Communication & Explanation',
    'Coding Performance',
    'Interview Structure',
    'Debugging',
    'Complexity Analysis',
    'Delivery & Presentation',
    'Testing & Validation',
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-8 md:p-12 shadow-sm max-w-4xl mx-auto space-y-8 font-sans">
      {/* Top Banner Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
          <ShieldAlert size={14} className="text-amber-600" />
          YOUR CAREER PERFORMANCE PROFILE
        </span>

        <h2 className="text-2xl md:text-3xl font-bold font-display text-[#11183D]">
          Not enough interview evidence yet.
        </h2>

        <p className="text-xs sm:text-sm text-[#526078] max-w-xl mx-auto leading-relaxed">
          Complete your first Oral or Coding Interview to start building your evidence-backed performance profile.
        </p>
      </div>

      {/* Primary CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
        <button
          onClick={() => navigate('/oral')}
          className="w-full sm:w-auto px-6 py-3.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-2xl text-xs font-bold font-display flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Video size={16} />
          <span>Start Oral Interview</span>
          <ArrowRight size={14} />
        </button>

        <button
          onClick={() => navigate('/coding')}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold font-display flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Code2 size={16} />
          <span>Start Coding Interview</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* What we'll measure section */}
      <div className="pt-6 border-t border-[#DCE7F2] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#526078]">
            What We'll Measure & Evaluate
          </h3>
          <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            Evidence: 0 analyzed sessions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {measuredCompetencies.map((comp, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 border border-[#DCE7F2] rounded-2xl flex items-center gap-2.5 text-xs text-[#11183D] font-bold"
            >
              <CheckCircle2 size={15} className="text-[#2459A8] shrink-0" />
              <span>{comp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
