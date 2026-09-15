import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Award,
  Filter,
  Check,
  Zap
} from 'lucide-react';
import { APTITUDE_QUESTIONS, APTITUDE_CATEGORIES, AptitudeQuestion } from '../../data/aptitude.data';

export default function AptitudeHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mode, setMode] = useState<'practice' | 'timed'>('practice');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  
  // Timed Assessment State
  const [timerSeconds, setTimerSeconds] = useState<number>(15 * 60);
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (mode === 'timed' && !testSubmitted && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTestSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, testSubmitted, timerSeconds]);

  const filteredQuestions = APTITUDE_QUESTIONS.filter((q) => {
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  });

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (mode === 'timed' && testSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    if (mode === 'practice') {
      setShowExplanation((prev) => ({ ...prev, [questionId]: true }));
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowExplanation({});
    setTimerSeconds(15 * 60);
    setTestSubmitted(false);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Score Calculations
  const totalAnswered = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).reduce((acc, [qid, selectedIdx]) => {
    const q = APTITUDE_QUESTIONS.find((item) => item.id === qid);
    return q && q.correctOptionIndex === selectedIdx ? acc + 1 : acc;
  }, 0);

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DCE7F2] shadow-xs text-xs font-bold text-[#4A8BDF]">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Campus Screening Aptitude Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#11183D] tracking-tight font-sans">
            Aptitude & Cognitive Reasoning
          </h1>
          <p className="text-sm sm:text-base text-[#526078]">
            Master Quantitative Aptitude, Logical Reasoning, Verbal Ability, and Technical Pseudocode tested in Round 1 of TCS, Infosys, Accenture, and Wipro.
          </p>
        </div>

        {/* Mode Switcher & Stats Bar */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE7F2] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMode('practice');
                setTestSubmitted(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
                mode === 'practice'
                  ? 'bg-[#11183D] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#526078] hover:bg-slate-100 border border-[#DCE7F2]'
              }`}
            >
              📚 Practice Mode (Instant Answers)
            </button>
            <button
              onClick={() => {
                setMode('timed');
                handleReset();
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
                mode === 'timed'
                  ? 'bg-[#A0006D] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#526078] hover:bg-slate-100 border border-[#DCE7F2]'
              }`}
            >
              ⏱️ Timed Mock Test (15 Mins)
            </button>
          </div>

          <div className="flex items-center gap-4">
            {mode === 'timed' && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-mono font-bold text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
            )}

            <div className="text-xs font-bold text-[#11183D] flex items-center gap-1.5">
              <span className="text-[#7E8B9B]">Score:</span>
              <span className="text-emerald-600 font-extrabold">{correctCount}</span>
              <span className="text-[#7E8B9B]">/ {filteredQuestions.length}</span>
            </div>

            <button
              onClick={handleReset}
              className="p-2 rounded-full hover:bg-slate-100 text-[#7E8B9B] hover:text-[#11183D] transition-colors"
              title="Reset Test"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {APTITUDE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold font-sans transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#11183D] text-white shadow-sm'
                  : 'bg-white text-[#526078] hover:bg-[#F8FAFC] border border-[#DCE7F2]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Timed Test Submission Banner */}
        {mode === 'timed' && testSubmitted && (
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-md text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#11183D] font-sans">
              Test Completed! Your Final Score: {correctCount} / {filteredQuestions.length} ({Math.round((correctCount / filteredQuestions.length) * 100)}%)
            </h3>
            <p className="text-xs text-[#526078] max-w-md mx-auto">
              {correctCount >= 3 ? '🎉 Excellent! You cleared the sectional cutoff for TCS NQT and Infosys!' : 'Keep practicing! Review the formulas and shortcuts below to improve speed.'}
            </p>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.map((q, qIndex) => {
            const selectedOpt = userAnswers[q.id];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = isAnswered && selectedOpt === q.correctOptionIndex;
            const revealExplanation = mode === 'practice' ? showExplanation[q.id] : testSubmitted;

            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCE7F2] shadow-sm space-y-5"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#DCE7F2]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-[#EFFAFD] text-[#4A8BDF] font-extrabold text-xs flex items-center justify-center font-mono border border-[#DCE7F2]">
                      {qIndex + 1}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[#11183D]">{q.topic}</span>
                      <span className="text-[10px] text-[#7E8B9B] ml-2">({q.category})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {q.companyTags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-semibold text-[#7E8B9B] bg-[#F8FAFC] border border-[#DCE7F2] px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Question Body */}
                <p className="text-sm font-semibold text-[#11183D] leading-relaxed">
                  {q.question}
                </p>

                {q.codeSnippet && (
                  <pre className="p-3.5 rounded-xl bg-[#0F172A] text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const isThisCorrect = optIdx === q.correctOptionIndex;

                    let btnStyle = 'bg-[#F8FAFC] border-[#DCE7F2] text-[#526078] hover:bg-slate-100 hover:border-slate-300';

                    if (revealExplanation) {
                      if (isThisCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isSelected && !isThisCorrect) {
                        btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-[#11183D] text-white font-bold border-[#11183D]';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {revealExplanation && isThisCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {revealExplanation && isSelected && !isThisCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {revealExplanation && (
                  <div className="p-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-2 text-xs">
                    {q.formulaOrShortcut && (
                      <div className="flex items-start gap-2 text-[#4A8BDF] font-semibold bg-white p-2.5 rounded-xl border border-[#DCE7F2]">
                        <Zap className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                        <span><strong>Shortcut Formula:</strong> {q.formulaOrShortcut}</span>
                      </div>
                    )}
                    <p className="text-[#526078] leading-relaxed whitespace-pre-line">
                      <strong>Step-by-Step Solution:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Timed Mode Submit Button */}
        {mode === 'timed' && !testSubmitted && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setTestSubmitted(true)}
              className="px-8 py-3.5 rounded-full bg-[#11183D] hover:bg-[#1E293B] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Submit Mock Assessment
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
