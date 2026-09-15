import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Code2,
  Building2,
  Cpu,
  BrainCircuit,
  Binary,
  Layers,
  FileCheck2,
  Compass,
  Sparkles,
  ArrowRight,
  Database,
  ChevronRight,
  Target,
} from 'lucide-react';

interface FeaturesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryId = 'interview' | 'company' | 'core-cs' | 'aptitude' | 'dsa-projects';

interface NavCategory {
  id: CategoryId;
  label: string;
  badge?: string;
  icon: React.ElementType;
  description: string;
}

const CATEGORIES: NavCategory[] = [
  {
    id: 'interview',
    label: 'AI Interviews',
    badge: 'Flagship',
    icon: Video,
    description: 'Oral voice interviews, live coding sandbox & project grilling',
  },
  {
    id: 'company',
    label: 'Company Placement Kits',
    badge: 'Popular',
    icon: Building2,
    description: 'TCS, Infosys, Accenture, Amazon & Google hiring blueprints',
  },
  {
    id: 'core-cs',
    label: 'CS Hub & SQL Lab',
    icon: Cpu,
    description: 'OS, DBMS, Networks, OOPs cheat sheets & live SQL playground',
  },
  {
    id: 'aptitude',
    label: 'Aptitude & Reasoning',
    icon: BrainCircuit,
    description: 'Timed Quant, Logical, Verbal & Pseudocode test engine',
  },
  {
    id: 'dsa-projects',
    label: 'DSA & Project Blueprints',
    icon: Binary,
    description: 'Pattern-based sheets, portfolio architecture & ATS scanner',
  },
];

export default function FeaturesMegaMenu({ isOpen, onClose }: FeaturesMegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('interview');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on escape key and click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[92vw] max-w-4xl bg-white/98 backdrop-blur-2xl rounded-3xl border border-[#DCE7F2] shadow-2xl shadow-[#11183D]/12 overflow-hidden z-50 pointer-events-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
          {/* Left Sidebar: Categories Navigation */}
          <div className="md:col-span-4 bg-[#F8FAFC]/90 p-4 border-r border-[#DCE7F2] flex flex-col justify-between">
            <div>
              <div className="px-3 py-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#7E8B9B] font-mono">
                  Placement Preparation Hub
                </span>
                <h3 className="text-sm font-extrabold text-[#11183D] font-sans">
                  Select Category
                </h3>
              </div>

              <div className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      onMouseEnter={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#11183D] shadow-sm border border-[#DCE7F2]'
                          : 'text-[#526078] hover:bg-white/60 hover:text-[#11183D]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl transition-colors ${
                            isActive
                              ? 'bg-[#EFFAFD] text-[#4A8BDF]'
                              : 'bg-slate-100 text-[#7E8B9B]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-sans">
                              {cat.label}
                            </span>
                            {cat.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#EFFAFD] text-[#4A8BDF] border border-[#4A8BDF]/20">
                                {cat.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#7E8B9B] line-clamp-1">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive ? 'text-[#4A8BDF] translate-x-0.5' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Quick Info */}
            <div className="p-3 mt-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#11183D]">
                <Sparkles className="w-3.5 h-3.5 text-[#4A8BDF]" />
                All-in-One Placement Ready
              </div>
              <p className="text-[11px] text-[#526078] mt-1 leading-snug">
                Designed to cover 100% of technical hiring rounds from Aptitude to Oral Defense.
              </p>
            </div>
          </div>

          {/* Right Pane: Category Content & Direct Links */}
          <div className="md:col-span-8 p-6 flex flex-col justify-between bg-white">
            <div>
              {/* Category 1: AI Interviews */}
              {activeCategory === 'interview' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                    <div>
                      <h4 className="text-base font-extrabold text-[#11183D] font-sans flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#4A8BDF]" />
                        Intelligent Mock Interviews
                      </h4>
                      <p className="text-xs text-[#526078] mt-0.5">
                        Choose your interview format calibrated against real company rubrics
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#4A8BDF] bg-[#EFFAFD] px-2.5 py-1 rounded-full border border-[#4A8BDF]/20">
                      Live AI Evaluator
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {/* Oral AI Interview */}
                    <Link
                      to="/interview/new"
                      onClick={onClose}
                      className="group p-4 rounded-2xl border border-[#DCE7F2] hover:border-[#4A8BDF] hover:bg-[#EFFAFD]/40 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-xl bg-[#EFFAFD] text-[#4A8BDF] group-hover:scale-105 transition-transform">
                          <Video className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Speech & Behavioral
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-[#11183D] group-hover:text-[#4A8BDF] transition-colors">
                        Oral AI Interview
                      </h5>
                      <p className="text-xs text-[#526078] mt-1 leading-relaxed">
                        Voice-calibrated technical and HR rounds with real-time feedback on confidence and structure.
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#4A8BDF]">
                        <span>Start Oral Mock</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>

                    {/* Coding Interview Sandbox */}
                    <Link
                      to="/interview/coding/new"
                      onClick={onClose}
                      className="group p-4 rounded-2xl border border-[#DCE7F2] hover:border-[#A0006D] hover:bg-[#FDF4FB]/40 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-xl bg-[#FDF4FB] text-[#A0006D] group-hover:scale-105 transition-transform">
                          <Code2 className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-[#A0006D] bg-[#FDF4FB] px-2 py-0.5 rounded-full border border-[#A0006D]/20">
                          DSA & Testcases
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-[#11183D] group-hover:text-[#A0006D] transition-colors">
                        Coding Interview Sandbox
                      </h5>
                      <p className="text-xs text-[#526078] mt-1 leading-relaxed">
                        Interactive in-browser code editor with compiler, hidden testcases, and Big-O evaluation.
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#A0006D]">
                        <span>Launch Coding Room</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>

                    {/* Resume Project Grilling */}
                    <Link
                      to="/resume-interview"
                      onClick={onClose}
                      className="group sm:col-span-2 p-4 rounded-2xl border border-[#DCE7F2] hover:border-[#11183D] hover:bg-[#F8FAFC] transition-all duration-200 flex items-center justify-between"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-[#11183D] text-white group-hover:scale-105 transition-transform">
                          <Target className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-[#11183D]">
                              Resume Project Grilling (Ava Defense)
                            </h5>
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Crucial for Campus Rounds
                            </span>
                          </div>
                          <p className="text-xs text-[#526078] mt-1">
                            Ava interrogates your project architecture, DB bottlenecks, scaling tradeoffs, and edge-cases.
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#11183D] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Category 2: Company Placement Kits */}
              {activeCategory === 'company' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                    <div>
                      <h4 className="text-base font-extrabold text-[#11183D] font-sans flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#4A8BDF]" />
                        Company-Specific Hiring Blueprints
                      </h4>
                      <p className="text-xs text-[#526078] mt-0.5">
                        Exam patterns, test platforms, syllabus, cutoffs, and repeated round questions
                      </p>
                    </div>
                    <Link
                      to="/company-prep"
                      onClick={onClose}
                      className="text-xs font-bold text-[#4A8BDF] hover:underline flex items-center gap-1"
                    >
                      <span>View All Kits</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {[
                      { id: 'tcs', name: 'TCS NQT', tier: 'Prime & Digital', lpa: '₹3.5 - 12 LPA', icon: '🏢' },
                      { id: 'infosys', name: 'Infosys DSE', tier: 'Specialist Prog.', lpa: '₹3.6 - 9.5 LPA', icon: '⚡' },
                      { id: 'accenture', name: 'Accenture', tier: 'ASE & FSE', lpa: '₹4.5 - 11 LPA', icon: '🎯' },
                      { id: 'amazon', name: 'Amazon SDE', tier: 'FAANG / Tier 1', lpa: '₹28 - 45 LPA', icon: '📦' },
                      { id: 'google', name: 'Google SWE', tier: 'FAANG / Tier 1', lpa: '₹32 - 55 LPA', icon: '🌐' },
                      { id: 'flipkart', name: 'Flipkart SDE', tier: 'Top Product', lpa: '₹22 - 32 LPA', icon: '🛍️' },
                    ].map((comp) => (
                      <Link
                        key={comp.id}
                        to={`/company-prep/${comp.id}`}
                        onClick={onClose}
                        className="p-3 rounded-2xl border border-[#DCE7F2] hover:border-[#4A8BDF] hover:bg-[#EFFAFD]/40 transition-all duration-200 group"
                      >
                        <div className="text-xl mb-1.5">{comp.icon}</div>
                        <h6 className="text-xs font-bold text-[#11183D] group-hover:text-[#4A8BDF] transition-colors">
                          {comp.name}
                        </h6>
                        <p className="text-[11px] text-[#526078] font-medium">{comp.tier}</p>
                        <p className="text-[10px] text-emerald-700 font-bold mt-1">{comp.lpa}</p>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/company-prep"
                      onClick={onClose}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#EFFAFD] hover:bg-[#E2F3F9] text-[#11183D] border border-[#DCE7F2] transition-colors text-xs font-bold"
                    >
                      <span>Explore complete company syllabus & mock rounds catalog</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#4A8BDF]" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Category 3: CS Hub & SQL Lab */}
              {activeCategory === 'core-cs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                    <div>
                      <h4 className="text-base font-extrabold text-[#11183D] font-sans flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#4A8BDF]" />
                        Core CS Hub & SQL Playground
                      </h4>
                      <p className="text-xs text-[#526078] mt-0.5">
                        High-yield engineering fundamentals asked in 85%+ campus technical interviews
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <Link
                      to="/core-cs"
                      onClick={onClose}
                      className="group p-4 rounded-2xl border border-[#DCE7F2] hover:border-[#4A8BDF] hover:bg-[#EFFAFD]/30 transition-all"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="p-2 rounded-xl bg-[#EFFAFD] text-[#4A8BDF]">
                          <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-[#11183D] group-hover:text-[#4A8BDF] transition-colors">
                            Core CS Subject Hub
                          </h5>
                          <span className="text-[10px] text-[#7E8B9B] font-semibold">OS • DBMS • CN • OOPs</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#526078] leading-relaxed">
                        Condensed cheat sheets, flashcards, and top 10 campus interview questions with ideal answers.
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#4A8BDF]">
                        <span>Open CS Hub</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>

                    <Link
                      to="/sql-playground"
                      onClick={onClose}
                      className="group p-4 rounded-2xl border border-[#DCE7F2] hover:border-emerald-500 hover:bg-emerald-50/40 transition-all"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-[#11183D] group-hover:text-emerald-700 transition-colors">
                            Interactive SQL Playground
                          </h5>
                          <span className="text-[10px] text-emerald-700 font-semibold">Live In-Browser Runner</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#526078] leading-relaxed">
                        Execute real SQL queries on simulated employee, department, and order schemas with instant results.
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <span>Launch SQL Lab</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>

                  <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#DCE7F2] flex items-center justify-between text-xs text-[#526078]">
                    <span>Covers Coffman Deadlocks, B-Trees, TCP Handshake & SOLID Principles</span>
                    <span className="font-bold text-[#11183D]">100% Free Practice</span>
                  </div>
                </div>
              )}

              {/* Category 4: Aptitude & Reasoning */}
              {activeCategory === 'aptitude' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                    <div>
                      <h4 className="text-base font-extrabold text-[#11183D] font-sans flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-[#4A8BDF]" />
                        Aptitude & Cognitive Reasoning Engine
                      </h4>
                      <p className="text-xs text-[#526078] mt-0.5">
                        Clear Round 1 screening tests for TCS NQT, Infosys, Accenture & Wipro
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {[
                      { title: 'Quantitative Aptitude', sub: 'Time & Work, Profit & Loss, Speed & Distance', icon: '📐' },
                      { title: 'Logical Reasoning', sub: 'Blood Relations, Syllogisms, Seating Arrangement', icon: '🧠' },
                      { title: 'Verbal Ability', sub: 'Reading Comprehension, Sentence Correction, Vocabulary', icon: '📖' },
                      { title: 'Technical Pseudocode', sub: 'Bitwise Operators, Recursion Tracing & Loops', icon: '💻' },
                    ].map((mod, idx) => (
                      <div key={idx} className="p-3 rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{mod.icon}</span>
                          <h6 className="text-xs font-bold text-[#11183D]">{mod.title}</h6>
                        </div>
                        <p className="text-[11px] text-[#526078] leading-tight">{mod.sub}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/aptitude"
                    onClick={onClose}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#11183D] text-white hover:bg-[#1E293B] transition-colors text-xs font-bold"
                  >
                    <span>Start Practice Mode or Timed Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Category 5: DSA & Project Blueprints */}
              {activeCategory === 'dsa-projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                    <div>
                      <h4 className="text-base font-extrabold text-[#11183D] font-sans flex items-center gap-2">
                        <Binary className="w-4 h-4 text-[#4A8BDF]" />
                        DSA Sheets & Portfolio Project Blueprints
                      </h4>
                      <p className="text-xs text-[#526078] mt-0.5">
                        Production-grade resume artifacts and pattern-grouped algorithm checklists
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <Link
                      to="/dsa-sheets"
                      onClick={onClose}
                      className="p-3.5 rounded-2xl border border-[#DCE7F2] hover:border-[#4A8BDF] hover:bg-[#EFFAFD]/30 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-2 rounded-xl bg-[#EFFAFD] text-[#4A8BDF]">
                          <Binary className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-[#4A8BDF] bg-[#EFFAFD] px-2 py-0.5 rounded-full">
                          Blind 75 & Patterns
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-[#11183D] group-hover:text-[#4A8BDF] transition-colors">
                        Pattern-Based DSA Sheets
                      </h5>
                      <p className="text-[11px] text-[#526078] mt-1">
                        Two Pointers, Sliding Window, Monotonic Stack & Tree BFS with company frequency tags.
                      </p>
                    </Link>

                    <Link
                      to="/projects"
                      onClick={onClose}
                      className="p-3.5 rounded-2xl border border-[#DCE7F2] hover:border-[#A0006D] hover:bg-[#FDF4FB]/30 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-2 rounded-xl bg-[#FDF4FB] text-[#A0006D]">
                          <Layers className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-[#A0006D] bg-[#FDF4FB] px-2 py-0.5 rounded-full">
                          Enterprise Grade
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-[#11183D] group-hover:text-[#A0006D] transition-colors">
                        Portfolio Project Blueprints
                      </h5>
                      <p className="text-[11px] text-[#526078] mt-1">
                        Kafka microservices, RAG agents, and distributed task queues with architecture diagrams & schemas.
                      </p>
                    </Link>

                    <Link
                      to="/ats"
                      onClick={onClose}
                      className="p-3.5 rounded-2xl border border-[#DCE7F2] hover:border-blue-500 hover:bg-blue-50/30 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                          <FileCheck2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          Instant Scan
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-[#11183D] group-hover:text-blue-600 transition-colors">
                        AI ATS Resume Scanner
                      </h5>
                      <p className="text-[11px] text-[#526078] mt-1">
                        Test your resume against real job descriptions with keyword matching and formatting audits.
                      </p>
                    </Link>

                    <Link
                      to="/roadmap"
                      onClick={onClose}
                      className="p-3.5 rounded-2xl border border-[#DCE7F2] hover:border-violet-500 hover:bg-violet-50/30 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
                          <Compass className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                          Step-by-Step
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-[#11183D] group-hover:text-violet-600 transition-colors">
                        Developer Career Roadmaps
                      </h5>
                      <p className="text-[11px] text-[#526078] mt-1">
                        Curated milestones and learning sequences for Frontend, Backend, Fullstack, and AI engineers.
                      </p>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="pt-4 mt-4 border-t border-[#DCE7F2] flex items-center justify-between">
              <a
                href="/#features"
                onClick={onClose}
                className="text-xs font-semibold text-[#526078] hover:text-[#11183D] transition-colors"
              >
                View summary section on landing page →
              </a>
              <button
                onClick={onClose}
                className="text-xs font-bold text-[#7E8B9B] hover:text-[#11183D] px-3 py-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                Close Menu (Esc)
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
