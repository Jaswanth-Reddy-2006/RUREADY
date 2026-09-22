import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import ResumeHeader from '../../components/resume/ResumeHeader';
import ResumeVersionCard from '../../components/resume/ResumeVersionCard';
import NewResumeModal from '../../components/resume/NewResumeModal';
import { Plus, Sparkles, FileText, CheckCircle2, History, Layers, ArrowRight, ExternalLink, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResumeDashboard() {
  const navigate = useNavigate();
  const { resumeVersions, activityLogs, masterResume, activeTemplate } = useResumeStore();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Quick stats
  const totalVersions = resumeVersions.length;
  const analyzedVersions = resumeVersions.filter((v) => v.atsScore !== null);
  const avgAtsScore =
    analyzedVersions.length > 0
      ? Math.round(analyzedVersions.reduce((acc, v) => acc + (v.atsScore || 0), 0) / analyzedVersions.length)
      : null;
  const totalApplicationsLinked = resumeVersions.reduce((acc, v) => acc + v.usedInApplicationsCount, 0);

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto pb-12">
      {/* Header */}
      <ResumeHeader
        onCreateClick={() => setIsNewModalOpen(true)}
        onAnalyzeClick={() => navigate('/resume/analyze')}
      />

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Resume Versions */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#526078]">
            <span className="text-xs font-bold uppercase tracking-wider">Targeted Versions</span>
            <Layers size={18} className="text-[#2459A8]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#11183D]">{totalVersions}</span>
            <span className="text-xs text-[#526078]">Versions Created</span>
          </div>
          <p className="text-[11px] text-[#526078]">Job-tailored for specific roles</p>
        </div>

        {/* Stat 2: Avg ATS Match */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#526078]">
            <span className="text-xs font-bold uppercase tracking-wider">Avg ATS Match</span>
            <Sparkles size={18} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#11183D]">
              {avgAtsScore !== null ? `${avgAtsScore}%` : 'Not Analyzed'}
            </span>
            {avgAtsScore !== null && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {avgAtsScore >= 80 ? 'High' : 'Moderate'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#526078]">Across evaluated resume versions</p>
        </div>

        {/* Stat 3: CRM Applications Linked */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#526078]">
            <span className="text-xs font-bold uppercase tracking-wider">CRM Applications</span>
            <Activity size={18} className="text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#11183D]">{totalApplicationsLinked}</span>
            <span className="text-xs text-[#526078]">Applications</span>
          </div>
          <p className="text-[11px] text-[#526078]">Linked version ID on Placement CRM</p>
        </div>

        {/* Stat 4: Active Template */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#526078]">
            <span className="text-xs font-bold uppercase tracking-wider">Active Design</span>
            <FileText size={18} className="text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-[#11183D] capitalize">
              {activeTemplate.replace('-', ' ')}
            </span>
          </div>
          <p className="text-[11px] text-[#526078]">Standardized ATS-compliant layout</p>
        </div>
      </div>

      {/* Main Master Profile Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-[#EFFAFD] to-blue-50 border border-[#DCE7F2] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2459A8] bg-white px-2.5 py-0.5 rounded-full border border-[#DCE7F2]">
            Master Resume Profile
          </span>
          <h3 className="text-xl font-bold font-display text-[#11183D]">
            {masterResume.personalInfo.fullName || 'Candidate Profile'}
          </h3>
          <p className="text-xs text-[#526078] max-w-xl">
            {masterResume.personalInfo.title} • {masterResume.experience.length} Experiences •{' '}
            {Object.values(masterResume.skills).flat().length} Verified Technical Skills
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
          <button
            onClick={() => navigate('/resume/builder')}
            className="px-4 py-2.5 bg-white border border-[#DCE7F2] hover:bg-slate-50 text-[#11183D] rounded-xl text-xs font-bold font-display flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <FileText size={15} className="text-[#2459A8]" />
            <span>Open 3-Pane Builder</span>
          </button>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus size={15} />
            <span>New Version</span>
          </button>
        </div>
      </div>

      {/* Job-Specific Versions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-display text-[#11183D]">
              Job-Specific Resume Versions
            </h3>
            <p className="text-xs text-[#526078]">
              Targeted resumes tailored for specific job descriptions and companies
            </p>
          </div>

          <button
            onClick={() => navigate('/resume/versions')}
            className="text-xs font-bold text-[#2459A8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({totalVersions})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {totalVersions > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumeVersions.map((version) => (
              <ResumeVersionCard key={version.id} version={version} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#DCE7F2] space-y-3">
            <FileText size={36} className="text-[#7B8799] mx-auto opacity-50" />
            <h4 className="text-base font-bold text-[#11183D]">No Resume Versions Yet</h4>
            <p className="text-xs text-[#526078] max-w-md mx-auto">
              Create targeted versions of your resume for specific job applications to maximize ATS keyword matching.
            </p>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-5 py-2.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display inline-flex items-center gap-1.5 shadow-2xs"
            >
              <Plus size={15} />
              <span>Create First Version</span>
            </button>
          </div>
        )}
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={18} className="text-[#2459A8]" />
            <h3 className="text-base font-bold font-display text-[#11183D]">
              Recent ATS & Resume Activity
            </h3>
          </div>
        </div>

        {activityLogs.length > 0 ? (
          <div className="space-y-3">
            {activityLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 border border-[#DCE7F2] rounded-2xl flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <p className="font-bold text-[#11183D]">{log.title}</p>
                  <p className="text-[11px] text-[#526078]">{log.details}</p>
                </div>
                <span className="text-[10px] font-mono text-[#7B8799] shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#526078] italic">No recent resume actions logged.</p>
        )}
      </div>

      {/* New Resume Modal */}
      <NewResumeModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
    </div>
  );
}
