// ═══════════════════════════════════════════════════════════════
// RU Ready? — 1v1 DSA Battle Arena (/challenges/match/:matchId)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  Swords,
  Play,
  Send,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { challengesApi, type MatchSession, type MatchParticipant } from '../../api/challenges';
import { useChallengesSocket } from '../../hooks/useChallengesSocket';

export default function BattleArena1v1() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const socket = useChallengesSocket();

  // Match State
  const [match, setMatch] = useState<MatchSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(1200);

  // Opponent Live Progress
  const [opponentProgress, setOpponentProgress] = useState<{ passed: number; total: number }>({ passed: 0, total: 0 });

  // Execution & Test Console
  const [isExecutingSample, setIsExecutingSample] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [consoleTab, setConsoleTab] = useState<'sample' | 'submission'>('sample');
  const [sampleResults, setSampleResults] = useState<{
    passed: number;
    total: number;
    results: any[];
    stdout?: string;
  } | null>(null);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);

  // Match Completed Modal
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [winnerParticipant, setWinnerParticipant] = useState<MatchParticipant | null>(null);

  // Fetch initial match
  useEffect(() => {
    if (!matchId) return;

    const fetchMatch = async () => {
      try {
        setIsLoading(true);
        const res = await challengesApi.getMatch(matchId);
        if (res.success && res.data) {
          setMatch(res.data);
          const initialStarter =
            res.data.problem.starterCodes[language] ||
            res.data.problem.starterCodes['javascript'] ||
            '// Write your solution here\n';
          setCode(initialStarter);

          // Calculate remaining timer
          const now = Date.now();
          const rem = Math.max(0, Math.floor((res.data.endsAt - now) / 1000));
          setTimeRemainingSec(rem);

          if (res.data.status === 'COMPLETED') {
            setShowCompletionModal(true);
          }
        }
      } catch (err: any) {
        toast.error('Failed to load match session');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  // Join match socket room & listen to live opponent updates
  useEffect(() => {
    if (!matchId || !user) return;

    socket.joinMatchRoom(matchId);

    const unsubOpponentProgress = socket.on('match:opponent_progress', (data: any) => {
      if (data.userId !== user.id) {
        setOpponentProgress({ passed: data.passedTests, total: data.totalTests });
      }
    });

    const unsubStateUpdate = socket.on('match:state_update', (updatedMatch: MatchSession) => {
      setMatch(updatedMatch);
    });

    const unsubCompleted = socket.on('match:completed', (data: { match: MatchSession; winnerId?: string }) => {
      setMatch(data.match);
      if (data.winnerId && data.match.participants[data.winnerId]) {
        setWinnerParticipant(data.match.participants[data.winnerId]);
      }
      setShowCompletionModal(true);
    });

    return () => {
      unsubOpponentProgress();
      unsubStateUpdate();
      unsubCompleted();
    };
  }, [matchId, user, socket]);

  // Match Countdown Timer
  useEffect(() => {
    if (!match || match.status === 'COMPLETED') return;

    const timer = setInterval(() => {
      setTimeRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [match]);

  // Language Change Handler
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (match?.problem?.starterCodes[newLang]) {
      setCode(match.problem.starterCodes[newLang]);
    }
  };

  // Run Sample Tests
  const handleRunSampleTests = async () => {
    if (!match) return;
    try {
      setIsExecutingSample(true);
      setConsoleTab('sample');
      const res = await challengesApi.runSampleTests({
        problemId: match.problem.id,
        code,
        language,
      });

      if (res.success && res.data) {
        setSampleResults(res.data);
        if (res.data.passed === res.data.total) {
          toast.success(`Passed ${res.data.passed}/${res.data.total} sample test cases!`, { icon: '✅' });
        } else {
          toast.error(`Passed ${res.data.passed}/${res.data.total} sample test cases`);
        }
      }
    } catch (err: any) {
      toast.error('Error running sample tests');
    } finally {
      setIsExecutingSample(false);
    }
  };

  // Submit Final Solution
  const handleSubmitSolution = async () => {
    if (!match || !user || !matchId) return;
    try {
      setIsSubmitting(true);
      setConsoleTab('submission');
      const res = await challengesApi.submitSolution(matchId, {
        userId: user.id,
        userName: user.name || 'Challenger',
        code,
        language,
      });

      if (res.success && res.data) {
        setSubmissionResult(res.data.submissionResult);
        setMatch(res.data.match);

        // Broadcast progress to opponent
        socket.broadcastProgress(
          matchId,
          res.data.submissionResult.passedCount,
          res.data.submissionResult.totalCount
        );

        if (res.data.isWinner) {
          toast.success('Congratulations! You solved all test cases first!', { icon: '🏆' });
          setShowCompletionModal(true);
        } else if (res.data.submissionResult.passedCount === res.data.submissionResult.totalCount) {
          toast.success('All test cases passed!');
        } else {
          toast.error(`Passed ${res.data.submissionResult.passedCount}/${res.data.submissionResult.totalCount} tests.`);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-blue-400 mx-auto" />
          <p className="text-sm font-medium text-slate-300">Loading Battle Arena...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white p-4">
        <div className="text-center space-y-4 max-w-sm">
          <AlertTriangle size={36} className="text-amber-400 mx-auto" />
          <h2 className="text-lg font-bold">Match Not Found</h2>
          <p className="text-xs text-slate-400">This battle session may have concluded or the link is invalid.</p>
          <button
            onClick={() => navigate('/challenges')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl"
          >
            Return to Challenges
          </button>
        </div>
      </div>
    );
  }

  const currentUserId = user?.id || 'usr_guest';
  const myParticipant = match.participants[currentUserId] || Object.values(match.participants)[0];
  const opponentParticipant = Object.values(match.participants).find((p) => p.userId !== currentUserId);

  return (
    <div className="h-screen flex flex-col bg-[#0F172A] text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header Bar */}
      <header className="h-14 bg-[#1E293B] border-b border-slate-700/80 px-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/challenges')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Exit Battle"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Swords size={15} />
            </div>
            <div>
              <h1 className="text-xs font-bold text-white flex items-center gap-2">
                <span>{match.problem.title}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-sm font-bold uppercase ${
                    match.problem.difficulty === 'EASY'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : match.problem.difficulty === 'HARD'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {match.problem.difficulty}
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Center Live Match Timer */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 font-mono text-xs font-bold">
          <Clock size={14} className={timeRemainingSec < 180 ? 'text-rose-400 animate-ping' : 'text-blue-400'} />
          <span className={timeRemainingSec < 180 ? 'text-rose-400' : 'text-slate-200'}>
            {formatTimer(timeRemainingSec)}
          </span>
        </div>

        {/* Right Header Opponent Mini Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Opponent:</span>
            <span className="font-bold text-white">{opponentParticipant?.userName || 'Searching...'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunSampleTests}
              disabled={isExecutingSample}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              {isExecutingSample ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
              <span>Run Tests</span>
            </button>

            <button
              onClick={handleSubmitSolution}
              disabled={isSubmitting || match.status === 'COMPLETED'}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              <span>Submit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main 3-Column Arena Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Problem Description & Constraints (30%) */}
        <div className="w-[30%] border-r border-slate-800 bg-[#1E293B]/60 overflow-y-auto p-5 space-y-5 select-text">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {match.problem.topicTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Problem Statement</h2>
            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
              {match.problem.description}
            </div>
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Examples</h3>
            {match.problem.examples.map((ex, idx) => (
              <div key={idx} className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 font-mono text-[11px] space-y-1.5">
                <div>
                  <span className="text-slate-400 font-semibold">Input: </span>
                  <span className="text-emerald-400">{ex.input}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Output: </span>
                  <span className="text-blue-400">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div className="text-slate-400 font-sans text-[10px] pt-1 border-t border-slate-800">
                    <span className="font-semibold text-slate-300">Explanation: </span>
                    {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Constraints</h3>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 font-mono">
              {match.problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center Column: Code Editor & Console Drawer (45%) */}
        <div className="w-[45%] flex flex-col border-r border-slate-800 bg-[#0F172A]">
          {/* Editor Language Selector Bar */}
          <div className="h-10 bg-[#1E293B]/80 border-b border-slate-800 px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">Language:</span>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-white rounded-md px-2 py-1 focus:outline-hidden"
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python 3</option>
                <option value="java">Java 17</option>
                <option value="cpp">C++ 20</option>
                <option value="go">Go</option>
              </select>
            </div>

            <button
              onClick={() => handleLanguageChange(language)}
              className="text-slate-400 hover:text-white p-1 rounded-sm"
              title="Reset to starter code"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language === 'python' ? 'python' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'javascript'}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>

          {/* Test & Submission Output Drawer */}
          <div className="h-44 border-t border-slate-800 bg-[#1E293B] flex flex-col">
            <div className="h-8 border-b border-slate-800/80 px-3 flex items-center gap-4 shrink-0 text-xs font-bold">
              <button
                onClick={() => setConsoleTab('sample')}
                className={`flex items-center gap-1.5 transition-colors ${
                  consoleTab === 'sample' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Sample Test Cases</span>
                {sampleResults && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {sampleResults.passed}/{sampleResults.total}
                  </span>
                )}
              </button>

              <button
                onClick={() => setConsoleTab('submission')}
                className={`flex items-center gap-1.5 transition-colors ${
                  consoleTab === 'submission' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Submission Output</span>
                {submissionResult && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {submissionResult.passedCount}/{submissionResult.totalCount}
                  </span>
                )}
              </button>
            </div>

            {/* Console Output Scrollable Body */}
            <div className="flex-1 p-3 overflow-y-auto text-xs font-mono space-y-2 select-text">
              {consoleTab === 'sample' ? (
                sampleResults ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {sampleResults.passed === sampleResults.total ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={14} /> Accepted ({sampleResults.passed}/{sampleResults.total} passed)
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <XCircle size={14} /> Failed ({sampleResults.passed}/{sampleResults.total} passed)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {sampleResults.results?.map((res, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg border ${
                            res.passed ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/10'
                          }`}
                        >
                          <div className="text-[10px] font-bold text-slate-300 mb-1">Test Case {i + 1}</div>
                          <div className="text-[10px] text-slate-400">Expected: {JSON.stringify(res.expected)}</div>
                          <div className={`text-[10px] ${res.passed ? 'text-emerald-400' : 'text-rose-400 font-bold'}`}>
                            Actual: {JSON.stringify(res.actual)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 italic">Click "Run Tests" to test against sample test cases...</div>
                )
              ) : submissionResult ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={submissionResult.passedCount === submissionResult.totalCount ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      Result: {submissionResult.passedCount} / {submissionResult.totalCount} Test Cases Passed
                    </span>
                    <span className="text-slate-400 text-[10px]">Runtime: {submissionResult.runtimeMs || 24}ms</span>
                  </div>
                  {submissionResult.errorDetails && (
                    <div className="p-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px]">
                      {submissionResult.errorDetails}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-500 italic">Click "Submit" to evaluate all hidden test cases and conclude battle...</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Opponent & Activity HUD (25%) */}
        <div className="w-[25%] bg-[#1E293B]/40 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-4">
            {/* My Progress HUD */}
            <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase() || 'Y'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{user?.name || 'You'}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{myParticipant?.ratingBefore || 1200} Elo</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-blue-400">
                  {myParticipant?.passedTests || 0} / {match.problem.testCases.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                  style={{
                    width: `${((myParticipant?.passedTests || 0) / Math.max(1, match.problem.testCases.length)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* VS Divider */}
            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-black">
              <div className="h-px bg-slate-800 flex-1" />
              <span>VS</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            {/* Opponent Progress HUD */}
            <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                    {opponentParticipant?.userName?.[0]?.toUpperCase() || 'O'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{opponentParticipant?.userName || 'Opponent'}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{opponentParticipant?.ratingBefore || 1200} Elo</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400">
                  {opponentProgress.passed} / {match.problem.testCases.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-300 rounded-full"
                  style={{
                    width: `${(opponentProgress.passed / Math.max(1, match.problem.testCases.length)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Live Match Submissions Feed */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Match Activity</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {match.submissions.length === 0 ? (
                  <div className="text-[11px] text-slate-500 italic p-2 bg-slate-900/40 rounded-lg">
                    No submissions yet...
                  </div>
                ) : (
                  match.submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200">{sub.userName}</span>
                        <span className="text-[10px] text-slate-400 uppercase">({sub.language})</span>
                      </div>
                      <span className={sub.isAllPassed ? 'text-emerald-400 font-bold' : 'text-amber-400 font-medium'}>
                        {sub.passed}/{sub.total} passed
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MATCH COMPLETION MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1E293B] rounded-3xl p-8 max-w-md w-full border border-slate-700 shadow-2xl text-center space-y-5"
            >
              {/* Winner Header Banner */}
              {match.winnerId === user?.id ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40 animate-bounce">
                    <Trophy size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-emerald-400">VICTORY!</h2>
                  <p className="text-xs text-slate-300">You conquered your opponent in this DSA battle.</p>
                </div>
              ) : match.winnerId ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/40">
                    <Swords size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-rose-400">DEFEAT</h2>
                  <p className="text-xs text-slate-300">Your opponent solved the problem first. Good effort!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center border border-blue-500/40">
                    <Sparkles size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-blue-400">MATCH TIED</h2>
                  <p className="text-xs text-slate-300">Equal performance across both challengers.</p>
                </div>
              )}

              {/* Rating & XP Rewards Box */}
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 grid grid-cols-2 gap-3 text-left">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Elo Rating</span>
                  <div className="text-lg font-black font-mono text-white mt-0.5">
                    {myParticipant?.ratingAfter || myParticipant?.ratingBefore || 1200}
                    {myParticipant?.ratingAfter && myParticipant.ratingAfter !== myParticipant.ratingBefore && (
                      <span
                        className={`text-xs ml-1.5 font-bold ${
                          myParticipant.ratingAfter > myParticipant.ratingBefore ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {myParticipant.ratingAfter > myParticipant.ratingBefore ? '+' : ''}
                        {myParticipant.ratingAfter - myParticipant.ratingBefore}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">XP Awarded</span>
                  <div className="text-lg font-black font-mono text-amber-400 mt-0.5">
                    +{myParticipant?.xpAwarded || 100} XP
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompletionModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Review Code
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/challenges')}
                  className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Return to Hub
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
