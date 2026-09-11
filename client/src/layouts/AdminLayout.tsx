// ═══════════════════════════════════════════════════════════════
// R U Ready? — Bespoke Executive Admin Layout
// Theme: Emerald Green (#10B981) + Deep Navy (#0F172A) + Solar Orange (#FF7A00)
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Layers,
  TrendingUp,
  ArrowRight,
  LogOut,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/api/client';
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
    label: 'Candidate Directory',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Session Logs',
    href: '/admin/logs',
    icon: Layers,
  },
  {
    label: 'Traffic & Business',
    href: '/admin/analytics',
    icon: TrendingUp,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onlineCount, setOnlineCount] = useState<number>(3);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Periodic lightweight ping for live metrics
  useEffect(() => {
    let isMounted = true;
    async function fetchStatus() {
      try {
        const res = await apiClient.get('/admin/metrics');
        if (isMounted && res.data && res.data.onlineUsers) {
          setOnlineCount(res.data.onlineUsers);
        }
      } catch {
        // silent
      }
    }
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#EFFAFD] font-body text-[#11183D] selection:bg-[#4A8BDF]/20 selection:text-[#2459A8]">
      
      {/* ─── Desktop Dedicated Admin Sidebar ─── */}
      <aside className="hidden lg:flex w-64 xl:w-72 h-full bg-[#11183D] text-white flex-col justify-between border-r border-[#2459A8]/30 shrink-0 select-none shadow-2xl relative z-30">
        
        {/* Top Branding */}
        <div className="p-6 space-y-6">
          <Link to="/admin" className="block focus:outline-none">
            <Logo size="md" theme="dark" />
          </Link>

          {/* Live Online Indicator */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-300">Live Active</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#168A62] animate-pulse" />
              <span className="text-xs font-bold font-mono text-[#168A62]">{onlineCount} Online</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5 pt-1">
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
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                      isActive
                        ? 'bg-[#4A8BDF] text-white shadow-md shadow-[#4A8BDF]/20 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={clsx(isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#4A8BDF]')} />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switch to Candidate View & Admin Profile */}
        <div className="p-5 border-t border-white/10 bg-black/20 space-y-3">
          
          {/* Quick Switcher Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#4A8BDF]/60 text-xs text-slate-300 hover:text-white transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#A0006D]" />
              <span className="font-semibold">Candidate View</span>
            </div>
            <ArrowRight size={13} className="text-slate-400 group-hover:text-[#4A8BDF] group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Admin User Info */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-xl bg-[#4A8BDF]/20 border border-[#4A8BDF]/30 text-[#4A8BDF] font-bold font-display flex items-center justify-center text-xs shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email || 'admin@ruready.ai'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log out"
              className="p-2 rounded-lg text-slate-400 hover:text-[#D64545] hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>

        </div>

      </aside>

      {/* ─── Main Content Canvas ─── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#EFFAFD]">
        
        {/* Mobile Header Bar */}
        <header className="lg:hidden h-14 bg-[#11183D] text-white px-4 flex items-center justify-between border-b border-white/10 shrink-0 z-20">
          <Link to="/admin">
            <Logo size="sm" theme="dark" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-white"
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
              className="lg:hidden bg-[#0F172A] border-b border-slate-800 p-4 space-y-2 z-30 shadow-xl"
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
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold',
                      isActive ? 'bg-emerald-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                    )}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-xs font-semibold text-[#FF7A00] flex items-center gap-1.5"
                >
                  <span>Candidate View</span>
                  <ArrowRight size={13} />
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-400 font-semibold"
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
