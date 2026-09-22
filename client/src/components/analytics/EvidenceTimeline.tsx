import React from 'react';
import { EvidenceMoment } from '../../utils/careerAnalyticsAggregator';
import { History, Play, Video, Code2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EvidenceTimelineProps {
  moments: EvidenceMoment[];
}

export default function EvidenceTimeline({ moments }: EvidenceTimelineProps) {
  const navigate = useNavigate();

  if (!moments || moments.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <History size={18} className="text-[#2459A8]" />
            <h3 className="text-lg font-bold font-display text-[#11183D]">
              Interview Evidence Log
            </h3>
          </div>
          <p className="text-xs text-[#526078] mt-0.5">
            Traceable interview moments connecting evaluations directly to replay timestamps and code.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {moments.slice(0, 5).map((mom) => {
          const isCoding = mom.interviewType === 'CODING';

          return (
            <div
              key={mom.id}
              className="p-4 bg-slate-50 border border-[#DCE7F2] rounded-2xl space-y-2 hover:border-[#2459A8]/40 transition-all"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    {mom.displayTimestamp}
                  </span>
                  <span className="font-bold text-[#11183D] flex items-center gap-1">
                    {isCoding ? <Code2 size={13} className="text-purple-600" /> : <Video size={13} className="text-[#2459A8]" />}
                    {mom.sessionTitle}
                  </span>
                </div>

                <span className="font-mono text-[#526078]">{mom.date}</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 text-xs">
                <p className="font-bold text-[#2459A8]">{mom.topicOrContext}</p>
                <p className="text-[#11183D] italic">"{mom.quoteOrAnswer}"</p>
                <p className="text-[#526078] text-[11px] pt-1">
                  <strong>Evaluation:</strong> {mom.evaluation}
                </p>
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={() => navigate(isCoding ? `/coding/${mom.sessionId}/analysis` : `/interview/${mom.sessionId}/analysis`)}
                  className="px-3 py-1 bg-white border border-[#DCE7F2] hover:bg-blue-50 text-[#2459A8] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Play size={12} />
                  <span>View Replay</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
