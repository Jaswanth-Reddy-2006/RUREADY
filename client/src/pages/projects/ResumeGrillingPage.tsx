import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Target, 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  Video, 
  FileText,
  RotateCcw
} from 'lucide-react';

interface GrillingQuestion {
  id: string;
  question: string;
  category: 'Scale & Concurrency' | 'Architecture & Tradeoffs' | 'Failure Recovery' | 'Database Design';
  hint: string;
}

export default function ResumeGrillingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialProjectName = searchParams.get('project') || '';

  const [projectTitle, setProjectTitle] = useState(initialProjectName || 'Distributed E-Commerce Microservices');
  const [techStack, setTechStack] = useState('Node.js, TypeScript, Apache Kafka, Redis, PostgreSQL, Docker');
  const [projectDescription, setProjectDescription] = useState(
    'Built an event-driven e-commerce backend handling orders, inventory reservation, and payment webhooks with asynchronous Kafka pipelines and Redis distributed locking.'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GrillingQuestion[]>([
    {
      id: 'g-1',
      question: 'In your event-driven flow, what happens if an order is created but the payment webhook is delayed by 10 minutes? How do you prevent inventory reservation deadlocks?',
      category: 'Failure Recovery',
      hint: 'Discuss the Saga pattern compensating transactions and TTL expirations on pending stock reservations.',
    },
    {
      id: 'g-2',
      question: 'Why did you choose Apache Kafka over a lighter message queue like RabbitMQ or Redis Pub/Sub for your e-commerce event stream?',
      category: 'Architecture & Tradeoffs',
      hint: 'Mention Kafka log retention, replayability, and consumer group offset management under heavy partition throughput.',
    },
    {
      id: 'g-3',
      question: 'During a flash sale, 5,000 requests hit the last remaining product simultaneously. How did your Redis distributed lock avoid race conditions without degrading API latency?',
      category: 'Scale & Concurrency',
      hint: 'Explain Lua scripts running atomically in Redis single-threaded execution vs PostgreSQL row-level locks.',
    },
    {
      id: 'g-4',
      question: 'What is your database indexing strategy on the orders table for queries filtering by user_id and status sorted by created_at?',
      category: 'Database Design',
      hint: 'Explain composite B-Tree indexes (user_id, status, created_at DESC) and how they eliminate filesort.',
    },
  ]);

  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userDefenseAnswer, setUserDefenseAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleGenerateQuestions = () => {
    setIsGenerating(true);
    setFeedback(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedQuestions([
        {
          id: 'gen-1',
          question: `Regarding ${projectTitle}: What were the single points of failure in this architecture, and how would you redesign it if traffic scaled 50x?`,
          category: 'Architecture & Tradeoffs',
          hint: 'Evaluate database connection pooling, cache stampedes, and CDN offloading.',
        },
        {
          id: 'gen-2',
          question: `How did you test edge cases where third-party APIs or network partitions failed in ${projectTitle}?`,
          category: 'Failure Recovery',
          hint: 'Mention idempotency keys, exponential backoff retries, and circuit breakers.',
        },
        {
          id: 'gen-3',
          question: `If two concurrent write operations conflict on the database layer in your project, how is consistency guaranteed?`,
          category: 'Scale & Concurrency',
          hint: 'Discuss optimistic locking (version column) vs pessimistic locking (SELECT FOR UPDATE).',
        },
      ]);
      setActiveQuestionIdx(0);
    }, 600);
  };

  const handleEvaluateAnswer = () => {
    if (!userDefenseAnswer.trim()) return;
    const currentQ = generatedQuestions[activeQuestionIdx];
    setFeedback(
      `Strong defense! You accurately targeted the core architectural trade-off. To make it interview-ready: quantify the performance impact (e.g. latency reduced by X ms or throughput increased) and explicitly state what alternative you evaluated and rejected.`
    );
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DCE7F2] shadow-xs text-xs font-bold text-[#11183D]">
            <Target className="w-3.5 h-3.5 text-[#4A8BDF]" />
            <span>Socratic Interview Defense</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11183D] tracking-tight font-sans">
            Resume Project Grilling Engine
          </h1>
          <p className="text-sm sm:text-base text-[#526078]">
            Never get stumped when an interviewer asks <em>"Why did you choose this database?"</em> or <em>"What happens if this service crashes?"</em>. Ava simulates strict senior engineer questioning on your actual projects.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCE7F2] shadow-sm space-y-5">
          <h3 className="text-base font-extrabold text-[#11183D] font-sans flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#4A8BDF]" />
            Your Resume Project Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#11183D]">Project Name</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. Distributed Task Queue"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE7F2] text-xs font-semibold text-[#11183D] focus:outline-none focus:ring-1 focus:ring-[#4A8BDF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#11183D]">Tech Stack</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g. React, Node.js, Redis, PostgreSQL"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE7F2] text-xs font-semibold text-[#11183D] focus:outline-none focus:ring-1 focus:ring-[#4A8BDF]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#11183D]">Resume Bullet Points / Architectural Summary</label>
            <textarea
              rows={3}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Paste the bullets from your resume describing what you built..."
              className="w-full p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DCE7F2] text-xs font-sans text-[#11183D] focus:outline-none focus:ring-1 focus:ring-[#4A8BDF] resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#7E8B9B]">
              Ava analyzes your stack for common tutorial shortcuts and concurrency flaws.
            </span>
            <button
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-full bg-[#11183D] hover:bg-[#1E293B] text-white text-xs font-bold font-sans flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4A8BDF]" />
              <span>{isGenerating ? 'Analyzing Architecture...' : 'Generate Grilling Questions'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Defense Room */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE7F2] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCE7F2]">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#11183D] font-sans flex items-center gap-2">
                <Target className="w-5 h-5 text-rose-600" />
                Interrogation Arena ({generatedQuestions.length} Questions)
              </h3>
              <p className="text-xs text-[#526078] mt-0.5">
                Practice defending your decisions before facing an engineering manager
              </p>
            </div>

            <Link
              to={`/interview/new?topic=${encodeURIComponent(projectTitle)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-sans transition-all shadow-xs"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Oral Defense with Ava Voice</span>
            </Link>
          </div>

          {/* Question Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {generatedQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setActiveQuestionIdx(idx);
                  setFeedback(null);
                  setUserDefenseAnswer('');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all whitespace-nowrap cursor-pointer ${
                  activeQuestionIdx === idx
                    ? 'bg-[#11183D] text-white'
                    : 'bg-[#F8FAFC] text-[#526078] hover:bg-slate-100 border border-[#DCE7F2]'
                }`}
              >
                Q{idx + 1}: {q.category}
              </button>
            ))}
          </div>

          {/* Active Question Box */}
          {generatedQuestions[activeQuestionIdx] && (
            <div className="p-5 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white border border-[#DCE7F2] text-[#4A8BDF]">
                  {generatedQuestions[activeQuestionIdx].category}
                </span>
                <span className="text-xs text-rose-700 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Senior Dev Probe
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-extrabold text-[#11183D] font-sans leading-relaxed">
                "{generatedQuestions[activeQuestionIdx].question}"
              </h4>

              <div className="p-3 bg-white rounded-xl border border-[#DCE7F2] text-xs text-[#526078]">
                <strong className="text-[#11183D]">Ava's Clue: </strong>
                <span>{generatedQuestions[activeQuestionIdx].hint}</span>
              </div>
            </div>
          )}

          {/* Answer Input & Evaluation */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#11183D] block">
              Draft Your Architectural Defense:
            </label>
            <textarea
              rows={4}
              value={userDefenseAnswer}
              onChange={(e) => setUserDefenseAnswer(e.target.value)}
              placeholder="Explain your approach, why you chose this design, and what tradeoffs or failure modes you planned for..."
              className="w-full p-4 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F2] text-xs font-sans text-[#11183D] focus:outline-none focus:ring-1 focus:ring-[#4A8BDF] resize-none"
            />

            <div className="flex justify-end">
              <button
                onClick={handleEvaluateAnswer}
                disabled={!userDefenseAnswer.trim()}
                className="px-5 py-2.5 rounded-full bg-[#4A8BDF] hover:bg-[#2459A8] text-white text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>Evaluate My Defense</span>
              </button>
            </div>
          </div>

          {/* Evaluation Feedback */}
          {feedback && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ava's Evaluation Feedback:</span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                {feedback}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
