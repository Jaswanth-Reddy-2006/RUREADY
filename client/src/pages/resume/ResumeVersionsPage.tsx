import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import ResumeVersionCard from '../../components/resume/ResumeVersionCard';
import NewResumeModal from '../../components/resume/NewResumeModal';
import { Plus, Search, Layers, ArrowLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResumeVersionsPage() {
  const navigate = useNavigate();
  const { resumeVersions } = useResumeStore();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVersions = resumeVersions.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.targetCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE7F2]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/resume')}
            className="p-2 text-[#7B8799] hover:text-[#11183D] rounded-xl hover:bg-white transition-colors cursor-pointer border border-[#DCE7F2]"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#EFFAFD] text-[#2459A8] rounded-lg border border-[#DCE7F2]">
                <Layers size={16} />
              </span>
              <h2 className="text-2xl font-bold font-display text-[#11183D]">
                Job-Specific Resume Versions
              </h2>
            </div>
            <p className="text-xs text-[#526078] mt-1">
              Manage version variations linked to your active Placement CRM job applications
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Plus size={15} />
          <span>New Resume Version</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-[#DCE7F2] flex items-center justify-between gap-4 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8799]" />
          <input
            type="text"
            placeholder="Search by title, role, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs text-[#11183D] focus:outline-none focus:border-[#2459A8]"
          />
        </div>

        <span className="text-xs font-bold font-mono text-[#526078]">
          Showing {filteredVersions.length} of {resumeVersions.length} versions
        </span>
      </div>

      {/* Versions Grid */}
      {filteredVersions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVersions.map((v) => (
            <ResumeVersionCard key={v.id} version={v} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#DCE7F2] space-y-3">
          <Layers size={36} className="text-[#7B8799] mx-auto opacity-50" />
          <h4 className="text-base font-bold text-[#11183D]">No Matching Versions Found</h4>
          <p className="text-xs text-[#526078]">Try adjusting your search terms or create a new version.</p>
        </div>
      )}

      {/* Modal */}
      <NewResumeModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
    </div>
  );
}
