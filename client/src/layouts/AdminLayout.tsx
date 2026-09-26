// ═══════════════════════════════════════════════════════════════
// R U Ready? — Bespoke Executive Admin Layout
// Theme: Unified Light Executive Platform Theme (Matches User App Layout)
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Layers,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Sparkles,
  IndianRupee,
  Sliders,
  Megaphone,
  ShieldCheck,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/ui/Logo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  {
    label: 'Overview',
    href: '/admin',
    exact: true,
    icon: LayoutDashboard,
  },
  {
    label: 'AI Models & Voices',
    href: '/admin/models',
    icon: Sparkles,
  },
  {
    label: 'Candidate Directory',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Revenue & Plans',
    href: '/admin/revenue',
    icon: IndianRupee,
  },
  {
    label: 'Anti-Cheat Integrity',
    href: '/admin/integrity',
    icon: ShieldCheck,
  },
  {
    label: 'Broadcasts & Banners',
    href: '/admin/broadcasts',
    icon: Megaphone,
  },
  {
    label: 'System Controls & LLM',
    href: '/admin/system-controls',
    icon: Sliders,
  },
  {
    label: 'Traffic & Business',
    href: '/admin/analytics',
    icon: TrendingUp,
  },
  {
    label: 'Microservices & Logs',
    href: '/admin/logs',
    icon: Layers,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#EFFAFD] font-body text-[#11183D] selection:bg-[#4A8BDF]/20 selection:text-[#2459A8]">
      
      {/* ─── Desktop Dedicated Admin Sidebar (Unified Light Platform Theme) ─── */}
      <aside className="hidden lg:flex w-64 bg-white text-[#11183D] flex-col justify-between border-r border-[#DCE7F2] shrink-0 select-none z-30 shadow-xs">
        
        {/* Top Branding & Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="h-16 flex items-center px-6 border-b border-[#DCE7F2] shrink-0">
            <Link to="/admin" className="block focus:outline-none">
              <Logo size="md" theme="light" />
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1.5 flex-1" aria-label="Admin Navigation Menu">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.exact}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold font-sans transition-all duration-200 group relative',
                      isActive
                        ? 'bg-[#EFFAFD] text-[#11183D] shadow-xs'
                        : 'text-[#526078] hover:bg-[#F8FAFC] hover:text-[#11183D]'
                    )
                  }
                >
                  <Icon
                    size={17}
                    className={clsx(
                      isActive ? 'text-[#4A8BDF]' : 'text-[#526078] group-hover:text-[#11183D]'
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Admin Profile & Logout */}
        <div className="p-4 border-t border-[#DCE7F2] bg-[#F8FAFC] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-xl bg-[#2459A8] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#11183D] truncate">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-[#526078] font-mono truncate">{user?.email || 'admin@ruready.ai'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log out"
              className="p-1.5 rounded-xl text-[#526078] hover:text-[#E11D48] hover:bg-[#EFFAFD] transition-colors cursor-pointer shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

      </aside>

      {/* ─── Main Content Canvas ─── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#EFFAFD]">
        
        {/* Mobile Header Bar */}
        <header className="lg:hidden h-14 bg-white text-[#11183D] px-4 flex items-center justify-between border-b border-[#DCE7F2] shrink-0 z-20">
          <Link to="/admin">
            <Logo size="sm" theme="light" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 rounded-xl text-[#526078] hover:text-[#11183D] hover:bg-[#EFFAFD]"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden bg-white border-b border-[#DCE7F2] p-4 space-y-2 z-30 shadow-xl"
            >
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.href
                  : location.pathname.startsWith(item.href);

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.exact}
                    className={clsx(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold',
                      isActive ? 'bg-[#EFFAFD] text-[#11183D]' : 'text-[#526078] hover:bg-[#F8FAFC]'
                    )}
                  >
                    <Icon size={17} className={isActive ? 'text-[#4A8BDF]' : 'text-[#526078]'} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              <div className="pt-2 border-t border-[#DCE7F2] flex items-center justify-end">
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-600 font-semibold"
                >
                  Log out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}
