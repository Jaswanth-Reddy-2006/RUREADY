import React from 'react';
import { ResumeVersion, useResumeStore } from '../../store/useResumeStore';
import { Edit3, Sparkles, Eye, Copy, Trash2, Building2, Briefcase, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ResumeVersionCardProps {
  version: ResumeVersion;
}

export default function ResumeVersionCard({ version }: ResumeVersionCardProps) {
  const navigate = useNavigate();
  const { duplicateResumeVersion, deleteResumeVersion } = useResumeStore();

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = duplicateResumeVersion(version.id);
    toast.success('Resume version duplicated!');
    navigate(`/resume/edit/${newId}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete version "${version.name}"?`)) {
      deleteResumeVersion(version.id);
      toast.success('Version deleted.');
    }
  };

  const getScoreBadge = () => {
    if (version.atsScore === null || version.atsScore === undefined) {
      return (
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
          Not Analyzed
        </span>
      );
    }
    if (version.atsScore >= 80) {
      return (
        <span className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 size={12} />
          {version.atsScore}% ATS Match
        </span>
      );
    }
    if (version.atsScore >= 60) {
      return (
        <span className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
          {version.atsScore}% ATS Match
        </span>
      );
    }
    return (
      <span className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
        {version.atsScore}% ATS Match
      </span>
    );
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#DCE7F2] hover:border-[#2459A8]/40 hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {getScoreBadge()}
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#526078] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            {version.templateId.replace('-', ' ')}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold font-display text-[#11183D] group-hover:text-[#2459A8] transition-colors truncate">
          {version.name}
        </h4>

        {/* Metadata */}
        <div className="mt-2 space-y-1 text-xs text-[#526078]">
          <div className="flex items-center gap-1.5">
            <Briefcase size={14} className="text-[#4A8BDF]" />
            <span className="font-medium text-[#11183D] truncate">{version.targetRole}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 size={14} className="text-[#7B8799]" />
            <span className="truncate">{version.targetCompany || 'General Applications'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#7B8799] pt-1">
            <Calendar size={12} />
            <span>Updated: {new Date(version.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Application Usage Counter */}
        {version.usedInApplicationsCount > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-[#2459A8]">
            <span className="font-bold">Active in {version.usedInApplicationsCount} Placement Application{version.usedInApplicationsCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-4 border-t border-[#DCE7F2] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/resume/edit/${version.id}`)}
            className="px-3 py-1.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            title="Edit in 3-pane builder"
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => navigate(`/resume/analyze?versionId=${version.id}`)}
            className="px-3 py-1.5 bg-[#EFFAFD] hover:bg-blue-100 text-[#2459A8] border border-[#DCE7F2] rounded-xl text-xs font-bold font-display flex items-center gap-1 cursor-pointer transition-colors"
            title="Run ATS Match Scanner"
          >
            <Sparkles size={13} />
            <span>ATS</span>
          </button>
        </div>

        <div className="flex items-center gap-1 text-[#7B8799]">
          <button
            onClick={() => navigate(`/resume/preview/${version.id}`)}
            className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-[#11183D] transition-colors cursor-pointer"
            title="Live Preview & Export"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={handleDuplicate}
            className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-[#11183D] transition-colors cursor-pointer"
            title="Duplicate Version"
          >
            <Copy size={15} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Version"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
