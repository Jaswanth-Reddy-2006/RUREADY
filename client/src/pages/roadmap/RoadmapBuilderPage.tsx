import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  GitBranch,
  Globe2,
  GraduationCap,
  GripVertical,
  History,
  Layers,
  Lightbulb,
  Link as LinkIcon,
  Loader2,
  Maximize2,
  Minus,
  Move,
  Plus,
  RotateCcw,
  RotateCw,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Undo2,
  Wand2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  roadmapApi,
  type GoalClarificationQuestion,
  type Roadmap,
  type RoadmapNode,
  type RoadmapNodeMetadata,
  type RoadmapNodeType,
  type RoadmapVersionItem,
} from '../../api/roadmap';
import Button from '../../components/ui/Button';

export default function RoadmapBuilderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialModeParam = searchParams.get('mode');
  const editIdParam = searchParams.get('id');

  // Progressive Wizard States: 'wizard-prompt' | 'wizard-clarify' | 'studio'
  const [activeWorkflow, setActiveWorkflow] = useState<'wizard-prompt' | 'wizard-clarify' | 'studio'>(
    editIdParam ? 'studio' : initialModeParam === 'blank' ? 'studio' : 'wizard-prompt'
  );

  // Roadmap Document State
  const [roadmapId, setRoadmapId] = useState<string | null>(editIdParam || null);
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const [title, setTitle] = useState('New Comprehensive Learning Roadmap');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [category, setCategory] = useState('Backend Systems');
  const [difficulty, setDifficulty] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('INTERMEDIATE');
  const [estimatedWeeks, setEstimatedWeeks] = useState(12);
  const [tags, setTags] = useState('Distributed Systems, Databases, System Design');
  const [isPublished, setIsPublished] = useState(false);
  const [license, setLicense] = useState('CC-BY-4.0');

  // Nodes (Hierarchical DAG)
  const [nodes, setNodes] = useState<RoadmapNode[]>([
    {
      id: 'node-1',
      title: '1. Foundations & Architecture Principles',
      description: 'Core design paradigms, asynchronous execution, and data flow modeling.',
      type: 'MODULE',
      position: 0,
      metadata: {
        estimatedHours: 16,
        whyLearnThis: 'Mastering runtime execution fundamentals prevents race conditions and cascading outages.',
        whatYouWillLearn: [
          'Concurrency primitives and non-blocking event loops',
          'Clean interface contracts and decoupling principles',
        ],
        whatToBuild: 'Build a thread-safe task worker pool with concurrency limits.',
        howToVerify: 'Pass an AI assessment evaluating asynchronous microtask ordering.',
        unlockedSkills: ['Predictable asynchronous execution', 'Modular software design'],
        resources: [
          { label: 'Official Architecture Specifications', url: 'https://docs.rennetus.org', type: 'DOC' },
        ],
        practicalTasks: [
          {
            id: 'task-1',
            title: 'Build an Async Task Worker Pool',
            instructions: 'Implement worker pool with concurrency limiter and retry backoff.',
          },
        ],
        prerequisiteNodeIds: [],
        assessmentRubric: {
          passingScore: 75,
          criteria: [
            { id: 'c-1', criterion: 'Conceptual Depth & Concurrency', weight: 50, description: 'Handles lock contention and deadlocks.' },
            { id: 'c-2', criterion: 'Production Resilience', weight: 50, description: 'Demonstrates handling of memory exhaustion.' },
          ],
        },
      },
    },
    {
      id: 'node-2',
      title: '2. Relational Schema Optimization & Indexing',
      description: 'High-throughput schema modeling, B-tree indexes, and transaction isolation.',
      type: 'MODULE',
      position: 1,
      metadata: {
        estimatedHours: 24,
        whyLearnThis: 'Database queries are the primary latency bottleneck in distributed systems.',
        whatYouWillLearn: [
          'B-tree indexing and query plan analysis with EXPLAIN ANALYZE',
          'ACID transaction isolation levels and deadlock prevention',
        ],
        whatToBuild: 'Benchmark 1,000,000 records bringing p99 query latency from 800ms down to sub-10ms.',
        howToVerify: 'Explain query plans and deadlock mitigation strategies in an AI Socratic assessment.',
        unlockedSkills: ['Sub-10ms database query optimization', 'Zero-anomaly transaction isolation'],
        resources: [
          { label: 'PostgreSQL Indexing Guide', url: 'https://www.postgresql.org/docs/current/indexes.html', type: 'DOC' },
        ],
        practicalTasks: [
          {
            id: 'task-2',
            title: 'High-Volume Schema Optimization',
            instructions: 'Write composite indexes to optimize high-throughput queries.',
          },
        ],
        prerequisiteNodeIds: ['node-1'],
        assessmentRubric: {
          passingScore: 80,
          criteria: [
            { id: 'c-3', criterion: 'Query Plan Interpretation', weight: 60, description: 'Accurately explains Seq Scan vs Index Scan.' },
            { id: 'c-4', criterion: 'Transaction Isolation', weight: 40, description: 'Explains phantom reads and locking.' },
          ],
        },
      },
    },
  ]);

  // Selected Node Index in Studio
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);

  // Undo / Redo History within editing session
  const [historyStack, setHistoryStack] = useState<RoadmapNode[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Autosave State
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'conflict' | 'error'>('saved');
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const lastSavedPayloadRef = useRef<string>('');
  const isInitialLoadRef = useRef(true);

  // Graph Layout / Canvas Viewport State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Mode Selection / Drawers
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [versionsList, setVersionsList] = useState<RoadmapVersionItem[]>([]);
  const [restoringVersion, setRestoringVersion] = useState(false);

  // Palette Search Filter
  const [paletteQuery, setPaletteQuery] = useState('');

  // Step A: Goal Wizard State
  const [wizardGoal, setWizardGoal] = useState('');
  const [wizardExp, setWizardExp] = useState('');
  const [wizardOutcome, setWizardOutcome] = useState('');
  const [wizardHours, setWizardHours] = useState(0);
  const [wizardClarificationQuestions, setWizardClarificationQuestions] = useState<GoalClarificationQuestion[]>([]);
  const [wizardAnswers, setWizardAnswers] = useState<Record<string, string>>({});
  const [isClarifying, setIsClarifying] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  // Mode B: Copilot Chat State
  const [copilotMessages, setCopilotMessages] = useState<
    Array<{
      sender: 'user' | 'assistant';
      text: string;
      diff?: { added: string[]; updated: string[]; removed: string[]; reordered: boolean };
    }>
  >([
    {
      sender: 'assistant',
      text: 'I am your Curriculum Copilot. You can tell me to add topics, reorder prerequisites, add capstone projects, adapt for beginners, or attach assessment rubrics.',
    },
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  // Cycle Detection Warning
  const [cycleWarning, setCycleWarning] = useState<string | null>(null);

  // Record history snapshot for undo/redo
  const recordHistory = useCallback(
    (newNodes: RoadmapNode[]) => {
      setHistoryStack((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        return [...next, structuredClone(newNodes)];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevNodes = historyStack[historyIndex - 1];
      setHistoryIndex((prev) => prev - 1);
      setNodes(structuredClone(prevNodes));
      setSaveStatus('unsaved');
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextNodes = historyStack[historyIndex + 1];
      setHistoryIndex((prev) => prev + 1);
      setNodes(structuredClone(nextNodes));
      setSaveStatus('unsaved');
    }
  };

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        void handleManualSave(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, historyStack]);

  // Load existing roadmap if editId provided
  useEffect(() => {
    if (editIdParam) {
      roadmapApi
        .get(editIdParam)
        .then((r) => {
          setTitle(r.title);
          setDescription(r.description || '');
          setGoal(r.goal || '');
          setCategory(r.category || 'Backend Systems');
          setDifficulty(r.difficulty || 'INTERMEDIATE');
          setEstimatedWeeks(r.estimatedWeeks || 12);
          setTags((r.tags || []).join(', '));
          setCurrentVersion(r.currentVersion || 1);
          setIsPublished(Boolean(r.isPublished || r.visibility === 'PUBLIC'));
          if (r.nodes && r.nodes.length > 0) {
            setNodes(r.nodes);
            recordHistory(r.nodes);
          }
          lastSavedPayloadRef.current = JSON.stringify({ title: r.title, nodes: r.nodes });
          setSaveStatus('saved');
        })
        .catch((err) => {
          console.error('Failed to load roadmap:', err);
        })
        .finally(() => {
          isInitialLoadRef.current = false;
        });
    } else {
      recordHistory(nodes);
      isInitialLoadRef.current = false;
    }
  }, [editIdParam]);

  // Cycle check helper
  const checkCycles = useCallback((currentNodes: RoadmapNode[]) => {
    const adj = new Map<string, string[]>();
    for (const n of currentNodes) {
      const id = n.id || n.title;
      const prereqs = n.metadata?.prerequisiteNodeIds || [];
      adj.set(id, prereqs);
    }
    const visited = new Set<string>();
    const rec = new Set<string>();

    const dfs = (curr: string): string[] | null => {
      visited.add(curr);
      rec.add(curr);
      for (const next of adj.get(curr) || []) {
        if (!visited.has(next)) {
          const res = dfs(next);
          if (res) return [curr, ...res];
        } else if (rec.has(next)) {
          return [curr, next];
        }
      }
      rec.delete(curr);
      return null;
    };

    for (const k of adj.keys()) {
      if (!visited.has(k)) {
        const cycle = dfs(k);
        if (cycle) {
          const names = cycle.map((id) => currentNodes.find((n) => n.id === id || n.title === id)?.title || id);
          return `Circular dependency detected: ${names.join(' → ')}`;
        }
      }
    }
    return null;
  }, []);

  // Run cycle check whenever nodes change
  useEffect(() => {
    const cycle = checkCycles(nodes);
    setCycleWarning(cycle);
  }, [nodes, checkCycles]);

  // Debounced Autosave Effect
  useEffect(() => {
    if (isInitialLoadRef.current || !roadmapId || isPreviewMode) return;

    const payloadStr = JSON.stringify({ title, description, goal, category, difficulty, estimatedWeeks, nodes });
    if (payloadStr === lastSavedPayloadRef.current) return;

    setSaveStatus('unsaved');
    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const res = await roadmapApi.saveDraft(roadmapId, {
          baseVersion: currentVersion,
          title,
          description,
          goal,
          category,
          difficulty,
          estimatedWeeks,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          nodes,
          createSnapshot: false,
        });

        if (res.conflict) {
          setSaveStatus('conflict');
          setSaveErrorMessage(res.message || 'Conflict: Roadmap was modified in another window.');
        } else {
          setCurrentVersion(res.version);
          lastSavedPayloadRef.current = payloadStr;
          setSaveStatus('saved');
        }
      } catch (err) {
        setSaveStatus('error');
        setSaveErrorMessage(err instanceof Error ? err.message : 'Autosave failed.');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, description, goal, category, difficulty, estimatedWeeks, tags, nodes, roadmapId, currentVersion, isPreviewMode]);

  // Manual Save Draft / Publish
  const handleManualSave = async (publish = false) => {
    setSaveStatus('saving');
    setSaveErrorMessage('');
    try {
      let activeId = roadmapId;
      if (!activeId) {
        const created = await roadmapApi.create({
          title: title.trim(),
          description: description.trim(),
          goal: goal.trim(),
          category: category.trim(),
          difficulty,
          estimatedWeeks,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          license,
          nodes,
        });
        activeId = created.id;
        setRoadmapId(created.id);
        setCurrentVersion(created.currentVersion || 1);
      } else {
        const res = await roadmapApi.saveDraft(activeId, {
          baseVersion: currentVersion,
          title: title.trim(),
          description: description.trim(),
          goal: goal.trim(),
          category: category.trim(),
          difficulty,
          estimatedWeeks,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          nodes,
          createSnapshot: true,
          changelog: publish ? 'Published to Community' : 'Manual snapshot saved',
        });

        if (res.conflict) {
          setSaveStatus('conflict');
          setSaveErrorMessage(res.message || 'Conflict detected.');
          return;
        }
        setCurrentVersion(res.version);
      }

      if (publish && activeId) {
        await roadmapApi.publish(activeId, license);
        setIsPublished(true);
      }

      lastSavedPayloadRef.current = JSON.stringify({ title, nodes });
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus('error');
      setSaveErrorMessage(err instanceof Error ? err.message : 'Save operation failed.');
    }
  };

  // Active selected node
  const activeNode = nodes[selectedNodeIndex] || nodes[0];

  const updateActiveNode = (patch: Partial<RoadmapNode>) => {
    setNodes((prev) => {
      const next = [...prev];
      next[selectedNodeIndex] = { ...next[selectedNodeIndex], ...patch };
      recordHistory(next);
      return next;
    });
  };

  const updateActiveNodeMetadata = (patch: Partial<RoadmapNodeMetadata>) => {
    setNodes((prev) => {
      const next = [...prev];
      const currentMeta = next[selectedNodeIndex]?.metadata || {};
      next[selectedNodeIndex] = {
        ...next[selectedNodeIndex],
        metadata: { ...currentMeta, ...patch },
      };
      recordHistory(next);
      return next;
    });
  };

  // Add node from palette
  const handleAddNodeFromPalette = (type: RoadmapNodeType) => {
    const id = `node_${Date.now()}`;
    const newNode: RoadmapNode = {
      id,
      title: `${type === 'PROJECT' ? 'Capstone Project' : type === 'ASSESSMENT' ? 'Skill Verification' : type === 'SECTION' ? 'Part ' + (nodes.length + 1) : 'New ' + type}`,
      description: 'Define clear learning outcomes and deliverable expectations.',
      type,
      position: nodes.length,
      metadata: {
        estimatedHours: type === 'PROJECT' ? 30 : type === 'ASSESSMENT' ? 4 : 15,
        whyLearnThis: 'Core foundation for technical depth and production execution.',
        whatYouWillLearn: ['Master essential concepts and trade-offs'],
        whatToBuild: 'Build and verify an applied exercise or test suite.',
        howToVerify: 'Pass an adaptive AI technical interview with rubric scoring.',
        unlockedSkills: ['Practical production capability'],
        resources: [{ label: 'Official Documentation', url: 'https://docs.rennetus.org', type: 'DOC' }],
        practicalTasks: [
          { id: `task_${Date.now()}`, title: 'Hands-on Implementation', instructions: 'Implement and test against edge cases.' },
        ],
        prerequisiteNodeIds: nodes.length > 0 ? [nodes[nodes.length - 1].id || ''] : [],
        assessmentRubric: {
          passingScore: 75,
          criteria: [{ id: `c_${Date.now()}`, criterion: 'Technical Execution', weight: 100, description: 'Demonstrates deep mastery.' }],
        },
      },
    };

    const nextNodes = [...nodes, newNode];
    setNodes(nextNodes);
    recordHistory(nextNodes);
    setSelectedNodeIndex(nodes.length);
  };

  const handleDeleteNode = (index: number) => {
    if (nodes.length <= 1) return;
    const deletedId = nodes[index]?.id;
    const filtered = nodes.filter((_, i) => i !== index);
    // Remove deleted node from all prerequisites
    const cleaned = filtered.map((n) => {
      const prereqs = (n.metadata?.prerequisiteNodeIds || []).filter((id) => id !== deletedId);
      return { ...n, metadata: { ...n.metadata, prerequisiteNodeIds: prereqs } };
    });
    setNodes(cleaned);
    recordHistory(cleaned);
    setSelectedNodeIndex(Math.max(0, index - 1));
  };

  // Step A: Wizard Start - Clarify Goal
  const handleWizardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardGoal.trim()) return;
    setIsClarifying(true);

    try {
      const res = await roadmapApi.clarifyGoal({
        goal: wizardGoal.trim(),
        experience: wizardExp || undefined,
        targetOutcome: wizardOutcome || undefined,
        weeklyHours: wizardHours > 0 ? wizardHours : undefined,
        previousAnswers: wizardAnswers,
      });

      if (res.isReady || res.questions.length === 0) {
        // Direct generation
        await handleGenerateFromWizard(res.questions.length === 0 ? {} : wizardAnswers);
      } else {
        setWizardClarificationQuestions(res.questions);
        setActiveWorkflow('wizard-clarify');
      }
    } catch (err) {
      console.error('Clarification error:', err);
      // Fallback straight to generation
      await handleGenerateFromWizard({});
    } finally {
      setIsClarifying(false);
    }
  };

  // Step C: Wizard Generate
  const handleGenerateFromWizard = async (answers: Record<string, string>) => {
    setIsGeneratingDraft(true);
    try {
      const generated = await roadmapApi.generate({
        goal: wizardGoal.trim(),
        weeks: wizardHours > 12 ? 8 : 12,
        clarificationAnswers: answers,
      });

      setTitle(generated.title);
      setDescription(generated.description || '');
      setGoal(generated.goal || wizardGoal);
      setCategory(generated.category || 'Backend Systems');
      setDifficulty(generated.difficulty || 'INTERMEDIATE');
      setEstimatedWeeks(generated.estimatedWeeks || 12);
      setTags((generated.tags || []).join(', '));
      if (generated.nodes && generated.nodes.length > 0) {
        setNodes(generated.nodes);
        recordHistory(generated.nodes);
      }
      setRoadmapId(generated.id);
      setCurrentVersion(generated.currentVersion || 1);
      lastSavedPayloadRef.current = JSON.stringify({ title: generated.title, nodes: generated.nodes });
      setSaveStatus('saved');
      setActiveWorkflow('studio');
      navigate(`/roadmap/create?id=${generated.id}`, { replace: true });
    } catch (err) {
      console.error('Draft generation error:', err);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  // Mode B: Copilot Targeted Patch
  const handleCopilotSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim() || isCopilotThinking) return;

    const userMsg = copilotInput.trim();
    setCopilotMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setCopilotInput('');
    setIsCopilotThinking(true);

    try {
      let activeId = roadmapId;
      if (!activeId) {
        const saved = await roadmapApi.create({
          title,
          description,
          category,
          difficulty,
          estimatedWeeks,
          nodes,
        });
        activeId = saved.id;
        setRoadmapId(saved.id);
        setCurrentVersion(saved.currentVersion || 1);
      }

      const patch = await roadmapApi.applyPatch(activeId, userMsg, nodes);
      if (patch.roadmap?.nodes) {
        setNodes(patch.roadmap.nodes);
        recordHistory(patch.roadmap.nodes);
        setCurrentVersion(patch.roadmap.currentVersion || currentVersion + 1);
        lastSavedPayloadRef.current = JSON.stringify({ title, nodes: patch.roadmap.nodes });
        setSaveStatus('saved');
      }

      setCopilotMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: patch.summary || 'Applied validated patch to roadmap.',
          diff: patch.diff,
        },
      ]);
    } catch (err) {
      setCopilotMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: err instanceof Error ? `Failed to apply edit: ${err.message}` : 'AI editing failed.',
        },
      ]);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  // Open Version History Drawer
  const handleOpenVersionHistory = async () => {
    if (!roadmapId) return;
    setIsHistoryOpen(true);
    try {
      const list = await roadmapApi.getVersions(roadmapId);
      setVersionsList(list);
    } catch (err) {
      console.error('Failed to load version history:', err);
    }
  };

  // Restore Version Snapshot
  const handleRestoreVersion = async (ver: number) => {
    if (!roadmapId || restoringVersion) return;
    setRestoringVersion(true);
    try {
      const restored = await roadmapApi.restoreVersion(roadmapId, ver);
      setTitle(restored.title);
      setDescription(restored.description || '');
      setNodes(restored.nodes || []);
      recordHistory(restored.nodes || []);
      setCurrentVersion(restored.currentVersion || ver);
      setIsHistoryOpen(false);
      setSaveStatus('saved');
    } catch (err) {
      console.error('Version restoration error:', err);
    } finally {
      setRestoringVersion(false);
    }
  };

  // Palette Node Types Definition
  const paletteNodeTypes: Array<{ type: RoadmapNodeType; label: string; desc: string; icon: any; color: string }> = [
    { type: 'MODULE', label: 'Learning Module', desc: 'Core topic covering key principles', icon: BookOpen, color: 'text-[#2459A8] bg-[#EFFAFD]' },
    { type: 'LESSON', label: 'Deep-Dive Lesson', desc: 'Detailed concepts and theory', icon: FileText, color: 'text-sky-600 bg-sky-50' },
    { type: 'EXERCISE', label: 'Practical Exercise', desc: 'Hands-on practice task', icon: Code2, color: 'text-amber-600 bg-amber-50' },
    { type: 'PROJECT', label: 'Capstone Project', desc: 'End-to-end portfolio deliverable', icon: Target, color: 'text-purple-600 bg-purple-50' },
    { type: 'ASSESSMENT', label: 'AI Verification', desc: 'Rubric-based competency check', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-50' },
    { type: 'SECTION', label: 'Milestone Section', desc: 'Stage separator or grouping', icon: Layers, color: 'text-indigo-600 bg-indigo-50' },
    { type: 'RESOURCE', label: 'Reference Docs', desc: 'Official documentation and links', icon: LinkIcon, color: 'text-slate-600 bg-slate-100' },
  ];

  const filteredPalette = paletteNodeTypes.filter(
    (p) => p.label.toLowerCase().includes(paletteQuery.toLowerCase()) || p.desc.toLowerCase().includes(paletteQuery.toLowerCase())
  );

  return (
    <main className="min-h-full bg-[#F4F9FD] text-[#11183D] transition-colors dark:bg-black dark:text-white">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* VIEW: PROGRESSIVE CREATION WIZARD (STEPS A & B) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeWorkflow === 'wizard-prompt' && (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="flex items-center justify-between border-b border-[#E1EAF4] pb-4 dark:border-[#262626]">
            <button
              onClick={() => navigate('/roadmap')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#526078] hover:text-[#2459A8] dark:text-[#A8A8A8]"
            >
              <ArrowLeft size={15} /> Back to Hub
            </button>
            <span className="flex items-center gap-1.5 rounded-lg bg-[#2459A8]/10 px-3 py-1 text-xs font-bold text-[#2459A8] dark:bg-white/10 dark:text-white">
              <Sparkles size={13} /> Step 1: Describe Your Learning Goal
            </span>
          </div>

          <div className="mt-8 rounded-3xl border border-[#DCE7F2] bg-white p-8 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
            <h1 className="font-display text-2xl font-black text-[#11183D] sm:text-3xl dark:text-white">
              What do you want to learn or become?
            </h1>
            <p className="mt-2 text-xs text-[#526078] dark:text-[#A8A8A8]">
              Describe your target career outcome in natural language. Our AI curriculum copilot will clarify missing details and synthesize a production-grade syllabus.
            </p>

            {/* Quick Starters */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                'Become a job-ready backend engineer',
                'Master DSA for product-company interviews',
                'Learn AI engineering from fundamentals to deployment',
                'Become a senior frontend engineer',
                'Prepare for high-scale system design interviews',
              ].map((starter) => (
                <button
                  key={starter}
                  onClick={() => setWizardGoal(starter)}
                  className="rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3 py-1.5 text-[11px] font-semibold text-[#526078] transition hover:border-[#2459A8] hover:text-[#2459A8] dark:border-[#303030] dark:bg-[#202020] dark:text-[#A8A8A8]"
                >
                  {starter}
                </button>
              ))}
            </div>

            <form onSubmit={handleWizardSubmit} className="mt-6 space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7B8799]">
                  Primary Goal or Learning Target
                </label>
                <textarea
                  rows={4}
                  value={wizardGoal}
                  onChange={(e) => setWizardGoal(e.target.value)}
                  placeholder="e.g. Master distributed event architectures with Kafka, Redis caching, and zero-downtime database migrations to crack Staff Engineer rounds..."
                  className="mt-1.5 w-full rounded-2xl border border-[#E1EAF4] bg-[#F8FAFC] p-4 text-xs font-medium outline-none transition focus:border-[#4A8BDF] focus:bg-white dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                />
              </div>

              {/* Optional Quick Settings */}
              <div className="grid gap-4 rounded-2xl border border-[#E1EAF4] bg-[#F8FAFC] p-4 sm:grid-cols-3 dark:border-[#303030] dark:bg-[#202020]">
                <div>
                  <label className="text-[11px] font-bold text-[#11183D] dark:text-white">Current Experience</label>
                  <select
                    value={wizardExp}
                    onChange={(e) => setWizardExp(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#DCE7F2] bg-white px-2.5 py-1.5 text-xs outline-none dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-white"
                  >
                    <option value="">Select level (optional)...</option>
                    <option value="Beginner">Beginner (starting from scratch)</option>
                    <option value="Intermediate">Intermediate (comfortable with basics)</option>
                    <option value="Experienced">Experienced (looking for Senior/Staff depth)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#11183D] dark:text-white">Primary Milestone</label>
                  <select
                    value={wizardOutcome}
                    onChange={(e) => setWizardOutcome(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#DCE7F2] bg-white px-2.5 py-1.5 text-xs outline-none dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-white"
                  >
                    <option value="">Select outcome (optional)...</option>
                    <option value="Job Readiness">Job Readiness & Practical Depth</option>
                    <option value="Interview Prep">Interview Preparation (FAANG / Product)</option>
                    <option value="Production Projects">Building Production Capstones</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#11183D] dark:text-white">Weekly Time Commitment</label>
                  <select
                    value={wizardHours}
                    onChange={(e) => setWizardHours(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#DCE7F2] bg-white px-2.5 py-1.5 text-xs outline-none dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-white"
                  >
                    <option value={0}>Select hours (optional)...</option>
                    <option value={6}>4-6 hrs/week (Part-time)</option>
                    <option value={8}>8-12 hrs/week (Accelerated)</option>
                    <option value={15}>15+ hrs/week (Bootcamp pace)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveWorkflow('studio')}
                  className="text-xs font-bold text-[#7B8799] hover:text-[#11183D] dark:hover:text-white"
                >
                  Skip AI — Open Blank Studio
                </button>

                <Button
                  type="submit"
                  size="sm"
                  variant="ai"
                  icon={isClarifying ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  disabled={isClarifying || !wizardGoal.trim()}
                  className="font-bold shadow"
                >
                  {isClarifying ? 'Analyzing Goal...' : 'Continue with AI Copilot'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* VIEW: STEP B — AI CLARIFICATION QUESTIONS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeWorkflow === 'wizard-clarify' && (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="flex items-center justify-between border-b border-[#E1EAF4] pb-4 dark:border-[#262626]">
            <button
              onClick={() => setActiveWorkflow('wizard-prompt')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#526078] hover:text-[#2459A8] dark:text-[#A8A8A8]"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <span className="flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
              <Bot size={13} /> Step 2: Clarifying Your Roadmap Requirements
            </span>
          </div>

          <div className="mt-8 rounded-3xl border border-[#DCE7F2] bg-white p-8 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
            <h2 className="font-display text-xl font-black text-[#11183D] dark:text-white">
              Targeted Curriculum Questions
            </h2>
            <p className="mt-1 text-xs text-[#526078] dark:text-[#A8A8A8]">
              Answering these quick questions ensures the generated curriculum matches your exact prerequisites and priorities.
            </p>

            <div className="mt-6 space-y-6">
              {wizardClarificationQuestions.map((q) => (
                <div key={q.id} className="rounded-2xl border border-[#E1EAF4] bg-[#F8FAFC] p-4 dark:border-[#303030] dark:bg-[#202020]">
                  <h3 className="text-xs font-black text-[#11183D] dark:text-white">{q.question}</h3>
                  <p className="mt-1 text-[11px] text-[#7B8799]">{q.reason}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {q.options.map((opt) => {
                      const isSelected = wizardAnswers[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setWizardAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                          className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                            isSelected
                              ? 'bg-[#11183D] text-white shadow dark:bg-white dark:text-[#11183D]'
                              : 'border border-[#DCE7F2] bg-white text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-[#A8A8A8]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => void handleGenerateFromWizard({})}
                className="text-xs font-bold text-[#7B8799] hover:underline"
              >
                Skip Questions & Generate Draft
              </button>

              <Button
                size="sm"
                variant="ai"
                icon={isGeneratingDraft ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                disabled={isGeneratingDraft}
                onClick={() => void handleGenerateFromWizard(wizardAnswers)}
                className="font-bold shadow"
              >
                {isGeneratingDraft ? 'Synthesizing Roadmap...' : 'Generate Structured Draft'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* VIEW: PRODUCTION 3-PANEL VISUAL STUDIO (STEP C) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeWorkflow === 'studio' && (
        <div className="flex h-screen flex-col overflow-hidden">
          {/* Top Control Bar */}
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#E1EAF4] bg-white px-4 dark:border-[#262626] dark:bg-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/roadmap')}
                className="rounded-xl border border-[#DCE7F2] p-1.5 text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:text-[#A8A8A8]"
                title="Back to Roadmaps"
              >
                <ArrowLeft size={16} />
              </button>

              <div className="flex items-center gap-2">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Roadmap title..."
                  className="w-64 bg-transparent font-display text-sm font-black text-[#11183D] outline-none transition focus:border-b focus:border-[#2459A8] sm:w-80 dark:text-white"
                />
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
                  v{currentVersion}
                </span>
                {isPublished ? (
                  <span className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Globe2 size={11} /> Published
                  </span>
                ) : (
                  <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    Draft
                  </span>
                )}
              </div>
            </div>

            {/* Center: Save Status Indicator */}
            <div className="hidden items-center gap-2 text-xs font-semibold sm:flex">
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-1.5 text-[#2459A8]">
                  <Loader2 size={13} className="animate-spin" />
                  <span>Saving...</span>
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 size={13} />
                  <span>All changes saved</span>
                </span>
              )}
              {saveStatus === 'unsaved' && (
                <span className="flex items-center gap-1 text-amber-600">
                  <Clock size={13} />
                  <span>Unsaved edits</span>
                </span>
              )}
              {saveStatus === 'conflict' && (
                <span className="flex items-center gap-1 text-rose-600" title={saveErrorMessage}>
                  <AlertCircle size={13} />
                  <span>Revision conflict!</span>
                </span>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Undo / Redo */}
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="rounded-lg p-1.5 text-[#526078] hover:bg-slate-100 disabled:opacity-30 dark:text-[#A8A8A8]"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={15} />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= historyStack.length - 1}
                className="rounded-lg p-1.5 text-[#526078] hover:bg-slate-100 disabled:opacity-30 dark:text-[#A8A8A8]"
                title="Redo (Ctrl+Y)"
              >
                <RotateCw size={15} />
              </button>

              {/* Version History Drawer */}
              <button
                onClick={() => void handleOpenVersionHistory()}
                className="flex items-center gap-1 rounded-xl border border-[#DCE7F2] px-2.5 py-1.5 text-xs font-bold text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:text-[#A8A8A8]"
                title="Version History Snapshots"
              >
                <History size={13} />
                <span className="hidden md:inline">History</span>
              </button>

              {/* Preview Toggle */}
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition ${
                  isPreviewMode
                    ? 'border-[#2459A8] bg-[#EFFAFD] text-[#2459A8]'
                    : 'border-[#DCE7F2] text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:text-[#A8A8A8]'
                }`}
              >
                <Eye size={13} />
                <span className="hidden md:inline">{isPreviewMode ? 'Visual Studio' : 'Preview'}</span>
              </button>

              {/* AI Copilot Drawer */}
              <button
                onClick={() => setIsCopilotOpen(!isCopilotOpen)}
                className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition ${
                  isCopilotOpen
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-[#DCE7F2] text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:text-[#A8A8A8]'
                }`}
              >
                <Bot size={13} />
                <span className="hidden md:inline">AI Copilot</span>
              </button>

              {/* Manual Save & Publish */}
              <button
                onClick={() => void handleManualSave(false)}
                className="rounded-xl border border-[#DCE7F2] bg-white px-3 py-1.5 text-xs font-bold text-[#11183D] shadow-sm hover:bg-slate-50 dark:border-[#303030] dark:bg-[#202020] dark:text-white"
              >
                Save
              </button>

              <button
                onClick={() => void handleManualSave(true)}
                className="inline-flex items-center gap-1 rounded-xl bg-[#2459A8] px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-[#1c4786]"
              >
                <Globe2 size={13} />
                <span>Publish</span>
              </button>
            </div>
          </header>

          {/* Cycle Warning Banner */}
          {cycleWarning && (
            <div className="flex items-center justify-between bg-amber-500 px-4 py-1.5 text-xs font-bold text-white shadow-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} />
                <span>{cycleWarning}</span>
              </div>
              <button onClick={() => setCycleWarning(null)} className="text-white hover:opacity-80">
                <X size={14} />
              </button>
            </div>
          )}

          {/* 3-PANEL BODY */}
          <div className="relative flex flex-1 overflow-hidden">
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* PANEL 1: LEFT COMPONENT PALETTE & OUTLINE (260px) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <aside aria-label="Component Palette & Roadmap Outline" className={`${isPreviewMode ? 'hidden' : 'hidden lg:flex'} w-64 shrink-0 flex-col border-r border-[#E1EAF4] bg-white dark:border-[#262626] dark:bg-[#1A1A1A]`}>
              <div className="border-b border-[#E1EAF4] p-3 dark:border-[#262626]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                  Node Palette
                </span>
                <div className="relative mt-2">
                  <Search size={13} className="absolute left-2.5 top-2.5 text-[#7B8799]" />
                  <input
                    value={paletteQuery}
                    onChange={(e) => setPaletteQuery(e.target.value)}
                    placeholder="Search node types..."
                    className="w-full rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] py-1.5 pl-8 pr-2.5 text-xs outline-none focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                  />
                </div>
              </div>

              {/* Palette Node Type Cards */}
              <div className="space-y-1.5 overflow-y-auto p-3">
                {filteredPalette.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.type}
                      onClick={() => handleAddNodeFromPalette(p.type)}
                      className="group flex w-full items-center justify-between rounded-xl border border-transparent p-2 text-left transition hover:border-[#DCE7F2] hover:bg-[#F8FAFC] dark:hover:border-[#303030] dark:hover:bg-[#202020]"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs ${p.color}`}>
                          <Icon size={13} />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-[#11183D] dark:text-white">{p.label}</p>
                          <p className="text-[10px] text-[#7B8799] line-clamp-1">{p.desc}</p>
                        </div>
                      </div>
                      <Plus size={13} className="text-[#7B8799] opacity-0 group-hover:opacity-100" />
                    </button>
                  );
                })}
              </div>

              {/* Outline Tree Header */}
              <div className="border-t border-[#E1EAF4] p-3 dark:border-[#262626]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                  Roadmap Outline ({nodes.length})
                </span>
              </div>

              {/* Outline Tree List */}
              <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
                {nodes.map((node, index) => {
                  const isSelected = index === selectedNodeIndex;
                  return (
                    <div
                      key={node.id || index}
                      onClick={() => setSelectedNodeIndex(index)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl p-2 text-xs transition ${
                        isSelected
                          ? 'bg-[#2459A8]/10 font-bold text-[#2459A8] dark:bg-white/10 dark:text-white'
                          : 'text-[#526078] hover:bg-[#F8FAFC] dark:text-[#A8A8A8] dark:hover:bg-[#202020]'
                      }`}
                    >
                      <span className="truncate">{node.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(index);
                        }}
                        className="rounded p-1 text-slate-400 opacity-0 hover:text-rose-600 group-hover:opacity-100"
                        title="Delete node"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* PANEL 2: CENTER GRAPH CANVAS WITH PAN & ZOOM */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <main
              ref={canvasRef}
              onMouseDown={(e) => {
                if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'svg') {
                  setIsPanning(true);
                  setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
                }
              }}
              onMouseMove={(e) => {
                if (isPanning) {
                  setPanOffset({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
                }
              }}
              onMouseUp={() => setIsPanning(false)}
              onMouseLeave={() => setIsPanning(false)}
              className="relative flex-1 cursor-grab overflow-hidden bg-[#F4F9FD] p-6 active:cursor-grabbing dark:bg-black"
            >
              {/* Canvas Controls: Zoom & Fit */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 rounded-2xl border border-[#DCE7F2] bg-white p-1.5 shadow-md dark:border-[#303030] dark:bg-[#1A1A1A]">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2, z + 0.15))}
                  className="rounded-lg p-1.5 text-[#526078] hover:bg-slate-100 dark:text-[#A8A8A8]"
                  title="Zoom In"
                >
                  <ZoomIn size={15} />
                </button>
                <span className="font-mono text-[11px] font-bold text-[#526078] px-1 dark:text-[#A8A8A8]">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.4, z - 0.15))}
                  className="rounded-lg p-1.5 text-[#526078] hover:bg-slate-100 dark:text-[#A8A8A8]"
                  title="Zoom Out"
                >
                  <ZoomOut size={15} />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setPanOffset({ x: 0, y: 0 });
                  }}
                  className="rounded-lg p-1.5 text-[#526078] hover:bg-slate-100 dark:text-[#A8A8A8]"
                  title="Reset View"
                >
                  <Maximize2 size={15} />
                </button>
              </div>

              {/* Connected Roadmap Graph Container */}
              <div
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                  transformOrigin: '0 0',
                }}
                className="relative min-h-[800px] w-full transition-transform duration-75"
              >
                {/* SVG Prerequisite Arrow Connections */}
                <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                  <defs>
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#2459A8" />
                    </marker>
                  </defs>

                  {/* Draw prerequisite arrows between modules */}
                  {nodes.map((node, i) => {
                    const prereqs = node.metadata?.prerequisiteNodeIds || [];
                    return prereqs.map((prereqId) => {
                      const sourceIndex = nodes.findIndex((n) => n.id === prereqId || n.title === prereqId);
                      if (sourceIndex === -1) return null;

                      // Source card center
                      const sourceY = sourceIndex * 140 + 60;
                      const targetY = i * 140 + 60;

                      return (
                        <path
                          key={`${prereqId}-${node.id || i}`}
                          d={`M 320 ${sourceY} C 400 ${sourceY}, 400 ${targetY}, 320 ${targetY}`}
                          fill="none"
                          stroke="#2459A8"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                          markerEnd="url(#arrow)"
                        />
                      );
                    });
                  })}
                </svg>

                {/* Graph Node Cards Stack */}
                <div className="space-y-6" style={{ width: '420px' }}>
                  {nodes.map((node, index) => {
                    const isSelected = index === selectedNodeIndex;
                    const prereqs = node.metadata?.prerequisiteNodeIds || [];

                    return (
                      <div
                        key={node.id || index}
                        onClick={() => setSelectedNodeIndex(index)}
                        className={`group relative rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-[#1A1A1A] ${
                          isSelected
                            ? 'border-[#2459A8] ring-2 ring-[#2459A8]/30 dark:border-[#4A8BDF]'
                            : 'border-[#DCE7F2] dark:border-[#262626]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2459A8] text-xs font-black text-white">
                              {index + 1}
                            </span>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                {node.type || 'MODULE'}
                              </span>
                              <h3 className="text-sm font-black text-[#11183D] dark:text-white">
                                {node.title}
                              </h3>
                            </div>
                          </div>

                          <span className="rounded-lg bg-[#EFFAFD] px-2 py-0.5 text-[10px] font-bold text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]">
                            {node.metadata?.estimatedHours || 10}h
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-2 text-xs text-[#526078] dark:text-[#A8A8A8]">
                          {node.description || 'No description provided.'}
                        </p>

                        {/* Badges / Metrics */}
                        <div className="mt-3 flex flex-wrap items-center gap-2 pt-1 text-[10px] text-[#7B8799]">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 size={11} className="text-emerald-600" />
                            {node.metadata?.learningObjectives?.length || 0} objectives
                          </span>
                          <span>·</span>
                          <span>{node.metadata?.practicalTasks?.length || 0} tasks</span>
                          {node.metadata?.assessmentRubric && (
                            <>
                              <span>·</span>
                              <span className="text-purple-600 dark:text-purple-400 font-bold">
                                Rubric Active ({node.metadata.assessmentRubric.passingScore}%)
                              </span>
                            </>
                          )}
                        </div>

                        {/* Prerequisite Tags */}
                        {prereqs.length > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                            <LinkIcon size={10} />
                            <span>Requires completion of {prereqs.length} prerequisite(s)</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </main>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* PANEL 3: RIGHT PROPERTIES INSPECTOR (7 HUMAN QUESTIONS) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <aside aria-label="Module Properties Inspector" className={`${isPreviewMode ? 'hidden' : 'hidden lg:flex'} w-96 shrink-0 flex-col overflow-y-auto border-l border-[#E1EAF4] bg-white p-5 dark:border-[#262626] dark:bg-[#1A1A1A]`}>
              {activeNode && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[#E1EAF4] pb-3 dark:border-[#262626]">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                        Selected Node Properties
                      </span>
                      <h2 className="text-sm font-black text-[#11183D] dark:text-white">
                        Module {selectedNodeIndex + 1} Inspector
                      </h2>
                    </div>

                    <select
                      value={activeNode.type || 'MODULE'}
                      onChange={(e) => updateActiveNode({ type: e.target.value as RoadmapNodeType })}
                      className="rounded-lg border border-[#DCE7F2] bg-[#F8FAFC] px-2 py-1 text-xs font-bold outline-none dark:border-[#303030] dark:bg-[#202020]"
                    >
                      <option value="MODULE">Module</option>
                      <option value="LESSON">Lesson</option>
                      <option value="EXERCISE">Exercise</option>
                      <option value="PROJECT">Project</option>
                      <option value="ASSESSMENT">Assessment</option>
                      <option value="SECTION">Section</option>
                      <option value="RESOURCE">Resource</option>
                    </select>
                  </div>

                  {/* Title & Hours */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                        Module Title
                      </label>
                      <input
                        value={activeNode.title}
                        onChange={(e) => updateActiveNode({ title: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-2 text-xs font-bold outline-none focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                        Estimated Effort Hours
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={activeNode.metadata?.estimatedHours || 10}
                        onChange={(e) => updateActiveNodeMetadata({ estimatedHours: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-2 text-xs font-bold outline-none dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                      />
                    </div>
                  </div>

                  {/* 1. WHY AM I LEARNING THIS? */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                      1. Why am I learning this? (Value Rationale)
                    </label>
                    <textarea
                      rows={2}
                      value={activeNode.metadata?.whyLearnThis || ''}
                      onChange={(e) => updateActiveNodeMetadata({ whyLearnThis: e.target.value })}
                      placeholder="Explain why this concept matters in production engineering..."
                      className="mt-1 w-full rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-2.5 text-xs outline-none focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                    />
                  </div>

                  {/* 2. WHAT SHOULD I KNOW BEFORE STARTING? (Prerequisites) */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                      2. Prerequisites (Connected Dependencies)
                    </label>
                    <div className="mt-1 space-y-1">
                      {nodes
                        .filter((_, i) => i !== selectedNodeIndex)
                        .map((n) => {
                          const isPrereq = (activeNode.metadata?.prerequisiteNodeIds || []).includes(n.id || n.title);
                          return (
                            <label key={n.id || n.title} className="flex items-center gap-2 rounded-lg p-1.5 text-xs hover:bg-slate-50 dark:hover:bg-[#202020]">
                              <input
                                type="checkbox"
                                checked={isPrereq}
                                data-prereq-title={n.title}
                                data-prereq-id={n.id}
                                onChange={(e) => {
                                  const currentPrereqs = activeNode.metadata?.prerequisiteNodeIds || [];
                                  const targetId = n.id || n.title;
                                  const nextPrereqs = e.target.checked
                                    ? [...currentPrereqs, targetId]
                                    : currentPrereqs.filter((id) => id !== targetId);
                                  updateActiveNodeMetadata({ prerequisiteNodeIds: nextPrereqs });
                                }}
                                className="accent-[#2459A8]"
                              />
                              <span className="truncate">{n.title}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>

                  {/* 3. WHAT EXACTLY DO I NEED TO LEARN? */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                        3. What to Learn (Objectives)
                      </label>
                      <button
                        onClick={() => {
                          const cur = activeNode.metadata?.learningObjectives || [];
                          updateActiveNodeMetadata({ learningObjectives: [...cur, 'New learning objective'] });
                        }}
                        className="text-[10px] font-bold text-[#2459A8] hover:underline"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="mt-1.5 space-y-1.5">
                      {(activeNode.metadata?.learningObjectives || []).map((obj, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <input
                            value={obj}
                            onChange={(e) => {
                              const next = [...(activeNode.metadata?.learningObjectives || [])];
                              next[idx] = e.target.value;
                              updateActiveNodeMetadata({ learningObjectives: next });
                            }}
                            className="w-full rounded-lg border border-[#E1EAF4] bg-[#F8FAFC] p-1.5 text-xs outline-none dark:border-[#303030] dark:bg-[#202020]"
                          />
                          <button
                            onClick={() => {
                              const next = (activeNode.metadata?.learningObjectives || []).filter((_, i) => i !== idx);
                              updateActiveNodeMetadata({ learningObjectives: next });
                            }}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. WHAT SHOULD I BUILD OR PRACTICE? */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                      4. What to Build or Practice
                    </label>
                    <textarea
                      rows={2}
                      value={activeNode.metadata?.whatToBuild || ''}
                      onChange={(e) => updateActiveNodeMetadata({ whatToBuild: e.target.value })}
                      placeholder="Hands-on deliverable or micro-project..."
                      className="mt-1 w-full rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-2.5 text-xs outline-none dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                    />
                  </div>

                  {/* 5. HOW WILL I KNOW I UNDERSTAND IT? (Rubric) */}
                  <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-3.5 dark:border-purple-900/40 dark:bg-purple-950/20">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
                        5. How to Verify (Rubric Criteria)
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={activeNode.metadata?.assessmentRubric?.passingScore || 75}
                        onChange={(e) => {
                          const curRub = activeNode.metadata?.assessmentRubric || { passingScore: 75, criteria: [] };
                          updateActiveNodeMetadata({ assessmentRubric: { ...curRub, passingScore: Number(e.target.value) } });
                        }}
                        className="w-12 rounded border border-purple-300 px-1 text-xs font-bold dark:bg-[#1A1A1A]"
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-purple-700 dark:text-purple-300">
                      Criteria evaluated during the adaptive AI assessment.
                    </p>
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* COLLAPSIBLE AI COPILOT SIDE DRAWER (MODE B) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {isCopilotOpen && (
            <aside aria-label="AI Curriculum Copilot Drawer" className="fixed bottom-4 right-4 z-50 flex h-[580px] w-96 flex-col rounded-3xl border border-[#DCE7F2] bg-white shadow-2xl dark:border-[#303030] dark:bg-[#1A1A1A]">
              <div className="flex items-center justify-between border-b border-[#E1EAF4] p-4 dark:border-[#262626]">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                    <Bot size={16} />
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-[#11183D] dark:text-white">Curriculum Copilot</h3>
                    <p className="text-[10px] text-[#7B8799]">Targeted surgical roadmap edits</p>
                  </div>
                </div>
                <button onClick={() => setIsCopilotOpen(false)} className="text-[#7B8799] hover:text-black dark:hover:text-white">
                  <X size={16} />
                </button>
              </div>

              {/* Quick Prompt Ideas */}
              <div className="flex flex-wrap gap-1 border-b border-[#E1EAF4] p-2 dark:border-[#262626]">
                {['Add a Docker module', 'Add a production project', 'Reduce to 8 weeks', 'Make suitable for beginner'].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => setCopilotInput(cmd)}
                    className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {cmd}
                  </button>
                ))}
              </div>

              {/* Chat Message History */}
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {copilotMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-5 ${
                        msg.sender === 'user'
                          ? 'bg-[#11183D] text-white dark:bg-white dark:text-[#11183D]'
                          : 'border border-[#E1EAF4] bg-[#F8FAFC] text-[#11183D] dark:border-[#303030] dark:bg-[#202020] dark:text-white'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.diff && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {msg.diff.added.map((a, i) => (
                          <span key={i} className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            + Added: {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isCopilotThinking && (
                  <div className="flex items-center gap-2 text-xs text-[#7B8799]">
                    <Loader2 size={13} className="animate-spin text-purple-600" />
                    <span>Applying validated changes to roadmap...</span>
                  </div>
                )}
              </div>

              {/* Copilot Input */}
              <form onSubmit={handleCopilotSend} className="border-t border-[#E1EAF4] p-3 dark:border-[#262626]">
                <div className="relative">
                  <input
                    value={copilotInput}
                    onChange={(e) => setCopilotInput(e.target.value)}
                    placeholder="e.g. Move SQL before ORM concepts and add Redis project..."
                    className="w-full rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] py-2 pl-3 pr-9 text-xs outline-none focus:border-purple-500 dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!copilotInput.trim() || isCopilotThinking}
                    className="absolute right-2 top-2 text-purple-600 hover:text-purple-800 disabled:opacity-40"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </form>
            </aside>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* VERSION HISTORY DRAWER */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {isHistoryOpen && (
            <aside aria-label="Version History Snapshots" className="fixed bottom-4 right-4 z-50 flex h-[500px] w-80 flex-col rounded-3xl border border-[#DCE7F2] bg-white shadow-2xl dark:border-[#303030] dark:bg-[#1A1A1A]">
              <div className="flex items-center justify-between border-b border-[#E1EAF4] p-4 dark:border-[#262626]">
                <div className="flex items-center gap-2">
                  <History size={16} className="text-[#2459A8]" />
                  <h3 className="text-xs font-black text-[#11183D] dark:text-white">Revision Snapshots</h3>
                </div>
                <button onClick={() => setIsHistoryOpen(false)}>
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {versionsList.length === 0 ? (
                  <p className="text-xs text-[#7B8799]">No snapshots recorded yet. Click 'Save' to create a revision snapshot.</p>
                ) : (
                  versionsList.map((ver) => (
                    <div key={ver.id} className="rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-3 dark:border-[#303030] dark:bg-[#202020]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#11183D] dark:text-white">v{ver.version}</span>
                        <span className="text-[10px] text-[#7B8799]">
                          {new Date(ver.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#526078] dark:text-[#A8A8A8]">{ver.changelog || 'Saved revision'}</p>
                      <button
                        disabled={restoringVersion || ver.version === currentVersion}
                        onClick={() => void handleRestoreVersion(ver.version)}
                        className="mt-2 text-[10px] font-bold text-[#2459A8] hover:underline disabled:opacity-30 dark:text-[#93C5FD]"
                      >
                        {ver.version === currentVersion ? 'Current Revision' : 'Restore this version'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </aside>
          )}
        </div>
      )}
    </main>
  );
}
