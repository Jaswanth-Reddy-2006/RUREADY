// ═══════════════════════════════════════════════════════════════
// RU Ready? — Technical Quiz Arena (/challenges/quizzes & /challenges/quiz/:sessionId)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Clock,
  Zap,
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Flame,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { challengesApi, type QuizSession } from '../../api/challenges';
import { useChallengesSocket } from '../../hooks/useChallengesSocket';

const QUIZ_CATEGORIES = [
  { id: 'DSA', name: 'Data Structures & Algorithms', desc: 'Trees, Graphs, DP, Arrays, Heaps, Hash Tables', color: 'from-blue-600 to-indigo-600' },
  { id: 'OS', name: 'Operating Systems', desc: 'Deadlocks, Paging, Threads, Semaphores, CPU Scheduling', color: 'from-emerald-600 to-teal-600' },
  { id: 'DBMS', name: 'Database Management & SQL', desc: 'ACID, Normalization, Indexes, Transactions, Isolation', color: 'from-amber-500 to-orange-600' },
  { id: 'Networks', name: 'Computer Networks', desc: 'TCP/IP, HTTP/2/3, DNS, Subnets, OSI Layer protocols', color: 'from-purple-600 to-violet-600' },
  { id: 'System Design', name: 'System Design Principles', desc: 'CAP Theorem, Sharding, Load Balancing, Caching', color: 'from-rose-600 to-pink-600' },
];

export default function MultiplayerQuizArena() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const socket = useChallengesSocket();

  // Mode: Selector or Live Quiz
  const [session, setSession] = useState<QuizSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Active Question State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [answerResult, setAnswerResult] = useState<{
    isCorrect: boolean;
    correctIndex: number;
    explanation: string;
    pointsEarned: number;
  } | null>(null);

  const [timerSec, setTimerSec] = useState<number>(20);

  // Load Session if sessionId exists
  useEffect(() => {
    if (!sessionId) {
      setSession(null);
      return;
    }

    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const res = await challengesApi.getQuizSession(sessionId);
        if (res.success && res.data) {
          setSession(res.data);
          if (res.data.status === 'LOBBY') {
            // Auto start if single player or host
            socket.startQuiz(res.data.id);
          }
        }
      } catch (err: any) {
        toast.error('Quiz session not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [sessionId, socket]);

  // Socket listeners for quiz updates
  useEffect(() => {
    if (!sessionId || !user) return;

    socket.joinQuiz(sessionId);

    const unsubState = socket.on('quiz:state_update', (updatedSession: QuizSession) => {
      setSession(updatedSession);
    });

    const unsubNextQ = socket.on('quiz:next_question_started', (updatedSession: QuizSession) => {
      setSession(updatedSession);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setAnswerResult(null);
      setTimerSec(updatedSession.timePerQuestionSec || 20);
    });

    const unsubAnswerResult = socket.on('quiz:answer_result', (data: any) => {
      setAnswerResult(data);
    });

    const unsubCompleted = socket.on('quiz:completed', (finalSession: QuizSession) => {
      setSession(finalSession);
    });

    return () => {
      unsubState();
      unsubNextQ();
      unsubAnswerResult();
      unsubCompleted();
    };
  }, [sessionId, user, socket]);

  // Question Timer
  useEffect(() => {
    if (!session || session.status !== 'QUESTION_ACTIVE' || isAnswerSubmitted) return;

    const interval = setInterval(() => {
      setTimerSec((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto submit timeout
          if (!isAnswerSubmitted) {
            handleAnswerSelect(-1);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session, isAnswerSubmitted]);

  // Launch Category Quiz
  const handleLaunchCategoryQuiz = async (category: string) => {
    try {
      setIsCreating(true);
      const res = await challengesApi.createQuiz({
        hostId: user?.id || 'usr_guest',
        hostName: user?.name || 'Quiz Challenger',
        hostAvatar: (user as any)?.avatarUrl,
        category,
        questionCount: 5,
        timePerQuestionSec: 20,
      });

      if (res.success && res.data) {
        navigate(`/challenges/quiz/${res.data.id}`);
      }
    } catch (err: any) {
      toast.error('Failed to create quiz');
    } finally {
      setIsCreating(false);
    }
  };

  // Answer Submit
  const handleAnswerSelect = (optionIndex: number) => {
    if (isAnswerSubmitted || !session) return;
    setSelectedOption(optionIndex);
    setIsAnswerSubmitted(true);

    socket.submitQuizAnswer(session.id, session.currentQuestionIndex, optionIndex);
  };

  const handleNextQuestion = () => {
    if (!session) return;
    socket.nextQuizQuestion(session.id);
  };

  // Category Selector View
  if (!sessionId || !session) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/challenges')}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Challenges Hub</span>
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Zap size={18} />
              </div>
              <h1 className="text-xl font-black text-slate-900">Technical Quiz Arena</h1>
            </div>
            <p className="text-xs text-slate-500">
              Fast-paced timed MCQs to test core CS fundamentals, system design & DSA concepts.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {QUIZ_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <HelpCircle size={24} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{cat.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 font-mono">5 Questions • 20s each</span>
                  <button
                    onClick={() => handleLaunchCategoryQuiz(cat.id)}
                    disabled={isCreating}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Start Quiz</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Live Quiz Question / Completed View
  const currentQ = session.questions[session.currentQuestionIndex];
  const myParticipant = session.participants[user?.id || 'usr_guest'] || Object.values(session.participants)[0];
  const isCompleted = session.status === 'COMPLETED';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans">
      <div className="max-w-3xl mx-auto px-4 pt-8 space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/challenges/quizzes')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Quit Quiz</span>
          </button>

          <div className="flex items-center gap-4">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold font-mono">
              <Flame size={15} className="text-amber-500" />
              <span>Streak: {myParticipant?.streak || 0}</span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono">
              <Trophy size={15} className="text-blue-500" />
              <span>Score: {myParticipant?.score || 0}</span>
            </div>
          </div>
        </div>

        {/* Completed View */}
        {isCompleted ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-lg text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
              <Trophy size={32} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">Quiz Completed!</h2>
              <p className="text-xs text-slate-500 mt-1">Great job testing your technical knowledge.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Final Score</span>
                <div className="text-xl font-black text-slate-900 font-mono mt-1">{myParticipant?.score || 0}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Correct</span>
                <div className="text-xl font-black text-emerald-600 font-mono mt-1">
                  {myParticipant?.correctAnswers || 0} / {session.totalQuestions}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">XP Earned</span>
                <div className="text-xl font-black text-amber-500 font-mono mt-1">+80 XP</div>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/challenges/quizzes')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Play Another Quiz
              </button>
            </div>
          </div>
        ) : (
          /* Active Question Card */
          currentQ && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
              {/* Question Progress & Timer */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">
                    Question {session.currentQuestionIndex + 1} of {session.totalQuestions}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-600 font-mono">
                    {currentQ.topic || session.category}
                  </span>
                </div>

                {/* Synchronized Timer */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 font-mono text-xs font-bold text-slate-700">
                  <Clock size={14} className={timerSec < 5 ? 'text-rose-500 animate-ping' : 'text-blue-600'} />
                  <span className={timerSec < 5 ? 'text-rose-600' : 'text-slate-900'}>{timerSec}s</span>
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{currentQ.question}</h2>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 gap-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  let optStyle = 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-slate-800';

                  if (isAnswerSubmitted && answerResult) {
                    if (idx === answerResult.correctIndex) {
                      optStyle = 'border-emerald-400 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isSelected && !answerResult.isCorrect) {
                      optStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                    } else {
                      optStyle = 'border-slate-200 opacity-50';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-blue-500 bg-blue-50/60 font-bold text-blue-900';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`p-4 rounded-2xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-mono font-bold text-[11px]">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium">{opt}</span>
                      </div>

                      {isAnswerSubmitted && answerResult && (
                        <div>
                          {idx === answerResult.correctIndex && <CheckCircle2 size={16} className="text-emerald-600" />}
                          {isSelected && !answerResult.isCorrect && <XCircle size={16} className="text-rose-600" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Question Reveal */}
              {isAnswerSubmitted && answerResult && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div
                    className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                      answerResult.isCorrect
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50/70 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      {answerResult.isCorrect ? (
                        <>
                          <CheckCircle2 size={15} className="text-emerald-600" />
                          <span>Correct! (+{answerResult.pointsEarned} pts)</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={15} className="text-rose-600" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-700">{answerResult.explanation}</p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <span>
                        {session.currentQuestionIndex + 1 >= session.totalQuestions
                          ? 'View Final Results'
                          : 'Next Question'}
                      </span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
