import { useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import clsx from 'clsx';
import { useSystemDesignStore } from '../../store/useSystemDesignStore';

export default function SystemDesignReportModal() {
  const navigate = useNavigate();
  const {
    session,
    evaluationReport,
    evaluationModalOpen,
    setEvaluationModalOpen,
  } = useSystemDesignStore();

  if (!evaluationModalOpen || !evaluationReport) return null;

  const { overallScore, verdict, summary, dimensions, strengths, criticalOmissions, recommendedRedesign } =
    evaluationReport;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#DCE7F2] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#DCE7F2] flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#4A8BDF]/20 border border-[#4A8BDF]/40 text-[#4A8BDF]">
              <Award size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-sans">
                  System Design Scorecard
                </h2>
                <span
                  className={clsx(
                    'px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider',
                    verdict === 'STRONG_HIRE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : verdict === 'HIRE'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : verdict === 'LEANING_HIRE'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  )}
                >
                  {verdict.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {session?.problem?.title || 'System Design Interview Evaluation'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-black font-mono text-[#4A8BDF]">{overallScore} / 100</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Total Score</div>
            </div>

            <button
              type="button"
              onClick={() => setEvaluationModalOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">
          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
            <span className="font-bold text-slate-900 block mb-1">Executive Interview Assessment:</span>
            {summary}
          </div>

          {/* 11 Dimensions Bar Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              11-Dimension Evaluation Rubric
            </h3>

            <div className="space-y-2.5">
              {dimensions.map((dim, idx) => {
                const pct = (dim.score / dim.maxScore) * 100;
                return (
                  <div key={idx} className="p-3 rounded-2xl border border-slate-100 bg-white shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 font-sans">{dim.dimension}</span>
                      <span className="font-mono font-bold text-slate-700">{dim.score} / {dim.maxScore}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={clsx(
                          'h-full rounded-full transition-all duration-500',
                          dim.score >= 8 ? 'bg-emerald-500' : dim.score >= 6 ? 'bg-[#4A8BDF]' : 'bg-amber-500'
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-500 leading-tight">{dim.feedback}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Critical Omissions */}
          <div className="grid grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 font-sans">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>Demonstrated Strengths</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-emerald-900">
                {strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Omissions */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 font-sans">
                <AlertTriangle size={15} className="text-rose-600" />
                <span>Areas for Refinement</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-rose-900">
                {criticalOmissions.length === 0 ? (
                  <li className="text-emerald-700">No major critical architectural gaps identified.</li>
                ) : (
                  criticalOmissions.map((om, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{om}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Reference Architecture Notes */}
          {recommendedRedesign && (
            <div className="p-4 rounded-2xl bg-[#EFFAFD] border border-blue-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A8BDF] font-sans">
                <Sparkles size={14} />
                <span>Staff Reference Architecture Notes</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {recommendedRedesign}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#DCE7F2] bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setEvaluationModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            Review Canvas Architecture
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEvaluationModalOpen(false);
                navigate('/system-design/history');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-[#DCE7F2] hover:bg-slate-100 transition-colors"
            >
              View Interview History
            </button>
            <button
              type="button"
              onClick={() => {
                setEvaluationModalOpen(false);
                navigate('/system-design');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#4A8BDF] hover:bg-blue-600 shadow-xs transition-colors"
            >
              <span>Practice Another Problem</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
