import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  Bot,
  Zap,
  Activity,
  HardDrive,
  Globe,
  Radio,
  Clock,
  ArrowRight,
  CheckCircle2,
  Search,
  Filter,
  History,
  Award,
} from 'lucide-react';
import clsx from 'clsx';
import { systemDesignApi, SystemDesignProblem, SystemDesignSession } from '../../api/systemDesign';
import { useSystemDesignStore } from '../../store/useSystemDesignStore';

export default function SystemDesignHub() {
  const navigate = useNavigate();
  const { createAndLoadSession } = useSystemDesignStore();

  const [problems, setProblems] = useState<SystemDesignProblem[]>([]);
  const [history, setHistory] = useState<SystemDesignSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [startingProblemId, setStartingProblemId] = useState<string | null>(null);

  useEffect(() => {
    async function loadHub() {
      setIsLoading(true);
      try {
        const [probs, hist] = await Promise.all([
          systemDesignApi.getProblems(),
          systemDesignApi.getHistory().catch(() => []),
        ]);
        setProblems(probs);
        setHistory(hist);
      } catch (err) {
        console.error('Error loading system design hub:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHub();
  }, []);

  const handleStartProblem = async (problemId: string) => {
    setStartingProblemId(problemId);
    try {
      const sessionId = await createAndLoadSession(problemId);
      navigate(`/system-design/studio/${sessionId}`);
    } catch (err) {
      console.error('Failed to start system design session:', err);
      setStartingProblemId(null);
    }
  };

  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = selectedDifficulty === 'ALL' || p.difficulty === selectedDifficulty;
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesDiff && matchesCat;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFD] p-6 space-y-8 select-none">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A8BDF]/20 border border-[#4A8BDF]/40 text-[#4A8BDF] text-xs font-mono font-bold">
            <Sparkles size={14} />
            <span>Interactive Whiteboard Arena</span>
          </div>

          <h1 className="text-3xl font-black font-sans tracking-tight leading-tight">
            Interactive AI System Design Studio
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Prepare for SDE-2, Senior, and Staff engineering system design rounds. Design scalable distributed architectures on an interactive drag-and-drop canvas, run deterministic capacity calculations, receive real-time graph validation, and defend trade-offs with our Socratic AI interviewer.
          </p>

          <div className="flex items-center gap-6 pt-2 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Deterministic Capacity Math</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>SPOF & Bottleneck Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>11-Dimension Rubric Scoring</span>
            </div>
          </div>
        </div>

        {/* Subtle background glow decorative */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#4A8BDF]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#DCE7F2] shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems (e.g., TinyURL, Slack, Rate Limiter, Uber)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-[#DCE7F2] rounded-xl focus:outline-none focus:bg-white focus:border-[#4A8BDF] transition-all"
          />
        </div>

        {/* Difficulty Filter Chips */}
        <div className="flex items-center gap-2">
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all',
                selectedDifficulty === diff
                  ? 'bg-[#11183D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map((problem) => {
          const isStarting = startingProblemId === problem.id;

          return (
            <div
              key={problem.id}
              className="group flex flex-col bg-white rounded-3xl border border-[#DCE7F2] p-5 shadow-xs hover:shadow-md hover:border-[#4A8BDF]/50 transition-all duration-200 text-left"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={clsx(
                    'px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider',
                    problem.difficulty === 'EASY'
                      ? 'bg-emerald-100 text-emerald-800'
                      : problem.difficulty === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  )}
                >
                  {problem.difficulty}
                </span>

                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {problem.category.replace('_', ' ')}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-base text-slate-900 group-hover:text-[#4A8BDF] transition-colors mb-2 font-sans line-clamp-1">
                {problem.title}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4 flex-1">
                {problem.summary}
              </p>

              {/* Traffic Specs Preview */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-4 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Target Scale:</span>
                  <span className="font-bold text-slate-800">
                    {(problem.trafficDefaults.dau / 1_000_000).toFixed(0)}M DAU
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Read/Write Ratio:</span>
                  <span className="font-bold text-slate-800">
                    {problem.trafficDefaults.readsPerUserPerDay / problem.trafficDefaults.writesPerUserPerDay}:1
                  </span>
                </div>
              </div>

              {/* Start Button */}
              <button
                type="button"
                disabled={isStarting}
                onClick={() => handleStartProblem(problem.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#EFFAFD] hover:bg-[#4A8BDF] text-[#4A8BDF] hover:text-white rounded-2xl text-xs font-bold font-sans transition-all duration-200 shadow-2xs group/btn disabled:opacity-50"
              >
                {isStarting ? (
                  <span>Launching Whiteboard Studio...</span>
                ) : (
                  <>
                    <span>Start System Design Round</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Recent Practice History */}
      {history.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={18} className="text-[#4A8BDF]" />
              <h2 className="font-bold text-sm text-slate-900 font-sans">
                Recent Whiteboard Practice Sessions
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/system-design/history')}
              className="text-xs font-bold text-[#4A8BDF] hover:underline"
            >
              View Full History
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {history.slice(0, 5).map((sess) => (
              <div
                key={sess.id}
                onClick={() => navigate(`/system-design/studio/${sess.id}`)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div>
                  <div className="font-bold text-xs text-slate-800">{sess.problem.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {new Date(sess.createdAt).toLocaleDateString()} • Stage {sess.stage} / 6
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {sess.score !== undefined && (
                    <span className="font-mono font-bold text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      Score: {sess.score}%
                    </span>
                  )}
                  <span className="text-xs font-bold text-[#4A8BDF] flex items-center gap-1">
                    Resume <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
