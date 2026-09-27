import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, ShieldCheck, Sparkles, Plus, Search, Filter,
  Users, Layers, Award, Clock, ArrowRight, BookOpen,
  Code2, CheckCircle2, Bookmark, Check, RefreshCw, GraduationCap,
  Heart, SlidersHorizontal, X, BarChart2, Zap
} from 'lucide-react';
import { useRoadmapStore, Roadmap } from '../../store/useRoadmapStore';
import { useAuthStore } from '../../store/authStore';
import RoadmapCard from '../../components/roadmap/RoadmapCard';
import RoadmapPreviewModal from '../../components/roadmap/RoadmapPreviewModal';
import ActiveRoadmapBanner from '../../components/roadmap/ActiveRoadmapBanner';
import MyRoadmapView from '../../components/roadmap/MyRoadmapView';
import SkillProfileSection from '../../components/roadmap/SkillProfileSection';
import VerifiedExpertBadge from '../../components/roadmap/VerifiedExpertBadge';
import AiRoadmapBuilderModal from '../../components/roadmap/AiRoadmapBuilderModal';
import AiPersonalizationModal from '../../components/roadmap/AiPersonalizationModal';
import SprintExperienceModal from '../../components/roadmap/SprintExperienceModal';
import SprintReviewModal from '../../components/roadmap/SprintReviewModal';
import ManualRoadmapBuilder from '../../components/roadmap/ManualRoadmapBuilder';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

type MainTabType = 'OVERVIEW' | 'MY_ROADMAP' | 'SKILL_PROFILE' | 'VERIFIED_EXPERTS';
type ExploreSubTab = 'ALL' | 'OFFICIAL' | 'COMMUNITY' | 'AI';

export default function RoadmapCatalog() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    roadmaps, 
    enrolledRoadmapIds, 
    likedRoadmapIds,
    activeRoadmapId,
    claimRoadmap,
    syncWithBackend 
  } = useRoadmapStore();

  // Primary Navigation Tab (Overview/Discover, My Roadmap, Skill Profile, Verified Experts)
  const [activeTab, setActiveTab] = useState<MainTabType>('OVERVIEW');
  const [exploreSubTab, setExploreSubTab] = useState<ExploreSubTab>('ALL');

  // Modal Control States
  const [isAiBuilderOpen, setIsAiBuilderOpen] = useState(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [isManualBuilderOpen, setIsManualBuilderOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isSprintReviewOpen, setIsSprintReviewOpen] = useState(false);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'VOTES' | 'NEWEST' | 'STEPS'>('POPULAR');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Preview Modal State
  const [previewRoadmap, setPreviewRoadmap] = useState<Roadmap | null>(null);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  // Find currently active user roadmap object
  const activeRoadmap = useMemo(() => {
    if (activeRoadmapId) {
      return roadmaps.find((r) => r.id === activeRoadmapId) || roadmaps[0];
    }
    if (enrolledRoadmapIds.length > 0) {
      return roadmaps.find((r) => r.id === enrolledRoadmapIds[0]) || roadmaps[0];
    }
    return roadmaps[0];
  }, [roadmaps, activeRoadmapId, enrolledRoadmapIds]);

  // Check if roadmap is enrolled/claimed by the user
  const isUserClaimed = (r: Roadmap) => {
    return enrolledRoadmapIds.includes(r.id);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'ALL') count++;
    if (selectedTier !== 'ALL') count++;
    if (selectedDifficulty !== 'ALL') count++;
    return count;
  }, [selectedCategory, selectedTier, selectedDifficulty]);

  // Filtered & Sorted Roadmaps for Overview / Marketplace
  const filteredRoadmaps = useMemo(() => {
    return roadmaps
      .filter((r) => {
        if (!r) return false;

        // Sub-tab filter
        if (exploreSubTab === 'OFFICIAL' && !r.isOfficial) return false;
        if (exploreSubTab === 'COMMUNITY' && (r.isOfficial || r.isAiGenerated)) return false;
        if (exploreSubTab === 'AI' && !r.isAiGenerated) return false;

        // Category Filter
        if (selectedCategory !== 'ALL' && r.category !== selectedCategory && r.rolePath !== selectedCategory) {
          return false;
        }

        // Tier Filter
        if (selectedTier !== 'ALL' && r.targetCompanyTier !== selectedTier) {
          return false;
        }

        // Difficulty Filter
        if (selectedDifficulty !== 'ALL' && r.difficulty !== selectedDifficulty) {
          return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (r.title || '').toLowerCase().includes(q);
          const matchDesc = (r.description || '').toLowerCase().includes(q);
          const matchTags = (r.tags || []).some((t) => (t || '').toLowerCase().includes(q));
          const matchCreator = (r.creatorName || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchTags && !matchCreator) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'VOTES') return (b.upvotes || 0) - (a.upvotes || 0);
        if (sortBy === 'POPULAR') return (b.enrolledCount || 0) - (a.enrolledCount || 0);
        if (sortBy === 'STEPS') return b.nodesData.length - a.nodesData.length;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    roadmaps, 
    exploreSubTab, 
    selectedCategory, 
    selectedTier, 
    selectedDifficulty, 
    searchQuery, 
    sortBy
  ]);

  const handleOpenPreview = (roadmap: Roadmap) => {
    setPreviewRoadmap(roadmap);
  };

  const handleEnrollAndStart = (roadmap: Roadmap) => {
    claimRoadmap(roadmap.id);
    setPreviewRoadmap(null);
    navigate(`/roadmap/${roadmap.id}`);
  };

  const handleClaimDirectly = (roadmap: Roadmap) => {
    claimRoadmap(roadmap.id);
    toast.success(`Claimed! "${roadmap.title}" added to My Roadmaps.`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedTier('ALL');
    setSelectedDifficulty('ALL');
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 font-body text-[#11183D]">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ══════════════════════════════════════════════════════════ */}
        {/* HERO ROADMAPS MARKETPLACE BANNER                           */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#2459A8] via-[#4A8BDF] to-[#A0006D] p-8 sm:p-10 text-white shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-[#A0006D]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold font-display uppercase tracking-wider text-white border border-white/20">
                <Compass size={14} />
                <span>CAREER ROADMAPS</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
                Find your path. Build your skills. Reach your goal.
              </h1>

              <p className="text-sm text-white/90 leading-relaxed font-normal">
                Explore company-vetted blueprints with <strong>'What should I do?'</strong>, <strong>'What is the source?'</strong>, and <strong>'What is the exact thing?'</strong>. Or architect your own custom sequential roadmap manually and with AI.
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs font-medium text-white/80">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#EFFAFD]" />
                  <span>Official RU Ready Blueprints</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={16} className="text-[#EFFAFD]" />
                  <span>Peer Community Library</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#EFFAFD]" />
                  <span>AI Synthesis Engine</span>
                </div>
              </div>
            </div>

            {/* Creation CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <Button
                variant="eggplant"
                size="md"
                onClick={() => setIsAiBuilderOpen(true)}
                className="shadow-lg text-xs font-display justify-center py-3 px-5 border border-white/20 bg-[#A0006D] hover:bg-[#850059] text-white"
                icon={<Sparkles size={15} />}
              >
                AI Career Planner
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsManualBuilderOpen(true)}
                className="shadow-md text-xs font-display justify-center py-3 px-5 bg-white text-[#11183D] hover:bg-[#EFFAFD] border-0"
                icon={<Plus size={15} className="text-[#4A8BDF]" />}
              >
                Create Roadmap
              </Button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* PRIMARY ARCHITECTURE TABS                                  */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE7F2] pb-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'OVERVIEW'
                  ? 'bg-[#2459A8] text-white shadow-md'
                  : 'bg-white text-[#526078] border border-[#DCE7F2] hover:text-[#11183D]'
              }`}
            >
              <Compass size={14} />
              <span>Overview & Discover</span>
            </button>

            <button
              onClick={() => setActiveTab('MY_ROADMAP')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'MY_ROADMAP'
                  ? 'bg-[#A0006D] text-white shadow-md'
                  : 'bg-white text-[#526078] border border-[#DCE7F2] hover:text-[#11183D]'
              }`}
            >
              <Bookmark size={14} />
              <span>My Active Roadmap</span>
              {enrolledRoadmapIds.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white">
                  {enrolledRoadmapIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('SKILL_PROFILE')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'SKILL_PROFILE'
                  ? 'bg-[#168A62] text-white shadow-md'
                  : 'bg-white text-[#526078] border border-[#DCE7F2] hover:text-[#11183D]'
              }`}
            >
              <BarChart2 size={14} />
              <span>Skill Intelligence</span>
            </button>

            <button
              onClick={() => setActiveTab('VERIFIED_EXPERTS')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'VERIFIED_EXPERTS'
                  ? 'bg-[#B45309] text-white shadow-md'
                  : 'bg-white text-[#526078] border border-[#DCE7F2] hover:text-[#11183D]'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Verified Experts</span>
            </button>
          </div>

          {activeTab === 'OVERVIEW' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#526078] font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] font-bold font-display focus:outline-none shadow-2xs cursor-pointer"
              >
                <option value="POPULAR">Most Claimed / Enrolled</option>
                <option value="VOTES">Highest Upvoted</option>
                <option value="NEWEST">Recently Added</option>
                <option value="STEPS">Most Comprehensive (Steps)</option>
              </select>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TAB 1: OVERVIEW & DISCOVER MARKETPLACE                     */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            {/* Active User Roadmap Section BEFORE Marketplace */}
            {activeRoadmap && (
              <ActiveRoadmapBanner
                roadmap={activeRoadmap}
                onContinueSprint={() => setIsSprintModalOpen(true)}
                onViewRoadmap={() => {
                  setActiveTab('MY_ROADMAP');
                }}
              />
            )}

            {/* Discover & Search Controls */}
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-white border border-[#DCE7F2] rounded-2xl shadow-2xs">
                {/* Sub category pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'ALL', label: 'All Categories' },
                    { id: 'OFFICIAL', label: 'Verified Blueprints' },
                    { id: 'COMMUNITY', label: 'Community Tracks' },
                    { id: 'AI', label: 'AI Synthesized' },
                  ].map((pill) => (
                    <button
                      key={pill.id}
                      onClick={() => setExploreSubTab(pill.id as ExploreSubTab)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                        exploreSubTab === pill.id
                          ? 'bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/40 shadow-xs'
                          : 'text-[#526078] hover:text-[#11183D] hover:bg-[#EFFAFD]/50'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="flex items-center gap-2 flex-1 md:max-w-md justify-end">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8799]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search role, company, skill or career goal..."
                      className="w-full pl-9 pr-7 py-2 bg-[#EFFAFD]/60 border border-[#DCE7F2] rounded-xl text-xs text-[#11183D] placeholder-[#7B8799] focus:outline-none focus:border-[#4A8BDF]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#7B8799] hover:text-[#11183D]"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <Button
                    variant={isFilterDrawerOpen || activeFiltersCount > 0 ? 'royal' : 'secondary'}
                    size="sm"
                    onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                    className="shrink-0 text-xs font-display flex items-center gap-1.5 shadow-2xs"
                    icon={<SlidersHorizontal size={13} />}
                  >
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-white text-[#2459A8] rounded-full text-[10px] font-mono font-bold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Filter Drawer */}
              <AnimatePresence>
                {isFilterDrawerOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 bg-white border border-[#DCE7F2] rounded-3xl shadow-sm space-y-4 overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                      <div className="flex items-center gap-2 text-xs font-bold font-display text-[#11183D]">
                        <SlidersHorizontal size={14} className="text-[#4A8BDF]" />
                        <span>Category & Discipline Filters</span>
                      </div>
                      {activeFiltersCount > 0 && (
                        <button
                          onClick={handleResetFilters}
                          className="text-xs font-bold text-[#A0006D] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <X size={12} />
                          <span>Reset All</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#526078] block">Role / Discipline</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full bg-[#EFFAFD]/50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] font-medium"
                        >
                          <option value="ALL">All Disciplines</option>
                          <option value="FULLSTACK">Full Stack Software Engineer</option>
                          <option value="AIML">AI / ML Engineer</option>
                          <option value="DEVOPS">DevOps & Cloud Systems</option>
                          <option value="SYSTEM_DESIGN">System Design & Concurrency</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#526078] block">Target Company Tier</label>
                        <select
                          value={selectedTier}
                          onChange={(e) => setSelectedTier(e.target.value)}
                          className="w-full bg-[#EFFAFD]/50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] font-medium"
                        >
                          <option value="ALL">All Company Tiers</option>
                          <option value="FAANG">Amazon / FAANG Tier</option>
                          <option value="Tier-1 FinTech">Tier-1 FinTech</option>
                          <option value="Unicorn">High-Growth Unicorn</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#526078] block">Difficulty Level</label>
                        <select
                          value={selectedDifficulty}
                          onChange={(e) => setSelectedDifficulty(e.target.value)}
                          className="w-full bg-[#EFFAFD]/50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] font-medium"
                        >
                          <option value="ALL">All Difficulties</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Staff">Staff / Principal</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Roadmap Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoadmaps.map((roadmap) => (
                <RoadmapCard
                  key={roadmap.id}
                  roadmap={roadmap}
                  isEnrolled={isUserClaimed(roadmap)}
                  onPreview={handleOpenPreview}
                  onEnrollOrStart={handleEnrollAndStart}
                  onClaim={handleClaimDirectly}
                />
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TAB 2: MY ROADMAP EXPERIENCE VIEW                          */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === 'MY_ROADMAP' && activeRoadmap && (
          <MyRoadmapView
            roadmap={activeRoadmap}
            onOpenSprintModal={() => setIsSprintModalOpen(true)}
            onSelectNode={(nodeId) => navigate(`/roadmap/${activeRoadmap.id}?node=${nodeId}`)}
          />
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TAB 3: SKILL INTELLIGENCE SECTION                         */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === 'SKILL_PROFILE' && <SkillProfileSection />}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TAB 4: VERIFIED EXPERT ROADMAPS UI SYSTEM                  */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === 'VERIFIED_EXPERTS' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 md:p-8 shadow-xs space-y-2">
              <h2 className="text-xl md:text-2xl font-bold font-display text-[#11183D] flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#4A8BDF]" />
                Verified Expert Curated Roadmaps
              </h2>
              <p className="text-xs md:text-sm text-[#526078]">
                Curriculums authored and verified by senior software engineers, staff architects, and hiring managers across FAANG and top tech tiers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VerifiedExpertBadge
                type="RENNETUS_VERIFIED"
                expertName="RU Ready Curriculum Board"
                expertRole="Principal Architect Committee"
                companyName="Rennetus Academy"
                experienceYears="10+ years"
                learnersCount={3420}
                showCard
              />

              <VerifiedExpertBadge
                type="COMPANY_VERIFIED"
                expertName="Senior Software Engineer"
                expertRole="Backend & Distributed Systems"
                companyName="Amazon"
                experienceYears="5+ years"
                learnersCount={8420}
                showCard
              />

              <VerifiedExpertBadge
                type="INDUSTRY_VERIFIED"
                expertName="Maya Patel"
                expertRole="Staff Frontend Engineer"
                companyName="Stripe"
                experienceYears="7+ years"
                learnersCount={1240}
                showCard
              />
            </div>
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* INTERACTIVE MODALS & WIZARDS                               */}
      {/* ══════════════════════════════════════════════════════════ */}
      
      <RoadmapPreviewModal
        roadmap={previewRoadmap}
        isOpen={!!previewRoadmap}
        onClose={() => setPreviewRoadmap(null)}
        onEnrollAndStart={handleEnrollAndStart}
        onCloneToBuilder={(r) => navigate(`/roadmap/builder?clone=${r.id}`)}
      />

      <AiRoadmapBuilderModal
        isOpen={isAiBuilderOpen}
        onClose={() => setIsAiBuilderOpen(false)}
        onSuccess={(newMap) => {
          setIsAiBuilderOpen(false);
          setActiveTab('MY_ROADMAP');
        }}
        onOpenPersonalize={() => {
          setIsAiBuilderOpen(false);
          setIsPersonalizeOpen(true);
        }}
      />

      <AiPersonalizationModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
      />

      <SprintExperienceModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        onCompleteSprint={() => {
          setIsSprintModalOpen(false);
          setIsSprintReviewOpen(true);
        }}
      />

      <SprintReviewModal
        isOpen={isSprintReviewOpen}
        onClose={() => setIsSprintReviewOpen(false)}
        onStartNextSprint={() => {
          setIsSprintReviewOpen(false);
          toast.success('Sprint 08 started!');
        }}
      />

      <ManualRoadmapBuilder
        isOpen={isManualBuilderOpen}
        onClose={() => setIsManualBuilderOpen(false)}
        onSuccess={(newMap) => {
          setIsManualBuilderOpen(false);
          setActiveTab('MY_ROADMAP');
        }}
      />

    </div>
  );
}
