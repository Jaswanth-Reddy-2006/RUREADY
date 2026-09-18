import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Building2, Calendar, Clock, AlertTriangle, ShieldCheck, CheckCircle2,
  FileText, Sparkles, BookOpen, Trash2, Plus, MessageSquare, Target,
  BrainCircuit, ExternalLink, ArrowRight
} from 'lucide-react';
import { usePlacementStore, JobApplication, ApplicationStage } from '../../store/usePlacementStore';
import toast from 'react-hot-toast';

interface ApplicationDetailDrawerProps {
  applicationId: string | null;
  onClose: () => void;
  onOpenJdParser: (appId: string) => void;
  onOpenRejectionModal: (appId: string) => void;
}

export default function ApplicationDetailDrawer({
  applicationId,
  onClose,
  onOpenJdParser,
  onOpenRejectionModal
}: ApplicationDetailDrawerProps) {
  const { applications, moveStage, togglePrepTask, addNote, deleteApplication } = usePlacementStore();
  const [newNoteText, setNewNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PREP' | 'JOURNAL' | 'INTELLIGENCE'>('OVERVIEW');

  if (!applicationId) return null;

  const app = applications.find((a) => a.id === applicationId);
  if (!app) return null;

  const isCritical = app.riskLevel === 'CRITICAL';
  const isAtRisk = app.riskLevel === 'AT_RISK';

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addNote(app.id, {
      stage: app.stage,
      content: newNoteText,
      type: 'NOTE'
    });
    setNewNoteText('');
    toast.success('Journal entry saved!');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete application for ${app.company}?`)) {
      deleteApplication(app.id);
      toast.success('Application deleted.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-2xs font-sans">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-2xl bg-white border-l border-[#DCE7F2] h-full shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#DCE7F2] bg-[#EFFAFD] flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 rounded-2xl bg-white border border-[#DCE7F2] flex items-center justify-center font-bold text-base text-[#2459A8] shrink-0 shadow-sm overflow-hidden">
              {app.companyLogo ? (
                <img src={app.companyLogo} alt={app.company} className="h-6 w-6 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : null}
              <span>{app.company.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold font-display text-[#11183D] truncate">
                  {app.company}
                </h3>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-white border border-[#DCE7F2] text-[#2459A8]">
                  {app.ctc}
                </span>
              </div>
              <p className="text-xs font-medium text-[#526078] truncate">
                {app.role} • {app.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
              title="Delete Application"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white text-[#7B8799] hover:text-[#11183D] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Switcher Bar */}
        <div className="flex items-center gap-2 px-6 py-2 border-b border-[#DCE7F2] bg-slate-50 shrink-0 text-xs font-bold font-display">
          {[
            { id: 'OVERVIEW', label: 'Overview & Risk' },
            { id: 'PREP', label: `Prep Tasks (${app.prepTasks.filter((t) => !t.isCompleted).length})` },
            { id: 'JOURNAL', label: `Timeline Journal (${app.notes.length})` },
            { id: 'INTELLIGENCE', label: 'Company Intelligence' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#2459A8] shadow-2xs border border-[#DCE7F2]'
                  : 'text-[#526078] hover:text-[#11183D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Risk Status & Warning Banner */}
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isCritical
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : isAtRisk
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle size={14} />
                    Application Risk Status: {app.riskLevel}
                  </span>
                  <span className="text-xs font-bold font-mono">Readiness: {app.prepScore}%</span>
                </div>

                {app.riskFactors.length > 0 ? (
                  <ul className="text-xs space-y-1 list-disc list-inside opacity-90 pt-1">
                    {app.riskFactors.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs opacity-90">On track! All upcoming preparation milestones are up to date.</p>
                )}
              </div>

              {/* Next Upcoming Deadline CTA */}
              {app.nextDeadlineDate && (
                <div className="p-4 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2459A8]">
                      <Clock size={16} />
                      <span>Next Milestone: {app.nextDeadlineTitle}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#526078]">
                    Deadline: <strong>{new Date(app.nextDeadlineDate).toLocaleString()}</strong>
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onOpenJdParser(app.id)}
                      className="px-3.5 py-2 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Sparkles size={14} />
                      <span>Analyze JD & Auto-Prep</span>
                    </button>
                    {app.stage !== 'REJECTED' && (
                      <button
                        onClick={() => onOpenRejectionModal(app.id)}
                        className="px-3 py-2 bg-white border border-[#DCE7F2] hover:bg-rose-50 text-rose-700 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Log Rejection
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Attached Resume */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#526078] uppercase tracking-wider">
                  Attached ATS Resume Version
                </h4>
                <div className="p-3 bg-white border border-[#DCE7F2] rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText size={18} className="text-[#4A8BDF]" />
                    <div>
                      <p className="text-xs font-bold text-[#11183D]">{app.resumeTitle || 'SWE_Resume_v4.pdf'}</p>
                      <p className="text-[11px] text-[#526078]">Linked from ATS Resume Scanner</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ATS 91% Match
                  </span>
                </div>
              </div>

              {/* Matched vs Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 border border-[#DCE7F2] rounded-2xl space-y-2">
                  <h5 className="text-xs font-bold text-[#11183D]">Matched Skills</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {app.matchedSkills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-[#DCE7F2] rounded-2xl space-y-2">
                  <h5 className="text-xs font-bold text-[#11183D]">Missing Skill Gaps</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {app.missingSkills.length > 0 ? (
                      app.missingSkills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-bold">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-[#7B8799]">No major skill gaps identified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PREPARATION TASKS */}
          {activeTab === 'PREP' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                <h4 className="text-xs font-bold font-display text-[#11183D]">
                  Preparation Checklist ({app.prepTasks.filter((t) => t.isCompleted).length} / {app.prepTasks.length} Completed)
                </h4>
                <button
                  onClick={() => onOpenJdParser(app.id)}
                  className="text-xs font-bold text-[#4A8BDF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={13} />
                  <span>Generate Tasks from JD</span>
                </button>
              </div>

              {app.prepTasks.length === 0 ? (
                <p className="text-xs text-[#7B8799]">No tasks pending. Click above to generate AI tasks!</p>
              ) : (
                <div className="space-y-2.5">
                  {app.prepTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => togglePrepTask(app.id, task.id)}
                      className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                        task.isCompleted
                          ? 'bg-slate-50 border-[#DCE7F2] opacity-75'
                          : 'bg-white border-[#DCE7F2] hover:border-[#4A8BDF] shadow-2xs'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => {}}
                        className="mt-0.5 h-4 w-4 text-[#2459A8] rounded cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold ${task.isCompleted ? 'line-through text-[#7B8799]' : 'text-[#11183D]'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#EFFAFD] text-[#2459A8]">
                            {task.category}
                          </span>
                          <span className="text-[10px] text-[#7B8799]">⏱ {task.estimatedMinutes} mins</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TIMELINE JOURNAL */}
          {activeTab === 'JOURNAL' && (
            <div className="space-y-6">
              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Record interview feedback, questions asked in OA, or recruiter call notes..."
                  className="w-full p-3 bg-slate-50 border border-[#DCE7F2] rounded-2xl text-xs font-medium text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display shadow-xs cursor-pointer"
                  >
                    Add Journal Entry
                  </button>
                </div>
              </form>

              {/* Timeline Entries */}
              <div className="space-y-4 border-l-2 border-[#DCE7F2] pl-4 ml-2">
                {app.notes.map((n) => (
                  <div key={n.id} className="relative space-y-1">
                    <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-[#4A8BDF] border-2 border-white" />
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#7B8799]">
                      <span>{n.date} • {n.stage}</span>
                      <span className="font-mono text-[#2459A8] uppercase">{n.type}</span>
                    </div>
                    <p className="text-xs text-[#11183D] font-medium bg-slate-50 p-3 rounded-xl border border-[#DCE7F2]">
                      {n.content}
                    </p>
                    {n.questionsAsked && n.questionsAsked.length > 0 && (
                      <div className="pt-1">
                        <p className="text-[10px] font-bold text-[#526078]">Questions Asked:</p>
                        <ul className="list-disc list-inside text-[11px] text-[#2459A8] font-mono">
                          {n.questionsAsked.map((q, idx) => (
                            <li key={idx}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMPANY INTELLIGENCE */}
          {activeTab === 'INTELLIGENCE' && (
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-br from-[#2459A8] to-[#4A8BDF] text-white rounded-2xl space-y-2 shadow-md">
                <h4 className="text-sm font-bold font-display">{app.company} Hiring Intelligence</h4>
                <p className="text-xs text-white/90 leading-relaxed">
                  Based on recent campus drives, past candidate experiences, and verified interview questions for {app.role}.
                </p>
              </div>

              {/* Frequently Tested Topics */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-[#11183D]">Top Tested Topics in Technical Rounds</h5>
                <div className="space-y-2">
                  {[
                    { topic: 'Data Structures (Trees & Graphs)', pct: 88 },
                    { topic: 'Object-Oriented System Design (LLD)', pct: 76 },
                    { topic: 'Operating Systems (Concurrency & Memory)', pct: 64 },
                    { topic: 'Database Indexing & SQL Joins', pct: 58 },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-[#526078]">
                        <span>{item.topic}</span>
                        <span className="font-mono text-[#2459A8]">{item.pct}% candidates asked</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#4A8BDF] rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
