import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  ArrowRight,
  Award,
  AlertTriangle,
  Code2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { usePrepStore } from '../../store/usePrepStore';
import SqlPracticeRunner from '../../components/prep/SqlPracticeRunner';
import VisualReasoningWidget from '../../components/prep/VisualReasoningWidget';

export default function PracticeQuizPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [practiceMode, setPracticeMode] = useState<'TOPIC' | 'WEAK_AREA' | 'MIXED' | 'DAILY'>('TOPIC');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [startTime] = useState<number>(() => Date.now());

  const isSqlTopic = topicId === 'sql' || topicId === 'sql-joins';
  const isReasoningTopic = topicId === 'logical-reasoning' || topicId === 'seating';

  // Practice Questions
  const questions = [
    {
      id: 'q1',
      question: 'Which normal form eliminates partial dependency on a composite key?',
      options: ['1NF', '2NF', '3NF', 'BCNF'],
      correctIndex: 1,
      explanation: '2NF removes partial dependency where a non-prime attribute depends on part of a composite key.',
      concept: 'Partial Dependency',
    },
    {
      id: 'q2',
      question: 'In 3NF, transitive dependency X → Y and Y → Z is eliminated. What must be true for any non-trivial dependency X → Y in 3NF?',
      options: [
        'X must be a super key OR Y must be a prime attribute',
        'X must be atomic',
        'Y must be a foreign key',
        'X must be a candidate key only',
      ],
      correctIndex: 0,
      explanation: 'In 3NF, for any non-trivial functional dependency X → Y, X must be a super key or Y must be a prime attribute.',
      concept: 'Transitive Dependency',
    },
    {
      id: 'q3',
      question: 'Boyce-Codd Normal Form (BCNF) is stricter than 3NF. What is the strict requirement for X → Y in BCNF?',
      options: [
        'X must be a super key for EVERY functional dependency',
        'Y must be a prime attribute',
        'X must be atomic',
        'Table must have no primary key',
      ],
      correctIndex: 0,
      explanation: 'BCNF requires X to be a super key for every functional dependency X → Y, eliminating prime attribute dependencies.',
      concept: 'BCNF Strictness',
    },
    {
      id: 'q4',
      question: 'Which anomaly occurs when deleting a row removes unrelated secondary details from the database?',
      options: ['Insertion Anomaly', 'Update Anomaly', 'Deletion Anomaly', 'Redundancy Anomaly'],
      correctIndex: 2,
      explanation: 'Deletion Anomaly happens when deleting one record accidentally destroys secondary required information.',
      concept: 'Database Anomalies',
    },
  ];

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    const updatedAnswers = { ...userAnswers, [currentIndex]: selectedOption };
    setUserAnswers(updatedAnswers);

    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);

      // Record completed practice session in usePrepStore
      const finalScore = Object.entries(userAnswers).reduce((acc, [qIdxStr, optIdx]) => {
        const qIdx = Number(qIdxStr);
        return optIdx === questions[qIdx].correctIndex ? acc + 1 : acc;
      }, 0);

      const weakConcepts = questions
        .filter((q, idx) => userAnswers[idx] !== q.correctIndex)
        .map((q) => q.concept);

      const timeSpentSecs = Math.max(1, Math.round((Date.now() - startTime) / 1000));

      usePrepStore.getState().recordPracticeSession(
        topicId || 'dbms-normalization',
        finalScore,
        questions.length,
        timeSpentSecs,
        weakConcepts
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Nav */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/preparation')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Preparation Command Center
          </button>

          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 text-[11px] font-bold">
            {(['TOPIC', 'WEAK_AREA', 'MIXED', 'DAILY'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setPracticeMode(mode)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  practiceMode === mode ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600'
                }`}
              >
                {mode.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {!isQuizCompleted ? (
          <Card className="p-6 sm:p-8 bg-white border-slate-200/80 shadow-md rounded-3xl space-y-6">
            {/* Progress Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 font-mono">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>Concept: {currentQ.concept}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* If SQL Topic -> Render SQL Practice Runner */}
            {isSqlTopic ? (
              <SqlPracticeRunner />
            ) : isReasoningTopic ? (
              <div className="space-y-4">
                <VisualReasoningWidget type="SEATING" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </h2>
              </div>
            ) : (
              /* MCQ Question Text */
              <div className="space-y-3 pt-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </h2>

                {/* Options */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    let btnStyle = 'bg-white border-slate-200 hover:border-blue-300 text-slate-800';
                    if (isSelected) {
                      btnStyle = 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs font-semibold';
                    }

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                      } else {
                        btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-4 rounded-2xl text-xs sm:text-sm text-left transition-all border flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feedback & "Understand this concept" Bridge */}
            {isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${
                    selectedOption === currentQ.correctIndex ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {selectedOption === currentQ.correctIndex ? '✓ Correct Answer!' : '✕ Incorrect Answer'}
                  </span>

                  <button
                    onClick={() => navigate(`/preparation/learn/${topicId || 'dbms-normalization'}`)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Understand this concept →</span>
                  </button>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </motion.div>
            )}

            {/* Submit / Next Button */}
            <div className="pt-2 flex justify-end">
              {!isAnswerSubmitted ? (
                <Button
                  disabled={selectedOption === null && !isSqlTopic}
                  onClick={handleSubmitAnswer}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl disabled:opacity-50"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-1.5"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Practice Summary'}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        ) : (
          /* PRACTICE SUMMARY VIEW */
          <Card className="p-6 sm:p-8 bg-white border-slate-200/80 shadow-lg rounded-3xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">Practice Session Complete!</h2>
              <p className="text-xs text-slate-500 mt-1">
                You scored <strong className="text-slate-900 font-mono">{score} out of {questions.length}</strong> ({Math.round((score / questions.length) * 100)}%).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Accuracy</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">
                  {Math.round((score / questions.length) * 100)}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Average Time</span>
                <span className="text-lg font-bold text-blue-600 font-mono">42 sec / question</span>
              </div>
            </div>

            {/* Concept Level Performance */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-left text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider block font-mono text-[11px]">
                Concept Breakdown:
              </span>
              <div className="space-y-1.5 font-mono">
                <div className="flex items-center justify-between">
                  <span>Normalization basics</span>
                  <span className="text-emerald-600 font-bold">100%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>2NF Partial Dependency</span>
                  <span className="text-amber-600 font-bold">50%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>3NF Transitive Dependency</span>
                  <span className="text-emerald-600 font-bold">75%</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                onClick={() => navigate(`/preparation/learn/${topicId || 'dbms-normalization'}`)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" /> Learn This Concept
              </Button>

              <Button
                onClick={() => {
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setIsAnswerSubmitted(false);
                  setScore(0);
                  setIsQuizCompleted(false);
                }}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Practice Again
              </Button>

              <Button
                onClick={() => navigate('/preparation')}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                Return to Command Center
              </Button>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
