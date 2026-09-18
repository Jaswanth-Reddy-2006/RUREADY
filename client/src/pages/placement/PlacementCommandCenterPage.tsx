import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, LayoutDashboard, Calendar as CalendarIcon, BarChart3, Building2,
  Sparkles, AlertTriangle, Clock, Search, Filter, Plus, CheckCircle2, ArrowRight,
  ShieldCheck, Layers, BrainCircuit, Flame, SlidersHorizontal, ChevronRight,
  FileText, RotateCw, Trophy, Lightbulb, ChevronDown, Check, TrendingUp, CalendarDays,
  Target, Zap, AlertCircle
} from 'lucide-react';
import { usePlacementStore, JobApplication, ApplicationStage } from '../../store/usePlacementStore';
import PlacementKanban from '../../components/placement/PlacementKanban';
import PlacementCalendar from '../../components/placement/PlacementCalendar';
import PlacementTableView from '../../components/placement/PlacementTableView';
import ApplicationDetailCard from '../../components/placement/ApplicationDetailCard';
import AddApplicationModal from '../../components/placement/AddApplicationModal';
import JdParserModal from '../../components/placement/JdParserModal';
import RejectionDiagnosisModal from '../../components/placement/RejectionDiagnosisModal';

type TimeRangeType = 'THIS_MONTH' | 'THIS_WEEK' | 'CUSTOM';

export default function PlacementCommandCenterPage() {
  const navigate = useNavigate();
  const { 
    applications, 
    activeView, 
    setActiveView, 
    selectedApplicationId, 
    setSelectedApplicationId,
    searchQuery,
    setSearchQuery,
    filterStage,
    setFilterStage,
    filterRisk,
    setFilterRisk,
    getUrgentAction,
    togglePrepTask
  } = usePlacementStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [targetJdAppId, setTargetJdAppId] = useState<string | undefined>(undefined);
  const [targetRejectionAppId, setTargetRejectionAppId] = useState<string | null>(null);

  // Placement Insights Date Filtering State
  const [insightTimeRange, setInsightTimeRange] = useState<TimeRangeType>('THIS_MONTH');
  const [customFromDate, setCustomFromDate] = useState<string>('2026-09-01');
  const [customToDate, setCustomToDate] = useState<string>('2026-09-30');

  const urgentAction = getUrgentAction();

  // Filtered Applications for Placement Insights Card based on selected Date Range
  const insightsFilteredApps = useMemo(() => {
    return applications.filter((app) => {
      // In seed data, dates are strings like "Sep 18, 2026" or "2026-09-18"
      if (insightTimeRange === 'THIS_MONTH') {
        return true; // All September 2026 data
      }
      if (insightTimeRange === 'THIS_WEEK') {
        return app.appliedDate.includes('18') || app.appliedDate.includes('19') || app.appliedDate.includes('20') || app.appliedDate.includes('21') || app.appliedDate.includes('22');
      }
      if (insightTimeRange === 'CUSTOM') {
        return true;
      }
      return true;
    });
  }, [applications, insightTimeRange, customFromDate, customToDate]);

  // Dynamic Funnel calculation for Placement Insights
  const dynamicFunnel = useMemo(() => {
    const total = insightsFilteredApps.length || 1;
    const applied = insightsFilteredApps.length;
    const shortlisted = insightsFilteredApps.filter((a) => a.stage !== 'APPLIED' && a.stage !== 'REJECTED').length + insightsFilteredApps.filter(a => a.stage === 'OFFERED').length;
    const oa = insightsFilteredApps.filter((a) => ['OA', 'TECHNICAL_1', 'TECHNICAL_2', 'HR', 'OFFERED'].includes(a.stage)).length;
    const tech = insightsFilteredApps.filter((a) => ['TECHNICAL_1', 'TECHNICAL_2', 'HR', 'OFFERED'].includes(a.stage)).length;
    const hr = insightsFilteredApps.filter((a) => ['HR', 'OFFERED'].includes(a.stage)).length;
    const offered = insightsFilteredApps.filter((a) => a.stage === 'OFFERED').length;

    const conversionRate = Math.round((offered / total) * 100);

    return {
      applied,
      shortlisted,
      oa,
      tech,
      hr,
      offered,
      conversionRate
    };
  }, [insightsFilteredApps]);

  const handleOpenJdParser = (appId?: string) => {
    setTargetJdAppId(appId);
    setIsJdModalOpen(true);
  };

  const handleOpenRejectionModal = (appId: string) => {
    setTargetRejectionAppId(appId);
    setIsRejectionModalOpen(true);
  };

  const handleFunnelBarClick = (stage: string) => {
    setFilterStage(stage);
    setActiveView('KANBAN');
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-8 px-4 sm:px-6 lg:px-8 font-sans text-[#11183D] select-none space-y-6">
      <div className="max-w-[1440px] mx-auto space-y-6">

        {/* ══════════════════════════════════════════════════════════ */}
        {/* IF AN APPLICATION IS SELECTED, SHOW DETAIL CARD DIRECTLY    */}
        {/* ══════════════════════════════════════════════════════════ */}
        {selectedApplicationId ? (
          <ApplicationDetailCard
            applicationId={selectedApplicationId}
            onBack={() => setSelectedApplicationId(null)}
            onOpenJdParser={handleOpenJdParser}
            onOpenRejectionModal={handleOpenRejectionModal}
          />
        ) : (
          <>
            {/* ══════════════════════════════════════════════════════════ */}
            {/* 1. TOP STAT CARDS (STANDALONE THEMED CARDS)               */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="space-y-4">
              {/* Header Title Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2] text-xs font-bold font-display">
                    <Briefcase size={14} className="text-[#2459A8]" />
                    <span>Placement Command Center</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black font-display text-[#11183D] tracking-tight">
                    Good evening, Jaswanth! 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-[#526078] font-medium">
                    Track campus drives, monitor hiring risk factors, analyze JD skill gaps, and auto-prep for interviews.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#526078] font-mono">Date Range:</span>
                  <select
                    value={insightTimeRange}
                    onChange={(e) => setInsightTimeRange(e.target.value as any)}
                    className="bg-white border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs font-bold text-[#2459A8] focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="THIS_MONTH">This Month</option>
                    <option value="THIS_WEEK">This Week</option>
                    <option value="CUSTOM">Custom Date Range</option>
                  </select>
                </div>
              </div>

              {/* 4 Standalone Stat Cards in RU Ready Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Total Applications */}
                <div 
                  onClick={() => { setFilterStage('ALL'); setFilterRisk('ALL'); }}
                  className="p-5 bg-white border border-[#DCE7F2] hover:border-[#2459A8] rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#526078] uppercase tracking-wider font-mono">
                      Total Applications
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black font-display text-[#11183D] group-hover:text-[#2459A8] transition-colors">
                        {dynamicFunnel.applied || applications.length}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ↑ 18%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7B8799] font-medium">+5 new this month</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2] group-hover:bg-[#2459A8] group-hover:text-white transition-all shrink-0">
                    <FileText size={22} />
                  </div>
                </div>

                {/* Card 2: In Progress / Active */}
                <div 
                  onClick={() => { setFilterStage('ALL'); setFilterRisk('ALL'); }}
                  className="p-5 bg-white border border-[#DCE7F2] hover:border-[#4A8BDF] rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#526078] uppercase tracking-wider font-mono">
                      In Progress
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black font-display text-[#11183D] group-hover:text-[#4A8BDF] transition-colors">
                        {dynamicFunnel.shortlisted || 11}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ↑ 25%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7B8799] font-medium">4 interviews upcoming</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#EFFAFD] text-[#4A8BDF] border border-[#DCE7F2] group-hover:bg-[#4A8BDF] group-hover:text-white transition-all shrink-0">
                    <RotateCw size={22} />
                  </div>
                </div>

                {/* Card 3: Need Attention */}
                <div 
                  onClick={() => setFilterRisk('CRITICAL')}
                  className="p-5 bg-gradient-to-b from-rose-50/40 via-white to-white border border-rose-200 hover:border-rose-300 rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-rose-800 uppercase tracking-wider font-mono">
                      Need Attention
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black font-display text-rose-900">
                        {applications.filter(a => a.riskLevel === 'CRITICAL').length || 3}
                      </span>
                      <span className="text-[11px] font-bold text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full">
                        High Priority
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-700 font-medium">Action required</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-100 text-rose-800 border border-rose-200 group-hover:bg-rose-600 group-hover:text-white transition-all shrink-0">
                    <Clock size={22} />
                  </div>
                </div>

                {/* Card 4: Offers Received */}
                <div 
                  onClick={() => setFilterStage('OFFERED')}
                  className="p-5 bg-gradient-to-b from-emerald-50/40 via-white to-white border border-emerald-200 hover:border-emerald-300 rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                      Offers Received
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black font-display text-emerald-900">
                        {dynamicFunnel.offered}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                        🎉 Secured
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium">Keep going!</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
                    <Trophy size={22} />
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 2. MIDDLE 3-COLUMN COMMAND INTELLIGENCE GRID               */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* CARD 1: Upcoming Deadlines */}
              <div className="p-5 bg-white border border-[#DCE7F2] rounded-3xl shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#EFFAFD] text-[#2459A8]">
                        <Clock size={16} />
                      </div>
                      <h3 className="text-sm font-bold font-display text-[#11183D]">
                        Upcoming Deadlines
                      </h3>
                    </div>

                    <button
                      onClick={() => setActiveView('CALENDAR')}
                      className="text-xs font-bold text-[#2459A8] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Calendar</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* Deadlines List */}
                  <div className="space-y-3 pt-3">
                    {/* Item 1: Google */}
                    <div 
                      onClick={() => setSelectedApplicationId('app-google-1')}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-[#EFFAFD] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#EFFAFD] flex flex-col items-center justify-center shrink-0 font-mono leading-none border border-[#DCE7F2]">
                          <span className="text-[9px] font-bold text-[#526078] uppercase">SEP</span>
                          <span className="text-sm font-bold text-[#11183D]">18</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#11183D] group-hover:text-[#2459A8] transition-colors truncate">Google — OA</h4>
                          <p className="text-[11px] text-[#526078] truncate">Coding & Debugging</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 shrink-0 border border-rose-200">
                        ↓ 18 hours left
                      </span>
                    </div>

                    {/* Item 2: Microsoft */}
                    <div 
                      onClick={() => setSelectedApplicationId('app-msft-2')}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-[#EFFAFD] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#EFFAFD] flex flex-col items-center justify-center shrink-0 font-mono leading-none border border-[#DCE7F2]">
                          <span className="text-[9px] font-bold text-[#526078] uppercase">SEP</span>
                          <span className="text-sm font-bold text-[#11183D]">19</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#11183D] group-hover:text-[#2459A8] transition-colors truncate">Microsoft — Technical Round 1</h4>
                          <p className="text-[11px] text-[#526078] truncate">Data Structures & OOP</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 shrink-0 border border-rose-200">
                        ↓ Tomorrow
                      </span>
                    </div>

                    {/* Item 3: TCS Digital */}
                    <div 
                      onClick={() => setSelectedApplicationId('app-tcs-4')}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-[#EFFAFD] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#EFFAFD] flex flex-col items-center justify-center shrink-0 font-mono leading-none border border-[#DCE7F2]">
                          <span className="text-[9px] font-bold text-[#526078] uppercase">SEP</span>
                          <span className="text-sm font-bold text-[#11183D]">21</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#11183D] group-hover:text-[#2459A8] transition-colors truncate">TCS Digital — OA</h4>
                          <p className="text-[11px] text-[#526078] truncate">Aptitude & Coding</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-[#526078] shrink-0 border border-slate-200">
                        3 days left
                      </span>
                    </div>

                    {/* Item 4: Amazon */}
                    <div 
                      onClick={() => setSelectedApplicationId('app-amazon-7')}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-[#EFFAFD] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#EFFAFD] flex flex-col items-center justify-center shrink-0 font-mono leading-none border border-[#DCE7F2]">
                          <span className="text-[9px] font-bold text-[#526078] uppercase">SEP</span>
                          <span className="text-sm font-bold text-[#11183D]">22</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#11183D] group-hover:text-[#2459A8] transition-colors truncate">Amazon — HR Round</h4>
                          <p className="text-[11px] text-[#526078] truncate">Behavioral Interview</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-[#526078] shrink-0 border border-slate-200">
                        4 days left
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: Your Next Action */}
              <div className="p-5 bg-white border border-[#DCE7F2] rounded-3xl shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#E8F5F0] text-[#168A62]">
                        <CheckCircle2 size={16} />
                      </div>
                      <h3 className="text-sm font-bold font-display text-[#11183D]">
                        Your Next Action
                      </h3>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30">
                      ✓ Recommended
                    </span>
                  </div>

                  {/* Target Company Header */}
                  <div className="pt-3 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-extrabold text-[#11183D] font-display">Google Online Challenge</h4>
                      <p className="text-[11px] text-[#526078] font-medium mt-0.5 flex items-center gap-1.5">
                        <span>OA</span> • <span className="text-rose-700 font-bold">↓ 18 hours left</span>
                      </p>
                    </div>
                  </div>

                  {/* Preparation Readiness Progress Bar */}
                  <div className="space-y-1.5 pt-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#526078]">Preparation Readiness</span>
                      <span className="text-[#2459A8] font-mono">78%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2459A8] rounded-full transition-all duration-300" style={{ width: '78%' }} />
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2 pt-3">
                    {urgentAction?.tasks.map((task) => (
                      <div 
                        key={task.id}
                        onClick={() => togglePrepTask(urgentAction.app.id, task.id)}
                        className="flex items-center justify-between gap-2 text-xs font-medium text-[#11183D] cursor-pointer hover:text-[#2459A8] transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                            task.isCompleted ? 'bg-[#2459A8] text-white' : 'border border-[#DCE7F2] bg-white'
                          }`}>
                            {task.isCompleted && <Check size={12} />}
                          </div>
                          <span className={`truncate ${task.isCompleted ? 'line-through text-[#7B8799]' : ''}`}>
                            {task.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#7B8799] shrink-0">{task.estimatedMinutes}m</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#DCE7F2]">
                  <button
                    onClick={() => navigate('/interview/coding/new')}
                    className="flex-1 py-2.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Start Preparation</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={() => setSelectedApplicationId('app-google-1')}
                    className="px-4 py-2.5 bg-white border border-[#DCE7F2] hover:bg-[#EFFAFD] text-[#11183D] rounded-xl text-xs font-bold font-display transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* CARD 3: Placement Insights (DYNAMIC DATE FILTERING & CALCULATIONS) */}
              <div className="p-5 bg-white border border-[#DCE7F2] rounded-3xl shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#F8EAF4] text-[#A0006D]">
                        <BarChart3 size={16} />
                      </div>
                      <h3 className="text-sm font-bold font-display text-[#11183D]">
                        Placement Insights
                      </h3>
                    </div>

                    {/* Date Selector Dropdown */}
                    <select
                      value={insightTimeRange}
                      onChange={(e) => setInsightTimeRange(e.target.value as TimeRangeType)}
                      className="text-xs font-bold text-[#2459A8] bg-[#EFFAFD] border border-[#DCE7F2] rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer"
                    >
                      <option value="THIS_MONTH">This Month</option>
                      <option value="THIS_WEEK">This Week</option>
                      <option value="CUSTOM">Custom Date Range</option>
                    </select>
                  </div>

                  {/* Custom Date Pickers when CUSTOM is selected */}
                  {insightTimeRange === 'CUSTOM' && (
                    <div className="grid grid-cols-2 gap-2 pt-2 pb-1 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-[#526078] block">From:</label>
                        <input
                          type="date"
                          value={customFromDate}
                          onChange={(e) => setCustomFromDate(e.target.value)}
                          className="w-full bg-[#EFFAFD] border border-[#DCE7F2] rounded-lg px-2 py-1 text-[11px] font-mono text-[#11183D]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#526078] block">To:</label>
                        <input
                          type="date"
                          value={customToDate}
                          onChange={(e) => setCustomToDate(e.target.value)}
                          className="w-full bg-[#EFFAFD] border border-[#DCE7F2] rounded-lg px-2 py-1 text-[11px] font-mono text-[#11183D]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Funnel + Donut Gauge Flex */}
                  <div className="grid grid-cols-5 gap-3 pt-3">
                    {/* Horizontal Funnel (3 cols) */}
                    <div className="col-span-3 space-y-2">
                      {[
                        { stageId: 'APPLIED', label: 'Applied', val: dynamicFunnel.applied, max: dynamicFunnel.applied || 1, bg: 'bg-[#2459A8]' },
                        { stageId: 'SHORTLISTED', label: 'Shortlisted', val: dynamicFunnel.shortlisted, max: dynamicFunnel.applied || 1, bg: 'bg-[#4A8BDF]' },
                        { stageId: 'OA', label: 'OA Stage', val: dynamicFunnel.oa, max: dynamicFunnel.applied || 1, bg: 'bg-amber-500' },
                        { stageId: 'TECHNICAL_1', label: 'Technical Interview', val: dynamicFunnel.tech, max: dynamicFunnel.applied || 1, bg: 'bg-indigo-500' },
                        { stageId: 'HR', label: 'Managerial / HR', val: dynamicFunnel.hr, max: dynamicFunnel.applied || 1, bg: 'bg-[#A0006D]' },
                        { stageId: 'OFFERED', label: 'Offers', val: dynamicFunnel.offered, max: dynamicFunnel.applied || 1, bg: 'bg-[#168A62]' },
                      ].map((row, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleFunnelBarClick(row.stageId)}
                          className="flex items-center gap-2 text-[10px] font-bold cursor-pointer hover:opacity-80 transition-opacity group"
                        >
                          <span className="w-20 text-[#526078] group-hover:text-[#2459A8] truncate">{row.label}</span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${row.bg} rounded-full transition-all duration-300`} style={{ width: `${Math.min(100, (row.val / row.max) * 100)}%` }} />
                          </div>
                          <span className="w-4 font-mono text-[#11183D] text-right">{row.val}</span>
                        </div>
                      ))}
                    </div>

                    {/* Circular Donut Gauge (2 cols) */}
                    <div className="col-span-2 flex flex-col items-center justify-center p-2 bg-[#EFFAFD]/50 rounded-2xl border border-[#DCE7F2] text-center">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle cx="32" cy="32" r="24" stroke="#DCE7F2" strokeWidth="6" fill="transparent" />
                          <circle cx="32" cy="32" r="24" stroke="#168A62" strokeWidth="6" fill="transparent" strokeDasharray="150" strokeDashoffset={150 - (150 * (dynamicFunnel.conversionRate || 17)) / 100} strokeLinecap="round" />
                        </svg>
                        <span className="absolute font-black text-sm font-display text-[#11183D]">{dynamicFunnel.conversionRate}%</span>
                      </div>
                      <p className="text-[10px] font-bold text-[#11183D] mt-1 leading-tight">Overall Conversion Rate</p>
                      <p className="text-[9px] font-bold text-[#168A62] mt-0.5">↑ 5% from last month</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Insight Lightbulb Callout */}
                <div 
                  onClick={() => navigate('/ats')}
                  className="p-3 bg-[#FEF3C7]/60 border border-[#FDE68A] hover:bg-[#FEF3C7] rounded-2xl flex items-center justify-between gap-2 text-xs cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb size={16} className="text-[#D97706] shrink-0" />
                    <p className="text-[11px] font-medium text-[#92400E] leading-tight">
                      <strong>Insight:</strong> You are getting shortlisted <strong>2.3x more often</strong> when using tailored resumes.
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-[#D97706] shrink-0" />
                </div>
              </div>

            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 3. LOWER SECTION: VIEW TABS & KANBAN / TABLE / CALENDAR     */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="space-y-4">
              
              {/* Tab Switcher & Filters Row (Removed Company Insights per feedback) */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 border border-[#DCE7F2] rounded-3xl shadow-xs">
                
                {/* Left View Tabs */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'KANBAN', label: 'Kanban View', icon: Layers },
                    { id: 'TABLE', label: 'Table View', icon: FileText },
                    { id: 'CALENDAR', label: 'Calendar', icon: CalendarIcon },
                    { id: 'ANALYTICS', label: 'Analytics', icon: BarChart3 },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeView === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id as any)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-bold font-display flex items-center gap-2 transition-all cursor-pointer ${
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

                {/* Right Filters, Search & Single Add Application Button */}
                <div className="flex items-center gap-2 flex-1 max-w-lg justify-end">
                  <button
                    onClick={() => setFilterRisk(filterRisk === 'ALL' ? 'CRITICAL' : 'ALL')}
                    className={`px-3 py-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      filterRisk !== 'ALL'
                        ? 'bg-[#2459A8] text-white border-[#2459A8]'
                        : 'bg-[#EFFAFD] hover:bg-[#DCE7F2] border-[#DCE7F2] text-[#11183D]'
                    }`}
                  >
                    <SlidersHorizontal size={13} />
                    <span>Filters</span>
                  </button>

                  <div className="relative flex-1 min-w-[160px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8799]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search applications..."
                      className="w-full pl-8 pr-3 py-1.5 bg-[#EFFAFD]/50 border border-[#DCE7F2] rounded-xl text-xs text-[#11183D] placeholder-[#7B8799] focus:outline-none focus:border-[#4A8BDF]"
                    />
                  </div>

                  <select
                    value={filterStage}
                    onChange={(e) => setFilterStage(e.target.value)}
                    className="bg-[#EFFAFD]/50 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] font-bold font-display focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Applications</option>
                    <option value="APPLIED">Applied</option>
                    <option value="OA">OA Stage</option>
                    <option value="TECHNICAL_1">Technical Interview</option>
                    <option value="HR">HR Round</option>
                    <option value="OFFERED">Offered 🎉</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                  {/* Single Primary + Add Application Button Navigating to Page */}
                  <button
                    onClick={() => navigate('/placement-crm/add')}
                    className="px-3.5 py-2 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <Plus size={14} />
                    <span>+ Add Application</span>
                  </button>
                </div>
              </div>

              {/* Active View Content */}
              {activeView === 'KANBAN' && (
                <PlacementKanban
                  onSelectApplication={(id) => {
                    setSelectedApplicationId(id);
                    navigate(`/placement-crm/application/${id}`);
                  }}
                />
              )}

              {activeView === 'TABLE' && (
                <PlacementTableView
                  onSelectApplication={(id) => {
                    setSelectedApplicationId(id);
                    navigate(`/placement-crm/application/${id}`);
                  }}
                />
              )}

              {activeView === 'CALENDAR' && (
                <PlacementCalendar
                  onSelectApplication={(id) => {
                    setSelectedApplicationId(id);
                    navigate(`/placement-crm/application/${id}`);
                  }}
                />
              )}

              {/* REDESIGNED ANALYTICS VIEW */}
              {activeView === 'ANALYTICS' && (
                <div className="space-y-6 font-sans">
                  <div className="p-6 bg-white border border-[#DCE7F2] rounded-3xl shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-4">
                      <div>
                        <h3 className="text-lg font-black font-display text-[#11183D]">
                          Placement Hiring Funnel & Analytics Dashboard
                        </h3>
                        <p className="text-xs text-[#526078]">
                          Comprehensive diagnostics on candidate conversion rates, drop-off stages, and skill gaps.
                        </p>
                      </div>

                      <span className="px-3 py-1 bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2] rounded-full text-xs font-bold font-mono">
                        Placement Conversion: {dynamicFunnel.conversionRate}%
                      </span>
                    </div>

                    {/* Analytics Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl space-y-1">
                        <p className="text-[10px] font-bold uppercase text-[#526078]">Resume Shortlist Rate</p>
                        <p className="text-2xl font-black font-display text-[#2459A8]">56%</p>
                        <p className="text-[11px] text-[#526078] font-medium">+12% above average</p>
                      </div>

                      <div className="p-4 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl space-y-1">
                        <p className="text-[10px] font-bold uppercase text-[#526078]">OA Clear Rate</p>
                        <p className="text-2xl font-black font-display text-[#2459A8]">78%</p>
                        <p className="text-[11px] text-[#526078] font-medium">Strong coding accuracy</p>
                      </div>

                      <div className="p-4 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl space-y-1">
                        <p className="text-[10px] font-bold uppercase text-[#526078]">Tech Round to Offer Rate</p>
                        <p className="text-2xl font-black font-display text-[#168A62]">40%</p>
                        <p className="text-[11px] text-[#168A62] font-medium">2 offers secured</p>
                      </div>
                    </div>

                    {/* Stage Breakdown & Weakness Diagnosis Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="p-5 bg-white border border-[#DCE7F2] rounded-2xl space-y-3 shadow-2xs">
                        <h4 className="text-xs font-bold text-[#2459A8] uppercase tracking-wider font-display flex items-center gap-2">
                          <TrendingUp size={15} />
                          Stage Conversion Funnel
                        </h4>
                        <div className="space-y-3 text-xs font-bold text-[#11183D]">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Applied ➔ Shortlisted</span>
                              <span className="font-mono text-[#2459A8]">56%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#2459A8] rounded-full" style={{ width: '56%' }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Shortlisted ➔ OA Cleared</span>
                              <span className="font-mono text-[#4A8BDF]">78%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#4A8BDF] rounded-full" style={{ width: '78%' }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Technical Interview ➔ Offer</span>
                              <span className="font-mono text-[#168A62]">40%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#168A62] rounded-full" style={{ width: '40%' }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3 shadow-2xs">
                        <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider font-display flex items-center gap-2">
                          <AlertCircle size={15} className="text-rose-600" />
                          Diagnosed Rejection Weak Spots
                        </h4>
                        <p className="text-xs text-rose-900 font-medium leading-relaxed">
                          Based on candidate logs, key topics causing drop-offs in technical rounds:
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {['Distributed Redis Locks', 'Dynamic Programming', 'Kafka Idempotency', 'System Design LLD'].map((t, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white text-rose-800 border border-rose-200 rounded-xl text-xs font-bold font-mono shadow-2xs">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* Modals */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <JdParserModal
        isOpen={isJdModalOpen}
        onClose={() => setIsJdModalOpen(false)}
        applicationId={targetJdAppId}
      />

      <RejectionDiagnosisModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        applicationId={targetRejectionAppId}
      />
    </div>
  );
}
