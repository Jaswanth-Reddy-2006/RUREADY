import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Award, Calendar, ChevronRight, Sparkles, 
  Search, ArrowRight, Target, Zap, Brain, MessageSquare, Code2,
  Briefcase, Building2, Layers, FileText, Video, Compass, Users,
  CheckCircle2, Clock, Check, TrendingUp, ShieldCheck, Flame, ArrowUpRight,
  BarChart3, Activity, ListTodo, AlertCircle
} from 'lucide-react';
import apiClient from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const getInitialSessions = () => {
    try {
      const cached = localStorage.getItem('ru_ready_cached_dashboard_sessions');
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return [
      {
        id: 'sess-demo-1',
        targetRole: 'Fullstack Software Engineer',
        targetCompany: 'Google',
        industry: 'Tech',
        durationMins: 30,
        status: 'ANALYSED',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        analysis: {
          overallScore: 82,
          technicalScore: 84,
          communicationScore: 78,
          confidenceScore: 86,
          structureScore: 80,
          readinessVerdict: 'READY',
        },
      },
      {
        id: 'sess-demo-2',
        targetRole: 'Frontend Developer',
        targetCompany: 'Amazon',
        industry: 'Tech',
        durationMins: 25,
        status: 'ANALYSED',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        analysis: {
          overallScore: 76,
          technicalScore: 78,
          communicationScore: 74,
          confidenceScore: 80,
          structureScore: 72,
          readinessVerdict: 'ALMOST_READY',
        },
      },
    ];
  };

  const getInitialRoadmaps = () => {
    try {
      const cached = localStorage.getItem('ru_ready_cached_dashboard_roadmaps');
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return [];
  };

  const [sessions, setSessions] = useState<any[]>(getInitialSessions);
  const [followedRoadmaps, setFollowedRoadmaps] = useState<any[]>(getInitialRoadmaps);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [profileData, setProfileData] = useState<{
    targetRole?: string;
    seniority?: string;
    targetCompany?: string;
    techStack?: string[];
  }>({});

  // Daily interactive practice agenda items state
  const [agendaTasks, setAgendaTasks] = useState([
    {
      id: 'task-1',
      title: 'STAR Method Drill: Defend Architectural Conflict',
      category: 'BEHAVIORAL AI',
      duration: '10 mins',
      completed: false,
      href: '/interview/new',
      btnText: 'Start Drill',
      color: '#A0006D',
      bg: '#F8EAF4',
    },
    {
      id: 'task-2',
      title: 'Live Monaco Challenge: LRU Cache with O(1) Eviction',
      category: 'CODING LAB',
      duration: '20 mins',
      completed: false,
      href: '/interview/coding/new',
      btnText: 'Open Editor',
      color: '#2459A8',
      bg: '#EFF7FD',
    },
    {
      id: 'task-3',
      title: 'ATS Resume Audit: Fix 2 Missing Distributed Systems Keywords',
      category: 'RESUME ATS',
      duration: '5 mins',
      completed: true,
      href: '/ats',
      btnText: 'Review Bullets',
      color: '#168A62',
      bg: '#E8F5F0',
    },
    {
      id: 'task-4',
      title: 'Roadmap Node 3: PostgreSQL Composite Indexes & B-Trees',
      category: 'ROADMAP NODE',
      duration: '15 mins',
      completed: false,
      href: '/roadmap',
      btnText: 'Master Node',
      color: '#4A8BDF',
      bg: '#EFFAFD',
    },
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ru_ready_onboarding_profile');
      if (stored) {
        setProfileData(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [sessRes, rmRes] = await Promise.allSettled([
          apiClient.get('/interview/sessions', { timeout: 2500 }),
          apiClient.get('/roadmap/user', { timeout: 2500 }),
        ]);

        if (!isMounted) return;

        if (sessRes.status === 'fulfilled' && Array.isArray(sessRes.value.data) && sessRes.value.data.length > 0) {
          setSessions(sessRes.value.data);
          try {
            localStorage.setItem('ru_ready_cached_dashboard_sessions', JSON.stringify(sessRes.value.data));
          } catch {
            // ignore
          }
        }

        if (rmRes.status === 'fulfilled' && rmRes.value.data?.data) {
          setFollowedRoadmaps(rmRes.value.data.data);
          try {
            localStorage.setItem('ru_ready_cached_dashboard_roadmaps', JSON.stringify(rmRes.value.data.data));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard telemetry', err);
      }
    }
    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTask = (taskId: string) => {
    setAgendaTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const getVerdictBadge = (verdict?: string) => {
    switch (verdict) {
      case 'STRONG':
        return <Badge variant="success" size="xs" dot>Strong Candidate</Badge>;
      case 'READY':
        return <Badge variant="teal" size="xs" dot>Ready for Hire</Badge>;
      case 'ALMOST_READY':
        return <Badge variant="warning" size="xs" dot>Almost Ready</Badge>;
      default:
        return <Badge variant="error" size="xs" dot>Needs Polish</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#168A62] bg-[#E8F5F0] border-[#168A62]/30';
    if (score >= 65) return 'text-[#4A8BDF] bg-[#EFF7FD] border-[#4A8BDF]/30';
    return 'text-[#D64545] bg-[#FDF0F0] border-[#D64545]/30';
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recent';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculations
  const completedSessions = sessions.filter((s) => s.status === 'ANALYSED' || s.status === 'COMPLETED');
  const completedOralCount = completedSessions.filter((s) => !s.interviewType || s.interviewType !== 'CODING').length;
  const completedCodingCount = completedSessions.filter((s) => s.interviewType === 'CODING').length;

  const totalScore = completedSessions.reduce((acc, s) => acc + (s.analysis?.overallScore || 0), 0);
  const avgScore = completedSessions.length > 0 ? Math.round(totalScore / completedSessions.length) : 0;

  const avgTech = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.analysis?.technicalScore || 0), 0) / completedSessions.length)
    : 78;
  const avgComm = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.analysis?.communicationScore || 0), 0) / completedSessions.length)
    : 72;
  const avgConf = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.analysis?.confidenceScore || 0), 0) / completedSessions.length)
    : 85;
  const avgStruct = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.analysis?.structureScore || 0), 0) / completedSessions.length)
    : 68;

  // Filtered sessions
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      (s.targetRole && s.targetRole.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.targetCompany && s.targetCompany.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.industry && s.industry.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterType === 'ALL') return true;
    if (filterType === 'COMPLETED') return s.status === 'ANALYSED';
    if (filterType === 'IN_PROGRESS') return s.status !== 'ANALYSED';
    return true;
  });

  const completedAgendaCount = agendaTasks.filter((t) => t.completed).length;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        <div className="h-44 bg-white border border-[#DCE7F2] rounded-3xl animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white border border-[#DCE7F2] rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-white border border-[#DCE7F2] rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 text-[#11183D] font-sans selection:bg-[#4A8BDF]/20 selection:text-[#2459A8]">
      
      {/* ─── 1. HERO COMMAND CENTER & READINESS STATUS ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl bg-white p-7 sm:p-9 shadow-sm border border-[#DCE7F2]"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EFF7FD] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-[#F8EAF4]/50 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          
          {/* Candidate Profile Info & Readiness Headline */}
          <div className="space-y-4 max-w-2xl">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30 font-bold font-mono uppercase">
                  ACTIVE CALIBRATION
                </span>
                <span className="text-[#334155] font-medium">•</span>
                <span className="text-[#334155] font-semibold flex items-center gap-1">
                  <Flame size={14} className="text-[#A0006D]" />
                  4-Day Practice Streak
                </span>
              </div>

              <h1 style={{ color: '#0F172A' }} className="font-bold text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight leading-snug">
                Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}
              </h1>
            </div>

            <p style={{ color: '#334155' }} className="text-sm sm:text-base text-[#334155] leading-relaxed font-normal">
              {completedSessions.length === 0
                ? "Your baseline calibration is active. Follow your daily action agenda to hit Tier-1 hire standards."
                : `You have completed ${completedSessions.length} sessions. Current readiness indicates solid technical foundation with room to tighten behavioral STAR metrics.`}
            </p>

            {/* Target Role & Tier Benchmarks & Session Counters */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] font-semibold text-[#0F172A]">
                <Briefcase size={14} className="text-[#4A8BDF]" />
                <span>Target: {profileData.targetRole || 'Fullstack Software Engineer'}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 font-semibold text-blue-900">
                <MessageSquare size={14} className="text-blue-600" />
                <span>Oral Completed: <strong className="font-mono text-blue-700">{completedOralCount}</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 font-semibold text-indigo-900">
                <Code2 size={14} className="text-indigo-600" />
                <span>Coding Completed: <strong className="font-mono text-indigo-700">{completedCodingCount}</strong></span>
              </div>
            </div>
          </div>

          {/* Readiness Score Radial Gauge Card */}
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 bg-[#EFFAFD] p-5 sm:p-6 rounded-2xl border border-[#DCE7F2]">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#DCE7F2]"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#4A8BDF]"
                  strokeDasharray={`${avgScore}, 100`}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span style={{ color: '#0F172A' }} className="text-2xl font-black font-sans leading-none text-[#0F172A]">
                  {avgScore}%
                </span>
                <span className="text-[9px] font-mono font-bold text-[#334155] uppercase mt-0.5">Readiness</span>
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left max-w-[210px]">
              <span className="text-xs font-bold text-[#0F172A] block leading-tight">
                {avgScore >= 80 ? 'Tier-1 Strong Hire Bar' : avgScore >= 65 ? 'Ready for Phone Screens' : 'Calibrating Fundamentals'}
              </span>
              <p className="text-[11px] text-[#334155] leading-snug">
                Uninflated calibration based on STAR rigor & algorithmic proofs.
              </p>
              <Link to="/analytics" className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4A8BDF] hover:underline">
                <span>View Full Breakdown</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

        </div>
      </motion.div>

      {/* ─── 2. TODAY'S ACTION AGENDA & DAILY PRACTICE CHECKLIST ─── */}
      <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCE7F2] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#4A8BDF]/10 text-[#4A8BDF] border border-[#4A8BDF]/20">
              <ListTodo size={18} />
            </div>
            <div>
              <h2 style={{ color: '#0F172A' }} className="text-base sm:text-lg font-bold text-[#0F172A]">
                Today's Calibrated Practice Agenda
              </h2>
              <p style={{ color: '#334155' }} className="text-xs text-[#334155]">
                Curated daily milestones targeting your exact role gaps and upcoming loops.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-[#334155]">Progress:</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#EFFAFD] text-[#4A8BDF] font-mono font-bold border border-[#DCE7F2]">
              {completedAgendaCount} of {agendaTasks.length} Completed
            </span>
          </div>
        </div>

        {/* Task Grid Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {agendaTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 group ${
                task.completed
                  ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-80'
                  : 'bg-white border-[#DCE7F2] hover:border-[#4A8BDF] hover:shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`mt-0.5 h-5 w-5 rounded-lg flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                    task.completed
                      ? 'bg-[#168A62] border-[#168A62] text-white'
                      : 'border-[#CBD5E1] hover:border-[#4A8BDF] bg-white'
                  }`}
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed && <Check size={13} strokeWidth={3} />}
                </button>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ color: task.color, backgroundColor: task.bg }}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider"
                    >
                      {task.category}
                    </span>
                    <span className="text-[11px] font-medium text-[#64748B] flex items-center gap-1">
                      <Clock size={11} /> {task.duration}
                    </span>
                  </div>

                  <p
                    style={{ color: '#0F172A' }}
                    className={`text-xs sm:text-sm font-bold leading-snug ${
                      task.completed ? 'line-through text-[#64748B]' : 'text-[#0F172A]'
                    }`}
                  >
                    {task.title}
                  </p>
                </div>
              </div>

              <Link
                to={task.href}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-[#EFFAFD] hover:bg-[#4A8BDF] text-[#4A8BDF] hover:text-white text-xs font-bold transition-all border border-[#DCE7F2] flex items-center gap-1"
              >
                <span>{task.btnText}</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 3. 4-DIMENSIONAL CANDIDATE COMPETENCY MATRIX ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 style={{ color: '#0F172A' }} className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0F172A] font-display">
            Competency Matrix & Skill Diagnostics
          </h2>
          <span style={{ color: '#64748B' }} className="text-xs text-[#64748B]">Uninflated Socratic Benchmarks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              dimension: 'System Architecture',
              score: avgTech,
              icon: Brain,
              critique: 'Solid on DB schemas; practice Redis XFetch & Kafka concurrency.',
              color: '#2459A8',
              bg: '#EFF7FD',
            },
            {
              dimension: 'Coding & Algorithmic Rigor',
              score: 84,
              icon: Code2,
              critique: 'Strong Tree DP & sliding windows; verify memory leak edge cases.',
              color: '#4A8BDF',
              bg: '#EFFAFD',
            },
            {
              dimension: 'STAR Behavioral Leadership',
              score: avgStruct,
              icon: Target,
              critique: 'Quantify business outcome metrics in Action/Result sentences.',
              color: '#A0006D',
              bg: '#F8EAF4',
            },
            {
              dimension: 'Delivery & Voice Telemetry',
              score: avgConf,
              icon: Zap,
              critique: 'Pacing at 142 WPM (optimal). Eye contact stable across 88% of frames.',
              color: '#168A62',
              bg: '#E8F5F0',
            },
          ].map((item, i) => (
            <motion.div
              key={item.dimension}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="bg-white border border-[#DCE7F2] rounded-2xl p-5 flex flex-col justify-between hover:border-[#4A8BDF] hover:shadow-xs transition-all space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span style={{ color: '#334155' }} className="text-xs font-bold text-[#334155] font-display">
                    {item.dimension}
                  </span>
                  <div style={{ backgroundColor: item.bg, color: item.color }} className="p-1.5 rounded-lg">
                    <item.icon size={16} />
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span style={{ color: '#0F172A' }} className="text-2xl font-black font-sans text-[#0F172A]">
                    {item.score}%
                  </span>
                  <span className="text-xs text-[#64748B] font-mono">/100</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#EFFAFD] h-2 rounded-full overflow-hidden border border-[#DCE7F2]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>

              <p style={{ color: '#475569' }} className="text-[11px] text-[#475569] leading-snug pt-1 border-t border-[#DCE7F2]">
                {item.critique}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── 4. MAIN CONTENT GRID: HISTORY + ACTIVE ROADMAP & COMMUNITY ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Session History Table & Filter */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 sm:p-8 shadow-sm">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#DCE7F2]">
              <div>
                <h2 style={{ color: '#0F172A' }} className="text-lg font-bold font-display text-[#0F172A]">
                  Your Interview History
                </h2>
                <p style={{ color: '#334155' }} className="text-xs text-[#334155] font-body mt-0.5">
                  Track your calibrated performance across simulated technical & behavioral interviews.
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748B]" />
                  <input
                    type="text"
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-[#EFFAFD] border border-[#DCE7F2] rounded-xl text-xs text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#4A8BDF] focus:ring-2 focus:ring-[#4A8BDF]/20 font-body transition-all"
                  />
                </div>

                <div className="flex rounded-xl bg-[#EFFAFD] p-0.5 border border-[#DCE7F2] text-xs font-display">
                  {['ALL', 'COMPLETED', 'IN_PROGRESS'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFilterType(type)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        filterType === type 
                          ? 'bg-white text-[#4A8BDF] shadow-sm font-bold' 
                          : 'text-[#334155] hover:text-[#0F172A]'
                      }`}
                    >
                      {type === 'ALL' ? 'All' : type === 'COMPLETED' ? 'Analyzed' : 'Active'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredSessions.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-[#EFF7FD] border border-[#4A8BDF]/20 flex items-center justify-center text-[#4A8BDF] mx-auto shadow-sm">
                  <Calendar className="h-7 w-7" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 style={{ color: '#0F172A' }} className="text-base font-bold font-display text-[#0F172A]">
                    No sessions recorded yet
                  </h3>
                  <p style={{ color: '#334155' }} className="text-xs text-[#334155] font-body">
                    {searchQuery ? 'No sessions match your search criteria.' : 'Start your first live mock interview to generate uninflated readiness scores.'}
                  </p>
                </div>
                {!searchQuery && (
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Link to="/interview/new">
                      <Button size="md" variant="royal">Start Oral Mock</Button>
                    </Link>
                    <Link to="/interview/coding/new">
                      <Button size="md" variant="secondary">Start Coding Mock</Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-[#DCE7F2]">
                {filteredSessions.map((session) => {
                  const isAnalyzed = session.status === 'ANALYSED';
                  const score = session.analysis?.overallScore ?? 0;
                  const personaName = session.persona ? session.persona.replace('_', ' ') : (session.mode === 'CODING' ? 'CODING TRACK' : 'ORAL TRACK');
                  
                  return (
                    <div
                      key={session.id}
                      className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#EFFAFD]/60 -mx-4 px-4 transition-colors group rounded-xl"
                    >
                      {/* Left info */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span style={{ color: '#0F172A' }} className="font-display font-bold text-[#0F172A] text-base group-hover:text-[#4A8BDF] transition-colors truncate">
                            {session.targetRole}
                          </span>
                          <Badge variant="neutral" size="xs">
                            {personaName}
                          </Badge>
                          {isAnalyzed && session.analysis?.readinessVerdict && (
                            getVerdictBadge(session.analysis.readinessVerdict)
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#64748B] font-body">
                          <span>{formatDate(session.createdAt)}</span>
                          <span>•</span>
                          <span>{session.durationMins || 15} mins</span>
                          {session.targetCompany && (
                            <>
                              <span>•</span>
                              <span className="text-[#334155] font-medium">{session.targetCompany}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right score & action */}
                      <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                        {isAnalyzed ? (
                          <div className={`px-3 py-1 text-xs font-bold border rounded-xl font-mono ${getScoreColor(score)}`}>
                            {score}/100
                          </div>
                        ) : (
                          <span className="text-xs text-[#64748B] font-body font-medium">In Progress</span>
                        )}

                        {isAnalyzed ? (
                          <Link to={`/analysis/${session.id}`}>
                            <Button variant="secondary" size="sm" iconRight={<ChevronRight className="h-3.5 w-3.5 text-[#4A8BDF]" />}>
                              Report
                            </Button>
                          </Link>
                        ) : (
                          <Link to={`/interview/${session.id}`}>
                            <Button size="sm" variant="primary">
                              Resume
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Active Roadmap + Trending Community Discussion */}
        <div className="space-y-6">
          
          {/* Active Career Roadmap Tech-Tree Progress Card */}
          <div className="bg-white border border-[#DCE7F2] p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#168A62]/10 text-[#168A62] border border-[#168A62]/20">
                  <Compass size={16} />
                </div>
                <h3 style={{ color: '#0F172A' }} className="font-bold text-sm text-[#0F172A]">
                  Career Tech-Tree
                </h3>
              </div>
              <Link to="/roadmap" className="text-[11px] font-bold text-[#4A8BDF] hover:underline flex items-center gap-1">
                <span>View Nodes</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>

            {followedRoadmaps.length > 0 ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A] uppercase font-mono">
                      {followedRoadmaps[0].rolePath}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#168A62]">
                      {followedRoadmaps[0].overallReadiness || 45}% Mastered
                    </span>
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#DCE7F2]">
                    <div
                      className="h-full bg-[#168A62] rounded-full"
                      style={{ width: `${followedRoadmaps[0].overallReadiness || 45}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#475569]">
                    Benchmark: {followedRoadmaps[0].targetCompanyTier || 'Tier-1 FAANG'} Standards
                  </p>
                </div>

                <Link to={`/roadmap/${followedRoadmaps[0].id}`}>
                  <Button size="md" variant="royal" fullWidth iconRight={<ArrowRight className="h-4 w-4" />}>
                    Continue Node Challenge
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-[#475569] leading-relaxed">
                  You haven't initialized a tailored skill tech-tree yet. Select your target engineering track to generate calibrated milestones.
                </p>
                <Link to="/roadmap">
                  <Button size="md" variant="royal" fullWidth iconRight={<ArrowRight className="h-4 w-4" />}>
                    Initialize Career Roadmap
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Trending Community Discussion Pulse Card */}
          <div className="bg-white border border-[#DCE7F2] p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 style={{ color: '#0F172A' }} className="font-bold text-xs uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                <Users size={14} className="text-[#A0006D]" />
                <span>Community Discussion Pulse</span>
              </h3>
              <Link to="/discuss" className="text-[11px] font-bold text-[#4A8BDF] hover:underline">
                Explore All
              </Link>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  title: 'Amazon SDE2 Interview Experience | AUG 2026 | BLR [Selected]',
                  author: 'Ananya Roy',
                  badge: 'EXPERIENCE',
                  slug: 'amazon-sde2-interview-experience-aug-2026-blr-33-yoe-selected',
                },
                {
                  title: 'How do you handle Redis cache stampedes under 100K RPS in Node.js?',
                  author: 'Alex Chen',
                  badge: 'SYSTEM DESIGN',
                  slug: 'how-do-you-handle-redis-cache-stampedes-under-100k-rps-in-nodejs-microservices',
                },
                {
                  title: 'Salesforce Offer | MTS | $195K Base vs Google L5 Breakdown',
                  author: 'Marcus Vance',
                  badge: 'OFFERS',
                  slug: 'salesforce-offer-mts-195k-base-140k-rsu-vs-google-l5-negotiation-breakdown',
                },
              ].map((disc, idx) => (
                <Link
                  key={idx}
                  to={`/discuss/${disc.slug}`}
                  className="block p-3 rounded-xl bg-[#EFFAFD]/50 hover:bg-[#EFF7FD] border border-[#DCE7F2] hover:border-[#4A8BDF] transition-all group"
                >
                  <p style={{ color: '#0F172A' }} className="text-xs font-bold text-[#0F172A] group-hover:text-[#4A8BDF] transition-colors line-clamp-2 leading-snug">
                    {disc.title}
                  </p>
                  <div className="flex items-center justify-between pt-1.5 text-[10px] text-[#64748B]">
                    <span>By {disc.author}</span>
                    <span className="font-mono font-bold text-[#A0006D] uppercase bg-[#F8EAF4] px-1.5 py-0.5 rounded border border-[#A0006D]/20">
                      {disc.badge}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

