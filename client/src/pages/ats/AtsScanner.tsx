import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Sparkles, AlertCircle, CheckCircle2, 
  ArrowRight, Briefcase, Building2, Cpu, ShieldCheck, Zap,
  RotateCcw, Printer, Copy, Check, SlidersHorizontal, Edit3,
  ChevronDown, ChevronUp, Plus, Eye, Download, LayoutTemplate,
  UploadCloud, FileSearch, RefreshCw, X, ArrowLeft, Trash2,
  ExternalLink, GraduationCap, Code2, Award, User, Layers
} from 'lucide-react';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import ResumeRenderer from '../../components/resume/templates/ResumeRenderer';
import ResumeFillDetailsModal from '../../components/resume/ResumeFillDetailsModal';
import TemplateOverviewModal from '../../components/resume/TemplateOverviewModal';
import { useResumeStore, ResumeTemplateId, TEMPLATE_METADATA, TemplateMetadata } from '../../store/useResumeStore';
import { useProfileStore } from '../../store/useProfileStore';
import { calculateAtsScore, resumeToPlainText } from '../../utils/atsEngine';
import { readFileToPlainText, parseRawResumeToData } from '../../utils/resumeParser';

const SAMPLE_PRESETS = [
  {
    title: 'Senior Full Stack Engineer',
    company: 'Stripe',
    jd: `Role: Senior Full Stack Software Engineer - Core Payments Architecture
Location: Remote / San Francisco, CA

Responsibilities:
• Architect, build, and maintain high-throughput backend payment services in Node.js, TypeScript, and Go.
• Build delightful, performant customer checkouts and dashboard UI components in React, TypeScript, and TailwindCSS.
• Design schema migrations and optimize relational database query performance in PostgreSQL and Redis distributed caching.
• Own end-to-end reliability, CI/CD deployment pipelines, and observability across microservices handling millions of events daily.
• Collaborate cross-functionally with product managers and security auditors to maintain PCI-DSS compliance.

Requirements:
• 4+ years of professional full stack engineering experience.
• Mastery of TypeScript/JavaScript, React, Node.js, and SQL (PostgreSQL).
• Hands-on experience with Docker, Redis caching, microservices, and automated testing (Jest/Cypress).`
  },
  {
    title: 'Distributed Systems Lead',
    company: 'Google Cloud',
    jd: `Role: Senior Backend Infrastructure Engineer
Location: Mountain View, CA / Hybrid

Responsibilities:
• Design and scale distributed cloud orchestration platforms handling petabyte-scale streaming workloads.
• Implement gRPC/Protobuf service-to-service communication protocols in Go or Java/Node.js.
• Engineer resilient event-driven architectures with Apache Kafka, Redis cluster, and Kubernetes autoscaling.
• Improve p99 tail latencies and solve distributed deadlock and concurrency bottlenecks.

Qualifications:
• Strong grasp of concurrency, distributed consensus algorithms, and database internals.
• Experience with Kubernetes, Docker, Kafka, Go/TypeScript, and high-concurrency systems.`
  },
  {
    title: 'Staff Frontend Architect',
    company: 'Netflix',
    jd: `Role: Staff Frontend Platform Engineer - Streaming Experiences
Location: Los Gatos, CA / Remote

Responsibilities:
• Architect next-generation television and web client playback surfaces serving 270M+ global streaming subscribers.
• Pioneer high-performance React and TypeScript component architectures optimizing Core Web Vitals and Lighthouse scores.
• Eliminate client runtime frame drops and optimize GraphQL data fetching pipelines.

Qualifications:
• 5+ years building large-scale frontend applications with React, TypeScript, and modern state management.
• Deep understanding of browser rendering pipelines, accessibility, and automated E2E testing (Playwright/Cypress).`
  }
];

export default function AtsScanner() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const extractFileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    masterResume,
    activeTemplate,
    setTemplate,
    isTailoringActive,
    toggleTailoring,
    targetJobTitle,
    targetCompanyName,
    targetJobDescription,
    setTargetJob,
    tailoredResume,
    applyStarRewrite,
    addMissingKeywordToSkills,
    updatePersonalInfo,
    updateSummary,
    addSkillToCategory,
    removeSkillFromCategory,
    removeProject,
    removeExperience,
    extractAndLoadResume,
    syncFromProfile,
    clearResumeData,
    resetToDefaultResume
  } = useResumeStore();

  const { profile } = useProfileStore();

  // Primary Screen View Modes: 'hub' (Two Cards) | 'ats_scanner' | 'resume_builder'
  const [viewMode, setViewMode] = useState<'hub' | 'ats_scanner' | 'resume_builder'>('hub');

  // Modal and Tab states
  const [isFillDetailsOpen, setIsFillDetailsOpen] = useState(false);
  const [overviewTemplate, setOverviewTemplate] = useState<TemplateMetadata | null>(null);
  const [copiedPlaintext, setCopiedPlaintext] = useState(false);
  const [builderTab, setBuilderTab] = useState<'skills' | 'projects' | 'experience' | 'contact'>('skills');

  // New Skill Draft
  const [newSkillInput, setNewSkillInput] = useState('');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<keyof typeof masterResume.skills>('languages');

  // Upload & Scan States
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const scanSteps = [
    'Parsing resume structure & layout integrity...',
    'Extracting technical skill keywords & experience metrics...',
    'Analyzing target job description requirements & ATS score...',
    'Generating high-impact STAR bullet point rewrites...',
    'Synthesizing tailored mock interview questions...'
  ];

  // Active displayed resume data
  const currentResumeData = isTailoringActive && tailoredResume ? tailoredResume : masterResume;

  // Real-time ATS Score calculation
  const atsScoreResult = useMemo(() => {
    return calculateAtsScore(currentResumeData, targetJobDescription, targetJobTitle);
  }, [currentResumeData, targetJobDescription, targetJobTitle]);

  const handlePrintPdf = () => {
    window.print();
  };

  const handleCopyPlainText = () => {
    const text = resumeToPlainText(currentResumeData);
    navigator.clipboard.writeText(text);
    setCopiedPlaintext(true);
    toast.success('Plaintext ATS resume copied to clipboard!');
    setTimeout(() => setCopiedPlaintext(false), 2500);
  };

  const handleLoadPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setTargetJob(preset.title, preset.company, preset.jd);
    toast.success(`Loaded target job: ${preset.title} @ ${preset.company}`);
  };

  // Card 1: Handle File Upload for ATS Check
  const handleAtsFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingFile(true);
    setUploadedFileName(file.name);

    try {
      const text = await readFileToPlainText(file);
      if (!text || text.trim().length < 40) {
        toast.error('Could not extract readable text from this file. You can still paste details manually.');
      } else {
        const parsed = parseRawResumeToData(text);
        extractAndLoadResume(parsed);
        toast.success(`Successfully analyzed ${file.name}!`);
      }
    } catch (err: any) {
      toast.error('Failed to parse file: ' + (err.message || 'Unknown format'));
    } finally {
      setIsParsingFile(false);
    }
  };

  // Card 2: Handle File Upload for Resume Creation / Extraction
  const handleExtractResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingFile(true);
    try {
      const text = await readFileToPlainText(file);
      const parsed = parseRawResumeToData(text);
      extractAndLoadResume(parsed);
      toast.success(`Parsed ${file.name}! All details loaded into Resume Studio.`);
      setViewMode('resume_builder');
    } catch (err: any) {
      toast.error('Failed to parse resume file: ' + (err.message || 'Invalid file'));
    } finally {
      setIsParsingFile(false);
    }
  };

  // Sync profile details
  const handleSyncProfile = () => {
    syncFromProfile(profile);
    toast.success('Loaded student & candidate details from your profile!');
    setViewMode('resume_builder');
  };

  // Deep AI Scan
  const handleDeepAiAnalyze = async () => {
    setIsDeepScanning(true);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 1100);

    try {
      const payload = {
        resumeText: resumeToPlainText(currentResumeData),
        jobDescription: targetJobDescription.trim(),
        jobTitle: targetJobTitle.trim() || 'Software Engineer',
        companyName: targetCompanyName.trim() || 'Target Company',
      };

      const res = await apiClient.post('/ats/analyze', payload);

      clearInterval(stepInterval);
      const result = res.data.data;
      toast.success('ATS Analysis & Tailored Suite generated!');
      navigate(`/ats/report/${result.id}`);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsDeepScanning(false);
      const msg = err.response?.data?.message || err.message || 'ATS analysis failed';
      toast.error(msg);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    addSkillToCategory(selectedSkillCategory, newSkillInput.trim());
    toast.success(`Added "${newSkillInput.trim()}" to ${selectedSkillCategory}`);
    setNewSkillInput('');
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-8 px-4 sm:px-6 lg:px-8 font-body text-[#11183D]">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* VIEW 1: TWO-CARD LANDING HUB                                    */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {viewMode === 'hub' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Hero Banner Header */}
            <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 sm:p-10 shadow-sm text-center max-w-4xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8EAF4] border border-[#A0006D]/30 text-[#A0006D] text-xs font-bold font-display uppercase tracking-wider">
                <Sparkles size={14} /> AI Resume & ATS Mastery Suite
              </div>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-[#11183D] tracking-tight">
                Optimize Your Resume for Elite Applicant Tracking Systems
              </h1>
              <p className="text-xs sm:text-sm text-[#526078] max-w-2xl mx-auto leading-relaxed">
                Whether testing your existing resume against real tech job descriptions or crafting a job-winning resume using our 8 ATS-compliant templates, choose your path below.
              </p>
            </div>

            {/* TWO PRIMARY HERO ACTION CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
              
              {/* ─── CARD 1: UPLOAD RESUME & CHECK ATS SCORE ─── */}
              <div className="bg-white border-2 border-[#DCE7F2] hover:border-[#2459A8] rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="p-3 rounded-2xl bg-blue-50 text-[#2459A8] border border-blue-200 group-hover:bg-[#2459A8] group-hover:text-white transition-colors">
                      <FileSearch size={28} />
                    </span>
                    <Badge variant="royal" size="sm">
                      Instant AI Diagnostic
                    </Badge>
                  </div>

                  <div>
                    <h2 className="text-2xl font-black font-display text-[#11183D]">
                      Upload Resume & Check ATS Score
                    </h2>
                    <p className="text-xs text-[#526078] mt-1.5 leading-relaxed">
                      Upload your current PDF, DOCX, or text resume. Our ATS scanner performs real-time keyword matching, checks STAR impact metrics, flags missing competencies, and calculates an accurate ATS match score.
                    </p>
                  </div>

                  {/* Drag & Drop / File Selector Area */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAtsFileUpload}
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#CBD5E1] hover:border-[#2459A8] rounded-2xl p-5 bg-[#F8FAFC] text-center cursor-pointer transition-all hover:bg-blue-50/50 space-y-2"
                  >
                    <UploadCloud size={32} className="mx-auto text-[#2459A8]" />
                    <div className="text-xs font-bold text-[#11183D]">
                      {uploadedFileName ? (
                        <span className="text-emerald-700 flex items-center justify-center gap-1">
                          <CheckCircle2 size={14} /> {uploadedFileName} loaded
                        </span>
                      ) : (
                        'Click to upload or drag & drop resume file'
                      )}
                    </div>
                    <p className="text-[10px] text-[#64748B]">
                      Supports PDF, DOCX, TXT (Auto-extracts text & formatting)
                    </p>
                  </div>

                  {/* Preset Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#526078] uppercase tracking-wider font-display">
                      Benchmark Against Target Job:
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {SAMPLE_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleLoadPreset(p)}
                          className={`text-left text-xs p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                            targetJobTitle === p.title
                              ? 'bg-blue-50/80 border-[#2459A8] text-[#2459A8] font-bold shadow-xs'
                              : 'bg-white border-[#E2E8F0] text-[#334155] hover:border-slate-300'
                          }`}
                        >
                          <span>{p.title} <span className="text-[10px] text-slate-400 font-normal">({p.company})</span></span>
                          {targetJobTitle === p.title && <Check size={14} className="text-[#2459A8]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E2E8F0]">
                  <Button
                    variant="royal"
                    size="lg"
                    className="w-full shadow-md py-3.5 text-sm"
                    icon={<FileSearch size={18} />}
                    onClick={() => setViewMode('ats_scanner')}
                  >
                    Check ATS Compatibility
                  </Button>
                </div>
              </div>

              {/* ─── CARD 2: CREATE & CUSTOMIZE RESUME ─── */}
              <div className="bg-white border-2 border-[#DCE7F2] hover:border-[#A0006D] rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="p-3 rounded-2xl bg-fuchsia-50 text-[#A0006D] border border-fuchsia-200 group-hover:bg-[#A0006D] group-hover:text-white transition-colors">
                      <LayoutTemplate size={28} />
                    </span>
                    <Badge variant="teal" size="sm">
                      8 ATS Templates
                    </Badge>
                  </div>

                  <div>
                    <h2 className="text-2xl font-black font-display text-[#11183D]">
                      Create & Customize Resume
                    </h2>
                    <p className="text-xs text-[#526078] mt-1.5 leading-relaxed">
                      Choose from 8 proven, recruiter-approved templates. Easily customize your skills, projects, and languages, add or remove sections, and preview your changes in real-time.
                    </p>
                  </div>

                  {/* 3 Interactive Launch Paths */}
                  <div className="space-y-2.5">
                    
                    {/* Path A: Auto-Extract from Existing Resume */}
                    <input
                      type="file"
                      ref={extractFileInputRef}
                      onChange={handleExtractResumeUpload}
                      accept=".pdf,.docx,.txt,.md"
                      className="hidden"
                    />
                    <div
                      onClick={() => extractFileInputRef.current?.click()}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-fuchsia-50/40 hover:border-[#A0006D]/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-white border border-slate-200 text-[#A0006D]">
                          <UploadCloud size={16} />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-[#11183D]">Auto-Extract from Old Resume (PDF)</div>
                          <div className="text-[10px] text-[#64748B]">Pre-fills all sections so you don't start from zero</div>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-400" />
                    </div>

                    {/* Path B: Load from Student / Candidate Profile */}
                    <div
                      onClick={handleSyncProfile}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-fuchsia-50/40 hover:border-[#A0006D]/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-white border border-slate-200 text-[#A0006D]">
                          <GraduationCap size={16} />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-[#11183D]">Load from Student Profile</div>
                          <div className="text-[10px] text-[#64748B]">Instantly imports your university, degree, and skills</div>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-400" />
                    </div>

                    {/* Path C: Choose from 8 Templates */}
                    <div
                      onClick={() => setViewMode('resume_builder')}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-fuchsia-50/40 hover:border-[#A0006D]/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-white border border-slate-200 text-[#A0006D]">
                          <Sparkles size={16} />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-[#11183D]">Explore 8 ATS Templates</div>
                          <div className="text-[10px] text-[#64748B]">FAANG Compact, Harvard Classic, Startup, etc.</div>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-400" />
                    </div>

                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E2E8F0]">
                  <Button
                    variant="royal"
                    size="lg"
                    className="w-full shadow-md py-3.5 text-sm bg-gradient-to-r from-[#A0006D] to-[#2459A8]"
                    icon={<Edit3 size={18} />}
                    onClick={() => setViewMode('resume_builder')}
                  >
                    Open Resume Builder Studio
                  </Button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* VIEW 2: ATS SCANNER & DIAGNOSTIC WORKSPACE                      */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {viewMode === 'ats_scanner' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Bar with Navigation */}
            <div className="bg-white border border-[#DCE7F2] rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('hub')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Back to Hub"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#2459A8] uppercase tracking-wider font-mono">
                    <FileSearch size={12} /> ATS Diagnostic Suite
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#11183D] font-display">
                    Applicant Tracking System Compatibility Audit
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setViewMode('resume_builder')}
                  icon={<Edit3 size={15} />}
                >
                  Edit in Resume Studio
                </Button>
                <Button
                  variant="royal"
                  size="md"
                  onClick={handleDeepAiAnalyze}
                  icon={<Sparkles size={15} />}
                  isLoading={isDeepScanning}
                >
                  {isDeepScanning ? scanSteps[scanStep] : 'Run Deep AI ATS Diagnostic'}
                </Button>
              </div>
            </div>

            {/* Main Score & Metrics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Score Gauge Card */}
              <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#526078] font-mono">
                      Overall ATS Match
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {atsScoreResult.totalScore >= 80 ? 'Optimal ATS Parse' : 'Needs Optimization'}
                    </span>
                  </div>

                  <div className="text-center py-4">
                    <div className="text-5xl sm:text-6xl font-black font-display text-[#11183D]">
                      {atsScoreResult.totalScore}
                      <span className="text-2xl text-[#94A3B8] font-light">/100</span>
                    </div>
                    <p className="text-xs text-[#526078] mt-2 max-w-xs mx-auto">
                      Benchmarked against <strong>{targetJobTitle || 'Target Role'}</strong> requirements and formatting filters.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#DCE7F2]">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#526078]">Keyword Match:</span>
                    <span className="font-bold text-[#11183D]">{atsScoreResult.breakdown.keywordScore} / 40</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#2459A8] rounded-full" style={{ width: `${(atsScoreResult.breakdown.keywordScore / 40) * 100}%` }} />
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-[#526078]">STAR Metrics Density:</span>
                    <span className="font-bold text-[#11183D]">{atsScoreResult.breakdown.metricsScore} / 25</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(atsScoreResult.breakdown.metricsScore / 25) * 100}%` }} />
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-[#526078]">Action Verb Power:</span>
                    <span className="font-bold text-[#11183D]">{atsScoreResult.breakdown.actionVerbScore} / 15</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(atsScoreResult.breakdown.actionVerbScore / 15) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Skills & Keyword Match Breakdown */}
              <div className="lg:col-span-2 bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm space-y-5">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#11183D] font-mono mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" /> Matched Job Keywords ({atsScoreResult.matchedKeywords.length})
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {atsScoreResult.matchedKeywords.length > 0 ? (
                      atsScoreResult.matchedKeywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ✓ {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No keywords matched yet.</span>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#DCE7F2] pt-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#11183D] font-mono mb-2 flex items-center gap-1.5 text-amber-700">
                    <AlertCircle size={16} className="text-amber-600" /> Missing High-Value Skills ({atsScoreResult.missingKeywords.length})
                  </h2>
                  <p className="text-xs text-[#526078] mb-2.5">
                    Click any keyword below to instantly inject it into your resume's technical skills matrix:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {atsScoreResult.missingKeywords.map((kw, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          addMissingKeywordToSkills(kw);
                          toast.success(`Injected "${kw}" into your resume skills!`);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors flex items-center gap-1"
                      >
                        <Plus size={12} /> {kw}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Job Quick Inputs */}
                <div className="border-t border-[#DCE7F2] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">Target Role</label>
                    <input
                      type="text"
                      value={targetJobTitle}
                      onChange={(e) => setTargetJob(e.target.value, targetCompanyName, targetJobDescription)}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#2459A8]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">Target Company</label>
                    <input
                      type="text"
                      value={targetCompanyName}
                      onChange={(e) => setTargetJob(targetJobTitle, e.target.value, targetJobDescription)}
                      placeholder="e.g. Stripe, Google, Meta"
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#2459A8]"
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* STAR Bullet Point Rewrites Section */}
            {atsScoreResult.bulletsAudit.length > 0 && (
              <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-display text-[#11183D]">
                      STAR Methodology Bullet Point Improvements
                    </h3>
                    <p className="text-xs text-[#526078]">
                      AI audits highlighting weak bullet points and suggesting high-impact, quantified STAR alternatives.
                    </p>
                  </div>
                  <Badge variant="success" size="sm">
                    {atsScoreResult.bulletsAudit.length} Suggestions
                  </Badge>
                </div>

                <div className="space-y-3">
                  {atsScoreResult.bulletsAudit.map((audit) => (
                    <div key={audit.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="text-xs text-rose-700 bg-rose-50/80 p-2.5 rounded-xl border border-rose-100 flex items-start gap-2">
                        <span className="font-bold shrink-0">Current:</span>
                        <span>"{audit.original}"</span>
                      </div>
                      <div className="text-xs text-emerald-900 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold">Suggested STAR Rewrite: </span>
                          <span>"{audit.suggestedRewrite}"</span>
                          <div className="text-[10.5px] text-emerald-700 mt-1 italic">
                            Why: {audit.improvementReason}
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            applyStarRewrite(audit.id, audit.suggestedRewrite);
                            toast.success('Applied STAR rewrite to your resume!');
                          }}
                          className="shrink-0 bg-white"
                        >
                          Apply Rewrite
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* VIEW 3: FULL RESUME BUILDER & TEMPLATE STUDIO                   */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {viewMode === 'resume_builder' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Studio Navigation Bar */}
            <div className="bg-white border border-[#DCE7F2] rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('hub')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Back to Hub"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#A0006D] uppercase tracking-wider font-mono">
                    <Sparkles size={12} /> Resume Builder & Template Studio
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#11183D] font-display">
                    Interactive Resume Editor & WYSIWYG Studio
                  </h1>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setViewMode('ats_scanner')}
                  icon={<FileSearch size={15} />}
                >
                  Check ATS Score ({atsScoreResult.totalScore}%)
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handlePrintPdf}
                  icon={<Printer size={15} />}
                  className="bg-white"
                >
                  Print / PDF
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleCopyPlainText}
                  icon={copiedPlaintext ? <Check size={15} className="text-[#168A62]" /> : <Copy size={15} />}
                  className="bg-white"
                >
                  {copiedPlaintext ? 'Copied ATS Text' : 'Copy Plaintext'}
                </Button>
                <Button
                  variant="royal"
                  size="md"
                  onClick={() => setIsFillDetailsOpen(true)}
                  icon={<Edit3 size={15} />}
                >
                  Full Form Modal
                </Button>
              </div>
            </div>

            {/* Top 8 Templates Horizontal Carousel / Switcher */}
            <div className="bg-white border border-[#DCE7F2] rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutTemplate size={16} className="text-[#2459A8]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                    Select Visual Template ({TEMPLATE_METADATA.length} Available):
                  </span>
                </div>
                <span className="text-[11px] text-[#64748B]">
                  Click "Overview" to preview template details & layout
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {TEMPLATE_METADATA.map((tmpl) => {
                  const isActive = activeTemplate === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      className={`relative rounded-2xl p-2.5 border text-center transition-all flex flex-col justify-between ${
                        isActive
                          ? 'border-[#2459A8] bg-blue-50/60 shadow-sm ring-2 ring-[#2459A8]/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[9px] font-bold uppercase text-slate-500 font-mono truncate">
                            {tmpl.badge}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOverviewTemplate(tmpl);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                            title="Template Overview"
                          >
                            <Eye size={12} />
                          </button>
                        </div>
                        <div className="font-bold text-xs text-slate-900 truncate">
                          {tmpl.name}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setTemplate(tmpl.id)}
                        className={`mt-2 py-1 px-2 rounded-lg text-[10.5px] font-semibold transition-all ${
                          isActive
                            ? 'bg-[#2459A8] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isActive ? 'Active' : 'Apply'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Split Screen Studio Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* ─── LEFT PANEL: Interactive In-Place Editor ─── */}
              <div className="lg:col-span-5 bg-white border border-[#DCE7F2] rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
                
                {/* Editor Tabs */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {(['skills', 'projects', 'experience', 'contact'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setBuilderTab(tab)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors font-display ${
                          builderTab === tab
                            ? 'bg-[#2459A8] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {tab === 'skills' ? 'Skills & Tech' : tab}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFillDetailsOpen(true)}
                    className="text-[11px] font-semibold text-[#2459A8] hover:underline flex items-center gap-1 shrink-0"
                  >
                    All Sections <ExternalLink size={11} />
                  </button>
                </div>

                {/* TAB 1: SKILLS & LANGUAGES */}
                {builderTab === 'skills' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                        Manage Skills & Languages
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Click '×' to remove any skill
                      </span>
                    </div>

                    {/* Category Selector */}
                    <div className="flex flex-wrap gap-1">
                      {(['languages', 'frameworks', 'databases', 'cloudDevOps', 'tools'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedSkillCategory(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                            selectedSkillCategory === cat
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat} ({masterResume.skills[cat]?.length || 0})
                        </button>
                      ))}
                    </div>

                    {/* Skill Tags List */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 min-h-[120px]">
                      <div className="flex flex-wrap gap-1.5">
                        {masterResume.skills[selectedSkillCategory]?.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-800 border border-slate-200 shadow-xs"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkillFromCategory(selectedSkillCategory, skill)}
                              className="text-slate-400 hover:text-rose-600 transition-colors"
                              title="Remove skill"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Add Custom Skill Form */}
                    <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        placeholder={`Add new ${selectedSkillCategory}...`}
                        className="flex-1 px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-[#2459A8]"
                      />
                      <Button variant="royal" size="sm" type="submit" icon={<Plus size={14} />}>
                        Add
                      </Button>
                    </form>
                  </div>
                )}

                {/* TAB 2: PROJECTS */}
                {builderTab === 'projects' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                        Projects ({masterResume.projects.length})
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsFillDetailsOpen(true)}
                        icon={<Plus size={13} />}
                      >
                        Add Project
                      </Button>
                    </div>

                    <div className="space-y-2.5">
                      {masterResume.projects.map((proj) => (
                        <div key={proj.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">{proj.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                removeProject(proj.id);
                                toast.success(`Removed project ${proj.name}`);
                              }}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Delete project"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-1">{proj.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {proj.techStack?.map((t) => (
                              <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: EXPERIENCE */}
                {builderTab === 'experience' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                        Work Roles ({masterResume.experience.length})
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsFillDetailsOpen(true)}
                        icon={<Plus size={13} />}
                      >
                        Add Role
                      </Button>
                    </div>

                    <div className="space-y-2.5">
                      {masterResume.experience.map((exp) => (
                        <div key={exp.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-xs text-slate-900">{exp.title}</span>
                              <span className="text-slate-400 text-xs ml-1.5">@ {exp.company}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                removeExperience(exp.id);
                                toast.success(`Removed role ${exp.title}`);
                              }}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Delete experience"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate} ({exp.location})
                          </div>
                          <div className="text-[11px] text-slate-600">
                            {exp.bullets.length} STAR bullet points
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: CONTACT & SUMMARY */}
                {builderTab === 'contact' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">Full Name</label>
                      <input
                        type="text"
                        value={masterResume.personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2459A8]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">Professional Title</label>
                      <input
                        type="text"
                        value={masterResume.personalInfo.title}
                        onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2459A8]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">Email</label>
                        <input
                          type="email"
                          value={masterResume.personalInfo.email}
                          onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2459A8]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">Phone</label>
                        <input
                          type="text"
                          value={masterResume.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2459A8]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">Summary</label>
                      <textarea
                        rows={3}
                        value={masterResume.summary}
                        onChange={(e) => updateSummary(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2459A8] leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* Reset / Sample Quick Actions */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      resetToDefaultResume();
                      toast.success('Loaded clean professional sample profile');
                    }}
                    className="text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    Reset to Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearResumeData();
                      toast.success('Cleared resume fields');
                    }}
                    className="text-rose-600 hover:underline"
                  >
                    Clear All Data
                  </button>
                </div>

              </div>

              {/* ─── RIGHT PANEL: Live WYSIWYG Template Preview ─── */}
              <div className="lg:col-span-7 bg-white border border-[#DCE7F2] rounded-3xl p-4 sm:p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">
                      Live Preview ({activeTemplate}):
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ATS Score: {atsScoreResult.totalScore}/100
                    </span>
                  </div>
                  <Button
                    variant="royal"
                    size="sm"
                    onClick={handlePrintPdf}
                    icon={<Printer size={13} />}
                  >
                    Export / PDF
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-100/50 p-2 sm:p-4">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden min-w-[320px]">
                    <ResumeRenderer
                      templateId={activeTemplate}
                      data={currentResumeData}
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ─── MODAL: Full Detailed Input Wizard ─── */}
      <ResumeFillDetailsModal
        isOpen={isFillDetailsOpen}
        onClose={() => setIsFillDetailsOpen(false)}
      />

      {/* ─── MODAL: Template Overview & Specification Preview ─── */}
      <TemplateOverviewModal
        template={overviewTemplate}
        isOpen={Boolean(overviewTemplate)}
        onClose={() => setOverviewTemplate(null)}
        onSelect={(id) => {
          setTemplate(id);
          toast.success(`Activated template: ${id}`);
        }}
        isSelected={activeTemplate === overviewTemplate?.id}
      />

    </div>
  );
}
