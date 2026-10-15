import React from 'react';
import { useLocation } from 'react-router-dom';
import TopNav from '../components/TopNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const path = location.pathname;
  // Live secure interview room pattern: all video and coding rooms run full-screen with 0 sidebars
  const isVideoRoom =
    path.startsWith('/video/') &&
    !path.startsWith('/video/new') &&
    !path.startsWith('/video/setup') &&
    !path.startsWith('/video/history') &&
    !path.startsWith('/video/catalog') &&
    !path.startsWith('/video/review') &&
    !path.startsWith('/video/precheck') &&
    !path.startsWith('/video/device-check') &&
    !path.includes('/analysis') &&
    !path.includes('/complete') &&
    !path.includes('/replay');

  const isCodingRoom =
    path.startsWith('/coding/') &&
    !path.startsWith('/coding/new') &&
    !path.startsWith('/coding/setup') &&
    !path.startsWith('/coding/history') &&
    !path.includes('/analysis');

  const isOralOrLegacyRoom =
    /^\/interview\/(coding\/)?[^/]+$/.test(path) &&
    path !== '/interview/setup' &&
    path !== '/interview/new' &&
    path !== '/oral/new' &&
    path !== '/interview/coding/new' &&
    path !== '/interview/catalog' &&
    path !== '/interview/history' &&
    !path.includes('/analysis');

  const isSecureInterviewRoom =
    isVideoRoom ||
    isCodingRoom ||
    isOralOrLegacyRoom ||
    path.startsWith('/challenges/match/');

  const isSystemDesignStudio =
    path.startsWith('/system-design/studio/') ||
    (/^\/system-design\/(room\/)?[^/]+$/.test(path) &&
      !path.startsWith('/system-design/new') &&
      !path.startsWith('/system-design/setup') &&
      !path.startsWith('/system-design/review') &&
      !path.startsWith('/system-design/precheck') &&
      !path.startsWith('/system-design/device-check') &&
      !path.startsWith('/system-design/history') &&
      !path.includes('/analysis'));

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

  if (isSystemDesignStudio) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-white dark:bg-[#000000] text-slate-900 dark:text-slate-100 relative select-none">
        {children}
      </div>
    );
  }

  if (isPublicRoute || isAdminRoute) {
    return <>{children}</>;
  }

  // Dashboard platform routes (dashboard, setup/new, history, analytics, settings)
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#EFFAFD] dark:bg-[#000000] text-[#11183D] dark:text-[#FFFFFF] transition-colors">
      
      {/* Skip to Main Content Accessibility Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#4A8BDF] focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Workspace Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-[#EFFAFD] dark:bg-[#000000]">
        <TopNav />

        {/* Scrollable workspace content container */}
        <div 
          id="workspace-viewport"
          role="region"
          aria-label="Workspace content view"
          className="flex-1 h-full overflow-y-auto bg-[#EFFAFD] dark:bg-[#000000] text-[#11183D] dark:text-[#FFFFFF] relative focus:outline-none transition-colors"
        >
          {children}
        </div>
      </div>

    </div>
  );
}
