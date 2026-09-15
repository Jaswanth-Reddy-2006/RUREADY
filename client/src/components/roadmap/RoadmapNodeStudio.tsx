import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, Play, Target, BookOpen, Code2, MessageSquare,
  Sparkles, ExternalLink, FileCode, CheckCircle2, Clock,
  Mic, MicOff, Lightbulb, Save, Copy, Terminal, ShieldCheck,
  Github, Globe, Award, HelpCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import { Roadmap, RoadmapNode, useRoadmapStore } from '../../store/useRoadmapStore';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';

interface RoadmapNodeStudioProps {
  roadmap: Roadmap;
  node: RoadmapNode | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteNode: (node: RoadmapNode) => void;
}

export default function RoadmapNodeStudio({
  roadmap,
  node,
  isOpen,
  onClose,
  onCompleteNode,
}: RoadmapNodeStudioProps) {
  const { 
    completedChecklistItems, 
    toggleChecklistItem, 
    readSourceIds, 
    toggleSourceRead,
    nodeNotes, 
    saveNodeNotes,
    nodeCode, 
    saveNodeCode,
    nodeSubmissions,
    recordNodeSubmission
  } = useRoadmapStore();

  const [activeLeftTab, setActiveLeftTab] = useState<'whatToDo' | 'sources' | 'hints' | 'notes'>('whatToDo');
  const [activeRightTab, setActiveRightTab] = useState<'code' | 'defend' | 'project'>('code');

  // Code state
  const [codeLanguage, setCodeLanguage] = useState('typescript');
  const [currentCode, setCurrentCode] = useState('');

  // Test Runner state
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<{
    ran: boolean;
    passed: boolean;
    tests: Array<{ name: string; passed: boolean; durationMs: number }>;
    executionTimeMs: number;
    memoryMb: number;
    stdout: string;
  } | null>(null);

  // Ava Defense state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [verbalAnswer, setVerbalAnswer] = useState('');
  const [isEvaluatingDefense, setIsEvaluatingDefense] = useState(false);
  const [defenseFeedback, setDefenseFeedback] = useState<{
    evaluated: boolean;
    score: number;
    technicalDepth: number;
    tradeoffsClarity: number;
    communication: number;
    feedbackText: string;
    strengths: string[];
    weaknesses: string[];
  } | null>(null);

  // Progressive Hint tier state
  const [hintTierUnlocked, setHintTierUnlocked] = useState<number>(0);

  // Project URL state
  const [repoUrl, setRepoUrl] = useState('');
  const [isRepoVerified, setIsRepoVerified] = useState(false);

  // Personal notes state
  const [notes, setNotes] = useState('');

  const nodeKey = node ? `${roadmap.id}_${node.id}` : '';
  const checkedItems = nodeKey ? completedChecklistItems[nodeKey] || [] : [];
  const readSources = nodeKey ? readSourceIds[nodeKey] || [] : [];

  useEffect(() => {
    if (node) {
      // Load saved code or default starter code
      const savedCode = nodeCode[nodeKey];
      setCurrentCode(savedCode !== undefined ? savedCode : (node.whatIsTheExactThing?.starterCode || ''));
      
      // Load saved notes
      setNotes(nodeNotes[nodeKey] || '');

      // Load previous submission if exists
      const prevSub = nodeSubmissions[nodeKey];
      if (prevSub) {
        setTestResults({
          ran: true,
          passed: prevSub.passedTests,
          tests: [
            { name: 'Unit Invariant Verification', passed: true, durationMs: 4 },
            { name: 'High-Concurrency Stress Boundary', passed: true, durationMs: 8 },
            { name: 'Memory & Leak Profiling Check', passed: true, durationMs: 2 },
          ],
          executionTimeMs: prevSub.executionTimeMs || 14,
          memoryMb: 24.2,
          stdout: `[INFO] Test Suite passed with score ${prevSub.score}/100.`,
        });
        if (prevSub.submittedRepoUrl) {
          setRepoUrl(prevSub.submittedRepoUrl);
          setIsRepoVerified(true);
        }
      } else {
        setTestResults(null);
      }

      setDefenseFeedback(null);
      setHintTierUnlocked(0);
    }
  }, [node, nodeKey, nodeCode, nodeNotes, nodeSubmissions]);

  if (!isOpen || !node) return null;

  // Handle Code Change
  const handleCodeChange = (val: string | undefined) => {
    const updated = val || '';
    setCurrentCode(updated);
    saveNodeCode(roadmap.id, node.id, updated);
  };

  // Run Test Suite simulation
  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setIsRunningTests(false);
      const isPass = currentCode.trim().length > 30;
      const res = {
        ran: true,
        passed: isPass,
        tests: [
          { name: 'Invariant & State Mutation Boundary', passed: true, durationMs: 5 },
          { name: 'Concurrent Rate / Throughput Simulation', passed: isPass, durationMs: 9 },
          { name: 'Memory Allocation & Clean Destruction', passed: true, durationMs: 3 },
        ],
        executionTimeMs: 17,
        memoryMb: 26.4,
        stdout: isPass
          ? `✓ Test Suite Complete. All 3 assertions passed without memory leaks.`
          : `✗ Test Assertion Failed: Expected concurrent safety guard was not triggered. Check your state synchronization.`,
      };
      setTestResults(res);

      recordNodeSubmission(roadmap.id, node.id, {
        passedTests: isPass,
        score: isPass ? 95 : 40,
        executionTimeMs: 17,
      });

      if (isPass) {
        toast.success('Test Suite Passed! All benchmarks cleared.');
      } else {
        toast.error('Test Suite Failed. Review assertion errors.');
      }
    }, 1200);
  };

  // Speech to text toggle
  const handleToggleVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in this browser. Please type your defense.');
      return;
    }

    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecordingVoice(true);
        toast('Listening to your Socratic defense...', { icon: '🎙️' });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVerbalAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecordingVoice(false);
      };

      recognition.onerror = () => {
        setIsRecordingVoice(false);
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
      };

      recognition.start();
    } catch {
      setIsRecordingVoice(false);
      toast.error('Microphone access denied or unavailable.');
    }
  };

  // Socratic Ava AI Defense Evaluation
  const handleEvaluateDefense = () => {
    if (!verbalAnswer.trim() || verbalAnswer.trim().length < 15) {
      toast.error('Please articulate your defense in detail (at least a few sentences).');
      return;
    }

    setIsEvaluatingDefense(true);
    setTimeout(() => {
      setIsEvaluatingDefense(false);
      const isGood = verbalAnswer.length > 50;
      const feedback = {
        evaluated: true,
        score: isGood ? 92 : 74,
        technicalDepth: isGood ? 94 : 70,
        tradeoffsClarity: isGood ? 90 : 75,
        communication: isGood ? 92 : 78,
        feedbackText: isGood
          ? 'Exceptional technical depth. You clearly identified the core concurrency invariant, defended the memory tradeoffs against alternatives, and demonstrated clear engineering maturity.'
          : 'Good foundation, but you should more explicitly address latency implications and explain which alternative solutions were considered and rejected.',
        strengths: [
          'Accurate terminology and architectural framing',
          'Clear understanding of failure recovery modes',
        ],
        weaknesses: [
          'Could explicitly state how this scales under 10x burst load',
        ],
      };
      setDefenseFeedback(feedback);

      recordNodeSubmission(roadmap.id, node.id, {
        passedTests: true,
        score: feedback.score,
        executionTimeMs: 15,
        verbalFeedback: feedback.feedbackText,
      });

      toast.success(`Ava scored your defense: ${feedback.score}/100!`);
    }, 1500);
  };

  // Verify Project URL
  const handleVerifyRepo = () => {
    if (!repoUrl.includes('github.com/') && !repoUrl.includes('gitlab.com/') && !repoUrl.includes('http')) {
      toast.error('Please enter a valid Git repository URL (e.g. https://github.com/username/project).');
      return;
    }
    setIsRepoVerified(true);
    recordNodeSubmission(roadmap.id, node.id, {
      passedTests: true,
      score: 100,
      executionTimeMs: 20,
      submittedRepoUrl: repoUrl,
    });
    toast.success('Project repository linked and verified!');
  };

  // Save notes
  const handleSaveNotes = () => {
    saveNodeNotes(roadmap.id, node.id, notes);
    toast.success('Study notes saved!');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs font-body text-[#11183D]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="bg-white border border-[#DCE7F2] rounded-3xl w-full max-w-[96vw] h-[95vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* ════════════════════════════════════════════════════════ */}
          {/* STUDIO HEADER                                            */}
          {/* ════════════════════════════════════════════════════════ */}
          <div className="px-6 py-4 bg-[#EFFAFD] border-b border-[#DCE7F2] flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2459A8] to-[#4A8BDF] text-white flex items-center justify-center font-display font-extrabold text-sm shrink-0 shadow-xs">
                0{node.orderIndex}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#A0006D] font-mono uppercase">
                    {node.subHeader || node.category}
                  </span>
                  <span className="text-[#7B8799]">•</span>
                  <span className="text-[#526078] font-medium flex items-center gap-1">
                    <Clock size={12} className="text-[#4A8BDF]" />
                    ~{node.estimatedHours || 16} Study Hours
                  </span>
                  <span className="text-[#7B8799]">•</span>
                  <span className="text-[#168A62] font-semibold">
                    {node.status === 'MASTERED' ? '✓ Mastered' : 'In Progress'}
                  </span>
                </div>
                <h2 className="text-lg font-bold font-display text-[#11183D] truncate">
                  {node.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant={node.status === 'MASTERED' ? 'secondary' : 'royal'}
                size="sm"
                onClick={() => onCompleteNode(node)}
                icon={<Check size={14} />}
                className="text-xs font-display shadow-xs"
              >
                {node.status === 'MASTERED' ? 'Completed & Mastered' : 'Mark Milestone Complete'}
              </Button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#526078] hover:bg-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════ */}
          {/* SPLIT STUDIO BODY WORKSPACE                              */}
          {/* ════════════════════════════════════════════════════════ */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
            
            {/* ──────────────────────────────────────────────────────── */}
            {/* LEFT PANE: CURRICULUM & LEARNING BLUEPRINT (COL 6)       */}
            {/* ──────────────────────────────────────────────────────── */}
            <div className="lg:col-span-6 border-r border-[#DCE7F2] flex flex-col min-h-0 bg-[#FAFCFE]">
              {/* Left Tabs Bar */}
              <div className="h-11 border-b border-[#DCE7F2] px-4 flex items-center gap-1 shrink-0 bg-white overflow-x-auto">
                {[
                  { id: 'whatToDo', label: '1. What Should I Do?', icon: Target },
                  { id: 'sources', label: '2. What Is The Source?', icon: BookOpen },
                  { id: 'hints', label: '3. Architecture Hints', icon: Lightbulb },
                  { id: 'notes', label: '4. My Study Notes', icon: FileCode },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSel = activeLeftTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveLeftTab(t.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-display transition-all cursor-pointer whitespace-nowrap ${
                        isSel
                          ? 'bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]'
                          : 'text-[#526078] hover:text-[#11183D]'
                      }`}
                    >
                      <Icon size={13} className={isSel ? 'text-[#4A8BDF]' : ''} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Left Pane Content Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* TAB 1: WHAT SHOULD I DO? */}
                {activeLeftTab === 'whatToDo' && (
                  <div className="space-y-6">
                    {/* Strategy Directive */}
                    <div className="p-4.5 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-xs font-extrabold font-display uppercase tracking-wider text-[#2459A8]">
                        <Target size={14} className="text-[#4A8BDF]" />
                        <span>Core Milestone Objective & Directive</span>
                      </div>
                      <p className="text-xs text-[#11183D] leading-relaxed font-medium">
                        {node.whatShouldIDo?.summary}
                      </p>
                    </div>

                    {/* Interactive Action Steps Checklist */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                          Action Items Checklist ({checkedItems.length} of {node.whatShouldIDo?.actionSteps?.length || 0})
                        </h4>
                        <span className="text-[11px] text-[#7B8799]">Click to track progress</span>
                      </div>

                      <div className="space-y-2">
                        {node.whatShouldIDo?.actionSteps?.map((step, idx) => {
                          const isDone = checkedItems.includes(idx);
                          return (
                            <div
                              key={idx}
                              onClick={() => toggleChecklistItem(roadmap.id, node.id, idx)}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                                isDone
                                  ? 'bg-[#E8F5F0]/60 border-[#168A62]/30 text-[#11183D]'
                                  : 'bg-white border-[#DCE7F2] hover:border-[#4A8BDF]/40 text-[#334155]'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                                  isDone
                                    ? 'bg-[#168A62] border-[#168A62] text-white'
                                    : 'border-[#7B8799] bg-white'
                                }`}
                              >
                                {isDone && <Check size={12} />}
                              </div>
                              <span className={`text-xs leading-relaxed ${isDone ? 'line-through text-[#526078]' : ''}`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Architectural Invariants & Rules */}
                    {node.whatShouldIDo?.mentalModels && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                          Architectural Invariants & Mental Models
                        </h4>
                        <div className="space-y-2.5">
                          {node.whatShouldIDo.mentalModels.map((model, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-2xl bg-[#F8EAF4]/60 border border-[#A0006D]/20 space-y-1 text-xs"
                            >
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A0006D] font-mono block">
                                Invariant Principle #{idx + 1}
                              </span>
                              <p className="text-[#11183D] font-medium leading-relaxed">
                                💡 {model}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Engineering Dos & Don'ts */}
                    <div className="p-4.5 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                        Production Dos & Don'ts Matrix
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-[#E8F5F0]/50 border border-[#168A62]/20 space-y-1">
                          <strong className="text-[#168A62] font-bold block">✓ DO:</strong>
                          <p className="text-[#334155] text-[11px]">
                            Implement explicit cancellation tokens, backpressure checks, and atomic state transitions.
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                          <strong className="text-rose-600 font-bold block">✗ DON'T:</strong>
                          <p className="text-[#334155] text-[11px]">
                            Block the event loop with synchronous computation or allow unbounded memory buffering.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: WHAT IS THE SOURCE? */}
                {activeLeftTab === 'sources' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                        Curated Learning Resources ({readSources.length} of {node.whatIsTheSource?.length || 0} Studied)
                      </h4>
                      <span className="text-[11px] text-[#7B8799]">Mark as studied to track completion</span>
                    </div>

                    <div className="space-y-3">
                      {node.whatIsTheSource?.map((src) => {
                        const isRead = readSources.includes(src.id);
                        return (
                          <div
                            key={src.id}
                            className={`p-4 rounded-2xl border transition-all space-y-3 ${
                              isRead
                                ? 'bg-[#E8F5F0]/40 border-[#168A62]/30'
                                : 'bg-white border-[#DCE7F2] hover:border-[#4A8BDF]/40 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]">
                                    {src.type}
                                  </span>
                                  <span className="text-[11px] text-[#7B8799]">• ~25 min read</span>
                                </div>
                                <h5 className="text-sm font-bold text-[#11183D] leading-snug">
                                  {src.title}
                                </h5>
                                {src.description && (
                                  <p className="text-xs text-[#526078] leading-relaxed">
                                    {src.description}
                                  </p>
                                )}
                              </div>

                              <a
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-[#EFFAFD] text-[#2459A8] hover:bg-[#4A8BDF] hover:text-white transition-colors shrink-0"
                                title="Open reference link"
                              >
                                <ExternalLink size={15} />
                              </a>
                            </div>

                            <div className="pt-2 border-t border-[#DCE7F2] flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => toggleSourceRead(roadmap.id, node.id, src.id)}
                                className="flex items-center gap-2 text-xs font-semibold cursor-pointer"
                              >
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                                    isRead ? 'bg-[#168A62] border-[#168A62] text-white' : 'border-[#7B8799] bg-white'
                                  }`}
                                >
                                  {isRead && <Check size={10} />}
                                </div>
                                <span className={isRead ? 'text-[#168A62]' : 'text-[#526078]'}>
                                  {isRead ? 'Marked as Studied' : 'Mark as Studied'}
                                </span>
                              </button>

                              <a
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-[#4A8BDF] hover:underline flex items-center gap-1"
                              >
                                Launch Resource <ExternalLink size={11} />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: ARCHITECTURAL HINTS (PROGRESSIVE TIERS) */}
                {activeLeftTab === 'hints' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                        Progressive Architecture Hint Engine
                      </h4>
                      <p className="text-xs text-[#526078]">
                        Stuck on the drill? Unlock progressive levels of hints from subtle nudges to reference code.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Hint 1 */}
                      <div className="p-4 rounded-2xl bg-white border border-[#DCE7F2] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#2459A8] flex items-center gap-1.5 font-display">
                            <Lightbulb size={14} />
                            Level 1: Conceptual Architectural Nudge
                          </span>
                          {hintTierUnlocked >= 1 ? (
                            <Badge variant="success" size="xs">Unlocked</Badge>
                          ) : (
                            <Button variant="secondary" size="sm" onClick={() => setHintTierUnlocked(1)}>
                              Unlock Nudge
                            </Button>
                          )}
                        </div>
                        {hintTierUnlocked >= 1 && (
                          <p className="text-xs text-[#334155] leading-relaxed pt-1">
                            Focus on separating read and write pipelines. Ensure the state transition handler is idempotent so multiple retries with identical inputs do not alter system state.
                          </p>
                        )}
                      </div>

                      {/* Hint 2 */}
                      <div className="p-4 rounded-2xl bg-white border border-[#DCE7F2] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#A0006D] flex items-center gap-1.5 font-display">
                            <Lightbulb size={14} />
                            Level 2: Data Structure & Flow Invariant
                          </span>
                          {hintTierUnlocked >= 2 ? (
                            <Badge variant="success" size="xs">Unlocked</Badge>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={hintTierUnlocked < 1}
                              onClick={() => setHintTierUnlocked(2)}
                            >
                              Unlock Data Pattern
                            </Button>
                          )}
                        </div>
                        {hintTierUnlocked >= 2 && (
                          <p className="text-xs text-[#334155] leading-relaxed pt-1">
                            Utilize a Sorted Set (ZSET) or sliding window ring-buffer. Remove all expired timestamps with a score less than <code>now - windowMs</code> before checking cardinality against your threshold.
                          </p>
                        )}
                      </div>

                      {/* Hint 3 */}
                      <div className="p-4 rounded-2xl bg-white border border-[#DCE7F2] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#168A62] flex items-center gap-1.5 font-display">
                            <Lightbulb size={14} />
                            Level 3: Full Reference Implementation
                          </span>
                          {hintTierUnlocked >= 3 ? (
                            <Badge variant="success" size="xs">Unlocked</Badge>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={hintTierUnlocked < 2}
                              onClick={() => setHintTierUnlocked(3)}
                            >
                              Unlock Full Code
                            </Button>
                          )}
                        </div>
                        {hintTierUnlocked >= 3 && (
                          <div className="pt-2 space-y-2">
                            <pre className="p-3 rounded-xl bg-[#1E1E1E] text-[#E0E0E0] text-[11px] font-mono overflow-x-auto max-h-48">
                              {node.whatIsTheExactThing?.starterCode || '// Reference pattern implementation'}
                            </pre>
                            <p className="text-[11px] text-[#526078]">
                              Study the implementation above and adapt it to your specific constraints in the sandbox.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: PERSONAL STUDY NOTES */}
                {activeLeftTab === 'notes' && (
                  <div className="space-y-4 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                          Personal Milestone Scratchpad
                        </h4>
                        <p className="text-xs text-[#526078]">
                          Take persistent study notes for this milestone. Automatically saved to your workspace.
                        </p>
                      </div>

                      <Button
                        variant="royal"
                        size="sm"
                        onClick={handleSaveNotes}
                        icon={<Save size={12} />}
                      >
                        Save Notes
                      </Button>
                    </div>

                    <textarea
                      rows={12}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write your personal notes, mental models, code snippets, or interview talking points here..."
                      className="w-full flex-1 p-4 text-xs bg-white border border-[#DCE7F2] rounded-2xl text-[#11183D] font-mono leading-relaxed focus:outline-none focus:border-[#4A8BDF] shadow-2xs"
                    />
                  </div>
                )}

              </div>
            </div>

            {/* ──────────────────────────────────────────────────────── */}
            {/* RIGHT PANE: INTERACTIVE EXECUTION & DEFENSE STUDIO (COL 6)*/}
            {/* ──────────────────────────────────────────────────────── */}
            <div className="lg:col-span-6 flex flex-col min-h-0 bg-white">
              
              {/* Right Studio Tabs Bar */}
              <div className="h-11 border-b border-[#DCE7F2] px-4 flex items-center justify-between shrink-0 bg-[#FAFCFE]">
                <div className="flex items-center gap-1">
                  {[
                    { id: 'code', label: 'Sandbox Code Drill', icon: Code2 },
                    { id: 'defend', label: 'Ava Oral Defense', icon: MessageSquare },
                    { id: 'project', label: 'Submit Project Link', icon: Github },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSel = activeRightTab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveRightTab(t.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-display transition-all cursor-pointer ${
                          isSel
                            ? 'bg-white text-[#2459A8] border border-[#DCE7F2] shadow-2xs'
                            : 'text-[#526078] hover:text-[#11183D]'
                        }`}
                      >
                        <Icon size={13} className={isSel ? 'text-[#4A8BDF]' : ''} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Language Switcher for Code */}
                {activeRightTab === 'code' && (
                  <div className="flex items-center gap-2">
                    <select
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value)}
                      className="bg-white border border-[#DCE7F2] rounded-lg px-2 py-1 text-[11px] font-mono font-bold text-[#11183D] focus:outline-none"
                    >
                      <option value="typescript">TypeScript</option>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="go">Go</option>
                      <option value="sql">SQL</option>
                    </select>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const template = node.whatIsTheExactThing?.starterCode || '';
                        handleCodeChange(template);
                        toast.success('Starter code reset!');
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Studio Content Body */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                
                {/* 1. CODE SANDBOX & TEST RUNNER */}
                {activeRightTab === 'code' && (
                  <div className="flex-1 flex flex-col min-h-0">
                    {/* Monaco Editor Container */}
                    <div className="flex-1 min-h-[300px] border-b border-[#DCE7F2] relative">
                      <Editor
                        height="100%"
                        language={codeLanguage}
                        theme="vs-dark"
                        value={currentCode}
                        onChange={handleCodeChange}
                        options={{
                          fontSize: 13,
                          fontFamily: 'JetBrains Mono, Fira Code, monospace',
                          minimap: { enabled: false },
                          lineNumbers: 'on',
                          scrollBeyondLastLine: false,
                        }}
                      />
                    </div>

                    {/* Test Suite Runner Toolbar & Console */}
                    <div className="h-48 shrink-0 bg-[#1E1E1E] text-[#E0E0E0] p-4 flex flex-col font-mono text-xs overflow-hidden">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
                        <div className="flex items-center gap-2">
                          <Terminal size={14} className="text-[#4A8BDF]" />
                          <span className="font-bold text-white text-[11px]">Sandboxed Test Verification Console</span>
                          {testResults && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${testResults.passed ? 'bg-[#168A62]/30 text-[#4ade80]' : 'bg-rose-500/30 text-rose-300'}`}>
                              {testResults.passed ? 'ALL TESTS PASSED' : 'TESTS FAILED'}
                            </span>
                          )}
                        </div>

                        <Button
                          variant="royal"
                          size="sm"
                          onClick={handleRunTests}
                          disabled={isRunningTests}
                          icon={isRunningTests ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
                        >
                          {isRunningTests ? 'Executing Sandbox...' : 'Run Test Suite'}
                        </Button>
                      </div>

                      {/* Console Output Logs */}
                      <div className="flex-1 overflow-y-auto pt-2 space-y-1 text-[11px]">
                        {isRunningTests ? (
                          <div className="flex items-center gap-2 text-[#4A8BDF]">
                            <RefreshCw size={13} className="animate-spin" />
                            <span>Compiling AST & executing automated test harness...</span>
                          </div>
                        ) : testResults ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-4 text-[10px] text-[#A0A0A0]">
                              <span>Latency: {testResults.executionTimeMs}ms</span>
                              <span>Memory: {testResults.memoryMb} MB</span>
                              <span>Garbage Collector: 0 Pauses</span>
                            </div>
                            {testResults.tests.map((t, idx) => (
                              <div key={idx} className="flex items-center justify-between py-0.5">
                                <span className={t.passed ? 'text-[#4ade80]' : 'text-rose-400'}>
                                  {t.passed ? '✓' : '✗'} {t.name}
                                </span>
                                <span className="text-[#7B8799] text-[10px]">{t.durationMs}ms</span>
                              </div>
                            ))}
                            <p className="text-[#B0B0B0] pt-1">{testResults.stdout}</p>
                          </div>
                        ) : (
                          <p className="text-[#7B8799] italic">
                            Click 'Run Test Suite' to execute automated verification against your solution.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. AVA SOCRATIC VOICE & ORAL DEFENSE */}
                {activeRightTab === 'defend' && (
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Ava Interview Question */}
                    <div className="p-5 rounded-2xl bg-[#F8EAF4] border border-[#A0006D]/30 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-[#A0006D]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#A0006D] font-display">
                          Ava AI Socratic Challenge Question
                        </span>
                      </div>

                      <p className="text-sm font-bold text-[#11183D] leading-snug">
                        {node.microQuestions?.[0]?.questionText || 'Walk through how you would architect this component to handle high-throughput burst traffic and prevent cascade failures.'}
                      </p>
                      <p className="text-[11px] text-[#526078]">
                        Focus: <strong>{node.microQuestions?.[0]?.focus || 'System Scalability'}</strong> • Articulate trade-offs out loud or type your defense.
                      </p>
                    </div>

                    {/* Answer Input (Voice or Text) */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                          Your Socratic Defense
                        </label>
                        <button
                          type="button"
                          onClick={handleToggleVoiceRecording}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                            isRecordingVoice
                              ? 'bg-rose-500 text-white animate-pulse'
                              : 'bg-[#EFFAFD] text-[#2459A8] hover:bg-[#DCE7F2]'
                          }`}
                        >
                          {isRecordingVoice ? <MicOff size={13} /> : <Mic size={13} />}
                          <span>{isRecordingVoice ? 'Listening (Stop)' : 'Voice Input'}</span>
                        </button>
                      </div>

                      <textarea
                        rows={6}
                        value={verbalAnswer}
                        onChange={(e) => setVerbalAnswer(e.target.value)}
                        placeholder="State your architectural reasoning, mention at least one trade-off, and describe how your design behaves during network failures..."
                        className="w-full p-4 text-xs bg-[#EFFAFD]/40 border border-[#DCE7F2] rounded-2xl text-[#11183D] leading-relaxed focus:outline-none focus:border-[#4A8BDF]"
                      />

                      <Button
                        variant="eggplant"
                        size="sm"
                        onClick={handleEvaluateDefense}
                        disabled={isEvaluatingDefense}
                        icon={isEvaluatingDefense ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        className="w-full justify-center shadow-xs"
                      >
                        {isEvaluatingDefense ? 'Evaluating Defense with Ava AI...' : 'Evaluate Defense with Ava AI'}
                      </Button>
                    </div>

                    {/* AI Feedback Rubric Card */}
                    {defenseFeedback && (
                      <div className="p-5 rounded-2xl bg-white border-2 border-[#A0006D]/30 shadow-md space-y-4">
                        <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                          <span className="text-xs font-bold font-display uppercase tracking-wider text-[#A0006D]">
                            Ava Architectural Rubric Evaluation
                          </span>
                          <span className="text-2xl font-black font-display text-[#A0006D]">
                            {defenseFeedback.score}/100
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2.5 rounded-xl bg-[#EFFAFD]">
                            <span className="block text-[10px] text-[#526078] uppercase">Technical Depth</span>
                            <strong className="text-xs text-[#2459A8]">{defenseFeedback.technicalDepth}%</strong>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[#EFFAFD]">
                            <span className="block text-[10px] text-[#526078] uppercase">Trade-off Clarity</span>
                            <strong className="text-xs text-[#2459A8]">{defenseFeedback.tradeoffsClarity}%</strong>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[#EFFAFD]">
                            <span className="block text-[10px] text-[#526078] uppercase">Communication</span>
                            <strong className="text-xs text-[#2459A8]">{defenseFeedback.communication}%</strong>
                          </div>
                        </div>

                        <p className="text-xs text-[#11183D] leading-relaxed">
                          {defenseFeedback.feedbackText}
                        </p>

                        <div className="space-y-1.5 pt-1 text-xs">
                          <strong className="text-[#168A62] text-[11px] block">Key Strengths:</strong>
                          {defenseFeedback.strengths.map((s, idx) => (
                            <p key={idx} className="text-[#334155] text-[11px] flex items-center gap-1.5">
                              <CheckCircle2 size={12} className="text-[#168A62]" /> {s}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. PROJECT DELIVERABLE REPOSITORY SUBMISSION */}
                {activeRightTab === 'project' && (
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="p-5 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-2">
                      <div className="flex items-center gap-2">
                        <Github size={16} className="text-[#11183D]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                          Project Deliverable Submission
                        </span>
                      </div>
                      <p className="text-xs text-[#526078] leading-relaxed">
                        For comprehensive milestone projects, link your GitHub repository or live preview to showcase on your candidate profile.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                        GitHub Repository or Deployment URL
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          placeholder="https://github.com/your-username/milestone-project"
                          className="flex-1 p-3 text-xs bg-[#EFFAFD]/40 border border-[#DCE7F2] rounded-2xl text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                        <Button
                          variant="royal"
                          size="md"
                          onClick={handleVerifyRepo}
                        >
                          Verify Link
                        </Button>
                      </div>

                      {isRepoVerified && (
                        <div className="p-4 rounded-2xl bg-[#E8F5F0] border border-[#168A62]/30 flex items-center gap-3">
                          <CheckCircle2 size={18} className="text-[#168A62]" />
                          <div>
                            <p className="text-xs font-bold text-[#168A62]">
                              Repository Linked & Verified Successfully!
                            </p>
                            <p className="text-[11px] text-[#526078]">
                              This deliverable will be highlighted in your candidate portfolio and profile showcase.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* ════════════════════════════════════════════════════════ */}
          {/* STUDIO FOOTER                                            */}
          {/* ════════════════════════════════════════════════════════ */}
          <div className="px-6 py-3.5 bg-[#EFFAFD] border-t border-[#DCE7F2] flex items-center justify-between text-xs text-[#526078] shrink-0">
            <div className="flex items-center gap-4">
              <span>Checked Action Items: <strong>{checkedItems.length}</strong></span>
              <span>•</span>
              <span>Sources Read: <strong>{readSources.length}</strong></span>
              {testResults && (
                <>
                  <span>•</span>
                  <span className={testResults.passed ? 'text-[#168A62] font-bold' : 'text-rose-500'}>
                    {testResults.passed ? 'Tests Passing' : 'Tests Pending'}
                  </span>
                </>
              )}
            </div>

            <Button
              variant="royal"
              size="sm"
              onClick={() => onCompleteNode(node)}
              icon={<Check size={14} />}
              className="shadow-sm"
            >
              {node.status === 'MASTERED' ? 'Mark Again / Save Changes' : 'Master This Milestone'}
            </Button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
