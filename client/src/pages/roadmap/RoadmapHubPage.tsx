import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  Layers,
  Loader2,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { roadmapApi, type Roadmap } from '../../api/roadmap';
import Button from '../../components/ui/Button';

export default function RoadmapHubPage() {
  const navigate = useNavigate();
  const { roadmaps, isLoading, loadRoadmaps, deleteRoadmap } = useRoadmapStore();
  const [expertRoadmaps, setExpertRoadmaps] = useState<Roadmap[]>([]);
  const [activeTab, setActiveTab] = useState<'mine' | 'explore'>('mine');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('ALL');
  const [actionError, setActionError] = useState('');
  const [cloningId, setCloningId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    void loadRoadmaps();
    void roadmapApi.explore().then(setExpertRoadmaps).catch(() => setExpertRoadmaps([]));
  }, [loadRoadmaps]);

  const categories = Array.from(
    new Set([
      'Frontend Engineering',
      'Backend Engineering',
      'Artificial Intelligence',
      'Data & Analytics',
      'DevOps & Cloud',
      'Interview Preparation',
      ...expertRoadmaps.map((r) => r.category).filter(Boolean),
    ]),
  );

  const filteredExperts = expertRoadmaps.filter((roadmap) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      `${roadmap.title} ${roadmap.description || ''} ${(roadmap.tags || []).join(' ')}`
        .toLowerCase()
        .includes(q);
    const matchesCategory = category === 'all' || roadmap.category === category;
    const matchesDifficulty =
      difficultyFilter === 'ALL' ||
      (roadmap.difficulty && roadmap.difficulty.toUpperCase() === difficultyFilter);
    return matchesQuery && matchesCategory && matchesDifficulty;
  });

  const filteredMyRoadmaps = roadmaps.filter((roadmap) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      `${roadmap.title} ${roadmap.description || ''} ${(roadmap.tags || []).join(' ')}`
        .toLowerCase()
        .includes(q);
    const matchesCategory = category === 'all' || roadmap.category === category;
    const matchesDifficulty =
      difficultyFilter === 'ALL' ||
      (roadmap.difficulty && roadmap.difficulty.toUpperCase() === difficultyFilter);
    return matchesQuery && matchesCategory && matchesDifficulty;
  });

  const cloneRoadmap = async (roadmap: Roadmap) => {
    setActionError('');
    setCloningId(roadmap.id);
    try {
      const copy = await roadmapApi.clone(roadmap.id);
      await loadRoadmaps();
      navigate(`/roadmap/${copy.id}`);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to use this roadmap.');
    } finally {
      setCloningId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteRoadmap(id);
      setDeleteConfirmId(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to delete roadmap.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-full bg-[#F4F9FD] px-4 py-8 text-[#11183D] transition-colors sm:px-6 lg:px-10 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-[1400px] space-y-8">
        {/* Top Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E1EAF4] pb-5 dark:border-[#262626]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2459A8]/10 text-[#2459A8] dark:bg-[#93C5FD]/10 dark:text-[#93C5FD]">
                <Layers size={14} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#526078] dark:text-[#A8A8A8]">
                Career & Skill Acceleration
              </span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-black text-[#11183D] sm:text-3xl dark:text-white">
              Roadmap Studio
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="sm"
              icon={<Plus size={15} />}
              onClick={() => navigate('/roadmap/create')}
              className="font-bold shadow-sm"
            >
              Create roadmap
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

        {/* Studio Subheading & Tab Switcher */}
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#526078] dark:text-[#A8A8A8]">
              {activeTab === 'mine'
                ? `You have ${roadmaps.length} active roadmap${roadmaps.length === 1 ? '' : 's'} in your personal studio.`
                : 'Curated industry learning paths by Rennetus Expert Committee and community leaders.'}
            </p>
          </div>
          <div className="flex rounded-xl border border-[#DCE7F2] bg-white p-1 shadow-sm dark:border-[#303030] dark:bg-[#1A1A1A]">
            <button
              onClick={() => setActiveTab('mine')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                activeTab === 'mine'
                  ? 'bg-[#11183D] text-white shadow-sm dark:bg-white dark:text-[#11183D]'
                  : 'text-[#526078] hover:text-[#11183D] dark:text-[#A8A8A8] dark:hover:text-white'
              }`}
            >
              <BookOpen size={14} />
              <span>My roadmaps</span>
              {roadmaps.length > 0 && (
                <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === 'mine' ? 'bg-white/20' : 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'}`}>
                  {roadmaps.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                activeTab === 'explore'
                  ? 'bg-[#11183D] text-white shadow-sm dark:bg-white dark:text-[#11183D]'
                  : 'text-[#526078] hover:text-[#11183D] dark:text-[#A8A8A8] dark:hover:text-white'
              }`}
            >
              <Compass size={14} />
              <span>Explore community</span>
              {expertRoadmaps.length > 0 && (
                <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === 'explore' ? 'bg-white/20' : 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'}`}>
                  {expertRoadmaps.length}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#DCE7F2] bg-white p-3 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
          <div className="relative min-w-[240px] flex-1">
            <Search size={15} className="absolute left-3.5 top-3 text-[#7B8799]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by role, skills, keywords or topics..."
              className="w-full rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] py-2 pl-9.5 pr-8 text-xs font-medium outline-none transition focus:border-[#4A8BDF] focus:bg-white dark:border-[#303030] dark:bg-[#262626] dark:text-white"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-2.5 text-[#7B8799] hover:text-black dark:hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#11183D] outline-none transition focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#262626] dark:text-white"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div className="hidden items-center gap-1 sm:flex">
              {(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficultyFilter(lvl)}
                  className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition ${
                    difficultyFilter === lvl
                      ? 'bg-[#2459A8] text-white shadow-sm'
                      : 'bg-[#F8FAFC] text-[#526078] hover:bg-slate-100 dark:bg-[#262626] dark:text-[#A8A8A8]'
                  }`}
                >
                  {lvl === 'ALL' ? 'All levels' : lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {actionError && (
          <div className="flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            <span>{actionError}</span>
            <button onClick={() => setActionError('')} className="text-rose-500 hover:text-rose-700">
              <X size={14} />
            </button>
          </div>
        )}

        {/* TAB 1: MY ROADMAPS */}
        {activeTab === 'mine' && (
          <div>
            {isLoading ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-3xl border border-[#DCE7F2] bg-white p-8 dark:border-[#262626] dark:bg-[#1A1A1A]">
                <Loader2 size={24} className="animate-spin text-[#2459A8]" />
                <p className="text-xs font-semibold text-[#526078] dark:text-[#A8A8A8]">Loading your roadmaps...</p>
              </div>
            ) : filteredMyRoadmaps.length === 0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#DCE7F2] bg-white p-8 text-center dark:border-[#262626] dark:bg-[#1A1A1A]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFFAFD] text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]">
                  <Compass size={32} />
                </div>
                <h3 className="mt-4 text-lg font-black text-[#11183D] dark:text-white">
                  {query || category !== 'all' ? 'No matching roadmaps found' : 'Your studio is empty'}
                </h3>
                <p className="mt-1 max-w-md text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
                  {query || category !== 'all'
                    ? 'Try clearing your search query or switching categories to see other roadmaps.'
                    : 'Create your first personalized learning roadmap or let our AI architect a step-by-step curriculum in seconds.'}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    size="sm"
                    icon={<Plus size={15} />}
                    onClick={() => navigate('/roadmap/create')}
                  >
                    Create from scratch
                  </Button>
                  <Button
                    size="sm"
                    variant="ai"
                    icon={<Sparkles size={15} />}
                    onClick={() => navigate('/roadmap/create?mode=ai')}
                  >
                    Generate with AI
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredMyRoadmaps.map((roadmap) => {
                  const percent = roadmap.progress?.percent || 0;
                  const completedNodes = roadmap.progress?.completed || 0;
                  const totalNodes = roadmap.progress?.total || roadmap.nodes.length;

                  return (
                    <article
                      key={roadmap.id}
                      className="group flex flex-col justify-between rounded-3xl border border-[#DCE7F2] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#4A8BDF] hover:shadow-xl dark:border-[#262626] dark:bg-[#1A1A1A]"
                    >
                      <div>
                        {/* Top row pills */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 rounded-lg bg-[#EFFAFD] px-2.5 py-1 text-[11px] font-bold text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]">
                            <BookOpen size={13} />
                            <span>{roadmap.category || 'General'}</span>
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                              {roadmap.visibility === 'PUBLIC' ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                  <ShieldCheck size={12} /> Public
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[#7B8799]">
                                  <Lock size={11} /> Private
                                </span>
                              )}
                            </span>

                            <button
                              onClick={() => setDeleteConfirmId(roadmap.id)}
                              aria-label="Delete roadmap"
                              className="rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-rose-950/30"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Title and description */}
                        <h3 className="mt-4 text-base font-black text-[#11183D] transition group-hover:text-[#2459A8] dark:text-white dark:group-hover:text-[#93C5FD]">
                          {roadmap.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
                          {roadmap.description || roadmap.goal || 'No description provided.'}
                        </p>

                        {/* Meta tags */}
                        {roadmap.tags && roadmap.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {roadmap.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded-md bg-[#F4F9FD] px-2 py-0.5 text-[10px] font-semibold text-[#526078] dark:bg-[#262626] dark:text-[#A8A8A8]"
                              >
                                <Tag size={9} />
                                {tag}
                              </span>
                            ))}
                            {roadmap.tags.length > 3 && (
                              <span className="rounded-md bg-[#F4F9FD] px-1.5 py-0.5 text-[10px] font-semibold text-[#7B8799] dark:bg-[#262626]">
                                +{roadmap.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Progress and footer */}
                      <div className="mt-6 border-t border-[#F0F4F8] pt-4 dark:border-[#262626]">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#526078] dark:text-[#A8A8A8]">
                          <span>
                            {completedNodes} of {totalNodes} complete
                          </span>
                          <span className="font-mono text-[#2459A8] dark:text-[#93C5FD]">{percent}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EFFAFD] dark:bg-[#262626]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#4A8BDF] to-[#2459A8] transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="mt-4 flex items-center justify-between pt-1">
                          <span className="text-[11px] font-medium text-[#7B8799]">
                            {roadmap.estimatedWeeks ? `${roadmap.estimatedWeeks} weeks` : `${totalNodes} milestones`}
                          </span>
                          <Link
                            to={`/roadmap/${roadmap.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2459A8] transition hover:translate-x-0.5 hover:text-[#A0006D] dark:text-[#93C5FD]"
                          >
                            <span>Open studio</span>
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EXPLORE COMMUNITY */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredExperts.map((roadmap) => {
                const isCloning = cloningId === roadmap.id;
                return (
                  <article
                    key={roadmap.id}
                    className="group flex flex-col justify-between rounded-3xl border border-[#DCE7F2] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#4A8BDF] hover:shadow-xl dark:border-[#262626] dark:bg-[#1A1A1A]"
                  >
                    <div>
                      {/* Gradient Accent Bar */}
                      <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#2459A8] via-[#4A8BDF] to-[#A0006D]" />

                      {/* Header Tags */}
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                        <span className="rounded bg-[#EFFAFD] px-2 py-0.5 text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]">
                          {roadmap.category || 'Curated'}
                        </span>
                        <span>·</span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-[#262626] dark:text-neutral-300">
                          {roadmap.difficulty || 'All levels'}
                        </span>
                        {roadmap.estimatedWeeks && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} />
                              {roadmap.estimatedWeeks} weeks
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="mt-3 text-base font-black text-[#11183D] transition group-hover:text-[#2459A8] dark:text-white dark:group-hover:text-[#93C5FD]">
                        {roadmap.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
                        {roadmap.description || roadmap.goal}
                      </p>

                      {/* Creator attribution */}
                      <div className="mt-4 flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3 py-2 text-[11px] font-semibold text-[#526078] dark:bg-[#262626] dark:text-[#A8A8A8]">
                        <ShieldCheck size={14} className="text-[#2459A8] dark:text-[#93C5FD]" />
                        <span>Created by <strong className="text-[#11183D] dark:text-white">{roadmap.creatorName || 'Rennetus Expert Committee'}</strong></span>
                      </div>

                      {/* Tags */}
                      {roadmap.tags && roadmap.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {roadmap.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-[#EFFAFD] px-2 py-0.5 text-[10px] font-medium text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Stats & Actions */}
                    <div className="mt-6 border-t border-[#F0F4F8] pt-4 dark:border-[#262626]">
                      <div className="flex items-center justify-between text-[11px] text-[#7B8799]">
                        <span className="font-semibold">{roadmap.nodes.length} structured milestones</span>
                        <span>{roadmap.cloneCount || 0} active learners</span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <Link
                          to={`/roadmap/${roadmap.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#2459A8] hover:text-[#A0006D] dark:text-[#93C5FD]"
                        >
                          <span>Preview</span>
                          <ArrowRight size={13} />
                        </Link>
                        <button
                          disabled={isCloning}
                          onClick={() => void cloneRoadmap(roadmap)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#11183D] px-3.5 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#2459A8] disabled:opacity-50 dark:bg-white dark:text-[#11183D] dark:hover:bg-slate-200"
                        >
                          {isCloning ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>Cloning...</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Use roadmap</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredExperts.length === 0 && (
              <p className="rounded-2xl border border-[#DCE7F2] bg-white p-8 text-center text-sm text-[#526078] dark:border-[#262626] dark:bg-[#1A1A1A] dark:text-[#A8A8A8]">
                No published roadmaps match your search criteria.
              </p>
            )}
          </div>
        )}

        {/* Value Highlights Footer Row */}
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            [CheckCircle2, 'Milestone Execution', 'Every branch comes with clear completion criteria, practice projects, and measurable check-offs.'],
            [Users, 'Collaborative Review', 'Invite peers and mentors to review your progress, give feedback, and keep you accountable.'],
            [BarChart3, 'Telemetry & Readiness', 'Directly launch mock AI video interviews for any milestone topic and track your confidence scores.'],
          ].map(([Icon, title, copy]) => (
            <div
              key={title as string}
              className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm transition hover:border-[#4A8BDF] dark:border-[#262626] dark:bg-[#1A1A1A]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFFAFD] text-[#A0006D] dark:bg-[#262626]">
                <Icon size={19} />
              </div>
              <h3 className="mt-3 text-sm font-black text-[#11183D] dark:text-white">{title as string}</h3>
              <p className="mt-1 text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">{copy as string}</p>
            </div>
          ))}
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#DCE7F2] bg-white p-6 shadow-2xl dark:border-[#303030] dark:bg-[#1A1A1A]">
            <h3 className="text-lg font-black text-[#11183D] dark:text-white">Delete roadmap?</h3>
            <p className="mt-2 text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
              Are you sure you want to delete this roadmap? This action will remove all milestones and tracked progress.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-[#DCE7F2] px-4 py-2 text-xs font-bold text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:text-[#A8A8A8]"
              >
                Cancel
              </button>
              <button
                disabled={deletingId === deleteConfirmId}
                onClick={() => void handleDelete(deleteConfirmId)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
              >
                {deletingId === deleteConfirmId ? (
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
