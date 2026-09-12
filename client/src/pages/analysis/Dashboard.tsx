import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Award, Calendar, ChevronRight, Sparkles, 
  Search, ArrowRight, Target, Zap, Brain, MessageSquare, Code2,
  Briefcase, Building2, Layers, FileText
} from 'lucide-react';
import apiClient from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [profileData, setProfileData] = useState<{
    targetRole?: string;
    seniority?: string;
    targetCompany?: string;
    techStack?: string[];
  }>({});

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
    async function loadSessions() {
      try {
        const response = await apiClient.get('/interview/sessions');
        setSessions(response.data || []);
      } catch (err) {
        console.error('Failed to fetch historical sessions', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSessions();
  }, []);

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
      year: 'numeric'
    });
  };

  // Calculations
  const completedSessions = sessions.filter(s => s.status === 'ANALYSED');
  const totalScore = completedSessions.reduce((acc, s) => acc + (s.analysis?.overallScore || 0), 0);
  const avgScore = completedSessions.length > 0 ? Math.round(totalScore / completedSessions.length) : 0;
  
  const avgTech = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.analysis?.technicalScore || 0), 0) / completedSessions.length)
    : 0;
  const avgComm = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.analysis?.communicationScore || 0), 0) / completedSessions.length)
    : 0;
  const avgConf = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.analysis?.confidenceScore || 0), 0) / completedSessions.length)
    : 0;
  const avgStruct = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.analysis?.structureScore || 0), 0) / completedSessions.length)
    : 0;

  // Filtered sessions
  const filteredSessions = sessions.filter(s => {
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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        <div className="h-40 bg-white border border-[#DCE7F2] rounded-3xl animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-28 bg-white border border-[#DCE7F2] rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-white border border-[#DCE7F2] rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 text-[#11183D]">
      
      {/* ─── Hero Welcome Section ─── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-white p-8 sm:p-10 text-[#11183D] shadow-sm border border-[#DCE7F2]"
      >
        {/* Subtle Brand Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EFF7FD] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-[#F8EAF4]/60 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F8EAF4] border border-[#A0006D]/20 px-3.5 py-1 text-[#A0006D]">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[11px] font-semibold font-sans tracking-wider uppercase">
                AI Interview Calibration Active
              </span>
            </div>
            
            <h1 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl text-[#11183D] tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}
            </h1>
            
            <p className="font-sans text-[#526078] text-sm sm:text-base leading-relaxed">
              {completedSessions.length === 0 
                ? "Your onboarding profile is ready. Launch a calibrated oral or coding interview to build real hiring readiness."
                : `You have completed ${completedSessions.length} sessions with an average uninflated readiness score of ${avgScore}%. Keep practicing.`}
            </p>

            {profileData.targetRole && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#7B8799]">
                <span className="flex items-center gap-1 font-semibold text-[#11183D]">
                  <Briefcase size={13} className="text-[#4A8BDF]" />
                  {profileData.targetRole}
                </span>
                {profileData.targetCompany && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-[#11183D]">
                      <Building2 size={13} className="text-[#4A8BDF]" />
                      {profileData.targetCompany}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to="/interview/new">
              <Button size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                Start Oral Interview
              </Button>
            </Link>
            <Link to="/interview/coding/new">
              <Button variant="secondary" size="lg" icon={<Code2 className="h-4 w-4 text-[#4A8BDF]" />}>
                Coding Studio
              </Button>
            </Link>
            <Link to="/ats">
              <Button variant="eggplant" size="lg" icon={<FileText className="h-4 w-4" />}>
                AI Resume ATS
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ─── 5-Column Core Performance Metrics Overview ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#7B8799] font-display">
            Performance Overview
          </h2>
          <span className="text-xs text-[#7B8799] font-body">Objective Socratic Engine</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              label: 'Overall Readiness',
              score: avgScore,
              icon: Award,
              desc: 'Holistic candidate bar',
              color: 'text-[#4A8BDF]',
              bg: 'bg-[#EFF7FD] border border-[#4A8BDF]/20',
            },
            {
              label: 'Technical Depth',
              score: avgTech,
              icon: Brain,
              desc: 'Architectural reasoning',
              color: 'text-[#2459A8]',
              bg: 'bg-[#2459A8]/10 border border-[#2459A8]/20',
            },
            {
              label: 'Communication',
              score: avgComm,
              icon: MessageSquare,
              desc: 'Clarity & STAR structure',
              color: 'text-[#168A62]',
              bg: 'bg-[#E8F5F0] border border-[#168A62]/20',
            },
            {
              label: 'Confidence Metric',
              score: avgConf,
              icon: Zap,
              desc: 'Vocal stability & pacing',
              color: 'text-[#A0006D]',
              bg: 'bg-[#F8EAF4] border border-[#A0006D]/20',
            },
            {
              label: 'Structured Answers',
              score: avgStruct,
              icon: Target,
              desc: 'Action & outcome focus',
              color: 'text-[#780052]',
              bg: 'bg-[#780052]/10 border border-[#780052]/20',
            },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <div className="bg-white border border-[#DCE7F2] rounded-2xl p-5 flex flex-col justify-between h-full hover:border-[#4A8BDF] hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B8799] font-display">
                    {metric.label}
                  </span>
                  <div className={`p-2 rounded-xl ${metric.bg} ${metric.color}`}>
                    <metric.icon className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-sans font-bold text-2xl sm:text-3xl text-[#11183D]">
                      {metric.score > 0 ? metric.score : '--'}
                    </span>
                    <span className="text-xs text-[#7B8799] font-mono">/100</span>
                  </div>
                  <p className="text-[11px] text-[#526078] font-sans mt-1 truncate">
                    {metric.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Main Content Grid: Recent Activity + Recommended Next Practice ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Session History Table & Filters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 sm:p-8 shadow-sm">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#DCE7F2]">
              <div>
                <h2 className="text-lg font-bold font-display text-[#11183D]">
                  Your Interview History
                </h2>
                <p className="text-xs text-[#526078] font-body mt-0.5">
                  Track your performance across simulated technical & behavioral interviews.
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#7B8799]" />
                  <input
                    type="text"
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-[#EFFAFD] border border-[#DCE7F2] rounded-xl text-xs text-[#11183D] placeholder:text-[#7B8799] focus:outline-none focus:border-[#4A8BDF] focus:ring-2 focus:ring-[#4A8BDF]/20 font-body transition-all"
                  />
                </div>

                <div className="flex rounded-xl bg-[#EFFAFD] p-0.5 border border-[#DCE7F2] text-xs font-display">
                  {['ALL', 'COMPLETED', 'IN_PROGRESS'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFilterType(type)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        filterType === type 
                          ? 'bg-white text-[#4A8BDF] shadow-sm font-bold' 
                          : 'text-[#526078] hover:text-[#11183D]'
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
                  <h3 className="text-base font-bold font-display text-[#11183D]">
                    No sessions recorded yet
                  </h3>
                  <p className="text-xs text-[#526078] font-body">
                    {searchQuery ? 'No sessions match your search criteria.' : 'Start your first live mock interview to generate uninflated readiness scores.'}
                  </p>
                </div>
                {!searchQuery && (
                  <Link to="/interview/new" className="inline-block pt-2">
                    <Button size="md">Start Your First Mock Interview</Button>
                  </Link>
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
                          <span className="font-display font-bold text-[#11183D] text-base group-hover:text-[#4A8BDF] transition-colors truncate">
                            {session.targetRole}
                          </span>
                          <Badge variant="neutral" size="xs">
                            {personaName}
                          </Badge>
                          {isAnalyzed && session.analysis?.readinessVerdict && (
                            getVerdictBadge(session.analysis.readinessVerdict)
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#7B8799] font-body">
                          <span>{formatDate(session.createdAt)}</span>
                          <span>•</span>
                          <span>{session.durationMins || 15} mins</span>
                          {session.targetCompany && (
                            <>
                              <span>•</span>
                              <span className="text-[#526078] font-medium">{session.targetCompany}</span>
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
                          <span className="text-xs text-[#7B8799] font-body font-medium">In Progress</span>
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

        {/* Right Col: Next Recommended Practice & Quick Tracks */}
        <div className="space-y-6">
          
          {/* Practice Recommendation Card - Signature AI Eggplant Styling */}
          <div className="bg-[#F8EAF4] border border-[#A0006D]/30 p-6 sm:p-7 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[#A0006D]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#A0006D] font-display">
                AI Recommended Practice
              </span>
            </div>

            <h3 className="font-display font-bold text-lg text-[#11183D] mb-2">
              Behavioral STAR Method Drill
            </h3>
            <p className="text-xs text-[#526078] font-body leading-relaxed mb-5">
              Reinforce situation, task, action, and result structuring with live real-time follow-up probes.
            </p>

            <Link to="/interview/new">
              <Button size="md" variant="ai" fullWidth iconRight={<ArrowRight className="h-4 w-4" />}>
                Launch Targeted Drill
              </Button>
            </Link>
          </div>

          {/* Quick Track Launcher Card */}
          <div className="bg-white border border-[#DCE7F2] p-6 sm:p-7 rounded-3xl shadow-sm">
            <h3 className="font-display font-bold text-xs text-[#7B8799] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Layers size={14} className="text-[#4A8BDF]" />
              <span>Quick Interview Tracks</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  title: 'System Architecture & Scaling',
                  tag: 'Senior Fullstack / Backend',
                  icon: Target,
                  href: '/interview/new',
                },
                {
                  title: 'Algorithms & Data Structures',
                  tag: 'Live Monaco Sandbox',
                  icon: Code2,
                  href: '/interview/coding/new',
                },
                {
                  title: 'Leadership & Conflict Probes',
                  tag: 'Behavioral Round',
                  icon: MessageSquare,
                  href: '/interview/new',
                },
              ].map((track, i) => (
                <Link
                  key={i}
                  to={track.href}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#DCE7F2] bg-[#EFFAFD]/40 hover:border-[#4A8BDF] hover:bg-[#EFF7FD] transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-white border border-[#DCE7F2] text-[#526078] group-hover:text-[#4A8BDF] group-hover:border-[#4A8BDF]/40 transition-colors shadow-xs">
                      <track.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#11183D] group-hover:text-[#4A8BDF] transition-colors truncate font-display">
                        {track.title}
                      </p>
                      <p className="text-[10px] text-[#7B8799] font-body">
                        {track.tag}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#7B8799] group-hover:text-[#4A8BDF] group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

