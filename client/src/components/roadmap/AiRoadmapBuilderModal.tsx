import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Check, ArrowRight, ArrowLeft, Target,
  Clock, DollarSign, BookOpen, Layers, CheckCircle2, ShieldCheck, Zap
} from 'lucide-react';
import { useRoadmapStore, Roadmap } from '../../store/useRoadmapStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

interface AiRoadmapBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newRoadmap: Roadmap) => void;
  onOpenPersonalize?: () => void;
}

export default function AiRoadmapBuilderModal({
  isOpen,
  onClose,
  onSuccess,
  onOpenPersonalize,
}: AiRoadmapBuilderModalProps) {
  const { createAiRoadmap } = useRoadmapStore();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<Roadmap | null>(null);

  // Form State
  const [goalType, setGoalType] = useState('Become Software Engineer');
  const [customGoal, setCustomGoal] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [targetCompany, setTargetCompany] = useState('Amazon');
  const [currentSkills, setCurrentSkills] = useState('JavaScript, React, basic SQL');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate (1-2 yrs)');
  const [timeCommitment, setTimeCommitment] = useState('1.5 hours/day');
  const [budgetOption, setBudgetOption] = useState('Free only');
  const [learningStyle, setLearningStyle] = useState('Project-Heavy & Practical');

  if (!isOpen) return null;

  const goalOptions = [
    'Become a Software Engineer',
    'Become an ML / AI Engineer',
    'Prepare for Amazon SDE',
    'Prepare for Google SWE',
    'Full Stack Web Developer',
    'Crack Campus Placements',
    'Custom Career Goal',
  ];

  const timeOptions = [
    '30 min/day (Casual)',
    '1 hour/day (Consistent)',
    '1.5 hours/day (Recommended)',
    '3+ hours/day (Intensive)',
  ];

  const budgetOptions = [
    'Free only (Open Source & Docs)',
    'Under $25/month (Light Paid)',
    'Under $50/month (Premium Courses)',
    'Flexible Budget',
  ];

  const learningStyleOptions = [
    'Project-Heavy & Practical Drills',
    'Theory-First & Deep Mechanics',
    'Interview-Focused & LeetCode/DSA',
    'Fast-Paced Crash Track',
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast('AI Synthesis Engine generating personalized roadmap...', { icon: '🤖' });

    try {
      const newMap = await createAiRoadmap({
        rolePath: targetRole || 'Full Stack',
        targetTier: (targetCompany.includes('Amazon') || targetCompany.includes('Google') ? 'FAANG' : 'Unicorn') as any,
        difficulty: experienceLevel.includes('Intermediate') ? 'Intermediate' : 'Advanced',
        timelineWeeks: timeCommitment.includes('3+') ? 14 : 24,
        techStack: currentSkills.split(',').map((s) => s.trim()).filter(Boolean),
        focusGaps: `Focus on ${targetCompany} interview requirements with ${budgetOption} resources.`,
      });

      setGeneratedResult(newMap);
      setCurrentStep(6); // Show result preview step
      toast.success('Personalized AI Roadmap Generated!');
    } catch {
      toast.error('Failed to synthesize AI roadmap.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFollowGenerated = () => {
    if (generatedResult) {
      onSuccess(generatedResult);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl border border-[#DCE7F2] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-body text-[#11183D]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#DCE7F2] bg-gradient-to-r from-[#F8EAF4] via-white to-[#EFFAFD]">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-2xl bg-[#A0006D] text-white shadow-xs">
                <Sparkles size={20} />
              </span>
              <div>
                <span className="text-[10px] font-bold font-mono text-[#A0006D] uppercase tracking-wider block">
                  AI Career Planner Wizard
                </span>
                <h2 className="text-xl font-bold font-display text-[#11183D]">
                  {currentStep <= 5 ? `Step ${currentStep} of 5: AI Roadmap Generator` : 'Your Personalized AI Roadmap'}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#7B8799] hover:text-[#11183D] hover:bg-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Step 1: Goal */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold font-display text-[#11183D]">
                  What is your primary career goal?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {goalOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setGoalType(opt)}
                      className={`p-4 rounded-2xl border text-left text-xs font-bold font-display transition-all cursor-pointer ${
                        goalType === opt
                          ? 'bg-[#F8EAF4] text-[#A0006D] border-[#A0006D] shadow-xs'
                          : 'bg-white text-[#11183D] border-[#DCE7F2] hover:border-[#4A8BDF]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {goalType === 'Custom Career Goal' && (
                  <Input
                    label="Specify Custom Goal"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="e.g. Become a Distributed Systems Engineer in 6 months"
                  />
                )}
              </div>
            )}

            {/* Step 2: Background */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold font-display text-[#11183D]">
                  Target Role, Company & Current Background
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Target Role Title"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Backend Software Engineer"
                  />
                  <Input
                    label="Target Company / Tier"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g. Amazon, Google, FAANG"
                  />
                </div>

                <Input
                  label="Current Skills (comma separated)"
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  placeholder="e.g. Java, Python, SQL, Git"
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#11183D]">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full saas-input p-3 text-xs"
                  >
                    <option value="Beginner (Student / Entry)">Beginner (Student / Entry Level)</option>
                    <option value="Intermediate (1-2 yrs)">Intermediate (1–2 Years Experience)</option>
                    <option value="Advanced (3+ yrs)">Advanced (3+ Years Experience)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Time Commitment */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold font-display text-[#11183D]">
                  How much time can you commit daily?
                </h3>
                <div className="space-y-2.5">
                  {timeOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTimeCommitment(opt)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs font-bold font-display transition-all cursor-pointer flex items-center justify-between ${
                        timeCommitment === opt
                          ? 'bg-[#EFFAFD] text-[#2459A8] border-[#4A8BDF] shadow-xs'
                          : 'bg-white text-[#11183D] border-[#DCE7F2] hover:border-[#4A8BDF]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-[#4A8BDF]" />
                        <span>{opt}</span>
                      </div>
                      {timeCommitment === opt && <Check size={16} className="text-[#2459A8]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Budget */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold font-display text-[#11183D]">
                  Resource Budget Preferences
                </h3>
                <div className="space-y-2.5">
                  {budgetOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setBudgetOption(opt)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs font-bold font-display transition-all cursor-pointer flex items-center justify-between ${
                        budgetOption === opt
                          ? 'bg-[#E8F5F0] text-[#168A62] border-[#168A62]/40 shadow-xs'
                          : 'bg-white text-[#11183D] border-[#DCE7F2] hover:border-[#168A62]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <DollarSign size={16} className="text-[#168A62]" />
                        <span>{opt}</span>
                      </div>
                      {budgetOption === opt && <Check size={16} className="text-[#168A62]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Learning Style */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold font-display text-[#11183D]">
                  Preferred Learning Style & Focus
                </h3>
                <div className="space-y-2.5">
                  {learningStyleOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLearningStyle(opt)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs font-bold font-display transition-all cursor-pointer flex items-center justify-between ${
                        learningStyle === opt
                          ? 'bg-[#F8EAF4] text-[#A0006D] border-[#A0006D] shadow-xs'
                          : 'bg-white text-[#11183D] border-[#DCE7F2] hover:border-[#A0006D]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen size={16} className="text-[#A0006D]" />
                        <span>{opt}</span>
                      </div>
                      {learningStyle === opt && <Check size={16} className="text-[#A0006D]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Generated Result Preview */}
            {currentStep === 6 && generatedResult && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#F8EAF4]/80 via-white to-[#EFFAFD] p-6 rounded-3xl border-2 border-[#A0006D]/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold font-display bg-[#A0006D] text-white">
                      AI Generated Preview
                    </span>
                    <span className="text-xs font-bold font-mono text-[#168A62] bg-[#E8F5F0] px-3 py-1 rounded-full border border-[#168A62]/30">
                      78% AI Confidence Score
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#A0006D] uppercase tracking-wider block mb-1">
                      Target Role: {targetRole} ({targetCompany})
                    </span>
                    <h3 className="text-xl font-bold font-display text-[#11183D]">
                      {generatedResult.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="bg-white p-3 rounded-2xl border border-[#DCE7F2] text-center">
                      <span className="block text-[10px] font-semibold text-[#7B8799] uppercase">Duration</span>
                      <span className="text-sm font-extrabold font-mono text-[#11183D]">22-28 Wks</span>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-[#DCE7F2] text-center">
                      <span className="block text-[10px] font-semibold text-[#7B8799] uppercase">Daily Commitment</span>
                      <span className="text-sm font-extrabold font-mono text-[#4A8BDF]">1.5 Hours</span>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-[#DCE7F2] text-center">
                      <span className="block text-[10px] font-semibold text-[#7B8799] uppercase">Resource Budget</span>
                      <span className="text-sm font-extrabold font-mono text-[#168A62]">Free Track</span>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-[#DCE7F2] text-center">
                      <span className="block text-[10px] font-semibold text-[#7B8799] uppercase">Readiness</span>
                      <span className="text-sm font-extrabold font-mono text-[#A0006D]">42% Initial</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-display text-[#7B8799] uppercase tracking-wider">
                    Synthesized Milestones ({generatedResult.nodesData.length})
                  </h4>
                  {generatedResult.nodesData.map((node, i) => (
                    <div key={node.id} className="p-3.5 rounded-2xl border border-[#DCE7F2] bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#EFFAFD] text-[#2459A8] font-mono text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold font-display text-[#11183D]">{node.title}</p>
                          <p className="text-[11px] text-[#526078]">{node.subHeader}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#7B8799]">~{node.estimatedHours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-5 border-t border-[#DCE7F2] bg-[#EFFAFD] flex items-center justify-between gap-3">
            {currentStep > 1 && currentStep <= 5 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="text-xs font-display border-[#DCE7F2]"
                icon={<ArrowLeft size={14} />}
              >
                Back
              </Button>
            )}

            {currentStep < 5 && (
              <Button
                variant="royal"
                size="sm"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="ml-auto text-xs font-display flex items-center gap-2"
                icon={<ArrowRight size={14} />}
              >
                Next Step
              </Button>
            )}

            {currentStep === 5 && (
              <Button
                variant="eggplant"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="ml-auto text-xs font-display flex items-center gap-2 shadow-sm"
                icon={<Sparkles size={14} />}
              >
                {isGenerating ? 'Synthesizing...' : 'Synthesize AI Roadmap'}
              </Button>
            )}

            {currentStep === 6 && (
              <div className="w-full flex items-center justify-between gap-3">
                {onOpenPersonalize && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onOpenPersonalize}
                    className="text-xs font-display border-[#DCE7F2] bg-white"
                  >
                    Personalize Prompt
                  </Button>
                )}

                <Button
                  variant="eggplant"
                  size="sm"
                  onClick={handleFollowGenerated}
                  className="ml-auto text-xs font-display flex items-center gap-2 shadow-sm"
                  icon={<CheckCircle2 size={14} />}
                >
                  Follow This Roadmap
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
