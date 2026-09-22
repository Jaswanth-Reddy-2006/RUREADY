import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../../store/useResumeStore';
import { calculateAtsScore, extractKeywordsFromJd, AtsScoreResult } from '../../utils/atsEngine';
import AtsMatchCard from '../../components/resume/AtsMatchCard';
import JdGapAnalysis from '../../components/resume/JdGapAnalysis';
import ResumeCopilotDrawer from '../../components/resume/ResumeCopilotDrawer';
import { Sparkles, FileText, Building2, Briefcase, RefreshCw, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AtsAnalyzerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resumeVersions, masterResume, saveAtsAnalysis, addActivityLog } = useResumeStore();

  const queryVersionId = searchParams.get('versionId');
  const queryCompany = searchParams.get('company') || '';
  const queryRole = searchParams.get('role') || '';
  const queryJd = searchParams.get('jd') || '';

  const [selectedVersionId, setSelectedVersionId] = useState<string>(queryVersionId || resumeVersions[0]?.id || 'master');
  const [targetCompany, setTargetCompany] = useState(queryCompany);
  const [targetRole, setTargetRole] = useState(queryRole);
  const [targetJd, setTargetJd] = useState(queryJd || `Required Skills: TypeScript, React, Node.js, PostgreSQL, Distributed Systems, Docker, Redis, P99 Latency optimization, CI/CD, AWS.`);

  const [analysisResult, setAnalysisResult] = useState<AtsScoreResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Selected resume data
  const targetVersion = resumeVersions.find((v) => v.id === selectedVersionId);
  const currentResumeData = targetVersion ? targetVersion.resumeData : masterResume;

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const extractedKeywords = extractKeywordsFromJd(targetJd);
      const result = calculateAtsScore(currentResumeData, targetJd, targetRole);
      setAnalysisResult(result);
      setIsAnalyzing(false);

      if (targetVersion) {
        saveAtsAnalysis(targetVersion.id, result);
      }

      addActivityLog(
        'ATS_SCAN',
        `ATS Match Scan: ${result.totalScore}%`,
        `Evaluated for ${targetCompany || 'Target Role'} (${result.grade})`
      );

      toast.success(`ATS Match calculation complete: ${result.totalScore}% (${result.grade})`);
    }, 400);
  };

  useEffect(() => {
    handleRunAnalysis();
  }, [selectedVersionId]);

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE7F2]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/resume')}
            className="p-2 text-[#7B8799] hover:text-[#11183D] rounded-xl hover:bg-white transition-colors cursor-pointer border border-[#DCE7F2]"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#EFFAFD] text-[#2459A8] rounded-lg border border-[#DCE7F2]">
                <Sparkles size={16} />
              </span>
              <h2 className="text-2xl font-bold font-display text-[#11183D]">
                Explainable ATS Match Scanner
              </h2>
            </div>
            <p className="text-xs text-[#526078] mt-1">
              Zero-fake-score ATS analysis with real keyword extraction & gap diagnostics
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCopilotOpen(true)}
          className="px-4 py-2.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Sparkles size={15} />
          <span>Launch AI Copilot</span>
        </button>
      </div>

      {/* Input Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Column 1: Select Resume Version */}
        <div className="p-5 bg-white rounded-3xl border border-[#DCE7F2] space-y-4 shadow-2xs">
          <label className="block text-xs font-bold text-[#11183D] uppercase tracking-wider">
            1. Select Resume Version
          </label>
          <select
            value={selectedVersionId}
            onChange={(e) => setSelectedVersionId(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-[#DCE7F2] rounded-2xl text-xs font-bold text-[#11183D] focus:outline-none focus:border-[#2459A8]"
          >
            <option value="master">Master Profile Resume</option>
            {resumeVersions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.targetCompany || 'General'})
              </option>
            ))}
          </select>

          <div className="p-3.5 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl text-xs space-y-1">
            <span className="font-bold text-[#2459A8]">Selected Resume:</span>
            <p className="text-[#11183D] font-medium">{currentResumeData.personalInfo.fullName}</p>
            <p className="text-[11px] text-[#526078] truncate">{currentResumeData.personalInfo.title}</p>
          </div>
        </div>

        {/* Input Column 2: Target Role & Company */}
        <div className="p-5 bg-white rounded-3xl border border-[#DCE7F2] space-y-4 shadow-2xs">
          <label className="block text-xs font-bold text-[#11183D] uppercase tracking-wider">
            2. Target Role & Company
          </label>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Target Company (e.g. Amazon, Google)"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs font-medium text-[#11183D]"
            />
            <input
              type="text"
              placeholder="Target Role (e.g. Senior Backend Engineer)"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs font-medium text-[#11183D]"
            />
          </div>
        </div>

        {/* Input Column 3: Job Description Text */}
        <div className="p-5 bg-white rounded-3xl border border-[#DCE7F2] space-y-3 shadow-2xs flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-[#11183D] uppercase tracking-wider mb-2">
              3. Target Job Description (JD)
            </label>
            <textarea
              rows={3}
              value={targetJd}
              onChange={(e) => setTargetJd(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs text-[#11183D] focus:outline-none focus:border-[#2459A8]"
              placeholder="Paste job description requirements..."
            />
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full py-2.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
            <span>{isAnalyzing ? 'Evaluating Keywords...' : 'Re-Run ATS Match Scan'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-8">
          {/* 1. Score & Factor Breakdown Card */}
          <AtsMatchCard
            analysis={analysisResult}
            versionTitle={targetVersion ? targetVersion.name : 'Master Resume'}
            targetRole={targetRole || targetVersion?.targetRole}
            targetCompany={targetCompany || targetVersion?.targetCompany}
          />

          {/* 2. Gap Analysis (Add to Resume vs Prepare in Prep Engine) */}
          <JdGapAnalysis
            matchedKeywords={analysisResult.matchedKeywords}
            missingKeywords={analysisResult.missingKeywords}
            targetRole={targetRole}
          />
        </div>
      )}

      {/* Copilot Drawer */}
      <ResumeCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        bulletsAudit={analysisResult?.bulletsAudit || []}
      />
    </div>
  );
}
