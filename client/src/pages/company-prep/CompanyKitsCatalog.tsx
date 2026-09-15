import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Search, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  GraduationCap,
  Layers,
  Video,
  Award
} from 'lucide-react';
import { COMPANY_KITS, CompanyKit } from '../../data/companyKits.data';

export default function CompanyKitsCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<'All' | 'Service' | 'Product' | 'FAANG'>('All');

  const filteredKits = useMemo(() => {
    return COMPANY_KITS.filter((kit) => {
      const matchesTier = selectedTier === 'All' || kit.tier === selectedTier;
      const matchesSearch = 
        kit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kit.hiringRoles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
        kit.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kit.repeatedTopics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTier && matchesSearch;
    });
  }, [searchQuery, selectedTier]);

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DCE7F2] shadow-xs text-xs font-bold text-[#4A8BDF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Targeted Campus Placement Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11183D] tracking-tight font-sans">
            Company Placement Kits & Syllabus
          </h1>
          <p className="text-base sm:text-lg text-[#526078] leading-relaxed">
            Deconstructed hiring patterns, sectional cutoffs, syllabus breakdowns, and real interview rounds for top recruiters hiring on Indian campuses.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#DCE7F2] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E8B9B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies (TCS, Infosys, Amazon...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#DCE7F2] text-sm text-[#11183D] placeholder-[#7E8B9B] focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]/40 focus:border-[#4A8BDF] transition-all font-sans"
            />
          </div>

          {/* Tier Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {(['All', 'Service', 'Product', 'FAANG'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-4 py-2 rounded-full text-xs font-bold font-sans transition-all cursor-pointer whitespace-nowrap ${
                  selectedTier === tier
                    ? 'bg-[#11183D] text-white shadow-sm'
                    : 'bg-[#F8FAFC] text-[#526078] hover:bg-[#F1F5F9] border border-[#DCE7F2]'
                }`}
              >
                {tier === 'All' ? 'All Companies' : tier === 'Service' ? 'Mass Recruiters / Service' : tier === 'Product' ? 'Product Leaders' : 'FAANG / Tier 1'}
              </button>
            ))}
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKits.map((kit) => (
            <motion.div
              key={kit.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-[#DCE7F2] hover:border-[#4A8BDF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 sm:p-7 space-y-5">
                {/* Header: Logo & Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-xs">
                      {kit.logo}
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-[#11183D] font-sans group-hover:text-[#4A8BDF] transition-colors line-clamp-1">
                        {kit.name}
                      </h2>
                      <span className="text-xs font-semibold text-[#526078]">
                        {kit.tierLabel}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                      kit.tier === 'FAANG'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : kit.tier === 'Product'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-[#4A8BDF] border-blue-200'
                    }`}
                  >
                    {kit.tier}
                  </span>
                </div>

                {/* Package & Rounds Stats */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-[#F8FAFC] rounded-2xl border border-[#DCE7F2]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7E8B9B] tracking-wider block">
                      Compensation
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 font-sans mt-0.5 block">
                      {kit.packageRange}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7E8B9B] tracking-wider block">
                      Rounds Breakdown
                    </span>
                    <span className="text-xs font-extrabold text-[#11183D] font-sans mt-0.5 block">
                      {kit.roundsCount} Rigorous Rounds
                    </span>
                  </div>
                </div>

                {/* Overview Snippet */}
                <p className="text-xs text-[#526078] leading-relaxed line-clamp-3">
                  {kit.overview}
                </p>

                {/* Key Repeated Topics */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#11183D] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#4A8BDF]" />
                    Highest Frequency Topics:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {kit.repeatedTopics.slice(0, 4).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-[#526078]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 sm:p-5 bg-[#F8FAFC] border-t border-[#DCE7F2] flex items-center justify-between gap-3">
                <Link
                  to={`/interview/new?company=${kit.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#526078] hover:text-[#4A8BDF] transition-colors"
                >
                  <Video className="w-3.5 h-3.5 text-[#4A8BDF]" />
                  <span>Mock Interview</span>
                </Link>
                <Link
                  to={`/company-prep/${kit.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#11183D] hover:bg-[#1E293B] text-white text-xs font-bold font-sans transition-all shadow-xs group-hover:bg-[#4A8BDF]"
                >
                  <span>View Full Kit</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pro-Tip Placement Banner */}
        <div className="bg-gradient-to-r from-[#11183D] via-[#1E293B] to-[#2459A8] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-widest text-[#4A8BDF]">
              Target Company Simulation
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-sans">
              Practice Realistic Rounds with Ava AI
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every kit features calibrated prompt models that replicate the exact questioning temperament, strictness, and evaluation rubrics of actual interviewers.
            </p>
          </div>
          <Link
            to="/interview/new"
            className="shrink-0 px-6 py-3.5 rounded-full bg-white text-[#11183D] hover:bg-[#EFFAFD] text-sm font-extrabold transition-all shadow-md hover:scale-102 flex items-center gap-2"
          >
            <span>Start Practice Mock</span>
            <ArrowRight className="w-4 h-4 text-[#4A8BDF]" />
          </Link>
        </div>

      </div>
    </div>
  );
}
