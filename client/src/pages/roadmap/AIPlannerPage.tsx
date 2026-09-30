import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, X } from 'lucide-react';
import { AIPlannerAnswers, FollowUpQuestion } from '../../components/roadmap/ai-planner/types';
import PlannerIntro from '../../components/roadmap/ai-planner/PlannerIntro';
import PlannerProgress from '../../components/roadmap/ai-planner/PlannerProgress';
import PlannerNavigation from '../../components/roadmap/ai-planner/PlannerNavigation';
import CareerGoalQuestion from '../../components/roadmap/ai-planner/CareerGoalQuestion';
import ExperienceLevelQuestion from '../../components/roadmap/ai-planner/ExperienceLevelQuestion';
import ExperienceQuestion from '../../components/roadmap/ai-planner/ExperienceQuestion';
import ObjectiveQuestion from '../../components/roadmap/ai-planner/ObjectiveQuestion';
import TimeCommitmentQuestion from '../../components/roadmap/ai-planner/TimeCommitmentQuestion';
import FocusQuestion from '../../components/roadmap/ai-planner/FocusQuestion';
import DynamicFollowUpQuestion from '../../components/roadmap/ai-planner/DynamicFollowUpQuestion';
import PlannerConfirmation from '../../components/roadmap/ai-planner/PlannerConfirmation';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'ru_ai_planner_draft';

const INITIAL_ANSWERS: AIPlannerAnswers = {
  careerGoal: { id: '', name: '' },
  experienceLevel: '',
  knownSkills: [],
  experienceTypes: [],
  experienceDescription: '',
  objectives: [],
  targetCompanies: '',
  weeklyHours: '',
  pace: 'Balanced',
  focusAreas: [],
  followUpAnswers: {},
};

export default function AIPlannerPage() {
  const navigate = useNavigate();
  const { createAiRoadmap, setActiveRoadmap } = useRoadmapStore();

  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<AIPlannerAnswers>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fall back to initial
    }
    return INITIAL_ANSWERS;
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Autosave to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // Storage unavailable
    }
  }, [answers]);

  // Compute dynamic follow-up questions based on collected answers
  const activeFollowUps = useMemo<FollowUpQuestion[]>(() => {
    const list: FollowUpQuestion[] = [];
    const roleId = answers.careerGoal.id.toLowerCase();
    const roleName = answers.careerGoal.name.toLowerCase();

    // Condition 1: Math comfort for AI/ML/Data Science without math skills
    if (
      (roleId.includes('ml') || roleId.includes('ai') || roleId.includes('data-scientist') || roleName.includes('machine learning')) &&
      !answers.knownSkills.some(s => s.toLowerCase().includes('stat') || s.toLowerCase().includes('math'))
    ) {
      list.push({
        id: 'math_comfort',
        questionText: 'How comfortable are you with math?',
        supportingText: 'Linear algebra, calculus, and statistics play a key role in ML/AI models.',
        type: 'SINGLE_SELECT',
        options: ['Comfortable', 'I know the basics', 'Not comfortable', 'Not sure'],
        conditionKey: 'math_comfort',
      });
    }

    // Condition 2: Coding experience for starting out Software Engineers / Backend
    if (
      (roleId.includes('backend') || roleId.includes('software') || roleId.includes('fullstack')) &&
      answers.experienceLevel === 'Starting out'
    ) {
      list.push({
        id: 'coding_experience',
        questionText: 'Have you written code before?',
        supportingText: 'This helps us decide if we start with logic syntax or architectural drills.',
        type: 'SINGLE_SELECT',
        options: ['Yes', 'A little', 'No'],
        conditionKey: 'coding_experience',
      });
    }

    // Condition 3: Career Switchers
    if (answers.objectives.includes('Switch Careers')) {
      list.push({
        id: 'previous_field',
        questionText: 'What field are you coming from?',
        supportingText: 'We will map transferable skills from your previous domain.',
        type: 'SINGLE_SELECT',
        options: [
          'Non-Tech Business',
          'Finance / Accounting',
          'Mechanical / Civil Engineering',
          'Healthcare',
          'Sales / Marketing',
          'Education',
          'Customer Support',
          'Student',
          'Other',
        ],
        conditionKey: 'previous_field',
      });
    }

    return list;
  }, [answers.careerGoal, answers.experienceLevel, answers.knownSkills, answers.objectives]);

  // Total steps = 6 core steps + follow-ups count
  const totalCoreSteps = 6;
  const totalSteps = totalCoreSteps + activeFollowUps.length;

  // Step validation state
  const isCurrentStepValid = useMemo(() => {
    if (step === 0) return true;
    if (step === 1) return answers.careerGoal.name.trim().length > 0;
    if (step === 2) return answers.experienceLevel !== '';
    if (step === 3) return answers.experienceTypes.length > 0;
    if (step === 4) return answers.objectives.length > 0;
    if (step === 5) return answers.weeklyHours !== '';
    if (step === 6) return answers.focusAreas.length > 0;

    // Follow up steps
    if (step > 6 && step <= 6 + activeFollowUps.length) {
      const followUpIndex = step - 7;
      const targetFollowUp = activeFollowUps[followUpIndex];
      if (targetFollowUp) {
        return !!answers.followUpAnswers[targetFollowUp.id];
      }
    }

    return true;
  }, [step, answers, activeFollowUps]);

  // Handlers for state updates
  const handleSelectRole = (role: { id: string; name: string }) => {
    setAnswers(prev => ({ ...prev, careerGoal: role }));
  };

  const handleSelectLevel = (level: string) => {
    setAnswers(prev => ({ ...prev, experienceLevel: level }));
  };

  const handleToggleSkill = (skill: string) => {
    setAnswers(prev => {
      const exists = prev.knownSkills.includes(skill);
      return {
        ...prev,
        knownSkills: exists
          ? prev.knownSkills.filter(s => s !== skill)
          : [...prev.knownSkills, skill],
      };
    });
  };

  const handleClearSkills = () => {
    setAnswers(prev => ({ ...prev, knownSkills: [] }));
  };

  const handleToggleExperienceType = (type: string) => {
    setAnswers(prev => {
      const exists = prev.experienceTypes.includes(type);
      if (type === 'Nothing yet') {
        return { ...prev, experienceTypes: ['Nothing yet'] };
      }
      const filtered = prev.experienceTypes.filter(t => t !== 'Nothing yet');
      return {
        ...prev,
        experienceTypes: exists
          ? filtered.filter(t => t !== type)
          : [...filtered, type],
      };
    });
  };

  const handleToggleObjective = (obj: string) => {
    setAnswers(prev => {
      const exists = prev.objectives.includes(obj);
      if (exists) {
        return { ...prev, objectives: prev.objectives.filter(o => o !== obj) };
      }
      if (prev.objectives.length >= 2) return prev; // max 2
      return { ...prev, objectives: [...prev.objectives, obj] };
    });
  };

  const handleToggleFocusArea = (focusId: string) => {
    setAnswers(prev => {
      const exists = prev.focusAreas.includes(focusId);
      if (exists) {
        return { ...prev, focusAreas: prev.focusAreas.filter(f => f !== focusId) };
      }
      if (prev.focusAreas.length >= 3) return prev; // max 3
      return { ...prev, focusAreas: [...prev.focusAreas, focusId] };
    });
  };

  const handleSetFollowUpAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      followUpAnswers: {
        ...prev.followUpAnswers,
        [questionId]: answer,
      },
    }));
  };

  const handleNextStep = () => {
    if (step < totalSteps + 1) {
      setStep(prev => prev + 1);
    }
  };

  const handleBackStep = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    } else {
      navigate('/roadmap');
    }
  };

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    try {
      // Map collected answers to store AI roadmap params
      const rolePath = answers.careerGoal.name || 'Software Engineer';
      const techStack = answers.knownSkills.length > 0 ? answers.knownSkills : ['Core Architecture', 'Data Structures'];
      const timelineWeeks = answers.weeklyHours.includes('20+') ? 8 : answers.weeklyHours.includes('15') ? 12 : 16;

      const newMap = await createAiRoadmap({
        rolePath,
        targetTier: 'FAANG',
        difficulty: answers.experienceLevel === 'Experienced' ? 'Advanced' : 'Intermediate',
        timelineWeeks,
        focusGaps: answers.focusAreas.join(', '),
        techStack,
      });

      localStorage.removeItem(STORAGE_KEY);
      toast.success(`Success! Personalized blueprint generated for ${rolePath}.`, { icon: '✨' });
      setActiveRoadmap(newMap.id);
      navigate(`/roadmap/${newMap.id}`);
    } catch {
      toast.error('Could not generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Render current step component
  const renderStepContent = () => {
    if (step === 0) {
      return (
        <PlannerIntro
          onStart={() => setStep(1)}
          onCancel={() => navigate('/roadmap')}
        />
      );
    }

    if (step === 1) {
      return (
        <CareerGoalQuestion
          selectedRole={answers.careerGoal}
          onSelectRole={handleSelectRole}
        />
      );
    }

    if (step === 2) {
      return (
        <ExperienceLevelQuestion
          careerRole={answers.careerGoal}
          experienceLevel={answers.experienceLevel}
          knownSkills={answers.knownSkills}
          onSelectLevel={handleSelectLevel}
          onToggleSkill={handleToggleSkill}
          onClearSkills={handleClearSkills}
        />
      );
    }

    if (step === 3) {
      return (
        <ExperienceQuestion
          selectedTypes={answers.experienceTypes}
          experienceDescription={answers.experienceDescription}
          onToggleType={handleToggleExperienceType}
          onDescriptionChange={(desc) => setAnswers(prev => ({ ...prev, experienceDescription: desc }))}
        />
      );
    }

    if (step === 4) {
      return (
        <ObjectiveQuestion
          selectedObjectives={answers.objectives}
          targetCompanies={answers.targetCompanies}
          onToggleObjective={handleToggleObjective}
          onTargetCompaniesChange={(text) => setAnswers(prev => ({ ...prev, targetCompanies: text }))}
        />
      );
    }

    if (step === 5) {
      return (
        <TimeCommitmentQuestion
          weeklyHours={answers.weeklyHours}
          pace={answers.pace}
          onSelectHours={(hrs) => setAnswers(prev => ({ ...prev, weeklyHours: hrs }))}
          onSelectPace={(p) => setAnswers(prev => ({ ...prev, pace: p }))}
        />
      );
    }

    if (step === 6) {
      return (
        <FocusQuestion
          selectedFocus={answers.focusAreas}
          onToggleFocus={handleToggleFocusArea}
        />
      );
    }

    // Dynamic Follow-Up Steps
    if (step > 6 && step <= 6 + activeFollowUps.length) {
      const followUpIndex = step - 7;
      const targetQuestion = activeFollowUps[followUpIndex];
      if (targetQuestion) {
        return (
          <DynamicFollowUpQuestion
            question={targetQuestion}
            selectedAnswer={answers.followUpAnswers[targetQuestion.id] || ''}
            onSelectAnswer={(ans) => handleSetFollowUpAnswer(targetQuestion.id, ans)}
          />
        );
      }
    }

    // Confirmation Step (step > totalSteps)
    return (
      <PlannerConfirmation
        answers={answers}
        onEdit={() => setStep(1)}
        onGenerate={handleGenerateRoadmap}
        isGenerating={isGenerating}
      />
    );
  };

  const isConfirmationStep = step > totalSteps;

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-body text-[#11183D] flex flex-col justify-between">
      {/* Top Header Bar */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between pb-4 border-b border-[#DCE7F2]">
        <button
          type="button"
          onClick={() => navigate('/roadmap')}
          className="inline-flex items-center gap-2 text-xs font-extrabold font-display text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <Compass size={16} className="text-[#2459A8]" />
          <span>Career Roadmaps</span>
        </button>

        <span className="text-xs font-bold font-display text-slate-500">
          AI Career Planner
        </span>

        <button
          type="button"
          onClick={() => navigate('/roadmap')}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          title="Exit Planner"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Form Body */}
      <div className="max-w-3xl mx-auto w-full my-auto py-6 space-y-6">
        {step > 0 && !isConfirmationStep && (
          <PlannerProgress currentStep={step} totalSteps={totalSteps} />
        )}

        {renderStepContent()}

        {step > 0 && !isConfirmationStep && (
          <PlannerNavigation
            onNext={handleNextStep}
            onBack={handleBackStep}
            canNext={isCurrentStepValid}
            canBack={step > 0}
            nextLabel={step === totalSteps ? 'Review Summary →' : 'Continue →'}
          />
        )}
      </div>

      {/* Footer minimal info */}
      <div className="max-w-3xl mx-auto w-full text-center text-[11px] text-slate-400 font-medium pt-4">
        Rennetus AI Career Planner · Confidential & Editable Anytime
      </div>
    </div>
  );
}
