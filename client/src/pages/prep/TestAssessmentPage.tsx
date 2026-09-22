import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ArrowLeft,
  CheckCircle2,
  Award,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  BookOpen,
  Target,
  BarChart3,
  Cpu,
  Flag,
  X,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { usePrepStore } from '../../store/usePrepStore';
import QuestionNavigator from '../../components/prep/QuestionNavigator';
import { QuestionAttempt } from '@ru-ready/shared';

export default function TestAssessmentPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeLeftSecs, setTimeLeftSecs] = useState(1200); // 20 mins
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const testQuestions = [
    {
      id: 't1',
      question: 'Which isolation level prevents dirty reads but permits non-repeatable reads?',
      options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
      correctIndex: 1,
      concept: 'DBMS Isolation Levels',
      explanation: 'Read Committed prevents reading uncommitted data (dirty reads) but permits non-repeatable reads.',
    },
    {
      id: 't2',
      question: 'In operating systems, which algorithm guarantees minimal average waiting time for a set of processes?',
      options: ['FCFS', 'Round Robin', 'Shortest Job First (SJF)', 'Priority Scheduling'],
      correctIndex: 2,
      concept: 'OS Process Scheduling',
      explanation: 'SJF is mathematically optimal for minimizing average waiting time.',
    },
    {
      id: 't3',
      question: 'Which TCP flag is used to initiate a 3-way handshake connection establishment?',
      options: ['ACK', 'FIN', 'SYN', 'RST'],
      correctIndex: 2,
      concept: 'Networking TCP Handshake',
      explanation: 'SYN flag initiates the 3-way handshake sequence (SYN -> SYN-ACK -> ACK).',
    },
    {
      id: 't4',
      question: 'What is the minimum number of normal forms required to eliminate partial functional dependency?',
      options: ['1NF', '2NF', '3NF', 'BCNF'],
      correctIndex: 1,
      concept: 'DBMS Normalization',
      explanation: '2NF removes partial functional dependencies on candidate keys.',
    },
    {
      id: 't5',
      question: 'Which deadlock prevention condition ensures that if a process requests resources, it must release all held resources if unavailable?',
      options: ['Mutual Exclusion', 'Hold and Wait', 'No Preemption', 'Circular Wait'],
      correctIndex: 2,
      concept: 'OS Deadlocks',
      explanation: 'No Preemption protocol forces resource release when immediate allocation fails.',
    },
  ];

  const handleFinishAssessment = (idToUse?: string | null) => {
    const id = idToUse || attemptId;
    if (id) {
      testQuestions.forEach((q, idx) => {
        const isCorrect = userAnswers[idx] === q.correctIndex;
        const qa: QuestionAttempt = {
          questionId: q.id,
          topicId: subjectId || 'core-cs',
          concept: q.concept,
          selectedAnswerIndex: userAnswers[idx] ?? -1,
          isCorrect,
          timeSpentSecs: Math.max(5, Math.round((1200 - timeLeftSecs) / testQuestions.length)),
          difficulty: 'MEDIUM',
          timestamp: new Date().toISOString(),
        };
        usePrepStore.getState().recordQuestionAttempt(id, qa);
      });
      usePrepStore.getState().completeAssessment(id);
    }
    setShowSubmitModal(false);
    setTestCompleted(true);
  };

  // Timer countdown
  useEffect(() => {
    let timer: any = null;
    if (testStarted && !testCompleted && timeLeftSecs > 0) {
      timer = setInterval(() => {
        setTimeLeftSecs((prev) => {
          if (prev <= 1) {
            handleFinishAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, testCompleted, timeLeftSecs]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    let count = 0;
    testQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) count += 1;
    });
    return count;
  };

  const scoreCount = calculateScore();
  const answeredCount = Object.keys(userAnswers).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const unansweredCount = testQuestions.length - answeredCount;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Nav */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/preparation')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Preparation Command Center
          </button>
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-mono">
            Timed Evaluation Assessment
          </Badge>
        </div>

        {!testStarted ? (
          /* PRE-TEST OVERVIEW CARD */
          <Card className="p-6 sm:p-8 bg-white border-slate-200/80 shadow-md rounded-3xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Cpu className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Core CS Placement Assessment
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Evaluates your readiness across OS, DBMS, Computer Networks, and System Design.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">DURATION</span>
                <span className="font-bold text-slate-900 text-sm">20 Mins</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">QUESTIONS</span>
                <span className="font-bold text-slate-900 text-sm">{testQuestions.length} Items</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">MODE</span>
                <span className="font-bold text-slate-900 text-sm">Adaptive Timed</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left max-w-md mx-auto space-y-2 text-slate-600">
              <span className="font-bold text-slate-700 uppercase tracking-wider block font-mono text-[11px]">Assessment Rules:</span>
              <ul className="space-y-1 list-disc list-inside">
                <li>Answers are revealed after full submission</li>
                <li>Timer continues while assessment is active</li>
                <li>Progress is saved to persistent local store</li>
              </ul>
            </div>

            <Button
              onClick={() => {
                const newAttemptId = usePrepStore.getState().startAssessment('OPERATING_SYSTEMS');
                setAttemptId(newAttemptId);
                setTestStarted(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Assessment Now</span>
            </Button>
          </Card>
        ) : !testCompleted ? (
          /* ACTIVE TEST ASSESSMENT VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* MAIN QUESTION PANEL (8 Cols) */}
            <Card className="lg:col-span-8 p-6 sm:p-8 bg-white border-slate-200/80 shadow-md rounded-3xl space-y-6">
              {/* Header Timer */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    Question {currentIndex + 1} of {testQuestions.length}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{testQuestions[currentIndex].concept}</h3>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 font-mono font-bold text-xs border border-amber-200">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{formatTimer(timeLeftSecs)}</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-4">
                <p className="text-base font-bold text-slate-900 leading-snug">
                  {testQuestions[currentIndex].question}
                </p>

                <div className="space-y-2.5">
                  {testQuestions[currentIndex].options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => setUserAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }))}
                        className={`w-full p-4 rounded-2xl text-xs sm:text-sm text-left transition-all border ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-xs'
                            : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stepper Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-50"
                  >
                    Previous
                  </Button>

                  <Button
                    onClick={() => setMarkedForReview((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }))}
                    className={`text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border ${
                      markedForReview[currentIndex]
                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{markedForReview[currentIndex] ? 'Marked' : 'Mark Review'}</span>
                  </Button>
                </div>

                {currentIndex < testQuestions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowSubmitModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md"
                  >
                    Submit Assessment
                  </Button>
                )}
              </div>
            </Card>

            {/* SIDEBAR QUESTION NAVIGATOR (4 Cols) */}
            <div className="lg:col-span-4">
              <QuestionNavigator
                totalQuestions={testQuestions.length}
                currentIndex={currentIndex}
                userAnswers={userAnswers}
                markedForReview={markedForReview}
                onSelectQuestion={(idx) => setCurrentIndex(idx)}
              />
            </div>

          </div>
        ) : (
          /* POST-TEST DIAGNOSTIC REPORT */
          <Card className="p-6 sm:p-8 bg-white border-slate-200/80 shadow-xl rounded-3xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Award className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Placement Assessment Diagnostic</h2>
              <p className="text-xs text-slate-500">
                Score: <strong className="text-slate-900 font-mono">{scoreCount}/{testQuestions.length}</strong> ({Math.round((scoreCount / testQuestions.length) * 100)}% Accuracy)
              </p>
            </div>

            {/* Performance Bar */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">ACCURACY</span>
                <span className="text-lg font-bold text-emerald-600">
                  {Math.round((scoreCount / testQuestions.length) * 100)}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">TIME SPENT</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatTimer(1200 - timeLeftSecs)}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">EVIDENCE</span>
                <span className="text-lg font-bold text-slate-800">MODERATE</span>
              </div>
            </div>

            {/* Concept Review List */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block font-mono">
                Concept Diagnostics & Review:
              </span>
              <div className="space-y-2 text-xs">
                {testQuestions.map((q, idx) => {
                  const isCorrect = userAnswers[idx] === q.correctIndex;
                  return (
                    <div key={q.id} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                          <span className="font-semibold text-slate-800">{q.concept}</span>
                        </div>
                        <span className={`font-bold font-mono text-[11px] ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isCorrect ? 'CORRECT' : 'NEEDS WORK'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{q.explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Next Actions */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
              <span className="text-xs font-bold text-blue-800 block">Personalized Next Steps:</span>
              <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                <li>Learn <strong>OS Process Synchronization & Deadlocks</strong></li>
                <li>Practice 10 targeted Deadlock questions</li>
                <li>Retake OS timed mini-test in 3 days</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                onClick={() => navigate('/preparation/learn/dbms-normalization')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" /> Start Recommended Lesson
              </Button>
              <Button
                onClick={() => navigate('/preparation')}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                Return to Command Center
              </Button>
            </div>
          </Card>
        )}

        {/* CONFIRMATION SUBMIT MODAL */}
        <AnimatePresence>
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl"
              >
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold text-slate-900">Submit Assessment?</h3>
                  <p className="text-xs text-slate-500">
                    Are you sure you want to finish your timed assessment?
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    {answeredCount} Answered
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                    {markedCount} Marked
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                    {unansweredCount} Unanswered
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    onClick={() => setShowSubmitModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Continue Test
                  </Button>
                  <Button
                    onClick={() => handleFinishAssessment()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-xs"
                  >
                    Submit
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
