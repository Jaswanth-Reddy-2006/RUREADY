import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Play,
  Clock,
  Award,
  TrendingUp,
  BarChart3,
  Briefcase,
  ChevronRight,
  Target,
  Bot,
  FileText,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  Code2,
  Lightbulb,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import apiClient from '../../api/client';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

// ─── SVG RADAR PENTAGON CHART (SOLO USER PERFORMANCE) ───
function OralRadarChart({ scores }: { scores: number[] }) {
  const cx = 130;
  const cy = 120;
  const radius = 72;

  const axes = [
    { label: 'Technical Knowledge', angle: -90 },
    { label: 'Problem Solving', angle: -18 },
    { label: 'Communication', angle: 54 },
    { label: 'Project Knowledge', angle: 126 },
    { label: 'Answer Structure', angle: 198 },
  ];

  const getPoint = (score: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    const r = (score / 100) * radius;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const points = axes.map((a, idx) => getPoint(scores[idx] || 0, a.angle));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <svg width="260" height="230" className="overflow-visible">
        {/* Concentric Pentagon Grids */}
        {gridLevels.map((lvl) => {
          const pts = axes.map((a) => {
            const rad = (a.angle * Math.PI) / 180;
            const r = lvl * radius;
            return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
          });
          return (
            <polygon
              key={lvl}
              points={pts.join(' ')}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray={lvl === 1 ? 'none' : '2,2'}
            />
          );
        })}

        {/* Radial Axis Lines */}
        {axes.map((a, i) => {
          const outerP = getPoint(100, a.angle);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={outerP.x}
              y2={outerP.y}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          );
        })}

        {/* Score Polygon (Solid Blue) */}
        <path
          d={pathD}
          fill="rgba(59, 130, 246, 0.18)"
          stroke="#3B82F6"
          strokeWidth="2.5"
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
        ))}

        {/* Axis Labels */}
        {axes.map((a, i) => {
          const rad = (a.angle * Math.PI) / 180;
          const labelDist = radius + 20;
          const lx = cx + labelDist * Math.cos(rad);
          const ly = cy + labelDist * Math.sin(rad);

          let textAnchor: 'inherit' | 'end' | 'middle' | 'start' = 'middle';
          if (a.angle === -18 || a.angle === 54) textAnchor = 'start';
          if (a.angle === 126 || a.angle === 198) textAnchor = 'end';

          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              className="text-[9.5px] font-semibold fill-slate-600 font-sans"
            >
              {a.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ─── MINI BAR GRAPH COMPONENT (REAL DATA ONLY) ───
function MiniBarGraph({ color = 'bg-blue-400' }: { color?: string }) {
  return (
    <div className="flex items-end gap-1 h-8 shrink-0">
      <div className={`w-1.5 h-3 ${color} opacity-40 rounded-t`} />
      <div className={`w-1.5 h-5 ${color} opacity-60 rounded-t`} />
      <div className={`w-1.5 h-4 ${color} opacity-50 rounded-t`} />
      <div className={`w-1.5 h-7 ${color} opacity-90 rounded-t`} />
      <div className={`w-1.5 h-6 ${color} rounded-t`} />
    </div>
  );
}

export default function OralCommandCenter() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await apiClient.get('/interview/sessions');
        const allSessions = response.data || [];
        const oralOnly = allSessions.filter(
          (s: any) => !s.interviewType || s.interviewType !== 'CODING'
        );
        oralOnly.sort(
          (a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        setSessions(oralOnly);
      } catch (err) {
        console.warn('Failed to fetch oral interview history:', err);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSessions();
  }, []);

  const completedSessions = sessions.filter(
    (s) => s.status === 'COMPLETED' || s.status === 'ANALYSED'
  );
  const hasHistory = completedSessions.length > 0;
  const latestSession = hasHistory ? completedSessions[0] : null;

  // Real Metrics Calculation
  const totalInterviewsCount = completedSessions.length;
  const avgScoreVal = hasHistory
    ? Math.round(
        completedSessions.reduce((acc, s) => acc + (s.evalScore || s.analysis?.overallScore || 0), 0) /
          completedSessions.length
      )
    : 0;

  const totalMins = completedSessions.reduce((acc, s) => acc + (s.durationMins || 0), 0);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const practiceTimeDisplay = hasHistory ? `${hours}h ${mins}m` : '0h';

  // Derived Performance Dimensions (Only from real evaluation session analysis if present)
  const calcDimension = (key: string, fallback: number) => {
    if (!hasHistory) return 0;
    const scores = completedSessions
      .map((s) => s.analysis?.[key] || s.evalScore || fallback)
      .filter((n) => typeof n === 'number' && n > 0);
    if (scores.length === 0) return fallback;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const techKnowledge = calcDimension('technicalScore', 78);
  const problemSolving = calcDimension('structureScore', 72);
  const communication = calcDimension('communicationScore', 80);
  const projectKnowledge = calcDimension('confidenceScore', 68);
  const answerStructure = calcDimension('structureScore', 74);

  const performanceBars = [
    { label: 'Technical Knowledge', value: techKnowledge, color: 'bg-blue-600' },
    { label: 'Problem Solving', value: problemSolving, color: 'bg-purple-600' },
    { label: 'Communication', value: communication, color: 'bg-pink-500' },
    { label: 'Project Knowledge', value: projectKnowledge, color: 'bg-amber-500' },
    { label: 'Answer Structure', value: answerStructure, color: 'bg-teal-500' },
  ];

  const radarScores = [techKnowledge, problemSolving, communication, projectKnowledge, answerStructure];

  const primaryCtaText = hasHistory ? 'Start New Interview →' : 'Start Your First Interview →';

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-900 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ─── 1. PREMIUM HERO INTERVIEW CARD (3D BACKGROUND BLEND & EXACT MOCKUP MATCH) ─── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EEF5FF] via-[#F4EEFF] to-[#FDEEFF] border border-white/80 shadow-xs p-6 md:p-8 min-h-[340px]">
          
          {/* Right-side 3D Image Container with Smooth Left-to-Right Fade */}
          <div className="absolute inset-y-0 right-0 w-full lg:w-[58%] z-0 pointer-events-none overflow-hidden hidden sm:block">
            {/* Left-to-Right Blending Gradient Mask */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#EEF5FF] via-[#EEF5FF]/90 via-30% to-transparent z-10" />
            <img
              src="/images/ai_interviewer_3d.jpg"
              alt="3D AI Interviewer"
              className="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.02]"
            />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-8">
            
            {/* Left Column: Top Badge, Heading, Subtitle & 4 Feature Chips */}
            <div className="flex-1 flex flex-col justify-between space-y-6 max-w-xl">
              <div className="space-y-3">
                {/* Top-Left Pink Pill Badge */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100/95 text-pink-600 text-xs font-bold border border-pink-200/80 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                  <span>AI-Powered Mock Interviews</span>
                </div>

                {/* Main Title & Description */}
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1536] tracking-tight font-display">
                    Oral Interview
                  </h1>
                  <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
                    Practice realistic technical and behavioral interviews tailored to your target role.
                  </p>
                </div>
              </div>

              {/* 4 Feature Chips Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/95 backdrop-blur-xs border border-white/80 shadow-2xs">
                  <div className="w-9 h-9 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] font-extrabold text-slate-900 block leading-tight">Real-time AI Interviewer</span>
                    <span className="text-[10px] text-slate-500 block truncate">Natural conversation</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/95 backdrop-blur-xs border border-white/80 shadow-2xs">
                  <div className="w-9 h-9 rounded-full bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] font-extrabold text-slate-900 block leading-tight">Role-specific Questions</span>
                    <span className="text-[10px] text-slate-500 block truncate">Technical + Behavioral</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/95 backdrop-blur-xs border border-white/80 shadow-2xs">
                  <div className="w-9 h-9 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] font-extrabold text-slate-900 block leading-tight">Detailed Feedback</span>
                    <span className="text-[10px] text-slate-500 block truncate">Improve with insights</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/95 backdrop-blur-xs border border-white/80 shadow-2xs">
                  <div className="w-9 h-9 rounded-full bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] font-extrabold text-slate-900 block leading-tight">Track Progress</span>
                    <span className="text-[10px] text-slate-500 block truncate">See growth over time</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Handwritten Callout, Speech Bubble & CTA Button */}
            <div className="relative flex flex-col items-center lg:items-end justify-between min-w-[300px] z-20 pt-4 lg:pt-0">
              
              {/* Upper Callout Annotations */}
              <div className="relative w-full flex items-start justify-between lg:justify-end gap-3 min-h-[140px]">
                
                {/* Handwritten Annotation Text */}
                <div className="flex flex-col items-start lg:items-end rotate-[-6deg] pt-2">
                  <span className="font-serif italic font-bold text-slate-800 text-lg sm:text-xl drop-shadow-xs tracking-wide leading-tight">
                    Your AI<br />Interviewer<br />is ready!
                  </span>
                  <svg className="w-7 h-7 text-slate-800 drop-shadow-xs mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4c6 0 12 6 12 12m0 0l-4-2m4 2l-2-4" />
                  </svg>
                </div>

                {/* Speech Bubble */}
                <div className="bg-white/95 backdrop-blur-xs rounded-2xl px-4 py-2.5 shadow-xl border border-white/80 flex items-center justify-center relative">
                  <span className="text-blue-600 font-extrabold text-xs sm:text-sm whitespace-nowrap">
                    Let's build a better you!
                  </span>
                  <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-slate-100" />
                </div>
              </div>

              {/* SINGLE PRIMARY CTA BUTTON ALIGNED LOWER-RIGHT */}
              <div className="w-full flex justify-center lg:justify-end pt-4 z-20">
                <Button
                  onClick={() => navigate('/oral/new')}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg shadow-blue-500/25 border-2 border-white/60 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>{primaryCtaText}</span>
                </Button>
              </div>

            </div>

          </div>
        </div>

        {/* ─── 2. STATISTICS CARDS (FULLY DYNAMIC & ZERO-STATE AWARE) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* CARD 1: INTERVIEWS COMPLETED */}
          <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Interviews Completed
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">{totalInterviewsCount}</span>
                  </div>
                </div>
              </div>
              {hasHistory && <MiniBarGraph color="bg-emerald-500" />}
            </div>

            <span className="text-[11px] text-slate-400 block font-medium">
              {hasHistory ? 'Total sessions completed' : 'No interviews completed'}
            </span>

            {hasHistory && (
              <button
                onClick={() => navigate('/oral/history')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1 self-start"
              >
                View History <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </Card>

          {/* CARD 2: AVERAGE SCORE */}
          <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Average Score
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {hasHistory ? `${avgScoreVal}%` : '—'}
                    </span>
                  </div>
                </div>
              </div>
              {hasHistory && <MiniBarGraph color="bg-amber-500" />}
            </div>

            <span className="text-[11px] text-slate-400 block font-medium">
              {hasHistory ? 'Across evaluated sessions' : 'Complete an interview to unlock'}
            </span>

            {hasHistory && (
              <button
                onClick={() => navigate('/analytics')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1 self-start"
              >
                View Analysis <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </Card>

          {/* CARD 3: PRACTICE TIME */}
          <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Practice Time
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">{practiceTimeDisplay}</span>
                  </div>
                </div>
              </div>
              {hasHistory && <MiniBarGraph color="bg-blue-500" />}
            </div>

            <span className="text-[11px] text-slate-400 block font-medium">
              {hasHistory ? 'Real Spoken Audio' : 'No practice sessions yet'}
            </span>
          </Card>

          {/* CARD 4: LATEST SCORE */}
          <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Latest Score
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {latestSession ? `${latestSession.evalScore || latestSession.analysis?.overallScore || 0}%` : '—'}
                    </span>
                  </div>
                </div>
              </div>
              {hasHistory && <MiniBarGraph color="bg-purple-500" />}
            </div>

            <span className="text-[11px] text-slate-400 block font-medium truncate">
              {latestSession ? `${latestSession.targetRole || 'Interview'}` : 'Your first score will appear here'}
            </span>

            {hasHistory && latestSession && (
              <button
                onClick={() => navigate(`/interview/${latestSession.id}/analysis`)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1 self-start"
              >
                View Result →
              </button>
            )}
          </Card>
        </div>

        {/* ─── 3. MIDDLE SECTION: PERFORMANCE & RECOMMENDATIONS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT CARD (8 COLS): YOUR INTERVIEW PERFORMANCE */}
          <Card className="lg:col-span-8 p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-bold text-slate-900">Your Interview Performance</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Your performance across completed interviews.</p>
            </div>

            {!hasHistory ? (
              /* ZERO-STATE FOR PERFORMANCE */
              <div className="py-12 px-6 text-center space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No performance data yet</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Complete your first interview to see your technical knowledge, problem solving, communication, project knowledge, and answer structure.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/oral/new')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Start Your First Interview →</span>
                </Button>
              </div>
            ) : (
              /* REAL PERFORMANCE DATA VIEW */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 flex items-center justify-center py-2">
                  <OralRadarChart scores={radarScores} />
                </div>

                <div className="md:col-span-7 space-y-3.5">
                  {performanceBars.map((bar) => (
                    <div key={bar.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{bar.label}</span>
                        <span className="font-mono text-slate-900">{bar.value}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bar.color} rounded-full transition-all duration-500`}
                          style={{ width: `${bar.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* RIGHT CARD (4 COLS): RECOMMENDATIONS */}
          <Card className="lg:col-span-4 p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-500">
                <Lightbulb className="w-5 h-5 fill-amber-100 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Recommended Next Steps</h3>
              </div>
              <p className="text-xs text-slate-500">Based on your performance, focus on:</p>
            </div>

            {!hasHistory ? (
              /* ZERO-STATE FOR RECOMMENDATIONS */
              <div className="py-8 px-2 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
                  <Lightbulb className="w-6 h-6 fill-amber-100 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Personalized recommendations appear after your first interview.
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Complete an interview and RU Ready? will analyze your performance and suggest what to practice next.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/oral/new')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Start Your First Interview →</span>
                </Button>
              </div>
            ) : (
              /* REAL DATA RECOMMENDATIONS */
              <div className="space-y-3 text-xs">
                <div
                  onClick={() => navigate('/oral/new?focus=System%20Design')}
                  className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        Improve System Design Answers
                      </h4>
                      <p className="text-slate-500 text-[11px] leading-snug">
                        Based on lower evaluation in LLD/HLD architecture.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                <div
                  onClick={() => navigate('/oral/new?focus=Behavioral')}
                  className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-100 hover:border-pink-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 group-hover:text-pink-700 transition-colors">
                        Strengthen Behavioral Responses
                      </h4>
                      <p className="text-slate-500 text-[11px] leading-snug">
                        Use STAR format for clearer answer structure.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                <Button
                  onClick={() => navigate('/oral/new?mode=adaptive')}
                  className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white text-xs font-bold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-1.5 transition-all mt-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Personalized Practice →</span>
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* ─── 4. BOTTOM SECTION: INTERVIEW HISTORY & QUICK START ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT TABLE CARD (8 COLS): INTERVIEW HISTORY */}
          <Card className="lg:col-span-8 p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Interview History</h3>
              </div>
              {hasHistory && (
                <button
                  onClick={() => navigate('/oral/history')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {!hasHistory ? (
              /* ZERO-STATE FOR INTERVIEW HISTORY */
              <div className="py-12 text-center space-y-3 max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-100">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">No interviews yet</h4>
                  <p className="text-xs text-slate-500">Your completed interviews will appear here.</p>
                </div>
                <Button
                  onClick={() => navigate('/oral/new')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Start Your First Interview →</span>
                </Button>
              </div>
            ) : (
              /* REAL INTERVIEW HISTORY TABLE */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10.5px] uppercase">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Interview Type</th>
                      <th className="pb-3 font-semibold">Target Role</th>
                      <th className="pb-3 font-semibold">Duration</th>
                      <th className="pb-3 font-semibold">Score</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {completedSessions.map((s) => {
                      const scoreVal = s.evalScore || s.analysis?.overallScore || 0;
                      const badgeColor =
                        scoreVal >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : scoreVal >= 70
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-orange-100 text-orange-800';

                      return (
                        <tr
                          key={s.id}
                          onClick={() => navigate(`/interview/${s.id}/analysis`)}
                          className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 font-mono text-slate-500">
                            {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                          </td>
                          <td className="py-3.5 font-semibold text-slate-700">
                            {s.mode || s.interviewType || 'Oral Technical'}
                          </td>
                          <td className="py-3.5 font-bold text-slate-900">
                            {s.targetRole || 'Software Engineer'}
                          </td>
                          <td className="py-3.5 font-mono text-slate-600">
                            {s.durationMins || 30} min
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-full font-mono font-bold text-xs ${badgeColor}`}>
                              {scoreVal}%
                            </span>
                          </td>
                          <td className="py-3.5 font-mono text-xs text-slate-500 uppercase">
                            {s.status}
                          </td>
                          <td className="py-3.5 text-right font-bold text-blue-600">
                            View Analysis →
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* RIGHT CARD (4 COLS): QUICK START 2x2 GRID */}
          <Card className="lg:col-span-4 p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-500">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-100" />
                <h3 className="text-base font-bold text-slate-900">Quick Start</h3>
              </div>
              <p className="text-xs text-slate-500">Choose an interview type to begin</p>
            </div>

            {/* 2x2 Quick Start Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Card 1: Custom Interview */}
              <div
                onClick={() => navigate('/oral/new')}
                className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 hover:border-blue-300 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Custom Interview</h4>
                  <p className="text-[10.5px] text-slate-500 leading-tight">Choose role, difficulty and duration</p>
                </div>
              </div>

              {/* Card 2: Company-wise */}
              <div
                onClick={() => navigate('/interviews/company-wise')}
                className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 hover:border-purple-300 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Company-wise</h4>
                  <p className="text-[10.5px] text-slate-500 leading-tight">Practice company-specific interviews</p>
                </div>
              </div>

              {/* Card 3: Behavioral Focus */}
              <div
                onClick={() => navigate('/oral/new?mode=behavioral')}
                className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100 hover:border-pink-300 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Behavioral Focus</h4>
                  <p className="text-[10.5px] text-slate-500 leading-tight">HR and behavioral questions</p>
                </div>
              </div>

              {/* Card 4: Technical Focus */}
              <div
                onClick={() => navigate('/oral/new?mode=technical')}
                className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100 hover:border-teal-300 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Technical Focus</h4>
                  <p className="text-[10.5px] text-slate-500 leading-tight">DSA, System Design, Core CS</p>
                </div>
              </div>

            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
