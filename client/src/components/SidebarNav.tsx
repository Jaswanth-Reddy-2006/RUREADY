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
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/useProfileStore';
import { useAuth } from '../hooks/useAuth';
import Logo from './ui/Logo';
import ProfileDropdown from './profile/ProfileDropdown';

// Original clean navigation items without category cards
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
    label: 'Placement CRM',
    href: '/placement-crm',
    icon: Briefcase,
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
  const { profile } = useProfileStore();
  const { logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
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

        {/* Navigation Items - Clean Flat List (No Category Sections) */}
        <nav 
          className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto"
          aria-label="Main Navigation Menu"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
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
                    <Icon
                      size={17}
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
                      <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F8EAF4] text-[#A0006D] font-mono">
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

        {/* User Profile Trigger Footer with Initial J and Floating Profile Dropdown */}
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
            <div className="h-2 w-2 rounded-full bg-[#168A62] shrink-0 shadow-sm ring-2 ring-white" />
          </button>

          {/* Floating Profile Card Popping Upward Beside/Above */}
          <ProfileDropdown
            isOpen={profileDropdownOpen}
            onClose={() => setProfileDropdownOpen(false)}
            positionClass="bottom-full left-2 mb-2 w-72 sm:w-80"
          />
        </div>

      </aside>
    </>
  );
}
