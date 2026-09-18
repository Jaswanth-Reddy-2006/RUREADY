import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, FileText, CheckCircle2, AlertTriangle, ArrowRight,
  BrainCircuit, Layers, Target
} from 'lucide-react';
import { usePlacementStore, PrepTask } from '../../store/usePlacementStore';
import toast from 'react-hot-toast';

interface JdParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
}

export default function JdParserModal({ isOpen, onClose, applicationId }: JdParserModalProps) {
  const { applications, analyzeJdAndGeneratePlan } = usePlacementStore();
  const [selectedAppId, setSelectedAppId] = useState<string>(applicationId || applications[0]?.id || '');
  const [jdText, setJdText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<{ matched: string[]; missing: string[]; tasks: PrepTask[] } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    if (!jdText.trim()) {
      toast.error('Please paste a Job Description first.');
      return;
    }
    if (!selectedAppId) {
      toast.error('Please select an application.');
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeJdAndGeneratePlan(selectedAppId, jdText);
      setAnalysisResult(res);
      setIsAnalyzing(false);
      toast.success('JD analyzed & preparation tasks created!');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-white border border-[#DCE7F2] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE7F2] bg-[#EFFAFD]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#2459A8] text-white">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-[#11183D]">
                Job Description ➔ AI Preparation Plan Generator
              </h3>
              <p className="text-xs text-[#526078]">
                Extract skill gaps and auto-create a 3-day targeted preparation plan.
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Target Application Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#526078] block">Select Target Application</label>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full bg-[#EFFAFD]/50 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company} — {app.role} ({app.stage})
                </option>
              ))}
            </select>
          </div>

          {/* Paste JD Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#526078] block">Paste Job Description (JD)</label>
            <textarea
              rows={5}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste job requirements, roles & responsibilities, tech stack, or qualifications here..."
              className="w-full p-3.5 bg-slate-50 border border-[#DCE7F2] rounded-2xl text-xs font-medium text-[#11183D] placeholder-[#7B8799] focus:outline-none focus:border-[#4A8BDF]"
            />
          </div>

          {/* Action trigger button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3 bg-[#A0006D] hover:bg-[#850059] text-white rounded-2xl font-bold font-display text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={16} />
            <span>{isAnalyzing ? 'Extracting Skills & Generating Plan...' : 'Analyze JD & Generate Plan'}</span>
          </button>

          {/* Analysis Results Display */}
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                <span className="text-xs font-bold font-display text-[#11183D] flex items-center gap-2">
                  <Target size={16} className="text-[#2459A8]" />
                  Skill Gap Matrix
                </span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#2459A8] text-white">
                  3 Prep Tasks Added
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Matched Skills */}
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    Matched Skills (Your Strong Suit)
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.matched.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-rose-600" />
                    Biggest Skill Gaps (Action Needed)
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.missing.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tasks preview */}
              <div className="space-y-2 pt-2">
                <h5 className="text-xs font-bold text-[#11183D]">Auto-Generated 3-Day Action Plan</h5>
                {analysisResult.tasks.map((t) => (
                  <div key={t.id} className="p-2.5 bg-white border border-[#DCE7F2] rounded-xl text-xs font-medium text-[#11183D] flex items-center justify-between">
                    <span>{t.title}</span>
                    <span className="text-[10px] font-bold font-mono text-[#4A8BDF]">{t.estimatedMinutes}m</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
