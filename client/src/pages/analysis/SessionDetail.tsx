import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, User, 
  ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, 
  MessageSquare, BookOpen, Star, Sparkles
} from 'lucide-react';
import apiClient from '../../api/client';
import { displayEvalFeedback } from '../../lib/evalDisplay';
import Badge from '../../components/ui/Badge';

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadReport() {
      try {
        const response = await apiClient.get(`/interview/session/${id}`);
        setSession(response.data);
      } catch (err) {
        console.error('Failed to load performance report', err);
        navigate('/analysis');
      } finally {
        setIsLoading(false);
      }
    }
    loadReport();
  }, [id, navigate]);

  const toggleAccordion = (questionId: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getVerdictBadge = (verdict?: string) => {
    switch (verdict) {
      case 'STRONG':
        return <Badge variant="success" size="md" dot>Strong Candidate (Ready for Hire)</Badge>;
      case 'READY':
        return <Badge variant="teal" size="md" dot>Ready (Meets Hiring Bar)</Badge>;
      case 'ALMOST_READY':
        return <Badge variant="warning" size="md" dot>Almost Ready (Needs Slight Polish)</Badge>;
      default:
        return <Badge variant="error" size="md" dot>Needs Substantial Polish</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 65) return 'text-solar-orange-400';
    return 'text-rose-400';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 65) return '#FF7A00';
    return '#EF4444';
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recent Assessment';
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-6 bg-[#EFFAFD]">
        <div className="h-8 w-48 bg-white border border-[#DCE7F2] rounded-xl skeleton" />
        <div className="h-96 bg-white border border-[#DCE7F2] rounded-3xl skeleton" />
      </div>
    );
  }

  const analysis = session?.analysis;
  const overallScore = analysis?.overallScore || 0;

  // SVG parameters for circular score ring
  const strokeWidth = 12;
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-[#EFFAFD] min-h-[calc(100vh-80px)] text-[#11183D]">
      <Helmet>
        <title>{`R U Ready? Assessment Report: ${overallScore}%`}</title>
      </Helmet>

      {/* Back Link & Header */}
      <div>
        <Link 
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526078] hover:text-[#11183D] transition-colors mb-4 font-display"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#11183D] font-display tracking-tight">
              Performance Assessment Report
            </h1>
            <p className="text-xs text-[#526078] font-body flex flex-wrap items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Conducted on {formatDate(session?.createdAt)}
              <span>•</span>
              <span className="font-semibold text-[#11183D]">{session?.targetRole || 'Software Engineer'}</span>
              {session?.targetCompany && <span>• Target: {session.targetCompany}</span>}
            </p>
          </div>
          
          {analysis?.readinessVerdict && getVerdictBadge(analysis.readinessVerdict)}
        </div>
      </div>

      {/* Main Review Summary Card (SVG Meter + Subscores) */}
      <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 sm:p-8 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left: Overall Circular score wheel */}
          <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#DCE7F2] pb-6 md:pb-0 md:pr-8">
            <div className="relative flex items-center justify-center">
              <svg className="w-44 h-44 transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  stroke="#EBF3FA"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  stroke={getScoreRingColor(overallScore)}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-4xl font-black font-display ${getScoreColor(overallScore)}`}>
                  {overallScore}%
                </span>
                <span className="text-[10px] text-[#526078] font-display font-semibold uppercase tracking-wider mt-0.5">
                  Overall Score
                </span>
              </div>
            </div>
            
            <p className="text-center text-[11px] text-[#526078] font-body mt-3 max-w-[200px]">
              Strict adversarial grading. Zero artificial score inflation.
            </p>
          </div>

          {/* Right: Subscores Grid */}
          <div className="md:col-span-8 space-y-5">
            <div>
              <h2 className="text-base font-bold font-display text-[#11183D]">
                Core Dimension Subscores
              </h2>
              <p className="text-xs text-[#526078] font-body">
                Breakdown across technical accuracy, structured communication, and vocal telemetry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { name: 'Technical Depth', score: analysis?.technicalScore || 0, desc: 'Factual precision & architecture' },
                { name: 'Communication Clarity', score: analysis?.communicationScore || 0, desc: 'STAR concise delivery' },
                { name: 'Confidence & Demeanor', score: analysis?.confidenceScore || 0, desc: 'Vocal stability & poise' },
                { name: 'Response Structure', score: analysis?.structureScore || 0, desc: 'Action & outcome orientation' }
              ].map(sub => (
                <div key={sub.name} className="p-3.5 bg-[#EFFAFD] border border-[#DCE7F2] rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#11183D] font-display">{sub.name}</span>
                    <span className={`text-xs font-bold font-mono ${getScoreColor(sub.score)}`}>{sub.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#DCE7F2] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${sub.score}%`,
                        backgroundColor: getScoreRingColor(sub.score)
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-[#526078] font-body mt-1">{sub.desc}</p>
                </div>
              ))}
            </div>

            {analysis?.confidenceMeterScore !== undefined && (
              <div className="rounded-xl border border-[#DCE7F2] bg-[#EFFAFD] p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#11183D] font-display">Speech Pace & Pause Telemetry</span>
                  <span className={`text-xs font-bold font-mono ${getScoreColor(analysis?.confidenceMeterScore || 0)}`}>
                    {analysis?.confidenceMeterScore}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-[#11183D]">
                  <div className="rounded-lg bg-white border border-[#DCE7F2] p-2 text-center">
                    <div className="font-bold font-mono text-[#4A8BDF]">{analysis?.confidenceSignals?.avgWpm ?? 0} wpm</div>
                    <div className="text-[10px] text-[#526078]">Cadence</div>
                  </div>
                  <div className="rounded-lg bg-white border border-[#DCE7F2] p-2 text-center">
                    <div className="font-bold font-mono text-[#D99020]">{analysis?.confidenceSignals?.avgPauseCount ?? 0}</div>
                    <div className="text-[10px] text-[#526078]">Hesitations</div>
                  </div>
                  <div className="rounded-lg bg-white border border-[#DCE7F2] p-2 text-center">
                    <div className="font-bold font-mono text-[#168A62]">{analysis?.confidenceSignals?.avgAnswerLength ?? 0}</div>
                    <div className="text-[10px] text-[#526078]">Words / Answer</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coaching Insights (Strengths vs Weaknesses) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white border border-[#168A62]/30 rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="text-sm font-bold font-display text-[#168A62] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Demonstrated Strengths
          </h3>
          <ul className="space-y-2.5">
            {analysis?.strengths?.map((str: string, i: number) => (
              <li key={i} className="flex gap-2.5 items-start text-xs text-[#11183D] font-body leading-relaxed">
                <span className="h-4 w-4 rounded-full bg-[#168A62]/15 text-[#168A62] flex items-center justify-center shrink-0 text-[10px] font-bold font-mono mt-0.5">
                  {i + 1}
                </span>
                <span>{str}</span>
              </li>
            ))}
            {(!analysis?.strengths || analysis.strengths.length === 0) && (
              <li className="text-xs text-[#526078] font-body">No specific strengths recorded.</li>
            )}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-white border border-[#D99020]/30 rounded-2xl p-6 shadow-subtle space-y-4">
          <h3 className="text-sm font-bold font-display text-[#D99020] flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Key Growth Areas
          </h3>
          <ul className="space-y-2.5">
            {analysis?.improvements?.map((imp: string, i: number) => (
              <li key={i} className="flex gap-2.5 items-start text-xs text-[#11183D] font-body leading-relaxed">
                <span className="h-4 w-4 rounded-full bg-[#D99020]/15 text-[#D99020] flex items-center justify-center shrink-0 text-[10px] font-bold font-mono mt-0.5">
                  {i + 1}
                </span>
                <span>{imp}</span>
              </li>
            ))}
            {(!analysis?.improvements || analysis.improvements.length === 0) && (
              <li className="text-xs text-[#526078] font-body">No growth areas flagged.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Actionable Recommendations */}
      {analysis?.actionableTips?.length > 0 && (
        <div className="bg-white border border-[#DCE7F2] rounded-2xl p-6 space-y-4 shadow-card">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#A0006D]" />
            <h3 className="text-sm font-bold font-display text-[#11183D]">
              Actionable Coach Recommendations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {analysis.actionableTips.map((tip: any, i: number) => (
              <div key={i} className="p-4 bg-[#F8EAF4] border border-[#A0006D]/30 rounded-xl space-y-1.5">
                <div className="p-1.5 bg-[#A0006D]/15 text-[#A0006D] rounded-lg w-fit">
                  <Star className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-xs font-bold text-[#11183D] font-display leading-tight">{tip.tip}</h4>
                <p className="text-[11px] text-[#526078] font-body leading-relaxed">{tip.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question Review Accordions */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold font-display text-[#11183D] flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#4A8BDF]" />
            Question-by-Question Diagnostic Review
          </h2>
          <p className="text-xs text-[#526078] font-body">
            Expand each prompt to review transcript captures, evaluations, and ideal answers.
          </p>
        </div>

        <div className="space-y-3">
          {session?.questions?.map((q: any, i: number) => {
            const isAssessed = q.evalScore !== null && q.evalScore !== undefined;
            const isOpen = openAccordions[q.id] || false;
            
            return (
              <div 
                key={q.id}
                className="overflow-hidden border border-[#DCE7F2] bg-white rounded-2xl transition-all shadow-subtle"
              >
                <button
                  onClick={() => toggleAccordion(q.id)}
                  className="w-full text-left p-4 sm:p-5 flex justify-between items-center gap-4 hover:bg-[#EFFAFD]/60 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold font-display uppercase tracking-wider text-[#526078]">
                        Q{i + 1} • {q.questionType}
                      </span>
                      <Badge variant="neutral" size="xs">
                        {q.difficulty}
                      </Badge>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold font-display text-[#11183D] truncate">
                      {q.questionText}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {isAssessed ? (
                      <span className={`px-2.5 py-0.5 text-xs font-bold border rounded-lg font-mono ${getScoreColor(q.evalScore)}`}>
                        {q.evalScore}%
                      </span>
                    ) : (
                      <Badge variant="warning" size="xs">In Progress</Badge>
                    )}
                    {isOpen ? <ChevronUp className="h-4 w-4 text-[#526078]" /> : <ChevronDown className="h-4 w-4 text-[#526078]" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t border-[#DCE7F2]"
                    >
                      <div className="p-4 sm:p-5 bg-[#EFFAFD]/50 space-y-4">
                        {/* Response */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#526078] uppercase tracking-wider font-display flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Your Spoken Response
                          </label>
                          <div className="bg-white border border-[#DCE7F2] rounded-xl p-3.5 text-xs text-[#11183D] font-body leading-relaxed whitespace-pre-line">
                            {q.answerText || '[No answer recorded]'}
                          </div>
                        </div>

                        {isAssessed && (
                          <>
                            {/* Feedback */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#526078] uppercase tracking-wider font-display flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-[#A0006D]" />
                                Evaluator Feedback
                              </label>
                              <div className="bg-white border border-[#DCE7F2] rounded-xl p-3.5 text-xs text-[#11183D] font-body leading-relaxed italic">
                                "{displayEvalFeedback(q.evalFeedback)}"
                              </div>
                            </div>

                            {/* Strengths & Weaknesses */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="p-3 bg-white border border-[#168A62]/30 rounded-xl">
                                <h4 className="text-[11px] font-bold text-[#168A62] font-display mb-1">Answer Strengths</h4>
                                <ul className="space-y-1 text-xs text-[#11183D] list-disc list-inside font-body">
                                  {q.evalStrengths?.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
                                  {(!q.evalStrengths || q.evalStrengths.length === 0) && <li>None noted</li>}
                                </ul>
                              </div>
                              <div className="p-3 bg-white border border-[#D99020]/30 rounded-xl">
                                <h4 className="text-[11px] font-bold text-[#D99020] font-display mb-1">Gap Analysis</h4>
                                <ul className="space-y-1 text-xs text-[#11183D] list-disc list-inside font-body">
                                  {q.evalWeaknesses?.map((w: string, idx: number) => <li key={idx}>{w}</li>)}
                                  {(!q.evalWeaknesses || q.evalWeaknesses.length === 0) && <li>None noted</li>}
                                </ul>
                              </div>
                            </div>

                            {/* Ideal Model Answer */}
                            {q.betterAnswer && (
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#526078] uppercase tracking-wider font-display flex items-center gap-1">
                                  <Star className="h-3 w-3 text-[#A0006D]" />
                                  Ideal 90+ Model Rewrite
                                </label>
                                <div className="bg-[#11183D] text-white border border-[#DCE7F2] rounded-xl p-4 text-xs font-mono leading-relaxed whitespace-pre-line">
                                  {q.betterAnswer}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
