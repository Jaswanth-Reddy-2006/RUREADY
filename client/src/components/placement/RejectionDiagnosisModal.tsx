import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2, Frown, Sparkles, Target } from 'lucide-react';
import { usePlacementStore, ApplicationStage } from '../../store/usePlacementStore';
import toast from 'react-hot-toast';

interface RejectionDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string | null;
}

export default function RejectionDiagnosisModal({ isOpen, onClose, applicationId }: RejectionDiagnosisModalProps) {
  const { applications, diagnoseRejection } = usePlacementStore();

  const [rejectionStage, setRejectionStage] = useState<ApplicationStage>('TECHNICAL_1');
  const [reason, setReason] = useState('');
  const [weakTopicsInput, setWeakTopicsInput] = useState('');

  if (!isOpen || !applicationId) return null;

  const app = applications.find((a) => a.id === applicationId);
  if (!app) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const topics = weakTopicsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    diagnoseRejection(app.id, rejectionStage, reason || 'Unsuccessful in interview stage', topics);
    toast.success(`Application archived with diagnostic feedback.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white border border-[#DCE7F2] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE7F2] bg-rose-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-600 text-white">
              <Frown size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-rose-950">
                Learn From Your Rejections
              </h3>
              <p className="text-xs text-rose-700">
                Diagnose hiring funnel weak spots for {app.company}.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white text-rose-700 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#526078] block">At what stage were you rejected?</label>
            <select
              value={rejectionStage}
              onChange={(e) => setRejectionStage(e.target.value as ApplicationStage)}
              className="w-full bg-slate-50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none"
            >
              <option value="APPLIED">Resume Screening</option>
              <option value="OA">Online Assessment (OA)</option>
              <option value="TECHNICAL_1">Technical Round 1</option>
              <option value="TECHNICAL_2">Technical Round 2</option>
              <option value="MANAGERIAL">Managerial / HR Round</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#526078] block">What went wrong? (Optional Notes)</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Struggled with DP optimization or didn't explain project trade-offs clearly..."
              className="w-full p-3 bg-slate-50 border border-[#DCE7F2] rounded-2xl text-xs font-medium text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#526078] block">Weak Topics (Comma-separated)</label>
            <input
              type="text"
              value={weakTopicsInput}
              onChange={(e) => setWeakTopicsInput(e.target.value)}
              placeholder="e.g. Dynamic Programming, System Design, SQL"
              className="w-full bg-slate-50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none"
            />
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
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold font-display shadow-md transition-all cursor-pointer"
            >
              Save Diagnostic & Archive
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
