import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  GitFork,
  Heart,
  Layers,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  UserCheck,
  X,
  History,
} from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { roadmapApi, type Roadmap, type RoadmapInstance } from '../../api/roadmap';
import Button from '../../components/ui/Button';

export default function RoadmapHubPage() {
  const navigate = useNavigate();
  const {
    workspace,
    communityRoadmaps,
    isLoading,
    isWorkspaceLoading,
    loadWorkspace,
    loadCommunity,
    deleteRoadmap,
    toggleFollow,
    enrollInRoadmap,
  } = useRoadmapStore();

  const [activeMainTab, setActiveMainTab] = useState<'community' | 'mine'>('community');
  const [mySubTab, setMySubTab] = useState<'learning' | 'following' | 'creations' | 'history'>('learning');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [communityFilter, setCommunityFilter] = useState<'all' | 'verified' | 'endorsed' | 'trending'>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'rating' | 'followers' | 'newest'>('trending');

  // Modals & Action State
  const [actionError, setActionError] = useState('');
  const [enrollModalRoadmap, setEnrollModalRoadmap] = useState<Roadmap | null>(null);
  const [targetPace, setTargetPace] = useState(6);
  const [enrolling, setEnrolling] = useState(false);

  const [forkModalRoadmap, setForkModalRoadmap] = useState<Roadmap | null>(null);
  const [forkTitle, setForkTitle] = useState('');
  const [forking, setForking] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    void loadWorkspace();
    void loadCommunity({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      search: searchQuery,
      filter: communityFilter,
      sortBy,
    });
  }, [loadWorkspace, loadCommunity, selectedCategory, selectedDifficulty, communityFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void loadCommunity({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      search: searchQuery,
      filter: communityFilter,
      sortBy,
    });
  };

  const handleEnrollConfirm = async () => {
    if (!enrollModalRoadmap) return;
    setEnrolling(true);
    setActionError('');
    try {
      await enrollInRoadmap(enrollModalRoadmap.id, targetPace);
      setEnrollModalRoadmap(null);
      navigate(`/roadmap/${enrollModalRoadmap.id}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to start learning this roadmap.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleForkConfirm = async () => {
    if (!forkModalRoadmap) return;
    setForking(true);
    setActionError('');
    try {
      const forked = await roadmapApi.fork(forkModalRoadmap.id, forkTitle.trim() || undefined);
      setForkModalRoadmap(null);
      await loadWorkspace();
      navigate(`/roadmap/${forked.id}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to fork roadmap.');
    } finally {
      setForking(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      await deleteRoadmap(deleteConfirmId);
      setDeleteConfirmId(null);
      await loadWorkspace();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to delete roadmap.');
    } finally {
      setDeleting(false);
    }
  };

  const categories = [
    'all',
    'Frontend Engineering',
    'Backend Systems',
    'System Design',
    'DevOps & Cloud',
    'Artificial Intelligence',
    'Algorithms & DSA',
  ];

  const instances = workspace?.instances || [];
  const followingRoadmaps = workspace?.following || [];
  const createdRoadmaps = workspace?.created || [];
  const forkedRoadmaps = workspace?.forks || [];
  const myCreationsAndForks = [...createdRoadmaps, ...forkedRoadmaps];
  const summary = workspace?.summary || {
    activeLearningCount: instances.length,
    followingCount: followingRoadmaps.length,
    createdCount: myCreationsAndForks.length,
    totalMasteredModules: instances.reduce((acc, i) => acc + (i.masteryCount || 0), 0),
    avgCompletionRate: 0,
  };

  return (
    <main className="min-h-full bg-[#F4F9FD] px-4 py-8 text-[#11183D] transition-colors sm:px-6 lg:px-10 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-[1400px] space-y-8">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E1EAF4] pb-5 dark:border-[#262626]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2459A8]/10 text-[#2459A8] dark:bg-[#93C5FD]/10 dark:text-[#93C5FD]">
                <Layers size={14} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#526078] dark:text-[#A8A8A8]">
                Community Learning & Curriculum Studio
              </span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-black text-[#11183D] sm:text-3xl dark:text-white">
              Roadmap Studio
            </h1>
            <p className="mt-1 text-xs text-[#526078] dark:text-[#A8A8A8]">
              Discover community-crafted learning journeys, adapt them to your pace, and prove your mastery with AI verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="sm"
              icon={<Plus size={15} />}
              onClick={() => navigate('/roadmap/create')}
              className="font-bold shadow-sm"
            >
              Build Roadmap
            </Button>
            <Button
              size="sm"
              variant="ai"
              icon={<Sparkles size={15} />}
              onClick={() => navigate('/roadmap/create?mode=ai')}
              className="font-bold shadow-sm"
            >
              Generate with AI
            </Button>
          </div>
        </div>

        {/* Global Action Error Alert */}
        {actionError && (
          <div className="flex items-center justify-between rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            <span>{actionError}</span>
            <button onClick={() => setActionError('')} className="text-rose-500 hover:text-rose-700">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Top Level Navigation Tabs: Community vs My Roadmaps */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex rounded-2xl border border-[#DCE7F2] bg-white p-1.5 shadow-sm dark:border-[#303030] dark:bg-[#1A1A1A]">
            <button
              onClick={() => setActiveMainTab('community')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
                activeMainTab === 'community'
                  ? 'bg-[#11183D] text-white shadow dark:bg-white dark:text-[#11183D]'
                  : 'text-[#526078] hover:text-[#11183D] dark:text-[#A8A8A8] dark:hover:text-white'
              }`}
            >
              <Compass size={16} />
              <span>Community Roadmaps</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">
                {communityRoadmaps.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMainTab('mine')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
                activeMainTab === 'mine'
                  ? 'bg-[#11183D] text-white shadow dark:bg-white dark:text-[#11183D]'
                  : 'text-[#526078] hover:text-[#11183D] dark:text-[#A8A8A8] dark:hover:text-white'
              }`}
            >
              <BookOpen size={16} />
              <span>My Roadmaps</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">
                {instances.length + myCreationsAndForks.length}
              </span>
            </button>
          </div>

          {activeMainTab === 'community' && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#526078] dark:text-[#A8A8A8]">Filter by:</span>
              <button
                onClick={() => setCommunityFilter('all')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  communityFilter === 'all'
                    ? 'bg-[#2459A8] text-white shadow-sm'
                    : 'bg-white text-[#526078] hover:bg-slate-100 dark:bg-[#1A1A1A] dark:text-[#A8A8A8]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCommunityFilter('endorsed')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  communityFilter === 'endorsed'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-[#526078] hover:bg-slate-100 dark:bg-[#1A1A1A] dark:text-[#A8A8A8]'
                }`}
              >
                <Award size={13} />
                <span>Officially Endorsed</span>
              </button>
              <button
                onClick={() => setCommunityFilter('verified')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  communityFilter === 'verified'
                    ? 'bg-[#2459A8] text-white shadow-sm'
                    : 'bg-white text-[#526078] hover:bg-slate-100 dark:bg-[#1A1A1A] dark:text-[#A8A8A8]'
                }`}
              >
                <UserCheck size={13} />
                <span>Verified Authors</span>
              </button>
              <button
                onClick={() => setCommunityFilter('trending')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  communityFilter === 'trending'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-[#526078] hover:bg-slate-100 dark:bg-[#1A1A1A] dark:text-[#A8A8A8]'
                }`}
              >
                <TrendingUp size={13} />
                <span>Trending</span>
              </button>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* VIEW 1: ROADMAP COMMUNITY */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeMainTab === 'community' && (
          <div className="space-y-6">
            {/* Search and Secondary Filter Bar */}
            <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#DCE7F2] bg-white p-3 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
              <div className="relative min-w-[260px] flex-1">
                <Search size={16} className="absolute left-3.5 top-3 text-[#7B8799]" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, role, skills (e.g. Distributed Systems, Staff Architect, Kafka)..."
                  className="w-full rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] py-2 pl-10 pr-8 text-xs font-medium outline-none transition focus:border-[#4A8BDF] focus:bg-white dark:border-[#303030] dark:bg-[#262626] dark:text-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      void loadCommunity({ category: selectedCategory, difficulty: selectedDifficulty, filter: communityFilter, sortBy });
                    }}
                    className="absolute right-2.5 top-2.5 text-[#7B8799] hover:text-black dark:hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#11183D] outline-none transition focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#262626] dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#11183D] outline-none transition focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#262626] dark:text-white"
              >
                <option value="all">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#11183D] outline-none transition focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#262626] dark:text-white"
              >
                <option value="trending">Sort: Trending</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="followers">Sort: Most Followers</option>
                <option value="newest">Sort: Newest</option>
              </select>
            </form>

            {/* Community Grid */}
            {isLoading ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-3xl border border-[#DCE7F2] bg-white p-8 dark:border-[#262626] dark:bg-[#1A1A1A]">
                <Loader2 size={26} className="animate-spin text-[#2459A8]" />
                <p className="text-xs font-semibold text-[#526078] dark:text-[#A8A8A8]">
                  Loading community roadmaps...
                </p>
              </div>
            ) : communityRoadmaps.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#DCE7F2] bg-white p-8 text-center dark:border-[#262626] dark:bg-[#1A1A1A]">
                <Compass size={32} className="text-[#2459A8]" />
                <h3 className="mt-3 text-base font-black text-[#11183D] dark:text-white">
                  No roadmaps match your criteria
                </h3>
                <p className="mt-1 text-xs text-[#526078] dark:text-[#A8A8A8]">
                  Try widening your search terms or changing your filter criteria.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {communityRoadmaps.map((roadmap) => {
                  const isEndorsed = Boolean(roadmap.isEndorsed);
                  const isVerifiedCreator = Boolean(roadmap.isVerifiedCreator);
                  const rating = roadmap.rating || 5.0;
                  const reviewCount = roadmap.reviewCount || 0;
                  const followerCount = roadmap.followerCount || 0;
                  const forkCount = roadmap.forkCount || 0;

                  return (
                    <article
                      key={roadmap.id}
                      className="group flex flex-col justify-between rounded-3xl border border-[#DCE7F2] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#4A8BDF] hover:shadow-xl dark:border-[#262626] dark:bg-[#1A1A1A]"
                    >
                      <div>
                        {/* Top Accent line */}
                        <div
                          className={`h-1.5 w-full rounded-full ${
                            isEndorsed
                              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400'
                              : 'bg-gradient-to-r from-[#2459A8] via-[#4A8BDF] to-[#A0006D]'
                          }`}
                        />

                        {/* Top Badges Row */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {isEndorsed && (
                              <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                <Award size={12} />
                                <span>Official Endorsed</span>
                              </span>
                            )}
                            <span className="rounded-lg bg-[#EFFAFD] px-2 py-0.5 text-[10px] font-bold text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]">
                              {roadmap.category || 'General'}
                            </span>
                            <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-[#262626] dark:text-neutral-300">
                              {roadmap.difficulty || 'All Levels'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                            <Star size={12} className="fill-amber-500 text-amber-500" />
                            <span>{rating.toFixed(1)}</span>
                            <span className="text-[10px] text-[#7B8799]">({reviewCount})</span>
                          </div>
                        </div>

                        {/* Title and Description */}
                        <h3 className="mt-3 text-base font-black text-[#11183D] transition group-hover:text-[#2459A8] dark:text-white dark:group-hover:text-[#93C5FD]">
                          {roadmap.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
                          {roadmap.description || roadmap.goal || 'Comprehensive curriculum crafted for modern engineering careers.'}
                        </p>

                        {/* Contributor Identity Card: Verified Creator vs Official */}
                        <div className="mt-4 rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-2.5 dark:border-[#262626] dark:bg-[#202020]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2459A8]/10 text-xs font-bold text-[#2459A8] dark:bg-white/10 dark:text-white">
                                {(roadmap.creatorName || 'Rennetus')[0]}
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-black text-[#11183D] dark:text-white">
                                    {roadmap.creatorName || 'RU Ready Committee'}
                                  </span>
                                  {isVerifiedCreator && (
                                    <span title="Verified Contributor Identity" className="text-[#2459A8] dark:text-[#93C5FD]">
                                      <ShieldCheck size={13} />
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] font-medium text-[#7B8799]">
                                  {roadmap.creatorRole
                                    ? `${roadmap.creatorRole}${roadmap.creatorCompany ? ` @ ${roadmap.creatorCompany}` : ''}`
                                    : 'Engineering Mentor'}
                                </p>
                              </div>
                            </div>
                            {roadmap.forkedFrom && (
                              <span className="rounded bg-slate-200/60 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-neutral-800 dark:text-neutral-400">
                                Fork
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tags */}
                        {roadmap.tags && roadmap.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {roadmap.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded-md bg-[#EFFAFD] px-2 py-0.5 text-[10px] font-medium text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]"
                              >
                                <Tag size={9} />
                                {tag}
                              </span>
                            ))}
                            {roadmap.tags.length > 3 && (
                              <span className="rounded-md bg-[#EFFAFD] px-1.5 py-0.5 text-[10px] font-medium text-[#7B8799] dark:bg-[#262626]">
                                +{roadmap.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer Stats & Actions */}
                      <div className="mt-5 border-t border-[#F0F4F8] pt-4 dark:border-[#262626]">
                        <div className="flex items-center justify-between text-[11px] text-[#7B8799]">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {roadmap.estimatedWeeks ? `${roadmap.estimatedWeeks} weeks` : `${roadmap.nodes.length} modules`}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1" title="Followers">
                              <Heart size={11} className={roadmap.isFollowing ? 'fill-rose-500 text-rose-500' : ''} />
                              {followerCount}
                            </span>
                            <span className="flex items-center gap-1" title="Forks">
                              <GitFork size={11} />
                              {forkCount}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-2">
                          <button
                            onClick={() => void toggleFollow(roadmap.id)}
                            className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-[11px] font-bold transition ${
                              roadmap.isFollowing
                                ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/30'
                                : 'border-[#DCE7F2] bg-white text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:bg-[#202020] dark:text-[#A8A8A8]'
                            }`}
                          >
                            <Heart size={12} className={roadmap.isFollowing ? 'fill-rose-600' : ''} />
                            <span>{roadmap.isFollowing ? 'Following' : 'Follow'}</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setForkModalRoadmap(roadmap);
                                setForkTitle(`${roadmap.title} (Fork)`);
                              }}
                              title="Fork this roadmap to customize modules"
                              className="inline-flex items-center gap-1 rounded-xl border border-[#DCE7F2] bg-white px-2.5 py-2 text-[11px] font-bold text-[#526078] transition hover:bg-slate-50 dark:border-[#303030] dark:bg-[#202020] dark:text-[#A8A8A8]"
                            >
                              <GitFork size={12} />
                              <span>Fork</span>
                            </button>

                            <button
                              onClick={() => setEnrollModalRoadmap(roadmap)}
                              className="inline-flex items-center gap-1 rounded-xl bg-[#11183D] px-3.5 py-2 text-[11px] font-bold text-white shadow transition hover:bg-[#2459A8] dark:bg-white dark:text-[#11183D] dark:hover:bg-slate-200"
                            >
                              <Plus size={12} />
                              <span>Start Learning</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* VIEW 2: MY ROADMAPS (PERSONAL LEARNING WORKSPACE) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeMainTab === 'mine' && (
          <div className="space-y-6">
            {/* Quick Summary Dashboard */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B8799]">
                  Learning Now
                </span>
                <p className="mt-1 text-2xl font-black text-[#11183D] dark:text-white">
                  {summary.activeLearningCount}
                </p>
                <p className="mt-1 text-[11px] text-[#526078] dark:text-[#A8A8A8]">
                  Active personalized learning plans
                </p>
              </div>

              <div className="rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B8799]">
                  Demonstrated Mastery
                </span>
                <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {summary.totalMasteredModules}
                </p>
                <p className="mt-1 text-[11px] text-[#526078] dark:text-[#A8A8A8]">
                  Modules verified by AI evaluation
                </p>
              </div>

              <div className="rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B8799]">
                  Following
                </span>
                <p className="mt-1 text-2xl font-black text-[#2459A8] dark:text-[#93C5FD]">
                  {summary.followingCount}
                </p>
                <p className="mt-1 text-[11px] text-[#526078] dark:text-[#A8A8A8]">
                  Curriculums tracked for updates
                </p>
              </div>

              <div className="rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B8799]">
                  My Creations & Forks
                </span>
                <p className="mt-1 text-2xl font-black text-purple-600 dark:text-purple-400">
                  {summary.createdCount}
                </p>
                <p className="mt-1 text-[11px] text-[#526078] dark:text-[#A8A8A8]">
                  Custom or published paths
                </p>
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#E1EAF4] pb-3 dark:border-[#262626]">
              <button
                onClick={() => setMySubTab('learning')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  mySubTab === 'learning'
                    ? 'bg-[#11183D] text-white shadow dark:bg-white dark:text-[#11183D]'
                    : 'bg-white text-[#526078] hover:bg-slate-100 dark:bg-[#1A1A1A] dark:text-[#A8A8A8]'
                }`}
              >
                <BookOpen size={14} />
                <span>Learning Now ({instances.length})</span>
              </button>

              <button
                onClick={() => setMySubTab('following')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  mySubTab === 'following'
                    ? 'bg-[#11183D] text-white shadow dark:bg-white dark:text-[#11183D]'
                    : 'bg-white text-[#526078] hover:bg-slate-100 dark:bg-[#1A1A1A] dark:text-[#A8A8A8]'
                }`}
              >
                <Heart size={14} />
                <span>Following ({followingRoadmaps.length})</span>
              </button>

              <button
                onClick={() => setMySubTab('creations')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  mySubTab === 'creations'
                    ? 'bg-[#11183D] text-white shadow dark:bg-white dark:text-[#11183D]'
                    : 'bg-white text-[#526078] hover:bg-slate-100 dark:bg-[#1A1A1A] dark:text-[#A8A8A8]'
                }`}
              >
                <GitFork size={14} />
                <span>My Forks & Creations ({myCreationsAndForks.length})</span>
              </button>

              <button
                onClick={() => setMySubTab('history')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  mySubTab === 'history'
                    ? 'bg-[#11183D] text-white shadow dark:bg-white dark:text-[#11183D]'
                    : 'bg-white text-[#526078] hover:bg-slate-100 dark:bg-[#1A1A1A] dark:text-[#A8A8A8]'
                }`}
              >
                <History size={14} />
                <span>Learning History</span>
              </button>
            </div>

            {/* Sub-tab 1: Learning Now */}
            {mySubTab === 'learning' && (
              <div>
                {isWorkspaceLoading ? (
                  <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-[#DCE7F2] bg-white p-6 dark:border-[#262626] dark:bg-[#1A1A1A]">
                    <Loader2 size={24} className="animate-spin text-[#2459A8]" />
                  </div>
                ) : instances.length === 0 ? (
                  <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#DCE7F2] bg-white p-8 text-center dark:border-[#262626] dark:bg-[#1A1A1A]">
                    <BookOpen size={30} className="text-[#2459A8]" />
                    <h3 className="mt-3 text-base font-black text-[#11183D] dark:text-white">
                      You are not actively learning any roadmap yet
                    </h3>
                    <p className="mt-1 max-w-sm text-xs text-[#526078] dark:text-[#A8A8A8]">
                      Explore community roadmaps and click "Start Learning" to set your personal target pace.
                    </p>
                    <button
                      onClick={() => setActiveMainTab('community')}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2459A8] px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-[#1c4786]"
                    >
                      <Compass size={14} />
                      <span>Explore Community</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {instances.map((instance: RoadmapInstance) => {
                      const roadmap = instance.roadmap;
                      const percent = instance.completionPercent || 0;
                      const paceHours = instance.targetPaceHoursPerWeek || 6;
                      const masteryCount = instance.masteryCount || 0;
                      const totalNodes = roadmap.nodes?.length || 0;

                      return (
                        <article
                          key={instance.id}
                          className="flex flex-col justify-between rounded-3xl border border-[#DCE7F2] bg-white p-5 shadow-sm transition hover:border-[#4A8BDF] dark:border-[#262626] dark:bg-[#1A1A1A]"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="rounded-lg bg-[#EFFAFD] px-2.5 py-1 text-[11px] font-bold text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]">
                                {roadmap.category || 'Curriculum'}
                              </span>
                              <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <Clock size={11} />
                                {paceHours} hrs/wk pace
                              </span>
                            </div>

                            <h3 className="mt-3 text-base font-black text-[#11183D] dark:text-white">
                              {roadmap.title}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-xs text-[#526078] dark:text-[#A8A8A8]">
                              {roadmap.description || 'Personal learning instance.'}
                            </p>

                            {/* Pacing & Mastery Progress */}
                            <div className="mt-5 space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-[#526078] dark:text-[#A8A8A8]">Progress</span>
                                <span className="font-mono text-[#2459A8] dark:text-[#93C5FD]">{percent}%</span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#262626]">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-[#4A8BDF] to-[#2459A8] transition-all duration-300"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>

                              <div className="flex items-center justify-between pt-1 text-[11px] text-[#7B8799]">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 size={12} className="text-emerald-600" />
                                  <strong>{masteryCount}</strong> of {totalNodes} mastered
                                </span>
                                {instance.targetCompletionDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar size={11} />
                                    Target: {new Date(instance.targetCompletionDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 border-t border-[#F0F4F8] pt-4 dark:border-[#262626]">
                            <Link
                              to={`/roadmap/${roadmap.id}`}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#11183D] py-2.5 text-xs font-bold text-white shadow transition hover:bg-[#2459A8] dark:bg-white dark:text-[#11183D] dark:hover:bg-slate-200"
                            >
                              <span>Continue Learning</span>
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Sub-tab 2: Following */}
            {mySubTab === 'following' && (
              <div>
                {followingRoadmaps.length === 0 ? (
                  <div className="rounded-3xl border border-[#DCE7F2] bg-white p-8 text-center text-xs text-[#526078] dark:border-[#262626] dark:bg-[#1A1A1A] dark:text-[#A8A8A8]">
                    You haven't followed any roadmaps yet. Follow authors to receive notifications when they release updates or new modules.
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {followingRoadmaps.map((r) => (
                      <article
                        key={r.id}
                        className="flex flex-col justify-between rounded-3xl border border-[#DCE7F2] bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="rounded-lg bg-[#EFFAFD] px-2.5 py-1 text-[11px] font-bold text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]">
                              {r.category || 'General'}
                            </span>
                            <button
                              onClick={() => void toggleFollow(r.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:underline"
                            >
                              <Heart size={12} className="fill-rose-600" />
                              <span>Following</span>
                            </button>
                          </div>
                          <h3 className="mt-3 text-base font-black text-[#11183D] dark:text-white">
                            {r.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs text-[#526078] dark:text-[#A8A8A8]">
                            {r.description || 'Followed roadmap.'}
                          </p>
                          <p className="mt-2 text-[11px] text-[#7B8799]">
                            Author: <strong>{r.creatorName || 'Rennetus Contributor'}</strong>
                          </p>
                        </div>

                        <div className="mt-5 border-t border-[#F0F4F8] pt-4 dark:border-[#262626]">
                          <Link
                            to={`/roadmap/${r.id}`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCE7F2] py-2 text-xs font-bold text-[#11183D] hover:bg-slate-50 dark:border-[#303030] dark:text-white dark:hover:bg-[#202020]"
                          >
                            <span>View Roadmap</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-tab 3: My Forks & Creations */}
            {mySubTab === 'creations' && (
              <div>
                {myCreationsAndForks.length === 0 ? (
                  <div className="rounded-3xl border border-[#DCE7F2] bg-white p-8 text-center text-xs text-[#526078] dark:border-[#262626] dark:bg-[#1A1A1A] dark:text-[#A8A8A8]">
                    You haven't authored or forked any roadmaps yet.
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {myCreationsAndForks.map((r) => (
                      <article
                        key={r.id}
                        className="group flex flex-col justify-between rounded-3xl border border-[#DCE7F2] bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="rounded-lg bg-[#EFFAFD] px-2.5 py-1 text-[11px] font-bold text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]">
                              {r.category || 'Custom'}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                {r.visibility}
                              </span>
                              <button
                                onClick={() => setDeleteConfirmId(r.id)}
                                className="rounded-lg p-1 text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <h3 className="mt-3 text-base font-black text-[#11183D] dark:text-white">
                            {r.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs text-[#526078] dark:text-[#A8A8A8]">
                            {r.description || 'Personal author copy.'}
                          </p>

                          {r.forkedFrom && (
                            <div className="mt-3 rounded-lg bg-slate-50 p-2 text-[10px] text-[#7B8799] dark:bg-[#202020]">
                              Forked from <strong>{r.forkedFrom.title}</strong> by {r.forkedFrom.creatorName || 'Original author'}
                            </div>
                          )}
                        </div>

                        <div className="mt-5 border-t border-[#F0F4F8] pt-4 dark:border-[#262626]">
                          <Link
                            to={`/roadmap/${r.id}`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#11183D] py-2 text-xs font-bold text-white shadow hover:bg-[#2459A8] dark:bg-white dark:text-[#11183D]"
                          >
                            <span>Open Studio</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-tab 4: Learning History */}
            {mySubTab === 'history' && (
              <div className="rounded-3xl border border-[#DCE7F2] bg-white p-6 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
                <h3 className="text-sm font-black text-[#11183D] dark:text-white">
                  Verified Competencies & Learning Credentials
                </h3>
                <p className="mt-1 text-xs text-[#526078] dark:text-[#A8A8A8]">
                  Modules where you successfully demonstrated technical depth through AI interview verifications and practical tasks.
                </p>

                <div className="mt-5 space-y-3">
                  {summary.totalMasteredModules === 0 ? (
                    <p className="text-xs text-[#7B8799]">
                      No verified competencies recorded yet. Pass your first module AI verification to unlock credentials.
                    </p>
                  ) : (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          {summary.totalMasteredModules} Competencies Mastered Across Enrolled Curriculums
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                        Evaluated under standard production engineering rubrics (Conceptual Depth, Practical Architecture, Edge Case Resilience).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL 1: START LEARNING (SET TARGET PACE) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {enrollModalRoadmap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#DCE7F2] bg-white p-6 shadow-2xl dark:border-[#303030] dark:bg-[#1A1A1A]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 rounded-lg bg-[#EFFAFD] px-2.5 py-1 text-[11px] font-bold text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]">
                <Clock size={13} />
                <span>Personal Learning Plan</span>
              </span>
              <button
                onClick={() => setEnrollModalRoadmap(null)}
                className="text-[#7B8799] hover:text-black dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="mt-3 text-lg font-black text-[#11183D] dark:text-white">
              Enroll in {enrollModalRoadmap.title}
            </h3>
            <p className="mt-1 text-xs text-[#526078] dark:text-[#A8A8A8]">
              Personalize this journey to your schedule. Your pace and progress stay in your private workspace without affecting the creator's published roadmap.
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#11183D] dark:text-white">
                  Target Study Pace
                </label>
                <span className="font-mono text-xs font-bold text-[#2459A8] dark:text-[#93C5FD]">
                  {targetPace} hours / week
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                step="1"
                value={targetPace}
                onChange={(e) => setTargetPace(Number(e.target.value))}
                className="w-full accent-[#2459A8]"
              />
              <div className="flex justify-between text-[10px] text-[#7B8799]">
                <span>2 hrs (Casual)</span>
                <span>6 hrs (Recommended)</span>
                <span>15+ hrs (Intensive)</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEnrollModalRoadmap(null)}
                className="rounded-xl border border-[#DCE7F2] px-4 py-2 text-xs font-bold text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:text-[#A8A8A8]"
              >
                Cancel
              </button>
              <button
                disabled={enrolling}
                onClick={() => void handleEnrollConfirm()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#11183D] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#2459A8] disabled:opacity-50 dark:bg-white dark:text-[#11183D]"
              >
                {enrolling ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Creating Plan...</span>
                  </>
                ) : (
                  <>
                    <Plus size={13} />
                    <span>Confirm & Start</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL 2: FORK ROADMAP */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {forkModalRoadmap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#DCE7F2] bg-white p-6 shadow-2xl dark:border-[#303030] dark:bg-[#1A1A1A]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                <GitFork size={13} />
                <span>Fork & Adapt</span>
              </span>
              <button
                onClick={() => setForkModalRoadmap(null)}
                className="text-[#7B8799] hover:text-black dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="mt-3 text-lg font-black text-[#11183D] dark:text-white">
              Fork this Roadmap
            </h3>
            <p className="mt-1 text-xs text-[#526078] dark:text-[#A8A8A8]">
              Create an editable branch in your studio. Full attribution will be preserved back to{' '}
              <strong>{forkModalRoadmap.creatorName || 'the original author'}</strong>.
            </p>

            <div className="mt-4 space-y-1">
              <label className="text-xs font-bold text-[#11183D] dark:text-white">
                Roadmap Title
              </label>
              <input
                value={forkTitle}
                onChange={(e) => setForkTitle(e.target.value)}
                placeholder="My custom version of this roadmap"
                className="w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3.5 py-2 text-xs font-medium outline-none transition focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#202020] dark:text-white"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setForkModalRoadmap(null)}
                className="rounded-xl border border-[#DCE7F2] px-4 py-2 text-xs font-bold text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:text-[#A8A8A8]"
              >
                Cancel
              </button>
              <button
                disabled={forking}
                onClick={() => void handleForkConfirm()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-purple-700 disabled:opacity-50"
              >
                {forking ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Forking...</span>
                  </>
                ) : (
                  <>
                    <GitFork size={13} />
                    <span>Create Fork</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL 3: DELETE CONFIRMATION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#DCE7F2] bg-white p-6 shadow-2xl dark:border-[#303030] dark:bg-[#1A1A1A]">
            <h3 className="text-lg font-black text-[#11183D] dark:text-white">Delete roadmap?</h3>
            <p className="mt-2 text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
              Are you sure you want to delete this roadmap? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-[#DCE7F2] px-4 py-2 text-xs font-bold text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:text-[#A8A8A8]"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={() => void handleDeleteConfirm()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
