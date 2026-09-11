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

  const navBg = scrolled
    ? 'bg-white/95 backdrop-blur-xl border-b border-[#DCE7F2] shadow-sm'
    : isLanding
    ? 'bg-[#EFFAFD]/80 backdrop-blur-md border-b border-[#DCE7F2]/40'
    : 'bg-white/95 backdrop-blur-xl border-b border-[#DCE7F2] shadow-sm';

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

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-[#526078] hover:text-[#4A8BDF] transition-colors duration-200 font-body"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Auth Buttons (Logged Out) OR Profile Avatar Dropdown (Logged In) */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              {/* Profile Avatar Icon */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-[#4A8BDF]/40 transition-all duration-200 bg-white border border-[#DCE7F2] shadow-xs cursor-pointer"
                aria-label="User Profile Menu"
              >
                <div className="h-9 w-9 rounded-full bg-[#4A8BDF] flex items-center justify-center text-white font-black text-sm font-display shadow-sm">
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
                      <p className="text-sm font-bold text-[#11183D] font-display truncate">
                        {user?.name || 'Candidate'}
                      </p>
                      <p className="text-xs text-[#526078] font-body truncate">
                        {user?.email || 'user@ruready.app'}
                      </p>
                    </div>

                    {/* Navigation Actions */}
                    <div className="space-y-1">
                      <Link
                        to="/settings"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#526078] hover:text-[#4A8BDF] hover:bg-[#EFFAFD] rounded-xl transition-colors font-body"
                      >
                        <SettingsIcon className="h-4 w-4 text-[#4A8BDF]" />
                        <span>Profile & Settings</span>
                      </Link>
                      <Link
                        to="/interview/setup"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#526078] hover:text-[#A0006D] hover:bg-[#F8EAF4] rounded-xl transition-colors font-body"
                      >
                        <Video className="h-4 w-4 text-[#A0006D]" />
                        <span>Mock Interview</span>
                        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F8EAF4] text-[#A0006D]">AI</span>
                      </Link>
                      <Link
                        to="/ats"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#526078] hover:text-[#4A8BDF] hover:bg-[#EFFAFD] rounded-xl transition-colors font-body"
                      >
                        <FileText className="h-4 w-4 text-[#4A8BDF]" />
                        <span>ATS Scanner</span>
                        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EFFAFD] text-[#4A8BDF]">NEW</span>
                      </Link>
                      <Link
                        to="/analysis"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#526078] hover:text-[#4A8BDF] hover:bg-[#EFFAFD] rounded-xl transition-colors font-body"
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
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#D64545] hover:bg-[#FDF2F2] rounded-xl transition-colors font-body cursor-pointer"
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
                <button className="px-5 py-2 text-sm font-semibold font-body text-[#11183D] hover:text-[#4A8BDF] border border-[#DCE7F2] rounded-xl bg-white hover:bg-[#EFFAFD] transition-all duration-200 shadow-sm cursor-pointer">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="inline-flex items-center gap-2 bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md active:scale-98 transition-all duration-200 cursor-pointer">
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
          className="md:hidden p-2 rounded-xl hover:bg-[#EFFAFD] transition-colors text-[#11183D]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-[#11183D]" />
          ) : (
            <Menu className="h-6 w-6 text-[#11183D]" />
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
            className="md:hidden overflow-hidden bg-[#EFFAFD] border-b border-[#DCE7F2] shadow-xl"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold text-[#526078] hover:text-[#4A8BDF] py-2 font-body transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {isAuthenticated ? (
                <div className="pt-3 mt-2 border-t border-[#DCE7F2] space-y-2">
                  <div className="px-3 py-2 bg-white border border-[#DCE7F2] rounded-xl">
                    <p className="text-sm font-bold text-[#11183D] font-display">{user?.name}</p>
                    <p className="text-xs text-[#526078] font-body">{user?.email}</p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#526078] hover:text-[#4A8BDF] rounded-xl font-body"
                  >
                    <SettingsIcon className="h-4 w-4 text-[#4A8BDF]" />
                    Profile & Settings
                  </Link>
                  <Link
                    to="/interview/setup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#526078] hover:text-[#A0006D] rounded-xl font-body"
                  >
                    <Video className="h-4 w-4 text-[#A0006D]" />
                    Mock Interview
                  </Link>
                  <Link
                    to="/analysis"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#526078] rounded-xl font-body"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#4A8BDF]" />
                    Analysis Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#D64545] hover:bg-[#FDF2F2] rounded-xl font-body text-left"
                  >
                    <LogOut className="h-4 w-4 text-[#D64545]" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-[#DCE7F2]">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-5 py-2.5 text-sm font-semibold font-body text-[#11183D] hover:text-[#4A8BDF] border border-[#DCE7F2] rounded-xl bg-white transition-all">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <button className="w-full inline-flex items-center justify-center gap-2 bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all">
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
