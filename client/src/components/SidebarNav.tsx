import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  TrendingUp, 
  Code2,
  FileText,
  Compass,
  Users,
  LogOut,
  X,
  Briefcase,
  Award,
  Building2,
  Sparkles,
  Mail,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../hooks/useAuth';
import Logo from './ui/Logo';

const baseNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    isAi: false,
  },
  {
    label: 'Oral Interview',
    href: '/interview/new',
    icon: Video,
    isAi: true,
  },
  {
    label: 'Coding Interview',
    href: '/interview/coding/new',
    icon: Code2,
    isAi: true,
  },
  {
    label: 'AI Resume & ATS',
    href: '/ats',
    icon: FileText,
    isAi: true,
  },
  {
    label: 'Career Roadmaps',
    href: '/roadmap',
    icon: Compass,
    isAi: true,
  },
  {
    label: 'Role Discussion Hub',
    href: '/discuss',
    icon: Users,
    isAi: true,
  },
  {
    label: 'Analytics & Insights',
    href: '/analytics',
    icon: TrendingUp,
    isAi: false,
  },
];

export default function SidebarNav() {
  const { user } = useAuthStore();
  const { logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState<{
    targetRole?: string;
    seniority?: string;
    targetCompany?: string;
    techStack?: string[];
    timeline?: string;
  }>({});

  const isUserAdmin =
    (user as any)?.role === 'ADMIN' ||
    user?.email?.toLowerCase() === 'admin@ruready.ai' ||
    user?.email?.toLowerCase().startsWith('admin@');

  const navItems = isUserAdmin
    ? [
        ...baseNavItems,
        {
          label: 'Admin Portal',
          href: '/admin',
          icon: ShieldCheck,
          isAi: false,
        },
      ]
    : baseNavItems;

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

  const handleLogout = async () => {
    setShowProfileModal(false);
    await logout();
    navigate('/login');
  };

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

  const getSeniorityDisplayName = (level?: string) => {
    if (!level) return 'Fresher (0-1 yrs)';
    const levelMap: Record<string, string> = {
      student: 'Student / Fresher (0-1 yrs)',
      junior: 'Junior (1-3 yrs)',
      mid: 'Mid-Level (3-6 yrs)',
      senior: 'Senior / Staff (6+ yrs)',
      fresher: 'Fresher (0-1 yrs)',
    };
    return levelMap[level] || level;
  };

  return (
    <>
      <aside 
        aria-label="Workspace navigation sidebar"
        className="w-[260px] h-screen bg-white border-r border-[#DCE7F2] flex flex-col shrink-0 text-[#526078] font-body select-none sticky top-0 shadow-sm"
      >
        
        {/* Brand Header */}
        <div className="p-5 border-b border-[#DCE7F2] flex items-center justify-between">
          <NavLink 
            to="/dashboard" 
            className="flex items-center gap-2 group rounded-xl p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A8BDF]"
            aria-label="Go to Dashboard"
          >
            <Logo size="md" theme="light" />
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main menu" className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-bold text-[#7B8799] uppercase tracking-wider font-display">
            Platform Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-[#4A8BDF]",
                    isActive
                      ? "bg-[#EFF7FD] text-[#4A8BDF] font-bold shadow-sm"
                      : "text-[#526078] hover:text-[#11183D] hover:bg-[#EFFAFD]"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      size={18} 
                      className={clsx(
                        "transition-colors duration-200 shrink-0",
                        isActive
                          ? "text-[#4A8BDF]"
                          : item.isAi
                          ? "text-[#A0006D]"
                          : "text-[#526078] group-hover:text-[#11183D]"
                      )}
                    />
                    <span className="truncate">{item.label}</span>

                    {item.isAi && (
                      <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F8EAF4] text-[#A0006D]">
                        AI
                      </span>
                    )}
                    
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-[#4A8BDF] rounded-r-full shadow-sm" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Trigger Footer */}
        <div className="p-3 border-t border-[#DCE7F2] bg-[#EFFAFD] shrink-0">
          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-[#DCE7F2] hover:border-[#4A8BDF] hover:shadow-sm transition-all text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A8BDF]"
            title="View Full Profile"
            aria-label="Open candidate profile view"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-[#4A8BDF] flex items-center justify-center text-white font-bold text-sm font-display shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#11183D] truncate font-display group-hover:text-[#4A8BDF] transition-colors">
                  {user?.name || 'Candidate'}
                </p>
                <p className="text-[11px] text-[#526078] truncate">
                  {getRoleDisplayName(profileData.targetRole)}
                </p>
              </div>
            </div>
            <div className="h-2 w-2 rounded-full bg-[#168A62] shrink-0 shadow-sm ring-2 ring-white" />
          </button>
        </div>

      </aside>

      {/* Profile Flyout Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11183D]/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-[#DCE7F2] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-modal-title"
            >
              {/* Header */}
              <div className="p-6 bg-[#EFFAFD] border-b border-[#DCE7F2] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-[#4A8BDF] flex items-center justify-center text-white font-extrabold text-lg font-display shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 id="profile-modal-title" className="text-base font-bold font-display text-[#11183D]">
                      {user?.name || 'Candidate Profile'}
                    </h3>
                    <p className="text-xs text-[#526078] flex items-center gap-1.5 mt-0.5">
                      <Mail size={12} className="text-[#7B8799]" />
                      <span>{user?.email || 'Registered Candidate'}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 rounded-xl text-[#7B8799] hover:text-[#11183D] hover:bg-[#EFFAFD] transition-colors cursor-pointer"
                  aria-label="Close profile"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Profile Details Body */}
              <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
                
                {/* Calibration Highlights */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2]">
                    <div className="flex items-center gap-2 text-[#526078] text-xs font-medium mb-1">
                      <Briefcase size={14} className="text-[#4A8BDF]" />
                      <span>Target Role</span>
                    </div>
                    <p className="text-sm font-bold text-[#11183D] font-display">
                      {getRoleDisplayName(profileData.targetRole)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2]">
                    <div className="flex items-center gap-2 text-[#526078] text-xs font-medium mb-1">
                      <Award size={14} className="text-[#4A8BDF]" />
                      <span>Seniority</span>
                    </div>
                    <p className="text-sm font-bold text-[#11183D] font-display">
                      {getSeniorityDisplayName(profileData.seniority)}
                    </p>
                  </div>
                </div>

                {/* Target Company & Timeline */}
                <div className="p-4 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#526078]">
                      <Building2 size={14} className="text-[#4A8BDF]" />
                      <span>Target Company</span>
                    </div>
                    <span className="text-xs font-bold text-[#11183D]">
                      {profileData.targetCompany || 'Top Tech Companies'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#DCE7F2]">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#526078]">
                      <Sparkles size={14} className="text-[#A0006D]" />
                      <span>Interview Timeline</span>
                    </div>
                    <span className="text-xs font-bold text-[#A0006D]">
                      {profileData.timeline === 'asap' ? 'Immediate / Next 2 weeks' : 'Within 1-3 months'}
                    </span>
                  </div>
                </div>

                {/* Account Status Badge */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#E8F5F0] border border-[#168A62]/30 text-[#168A62] text-xs font-semibold">
                  <div className="flex items-center gap-2 font-medium">
                    <ShieldCheck size={16} className="text-[#168A62]" />
                    <span>R U Ready? Verified Candidate Account</span>
                  </div>
                  <span className="font-bold font-mono">ACTIVE</span>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-[#EFFAFD] border-t border-[#DCE7F2] flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#D64545] hover:bg-[#FDF2F2] border border-[#D64545]/30 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#4A8BDF] hover:bg-[#2459A8] text-white transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
