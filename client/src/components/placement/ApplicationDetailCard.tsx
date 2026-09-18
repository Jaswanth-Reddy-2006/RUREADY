import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Building2, Calendar, Clock, AlertTriangle, ShieldCheck, CheckCircle2,
  FileText, Sparkles, Trash2, Plus, Target, BrainCircuit, ExternalLink, ArrowRight,
  Frown
} from 'lucide-react';
import { usePlacementStore, JobApplication, ApplicationStage } from '../../store/usePlacementStore';
import toast from 'react-hot-toast';

interface ApplicationDetailCardProps {
  applicationId: string;
  onBack: () => void;
  onOpenJdParser: (appId: string) => void;
  onOpenRejectionModal: (appId: string) => void;
}

export default function ApplicationDetailCard({
  applicationId,
  onBack,
  onOpenJdParser,
  onOpenRejectionModal
}: ApplicationDetailCardProps) {
  const { applications, moveStage, togglePrepTask, addNote, deleteApplication } = usePlacementStore();
  const [newNoteText, setNewNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PREP' | 'JOURNAL' | 'INTELLIGENCE'>('OVERVIEW');

  const app = applications.find((a) => a.id === applicationId);

  if (!app) {
    return (
      <div className="p-8 text-center bg-white border border-[#DCE7F2] rounded-3xl">
        <p className="text-sm font-bold text-[#11183D]">Application not found.</p>
        <button onClick={onBack} className="mt-3 px-4 py-2 bg-[#2459A8] text-white rounded-xl text-xs font-bold">
          ← Back to Placement CRM
        </button>
      </div>
    );
  }

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
      onBack();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="bg-white border border-[#DCE7F2] rounded-3xl shadow-sm overflow-hidden select-none font-sans space-y-6"
    >
      {/* Back Button & Top Header Bar */}
      <div className="p-6 border-b border-[#DCE7F2] bg-[#EFFAFD] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white border border-[#DCE7F2] hover:border-[#4A8BDF] text-[#11183D] transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold font-display shadow-2xs"
          >
            <ArrowLeft size={16} className="text-[#2459A8]" />
            <span>Back to Applications</span>
          </button>

          <div className="h-6 w-px bg-[#DCE7F2] hidden sm:block" />

          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 rounded-2xl bg-white border border-[#DCE7F2] flex items-center justify-center font-bold text-base text-[#2459A8] shrink-0 shadow-sm overflow-hidden">
              {app.companyLogo ? (
                <img src={app.companyLogo} alt={app.company} className="h-6 w-6 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : null}
              <span>{app.company.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black font-display text-[#11183D] truncate">
                  {app.company}
                </h2>
                <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30">
                  {app.ctc}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#526078] truncate mt-0.5">
                {app.role} • {app.location}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <select
            value={app.stage}
            onChange={(e) => moveStage(app.id, e.target.value as ApplicationStage)}
            className="bg-white border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none shadow-2xs cursor-pointer"
          >
            <option value="APPLIED">Stage: Applied</option>
            <option value="SHORTLISTED">Stage: Shortlisted</option>
            <option value="OA">Stage: OA Stage</option>
            <option value="TECHNICAL_1">Stage: Technical 1</option>
            <option value="TECHNICAL_2">Stage: Technical 2</option>
            <option value="MANAGERIAL">Stage: Managerial / HR</option>
            <option value="OFFERED">Stage: Offered 🎉</option>
            <option value="REJECTED">Stage: Archived</option>
          </select>

          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-white border border-[#DCE7F2] hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer shadow-2xs"
            title="Delete Application"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Detail Card Navigation Tabs */}
      <div className="px-6 border-b border-[#DCE7F2] bg-[#F8FAFC]">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold font-display py-2">
          {[
            { id: 'OVERVIEW', label: 'Overview & Risk' },
            { id: 'PREP', label: `Prep Tasks (${app.prepTasks.filter((t) => !t.isCompleted).length})` },
            { id: 'JOURNAL', label: `Timeline Journal (${app.notes.length})` },
            { id: 'INTELLIGENCE', label: 'Company Intelligence' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#2459A8] text-white shadow-xs'
                  : 'text-[#526078] hover:text-[#11183D] hover:bg-[#EFFAFD]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Detail Card Main Body */}
      <div className="p-6 space-y-6">

        {/* TAB 1: OVERVIEW & RISK */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Card Section 1: Application Risk Status Banner */}
            <div className={`p-5 rounded-2xl border space-y-2 ${
              isCritical
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : isAtRisk
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-[#E8F5F0] border-[#168A62]/30 text-[#168A62]'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={15} />
                  APPLICATION RISK STATUS: {app.riskLevel}
                </span>
                <span className="text-xs font-extrabold font-mono px-3 py-1 bg-white rounded-full shadow-2xs">
                  Readiness: {app.prepScore}%
                </span>
              </div>

              {app.riskFactors.length > 0 ? (
                <ul className="text-xs space-y-1 list-disc list-inside opacity-90 pt-1 font-medium">
                  {app.riskFactors.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs font-medium">On track! All upcoming preparation milestones are up to date.</p>
              )}
            </div>

            {/* Card Section 2: Next Milestone Details */}
            {app.nextDeadlineDate && (
              <div className="p-5 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl space-y-4 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2459A8] font-display">
                    <Clock size={16} />
                    <span>Next Milestone: {app.nextDeadlineTitle}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#526078]">
                    Deadline: <strong>{new Date(app.nextDeadlineDate).toLocaleString()}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => onOpenJdParser(app.id)}
                    className="px-4 py-2.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Sparkles size={15} />
                    <span>Analyze JD & Auto-Prep</span>
                  </button>

                  {app.stage !== 'REJECTED' && (
                    <button
                      onClick={() => onOpenRejectionModal(app.id)}
                      className="px-4 py-2.5 bg-white border border-[#DCE7F2] hover:bg-rose-50 text-rose-700 rounded-xl text-xs font-bold font-display cursor-pointer transition-colors shadow-2xs"
                    >
                      Log Rejection
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Card Section 3: Attached ATS Resume Version */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#526078] uppercase tracking-wider font-display">
                ATTACHED ATS RESUME VERSION
              </h4>
              <div className="p-4 bg-white border border-[#DCE7F2] rounded-2xl flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#EFFAFD] text-[#2459A8]">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#11183D] font-mono">{app.resumeTitle || 'SWE_Resume_v4.pdf'}</p>
                    <p className="text-[11px] text-[#526078]">Linked from ATS Resume Scanner module</p>
                  </div>
                </div>

                <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30">
                  ATS 91% Match
                </span>
              </div>
            </div>

            {/* Card Section 4: Matched Skills vs Missing Skill Gaps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#EFFAFD]/50 border border-[#DCE7F2] rounded-2xl space-y-2">
                <h5 className="text-xs font-bold text-[#11183D] font-display">Matched Skills</h5>
                <div className="flex flex-wrap gap-1.5">
                  {app.matchedSkills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-[#E8F5F0] text-[#168A62] rounded-lg text-xs font-bold font-mono border border-[#168A62]/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#EFFAFD]/50 border border-[#DCE7F2] rounded-2xl space-y-2">
                <h5 className="text-xs font-bold text-[#11183D] font-display">Missing Skill Gaps</h5>
                <div className="flex flex-wrap gap-1.5">
                  {app.missingSkills.length > 0 ? (
                    app.missingSkills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg text-xs font-bold font-mono border border-rose-200">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#526078] font-medium">No major skill gaps identified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PREP TASKS */}
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
                <Sparkles size={14} />
                <span>Generate Tasks from JD</span>
              </button>
            </div>

            {app.prepTasks.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-[#DCE7F2] rounded-2xl">
                <p className="text-xs font-medium text-[#526078]">No preparation tasks pending. Click above to generate AI tasks!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {app.prepTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => togglePrepTask(app.id, task.id)}
                    className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                      task.isCompleted
                        ? 'bg-[#F8FAFC] border-[#DCE7F2] opacity-75'
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
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]">
                          {task.category}
                        </span>
                        <span className="text-[10px] text-[#526078] font-mono">⏱ {task.estimatedMinutes} mins</span>
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
            <form onSubmit={handleAddNoteSubmit} className="space-y-2">
              <textarea
                rows={3}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Record interview feedback, questions asked in OA, or recruiter call notes..."
                className="w-full p-3.5 bg-[#F8FAFC] border border-[#DCE7F2] rounded-2xl text-xs font-medium text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
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

            <div className="space-y-4 border-l-2 border-[#DCE7F2] pl-4 ml-2">
              {app.notes.length === 0 ? (
                <p className="text-xs text-[#526078]">No notes recorded yet.</p>
              ) : (
                app.notes.map((n) => (
                  <div key={n.id} className="relative space-y-1">
                    <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-[#4A8BDF] border-2 border-white" />
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#526078]">
                      <span>{n.date} • Stage: {n.stage}</span>
                      <span className="font-mono text-[#2459A8] uppercase">{n.type}</span>
                    </div>
                    <p className="text-xs text-[#11183D] font-medium bg-[#EFFAFD]/50 p-3 rounded-xl border border-[#DCE7F2]">
                      {n.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: COMPANY INTELLIGENCE */}
        {activeTab === 'INTELLIGENCE' && (
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-br from-[#2459A8] via-[#4A8BDF] to-[#A0006D] text-white rounded-2xl space-y-2 shadow-md">
              <h4 className="text-sm font-bold font-display">{app.company} Hiring Intelligence</h4>
              <p className="text-xs text-white/90 leading-relaxed">
                Vetted hiring patterns and past candidate questions for {app.role}.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-bold text-[#11183D] uppercase tracking-wider font-display">Top Tested Topics</h5>
              <div className="space-y-2.5">
                {[
                  { topic: 'Data Structures & Algorithmic Complexity', pct: 88 },
                  { topic: 'Object-Oriented System Design (LLD)', pct: 76 },
                  { topic: 'Operating Systems & Thread Locks', pct: 64 },
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
  );
}
