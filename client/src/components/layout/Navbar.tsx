import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { 
  Menu, 
  X, 
  LogOut, 
  ArrowRight, 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  Video, 
  FileText,
  ChevronDown,
  Code2,
  Building2,
  Cpu,
  BrainCircuit,
  Binary,
  Layers,
  Sparkles
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useAuth } from '@/hooks/useAuth';
import ProfileDropdown from '@/components/profile/ProfileDropdown';
import SparkleNavbar from '@/components/lightswind/sparkle-navbar';
import FeaturesMegaMenu from './FeaturesMegaMenu';

const LANDING_NAV_ITEMS = ['Home', 'Features', 'Benefits', 'Pricing', 'FAQ'];

const NAV_LINKS = [
  { label: 'Features', href: '#features', isFeaturesTrigger: true },
  { label: 'Benefits', href: '/#benefits' },
  { label: 'ATS Scanner', href: '/ats' },
  { label: 'Roadmaps', href: '/roadmap' },
  { label: 'Placement CRM', href: '/placement-crm' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [featuresMenuOpen, setFeaturesMenuOpen] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { profile } = useProfileStore();
  const { logout, isLoggingOut } = useAuth();

  const isLanding = location.pathname === '/';

  // Scroll detection for active section on landing page
  useEffect(() => {
    if (!isLanding) return;

    const handleScrollTracking = () => {
      const scrollPos = window.scrollY + 250;

      const featuresEl = document.getElementById('features');
      const benefitsEl = document.getElementById('benefits');
      const pricingEl = document.getElementById('pricing');
      const faqEl = document.getElementById('faq');

      const featuresTop = featuresEl ? featuresEl.offsetTop : 750;
      const benefitsTop = benefitsEl ? benefitsEl.offsetTop : 1550;
      const pricingTop = pricingEl ? pricingEl.offsetTop : 2400;
      const faqTop = faqEl ? faqEl.offsetTop : 3300;

      if (scrollPos >= faqTop - 100) {
        setActiveSectionIndex(4); // FAQ
      } else if (scrollPos >= pricingTop - 100) {
        setActiveSectionIndex(3); // Pricing
      } else if (scrollPos >= benefitsTop - 100) {
        setActiveSectionIndex(2); // Benefits
      } else if (scrollPos >= featuresTop - 100) {
        setActiveSectionIndex(1); // Features
      } else {
        setActiveSectionIndex(0); // Home
      }
    };

    window.addEventListener('scroll', handleScrollTracking, { passive: true });
    handleScrollTracking();
    return () => window.removeEventListener('scroll', handleScrollTracking);
  }, [isLanding]);

  const handleSparkleClick = (item: string, index: number) => {
    setActiveSectionIndex(index);
    if (!isLanding) {
      if (item === 'Home') navigate('/');
      else if (item === 'Features') {
        setFeaturesMenuOpen((prev) => !prev);
      }
      else if (item === 'Benefits') navigate('/#benefits');
      else if (item === 'Pricing') navigate('/#pricing');
      else if (item === 'FAQ') navigate('/#faq');
      return;
    }

    if (item === 'Home') {
      setFeaturesMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'Features') {
      setFeaturesMenuOpen((prev) => !prev);
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'Benefits') {
      setFeaturesMenuOpen(false);
      document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'Pricing') {
      setFeaturesMenuOpen(false);
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'FAQ') {
      setFeaturesMenuOpen(false);
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setFeaturesMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3.5 pb-2 transition-all duration-300 pointer-events-none',
      )}
    >
      <div className="relative max-w-5xl mx-auto">
        <nav
          className={clsx(
            'pointer-events-auto max-w-5xl mx-auto rounded-full transition-all duration-300 px-5 sm:px-7 py-2 flex items-center justify-between border shadow-lg',
            scrolled || !isLanding
              ? 'bg-white/95 backdrop-blur-xl border-[#DCE7F2] shadow-[#11183D]/5'
              : 'bg-white/90 backdrop-blur-md border-[#DCE7F2]/80 shadow-[#11183D]/5',
          )}
        >
          {/* Left: Brand Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <Logo size="md" theme="light" />
          </Link>

          {/* Center: SparkleNavbar on Landing OR Links with Features dropdown trigger */}
          <div className="hidden md:flex items-center">
            {isLanding ? (
              <SparkleNavbar
                items={LANDING_NAV_ITEMS}
                color="#4A8BDF"
                activeIndex={activeSectionIndex}
                onItemClick={handleSparkleClick}
              />
            ) : (
              <div className="flex items-center gap-7 lg:gap-8">
                {NAV_LINKS.map((link) =>
                  link.isFeaturesTrigger ? (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => setFeaturesMenuOpen((prev) => !prev)}
                      className="flex items-center gap-1 text-sm font-semibold text-[#526078] hover:text-[#11183D] transition-colors duration-200 font-sans cursor-pointer"
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          featuresMenuOpen ? 'rotate-180 text-[#4A8BDF]' : 'text-[#7E8B9B]'
                        }`}
                      />
                    </button>
                  ) : link.href.startsWith('/#') ? (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm font-semibold text-[#526078] hover:text-[#11183D] transition-colors duration-200 font-sans"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="text-sm font-semibold text-[#526078] hover:text-[#11183D] transition-colors duration-200 font-sans"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          {/* Right: Auth Buttons (Logged Out) OR Profile Avatar Dropdown (Logged In) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                {/* Profile Avatar Icon with Initial J */}
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#4A8BDF]/40 transition-all duration-200 bg-white border border-[#DCE7F2] shadow-xs cursor-pointer"
                  aria-label="User Profile Menu"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#2459A8] to-[#4A8BDF] flex items-center justify-center text-white font-bold text-xs font-sans shadow-sm border border-white/20">
                    {(profile.name || user?.name || 'Jaswanth Reddy').charAt(0).toUpperCase() || 'J'}
                  </div>
                </button>

                {/* Profile Dropdown */}
                <ProfileDropdown
                  isOpen={userMenuOpen}
                  onClose={() => setUserMenuOpen(false)}
                  positionClass="right-0 mt-3"
                />
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

        {/* Categorized Features Mega Menu Modal / Flyout */}
        <FeaturesMegaMenu
          isOpen={featuresMenuOpen}
          onClose={() => setFeaturesMenuOpen(false)}
        />
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto md:hidden max-w-5xl mx-auto mt-2 rounded-3xl bg-white/98 backdrop-blur-xl border border-[#DCE7F2] shadow-2xl overflow-hidden p-5 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              <div className="pb-2 border-b border-[#DCE7F2]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#7E8B9B]">
                  Features & Placement Modules
                </span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link
                    to="/interview/new"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-[#EFFAFD] text-xs font-bold text-[#4A8BDF] flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Oral Mock</span>
                  </Link>
                  <Link
                    to="/interview/coding/new"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-[#FDF4FB] text-xs font-bold text-[#A0006D] flex items-center gap-2"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Coding Sandbox</span>
                  </Link>
                  <Link
                    to="/company-prep"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE7F2] text-xs font-bold text-[#11183D] flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-[#4A8BDF]" />
                    <span>Company Kits</span>
                  </Link>
                  <Link
                    to="/core-cs"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE7F2] text-xs font-bold text-[#11183D] flex items-center gap-2"
                  >
                    <Cpu className="w-4 h-4 text-[#4A8BDF]" />
                    <span>Core CS Hub</span>
                  </Link>
                  <Link
                    to="/sql-playground"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-700 flex items-center gap-2"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>SQL Lab</span>
                  </Link>
                  <Link
                    to="/aptitude"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE7F2] text-xs font-bold text-[#11183D] flex items-center gap-2"
                  >
                    <BrainCircuit className="w-4 h-4 text-[#4A8BDF]" />
                    <span>Aptitude</span>
                  </Link>
                  <Link
                    to="/dsa-sheets"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE7F2] text-xs font-bold text-[#11183D] flex items-center gap-2"
                  >
                    <Binary className="w-4 h-4 text-[#4A8BDF]" />
                    <span>DSA Sheets</span>
                  </Link>
                  <Link
                    to="/projects"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE7F2] text-xs font-bold text-[#11183D] flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-[#A0006D]" />
                    <span>Blueprints</span>
                  </Link>
                </div>
              </div>

              {NAV_LINKS.filter(l => !l.isFeaturesTrigger).map((link) =>
                link.href.startsWith('/#') ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-semibold text-[#526078] hover:text-[#11183D] py-1.5 font-sans transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-semibold text-[#526078] hover:text-[#11183D] py-1.5 font-sans transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}

              {isAuthenticated ? (
                <div className="pt-3 mt-2 border-t border-[#DCE7F2] space-y-2">
                  <div className="px-3 py-2 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl">
                    <p className="text-sm font-bold text-[#11183D] font-sans">{user?.name}</p>
                    <p className="text-xs text-[#526078] font-sans">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#526078] hover:text-[#4A8BDF] rounded-xl font-sans"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#4A8BDF]" />
                    Candidate Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-[#D64545] hover:bg-[#FDF2F2] rounded-xl font-sans text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 text-[#D64545]" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 pt-3 mt-2 border-t border-[#DCE7F2]">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-5 py-2.5 text-sm font-semibold font-sans text-[#11183D] bg-[#F8FAFC] border border-[#DCE7F2] rounded-full hover:bg-[#F1F5F9] transition-all cursor-pointer">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <button className="w-full inline-flex items-center justify-center gap-2 bg-[#11183D] hover:bg-[#1E293B] text-white font-sans font-semibold text-sm px-6 py-2.5 rounded-full shadow-sm transition-all cursor-pointer">
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
