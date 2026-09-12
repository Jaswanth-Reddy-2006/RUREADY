import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Code2, Database, Brain, Cpu, Layers, 
  Sparkles, ArrowRight, CheckCircle2, Building2, X, Sliders, DollarSign, Check
} from 'lucide-react';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

interface RoadmapItem {
  id: string;
  rolePath: string;
  targetCompanyTier: string;
  overallReadiness: number;
  createdAt: string;
  customTechStack?: Record<string, string>;
}

interface PopularTrack {
  id: string;
  roleName: string;
  icon: any;
  desc: string;
  nodeCount: number;
  salaryRange: string;
  topics: string[];
  color: string;
  bg: string;
}

const POPULAR_TRACKS: PopularTrack[] = [
  {
    id: 'FULLSTACK',
    roleName: 'Fullstack Web Engineer',
    icon: Code2,
    desc: 'End-to-end web architecture, reactivity, async microservices, database indexing, and Redis rate limiting.',
    nodeCount: 4,
    salaryRange: '$120,000 - $185,000 / yr',
    topics: ['React / TS State', 'Node.js Event Loop', 'Postgres B-Trees', 'System Design & Redis'],
    color: 'border-[#4A8BDF] text-[#4A8BDF]',
    bg: 'bg-[#EFFAFD]',
  },
  {
    id: 'DATA_ANALYST',
    roleName: 'Data Analyst & Analytics Engineer',
    icon: Database,
    desc: 'Complex SQL window functions, Pandas data wrangling, memory optimization, ETL pipelines, and business KPIs.',
    nodeCount: 2,
    salaryRange: '$105,000 - $160,000 / yr',
    topics: ['SQL Windowing', 'Pandas Vectorization', 'ETL Architecture', 'Data Warehousing'],
    color: 'border-[#168A62] text-[#168A62]',
    bg: 'bg-[#E8F5F0]',
  },
  {
    id: 'AIML',
    roleName: 'AI / ML & LLM Application Specialist',
    icon: Brain,
    desc: 'RAG retrieval architectures, vector database indexing, hybrid search, model quantization, and fine-tuning.',
    nodeCount: 2,
    salaryRange: '$145,000 - $220,000 / yr',
    topics: ['RAG & Embeddings', 'Vector Search (Pinecone)', 'Prompt Engineering', 'Fine-Tuning'],
    color: 'border-[#A0006D] text-[#A0006D]',
    bg: 'bg-[#F8EAF4]',
  },
  {
    id: 'DEVOPS',
    roleName: 'DevOps & Site Reliability Engineer',
    icon: Cpu,
    desc: 'Docker containerization, Kubernetes pod autoscaling, Terraform IaC, CI/CD canary deployments, and monitoring.',
    nodeCount: 3,
    salaryRange: '$130,000 - $195,000 / yr',
    topics: ['Docker & K8s', 'Terraform IaC', 'CI/CD Pipelines', 'Prometheus Observability'],
    color: 'border-[#2459A8] text-[#2459A8]',
    bg: 'bg-[#EFFAFD]',
  },
];

export default function RoadmapCatalog() {
  const navigate = useNavigate();

  const [followedRoadmaps, setFollowedRoadmaps] = useState<RoadmapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Customization Modal State
  const [selectedPopularTrack, setSelectedPopularTrack] = useState<PopularTrack | null>(null);
  const [targetTier, setTargetTier] = useState('FAANG');
  
  // Custom Tech Stack selections
  const [frontendStack, setFrontendStack] = useState('React');
  const [backendStack, setBackendStack] = useState('Node.js');
  const [databaseStack, setDatabaseStack] = useState('PostgreSQL');
  const [cloudStack, setCloudStack] = useState('AWS & Docker');

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function loadRoadmaps() {
      try {
        const res = await apiClient.get('/roadmap/user');
        setFollowedRoadmaps(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch user roadmaps:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRoadmaps();
  }, []);

  const handleOpenCustomizer = (track: PopularTrack) => {
    setSelectedPopularTrack(track);
  };

  const handleGenerateFinalRoadmap = async () => {
    if (!selectedPopularTrack || isGenerating) return;
    setIsGenerating(true);

    try {
      const res = await apiClient.post('/roadmap/generate', {
        rolePath: selectedPopularTrack.id,
        targetCompanyTier: targetTier,
        customTechStack: {
          frontend: frontendStack,
          backend: backendStack,
          database: databaseStack,
          cloud: cloudStack,
        },
      });

      const roadmap = res.data.data;
      toast.success(`Customized Roadmap for ${selectedPopularTrack.roleName} generated!`);
      setSelectedPopularTrack(null);
      navigate(`/roadmap/${roadmap.id}`);
    } catch (err: any) {
      setIsGenerating(false);
      const msg = err.response?.data?.message || 'Failed to generate customized roadmap';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-10 px-4 sm:px-6 lg:px-8 font-body text-[#11183D]">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8EAF4] border border-[#A0006D]/30 text-[#A0006D] text-xs font-semibold font-sans uppercase tracking-wider">
            <Compass size={14} /> AI Career Tech-Tree Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-sans text-[#11183D] tracking-tight">
            Role-Based Career Roadmaps & Tech-Stack Customizer
          </h1>
          <p className="text-sm text-[#526078] max-w-2xl mx-auto font-sans leading-relaxed">
            Follow active roadmaps or pick a popular target role. Customize your exact technology stack to build your final tailored interview readiness tree.
          </p>
        </div>

        {/* SECTION 1: ROADMAPS FOLLOWED BY THE USER */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-[#11183D] flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#168A62]" />
              <span>Your Followed Roadmaps ({followedRoadmaps.length})</span>
            </h2>
            <span className="text-xs text-[#526078]">Active Progression List</span>
          </div>

          {followedRoadmaps.length === 0 ? (
            <Card className="p-8 text-center space-y-3 bg-white border-[#DCE7F2] rounded-3xl">
              <Compass size={32} className="text-[#7B8799] mx-auto" />
              <p className="text-xs text-[#526078]">
                You haven't initialized a career roadmap yet. Select a popular role below to customize your stack!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {followedRoadmaps.map((rm) => (
                <Card
                  key={rm.id}
                  onClick={() => navigate(`/roadmap/${rm.id}`)}
                  className="p-5 bg-white border-[#DCE7F2] hover:border-[#4A8BDF] shadow-sm hover:shadow-md transition-all cursor-pointer rounded-3xl space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A0006D] uppercase font-mono">
                      {rm.rolePath}
                    </span>
                    <Badge variant="eggplant" size="xs">
                      {rm.overallReadiness}% Mastered
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold font-display text-[#11183D] group-hover:text-[#4A8BDF] transition-colors">
                      {rm.rolePath} Target Path
                    </h3>
                    <p className="text-[11px] text-[#526078] mt-0.5">
                      Benchmark: {rm.targetCompanyTier} Standards
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#DCE7F2] flex items-center justify-between text-xs text-[#4A8BDF] font-bold">
                    <span>Continue Mastery</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: POPULAR & FEATURED ROADMAPS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-[#11183D] tracking-tight">
              Available Career Mastery Tracks
            </h2>
            <span className="text-xs text-[#526078]">Click any role card to view details & customize tech stack</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {POPULAR_TRACKS.map((track) => {
              const Icon = track.icon;
              return (
                <Card
                  key={track.id}
                  onClick={() => handleOpenCustomizer(track)}
                  className={`p-6 bg-white rounded-3xl border-2 transition-all cursor-pointer hover:shadow-xl hover:scale-[1.01] ${track.color} border-[#DCE7F2] space-y-4`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3.5 rounded-2xl ${track.bg} ${track.color} shrink-0 shadow-xs`}>
                      <Icon size={26} />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold font-display text-[#11183D]">
                          {track.roleName}
                        </h3>
                        <Badge variant="royal" size="xs">Popular</Badge>
                      </div>
                      <p className="text-xs text-[#526078] leading-relaxed line-clamp-2">
                        {track.desc}
                      </p>
                    </div>
                  </div>

                  {/* Topics Preview Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {track.topics.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#EFFAFD] text-[#526078] border border-[#DCE7F2]">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-3 border-t border-[#DCE7F2] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#A0006D] flex items-center gap-1 font-mono">
                      <DollarSign size={13} /> {track.salaryRange}
                    </span>
                    <span className="font-bold text-[#4A8BDF] flex items-center gap-1 font-display">
                      View Details & Customize <ArrowRight size={14} />
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

      </div>

      {/* POPULAR ROADMAP DETAILS & TECH STACK CUSTOMIZER MODAL */}
      <AnimatePresence>
        {selectedPopularTrack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#DCE7F2] rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative font-body text-[#11183D] my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPopularTrack(null)}
                className="absolute top-6 right-6 p-2 rounded-xl text-[#526078] hover:bg-[#EFFAFD] transition-all cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFFAFD] text-[#4A8BDF] text-xs font-bold font-display uppercase">
                  <Sliders size={14} /> Roadmap Details & Stack Builder
                </div>
                <h2 className="text-2xl font-extrabold font-display text-[#11183D]">
                  {selectedPopularTrack.roleName}
                </h2>
                <p className="text-xs text-[#526078] leading-relaxed">
                  {selectedPopularTrack.desc}
                </p>
              </div>

              {/* Benchmark Specs */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2]">
                <div>
                  <span className="text-[10px] font-bold text-[#7B8799] uppercase block font-display">
                    Target Compensation
                  </span>
                  <span className="text-xs font-bold text-[#A0006D] font-mono">
                    {selectedPopularTrack.salaryRange}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#7B8799] uppercase block font-display">
                    Mastery Modules
                  </span>
                  <span className="text-xs font-bold text-[#11183D] font-display">
                    {selectedPopularTrack.nodeCount} Mastery Nodes (Code + Socratic Ava)
                  </span>
                </div>
              </div>

              {/* TECH STACK CUSTOMIZER FORM */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold font-display text-[#11183D] flex items-center gap-2">
                  <Sliders size={16} className="text-[#A0006D]" />
                  <span>Customize Your Technology Stack</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Frontend */}
                  <div>
                    <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                      Frontend Framework
                    </label>
                    <select
                      value={frontendStack}
                      onChange={(e) => setFrontendStack(e.target.value)}
                      className="w-full bg-[#EFFAFD] border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-semibold text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    >
                      <option value="React">React (TypeScript / Hooks)</option>
                      <option value="Next.js">Next.js (App Router / SSR)</option>
                      <option value="Vue">Vue 3 (Composition API)</option>
                      <option value="Angular">Angular 17</option>
                    </select>
                  </div>

                  {/* Backend */}
                  <div>
                    <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                      Backend Runtime
                    </label>
                    <select
                      value={backendStack}
                      onChange={(e) => setBackendStack(e.target.value)}
                      className="w-full bg-[#EFFAFD] border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-semibold text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    >
                      <option value="Node.js">Node.js (Express / TypeScript)</option>
                      <option value="Python / FastAPI">Python (FastAPI / Asyncio)</option>
                      <option value="Go (Golang)">Go (Golang Microservices)</option>
                      <option value="Java / Spring Boot">Java (Spring Boot 3)</option>
                    </select>
                  </div>

                  {/* Database */}
                  <div>
                    <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                      Database Engine
                    </label>
                    <select
                      value={databaseStack}
                      onChange={(e) => setDatabaseStack(e.target.value)}
                      className="w-full bg-[#EFFAFD] border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-semibold text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    >
                      <option value="PostgreSQL">PostgreSQL (Relational B-Tree)</option>
                      <option value="MongoDB">MongoDB (Document Store)</option>
                      <option value="MySQL">MySQL 8.0</option>
                      <option value="Redis / DynamoDB">Redis / DynamoDB (NoSQL Key-Value)</option>
                    </select>
                  </div>

                  {/* Cloud */}
                  <div>
                    <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                      Cloud & Infrastructure
                    </label>
                    <select
                      value={cloudStack}
                      onChange={(e) => setCloudStack(e.target.value)}
                      className="w-full bg-[#EFFAFD] border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-semibold text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    >
                      <option value="AWS & Docker">AWS Services & Docker Containers</option>
                      <option value="Kubernetes & Terraform">Kubernetes Clusters & Terraform IaC</option>
                      <option value="Google Cloud (GCP)">Google Cloud Platform (GCP)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Target Company Standard Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#526078] uppercase font-display block">
                  Target Company Hiring Standard
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['FAANG', 'STARTUP', 'ENTERPRISE'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTargetTier(t)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        targetTier === t
                          ? 'bg-[#A0006D] text-white shadow-sm'
                          : 'bg-[#EFFAFD] text-[#526078] border border-[#DCE7F2]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal CTA Footer */}
              <div className="pt-4 border-t border-[#DCE7F2] flex items-center justify-between gap-3">
                <Button variant="secondary" size="sm" onClick={() => setSelectedPopularTrack(null)}>
                  Cancel
                </Button>
                <Button
                  variant="eggplant"
                  size="md"
                  onClick={handleGenerateFinalRoadmap}
                  disabled={isGenerating}
                  icon={<Sparkles size={16} />}
                  iconRight={<ArrowRight size={16} />}
                >
                  {isGenerating ? 'Synthesizing Roadmap...' : 'Create Final Customized Roadmap'}
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
