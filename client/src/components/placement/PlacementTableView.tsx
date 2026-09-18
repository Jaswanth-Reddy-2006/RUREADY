import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Calendar, Clock, ChevronRight, FileText, ArrowUpDown,
  MoreHorizontal, Plus, ExternalLink, Trash2, Edit3, ShieldCheck
} from 'lucide-react';
import { JobApplication, ApplicationStage, usePlacementStore } from '../../store/usePlacementStore';

interface PlacementTableViewProps {
  onSelectApplication: (id: string) => void;
  onOpenAddModal?: () => void;
}

export default function PlacementTableView({ onSelectApplication, onOpenAddModal }: PlacementTableViewProps) {
  const { applications, moveStage, deleteApplication, searchQuery, filterStage, filterRisk } = usePlacementStore();

  const [sortField, setSortField] = useState<'company' | 'appliedDate' | 'prepScore' | 'ctc'>('appliedDate');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredApps = applications.filter((app) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchComp = app.company.toLowerCase().includes(q);
      const matchRole = app.role.toLowerCase().includes(q);
      if (!matchComp && !matchRole) return false;
    }
    if (filterStage !== 'ALL' && app.stage !== filterStage) return false;
    if (filterRisk !== 'ALL' && app.riskLevel !== filterRisk) return false;
    return true;
  });

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortField === 'company') {
      return sortAsc ? a.company.localeCompare(b.company) : b.company.localeCompare(a.company);
    }
    if (sortField === 'prepScore') {
      return sortAsc ? a.prepScore - b.prepScore : b.prepScore - a.prepScore;
    }
    return sortAsc ? a.appliedDate.localeCompare(b.appliedDate) : b.appliedDate.localeCompare(a.appliedDate);
  });

  const toggleSort = (field: 'company' | 'appliedDate' | 'prepScore' | 'ctc') => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl shadow-xs overflow-hidden select-none">
      {/* Table Controls Header */}
      <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold font-display text-[#0F172A]">
            Applications Data Table ({sortedApps.length} Records)
          </h3>
          <p className="text-xs text-[#64748B]">
            Structured tabular view of all campus drives, packages, stages, and preparation scores.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Application</span>
        </button>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="py-3 px-4">
                <button onClick={() => toggleSort('company')} className="flex items-center gap-1 cursor-pointer hover:text-[#0F172A]">
                  <span>Company & Role</span>
                  <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3 px-4">Package / CTC</th>
              <th className="py-3 px-4">Drive Type</th>
              <th className="py-3 px-4">Stage</th>
              <th className="py-3 px-4">
                <button onClick={() => toggleSort('prepScore')} className="flex items-center gap-1 cursor-pointer hover:text-[#0F172A]">
                  <span>Prep Readiness</span>
                  <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3 px-4">Next Deadline</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-xs font-medium text-[#0F172A]">
            {sortedApps.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#94A3B8]">
                  No matching applications found.
                </td>
              </tr>
            ) : (
              sortedApps.map((app) => (
                <tr 
                  key={app.id}
                  onClick={() => onSelectApplication(app.id)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  {/* Company & Role */}
                  <td className="py-3.5 px-4 min-w-[200px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 border border-[#E2E8F0] flex items-center justify-center font-bold text-xs text-[#2563EB] shrink-0 font-display">
                        {app.company.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors truncate">
                          {app.company}
                        </p>
                        <p className="text-[11px] text-[#64748B] truncate">{app.role}</p>
                      </div>
                    </div>
                  </td>

                  {/* CTC */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0F172A] whitespace-nowrap">
                    {app.ctc}
                  </td>

                  {/* Drive Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-slate-100 text-[#475569] border border-slate-200">
                      {app.driveType}
                    </span>
                  </td>

                  {/* Stage Dropdown */}
                  <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={app.stage}
                      onChange={(e) => moveStage(app.id, e.target.value as ApplicationStage)}
                      className="bg-slate-50 border border-[#E2E8F0] rounded-lg px-2 py-1 text-[11px] font-bold text-[#0F172A] focus:outline-none cursor-pointer"
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="OA">OA Stage</option>
                      <option value="TECHNICAL_1">Technical 1</option>
                      <option value="TECHNICAL_2">Technical 2</option>
                      <option value="MANAGERIAL">Managerial / HR</option>
                      <option value="OFFERED">Offered 🎉</option>
                      <option value="REJECTED">Archived</option>
                    </select>
                  </td>

                  {/* Prep Readiness Bar */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#2563EB] w-8">{app.prepScore}%</span>
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${app.prepScore}%` }} />
                      </div>
                    </div>
                  </td>

                  {/* Next Deadline */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {app.nextDeadlineTitle ? (
                      <div>
                        <p className="text-[11px] font-bold text-[#0F172A]">{app.nextDeadlineTitle}</p>
                        <p className="text-[10px] text-[#B91C1C] font-semibold">{app.timeTag || 'Upcoming'}</p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#94A3B8]">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectApplication(app.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-[11px] font-bold transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
