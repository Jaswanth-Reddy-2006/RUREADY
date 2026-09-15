import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Trash2, ArrowUp, ArrowDown, Target, BookOpen, 
  Code2, Save, Sparkles, Layers, ShieldCheck, Check, 
  HelpCircle, Globe, Lock, FileCode
} from 'lucide-react';
import { Roadmap, RoadmapNode, RoadmapSourceItem, useRoadmapStore } from '../../store/useRoadmapStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

interface ManualRoadmapBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newRoadmap: Roadmap) => void;
  initialTemplate?: Partial<Roadmap>;
}

export default function ManualRoadmapBuilder({
  isOpen,
  onClose,
  onSuccess,
  initialTemplate,
}: ManualRoadmapBuilderProps) {
  const { user } = useAuthStore();
  const { createManualRoadmap } = useRoadmapStore();

  // Roadmap General Information
  const [title, setTitle] = useState(initialTemplate?.title || '');
  const [rolePath, setRolePath] = useState(initialTemplate?.rolePath || 'FULLSTACK');
  const [targetCompanyTier, setTargetCompanyTier] = useState<Roadmap['targetCompanyTier']>(
    initialTemplate?.targetCompanyTier || 'FAANG'
  );
  const [difficulty, setDifficulty] = useState<Roadmap['difficulty']>(
    initialTemplate?.difficulty || 'Intermediate'
  );
  const [estimatedWeeks, setEstimatedWeeks] = useState(initialTemplate?.estimatedWeeks || 8);
  const [description, setDescription] = useState(
    initialTemplate?.description ||
      'A structured, sequential engineering curriculum designed to master core concepts, build concrete drills, and defend architectural decisions.'
  );
  const [isPublic, setIsPublic] = useState(true);

  // Sequential Steps ("one after another")
  const [steps, setSteps] = useState<RoadmapNode[]>(() => {
    if (initialTemplate?.nodesData && initialTemplate.nodesData.length > 0) {
      return initialTemplate.nodesData;
    }
    return [
      {
        id: `step-1-${Date.now()}`,
        title: 'Foundational System Architecture & State Patterns',
        subHeader: 'Phase 1 • Core Architecture Fundamentals',
        category: 'Architecture',
        orderIndex: 1,
        status: 'IN_PROGRESS',
        score: 0,
        estimatedHours: 15,
        whatShouldIDo: {
          summary: 'Understand the fundamental execution model, component boundaries, and reactive state propagation.',
          actionSteps: [
            'Break down memory allocation and concurrency lifecycle.',
            'Establish clean architectural layers between UI, business rules, and data access.'
          ],
          mentalModels: [
            'Single Source of Truth: State should have exactly one owner to avoid synchronization drift.'
          ]
        },
        whatIsTheSource: [
          {
            id: 'src-init-1',
            title: 'Official Documentation & Standards Guide',
            url: 'https://developer.mozilla.org',
            type: 'DOCS',
            description: 'Core runtime specifications and official references.'
          }
        ],
        whatIsTheExactThing: {
          title: 'Reactive State Architecture Sandbox Drill',
          description: 'Build a practical, end-to-end component or microservice that handles concurrent state transitions smoothly.',
          deliverable: 'Tested module with zero race conditions and automated verification tests.',
          starterCode: `// Step 1 Practical Drill Starter Code\nexport function runDrill() {\n  console.log("Executing drill verification...");\n}`,
          verificationChecklist: [
            'Clean separation of concerns',
            'Passing automated unit test harness'
          ]
        },
        microQuestions: [
          {
            id: 'mq-init-1',
            questionText: 'Explain the core architectural trade-off of your chosen state management model.',
            focus: 'Design Trade-offs',
            suggestedAnswer: 'Explicit unidirectional data flows offer high predictability and easy debugging at the cost of slight boilerplate compared to bidirectional data binding.'
          }
        ]
      }
    ];
  });

  if (!isOpen) return null;

  // Add Step one after another
  const handleAddStep = () => {
    const nextOrder = steps.length + 1;
    const newStep: RoadmapNode = {
      id: `step-${nextOrder}-${Date.now()}`,
      title: `Milestone ${nextOrder}: Specialized Engineering Skill`,
      subHeader: `Phase ${nextOrder} • Next Sequential Competency`,
      category: 'Advanced Practice',
      orderIndex: nextOrder,
      status: 'LOCKED',
      score: 0,
      estimatedHours: 16,
      whatShouldIDo: {
        summary: 'Formulate core mental models and actionable execution steps for this engineering module.',
        actionSteps: [
          'Analyze failure modes and edge cases.',
          'Review reference implementations.'
        ],
        mentalModels: [
          'Design for failure: Assume networks are unreliable and dependencies can timeout.'
        ]
      },
      whatIsTheSource: [
        {
          id: `src-${Date.now()}`,
          title: 'Recommended Reference Docs & Handbook',
          url: 'https://github.com',
          type: 'DOCS',
          description: 'Core reading material for this milestone.'
        }
      ],
      whatIsTheExactThing: {
        title: `Practical Deliverable for Milestone 0${nextOrder}`,
        description: 'Construct a tangible project or coding drill that demonstrates production-readiness.',
        deliverable: 'A running prototype with verified test suite.',
        starterCode: `// Starter drill for Milestone ${nextOrder}\nexport async function executeModule() {\n  return true;\n}`,
        verificationChecklist: ['Automated tests pass', 'Handles unexpected edge cases']
      },
      microQuestions: [
        {
          id: `mq-${Date.now()}`,
          questionText: 'What is the primary trade-off of this implementation?',
          focus: 'Architectural Defense',
          suggestedAnswer: 'Evaluate memory vs CPU, and consistency vs latency.'
        }
      ]
    };

    setSteps([...steps, newStep]);
    toast.success(`Step 0${nextOrder} added to roadmap sequence!`);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) {
      toast.error('A roadmap must have at least 1 milestone step.');
      return;
    }
    const updated = steps
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, orderIndex: i + 1 }));
    setSteps(updated);
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;

    const copy = [...steps];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    // re-index
    const reindexed = copy.map((s, i) => ({ ...s, orderIndex: i + 1 }));
    setSteps(reindexed);
  };

  const handleUpdateStepField = (index: number, fieldPath: string, value: any) => {
    setSteps((prev) => {
      const copy = [...prev];
      const step = { ...copy[index] };

      if (fieldPath === 'title') step.title = value;
      else if (fieldPath === 'subHeader') step.subHeader = value;
      else if (fieldPath === 'category') step.category = value;
      else if (fieldPath === 'estimatedHours') step.estimatedHours = Number(value) || 10;
      else if (fieldPath === 'whatShouldIDo.summary') {
        step.whatShouldIDo = { ...step.whatShouldIDo, summary: value };
      } else if (fieldPath === 'whatIsTheExactThing.title') {
        step.whatIsTheExactThing = { ...step.whatIsTheExactThing, title: value };
      } else if (fieldPath === 'whatIsTheExactThing.description') {
        step.whatIsTheExactThing = { ...step.whatIsTheExactThing, description: value };
      } else if (fieldPath === 'whatIsTheExactThing.deliverable') {
        step.whatIsTheExactThing = { ...step.whatIsTheExactThing, deliverable: value };
      } else if (fieldPath === 'whatIsTheExactThing.starterCode') {
        step.whatIsTheExactThing = { ...step.whatIsTheExactThing, starterCode: value };
      }

      copy[index] = step;
      return copy;
    });
  };

  const handleAddSource = (stepIndex: number) => {
    setSteps((prev) => {
      const copy = [...prev];
      const step = { ...copy[stepIndex] };
      const newSrc: RoadmapSourceItem = {
        id: `src-${Date.now()}`,
        title: 'New Curated Documentation',
        url: 'https://',
        type: 'DOCS',
        description: 'Reference link for study'
      };
      step.whatIsTheSource = [...(step.whatIsTheSource || []), newSrc];
      copy[stepIndex] = step;
      return copy;
    });
  };

  const handleUpdateSource = (stepIndex: number, srcIndex: number, key: keyof RoadmapSourceItem, val: string) => {
    setSteps((prev) => {
      const copy = [...prev];
      const step = { ...copy[stepIndex] };
      const sources = [...(step.whatIsTheSource || [])];
      sources[srcIndex] = { ...sources[srcIndex], [key]: val };
      step.whatIsTheSource = sources;
      copy[stepIndex] = step;
      return copy;
    });
  };

  const handleRemoveSource = (stepIndex: number, srcIndex: number) => {
    setSteps((prev) => {
      const copy = [...prev];
      const step = { ...copy[stepIndex] };
      step.whatIsTheSource = (step.whatIsTheSource || []).filter((_, i) => i !== srcIndex);
      copy[stepIndex] = step;
      return copy;
    });
  };

  const handlePublishRoadmap = () => {
    if (!title.trim()) {
      toast.error('Please provide a title for your Career Roadmap.');
      return;
    }

    if (steps.length === 0) {
      toast.error('Please add at least one sequential step.');
      return;
    }

    const newRoadmap = createManualRoadmap({
      title,
      rolePath,
      category: (rolePath.toUpperCase() as any) || 'FULLSTACK',
      targetCompanyTier,
      difficulty,
      description,
      estimatedWeeks: Number(estimatedWeeks) || 8,
      isOfficial: false,
      isPublic,
      isAiGenerated: false,
      creatorId: user?.id || 'current-user',
      creatorName: user?.name || 'Jaswanth Reddy',
      creatorUsername: user?.name ? user.name.toLowerCase().replace(/\s+/g, '_') : 'jaswanth_reddy',
      creatorAvatar: (user as any)?.avatarUrl || '',
      creatorRole: `Custom Track Author`,
      tags: [rolePath, targetCompanyTier, `${estimatedWeeks}w Track`],
      nodesData: steps,
    });

    toast.success(`Career Roadmap "${title}" created successfully!`);
    onSuccess(newRoadmap);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs font-body text-[#11183D]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-white border border-[#DCE7F2] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Top Bar */}
          <div className="p-5 sm:p-6 bg-[#EFFAFD] border-b border-[#DCE7F2] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2459A8] to-[#4A8BDF] text-white flex items-center justify-center font-display shadow-xs">
                <Layers size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold font-display text-[#11183D]">
                  Manual Career Roadmap Builder
                </h2>
                <p className="text-xs text-[#526078]">
                  Design your custom sequential curriculum step-by-step with headers, instructions, sources & exact drills.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#526078] hover:bg-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 1. ROADMAP GENERAL METADATA */}
            <div className="p-5 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs space-y-4">
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-[#11183D] flex items-center gap-2">
                <span>1. Roadmap Blueprint Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Roadmap Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Fullstack & Cloud Systems Architect"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#11183D] block mb-1.5 font-display">
                    Target Engineering Role
                  </label>
                  <select
                    value={rolePath}
                    onChange={(e) => setRolePath(e.target.value)}
                    className="w-full bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl p-2.5 text-xs text-[#11183D] font-medium focus:outline-none focus:border-[#4A8BDF]"
                  >
                    <option value="FULLSTACK">Fullstack Web Engineer</option>
                    <option value="AIML">AI / ML & LLM Specialist</option>
                    <option value="DEVOPS">Cloud Native DevOps & SRE</option>
                    <option value="SYSTEM_DESIGN">High-Frequency Distributed Systems</option>
                    <option value="DATA">Data Lakehouse & Streaming</option>
                    <option value="FRONTEND">Frontend Performance & Web UI</option>
                    <option value="MOBILE">Mobile Systems (iOS / React Native)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#11183D] block mb-1.5 font-display">
                    Target Company Tier
                  </label>
                  <select
                    value={targetCompanyTier}
                    onChange={(e) => setTargetCompanyTier(e.target.value as any)}
                    className="w-full bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl p-2.5 text-xs text-[#11183D] font-medium focus:outline-none focus:border-[#4A8BDF]"
                  >
                    <option value="FAANG">FAANG / Top Tech Benchmark</option>
                    <option value="Tier-1 FinTech">Tier-1 FinTech / High-Frequency</option>
                    <option value="Unicorn">High-Growth Unicorn</option>
                    <option value="High-Growth Startup">Early-Stage Startup</option>
                    <option value="Enterprise">Global Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#11183D] block mb-1.5 font-display">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl p-2.5 text-xs text-[#11183D] font-medium focus:outline-none focus:border-[#4A8BDF]"
                  >
                    <option value="Beginner">Beginner / Junior</option>
                    <option value="Intermediate">Intermediate (Mid-Level)</option>
                    <option value="Advanced">Advanced (Senior)</option>
                    <option value="Staff">Staff / Principal Architect</option>
                  </select>
                </div>

                <div>
                  <Input
                    label="Estimated Duration (Weeks)"
                    type="number"
                    value={estimatedWeeks}
                    onChange={(e) => setEstimatedWeeks(Number(e.target.value) || 8)}
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-[#11183D] font-display">
                    Track Overview & Objectives
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 text-xs bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-between p-3.5 bg-[#EFFAFD] rounded-2xl border border-[#DCE7F2]">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#11183D] flex items-center gap-1.5">
                      {isPublic ? <Globe size={14} className="text-[#168A62]" /> : <Lock size={14} className="text-[#526078]" />}
                      <span>{isPublic ? 'Public Marketplace Listing' : 'Private Track'}</span>
                    </p>
                    <p className="text-[11px] text-[#526078]">
                      {isPublic 
                        ? 'Allow other candidates to view, preview, and clone this roadmap on your profile and the community catalog.' 
                        : 'Only visible to you in your dashboard.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPublic(!isPublic)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-colors cursor-pointer ${
                      isPublic 
                        ? 'bg-[#168A62] text-white' 
                        : 'bg-[#DCE7F2] text-[#526078]'
                    }`}
                  >
                    {isPublic ? 'Public' : 'Private'}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. SEQUENTIAL STEP-BY-STEP BUILDER ("one after another") */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold font-display text-[#11183D]">
                    Sequential Steps (Milestones)
                  </h3>
                  <p className="text-xs text-[#526078]">
                    Add milestones one after another. Each step requires a Header & Sub-header, 'What should I do?', 'What is the source?', and 'What is the exact thing?'.
                  </p>
                </div>

                <Button
                  variant="royal"
                  size="sm"
                  onClick={handleAddStep}
                  icon={<Plus size={14} />}
                >
                  Add Next Step
                </Button>
              </div>

              {/* Steps Cards List */}
              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-5 rounded-2xl bg-white border-2 border-[#DCE7F2] shadow-sm space-y-5 relative"
                  >
                    {/* Step Top Controls */}
                    <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#4A8BDF] text-white flex items-center justify-center text-xs font-black font-display shadow-xs">
                          0{idx + 1}
                        </div>
                        <span className="text-xs font-bold text-[#11183D] font-display">
                          Sequential Step #{idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[#526078]">
                        <button
                          type="button"
                          onClick={() => handleMoveStep(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg hover:bg-[#EFFAFD] disabled:opacity-30 cursor-pointer"
                          title="Move step up"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveStep(idx, 'down')}
                          disabled={idx === steps.length - 1}
                          className="p-1.5 rounded-lg hover:bg-[#EFFAFD] disabled:opacity-30 cursor-pointer"
                          title="Move step down"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer ml-1"
                          title="Delete step"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Step Header & Sub-header Form */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <Input
                          label="Step Header / Title"
                          value={step.title}
                          onChange={(e) => handleUpdateStepField(idx, 'title', e.target.value)}
                          placeholder="e.g. PostgreSQL Index Structures & B-Tree Execution Plans"
                        />
                      </div>
                      <div>
                        <Input
                          label="Sub-header / Milestone Phase"
                          value={step.subHeader}
                          onChange={(e) => handleUpdateStepField(idx, 'subHeader', e.target.value)}
                          placeholder="e.g. Phase 2 • Database Engineering Core"
                        />
                      </div>
                    </div>

                    {/* PILLAR 1: What Should I Do? */}
                    <div className="p-4 rounded-xl bg-[#EFFAFD]/50 border border-[#DCE7F2] space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold font-display uppercase tracking-wider text-[#2459A8]">
                        <Target size={14} className="text-[#4A8BDF]" />
                        <span>Pillar 1: What Should I Do?</span>
                      </div>
                      <textarea
                        rows={3}
                        value={step.whatShouldIDo?.summary || ''}
                        onChange={(e) => handleUpdateStepField(idx, 'whatShouldIDo.summary', e.target.value)}
                        placeholder="Provide clear, actionable directives on what concepts the candidate must study, mental models to adopt, and design principles to master..."
                        className="w-full p-2.5 text-xs bg-white border border-[#DCE7F2] rounded-xl text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                      />
                    </div>

                    {/* PILLAR 2: What Is The Source? */}
                    <div className="p-4 rounded-xl bg-[#E8F5F0]/50 border border-[#DCE7F2] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold font-display uppercase tracking-wider text-[#168A62]">
                          <BookOpen size={14} className="text-[#168A62]" />
                          <span>Pillar 2: What Is The Source? (Curated References)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddSource(idx)}
                          className="text-[11px] font-bold text-[#168A62] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={12} /> Add Source Link
                        </button>
                      </div>

                      <div className="space-y-2">
                        {step.whatIsTheSource?.map((src, srcIdx) => (
                          <div key={src.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-white p-2.5 rounded-xl border border-[#DCE7F2]">
                            <div className="sm:col-span-4">
                              <input
                                type="text"
                                value={src.title}
                                onChange={(e) => handleUpdateSource(idx, srcIdx, 'title', e.target.value)}
                                placeholder="Resource Title (e.g. Postgres Index Docs)"
                                className="w-full text-xs p-1.5 bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-lg text-[#11183D]"
                              />
                            </div>
                            <div className="sm:col-span-5">
                              <input
                                type="text"
                                value={src.url}
                                onChange={(e) => handleUpdateSource(idx, srcIdx, 'url', e.target.value)}
                                placeholder="https://..."
                                className="w-full text-xs p-1.5 bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-lg text-[#11183D]"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <select
                                value={src.type}
                                onChange={(e) => handleUpdateSource(idx, srcIdx, 'type', e.target.value as any)}
                                className="w-full text-xs p-1.5 bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-lg text-[#11183D]"
                              >
                                <option value="DOCS">DOCS</option>
                                <option value="COURSE">COURSE</option>
                                <option value="REPO">REPO</option>
                                <option value="BOOK">BOOK</option>
                                <option value="ARTICLE">ARTICLE</option>
                              </select>
                            </div>
                            <div className="sm:col-span-1 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveSource(idx, srcIdx)}
                                className="text-rose-500 hover:text-rose-700 cursor-pointer p-1"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PILLAR 3: What Is The Exact Thing? */}
                    <div className="p-4 rounded-xl bg-[#F8EAF4]/50 border border-[#DCE7F2] space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold font-display uppercase tracking-wider text-[#A0006D]">
                        <Code2 size={14} className="text-[#A0006D]" />
                        <span>Pillar 3: What Is The Exact Thing? (Hands-on Drill / Deliverable)</span>
                      </div>

                      <div className="space-y-2">
                        <Input
                          label="Exact Project / Drill Title"
                          value={step.whatIsTheExactThing?.title || ''}
                          onChange={(e) => handleUpdateStepField(idx, 'whatIsTheExactThing.title', e.target.value)}
                          placeholder="e.g. Million-Row Query Execution Optimization Drill"
                        />

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#11183D] font-display">
                            Exact Deliverable Requirement
                          </label>
                          <textarea
                            rows={2}
                            value={step.whatIsTheExactThing?.deliverable || ''}
                            onChange={(e) => handleUpdateStepField(idx, 'whatIsTheExactThing.deliverable', e.target.value)}
                            placeholder="What tangible output must be built? (e.g. A SQL script demonstrating EXPLAIN ANALYZE < 10ms with zero sequential table scans)"
                            className="w-full p-2.5 text-xs bg-white border border-[#DCE7F2] rounded-xl text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#11183D] font-display flex items-center gap-1.5">
                            <FileCode size={13} />
                            <span>Starter Code Template (Optional)</span>
                          </label>
                          <textarea
                            rows={3}
                            value={step.whatIsTheExactThing?.starterCode || ''}
                            onChange={(e) => handleUpdateStepField(idx, 'whatIsTheExactThing.starterCode', e.target.value)}
                            placeholder="// Starter code for candidates to solve in the Monaco sandbox drill"
                            className="w-full p-2.5 text-xs bg-[#1E1E1E] text-[#E0E0E0] font-mono rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-center">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleAddStep}
                  className="w-full border-dashed border-[#4A8BDF] text-[#2459A8] hover:bg-[#EFFAFD] py-3"
                  icon={<Plus size={16} />}
                >
                  + Add Next Sequential Step ({steps.length + 1})
                </Button>
              </div>
            </div>

          </div>

          {/* Footer Save / Publish Action */}
          <div className="p-4 sm:p-5 bg-[#EFFAFD] border-t border-[#DCE7F2] flex items-center justify-between shrink-0">
            <span className="text-xs text-[#526078]">
              Total: <strong>{steps.length} sequential steps</strong> configured.
            </span>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="royal"
                size="md"
                onClick={handlePublishRoadmap}
                icon={<Save size={15} />}
                className="shadow-md"
              >
                Publish Career Roadmap
              </Button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
