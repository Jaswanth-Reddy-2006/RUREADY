import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SidebarNav from '../components/SidebarNav';
import Logo from '../components/ui/Logo';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const path = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close mobile drawer on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [path]);

  // Live secure interview room pattern: /interview/:id and /interview/coding/:id (excluding setup/new forms)
  const isSecureInterviewRoom = 
    /^\/interview\/(coding\/)?[^/]+$/.test(path) && 
    path !== '/interview/setup' && 
    path !== '/interview/new' &&
    path !== '/interview/coding/new';

  // Public/Auth routes: / (landing page), /login, /register, /about, /contact, /terms, /privacy
  const isPublicRoute =
    path === '/' ||
    path === '/login' ||
    path === '/register' ||
    path === '/about' ||
    path === '/contact' ||
    path === '/terms' ||
    path === '/privacy';

  // Dedicated Admin portal routes
  const isAdminRoute = path.startsWith('/admin');

  if (isSecureInterviewRoom) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-obsidian-950 bg-[#0A0B0E] relative select-none">
        {children}
      </div>
    );
  }

  if (isPublicRoute || isAdminRoute) {
    return <>{children}</>;
  }

  // Dashboard platform routes (dashboard, setup/new, history, analytics, settings)
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#EFFAFD] text-[#11183D] transition-colors">
      
      {/* Skip to Main Content Accessibility Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#4A8BDF] focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block shrink-0">
        <SidebarNav />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 md:hidden flex"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 h-full"
            >
              <SidebarNav />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Workspace Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Mobile top bar with hamburger */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#DCE7F2] text-[#11183D] shrink-0">
          <div className="flex items-center gap-2">
            <Logo size="sm" theme="light" />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#526078] hover:text-[#11183D] hover:bg-[#EFFAFD] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A8BDF]"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Scrollable workspace content container with pale blue theme */}
        <div 
          id="workspace-viewport"
          role="region"
          aria-label="Workspace content view"
          className="flex-1 h-full overflow-y-auto bg-[#EFFAFD] text-[#11183D] relative focus:outline-none transition-colors"
        >
          {children}
        </div>
      </div>

    </div>
  );
}
