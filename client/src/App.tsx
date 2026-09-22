import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Agentation } from 'agentation';
import { useProfileStore } from './store/useProfileStore';
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

// Interview flow pages
import OralCommandCenter from './pages/interview/OralCommandCenter';
import CodingCommandCenter from './pages/interview/CodingCommandCenter';
import SetupForm from './pages/interview/SetupForm';
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



// Analysis pages
import Dashboard from './pages/analysis/Dashboard';
import SessionDetail from './pages/analysis/SessionDetail';
import AnalyticsPage from './pages/analysis/AnalyticsPage';
import Settings from './pages/Settings';
import AtsScanner from './pages/ats/AtsScanner';
import AtsReport from './pages/ats/AtsReport';
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
import AdminUsers from './pages/admin/AdminUsers';
import AdminLogs from './pages/admin/AdminLogs';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSessionDetail from './pages/admin/AdminSessionDetail';

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
  const { preferences } = useProfileStore();

  // Maintain crisp light SaaS theme globally on root html
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }, [preferences.themeMode]);

  const showHeaderFooter = shouldShowHeaderFooter(location.pathname);
  const isLiveInterviewRoom =
    /^\/interview\/(coding\/)?[^/]+$/.test(location.pathname) &&
    location.pathname !== '/interview/setup' &&
    location.pathname !== '/interview/new' &&
    location.pathname !== '/oral/new' &&
    location.pathname !== '/interview/coding/new';

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
              {/* Marketing and authentication routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

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
              <Route
                path="/oral"
                element={
                  <ProtectedRoute>
                    <OralCommandCenter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coding"
                element={
                  <ProtectedRoute>
                    <CodingCommandCenter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/coding"
                element={
                  <ProtectedRoute>
                    <CodingCommandCenter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview"
                element={
                  <ProtectedRoute>
                    <OralCommandCenter />
                  </ProtectedRoute>
                }
              />
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
                path="/oral/new"
                element={
                  <ProtectedRoute>
                    <SetupForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/oral/history"
                element={
                  <ProtectedRoute>
                    <OralHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interviews/company-wise"
                element={
                  <ProtectedRoute>
                    <CompanyWiseCatalogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/company-wise"
                element={
                  <ProtectedRoute>
                    <CompanyWiseCatalogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company-wise"
                element={
                  <ProtectedRoute>
                    <CompanyWiseCatalogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interviews/company-wise/:companyId"
                element={
                  <ProtectedRoute>
                    <CompanyTrackDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/company-wise/:companyId"
                element={
                  <ProtectedRoute>
                    <CompanyTrackDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company-wise/:companyId"
                element={
                  <ProtectedRoute>
                    <CompanyTrackDetailPage />
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
                path="/resume"
                element={
                  <ProtectedRoute>
                    <ResumeDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/builder"
                element={
                  <ProtectedRoute>
                    <ResumeBuilderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/edit/:id"
                element={
                  <ProtectedRoute>
                    <ResumeBuilderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/analyze"
                element={
                  <ProtectedRoute>
                    <AtsAnalyzerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/versions"
                element={
                  <ProtectedRoute>
                    <ResumeVersionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/preview/:id"
                element={
                  <ProtectedRoute>
                    <ResumePreviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ats"
                element={
                  <ProtectedRoute>
                    <AtsAnalyzerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ats/report/:id"
                element={
                  <ProtectedRoute>
                    <AtsAnalyzerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/placement-crm"
                element={
                  <ProtectedRoute>
                    <PlacementCommandCenterPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/placement-crm/add"
                element={
                  <ProtectedRoute>
                    <AddApplicationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/placement-crm/new"
                element={
                  <ProtectedRoute>
                    <AddApplicationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/placement-crm/application/:id"
                element={
                  <ProtectedRoute>
                    <ApplicationDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/placement-crm/app/:id"
                element={
                  <ProtectedRoute>
                    <ApplicationDetailPage />
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
        {import.meta.env.DEV && (
          <Agentation
            endpoint="http://localhost:4747"
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
