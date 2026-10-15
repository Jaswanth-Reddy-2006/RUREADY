import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  GitBranch,
  Globe2,
  Layers,
  ListOrdered,
  Loader2,
  Lock,
  Plus,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  Video,
  X,
} from 'lucide-react';
import {
  roadmapApi,
  type Roadmap,
  type RoadmapAnalytics,
  type RoadmapNode,
} from '../../api/roadmap';
import Button from '../../components/ui/Button';

export default function RoadmapWorkspacePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [analytics, setAnalytics] = useState<RoadmapAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'graph'>('timeline');

  // Modal States
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [addNodeModalOpen, setAddNodeModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Add Node State
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeDesc, setNewNodeDesc] = useState('');
  const [newNodeInterview, setNewNodeInterview] = useState('');
  const [addingNode, setAddingNode] = useState(false);

  // Invite Collab State
  const [collabEmail, setCollabEmail] = useState('');
  const [collabRole, setCollabRole] = useState<'VIEWER' | 'EDITOR'>('VIEWER');
  const [collabLoading, setCollabLoading] = useState(false);
  const [collabSuccess, setCollabSuccess] = useState('');

  // Clone State
  const [cloning, setCloning] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      roadmapApi.get(id),
      roadmapApi.getAnalytics(id).catch(() => null),
    ])
      .then(([loadedRoadmap, loadedAnalytics]) => {
        setRoadmap(loadedRoadmap);
        setAnalytics(loadedAnalytics);
      })
      .catch((loadError) =>
        setError(loadError instanceof Error ? loadError.message : 'Unable to load this roadmap.'),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F9FD] p-8 dark:bg-black">
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-[#DCE7F2] bg-white p-10 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
          <Loader2 size={28} className="animate-spin text-[#2459A8]" />
          <p className="text-xs font-semibold text-[#526078] dark:text-[#A8A8A8]">
            Loading roadmap workspace...
          </p>
        </div>
      </main>
    );
  }

  if (error || !roadmap) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F9FD] p-8 dark:bg-black">
        <div className="mx-auto max-w-lg rounded-3xl border border-[#DCE7F2] bg-white p-8 text-center shadow-md dark:border-[#262626] dark:bg-[#1A1A1A]">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
            {error || 'Roadmap not found.'}
          </p>
          <button
            onClick={() => navigate('/roadmap')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#11183D] px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-[#11183D]"
          >
            <ArrowLeft size={14} /> Back to Roadmaps
          </button>
        </div>
      </main>
    );
  }

  const completedCount = roadmap.progress?.completed || 0;
  const totalCount = roadmap.progress?.total || roadmap.nodes.length;
  const percent = roadmap.progress?.percent || (totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0);

  const toggleNode = async (nodeId: string | undefined, currentDone: boolean) => {
    if (!nodeId) return;
    const nextPercent = currentDone ? 0 : 100;
    try {
      await roadmapApi.updateProgress(id, nodeId, nextPercent);
      setRoadmap((current) => {
        if (!current) return current;
        const updatedNodes = current.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, status: (currentDone ? 'TODO' : 'DONE') as any }
            : node,
        );
        const newCompleted = updatedNodes.filter((n) => n.status === 'DONE').length;
        const newTotal = updatedNodes.length;
        const newPercent = newTotal > 0 ? Math.round((newCompleted / newTotal) * 100) : 0;
        return {
          ...current,
          nodes: updatedNodes,
          progress: {
            completed: newCompleted,
            total: newTotal,
            percent: newPercent,
          },
        };
      });
    } catch (err) {
      console.error('Progress update error:', err);
    }
  };

  const handleUseRoadmap = async () => {
    setCloning(true);
    try {
      const copy = await roadmapApi.clone(id);
      navigate(`/roadmap/${copy.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to clone roadmap.');
    } finally {
      setCloning(false);
    }
  };

  const handleAddMilestone = async () => {
    if (!newNodeTitle.trim()) return;
    setAddingNode(true);
    try {
      const created = await roadmapApi.addNode(id, {
        title: newNodeTitle.trim(),
        description: newNodeDesc.trim() || undefined,
        type: 'MILESTONE',
        interview: newNodeInterview.trim()
          ? { topic: newNodeInterview.trim(), description: `Interview on ${newNodeTitle.trim()}` }
          : undefined,
      });

      setRoadmap((prev) => {
        if (!prev) return prev;
        const nextNodes = [...prev.nodes, created];
        return {
          ...prev,
          nodes: nextNodes,
          progress: {
            completed: prev.progress?.completed || 0,
            total: nextNodes.length,
            percent: Math.round(((prev.progress?.completed || 0) / nextNodes.length) * 100),
          },
        };
      });

      setNewNodeTitle('');
      setNewNodeDesc('');
      setNewNodeInterview('');
      setAddNodeModalOpen(false);
    } catch (err) {
      console.error('Failed to add milestone:', err);
    } finally {
      setAddingNode(false);
    }
  };

  const handleInviteCollaborator = async () => {
    if (!collabEmail.trim()) return;
    setCollabLoading(true);
    setCollabSuccess('');
    try {
      await roadmapApi.invite(id, collabEmail.trim(), collabRole);
      setCollabSuccess(`Invitation sent to ${collabEmail.trim()}!`);
      setCollabEmail('');
      setTimeout(() => {
        setCollabModalOpen(false);
        setCollabSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Failed to invite collaborator:', err);
    } finally {
      setCollabLoading(false);
    }
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleVisibility = async () => {
    const nextVis = roadmap.visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
    try {
      await roadmapApi.publish(id, nextVis);
      setRoadmap((prev) => (prev ? { ...prev, visibility: nextVis } : prev));
    } catch (err) {
      console.error('Failed to update visibility:', err);
    }
  };

  return (
    <main className="min-h-full bg-[#F4F9FD] px-4 py-8 text-[#11183D] transition-colors sm:px-6 lg:px-10 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-[1300px] space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#526078] transition hover:text-[#2459A8] dark:text-[#A8A8A8] dark:hover:text-white"
          >
            <ArrowLeft size={15} /> All roadmaps
          </Link>

          <div className="flex items-center gap-2">
            {roadmap.visibility === 'PUBLIC' && (
              <Button
                size="sm"
                variant="primary"
                icon={cloning ? <Loader2 size={14} className="animate-spin" /> : <Copy size={14} />}
                onClick={() => void handleUseRoadmap()}
                isLoading={cloning}
                className="text-xs font-bold shadow-sm"
              >
                Use this roadmap
              </Button>
            )}

            <Button
              size="sm"
              variant="secondary"
              icon={<Users size={14} />}
              onClick={() => setCollabModalOpen(true)}
              className="text-xs font-bold"
            >
              Collaborate
            </Button>

            <Button
              size="sm"
              variant="ai"
              icon={<Share2 size={14} />}
              onClick={() => setShareModalOpen(true)}
              className="text-xs font-bold shadow-sm"
            >
              Share
            </Button>
          </div>
        </div>

        {/* Hero Studio Banner */}
        <section className="rounded-[2.5rem] border border-[#DCE7F2] bg-white p-6 shadow-sm sm:p-10 dark:border-[#262626] dark:bg-[#1A1A1A]">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => void toggleVisibility()}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                    roadmap.visibility === 'PUBLIC'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-slate-100 text-[#526078] dark:bg-[#262626] dark:text-[#A8A8A8]'
                  }`}
                  title="Click to toggle visibility"
                >
                  {roadmap.visibility === 'PUBLIC' ? <Globe2 size={12} /> : <Lock size={12} />}
                  <span>{roadmap.visibility}</span>
                </button>

                {roadmap.category && (
                  <span className="rounded-full bg-[#EFFAFD] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]">
                    {roadmap.category}
                  </span>
                )}

                {roadmap.difficulty && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#526078] dark:bg-[#262626] dark:text-[#A8A8A8]">
                    {roadmap.difficulty}
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl font-black tracking-tight text-[#11183D] sm:text-3xl dark:text-white">
                {roadmap.title}
              </h1>

              <p className="max-w-3xl text-xs leading-6 text-[#526078] dark:text-[#A8A8A8]">
                {roadmap.description || roadmap.goal || 'No description provided.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-semibold text-[#7B8799]">
                <span className="flex items-center gap-1.5 text-[#2459A8] dark:text-[#93C5FD]">
                  <ShieldCheck size={14} />
                  Created by <strong>{roadmap.creatorName || 'Rennetus Expert Committee'}</strong>
                </span>
                {roadmap.estimatedWeeks && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {roadmap.estimatedWeeks} Weeks Duration
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* View Mode Toggle Switcher */}
            <div className="flex rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] p-1 shadow-sm dark:border-[#303030] dark:bg-[#202020]">
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                  viewMode === 'timeline'
                    ? 'bg-white text-[#11183D] shadow-sm dark:bg-[#303030] dark:text-white'
                    : 'text-[#7B8799] hover:text-[#11183D] dark:hover:text-white'
                }`}
              >
                <ListOrdered size={14} />
                <span>Timeline View</span>
              </button>
              <button
                onClick={() => setViewMode('graph')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                  viewMode === 'graph'
                    ? 'bg-white text-[#11183D] shadow-sm dark:bg-[#303030] dark:text-white'
                    : 'text-[#7B8799] hover:text-[#11183D] dark:hover:text-white'
                }`}
              >
                <GitBranch size={14} />
                <span>Tree Graph</span>
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['Progress', `${percent}%`, `${completedCount} of ${totalCount} completed`],
              ['Milestones', `${completedCount}/${totalCount}`, 'Check off steps'],
              ['Active Pace', `${analytics?.activeDays || 1} Days`, 'Consistent activity'],
              ['Collaborators', `${analytics?.collaborators || roadmap.collaborators?.length || 1}`, 'Active peers'],
            ].map(([label, value, sub]) => (
              <div
                key={label}
                className="rounded-2xl border border-[#F0F4F8] bg-[#F8FAFC] p-4 dark:border-[#262626] dark:bg-[#202020]"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">{label}</p>
                <p className="mt-1 font-mono text-xl font-black text-[#11183D] dark:text-white">{value}</p>
                <p className="mt-0.5 text-[10px] font-medium text-[#526078] dark:text-[#A8A8A8]">{sub}</p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EFFAFD] dark:bg-[#262626]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4A8BDF] via-[#2459A8] to-[#A0006D] transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Path Section */}
          <section className="rounded-[2.5rem] border border-[#DCE7F2] bg-white p-6 shadow-sm sm:p-8 dark:border-[#262626] dark:bg-[#1A1A1A]">
            <div className="flex items-center justify-between border-b border-[#F0F4F8] pb-4 dark:border-[#262626]">
              <div>
                <h2 className="text-lg font-black text-[#11183D] dark:text-white">Roadmap Milestones</h2>
                <p className="text-xs text-[#526078] dark:text-[#A8A8A8]">
                  Click on any milestone to toggle completion or launch a mock interview checkpoint.
                </p>
              </div>
              <button
                onClick={() => setAddNodeModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE7F2] bg-white px-3 py-1.5 text-xs font-bold text-[#2459A8] shadow-sm transition hover:bg-[#EFFAFD] dark:border-[#303030] dark:bg-[#202020] dark:text-[#93C5FD]"
              >
                <Plus size={14} /> Add Milestone
              </button>
            </div>

            {/* TIMELINE VIEW */}
            {viewMode === 'timeline' && (
              <div className="space-y-4 pt-6">
                {roadmap.nodes.map((node, index) => {
                  const isDone = node.status === 'DONE';

                  return (
                    <div
                      key={node.id || `${node.order}-${index}`}
                      className={`group relative flex w-full gap-4 rounded-3xl border p-5 transition hover:shadow-md ${
                        isDone
                          ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-950 dark:bg-emerald-950/10'
                          : 'border-[#E1EAF4] bg-white hover:border-[#4A8BDF] dark:border-[#262626] dark:bg-[#1E1E1E]'
                      }`}
                    >
                      {/* Step Number / Checkbox */}
                      <button
                        onClick={() => void toggleNode(node.id, isDone)}
                        aria-label="Toggle milestone completion"
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-xs font-black shadow-sm transition ${
                          isDone
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                            : 'bg-[#EFFAFD] text-[#2459A8] hover:bg-[#2459A8] hover:text-white dark:bg-[#262626] dark:text-[#93C5FD]'
                        }`}
                      >
                        {isDone ? <Check size={16} /> : index + 1}
                      </button>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3
                            onClick={() => void toggleNode(node.id, isDone)}
                            className={`cursor-pointer text-sm font-black transition ${
                              isDone
                                ? 'text-emerald-800 line-through dark:text-emerald-300'
                                : 'text-[#11183D] hover:text-[#2459A8] dark:text-white dark:hover:text-[#93C5FD]'
                            }`}
                          >
                            {node.title || 'Untitled milestone'}
                          </h3>

                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                : 'bg-[#EFFAFD] text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]'
                            }`}
                          >
                            {isDone ? 'Completed' : 'In Progress'}
                          </span>
                        </div>

                        <p className="mt-1.5 text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
                          {node.description || 'Add context, practical exercises, and resources for this milestone.'}
                        </p>

                        {/* Interview Checkpoint Button */}
                        {node.interview && (
                          <div className="mt-3.5 flex flex-wrap items-center gap-2 rounded-2xl border border-[#E8C5DE] bg-[#FFF8FD] p-3 dark:border-[#5A214D] dark:bg-[#261521]">
                            <div className="flex-1">
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#A0006D] dark:text-[#F391D3]">
                                <Video size={12} /> Interview Checkpoint
                              </span>
                              <p className="text-xs font-bold text-[#11183D] dark:text-white">
                                {node.interview.topic}
                              </p>
                              {node.interview.description && (
                                <p className="mt-0.5 text-[11px] text-[#7B3A6C] dark:text-[#F391D3]">
                                  {node.interview.description}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                navigate(
                                  `/video/setup?topic=${encodeURIComponent(
                                    node.interview?.topic || node.title,
                                  )}`,
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#A0006D] to-[#7B1D5F] px-3 py-2 text-[11px] font-bold text-white shadow-sm transition hover:opacity-95"
                            >
                              <Video size={13} />
                              <span>Launch Interview</span>
                            </button>
                          </div>
                        )}

                        {/* Sub-branches / Child steps */}
                        {node.children && node.children.length > 0 && (
                          <div className="mt-3.5 space-y-2 border-l-2 border-[#DCE7F2] pl-3.5 dark:border-[#303030]">
                            {node.children.map((child, cIdx) => (
                              <div
                                key={child.id || cIdx}
                                className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3.5 py-2 dark:bg-[#262626]"
                              >
                                <div>
                                  <p className="text-xs font-bold text-[#11183D] dark:text-white">
                                    {child.title}
                                  </p>
                                  {child.description && (
                                    <p className="text-[11px] text-[#526078] dark:text-[#A8A8A8]">
                                      {child.description}
                                    </p>
                                  )}
                                </div>
                                <span className="rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-[#7B8799] dark:bg-[#1A1A1A]">
                                  Sub-task
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TREE GRAPH VIEW */}
            {viewMode === 'graph' && (
              <div className="relative space-y-6 pt-6">
                {roadmap.nodes.map((node, index) => {
                  const isDone = node.status === 'DONE';
                  const isLast = index === roadmap.nodes.length - 1;

                  return (
                    <div key={node.id || index} className="relative flex items-start gap-4">
                      {/* Vertical line connector */}
                      {!isLast && (
                        <div
                          className={`absolute left-4 top-10 w-0.5 -bottom-6 ${
                            isDone ? 'bg-emerald-400 dark:bg-emerald-600' : 'bg-[#DCE7F2] dark:bg-[#303030]'
                          }`}
                        />
                      )}

                      {/* Node Icon */}
                      <button
                        onClick={() => void toggleNode(node.id, isDone)}
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black shadow-sm transition ${
                          isDone
                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                            : 'bg-white text-[#2459A8] ring-4 ring-[#EFFAFD] dark:bg-[#262626] dark:text-[#93C5FD] dark:ring-[#1E1E1E]'
                        }`}
                      >
                        {isDone ? <Check size={14} /> : index + 1}
                      </button>

                      {/* Node Card */}
                      <div className="min-w-0 flex-1 rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] p-4 transition hover:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#202020]">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-black text-[#11183D] dark:text-white">
                            {node.title}
                          </h4>
                          {node.interview && (
                            <span className="flex items-center gap-1 rounded bg-[#FFF5FA] px-2 py-0.5 text-[10px] font-bold text-[#A0006D] dark:bg-[#261521] dark:text-[#F391D3]">
                              <Video size={10} /> Interview
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] leading-4 text-[#526078] dark:text-[#A8A8A8]">
                          {node.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Right Sidebar */}
          <aside className="space-y-5">
            {/* Quick Practice Card */}
            <div className="rounded-[2.5rem] border border-[#DCE7F2] bg-white p-6 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFFAFD] text-[#A0006D] dark:bg-[#262626]">
                  <Sparkles size={16} />
                </div>
                <h3 className="text-sm font-black text-[#11183D] dark:text-white">Practice Studio</h3>
              </div>
              <p className="mt-3 text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
                Accelerate retention by alternating between roadmap milestones and realistic mock rounds.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => navigate('/video/new')}
                  className="flex w-full items-center justify-between rounded-xl bg-[#F8FAFC] p-3 text-xs font-bold text-[#11183D] transition hover:bg-[#EFFAFD] hover:text-[#2459A8] dark:bg-[#262626] dark:text-white dark:hover:bg-[#303030]"
                >
                  <span className="flex items-center gap-2">
                    <Video size={14} className="text-[#A0006D]" /> AI Video Interview
                  </span>
                  <ExternalLink size={13} className="text-[#7B8799]" />
                </button>
                <button
                  onClick={() => navigate('/coding/new')}
                  className="flex w-full items-center justify-between rounded-xl bg-[#F8FAFC] p-3 text-xs font-bold text-[#11183D] transition hover:bg-[#EFFAFD] hover:text-[#2459A8] dark:bg-[#262626] dark:text-white dark:hover:bg-[#303030]"
                >
                  <span className="flex items-center gap-2">
                    <Layers size={14} className="text-[#2459A8]" /> Live Coding Round
                  </span>
                  <ExternalLink size={13} className="text-[#7B8799]" />
                </button>
              </div>
            </div>

            {/* Collaboration Card */}
            <div className="rounded-[2.5rem] border border-[#DCE7F2] bg-white p-6 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#2459A8] dark:text-[#93C5FD]" />
                <h3 className="text-sm font-black text-[#11183D] dark:text-white">Study Accountability</h3>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
                Share your progress with a mentor, study partner, or peer group to stay on track.
              </p>
              <button
                onClick={() => setCollabModalOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#2459A8] hover:text-[#A0006D] dark:text-[#93C5FD]"
              >
                <Users size={14} /> Invite collaborator
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Add Milestone Modal */}
      {addNodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#DCE7F2] bg-white p-6 shadow-2xl dark:border-[#303030] dark:bg-[#1A1A1A]">
            <div className="flex items-center justify-between border-b border-[#F0F4F8] pb-3 dark:border-[#262626]">
              <h3 className="text-base font-black text-[#11183D] dark:text-white">Add Roadmap Milestone</h3>
              <button
                onClick={() => setAddNodeModalOpen(false)}
                className="text-[#7B8799] hover:text-[#11183D] dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-[#11183D] dark:text-white">Milestone Title *</label>
                <input
                  value={newNodeTitle}
                  onChange={(e) => setNewNodeTitle(e.target.value)}
                  placeholder="e.g. Master SQL Joins & Window Functions"
                  className="mt-1.5 w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3.5 py-2 text-xs outline-none focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#262626] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#11183D] dark:text-white">Description</label>
                <textarea
                  value={newNodeDesc}
                  onChange={(e) => setNewNodeDesc(e.target.value)}
                  placeholder="Learning objectives, practical projects, or references..."
                  rows={3}
                  className="mt-1.5 w-full resize-none rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3.5 py-2 text-xs outline-none focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#262626] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#11183D] dark:text-white">
                  Interview Checkpoint (Optional)
                </label>
                <input
                  value={newNodeInterview}
                  onChange={(e) => setNewNodeInterview(e.target.value)}
                  placeholder="e.g. Advanced SQL Optimization & Query Plans"
                  className="mt-1.5 w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3.5 py-2 text-xs outline-none focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#262626] dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setAddNodeModalOpen(false)}
                className="rounded-xl border border-[#DCE7F2] px-4 py-2 text-xs font-bold text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:text-[#A8A8A8]"
              >
                Cancel
              </button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => void handleAddMilestone()}
                isLoading={addingNode}
                className="text-xs font-bold"
              >
                Add Milestone
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#DCE7F2] bg-white p-6 shadow-2xl dark:border-[#303030] dark:bg-[#1A1A1A]">
            <div className="flex items-center justify-between border-b border-[#F0F4F8] pb-3 dark:border-[#262626]">
              <h3 className="text-base font-black text-[#11183D] dark:text-white">Share Roadmap</h3>
              <button
                onClick={() => setShareModalOpen(false)}
                className="text-[#7B8799] hover:text-[#11183D] dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
              Anyone with this link can view this roadmap and clone it to their studio.
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] p-2 dark:border-[#303030] dark:bg-[#262626]">
              <input
                readOnly
                value={window.location.href}
                className="min-w-0 flex-1 bg-transparent px-2 text-xs font-mono text-[#526078] outline-none dark:text-[#A8A8A8]"
              />
              <button
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#11183D] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#2459A8] dark:bg-white dark:text-[#11183D]"
              >
                {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collaborate Modal */}
      {collabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#DCE7F2] bg-white p-6 shadow-2xl dark:border-[#303030] dark:bg-[#1A1A1A]">
            <div className="flex items-center justify-between border-b border-[#F0F4F8] pb-3 dark:border-[#262626]">
              <h3 className="text-base font-black text-[#11183D] dark:text-white">Invite Collaborator</h3>
              <button
                onClick={() => setCollabModalOpen(false)}
                className="text-[#7B8799] hover:text-[#11183D] dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-[#11183D] dark:text-white">Email Address *</label>
                <input
                  type="email"
                  value={collabEmail}
                  onChange={(e) => setCollabEmail(e.target.value)}
                  placeholder="mentor@example.com"
                  className="mt-1.5 w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3.5 py-2 text-xs outline-none focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#262626] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#11183D] dark:text-white">Role Permission</label>
                <select
                  value={collabRole}
                  onChange={(e) => setCollabRole(e.target.value as any)}
                  className="mt-1.5 w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3.5 py-2 text-xs font-semibold outline-none focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#262626] dark:text-white"
                >
                  <option value="VIEWER">Viewer (Can track progress)</option>
                  <option value="EDITOR">Editor (Can edit milestones)</option>
                </select>
              </div>

              {collabSuccess && (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {collabSuccess}
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setCollabModalOpen(false)}
                className="rounded-xl border border-[#DCE7F2] px-4 py-2 text-xs font-bold text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:text-[#A8A8A8]"
              >
                Cancel
              </button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => void handleInviteCollaborator()}
                isLoading={collabLoading}
                className="text-xs font-bold"
              >
                Send Invite
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
