import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  Network,
  Clock,
  Briefcase,
  Layers,
  Sparkles,
  Cpu,
  Database,
  Radio,
  HardDrive,
  Globe,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function SystemDesignReviewPage() {
  const navigate = useNavigate();

  const [config, setConfig] = useState<any>({
    targetRole: 'Senior Software Engineer (SDE-2)',
    selectedDomain: 'STORAGE',
    domainTitle: 'Distributed Storage & Caching',
    domainDesc: 'Consistent Hashing, LRU Eviction, Replication, Partitioning & CAP Theorem.',
    durationMins: 45,
    simulationMode: 'REALISTIC',
    selectedSkills: ['Consistent Hashing', 'LRU Cache', 'CAP Theorem', 'Sharding', 'Replication'],
  });

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('ru_ready_system_design_config');
      if (stored) {
        setConfig(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const modeBadge =
    config.simulationMode === 'CHALLENGE'
      ? 'Hardcore (Staff Architect)'
      : config.simulationMode === 'PRACTICE'
      ? 'Practice (Learning & Hints)'
      : 'Realistic (FAANG Standard)';

  return (
    <div className="min-h-screen bg-[#F4F7FC] dark:bg-[#000000] py-8 px-4 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100 font-sans select-none transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ─── TOP BRAND & STEP NAVIGATOR ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/system-design/setup')}
              className="p-2 rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-2xs"
              title="Back to Configuration"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>System Design Round Setup</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-mono">
                  HLD
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Step 2 of 3: Summary Review & Readiness Check
              </p>
            </div>
          </div>

          {/* 3 Step Pill Indicators */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => navigate('/system-design/setup')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
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
              onClick={() => navigate('/system-design/precheck')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
              <span>3. Pre-Check</span>
            </button>
          </div>
        </div>

        {/* ─── STEP 2: SINGLE SUMMARY REVIEW CARD ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0D1117] text-slate-900 dark:text-white shadow-xs border border-slate-200/90 dark:border-slate-800 space-y-6 transition-colors"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Confirmed Architectural Parameters
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Please verify your architecture domain and simulation depth before proceeding to hardware pre-check.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              {config.durationMins} MIN ROUND
            </span>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-mono">
                <Briefcase size={12} className="text-blue-500" /> Target Role
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {config.targetRole || 'Senior Software Engineer'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-mono">
                <Network size={12} className="text-purple-500" /> Architecture Domain
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {config.domainTitle || 'Distributed Storage'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-mono">
                <ShieldCheck size={12} className="text-emerald-500" /> Simulation Mode
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {modeBadge}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-mono">
                <Clock size={12} className="text-amber-500" /> Estimated Duration
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {config.durationMins} Minutes (Live)
              </p>
            </div>
          </div>

          {/* Architecture Focus Areas & Building Blocks */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Core Architecture Focus & Evaluation Domains
            </span>
            <div className="flex flex-wrap gap-2">
              {(config.selectedSkills && config.selectedSkills.length > 0
                ? config.selectedSkills
                : ['Load Balancing', 'Consistent Hashing', 'Database Sharding', 'LRU Cache', 'CAP Theorem', 'SPOF Analysis']
              ).map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Context & Socratic Rubric Card */}
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
                Socratic AI Architect Evaluation Framework
              </span>
            </div>
            <p className="text-xs text-purple-800/90 dark:text-purple-300/80 leading-relaxed">
              Ava will assess your design across 6 core interview phases: Scope Requirements, Capacity Estimation, High-Level Architecture, Deep-Dive Component Design, Fault Tolerance / Single Points of Failure, and CAP / Latency Trade-offs.
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => navigate('/system-design/setup')}
              className="w-full sm:w-auto text-xs font-bold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Modify Architecture Configuration
            </Button>

            <Button
              onClick={() => navigate('/system-design/precheck')}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
            >
              <span>Proceed to Pre-Flight Check</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
