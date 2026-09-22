import React from 'react';
import { AtsScoreResult } from '../../utils/atsEngine';
import { CheckCircle2, XCircle, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

interface AtsMatchCardProps {
  analysis: AtsScoreResult;
  versionTitle?: string;
  targetRole?: string;
  targetCompany?: string;
}

export default function AtsMatchCard({ analysis, versionTitle, targetRole, targetCompany }: AtsMatchCardProps) {
  const { totalScore, grade, breakdown, matchedKeywords, missingKeywords, formatChecks } = analysis;

  const totalReqs = matchedKeywords.length + missingKeywords.length;
  const matchRatio = totalReqs > 0 ? `${matchedKeywords.length} of ${totalReqs} requirements matched` : 'Keywords analyzed';

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-sm space-y-6">
      {/* Overview Score Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#DCE7F2]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2459A8] bg-[#EFFAFD] px-2.5 py-0.5 rounded-full border border-[#DCE7F2]">
              ATS Match Diagnostics
            </span>
            {targetCompany && (
              <span className="text-xs font-medium text-[#526078]">
                Target: <strong>{targetCompany}</strong> ({targetRole})
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold font-display text-[#11183D]">
            {versionTitle || 'Resume ATS Readiness'}
          </h3>
          <p className="text-xs text-[#526078] font-mono">
            {totalScore}% Overall Match — {matchRatio}
          </p>
        </div>

        {/* Big Score Gauge */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-[#DCE7F2] self-stretch sm:self-auto justify-center">
          <div className="relative w-16 h-16 flex items-center justify-center font-mono font-bold text-2xl text-[#11183D]">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={totalScore >= 80 ? 'text-emerald-500' : totalScore >= 65 ? 'text-amber-500' : 'text-rose-500'}
                strokeDasharray={`${totalScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute">{totalScore}%</span>
          </div>

          <div>
            <div className="text-xs font-bold text-[#11183D]">{grade}</div>
            <p className="text-[11px] text-[#526078] mt-0.5 max-w-[160px]">
              {totalScore >= 80
                ? 'High probability of passing ATS filters.'
                : totalScore >= 65
                ? 'Good match, but missing key required skills.'
                : 'Needs targeted optimization before submitting.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Factor Score Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Factor 1: Keywords */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-[#DCE7F2] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#11183D]">Keyword Match</span>
            <span className="font-mono text-[#2459A8] font-bold">{breakdown.keywordScore} / 40</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2459A8] rounded-full transition-all duration-500"
              style={{ width: `${(breakdown.keywordScore / 40) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-[#526078]">Matches JD specific hard tech terms</p>
        </div>

        {/* Factor 2: Quantified Metrics */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-[#DCE7F2] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#11183D]">Quantified Impact</span>
            <span className="font-mono text-purple-700 font-bold">{breakdown.metricsScore} / 25</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${(breakdown.metricsScore / 25) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-[#526078]">STAR bullet points with %, $, numbers</p>
        </div>

        {/* Factor 3: Completeness */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-[#DCE7F2] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#11183D]">Completeness</span>
            <span className="font-mono text-emerald-700 font-bold">{breakdown.completenessScore} / 20</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(breakdown.completenessScore / 20) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-[#526078]">Links, education, project details</p>
        </div>

        {/* Factor 4: Action Verbs */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-[#DCE7F2] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#11183D]">Action Verbs</span>
            <span className="font-mono text-amber-700 font-bold">{breakdown.actionVerbScore} / 15</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(breakdown.actionVerbScore / 15) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-[#526078]">Strong active verbs vs passive verbs</p>
        </div>
      </div>

      {/* Format Checks */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[#526078] uppercase tracking-wider">
          ATS Parsing Format Verification
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {formatChecks.map((check, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                check.passed ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-rose-50/50 border-rose-200 text-rose-900'
              }`}
            >
              {check.passed ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <XCircle size={16} className="text-rose-600 shrink-0" />
              )}
              <div>
                <p className="font-bold">{check.title}</p>
                <p className="text-[10px] opacity-80">{check.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
