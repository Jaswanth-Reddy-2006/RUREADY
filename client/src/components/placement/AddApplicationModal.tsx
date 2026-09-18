import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Building2, Briefcase, MapPin, DollarSign, Calendar, FileText } from 'lucide-react';
import { usePlacementStore, ApplicationStage } from '../../store/usePlacementStore';
import toast from 'react-hot-toast';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddApplicationModal({ isOpen, onClose }: AddApplicationModalProps) {
  const { addApplication } = usePlacementStore();

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [ctc, setCtc] = useState('');
  const [location, setLocation] = useState('');
  const [driveType, setDriveType] = useState<'CAMPUS' | 'OFF_CAMPUS' | 'REFERRAL'>('CAMPUS');
  const [stage, setStage] = useState<ApplicationStage>('APPLIED');
  const [deadlineTitle, setDeadlineTitle] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [resumeTitle, setResumeTitle] = useState('SWE_Resume_v4.pdf');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      toast.error('Company and Role are required.');
      return;
    }

    addApplication({
      company,
      role,
      ctc: ctc || '₹12-18 LPA',
      location: location || 'Hyderabad / Remote',
      driveType,
      stage,
      resumeTitle,
      nextDeadlineTitle: deadlineTitle || undefined,
      nextDeadlineDate: deadlineDate ? new Date(deadlineDate).toISOString() : undefined,
    });

    toast.success(`Application for ${company} created!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-white border border-[#DCE7F2] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE7F2] bg-[#EFFAFD]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#2459A8] text-white">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-[#11183D]">
                Add Job Application
              </h3>
              <p className="text-xs text-[#526078]">
                Create a new hiring pipeline card in Placement Command Center.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white text-[#7B8799] hover:text-[#11183D] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#526078] block">Company Name *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Microsoft, TCS"
                className="w-full bg-slate-50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#526078] block">Role Title *</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer, SDE Intern"
                className="w-full bg-slate-50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#526078] block">Package / CTC</label>
              <input
                type="text"
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
                placeholder="e.g. ₹18.0 LPA or ₹80K/month"
                className="w-full bg-slate-50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#526078] block">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Hyderabad / Remote"
                className="w-full bg-slate-50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#526078] block">Drive Type</label>
              <select
                value={driveType}
                onChange={(e) => setDriveType(e.target.value as any)}
                className="w-full bg-slate-50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none"
              >
                <option value="CAMPUS">On-Campus Drive</option>
                <option value="OFF_CAMPUS">Off-Campus Application</option>
                <option value="REFERRAL">Employee Referral</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#526078] block">Current Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full bg-slate-50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none"
              >
                <option value="APPLIED">Applied</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="OA">OA Stage</option>
                <option value="TECHNICAL_1">Technical 1</option>
                <option value="TECHNICAL_2">Technical 2</option>
                <option value="MANAGERIAL">Managerial / HR</option>
                <option value="OFFERED">Offered</option>
              </select>
            </div>
          </div>

          {/* Next Deadline */}
          <div className="p-3 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl space-y-3">
            <span className="text-xs font-bold text-[#2459A8] block">Next Assessment / Interview Deadline (Optional)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={deadlineTitle}
                onChange={(e) => setDeadlineTitle(e.target.value)}
                placeholder="e.g. Coding OA Round 1"
                className="bg-white border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none"
              />
              <input
                type="datetime-local"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="bg-white border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#526078] hover:text-[#11183D] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display shadow-md transition-all cursor-pointer"
            >
              Save Application
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
