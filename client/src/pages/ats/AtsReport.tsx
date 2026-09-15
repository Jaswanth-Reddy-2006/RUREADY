import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Copy, 
  Check, FileText, Briefcase, Video, Code2, RefreshCw, ChevronRight, Zap,
  Printer, Download, ShieldCheck, Target, ExternalLink
} from 'lucide-react';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

interface AtsReportData {
  id: string;
  jobTitle: string;
  companyName?: string;
  matchScore: number;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  experienceMatch: string;
  atsWarnings: string[];
  bulletRewrites: Array<{
    original: string;
    rewritten: string;
    impactReason: string;
  }>;
  tailoredQuestions: Array<{
    questionText: string;
    questionType: string;
    focusArea: string;
    difficulty: string;
  }>;
}

export default function AtsReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<AtsReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await apiClient.get(`/ats/${id}`);
        setReport(res.data.data);
      } catch (err) {
        console.error('Failed to load ATS Report:', err);
        toast.error('Failed to retrieve ATS Analysis Report');
      } finally {
        setIsLoading(false);
      }
    }
    fetchReport();
  }, [id]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('STAR Bullet copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLaunchSession = async (mode: 'ORAL' | 'CODING') => {
    if (isLaunching || !id) return;
    setIsLaunching(true);
    try {
      const res = await apiClient.post(`/ats/${id}/launch`, { mode });
      const session = res.data.data;
      toast.success(`Tailored ${mode} Mock Interview session launched!`);
      if (mode === 'CODING') {
        navigate(`/interview/coding/${session.id}`);
      } else {
        navigate(`/interview/${session.id}`);
      }
    } catch (err: any) {
      setIsLaunching(false);
      const msg = err.response?.data?.message || 'Failed to launch tailored interview session';
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EFFAFD] flex items-center justify-center font-body text-[#11183D]">
        <div className="text-center space-y-3">
          <RefreshCw size={32} className="animate-spin text-[#4A8BDF] mx-auto" />
          <p className="text-xs font-bold font-display text-[#526078]">Loading ATS Scorecard Report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#EFFAFD] flex items-center justify-center p-4 font-body">
        <Card className="p-8 text-center space-y-4 max-w-md bg-white border-[#DCE7F2]">
          <AlertTriangle size={36} className="text-[#A0006D] mx-auto" />
          <h2 className="text-lg font-bold font-display text-[#11183D]">Report Not Found</h2>
          <p className="text-xs text-[#526078]">The requested ATS analysis report could not be located.</p>
          <Button variant="royal" onClick={() => navigate('/ats')}>
            Return to ATS Scanner
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-10 px-4 sm:px-6 lg:px-8 font-body text-[#11183D]">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <Card className="p-6 sm:p-8 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Title & Role */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFFAFD] border border-[#4A8BDF]/30 text-[#4A8BDF] text-xs font-bold font-display">
                  <Briefcase size={13} /> {report.companyName || 'Target Company'}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F0] border border-[#168A62]/30 text-[#168A62] text-xs font-bold font-display">
                  <ShieldCheck size={13} /> ATS Audit Verified
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
                {report.jobTitle}
              </h1>
              <p className="text-xs text-[#526078] leading-relaxed max-w-xl">
                {report.summary}
              </p>
            </div>

            {/* Score Radial Badge & Print Action */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex shrink-0 items-center gap-4 bg-[#EFFAFD] p-5 rounded-2xl border border-[#DCE7F2]">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#DCE7F2]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#A0006D]"
                      strokeDasharray={`${report.matchScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-extrabold font-display text-[#11183D]">
                      {report.matchScore}%
                    </span>
                    <span className="text-[9px] font-bold text-[#A0006D] uppercase">ATS Score</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#11183D] block font-display">
                    {report.matchScore >= 80 ? 'Exceptional Alignment' : report.matchScore >= 65 ? 'Moderate Match' : 'Targeted Gaps Identified'}
                  </span>
                  <span className="text-[11px] text-[#526078] block">
                    {report.experienceMatch}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => navigate('/ats')}
                  className="px-3.5 py-2 rounded-xl bg-[#2459A8] hover:bg-[#11183D] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <FileText size={14} /> Open Resume Builder
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl bg-[#EFFAFD] hover:bg-white text-[#526078] hover:text-[#11183D] border border-[#DCE7F2] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  title="Print or Save PDF"
                >
                  <Printer size={14} /> Print / Export PDF
                </button>
              </div>
            </div>

          </div>

          {/* Quick Action Launch Buttons */}
          <div className="pt-4 border-t border-[#DCE7F2] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-bold text-[#526078] font-display">
              Ready to practice? Launch a mock interview tailored to this exact job posting:
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="royal"
                size="sm"
                onClick={() => handleLaunchSession('ORAL')}
                disabled={isLaunching}
                icon={<Video size={14} />}
              >
                Oral Ava Interview
              </Button>
              <Button
                variant="eggplant"
                size="sm"
                onClick={() => handleLaunchSession('CODING')}
                disabled={isLaunching}
                icon={<Code2 size={14} />}
              >
                Coding Monaco Interview
              </Button>
            </div>
          </div>
        </Card>

        {/* 2-Column Grid: Skills & ATS Warnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Matched & Missing Skills */}
          <Card className="p-6 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-4">
            <h3 className="text-sm font-bold font-display text-[#11183D] flex items-center gap-2">
              <Zap size={16} className="text-[#4A8BDF]" />
              <span>Skill Keyword Alignment Matrix</span>
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#168A62] flex items-center gap-1.5 mb-2 font-display">
                  <CheckCircle2 size={13} />
                  <span>Matched Keywords ({report.matchedSkills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {report.matchedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#DCE7F2]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A0006D] flex items-center gap-1.5 mb-2 font-display">
                  <AlertTriangle size={13} />
                  <span>Missing Critical Skills ({report.missingSkills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {report.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F8EAF4] text-[#A0006D] border border-[#A0006D]/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* ATS Parser Warnings */}
          <Card className="p-6 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-4">
            <h3 className="text-sm font-bold font-display text-[#11183D] flex items-center gap-2">
              <AlertTriangle size={16} className="text-[#A0006D]" />
              <span>ATS Formatting & Parser Recommendations</span>
            </h3>

            <div className="space-y-2.5">
              {report.atsWarnings.map((warning, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#F8EAF4]/50 border border-[#A0006D]/20 flex items-start gap-2.5 text-xs text-[#11183D]"
                >
                  <AlertTriangle size={14} className="text-[#A0006D] shrink-0 mt-0.5" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* STAR Bullet Point Rewriter Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-display text-[#11183D]">
                STAR Bullet Point Enhancements
              </h2>
              <p className="text-xs text-[#526078]">
                AI-optimized resume bullets injected with STAR methodology and quantified metrics.
              </p>
            </div>
            <Badge variant="eggplant" size="sm">
              <Sparkles size={12} className="mr-1 inline" /> AI Generated
            </Badge>
          </div>

          <div className="space-y-4">
            {report.bulletRewrites.map((rewrite, idx) => (
              <Card key={idx} className="p-5 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original Bullet */}
                  <div className="p-3.5 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-1">
                    <span className="text-[10px] font-bold text-[#526078] uppercase font-display">
                      Original Resume Bullet
                    </span>
                    <p className="text-xs text-[#11183D] leading-relaxed font-body">
                      "{rewrite.original}"
                    </p>
                  </div>

                  {/* STAR Rewritten Bullet */}
                  <div className="p-3.5 rounded-2xl bg-[#F8EAF4] border border-[#A0006D]/30 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#A0006D] uppercase font-display flex items-center gap-1">
                        <Sparkles size={10} /> STAR Tailored Rewrite
                      </span>
                      <button
                        onClick={() => handleCopy(rewrite.rewritten, idx)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#F8EAF4] text-[#A0006D] rounded-lg text-[10px] font-bold border border-[#A0006D]/30 transition-all cursor-pointer shadow-2xs"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check size={11} className="text-[#168A62]" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={11} /> Copy Bullet
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-[#11183D] leading-relaxed font-body">
                      "{rewrite.rewritten}"
                    </p>
                    <p className="text-[10px] text-[#A0006D] italic">
                      Reason: {rewrite.impactReason}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tailored Questions Preview */}
        <Card className="p-6 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-display text-[#11183D] flex items-center gap-2">
              <FileText size={16} className="text-[#4A8BDF]" />
              <span>Job-Specific Interview Questions Synthesized</span>
            </h3>
            <span className="text-xs text-[#526078] font-mono font-bold">
              {report.tailoredQuestions.length} Questions
            </span>
          </div>

          <div className="space-y-3">
            {report.tailoredQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#4A8BDF] text-white uppercase font-display">
                      Q0{idx + 1} • {q.questionType}
                    </span>
                    <span className="text-[10px] font-bold text-[#526078]">
                      Focus: {q.focusArea}
                    </span>
                  </div>
                  <p className="text-xs text-[#11183D] font-bold font-display leading-relaxed">
                    {q.questionText}
                  </p>
                </div>
                <Badge variant="navy" size="xs">
                  {q.difficulty}
                </Badge>
              </div>
            ))}
          </div>

          {/* Launch CTA Footer */}
          <div className="pt-4 border-t border-[#DCE7F2] flex justify-center">
            <Button
              variant="eggplant"
              size="lg"
              onClick={() => handleLaunchSession('ORAL')}
              disabled={isLaunching}
              icon={<Sparkles size={16} />}
              iconRight={<ArrowRight size={16} />}
              className="px-8 shadow-md"
            >
              Launch Tailored AI Mock Interview Now
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}

