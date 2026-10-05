import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Brain,
  Check,
} from 'lucide-react';
import Button from '../ui/Button';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { AssessmentAttemptResultDTO } from '@ru-ready/shared';
import toast from 'react-hot-toast';

interface MicroAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId?: string;
  skillId?: string;
  skillName?: string;
  sprintId?: string;
  sprintTaskId?: string;
  userRoadmapId?: string;
  onAssessmentCompleted?: (result: AssessmentAttemptResultDTO) => void;
}

export default function MicroAssessmentModal({
  isOpen,
  onClose,
  nodeId,
  skillId,
  skillName,
  sprintId,
  sprintTaskId,
  userRoadmapId,
  onAssessmentCompleted,
}: MicroAssessmentModalProps) {
  const {
    currentAssessment,
    isAssessmentLoading,
    fetchAssessmentForNode,
    submitAssessmentAnswers,
    clearCurrentAssessment,
  } = useRoadmapStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentAttemptResultDTO | null>(null);

  useEffect(() => {
    if (isOpen && nodeId) {
      setAssessmentResult(null);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      fetchAssessmentForNode(nodeId, skillId).catch(() => {
        toast.error('Failed to load micro-assessment questions');
      });
    } else if (!isOpen) {
      clearCurrentAssessment();
    }
  }, [isOpen, nodeId, skillId]);

  if (!isOpen) return null;

  const questions = currentAssessment?.questions || [];
  const activeQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = totalQuestions > 0 && answeredCount === totalQuestions;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (assessmentResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!currentAssessment) return;
    if (!isAllAnswered) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);
    const answersPayload = Object.entries(selectedAnswers).map(([qId, optIdx]) => ({
      questionId: qId,
      selectedOptionIndex: optIdx,
    }));

    const response = await submitAssessmentAnswers({
      assessmentId: currentAssessment.id,
      userRoadmapId,
      sprintId,
      sprintTaskId,
      skillId,
      answers: answersPayload,
    });

    setIsSubmitting(false);

    if (response.success && response.result) {
      setAssessmentResult(response.result);
      if (response.result.passed) {
        toast.success(`Assessment Passed! Score: ${response.result.score}%`, {
          icon: '🏆',
        });
      } else {
        toast('Assessment completed. Review feedback below.', {
          icon: '📝',
        });
      }
      onAssessmentCompleted?.(response.result);
    } else {
      toast.error(response.error || 'Failed to submit assessment answers');
    }
  };

  const handleRetake = () => {
    setAssessmentResult(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {currentAssessment?.title || 'Micro-Assessment'}
                </h3>
                <p className="text-xs text-neutral-400">
                  {skillName || currentAssessment?.skillName || 'Skill Verification & Evidence'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isAssessmentLoading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 mx-auto border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-neutral-400">Loading assessment questions...</p>
              </div>
            ) : assessmentResult ? (
              /* Assessment Results View */
              <div className="space-y-6">
                <div
                  className={`p-6 rounded-2xl border text-center space-y-3 ${
                    assessmentResult.passed
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <div className="inline-flex p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-inner">
                    {assessmentResult.passed ? (
                      <Award className="w-10 h-10 text-emerald-400" />
                    ) : (
                      <HelpCircle className="w-10 h-10 text-amber-400" />
                    )}
                  </div>
                  <h4 className="text-2xl font-bold text-white">
                    Score: {assessmentResult.score}%
                  </h4>
                  <p className="text-sm">
                    {assessmentResult.passed
                      ? `Mastery Verified! (${assessmentResult.correctAnswers}/${assessmentResult.totalQuestions} correct)`
                      : `Needs Reinforcement (${assessmentResult.correctAnswers}/${assessmentResult.totalQuestions} correct)`}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {assessmentResult.evidenceRecorded && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Skill Evidence Recorded in Roadmap
                      </div>
                    )}
                    {assessmentResult.adaptationRecommendation && (
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${
                          assessmentResult.adaptationRecommendation.decision === 'ACCELERATE'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : assessmentResult.adaptationRecommendation.decision === 'REMEDIATE'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Adaptation: {assessmentResult.adaptationRecommendation.decision}
                      </div>
                    )}
                  </div>
                  {assessmentResult.adaptationRecommendation && (
                    <p className="text-xs text-neutral-300 max-w-md mx-auto pt-1">
                      {assessmentResult.adaptationRecommendation.reason}
                    </p>
                  )}
                </div>

                {/* Per-Question Explanations */}
                <div className="space-y-4">
                  <h5 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
                    Question Breakdown & Explanations
                  </h5>
                  {assessmentResult.questionResults.map((qRes, idx) => (
                    <div
                      key={qRes.questionId}
                      className={`p-4 rounded-xl border space-y-2 ${
                        qRes.isCorrect
                          ? 'bg-neutral-950/60 border-emerald-500/30'
                          : 'bg-neutral-950/60 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs font-semibold text-neutral-400">
                          Q{idx + 1}
                        </span>
                        <div className="flex items-center gap-1 text-xs">
                          {qRes.isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                              <CheckCircle2 className="w-4 h-4" /> Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-400 font-medium">
                              <XCircle className="w-4 h-4" /> Incorrect
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-white">{qRes.questionText}</p>
                      {qRes.explanation && (
                        <p className="text-xs text-neutral-300 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                          <span className="font-semibold text-indigo-400">Explanation: </span>
                          {qRes.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : activeQuestion ? (
              /* Active Question Taking View */
              <div className="space-y-6">
                {/* Progress Bar & Counter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>
                      Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                    <span>{answeredCount} answered</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                      style={{
                        width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question Text */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 mb-2">
                    Conceptual Check
                  </span>
                  <h4 className="text-base font-semibold text-white leading-relaxed">
                    {activeQuestion.questionText}
                  </h4>
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {activeQuestion.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[activeQuestion.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(activeQuestion.id, optIdx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                            : 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:bg-neutral-800/40'
                        }`}
                      >
                        <span className="text-sm font-medium">{option}</span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500 text-white'
                              : 'border-neutral-700 bg-neutral-900'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-neutral-400">
                No questions available for this assessment.
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950/60">
            {assessmentResult ? (
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Retake
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onClose}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                >
                  Previous
                </Button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
                    }
                    className="bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    Next <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!isAllAnswered || isSubmitting}
                    onClick={handleSubmit}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    {isSubmitting ? (
                      'Evaluating...'
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-1.5" /> Submit Assessment
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
