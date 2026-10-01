import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  SlidersHorizontal,
  Video,
  Code2,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Layers,
  ChevronRight,
  Play,
  Award,
} from 'lucide-react';
import { InbuiltInterview, INBUILT_VIDEO_INTERVIEWS, INBUILT_CODING_INTERVIEWS } from '../../data/inbuiltInterviewsData';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface InbuiltCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'video' | 'coding';
  onSelectInterview: (interview: InbuiltInterview) => void;
}

export default function InbuiltCatalogModal({
  isOpen,
  onClose,
  defaultCategory = 'video',
  onSelectInterview,
}: InbuiltCatalogModalProps) {
  const [selectedTypeTab, setSelectedTypeTab] = useState<'all' | 'video' | 'coding'>(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterTag, setSelectedFilterTag] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Combined Dataset
  const allInterviews = useMemo(() => {
    return [...INBUILT_VIDEO_INTERVIEWS, ...INBUILT_CODING_INTERVIEWS];
  }, []);

  // Filter logic
  const filteredInterviews = useMemo(() => {
    return allInterviews.filter((item) => {
      // 1. Type tab filter
      if (selectedTypeTab !== 'all' && item.category !== selectedTypeTab) {
        return false;
      }

      // 2. Tag filter
      if (selectedFilterTag !== 'All') {
        if (selectedFilterTag === 'FAANG' && item.tag !== 'FAANG') return false;
        if (selectedFilterTag === 'Campus' && item.tag !== 'Campus') return false;
        if (selectedFilterTag === 'Popular' && item.tag !== 'Popular') return false;
        if (selectedFilterTag === 'System Design' && item.tag !== 'System Design' && !item.focusAreas.includes('System Design')) return false;
        if (selectedFilterTag === 'DSA' && item.trackType !== 'DSA' && !item.skills.includes('DSA')) return false;
        if (selectedFilterTag === 'Machine Coding' && item.trackType !== 'MachineCoding') return false;
        if (selectedFilterTag === 'Behavioral' && item.trackType !== 'Behavioral & Leadership' && item.simulationMode !== 'STAR_FOCUS') return false;
      }

      // 3. Difficulty filter
      if (selectedDifficulty !== 'All' && item.difficulty !== selectedDifficulty) {
        return false;
      }

      // 4. Search text
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesRole = item.role.toLowerCase().includes(query);
        const matchesCompany = item.company?.toLowerCase().includes(query);
        const matchesSkill = item.skills.some((s) => s.toLowerCase().includes(query));
        const matchesDesc = item.description.toLowerCase().includes(query);

        if (!matchesTitle && !matchesRole && !matchesCompany && !matchesSkill && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [allInterviews, selectedTypeTab, selectedFilterTag, selectedDifficulty, searchQuery]);

  if (!isOpen) return null;

  const FILTER_TAGS = [
    'All',
    'Popular',
    'FAANG',
    'Campus',
    'DSA',
    'Machine Coding',
    'System Design',
    'Behavioral',
  ];

  const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Hardcore'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-40"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-5xl bg-white dark:bg-[#11183D] border border-slate-200 dark:border-[#1E293B] rounded-3xl shadow-2xl z-50 overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[92vh]"
        >
          {/* Header Banner */}
          <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-purple-50/70 dark:from-[#152046] dark:via-[#11183D] dark:to-[#1e1a38] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800/60">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Pre-calibrated In-built Interview Loops</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                Explore All In-Built Interviews
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose a pre-built standard loop or customize it to your exact target role and company.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors self-start sm:self-center shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar & Search */}
          <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#0E152E] space-y-3 shrink-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Type Switcher (All / Video / Coding) */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-200/70 dark:bg-[#152046] text-xs font-bold shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSelectedTypeTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedTypeTab === 'all'
                      ? 'bg-white dark:bg-[#11183D] text-slate-900 dark:text-white shadow-xs font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({allInterviews.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTypeTab('video')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedTypeTab === 'video'
                      ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Oral Video ({INBUILT_VIDEO_INTERVIEWS.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTypeTab('coding')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedTypeTab === 'coding'
                      ? 'bg-purple-600 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Coding Sandbox ({INBUILT_CODING_INTERVIEWS.length})</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by role, company, skill (e.g. React, FAANG, SDE, Two Pointers)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-[#11183D] border border-slate-200 dark:border-[#1E293B] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tags Scroll Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 font-mono">
                <Filter className="w-3 h-3" /> Category:
              </span>
              {FILTER_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedFilterTag(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    selectedFilterTag === tag
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-white dark:bg-[#152046] border border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-300 hover:border-blue-300'
                  }`}
                >
                  {tag}
                </button>
              ))}

              <span className="text-slate-300 dark:text-slate-700 px-1">|</span>

              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 font-mono">
                Difficulty:
              </span>
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs'
                      : 'bg-white dark:bg-[#152046] border border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {filteredInterviews.length === 0 ? (
              <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No matching in-built interviews found</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Try adjusting your search query or reset category and difficulty filters.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilterTag('All');
                    setSelectedDifficulty('All');
                    setSelectedTypeTab('all');
                  }}
                  className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInterviews.map((interview) => {
                  const isVid = interview.category === 'video';

                  return (
                    <div
                      key={interview.id}
                      onClick={() => onSelectInterview(interview)}
                      className="group p-5 rounded-3xl bg-white dark:bg-[#11183D] border border-slate-200/90 dark:border-[#1E293B] hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 relative"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono ${
                              isVid
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                                : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                            }`}>
                              {isVid ? <Video className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
                              {isVid ? 'Oral' : 'Coding'}
                            </span>

                            {interview.company && (
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-purple-500" />
                                {interview.company}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 dark:bg-[#152046] text-slate-700 dark:text-slate-300">
                              {interview.difficulty}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                              {interview.tag}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {interview.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Role: <strong className="text-slate-800 dark:text-slate-200">{interview.role}</strong>
                          </p>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {interview.description}
                        </p>

                        {/* Skill Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {interview.skills.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-[#0E152E] text-slate-600 dark:text-slate-400 text-[10px] font-medium border border-slate-200/50 dark:border-[#1E293B]"
                            >
                              {s}
                            </span>
                          ))}
                          {interview.skills.length > 4 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{interview.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {interview.durationMins} mins • {interview.questionCount} Questions
                        </span>

                        <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>View Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0E152E] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <span>Showing {filteredInterviews.length} curated interview loops</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-[#152046] text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Close Catalog
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
