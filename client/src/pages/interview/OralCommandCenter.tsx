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
  TrendingDown,
} from 'lucide-react';
import apiClient from '../../api/client';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

// ─── RADAR PENTAGON CHART COMPONENT ───
function OralRadarChart({
  yourScores = [78, 72, 80, 68, 74],
  peerScores = [70, 65, 75, 62, 70],
}: {
  yourScores?: number[];
  peerScores?: number[];
}) {
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

  const yourPoints = axes.map((a, idx) => getPoint(yourScores[idx] || 75, a.angle));
  const peerPoints = axes.map((a, idx) => getPoint(peerScores[idx] || 70, a.angle));

  const yourPath = yourPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const peerPath = peerPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

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

        {/* Peer Score Polygon (Dashed Pink) */}
        <path
          d={peerPath}
          fill="rgba(236, 72, 153, 0.08)"
          stroke="#EC4899"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Your Score Polygon (Solid Blue) */}
        <path
          d={yourPath}
          fill="rgba(59, 130, 246, 0.18)"
          stroke="#3B82F6"
          strokeWidth="2.5"
        />

        {/* Data Points */}
        {yourPoints.map((p, i) => (
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

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 font-sans pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          <span className="text-[11px]">Your Score</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block border border-dashed border-pink-600" />
          <span className="text-[11px]">Average Peer</span>
        </div>
      </div>
    </div>
  );
}

// ─── MINI BAR GRAPH COMPONENT FOR STAT CARDS ───
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

// ─── MINI LINE GRAPH COMPONENT FOR STAT CARDS ───
function MiniLineGraph() {
  return (
    <div className="w-16 h-8 shrink-0 flex items-center">
      <svg viewBox="0 0 60 25" className="w-full h-full overflow-visible">
        <path
          d="M 0 20 Q 15 5 30 15 T 60 5"
          fill="none"
          stroke="#EC4899"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
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
  const latestSession = completedSessions.length > 0 ? completedSessions[0] : null;

  const totalInterviews = completedSessions.length || 12;
  const avgScore = completedSessions.length
    ? Math.round(
        completedSessions.reduce((acc, s) => acc + (s.evalScore || s.analysis?.overallScore || 76), 0) /
          completedSessions.length
      )
    : 76;

  const totalMins = completedSessions.reduce((acc, s) => acc + (s.durationMins || 20), 0);
  const hours = completedSessions.length > 0 ? Math.floor(totalMins / 60) : 8;
  const mins = completedSessions.length > 0 ? totalMins % 60 : 4;
  const practiceTimeDisplay = `${hours}.${mins}h`;

  const performanceBars = [
    { label: 'Technical Knowledge', value: 78, change: '+ 12%', color: 'bg-blue-600' },
    { label: 'Problem Solving', value: 72, change: '+ 8%', color: 'bg-purple-600' },
    { label: 'Communication', value: 80, change: '+ 15%', color: 'bg-pink-500' },
    { label: 'Project Knowledge', value: 68, change: '+ 10%', color: 'bg-amber-500' },
    { label: 'Answer Structure', value: 74, change: '+ 9%', color: 'bg-teal-500' },
  ];

  // Default display sessions if none yet recorded
  const displaySessions =
    completedSessions.length > 0
      ? completedSessions
      : [
          {
            id: 'demo-1',
            createdAt: '2026-09-20',
            targetRole: 'Software Engineer (Behavioral)',
            durationMins: 30,
            score: 82,
            feedback: 'Good communication and structured answers...',
          },
          {
            id: 'demo-2',
            createdAt: '2026-09-17',
            targetRole: 'Frontend Developer (Technical)',
            durationMins: 30,
            score: 74,
            feedback: 'Solid basics, work on performance optimization...',
          },
          {
            id: 'demo-3',
            createdAt: '2026-09-14',
            targetRole: 'SDE Intern (Mixed)',
            durationMins: 45,
            score: 68,
            feedback: 'Improve problem breakdown speed...',
          },
        ];

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-900 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ─── 1. HERO BANNER WITH STYLIZED AVATAR ─── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-pink-50/70 border border-blue-100 shadow-xs p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-4 max-w-2xl">
            {/* Top Pink Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-pink-700 text-xs font-bold font-mono border border-pink-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>AI-Powered Mock Interviews</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
                Oral Interview
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-medium">
                Practice realistic technical and behavioral interviews tailored to your target role.
              </p>
            </div>

            {/* 4 Feature Pills Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-slate-200/60 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-slate-900 block leading-none">Real-time AI</span>
                  <span className="text-[9.5px] text-slate-500 truncate block">Natural conversations</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-slate-200/60 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-slate-900 block leading-none">Role-specific</span>
                  <span className="text-[9.5px] text-slate-500 truncate block">Tech + Behavioral</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-slate-200/60 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-slate-900 block leading-none">Detailed Feedback</span>
                  <span className="text-[9.5px] text-slate-500 truncate block">Improve with insights</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-slate-200/60 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-slate-900 block leading-none">Track Progress</span>
                  <span className="text-[9.5px] text-slate-500 truncate block">See growth over time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Stylized Avatar Graphic + Callout Arrow */}
          <div className="flex flex-col items-center justify-center shrink-0 relative pt-2 md:pt-0">
            <div className="relative">
              {/* Character Avatar Container */}
              <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center relative">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                    alt="AI Interviewer Ava"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Handwritten "Let's Get Started!" Annotation */}
              <div className="absolute -top-3 -left-12 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-2xl border border-pink-200 shadow-sm transform -rotate-6">
                <span className="text-xs font-semibold text-pink-600 font-mono tracking-tight flex items-center gap-1">
                  Let's Get Started! <span>⤵</span>
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <Button
              onClick={() => navigate('/oral/new')}
              className="mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm px-7 py-3.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Start New Interview</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

        </div>

        {/* ─── 2. FOUR SUMMARY METRIC CARDS ─── */}
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
                    <span className="text-2xl font-extrabold text-slate-900">{totalInterviews}</span>
                    <span className="text-[11px] font-bold text-emerald-600 font-mono">↑ +3 this week</span>
                  </div>
                </div>
              </div>
              <MiniBarGraph color="bg-emerald-500" />
            </div>

            <button
              onClick={() => navigate('/oral/history')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1"
            >
              View History <ArrowRight className="w-3.5 h-3.5" />
            </button>
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
                    <span className="text-2xl font-extrabold text-slate-900">{avgScore}%</span>
                    <span className="text-[11px] font-bold text-emerald-600 font-mono">↑ +11%</span>
                  </div>
                </div>
              </div>
              <MiniLineGraph />
            </div>

            <button
              onClick={() => navigate('/analytics')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1"
            >
              View Analysis <ArrowRight className="w-3.5 h-3.5" />
            </button>
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
                    <span className="text-[11px] font-bold text-emerald-600 font-mono">↑ +2.1h this week</span>
                  </div>
                </div>
              </div>
              <MiniBarGraph color="bg-blue-500" />
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-purple-600 font-bold pt-1">
              <span>|||</span>
              <span>Real Spoken Audio</span>
            </div>
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
                      {latestSession ? `${latestSession.evalScore || latestSession.analysis?.overallScore || 82}%` : '--'}
                    </span>
                  </div>
                </div>
              </div>
              <MiniBarGraph color="bg-purple-500" />
            </div>

            <span className="text-[11px] text-slate-400 block truncate">
              {latestSession ? 'Recent Interview' : 'No interview completed'}
            </span>

            <button
              onClick={() => (latestSession ? navigate(`/interview/${latestSession.id}/analysis`) : navigate('/oral/new'))}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1"
            >
              {latestSession ? 'View Result →' : 'Take your first interview →'}
            </button>
          </Card>
        </div>

        {/* ─── 3. MIDDLE SECTION: RADAR PERFORMANCE & RECOMMENDED NEXT STEPS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT CARD (8 COLS): YOUR INTERVIEW PERFORMANCE */}
          <Card className="lg:col-span-8 p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h2 className="text-base font-bold text-slate-900">Your Interview Performance</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Performance aggregated across evaluated sessions.</p>
              </div>

              <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none">
                <option>Last 6 Interviews</option>
                <option>Last 10 Interviews</option>
                <option>All-Time Sessions</option>
              </select>
            </div>

            {/* Content: Pentagon Radar Chart on Left + 5 Progress Bars on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Radar Pentagon */}
              <div className="md:col-span-5 flex items-center justify-center py-2">
                <OralRadarChart />
              </div>

              {/* 5 Horizontal Progress Bars */}
              <div className="md:col-span-7 space-y-3.5">
                {performanceBars.map((bar) => (
                  <div key={bar.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800">{bar.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-900">{bar.value}%</span>
                        <span className="text-[11px] font-mono text-emerald-600 font-bold">{bar.change}</span>
                      </div>
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
          </Card>

          {/* RIGHT CARD (4 COLS): RECOMMENDED NEXT STEPS */}
          <Card className="lg:col-span-4 p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-500">
                <Lightbulb className="w-5 h-5 fill-amber-100 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Recommended Next Steps</h3>
              </div>
              <p className="text-xs text-slate-500">Based on your performance, focus on:</p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Item 1: System Design */}
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
                      Your score is 62%. Practice LLD and HLD concepts.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {/* Item 2: Behavioral STAR */}
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
                      Use STAR format for better structure.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {/* Item 3: Company Specific */}
              <div
                onClick={() => navigate('/interviews/company-wise')}
                className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 hover:border-teal-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      Practice Company-specific Questions
                    </h4>
                    <p className="text-slate-500 text-[11px] leading-snug">
                      Try interview sets from your target companies.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </div>

            {/* Bottom Gradient Button */}
            <Button
              onClick={() => navigate('/oral/new?mode=adaptive')}
              className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white text-xs font-bold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Personalized Practice</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>

        {/* ─── 4. BOTTOM SECTION: RECENT INTERVIEWS & QUICK START ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT TABLE CARD (8 COLS): RECENT INTERVIEWS */}
          <Card className="lg:col-span-8 p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Recent Interviews</h3>
              </div>
              <button
                onClick={() => navigate('/oral/history')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10.5px] uppercase">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Role / Focus Area</th>
                    <th className="pb-3 font-semibold">Duration</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Feedback</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displaySessions.map((s) => {
                    const scoreVal = s.score || s.evalScore || s.analysis?.overallScore || 80;
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
                          {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Sep 20, 2026'}
                        </td>
                        <td className="py-3.5 font-bold text-slate-900">
                          {s.targetRole || 'Software Engineer (Behavioral)'}
                        </td>
                        <td className="py-3.5 font-mono text-slate-600">
                          {s.durationMins || 30} min
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-1 rounded-full font-mono font-bold text-xs ${badgeColor}`}>
                            {scoreVal}%
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-500 max-w-xs truncate">
                          {s.feedback || 'Good communication and structured answers.'}
                        </td>
                        <td className="py-3.5 text-right">
                          <ChevronRight className="w-4 h-4 text-slate-400 inline-block" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
                  <p className="text-[10.5px] text-slate-500 leading-tight">Set role, difficulty, duration</p>
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
                  <p className="text-[10.5px] text-slate-500 leading-tight">Practice for specific companies</p>
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
                  <p className="text-[10.5px] text-slate-500 leading-tight">HR & behavioral questions</p>
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
                  <p className="text-[10.5px] text-slate-500 leading-tight">DSA, System Design, Core</p>
                </div>
              </div>

            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
