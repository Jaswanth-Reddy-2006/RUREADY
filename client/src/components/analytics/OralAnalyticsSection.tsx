import React from 'react';
import { Video, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OralAnalyticsSectionProps {
  oralBreakdown: {
    totalSessions: number;
    avgScore: number | null;
    trend: string;
    metrics: Record<string, number | null>;
    recentSessions: any[];
  };
}

export default function OralAnalyticsSection({ oralBreakdown }: OralAnalyticsSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#DCE7F2] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-[#2459A8] border border-blue-100">
            <Video size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-[#11183D]">
              Oral Interview Performance
            </h3>
            <p className="text-xs text-[#526078]">
              Speech clarity, technical depth, STAR answer structure & behavioral performance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
            {oralBreakdown.totalSessions} Oral Session{oralBreakdown.totalSessions === 1 ? '' : 's'}
          </span>
          <button
            onClick={() => navigate('/oral')}
            className="text-xs font-bold text-[#2459A8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Launch Oral Hub</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Dimension Metrics */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-[#DCE7F2]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#526078]">
            Oral Evaluation Breakdown
          </h4>
          <div className="space-y-2 text-xs">
            {Object.entries(oralBreakdown.metrics).map(([label, val]) => (
              <div key={label} className="flex justify-between items-center p-2 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-[#11183D]">{label}</span>
                <span className="font-mono font-bold text-[#2459A8]">
                  {val !== null && val !== undefined ? `${val}%` : '--'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Oral Sessions */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-[#DCE7F2]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#526078]">
            Recent Oral Sessions
          </h4>

          {oralBreakdown.recentSessions.length > 0 ? (
            <div className="space-y-2">
              {oralBreakdown.recentSessions.slice(0, 3).map((sess) => (
                <div
                  key={sess.id}
                  onClick={() => navigate(sess.analysisUrl)}
                  className="p-3 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors group"
                >
                  <div>
                    <p className="font-bold text-[#11183D] group-hover:text-[#2459A8] transition-colors">{sess.title}</p>
                    <p className="text-[11px] text-[#526078] font-mono">{sess.date}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#2459A8]">{sess.score}%</span>
                    <ExternalLink size={13} className="text-slate-400 group-hover:text-[#2459A8]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#526078] italic">No recent oral sessions recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}
