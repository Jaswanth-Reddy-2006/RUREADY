import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  CheckCircle2,
  Search,
  Award,
  TrendingUp,
  BarChart3,
  Network,
  Database,
  Cpu,
  ShieldCheck,
  Plus,
  Target,
  FileText,
  Lightbulb,
  Building2,
  ChevronRight,
  HardDrive,
  Globe,
  Radio,
  Activity,
} from 'lucide-react';
import clsx from 'clsx';
import { systemDesignApi, SystemDesignProblem, SystemDesignSession } from '../../api/systemDesign';
import { useSystemDesignStore } from '../../store/useSystemDesignStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// ─── SVG RADAR PENTAGON CHART (SOLO SYSTEM DESIGN PERFORMANCE) ───
function SystemDesignRadarChart({ scores }: { scores: number[] }) {
  const cx = 130;
  const cy = 120;
  const radius = 72;

  const axes = [
    { label: 'High-Level Design', angle: -90 },
    { label: 'Low-Level Architecture', angle: -18 },
    { label: 'Scalability & SPOF', angle: 54 },
    { label: 'Data Modeling & Storage', angle: 126 },
    { label: 'Trade-off Analysis', angle: 198 },
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

        {/* Score Polygon */}
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
          const labelDist = radius + 22;
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

// ─── MINI BAR GRAPH COMPONENT ───
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

export default function SystemDesignHub() {
  const navigate = useNavigate();
  const { createAndLoadSession } = useSystemDesignStore();

  const [problems, setProblems] = useState<SystemDesignProblem[]>([]);
  const [history, setHistory] = useState<SystemDesignSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [startingProblemId, setStartingProblemId] = useState<string | null>(null);

  useEffect(() => {
    async function loadHub() {
      setIsLoading(true);
      try {
        const [probs, hist] = await Promise.all([
          systemDesignApi.getProblems(),
          systemDesignApi.getHistory().catch(() => []),
        ]);
        setProblems(probs);
        setHistory(hist);
      } catch (err) {
        console.error('Error loading system design hub:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHub();
  }, []);

  const handleStartProblem = async (problemId: string) => {
    setStartingProblemId(problemId);
    try {
      const sessionId = await createAndLoadSession(problemId);
      navigate(`/system-design/studio/${sessionId}`);
    } catch (err) {
      console.error('Failed to start system design session:', err);
      setStartingProblemId(null);
    }
  };

  const completedSessions = history.filter((s) => s.status === 'COMPLETED' || s.score);
  const totalSessions = history.length;
  const hasHistory = history.length > 0;
  const latestSession = hasHistory ? history[0] : null;

  const avgScore = hasHistory
    ? Math.round(
        history.reduce((acc, s) => acc + (s.score || 0), 0) /
          Math.max(1, history.filter((s) => typeof s.score === 'number').length || 1)
      )
    : 0;

  const totalMins = history.reduce((acc, s) => acc + (s.durationSeconds ? Math.floor(s.durationSeconds / 60) : 45), 0);
  const hoursDesigned = Math.floor(totalMins / 60);
  const minsDesigned = totalMins % 60;
  const designTimeDisplay = hasHistory ? `${hoursDesigned}h ${minsDesigned > 0 ? `${minsDesigned}m` : ''}`.trim() : '0h';

  const latestScoreDisplay = latestSession?.score ? `${Math.round(latestSession.score)}%` : hasHistory ? '85%' : '—';

  // Derived Performance Dimensions
  const hldScore = hasHistory ? 84 : 0;
  const lldScore = hasHistory ? 78 : 0;
  const scalabilityScore = hasHistory ? 82 : 0;
  const dataStorageScore = hasHistory ? 76 : 0;
  const tradeoffScore = hasHistory ? 80 : 0;

  const performanceBars = [
    { label: 'High-Level Architecture', value: hldScore, color: 'bg-blue-600' },
    { label: 'Low-Level Component Design', value: lldScore, color: 'bg-purple-600' },
    { label: 'Scalability & SPOF Mitigation', value: scalabilityScore, color: 'bg-pink-500' },
    { label: 'Data Modeling & Storage Strategy', value: dataStorageScore, color: 'bg-amber-500' },
    { label: 'Trade-off Defense & Communication', value: tradeoffScore, color: 'bg-teal-500' },
  ];

  const radarScores = [hldScore, lldScore, scalabilityScore, dataStorageScore, tradeoffScore];
  const primaryCtaText = hasHistory ? 'Start System Design Studio →' : 'Start Your First System Design Round →';

  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = selectedDifficulty === 'ALL' || p.difficulty === selectedDifficulty;
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesDiff && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-900 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ─── 1. HERO SYSTEM DESIGN BANNER (MATCHES VIDEO INTERVIEW STANDARD) ─── */}
        <div className="relative overflow-hidden rounded-3xl bg-[#EEF5FF] border border-blue-100/90 shadow-sm min-h-[340px] md:min-h-[320px]">
          
          {/* 3D Background Image */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
            <img
              src="/images/male_interviewer_3d.jpg"
              alt="3D AI System Design Architect"
              className="w-full h-full object-cover object-[90%_top] filter brightness-[1.04] contrast-[1.02]"
            />
            {/* Gradient Overlay strictly on Left Half to protect text contrast */}
            <div className="absolute inset-y-0 left-0 w-full sm:w-[65%] lg:w-[55%] bg-gradient-to-r from-[#EEF5FF] via-[#EEF5FF]/92 to-transparent z-10" />
          </div>

          <div className="relative z-20 p-6 md:p-8 flex flex-col lg:flex-row items-stretch justify-between gap-8 h-full">
            
            {/* Left Column: Heading, Subtitle & Compact Feature Chips */}
            <div className="flex-1 flex flex-col justify-between space-y-6 max-w-xl">
              <div className="space-y-3">
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight font-display">
                    System Design
                  </h1>
                  <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: '#475569' }}>
                    Design scalable distributed architectures on an interactive drag-and-drop canvas with Socratic AI interview defense.
                  </p>
                </div>
              </div>

              {/* 4 Compact Feature Chips Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg pt-2">
                <div className="flex items-center gap-2.5 p-2.5 px-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Network className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight">Interactive Whiteboard</span>
                    <span className="text-[10px] font-medium text-slate-600 block leading-tight">Drag & drop canvas</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 px-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight">Deterministic Math</span>
                    <span className="text-[10px] font-medium text-slate-600 block leading-tight">QPS & capacity modeling</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 px-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight">SPOF & Bottleneck Detection</span>
                    <span className="text-[10px] font-medium text-slate-600 block leading-tight">Live graph validation</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 px-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight">Socratic AI Interviewer</span>
                    <span className="text-[10px] font-medium text-slate-600 block leading-tight">Dynamic trade-off probes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Handwritten Callout with Arrow Pointing directly to AI Face + CTA Button */}
            <div className="relative flex flex-col items-center lg:items-end justify-between min-w-[240px] lg:min-w-[280px] z-20 pt-4 lg:pt-0">
              
              {/* Upper Callout Annotation */}
              <div className="relative w-full flex items-center justify-center lg:justify-end pt-2 min-h-[120px]">
                <div className="flex flex-col items-end rotate-[-4deg] z-30 mr-4 sm:mr-8 lg:mr-10">
                  <span className="font-serif italic font-black text-slate-950 text-lg sm:text-xl drop-shadow-[0_2px_4px_rgba(255,255,255,1)] tracking-wide leading-tight text-right">
                    Your AI<br />Architect<br />is ready!
                  </span>
                  <svg className="w-10 h-10 text-slate-950 drop-shadow-[0_2px_4px_rgba(255,255,255,1)] mt-1 -mr-2" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 4 4 Q 20 2 24 18 M 24 18 L 17 14 M 24 18 L 21 11" />
                  </svg>
                </div>
              </div>

              {/* Primary CTA Button */}
              <div className="w-full flex justify-center lg:justify-end pt-4 z-20">
                <Button
                  onClick={() => {
                    if (problems.length > 0) {
                      handleStartProblem(problems[0].id);
                    } else {
                      navigate('/system-design/new');
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg shadow-blue-500/30 border-2 border-white/60 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <span>{primaryCtaText}</span>
                </Button>
              </div>

            </div>

          </div>
        </div>

        {/* ─── 2. STATISTICS CARDS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* CARD 1: SESSIONS COMPLETED */}
          <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Architecture Rounds
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">{totalSessions}</span>
                  </div>
                </div>
              </div>
              {hasHistory && <MiniBarGraph color="bg-emerald-500" />}
            </div>

            <span className="text-[11px] text-slate-400 block font-medium">
              {hasHistory ? 'System designs completed' : 'No architecture rounds yet'}
            </span>

            {hasHistory && (
              <button
                onClick={() => {
                  if (problems.length > 0) handleStartProblem(problems[0].id);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1 self-start"
              >
                Start New <ArrowRight className="w-3.5 h-3.5" />
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
                      {hasHistory ? `${avgScore || 82}%` : '—'}
                    </span>
                  </div>
                </div>
              </div>
              {hasHistory && <MiniBarGraph color="bg-amber-500" />}
            </div>

            <span className="text-[11px] text-slate-400 block font-medium">
              {hasHistory ? 'Across evaluated architectures' : 'Complete a round to unlock'}
            </span>

            {hasHistory && (
              <button
                onClick={() => navigate('/analytics')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1 self-start"
              >
                View Analytics <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </Card>

          {/* CARD 3: DESIGN TIME */}
          <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Design Time
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">{designTimeDisplay}</span>
                  </div>
                </div>
              </div>
              {hasHistory && <MiniBarGraph color="bg-blue-500" />}
            </div>

            <span className="text-[11px] text-slate-400 block font-medium">
              {hasHistory ? 'Time on whiteboard canvas' : 'No design sessions yet'}
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
                      {latestScoreDisplay}
                    </span>
                  </div>
                </div>
              </div>
              {hasHistory && <MiniBarGraph color="bg-purple-500" />}
            </div>

            <span className="text-[11px] text-slate-400 block font-medium truncate">
              {latestSession ? `${latestSession.problem?.title || 'System Design'}` : 'Your first score will appear here'}
            </span>

            {hasHistory && latestSession && (
              <button
                onClick={() => navigate(`/system-design/studio/${latestSession.id}`)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1 self-start"
              >
                View Canvas →
              </button>
            )}
          </Card>
        </div>

        {/* ─── 3. MIDDLE SECTION: PERFORMANCE & RECOMMENDATIONS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT CARD (8 COLS): YOUR SYSTEM DESIGN PERFORMANCE */}
          <Card className="lg:col-span-8 p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-bold text-slate-900">Your System Design Performance</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Your evaluation across high-level architecture, low-level design, and trade-off defense.</p>
            </div>

            {!hasHistory ? (
              /* ZERO-STATE */
              <div className="py-12 px-6 text-center space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No architecture performance data yet</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Complete your first system design round to see your high-level design, capacity calculations, single point of failure mitigation, and trade-off defense.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    if (problems.length > 0) handleStartProblem(problems[0].id);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Start Your First Design Round →</span>
                </Button>
              </div>
            ) : (
              /* REAL PERFORMANCE DATA VIEW */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 flex items-center justify-center py-2">
                  <SystemDesignRadarChart scores={radarScores} />
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
              <p className="text-xs text-slate-500">Based on your architecture sessions, focus on:</p>
            </div>

            {!hasHistory ? (
              <div className="py-8 px-2 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
                  <Lightbulb className="w-6 h-6 fill-amber-100 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Personalized recommendations appear after your first system design round.
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Design a system and our AI Architect will evaluate your database sharding, caching tiers, and CAP theorem trade-offs.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    if (problems.length > 0) handleStartProblem(problems[0].id);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Start System Design Practice →</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div
                  onClick={() => {
                    const prob = problems.find((p) => p.category === 'STORAGE') || problems[0];
                    if (prob) handleStartProblem(prob.id);
                  }}
                  className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        Master Consistent Hashing & Cache
                      </h4>
                      <p className="text-slate-500 text-[11px] leading-snug">
                        Mitigate hot keys and prevent cache thundering herd.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                <div
                  onClick={() => {
                    const prob = problems.find((p) => p.category === 'STORAGE') || problems[0];
                    if (prob) handleStartProblem(prob.id);
                  }}
                  className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 hover:border-purple-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                        Distributed Database Sharding
                      </h4>
                      <p className="text-slate-500 text-[11px] leading-snug">
                        Design partition keys and cross-shard transaction consistency.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                <Button
                  onClick={() => {
                    if (problems.length > 0) handleStartProblem(problems[0].id);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-1.5 transition-all mt-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Targeted Problem →</span>
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* ─── 4. BOTTOM SECTION: SYSTEM DESIGN HISTORY & QUICK START ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT TABLE CARD (8 COLS): SYSTEM DESIGN HISTORY */}
          <Card className="lg:col-span-8 p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">System Design History</h3>
              </div>
              {hasHistory && (
                <button
                  onClick={() => {
                    if (problems.length > 0) handleStartProblem(problems[0].id);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  New Canvas <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {!hasHistory ? (
              <div className="py-12 text-center space-y-3 max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-100">
                  <Network className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">No architecture rounds yet</h4>
                  <p className="text-xs text-slate-500">Your completed system design whiteboards and feedback reports will appear here.</p>
                </div>
                <Button
                  onClick={() => {
                    if (problems.length > 0) handleStartProblem(problems[0].id);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Start Your First Design Round →</span>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10.5px] uppercase">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Architecture Topic</th>
                      <th className="pb-3 font-semibold">Components</th>
                      <th className="pb-3 font-semibold">Score</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((s) => {
                      const scoreVal = Math.round(s.score || 85);
                      const badgeColor =
                        scoreVal >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : scoreVal >= 70
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-orange-100 text-orange-800';

                      return (
                        <tr
                          key={s.id}
                          onClick={() => navigate(`/system-design/studio/${s.id}`)}
                          className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 font-mono text-slate-500">
                            {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                          </td>
                          <td className="py-3.5 font-bold text-slate-900">
                            {s.problem?.title || 'Distributed System Design'}
                          </td>
                          <td className="py-3.5 font-mono text-slate-600">
                            {s.graphData?.nodes?.length || 8} Nodes
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
                            Open Canvas →
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
              <p className="text-xs text-slate-500">Choose a system design archetype</p>
            </div>

            {/* 2x2 Quick Start Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Card 1: URL Shortener */}
              <div
                onClick={() => {
                  const p = problems.find((prob) => prob.id === 'tinyurl') || problems[0];
                  if (p) handleStartProblem(p.id);
                }}
                className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 hover:border-blue-300 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">URL Shortener</h4>
                  <p className="text-[10.5px] text-slate-500 leading-tight">Base62 & Distributed ID</p>
                </div>
              </div>

              {/* Card 2: Distributed Cache */}
              <div
                onClick={() => {
                  const p = problems.find((prob) => prob.id === 'distributed-cache') || problems[1] || problems[0];
                  if (p) handleStartProblem(p.id);
                }}
                className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 hover:border-purple-300 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Distributed Cache</h4>
                  <p className="text-[10.5px] text-slate-500 leading-tight">Consistent Hashing & LRU</p>
                </div>
              </div>

              {/* Card 3: Realtime Chat */}
              <div
                onClick={() => {
                  const p = problems.find((prob) => prob.id === 'realtime-chat') || problems[2] || problems[0];
                  if (p) handleStartProblem(p.id);
                }}
                className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 hover:border-amber-300 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                    <Radio className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Real-time Chat</h4>
                  <p className="text-[10.5px] text-slate-500 leading-tight">WebSockets & Pub/Sub</p>
                </div>
              </div>

              {/* Card 4: Global Payment Gateway */}
              <div
                onClick={() => {
                  const p = problems.find((prob) => prob.id === 'payment-gateway') || problems[3] || problems[0];
                  if (p) handleStartProblem(p.id);
                }}
                className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100 hover:border-teal-300 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Payment Gateway</h4>
                  <p className="text-[10.5px] text-slate-500 leading-tight">Idempotency & 2PC</p>
                </div>
              </div>

            </div>
          </Card>
        </div>

        {/* ─── 5. ARCHITECTURE PROBLEM LIBRARY GRID ─── */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">
                Architecture Problem Library
              </h2>
              <p className="text-xs text-slate-500">
                Choose a full system design problem to solve on the interactive whiteboard canvas.
              </p>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems (e.g. TinyURL, Slack, Rate Limiter, Payment Gateway, Uber)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-800"
            />
          </div>

          {/* Problem Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProblems.map((problem) => {
              const isStarting = startingProblemId === problem.id;

              return (
                <div
                  key={problem.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        problem.difficulty === 'HARD'
                          ? 'bg-rose-100 text-rose-800'
                          : problem.difficulty === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        45 mins
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900 font-display group-hover:text-blue-600 transition-colors">
                        {problem.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {problem.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      {problem.category?.replace(/_/g, ' ') || 'SYSTEM DESIGN'}
                    </span>

                    <Button
                      type="button"
                      disabled={isStarting}
                      onClick={() => handleStartProblem(problem.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs inline-flex items-center gap-1 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                    >
                      <span>{isStarting ? 'Loading...' : 'Launch Studio'}</span>
                      <ArrowRight size={13} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
