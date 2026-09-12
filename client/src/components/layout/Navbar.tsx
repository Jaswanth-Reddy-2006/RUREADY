import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Menu, X, LogOut, ArrowRight, LayoutDashboard, Settings as SettingsIcon, Video, FileText } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'How it Works', href: '/#workflow' },
  { label: 'ATS Scanner', href: '/ats' },
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

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3.5 pb-2 transition-all duration-300 pointer-events-none',
      )}
    >
      <nav
        className={clsx(
          'pointer-events-auto max-w-5xl mx-auto rounded-full transition-all duration-300 px-5 sm:px-7 py-2.5 flex items-center justify-between border shadow-lg',
          scrolled || !isLanding
            ? 'bg-white/95 backdrop-blur-xl border-[#DCE7F2] shadow-[#11183D]/5'
            : 'bg-white/90 backdrop-blur-md border-[#DCE7F2]/80 shadow-[#11183D]/5',
        )}
      >
        {/* Left: Brand Logo */}
        <Link to="/" className="shrink-0 flex items-center">
          <Logo size="md" theme="light" />
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-7 lg:gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#526078] hover:text-[#11183D] transition-colors duration-200 font-sans"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Auth Buttons (Logged Out) OR Profile Avatar Dropdown (Logged In) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              {/* Profile Avatar Icon */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-[#4A8BDF]/40 transition-all duration-200 bg-white border border-[#DCE7F2] shadow-xs cursor-pointer"
                aria-label="User Profile Menu"
              >
                <div className="h-9 w-9 rounded-full bg-[#4A8BDF] flex items-center justify-center text-white font-bold text-sm font-sans shadow-sm">
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
                    className="absolute right-0 mt-3 w-64 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xl p-2.5 text-[#11183D] z-50"
                  >
                    {/* User Info Header */}
                    <div className="px-3.5 py-3 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] mb-2">
                      <p className="text-sm font-bold text-[#11183D] font-sans truncate">
                        {user?.name || 'Candidate'}
                      </p>
                      <p className="text-xs text-[#526078] font-sans truncate">
                        {user?.email || 'user@ruready.app'}
                      </p>
                    </div>

                    {/* Navigation Actions */}
                    <div className="space-y-1">
                      <Link
                        to="/settings"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#526078] hover:text-[#4A8BDF] hover:bg-[#EFFAFD] rounded-xl transition-colors font-sans"
                      >
                        <SettingsIcon className="h-4 w-4 text-[#4A8BDF]" />
                        <span>Profile & Settings</span>
                      </Link>
                      <Link
                        to="/interview/setup"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#526078] hover:text-[#A0006D] hover:bg-[#F8EAF4] rounded-xl transition-colors font-sans"
                      >
                        <Video className="h-4 w-4 text-[#A0006D]" />
                        <span>Mock Interview</span>
                        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F8EAF4] text-[#A0006D]">AI</span>
                      </Link>
                      <Link
                        to="/ats"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#526078] hover:text-[#4A8BDF] hover:bg-[#EFFAFD] rounded-xl transition-colors font-sans"
                      >
                        <FileText className="h-4 w-4 text-[#4A8BDF]" />
                        <span>ATS Scanner</span>
                        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EFFAFD] text-[#4A8BDF]">NEW</span>
                      </Link>
                      <Link
                        to="/analysis"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#526078] hover:text-[#4A8BDF] hover:bg-[#EFFAFD] rounded-xl transition-colors font-sans"
                      >
                        <LayoutDashboard className="h-4 w-4 text-[#4A8BDF]" />
                        <span>Analysis Dashboard</span>
                      </Link>
                    </div>

                    {/* Logout Option */}
                    <div className="pt-2 mt-2 border-t border-[#DCE7F2]">
                      <button
                        onClick={() => logout()}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#D64545] hover:bg-[#FDF2F2] rounded-xl transition-colors font-sans cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-[#D64545]" />
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
                <button className="px-4.5 py-2 text-xs sm:text-sm font-semibold font-sans text-[#11183D] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#DCE7F2] rounded-full transition-all duration-200 cursor-pointer">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="inline-flex items-center gap-1.5 bg-[#11183D] hover:bg-[#1E293B] text-white font-sans font-semibold text-xs sm:text-sm px-5 py-2 rounded-full shadow-sm hover:shadow active:scale-98 transition-all duration-200 cursor-pointer">
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
          className="md:hidden p-2 rounded-full hover:bg-[#EFFAFD] transition-colors text-[#11183D]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-[#11183D]" />
          ) : (
            <Menu className="h-5 w-5 text-[#11183D]" />
          )}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto md:hidden max-w-5xl mx-auto mt-2 rounded-3xl bg-white/98 backdrop-blur-xl border border-[#DCE7F2] shadow-2xl overflow-hidden p-5"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold text-[#526078] hover:text-[#11183D] py-2 font-sans transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {isAuthenticated ? (
                <div className="pt-3 mt-2 border-t border-[#DCE7F2] space-y-2">
                  <div className="px-3 py-2 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl">
                    <p className="text-sm font-bold text-[#11183D] font-sans">{user?.name}</p>
                    <p className="text-xs text-[#526078] font-sans">{user?.email}</p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#526078] hover:text-[#4A8BDF] rounded-xl font-sans"
                  >
                    <SettingsIcon className="h-4 w-4 text-[#4A8BDF]" />
                    Profile & Settings
                  </Link>
                  <Link
                    to="/interview/setup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#526078] hover:text-[#A0006D] rounded-xl font-sans"
                  >
                    <Video className="h-4 w-4 text-[#A0006D]" />
                    Mock Interview
                  </Link>
                  <Link
                    to="/analysis"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#526078] rounded-xl font-sans"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#4A8BDF]" />
                    Analysis Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#D64545] hover:bg-[#FDF2F2] rounded-xl font-sans text-left"
                  >
                    <LogOut className="h-4 w-4 text-[#D64545]" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 pt-3 mt-2 border-t border-[#DCE7F2]">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-5 py-2.5 text-sm font-semibold font-sans text-[#11183D] bg-[#F8FAFC] border border-[#DCE7F2] rounded-full hover:bg-[#F1F5F9] transition-all">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <button className="w-full inline-flex items-center justify-center gap-2 bg-[#11183D] hover:bg-[#1E293B] text-white font-sans font-semibold text-sm px-6 py-2.5 rounded-full shadow-sm transition-all">
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

