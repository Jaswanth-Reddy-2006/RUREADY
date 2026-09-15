import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Binary, 
  CheckCircle2, 
  Circle, 
  Code2, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  Filter, 
  Search,
  Check
} from 'lucide-react';
import { DSA_PATTERNS, DsaProblem, DsaPatternGroup } from '../../data/dsaSheets.data';

export default function DsaSheetsPage() {
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ru_ready_dsa_solved');
      return saved ? JSON.parse(saved) : ['p-1', 'p-2', 'p-6'];
    } catch {
      return ['p-1', 'p-2'];
    }
  });

  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('ru_ready_dsa_solved', JSON.stringify(solvedProblemIds));
    } catch {}
  }, [solvedProblemIds]);

  const toggleSolved = (id: string) => {
    setSolvedProblemIds((prev) => 
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const allProblems = DSA_PATTERNS.flatMap((g) => g.problems);
  const totalCount = allProblems.length;
  const solvedCount = allProblems.filter((p) => solvedProblemIds.includes(p.id)).length;
  const progressPercent = Math.round((solvedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DCE7F2] shadow-xs text-xs font-bold text-[#4A8BDF]">
            <Binary className="w-3.5 h-3.5" />
            <span>High-Yield Coding Patterns</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11183D] tracking-tight font-sans">
            Pattern-Based DSA Preparation Sheet
          </h1>
          <p className="text-sm sm:text-base text-[#526078]">
            Master core underlying patterns instead of memorizing 500+ random LeetCode questions. Tagged by frequency across Amazon, Google, Flipkart, and TCS.
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#DCE7F2] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-[#11183D] font-sans">
                Preparation Progress
              </h3>
              <p className="text-xs text-[#526078] mt-0.5">
                {solvedCount} of {totalCount} pattern problems mastered ({progressPercent}%)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/interview/coding/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#11183D] hover:bg-[#1E293B] text-white text-xs font-bold font-sans transition-all shadow-xs"
              >
                <Code2 className="w-4 h-4 text-[#4A8BDF]" />
                <span>Open Live Coding Sandbox</span>
              </Link>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#EFFAFD] h-3 rounded-full overflow-hidden border border-[#DCE7F2]">
            <div
              className="bg-gradient-to-r from-[#4A8BDF] to-[#2459A8] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E8B9B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems or company tags..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-[#DCE7F2] text-xs text-[#11183D] placeholder-[#7E8B9B] focus:outline-none focus:ring-1 focus:ring-[#4A8BDF]"
            />
          </div>

          <div className="flex items-center gap-2">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-[#11183D] text-white'
                    : 'bg-white text-[#526078] hover:bg-slate-100 border border-[#DCE7F2]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Groups */}
        <div className="space-y-6">
          {DSA_PATTERNS.map((group) => {
            const matchingProblems = group.problems.filter((p) => {
              const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
              const matchesSearch =
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.companyTags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
              return matchesDiff && matchesSearch;
            });

            if (matchingProblems.length === 0) return null;

            const groupSolved = matchingProblems.filter((p) => solvedProblemIds.includes(p.id)).length;

            return (
              <div
                key={group.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCE7F2] shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCE7F2]">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#11183D] font-sans">
                      {group.name}
                    </h3>
                    <p className="text-xs text-[#526078] mt-0.5">
                      {group.description}
                    </p>
                  </div>
                  <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-[#EFFAFD] text-[#4A8BDF] border border-[#4A8BDF]/20">
                    {groupSolved} / {matchingProblems.length} Done
                  </span>
                </div>

                {/* Problems Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#DCE7F2] text-[#7E8B9B] uppercase font-bold tracking-wider">
                        <th className="py-2.5 px-3 w-10 text-center">Status</th>
                        <th className="py-2.5 px-4">Problem Name</th>
                        <th className="py-2.5 px-4">Pattern</th>
                        <th className="py-2.5 px-4">Difficulty</th>
                        <th className="py-2.5 px-4">Company Tags</th>
                        <th className="py-2.5 px-4 text-right">Practice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCE7F2]">
                      {matchingProblems.map((p) => {
                        const isSolved = solvedProblemIds.includes(p.id);

                        return (
                          <tr key={p.id} className="hover:bg-[#EFFAFD]/30 transition-colors">
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => toggleSolved(p.id)}
                                className="cursor-pointer text-[#4A8BDF]"
                                title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                              >
                                {isSolved ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                                )}
                              </button>
                            </td>
                            <td className="py-3 px-4 font-bold text-[#11183D]">
                              <span className={isSolved ? 'line-through text-slate-400' : ''}>
                                {p.title}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-[#526078] font-medium">
                              {p.pattern}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  p.difficulty === 'Easy'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : p.difficulty === 'Medium'
                                    ? 'bg-blue-50 text-[#4A8BDF]'
                                    : 'bg-purple-50 text-purple-700'
                                }`}
                              >
                                {p.difficulty}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {p.companyTags.map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] font-medium text-[#7E8B9B] bg-slate-100 px-1.5 py-0.5 rounded"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Link
                                to={`/interview/coding/new?problem=${encodeURIComponent(p.title)}`}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-[#EFFAFD] border border-[#DCE7F2] text-[#4A8BDF] font-bold text-[11px] shadow-2xs transition-colors"
                              >
                                <Code2 className="w-3 h-3" />
                                <span>Code Room</span>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
