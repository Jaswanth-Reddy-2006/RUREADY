import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Building2, Briefcase, MapPin, Calendar, Clock, ExternalLink,
  Edit3, MoreHorizontal, CheckCircle2, Circle, Sparkles, BookOpen, FileText,
  Zap, Target, BrainCircuit, Check, ChevronRight, Plus, MessageSquare,
  Share2, Trash2, ShieldAlert, Play, RefreshCw, Download, FileCode, Users
} from 'lucide-react';
import { usePlacementStore, JobApplication, ApplicationStage } from '../../store/usePlacementStore';
import toast from 'react-hot-toast';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { 
    applications, 
    selectedApplicationId,
    setSelectedApplicationId,
    moveStage, 
    togglePrepTask, 
    addNote, 
    deleteApplication 
  } = usePlacementStore();

  const appId = id || selectedApplicationId;
  const app = applications.find((a) => a.id === appId) || applications[0]; // fallback to first app if mock

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'PREPARATION' | 'NOTES' | 'INTERVIEW_EXP' | 'DOCUMENTS' | 'COMPANY_INSIGHTS'
  >('OVERVIEW');

  const [newNote, setNewNote] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  if (!app) {
    return (
      <div className="min-h-screen bg-[#EFFAFD]/30 p-8 flex flex-col items-center justify-center space-y-4">
        <Building2 size={48} className="text-[#2459A8]" />
        <h2 className="text-xl font-bold text-[#11183D]">Application Not Found</h2>
        <button
          onClick={() => navigate('/placement-crm')}
          className="px-4 py-2 bg-[#2459A8] text-white rounded-xl text-xs font-bold"
        >
          Return to Placement CRM
        </button>
      </div>
    );
  }

  // Calculated task progress
  const completedTasks = app.prepTasks.filter((t) => t.isCompleted).length;
  const totalTasks = app.prepTasks.length || 7;
  const taskProgressPct = Math.round((completedTasks / totalTasks) * 100);

  const handleTaskToggle = (taskId: string) => {
    togglePrepTask(app.id, taskId);
    toast.success('Task status updated!');
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNote(app.id, {
      stage: app.stage,
      content: newNote.trim(),
      type: 'NOTE'
    });
    setNewNote('');
    toast.success('Note added!');
  };

  const handleDelete = () => {
    if (window.confirm(`Delete application for ${app.company}?`)) {
      deleteApplication(app.id);
      toast.success('Application deleted.');
      navigate('/placement-crm');
    }
  };

  // Pipeline stages for progress stepper
  const STAGES: { id: ApplicationStage; label: string; date?: string }[] = [
    { id: 'APPLIED', label: 'Applied', date: 'Sep 12' },
    { id: 'SHORTLISTED', label: 'Shortlisted', date: 'Sep 14' },
    { id: 'OA', label: 'OA', date: 'Upcoming' },
    { id: 'TECHNICAL_1', label: 'Technical', date: '-' },
    { id: 'HR', label: 'HR', date: '-' },
    { id: 'OFFERED', label: 'Offer', date: '-' },
  ];

  const currentStageIndex = STAGES.findIndex((s) => s.id === app.stage);

  return (
    <div className="min-h-screen bg-[#F4F8FA] p-4 sm:p-6 lg:p-8 font-sans select-none">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 1. TOP NAVIGATION & ACTION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => {
              setSelectedApplicationId(null);
              navigate('/placement-crm');
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#11183D] hover:text-[#2459A8] bg-white border border-[#DCE7F2] px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <ArrowLeft size={16} />
            <span>Back to Applications</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-white border border-[#DCE7F2] text-[#526078] hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
              title="Delete Application"
            >
              <Trash2 size={16} />
            </button>

            <button
              onClick={() => navigate('/placement-crm/add')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#DCE7F2] rounded-xl text-xs font-bold text-[#11183D] hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
            >
              <Edit3 size={14} className="text-[#2459A8]" />
              <span>Edit Application</span>
            </button>

            <a
              href="https://careers.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2459A8] hover:bg-[#1a4380] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>Open Job Link</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* 2. HERO COMPANY BANNER CARD */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-sm overflow-hidden border border-slate-700/50">
          {/* Decorative background image overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none mix-blend-overlay"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80')` 
            }}
          />

          <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
            
            {/* Left Info Column */}
            <div className="flex items-start gap-4 sm:gap-6 max-w-3xl">
              {/* Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-3 shadow-md flex items-center justify-center shrink-0 border border-slate-100">
                {app.company.toLowerCase() === 'google' ? (
                  <svg className="w-10 h-10" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.27v3.13C3.25 21.3 7.31 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.63H1.27C.46 8.24 0 10.06 0 12s.46 3.76 1.27 5.37l4.01-3.13z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.63l4.01 3.13c.95-2.85 3.6-4.96 6.72-4.96z"/>
                  </svg>
                ) : (
                  <Building2 size={36} className="text-[#2459A8]" />
                )}
              </div>

              {/* Company & Role Text */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                    {app.company}
                  </h1>
                  <span className="px-3 py-1 bg-[#4A8BDF]/20 text-[#4A8BDF] border border-[#4A8BDF]/40 rounded-full text-xs font-bold">
                    {app.driveType === 'CAMPUS' ? 'On Campus' : app.driveType === 'OFF_CAMPUS' ? 'Off Campus' : 'Referral'}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-200">
                  {app.role}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#4A8BDF]" />
                    {app.location || 'Hyderabad, India'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={14} className="text-[#4A8BDF]" />
                    Internship / SDE
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    💎 {app.ctc}
                  </span>
                </div>

                <p className="text-xs text-slate-400 max-w-xl leading-relaxed pt-1">
                  {app.jobDescription
                    ? app.jobDescription.slice(0, 140) + '...'
                    : "Build for everyone. Google's internship provides an opportunity to work on real-world problems, learn from industry experts, and make an impact at global scale."}
                </p>
              </div>

            </div>

            {/* Right Status Card Box */}
            <div className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-3 min-w-[260px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-semibold">Status:</span>
                
                {/* Stage dropdown trigger */}
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Application in Progress</span>
                    <ChevronRight size={12} className="rotate-90" />
                  </button>

                  {showStatusDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-[#DCE7F2] rounded-2xl shadow-xl z-30 p-1.5 text-[#11183D]">
                      {STAGES.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            moveStage(app.id, s.id);
                            setShowStatusDropdown(false);
                            toast.success(`Stage updated to ${s.label}`);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            app.stage === s.id ? 'bg-[#EFFAFD] text-[#2459A8]' : 'hover:bg-slate-50'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Deadline Box */}
              <div className="bg-rose-500/20 border border-rose-400/30 rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-200 flex items-center gap-1.5">
                    <Calendar size={13} />
                    OA Deadline
                  </span>
                  <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black uppercase rounded-full">
                    Urgent
                  </span>
                </div>
                <div className="text-base font-black text-white font-mono">
                  {app.timeTag || '18 hours left'}
                </div>
                <div className="text-[10px] text-rose-200 font-medium">
                  {app.nextDeadlineDate ? app.nextDeadlineDate.split('T')[0] : 'Sep 18, 2026'} • 10:00 AM
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. NAVIGATION TABS BAR */}
        <div className="bg-white border border-[#DCE7F2] rounded-2xl p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'OVERVIEW', label: 'Overview', icon: Calendar },
            { id: 'PREPARATION', label: 'Preparation', icon: Target },
            { id: 'NOTES', label: 'Notes & Resources', icon: BookOpen },
            { id: 'INTERVIEW_EXP', label: 'Interview Experience', icon: Users },
            { id: 'DOCUMENTS', label: 'Documents', icon: FileText },
            { id: 'COMPANY_INSIGHTS', label: 'Company Insights', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2459A8] text-white shadow-xs'
                    : 'text-[#526078] hover:text-[#11183D] hover:bg-[#EFFAFD]'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. OVERVIEW TAB MAIN DASHBOARD CONTENT */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">

            {/* TOP ROW: PROGRESS STEPPER & PREPARATION READINESS DONUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left Stepper Card (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                  <div className="flex items-center gap-2">
                    <Target size={18} className="text-[#2459A8]" />
                    <h3 className="text-base font-black font-display text-[#11183D]">
                      Application Progress
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveTab('PREPARATION')}
                    className="text-xs font-bold text-[#2459A8] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Timeline</span>
                    <ArrowLeft size={12} className="rotate-180" />
                  </button>
                </div>

                {/* Progress Stepper Bar */}
                <div className="relative py-4">
                  <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
                  
                  <div className="grid grid-cols-6 gap-2 relative z-10 text-center">
                    {STAGES.map((s, idx) => {
                      const isPast = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      return (
                        <div key={s.id} className="flex flex-col items-center space-y-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isPast
                              ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                              : isCurrent
                              ? 'bg-[#2459A8] text-white ring-4 ring-[#EFFAFD] animate-pulse'
                              : 'bg-slate-100 text-[#7B8799] border border-slate-200'
                          }`}>
                            {isPast ? <Check size={16} /> : idx + 1}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#11183D]">{s.label}</div>
                            <div className="text-[10px] font-semibold text-[#7B8799]">{s.date}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Donut Readiness Card (4 cols) */}
              <div className="lg:col-span-4 bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="flex items-center gap-2 border-b border-[#DCE7F2] pb-3">
                  <Zap size={18} className="text-amber-500 fill-amber-500" />
                  <h3 className="text-base font-black font-display text-[#11183D]">
                    Preparation Readiness
                  </h3>
                </div>

                <div className="flex items-center gap-5">
                  {/* SVG Donut Circle */}
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500"
                        strokeDasharray="78, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-black text-base text-[#11183D] font-mono">
                      78%
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-emerald-600">Good Progress</h4>
                    <p className="text-[11px] text-[#526078] leading-tight">
                      Keep going! Complete the remaining tasks to be fully prepared.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/interview/coding/new')}
                  className="w-full py-2.5 px-4 bg-[#2459A8] hover:bg-[#1a4380] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <span>Start Preparation</span>
                  <ArrowLeft size={14} className="rotate-180" />
                </button>
              </div>

            </div>

            {/* MIDDLE ROW: IMPORTANT DETAILS, TASKS, & RESUME USED (3 EQUAL COLUMNS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Card 1: Important Details */}
              <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#DCE7F2] pb-3">
                  <FileText size={18} className="text-[#2459A8]" />
                  <h3 className="text-base font-black font-display text-[#11183D]">
                    Important Details
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start justify-between py-1 border-b border-slate-100">
                    <span className="text-[#526078] font-medium">Role:</span>
                    <span className="font-bold text-[#11183D] text-right">{app.role}</span>
                  </div>

                  <div className="flex items-start justify-between py-1 border-b border-slate-100">
                    <span className="text-[#526078] font-medium">Location:</span>
                    <span className="font-bold text-[#11183D] text-right">{app.location || 'Hyderabad (On-site)'}</span>
                  </div>

                  <div className="flex items-start justify-between py-1 border-b border-slate-100">
                    <span className="text-[#526078] font-medium">Stipend / CTC:</span>
                    <span className="font-bold text-[#2459A8] font-mono">{app.ctc}</span>
                  </div>

                  <div className="flex items-start justify-between py-1 border-b border-slate-100">
                    <span className="text-[#526078] font-medium">Applied Date:</span>
                    <span className="font-bold text-[#11183D]">{app.appliedDate}</span>
                  </div>

                  <div className="flex items-start justify-between py-1 border-b border-slate-100">
                    <span className="text-[#526078] font-medium">OA Date:</span>
                    <span className="font-bold text-[#11183D]">Sep 18, 2026 • 10:00 AM</span>
                  </div>

                  <div className="flex items-start justify-between py-1 border-b border-slate-100">
                    <span className="text-[#526078] font-medium">Time Left:</span>
                    <span className="font-bold text-rose-600 flex items-center gap-1 font-mono">
                      ⏳ {app.timeTag || '18 hours'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-1 border-b border-slate-100">
                    <span className="text-[#526078] font-medium">Application Link:</span>
                    <a href="#" className="font-bold text-[#2459A8] hover:underline flex items-center gap-1">
                      <span>Open Link</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="flex items-start justify-between py-1">
                    <span className="text-[#526078] font-medium">Hiring Process:</span>
                    <span className="font-bold text-[#11183D] text-right text-[11px] max-w-[150px]">
                      OA → Tech 1 → Tech 2 → HR
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Your Tasks */}
              <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-[#2459A8]" />
                      <h3 className="text-base font-black font-display text-[#11183D]">
                        Your Tasks
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2] rounded-full text-[10px] font-bold font-mono">
                      {completedTasks}/{totalTasks} completed
                    </span>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 no-scrollbar">
                    {app.prepTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleTaskToggle(t.id)}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                          t.isCompleted
                            ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                            : 'bg-white border-[#DCE7F2] hover:border-[#2459A8] text-[#11183D]'
                        }`}
                      >
                        <div className={`mt-0.5 shrink-0 ${t.isCompleted ? 'text-emerald-500' : 'text-slate-300'}`}>
                          {t.isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate leading-snug">{t.title}</p>
                        </div>
                        <span className="text-[10px] font-bold font-mono text-[#7B8799] shrink-0">
                          {t.estimatedMinutes}m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/interview/coding/new')}
                  className="w-full py-2.5 px-4 bg-[#2459A8] hover:bg-[#1a4380] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs mt-2"
                >
                  <span>Start Next Task</span>
                  <ArrowLeft size={14} className="rotate-180" />
                </button>
              </div>

              {/* Card 3: Resume Used */}
              <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-[#2459A8]" />
                      <h3 className="text-base font-black font-display text-[#11183D]">
                        Resume Used
                      </h3>
                    </div>
                    <button 
                      onClick={() => navigate('/ats')}
                      className="text-[11px] font-bold text-[#2459A8] hover:underline cursor-pointer"
                    >
                      Change Resume
                    </button>
                  </div>

                  <div className="p-4 bg-[#EFFAFD]/60 border border-[#DCE7F2] rounded-2xl space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white border border-[#DCE7F2] text-[#2459A8]">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-[#11183D]">
                            {app.resumeTitle || 'SWE_Resume_v4.pdf'}
                          </h5>
                          <p className="text-[10px] text-[#526078]">Updated: Sep 10, 2026</p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-bold">
                        Best Match
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-[#DCE7F2]/80 pt-2">
                      <span className="text-[#526078] font-medium">ATS Match Score:</span>
                      <span className="font-black text-emerald-600 font-mono text-sm">
                        91 / 100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate('/ats')}
                    className="py-2 px-3 rounded-xl border border-[#DCE7F2] bg-white text-xs font-bold text-[#11183D] hover:bg-slate-50 transition-colors cursor-pointer text-center"
                  >
                    View Resume
                  </button>
                  <button
                    onClick={() => navigate('/ats')}
                    className="py-2 px-3 rounded-xl bg-[#2459A8] text-white text-xs font-bold hover:bg-[#1a4380] transition-colors cursor-pointer text-center shadow-xs"
                  >
                    Analyze Again
                  </button>
                </div>
              </div>

            </div>

            {/* BOTTOM ROW: RECOMMENDED PREPARATION PLAN & QUICK ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Recommended Prep Plan (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                  <div>
                    <h3 className="text-base font-black font-display text-[#11183D] flex items-center gap-2">
                      <BrainCircuit size={18} className="text-[#2459A8]" />
                      Recommended Preparation Plan
                    </h3>
                    <p className="text-xs text-[#526078]">
                      Based on the {app.company} OA pattern and your skill profile.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/interview/coding/new')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2] hover:bg-[#DCE7F2] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles size={14} />
                    <span>Generate with AI</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Data Structures & Algorithms', pct: '60%', detail: '12 topics • 2h 30m', icon: FileCode, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                    { title: 'Coding Practice', pct: '20%', detail: '8 problems • 1h 15m', icon: Play, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                    { title: 'Aptitude & Logic', pct: '10%', detail: '3 sets • 45m', icon: Target, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                    { title: 'System Design Basics', pct: '10%', detail: 'Review key concepts • 45m', icon: Zap, color: 'text-rose-600 bg-rose-50 border-rose-200' },
                  ].map((mod, idx) => {
                    const Icon = mod.icon;
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-[#DCE7F2] bg-white hover:border-[#2459A8] hover:shadow-xs transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-xl border ${mod.color}`}>
                            <Icon size={16} />
                          </div>
                          <span className="text-xs font-black font-mono text-[#2459A8]">{mod.pct}</span>
                        </div>
                        <h5 className="text-xs font-bold text-[#11183D]">{mod.title}</h5>
                        <p className="text-[11px] text-[#7B8799] font-medium">{mod.detail}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions & Motivation Quote (4 cols) */}
              <div className="lg:col-span-4 space-y-6">

                {/* Quick Actions Panel */}
                <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-xs space-y-3">
                  <h4 className="text-xs font-black font-mono text-[#7B8799] uppercase tracking-wider">
                    Quick Actions
                  </h4>

                  <div className="space-y-2">
                    {[
                      { label: 'Start OA Preparation', route: '/interview/coding/new', color: 'text-rose-600 bg-rose-50 border-rose-200' },
                      { label: 'Take a Mock Test', route: '/interview/new', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                      { label: 'View Interview Questions', route: '/discuss', color: 'text-amber-600 bg-amber-50 border-amber-200' },
                      { label: 'Read Company Insights', route: '/placement-crm', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                      { label: 'Add a Note', route: '#notes', color: 'text-[#2459A8] bg-[#EFFAFD] border-[#DCE7F2]' },
                    ].map((qa, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate(qa.route)}
                        className="w-full text-left p-3 rounded-2xl border border-[#DCE7F2] bg-white hover:border-[#2459A8] hover:bg-[#EFFAFD]/30 transition-all flex items-center justify-between text-xs font-bold text-[#11183D] cursor-pointer group"
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${qa.color}`} />
                          {qa.label}
                        </span>
                        <ArrowLeft size={14} className="rotate-180 text-[#7B8799] group-hover:text-[#2459A8] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Motivational Quote Card */}
                <div className="p-6 bg-gradient-to-br from-[#EFFAFD] via-blue-50 to-[#DCE7F2]/60 border border-[#DCE7F2] rounded-3xl space-y-2 relative overflow-hidden">
                  <p className="text-xs font-bold text-[#11183D] italic leading-relaxed">
                    "The best way to predict your future is to create it."
                  </p>
                  <p className="text-[11px] font-mono text-[#2459A8] font-bold">— Alan Kay</p>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
