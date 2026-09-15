import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, ShieldCheck, Sparkles, Plus, Search, Filter,
  Users, Layers, Award, Clock, ArrowRight, BookOpen,
  Code2, CheckCircle2, Bookmark, Check, RefreshCw, GraduationCap,
  Heart, SlidersHorizontal, X
} from 'lucide-react';
import { useRoadmapStore, Roadmap } from '../../store/useRoadmapStore';
import { useAuthStore } from '../../store/authStore';
import RoadmapCard from '../../components/roadmap/RoadmapCard';
import RoadmapPreviewModal from '../../components/roadmap/RoadmapPreviewModal';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

type MainTabType = 'MY_ROADMAPS' | 'LIKED' | 'EXPLORE';
type MySubTab = 'ALL' | 'CREATED' | 'CLAIMED';
type ExploreSubTab = 'ALL' | 'OFFICIAL' | 'COMMUNITY' | 'AI';

export default function RoadmapCatalog() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    roadmaps, 
    enrolledRoadmapIds, 
    likedRoadmapIds,
    enrollRoadmap, 
    claimRoadmap,
    syncWithBackend 
  } = useRoadmapStore();

  // Primary Navigation Tab (1. My Roadmaps, 2. Liked, 3. Explore)
  const [activeTab, setActiveTab] = useState<MainTabType>('MY_ROADMAPS');
  
  // Sub-tabs
  const [mySubTab, setMySubTab] = useState<MySubTab>('ALL');
  const [exploreSubTab, setExploreSubTab] = useState<ExploreSubTab>('ALL');

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'VOTES' | 'NEWEST' | 'STEPS'>('POPULAR');
  
  // Filter drawer toggle for Explore
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Preview Modal State
  const [previewRoadmap, setPreviewRoadmap] = useState<Roadmap | null>(null);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  // Check if roadmap was created/authored by the user
  const isUserCreated = (r: Roadmap) => {
    return (
      r.creatorId === (user?.id || 'current-user') ||
      r.creatorUsername === 'you' ||
      r.creatorUsername === 'you_ai' ||
      r.creatorName.toLowerCase().includes('you')
    );
  };

  // Check if roadmap is enrolled/claimed by the user
  const isUserClaimed = (r: Roadmap) => {
    return enrolledRoadmapIds.includes(r.id);
  };

  // Tab counts
  const myRoadmapsTotal = useMemo(() => {
    return roadmaps.filter((r) => isUserCreated(r) || isUserClaimed(r)).length;
  }, [roadmaps, enrolledRoadmapIds, user]);

  const likedRoadmapsTotal = useMemo(() => {
    return roadmaps.filter((r) => likedRoadmapIds.includes(r.id)).length;
  }, [roadmaps, likedRoadmapIds]);

  const myCreatedTotal = useMemo(() => {
    return roadmaps.filter((r) => isUserCreated(r)).length;
  }, [roadmaps, user]);

  const myClaimedTotal = useMemo(() => {
    return roadmaps.filter((r) => isUserClaimed(r) && !isUserCreated(r)).length;
  }, [roadmaps, enrolledRoadmapIds, user]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'ALL') count++;
    if (selectedTier !== 'ALL') count++;
    if (selectedDifficulty !== 'ALL') count++;
    return count;
  }, [selectedCategory, selectedTier, selectedDifficulty]);

  // Filtered & Sorted Roadmaps
  const filteredRoadmaps = useMemo(() => {
    return roadmaps
      .filter((r) => {
        // 1. Primary Tab Filtering
        if (activeTab === 'MY_ROADMAPS') {
          const userCreated = isUserCreated(r);
          const userClaimed = isUserClaimed(r);

          if (!userCreated && !userClaimed) return false;

          if (mySubTab === 'CREATED' && !userCreated) return false;
          if (mySubTab === 'CLAIMED' && (!userClaimed || userCreated)) return false;
        } else if (activeTab === 'LIKED') {
          if (!likedRoadmapIds.includes(r.id)) return false;
        } else if (activeTab === 'EXPLORE') {
          if (exploreSubTab === 'OFFICIAL' && !r.isOfficial) return false;
          if (exploreSubTab === 'COMMUNITY' && (r.isOfficial || r.isAiGenerated)) return false;
          if (exploreSubTab === 'AI' && !r.isAiGenerated) return false;
        }

        // 2. Category Filter
        if (selectedCategory !== 'ALL' && r.category !== selectedCategory && r.rolePath !== selectedCategory) {
          return false;
        }

        // 3. Tier Filter
        if (selectedTier !== 'ALL' && r.targetCompanyTier !== selectedTier) {
          return false;
        }

        // 4. Difficulty Filter
        if (selectedDifficulty !== 'ALL' && r.difficulty !== selectedDifficulty) {
          return false;
        }

        // 5. Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = r.title.toLowerCase().includes(q);
          const matchDesc = r.description.toLowerCase().includes(q);
          const matchTags = r.tags.some((t) => t.toLowerCase().includes(q));
          const matchCreator = r.creatorName.toLowerCase().includes(q);
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
    activeTab, 
    mySubTab, 
    exploreSubTab, 
    selectedCategory, 
    selectedTier, 
    selectedDifficulty, 
    searchQuery, 
    sortBy, 
    enrolledRoadmapIds, 
    likedRoadmapIds, 
    user
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

  const handleCloneToBuilder = (roadmap: Roadmap) => {
    setPreviewRoadmap(null);
    navigate(`/roadmap/builder?clone=${roadmap.id}&mode=manual`);
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
        {/* HERO MARKETPLACE BANNER & CREATION CTAS                     */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#2459A8] via-[#4A8BDF] to-[#A0006D] p-8 sm:p-10 text-white shadow-xl overflow-hidden">
          {/* Subtle Ambient Background Shapes */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-[#A0006D]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold font-display uppercase tracking-wider text-white border border-white/20">
                <Compass size={14} />
                <span>Industry Verified Career Roadmaps</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
                Career Roadmap Marketplace
              </h1>

              <p className="text-sm text-white/90 leading-relaxed font-normal">
                Explore company-vetted blueprints with <strong>'What should I do?'</strong>, <strong>'What is the source?'</strong>, and <strong>'What is the exact thing?'</strong>. Or architect your own custom sequential roadmap manually and with AI.
              </p>

              {/* Quick Stat Highlights */}
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
                onClick={() => navigate('/roadmap/builder?mode=ai')}
                className="shadow-lg text-xs font-display justify-center py-3 px-5 border border-white/20 bg-[#A0006D] hover:bg-[#850059] text-white"
                icon={<Sparkles size={15} />}
              >
                AI Student Diagnostic
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/roadmap/builder?mode=manual')}
                className="shadow-md text-xs font-display justify-center py-3 px-5 bg-white text-[#11183D] hover:bg-[#EFFAFD] border-0"
                icon={<Plus size={15} className="text-[#4A8BDF]" />}
              >
                Create Roadmap Manually
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/roadmap/builder?mode=blueprints')}
                className="text-xs font-display justify-center py-2 px-4 bg-white/20 hover:bg-white/30 text-white border border-white/30"
                icon={<Layers size={14} />}
              >
                Fork Student Blueprints
              </Button>
            </div>
          </div>
        </div>

        {/* Student Mentorship & 3-Pillar Mission Callout */}
        <div className="p-5 sm:p-6 bg-white border border-[#DCE7F2] rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#EFFAFD] text-[#2459A8] shrink-0">
              <GraduationCap size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-display text-[#11183D]">
                How RU Ready Helps Real Students Break Out of Tutorial Hell
              </h3>
              <p className="text-xs text-[#526078] max-w-3xl leading-relaxed">
                Generic roadmaps drown students in 50-hour video playlists without clear deliverables. Every RU Ready milestone enforces the 3 Pillars: <strong>'What should I do?'</strong> (Action steps & pitfalls), <strong>'What is the source?'</strong> (Verified documentation), and <strong>'What is the exact thing?'</strong> (Sandbox drill & automated tests).
              </p>
            </div>
          </div>

          <Button
            variant="royal"
            size="sm"
            onClick={() => navigate('/roadmap/builder?mode=blueprints')}
            iconRight={<ArrowRight size={13} />}
            className="shrink-0 text-xs font-bold"
          >
            Explore Placement Blueprints
          </Button>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* ══════════════════════════════════════════════════════════ */}
        {/* PRIMARY VIEW NAVIGATION: MY ROADMAPS, LIKED, EXPLORE       */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          
          {/* Main Tabs (Order: 1. My Roadmaps, 2. Liked, 3. Explore) */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE7F2] pb-4">
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Tab 1: My Roadmaps */}
              <button
                onClick={() => setActiveTab('MY_ROADMAPS')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'MY_ROADMAPS'
                    ? 'bg-[#2459A8] text-white shadow-md'
                    : 'bg-white text-[#526078] border border-[#DCE7F2] hover:text-[#11183D]'
                }`}
              >
                <Bookmark size={14} className={activeTab === 'MY_ROADMAPS' ? 'text-white' : 'text-[#4A8BDF]'} />
                <span>My Roadmaps</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'MY_ROADMAPS' ? 'bg-white/20 text-white' : 'bg-[#EFFAFD] text-[#526078]'}`}>
                  {myRoadmapsTotal}
                </span>
              </button>

              {/* Tab 2: Liked Roadmaps */}
              <button
                onClick={() => setActiveTab('LIKED')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'LIKED'
                    ? 'bg-[#A0006D] text-white shadow-md'
                    : 'bg-white text-[#526078] border border-[#DCE7F2] hover:text-[#11183D]'
                }`}
              >
                <Heart size={14} className={activeTab === 'LIKED' ? 'text-white fill-white' : 'text-[#A0006D]'} />
                <span>Liked Roadmaps</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'LIKED' ? 'bg-white/20 text-white' : 'bg-[#F8EAF4] text-[#A0006D]'}`}>
                  {likedRoadmapsTotal}
                </span>
              </button>

              {/* Tab 3: Explore Roadmaps */}
              <button
                onClick={() => setActiveTab('EXPLORE')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'EXPLORE'
                    ? 'bg-[#168A62] text-white shadow-md'
                    : 'bg-white text-[#526078] border border-[#DCE7F2] hover:text-[#11183D]'
                }`}
              >
                <Compass size={14} className={activeTab === 'EXPLORE' ? 'text-white' : 'text-[#168A62]'} />
                <span>Explore Roadmaps</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'EXPLORE' ? 'bg-white/20 text-white' : 'bg-[#EFFAFD] text-[#526078]'}`}>
                  {roadmaps.length}
                </span>
              </button>

            </div>

            {/* Sort Selector */}
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
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB-SPECIFIC SUB-BARS & SEARCH / FILTER TOGGLES            */}
          {/* ══════════════════════════════════════════════════════════ */}
          
          {/* SUB-BAR FOR: MY ROADMAPS */}
          {activeTab === 'MY_ROADMAPS' && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-[#DCE7F2] rounded-2xl shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-display text-[#526078] mr-1 hidden sm:inline">View:</span>
                {[
                  { id: 'ALL', label: 'All My Roadmaps', count: myRoadmapsTotal },
                  { id: 'CREATED', label: 'Created by Me', count: myCreatedTotal },
                  { id: 'CLAIMED', label: 'Claimed Blueprints', count: myClaimedTotal },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setMySubTab(pill.id as MySubTab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-1.5 ${
                      mySubTab === pill.id
                        ? 'bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/40'
                        : 'text-[#526078] hover:text-[#11183D] hover:bg-[#EFFAFD]/50'
                    }`}
                  >
                    <span>{pill.label}</span>
                    <span className="font-mono text-[10px] opacity-75">({pill.count})</span>
                  </button>
                ))}
              </div>

              {/* Quick Search inside My Roadmaps */}
              <div className="relative min-w-[240px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8799]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter my roadmaps..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#EFFAFD]/50 border border-[#DCE7F2] rounded-xl text-xs text-[#11183D] placeholder-[#7B8799] focus:outline-none focus:border-[#4A8BDF]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7B8799] hover:text-[#11183D]"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SUB-BAR FOR: LIKED ROADMAPS */}
          {activeTab === 'LIKED' && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-[#DCE7F2] rounded-2xl shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold font-display text-[#526078]">
                <Heart size={14} className="text-[#A0006D] fill-[#A0006D]" />
                <span>Curriculums and blueprints you voted for ({likedRoadmapsTotal})</span>
              </div>

              <div className="relative min-w-[240px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8799]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search liked roadmaps..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#EFFAFD]/50 border border-[#DCE7F2] rounded-xl text-xs text-[#11183D] placeholder-[#7B8799] focus:outline-none focus:border-[#4A8BDF]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7B8799] hover:text-[#11183D]"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SUB-BAR FOR: EXPLORE ROADMAPS (WITH SEARCH & FILTER BUTTON) */}
          {activeTab === 'EXPLORE' && (
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-white border border-[#DCE7F2] rounded-2xl shadow-2xs">
                
                {/* Explore Sub-categories */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'ALL', label: 'All Tracks' },
                    { id: 'OFFICIAL', label: 'Official Blueprints' },
                    { id: 'COMMUNITY', label: 'Community' },
                    { id: 'AI', label: 'AI Synthesized' },
                  ].map((pill) => (
                    <button
                      key={pill.id}
                      onClick={() => setExploreSubTab(pill.id as ExploreSubTab)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                        exploreSubTab === pill.id
                          ? 'bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/40 shadow-xs'
                          : 'text-[#526078] hover:text-[#11183D] hover:bg-[#EFFAFD]/50'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>

                {/* Search and Filter Button for Explore */}
                <div className="flex items-center gap-2 flex-1 md:max-w-md justify-end">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8799]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by role, skills (React, Kafka), tier..."
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

                  {/* Filter Toggle Button */}
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

              {/* Expandable Filter Drawer */}
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
                        <span>Filter Explore Blueprints</span>
                        {activeFiltersCount > 0 && (
                          <span className="text-[11px] font-normal text-[#526078]">
                            ({activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''})
                          </span>
                        )}
                      </div>

                      {activeFiltersCount > 0 && (
                        <button
                          onClick={handleResetFilters}
                          className="text-xs font-bold text-[#A0006D] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <X size={12} />
                          <span>Reset All Filters</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      {/* Category Filter */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#526078] block">Category / Discipline</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full bg-[#EFFAFD]/50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] font-medium focus:outline-none"
                        >
                          <option value="ALL">All Categories & Roles</option>
                          <option value="FULLSTACK">Fullstack Web Engineering</option>
                          <option value="AIML">AI / ML & LLM Engineering</option>
                          <option value="DEVOPS">DevOps, Cloud & SRE</option>
                          <option value="SYSTEM_DESIGN">High-Frequency Distributed Systems</option>
                          <option value="DATA">Data Lakehouse & Streaming</option>
                          <option value="FRONTEND">Frontend Architecture & Next.js</option>
                        </select>
                      </div>

                      {/* Hiring Tier Filter */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#526078] block">Hiring Tier Benchmark</label>
                        <select
                          value={selectedTier}
                          onChange={(e) => setSelectedTier(e.target.value)}
                          className="w-full bg-[#EFFAFD]/50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] font-medium focus:outline-none"
                        >
                          <option value="ALL">All Hiring Tiers</option>
                          <option value="FAANG">FAANG / Top Tech Tier</option>
                          <option value="Tier-1 FinTech">Tier-1 FinTech / High-Frequency</option>
                          <option value="Unicorn">High-Growth Unicorn</option>
                          <option value="High-Growth Startup">Early-Stage Startup</option>
                          <option value="Enterprise">Global Enterprise</option>
                        </select>
                      </div>

                      {/* Difficulty Filter */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#526078] block">Difficulty Level</label>
                        <select
                          value={selectedDifficulty}
                          onChange={(e) => setSelectedDifficulty(e.target.value)}
                          className="w-full bg-[#EFFAFD]/50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] font-medium focus:outline-none"
                        >
                          <option value="ALL">All Difficulties</option>
                          <option value="Beginner">Beginner Foundation</option>
                          <option value="Intermediate">Intermediate Production</option>
                          <option value="Advanced">Advanced Engineering</option>
                          <option value="Staff">Staff / Principal Tier</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* ROADMAP GRID (SHOP LIST / MY LIST)                          */}
        {/* ══════════════════════════════════════════════════════════ */}
        {filteredRoadmaps.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#DCE7F2] p-12 text-center space-y-5 shadow-xs">
            {activeTab === 'MY_ROADMAPS' ? (
              <>
                <div className="w-16 h-16 rounded-3xl bg-[#EFFAFD] text-[#2459A8] flex items-center justify-center mx-auto shadow-xs">
                  <Bookmark size={32} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">
                    {mySubTab === 'CREATED' 
                      ? 'No roadmaps authored yet'
                      : mySubTab === 'CLAIMED'
                      ? 'No claimed blueprints yet'
                      : 'You haven\'t created or claimed any roadmaps yet'}
                  </h3>
                  <p className="text-xs text-[#526078] max-w-md mx-auto leading-relaxed">
                    Personalize your engineering journey by creating a roadmap tailored to your semester with AI, architecting one manually, or claiming ready-made placement blueprints from the Explore catalog.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button
                    variant="eggplant"
                    size="sm"
                    onClick={() => navigate('/roadmap/builder?mode=ai')}
                    icon={<Sparkles size={14} />}
                  >
                    AI Student Diagnostic
                  </Button>
                  <Button
                    variant="royal"
                    size="sm"
                    onClick={() => navigate('/roadmap/builder?mode=manual')}
                    icon={<Plus size={14} />}
                  >
                    Create Manually
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab('EXPLORE')}
                    icon={<Compass size={14} />}
                  >
                    Explore & Claim Blueprints
                  </Button>
                </div>
              </>
            ) : activeTab === 'LIKED' ? (
              <>
                <div className="w-16 h-16 rounded-3xl bg-[#F8EAF4] text-[#A0006D] flex items-center justify-center mx-auto shadow-xs">
                  <Heart size={32} className="fill-[#A0006D]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">
                    No liked roadmaps yet
                  </h3>
                  <p className="text-xs text-[#526078] max-w-md mx-auto leading-relaxed">
                    Click the heart icon on any roadmap card while browsing to bookmark top curriculums into your liked collection.
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    variant="royal"
                    size="sm"
                    onClick={() => setActiveTab('EXPLORE')}
                    icon={<Compass size={14} />}
                  >
                    Explore Roadmaps to Upvote
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Compass size={40} className="text-[#4A8BDF] mx-auto opacity-70" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-display text-[#11183D]">
                    No roadmaps match your explore filters
                  </h3>
                  <p className="text-xs text-[#526078] max-w-md mx-auto">
                    Try clearing your search query or reset your filters to view all available curriculums.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                  <Button
                    variant="royal"
                    size="sm"
                    onClick={() => navigate('/roadmap/builder?mode=manual')}
                    icon={<Plus size={14} />}
                  >
                    Create Custom Roadmap
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                isEnrolled={enrolledRoadmapIds.includes(roadmap.id)}
                onPreview={handleOpenPreview}
                onEnrollOrStart={handleEnrollAndStart}
                onClaim={handleClaimDirectly}
              />
            ))}
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* INTERACTIVE MODALS                                         */}
      {/* ══════════════════════════════════════════════════════════ */}
      
      {/* 1. Preview Modal */}
      <RoadmapPreviewModal
        roadmap={previewRoadmap}
        isOpen={!!previewRoadmap}
        onClose={() => setPreviewRoadmap(null)}
        onEnrollAndStart={handleEnrollAndStart}
        onCloneToBuilder={handleCloneToBuilder}
      />

    </div>
  );
}
