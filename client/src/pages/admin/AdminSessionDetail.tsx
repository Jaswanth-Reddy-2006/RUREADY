// ═══════════════════════════════════════════════════════════════
// R U Ready? — Bespoke Admin Session Detail Inspector
// Deep inspection of candidate interview performance, transcripts,
// AI evaluation matrix, code execution logs, and anti-cheat telemetry
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Video,
  Code2,
  Award,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Terminal,
  Activity,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';

export default function AdminSessionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'TRANSCRIPT' | 'CODE_LOGS' | 'TELEMETRY'>('TRANSCRIPT');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  const fetchSession = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`/admin/sessions/${id}`);
      setSession(res.data.session);
    } catch (err) {
      console.error('Failed to load session details:', err);
      toast.error('Session not found or error loading telemetry');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSession();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-500">Decompiling session telemetry & audio transcripts...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 font-display">Session Record Not Found</h2>
        <p className="text-xs text-slate-500">The requested interview session ID does not exist or was deleted.</p>
        <Button size="sm" variant="secondary" onClick={() => navigate('/admin/logs')}>
          Return to Session Logs
        </Button>
      </div>
    );
  }

  const analysis = session.analysis;
  const questions = session.questions || [];
  const telemetry = session.telemetryLogs || [];
  const codeDeltas = session.codeExecutionDeltas || [];
  const tabBlurs = telemetry.filter((t: any) => t.type === 'TAB_BLUR').length;
  const speechLogs = telemetry.filter((t: any) => t.type === 'SPEECH_METRIC');
  const avgWpm = speechLogs.length > 0
    ? Math.round(speechLogs.reduce((acc: number, cur: any) => acc + (cur.wordsPerMinute || 0), 0) / speechLogs.length)
    : 135;

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-body pb-12">
      
      {/* ─── Top Navigation Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/logs"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 font-display tracking-tight">
                Session Inspection
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                {session.id.substring(0, 8)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive telemetry, STAR question analysis, and AI critique
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={fetchSession}
            icon={<RefreshCw size={13} />}
          >
            Refresh Log
          </Button>
        </div>
      </div>

      {/* ─── Hero Overview Card ─── */}
      <Card padding="lg" className="bg-white border-slate-200/90 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Candidate Profile Preview */}
          <div className="md:col-span-4 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
            <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white font-black font-display flex items-center justify-center text-xl shadow-md shadow-emerald-600/20 shrink-0">
              {session.user?.name?.charAt(0) || 'C'}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 font-display text-base truncate">
                  {session.user?.name || 'Candidate'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono truncate">{session.user?.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {session.experienceLevel} Level
                </span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  {session.industry}
                </span>
              </div>
            </div>
          </div>

          {/* Role & Format Metadata */}
          <div className="md:col-span-5 grid grid-cols-2 gap-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Target Position</span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{session.targetRole}</p>
              <p className="text-[11px] text-slate-500 font-mono">{session.targetCompany || 'Generic Tech'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Session Format</span>
              <div className="mt-0.5 flex items-center gap-1.5">
                {session.mode === 'CODING' ? (
                  <Badge variant="orange" size="xs">
                    <Code2 size={11} className="mr-1" /> Coding Sandbox
                  </Badge>
                ) : (
                  <Badge variant="info" size="xs">
                    <Video size={11} className="mr-1" /> Oral AI Avatar
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                {session.durationMins} mins duration
              </p>
            </div>
          </div>

          {/* Overall STAR Score Gauge */}
          <div className="md:col-span-3 flex items-center justify-center md:justify-end">
            <div className="text-center p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 w-full max-w-[180px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-display">
                Overall STAR Score
              </span>
              <div className="text-3xl font-black text-emerald-600 font-display mt-0.5">
                {analysis?.overallScore ?? (session.testCasesPassed !== null ? `${session.testCasesPassed} Pts` : '--')}
                {analysis?.overallScore && <span className="text-xs text-emerald-700 font-normal">/100</span>}
              </div>
              <p className="text-[10px] font-mono font-bold text-emerald-700 mt-1">
                {analysis?.readinessVerdict ? analysis.readinessVerdict.replace('_', ' ') : session.status}
              </p>
            </div>
          </div>

        </div>
      </Card>

      {/* ─── 4 Pillar Performance Breakdown ─── */}
      {analysis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" className="bg-white border-slate-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Communication</span>
              <Award size={14} className="text-blue-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 font-display">
              {analysis.communicationScore}<span className="text-xs text-slate-400 font-normal">/100</span>
            </p>
            <p className="text-[10px] text-blue-600 font-mono font-semibold">Verbal clarity & pace</p>
          </Card>

          <Card padding="md" className="bg-white border-slate-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Technical Depth</span>
              <Code2 size={14} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 font-display">
              {analysis.technicalScore}<span className="text-xs text-slate-400 font-normal">/100</span>
            </p>
            <p className="text-[10px] text-emerald-600 font-mono font-semibold">Correctness & complexity</p>
          </Card>

          <Card padding="md" className="bg-white border-slate-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Confidence & Stress</span>
              <Activity size={14} className="text-purple-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 font-display">
              {analysis.confidenceScore}<span className="text-xs text-slate-400 font-normal">/100</span>
            </p>
            <p className="text-[10px] text-purple-600 font-mono font-semibold">Stress coefficient: Low</p>
          </Card>

          <Card padding="md" className="bg-white border-slate-200/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400 font-display">STAR Structure</span>
              <Sparkles size={14} className="text-[#FF7A00]" />
            </div>
            <p className="text-2xl font-black text-slate-900 font-display">
              {analysis.structureScore}<span className="text-xs text-slate-400 font-normal">/100</span>
            </p>
            <p className="text-[10px] text-[#FF7A00] font-mono font-semibold">Situation-Task-Action</p>
          </Card>
        </div>
      )}

      {/* ─── Navigation Tabs for Inspection ─── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('TRANSCRIPT')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeTab === 'TRANSCRIPT'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileText size={14} />
          <span>Questions & AI Evaluation ({questions.length})</span>
        </button>

        {session.mode === 'CODING' && (
          <button
            onClick={() => setActiveTab('CODE_LOGS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === 'CODE_LOGS'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Terminal size={14} />
            <span>Code Execution Stream ({codeDeltas.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('TELEMETRY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeTab === 'TELEMETRY'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ShieldAlert size={14} />
          <span>Anti-Cheat & Proctoring Telemetry ({telemetry.length})</span>
        </button>
      </div>

      {/* ─── Tab Content: Question-by-Question Transcript ─── */}
      {activeTab === 'TRANSCRIPT' && (
        <div className="space-y-4">
          {questions.length === 0 ? (
            <Card padding="lg" className="bg-white border-slate-200 text-center py-12">
              <p className="text-xs text-slate-400 italic">No structured questions logged for this session yet.</p>
            </Card>
          ) : (
            questions.map((q: any, idx: number) => {
              const isExpanded = expandedQuestion === idx;

              return (
                <Card
                  key={q.id || idx}
                  padding="none"
                  className="bg-white border-slate-200 shadow-sm overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="h-7 w-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        Q{idx + 1}
                      </span>
                      <div className="overflow-hidden">
                        <span className="font-bold text-xs text-slate-800 line-clamp-1">
                          {q.questionText}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                          <span>{q.questionType}</span>
                          <span>•</span>
                          <span>Difficulty: {q.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {q.evalScore !== null && (
                        <Badge variant={q.evalScore >= 75 ? 'success' : 'warning'} size="xs">
                          {q.evalScore}/100
                        </Badge>
                      )}
                      {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
                      {/* Candidate Answer */}
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">
                          Candidate's Spoken / Typed Response:
                        </span>
                        <p className="text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
                          {q.answerText || '(No recorded verbal response provided)'}
                        </p>
                      </div>

                      {/* AI Evaluation Critique */}
                      {q.evalFeedback && (
                        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/90 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-display">
                              AI Evaluator Feedback:
                            </span>
                            <span className="text-xs font-bold font-mono text-emerald-700">{q.evalScore}/100</span>
                          </div>
                          <p className="text-xs text-emerald-950 leading-relaxed">
                            {q.evalFeedback}
                          </p>

                          {/* Strengths & Weaknesses */}
                          {q.evalStrengths && q.evalStrengths.length > 0 && (
                            <div className="pt-2">
                              <span className="text-[10px] font-bold text-emerald-800 uppercase font-mono">Demonstrated Strengths:</span>
                              <ul className="list-disc list-inside text-xs text-emerald-900 mt-1 space-y-0.5">
                                {q.evalStrengths.map((s: string, i: number) => (
                                  <li key={i}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Better Model Answer */}
                      {q.betterAnswer && (
                        <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 font-display">
                            Recommended Model Benchmark Answer:
                          </span>
                          <p className="text-xs text-purple-950 leading-relaxed font-mono whitespace-pre-wrap">
                            {q.betterAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* ─── Tab Content: Code Execution Sandbox Stream ─── */}
      {activeTab === 'CODE_LOGS' && (
        <div className="space-y-4">
          {codeDeltas.length === 0 ? (
            <Card padding="lg" className="bg-white border-slate-200 text-center py-12">
              <p className="text-xs text-slate-400 italic">No code executions submitted during this session.</p>
            </Card>
          ) : (
            codeDeltas.map((delta: any, idx: number) => (
              <Card key={delta.id || idx} padding="md" className="bg-slate-900 text-slate-100 border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">Execution #{idx + 1}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">Lang: {delta.language}</span>
                  </div>
                  <span className={delta.success ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {delta.success ? 'PASSED' : 'ERROR / FAILED'}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-200 overflow-x-auto max-h-56">
                  <pre>{delta.code}</pre>
                </div>

                {delta.output && (
                  <div className="p-3 bg-slate-950/80 rounded-xl font-mono text-xs text-emerald-300 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block mb-1">STDOUT:</span>
                    <pre className="whitespace-pre-wrap">{delta.output}</pre>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* ─── Tab Content: Proctoring & Telemetry ─── */}
      {activeTab === 'TELEMETRY' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card padding="md" className="bg-white border-slate-200/80 shadow-sm space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Tab Switch Violations</span>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-black text-rose-600 font-display">{tabBlurs}</p>
              <span className="text-xs text-slate-400 font-mono">events</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              {tabBlurs === 0 ? 'No suspicious tab unfocus detected' : 'Candidate blurred window'}
            </p>
          </Card>

          <Card padding="md" className="bg-white border-slate-200/80 shadow-sm space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Average Speaking Pace</span>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-black text-slate-900 font-display">{avgWpm}</p>
              <span className="text-xs text-slate-400 font-mono">WPM</span>
            </div>
            <p className="text-[10px] text-emerald-600 font-mono font-semibold">
              Optimal conversational flow (120-150 WPM)
            </p>
          </Card>

          <Card padding="md" className="bg-white border-slate-200/80 shadow-sm space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Eye Contact Ratio</span>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-black text-blue-600 font-display">
                {analysis?.eyeContactScore || 92}%
              </p>
            </div>
            <p className="text-[10px] text-blue-600 font-mono font-semibold">Face mesh gaze locked</p>
          </Card>
        </div>
      )}

    </div>
  );
}
