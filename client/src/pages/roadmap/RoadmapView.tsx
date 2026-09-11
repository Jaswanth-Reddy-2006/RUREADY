import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Award, CheckCircle2, Lock, Play, ArrowRight, 
  Sparkles, Code2, BookOpen, MessageSquare, ChevronRight, X,
  Building2, Zap, RefreshCw, Check
} from 'lucide-react';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Editor from '@monaco-editor/react';

interface RoadmapNode {
  id: string;
  title: string;
  category: string;
  status: 'LOCKED' | 'IN_PROGRESS' | 'MASTERED';
  score: number;
  orderIndex: number;
  summary: string;
  concepts: string[];
  codeSnippet: string;
  microQuestions: Array<{
    id: string;
    questionText: string;
    focus: string;
  }>;
}

interface RoadmapData {
  id: string;
  rolePath: string;
  targetCompanyTier: string;
  overallReadiness: number;
  nodesData: RoadmapNode[];
}

export default function RoadmapView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [activeTab, setActiveTab] = useState<'learn' | 'code' | 'defend'>('learn');
  const [codeAnswer, setCodeAnswer] = useState('');
  const [verbalAnswer, setVerbalAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const res = await apiClient.get(`/roadmap/${id}`);
        setRoadmap(res.data.data);
      } catch (err) {
        console.error('Failed to fetch roadmap:', err);
        toast.error('Failed to load Career Roadmap');
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoadmap();
  }, [id]);

  const handleOpenNode = (node: RoadmapNode) => {
    if (node.status === 'LOCKED') {
      toast.error('Complete preceding nodes to unlock this skill module.');
      return;
    }
    setSelectedNode(node);
    setCodeAnswer(node.codeSnippet || '');
    setVerbalAnswer('');
    setActiveTab('learn');
  };

  const handleSubmitNode = async () => {
    if (!selectedNode || !roadmap || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await apiClient.post(`/roadmap/${roadmap.id}/nodes/${selectedNode.id}/submit`, {
        codeAnswer,
        verbalAnswer,
      });

      const updatedRoadmap = res.data.data.roadmap;
      setRoadmap(updatedRoadmap);
      toast.success(`Node "${selectedNode.title}" Mastered! +Readiness updated.`);
      setSelectedNode(null);
    } catch (err: any) {
      toast.error('Failed to complete node challenge.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EFFAFD] flex items-center justify-center font-body text-[#11183D]">
        <div className="text-center space-y-3">
          <RefreshCw size={32} className="animate-spin text-[#4A8BDF] mx-auto" />
          <p className="text-xs font-bold font-display text-[#526078]">Rendering Interactive Tech-Tree...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-[#EFFAFD] flex items-center justify-center p-4 font-body">
        <Card className="p-8 text-center space-y-4 max-w-md bg-white border-[#DCE7F2]">
          <h2 className="text-lg font-bold font-display text-[#11183D]">Roadmap Not Found</h2>
          <Button variant="royal" onClick={() => navigate('/roadmap')}>
            Return to Roadmap Catalog
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-8 px-4 sm:px-6 lg:px-8 font-body text-[#11183D]">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Readiness & Header Card */}
        <Card className="p-6 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#F8EAF4] text-[#A0006D] uppercase font-display">
                  {roadmap.rolePath}
                </span>
                <span className="text-xs font-semibold text-[#526078]">
                  Target: {roadmap.targetCompanyTier} Benchmark
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
                Career Skill Mastery Canvas
              </h1>
            </div>

            {/* Readiness Meter */}
            <div className="flex items-center gap-4 bg-[#EFFAFD] p-4 rounded-2xl border border-[#DCE7F2]">
              <div className="text-right">
                <span className="text-2xl font-black font-display text-[#A0006D]">
                  {roadmap.overallReadiness}%
                </span>
                <span className="text-[10px] font-bold text-[#526078] block uppercase">
                  Target Hiring Readiness
                </span>
              </div>
              <Award size={32} className="text-[#A0006D]" />
            </div>
          </div>
        </Card>

        {/* Interactive Skill Tech-Tree Node Canvas */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-display text-[#11183D]">
              Mastery Nodes ({roadmap.nodesData.filter((n) => n.status === 'MASTERED').length} of {roadmap.nodesData.length} Mastered)
            </h2>
            <span className="text-xs text-[#526078] font-body">
              Click node to unlock Learn, Code, and Ava Micro-Interview
            </span>
          </div>

          <div className="relative space-y-6">
            {/* Visual Connecting Vertical Cable Line */}
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-[#DCE7F2] -z-0" />

            {roadmap.nodesData.map((node, idx) => {
              const isMastered = node.status === 'MASTERED';
              const isInProgress = node.status === 'IN_PROGRESS';
              const isLocked = node.status === 'LOCKED';

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative z-10"
                >
                  <Card
                    onClick={() => handleOpenNode(node)}
                    className={`p-6 bg-white rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between gap-6 ${
                      isMastered
                        ? 'border-[#168A62] shadow-sm hover:shadow-md'
                        : isInProgress
                        ? 'border-[#4A8BDF] shadow-lg ring-4 ring-[#4A8BDF]/10'
                        : 'border-[#DCE7F2] opacity-65 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      {/* Node Status Circle Badge */}
                      <div
                        className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 font-display font-extrabold text-sm ${
                          isMastered
                            ? 'bg-[#168A62] text-white shadow-sm'
                            : isInProgress
                            ? 'bg-[#4A8BDF] text-white shadow-md animate-pulse'
                            : 'bg-[#DCE7F2] text-[#526078]'
                        }`}
                      >
                        {isMastered ? <CheckCircle2 size={22} /> : isLocked ? <Lock size={20} /> : `0${idx + 1}`}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#A0006D] uppercase font-mono">
                            {node.category}
                          </span>
                          <span className="text-xs text-[#526078]">• Node 0{idx + 1}</span>
                        </div>
                        <h3 className="text-base font-bold font-display text-[#11183D] truncate">
                          {node.title}
                        </h3>
                        <p className="text-xs text-[#526078] leading-relaxed line-clamp-1">
                          {node.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isMastered && <Badge variant="success" size="xs">MASTERED</Badge>}
                      {isInProgress && <Badge variant="royal" size="xs">IN PROGRESS</Badge>}
                      {isLocked && <Badge variant="neutral" size="xs">LOCKED</Badge>}
                      <ChevronRight size={18} className="text-[#526078]" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      {/* NODE CHALLENGE DRAWER MODAL */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="bg-white border border-[#DCE7F2] rounded-3xl w-full max-w-2xl h-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-body text-[#11183D]"
            >
              {/* Drawer Header */}
              <div className="p-5 bg-[#EFFAFD] border-b border-[#DCE7F2] flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[10px] font-bold text-[#A0006D] uppercase font-mono">
                    {selectedNode.category}
                  </span>
                  <h3 className="text-lg font-bold font-display text-[#11183D]">
                    {selectedNode.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-2 rounded-xl text-[#526078] hover:bg-white transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabs Bar */}
              <div className="h-11 shrink-0 bg-white border-b border-[#DCE7F2] px-4 flex items-center gap-2">
                {[
                  { id: 'learn', label: '1. Learn Concepts', icon: BookOpen },
                  { id: 'code', label: '2. Code & Practice', icon: Code2 },
                  { id: 'defend', label: '3. Ava Defense', icon: MessageSquare },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSel = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#EFFAFD] text-[#4A8BDF] border border-[#DCE7F2]'
                          : 'text-[#526078] hover:text-[#11183D]'
                      }`}
                    >
                      <Icon size={13} className={isSel ? 'text-[#4A8BDF]' : ''} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {/* TAB 1: LEARN CONCEPTS */}
                {activeTab === 'learn' && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#526078] leading-relaxed">
                      {selectedNode.summary}
                    </p>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#11183D] uppercase tracking-wider font-display">
                        High-Yield Concepts & Patterns
                      </h4>
                      <ul className="space-y-2">
                        {selectedNode.concepts.map((concept, i) => (
                          <li key={i} className="p-3 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] text-xs text-[#11183D] flex items-start gap-2">
                            <Sparkles size={14} className="text-[#4A8BDF] shrink-0 mt-0.5" />
                            <span>{concept}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* TAB 2: CODE & PRACTICE */}
                {activeTab === 'code' && (
                  <div className="space-y-3 h-full flex flex-col">
                    <h4 className="text-xs font-bold text-[#11183D] uppercase tracking-wider font-display">
                      Monaco Code Sandbox Drill
                    </h4>
                    <div className="h-64 rounded-2xl overflow-hidden border border-[#DCE7F2] bg-[#1E1E1E]">
                      <Editor
                        height="100%"
                        language="typescript"
                        theme="vs-dark"
                        value={codeAnswer}
                        onChange={(val) => setCodeAnswer(val || '')}
                        options={{
                          fontSize: 13,
                          fontFamily: 'JetBrains Mono, Fira Code, monospace',
                          minimap: { enabled: false },
                          lineNumbers: 'on',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: AVA DEFENSE */}
                {activeTab === 'defend' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#11183D] uppercase tracking-wider font-display">
                      Ava Micro-Interview Socratic Defense
                    </h4>

                    {selectedNode.microQuestions.map((mq, i) => (
                      <div key={mq.id} className="p-4 rounded-2xl bg-[#F8EAF4] border border-[#A0006D]/30 space-y-2">
                        <span className="text-[10px] font-bold text-[#A0006D] uppercase">
                          Question 0{i + 1} • Focus: {mq.focus}
                        </span>
                        <p className="text-xs font-bold text-[#11183D]">
                          {mq.questionText}
                        </p>
                      </div>
                    ))}

                    <textarea
                      rows={4}
                      value={verbalAnswer}
                      onChange={(e) => setVerbalAnswer(e.target.value)}
                      placeholder="Explain your approach out loud or type your Socratic defense here..."
                      className="w-full bg-[#EFFAFD]/40 border border-[#DCE7F2] rounded-2xl p-3 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                  </div>
                )}

              </div>

              {/* Drawer Footer CTA */}
              <div className="p-4 bg-[#EFFAFD] border-t border-[#DCE7F2] flex items-center justify-between shrink-0">
                <Button variant="secondary" size="sm" onClick={() => setSelectedNode(null)}>
                  Cancel
                </Button>
                <Button
                  variant="eggplant"
                  size="sm"
                  onClick={handleSubmitNode}
                  disabled={isSubmitting}
                  icon={<Check size={14} />}
                >
                  {isSubmitting ? 'Verifying Challenge...' : 'Complete Node & Master Skill'}
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
