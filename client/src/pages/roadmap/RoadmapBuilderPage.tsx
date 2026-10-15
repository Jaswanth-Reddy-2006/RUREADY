import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Layers,
  Lightbulb,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Video,
  Wand2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { roadmapApi, type RoadmapNode } from '../../api/roadmap';

type DraftNode = Omit<RoadmapNode, 'children'> & { children: DraftNode[] };
const newNode = (): DraftNode => ({
  title: '',
  description: '',
  type: 'MILESTONE',
  order: 0,
  children: [],
});

function NodeEditor({
  node,
  path,
  update,
  remove,
  addChild,
}: {
  node: DraftNode;
  path: number[];
  update: (path: number[], patch: Partial<DraftNode>) => void;
  remove: (path: number[]) => void;
  addChild: (path: number[]) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [interviewOpen, setInterviewOpen] = useState(Boolean(node.interview));

  return (
    <div className="space-y-3 border-l-2 border-[#DCE7F2] pl-3.5 dark:border-[#303030]">
      <div className="rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] p-3.5 transition hover:border-[#4A8BDF]/50 dark:border-[#303030] dark:bg-[#202020]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            aria-label="Toggle branch"
            className="text-[#7B8799] hover:text-[#11183D] dark:hover:text-white"
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <GripVertical size={16} className="text-[#7B8799]" />
          <input
            value={node.title}
            onChange={(event) => update(path, { title: event.target.value })}
            placeholder="Milestone title (e.g. Master React Core & Hooks)"
            className="min-w-0 flex-1 bg-transparent py-1.5 text-sm font-bold text-[#11183D] outline-none dark:text-white"
          />
          <button
            onClick={() => remove(path)}
            aria-label="Remove branch"
            className="rounded-lg p-1.5 text-[#7B8799] transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {expanded && (
          <div className="mt-3 space-y-3 pl-7">
            <textarea
              value={node.description || ''}
              onChange={(event) => update(path, { description: event.target.value })}
              placeholder="Describe learning goals, practical exercises, deliverables, or resources..."
              rows={2}
              className="w-full resize-none rounded-xl border border-[#DCE7F2] bg-white px-3.5 py-2 text-xs outline-none transition focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-white"
            />

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => addChild(path)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE7F2] bg-white px-3 py-1.5 text-[11px] font-bold text-[#2459A8] transition hover:bg-[#EFFAFD] dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-[#93C5FD]"
              >
                <Plus size={13} /> Add sub-task
              </button>
              <button
                type="button"
                onClick={() => {
                  setInterviewOpen(!interviewOpen);
                  if (!node.interview) update(path, { interview: { topic: node.title } });
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-bold transition ${
                  node.interview
                    ? 'border-[#A0006D] bg-[#FFF5FA] text-[#A0006D] dark:border-[#5A214D] dark:bg-[#261521]'
                    : 'border-[#DCE7F2] bg-white text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-[#A8A8A8]'
                }`}
              >
                <Video size={13} /> {node.interview ? 'Interview checkpoint active' : 'Attach interview step'}
              </button>
            </div>

            {interviewOpen && (
              <div className="grid gap-2.5 rounded-xl border border-[#E8C5DE] bg-[#FFF7FC] p-3.5 dark:border-[#5A214D] dark:bg-[#261521] sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7B3A6C] dark:text-[#F391D3]">
                    Interview Topic
                  </label>
                  <input
                    value={node.interview?.topic || ''}
                    onChange={(event) =>
                      update(path, {
                        interview: {
                          topic: event.target.value,
                          description: node.interview?.description,
                        },
                      })
                    }
                    placeholder="e.g. React Fiber & Component Architecture"
                    className="mt-1 w-full rounded-lg border border-[#E8C5DE] bg-white px-3 py-2 text-xs outline-none focus:border-[#A0006D] dark:border-[#5A214D] dark:bg-[#1A1A1A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7B3A6C] dark:text-[#F391D3]">
                    Focus / Questions Evaluated
                  </label>
                  <input
                    value={node.interview?.description || ''}
                    onChange={(event) =>
                      update(path, {
                        interview: {
                          topic: node.interview?.topic || node.title,
                          description: event.target.value,
                        },
                      })
                    }
                    placeholder="e.g. State management trade-offs and performance"
                    className="mt-1 w-full rounded-lg border border-[#E8C5DE] bg-white px-3 py-2 text-xs outline-none focus:border-[#A0006D] dark:border-[#5A214D] dark:bg-[#1A1A1A] dark:text-white"
                  />
                </div>
                <p className="text-[11px] leading-5 text-[#7B3A6C] sm:col-span-2 dark:text-[#F391D3]">
                  Learners can launch a mock AI interview tailored to this exact checkpoint with real-time feedback.
                </p>
              </div>
            )}

            {node.children.length > 0 && (
              <div className="space-y-3 pt-2">
                {node.children.map((child, index) => (
                  <NodeEditor
                    key={`${child.id || 'draft'}-${index}`}
                    node={child}
                    path={[...path, index]}
                    update={update}
                    remove={remove}
                    addChild={addChild}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoadmapBuilderPage() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);
  const [mode, setMode] = useState<'ai' | 'manual'>(searchParams.get('mode') === 'ai' ? 'ai' : 'manual');

  // Form State
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('INTERMEDIATE');
  const [weeks, setWeeks] = useState(12);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [nodes, setNodes] = useState<DraftNode[]>([
    {
      title: 'Foundational Principles & Setup',
      description: 'Setup development workspace, learn core concepts, and build initial mini-exercises.',
      type: 'MILESTONE',
      order: 0,
      children: [],
    },
    {
      title: 'Applied Engineering & Core Projects',
      description: 'Implement real-world modules, handle edge cases, and integrate data layers.',
      type: 'MILESTONE',
      order: 1,
      children: [],
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // AI Prompt templates
  const samplePrompts = [
    {
      title: 'Full-Stack React & Next.js Engineer',
      role: 'Frontend Engineer',
      goal: 'Master React, Next.js App Router, TypeScript, and state architecture to land a high-paying frontend role.',
      level: 'INTERMEDIATE' as const,
      weeks: 12,
    },
    {
      title: 'AI & LLM Application Architect',
      role: 'AI Engineer',
      goal: 'Build generative AI apps with Python, RAG pipelines, Vector DBs, and autonomous multi-agent systems.',
      level: 'INTERMEDIATE' as const,
      weeks: 14,
    },
    {
      title: 'FAANG Technical Interview Readiness',
      role: 'Software Engineer',
      goal: 'Master high-frequency LeetCode patterns, system design scaling, and behavioral storytelling in 8 weeks.',
      level: 'ADVANCED' as const,
      weeks: 8,
    },
    {
      title: 'Cloud DevOps & Kubernetes Engineer',
      role: 'DevOps Engineer',
      goal: 'Learn Docker containerization, Kubernetes clusters, Terraform IaC, and resilient GitHub Actions CI/CD.',
      level: 'INTERMEDIATE' as const,
      weeks: 12,
    },
  ];

  const applySample = (sample: typeof samplePrompts[0]) => {
    setRole(sample.role);
    setGoal(sample.goal);
    setLevel(sample.level);
    setWeeks(sample.weeks);
    setTitle(sample.title);
  };

  const update = (path: number[], patch: Partial<DraftNode>) =>
    setNodes((current) => {
      const copy = structuredClone(current);
      let list = copy;
      const index = path[path.length - 1];
      for (const parentIndex of path.slice(0, -1)) list = list[parentIndex].children;
      list[index] = { ...list[index], ...patch };
      return copy;
    });

  const remove = (path: number[]) =>
    setNodes((current) => {
      const copy = structuredClone(current);
      if (path.length === 1) return copy.filter((_, index) => index !== path[0]);
      let list = copy;
      for (const parentIndex of path.slice(0, -2)) list = list[parentIndex].children;
      list[path[path.length - 2]].children.splice(path[path.length - 1], 1);
      return copy;
    });

  const addChild = (path: number[]) =>
    setNodes((current) => {
      const copy = structuredClone(current);
      let list = copy;
      for (const index of path) list = list[index].children;
      list.push(newNode());
      return copy;
    });

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (mode === 'ai') {
        if (!goal.trim()) {
          throw new Error('Please describe your target outcome or select a quick starter prompt.');
        }
        const roadmap = await roadmapApi.generate({
          goal: goal.trim(),
          role: role.trim() || undefined,
          level,
          weeks,
        });
        navigate(`/roadmap/${roadmap.id}`);
      } else {
        if (!title.trim()) {
          throw new Error('Please provide a title for your roadmap.');
        }
        const cleanNodes = nodes.filter((n) => n.title.trim());
        if (cleanNodes.length === 0) {
          throw new Error('Please add at least one milestone to your roadmap.');
        }
        const roadmap = await roadmapApi.create({
          title: title.trim(),
          description: goal.trim() || undefined,
          goal: goal.trim() || undefined,
          category: category.trim() || undefined,
          difficulty: level,
          estimatedWeeks: weeks || undefined,
          tags: tags
            ? tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : undefined,
          visibility: 'PRIVATE',
          nodes: cleanNodes,
        });
        navigate(`/roadmap/${roadmap.id}`);
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to create roadmap.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-full bg-[#F4F9FD] px-4 py-8 text-[#11183D] sm:px-6 lg:px-10 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation & Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate('/roadmap')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#526078] transition hover:text-[#2459A8] dark:text-[#A8A8A8] dark:hover:text-white"
          >
            <ArrowLeft size={15} /> Back to studio
          </button>

          <div className="flex rounded-xl border border-[#DCE7F2] bg-white p-1 shadow-sm dark:border-[#303030] dark:bg-[#1A1A1A]">
            <button
              onClick={() => setMode('ai')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                mode === 'ai'
                  ? 'bg-gradient-to-r from-[#2459A8] to-[#A0006D] text-white shadow-sm'
                  : 'text-[#526078] hover:text-[#11183D] dark:text-[#A8A8A8] dark:hover:text-white'
              }`}
            >
              <Sparkles size={13} />
              <span>AI Architect</span>
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                mode === 'manual'
                  ? 'bg-[#11183D] text-white shadow-sm dark:bg-white dark:text-[#11183D]'
                  : 'text-[#526078] hover:text-[#11183D] dark:text-[#A8A8A8] dark:hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>Manual Builder</span>
            </button>
          </div>
        </div>

        {/* Builder Container */}
        <div className="rounded-[2.5rem] border border-[#DCE7F2] bg-white p-6 shadow-sm sm:p-10 dark:border-[#262626] dark:bg-[#1A1A1A]">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[#F0F4F8] pb-6 dark:border-[#262626]">
            <div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A0006D] dark:text-[#F391D3]">
                {mode === 'ai' ? (
                  <>
                    <Wand2 size={13} /> AI Generative Studio
                  </>
                ) : (
                  <>
                    <Layers size={13} /> Custom Path Designer
                  </>
                )}
              </span>
              <h1 className="mt-2 font-display text-2xl font-black tracking-tight text-[#11183D] sm:text-3xl dark:text-white">
                {mode === 'ai'
                  ? 'Describe your goal. AI shapes the path.'
                  : 'Design your personal master roadmap.'}
              </h1>
              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
                {mode === 'ai'
                  ? 'Our AI engine breaks your career goal into milestone branches, practice deliverables, and mock interview checkpoints.'
                  : 'Add structured milestones, nest sub-tasks, and attach video interview practice checkpoints.'}
              </p>
            </div>

            <Button
              size="sm"
              variant={mode === 'ai' ? 'ai' : 'primary'}
              icon={
                saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : mode === 'ai' ? (
                  <Sparkles size={15} />
                ) : (
                  <Plus size={15} />
                )
              }
              onClick={() => void handleSave()}
              isLoading={saving}
              className="font-bold shadow-md"
            >
              {mode === 'ai' ? 'Generate roadmap' : 'Create roadmap'}
            </Button>
          </div>

          {/* Quick starter prompts for AI mode */}
          {mode === 'ai' && (
            <div className="mt-6 rounded-2xl bg-[#EFFAFD] p-4 dark:bg-[#202020]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2459A8] dark:text-[#93C5FD]">
                <Lightbulb size={15} />
                <span>Quick Starter Templates</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {samplePrompts.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applySample(s)}
                    className="rounded-xl border border-[#DCE7F2] bg-white px-3 py-1.5 text-[11px] font-bold text-[#11183D] shadow-sm transition hover:border-[#4A8BDF] hover:text-[#2459A8] dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-white dark:hover:text-[#93C5FD]"
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="mt-8 space-y-5">
            {mode === 'ai' ? (
              <>
                <div>
                  <label className="text-xs font-bold text-[#11183D] dark:text-white">
                    What outcome or career goal are you working toward? *
                  </label>
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. Master frontend architecture with Next.js and React Server Components, pass FAANG coding rounds, or transition into Senior AI engineering..."
                    rows={3}
                    className="mt-2 w-full resize-none rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] px-4 py-3 text-xs leading-5 outline-none transition focus:border-[#4A8BDF] focus:bg-white dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-bold text-[#11183D] dark:text-white">Target Role</label>
                    <input
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Fullstack Engineer"
                      className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3.5 py-2.5 text-xs outline-none transition focus:border-[#4A8BDF] focus:bg-white dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#11183D] dark:text-white">Current Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                      className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3.5 py-2.5 text-xs font-semibold outline-none transition focus:border-[#4A8BDF] focus:bg-white dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                    >
                      <option value="BEGINNER">Beginner (Foundations first)</option>
                      <option value="INTERMEDIATE">Intermediate (Practical build)</option>
                      <option value="ADVANCED">Advanced (Production scale)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#11183D] dark:text-white">Duration (Weeks)</label>
                    <select
                      value={weeks}
                      onChange={(e) => setWeeks(Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3.5 py-2.5 text-xs font-semibold outline-none transition focus:border-[#4A8BDF] focus:bg-white dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                    >
                      <option value={4}>4 Weeks (Sprint)</option>
                      <option value={8}>8 Weeks (Intensive)</option>
                      <option value={12}>12 Weeks (Recommended)</option>
                      <option value={16}>16 Weeks (Comprehensive)</option>
                      <option value={24}>24 Weeks (Mastery)</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#11183D] dark:text-white">Roadmap Title *</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Frontend Engineer Mastery 2026"
                      className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-4 py-2.5 text-xs outline-none transition focus:border-[#4A8BDF] focus:bg-white dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#11183D] dark:text-white">Primary Goal / Description</label>
                    <textarea
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="Describe what learners will achieve by completing this roadmap..."
                      rows={2}
                      className="mt-2 w-full resize-none rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-4 py-2.5 text-xs outline-none transition focus:border-[#4A8BDF] focus:bg-white dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#11183D] dark:text-white">Category</label>
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Frontend Engineering"
                      className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3.5 py-2.5 text-xs outline-none transition focus:border-[#4A8BDF] focus:bg-white dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#11183D] dark:text-white">Difficulty Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                      className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3.5 py-2.5 text-xs font-semibold outline-none transition focus:border-[#4A8BDF] focus:bg-white dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#11183D] dark:text-white">Estimated Duration (Weeks)</label>
                    <input
                      type="number"
                      min={1}
                      max={52}
                      value={weeks}
                      onChange={(e) => setWeeks(Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3.5 py-2.5 text-xs outline-none transition focus:border-[#4A8BDF] focus:bg-white dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#11183D] dark:text-white">Tags (Comma Separated)</label>
                    <input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="React, TypeScript, Next.js, Redux"
                      className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3.5 py-2.5 text-xs outline-none transition focus:border-[#4A8BDF] focus:bg-white dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                    />
                  </div>
                </div>

                {/* Milestones Hierarchy Section */}
                <section className="mt-8 space-y-4 border-t border-[#F0F4F8] pt-6 dark:border-[#262626]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-black text-[#11183D] dark:text-white">
                        Milestones & Branch Hierarchy
                      </h2>
                      <p className="text-xs text-[#526078] dark:text-[#A8A8A8]">
                        Build sequential milestones and nest sub-branches to any depth.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNodes((current) => [...current, newNode()])}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE7F2] bg-white px-3.5 py-2 text-xs font-bold text-[#2459A8] shadow-sm transition hover:bg-[#EFFAFD] dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-[#93C5FD]"
                    >
                      <Plus size={14} /> Add Milestone
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {nodes.map((node, index) => (
                      <NodeEditor
                        key={index}
                        node={node}
                        path={[index]}
                        update={update}
                        remove={remove}
                        addChild={addChild}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}

            {error && (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
