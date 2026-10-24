import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Compass,
  ExternalLink,
  Flame,
  FolderGit2,
  GitFork,
  GraduationCap,
  Heart,
  HelpCircle,
  Layers,
  Lightbulb,
  Link as LinkIcon,
  Loader2,
  Lock,
  MessageSquare,
  Play,
  Plus,
  RefreshCw,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Target,
  Terminal,
  ThumbsUp,
  Users,
  Video,
  X,
} from 'lucide-react';
import {
  roadmapApi,
  type AssessmentQuestion,
  type AssessmentResult,
  type MasteryStatus,
  type Roadmap,
  type RoadmapDiscussion,
  type RoadmapNode,
  type RoadmapReview,
  type DeliverableType,
  type RoadmapSubmission,
  type DeliverableEvaluationResult,
  type DiagnosticQuestion,
  type DiagnosticRecommendation,
  type DiagnosticEvaluationResult,
  type CompanionMode,
  type CompanionResponse,
  type LearningCircle,
  type LearningCircleMember,
  type NextActionPlan,
} from '../../api/roadmap';
import Button from '../../components/ui/Button';

export default function RoadmapWorkspacePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected Module for Study & Assessment
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    'missions' | 'content' | 'tasks' | 'discussions' | 'reviews' | 'circles'
  >('missions');

  // Next Action State
  const [nextAction, setNextAction] = useState<NextActionPlan | null>(null);
  const [loadingNextAction, setLoadingNextAction] = useState(false);

  // Learner Progress State
  const [nodeProgress, setNodeProgress] = useState<
    Record<string, { status: string; percent: number; masteryStatus: MasteryStatus; score?: number }>
  >({});
  const [activePace, setActivePace] = useState(6);

  // Deliverables State
  const [submissions, setSubmissions] = useState<RoadmapSubmission[]>([]);
  const [deliverableType, setDeliverableType] = useState<DeliverableType>('REPOSITORY');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [deliverableText, setDeliverableText] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('typescript');
  const [submittingDeliverable, setSubmittingDeliverable] = useState(false);
  const [deliverableEvaluation, setDeliverableEvaluation] = useState<DeliverableEvaluationResult | null>(null);
  const [deliverableError, setDeliverableError] = useState('');

  // Diagnostic State
  const [diagnosticModalOpen, setDiagnosticModalOpen] = useState(false);
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<DiagnosticQuestion[]>([]);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<string, number>>({});
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticEvaluationResult | null>(null);
  const [diagnosticSubmitting, setDiagnosticSubmitting] = useState(false);
  const [diagnosticError, setDiagnosticError] = useState('');

  // AI Learning Companion State
  const [companionDrawerOpen, setCompanionDrawerOpen] = useState(false);
  const [companionMode, setCompanionMode] = useState<CompanionMode>('SOCRATIC_HINT');
  const [companionInput, setCompanionInput] = useState('');
  const [companionLoading, setCompanionLoading] = useState(false);
  const [companionMessages, setCompanionMessages] = useState<
    Array<{
      role: 'user' | 'assistant';
      text: string;
      mode?: CompanionMode;
      prompts?: string[];
      concept?: string;
      action?: string;
    }>
  >([]);

  // Learning Circles State
  const [circles, setCircles] = useState<LearningCircle[]>([]);
  const [loadingCircles, setLoadingCircles] = useState(false);
  const [createCircleModalOpen, setCreateCircleModalOpen] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleDesc, setNewCircleDesc] = useState('');
  const [newCircleHours, setNewCircleHours] = useState(8);
  const [newCircleTargetDate, setNewCircleTargetDate] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joiningCircle, setJoiningCircle] = useState(false);
  const [circleActionMessage, setCircleActionMessage] = useState('');

  // Reviews State
  const [reviews, setReviews] = useState<RoadmapReview[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Discussions State
  const [discussions, setDiscussions] = useState<RoadmapDiscussion[]>([]);
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const [submittingDiscussion, setSubmittingDiscussion] = useState(false);

  // AI Verification Modal State (Standard Q&A assessment)
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[]>([]);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({});
  const [assessmentSubmitting, setAssessmentSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [assessmentError, setAssessmentError] = useState('');

  // Follow State
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  // Helpers to refresh data
  const fetchNextAction = async () => {
    if (!id) return;
    try {
      setLoadingNextAction(true);
      const action = await roadmapApi.getNextAction(id);
      setNextAction(action);
    } catch (e) {
      console.error('Failed to load next action:', e);
    } finally {
      setLoadingNextAction(false);
    }
  };

  const fetchSubmissions = async (nodeId: string) => {
    if (!id || !nodeId) return;
    try {
      const list = await roadmapApi.getNodeSubmissions(id, nodeId);
      setSubmissions(list);
    } catch (e) {
      console.error('Failed to load node submissions:', e);
    }
  };

  const fetchCircles = async () => {
    if (!id) return;
    try {
      setLoadingCircles(true);
      const list = await roadmapApi.getCircles(id);
      setCircles(list);
    } catch (e) {
      console.error('Failed to load circles:', e);
    } finally {
      setLoadingCircles(false);
    }
  };

  // Load Roadmap & Associated Data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');

    Promise.all([
      roadmapApi.get(id),
      roadmapApi.getProgress(id).catch(() => []),
      roadmapApi.getReviews(id).catch(() => []),
      roadmapApi.getDiscussions(id).catch(() => []),
      roadmapApi.getNextAction(id).catch(() => null),
      roadmapApi.getCircles(id).catch(() => []),
    ])
      .then(([loadedRoadmap, progressList, loadedReviews, loadedDiscussions, loadedNextAction, loadedCircles]) => {
        setRoadmap(loadedRoadmap);
        setIsFollowing(Boolean(loadedRoadmap.isFollowing));
        setFollowerCount(loadedRoadmap.followerCount || 0);
        setReviews(loadedReviews);
        setDiscussions(loadedDiscussions);
        setNextAction(loadedNextAction);
        setCircles(loadedCircles);

        // Check if diagnostic overrides exist on instance
        const diagOverrides = (loadedRoadmap.activeInstance as any)?.customOverrides?.diagnostic;
        if (diagOverrides) {
          setDiagnosticResult(diagOverrides);
        }

        // Map progress
        const progMap: Record<
          string,
          { status: string; percent: number; masteryStatus: MasteryStatus; score?: number }
        > = {};
        for (const p of progressList) {
          progMap[p.nodeId] = {
            status: p.status,
            percent: p.percent,
            masteryStatus: p.masteryStatus || (p.percent === 100 ? 'LEARNING_COMPLETE' : 'IN_PROGRESS'),
          };
        }
        setNodeProgress(progMap);

        // Load initial module submissions
        if (loadedRoadmap.nodes && loadedRoadmap.nodes.length > 0) {
          const firstNodeId = loadedRoadmap.nodes[0].id;
          if (firstNodeId) {
            void fetchSubmissions(firstNodeId);
          }
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unable to load roadmap.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const nodes = roadmap?.nodes || [];
  const activeNode = nodes[selectedNodeIndex] || nodes[0];
  const activeNodeId = activeNode?.id || `node-${selectedNodeIndex}`;
  const currentNodeProgress = nodeProgress[activeNodeId] || {
    status: 'TODO',
    percent: 0,
    masteryStatus: 'NOT_STARTED',
  };

  // When active node changes, refresh submissions
  useEffect(() => {
    if (activeNode?.id) {
      void fetchSubmissions(activeNode.id);
      setDeliverableEvaluation(null);
      setDeliverableError('');
    }
  }, [selectedNodeIndex, activeNode?.id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F9FD] p-8 dark:bg-black">
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-[#DCE7F2] bg-white p-10 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
          <Loader2 size={30} className="animate-spin text-[#2459A8]" />
          <p className="text-xs font-semibold text-[#526078] dark:text-[#A8A8A8]">
            Loading interactive learning workspace...
          </p>
        </div>
      </main>
    );
  }

  if (error || !roadmap) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F9FD] p-8 dark:bg-black">
        <div className="mx-auto max-w-lg rounded-3xl border border-[#DCE7F2] bg-white p-8 text-center shadow-md dark:border-[#262626] dark:bg-[#1A1A1A]">
          <AlertCircle size={32} className="mx-auto text-rose-500" />
          <h2 className="mt-3 text-base font-bold text-rose-600 dark:text-rose-400">
            {error || 'Roadmap not found.'}
          </h2>
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

  // Follow Toggle
  const handleToggleFollow = async () => {
    try {
      const res = await roadmapApi.toggleFollow(roadmap.id);
      setIsFollowing(res.following);
      setFollowerCount(res.followerCount);
    } catch (err) {
      console.error('Follow toggle error:', err);
    }
  };

  // Toggle Module Learning Completion (Checkmark)
  const handleToggleModuleComplete = async () => {
    if (!activeNode?.id) return;
    const isDone = currentNodeProgress.percent === 100;
    const nextPercent = isDone ? 0 : 100;
    const nextMastery: MasteryStatus = isDone
      ? 'IN_PROGRESS'
      : currentNodeProgress.masteryStatus === 'MASTERED' || currentNodeProgress.masteryStatus === 'ASSESSMENT_PASSED'
      ? currentNodeProgress.masteryStatus
      : 'LEARNING_COMPLETE';

    try {
      await roadmapApi.updateProgress(roadmap.id, activeNode.id, nextPercent, undefined, nextMastery);
      setNodeProgress((prev) => ({
        ...prev,
        [activeNode.id as string]: {
          status: nextPercent === 100 ? 'DONE' : 'IN_PROGRESS',
          percent: nextPercent,
          masteryStatus: nextMastery,
        },
      }));
      void fetchNextAction();
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  // Submit Practical Deliverable
  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNode?.id) return;
    setSubmittingDeliverable(true);
    setDeliverableError('');
    setDeliverableEvaluation(null);

    try {
      const res = await roadmapApi.submitDeliverable(roadmap.id, activeNode.id, {
        deliverableType,
        deliverableUrl: deliverableUrl.trim() || undefined,
        deliverableText: deliverableText.trim() || undefined,
        codeLanguage,
      });

      setDeliverableEvaluation(res.evaluation);
      setSubmissions((prev) => [res.submission, ...prev]);

      const passed = res.evaluation.status === 'PASSED';
      setNodeProgress((prev) => ({
        ...prev,
        [activeNode.id as string]: {
          status: passed ? 'DONE' : 'IN_PROGRESS',
          percent: passed ? 100 : 75,
          masteryStatus: passed ? 'ASSESSMENT_PASSED' : 'IN_PROGRESS',
          score: res.evaluation.rubricScore,
        },
      }));

      void fetchNextAction();
      setDeliverableUrl('');
      setDeliverableText('');
    } catch (err: any) {
      setDeliverableError(err?.message || 'Deliverable submission failed.');
    } finally {
      setSubmittingDeliverable(false);
    }
  };

  // Diagnostic Assessment Flow
  const handleOpenDiagnostic = async () => {
    setDiagnosticModalOpen(true);
    setDiagnosticLoading(true);
    setDiagnosticError('');
    setDiagnosticAnswers({});

    try {
      const res = await roadmapApi.getDiagnostic(roadmap.id);
      setDiagnosticQuestions(res.questions);
    } catch (err: any) {
      setDiagnosticError(err?.message || 'Unable to load diagnostic questions.');
    } finally {
      setDiagnosticLoading(false);
    }
  };

  const handleSubmitDiagnostic = async () => {
    setDiagnosticSubmitting(true);
    setDiagnosticError('');

    try {
      const result = await roadmapApi.evaluateDiagnostic(roadmap.id, diagnosticAnswers);
      setDiagnosticResult(result);
      void fetchNextAction();
    } catch (err: any) {
      setDiagnosticError(err?.message || 'Failed to evaluate diagnostic.');
    } finally {
      setDiagnosticSubmitting(false);
    }
  };

  // AI Learning Companion Chat Flow
  const handleSendCompanionMessage = async (msgToSend?: string) => {
    const text = msgToSend || companionInput;
    if (!text.trim() || companionLoading || !activeNode?.id) return;

    const userMsg = { role: 'user' as const, text };
    setCompanionMessages((prev) => [...prev, userMsg]);
    setCompanionInput('');
    setCompanionLoading(true);

    try {
      const res = await roadmapApi.chatCompanion(roadmap.id, activeNode.id, {
        message: text,
        mode: companionMode,
      });

      const assistantMsg = {
        role: 'assistant' as const,
        text: res.reply,
        mode: res.mode,
        prompts: res.suggestedPrompts,
        concept: res.keyConceptSummary,
        action: res.recommendedAction,
      };
      setCompanionMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setCompanionMessages((prev) => [
        ...prev,
        {
          role: 'assistant' as const,
          text: 'Sorry, I encountered an issue generating a companion response. Please try again.',
        },
      ]);
    } finally {
      setCompanionLoading(false);
    }
  };

  // Learning Circles Creation & Joining
  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName.trim()) return;

    try {
      const created = await roadmapApi.createCircle(roadmap.id, {
        name: newCircleName.trim(),
        description: newCircleDesc.trim() || undefined,
        weeklyGoalHours: newCircleHours,
        targetDate: newCircleTargetDate || undefined,
      });
      setCircles((prev) => [created, ...prev]);
      setCreateCircleModalOpen(false);
      setNewCircleName('');
      setNewCircleDesc('');
      setCircleActionMessage(`Learning circle "${created.name}" created! Join code: ${created.joinCode}`);
    } catch (err: any) {
      setCircleActionMessage(err?.message || 'Failed to create learning circle.');
    }
  };

  const handleJoinCircle = async () => {
    if (!joinCodeInput.trim() || joiningCircle) return;
    setJoiningCircle(true);
    setCircleActionMessage('');
    try {
      await roadmapApi.joinCircle(roadmap.id, { joinCode: joinCodeInput.trim().toUpperCase() });
      setJoinCodeInput('');
      setCircleActionMessage('Successfully joined the learning circle cohort!');
      void fetchCircles();
    } catch (err: any) {
      setCircleActionMessage(err?.message || 'Invalid or expired invite code.');
    } finally {
      setJoiningCircle(false);
    }
  };

  // Open Standard AI Assessment Modal
  const handleOpenAssessment = async () => {
    if (!activeNode?.id) return;
    setAssessmentModalOpen(true);
    setAssessmentLoading(true);
    setAssessmentError('');
    setAssessmentResult(null);
    setAssessmentAnswers({});

    try {
      const res = await roadmapApi.getAssessmentQuestions(roadmap.id, activeNode.id);
      setAssessmentQuestions(res.questions);
    } catch (err: any) {
      setAssessmentError(err?.message || 'Unable to load assessment questions.');
    } finally {
      setAssessmentLoading(false);
    }
  };

  // Submit Standard AI Assessment
  const handleSubmitAssessment = async () => {
    if (!activeNode?.id) return;
    setAssessmentSubmitting(true);
    setAssessmentError('');

    const formattedAnswers = Object.entries(assessmentAnswers).map(([questionId, answerText]) => ({
      questionId,
      answerText,
    }));

    if (formattedAnswers.length === 0) {
      setAssessmentError('Please provide answers to the questions before submitting for evaluation.');
      setAssessmentSubmitting(false);
      return;
    }

    try {
      const result = await roadmapApi.submitAssessment(roadmap.id, activeNode.id, formattedAnswers);
      setAssessmentResult(result);

      setNodeProgress((prev) => ({
        ...prev,
        [activeNode.id as string]: {
          status: 'DONE',
          percent: 100,
          masteryStatus: result.masteryStatus,
          score: result.score,
        },
      }));
      void fetchNextAction();
    } catch (err: any) {
      setAssessmentError(err?.message || 'Assessment evaluation failed.');
    } finally {
      setAssessmentSubmitting(false);
    }
  };

  // Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim() || submittingReview) return;
    setSubmittingReview(true);
    try {
      const created = await roadmapApi.addReview(roadmap.id, {
        rating: newRating,
        reviewText: newReviewText.trim(),
      });
      setReviews((prev) => [created, ...prev]);
      setNewReviewText('');
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Submit Discussion
  const handleSubmitDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscussionContent.trim() || submittingDiscussion) return;
    setSubmittingDiscussion(true);
    try {
      const created = await roadmapApi.addDiscussion(roadmap.id, {
        nodeId: activeNode?.id,
        content: newDiscussionContent.trim(),
      });
      setDiscussions((prev) => [created, ...prev]);
      setNewDiscussionContent('');
    } catch (err) {
      console.error('Failed to submit discussion:', err);
    } finally {
      setSubmittingDiscussion(false);
    }
  };

  // Mastery Status Styling Helper
  const getMasteryBadge = (status: MasteryStatus) => {
    switch (status) {
      case 'MASTERED':
        return (
          <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-black text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
            <Sparkles size={11} /> Mastered
          </span>
        );
      case 'ASSESSMENT_PASSED':
        return (
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 size={11} /> Verified Passed
          </span>
        );
      case 'NEEDS_IMPROVEMENT':
        return (
          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <RefreshCw size={11} /> Needs Review
          </span>
        );
      case 'LEARNING_COMPLETE':
        return (
          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-black text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <Check size={11} /> Learning Complete
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
            <Clock size={11} /> In Progress
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-neutral-800 dark:text-neutral-400">
            Not Started
          </span>
        );
    }
  };

  // Diagnostic Path Recommendation Badge
  const getDiagnosticBadge = (nodeId?: string) => {
    if (!diagnosticResult || !nodeId) return null;
    const rec = diagnosticResult.recommendations.find((r) => r.nodeId === nodeId);
    if (!rec) return null;

    if (rec.action === 'SKIP') {
      return (
        <span
          title={rec.reason}
          className="flex items-center gap-1 rounded-full bg-emerald-100/90 px-2 py-0.5 text-[9px] font-black text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
        >
          ⏭️ Skip (Mastered)
        </span>
      );
    }
    if (rec.action === 'REVIEW') {
      return (
        <span
          title={rec.reason}
          className="flex items-center gap-1 rounded-full bg-amber-100/90 px-2 py-0.5 text-[9px] font-black text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
        >
          ⚠️ Gap Focus
        </span>
      );
    }
    return null;
  };

  const totalMastered = Object.values(nodeProgress).filter(
    (p) => p.masteryStatus === 'MASTERED' || p.masteryStatus === 'ASSESSMENT_PASSED'
  ).length;

  const totalHours = nodes.reduce((sum, n) => sum + (Number(n.metadata?.estimatedHours) || 8), 0);
  const completedHours = nodes
    .filter((n) => nodeProgress[n.id || '']?.percent === 100)
    .reduce((sum, n) => sum + (Number(n.metadata?.estimatedHours) || 8), 0);
  const remainingHours = Math.max(0, totalHours - completedHours);
  const estimatedWeeksRemaining = Math.max(1, Math.ceil(remainingHours / Math.max(1, activePace)));

  const prerequisiteNodes = (activeNode?.metadata?.prerequisiteNodeIds || [])
    .map((pId) => nodes.find((n) => n.id === pId))
    .filter((n): n is RoadmapNode => Boolean(n));

  const allPrerequisitesMet = prerequisiteNodes.every(
    (pn) => (nodeProgress[pn.id || '']?.percent ?? 0) === 100
  );

  return (
    <main className="min-h-full bg-[#F4F9FD] px-4 py-6 text-[#11183D] transition-colors sm:px-6 lg:px-8 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-[1450px] space-y-6">
        {/* Navigation & Header Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#526078] hover:text-[#2459A8] dark:text-[#A8A8A8] dark:hover:text-white"
          >
            <ArrowLeft size={15} /> Back to Roadmaps
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => void handleOpenDiagnostic()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50/70 px-3.5 py-1.5 text-xs font-bold text-purple-700 transition hover:bg-purple-100 dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-300"
            >
              <Compass size={13} />
              <span>Skill Diagnostic</span>
            </button>

            <button
              onClick={() => setCompanionDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#2459A8]/30 bg-[#2459A8] px-3.5 py-1.5 text-xs font-bold text-white shadow transition hover:bg-[#1C4786]"
            >
              <Bot size={13} />
              <span>AI Learning Companion</span>
            </button>

            <button
              onClick={() => void handleToggleFollow()}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition ${
                isFollowing
                  ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/30'
                  : 'border-[#DCE7F2] bg-white text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-[#A8A8A8]'
              }`}
            >
              <Heart size={13} className={isFollowing ? 'fill-rose-600' : ''} />
              <span>{isFollowing ? 'Following' : 'Follow'} ({followerCount})</span>
            </button>

            <button
              onClick={() => navigate(`/roadmap/create?id=${roadmap.id}`)}
              className="rounded-xl border border-[#DCE7F2] bg-white px-3.5 py-1.5 text-xs font-bold text-[#11183D] hover:bg-slate-50 dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-white"
            >
              Open in Studio
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ROADMAP HERO & CONTRIBUTOR CREDENTIAL CARD */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="rounded-3xl border border-[#DCE7F2] bg-white p-6 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {roadmap.isEndorsed && (
                  <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    <Award size={13} />
                    <span>Officially Endorsed</span>
                  </span>
                )}
                <span className="rounded-lg bg-[#EFFAFD] px-2.5 py-0.5 text-[11px] font-bold text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]">
                  {roadmap.category || 'Engineering'}
                </span>
                <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-[#262626] dark:text-neutral-300">
                  {roadmap.difficulty || 'All Levels'}
                </span>
                <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-neutral-800 dark:text-neutral-400">
                  {roadmap.license || 'CC-BY-4.0'}
                </span>
              </div>

              <h1 className="font-display text-2xl font-black text-[#11183D] sm:text-3xl dark:text-white">
                {roadmap.title}
              </h1>
              <p className="text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
                {roadmap.description || roadmap.goal}
              </p>

              {/* Creator Attribution */}
              <div className="mt-3 flex flex-wrap items-center gap-4 pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2459A8] text-[10px] font-black text-white">
                    {(roadmap.creatorName || 'Rennetus')[0]}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[#11183D] dark:text-white">
                      {roadmap.creatorName || 'Rennetus Community Architect'}
                    </span>
                    {roadmap.isVerifiedCreator && (
                      <span title="Verified Contributor Identity" className="text-[#2459A8] dark:text-[#93C5FD]">
                        <ShieldCheck size={14} />
                      </span>
                    )}
                  </div>
                  {roadmap.creatorRole && (
                    <span className="text-[#7B8799]">
                      ({roadmap.creatorRole}{roadmap.creatorCompany ? ` @ ${roadmap.creatorCompany}` : ''})
                    </span>
                  )}
                </div>

                {roadmap.forkedFrom && (
                  <div className="flex items-center gap-1 text-[11px] text-purple-700 dark:text-purple-400">
                    <GitFork size={12} />
                    <span>Forked from {roadmap.forkedFrom.title}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Learner Progress & Pacing Box */}
            <div className="w-full sm:w-80 rounded-2xl border border-[#E1EAF4] bg-[#F8FAFC] p-4 dark:border-[#303030] dark:bg-[#202020]">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#526078] dark:text-[#A8A8A8]">Demonstrated Mastery</span>
                <span className="font-mono text-[#2459A8] dark:text-[#93C5FD]">
                  {totalMastered} / {nodes.length} ({nodes.length > 0 ? Math.round((totalMastered / nodes.length) * 100) : 0}%)
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4A8BDF] to-emerald-500 transition-all duration-300"
                  style={{ width: `${nodes.length > 0 ? (totalMastered / nodes.length) * 100 : 0}%` }}
                />
              </div>

              {/* Interactive Study Pace Slider & Timeline Projection */}
              <div className="mt-3.5 space-y-1.5 border-t border-[#E1EAF4] pt-2.5 dark:border-[#303030]">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-[#7B8799]">
                    <Clock size={12} /> Study Pace:
                  </span>
                  <span className="font-mono font-bold text-[#11183D] dark:text-white">
                    {activePace} hrs / week
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={35}
                  step={1}
                  value={activePace}
                  onChange={(e) => setActivePace(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-[#2459A8] dark:bg-neutral-700"
                />
                <div className="flex items-center justify-between text-[10px] text-[#7B8799]">
                  <span>{remainingHours}h remaining</span>
                  <span className="font-semibold text-[#2459A8] dark:text-[#93C5FD]">
                    ~{estimatedWeeksRemaining} {estimatedWeeksRemaining === 1 ? 'week' : 'weeks'} to completion
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* DYNAMIC "YOUR NEXT ACTION" HERO BANNER (PILLAR 1 & 2) */}
        {/* Answers the 3 Core Questions: What to do now, Why it matters, How to prove it */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {nextAction && (
          <section className="relative overflow-hidden rounded-3xl border border-[#2459A8]/40 bg-gradient-to-br from-[#0B1528] via-[#122244] to-[#0A1324] p-6 text-white shadow-xl">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#2459A8]/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-blue-300 ring-1 ring-blue-400/30">
                    <Target size={13} className="text-blue-400" />
                    Your Next Action
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[11px] text-neutral-300">
                    {nextAction.actionType.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-neutral-400">
                    <Clock size={13} />
                    Est. {nextAction.estimatedHours} hrs
                  </span>
                  <button
                    onClick={() => void handleOpenDiagnostic()}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-500/20 px-3 py-1.5 text-xs font-bold text-purple-300 ring-1 ring-purple-400/30 transition hover:bg-purple-500/30"
                  >
                    <Compass size={13} />
                    <span>Calibrate Path</span>
                  </button>
                  <button
                    onClick={() => setCompanionDrawerOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#2459A8] px-3.5 py-1.5 text-xs font-bold text-white shadow transition hover:bg-[#1E4B8F]"
                  >
                    <Bot size={14} />
                    <span>AI Companion</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white sm:text-2xl">
                  {nextAction.nodeTitle ? `${nextAction.nodeIndex + 1}. ${nextAction.nodeTitle}` : 'Milestone Objective'}
                </h3>
              </div>

              {/* 3 Core Decision Questions */}
              <div className="grid gap-3 sm:grid-cols-3">
                {/* 1. What to do now */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                    1. What To Do Now
                  </span>
                  <p className="mt-1.5 text-xs font-semibold leading-5 text-neutral-200">
                    {nextAction.whatToDoNow}
                  </p>
                </div>

                {/* 2. Why it matters */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    2. Why It Matters
                  </span>
                  <p className="mt-1.5 text-xs font-medium leading-5 text-neutral-300">
                    {nextAction.whyItMatters}
                  </p>
                </div>

                {/* 3. How to prove it */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    3. How To Prove It
                  </span>
                  <p className="mt-1.5 text-xs font-medium leading-5 text-neutral-300">
                    {nextAction.howToProveIt}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-neutral-400">
                  Ready to demonstrate mastery? Submit practical evidence below or request Socratic guidance.
                </p>
                <button
                  onClick={() => {
                    if (nextAction.nodeIndex >= 0 && nextAction.nodeIndex < nodes.length) {
                      setSelectedNodeIndex(nextAction.nodeIndex);
                      setActiveTab('missions');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-black text-[#0B1528] shadow transition hover:bg-neutral-100"
                >
                  <Play size={13} className="fill-[#0B1528]" />
                  <span>Jump to Module Mission</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* WORKSPACE MAIN BODY: MODULE TREE + ACTIVE MODULE WORKSPACE */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left 4 Cols: Module Syllabus / Navigation DAG */}
          <div className="space-y-3 lg:col-span-4">
            <div className="flex items-center justify-between rounded-2xl border border-[#DCE7F2] bg-white p-3.5 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#2459A8] dark:text-[#93C5FD]" />
                <span className="text-xs font-black text-[#11183D] dark:text-white">
                  Curriculum Modules ({nodes.length})
                </span>
              </div>
              {diagnosticResult && (
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                  Diagnostic Applied
                </span>
              )}
            </div>

            <div className="space-y-2">
              {nodes.map((node, index) => {
                const isSelected = index === selectedNodeIndex;
                const prog = nodeProgress[node.id || `node-${index}`] || {
                  status: 'TODO',
                  percent: 0,
                  masteryStatus: 'NOT_STARTED',
                };
                const diagBadge = getDiagnosticBadge(node.id);

                return (
                  <div
                    key={node.id || index}
                    onClick={() => setSelectedNodeIndex(index)}
                    className={`cursor-pointer rounded-2xl border p-3.5 transition ${
                      isSelected
                        ? 'border-[#2459A8] bg-white shadow-md ring-2 ring-[#2459A8]/20 dark:border-[#4A8BDF] dark:bg-[#202020]'
                        : 'border-[#DCE7F2] bg-white hover:border-slate-300 dark:border-[#262626] dark:bg-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#EFFAFD] text-[10px] font-black text-[#2459A8] dark:bg-[#262626] dark:text-[#93C5FD]">
                          {index + 1}
                        </span>
                        <h4 className="text-xs font-black text-[#11183D] dark:text-white">
                          {node.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {diagBadge}
                        {getMasteryBadge(prog.masteryStatus)}
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#7B8799]">
                      <span>{node.metadata?.estimatedHours || 10} hours</span>
                      <span className="flex items-center gap-1">
                        {prog.percent === 100 ? (
                          <span className="text-emerald-600 font-bold">Complete</span>
                        ) : (
                          <span>{prog.percent}%</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 8 Cols: Active Module Study Desk & AI Verification */}
          <div className="space-y-5 lg:col-span-8">
            {activeNode && (
              <div className="rounded-3xl border border-[#DCE7F2] bg-white p-6 shadow-sm dark:border-[#262626] dark:bg-[#1A1A1A]">
                {/* Active Module Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E1EAF4] pb-4 dark:border-[#262626]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                        Module {selectedNodeIndex + 1}
                      </span>
                      {getMasteryBadge(currentNodeProgress.masteryStatus)}
                    </div>
                    <h2 className="mt-1 text-xl font-black text-[#11183D] dark:text-white">
                      {activeNode.title}
                    </h2>
                    <p className="mt-1 text-xs text-[#526078] dark:text-[#A8A8A8]">
                      {activeNode.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Mark Learning Completed Button */}
                    <button
                      onClick={() => void handleToggleModuleComplete()}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                        currentNodeProgress.percent === 100
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'border-[#DCE7F2] bg-white text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:bg-[#202020] dark:text-[#A8A8A8]'
                      }`}
                    >
                      <CheckCircle2 size={14} className={currentNodeProgress.percent === 100 ? 'text-emerald-600' : ''} />
                      <span>{currentNodeProgress.percent === 100 ? 'Learning Complete' : 'Mark Complete'}</span>
                    </button>

                    {/* AI Verification Button */}
                    <Button
                      size="sm"
                      variant="ai"
                      icon={<Sparkles size={14} />}
                      onClick={() => void handleOpenAssessment()}
                      className="font-bold shadow"
                    >
                      Verify Skills with AI
                    </Button>
                  </div>
                </div>

                {/* Sub-tab Navigation */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-[#E1EAF4] pb-2 dark:border-[#262626]">
                  <button
                    onClick={() => setActiveTab('missions')}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      activeTab === 'missions'
                        ? 'bg-[#11183D] text-white dark:bg-white dark:text-[#11183D]'
                        : 'text-[#526078] hover:bg-slate-100 dark:text-[#A8A8A8] dark:hover:bg-[#202020]'
                    }`}
                  >
                    <Target size={13} />
                    <span>Mission & Deliverables ({submissions.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      activeTab === 'content'
                        ? 'bg-[#11183D] text-white dark:bg-white dark:text-[#11183D]'
                        : 'text-[#526078] hover:bg-slate-100 dark:text-[#A8A8A8] dark:hover:bg-[#202020]'
                    }`}
                  >
                    Objectives & Docs
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      activeTab === 'tasks'
                        ? 'bg-[#11183D] text-white dark:bg-white dark:text-[#11183D]'
                        : 'text-[#526078] hover:bg-slate-100 dark:text-[#A8A8A8] dark:hover:bg-[#202020]'
                    }`}
                  >
                    Practical Tasks ({activeNode.metadata?.practicalTasks?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('discussions')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      activeTab === 'discussions'
                        ? 'bg-[#11183D] text-white dark:bg-white dark:text-[#11183D]'
                        : 'text-[#526078] hover:bg-slate-100 dark:text-[#A8A8A8] dark:hover:bg-[#202020]'
                    }`}
                  >
                    Discussions ({discussions.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      activeTab === 'reviews'
                        ? 'bg-[#11183D] text-white dark:bg-white dark:text-[#11183D]'
                        : 'text-[#526078] hover:bg-slate-100 dark:text-[#A8A8A8] dark:hover:bg-[#202020]'
                    }`}
                  >
                    Ratings & Reviews ({reviews.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('circles')}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      activeTab === 'circles'
                        ? 'bg-[#11183D] text-white dark:bg-white dark:text-[#11183D]'
                        : 'text-[#526078] hover:bg-slate-100 dark:text-[#A8A8A8] dark:hover:bg-[#202020]'
                    }`}
                  >
                    <Users size={13} />
                    <span>Learning Circles ({circles.length})</span>
                  </button>
                </div>

                {/* ═══════════════════════════════════════════════════════════ */}
                {/* TAB 0: MISSION MODE & PRACTICAL DELIVERABLES (PILLAR 3) */}
                {/* ═══════════════════════════════════════════════════════════ */}
                {activeTab === 'missions' && (
                  <div className="mt-5 space-y-6">
                    {/* Mission Deliverable Brief */}
                    <div className="rounded-2xl border border-[#2459A8]/20 bg-[#EFFAFD]/50 p-5 dark:border-blue-900/30 dark:bg-blue-950/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2459A8] text-white">
                            <Target size={15} />
                          </span>
                          <div>
                            <h4 className="text-sm font-black text-[#11183D] dark:text-white">
                              Milestone Mission Deliverable
                            </h4>
                            <p className="text-[11px] text-[#7B8799]">
                              Build and submit tangible engineering evidence. Evaluated against industry-standard rubrics.
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                          Pass mark: 70/100
                        </span>
                      </div>

                      <div className="mt-3 text-xs leading-5 text-[#1e293b] dark:text-blue-100 font-medium">
                        {activeNode.metadata?.whatToBuild ||
                          `Implement a robust, production-ready solution for ${activeNode.title}. Include unit tests, error handling, and documentation.`}
                      </div>
                    </div>

                    {/* Submission Form */}
                    <form
                      onSubmit={handleSubmitDeliverable}
                      className="rounded-2xl border border-[#E1EAF4] bg-[#F8FAFC] p-5 dark:border-[#303030] dark:bg-[#202020]"
                    >
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#7B8799]">
                        Submit Proof of Work
                      </h4>

                      {/* Deliverable Type Picker */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(
                          [
                            { id: 'REPOSITORY', label: 'Git Repository', icon: FolderGit2 },
                            { id: 'DEPLOYMENT', label: 'Live Deployment', icon: ExternalLink },
                            { id: 'CODE', label: 'Source Code', icon: Code2 },
                            { id: 'DIAGRAM', label: 'Architecture Diagram', icon: Layers },
                            { id: 'TEXT', label: 'Technical Defense', icon: Terminal },
                          ] as const
                        ).map((t) => {
                          const IconComp = t.icon;
                          const isSel = deliverableType === t.id;
                          return (
                            <button
                              type="button"
                              key={t.id}
                              onClick={() => setDeliverableType(t.id)}
                              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                                isSel
                                  ? 'border-[#2459A8] bg-[#2459A8] text-white shadow-sm'
                                  : 'border-[#DCE7F2] bg-white text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-[#A8A8A8]'
                              }`}
                            >
                              <IconComp size={13} />
                              <span>{t.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Inputs per Deliverable Type */}
                      <div className="mt-4 space-y-3">
                        {(deliverableType === 'REPOSITORY' || deliverableType === 'DEPLOYMENT' || deliverableType === 'DIAGRAM') && (
                          <div>
                            <label className="block text-[11px] font-bold text-[#526078] dark:text-[#A8A8A8]">
                              {deliverableType === 'REPOSITORY'
                                ? 'Repository URL (GitHub, GitLab, Bitbucket)'
                                : deliverableType === 'DEPLOYMENT'
                                ? 'Live Application URL (https://...)'
                                : 'Diagram / Whiteboard URL or File Link'}
                            </label>
                            <input
                              type="url"
                              value={deliverableUrl}
                              onChange={(e) => setDeliverableUrl(e.target.value)}
                              placeholder={
                                deliverableType === 'REPOSITORY'
                                  ? 'https://github.com/username/project'
                                  : deliverableType === 'DEPLOYMENT'
                                  ? 'https://my-app.vercel.app'
                                  : 'https://excalidraw.com/...'
                              }
                              className="mt-1 w-full rounded-xl border border-[#DCE7F2] bg-white p-2.5 text-xs font-mono outline-none focus:border-[#2459A8] dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-white"
                            />
                          </div>
                        )}

                        {deliverableType === 'CODE' && (
                          <div>
                            <div className="flex items-center justify-between">
                              <label className="block text-[11px] font-bold text-[#526078] dark:text-[#A8A8A8]">
                                Code Snippet / Implementation
                              </label>
                              <select
                                value={codeLanguage}
                                onChange={(e) => setCodeLanguage(e.target.value)}
                                className="rounded-lg border border-[#DCE7F2] bg-white px-2 py-0.5 text-[10px] font-bold outline-none dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-white"
                              >
                                <option value="typescript">TypeScript</option>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="go">Go</option>
                                <option value="rust">Rust</option>
                                <option value="sql">SQL</option>
                              </select>
                            </div>
                            <textarea
                              rows={5}
                              value={deliverableText}
                              onChange={(e) => setDeliverableText(e.target.value)}
                              placeholder="// Paste your production code here..."
                              className="mt-1 w-full rounded-xl border border-[#DCE7F2] bg-white p-2.5 font-mono text-xs outline-none focus:border-[#2459A8] dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-white"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-[11px] font-bold text-[#526078] dark:text-[#A8A8A8]">
                            Technical Notes / Architectural Defense
                          </label>
                          <textarea
                            rows={3}
                            value={deliverableText}
                            onChange={(e) => setDeliverableText(e.target.value)}
                            placeholder="Explain your architectural design decisions, edge case handling, and benchmarks..."
                            className="mt-1 w-full rounded-xl border border-[#DCE7F2] bg-white p-2.5 text-xs outline-none focus:border-[#2459A8] dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-white"
                          />
                        </div>
                      </div>

                      {deliverableError && (
                        <div className="mt-3 rounded-xl bg-rose-50 p-2.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                          {deliverableError}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] text-[#7B8799]">
                          Audit trail stored in PostgreSQL. Verified on submit.
                        </span>
                        <button
                          type="submit"
                          disabled={submittingDeliverable || (!deliverableUrl.trim() && !deliverableText.trim())}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#2459A8] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#1c4786] disabled:opacity-40"
                        >
                          {submittingDeliverable ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>Evaluating Evidence...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck size={14} />
                              <span>Submit & Evaluate Deliverable</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    {/* Deliverable Evaluation Result Scorecard */}
                    {deliverableEvaluation && (
                      <div
                        className={`rounded-2xl p-5 shadow-sm transition ${
                          deliverableEvaluation.status === 'PASSED'
                            ? 'border border-emerald-300 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/40'
                            : 'border border-amber-300 bg-amber-50/70 dark:border-amber-800 dark:bg-amber-950/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-xl text-white ${
                                deliverableEvaluation.status === 'PASSED' ? 'bg-emerald-600' : 'bg-amber-600'
                              }`}
                            >
                              {deliverableEvaluation.status === 'PASSED' ? <Award size={18} /> : <AlertCircle size={18} />}
                            </span>
                            <div>
                              <h4 className="text-sm font-black text-[#11183D] dark:text-white">
                                {deliverableEvaluation.status === 'PASSED'
                                  ? 'Deliverable Accepted — Competencies Verified!'
                                  : 'Revision Required — Needs Enhancement'}
                              </h4>
                              <p className="text-[11px] text-[#7B8799]">
                                Rubric Evaluation Engine • Passing standard: 70
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-2xl font-black">
                            {deliverableEvaluation.rubricScore} / 100
                          </span>
                        </div>

                        <p className="mt-3 text-xs leading-5 text-[#1e293b] dark:text-neutral-200">
                          {deliverableEvaluation.feedback}
                        </p>

                        {/* Demonstrated Competencies */}
                        {deliverableEvaluation.competenciesDemonstrated.length > 0 && (
                          <div className="mt-3 rounded-xl bg-white/80 p-3 dark:bg-[#1A1A1A]/80">
                            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                              Demonstrated Competencies
                            </span>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              {deliverableEvaluation.competenciesDemonstrated.map((c, i) => (
                                <span
                                  key={i}
                                  className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                >
                                  <Check size={11} />
                                  <span>{c}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Next Steps */}
                        <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                          <span className="text-[#526078] dark:text-[#A8A8A8]">
                            Recommended Action: {deliverableEvaluation.nextSteps}
                          </span>
                          <button
                            onClick={() => setActiveTab('content')}
                            className="text-[#2459A8] hover:underline dark:text-[#93C5FD]"
                          >
                            View Docs
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Historical Module Submissions Audit Trail */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B8799]">
                        Deliverable Submission History ({submissions.length})
                      </h4>
                      <div className="mt-2.5 space-y-2">
                        {submissions.length === 0 ? (
                          <p className="text-xs text-[#7B8799]">No deliverables submitted yet for this module.</p>
                        ) : (
                          submissions.map((s) => (
                            <div
                              key={s.id}
                              className="flex items-center justify-between rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-3 text-xs dark:border-[#303030] dark:bg-[#202020]"
                            >
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold dark:bg-neutral-700">
                                  {s.deliverableType}
                                </span>
                                {s.deliverableUrl ? (
                                  <a
                                    href={s.deliverableUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-xs text-[#2459A8] hover:underline dark:text-[#93C5FD]"
                                  >
                                    {s.deliverableUrl}
                                  </a>
                                ) : (
                                  <span className="truncate max-w-xs text-[#7B8799]">
                                    {s.deliverableText}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2.5">
                                <span className="font-mono font-bold">
                                  Score: {s.rubricScore ?? '-'}/100
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    s.status === 'PASSED'
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  }`}
                                >
                                  {s.status}
                                </span>
                                <span className="text-[10px] text-[#7B8799]">
                                  {new Date(s.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════════════════════ */}
                {/* TAB 1: OBJECTIVES & DOCS */}
                {/* ═══════════════════════════════════════════════════════════ */}
                {activeTab === 'content' && (
                  <div className="mt-5 space-y-6">
                    {/* Prerequisites Advisory */}
                    {prerequisiteNodes.length > 0 && (
                      <div
                        className={`rounded-2xl border p-4 ${
                          allPrerequisitesMet
                            ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/30 dark:bg-emerald-950/20'
                            : 'border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-black text-[#11183D] dark:text-white">
                            <Layers size={14} className={allPrerequisitesMet ? 'text-emerald-600' : 'text-amber-600'} />
                            Prerequisites for this Milestone
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              allPrerequisitesMet
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {allPrerequisitesMet ? 'Ready to Learn' : 'Prerequisites Pending'}
                          </span>
                        </div>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {prerequisiteNodes.map((pn) => {
                            const isMet = (nodeProgress[pn.id || '']?.percent ?? 0) === 100;
                            return (
                              <span
                                key={pn.id}
                                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold ${
                                  isMet
                                    ? 'border-emerald-200 bg-white text-emerald-800 dark:border-emerald-900 dark:bg-[#1A1A1A] dark:text-emerald-300'
                                    : 'border-amber-200 bg-white text-amber-800 dark:border-amber-900 dark:bg-[#1A1A1A] dark:text-amber-300'
                                }`}
                              >
                                {isMet ? <CheckCircle2 size={12} className="text-emerald-600" /> : <Clock size={12} className="text-amber-600" />}
                                <span>{pn.title}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 7 Human Questions: Why Learn This */}
                    {activeNode.metadata?.whyLearnThis && (
                      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4.5 dark:border-blue-900/40 dark:bg-blue-950/20">
                        <div className="flex items-center gap-2 text-xs font-black text-[#2459A8] dark:text-[#93C5FD]">
                          <Lightbulb size={16} />
                          <span>Why Learn This? (Practical Context)</span>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#1e293b] dark:text-blue-100 font-medium">
                          {activeNode.metadata.whyLearnThis}
                        </p>
                      </div>
                    )}

                    {/* What You Will Build (Deliverable) */}
                    {activeNode.metadata?.whatToBuild && (
                      <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-4.5 dark:border-purple-900/40 dark:bg-purple-950/20">
                        <div className="flex items-center gap-2 text-xs font-black text-purple-700 dark:text-purple-300">
                          <Award size={16} />
                          <span>What to Build (Milestone Deliverable)</span>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-purple-950 dark:text-purple-100 font-medium">
                          {activeNode.metadata.whatToBuild}
                        </p>
                      </div>
                    )}

                    {/* Learning Objectives */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#7B8799]">
                        Core Learning Objectives & Competencies
                      </h3>
                      <div className="mt-2.5 space-y-2">
                        {(activeNode.metadata?.whatYouWillLearn && activeNode.metadata.whatYouWillLearn.length > 0
                          ? activeNode.metadata.whatYouWillLearn
                          : activeNode.metadata?.learningObjectives || [
                              'Master theoretical concepts and foundational design choices',
                              'Analyze performance trade-offs under high-throughput conditions',
                            ]
                        ).map((obj, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-3 text-xs leading-5 text-[#11183D] dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                          >
                            <CheckCircle2 size={15} className="mt-0.5 text-emerald-600 shrink-0" />
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* How to Verify Understanding */}
                    {activeNode.metadata?.howToVerify && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                        <div className="flex items-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-300">
                          <ShieldCheck size={16} />
                          <span>How to Verify Understanding</span>
                        </div>
                        <p className="mt-1.5 text-xs leading-5 text-emerald-950 dark:text-emerald-100 font-medium">
                          {activeNode.metadata.howToVerify}
                        </p>
                      </div>
                    )}

                    {/* Skills Unlocked */}
                    {activeNode.metadata?.unlockedSkills && activeNode.metadata.unlockedSkills.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#7B8799]">
                          Skills Unlocked Upon Completion
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {activeNode.metadata.unlockedSkills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="flex items-center gap-1.5 rounded-xl border border-[#DCE7F2] bg-white px-3 py-1.5 text-xs font-bold text-[#11183D] shadow-sm dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                            >
                              <Tag size={12} className="text-[#2459A8] dark:text-[#93C5FD]" />
                              <span>{skill}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Curated Resources */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#7B8799]">
                        Official Documentation & Readings
                      </h3>
                      <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
                        {(activeNode.metadata?.resources || [
                          { label: 'Official Framework Guide', url: 'https://docs.rennetus.org' },
                        ]).map((res, idx) => (
                          <a
                            key={idx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-3 text-xs font-bold text-[#11183D] transition hover:border-[#2459A8] dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                          >
                            <span className="truncate group-hover:text-[#2459A8] dark:group-hover:text-[#93C5FD]">
                              {res.label}
                            </span>
                            <ExternalLink size={14} className="text-[#7B8799] shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: PRACTICAL TASKS */}
                {activeTab === 'tasks' && (
                  <div className="mt-5 space-y-4">
                    {(activeNode.metadata?.practicalTasks || []).length === 0 ? (
                      <p className="text-xs text-[#7B8799]">No practical tasks assigned for this milestone.</p>
                    ) : (
                      (activeNode.metadata?.practicalTasks || []).map((task, idx) => (
                        <div
                          key={task.id || idx}
                          className="rounded-2xl border border-[#E1EAF4] bg-[#F8FAFC] p-4 dark:border-[#303030] dark:bg-[#202020]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2459A8] text-xs font-black text-white">
                              {idx + 1}
                            </span>
                            <h4 className="text-sm font-black text-[#11183D] dark:text-white">
                              {task.title}
                            </h4>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
                            {task.instructions}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB 3: DISCUSSIONS */}
                {activeTab === 'discussions' && (
                  <div className="mt-5 space-y-5">
                    <form onSubmit={handleSubmitDiscussion} className="space-y-2">
                      <textarea
                        rows={2}
                        value={newDiscussionContent}
                        onChange={(e) => setNewDiscussionContent(e.target.value)}
                        placeholder="Ask a question or share insights about this module..."
                        className="w-full rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-3 text-xs outline-none focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={!newDiscussionContent.trim() || submittingDiscussion}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#11183D] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#2459A8] disabled:opacity-40 dark:bg-white dark:text-[#11183D]"
                        >
                          <Send size={13} />
                          <span>Post Discussion</span>
                        </button>
                      </div>
                    </form>

                    <div className="space-y-3">
                      {discussions.length === 0 ? (
                        <p className="text-xs text-[#7B8799]">No questions or discussions yet. Be the first to post!</p>
                      ) : (
                        discussions.map((d) => (
                          <div
                            key={d.id}
                            className="rounded-2xl border border-[#E1EAF4] bg-[#F8FAFC] p-3.5 dark:border-[#303030] dark:bg-[#202020]"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-[#11183D] dark:text-white">
                                {d.userName}
                              </span>
                              <span className="text-[10px] text-[#7B8799]">
                                {new Date(d.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-[#526078] dark:text-[#A8A8A8]">{d.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: REVIEWS & RATINGS */}
                {activeTab === 'reviews' && (
                  <div className="mt-5 space-y-5">
                    <form onSubmit={handleSubmitReview} className="rounded-2xl border border-[#E1EAF4] bg-[#F8FAFC] p-4 dark:border-[#303030] dark:bg-[#202020]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#11183D] dark:text-white">Your Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewRating(star)}
                              className="text-amber-500"
                            >
                              <Star size={16} className={star <= newRating ? 'fill-amber-500' : ''} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="Write your review on curriculum quality and depth..."
                        className="mt-3 w-full rounded-xl border border-[#E1EAF4] bg-white p-2.5 text-xs outline-none dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-white"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={!newReviewText.trim() || submittingReview}
                          className="rounded-xl bg-[#2459A8] px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-[#1c4786] disabled:opacity-40"
                        >
                          Submit Review
                        </button>
                      </div>
                    </form>

                    <div className="space-y-3">
                      {reviews.length === 0 ? (
                        <p className="text-xs text-[#7B8799]">No reviews submitted yet.</p>
                      ) : (
                        reviews.map((r) => (
                          <div
                            key={r.id}
                            className="rounded-2xl border border-[#E1EAF4] bg-[#F8FAFC] p-3.5 dark:border-[#303030] dark:bg-[#202020]"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-[#11183D] dark:text-white">
                                {r.userName}
                              </span>
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star size={12} className="fill-amber-500" />
                                <span className="text-xs font-bold">{r.rating}.0</span>
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-[#526078] dark:text-[#A8A8A8]">{r.reviewText}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════════════════════ */}
                {/* TAB 5: LEARNING CIRCLES & PEER ACCOUNTABILITY (PILLAR 5) */}
                {/* ═══════════════════════════════════════════════════════════ */}
                {activeTab === 'circles' && (
                  <div className="mt-5 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-black text-[#11183D] dark:text-white">
                          Learning Circles & Peer Cohorts
                        </h4>
                        <p className="text-[11px] text-[#7B8799]">
                          Study in small, motivated cohorts with weekly commitments and shared milestone tracking.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCreateCircleModalOpen(true)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#11183D] px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-[#2459A8] dark:bg-white dark:text-[#11183D]"
                        >
                          <Plus size={13} />
                          <span>Create Circle</span>
                        </button>
                      </div>
                    </div>

                    {/* Join Code Input Form */}
                    <div className="flex items-center gap-2 rounded-2xl border border-[#E1EAF4] bg-[#F8FAFC] p-3 dark:border-[#303030] dark:bg-[#202020]">
                      <Users size={16} className="text-[#2459A8] shrink-0" />
                      <input
                        type="text"
                        maxLength={6}
                        value={joinCodeInput}
                        onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                        placeholder="Enter 6-char Circle Invite Code (e.g. A9K3L1)"
                        className="w-full bg-transparent text-xs font-mono font-bold outline-none uppercase placeholder:normal-case placeholder:font-sans"
                      />
                      <button
                        onClick={() => void handleJoinCircle()}
                        disabled={!joinCodeInput.trim() || joiningCircle}
                        className="rounded-xl bg-[#2459A8] px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-[#1c4786] disabled:opacity-40 shrink-0"
                      >
                        {joiningCircle ? 'Joining...' : 'Join Circle'}
                      </button>
                    </div>

                    {circleActionMessage && (
                      <div className="rounded-xl bg-blue-50 p-2.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        {circleActionMessage}
                      </div>
                    )}

                    {/* Cohort Circle Cards */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {circles.length === 0 ? (
                        <p className="text-xs text-[#7B8799] sm:col-span-2">
                          No active study groups yet. Create one or join an existing cohort with an invite code!
                        </p>
                      ) : (
                        circles.map((c) => (
                          <div
                            key={c.id}
                            className="rounded-2xl border border-[#E1EAF4] bg-[#F8FAFC] p-4 space-y-3 dark:border-[#303030] dark:bg-[#202020]"
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-black text-[#11183D] dark:text-white">
                                {c.name}
                              </h5>
                              <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                                Code: {c.joinCode}
                              </span>
                            </div>

                            {c.description && (
                              <p className="text-[11px] leading-4 text-[#526078] dark:text-[#A8A8A8]">
                                {c.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between text-[11px] text-[#7B8799]">
                              <span>Created by {c.creatorName}</span>
                              <span className="font-bold text-[#2459A8] dark:text-[#93C5FD]">
                                {c._count?.members || c.members?.length || 1} Learners
                              </span>
                            </div>

                            <div className="flex items-center justify-between border-t border-[#E1EAF4] pt-2 text-[10px] text-[#7B8799] dark:border-[#303030]">
                              <span>Weekly Target: {c.weeklyGoalHours} hrs/wk</span>
                              <span>
                                {c.targetDate ? `Target: ${new Date(c.targetDate).toLocaleDateString()}` : 'Self-paced'}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: ADAPTIVE DIAGNOSTIC ASSESSMENT (PILLAR 2) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {diagnosticModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#DCE7F2] bg-white p-6 shadow-2xl dark:border-[#303030] dark:bg-[#1A1A1A]">
            <div className="flex items-center justify-between border-b border-[#E1EAF4] pb-4 dark:border-[#262626]">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white">
                  <Compass size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#11183D] dark:text-white">
                    Adaptive Diagnostic Assessment: {roadmap.title}
                  </h3>
                  <p className="text-[11px] text-[#7B8799]">
                    Identifies prior knowledge to recommend skipping mastered modules or reviewing gap areas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDiagnosticModalOpen(false)}
                className="text-[#7B8799] hover:text-black dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {diagnosticError && (
              <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                {diagnosticError}
              </div>
            )}

            {diagnosticLoading ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-3">
                <Loader2 size={26} className="animate-spin text-purple-600" />
                <p className="text-xs font-semibold text-[#526078] dark:text-[#A8A8A8]">
                  Calibrating personalized diagnostic challenges...
                </p>
              </div>
            ) : diagnosticResult ? (
              /* Diagnostic Result Card */
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-purple-300 bg-purple-50/70 p-5 dark:border-purple-800 dark:bg-purple-950/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                      Overall Diagnostic Score
                    </span>
                    <span className="font-mono text-2xl font-black text-purple-900 dark:text-purple-100">
                      {diagnosticResult.overallScore}%
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#1e293b] dark:text-purple-100 font-medium">
                    {diagnosticResult.summary}
                  </p>
                </div>

                {/* Domain Proficiencies */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B8799]">
                    Domain Proficiency Breakdown
                  </h4>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {Object.entries(diagnosticResult.domainProficiencies).map(([domain, score]) => (
                      <div
                        key={domain}
                        className="flex items-center justify-between rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-3 text-xs dark:border-[#303030] dark:bg-[#202020]"
                      >
                        <span className="font-bold text-[#11183D] dark:text-white">{domain}</span>
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                          {score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B8799]">
                    Personalized Path Adjustments
                  </h4>
                  <div className="mt-2 space-y-2">
                    {diagnosticResult.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-3 text-xs dark:border-[#303030] dark:bg-[#202020]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[#11183D] dark:text-white">
                            {rec.moduleTitle}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              rec.action === 'SKIP'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {rec.action === 'SKIP' ? 'Safe to Skip' : 'Prioritize & Review'}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] leading-4 text-[#526078] dark:text-[#A8A8A8]">
                          {rec.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setDiagnosticModalOpen(false)}
                    className="rounded-xl bg-[#11183D] px-5 py-2 text-xs font-bold text-white shadow hover:bg-[#2459A8] dark:bg-white dark:text-[#11183D]"
                  >
                    Apply to Workspace
                  </button>
                </div>
              </div>
            ) : (
              /* Diagnostic Questions */
              <div className="mt-5 space-y-5">
                {diagnosticQuestions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="rounded-2xl border border-[#E1EAF4] bg-[#F8FAFC] p-4 dark:border-[#303030] dark:bg-[#202020]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        Question {idx + 1} • {q.domain}
                      </span>
                      <span className="text-[10px] text-[#7B8799]">{q.moduleTitle}</span>
                    </div>

                    <h4 className="mt-2 text-xs font-black text-[#11183D] dark:text-white">
                      {q.question}
                    </h4>

                    {/* Radio Options */}
                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-xs cursor-pointer transition ${
                            diagnosticAnswers[q.id] === optIdx
                              ? 'border-purple-600 bg-purple-50 text-purple-950 dark:bg-purple-950/40 dark:text-purple-200'
                              : 'border-[#E1EAF4] bg-white text-[#526078] hover:border-slate-300 dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-[#A8A8A8]'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`diag-${q.id}`}
                            checked={diagnosticAnswers[q.id] === optIdx}
                            onChange={() => setDiagnosticAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className="mt-0.5 text-purple-600 accent-purple-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setDiagnosticModalOpen(false)}
                    className="rounded-xl border border-[#DCE7F2] px-4 py-2 text-xs font-bold text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:text-[#A8A8A8]"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={diagnosticSubmitting || Object.keys(diagnosticAnswers).length === 0}
                    onClick={() => void handleSubmitDiagnostic()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-purple-700 disabled:opacity-50"
                  >
                    {diagnosticSubmitting ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Evaluating Diagnostic...</span>
                      </>
                    ) : (
                      <>
                        <Compass size={13} />
                        <span>Evaluate Prior Knowledge</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DRAWER: INTERACTIVE AI LEARNING COMPANION (PILLAR 4) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {companionDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-[#DCE7F2] bg-white shadow-2xl dark:border-[#303030] dark:bg-[#1A1A1A]">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E1EAF4] p-4 dark:border-[#262626]">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2459A8] text-white">
                <Bot size={18} />
              </span>
              <div>
                <h3 className="text-xs font-black text-[#11183D] dark:text-white">
                  AI Learning Companion
                </h3>
                <p className="text-[10px] text-[#7B8799]">
                  Context: {activeNode?.title}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCompanionDrawerOpen(false)}
              className="text-[#7B8799] hover:text-black dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 border-b border-[#E1EAF4] p-3 dark:border-[#262626]">
            {(
              [
                { id: 'SOCRATIC_HINT', label: '💡 Socratic Hint' },
                { id: 'EXPLAIN', label: '🎓 Explain' },
                { id: 'DEBUG', label: '🐛 Debug' },
                { id: 'NEXT_STEP', label: '🎯 Next Step' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setCompanionMode(m.id)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  companionMode === m.id
                    ? 'bg-[#2459A8] text-white'
                    : 'text-[#526078] hover:bg-slate-100 dark:text-[#A8A8A8] dark:hover:bg-[#202020]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {companionMessages.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <Bot size={28} className="mx-auto text-[#2459A8]" />
                <p className="text-xs font-bold text-[#11183D] dark:text-white">
                  How can I help you master {activeNode?.title}?
                </p>
                <p className="text-[11px] text-[#7B8799]">
                  Ask questions, request guided hints without direct solutions, or get debugging advice.
                </p>

                {/* Pre-filled suggested prompts */}
                <div className="space-y-1.5 pt-2">
                  {[
                    `How should I structure the deliverables for ${activeNode?.title}?`,
                    `Give me a socratic hint on edge case handling.`,
                    `What are common failure modes in this milestone?`,
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => void handleSendCompanionMessage(p)}
                      className="block w-full rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-2 text-left text-[11px] font-medium text-[#2459A8] hover:border-[#2459A8] dark:border-[#303030] dark:bg-[#202020] dark:text-[#93C5FD]"
                    >
                      "{p}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              companionMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-3.5 ${
                    msg.role === 'user'
                      ? 'ml-8 bg-[#11183D] text-white dark:bg-white dark:text-[#11183D]'
                      : 'mr-4 border border-[#E1EAF4] bg-[#F8FAFC] text-[#11183D] dark:border-[#303030] dark:bg-[#202020] dark:text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-5">{msg.text}</p>

                  {/* Companion Prompt Chips */}
                  {msg.prompts && msg.prompts.length > 0 && (
                    <div className="mt-3 space-y-1 border-t border-[#E1EAF4] pt-2 dark:border-[#303030]">
                      <span className="text-[10px] font-bold text-[#7B8799]">Suggested Follow-ups:</span>
                      {msg.prompts.map((p, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => void handleSendCompanionMessage(p)}
                          className="block w-full text-left text-[11px] font-semibold text-[#2459A8] hover:underline dark:text-[#93C5FD]"
                        >
                          → {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}

            {companionLoading && (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#526078] dark:text-[#A8A8A8]">
                <Loader2 size={14} className="animate-spin text-[#2459A8]" />
                <span>Companion is thinking...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-[#E1EAF4] p-3 dark:border-[#262626]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={companionInput}
                onChange={(e) => setCompanionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleSendCompanionMessage();
                }}
                placeholder="Ask your learning companion..."
                className="w-full rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] p-2.5 text-xs outline-none focus:border-[#2459A8] dark:border-[#303030] dark:bg-[#202020] dark:text-white"
              />
              <button
                onClick={() => void handleSendCompanionMessage()}
                disabled={!companionInput.trim() || companionLoading}
                className="rounded-xl bg-[#2459A8] p-2.5 text-white shadow hover:bg-[#1c4786] disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: CREATE LEARNING CIRCLE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {createCircleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#DCE7F2] bg-white p-6 shadow-2xl dark:border-[#303030] dark:bg-[#1A1A1A]">
            <div className="flex items-center justify-between border-b border-[#E1EAF4] pb-4 dark:border-[#262626]">
              <h3 className="text-sm font-black text-[#11183D] dark:text-white">
                Create a Learning Circle Cohort
              </h3>
              <button
                onClick={() => setCreateCircleModalOpen(false)}
                className="text-[#7B8799] hover:text-black dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCircle} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#526078] dark:text-[#A8A8A8]">
                  Circle / Cohort Name
                </label>
                <input
                  type="text"
                  required
                  value={newCircleName}
                  onChange={(e) => setNewCircleName(e.target.value)}
                  placeholder="e.g. Distributed Systems Study Group"
                  className="mt-1 w-full rounded-xl border border-[#DCE7F2] bg-white p-2.5 text-xs outline-none dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#526078] dark:text-[#A8A8A8]">
                  Cohort Goal / Description
                </label>
                <textarea
                  rows={2}
                  value={newCircleDesc}
                  onChange={(e) => setNewCircleDesc(e.target.value)}
                  placeholder="Describe weekly sync expectations and peer code review cadence..."
                  className="mt-1 w-full rounded-xl border border-[#DCE7F2] bg-white p-2.5 text-xs outline-none dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#526078] dark:text-[#A8A8A8]">
                    Weekly Goal (Hours)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={50}
                    value={newCircleHours}
                    onChange={(e) => setNewCircleHours(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#DCE7F2] bg-white p-2.5 text-xs outline-none dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#526078] dark:text-[#A8A8A8]">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={newCircleTargetDate}
                    onChange={(e) => setNewCircleTargetDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#DCE7F2] bg-white p-2.5 text-xs outline-none dark:border-[#303030] dark:bg-[#202020] dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateCircleModalOpen(false)}
                  className="rounded-xl border border-[#DCE7F2] px-4 py-2 text-xs font-bold text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:text-[#A8A8A8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2459A8] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#1c4786]"
                >
                  Create & Generate Invite Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: STANDARD AI LEARNING VERIFICATION (Q&A ASSESSMENT) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {assessmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#DCE7F2] bg-white p-6 shadow-2xl dark:border-[#303030] dark:bg-[#1A1A1A]">
            <div className="flex items-center justify-between border-b border-[#E1EAF4] pb-4 dark:border-[#262626]">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-[#2459A8] to-purple-600 text-white">
                  <Sparkles size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#11183D] dark:text-white">
                    AI Learning Verification: {activeNode?.title}
                  </h3>
                  <p className="text-[11px] text-[#7B8799]">
                    Demonstrate mastery through practical reasoning and edge case analysis.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAssessmentModalOpen(false)}
                className="text-[#7B8799] hover:text-black dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {assessmentError && (
              <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                {assessmentError}
              </div>
            )}

            {assessmentLoading ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-3">
                <Loader2 size={26} className="animate-spin text-[#2459A8]" />
                <p className="text-xs font-semibold text-[#526078] dark:text-[#A8A8A8]">
                  Synthesizing adaptive interview challenges...
                </p>
              </div>
            ) : assessmentResult ? (
              /* Assessment Result Evaluation Card */
              <div className="mt-5 space-y-4">
                <div
                  className={`rounded-2xl p-5 ${
                    assessmentResult.passed
                      ? 'border border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
                      : 'border border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#7B8799]">
                      AI Evaluation Scorecard
                    </span>
                    <span className="font-mono text-2xl font-black">
                      {assessmentResult.score} / 100
                    </span>
                  </div>

                  <h4 className="mt-2 text-base font-black text-[#11183D] dark:text-white">
                    {assessmentResult.passed
                      ? 'Competency Demonstrated — Assessment Passed!'
                      : 'Needs Further Review — Keep Practicing'}
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-[#526078] dark:text-[#A8A8A8]">
                    {assessmentResult.feedback}
                  </p>
                </div>

                {/* Demonstrated Competencies */}
                {assessmentResult.competenciesDemonstrated && assessmentResult.competenciesDemonstrated.length > 0 && (
                  <div className="rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-3.5 dark:border-[#303030] dark:bg-[#202020]">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      Demonstrated Competencies
                    </span>
                    <ul className="mt-2 space-y-1 text-xs">
                      {assessmentResult.competenciesDemonstrated.map((c, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[#11183D] dark:text-white">
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Areas for Improvement */}
                {assessmentResult.areasForImprovement && assessmentResult.areasForImprovement.length > 0 && (
                  <div className="rounded-xl border border-[#E1EAF4] bg-[#F8FAFC] p-3.5 dark:border-[#303030] dark:bg-[#202020]">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                      Recommended Focus Areas
                    </span>
                    <ul className="mt-2 space-y-1 text-xs">
                      {assessmentResult.areasForImprovement.map((a, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[#11183D] dark:text-white">
                          <AlertCircle size={13} className="text-amber-600" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setAssessmentModalOpen(false)}
                    className="rounded-xl bg-[#11183D] px-5 py-2 text-xs font-bold text-white shadow hover:bg-[#2459A8] dark:bg-white dark:text-[#11183D]"
                  >
                    Close & Continue Learning
                  </button>
                </div>
              </div>
            ) : (
              /* Questions Flow */
              <div className="mt-5 space-y-5">
                {assessmentQuestions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="rounded-2xl border border-[#E1EAF4] bg-[#F8FAFC] p-4 dark:border-[#303030] dark:bg-[#202020]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-[#2459A8]/10 px-2 py-0.5 text-[10px] font-bold text-[#2459A8] dark:bg-white/10 dark:text-white">
                        Question {idx + 1} ({q.type})
                      </span>
                      <span className="text-[10px] text-[#7B8799]">{q.points} Points</span>
                    </div>

                    <h4 className="mt-2 text-xs font-black text-[#11183D] dark:text-white">
                      {q.question}
                    </h4>

                    <textarea
                      rows={3}
                      value={assessmentAnswers[q.id] || ''}
                      onChange={(e) =>
                        setAssessmentAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      placeholder="Enter your technical explanation, architectural trade-offs, and edge case reasoning..."
                      className="mt-3 w-full rounded-xl border border-[#E1EAF4] bg-white p-3 text-xs outline-none transition focus:border-[#4A8BDF] dark:border-[#303030] dark:bg-[#1A1A1A] dark:text-white"
                    />
                  </div>
                ))}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setAssessmentModalOpen(false)}
                    className="rounded-xl border border-[#DCE7F2] px-4 py-2 text-xs font-bold text-[#526078] hover:bg-slate-50 dark:border-[#303030] dark:text-[#A8A8A8]"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={assessmentSubmitting}
                    onClick={() => void handleSubmitAssessment()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2459A8] to-purple-600 px-5 py-2 text-xs font-bold text-white shadow hover:opacity-95 disabled:opacity-50"
                  >
                    {assessmentSubmitting ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Evaluating Responses...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        <span>Submit for Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
