import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Brain,
  BriefcaseBusiness,
  ChevronDown,
  Code2,
  Compass,
  FileText,
  Menu,
  Network,
  Route,
  Swords,
  Video,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import Logo from './ui/Logo';
import ProfileDropdown from './profile/ProfileDropdown';
import { useAuthStore } from '../store/authStore';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

type MenuItem = { label: string; href: string; icon: typeof Video; feature?: string };

const menus: Array<{ label: string; feature?: string; items: MenuItem[] }> = [
  {
    label: 'Interviews',
    items: [
      { label: 'Video Interview', href: '/video', icon: Video, feature: 'video_interview' },
      { label: 'Coding Interview', href: '/coding', icon: Code2, feature: 'coding_interview' },
      { label: 'System Design', href: '/system-design', icon: Network, feature: 'system_design_interview' },
      { label: 'Company-wise', href: '/interviews/company-wise', icon: BriefcaseBusiness, feature: 'company_wise_interview' },
    ],
  },
  {
    label: 'Challenges',
    feature: 'challenges_arena',
    items: [
      { label: 'Arena Hub', href: '/challenges', icon: Swords },
      { label: 'Technical Quizzes', href: '/challenges/quizzes', icon: Brain },
      { label: 'Elo Leaderboard', href: '/challenges/leaderboard', icon: BarChart3 },
    ],
  },
  {
    label: 'Learning & Prep',
    items: [
      { label: 'Preparation Hub', href: '/preparation', icon: Compass },
      { label: 'Roadmap Studio', href: '/roadmap', icon: Route },
    ],
  },
  {
    label: 'Applications',
    items: [
      { label: 'Resume Builder', href: '/resume', icon: FileText, feature: 'ai_resume_ats' },
      { label: 'Placement CRM', href: '/placement-crm', icon: BriefcaseBusiness, feature: 'placement_crm' },
      { label: 'ATS Scanner', href: '/ats', icon: FileText, feature: 'ai_resume_ats' },
    ],
  },
];

export default function TopNav() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { isFeatureEnabled } = useFeatureFlags();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!openMenu) return;

    const closeOnOutsideInteraction = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-nav-menu]')) {
        setOpenMenu(null);
      }
    };
    const closeOnScroll = () => setOpenMenu(null);

    document.addEventListener('mousedown', closeOnOutsideInteraction);
    window.addEventListener('scroll', closeOnScroll, true);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideInteraction);
      window.removeEventListener('scroll', closeOnScroll, true);
    };
  }, [openMenu]);
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const firstName = displayName.trim().split(/\s+/)[0] || 'User';
  const avatarThemes = [
    'bg-[#E11D48] text-white',
    'bg-[#7C3AED] text-white',
    'bg-[#0F766E] text-white',
    'bg-[#D97706] text-white',
  ];
  const avatarTheme = avatarThemes[firstName.charCodeAt(0) % avatarThemes.length];
  const visibleMenus = menus
    .filter((menu) => !menu.feature || isFeatureEnabled(menu.feature))
    .map((menu) => ({
      ...menu,
      items: menu.items.filter((item) => !item.feature || isFeatureEnabled(item.feature)),
    }))
    .filter((menu) => menu.items.length > 0);

  const closeMenus = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return (
    <header className="relative z-40 shrink-0 border-b border-[#DCE7F2] bg-[#EFFAFD]/95 text-[#11183D] backdrop-blur-xl dark:border-[#262626] dark:bg-black/90 dark:text-white">
      <div className="mx-auto flex min-h-14 max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" title="Go to Landing Page" className="shrink-0">
          <Logo size="md" theme="light" />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center gap-0.5 lg:flex" aria-label="Main navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                isActive ? 'bg-[#EFFAFD] text-[#11183D] dark:bg-[#262626] dark:text-white' : 'text-[#526078] hover:bg-[#F8FAFC] hover:text-[#11183D] dark:text-[#A8A8A8] dark:hover:bg-[#262626] dark:hover:text-white'
              )
            }
          >
            Dashboard
          </NavLink>

          {visibleMenus.map((menu) => {
            const active = menu.items.some((item) => location.pathname.startsWith(item.href));
            return (
              <div
                key={menu.label}
                className="relative"
                data-nav-menu
              >
                <button
                  type="button"
                  onClick={() => setOpenMenu(openMenu === menu.label ? null : menu.label)}
                  aria-expanded={openMenu === menu.label}
                  className={clsx(
                    'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                    active || openMenu === menu.label
                      ? 'bg-[#EFFAFD] text-[#11183D] dark:bg-[#262626] dark:text-white'
                      : 'text-[#526078] hover:bg-[#F8FAFC] hover:text-[#11183D] dark:text-[#A8A8A8] dark:hover:bg-[#262626] dark:hover:text-white'
                  )}
                >
                  {menu.label}
                  <ChevronDown size={13} className={clsx('transition-transform', openMenu === menu.label && 'rotate-180')} />
                </button>

                {openMenu === menu.label && (
                  <div className="fixed left-0 right-0 top-14 border-b border-[#DCE7F2] bg-white shadow-xl dark:border-[#262626] dark:bg-[#1A1A1A]">
                    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 pb-8 pt-5 sm:grid-cols-[minmax(220px,0.8fr)_2fr] sm:px-10">
                      <div className="border-r border-[#E8EEF5] pr-8 dark:border-[#303030]">
                        <h3 className="mt-2 text-2xl font-black tracking-tight text-[#11183D] dark:text-white">
                          {menu.label}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#526078] dark:text-[#A8A8A8]">
                          {menu.label === 'Interviews'
                            ? 'Practice with realistic interview formats and sharpen the skills employers evaluate.'
                            : menu.label === 'Challenges'
                              ? 'Test your speed, accuracy, and problem-solving skills in focused practice sessions.'
                              : menu.label === 'Learning & Prep'
                                ? 'Build a structured preparation plan and stay consistent on your path to placement.'
                                : 'Create stronger applications and track the work that moves your career forward.'}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {menu.items.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={closeMenus}
                              className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-[#526078] transition-colors hover:bg-[#EFFAFD] hover:text-[#11183D] dark:text-[#A8A8A8] dark:hover:bg-[#262626] dark:hover:text-white"
                            >
                              <ItemIcon size={16} className="shrink-0 text-[#4A8BDF]" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                isActive ? 'bg-[#EFFAFD] text-[#11183D] dark:bg-[#262626] dark:text-white' : 'text-[#526078] hover:bg-[#F8FAFC] hover:text-[#11183D] dark:text-[#A8A8A8] dark:hover:bg-[#262626] dark:hover:text-white'
              )
            }
          >
            Analytics
          </NavLink>
          <NavLink
            to="/discuss"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                isActive ? 'bg-[#EFFAFD] text-[#11183D] dark:bg-[#262626] dark:text-white' : 'text-[#526078] hover:bg-[#F8FAFC] hover:text-[#11183D] dark:text-[#A8A8A8] dark:hover:bg-[#262626] dark:hover:text-white'
              )
            }
          >
            Discuss
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-full px-1.5 py-1 text-[#526078] transition-colors hover:bg-[#DCE7F2] dark:text-[#A8A8A8] dark:hover:bg-[#262626]"
            >
              <span className={clsx('flex h-8 w-8 items-center justify-center rounded-full text-xs font-black uppercase shadow-sm', avatarTheme)}>
                {firstName.charAt(0)}
              </span>
              <span className="hidden max-w-24 truncate text-xs font-bold text-[#11183D] sm:inline dark:text-white">
                {firstName}
              </span>
            </button>
            <ProfileDropdown isOpen={profileOpen} onClose={() => setProfileOpen(false)} positionClass="right-0 mt-3" />
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="rounded-xl p-2 text-[#526078] hover:bg-[#F8FAFC] dark:text-[#A8A8A8] dark:hover:bg-[#262626] lg:hidden"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-[#DCE7F2] bg-white px-4 py-3 dark:border-[#262626] dark:bg-[#111111] lg:hidden" aria-label="Mobile navigation">
          <NavLink to="/dashboard" onClick={closeMenus} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#526078] dark:text-[#A8A8A8]">
            Dashboard
          </NavLink>
          {visibleMenus.map((menu) => (
            <div key={menu.label} className="mt-1">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#7E8B9B]">{menu.label}</p>
              {menu.items.map((item) => {
                return (
                  <Link key={item.href} to={item.href} onClick={closeMenus} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#526078] dark:text-[#A8A8A8]">
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
          <NavLink to="/analytics" onClick={closeMenus} className="flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-[#526078] dark:text-[#A8A8A8]">
            Analytics
          </NavLink>
          <NavLink to="/discuss" onClick={closeMenus} className="flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-[#526078] dark:text-[#A8A8A8]">
            Discuss
          </NavLink>
        </nav>
      )}
    </header>
  );
}
