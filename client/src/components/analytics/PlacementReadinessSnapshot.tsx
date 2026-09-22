import React from 'react';
import { Briefcase, FileText, GraduationCap, Video, Code2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlacementReadinessSnapshotProps {
  snapshot: {
    resumeAtsScore: number | null;
    prepScore: number;
    codingAvgScore: number | null;
    oralAvgScore: number | null;
    applicationCount: number;
    hasEvidenceInAllAreas: boolean;
  };
}

export default function PlacementReadinessSnapshot({ snapshot }: PlacementReadinessSnapshotProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-2xs space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#DCE7F2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-[#2459A8]" />
            <h3 className="text-lg font-bold font-display text-[#11183D]">
              Placement Snapshot
            </h3>
          </div>
          <p className="text-xs text-[#526078] mt-0.5">
            Multi-dimensional evaluation across Resume ATS, Preparation Engine, Interviews, and CRM Applications.
          </p>
        </div>

        <button
          onClick={() => navigate('/placement-crm')}
          className="px-4 py-2 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors shrink-0"
        >
          <span>View Placement Profile</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Dimension 1: Resume ATS Match */}
        <div className="p-4 bg-slate-50 border border-[#DCE7F2] rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#526078]">
            <span className="font-bold">Resume ATS Match</span>
            <FileText size={16} className="text-[#2459A8]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#11183D]">
            {snapshot.resumeAtsScore !== null ? `${snapshot.resumeAtsScore}%` : 'Not Scanned'}
          </div>
          <p className="text-[10px] text-slate-500">Target Role Match</p>
        </div>

        {/* Dimension 2: Preparation Engine */}
        <div className="p-4 bg-slate-50 border border-[#DCE7F2] rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#526078]">
            <span className="font-bold">Preparation Engine</span>
            <GraduationCap size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#11183D]">
            {snapshot.prepScore}%
          </div>
          <p className="text-[10px] text-slate-500">Subject Readiness</p>
        </div>

        {/* Dimension 3: Coding Interviews */}
        <div className="p-4 bg-slate-50 border border-[#DCE7F2] rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#526078]">
            <span className="font-bold">Coding Interviews</span>
            <Code2 size={16} className="text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#11183D]">
            {snapshot.codingAvgScore !== null ? `${snapshot.codingAvgScore}%` : '--'}
          </div>
          <p className="text-[10px] text-slate-500">Implementation Average</p>
        </div>

        {/* Dimension 4: Oral Interviews */}
        <div className="p-4 bg-slate-50 border border-[#DCE7F2] rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#526078]">
            <span className="font-bold">Oral Interviews</span>
            <Video size={16} className="text-[#2459A8]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#11183D]">
            {snapshot.oralAvgScore !== null ? `${snapshot.oralAvgScore}%` : '--'}
          </div>
          <p className="text-[10px] text-slate-500">Communication Average</p>
        </div>

        {/* Dimension 5: Application Activity */}
        <div className="p-4 bg-slate-50 border border-[#DCE7F2] rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#526078]">
            <span className="font-bold">CRM Activity</span>
            <Briefcase size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#11183D]">
            {snapshot.applicationCount}
          </div>
          <p className="text-[10px] text-slate-500">Active Applications</p>
        </div>
      </div>
    </div>
  );
}
