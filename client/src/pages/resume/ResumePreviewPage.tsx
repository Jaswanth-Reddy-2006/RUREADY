import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../../store/useResumeStore';
import ResumeRenderer from '../../components/resume/templates/ResumeRenderer';
import { ArrowLeft, Download, Edit3, Sparkles } from 'lucide-react';

export default function ResumePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resumeVersions, masterResume, activeTemplate } = useResumeStore();

  const targetVersion = resumeVersions.find((v) => v.id === id);
  const data = targetVersion ? targetVersion.resumeData : masterResume;
  const templateId = targetVersion ? targetVersion.templateId : activeTemplate;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-200 font-sans -m-6 sm:-m-8 p-6 overflow-y-auto">
      {/* Floating Action Bar */}
      <div className="max-w-[800px] mx-auto mb-6 bg-white p-4 rounded-2xl border border-[#DCE7F2] shadow-md flex items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/resume')}
            className="p-2 text-[#7B8799] hover:text-[#11183D] rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-[#DCE7F2]"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3 className="text-base font-bold font-display text-[#11183D]">
              {targetVersion ? targetVersion.name : 'Master Resume Preview'}
            </h3>
            <p className="text-xs text-[#526078]">
              {targetVersion ? `Target: ${targetVersion.targetCompany}` : 'Candidate Master Profile'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {targetVersion && (
            <button
              onClick={() => navigate(`/resume/edit/${targetVersion.id}`)}
              className="px-3.5 py-2 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Edit3 size={14} />
              <span>Edit Version</span>
            </button>
          )}

          <button
            onClick={() => navigate(`/resume/analyze?versionId=${id || 'master'}`)}
            className="px-3.5 py-2 bg-[#EFFAFD] border border-[#DCE7F2] text-[#2459A8] rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>ATS Scan</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Rendered Document */}
      <div className="max-w-[800px] mx-auto bg-white shadow-2xl rounded-xl overflow-hidden border border-slate-300">
        <ResumeRenderer templateId={templateId} data={data} />
      </div>
    </div>
  );
}
