import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function OralReviewPage() {
  const navigate = useNavigate();

  const [config, setConfig] = useState<any>({
    interviewType: 'FULL_SIMULATION',
    targetRole: 'Software Engineer',
    targetCompany: 'None / General Target',
    experienceLevel: 'FRESHER',
    selectedSkills: [],
    jobDescription: '',
    selectedFocus: [],
    durationMins: 30,
  });

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('ru_ready_oral_config');
      if (stored) {
        setConfig(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const finalDisplayRole = config.isCustomRole && config.customRoleInput ? config.customRoleInput : config.targetRole;
  const finalDisplayCompany = config.isCustomCompany && config.customCompanyInput ? config.customCompanyInput : config.targetCompany;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans select-none">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* TOP BRAND & STEP NAVIGATOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/oral/setup')}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
              title="Back to Configuration"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>Oral Mock Interview Setup</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
                  AI
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Step 2 of 3: Summary Review & Readiness Check
              </p>
            </div>
          </div>

          {/* 3 Step Pill Indicators */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => navigate('/oral/setup')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>1. Config</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span>2. Review</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/oral/precheck')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>3. Pre-Check</span>
            </button>
          </div>
        </div>

        {/* ─── STEP 2: SINGLE SUMMARY REVIEW CARD ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-8 rounded-3xl bg-white text-slate-900 shadow-sm border border-slate-200/90 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-sm font-extrabold text-blue-700 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Selected Interview Configuration Details
            </span>
            <Badge className="bg-blue-50 text-blue-700 font-mono text-xs border-blue-200">
              Step 2 of 3: Summary Review
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium block">Interview Type</span>
              <strong className="text-sm font-bold text-slate-900 block">{(config.interviewType || 'FULL_SIMULATION').replace('_', ' ')}</strong>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium block">Target Job Role</span>
              <strong className="text-sm font-bold text-slate-900 block">{finalDisplayRole || 'Software Engineer'}</strong>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium block">Target Company</span>
              <strong className="text-sm font-bold text-slate-900 block">{finalDisplayCompany || 'None / General Target'}</strong>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium block">Experience Level</span>
              <strong className="text-sm font-bold text-slate-900 block">{config.experienceLevel || 'FRESHER'}</strong>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium block">Duration</span>
              <strong className="text-sm font-bold text-slate-900 block">{config.durationMins || 30} Minutes</strong>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium block">Selected Skills</span>
              <strong className="text-sm font-bold text-slate-900 block truncate">
                {config.selectedSkills && config.selectedSkills.length > 0 ? config.selectedSkills.join(', ') : 'General Role Skills'}
              </strong>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-700 block">Focus Areas:</span>
            <div className="flex flex-wrap gap-2">
              {config.selectedFocus && config.selectedFocus.length > 0 ? (
                config.selectedFocus.map((f: string) => (
                  <Badge key={f} className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                    {f}
                  </Badge>
                ))
              ) : (
                <Badge className="bg-slate-100 text-slate-600 text-xs">All Round Balanced Probing</Badge>
              )}
            </div>
          </div>

          {config.jobDescription && (
            <div className="space-y-1 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-slate-700">
              <span className="font-bold text-blue-900 block">Provided Job Description / Context:</span>
              <p className="line-clamp-3 italic text-slate-600">{config.jobDescription}</p>
            </div>
          )}

          {/* BUTTON ACTIONS */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              onClick={() => navigate('/oral/setup')}
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-2xs cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Edit Selections</span>
            </Button>

            <Button
              onClick={() => navigate('/oral/precheck')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
