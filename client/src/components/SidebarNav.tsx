import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  TrendingUp, 
  Code2,
  LogOut,
  X,
  Briefcase,
  Award,
  Building2,
  Sparkles,
  Mail,
  ShieldCheck
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
  },
  {
    label: 'Oral Interview',
    href: '/interview/new',
    icon: Video,
  },
  {
    label: 'Coding Interview',
    href: '/interview/coding/new',
    icon: Code2,
  },
  {
    label: 'Analytics & Insights',
    href: '/analytics',
    icon: TrendingUp,
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
        className="w-[260px] h-screen bg-white border-r border-slate-200 flex flex-col shrink-0 text-slate-700 font-body select-none sticky top-0 shadow-sm"
      >
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <NavLink 
            to="/dashboard" 
            className="flex items-center gap-2 group rounded-xl p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]"
            aria-label="Go to Dashboard"
          >
            <Logo size="sm" theme="light" />
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main menu" className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-display">
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
                    "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]",
                    isActive
                      ? "bg-orange-50/80 text-[#FF7A00] font-semibold border border-orange-200 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      size={18} 
                      className={clsx(
                        "transition-colors duration-200 shrink-0",
                        isActive ? "text-[#FF7A00]" : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                    
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-[#FF7A00] rounded-r-full shadow-sm" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Trigger Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/80 shrink-0">
          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-orange-300 hover:shadow-sm transition-all text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]"
            title="View Full Profile"
            aria-label="Open candidate profile view"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#E66E00] flex items-center justify-center text-white font-bold text-sm font-display shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate font-display group-hover:text-[#FF7A00] transition-colors">
                  {user?.name || 'Candidate'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {getRoleDisplayName(profileData.targetRole)}
                </p>
              </div>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 shadow-sm ring-2 ring-white" />
          </button>
        </div>

      </aside>

      {/* Profile Flyout Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-modal-title"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-orange-50 via-white to-orange-50/30 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#E66E00] flex items-center justify-center text-white font-extrabold text-lg font-display shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 id="profile-modal-title" className="text-base font-bold font-display text-slate-900">
                      {user?.name || 'Candidate Profile'}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Mail size={12} className="text-slate-400" />
                      <span>{user?.email || 'Registered Candidate'}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close profile"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Profile Details Body */}
              <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
                
                {/* Calibration Highlights */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                      <Briefcase size={14} className="text-[#FF7A00]" />
                      <span>Target Role</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 font-display">
                      {getRoleDisplayName(profileData.targetRole)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                      <Award size={14} className="text-[#FF7A00]" />
                      <span>Seniority</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 font-display">
                      {getSeniorityDisplayName(profileData.seniority)}
                    </p>
                  </div>
                </div>

                {/* Target Company & Timeline */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Building2 size={14} className="text-[#FF7A00]" />
                      <span>Target Company</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {profileData.targetCompany || 'Top Tech Companies'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Sparkles size={14} className="text-[#FF7A00]" />
                      <span>Interview Timeline</span>
                    </div>
                    <span className="text-xs font-semibold text-orange-600">
                      {profileData.timeline === 'asap' ? 'Immediate / Next 2 weeks' : 'Within 1-3 months'}
                    </span>
                  </div>
                </div>

                {/* Skills & Tech Stack */}
                {profileData.techStack && profileData.techStack.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                      Calibrated Focus & Tech Stack
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {profileData.techStack.map((tech) => (
                        <span 
                          key={tech}
                          className="px-2.5 py-1 rounded-lg bg-orange-50 text-[#FF7A00] border border-orange-200 text-xs font-semibold font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Account Status Badge */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-800 text-xs">
                  <div className="flex items-center gap-2 font-medium">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>RU READY Active Onboarding Verified</span>
                  </div>
                  <span className="font-bold font-mono">READY</span>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
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
