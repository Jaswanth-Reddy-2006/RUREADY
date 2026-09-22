import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  PrepSubject,
  AssessmentAttempt,
  QuestionAttempt,
  PracticeSessionRecord,
  LearningProgressRecord,
  PlacementReadinessBreakdown,
  PreparationRecommendation,
} from '@ru-ready/shared';

interface PrepStoreState {
  assessmentAttempts: AssessmentAttempt[];
  practiceSessions: PracticeSessionRecord[];
  learningProgress: Record<string, LearningProgressRecord>;
  detectedWeaknesses: string[];

  // Actions
  startAssessment: (subject: PrepSubject) => string;
  recordQuestionAttempt: (attemptId: string, qa: QuestionAttempt) => void;
  completeAssessment: (attemptId: string) => AssessmentAttempt | undefined;
  recordPracticeSession: (topicId: string, correct: number, total: number, timeSecs: number, weakConcepts: string[]) => void;
  updateLearningProgress: (topicId: string, percentage: number, checkResults?: Record<number, boolean>) => void;
  addInterviewWeakness: (weaknessTopic: string) => void;

  // Computed getters
  getPlacementReadiness: () => PlacementReadinessBreakdown;
  getDynamicRecommendations: () => PreparationRecommendation[];
  getActivityLogs: () => Array<{ id: string; type: string; title: string; details: string; timestamp: string }>;
}

export const usePrepStore = create<PrepStoreState>()(
  persist(
    (set, get) => ({
      assessmentAttempts: [],
      practiceSessions: [],
      learningProgress: {},
      detectedWeaknesses: [],

      startAssessment: (subject: PrepSubject) => {
        const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newAttempt: AssessmentAttempt = {
          id: attemptId,
          userId: 'user-1',
          subject,
          startedAt: new Date().toISOString(),
          score: 0,
          accuracy: 0,
          totalQuestions: 0,
          questionAttempts: [],
          status: 'IN_PROGRESS',
        };

        set((state) => ({
          assessmentAttempts: [newAttempt, ...state.assessmentAttempts],
        }));

        return attemptId;
      },

      recordQuestionAttempt: (attemptId: string, qa: QuestionAttempt) => {
        set((state) => ({
          assessmentAttempts: state.assessmentAttempts.map((attempt) => {
            if (attempt.id === attemptId) {
              const updatedQAs = [...attempt.questionAttempts, qa];
              return {
                ...attempt,
                questionAttempts: updatedQAs,
                totalQuestions: updatedQAs.length,
              };
            }
            return attempt;
          }),
        }));
      },

      completeAssessment: (attemptId: string) => {
        const attempts = get().assessmentAttempts;
        const target = attempts.find((a) => a.id === attemptId);
        if (!target) return undefined;

        const correctCount = target.questionAttempts.filter((q) => q.isCorrect).length;
        const total = target.questionAttempts.length || 1;
        const accuracy = Math.round((correctCount / total) * 100);
        const score = accuracy;

        const completedAttempt: AssessmentAttempt = {
          ...target,
          completedAt: new Date().toISOString(),
          status: 'COMPLETED',
          score,
          accuracy,
          totalQuestions: total,
        };

        // Extract weak concepts from missed questions
        const missedConcepts = target.questionAttempts
          .filter((q) => !q.isCorrect)
          .map((q) => q.concept);

        set((state) => ({
          assessmentAttempts: state.assessmentAttempts.map((a) => (a.id === attemptId ? completedAttempt : a)),
          detectedWeaknesses: Array.from(new Set([...state.detectedWeaknesses, ...missedConcepts])),
        }));

        return completedAttempt;
      },

      recordPracticeSession: (topicId: string, correct: number, total: number, timeSecs: number, weakConcepts: string[]) => {
        const sessionRecord: PracticeSessionRecord = {
          id: `pract_${Date.now()}`,
          userId: 'user-1',
          topicId,
          totalQuestions: total,
          correctAnswers: correct,
          timeSpentSecs: timeSecs,
          weakConcepts,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          practiceSessions: [sessionRecord, ...state.practiceSessions],
          detectedWeaknesses: Array.from(new Set([...state.detectedWeaknesses, ...weakConcepts])),
        }));
      },

      updateLearningProgress: (topicId: string, percentage: number, checkResults?: Record<number, boolean>) => {
        set((state) => {
          const prev = state.learningProgress[topicId] || {
            topicId,
            completionPercentage: 0,
            status: 'NOT_STARTED',
            lastStudiedAt: new Date().toISOString(),
            quickCheckResults: {},
          };

          const newPercentage = Math.max(prev.completionPercentage, percentage);
          const newStatus = newPercentage >= 100 ? 'MASTERED' : newPercentage > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';

          return {
            learningProgress: {
              ...state.learningProgress,
              [topicId]: {
                ...prev,
                completionPercentage: newPercentage,
                status: newStatus,
                lastStudiedAt: new Date().toISOString(),
                quickCheckResults: { ...prev.quickCheckResults, ...(checkResults || {}) },
              },
            },
          };
        });
      },

      addInterviewWeakness: (weaknessTopic: string) => {
        set((state) => ({
          detectedWeaknesses: Array.from(new Set([...state.detectedWeaknesses, weaknessTopic])),
        }));
      },

      getPlacementReadiness: (): PlacementReadinessBreakdown => {
        const attempts = get().assessmentAttempts.filter((a) => a.status === 'COMPLETED');
        const practices = get().practiceSessions;

        if (attempts.length === 0 && practices.length === 0) {
          return {
            overallScore: null,
            technicalKnowledge: null,
            problemSolving: null,
            aptitude: null,
            communication: null,
            coding: null,
            coreCs: null,
            systemDesign: null,
            development: null,
            resumeScore: null,
            interviewPerformance: null,
            gaps: get().detectedWeaknesses,
            evidenceStrength: 'NOT_ASSESSED',
          };
        }

        const computeSubjectAvg = (subjects: PrepSubject[]): number | null => {
          const matchingAttempts = attempts.filter((a) => subjects.includes(a.subject));
          if (matchingAttempts.length === 0) return null;
          const sum = matchingAttempts.reduce((acc, a) => acc + a.score, 0);
          return Math.round(sum / matchingAttempts.length);
        };

        const aptitudeScore = computeSubjectAvg([
          'APTITUDE',
          'REASONING',
          'VERBAL',
          'DATA_INTERPRETATION',
        ]);

        const coreCsScore = computeSubjectAvg([
          'OOP',
          'DBMS',
          'SQL',
          'OPERATING_SYSTEMS',
          'COMPUTER_NETWORKS',
          'COMPUTER_ARCHITECTURE',
          'SOFTWARE_ENGINEERING',
        ]);

        const codingScore = computeSubjectAvg([
          'PROGRAMMING',
          'DSA',
          'CODING_PATTERNS',
          'COMPETITIVE',
        ]);

        const systemDesignScore = computeSubjectAvg([
          'LLD',
          'HLD',
          'SYSTEM_DESIGN_FUNDAMENTALS',
        ]);

        const devScore = computeSubjectAvg([
          'FRONTEND',
          'BACKEND',
          'WEB_DEV',
          'APIS',
          'GIT',
          'LINUX',
          'DEVOPS',
        ]);

        const interviewScore = computeSubjectAvg([
          'HR_BEHAVIORAL_PREP',
          'COMPANY_PREP',
          'AI_ML',
          'CYBER_SECURITY',
        ]);

        const validScores = [aptitudeScore, coreCsScore, codingScore, systemDesignScore, devScore, interviewScore].filter(
          (s): s is number => s !== null
        );

        const overallScore =
          validScores.length > 0
            ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
            : null;

        const totalAttempts = attempts.length + practices.length;
        let evidenceStrength: PlacementReadinessBreakdown['evidenceStrength'] = 'LIMITED';
        if (totalAttempts >= 5) evidenceStrength = 'STRONG';
        else if (totalAttempts >= 2) evidenceStrength = 'MODERATE';

        return {
          overallScore,
          technicalKnowledge: coreCsScore,
          problemSolving: codingScore,
          aptitude: aptitudeScore,
          communication: interviewScore,
          coding: codingScore,
          coreCs: coreCsScore,
          systemDesign: systemDesignScore,
          development: devScore,
          resumeScore: null,
          interviewPerformance: interviewScore,
          gaps: get().detectedWeaknesses,
          evidenceStrength,
        };
      },

      getDynamicRecommendations: (): PreparationRecommendation[] => {
        const weaknesses = get().detectedWeaknesses;
        const recommendations: PreparationRecommendation[] = [];

        if (weaknesses.includes('Partial Dependency') || weaknesses.includes('DBMS Normalization')) {
          recommendations.push({
            id: 'rec_dbms_norm',
            type: 'LEARN',
            title: 'DBMS Normalization: 1NF → 2NF → 3NF → BCNF',
            reason: 'Weakness detected in Partial Dependency and functional decomposition.',
            targetRoute: '/preparation/learn/dbms-normalization',
            estimatedTime: '15 mins lesson',
            priority: 'HIGH',
          });
        }

        if (weaknesses.includes('Process Synchronization') || weaknesses.includes('OS Deadlocks')) {
          recommendations.push({
            id: 'rec_os_sync',
            type: 'TEST',
            title: 'Operating Systems: Process Synchronization & Deadlocks',
            reason: 'Weakness detected in Mutex locks and Banker algorithm constraints.',
            targetRoute: '/preparation/test/core-cs',
            estimatedTime: '15 mins test',
            priority: 'HIGH',
          });
        }

        // Default recommendations if no specific weaknesses detected yet
        if (recommendations.length === 0) {
          recommendations.push(
            {
              id: 'rec_dbms_default',
              type: 'LEARN',
              title: 'DBMS Normalization: 1NF → 2NF → 3NF → BCNF',
              reason: 'Core CSE placement topic frequently asked in technical loops.',
              targetRoute: '/preparation/learn/dbms-normalization',
              estimatedTime: '15 mins lesson',
              priority: 'HIGH',
            },
            {
              id: 'rec_reasoning_default',
              type: 'PRACTICE',
              title: 'Logical Reasoning: Blood Relations & Seating Puzzles',
              reason: 'Essential requirement for campus recruitment screening rounds.',
              targetRoute: '/preparation/practice/logical-reasoning',
              estimatedTime: '10 Questions',
              priority: 'MEDIUM',
            },
            {
              id: 'rec_cs_default',
              type: 'TEST',
              title: 'Core CS: Operating Systems & Process Scheduling',
              reason: 'Validate your knowledge on SJF, Round Robin, and Deadlocks.',
              targetRoute: '/preparation/test/core-cs',
              estimatedTime: '15 mins test',
              priority: 'MEDIUM',
            }
          );
        }

        return recommendations;
      },

      getActivityLogs: () => {
        const logs: Array<{ id: string; type: string; title: string; details: string; timestamp: string }> = [];

        get().practiceSessions.forEach((p) => {
          logs.push({
            id: p.id,
            type: 'PRACTICE',
            title: `Practiced ${p.topicId.toUpperCase()}`,
            details: `Scored ${p.correctAnswers}/${p.totalQuestions} (${Math.round((p.correctAnswers / (p.totalQuestions || 1)) * 100)}%)`,
            timestamp: p.timestamp,
          });
        });

        get().assessmentAttempts.filter(a => a.status === 'COMPLETED').forEach((a) => {
          logs.push({
            id: a.id,
            type: 'TEST',
            title: `Completed ${a.subject} Assessment`,
            details: `Scored ${a.score}% (${a.questionAttempts.filter(q => q.isCorrect).length}/${a.totalQuestions} correct)`,
            timestamp: a.completedAt || a.startedAt,
          });
        });

        Object.values(get().learningProgress).forEach((lp) => {
          if (lp.completionPercentage > 0) {
            logs.push({
              id: `learn_${lp.topicId}`,
              type: 'LEARN',
              title: `Studied ${lp.topicId.toUpperCase()}`,
              details: `Progress: ${lp.completionPercentage}% completed (${lp.status})`,
              timestamp: lp.lastStudiedAt,
            });
          }
        });

        return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      },
    }),
    {
      name: 'ru_ready_prep_store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
