import React from 'react';
import { CheckCircle2, AlertTriangle, Plus, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface JdGapAnalysisProps {
  matchedKeywords: string[];
  missingKeywords: string[];
  targetRole?: string;
  onAddKeywordToSkills?: (keyword: string) => void;
}

export default function JdGapAnalysis({
  matchedKeywords,
  missingKeywords,
  targetRole,
  onAddKeywordToSkills
}: JdGapAnalysisProps) {
  const navigate = useNavigate();
  const { addMissingKeywordToSkills } = useResumeStore();

  const handleAddKeyword = (kw: string) => {
    if (onAddKeywordToSkills) {
      onAddKeywordToSkills(kw);
    } else {
      addMissingKeywordToSkills(kw);
      toast.success(`Added "${kw}" to candidate skills!`);
    }
  };

  const handleNavigateToPrep = (kw: string) => {
    toast.success(`Opening Preparation Engine module for ${kw}...`);
    navigate(`/prep`);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold font-display text-[#11183D]">
            Job Requirement Gap Analysis
          </h3>
          <p className="text-xs text-[#526078] mt-0.5">
            Clear distinction between resume representation gaps vs genuine skill learning requirements.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <CheckCircle2 size={13} />
            {matchedKeywords.length} Matched
          </span>
          <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <AlertTriangle size={13} />
            {missingKeywords.length} Missing
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Matched Requirements */}
        <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" />
              Verified Matched Requirements ({matchedKeywords.length})
            </h4>
          </div>

          {matchedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {matchedKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs font-mono"
                >
                  ✓ {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No direct tech keywords matched yet.</p>
          )}
        </div>

        {/* Column 2: Missing Keywords & Action Pathways */}
        <div className="p-4 bg-slate-50 border border-[#DCE7F2] rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-[#11183D] uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={15} className="text-amber-600" />
            Unmatched Skills Diagnostics ({missingKeywords.length})
          </h4>

          {missingKeywords.length > 0 ? (
            <div className="space-y-2 pt-1">
              {missingKeywords.map((kw, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-[#DCE7F2] rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <span className="font-bold font-mono text-[#11183D]">{kw}</span>

                  <div className="flex items-center gap-2">
                    {/* Action 1: Add to Resume */}
                    <button
                      onClick={() => handleAddKeyword(kw)}
                      className="px-2.5 py-1 bg-[#EFFAFD] hover:bg-blue-100 text-[#2459A8] border border-[#DCE7F2] rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="If you already know this skill, add it to your resume version"
                    >
                      <Plus size={11} />
                      <span>Add to Resume</span>
                    </button>

                    {/* Action 2: Prepare in Prep Engine */}
                    <button
                      onClick={() => handleNavigateToPrep(kw)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="If you need to learn or practice this topic, launch Preparation Module"
                    >
                      <BookOpen size={11} />
                      <span>Prepare</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-emerald-100/50 text-emerald-900 rounded-xl text-xs font-bold">
              🎉 Outstanding! All target role tech keywords are covered in your resume!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
