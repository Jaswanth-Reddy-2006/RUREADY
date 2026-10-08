import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Agentation } from 'agentation';
import { useProfileStore } from './store/useProfileStore';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import PublicVerificationPage from './pages/PublicVerificationPage';

// Interview flow pages
import UnifiedInterviewHub from './pages/interview/UnifiedInterviewHub';
import InterviewHistoryPage from './pages/interview/InterviewHistoryPage';
import OralCommandCenter from './pages/interview/OralCommandCenter';
import CodingCommandCenter from './pages/interview/CodingCommandCenter';
import SetupForm from './pages/interview/SetupForm';
import OralReviewPage from './pages/interview/OralReviewPage';
import OralPreCheckPage from './pages/interview/OralPreCheckPage';
import DeviceCheck from './pages/interview/DeviceCheck';
import InterviewRoom from './pages/interview/InterviewRoom';
import Complete from './pages/interview/Complete';
import AnalysisReport from './pages/interview/AnalysisReport';
import InterviewReplay from './pages/interview/InterviewReplay';
import CodingSetupForm from './components/interview/CodingSetupForm';
import CodingInterviewRoom from './components/interview/CodingInterviewRoom';
import OralHistoryPage from './pages/interview/OralHistoryPage';
import CompanyWiseCatalogPage from './pages/interview/CompanyWiseCatalogPage';
import CompanyTrackDetailPage from './pages/interview/CompanyTrackDetailPage';

// Placement Preparation Engine pages
import PreparationCommandCenter from './pages/prep/PreparationCommandCenter';
import LearnLessonPage from './pages/prep/LearnLessonPage';
import PracticeQuizPage from './pages/prep/PracticeQuizPage';
import TestAssessmentPage from './pages/prep/TestAssessmentPage';
import SubjectOverviewPage from './pages/prep/SubjectOverviewPage';
import TopicDetailPage from './pages/prep/TopicDetailPage';
import SkillMapPage from './pages/prep/SkillMapPage';
import DailyPrepPage from './pages/prep/DailyPrepPage';

// Online Challenges & Multiplayer Arena pages
import OnlineChallengesHub from './pages/challenges/OnlineChallengesHub';
import BattleArena1v1 from './pages/challenges/BattleArena1v1';
import MultiplayerContestRoom from './pages/challenges/MultiplayerContestRoom';
import MultiplayerQuizArena from './pages/challenges/MultiplayerQuizArena';
import ChallengesLeaderboardPage from './pages/challenges/ChallengesLeaderboardPage';

// System Design Studio pages
import SystemDesignHub from './pages/system-design/SystemDesignHub';
import SystemDesignStudio from './pages/system-design/SystemDesignStudio';
import SystemDesignHistory from './pages/system-design/SystemDesignHistory';
import SystemDesignSetupForm from './pages/system-design/SystemDesignSetupForm';

// Analysis pages
import Dashboard from './pages/analysis/Dashboard';
import SessionDetail from './pages/analysis/SessionDetail';
import AnalyticsPage from './pages/analysis/AnalyticsPage';
import Settings from './pages/Settings';
import ResumeDashboard from './pages/resume/ResumeDashboard';
import ResumeBuilderPage from './pages/resume/ResumeBuilderPage';
import AtsAnalyzerPage from './pages/resume/AtsAnalyzerPage';
import ResumeVersionsPage from './pages/resume/ResumeVersionsPage';
import ResumePreviewPage from './pages/resume/ResumePreviewPage';
import RoadmapCatalog from './pages/roadmap/RoadmapCatalog';
import RoadmapView from './pages/roadmap/RoadmapView';
import RoadmapBuilderPage from './pages/roadmap/RoadmapBuilderPage';
import DiscussPage from './pages/discuss/DiscussPage';
import DiscussDetail from './pages/discuss/DiscussDetail';
import ProfilePage from './pages/profile/ProfilePage';
import PlacementCommandCenterPage from './pages/placement/PlacementCommandCenterPage';
import AddApplicationPage from './pages/placement/AddApplicationPage';
import ApplicationDetailPage from './pages/placement/ApplicationDetailPage';

// Layout shell
import AppLayout from './layouts/AppLayout';
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminModels from './pages/admin/AdminModels';
import AdminRevenue from './pages/admin/AdminRevenue';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLogs from './pages/admin/AdminLogs';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSessionDetail from './pages/admin/AdminSessionDetail';
import AdminSystemControls from './pages/admin/AdminSystemControls';
import AdminBroadcasts from './pages/admin/AdminBroadcasts';
import AdminIntegrity from './pages/admin/AdminIntegrity';
import FeatureGuard from './components/auth/FeatureGuard';

/** The global marketing header/footer should only render on public marketing pages. */
function shouldShowHeaderFooter(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/contact' ||
    pathname === '/terms' ||
    pathname === '/privacy'
  );
}

function App() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { preferences, syncWithAuthUser } = useProfileStore();

  // Sync profile store with current authenticated user state
  useEffect(() => {
    if (user) {
      syncWithAuthUser(user);
    }
  }, [user]);

  // Dynamically apply theme (light, dark, or system preference) on root html
  useEffect(() => {
    const root = document.documentElement;
    const mode = preferences?.themeMode || 'light';

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    if (mode === 'dark') {
      applyTheme(true);
    } else if (mode === 'light') {
      applyTheme(false);
    } else if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences?.themeMode]);

  const showHeaderFooter = shouldShowHeaderFooter(location.pathname);
  const isLiveInterviewRoom =
    (/^\/interview\/(coding\/)?[^/]+$/.test(location.pathname) ||
     /^\/video\/room\/[^/]+$/.test(location.pathname) ||
     /^\/oral\/room\/[^/]+$/.test(location.pathname) ||
     /^\/coding\/room\/[^/]+$/.test(location.pathname)) &&
    location.pathname !== '/interview/setup' &&
    location.pathname !== '/interview/new' &&
    location.pathname !== '/interview/review' &&
    location.pathname !== '/interview/precheck' &&
    location.pathname !== '/interview/history' &&
    location.pathname !== '/interview/coding' &&
    location.pathname !== '/interview/coding/new' &&
    location.pathname !== '/video/new' &&
    location.pathname !== '/video/setup' &&
    location.pathname !== '/video/review' &&
    location.pathname !== '/video/precheck' &&
    location.pathname !== '/video/history' &&
    location.pathname !== '/video/device-check' &&
    location.pathname !== '/oral/new' &&
    location.pathname !== '/oral/setup' &&
    location.pathname !== '/oral/review' &&
    location.pathname !== '/oral/precheck' &&
    location.pathname !== '/oral/history' &&
    location.pathname !== '/oral/device-check' &&
    !location.pathname.includes('/analytics') &&
    !location.pathname.includes('/results');

  return (
    <AppLayout>
      <div className={isLiveInterviewRoom ? 'min-h-screen bg-secondary-950 text-white' : 'flex min-h-screen flex-col bg-white text-slate-800'}>
        {showHeaderFooter && <Navbar />}
        <main
          id="main-content"
          tabIndex={-1}
          className={
            isLiveInterviewRoom
              ? 'relative min-h-screen bg-secondary-950 text-white focus:outline-none'
              : 'relative flex-1 bg-white focus:outline-none'
          }
        >
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Marketing, authentication, and public verification routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/verify/:verificationId" element={<PublicVerificationPage />} />

              {/* Workspace Dashboard & Navigation links */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preparation"
                element={
                  <ProtectedRoute>
                    <PreparationCommandCenter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preparation/subject/:subjectId"
                element={
                  <ProtectedRoute>
                    <SubjectOverviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preparation/topic/:topicId"
                element={
                  <ProtectedRoute>
                    <TopicDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preparation/learn/:topicId"
                element={
                  <ProtectedRoute>
                    <LearnLessonPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preparation/practice/:topicId"
                element={
                  <ProtectedRoute>
                    <PracticeQuizPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preparation/test/:subjectId"
                element={
                  <ProtectedRoute>
                    <TestAssessmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preparation/assessment"
                element={
                  <ProtectedRoute>
                    <TestAssessmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preparation/skills"
                element={
                  <ProtectedRoute>
                    <SkillMapPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preparation/today"
                element={
                  <ProtectedRoute>
                    <DailyPrepPage />
                  </ProtectedRoute>
                }
              />
              {/* Video Interview Routes */}
              <Route
                path="/video"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="video_interview" featureTitle="Video Interview">
                      <OralCommandCenter />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/new"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="video_interview" featureTitle="Video Interview">
                      <SetupForm />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/setup"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="video_interview" featureTitle="Video Interview">
                      <SetupForm />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/review"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="video_interview" featureTitle="Video Interview">
                      <OralReviewPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/precheck"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="video_interview" featureTitle="Video Interview">
                      <OralPreCheckPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/device-check"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="video_interview" featureTitle="Video Interview">
                      <OralPreCheckPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/history"
                element={
                  <ProtectedRoute>
                    <InterviewHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/room/:id"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="video_interview" featureTitle="Video Interview">
                      <ErrorBoundary fallbackTitle="Interview room error">
                        <InterviewRoom />
                      </ErrorBoundary>
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/:id"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="video_interview" featureTitle="Video Interview">
                      <ErrorBoundary fallbackTitle="Interview room error">
                        <InterviewRoom />
                      </ErrorBoundary>
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/:id/room"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="video_interview" featureTitle="Video Interview">
                      <ErrorBoundary fallbackTitle="Interview room error">
                        <InterviewRoom />
                      </ErrorBoundary>
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/:id/analysis"
                element={
                  <ProtectedRoute>
                    <AnalysisReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/:id/complete"
                element={
                  <ProtectedRoute>
                    <Complete />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/:id/replay"
                element={
                  <ProtectedRoute>
                    <InterviewReplay />
                  </ProtectedRoute>
                }
              />

              {/* Automatic Redirects for Legacy Hub & Oral Routes */}
              <Route path="/interview" element={<Navigate to="/video" replace />} />
              <Route path="/interviews" element={<Navigate to="/video" replace />} />
              <Route path="/oral" element={<Navigate to="/video" replace />} />
              <Route path="/oral/new" element={<Navigate to="/video/new" replace />} />
              <Route path="/oral/setup" element={<Navigate to="/video/setup" replace />} />
              <Route path="/oral/review" element={<Navigate to="/video/review" replace />} />
              <Route path="/oral/precheck" element={<Navigate to="/video/precheck" replace />} />
              <Route path="/oral/device-check" element={<Navigate to="/video/device-check" replace />} />
              <Route path="/oral/history" element={<Navigate to="/video/history" replace />} />

              {/* Coding Interview Routes */}
              <Route
                path="/coding"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="coding_interview" featureTitle="Coding Interview">
                      <CodingCommandCenter />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coding/new"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="coding_interview" featureTitle="Coding Interview">
                      <CodingSetupForm />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coding/history"
                element={
                  <ProtectedRoute>
                    <InterviewHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coding/:id"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="coding_interview" featureTitle="Coding Interview">
                      <ErrorBoundary fallbackTitle="Coding room error">
                        <CodingInterviewRoom />
                      </ErrorBoundary>
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coding/:id/room"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="coding_interview" featureTitle="Coding Interview">
                      <ErrorBoundary fallbackTitle="Coding room error">
                        <CodingInterviewRoom />
                      </ErrorBoundary>
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coding/room/:id"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="coding_interview" featureTitle="Coding Interview">
                      <ErrorBoundary fallbackTitle="Coding room error">
                        <CodingInterviewRoom />
                      </ErrorBoundary>
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coding/:id/analysis"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="coding_interview" featureTitle="Coding Interview">
                      <SessionDetail />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/coding"
                element={<Navigate to="/coding" replace />}
              />
              <Route
                path="/interview/history"
                element={
                  <ProtectedRoute>
                    <InterviewHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interviews/history"
                element={
                  <ProtectedRoute>
                    <InterviewHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interviews/company-wise"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="company_wise_interview" featureTitle="Company-wise Tracks">
                      <CompanyWiseCatalogPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/company-wise"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="company_wise_interview" featureTitle="Company-wise Tracks">
                      <CompanyWiseCatalogPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company-wise"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="company_wise_interview" featureTitle="Company-wise Tracks">
                      <CompanyWiseCatalogPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interviews/company-wise/:companyId"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="company_wise_interview" featureTitle="Company-wise Tracks">
                      <CompanyTrackDetailPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />

              {/* Online Challenges & Multiplayer Competition Routes */}
              <Route
                path="/challenges"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="challenges_arena" featureTitle="Online Challenges">
                      <OnlineChallengesHub />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challenges/quizzes"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="challenges_arena" featureTitle="Online Challenges">
                      <MultiplayerQuizArena />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challenges/quiz/:sessionId"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="challenges_arena" featureTitle="Online Challenges">
                      <MultiplayerQuizArena />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challenges/room/:roomId"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="challenges_arena" featureTitle="Online Challenges">
                      <MultiplayerContestRoom />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challenges/leaderboard"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="challenges_arena" featureTitle="Online Challenges">
                      <ChallengesLeaderboardPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challenges/match/:matchId"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="challenges_arena" featureTitle="Online Challenges">
                      <BattleArena1v1 />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />

              {/* System Design Whiteboard Studio Routes */}
              <Route
                path="/system-design"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="system_design_interview" featureTitle="System Design">
                      <SystemDesignHub />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/system-design/new"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="system_design_interview" featureTitle="System Design Setup">
                      <SystemDesignSetupForm />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/system-design/studio/:sessionId"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="system_design_interview" featureTitle="System Design Studio">
                      <SystemDesignStudio />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/system-design/history"
                element={
                  <ProtectedRoute>
                    <SystemDesignHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/company-wise/:companyId"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="company_wise_interview" featureTitle="Company-wise Tracks">
                      <CompanyTrackDetailPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company-wise/:companyId"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="company_wise_interview" featureTitle="Company-wise Tracks">
                      <CompanyTrackDetailPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:username"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume-parser"
                element={<Navigate to="/resume" replace />}
              />
              <Route
                path="/resume"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="ai_resume_ats" featureTitle="Resume">
                      <ResumeBuilderPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/builder"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="ai_resume_ats" featureTitle="Resume">
                      <ResumeBuilderPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/dashboard"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="ai_resume_ats" featureTitle="Resume">
                      <ResumeDashboard />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/edit/:id"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="ai_resume_ats" featureTitle="Resume">
                      <ResumeBuilderPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/analyze"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="ai_resume_ats" featureTitle="Resume">
                      <AtsAnalyzerPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/versions"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="ai_resume_ats" featureTitle="Resume">
                      <ResumeVersionsPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/preview/:id"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="ai_resume_ats" featureTitle="Resume">
                      <ResumePreviewPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ats"
                element={<Navigate to="/resume" replace />}
              />
              <Route
                path="/ats/report/:id"
                element={<Navigate to="/resume" replace />}
              />
              <Route
                path="/placement-crm"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="placement_crm" featureTitle="Placement CRM">
                      <PlacementCommandCenterPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/placement-crm/add"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="placement_crm" featureTitle="Placement CRM">
                      <AddApplicationPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/placement-crm/new"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="placement_crm" featureTitle="Placement CRM">
                      <AddApplicationPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/placement-crm/application/:id"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="placement_crm" featureTitle="Placement CRM">
                      <ApplicationDetailPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/placement-crm/app/:id"
                element={
                  <ProtectedRoute>
                    <FeatureGuard featureKey="placement_crm" featureTitle="Placement CRM">
                      <ApplicationDetailPage />
                    </FeatureGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap"
                element={
                  <ProtectedRoute>
                    <RoadmapCatalog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap/builder"
                element={
                  <ProtectedRoute>
                    <RoadmapBuilderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap/create"
                element={
                  <ProtectedRoute>
                    <RoadmapBuilderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap/:id"
                element={
                  <ProtectedRoute>
                    <RoadmapView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/discuss"
                element={
                  <ProtectedRoute>
                    <DiscussPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/discuss/:id"
                element={
                  <ProtectedRoute>
                    <DiscussDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminOverview />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/overview"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminOverview />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/models"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminModels />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/revenue"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminRevenue />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/questions"
                element={<Navigate to="/admin" replace />}
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/logs"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminLogs />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/session/:id"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminSessionDetail />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/integrity"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminIntegrity />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/broadcasts"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminBroadcasts />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/system-controls"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminSystemControls />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminAnalytics />
                    </AdminLayout>
                  </AdminRoute>
                }
              />

              {/* Secure Interview assessment pages */}
              <Route
                path="/interview/new"
                element={
                  <ProtectedRoute>
                    <SetupForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/setup"
                element={
                  <ProtectedRoute>
                    <SetupForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/coding/new"
                element={
                  <ProtectedRoute>
                    <CodingSetupForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/coding/:id"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary fallbackTitle="Coding room error">
                      <CodingInterviewRoom />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/:id/device-check"
                element={
                  <ProtectedRoute>
                    <DeviceCheck />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/:id/complete"
                element={
                  <ProtectedRoute>
                    <Complete />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/:id/analysis"
                element={
                  <ProtectedRoute>
                    <AnalysisReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/:id/replay"
                element={
                  <ProtectedRoute>
                    <InterviewReplay />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/:id"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary fallbackTitle="Interview room error">
                      <InterviewRoom />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/:id/room"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary fallbackTitle="Interview room error">
                      <InterviewRoom />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analysis"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analysis/:id"
                element={
                  <ProtectedRoute>
                    <SessionDetail />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
        {showHeaderFooter && <Footer />}
        {import.meta.env.DEV && import.meta.env.VITE_ENABLE_AGENTATION === 'true' && (
          <Agentation
            endpoint={import.meta.env.VITE_AGENTATION_ENDPOINT || 'http://localhost:4747'}
            onSessionCreated={(sessionId) => {
              console.log('Agentation session started:', sessionId);
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}

export default App;
