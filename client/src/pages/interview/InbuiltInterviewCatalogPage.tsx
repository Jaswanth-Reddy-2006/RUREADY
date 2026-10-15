import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Search,
  Video,
  Code2,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Filter,
  CheckCircle2,
  ChevronRight,
  Layers,
  Award,
} from 'lucide-react';
import {
  InbuiltInterview,
  INBUILT_VIDEO_INTERVIEWS,
  INBUILT_CODING_INTERVIEWS,
} from '../../data/inbuiltInterviewsData';
import InbuiltInterviewModal from '../../components/interview/InbuiltInterviewModal';
import Button from '../../components/ui/Button';

export default function InbuiltInterviewCatalogPage() {
  const navigate = useNavigate();
  const [selectedTypeTab, setSelectedTypeTab] = useState<'all' | 'video' | 'coding'>('video');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterTag, setSelectedFilterTag] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedInbuilt, setSelectedInbuilt] = useState<InbuiltInterview | null>(null);

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
        if (
          selectedFilterTag === 'System Design' &&
          item.tag !== 'System Design' &&
          !item.focusAreas.includes('System Design')
        )
          return false;
        if (
          selectedFilterTag === 'DSA' &&
          item.trackType !== 'DSA' &&
          !item.skills.includes('DSA')
        )
          return false;
        if (
          selectedFilterTag === 'Machine Coding' &&
          item.trackType !== 'MachineCoding'
        )
          return false;
        if (
          selectedFilterTag === 'Behavioral' &&
          item.trackType !== 'Behavioral & Leadership' &&
          item.simulationMode !== 'STAR_FOCUS'
        )
          return false;
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
    <div className="min-h-screen bg-[#F4F7FC] dark:bg-[#000000] text-slate-900 dark:text-white py-6 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <Helmet>
        <title>In-Built Interviews Catalog | Rennetus</title>
        <meta
          name="description"
          content="Explore all pre-calibrated in-built oral and coding mock interview loops."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/video')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#64D2FF] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Video Interview Command Center</span>
          </button>

          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {filteredInterviews.length} of {allInterviews.length} tracks
          </span>
        </div>

        {/* Page Hero Header Banner */}
        <div className="rounded-3xl bg-white dark:bg-[#1A1A1A] border border-slate-200/80 dark:border-[#262626] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-[#64D2FF] text-xs font-bold border border-blue-200 dark:border-blue-800/60 font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-[#64D2FF]" />
                <span>Pre-Calibrated In-Built Loops</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 dark:text-white tracking-tight font-display">
                Curated & In-Built Video Interviews
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Practice pre-calibrated interview loops modeled on top tech and campus hiring standards. Select any track to preview questions, view scoring rubrics, or launch directly.
              </p>
            </div>

            <Button
              onClick={() => navigate('/video/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-white dark:hover:bg-[#EBEBF5] dark:text-black font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm inline-flex items-center gap-2 self-start md:self-center whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Create Custom Interview</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Filter Bar & Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#262626] space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Type Switcher */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#262626] text-xs font-bold shrink-0 self-start sm:self-auto border border-slate-200/60 dark:border-[#303030]">
                <button
                  type="button"
                  onClick={() => setSelectedTypeTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedTypeTab === 'all'
                      ? 'bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white shadow-xs font-extrabold'
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
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by role, company, skill (e.g. React, FAANG, SDE)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-14 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#303030] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Tag Pills & Difficulty Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
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
                      : 'bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#303030] text-slate-600 dark:text-slate-300 hover:border-blue-400'
                  }`}
                >
                  {tag}
                </button>
              ))}

              <span className="text-slate-300 dark:text-slate-700 px-1 hidden sm:inline">|</span>

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
                      : 'bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#303030] text-slate-600 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalog Cards Grid */}
        {filteredInterviews.length === 0 ? (
          <div className="py-20 text-center space-y-3 max-w-sm mx-auto bg-white dark:bg-[#1A1A1A] rounded-3xl border border-slate-200/80 dark:border-[#262626] p-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#262626] text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              No matching in-built interviews found
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search query or reset your category and difficulty filters.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilterTag('All');
                setSelectedDifficulty('All');
                setSelectedTypeTab('all');
              }}
              className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl mt-2 cursor-pointer"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredInterviews.map((interview) => {
              const isVid = interview.category === 'video';

              return (
                <motion.div
                  key={interview.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedInbuilt(interview)}
                  className="group p-5 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-slate-200/90 dark:border-[#262626] hover:border-blue-400 dark:hover:border-neutral-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono ${
                            isVid
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                              : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                          }`}
                        >
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

                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 dark:bg-[#262626] text-slate-700 dark:text-slate-300">
                          {interview.difficulty}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                          {interview.tag}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#64D2FF] transition-colors line-clamp-1">
                        {interview.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        Role: <strong className="text-slate-800 dark:text-slate-200">{interview.role}</strong>
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {interview.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {interview.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-[#262626] text-slate-600 dark:text-[#D2D2D7] text-[10px] font-medium border border-slate-200/50 dark:border-[#303030]"
                        >
                          {s}
                        </span>
                      ))}
                      {interview.skills.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{interview.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-[#262626] flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {interview.durationMins}m • {interview.questionCount} Qs
                    </span>

                    <span className="font-bold text-blue-600 dark:text-[#64D2FF] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-xs">
                      <span>Preview Loop</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* In-Built Interview Detail Modal to Launch Session */}
      <InbuiltInterviewModal
        interview={selectedInbuilt}
        onClose={() => setSelectedInbuilt(null)}
      />
    </div>
  );
}
