import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Check,
  AlertTriangle,
  X,
  Shield,
  Code2,
  MessageCircle,
  ChevronDown,
  ArrowLeft,
  Sparkles,
  Activity,
  CheckCircle2,
  ShieldAlert,
  Info,
  Calendar,
  Clock,
  Eye,
  AppWindow,
  MessageSquare,
  ChevronUp,
  User,
  Terminal
} from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import { useInterviewStore } from '../store/useInterviewStore';
import type { Analysis } from '../types';

// Verdict Badge Configurations
const verdictConfig: Record<string, {
  label: string;
  Icon: typeof Trophy;
  badgeClass: string;
  glowClass: string;
}> = {
  STRONG: {
    label: 'STRONG VERDICT: READY',
    Icon: Trophy,
    badgeClass: 'border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    glowClass: 'from-emerald-500/10 to-teal-500/5',
  },
  READY: {
    label: 'VERDICT: INTERVIEW READY',
    Icon: Check,
    badgeClass: 'border border-teal-500/40 text-teal-400 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.15)]',
    glowClass: 'from-teal-500/10 to-cyan-500/5',
  },
  ALMOST_READY: {
    label: 'VERDICT: ALMOST READY',
    Icon: AlertTriangle,
    badgeClass: 'border border-amber-500/40 text-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    glowClass: 'from-amber-500/10 to-orange-500/5',
  },
  NOT_READY: {
    label: 'VERDICT: PRACTICE REQUIRED',
    Icon: X,
    badgeClass: 'border border-rose-500/40 text-rose-400 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
    glowClass: 'from-rose-500/10 to-red-500/5',
  },
};

function getRubricRequirements(rubricKey: string) {
  if (rubricKey === 'GOOGLE_L4') {
    return [
      { name: 'Technical Depth', target: 82, field: 'technicalScore', isMax: false },
      { name: 'Algorithmic Efficiency', target: 85, field: 'algorithmicEfficiencyScore', isMax: false },
      { name: 'Max Consumed Hints', target: 0, field: 'hintCount', isMax: true },
    ];
  } else if (rubricKey === 'META_SDE2') {
    return [
      { name: 'Technical Depth', target: 78, field: 'technicalScore', isMax: false },
      { name: 'Algorithmic Efficiency', target: 80, field: 'algorithmicEfficiencyScore', isMax: false },
      { name: 'Platform Integrity', target: 95, field: 'platformIntegrityScore', isMax: false },
      { name: 'Max Consumed Hints', target: 1, field: 'hintCount', isMax: true },
    ];
  } else {
    return [
      { name: 'Communication Structure', target: 75, field: 'structureScore', isMax: false },
      { name: 'Technical Depth', target: 65, field: 'technicalScore', isMax: false },
    ];
  }
}

export default function AnalysisDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const resetForm = useInterviewStore((state) => state.resetForm);
  const [expandedTipIdx, setExpandedTipIdx] = useState<number | null>(null);
  const [openCritiqueIds, setOpenCritiqueIds] = useState<Record<string, boolean>>({});

  // Fetch Session data via React Query
  const { data: session, isLoading, isError, refetch } = useAnalysis(id);

  const toggleCritique = (questionId: string) => {
    setOpenCritiqueIds(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-6 sm:p-8 space-y-6 animate-pulse select-none">
        <div className="h-8 w-44 bg-slate-900 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-4 h-[350px] bg-slate-900 rounded-3xl" />
          <div className="lg:col-span-6 h-[350px] bg-slate-900 rounded-3xl" />
        </div>
        <div className="h-[250px] bg-slate-900 rounded-3xl" />
      </div>
    );
  }

  if (isError || !session || !session.analysis) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <AlertTriangle size={48} className="text-brand-orange mx-auto animate-bounce" />
          <h2 className="text-xl font-bold font-display uppercase tracking-widest text-white">Analysis Compiling...</h2>
          <p className="text-xs text-slate-400 font-mono leading-relaxed uppercase">
            The telemetry synthesis layers are compiling or sync was broken. Please wait a moment and try refreshing.
          </p>
          <button
            onClick={() => refetch()}
            className="w-full py-3.5 bg-gradient-to-r from-brand-amber to-brand-orange text-white font-bold rounded-xl uppercase tracking-wider text-xs border border-transparent hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer font-display"
          >
            Re-synchronize Data
          </button>
        </div>
      </div>
    );
  }

  const analysis: Analysis = session.analysis as unknown as Analysis;
  const overallScore = analysis.overallScore ?? 0;
  const verdict = analysis.readinessVerdict ?? 'READY';
  const verdictInfo = verdictConfig[verdict] || verdictConfig.READY;

  // Calculate dynamic proctoring statistics from confidenceScore & eyeContactScore
  const calculatedTabBlurs = Math.max(0, Math.floor((100 - (analysis.confidenceScore ?? 100)) / 10));
  const calculatedEyeDrops = Math.max(0, Math.floor((80 - (analysis.eyeContactScore ?? 80)) / 5));
  const proctoringFlagStatus = (analysis.confidenceScore ?? 100) < 60 ? 'SUSPICIOUS_ACTIVITY' : 'PASSED';

  // Calculate filler words count from answers text
  const allAnswersText = session.questions?.map(q => q.answerText || '').join(' ').toLowerCase() || '';
  const countWord = (word: string) => (allAnswersText.match(new RegExp('\\b' + word + '\\b', 'g')) || []).length;
  const likeCount = countWord('like');
  const umCount = countWord('um') + countWord('umm');
  const uhCount = countWord('uh') + countWord('uhh') + countWord('err');
  const totalFillerWords = likeCount + umCount + uhCount;

  // Words per minute stats
  const avgWpm = analysis.confidenceSignals?.avgWpm ?? 130;
  let speechRateCategory: 'Optimal' | 'Anxious/Erratic' | 'Stalled/Vague' = 'Optimal';
  if (avgWpm > 160) {
    speechRateCategory = 'Anxious/Erratic';
  } else if (avgWpm < 110) {
    speechRateCategory = 'Stalled/Vague';
  }

  // Get technical intent note based on questionType
  const getIntentNote = (type: string) => {
    switch (type) {
      case 'TECHNICAL': return 'TECHNICAL ARCHITECTURE VALIDATION // CODE DEPTH';
      case 'BEHAVIOURAL': return 'STAR BLUEPRINT ASSESSMENT // LEADERSHIP ALIGNMENT';
      case 'SITUATIONAL': return 'RUNTIME INCIDENT MITIGATION // SYSTEM RECOVERY';
      case 'RESUME_BASED': return 'RESUME INTEGRITY CHECK // EXPERIENCE VALIDATION';
      default: return 'SOCRATIC DEPTH CHALLENGE';
    }
  };

  const readinessTips: Array<{ tip: string; reason: string }> = Array.isArray(analysis.actionableTips)
    ? analysis.actionableTips
    : [
        {
          tip: 'Enforce Systematic Justifications',
          reason: 'Always defend technology decisions using concrete trade-offs (e.g. read latency vs. write consistency) rather than passive generalizations.',
        },
        {
          tip: 'Maintain High Screen & Focus Presence',
          reason: 'Deductions are heavily weighted on focus blurs. Retain locked viewport limits to guarantee high security verification scores.',
        },
        {
          tip: 'Calibrate Speech Delivery Bounds',
          reason: 'Consistent, deliberate pace (110-160 WPM) improves listener engagement and semantic comprehension during system design rounds.',
        },
      ];

  const exitRoomHandler = () => {
    resetForm();
    navigate('/history');
  };

  const isCodingMode = (session as any).mode === 'CODING' || (session as any).interviewType === 'CODING';

  if (isCodingMode) {
    const technicalScore = analysis.technicalScore ?? 0;
    const hintCount = (session as any).hintCount ?? (analysis.confidenceSignals as any)?.hintCount ?? 0;
    const tabBlurs = (session as any).telemetryLogs?.filter((l: any) => l.type === 'TAB_BLUR').length ?? (analysis.confidenceSignals as any)?.tabBlurCount ?? 0;
    const eyeContact = analysis.eyeContactScore ?? 80;
    
    // Extract sub-scores for coding mode from confidenceSignals
    const signals = (analysis.confidenceSignals as any) || {};
    const codeCorrectnessScore = signals.codeCorrectnessScore ?? technicalScore;
    const algorithmicEfficiencyScore = signals.algorithmicEfficiencyScore ?? 70;
    const cadenceScore = signals.cadenceScore ?? analysis.communicationScore ?? 85;
    const platformIntegrityScore = signals.platformIntegrityScore ?? analysis.confidenceScore ?? 90;
    const testCasesPassed = signals.testCasesPassed ?? (session as any).testCasesPassed ?? 0;
    const totalTestCases = signals.totalTestCases ?? 5;
    
    const corporateBenchmark = (analysis.confidenceSignals as any)?.corporateBenchmark;

    // Telemetry log parsing
    const telemetryLogs = (session as any).telemetryLogs || [];
    const stressLogs = telemetryLogs
      .filter((l: any) => l.type === 'STRESS_COEFFICIENT' && l.stressCoefficient != null)
      .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const gazeDrops = telemetryLogs.filter((l: any) => l.type === 'EYE_CONTACT_DROP');

    // Downsample to 24 points for clean SVG chart rendering
    const downsample = (arr: any[], limit: number) => {
      if (arr.length <= limit) return arr;
      const result = [];
      const step = arr.length / limit;
      for (let i = 0; i < limit; i++) {
        result.push(arr[Math.floor(i * step)]);
      }
      return result;
    };
    
    const chartPoints = downsample(stressLogs, 24);
    
    // Draw SVG Gaze & Stress Chart
    const chartWidth = 500;
    const chartHeight = 120;
    
    let linePath = "";
    let areaPath = "";
    if (chartPoints.length > 1) {
      const coords = chartPoints.map((pt, idx) => {
        const x = (idx / (chartPoints.length - 1)) * chartWidth;
        const y = chartHeight - (pt.stressCoefficient * chartHeight * 0.8) - 10;
        return { x, y };
      });
      
      linePath = `M ${coords[0].x} ${coords[0].y} ` + coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');
      areaPath = `${linePath} L ${coords[coords.length - 1].x} ${chartHeight} L ${coords[0].x} ${chartHeight} Z`;
    }

    const maxStress = stressLogs.length > 0 ? Math.max(...stressLogs.map((l: any) => l.stressCoefficient)) : 0.2;
    const avgStress = stressLogs.length > 0 ? stressLogs.reduce((sum: number, l: any) => sum + l.stressCoefficient, 0) / stressLogs.length : 0.15;

    const actualScores: Record<string, number> = {
      technicalScore: codeCorrectnessScore,
      algorithmicEfficiencyScore,
      platformIntegrityScore,
      hintCount,
      structureScore: analysis.structureScore ?? 80
    };
    
    // Extract submitted code
    let finalCode = "";
    let finalLanguage = "javascript";
    session.questions?.forEach((q: any) => {
      if (q.answerText) {
        const match = q.answerText.match(/\[Code snapshot in (\w+)\]:\n```\w+\n([\s\S]*?)```/);
        if (match) {
          finalLanguage = match[1];
          finalCode = match[2];
        } else {
          const match2 = q.answerText.match(/```(\w+)\n([\s\S]*?)```/);
          if (match2) {
            finalLanguage = match2[1];
            finalCode = match2[2];
          }
        }
      }
    });
    if (!finalCode) {
      finalCode = `// Final solution submission was analyzed and successfully scored.`;
    }

    // Determine complexity label
    let complexityLabel = "O(N^2) Unoptimized complexity bottlenecks";
    let complexityProgress = 50;
    let complexityColor = "bg-rose-500 text-rose-400";
    if (algorithmicEfficiencyScore >= 80) {
      complexityLabel = "O(1) Space // O(N) Runtime optimal bounds";
      complexityProgress = 95;
      complexityColor = "bg-emerald-500 text-emerald-400";
    } else if (algorithmicEfficiencyScore >= 50) {
      complexityLabel = "O(N) Space // O(N) Linear runtime limits";
      complexityProgress = 75;
      complexityColor = "bg-brand-amber text-brand-amber";
    }

    const platformIntegrity = tabBlurs > 4 ? 'COMPROMISED' : 'SECURED';
    const facialStress = eyeContact >= 80 ? 'STABLE CALIBRATED PROFILE' : 'MINOR PRESSURE DEVIATIONS DETECTED';

    return (
      <div className="min-h-screen bg-[#07080B] text-slate-200 font-mono p-4 sm:p-6 md:p-8 relative selection:bg-brand-amber/30 selection:text-white overflow-y-auto">
        
        {/* Brand Hologram Glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-brand-orange/5 rounded-full blur-[160px] opacity-80" />
          <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-brand-amber/5 rounded-full blur-[160px] opacity-80" />
        </div>

        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <button
                onClick={exitRoomHandler}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                [Return To Dashboard]
              </button>
              <h1 className="text-xl sm:text-2xl font-black font-display text-white uppercase tracking-tight mt-2">
                Coding track analytics cockpit
              </h1>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                Telemetry secure sync // mode: CODING // ID: {session.id.substring(0, 12)}...
              </p>
            </div>
            
            <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 px-4.5 py-2 rounded-xl text-[10px] font-bold text-slate-400">
              <span className="h-2 w-2 rounded-full bg-brand-orange animate-ping" />
              CODING METRICS CALIBRATED
            </div>
          </div>

          {/* FANG CORPORATE BENCHMARK MATRIX CARD */}
          {corporateBenchmark && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0E1015] border border-slate-855 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group font-mono"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${corporateBenchmark.passed ? 'from-emerald-500 to-teal-500' : 'from-rose-500 to-red-500'}`} />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/60 pb-5 mb-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block font-mono">FANG Calibration Engine</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                    {corporateBenchmark.rubricName} Target Calibration
                  </h3>
                </div>
                
                <div className={`px-4.5 py-2 border rounded-full text-xs font-black tracking-widest uppercase inline-flex items-center gap-2 font-mono ${
                  corporateBenchmark.passed
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)] animate-pulse'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                }`}>
                  {corporateBenchmark.passed ? 'TARGET BAR: REACHED' : 'TARGET BAR: NOT REACHED'}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <p className="text-xs sm:text-[13px] leading-relaxed text-slate-300 select-text uppercase font-semibold">
                    {corporateBenchmark.feedback}
                  </p>
                  {!corporateBenchmark.passed && (
                    <div className="inline-block bg-rose-500/5 border border-rose-500/10 px-3.5 py-1.5 rounded-xl text-[10px] text-rose-400 font-bold uppercase tracking-wider font-mono">
                      Variance Index: -{corporateBenchmark.variance} points
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 bg-slate-950/40 border border-slate-800/85 p-5 rounded-2xl space-y-4">
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block border-b border-slate-850 pb-2">Hiring Bar Metrics Comparison</span>
                  
                  <div className="space-y-3.5">
                    {getRubricRequirements(corporateBenchmark.rubricKey).map((req, i) => {
                      const actual = actualScores[req.field] ?? 0;
                      const meets = req.isMax ? actual <= req.target : actual >= req.target;
                      
                      return (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                            <span className="uppercase">{req.name}</span>
                            <span className={meets ? 'text-emerald-400' : 'text-rose-400'}>
                              {actual} / {req.target} {req.isMax ? '(Max)' : '(Min)'}
                            </span>
                          </div>
                          
                          <div className="h-1 bg-[#12151D] rounded-full overflow-hidden relative">
                            {/* Target Marker */}
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-slate-600 z-10"
                              style={{ left: `${req.isMax ? 100 - (req.target * 10) : req.target}%` }}
                              title="Hiring Bar Target"
                            />
                            <div
                              className={`h-full ${meets ? 'bg-emerald-500' : 'bg-rose-500'}`}
                              style={{
                                width: `${req.isMax
                                  ? Math.max(0, 100 - (actual * 25))
                                  : Math.min(100, (actual / Math.max(1, req.target)) * req.target)}%`
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 1. CORE PERFORMANCE METRICS GRID (Top 50vw Layout Split) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Card Block: Technical Code Cockpit */}
            <div className="bg-[#0E1015] border border-slate-855 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-amber to-brand-orange" />
              
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 mb-6">
                  <Code2 className="text-brand-orange h-4 w-4" />
                  TECHNICAL CODE COCKPIT
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-8 justify-around mb-8">
                  {/* Interactive circular SVG score gauge for 'Code Correctness' */}
                  <div className="relative inline-flex items-center justify-center h-36 w-36">
                    <svg width="144" height="144" viewBox="0 0 144 144" className="transform -rotate-90">
                      <circle cx="72" cy="72" r="60" stroke="#12151D" strokeWidth="8" fill="none" />
                      <motion.circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke="url(#codeCorrectnessGrad)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 60}
                        initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 60 - (overallScore / 100) * (2 * Math.PI * 60) }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                      />
                      <defs>
                        <linearGradient id="codeCorrectnessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f5a623" />
                          <stop offset="100%" stopColor="#e85d24" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black font-display tracking-tight text-white">{overallScore}</span>
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">Overall Score</span>
                    </div>
                  </div>

                  {/* Code bounds verdict badge */}
                  <div className="text-center sm:text-left space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Structural calibration</span>
                    <div className={`px-4 py-2 rounded-full font-display font-black text-xs tracking-widest uppercase inline-flex items-center gap-2 ${verdictInfo.badgeClass}`}>
                      <verdictInfo.Icon size={12} className="shrink-0" />
                      <span>{verdictInfo.label}</span>
                    </div>
                  </div>
                </div>

                {/* Progress metrics stack */}
                <div className="space-y-4 pt-4 border-t border-slate-800/60">
                  {/* Test Cases Passed bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold uppercase text-slate-400">
                      <span>Test Case Pass Rate</span>
                      <span className="text-emerald-400 font-bold">{testCasesPassed} / {totalTestCases} Passed</span>
                    </div>
                    <div className="h-1.5 bg-[#12151D] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${(testCasesPassed / totalTestCases) * 100}%` }} />
                    </div>
                  </div>

                  {/* Complexity / Algorithmic Efficiency progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold uppercase text-slate-400">
                      <span>Algorithmic Efficiency</span>
                      <span className="text-white">{algorithmicEfficiencyScore}% ({complexityLabel})</span>
                    </div>
                    <div className="h-1.5 bg-[#12151D] rounded-full overflow-hidden">
                      <div className={`h-full ${complexityColor}`} style={{ width: `${algorithmicEfficiencyScore}%` }} />
                    </div>
                  </div>

                  {/* Hint Dependency Penalization */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold uppercase text-slate-400">
                      <span>Hint Dependency Penalization</span>
                      <span className="text-brand-orange">Deduct 15 points per hint ({hintCount} hints consumed)</span>
                    </div>
                    <div className="h-1.5 bg-[#12151D] rounded-full overflow-hidden">
                      <div className="h-full bg-brand-orange" style={{ width: `${Math.min(100, hintCount * 33)}%` }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Card Block: Multi-Modal Proctoring Hub */}
            <div className="bg-[#0E1015] border border-slate-855 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 mb-6">
                  <Shield className="text-emerald-500 h-4 w-4" />
                  MULTI-MODAL PROCTORING HUB
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 mb-6">
                  {/* Eye contact score */}
                  <div className="bg-[#12151D] border border-slate-800 p-4.5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[9px] text-slate-500 block uppercase">Eye Contact Stability Score</span>
                    <span className="text-2xl font-black text-white mt-2 block">{eyeContact}%</span>
                    <span className="text-[8px] text-slate-500 uppercase mt-1">Focused workspace duration</span>
                  </div>

                  {/* Platform Integrity Indicator */}
                  <div className="bg-[#12151D] border border-slate-800 p-4.5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[9px] text-slate-500 block uppercase">Platform Integrity Status</span>
                    <span className={`text-xs font-black tracking-widest uppercase px-2.5 py-1.5 rounded-lg text-center mt-3 border ${
                      platformIntegrity === 'SECURED' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                    }`}>
                      {platformIntegrity}
                    </span>
                    <span className="text-[8px] text-slate-500 uppercase mt-1.5">{tabBlurs} window focus tab blurs</span>
                  </div>
                </div>

                {/* Facial Expression Stress Analytics */}
                <div className="p-4.5 bg-[#12151D] border border-slate-800 rounded-2xl space-y-2">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Facial Expression Stress Analytics</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">{facialStress}</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Ava Telemetry</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${eyeContact}%` }} />
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* NEW: DIAGNOSTIC SUB-SCORE DATA GRID (Coding Mode) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Code Correctness", score: codeCorrectnessScore, desc: `${testCasesPassed}/${totalTestCases} test cases passed`, color: "from-brand-amber to-brand-orange" },
              { label: "Algo Efficiency", score: algorithmicEfficiencyScore, desc: "Big-O runtime calibration", color: "from-amber-400 to-orange-500" },
              { label: "Cadence & Hints", score: cadenceScore, desc: `${hintCount} progressive hints consumed`, color: "from-emerald-400 to-teal-500" },
              { label: "Platform Integrity", score: platformIntegrityScore, desc: `${tabBlurs} window focus blurs`, color: "from-cyan-400 to-blue-500" }
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-[#0E1015] border border-slate-850 hover:border-slate-700 p-5 rounded-2xl shadow-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-slate-800 to-slate-700 group-hover:from-brand-amber group-hover:to-brand-orange transition-all" />
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{card.label}</span>
                <div className="flex items-baseline gap-1.5 mt-2 mb-1">
                  <span className="text-2xl font-black text-white">{card.score}</span>
                  <span className="text-[10px] text-slate-500 font-bold">/100</span>
                </div>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide truncate">{card.desc}</span>
                
                {/* Micro mini progress bar */}
                <div className="h-1 bg-[#12151D] rounded-full overflow-hidden mt-3.5">
                  <div className="h-full bg-gradient-to-r from-brand-amber to-brand-orange" style={{ width: `${card.score}%` }} />
                </div>
              </div>
            ))}
          </motion.div>

          {/* 2. THE PROFESSIONAL PROS & CONS BLUEPRINT LEDGER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Verified Pros */}
            <div className="bg-[#0E1015] border border-slate-850 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
              
              <div className="border-b border-slate-800/60 pb-3">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  VERIFIED PROS BLUEPRINT LEDGER
                </h3>
                <p className="text-[9px] text-slate-500 uppercase mt-0.5">
                  Granular genuine technical engineering praises
                </p>
              </div>

              <div className="space-y-4">
                {analysis.strengths.slice(0, 3).map((strength, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start bg-slate-950/30 border border-slate-850/60 p-4 rounded-2xl">
                    <div className="h-5 w-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 font-bold text-[10px] rounded-full">
                      {idx + 1}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300 uppercase font-semibold">
                      {strength}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Constructive Cons */}
            <div className="bg-[#0E1015] border border-slate-850 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange" />
              
              <div className="border-b border-slate-800/60 pb-3">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-orange flex items-center gap-2">
                  <AlertTriangle size={16} />
                  CONSTRUCTIVE CONS BLUEPRINT LEDGER
                </h3>
                <p className="text-[9px] text-slate-500 uppercase mt-0.5">
                  Honest architectural improvements calibrated
                </p>
              </div>

              <div className="space-y-4">
                {analysis.improvements.slice(0, 3).map((improvement, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start bg-slate-950/30 border border-slate-850/60 p-4 rounded-2xl">
                    <div className="h-5 w-5 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 flex items-center justify-center shrink-0 font-bold text-[10px] rounded-full">
                      {idx + 1}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300 uppercase font-semibold">
                      {improvement}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* BEHAVIORAL GAZE & BIO-METRIC STRESS TELEMETRY CHART */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#0E1015] border border-slate-850 rounded-3xl p-6 sm:p-8 shadow-2xl relative font-mono"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-amber to-brand-orange" />
            
            <div className="border-b border-slate-850 pb-3 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={16} className="text-brand-orange animate-pulse" />
                  BEHAVIORAL BIO-METRICS & PROCTORING TIMELINE
                </h3>
                <p className="text-[9px] text-slate-500 mt-0.5 uppercase">
                  Continuous pupil eye-gaze tracking and stress coefficient telemetry logging
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 text-[9px] font-mono font-bold">
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-emerald-400 uppercase">
                  Avg Stress: {Math.round(avgStress * 100)}%
                </span>
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-red-400 uppercase">
                  Peak Stress: {Math.round(maxStress * 100)}%
                </span>
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-amber-400 uppercase">
                  Gaze Drops: {gazeDrops.length}
                </span>
              </div>
            </div>

            {stressLogs.length > 0 ? (
              <div className="space-y-4">
                <div className="relative w-full h-[160px] bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 overflow-hidden flex items-end">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-10">
                    <div className="border-b border-white w-full h-0" />
                    <div className="border-b border-white w-full h-0" />
                    <div className="border-b border-white w-full h-0" />
                  </div>
                  
                  {/* SVG Chart */}
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f5a623" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#e85d24" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Area path */}
                    {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}
                    
                    {/* Line path */}
                    {linePath && (
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#f5a623"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    
                    {/* Bullet Points */}
                    {chartPoints.map((pt, idx) => {
                      const x = (idx / (chartPoints.length - 1)) * chartWidth;
                      const y = chartHeight - (pt.stressCoefficient * chartHeight * 0.8) - 10;
                      return (
                        <circle
                          key={idx}
                          cx={x}
                          cy={y}
                          r="3"
                          fill="#ffffff"
                          stroke="#e85d24"
                          strokeWidth="1.5"
                          className="hover:r-5 transition-all cursor-pointer"
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className="flex justify-between text-[8px] text-slate-500 font-mono uppercase tracking-widest px-1">
                  <span>Start of session</span>
                  <span>Timeline sequence (seconds)</span>
                  <span>End of session</span>
                </div>
              </div>
            ) : (
              <div className="h-[120px] bg-slate-950/40 border border-slate-800/80 rounded-2xl flex items-center justify-center text-zinc-650 text-[10px] uppercase font-bold tracking-wider">
                Waiting for telemetry data parsing to sync...
              </div>
            )}
          </motion.div>

          {/* 3. THE CHRONOLOGICAL CODE TIMELINE EXPLORER */}
          <div className="bg-[#0E1015] border border-slate-850 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-amber to-brand-orange" />
            
            <div className="border-b border-slate-850 pb-3 mb-6">
              <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Terminal size={16} className="text-brand-orange animate-pulse" />
                CHRONOLOGICAL CODE TIMELINE EXPLORER
              </h3>
              <p className="text-[9px] text-slate-500 mt-0.5 uppercase">
                Final submitted code side-by-side with Ava step-by-step progressive critique
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Final submitted code block */}
              <div className="lg:col-span-7 flex flex-col space-y-2 min-h-[300px]">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase px-1">
                  <span>IDE SOURCE CODE snapshot ({finalLanguage.toUpperCase()})</span>
                  <span className="flex items-center gap-1"><Shield size={10} className="text-emerald-500" /> SECURED ASSESSMENT</span>
                </div>
                <div className="flex-1 bg-[#07080B] border border-slate-800 rounded-2xl p-5 overflow-auto font-mono text-[11px] leading-relaxed text-emerald-400 select-text max-h-[480px]">
                  <pre className="whitespace-pre">{finalCode}</pre>
                </div>
              </div>

              {/* Right Column: AI critique feed */}
              <div className="lg:col-span-5 flex flex-col space-y-4 overflow-y-auto max-h-[510px] scrollbar-thin">
                <div className="text-[10px] font-bold text-slate-400 uppercase px-1">
                  AVA STEP-BY-STEP PROGRESSIVE CRITIQUE
                </div>

                <div className="space-y-4">
                  {session.questions?.map((q: any, idx: number) => (
                    <div key={idx} className="bg-[#12151D] border border-slate-800 rounded-2xl p-4.5 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-[10px] font-black uppercase text-brand-orange">
                          STAGE {idx + 1}: {idx === 0 ? 'CONCEPTUAL' : idx === 1 ? 'BRUTE FORCE' : idx === 2 ? 'OPTIMAL REFACTOR' : 'COMPLEXITY PROOF'}
                        </span>
                        {q.evalScore !== null && (
                          <span className="text-[9px] font-mono font-extrabold bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-md border border-brand-orange/20">
                            SCORE: {q.evalScore}/100
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-[8px] text-slate-500 font-bold uppercase block">Stage evaluation query:</span>
                          <p className="text-[10.5px] leading-relaxed text-slate-300 font-body select-text">{q.questionText}</p>
                        </div>

                        {q.evalFeedback && (
                          <div className="pt-2 border-t border-slate-800/40">
                            <span className="text-[8px] text-slate-500 font-bold uppercase block">Ava feedback:</span>
                            <p className="text-[10.5px] leading-relaxed text-slate-400 font-body select-text italic">"{q.evalFeedback.split('\n<!--')[0]}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Actionable Tips ledger */}
          <div className="bg-[#0E1015] border border-slate-850 rounded-3xl p-6 sm:p-8 relative">
            <div className="border-b border-slate-850 pb-3 mb-6">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Sparkles size={16} className="text-brand-orange" />
                Actionable Readiness Tips Ledger
              </h3>
              <p className="text-[9px] text-slate-500 mt-0.5 uppercase">
                Expand rows to reveal explicit backend calibration reasoning guidelines
              </p>
            </div>

            <div className="space-y-3 font-mono">
              {readinessTips.map((item, idx) => {
                const isExpanded = expandedTipIdx === idx;
                return (
                  <div key={idx} className="border border-slate-800 bg-slate-950/20 rounded-2xl overflow-hidden transition-all duration-300">
                    <button
                      onClick={() => setExpandedTipIdx(isExpanded ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-800/10 transition-all cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-none bg-brand-orange/10 text-brand-orange flex items-center justify-center font-bold text-xs shrink-0 border border-brand-orange/20">
                          {idx + 1}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wide">
                          {item.tip}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-slate-400 shrink-0"
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1 text-xs text-slate-400 font-body leading-relaxed uppercase border-t border-slate-800 bg-[#090e18]/40">
                            {item.reason}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM BRAND LEDGER */}
          <div className="flex justify-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-8">
            RU READY? // POWERED_BY_ANTIGRAVITY // COCKPIT_SECURE_DIAGNOSTICS
          </div>

        </div>
      </div>
    );
  }

    const corporateBenchmark = (analysis.confidenceSignals as any)?.corporateBenchmark;

    // Telemetry log parsing
    const telemetryLogs = (session as any).telemetryLogs || [];
    const stressLogs = telemetryLogs
      .filter((l: any) => l.type === 'STRESS_COEFFICIENT' && l.stressCoefficient != null)
      .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const gazeDrops = telemetryLogs.filter((l: any) => l.type === 'EYE_CONTACT_DROP');

    // Downsample to 24 points for clean SVG chart rendering
    const downsample = (arr: any[], limit: number) => {
      if (arr.length <= limit) return arr;
      const result = [];
      const step = arr.length / limit;
      for (let i = 0; i < limit; i++) {
        result.push(arr[Math.floor(i * step)]);
      }
      return result;
    };
    
    const chartPoints = downsample(stressLogs, 24);
    
    // Draw SVG Gaze & Stress Chart
    const chartWidth = 500;
    const chartHeight = 120;
    
    let linePath = "";
    let areaPath = "";
    if (chartPoints.length > 1) {
      const coords = chartPoints.map((pt, idx) => {
        const x = (idx / (chartPoints.length - 1)) * chartWidth;
        const y = chartHeight - (pt.stressCoefficient * chartHeight * 0.8) - 10;
        return { x, y };
      });
      
      linePath = `M ${coords[0].x} ${coords[0].y} ` + coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');
      areaPath = `${linePath} L ${coords[coords.length - 1].x} ${chartHeight} L ${coords[0].x} ${chartHeight} Z`;
    }

    const maxStress = stressLogs.length > 0 ? Math.max(...stressLogs.map((l: any) => l.stressCoefficient)) : 0.2;
    const avgStress = stressLogs.length > 0 ? stressLogs.reduce((sum: number, l: any) => sum + l.stressCoefficient, 0) / stressLogs.length : 0.15;

    const actualScores: Record<string, number> = {
      technicalScore: analysis.technicalScore,
      platformIntegrityScore: analysis.confidenceScore,
      structureScore: analysis.structureScore,
      communicationScore: analysis.communicationScore
    };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-4 sm:p-6 md:p-8 relative selection:bg-brand-amber/30 selection:text-white overflow-y-auto">
        
        {/* Brand Hologram Glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-brand-orange/5 rounded-full blur-[160px] opacity-80" />
          <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-brand-amber/5 rounded-full blur-[160px] opacity-80" />
        </div>

        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          
          {/* Terminal Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-6">
            <div className="space-y-1">
              <button
                onClick={exitRoomHandler}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                [Return To Dashboard]
              </button>
              <h1 className="text-xl sm:text-2xl font-black font-display text-white uppercase tracking-tight mt-2">
                Performance Review Cockpit
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Telemetry secure sync // ID: {session.id.substring(0, 12)}...
              </p>
            </div>
            
            <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 px-4.5 py-2 rounded-xl text-[10px] font-bold text-slate-400">
              <span className="h-2 w-2 rounded-full bg-brand-orange animate-ping" />
              SYNTHESIS ENGINE SECURE
            </div>
          </div>

          {/* FANG CORPORATE BENCHMARK MATRIX CARD */}
          {corporateBenchmark && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0E1015] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group font-mono text-slate-200"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${corporateBenchmark.passed ? 'from-emerald-500 to-teal-500' : 'from-rose-500 to-red-500'}`} />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-5 mb-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block font-mono">FANG Calibration Engine</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                    {corporateBenchmark.rubricName} Target Calibration
                  </h3>
                </div>
                
                <div className={`px-4.5 py-2 border rounded-full text-xs font-black tracking-widest uppercase inline-flex items-center gap-2 font-mono ${
                  corporateBenchmark.passed
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)] animate-pulse'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                }`}>
                  {corporateBenchmark.passed ? 'TARGET BAR: REACHED' : 'TARGET BAR: NOT REACHED'}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <p className="text-xs sm:text-[13px] leading-relaxed text-slate-300 select-text uppercase font-semibold">
                    {corporateBenchmark.feedback}
                  </p>
                  {!corporateBenchmark.passed && (
                    <div className="inline-block bg-rose-500/5 border border-rose-500/10 px-3.5 py-1.5 rounded-xl text-[10px] text-rose-400 font-bold uppercase tracking-wider font-mono">
                      Variance Index: -{corporateBenchmark.variance} points
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 bg-slate-950/40 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block border-b border-slate-850 pb-2">Hiring Bar Metrics Comparison</span>
                  
                  <div className="space-y-3.5">
                    {getRubricRequirements(corporateBenchmark.rubricKey).map((req, i) => {
                      const actual = actualScores[req.field] ?? 0;
                      const meets = req.isMax ? actual <= req.target : actual >= req.target;
                      
                      return (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                            <span className="uppercase">{req.name}</span>
                            <span className={meets ? 'text-emerald-400' : 'text-rose-400'}>
                              {actual} / {req.target} {req.isMax ? '(Max)' : '(Min)'}
                            </span>
                          </div>
                          
                          <div className="h-1 bg-[#12151D] rounded-full overflow-hidden relative">
                            {/* Target Marker */}
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-slate-600 z-10"
                              style={{ left: `${req.isMax ? 100 - (req.target * 10) : req.target}%` }}
                              title="Hiring Bar Target"
                            />
                            <div
                              className={`h-full ${meets ? 'bg-emerald-500' : 'bg-rose-500'}`}
                              style={{
                                width: `${req.isMax
                                  ? Math.max(0, 100 - (actual * 25))
                                  : Math.min(100, (actual / Math.max(1, req.target)) * req.target)}%`
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        {/* TWO-COLUMN ANALYTICAL TOP SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          
          {/* Left Panel (40%): Unified Assessment Ring & Proctor Box */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group min-h-[420px]">
            <div className={`absolute inset-0 bg-gradient-to-br ${verdictInfo.glowClass} opacity-80 pointer-events-none`} />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-6 my-auto">
              
              {/* Radial circle meter */}
              <div className="relative inline-flex items-center justify-center h-44 w-44">
                <svg width="176" height="176" viewBox="0 0 176 176" className="transform -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="74"
                    stroke="#0b0f19"
                    strokeWidth="10"
                    fill="none"
                  />
                  <motion.circle
                    cx="88"
                    cy="88"
                    r="74"
                    stroke="url(#cockpitGrad)"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 74}
                    initial={{ strokeDashoffset: 2 * Math.PI * 74 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 74 - (overallScore / 100) * (2 * Math.PI * 74) }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                  />
                  <defs>
                    <linearGradient id="cockpitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f5a623" />
                      <stop offset="100%" stopColor="#e85d24" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Score typography */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black font-display tracking-tight text-white">
                    {overallScore}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">
                    Score / 100
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`px-5 py-2.5 rounded-full font-display font-black text-xs tracking-widest uppercase flex items-center gap-2 ${verdictInfo.badgeClass}`}>
                <verdictInfo.Icon size={14} className="shrink-0" />
                <span>{verdictInfo.label}</span>
              </div>
            </div>

            {/* Custom Proctoring Report Box */}
            <div className="relative z-10 mt-6 bg-slate-950/70 border border-slate-850 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-855 pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Shield size={12} className="text-brand-orange" />
                  Environmental Proctoring
                </span>
                <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md ${
                  proctoringFlagStatus === 'PASSED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-brand-red/10 text-brand-red border border-brand-red/20'
                }`}>
                  {proctoringFlagStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-slate-500 block uppercase">Focus blurs</span>
                    <span className="text-xs font-bold text-white">{calculatedTabBlurs}</span>
                  </div>
                  <AppWindow size={16} className="text-slate-500" />
                </div>
                <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-slate-500 block uppercase">Eye drops</span>
                    <span className="text-xs font-bold text-white">{calculatedEyeDrops}</span>
                  </div>
                  <Eye size={16} className="text-slate-500" />
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel (60%): Diagnostics Grid & Cadence Stack */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* NEW: DIAGNOSTIC DATA GRID (Oral Mode) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: "Technical Depth", score: analysis.technicalScore, desc: "AI-calibrated conceptual score", detail: "40% weight matrix" },
                { label: "Communication Style", score: analysis.communicationScore, desc: "Pace stability & filler words", detail: "30% weight matrix" },
                { label: "Confidence & Presence", score: analysis.confidenceScore, desc: "Tab blurs & gaze metrics", detail: "30% weight matrix" },
                { label: "Response Structure", score: analysis.structureScore, desc: "STAR framework alignment", detail: "Derived rating" }
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl shadow-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-slate-800 to-slate-700 group-hover:from-brand-amber group-hover:to-brand-orange transition-all" />
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{card.label}</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{card.detail}</span>
                  </div>
                  
                  <div className="flex items-baseline gap-1.5 mt-3 mb-1">
                    <span className="text-2xl font-black text-white">{card.score}</span>
                    <span className="text-[10px] text-slate-500 font-bold">/100</span>
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide truncate">{card.desc}</span>
                  
                  {/* Micro mini progress bar */}
                  <div className="h-1 bg-slate-950 rounded-full overflow-hidden mt-3.5">
                    <div className="h-full bg-gradient-to-r from-brand-amber to-brand-orange" style={{ width: `${card.score}%` }} />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Communication Cadence Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[220px]">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="border-b border-slate-855 pb-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={16} className="text-brand-amber animate-pulse" />
                  Communication Cadence Card
                </h3>
                <p className="text-[9px] text-slate-500 uppercase mt-0.5">
                  Vocal metrics and semantic fillers tracking analysis
                </p>
              </div>

              {/* Speech rate cadence blocks & metrics */}
              <div className="flex-1 flex flex-col justify-center space-y-6 pt-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* WPM stats */}
                  <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl">
                    <span className="text-[9px] text-slate-500 block uppercase">Average Pace</span>
                    <span className="text-lg font-black text-white mt-1 block font-mono">{avgWpm} <span className="text-[9px] text-slate-400">WPM</span></span>
                  </div>

                  {/* Filler Words */}
                  <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl">
                    <span className="text-[9px] text-slate-500 block uppercase">Fillers Detected</span>
                    <span className="text-lg font-black text-brand-amber mt-1 block font-mono">{totalFillerWords}</span>
                  </div>

                  {/* Speech pace warning tag */}
                  <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
                    <span className="text-[9px] text-slate-500 block uppercase">Cadence Zone</span>
                    <span className={`text-[10px] font-black tracking-wide uppercase px-2 py-0.5 rounded-md text-center mt-1.5 ${
                      speechRateCategory === 'Optimal' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-brand-red/10 text-brand-red border border-brand-red/20'
                    }`}>
                      {speechRateCategory}
                    </span>
                  </div>

                </div>

                {/* Semantic fillers ledger list */}
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-2.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filler word counts breakdown</div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="flex justify-between p-2 bg-slate-900 border border-slate-850 rounded-xl px-3">
                      <span className="text-slate-500 uppercase font-mono">"like"</span>
                      <span className="font-bold text-white">{likeCount}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-900 border border-slate-850 rounded-xl px-3">
                      <span className="text-slate-500 uppercase font-mono">"um"</span>
                      <span className="font-bold text-white">{umCount}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-900 border border-slate-850 rounded-xl px-3">
                      <span className="text-slate-500 uppercase font-mono">"uh"</span>
                      <span className="font-bold text-white">{uhCount}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* BEHAVIORAL GAZE & BIO-METRIC STRESS TELEMETRY CHART */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative font-mono text-slate-200"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-amber to-brand-orange" />
          
          <div className="border-b border-slate-800 pb-3 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={16} className="text-brand-orange animate-pulse" />
                BEHAVIORAL BIO-METRICS & PROCTORING TIMELINE
              </h3>
              <p className="text-[9px] text-slate-500 mt-0.5 uppercase font-mono">
                Continuous pupil eye-gaze tracking and stress coefficient telemetry logging
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 text-[9px] font-mono font-bold">
              <span className="px-2.5 py-1 bg-slate-950 border border-slate-850 rounded-md text-emerald-400 uppercase">
                Avg Stress: {Math.round(avgStress * 100)}%
              </span>
              <span className="px-2.5 py-1 bg-slate-950 border border-slate-855 rounded-md text-red-400 uppercase">
                Peak Stress: {Math.round(maxStress * 100)}%
              </span>
              <span className="px-2.5 py-1 bg-slate-950 border border-slate-855 rounded-md text-amber-400 uppercase">
                Gaze Drops: {gazeDrops.length}
              </span>
            </div>
          </div>

          {stressLogs.length > 0 ? (
            <div className="space-y-4">
              <div className="relative w-full h-[160px] bg-slate-950/40 border border-slate-850 rounded-2xl p-4 overflow-hidden flex items-end">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-10">
                  <div className="border-b border-white w-full h-0" />
                  <div className="border-b border-white w-full h-0" />
                  <div className="border-b border-white w-full h-0" />
                </div>
                
                {/* SVG Chart */}
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradOral" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f5a623" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#e85d24" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area path */}
                  {areaPath && <path d={areaPath} fill="url(#chartGradOral)" />}
                  
                  {/* Line path */}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#f5a623"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  
                  {/* Bullet Points */}
                  {chartPoints.map((pt, idx) => {
                    const x = (idx / (chartPoints.length - 1)) * chartWidth;
                    const y = chartHeight - (pt.stressCoefficient * chartHeight * 0.8) - 10;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#ffffff"
                        stroke="#e85d24"
                        strokeWidth="1.5"
                        className="hover:r-5 transition-all cursor-pointer"
                      />
                    );
                  })}
                </svg>
              </div>
              <div className="flex justify-between text-[8px] text-slate-500 font-mono uppercase tracking-widest px-1">
                <span>Start of session</span>
                <span>Timeline sequence (seconds)</span>
                <span>End of session</span>
              </div>
            </div>
          ) : (
            <div className="h-[120px] bg-slate-950/40 border border-slate-850 rounded-2xl flex items-center justify-center text-zinc-650 text-[10px] uppercase font-bold tracking-wider">
              Waiting for telemetry data parsing to sync...
            </div>
          )}
        </motion.div>

        {/* SOCRATIC DIALOG EXPLORER LAYOUT */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          
          <div className="border-b border-slate-800 pb-3 mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={16} className="text-brand-orange" />
              Socratic Dialog Explorer
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Sequential chat logs tracking active dialogue exchanges and critiques
            </p>
          </div>

          <div className="space-y-6">
            {session.questions?.map((q: any, idx: number) => {
              const isCritiqueOpen = openCritiqueIds[q.id] || false;
              
              return (
                <div key={q.id} className="border border-slate-800/80 bg-slate-950/20 rounded-2xl overflow-hidden transition-all duration-300">
                  
                  {/* Chat exchange block wrapper */}
                  <div className="p-5 space-y-4">
                    
                    {/* Ava's question block */}
                    <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-lg bg-brand-orange text-slate-950 font-display font-black flex items-center justify-center text-xs shrink-0 shadow-md">
                        AVA
                      </div>
                      <div className="flex-1 bg-slate-900 border border-slate-850 p-4 rounded-2xl space-y-1.5">
                        <div className="flex items-center justify-between text-[8px] font-bold tracking-wider text-slate-500">
                          <span>Q{idx + 1} • {getIntentNote(q.questionType)}</span>
                          <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">{q.difficulty}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-body">
                          {q.questionText}
                        </p>
                      </div>
                    </div>

                    {/* Candidate's answer block */}
                    <div className="flex gap-4 items-start justify-end">
                      <div className="flex-1 bg-[#0b101c]/40 border border-slate-850 p-4 rounded-2xl space-y-1.5 text-right">
                        <span className="text-[8px] font-bold tracking-wider text-slate-500 uppercase">
                          Candidate Response ({q.timeTakenSecs ? `${Math.floor(q.timeTakenSecs / 60)}m ${q.timeTakenSecs % 60}s` : 'N/A'})
                        </span>
                        <p className="text-xs sm:text-sm text-brand-amber leading-relaxed font-body text-left">
                          {q.answerText || '[No answer provided]'}
                        </p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 font-display font-black flex items-center justify-center text-xs shrink-0 border border-slate-700">
                        <User size={14} />
                      </div>
                    </div>

                    {/* Expandable nested Critique toggle */}
                    {q.evalScore !== null && (
                      <div className="pt-2 pl-12 flex justify-start">
                        <button
                          onClick={() => toggleCritique(q.id)}
                          className="inline-flex items-center gap-2 text-[10px] font-bold text-brand-orange bg-brand-orange/5 hover:bg-brand-orange/10 border border-brand-orange/20 hover:border-brand-orange/40 px-3.5 py-2 rounded-xl transition-all cursor-pointer uppercase tracking-wider font-mono shadow-sm"
                        >
                          {isCritiqueOpen ? '[HIDE_CRITIQUE_REPORT]' : '[VIEW_EVALUATION_CRITIQUE]'}
                          <ChevronDown size={12} className={`transition-transform duration-300 ${isCritiqueOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    )}

                  </div>

                  {/* Critique zinc panel drawer */}
                  <AnimatePresence>
                    {isCritiqueOpen && q.evalScore !== null && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-slate-800 bg-[#090e18]/40"
                      >
                        <div className="p-5 sm:p-6 space-y-4">
                          
                          {/* Score and metric metadata */}
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                              Uninflated answer score
                            </span>
                            <span className="inline-flex px-2 py-0.5 text-xs font-bold border border-brand-amber/30 text-brand-amber bg-brand-amber/5 rounded-md font-mono">
                              {q.evalScore}%
                            </span>
                          </div>

                          {/* strict feedback text */}
                          <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl italic text-xs leading-relaxed text-slate-300 font-body">
                            "{q.evalFeedback || 'No formal evaluation critique compiled.'}"
                          </div>

                          {/* Strengths & Weaknesses subsplit */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2">
                              <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Check size={12} />
                                Answer Strengths
                              </h4>
                              <ul className="space-y-1.5 text-[11px] text-slate-400 font-body list-disc list-inside">
                                {q.evalStrengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                {(!q.evalStrengths || q.evalStrengths.length === 0) && <li>No specific strengths recorded.</li>}
                              </ul>
                            </div>
                            <div className="p-4 bg-brand-amber/5 border border-brand-amber/10 rounded-xl space-y-2">
                              <h4 className="text-[10px] font-bold text-brand-amber uppercase tracking-widest flex items-center gap-1.5">
                                <AlertTriangle size={12} />
                                Technical Gaps
                              </h4>
                              <ul className="space-y-1.5 text-[11px] text-slate-400 font-body list-disc list-inside">
                                {q.evalWeaknesses?.map((w: string, i: number) => <li key={i}>{w}</li>)}
                                {(!q.evalWeaknesses || q.evalWeaknesses.length === 0) && <li>No specific structural gaps noted.</li>}
                              </ul>
                            </div>
                          </div>

                          {/* Better answer rewrite */}
                          {q.betterAnswer && (
                            <div className="space-y-2 pt-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block">
                                Ideal Model Answer Rewrite (90+ score calibration)
                              </label>
                              <div className="bg-[#05080f] text-slate-300 border border-slate-850 rounded-xl p-4.5 text-xs font-mono leading-relaxed whitespace-pre-line overflow-x-auto">
                                {q.betterAnswer}
                              </div>
                            </div>
                          )}

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>

        </div>

        {/* ACTIONABLE FRAMEWORK MATRIX & TIPS LEDGER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strengths Card */}
          <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 flex flex-col justify-between group">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4 mb-4 shrink-0">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold font-display uppercase tracking-wider text-slate-300">
                  Secured Strengths List
                </h4>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">
                  Key areas of architectural precision
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-3.5">
              {analysis.strengths.slice(0, 3).map((strength, idx) => (
                <div key={idx} className="flex gap-3 items-start bg-slate-950/40 border border-slate-850 p-4 rounded-2xl">
                  <div className="h-5 w-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 font-bold text-[10px] rounded-full">
                    {idx + 1}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300 uppercase font-semibold">
                    {strength}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Improvements Card */}
          <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 flex flex-col justify-between group">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4 mb-4 shrink-0">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert size={16} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold font-display uppercase tracking-wider text-slate-300">
                  Critical Areas Identified
                </h4>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">
                  Actionable calibration vectors
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-3.5">
              {analysis.improvements.slice(0, 3).map((improvement, idx) => (
                <div key={idx} className="flex gap-3 items-start bg-slate-950/40 border border-slate-850 p-4 rounded-2xl">
                  <div className="h-5 w-5 bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0 font-bold text-[10px] rounded-full">
                    {idx + 1}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300 uppercase font-semibold">
                    {improvement}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* TIPS LEDGER ACCORDIONS */}
        <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 relative">
          
          <div className="border-b border-slate-800 pb-3.5 mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Sparkles size={16} className="text-brand-orange" />
              Actionable Readiness Tips Ledger
            </h3>
            <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider">
              Expand rows to reveal explicit backend calibration reasoning guidelines
            </p>
          </div>

          <div className="space-y-3 font-mono">
            {readinessTips.map((item, idx) => {
              const isExpanded = expandedTipIdx === idx;
              return (
                <div key={idx} className="border border-slate-800 bg-slate-950/20 rounded-2xl overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => setExpandedTipIdx(isExpanded ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-800/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-none bg-brand-orange/10 text-brand-orange flex items-center justify-center font-bold text-xs shrink-0 border border-brand-orange/20">
                        {idx + 1}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wide">
                        {item.tip}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400 shrink-0"
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-slate-400 font-body leading-relaxed uppercase border-t border-slate-800 bg-[#090e18]/40">
                          {item.reason}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM BRAND LEDGER */}
        <div className="flex justify-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-8">
          RU READY? // POWERED_BY_ANTIGRAVITY // COCKPIT_SECURE_DIAGNOSTICS
        </div>

      </div>
    </div>
  );
}
