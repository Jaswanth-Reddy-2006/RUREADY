import React from 'react';
import { SessionTimelinePoint } from '../../utils/careerAnalyticsAggregator';
import { Clock, Video, Code2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LongitudinalTimelineProps {
  points: SessionTimelinePoint[];
}

export default function LongitudinalTimeline({ points }: LongitudinalTimelineProps) {
  const navigate = useNavigate();

  if (!points || points.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#2459A8]" />
            <h3 className="text-lg font-bold font-display text-[#11183D]">
              Performance Timeline
            </h3>
          </div>
          <p className="text-xs text-[#526078] mt-0.5">
            Chronological progression of actual interview sessions and overall evaluation scores.
          </p>
        </div>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pl-6">
        {points.map((pt) => (
          <div key={pt.id} className="relative group">
            {/* Timeline Dot */}
            <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-2xs ${
              pt.interviewType === 'CODING' ? 'bg-purple-600' : 'bg-[#2459A8]'
            }`} />

            <div
              onClick={() => navigate(pt.analysisUrl)}
              className="p-4 bg-slate-50 border border-[#DCE7F2] hover:border-[#2459A8]/40 hover:bg-blue-50/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-slate-500 font-bold">{pt.date}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    pt.interviewType === 'CODING' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {pt.interviewType}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#11183D] group-hover:text-[#2459A8] transition-colors">
                  {pt.title}
                </h4>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono">
                  <span className="text-xl font-bold text-[#11183D]">{pt.score}%</span>
                  <span className="block text-[10px] text-slate-500 font-sans">Score</span>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-[#2459A8] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
