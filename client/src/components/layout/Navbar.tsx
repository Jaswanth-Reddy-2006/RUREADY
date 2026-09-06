import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Menu, X, LogOut, User as UserIcon, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#workflow' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
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
      ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
      : 'bg-transparent';

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        navBg,
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16 lg:h-20">
        {/* Left: Logo */}
        <Link to="/" className="shrink-0">
          <Logo size="sm" theme="light" />
        </Link>

        {/* Center: Nav Links (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {!isAuthenticated && NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 font-body"
            >
              {link.label}
            </a>
          ))}
          {isAuthenticated && (
            <>
              <Link
                to="/interview/setup"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 font-body"
              >
                Mock Interview
              </Link>
              <Link
                to="/analysis"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 font-body"
              >
                Analysis Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Right: Auth Buttons / User Menu (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-100 transition-colors duration-200"
              >
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm font-display shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium font-body text-slate-800 max-w-[120px] truncate">
                  {user?.name || 'User'}
                </span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl p-2 text-slate-800"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-semibold text-slate-900 font-body truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 font-body truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/interview/setup"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-body"
                    >
                      <UserIcon className="h-4 w-4 text-primary-500" />
                      Mock Interview
                    </Link>
                    <Link
                      to="/analysis"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-body"
                    >
                      <UserIcon className="h-4 w-4 text-primary-500" />
                      Analysis Dashboard
                    </Link>
                    <button
                      onClick={() => logout()}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-body"
                    >
                      <LogOut className="h-4 w-4" />
                      {isLoggingOut ? 'Logging out...' : 'Log out'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="px-5 py-2 text-sm font-semibold font-body text-slate-700 hover:text-slate-900 border border-slate-200 rounded-full hover:bg-slate-50 transition-all duration-200 shadow-sm">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="inline-flex items-center gap-2 bg-[#FF7A00] hover:bg-[#E66E00] text-white font-display font-bold text-sm px-6 py-2.5 rounded-full shadow-lg shadow-[#FF7A00]/25 hover:shadow-[#FF7A00]/40 active:scale-98 transition-all duration-200">
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden bg-obsidian-900 border-b border-white/10"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {!isAuthenticated && NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-slate-300 hover:text-white py-2 font-body transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/interview/setup"
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-slate-300 hover:text-white py-2 font-body transition-colors"
                  >
                    Mock Interview
                  </Link>
                  <Link
                    to="/analysis"
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-slate-300 hover:text-white py-2 font-body transition-colors"
                  >
                    Analysis Dashboard
                  </Link>
                  <div className="pt-2 border-t border-white/[0.08]">
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="text-base font-medium text-red-400 py-2 font-body"
                    >
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-5 py-2.5 text-sm font-medium font-body text-slate-300 hover:text-white border border-white/15 rounded-full hover:bg-white/5 transition-all">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <button className="w-full inline-flex items-center justify-center gap-2 bg-solar-orange-500 hover:bg-solar-orange-600 text-white font-display font-bold text-sm px-6 py-2.5 rounded-full shadow-glow transition-all">
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
