import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  TrendingUp, 
  Code2,
  FileText,
  Compass,
  Users,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Building2,
  Brain,
  Swords,
  Zap,
  Network,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/useProfileStore';
import { useAuth } from '../hooks/useAuth';
import Logo from './ui/Logo';
import ProfileDropdown from './profile/ProfileDropdown';

export default function SidebarNav() {
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Dropdown states for each category
  const [interviewsOpen, setInterviewsOpen] = useState(
    location.pathname.startsWith('/oral') ||
    location.pathname.startsWith('/coding') ||
    location.pathname.startsWith('/interview') ||
    location.pathname.startsWith('/interviews') ||
    location.pathname.startsWith('/company-wise') ||
    location.pathname.startsWith('/system-design')
  );

  const [challengesOpen, setChallengesOpen] = useState(
    location.pathname.startsWith('/challenges')
  );

  const [learningPrepOpen, setLearningPrepOpen] = useState(
    location.pathname.startsWith('/preparation') ||
    location.pathname.startsWith('/roadmap')
  );

  const [applicationsCrmOpen, setApplicationsCrmOpen] = useState(
    location.pathname.startsWith('/resume') ||
    location.pathname.startsWith('/placement-crm') ||
    location.pathname.startsWith('/ats')
  );

  const [profileData, setProfileData] = useState<{
    targetRole?: string;
    seniority?: string;
    targetCompany?: string;
    techStack?: string[];
    timeline?: string;
  }>({});

  const userInitial = (profile.name || user?.name || 'Jaswanth Reddy').charAt(0).toUpperCase() || 'J';

  const isUserAdmin =
    (user as any)?.role === 'ADMIN' ||
    user?.email?.toLowerCase() === 'admin@ruready.ai' ||
    user?.email?.toLowerCase().startsWith('admin@');

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

  const getRoleDisplayName = (role?: string) => {
    if (!role) return 'Software Engineer';
    const roleMap: Record<string, string> = {
      frontend: 'Frontend Engineer',
      backend: 'Backend Engineer',
      fullstack: 'Fullstack Engineer',
      'ai-ml': 'AI / ML Engineer',
      devops: 'DevOps & SRE',
      manager: 'Engineering Manager',
    };
    return roleMap[role] || role;
  };

  const isInterviewsActive =
    location.pathname.startsWith('/oral') ||
    location.pathname.startsWith('/coding') ||
    location.pathname.startsWith('/interview') ||
    location.pathname.startsWith('/interviews') ||
    location.pathname.startsWith('/company-wise');

  const isChallengesActive = location.pathname.startsWith('/challenges');

  const isLearningPrepActive =
    location.pathname.startsWith('/preparation') ||
    location.pathname.startsWith('/roadmap');

  const isApplicationsCrmActive =
    location.pathname.startsWith('/resume') ||
    location.pathname.startsWith('/placement-crm') ||
    location.pathname.startsWith('/ats');

  return (
    <>
      <aside 
        className="w-64 bg-white border-r border-[#DCE7F2] flex flex-col shrink-0 h-screen sticky top-0 select-none z-30"
        aria-label="Sidebar Navigation"
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-[#DCE7F2] shrink-0">
          <Logo size="md" theme="light" />
        </div>

        {/* Navigation Menu */}
        <nav 
          className="flex-1 px-3 py-4 space-y-2 overflow-y-auto"
          aria-label="Main Navigation Menu"
        >
          {/* 1. DASHBOARD */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold font-sans transition-all duration-200 group relative",
                isActive
                  ? "bg-[#EFFAFD] text-[#11183D] shadow-xs"
                  : "text-[#526078] hover:bg-[#F8FAFC] hover:text-[#11183D]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard size={17} className={isActive ? "text-[#4A8BDF]" : "text-[#526078] group-hover:text-[#11183D]"} />
                <span className="truncate">Dashboard</span>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-[#4A8BDF] rounded-r-full shadow-sm" />}
              </>
            )}
          </NavLink>

          {/* 2. INTERVIEWS DROPDOWN */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setInterviewsOpen(!interviewsOpen)}
              className={clsx(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold font-sans transition-all duration-200 group relative text-left",
                isInterviewsActive
                  ? "bg-blue-50/60 text-[#11183D]"
                  : "text-[#526078] hover:bg-[#F8FAFC] hover:text-[#11183D]"
              )}
            >
              <div className="flex items-center gap-3">
                <Brain size={17} className={isInterviewsActive ? "text-[#4A8BDF]" : "text-[#526078] group-hover:text-[#11183D]"} />
                <span>Interviews</span>
              </div>
              <div className="flex items-center">
                {interviewsOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
              </div>
            </button>

            {interviewsOpen && (
              <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-4 py-1">
                {/* Unified Interview Hub */}
                <NavLink
                  to="/interview"
                  end
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive || location.pathname === '/interview' || location.pathname === '/interviews'
                        ? "bg-[#EFFAFD] text-[#4A8BDF] font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={15} />
                    <span>Interview Hub</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#EFFAFD] text-[#4A8BDF] font-mono">
                    ALL
                  </span>
                </NavLink>

                {/* Oral Interview */}
                <NavLink
                  to="/oral"
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive || location.pathname.startsWith('/oral')
                        ? "bg-[#EFFAFD] text-[#4A8BDF] font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Video size={15} />
                    <span>Oral Interview</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#F8EAF4] text-[#A0006D] font-mono">
                    AI
                  </span>
                </NavLink>

                {/* Coding Interview */}
                <NavLink
                  to="/coding"
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive || location.pathname.startsWith('/coding')
                        ? "bg-[#EFFAFD] text-[#4A8BDF] font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Code2 size={15} />
                    <span>Coding Interview</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#F8EAF4] text-[#A0006D] font-mono">
                    AI
                  </span>
                </NavLink>

                {/* System Design Whiteboard */}
                <NavLink
                  to="/system-design"
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive || location.pathname.startsWith('/system-design')
                        ? "bg-[#EFFAFD] text-[#4A8BDF] font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Network size={15} />
                    <span>System Design</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-purple-50 text-purple-700 border border-purple-200 font-mono">
                    NEW
                  </span>
                </NavLink>

                {/* Company-wise Interviews */}
                <NavLink
                  to="/interviews/company-wise"
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive || location.pathname.startsWith('/interviews/company-wise') || location.pathname.startsWith('/company-wise')
                        ? "bg-[#EFFAFD] text-[#4A8BDF] font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 size={15} />
                    <span>Company-wise</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#F8EAF4] text-[#A0006D] font-mono">
                    AI
                  </span>
                </NavLink>

                {/* Unified History & Scorecards */}
                <NavLink
                  to="/interview/history"
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive || location.pathname.startsWith('/interview/history')
                        ? "bg-[#EFFAFD] text-[#4A8BDF] font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <FileText size={15} />
                    <span>History & Reports</span>
                  </div>
                </NavLink>
              </div>
            )}
          </div>

          {/* ONLINE CHALLENGES DROPDOWN */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setChallengesOpen(!challengesOpen)}
              className={clsx(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold font-sans transition-all duration-200 group relative text-left",
                isChallengesActive
                  ? "bg-blue-50/60 text-[#11183D]"
                  : "text-[#526078] hover:bg-[#F8FAFC] hover:text-[#11183D]"
              )}
            >
              <div className="flex items-center gap-3">
                <Swords size={17} className={isChallengesActive ? "text-[#4A8BDF]" : "text-[#526078] group-hover:text-[#11183D]"} />
                <span>Online Challenges</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-mono animate-pulse">
                  LIVE
                </span>
                {challengesOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
              </div>
            </button>

            {challengesOpen && (
              <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-4 py-1">
                {/* Challenge Hub */}
                <NavLink
                  to="/challenges"
                  end
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive
                        ? "bg-[#EFFAFD] text-[#4A8BDF] font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Zap size={15} />
                    <span>Arena Hub</span>
                  </div>
                </NavLink>

                {/* Technical Quizzes */}
                <NavLink
                  to="/challenges/quizzes"
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive
                        ? "bg-[#EFFAFD] text-[#4A8BDF] font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Brain size={15} />
                    <span>Technical Quizzes</span>
                  </div>
                </NavLink>

                {/* Elo Leaderboard */}
                <NavLink
                  to="/challenges/leaderboard"
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive
                        ? "bg-[#EFFAFD] text-[#4A8BDF] font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Swords size={15} />
                    <span>Elo Leaderboard</span>
                  </div>
                </NavLink>
              </div>
            )}
          </div>

          {/* 3. LEARNING & PREP DROPDOWN */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setLearningPrepOpen(!learningPrepOpen)}
              className={clsx(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold font-sans transition-all duration-200 group relative text-left",
                isLearningPrepActive
                  ? "bg-blue-50/60 text-[#11183D]"
                  : "text-[#526078] hover:bg-[#F8FAFC] hover:text-[#11183D]"
              )}
            >
              <div className="flex items-center gap-3">
                <GraduationCap size={17} className={isLearningPrepActive ? "text-[#4A8BDF]" : "text-[#526078] group-hover:text-[#11183D]"} />
                <span>Learning & Prep</span>
              </div>
              <div className="flex items-center">
                {learningPrepOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
              </div>
            </button>

            {learningPrepOpen && (
              <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-4 py-1">
                {/* Placement Prep */}
                <NavLink
                  to="/preparation"
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive || location.pathname.startsWith('/preparation')
                        ? "bg-[#EFFAFD] text-[#4A8BDF] font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap size={15} />
                    <span>Placement Prep</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#F8EAF4] text-[#A0006D] font-mono">
                    AI
                  </span>
                </NavLink>

                {/* Career Roadmaps */}
                <NavLink
                  to="/roadmap"
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive || location.pathname.startsWith('/roadmap')
                        ? "bg-[#EFFAFD] text-[#4A8BDF] font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Compass size={15} />
                    <span>Career Roadmaps</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#F8EAF4] text-[#A0006D] font-mono">
                    AI
                  </span>
                </NavLink>
              </div>
            )}
          </div>

          {/* 4. APPLICATIONS CRM DROPDOWN */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setApplicationsCrmOpen(!applicationsCrmOpen)}
              className={clsx(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold font-sans transition-all duration-200 group relative text-left",
                isApplicationsCrmActive
                  ? "bg-blue-50/60 text-[#11183D]"
                  : "text-[#526078] hover:bg-[#F8FAFC] hover:text-[#11183D]"
              )}
            >
              <div className="flex items-center gap-3">
                <Briefcase size={17} className={isApplicationsCrmActive ? "text-[#4A8BDF]" : "text-[#526078] group-hover:text-[#11183D]"} />
                <span>Applications CRM</span>
              </div>
              <div className="flex items-center">
                {applicationsCrmOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
              </div>
            </button>

            {applicationsCrmOpen && (
              <div className="pl-4 space-y-1 border-l-2 border-slate-100 ml-4 py-1">
                {/* AI Resume & ATS */}
                <NavLink
                  to="/resume"
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive || location.pathname.startsWith('/resume') || location.pathname.startsWith('/ats')
                        ? "bg-[#EFFAFD] text-[#4A8BDF] font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <FileText size={15} />
                    <span>AI Resume & ATS</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#F8EAF4] text-[#A0006D] font-mono">
                    AI
                  </span>
                </NavLink>

                {/* Placement CRM */}
                <NavLink
                  to="/placement-crm"
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive || location.pathname.startsWith('/placement-crm')
                        ? "bg-[#EFFAFD] text-[#4A8BDF] font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase size={15} />
                    <span>Placement CRM</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#F8EAF4] text-[#A0006D] font-mono">
                    AI
                  </span>
                </NavLink>
              </div>
            )}
          </div>

          {/* 5. INSIGHTS */}
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold font-sans transition-all duration-200 group relative",
                isActive || location.pathname.startsWith('/analytics')
                  ? "bg-[#EFFAFD] text-[#11183D] shadow-xs"
                  : "text-[#526078] hover:bg-[#F8FAFC] hover:text-[#11183D]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <TrendingUp size={17} className={isActive || location.pathname.startsWith('/analytics') ? "text-[#4A8BDF]" : "text-[#526078] group-hover:text-[#11183D]"} />
                <span className="truncate">Insights</span>
                {(isActive || location.pathname.startsWith('/analytics')) && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-[#4A8BDF] rounded-r-full shadow-sm" />}
              </>
            )}
          </NavLink>

          {/* 6. COMMUNITY */}
          <NavLink
            to="/discuss"
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold font-sans transition-all duration-200 group relative",
                isActive || location.pathname.startsWith('/discuss')
                  ? "bg-[#EFFAFD] text-[#11183D] shadow-xs"
                  : "text-[#526078] hover:bg-[#F8FAFC] hover:text-[#11183D]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Users size={17} className={isActive || location.pathname.startsWith('/discuss') ? "text-[#4A8BDF]" : "text-[#526078] group-hover:text-[#11183D]"} />
                <span className="truncate">Community</span>
                {(isActive || location.pathname.startsWith('/discuss')) && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-[#4A8BDF] rounded-r-full shadow-sm" />}
              </>
            )}
          </NavLink>

          {/* Admin Portal if Admin */}
          {isUserAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold font-sans transition-all duration-200 group relative",
                  isActive
                    ? "bg-[#EFFAFD] text-[#11183D] shadow-xs"
                    : "text-[#526078] hover:bg-[#F8FAFC] hover:text-[#11183D]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <ShieldCheck size={17} className={isActive ? "text-[#4A8BDF]" : "text-[#526078] group-hover:text-[#11183D]"} />
                  <span className="truncate">Admin Portal</span>
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-[#4A8BDF] rounded-r-full shadow-sm" />}
                </>
              )}
            </NavLink>
          )}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-[#DCE7F2] bg-[#EFFAFD] shrink-0 relative transition-colors">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-[#DCE7F2] hover:border-[#4A8BDF] hover:shadow-sm transition-all text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A8BDF]"
            title="Profile, Settings & Appearance"
            aria-label="Open candidate profile and settings menu"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#2459A8] to-[#4A8BDF] flex items-center justify-center text-white font-bold text-sm font-sans shrink-0 shadow-sm group-hover:scale-105 transition-transform border border-white/20">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#11183D] truncate font-sans group-hover:text-[#4A8BDF] transition-colors">
                  {profile.name || user?.name || 'Jaswanth Reddy'}
                </p>
                <p className="text-[11px] text-[#526078] truncate">
                  {profile.targetRole || getRoleDisplayName(profileData.targetRole)}
                </p>
              </div>
            </div>
          </button>

          {profileDropdownOpen && (
            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onClose={() => setProfileDropdownOpen(false)}
              positionClass="bottom-full left-2 mb-2 w-[calc(100%-16px)]"
            />
          )}
        </div>
      </aside>
    </>
  );
}
