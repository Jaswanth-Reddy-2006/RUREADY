import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Briefcase,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  Award,
  BookOpen,
  Search,
  Filter,
  DollarSign,
  Zap,
  Code2,
  Video,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { COMPANY_INTERVIEW_TRACKS, CompanyInterviewTrack } from '../../data/companyTracksData';

export default function CompanyWiseCatalogPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const TIERS = ['All', 'FAANG', 'Unicorn', 'Campus / Mass', 'FinTech'];
  const DIFFICULTIES = ['All', 'Intermediate', 'Advanced', 'Hardcore'];

  const filteredTracks = useMemo(() => {
    return COMPANY_INTERVIEW_TRACKS.filter((track) => {
      // Tier filter
      if (selectedTier !== 'All' && track.tier !== selectedTier) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && track.difficulty !== selectedDifficulty) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = track.companyName.toLowerCase().includes(query);
        const matchesRole = track.role.toLowerCase().includes(query);
        const matchesDesc = track.description.toLowerCase().includes(query);
        const matchesSkills = track.sections.some((s) =>
          s.skills.some((sk) => sk.toLowerCase().includes(query))
        );

        if (!matchesName && !matchesRole && !matchesDesc && !matchesSkills) {
          return false;
        }
      }

      return true;
    });
  }, [selectedTier, selectedDifficulty, searchQuery]);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'FAANG':
        return <Badge variant="ai" size="xs">FAANG / Tier-1</Badge>;
      case 'Unicorn':
        return <Badge variant="royal" size="xs">Top Unicorn</Badge>;
      case 'Campus / Mass':
        return <Badge variant="success" size="xs">Campus & Mass</Badge>;
      case 'FinTech':
        return <Badge variant="warning" size="xs">FinTech Infra</Badge>;
      default:
        return <Badge variant="neutral" size="xs">{tier}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] dark:bg-[#080C1D] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-6xl mx-auto space-y-7">
        
        {/* ─── HEADER ─── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-[#11183D] p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-[#1E293B] shadow-xs">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800/60 font-mono">
              <Building2 className="w-3.5 h-3.5" />
              <span>Company-Specific Practice Tracks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
              Company-wise Interview Loops
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Practice multi-round hiring loops calibrated against real rubric criteria for Amazon, Google, Microsoft, Uber, Flipkart, Razorpay, TCS, and Infosys.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            <Badge className="bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/80 text-xs font-mono py-1.5 px-3">
              {COMPANY_INTERVIEW_TRACKS.length} Curated Tracks
            </Badge>
          </div>
        </div>

        {/* ─── SEARCH & CATEGORY FILTER BAR ─── */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#11183D] border border-slate-200/80 dark:border-[#1E293B] shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search company, role, or technology (e.g. Amazon, Kafka, Google, Machine Coding)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0E152E] border border-slate-200 dark:border-[#1E293B] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Stats */}
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium self-center">
              Showing <strong className="text-slate-900 dark:text-white">{filteredTracks.length}</strong> company loops
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 font-mono">
              <Filter className="w-3 h-3" /> Tier:
            </span>
            {TIERS.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedTier === tier
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'bg-slate-50 dark:bg-[#152046] border border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-300 hover:border-purple-300'
                }`}
              >
                {tier}
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
                    : 'bg-slate-50 dark:bg-[#152046] border border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* ─── COMPANY TRACK CARDS GRID ─── */}
        {filteredTracks.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-[#11183D] rounded-3xl border border-slate-200 dark:border-[#1E293B]">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No company tracks match your filters</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try clearing your search query or tier filters.</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedTier('All');
                setSelectedDifficulty('All');
              }}
              className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTracks.map((track) => (
              <motion.div
                key={track.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Card className="p-6 bg-white dark:bg-[#11183D] border-slate-200/90 dark:border-[#1E293B] hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all rounded-3xl space-y-5 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    {/* Top Row: Company Icon, Name, Tier & Salary */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-xs border border-white/20">
                          {track.companyName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-display">
                              {track.companyName}
                            </h3>
                            {getTierBadge(track.tier)}
                          </div>
                          <span className="text-xs text-purple-600 dark:text-purple-400 font-bold block">
                            {track.role}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono block">
                          {track.packageLpa}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Est. CTC</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {track.description}
                    </p>

                    {/* Hiring Insights Callout */}
                    <div className="p-3 rounded-2xl bg-purple-50/50 dark:bg-[#152046] border border-purple-100 dark:border-[#1E293B] text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5">
                      <span className="font-bold text-purple-700 dark:text-purple-300 block text-[10px] uppercase font-mono">
                        Hiring Strategy Insight:
                      </span>
                      <p className="leading-snug">{track.hiringOverview}</p>
                    </div>

                    {/* Round Highlights Breakdown */}
                    <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                        <span>Interview Loop Breakdown:</span>
                        <span>{track.sections.length} Rounds</span>
                      </div>
                      <div className="space-y-1.5">
                        {track.sections.map((sec) => (
                          <div
                            key={sec.id}
                            className="text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between bg-slate-50 dark:bg-[#0E152E] p-2.5 rounded-xl border border-slate-100 dark:border-[#1E293B]"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                                sec.interviewType === 'CODING'
                                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                                  : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                              }`}>
                                {sec.interviewType === 'CODING' ? 'Code' : 'Oral'}
                              </span>
                              <span className="font-medium truncate">{sec.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono shrink-0 ml-2">
                              {sec.durationMins}m
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Total Loop: {track.sections.reduce((acc, s) => acc + s.durationMins, 0)} mins
                    </span>

                    <Button
                      onClick={() => navigate(`/interviews/company-wise/${track.companySlug}`)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>Explore Loop</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
