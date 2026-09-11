import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Menu, X, LogOut, User as UserIcon, ArrowRight, LayoutDashboard, Settings as SettingsIcon, Video } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'How it Works', href: '/#workflow' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'About', href: '/#about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { logout, isLoggingOut } = useAuth();

  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const navBg =
    !isLanding || scrolled
      ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
      : 'bg-transparent';

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        navBg,
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16 lg:h-20">
        {/* Left: Brand Logo */}
        <Link to="/" className="shrink-0">
          <Logo size="md" theme="light" />
        </Link>

        {/* Center: Nav Links (ALWAYS VISIBLE for both Logged In & Logged Out) */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-slate-600 hover:text-[#FF7A00] transition-colors duration-200 font-body"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Auth Buttons (Logged Out) OR Profile Avatar Icon Dropdown (Logged In) */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              {/* Profile Avatar Icon */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:ring-2 hover:ring-[#FF7A00]/30 transition-all duration-200 bg-slate-100 border border-slate-200 cursor-pointer"
                aria-label="User Profile Menu"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#E66E00] via-[#FF7A00] to-[#FF8A00] flex items-center justify-center text-white font-black text-sm font-display shadow-md shadow-orange-500/20">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-64 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2.5 text-slate-800 z-50"
                  >
                    {/* User Info Header */}
                    <div className="px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-100 mb-2">
                      <p className="text-sm font-bold text-slate-900 font-display truncate">
                        {user?.name || 'Candidate'}
                      </p>
                      <p className="text-xs text-slate-500 font-body truncate">
                        {user?.email || 'user@ruready.app'}
                      </p>
                    </div>

                    {/* Navigation Actions */}
                    <div className="space-y-1">
                      <Link
                        to="/settings"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#FF7A00] hover:bg-orange-50/70 rounded-xl transition-colors font-body"
                      >
                        <SettingsIcon className="h-4 w-4 text-[#FF7A00]" />
                        <span>Profile & Settings</span>
                      </Link>
                      <Link
                        to="/interview/setup"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#FF7A00] hover:bg-orange-50/70 rounded-xl transition-colors font-body"
                      >
                        <Video className="h-4 w-4 text-violet-600" />
                        <span>Mock Interview</span>
                      </Link>
                      <Link
                        to="/analysis"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#FF7A00] hover:bg-orange-50/70 rounded-xl transition-colors font-body"
                      >
                        <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                        <span>Analysis Dashboard</span>
                      </Link>
                    </div>

                    {/* Logout Option */}
                    <div className="pt-2 mt-2 border-t border-slate-100">
                      <button
                        onClick={() => logout()}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-body cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-rose-500" />
                        <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="px-5 py-2 text-sm font-semibold font-body text-slate-700 hover:text-slate-900 border border-slate-200 rounded-full hover:bg-slate-50 transition-all duration-200 shadow-sm cursor-pointer">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="inline-flex items-center gap-2 bg-[#FF7A00] hover:bg-[#E66E00] text-white font-display font-bold text-sm px-6 py-2.5 rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-98 transition-all duration-200 cursor-pointer">
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Hamburger Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-800"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-slate-900" />
          ) : (
            <Menu className="h-6 w-6 text-slate-900" />
          )}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden bg-white border-b border-slate-200 shadow-xl"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {/* Main Nav Links (Always visible) */}
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold text-slate-700 hover:text-[#FF7A00] py-2 font-body transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {isAuthenticated ? (
                <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
                  <div className="px-3 py-2 bg-slate-50 rounded-xl">
                    <p className="text-sm font-bold text-slate-900 font-display">{user?.name}</p>
                    <p className="text-xs text-slate-500 font-body">{user?.email}</p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#FF7A00] rounded-xl font-body"
                  >
                    <SettingsIcon className="h-4 w-4 text-[#FF7A00]" />
                    Profile & Settings
                  </Link>
                  <Link
                    to="/interview/setup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#FF7A00] rounded-xl font-body"
                  >
                    <Video className="h-4 w-4 text-violet-600" />
                    Mock Interview
                  </Link>
                  <Link
                    to="/analysis"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#FF7A00] rounded-xl font-body"
                  >
                    <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                    Analysis Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl font-body text-left"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-slate-100">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-5 py-2.5 text-sm font-semibold font-body text-slate-700 hover:text-slate-900 border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <button className="w-full inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#E66E00] text-white font-display font-bold text-sm px-6 py-2.5 rounded-full shadow-lg shadow-orange-500/25 transition-all">
                      Get Started
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
