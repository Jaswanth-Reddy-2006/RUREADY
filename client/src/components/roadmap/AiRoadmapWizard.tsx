import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Brain, Cpu, Database, Code2, Layers, 
  Clock, Target, Building2, Check, ArrowRight, RefreshCw,
  CheckCircle2, Flame, Award
} from 'lucide-react';
import { useRoadmapStore, Roadmap } from '../../store/useRoadmapStore';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface AiRoadmapWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (generatedRoadmap: Roadmap) => void;
}

const ROLES = [
  { id: 'FULLSTACK', name: 'Fullstack Web Engineer', icon: Code2, desc: 'React 19, Node.js, PostgreSQL, Distributed Caching' },
  { id: 'AIML', name: 'AI / ML & LLM Specialist', icon: Brain, desc: 'RAG, Vector DBs, Fine-tuning, vLLM inference' },
  { id: 'DEVOPS', name: 'Cloud Native DevOps & SRE', icon: Cpu, desc: 'Kubernetes, Terraform, Prometheus, CI/CD' },
  { id: 'SYSTEM_DESIGN', name: 'High-Frequency Distributed Backend', icon: Layers, desc: 'Go, Kafka, Raft Consensus, Distributed Locks' },
  { id: 'DATA', name: 'Data Lakehouse & Streaming', icon: Database, desc: 'PySpark, ClickHouse, dbt, Airflow Pipelines' },
  { id: 'FRONTEND', name: 'Frontend Architecture & Next.js', icon: Code2, desc: 'Next.js 15, Server Components, Web Vitals' },
];

const TIERS = [
  { id: 'FAANG', name: 'FAANG / Top Tech Tier', badge: 'High Bar', desc: 'Deep distributed systems, algorithmic efficiency & scale' },
  { id: 'Tier-1 FinTech', name: 'Tier-1 FinTech', badge: 'Sub-millisecond', desc: 'Ultra-low latency, strict ACID consistency & concurrency' },
  { id: 'Unicorn', name: 'High-Growth Unicorn', badge: 'Modern Stack', desc: 'Rapid feature velocity, event streaming & cloud native' },
  { id: 'High-Growth Startup', name: 'Early-Stage Startup', badge: 'Scrappy', desc: 'End-to-end autonomy, zero-to-one product shipping' },
];

const SUGGESTED_TECH = [
  'React 19', 'Next.js 15', 'TypeScript', 'Node.js', 'Go', 'Rust', 'Python',
  'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'AWS', 'PyTorch',
  'Vector DB (Pinecone)', 'System Design', 'GraphQL', 'Tailwind CSS'
];

export default function AiRoadmapWizard({
  isOpen,
  onClose,
  onSuccess,
}: AiRoadmapWizardProps) {
  const { createAiRoadmap } = useRoadmapStore();

  const [selectedRole, setSelectedRole] = useState('FULLSTACK');
  const [selectedTier, setSelectedTier] = useState('FAANG');
  const [difficulty, setDifficulty] = useState('Advanced');
  const [selectedTech, setSelectedTech] = useState<string[]>(['React 19', 'Node.js', 'PostgreSQL', 'Redis']);
  const [timelineWeeks, setTimelineWeeks] = useState(8);
  const [customFocus, setCustomFocus] = useState('Deep dive into database indexing, Redis rate limiting, and Socratic architectural defense.');

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisStage, setSynthesisStage] = useState(0);

  if (!isOpen) return null;

  const toggleTech = (tech: string) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter((t) => t !== tech));
    } else {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  const handleStartAiGeneration = async () => {
    setIsSynthesizing(true);
    setSynthesisStage(1);

    // Dynamic synthesis animation steps
    const timer1 = setTimeout(() => setSynthesisStage(2), 700);
    const timer2 = setTimeout(() => setSynthesisStage(3), 1500);
    const timer3 = setTimeout(() => setSynthesisStage(4), 2200);

    try {
      const generated = await createAiRoadmap({
        rolePath: selectedRole,
        targetTier: selectedTier,
        difficulty,
        timelineWeeks,
        techStack: selectedTech.length > 0 ? selectedTech : ['Fullstack Core'],
        focusGaps: customFocus,
      });

      setTimeout(() => {
        setIsSynthesizing(false);
        toast.success(`AI Career Roadmap for ${selectedRole} created!`);
        onSuccess(generated);
        onClose();
      }, 2900);
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsSynthesizing(false);
      toast.error('Failed to generate AI roadmap');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs font-body text-[#11183D]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-white border border-[#DCE7F2] rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-[#EFFAFD] border-b border-[#DCE7F2] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#A0006D] to-[#4A8BDF] text-white flex items-center justify-center font-display shadow-xs">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold font-display text-[#11183D]">
                  AI Career Roadmap Synthesis Co-Pilot
                </h2>
                <p className="text-xs text-[#526078]">
                  Ava AI calibrates an actionable curriculum with 'What should I do?', 'What is the source?', and 'What is the exact thing?'.
                </p>
              </div>
            </div>

            {!isSynthesizing && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#526078] hover:bg-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isSynthesizing ? (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#2459A8] via-[#4A8BDF] to-[#A0006D] flex items-center justify-center text-white shadow-xl animate-pulse">
                    <Brain size={36} />
                  </div>
                  <RefreshCw size={24} className="absolute -bottom-2 -right-2 text-[#4A8BDF] animate-spin" />
                </div>

                <div className="space-y-2 max-w-md">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">
                    Synthesizing Tailored Career Roadmap...
                  </h3>
                  <div className="space-y-2 text-xs font-medium text-[#526078] text-left bg-[#EFFAFD] p-4 rounded-2xl border border-[#DCE7F2]">
                    <p className={`flex items-center gap-2 ${synthesisStage >= 1 ? 'text-[#2459A8] font-bold' : 'opacity-40'}`}>
                      {synthesisStage >= 1 ? <CheckCircle2 size={14} className="text-[#168A62]" /> : <span className="w-3.5 h-3.5 rounded-full border border-current" />}
                      Calibrating {selectedTier} hiring bar benchmarks...
                    </p>
                    <p className={`flex items-center gap-2 ${synthesisStage >= 2 ? 'text-[#2459A8] font-bold' : 'opacity-40'}`}>
                      {synthesisStage >= 2 ? <CheckCircle2 size={14} className="text-[#168A62]" /> : <span className="w-3.5 h-3.5 rounded-full border border-current" />}
                      Generating milestones: 'What should I do?' & mental models...
                    </p>
                    <p className={`flex items-center gap-2 ${synthesisStage >= 3 ? 'text-[#2459A8] font-bold' : 'opacity-40'}`}>
                      {synthesisStage >= 3 ? <CheckCircle2 size={14} className="text-[#168A62]" /> : <span className="w-3.5 h-3.5 rounded-full border border-current" />}
                      Curating verified sources & documentation references...
                    </p>
                    <p className={`flex items-center gap-2 ${synthesisStage >= 4 ? 'text-[#2459A8] font-bold' : 'opacity-40'}`}>
                      {synthesisStage >= 4 ? <CheckCircle2 size={14} className="text-[#168A62]" /> : <span className="w-3.5 h-3.5 rounded-full border border-current" />}
                      Synthesizing concrete drills ('What is the exact thing?')...
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* 1. Target Role Selection */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                    1. Select Target Career Track
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ROLES.map((role) => {
                      const Icon = role.icon;
                      const isSel = selectedRole === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer flex items-start gap-3 ${
                            isSel
                              ? 'border-[#4A8BDF] bg-[#EFFAFD] shadow-xs'
                              : 'border-[#DCE7F2] bg-white hover:border-[#4A8BDF]/40'
                          }`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 ${isSel ? 'bg-[#4A8BDF] text-white' : 'bg-[#EFFAFD] text-[#526078]'}`}>
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold font-display text-[#11183D] truncate">{role.name}</p>
                            <p className="text-[10px] text-[#526078] line-clamp-1">{role.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Target Company Tier */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                    2. Target Hiring Standard & Company Tier
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TIERS.map((tier) => {
                      const isSel = selectedTier === tier.id;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSelectedTier(tier.id)}
                          className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                            isSel
                              ? 'border-[#A0006D] bg-[#F8EAF4]/50 shadow-xs'
                              : 'border-[#DCE7F2] bg-white hover:border-[#A0006D]/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold font-display text-[#11183D]">{tier.name}</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-white border border-[#DCE7F2] text-[#A0006D]">
                              {tier.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#526078]">{tier.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Tech Stack Pills */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                    3. Primary Tech Stack & Focus Tools (Select relevant)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TECH.map((tech) => {
                      const isSel = selectedTech.includes(tech);
                      return (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => toggleTech(tech)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-display transition-all cursor-pointer ${
                            isSel
                              ? 'bg-[#2459A8] text-white shadow-xs'
                              : 'bg-[#EFFAFD] text-[#526078] hover:bg-[#DCE7F2]'
                          }`}
                        >
                          {tech}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Timeline & Custom Weakness Focus */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                      Preparation Timeline
                    </label>
                    <select
                      value={timelineWeeks}
                      onChange={(e) => setTimelineWeeks(Number(e.target.value))}
                      className="w-full bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl p-2.5 text-xs text-[#11183D] font-medium focus:outline-none"
                    >
                      <option value={4}>4 Weeks (Express Sprint)</option>
                      <option value={8}>8 Weeks (Comprehensive Track)</option>
                      <option value={12}>12 Weeks (Deep-Dive Mastery)</option>
                      <option value={24}>24 Weeks (Staff / Principal Transformation)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                      Seniority Calibrated
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl p-2.5 text-xs text-[#11183D] font-medium focus:outline-none"
                    >
                      <option value="Beginner">Junior / Associate</option>
                      <option value="Intermediate">Mid-Level Software Engineer</option>
                      <option value="Advanced">Senior Software Engineer</option>
                      <option value="Staff">Staff / Principal Architect</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                      Custom Goals & Targeted Weaknesses
                    </label>
                    <textarea
                      rows={2}
                      value={customFocus}
                      onChange={(e) => setCustomFocus(e.target.value)}
                      placeholder="e.g. Focus on database indexing, sliding-window rate limiters, and Socratic interview defense."
                      className="w-full p-3 text-xs bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Footer Action */}
          {!isSynthesizing && (
            <div className="p-4 sm:p-5 bg-[#EFFAFD] border-t border-[#DCE7F2] flex items-center justify-between shrink-0">
              <span className="text-xs text-[#526078]">
                Ava AI generates structured milestones with code drills & reading sources.
              </span>

              <div className="flex items-center gap-3">
                <Button variant="secondary" size="md" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="eggplant"
                  size="md"
                  onClick={handleStartAiGeneration}
                  icon={<Sparkles size={15} />}
                  className="shadow-md"
                >
                  Synthesize AI Roadmap
                </Button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
